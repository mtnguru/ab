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
  public function blockForm($form, FormStateInterface $form_state) {
    $form['a_slider'] = array(
      '#type' => 'range',
      '#title' => $this->t('A slider'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['a_slider']) ? $this->configuration['a_slider'] : '',
      '#weight' => '0',
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['a_slider'] = $form_state->getValue('a_slider');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['atom_builder_controls_a_slider']['#markup'] = '<p>' . $this->configuration['a_slider'] . '</p>';

    return $build;
  }

}
