<?php

namespace Drupal\atom_builder\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Serialization\Yaml;

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
    $form['viewer_id'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Viewer Name'),
      '#description' => $this->t('Use the same name assigned the Atom Builder block'),
      '#default_value' => isset($this->configuration['viewer_id']) ? $this->configuration['viewer_id'] : 'Atom Builder',
    );

    // Select a Style file
    $style_files = file_scan_directory(drupal_get_path('module','atom_builder') . '/config/style', '/\.yml/');
    foreach ($style_files as $file) {
      $style_options[$file->filename] = $file->name;
    }
    $form['style_file'] = array(
      '#type' => 'select',
      '#title' => $this->t('Style'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['style_file']) ? $this->configuration['style_file'] : 'base',
      '#options' => $style_options,
    );

    // Select a control file
    $control_files = file_scan_directory(drupal_get_path('module','atom_builder') . '/config/controls', '/\.yml/');
    foreach ($control_files as $file) {
      $control_options[$file->filename] = $file->name;
    }
    $form['control_file'] = array(
      '#type' => 'select',
      '#title' => $this->t('Controls'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['control_file']) ? $this->configuration['control_file'] : 'atom_builder',
      '#options' => $control_options,
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['viewer_id'] = $form_state->getValue('viewer_id');
    $this->configuration['style_file'] = $form_state->getValue('style_file');
    $this->configuration['control_file'] = $form_state->getValue('control_file');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();
    $render['form'] = \Drupal::formBuilder()->getForm('Drupal\atom_builder\Form\AtomBuilderControlsForm');

    // Read in the styleSet
    $styleSet = Yaml::decode(file_get_contents(drupal_get_path('module', 'atom_builder') . '/config/style/' . $config['style_file']));
    $styleSet['filename'] = $config['style_file'];

    // Read in the controls
    $controlSet = Yaml::decode(file_get_contents(drupal_get_path('module', 'atom_builder') . '/config/controls/' . $config['control_file']));
    $controlSet['filename'] = $config['control_file'];

    $render['form']['#attached'] =  array(
      'library' => array('atom_builder/atom-builder-js'),
      'drupalSettings' => array(
        'atom_builder' => array(
          'viewerId' => $config['viewer_id'],
          'styleFile' => $config['style_file'],
          'styleSet' => Yaml::decode(file_get_contents(drupal_get_path('module', 'atom_builder') . '/config/style/' . $config['style_file'])),
          'controlFile' => $config['control_file'],
          'controlSet' => $controlSet,
        ),
      ),
    );
    return $render;
  }
}
