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

  public function blockForm($form, FormStateInterface $form_state) {

    // Give the viewer a name so the controls block can connect to it.
    $form['viewer_name'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Viewer Name'),
      '#description' => $this->t('Use the same name assigned the Atom Builder block'),
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
    // Pass in the configuration to the formBuilder or getForm so they can be attached.
    $render['form'] = \Drupal::formBuilder()->getForm('Drupal\atom_builder\Form\AtomBuilderControlsForm');
    return $render;
  }
}
