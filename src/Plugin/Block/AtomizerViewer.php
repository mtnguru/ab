<?php

namespace Drupal\atomizer\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\atomizer\Utils\AtomizerInit;
use Drupal\atomizer\Utils\AtomizerFiles;

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

    // Give the atomizer the controls block can connect to it.
    $form['atomizer_id'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Atomizer ID'),
      '#description' => $this->t('Give this atomizer the same id as that assigned the Atomizer Control block'),
      '#default_value' => isset($this->configuration['atomizer_id']) ? $this->configuration['atomizer_id'] : 'Atomizer',
    );

    $form['atomizer_file'] = array(
      '#type' => 'select',
      '#title' => $this->t('Atomizer file'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['atomizer_file']) ? $this->configuration['atomizer_file'] : 'default',
      '#options' => AtomizerFiles::createFileList(drupal_get_path('module', 'atomizer') . '/config/atomizers', '/\.yml/'),
    );

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['atomizer_id'] = $form_state->getValue('atomizer_id');
    $this->configuration['atomizer_file'] = $form_state->getValue('atomizer_file');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();
    $build = AtomizerInit::start($config);
    return $build;
  }

}
