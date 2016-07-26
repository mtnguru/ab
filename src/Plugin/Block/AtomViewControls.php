<?php

namespace Drupal\atom_builder\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'AtomViewControls' block.
 *
 * @Block(
 *  id = "atom_view_controls",
 *  admin_label = @Translation("Atom view controls"),
 * )
 */
class AtomViewControls extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['proton_transparency'] = array(
      '#type' => 'range',
      '#title' => $this->t('Proton Transparency'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['proton_transparency']) ? $this->configuration['proton_transparency'] : '1',
      '#weight' => '0',
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['proton_transparency'] = $form_state->getValue('proton_transparency');
    $this->configuration['geometry_transparency'] = $form_state->getValue('geometry_transparency');
    $this->configuration['axis_transparency'] = $form_state->getValue('axis_transparency');
    $this->configuration['mouse_mode'] = $form_state->getValue('mouse_mode');
    $this->configuration['mouse_controls_enabled'] = $form_state->getValue('mouse_controls_enabled');
    $this->configuration['darn'] = $form_state->getValue('darn');
    $this->configuration['some_text_here'] = $form_state->getValue('some_text_here');
    $this->configuration['reset_transparency'] = $form_state->getValue('reset_transparency');
    $this->configuration['date_field'] = $form_state->getValue('date_field');
    $this->configuration['an_email_address'] = $form_state->getValue('an_email_address');
    $this->configuration['what_is_an_image_button'] = $form_state->getValue('what_is_an_image_button');
    $this->configuration['number_field'] = $form_state->getValue('number_field');
    $this->configuration['password_field'] = $form_state->getValue('password_field');
    $this->configuration['radio_buttons'] = $form_state->getValue('radio_buttons');
    $this->configuration['a_link_dude'] = $form_state->getValue('a_link_dude');
    $this->configuration['what_is_a_value'] = $form_state->getValue('what_is_a_value');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['atom_view_controls_proton_transparency']['#markup'] = '<p>' . $this->configuration['proton_transparency'] . '</p>';
    $build['atom_view_controls_geometry_transparency']['#markup'] = '<p>' . $this->configuration['geometry_transparency'] . '</p>';
    $build['atom_view_controls_axis_transparency']['#markup'] = '<p>' . $this->configuration['axis_transparency'] . '</p>';
    $build['atom_view_controls_mouse_mode']['#markup'] = '<p>' . $this->configuration['mouse_mode'] . '</p>';
    $build['atom_view_controls_mouse_controls_enabled']['#markup'] = '<p>' . $this->configuration['mouse_controls_enabled'] . '</p>';
    $build['atom_view_controls_darn']['#markup'] = '<p>' . $this->configuration['darn'] . '</p>';
    $build['atom_view_controls_some_text_here']['#markup'] = '<p>' . $this->configuration['some_text_here'] . '</p>';
    $build['atom_view_controls_reset_transparency']['#markup'] = '<p>' . $this->configuration['reset_transparency'] . '</p>';
    $build['atom_view_controls_date_field']['#markup'] = '<p>' . $this->configuration['date_field'] . '</p>';
    $build['atom_view_controls_an_email_address']['#markup'] = '<p>' . $this->configuration['an_email_address'] . '</p>';
    $build['atom_view_controls_what_is_an_image_button']['#markup'] = '<p>' . $this->configuration['what_is_an_image_button'] . '</p>';
    $build['atom_view_controls_number_field']['#markup'] = '<p>' . $this->configuration['number_field'] . '</p>';
    $build['atom_view_controls_password_field']['#markup'] = '<p>' . $this->configuration['password_field'] . '</p>';
    $build['atom_view_controls_radio_buttons']['#markup'] = '<p>' . $this->configuration['radio_buttons'] . '</p>';
    $build['atom_view_controls_a_link_dude']['#markup'] = '<p>' . $this->configuration['a_link_dude'] . '</p>';
    $build['atom_view_controls_what_is_a_value']['#markup'] = '<p>' . $this->configuration['what_is_a_value'] . '</p>';

    return $build;
  }

}
