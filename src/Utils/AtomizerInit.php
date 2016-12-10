<?php

namespace Drupal\atomizer\Utils;

use Drupal\Component\Serialization\Yaml;

/**
 * Class AtomizerFiles.
 *
 * @package Drupal\atomizer\Utils
 */
class AtomizerInit {
  static $js_loaded = false;

  static public function start($config) {
    // Read in the config/atomizer file
    $atomizer = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/atomizers/' . $config['atomizer_file']));
    $atomizer['filename']   = $config['atomizer_file'];
    $atomizer['atomizerId'] = $config['atomizer_id'];
    $atomizer['id'] = $id = strtolower(str_replace(['_', ' '], '-', $config['atomizer_id']));
    if (!empty($config['nid'])) {
      $atomizer['nid'] = $config['nid'];
    }

//  Read in the objects
    $objects = [];
    if (!empty($atomizer['objects'])) {
      foreach ($atomizer['objects'] as $object) {
        $files = file_scan_directory(drupal_get_path('module','atomizer') . '/config/objects/' . $object, '/\.yml/');
        foreach ($files as $file) {
          $objects[str_replace('nuclet_', '', $file->name)] = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/objects/' . $object . '/' . $file->filename));
        }
      }
    }

    $build = array(
      'atomizer' => array(
        $config['atomizer_id'] => array(
          'wrapper' => array(
            'scene' => array('#markup' => '<div id="' . $id . '-wrapper"></div>'),
          ),
        ),
        '#attached' => array(
          'drupalSettings' => array(
            'atomizer' => array(
              $config['atomizer_id'] => $atomizer,
            ),
            'atomizer_config' => array(
              'objects' => $objects,
            ),
          ),
        ),
      ),
    );
    if (!empty($atomizer['libraries'])) {
      $build['atomizer']['#attached']['library'] = $atomizer['libraries'];
    }
    return $build;
  }
}

