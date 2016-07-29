<?php

namespace Drupal\atom_builder\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Ajax\AddCommand;
use Drupal\atom_builder\Ajax\LoadStyleCommand;
use Drupal\Component\Serialization\Yaml;

/**
 * Class AtomBuilderController.
 *
 * @package Drupal\atom_builder\Controller
 */
class AtomBuilderController extends ControllerBase {

  /**
   * Atombuilder.
   *
   * @return string
   *   Return Hello string.
   */
  public function atomBuilder() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: atomBuilder')
    ];
  }

  public function loadStyle($styleFile) {
    $response = new AjaxResponse();
    $styleSet = Yaml::decode(file_get_contents(drupal_get_path('module', 'atom_builder') . '/config/styles/' . $styleFile));
    $response->addCommand(new LoadStyleCommand($styleSet));

    return $response;
  } 

}
