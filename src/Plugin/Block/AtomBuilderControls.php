<?php

namespace Drupal\atom_builder\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'AtomBuilderControls' block.
 *
 * @Block(
 *  id = "atom_builder_controls",
 *  admin_label = @Translation("Atom builder controls"),
 * )
 */
class AtomBuilderControls extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $render['form'] = \Drupal::formBuilder()->getForm('Drupal\atom_builder\Form\AtomBuilderControlsForm');
    return $render;
  }
}
