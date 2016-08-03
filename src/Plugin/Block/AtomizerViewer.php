<?php

namespace Drupal\atomizer\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Serialization\Yaml;

/**
 * Provides a 'Atomizer' block.
 *
 * @Block(
 *  id = "atomizer_viewer",
 *  admin_label = @Translation("Atomizer viewer"),
 * )
 */
class AtomizerViewer extends BlockBase {

  public function blockForm($form, FormStateInterface $form_state) {

    // Give the viewer a name so the controls block can connect to it.
    $form['atomizer_id'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Atomizer ID'),
      '#description' => $this->t('Give this viewer the same id as that assigned the Atomizer Control block'),
      '#default_value' => isset($this->configuration['atomizer_id']) ? $this->configuration['atomizer_id'] : 'Atomizer',
    );

    $viewer_files = file_scan_directory(drupal_get_path('module','atomizer') . '/config/viewers', '/\.yml/');
    foreach ($viewer_files as $file) {
      $viewer_options[$file->filename] = $file->name;
    }
    $form['viewer_file'] = array(
      '#type' => 'select',
      '#title' => $this->t('Viewer file'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['viewer_file']) ? $this->configuration['viewer_file'] : 'default',
      '#options' => $viewer_options,
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['atomizer_id'] = $form_state->getValue('atomizer_id');
    $this->configuration['viewer_file'] = $form_state->getValue('viewer_file');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();

    // Read in the controls file
    $viewer = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/viewers/' . $config['viewer_file']));
    $viewer['filename'] = $config['viewer_file'];

    $build = array(
      'atomizer' => array(
        $config['atomizer_id'] = array(
          'wrapper' => array(
            'scene' => array('#markup' => "<div id='atomizer-wrapper'></div>"),
          ),
        ),
        '#attached' => array(
          'library' => array('atomizer/atomizer-js'),
          'drupalSettings' => array(
            'atomizer' => array(
              $config['atomizer_id'] = array(
                'atomizerId' =>  $config['atomizer_id'],
                'viewer' =>  $viewer,
              ),
            ),
          ),
        ),
      ),
    );
    return $build;
  }

}
