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
    $abid = 'ab-viewer-element-carbon';
    $build['atom_builder'] = array(
      '#attached' => array( 'library' => array('atom_builder/atom-builder-js')),
      'wrapper' => array(
        'title' => array('#markup' => 'The Atom Viewer is cool'),
        'stats' => array('#markup' => "<div id='Stats-output'></div>"),
        'scene' => array('#markup' => "<div id='atom-builder-wrapper'></div>"),
      ),
    );
    return $build;
  }

}
