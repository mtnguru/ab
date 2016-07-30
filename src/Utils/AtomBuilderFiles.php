<?php

namespace Drupal\atom_builder\Utils;

use Drupal\Component\Serialization\Yaml;

/**
 * Class AtomBuilderFiles.
 *
 * @package Drupal\atom_builder\Utils
 */
class AtomBuilderFiles {
  static public function createFileList($directory) {
    $files = file_scan_directory($directory, '/\.yml$/');
    foreach ($files as $file) {
      $ymlContents = Yaml::decode(file_get_contents($directory . '/' . $file->filename));
      $filelist[$file->filename] = $ymlContents['name'];
    }
    asort($filelist);
    return $filelist;
  }
}

