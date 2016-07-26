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

    // Select a Style file
    $style_files = file_scan_directory(drupal_get_path('module','atom_builder') . '/config/styles', '/\.yml/');
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
    $this->configuration['viewer_name'] = $form_state->getValue('viewer_name');
    $this->configuration['style_file'] = $form_state->getValue('style_file');
    $this->configuration['control_file'] = $form_state->getValue('control_file');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $build['atom_builder'] = array(
//    '#attached' => array( 'library' => array('atom_builder/atom-builder-js')),
      'wrapper' => array(
        'scene' => array('#markup' => "<div id='atom-builder-wrapper'>ye old atom builder goes here</div>"),
      ),
    );
    return $build;
  }

}
