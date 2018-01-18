<?php

namespace Drupal\atomizer;

use Drupal\Component\Serialization\Yaml;
use Drupal\Component\Utility\Xss;

/**
 * Class AtomizerFiles.
 *
 * @package Drupal\atomizer
 */
class AtomizerInit {


  static public function start($config) {
    // Read in the config/atomizer file
    if (empty($config['atomizer_configuration'])) {
      $atomizer_config = Yaml::decode(file_get_contents(
        drupal_get_path('module', 'atomizer') . '/config/atomizers/' . $config['atomizer_file']
      ));
      $atomizer_config['filename']   = $config['atomizer_file'];
      $atomizer_config['atomizerId'] = strtolower(str_replace(['_', ' '], '-', $config['atomizer_id']));
      if (!empty($config['nid'])) {
        $atomizer_config['nid'] = $config['nid'];
      }
    } else { // When displaying an atomizer node override block settings,
             // read configuration from atomizer_config file - Set in atomizer_preprocess_node()
      $atomizer_config = $config['atomizer_configuration'];
    }

//  Read in the objects - nuclets for Atom Builder/Viewer - solids for Platonic Solids Viewer
    $objects = [];
    if (!empty($atomizer_config['objects'])) {
      foreach ($atomizer_config['objects'] as $object) {
        $files = file_scan_directory(drupal_get_path('module','atomizer') . '/config/objects/' . $object, '/\.yml/');
        foreach ($files as $file) {
          $objects[str_replace('nuclet_', '', $file->name)] = Yaml::decode(file_get_contents(
            drupal_get_path('module', 'atomizer') . '/config/objects/' . $object . '/' . $file->filename
          ));
        }
      }
    }

    $build = array(
      'atomizer' => array(
        $atomizer_config['atomizerId'] => array(
          '#type' => 'container',
          '#attributes' => array(
            'class' => array('az-canvas-wrapper'),
            'id' => $atomizer_config['atomizerId'] . '-canvas-wrapper'
          ),
          'canvas' => array(
            '#markup' => '<canvas class="az-canvas"></canvas>',
            '#allowed_tags' => array_merge(Xss::getHtmlTagList(), ['canvas'])
          ),
        ),
        '#attached' => array(
          'drupalSettings' => array(
            'atomizer' => array(
              $atomizer_config['atomizerId'] => $atomizer_config,
            ),
            'atomizer_config' => array(
              'objects' => $objects,
            ),
          ),
        ),
      ),
    );

    $js_loaded = drupal_static('atomizer_js_loaded', false);
    if (!$js_loaded) {
      // Load raw JavaScript files if on host az or user has permission.
      if ('az' == \Drupal::service('request_stack')
          ->getCurrentRequest()->server->get('SERVER_NAME') ||
        \Drupal::currentUser()->hasPermission('atomizer load raw js')
      ) {
        if (!empty($atomizer_config['librariesDev'])) {
          $build['atomizer']['#attached']['library'] = $atomizer_config['librariesDev'];
        }
      }
      else { // else load the obfuscated JavaScript files
        if (!empty($atomizer_config['libraries'])) {
          $build['atomizer']['#attached']['library'] = $atomizer_config['libraries'];
        }
      }
    }
    return $build;
  }
}

