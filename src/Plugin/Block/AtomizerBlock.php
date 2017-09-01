<?php

namespace Drupal\atomizer\Plugin\Block;

use Drupal\atomizer\AtomizerFiles;
use Drupal\atomizer\AtomizerInit;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Serialization\Yaml;

/**
 * Provides a 'Atomizer' block.
 *
 * @Block(
 *  id = "atomizer_block",
 *  admin_label = @Translation("Atomizer block - controls and viewer in one block"),
 * )
 */
class AtomizerBlock extends BlockBase {

  public function blockForm($form, FormStateInterface $form_state) {

    // Give the viewer a name so the controls block can connect to it.
    $form['atomizer_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Atomizer ID'),
      '#description' => $this->t('Give this instance of the atomizer an ID - not needed in this instance?'),
      '#default_value' => isset($this->configuration['atomizer_id']) ? $this->configuration['atomizer_id'] : 'Atomizer',
    ];

    $control_files = file_scan_directory(drupal_get_path('module','atomizer') . '/config/controls', '/\.yml/');
    $control_options = [];
    foreach ($control_files as $file) {
      $control_options[$file->filename] = $file->name;
    }
    $form['control_file'] = [
      '#type' => 'select',
      '#title' => $this->t('Control Set file'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['control_file']) ? $this->configuration['control_file'] : 'base',
      '#options' => $control_options,
    ];

    $form['atomizer_file'] = [
      '#type' => 'select',
      '#title' => $this->t('Atomizer file'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['atomizer_file']) ? $this->configuration['atomizer_file'] : 'default',
      '#options' => AtomizerFiles::createFileList(drupal_get_path('module', 'atomizer') . '/config/atomizers', '/\.yml/'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['atomizer_id'] = $form_state->getValue('atomizer_id');
    $this->configuration['control_file'] = $form_state->getValue('control_file');
    $this->configuration['atomizer_file'] = $form_state->getValue('atomizer_file');
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();

    // If this is an atomizer CT then get configuration from Atomizer node.
    if (!empty($config['atomizer_configuration'])) {
      $atomizer_config = $config['atomizer_configuration'];
    }
    else if (!empty($config['atomizer_config'])) {
      $atomizer_config = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/atomizers/' . $config['atomizer_config']));
    }
    else {
      return;
    }
    $controlSet = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/controls/' . $atomizer_config['controlFile']));
    $controlSet['filename'] = $atomizer_config['controlFile'];

    // Create the controls form
    $controls['form'] = \Drupal::formBuilder()->getForm('Drupal\atomizer\Form\AtomizerControlsForm', $controlSet);
    $controls['form']['#attributes'] = ['class' => ['az-controls-form']];
    $controls['form']['#attached'] =  [
      'library' => ['atomizer/atomizer-js'],
      'drupalSettings' => [
        'atomizer' => [
          $atomizer_config['atomizerId'] => [
            'atomizerId' =>  $atomizer_config['atomizerId'],
            'controlSet' =>  $controlSet,
            'theme' => $controls['form']['#az-theme'],
          ],
        ],
      ],
    ];

    $atomizer = AtomizerInit::start($config);
    $build = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['az-wrapper'],
        'tabindex' => 1,
      ],
      'content' => [
        '#type' => 'container',
        '#attributes' => [
          'id' => 'az-id-' . $atomizer_config['atomizerId'],
          'class' => ['az-atomizer-wrapper'],
        ],
        'atomizer' => $atomizer['atomizer'],
        'controls' => [
          '#type' => 'container',
          '#weight' => -10,
          '#attributes' => ['class' => ['az-controls-wrapper']],
          'controls' => $controls,
        ],
      ],
    ];

    if (!empty($atomizer_config['classes'])) {
      foreach ($atomizer_config['classes'] as $class) {
        $build['#attributes']['class'][] = $class;
      }
    }

    return $build;
  }
}
