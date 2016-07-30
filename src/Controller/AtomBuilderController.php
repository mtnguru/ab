<?php

namespace Drupal\atom_builder\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Ajax\AddCommand;
use Drupal\atom_builder\Ajax\LoadYmlCommand;
use Drupal\atom_builder\Ajax\SaveYmlCommand;
use Drupal\Component\Serialization\Yaml;

/**
 * Class AtomBuilderController.
 *
 * @package Drupal\atom_builder\Controller
 */
class AtomBuilderController extends ControllerBase {

  public function loadYml() {
    $filename = $_POST['filename'];
    $component = $_POST['component'];

    $response = new AjaxResponse();
    $ymlContents = Yaml::decode(file_get_contents(drupal_get_path('module', 'atom_builder') . '/config/' . $component . '/' . $filename));
    $response->addCommand(new LoadYmlCommand($filename, $component, $ymlContents));

    return $response;
  }

  public function saveYml() {

    $filename = $_POST['filename'];
    $name = $_POST['name'];
    $component = $_POST['component'];
    $ymlContents = $_POST['ymlContents'];

    $response = new AjaxResponse();
    file_put_contents(drupal_get_path('module', 'atom_builder') . '/config/' . $component . '/' . $filename, Yaml::encode($ymlContents));
    $files = file_scan_directory(drupal_get_path('module','atom_builder') . '/config/' . $component, '/\.yml/');
    foreach ($files as $file) {
      $filelist[$file->filename] = $file->name;
    }
    $response->addCommand(new SaveYmlCommand($name, $filename, $component, $filelist ));

    return $response;
  }

}
