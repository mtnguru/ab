<?php

namespace Drupal\atomizer\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Url;
use Drupal\Core\Form\FormStateInterface;
use Drupal\atomizer\AtomizerControlBlock;


/**
 * Class AtomizerControlsForm.
 *
 * @package Drupal\atomizer\Form
 */
class AtomizerControlsForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'atomizer_controls_form';
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $controlSet = array()) {

    ////////// Create empty style set - as controls get built this gets initialized.
    $theme = array(
      'name' => 'Default',
      'description' => 'Initial style set',
      'settings' => array(),
    );

    ////////// Create static controls at top of control form
    if (isset($controlSet['static'])) {
      // Add the static blocks
      $form['static'] = array(
        '#type' => 'container',
        '#attributes' => array('id' => 'static-controls'),
      );
      foreach ($controlSet['static'] as $blockName => $block) {
        $form['static'][$blockName] = AtomizerControlBlock::create('static', $blockName, $block, $theme['settings'], false);
      }
    }

    ////////// Create hidden controls
    if (isset($controlSet['hidden'])) {
      // Add the static blocks
      $form['hidden'] = array(
        '#type' => 'container',
        '#attributes' => array('id' => 'hidden-controls'),
      );
      foreach ($controlSet['hidden'] as $blockName => $block) {
        $form['hidden'][$blockName] = AtomizerControlBlock::create('hidden', $blockName, $block, $theme['settings'], false);
        $form['hidden'][$blockName][$blockName]['#attributes']['class'][] = 'az-hidden';
      }
    }

    ////////// Create Styler select list for control blocks
    if (isset($controlSet['styler'])) {
      // Create Styler Select list
      foreach ($controlSet['styler'] as $blockName => $block) {
        if (empty($block['hidden'])) {
          $options[$blockName] = $block['title'];
        }
      }
      $form['styler'] = array(
        '#type' => 'select',
        '#options' => $options,
      );

      // Add the styler blocks
      $form['controls'] = array(
        '#type' => 'container',
        '#attributes' => array('id' => 'styler-controls'),
      );
      foreach ($controlSet['styler'] as $blockName => $block) {
        $form['controls'][$blockName] = AtomizerControlBlock::create('control', $blockName, $block, $theme['settings'], false);
      }
    }

    $form['#attributes'] = array('name' => 'atomizer-controls-form');

    $form['#az-theme'] =  $theme;
//  file_put_contents(drupal_get_path('module', 'atomizer') . '/config/style/base2.yml', Yaml::encode($theme));
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

  }

  public function loadYml(array &$form, FormStateInterface $form_state) {
    return;
  }
}
