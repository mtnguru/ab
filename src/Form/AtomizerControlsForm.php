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

  function buildSelectList() {
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
//      $form['controls'][$blockName] = AtomizerControlBlock::create('control', $blockName, $block, $theme['settings'], false);
      }
    }
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

    ////////// Create the control blocks
    if (isset($controlSet['blocks'])) {
      $form['blocks'] = array(
        '#type' => 'container',
        '#attributes' => array('id' => 'controls-blocks'),
      );

      foreach ($controlSet['blocks'] as $blockName => $block) {
        $form['blocks'][$blockName] = AtomizerControlBlock::create('blocks', $blockName, $block, $theme['settings'], false);
        $form['blocks'][$blockName]['#az-hidden'] = true;
      }
    }

    // Set up the sidebar.
    if (isset($controlSet['sidebar'])) {
      // Loop through sidebar blocks
      foreach ($controlSet['sidebar'] as $sectionName => $section) {
        foreach ($section as $blockName => $block) {
          if (!empty($block['show']) && $block['show']) {
            // Mark blocks that are displayed initially.
            $form['blocks'][$blockName]['#az-hidden'] = false;
            if (!empty($form['blocks']['buttons']['toggle--' . $blockName])) {
              $form['blocks']['buttons']['toggle--' . $blockName]['#attributes']['class'][] = 'az-selected';
            }
          }
        }
      }
    }

    // Set options for the theme block selector control
    if (isset($controlSet['blocks']['theme'])) {
      $options = $controlSet['blocks']['theme']['controls']['theme--selectBlock'][3];
      foreach ($options as $key) {
        $form['blocks']['theme']['theme--selectBlock']['#options'][$key] = $controlSet['blocks'][$key]['title'];
      }
    }

    // Mark all hidden blocks.
    foreach ($controlSet['blocks'] as $blockName => $block) {
      if ($form['blocks'][$blockName]['#az-hidden']) {
        $form['blocks'][$blockName]['#attributes']['class'][] = 'az-hidden';
      }
    }

    $form['#attributes'] = array('name' => 'atomizer-controls-form');

    // Attach the theme to form for later use.
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
