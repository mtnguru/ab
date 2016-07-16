<?php

namespace Drupal\atom_builder\Controller;

use Drupal\Core\Controller\ControllerBase;

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

}
