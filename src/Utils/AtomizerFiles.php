<?php

namespace Drupal\atomizer\Utils;

use Drupal\Component\Serialization\Yaml;

/**
 * Class AtomizerFiles.
 *
 * @package Drupal\atomizer\Utils
 */
class AtomizerFiles {
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

