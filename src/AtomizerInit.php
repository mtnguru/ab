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
      'sort' => 'element',
/*    'fields' => [
        'nfpc' => ['field_pte_column_value'],
        'nfpr' => ['field_pte_row_value'],
        'nfsc' => ['field_sam_column_value'],
        'nfsr' => ['field_sam_row_value'],
      ], */
    ]);
    $nids = array_keys($result['results']);
    $elements = entity_load_multiple('node', $nids);
    foreach ($elements as $nid => $element) {
      if ($element->field_default_atom->isEmpty()) {
        $anid = null;
      }
      else {
        $anid = $element->field_default_atom->target_id;
        $defaultAtom =  \Drupal\node\Entity\Node::load($anid);

        // If the default atom has been deleted then set to null
        if (!$defaultAtom) {
          $anid = NULL;
        }
      }

      $objects[$nid] = [
        'name'         => $element->getTitle(),
        'symbol'       => $element->field_symbol->value,
        'nid'          => $nid,
        'period'       => ($element->field_period->isEmpty())  ? null : $element->field_period->value,
        'defaultAtom'  => $anid,
        'group'        => ($element->field_pt->isEmpty())      ? null : $element->field_pt->value,
        'atomicNumber' => ($element->field_atomic_number->isEmpty()) ? 999  : $element->field_atomic_number->value,
        'pte_row'      => ($element->field_pte_row->isEmpty()) ? 0     : $element->field_pte_row->value,
        'pte_column'   => ($element->field_pte_column->isEmpty()) ? 0  : $element->field_pte_column->value,
        'sam_row'      => ($element->field_sam_row->isEmpty()) ? 0     : $element->field_sam_row->value,
        'sam_column'   => ($element->field_sam_column->isEmpty()) ? 0  : $element->field_sam_column->value,
        'valence'      => ($element->field_valence->isEmpty()) ? ''    : $element->field_valence->value,
        'numIsotopes'  => 0,
        'numIsobars'   => 0,
      ];
      //    }
    }
    return $objects;
  }

  static function queryMolecules() {
    $objects = [];
    $result = AzContentQuery::nodeQuery([
      'types' => 'molecule',
      'sort' => 'molecules',
    ]);
    $nids = array_keys($result['results']);
    $elements = entity_load_multiple('node', $nids);
    foreach ($elements as $nid => $element) {
      $objects[$nid] = [
        'name' => $element->getTitle(),
        'nid' => $nid,
      ];
    }
    return $objects;
  }

  static function queryAtoms($access) {
    $perm = ['public','stats'];
    if ($access == 'full') {
//    $perm[] = 'trusted';
      $perm[] = 'members';
      $perm[] = 'development';
    } else if ($access == 'permissions') {
      if (\Drupal::currentUser()->hasPermission('atomizer atoms development')) { $perm[] = 'development'; }
      if (\Drupal::currentUser()->hasPermission('atomizer atoms members'))     { $perm[] = 'members'; }
      if (\Drupal::currentUser()->hasPermission('atomizer atoms trusted'))     { $perm[] = 'trusted'; }
    }

    $result = AzContentQuery::nodeQuery([
      'type' => 'entity-table',
      'types' => 'atom',
      'sort' => 'select-atom',

      'fields' => [
        'nfd' => ['nid', 'title'],
        'nfan' => ['field_atomic_number_value'],
        'nfp' => ['field__protons_value'],
        'nfap' => ['field_approval_value'],
        'nfe' => ['field_element_target_id'],
        'nfm' => ['field_media_target_id'],
        'nfi' => ['field_image_target_id'],
        'nfab' => ['field_abundance_value'],
        'nfhl' => ['field_half_life_value'],
        'ttfd' => ['name'],  // Stability - taxonomy term name
      ],
      'more' => 'none',
//    'limit' => 5,
      'approval' => $perm,
    ]);

    return $result;
  }

  static function build_select_atom_list() {
    $elements = self::queryElements();
    $atoms = self::queryAtoms('permissions')['results'];

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
    foreach ($elements as $element) {
      $defaultAtom = null;

      if ($element['numIsotopes'] == 0) continue;
      $defaultAtomNid = (!empty($element['defaultAtom'])) ? $element['defaultAtom'] : $element['isotopes'][0]->nid;
      if ($defaultAtomNid) {
        if (empty($atoms[$defaultAtomNid])) {
          $defaultAtom = $atoms[$element['isotopes'][0]->nid];
        } else {
          $defaultAtom = $atoms[$defaultAtomNid];
        }
      }
      else {
        print "build_select_atom_list - defaultAtom error\n";
      }

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

    // Wrap in a container with a title, the select pte buttons, and list of elements.
    return [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['select-wrapper', 'az-hidden'],
        'id' => 'select-atom-wrapper',
      ],
      'title' => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['select-title'],
        ],
        'pte_enable' => ['#markup' => '<i data-layout="pte" id="#pte-enable" class="pte-enable fas fa-table"></i>'],
        'sam_enable' => ['#markup' => '<i data-layout="sam" id="#sam-enable" class="sam-enable fas fa-hat-wizard"></i>'],
        'title' => ['#markup' => '<h2>Select Atom</h2>'],
        'close' => [
          '#type' => 'container',
          '#attributes' => [
            'class' => ['fas fa-times az-close'],
          ],
        ],
      ],
      'search' => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['search-wrapper'],
        ],
        'search_field' => [
          '#type' => 'textfield',

        ],
      ],
      'element_list_wrapper' => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['select-list-wrapper'],
        ],
        'element_list' => [
          '#type' => 'container',
          '#attributes' => [
            'class' => ['select-list'],
            'id' => 'select-atom-list',
          ],
//        'elements' => $list,
        ],
      ],
    ];
  }

  static function build_select_molecule_list() {
    $molecules = self::queryMolecules();

    // Create render array of elements and their isotopes.
    $list = [];
    foreach ($molecules as $molecule) {
      $list[$molecule['name']] = [
        '#type' => 'theme',
        '#theme' => 'atomizer_select_molecule',
        '#title' => $molecule['name'],
        '#molecule_nid' => $molecule['nid'],
      ];
    }

    // Wrap in a container with a title, the select atom button, and list of elements.
    return [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['select-wrapper'],
        'id' => 'select-molecule-wrapper',
      ],
      'title' => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['select-title'],
        ],
        'title' => ['#markup' => '<h2>Select molecule</h2>'],
        'close' => [
          '#type' => 'container',
          '#attributes' => [
            'class' => ['fas fa-times az-close'],
          ],
        ],
      ],
      'molecule_list' => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['select-list'],
          'id' => 'select-molecule-list',
        ],
        'molecules' => $list,
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
        drupal_get_path('module', 'atomizer') . '/config/producers/' . $config['atomizerFile']
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
    if ($atomizer_config['atomizerClass'] == 'pte') {
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
    if (!empty($atomizer_config['select'])) {
      if ($atomizer_config['select'] == 'select_atom') {
        $build['content']['select_atom'] = self::build_select_atom_list();
      }
      if ($atomizer_config['select'] == 'select_molecule') {
        $build['content']['select_atom'] = self::build_select_atom_list();
        $build['content']['select_molecule'] = self::build_select_molecule_list();
      }
    }

    // Build atomizer container with canvas - attach drupalSettings
    $build['content']['atomizer'] = [
      $atomizer_config['atomizerId'] => [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['az-canvas-wrapper', $config['atomizerId'] . '-container'],
        ],
        'canvas' => [
          '#markup' => '<canvas class="az-canvas"></canvas>',
          '#allowed_tags' => array_merge(Xss::getHtmlTagList(), ['canvas'])
        ],
        'labels' => [
          '#markup' => '<div class="az-canvas-labels">Title Overlay</div>',
        ],
        'copyright' => [
          '#markup' => '<div title="Copyright 2020 by Ethereal Matters, LLC" class="az-fa-copyright copyright"></div>'
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

    /* This has been deprecated.  These values are now hardcoded into the JavaScript in directors/dir_atom.js
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
    } */

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
      $host = \Drupal::service('request_stack')->getCurrentRequest()->server->get('SERVER_NAME');
      $perm = \Drupal::currentUser()->hasPermission('atomizer load raw js2');
      $server = \Drupal::service('request_stack')->getCurrentRequest()->server->get('SERVER_NAME');
      if ($server == 'az' || $server == 's.a' || \Drupal::currentUser()->hasPermission('atomizer load raw js')) {
        if (!empty($atomizer_config['librariesDev'])) {
          $build['#attached']['library'] = $atomizer_config['librariesDev'];
//        $build['#attached']['library'] = $atomizer_config['libraries'];
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

