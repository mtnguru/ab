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
    $filename = $_POST['filename'];
    $component = $_POST['component'];
    $directory = $_POST['directory'];

    $response = new AjaxResponse();
    $ymlContents = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . $directory . '/' . $filename));
    $response->addCommand(new LoadYmlCommand($directory, $filename, $component, $ymlContents));

    return $response;
  }

  public function saveYml() {

    $filename = $_POST['filename'];
    $directory = $_POST['directory'];
    $name = $_POST['name'];
    $component = $_POST['component'];
    $ymlContents = $_POST['ymlContents'];

    $response = new AjaxResponse();
    file_put_contents(drupal_get_path('module', 'atomizer') . $directory . '/' . $filename, Yaml::encode($ymlContents));
    $files = file_scan_directory(drupal_get_path('module','atomizer') . $directory, '/\.yml/');
    foreach ($files as $file) {
      $filelist[$file->filename] = $file->name;
    }
    $response->addCommand(new SaveYmlCommand($name, $directory, $filename, $component, $filelist ));

    return $response;
  }

}
