<?php

namespace Drupal\atomizer\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Ajax\AddCommand;
use Drupal\atomizer\Ajax\LoadYmlCommand;
use Drupal\atomizer\Ajax\SaveYmlCommand;
use Drupal\Component\Serialization\Yaml;
// use Symfony\Component\Yaml\Yaml;

/**
 * Class AtomizerController.
 *
 * @package Drupal\atomizer\Controller
 */
class AtomizerController extends ControllerBase {

  public function loadYml() {
    $data = json_decode(file_get_contents("php://input"), true);

    $response = new AjaxResponse();
    $ymlContents = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/' . $data['filepath']));
    $response->addCommand(new LoadYmlCommand($data, $ymlContents));

    return $response;
  }

  public function saveYml() {
    $data = json_decode(file_get_contents("php://input"), true);

    $response = new AjaxResponse();
    file_put_contents(drupal_get_path('module', 'atomizer') . '/' . $data['filepath'], Yaml::encode($data['ymlContents']));

    return $response;
  }

  public function listDirectory() {
    $data = json_decode(file_get_contents("php://input"), true);

    $files = file_scan_directory(drupal_get_path('module', 'atomizer') . '/' . $data['directory'], '/\.yml/');
    foreach ($files as $file) {
      $filelist[$file->filename] = $file->name;
    }
    $response = new AjaxResponse();
    $response->addCommand(new ListDirectoryCommand($data, $filelist));
    return $response;
  }
}
