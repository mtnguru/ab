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

    // Give the atomizer the controls block can connect to it.
    $form['atomizer_id'] = array(
      '#type' => 'textfield',
      '#title' => $this->t('Atomizer ID'),
      '#description' => $this->t('Give this atomizer the same id as that assigned the Atomizer Control block'),
      '#default_value' => isset($this->configuration['atomizer_id']) ? $this->configuration['atomizer_id'] : 'Atomizer',
    );

    $atomizer_files = file_scan_directory(drupal_get_path('module','atomizer') . '/config/atomizers', '/\.yml/');
    foreach ($atomizer_files as $file) {
      $atomizer_options[$file->filename] = $file->name;
    }
    $form['atomizer_file'] = array(
      '#type' => 'select',
      '#title' => $this->t('Atomizer file'),
      '#description' => $this->t(''),
      '#default_value' => isset($this->configuration['atomizer_file']) ? $this->configuration['atomizer_file'] : 'default',
      '#options' => $atomizer_options,
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

  private function buildPopupDialog() {
    $menu = [
      // Nuclet
      //   These will be dynamic - changes take effect immediately - no need to submit a form.
      //   Pressing save atom will save everything at once.  So just make these controls like the controls file.
      //   They can be in a form - Do I need a file to define them?  Not really - but maybe I could use the current control block.
      //   I need to extract the buildControl block thingy to a separate file - I can make it it's own class?
      //   These can be buttons run through the controls module
      //   Why not?  That brings it all together and makes that methodology more capable.
      //   Nuclet Name: 01  -- Name depends on where it is attached.
      //   Nuclet Type: Lithium, Carbon, Final Backbone
      //   Nuclet State: Initial, Final
      //   Attach Angle: 1-5
      //   Grow points
      //     Connection pt 1: Add nuclet 010
      //     Connection pt 2: Add nuclet 011
      //   Delete Nuclet 01
      // Proton
      //   Delete Proton
      //
    ];
    return $menu;
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();

    // Read in the controls file
    $atomizer = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/atomizers/' . $config['atomizer_file']));
    $atomizer['filename']   = $config['atomizer_file'];
    $atomizer['atomizerId'] = $config['atomizer_id'];

    // Read in the nuclets
    $files = file_scan_directory(drupal_get_path('module','atomizer') . '/config/nuclets', '/\.yml/');
    foreach ($files as $file) {
      $nuclets[str_replace('nuclet_', '', $file->name)] = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/nuclets/' . $file->filename));
    }

    $build = array(
      'atomizer' => array(
        $config['atomizer_id'] => array(
          'wrapper' => array(
            'scene' => array('#markup' => '<div id="' . $config['atomizer_id'] . '-wrapper"></div>'),
          ),
        ),
        '#attached' => array(
          'library' => array('atomizer/atomizer-js'),
          'drupalSettings' => array(
            'atomizer' => array(
              $config['atomizer_id'] => $atomizer,
            ),
            'atomizer_config' => array(
              'nuclets' => $nuclets,
            ),
          ),
        ),
      ),
    );
    return $build;
  }

}
