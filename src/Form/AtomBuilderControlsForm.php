<?php

namespace Drupal\atom_builder\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Url;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Serialization\Yaml;

/**
 * Class AtomBuilderControlsForm.
 *
 * @package Drupal\atom_builder\Form
 */
class AtomBuilderControlsForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'atom_builder_controls_form';
  }

  public function createControlBlock($blockName, $blockConf, $showTitle, &$controlSet) {

    // Create a container for the block
    $block[$blockName] = array(
      '#type' => 'container',
      '#attributes' => array(
        'id' => 'control-' . $blockName,
        'class' => array('control-block')
      ),
    );
    if ($showTitle && !empty($blockConf['title'])) {
      $block[$blockName]['#title'] = $blockConf['title'];
    }

    // Create each control
    foreach ($blockConf['controls'] as $controlName => $controlConf) {
      $control = array();
      $id = str_replace('_', '-', $controlName);
      $containerClass = 'sa-control';
      if (empty($controlSet[$controlName])) {
        if (!empty($controlConf[2])) {
          $defaultValue = $controlConf[2];
        } else {
          $defaultValue = "Undefined";
        }
      } else {
        $defaultValue = $controlSet[$controlName]['defaultValue'];
      }
      switch ($controlConf[1]) {

        case 'link':
          $control = array(
            '#type' => 'container',
            'link' => array(
              '#type' => 'link',
              '#title' => $controlConf[0],
              '#url' => Url::fromRoute($controlConf[2], $controlConf[3]),
              '#attributes' => array('class' => array('use_ajax')),
              '#suffix' => '<br />',
            ),
          );
          break;

        case 'button':
          $control = array(
            '#type' => 'button',
            '#attributes' => array('onclick' => 'return (false);'),
            '#value' => $controlConf[0],
          );
          break;

        case 'range':
          $control = array(
            '#type' => 'range',
            '#title' => $controlConf[0],
            '#default_value' => $defaultValue,
            '#min' => $controlConf[3][0],
            '#max' => $controlConf[3][1],
            '#step' => $controlConf[3][2],
          );
          break;

        case 'radios':
          $control = array(
            '#type' => 'radios',
            '#title' => $controlConf[0],
            '#default_value' => $defaultValue,
            '#options' => $controlConf[3],
          );
          break;

        case 'select':
          $control = array(
            '#type' => 'radios',
            '#title' => $controlConf[0],
            '#default_value' => $defaultValue,
            '#options' => $controlConf[3],
          );
          break;

        case 'rotation':
        case 'position':
          $containerClass .= ' sa-indent';
          $control = array(
            '#type' => 'container',
            'title' => array(
              '#markup' => '<div class="sa-label">' . $controlConf[0] . '</div>',
            ),
            $controlConf[0] . '__x' => array(
              '#type' => 'range',
              '#title' => 'X',
              '#default_value' => $defaultValue[0],
              '#attributes' => array('id' => $id . '--x'),
              '#min' => $controlConf[3][0],
              '#max' => $controlConf[3][1],
              '#step' => $controlConf[3][2],
            ),
            $controlConf[0] . '__y' => array(
              '#type' => 'range',
              '#title' => 'Y',
              '#default_value' => $defaultValue[1],
              '#attributes' => array('id' => $id . '--y'),
              '#min' => $controlConf[3][0],
              '#max' => $controlConf[3][1],
              '#step' => $controlConf[3][2],
            ),
            $controlConf[0] . '__z' => array(
              '#type' => 'range',
              '#title' => 'Z',
              '#default_value' => $defaultValue[2],
              '#attributes' => array('id' => $id . '--z'),
              '#min' => $controlConf[3][0],
              '#max' => $controlConf[3][1],
              '#step' => $controlConf[3][2],
            ),
          );
          break;

        case 'color':
          $control = array(
            '#type' => 'color',
            '#title' => $controlConf[0],
            '#default_value' => $defaultValue,
          );
          break;

        case 'textfield':
          $control = array(
            '#type' => 'textfield',
            '#title' => 'Style Name',
            '#maxlength' => $controlConf[3],
          );
          break;

        case 'textarea':
          $control = array(
            '#type' => 'textarea',
            '#title' => 'Description',
            '#maxlength' => $controlConf[3],
            '#rows' => $controlConf[4],
          );
          break;

        case 'header':
          $control = array('#markup' => "<div class='sa-header'>$controlConf[0]</div>");
          break;

        case 'label':
          $control = array('#markup' => "<div class='sa-label>$controlConf[0]</div>");
          break;

        case 'hr':
          $control = array('#markup' => '<hr>');
          break;

        default:
          break;
      }
      if (!in_array($controlConf[1], array('label', 'header', 'hr'))) {
        $controlSet[$controlName]['type'] = $controlConf[1];
        if ($defaultValue != null) {
          $controlSet[$controlName]['defaultValue'] = $defaultValue;
        }
      }
      $control['#attributes']['id'] = $id;
      $control['#attributes']['name'] = $id;
      $control['#attributes']['class'] = array($containerClass);

      $block[$blockName][$controlName] = $control;
    }
    return $block;
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $controlSet = Yaml::decode(file_get_contents(drupal_get_path('module', 'atom_builder') . '/config/controls/atom_builder.yml'));

    // Create Styler Select list
    foreach ($controlSet['styler'] as $blockName => $block) {
      $options[$blockName] = $block['title'];
    }
    $form['styler'] = array(
      '#type' => 'select',
      '#options' => $options,
    );

    $styleSet = array(
      'name' => 'Default',
      'description' => 'Initial style set',
    );

    // Add block controls
    $form['controls'] = array(
      '#type' => 'container',
      '#attributes' => array('id' => 'controls'),
    );
    foreach ($controlSet['styler'] as $blockName => $block) {
      $form['controls'][$blockName] = $this->createControlBlock($blockName, $block, false, $styleSet['controls']);
    }

    $form['#attributes'] = array('name' => 'atom-builder-controls-form');

    file_put_contents(drupal_get_path('module', 'atom_builder') . '/config/styles/base2.yml', Yaml::encode($styleSet));
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

  }
}
