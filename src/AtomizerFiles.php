<?php

namespace Drupal\atomizer;

use Drupal\Component\Serialization\Yaml;

/**
 * Class AtomizerFiles.
 *
 * @package Drupal\atomizer
 */
class AtomizerFiles {
  static public function createFileList($directory) {
    $files = \Drupal::service('file_system')->scanDirectory($directory, '/\.yml$/');
    foreach ($files as $file) {
      $ymlContents = Yaml::decode(file_get_contents($directory . '/' . $file->filename));
      $filelist[$file->filename] = $ymlContents['name'];
    }
    asort($filelist);
    return $filelist;
  }
}

