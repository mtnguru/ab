<?php

namespace Drupal\atom_builder\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'AtomBuilder' block.
 *
 * @Block(
 *  id = "atom_builder_viewer",
 *  admin_label = @Translation("Atom builder viewer"),
 * )
 */
class AtomBuilderViewer extends BlockBase {

  public function blockForm($form, FormStateInterface $form_state) {

    // Give the viewer a name so the controls block can connect to it.
    $form['viewer_name'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Viewer Name'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['viewer_name']) ? $this->configuration['viewer_name'] : 'Atom Builder',
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['viewer_name'] = $form_state->getValue('viewer_name');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();
    $build = array(
      'atom_builder' => array(
        'wrapper' => array(
          'scene' => array('#markup' => "<div id='atom-builder-wrapper'></div>"),
        ),
      ),
    );
    return $build;
  }

}
