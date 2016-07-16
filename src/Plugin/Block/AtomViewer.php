<?php

namespace Drupal\atom_builder\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'AtomViewer' block.
 *
 * @Block(
 *  id = "atom_viewer",
 *  admin_label = @Translation("Atom viewer"),
 * )
 */
class AtomViewer extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $abid = 'ab-viewer-element-carbon';
    $build['atom_viewer']['#markup'] = "<div id='$abid'></div>";
    return $build;
  }

}
