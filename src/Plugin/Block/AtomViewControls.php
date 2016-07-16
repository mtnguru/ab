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
    $form['geometry_transparency'] = array(
      '#type' => 'range',
      '#title' => $this->t('Geometry Transparency'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['geometry_transparency']) ? $this->configuration['geometry_transparency'] : '.3',
      '#weight' => '0',
    );
    $form['axis_transparency'] = array(
      '#type' => 'range',
      '#title' => $this->t('Axis Transparency'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['axis_transparency']) ? $this->configuration['axis_transparency'] : '.2',
      '#weight' => '0',
    );
    $form['mouse_mode'] = array(
      '#type' => 'radios',
      '#title' => $this->t('Mouse mode'),
      '#description' => $this->t('Select the mode for the mouse and thumbwheel'),
      '#options' => array('Move Camera' => $this->t('Move Camera'), 'Move Atom' => $this->t('Move Atom'), 'Attach Nuclets' => $this->t('Attach Nuclets')),
      '#default_value' => isset($this->configuration['mouse_mode']) ? $this->configuration['mouse_mode'] : 'Move Camera',
      '#weight' => '0',
    );
    $form['mouse_controls_enabled'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Mouse Controls Enabled'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['mouse_controls_enabled']) ? $this->configuration['mouse_controls_enabled'] : 'on',
      '#weight' => '0',
    );
    $form['darn'] = array(
      '#type' => 'checkboxes',
      '#title' => $this->t('darn'),
      '#description' => $this->t('bogus'),
      '#options' => array('five' => $this->t('five'), 'six' => $this->t('six'), 'lucky eight' => $this->t('lucky eight')),
      '#default_value' => isset($this->configuration['darn']) ? $this->configuration['darn'] : 'Array',
      '#weight' => '0',
    );
    $form['some_text_here'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Some text here'),
      '#description' => $this->t('Some text goes here'),
      '#default_value' => isset($this->configuration['some_text_here']) ? $this->configuration['some_text_here'] : '420',
      '#maxlength' => 64,
      '#size' => 32,
      '#weight' => '0',
    );
    $form['reset_transparency'] = array(
      '#type' => 'button',
      '#title' => $this->t('Reset transparency'),
      '#description' => $this->t('Reset transparency to default values'),
      '#default_value' => isset($this->configuration['reset_transparency']) ? $this->configuration['reset_transparency'] : '',
      '#weight' => '0',
    );
    $form['date_field'] = array(
      '#type' => 'date',
      '#title' => $this->t('Date field'),
      '#description' => $this->t('A date field'),
      '#default_value' => isset($this->configuration['date_field']) ? $this->configuration['date_field'] : 'now',
      '#weight' => '0',
    );
    $form['an_email_address'] = array(
      '#type' => 'email',
      '#title' => $this->t('An email address'),
      '#description' => $this->t('adf'),
      '#default_value' => isset($this->configuration['an_email_address']) ? $this->configuration['an_email_address'] : '',
      '#weight' => '0',
    );
    $form['what_is_an_image_button'] = array(
      '#type' => 'image_button',
      '#title' => $this->t('what is an image button'),
      '#description' => $this->t('this is'),
      '#default_value' => isset($this->configuration['what_is_an_image_button']) ? $this->configuration['what_is_an_image_button'] : '',
      '#weight' => '0',
    );
    $form['number_field'] = array(
      '#type' => 'number',
      '#title' => $this->t('number field'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['number_field']) ? $this->configuration['number_field'] : '',
      '#weight' => '0',
    );
    $form['password_field'] = array(
      '#type' => 'password',
      '#title' => $this->t('password field'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['password_field']) ? $this->configuration['password_field'] : '',
      '#maxlength' => 32,
      '#size' => 32,
      '#weight' => '0',
    );
    $form['radio_buttons'] = array(
      '#type' => 'radio',
      '#title' => $this->t('radio buttons'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['radio_buttons']) ? $this->configuration['radio_buttons'] : '',
      '#weight' => '0',
    );
    $form['a_link_dude'] = array(
      '#type' => 'url',
      '#title' => $this->t('a link dude'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['a_link_dude']) ? $this->configuration['a_link_dude'] : '',
      '#weight' => '0',
    );
    $form['what_is_a_value'] = array(
      '#type' => 'value',
      '#title' => $this->t('what is a value'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['what_is_a_value']) ? $this->configuration['what_is_a_value'] : '',
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
