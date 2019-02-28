<?php

namespace Drupal\atomizer;

use Drupal\az_content\AzContentQuery;
use Drupal\Component\Serialization\Yaml;
use Drupal\Component\Utility\Xss;
use Drupal\node\Entity\Node;

/**
 * Class AtomizerFiles.
 *
 * @package Drupal\atomizer
 */
class AtomizerInit {
  public static $idNum = 0;

  static function queryElements() {
    $objects = [];
    $result = AzContentQuery::nodeQuery([
      'types' => 'element',
      'sort' => 'elements',
    ]);
    $nids = array_keys($result['results']);
    $elements = entity_load_multiple('node', $nids);
    foreach ($elements as $nid => $element) {
//    if (!$element->get('field_pt')->isEmpty() && !$element->get('field_period')->isEmpty()) {
        $objects[$nid] = [
          'name' => $element->getTitle(),
          'symbol' => $element->field_symbol->value,
          'nid' => $nid,
          'period' =>      ($element->field_period->isEmpty())        ? null : $element->field_period->value,
          'defaultAtom' => ($element->field_default_atom->isEmpty())  ? null : $element->field_default_atom->entity->id(),
          'group' =>       ($element->field_pt->isEmpty())            ? null : $element->field_pt->value,
          'atomicNumber' =>($element->field_atomic_number->isEmpty()) ? 999  : $element->field_atomic_number->value,
          'numIsotopes' => 0,
          'numIsobars' => 0,
        ];
//    }
    }
    return $objects;
  }

  static function queryAtoms() {
    $perm = ['public'];
    if (\Drupal::currentUser()->hasPermission('atomizer atoms development')) { $perm[] = 'development'; }
    if (\Drupal::currentUser()->hasPermission('atomizer atoms members'))     { $perm[] = 'members'; }
    if (\Drupal::currentUser()->hasPermission('atomizer atoms trusted'))     { $perm[] = 'trusted'; }

    $result = AzContentQuery::nodeQuery([
      'type' => 'entity-table',
      'sort' => 'select-atom',
      'fields' => [
        'nfd' => ['nid', 'title'],
        'nfan' => ['field_atomic_number_value'],
        'nfp' => ['field__protons_value'],
        'nfe' => ['field_element_target_id'],
        'ttfd' => ['name'],
      ],
      'more' => 'none',
      'types' => 'atom',
      'approval' => $perm,
    ]);

    return $result;
  }

  static function build_select_atom_list() {
    $elements = self::queryElements();
    $atoms = self::queryAtoms()['results'];

    // Go through each atom and count number of atoms per element
    $isobars = [];
    foreach ($atoms as $atom) {
      $eid = $atom->field_element_target_id;
      if (!empty($elements[$eid])) {
        $elements[$eid]['isotopes'][] = $atom;
        $isobars[$atom->field__protons_value][] = $atom;
        if (empty($elements[$eid]['numIsotopes'])) {
          $elements[$eid]['numIsotopes'] = 1;
        } else {
          $elements[$eid]['numIsotopes']++;
        }
      }
    }

    foreach ($atoms as $atom) {
      $atom->isobars = $isobars[$atom->field__protons_value];
    }

    // Create render array of elements and their isotopes.
    $list = [];
    $defaultAtom = null;
    foreach ($elements as $element) {
      if ($element['numIsotopes'] == 0) continue;
      $defaultAtomNid = (!empty($element['defaultAtom'])) ? $element['defaultAtom'] : $element['isotopes'][0]->nid;
      $defaultAtom = $atoms[$defaultAtomNid];

      $list[$element['name']] = [
        '#type' => 'theme',
        '#symbol' => $element['symbol'],
        '#theme' => 'atomizer_select_atom',
        '#title' => $defaultAtom->title,
        '#element_nid' => $element['nid'],
        '#default_atom_nid' => $defaultAtomNid,
        '#stability' => (!empty($defaultAtom->name)) ? $defaultAtom->name : 'Not Set',
        '#atomic_number' => $element['atomicNumber'],
        '#num_isotopes' => $element['numIsotopes'],
        '#num_isobars' => $element['numIsobars'],
        '#isotopes' => ($element['numIsotopes']) ? $element['isotopes'] : null,
        '#isobars' => $isobars,
      ];
    }

    // Wrap in a container with a title, the select atom button, and list of elements.
    return [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['az-elements-wrapper'],
        'id' => 'az-select-atom',
      ],
      'title' => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['az-select-atom-title'],
        ],
        'title' => ['#markup' => '<h2>Select Atom</h2>'],
        'close' => [
          '#type' => 'container',
          '#attributes' => [
            'class' => ['az-fa-times az-close'],
          ],
        ],
      ],
      'element_list' => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['element-list'],
        ],
        'elements' => $list,
      ],
    ];
  }

  static function build($config) {
//  $atomizerId = $config['atomizerId'] = str_replace(['_', ' '], '-', strtolower($config['atomizerId'])) . '--' . self::$idNum;
    $atomizerId = str_replace(['_', ' '], '-', strtolower($config['atomizerId'])) . '--' . self::$idNum;
    self::$idNum++;
// Read in the config/atomizer file
    if (empty($config['atomizer_configuration'])) {
      $atomizer_config = Yaml::decode(file_get_contents(
        drupal_get_path('module', 'atomizer') . '/config/atomizers/' . $config['atomizerFile']
      ));
      $atomizer_config['filename']   = $config['atomizerFile'];
      $atomizer_config['atomizerId'] = $atomizerId;
      $atomizer_config['atomizerClass'] = $config['atomizerId'];
      if (!empty($config['nid'])) {
        $atomizer_config['nid'] = $config['nid'];
      }
    } else { // When displaying an atomizer node override block settings,
             // read configuration from atomizer_config file - Set in atomizer_preprocess_node()
      $atomizer_config = $config['atomizer_configuration'];
    }

//  Read in the objects - nuclets for Atom Builder/Viewer - solids for Platonic Solids Viewer
    $objects = [];
    if (!empty($atomizer_config)) {
      if (!empty($atomizer_config['objects'])) {
        foreach ($atomizer_config['objects'] as $object) {
          $files = file_scan_directory(drupal_get_path('module', 'atomizer') . '/config/objects/' . $object, '/\.yml/');
          foreach ($files as $file) {
            $objects[str_replace('nuclet_', '', $file->name)] = Yaml::decode(
              file_get_contents(drupal_get_path('module', 'atomizer') . '/config/objects/' . $object . '/' . $file->filename)
            );
          }
        }
      }
    }

    // The objects for the periodic table is an array of elements
    if ($atomizer_config['atomizerClass'] == 'ptable') {
      $objects = self::queryElements();
    }

    $build = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['az-wrapper'],
        'tabindex' => 1,
      ],
      '#cache' => [
        'max-age' => 0,
      ],
      'content' => [
        '#type' => 'container',
        '#attributes' => [
          'id' => 'azid-' . $atomizerId,
          'class' => ['az-atomizer-wrapper'],
        ],
      ],
    ];

    // Build the Header region - used for mobile only?

    $build['content']['header'] = [
      '#type' => 'container',
      '#attributes' => ['class' => ['az-header']],
      'sceneName' => [
        '#type' => 'container',
        '#attributes' => ['class' => ['az-scene-name']],
      ],
      'selectAtom' => [
        '#type' => 'button',
        '#value' => 'Select Atom',
        '#attributes' => ['id' => 'atom-select-enable'],
      ],
    ];

    // Build the select-atom dialog.
    if (!empty($atomizer_config['select']) && $atomizer_config['select'] == 'select_atom') {
      $build['content']['select_atom'] = self::build_select_atom_list();
    }

    // Build atomizer container with canvas - attach drupalSettings
    $build['content']['atomizer'] = [
      $atomizer_config['atomizerId'] => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['az-canvas-wrapper', $config['atomizerId'] . '-canvas-wrapper'],
        ],
        'canvas' => [
          '#markup' => '<canvas class="az-canvas"></canvas>',
          '#allowed_tags' => array_merge(Xss::getHtmlTagList(), ['canvas'])
        ],
        'labels' => [
          '#markup' => '<div class="az-canvas-labels">shit faced</div>',
        ],
        'copyright' => [
          '#markup' => '<div title="Copyright 2018 by Ethereal Matters, LLC" class="az-fa-copyright copyright"></div>'
        ],
      ],
      '#attached' => [
        'drupalSettings' => [
          'atomizer' => [
            $atomizerId => $atomizer_config,
          ],
          'atomizer_config' => [
            'objects' => $objects,
          ],
        ],
      ],
    ];

    // Load Binding Energies for the nuclets
    if (isset($atomizer_config['bindingEnergies'])) {
      $node = Node::load($atomizer_config['bindingEnergies']);
      $fields = $node->getFields();
      $bindingEnergies = [];
      foreach ($fields as $name => $field) {
        if (strstr($name, 'field_')) {
          $bindingEnergies[str_replace('field_', '', $name)] = $node->{$name}->value;
        }
      }
      $build['content']['atomizer']['#attached']['drupalSettings']['atomizer_bindingEnergies'] = $bindingEnergies;
    }

    // Build the controls
    if (isset($config['controlFile'])) {
      $controlFile = $config['controlFile'];
    } else if (isset($config['controlFile'])) {
      $controlFile = $atomizer_config['controlFile'];
    }
    if (isset($controlFile)) {
      $controlSet = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/controls/' . $controlFile));
      $controlSet['filename'] = $controlFile;

      // Create the controls form
      $controls['form'] = \Drupal::formBuilder()
        ->getForm('Drupal\atomizer\Form\AtomizerControlsForm', $controlSet);
      $controls['form']['#attributes'] = [
        'class' => [
          'az-controls-form',
          str_replace(['_', '.'], '-', $atomizer_config['controlFile']),
        ]
      ];
      $controls['form']['#attached'] = [
        'drupalSettings' => [
          'atomizer' => [
            $atomizerId => [
              'atomizerId' => $atomizerId,
              'controlSet' => $controlSet,
              'theme' => $controls['form']['#az-theme'],
            ],
          ],
        ],
      ];

      $build['content']['controls'] = [
        '#type' => 'container',
//      '#weight' => -10,
        '#attributes' => ['class' => ['az-controls-wrapper']],
        'controls' => $controls,
      ];

    }

    if (!empty($atomizer_config['classes'])) {
      foreach ($atomizer_config['classes'] as $class) {
        $build['content']['#attributes']['class'][] = $class;
      }
    }

    // Attach the atomizer js libraries if we haven't already done it.
    $js_loaded = &drupal_static('atomizer_js_loaded', false);
    if (!$js_loaded) {
//    $js_loaded = true;
      // Load raw JavaScript files if on host az or user has permission.
      if ('az1' == \Drupal::service('request_stack')->getCurrentRequest()->server->get('SERVER_NAME') ||
        \Drupal::currentUser()->hasPermission('atomizer load raw js')) {
        if (!empty($atomizer_config['librariesDev'])) {
          $build['#attached']['library'] = $atomizer_config['librariesDev'];
        } else {
          if (!empty($atomizer_config['libraries'])) {
            $build['#attached']['library'] = $atomizer_config['libraries'];
          }
        }
      }
      else { // else load the obfuscated JavaScript files
        if (!empty($atomizer_config['libraries'])) {
          $build['#attached']['library'] = $atomizer_config['libraries'];
        }
      }
    }

    return $build;
  }
}

