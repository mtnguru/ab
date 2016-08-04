<?php

namespace Drupal\atomizer\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Ajax\AddCommand;
use Drupal\atomizer\Ajax\LoadYmlCommand;
use Drupal\atomizer\Ajax\SaveYmlCommand;
use Drupal\Component\Serialization\Yaml;

/**
 * Class AtomizerController.
 *
 * @package Drupal\atomizer\Controller
 */
class AtomizerController extends ControllerBase {

  public function loadYml() {
    $filepath  = $_POST['filepath'];
    $component = $_POST['component'];

    $response = new AjaxResponse();
    $ymlContents = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/' . $filepath));
    $response->addCommand(new LoadYmlCommand($filepath, $component, $ymlContents));

    return $response;
  }

  public function saveYml() {

    $filepath =    $_POST['filepath'];
    $component =   $_POST['component'];
    $name =        $_POST['name'];
    $ymlContents = $_POST['ymlContents'];

    $response = new AjaxResponse();
    file_put_contents(drupal_get_path('module', 'atomizer') . '/' . $filepath, Yaml::encode($ymlContents));
//  $response  // respond with success or something.

    return $response;
  }

  public function listDirectory() {
    $directory = $_POST['directory'];
    $component = $_POST['component'];
    $files = file_scan_directory(drupal_get_path('module', 'atomizer') . '/' . $directory, '/\.yml/');
    foreach ($files as $file) {
      $filelist[$file->filename] = $file->name;
    }
    $response = new AjaxResponse();
    $response->addCommand(new ListDirectoryCommand($directory, $component, $filelist));
    return $response;
  }
}
