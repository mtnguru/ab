<?php

namespace Drupal\atomizer\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Serialization\Yaml;

/**
 * Provides a 'AtomizerControls' block.
 *
 * @Block(
 *  id = "atomizer_controls",
 *  admin_label = @Translation("Atomizer controls"),
 * )
 */
class AtomizerControls extends BlockBase {

  public function blockForm($form, FormStateInterface $form_state) {

    // Give the viewer a name so the controls block can connect to it.
    $form['atomizer_id'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Atomizer ID'),
      '#description' => $this->t('Enter the same name as that given the Atomizer Viewer block'),
      '#default_value' => isset($this->configuration['atomizer_id']) ? $this->configuration['atomizer_id'] : 'Atomizer',
    );

    $control_files = file_scan_directory(drupal_get_path('module','atomizer') . '/config/controls', '/\.yml/');
    foreach ($control_files as $file) {
      $control_options[$file->filename] = $file->name;
    }
    $form['control_file'] = array(
      '#type' => 'select',
      '#title' => $this->t('Control Set file'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['control_file']) ? $this->configuration['control_file'] : 'base',
      '#options' => $control_options,
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['atomizer_id'] = $form_state->getValue('atomizer_id');
    $this->configuration['control_file'] = $form_state->getValue('control_file');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();

    // Read in the controls file
    $controlSet = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/controls/' . $config['control_file']));
    $controlSet['filename'] = $config['control_file'];

    // Create the form
    $render['form'] = \Drupal::formBuilder()->getForm('Drupal\atomizer\Form\AtomizerControlsForm', $controlSet);

    // Pass the atomizer id and control set on to JavaScript.
    $render['form']['#attached'] =  array(
      'library' => array('atomizer/atomizer-js'),
      'drupalSettings' => array(
        'atomizer' => array(
          $config['atomizer_id'] => array(
            'atomizerId' =>  $config['atomizer_id'],
            'controlSet' =>  $controlSet,
            'theme' => $render['form']['#az-theme'],
          ),
        ),
      ),
    );
    return $render;
  }
}
