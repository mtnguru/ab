<?php

namespace Drupal\atom_builder\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'AtomBuilder' block.
 *
 * @Block(
 *  id = "atom_builder_viewer",
 *  admin_label = @Translation("Atom builder viewer"),
 * )
 */
class AtomBuilderViewer extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['atom_builder'] = array(
//    '#attached' => array( 'library' => array('atom_builder/atom-builder-js')),
      'wrapper' => array(
        'scene' => array('#markup' => "<div id='atom-builder-wrapper'></div>"),
      ),
    );
    return $build;
  }

}
