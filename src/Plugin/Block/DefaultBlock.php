<?php

namespace Drupal\atom_builder\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'DefaultBlock' block.
 *
 * @Block(
 *  id = "default_block",
 *  admin_label = @Translation("Default block"),
 * )
 */
class DefaultBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['element_name'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Element name'),
      '#description' => $this->t('Name of an element'),
      '#default_value' => isset($this->configuration['element_name']) ? $this->configuration['element_name'] : 'Oxygen',
      '#maxlength' => 32,
      '#size' => 32,
      '#weight' => '0',
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['element_name'] = $form_state->getValue('element_name');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['default_block_element_name']['#markup'] = '<p>' . $this->configuration['element_name'] . '</p>';

    return $build;
  }

}
