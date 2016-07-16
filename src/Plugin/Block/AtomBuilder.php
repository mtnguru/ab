<?php

namespace Drupal\atom_builder\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'AtomBuilder' block.
 *
 * @Block(
 *  id = "atom_builder",
 *  admin_label = @Translation("Atom builder"),
 * )
 */
class AtomBuilder extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['atom_builder']['#markup'] = 'Implement AtomBuilder.';

    return $build;
  }

}
