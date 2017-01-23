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
  static $js_loaded = false;

  static public function start($config) {
    // Read in the config/atomizer file
    $atomizer = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/atomizers/' . $config['atomizer_file']));
    $atomizer['filename']   = $config['atomizer_file'];
    $atomizer['atomizerId'] = $config['atomizer_id'];
    $atomizer['id'] = strtolower(str_replace(['_', ' '], '-', $config['atomizer_id']));
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

    $class = (empty($config['atomizer_class'])) ? '' : $config['atomizer_class'];
    $build = array(
      'atomizer' => array(
        $config['atomizer_id'] => array(
          '#type' => 'container',
          '#attributes' => array(
            'class' => array('az-canvas-wrapper', $class),
            'id' => $atomizer['id'] . '-canvas-wrapper',
          ),
          'canvas' => array(
            '#markup' => '<canvas id="' . $atomizer['id'] .'" class="az-canvas"></canvas>',
            '#allowed_tags' => array_merge(Xss::getHtmlTagList(), ['canvas'])
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

