<?php

namespace Drupal\atomizer\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Url;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Component\Serialization\Yaml;
use Drupal\atomizer\Utils\AtomizerFiles;


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

  private function makeRangeControl($id, $name, $defaultValue, $min, $max, $step) {
    $sliderClass = 'az-slider';
    $sliderId = $id . '--'  . $sliderClass;
    $valueClass = 'az-value';
    $valueId = $id . '--' . $valueClass;

    return array(
      '#type' => 'container',
      'title' => array(
        '#markup' => '<div class="az-name">' . $name . '</div>'
      ),
      'value' => array (
        '#type' => 'textfield',
        '#default_value' => $defaultValue,
        '#attributes' => array(
          'id' => $valueId,
          'class' => array($valueClass),
        ),
      ),
      /*          'min' => array(
                    '#markup' => '<div class="az-min">' . $controlConf[3][0] . '</div>'
                  ), */
      'range' => array (
        '#type' => 'range',
        '#default_value' => $defaultValue,
        '#min' => $min,
        '#max' => $max,
        '#step' => $step,
        '#attributes' => array(
          'id' => $sliderId,
          'class' => array($sliderClass),
        ),
      ),
      /*          'max' => array(
                    '#markup' => '<div class="az-max">' . $controlConf[3][1] . '</div>'
                  ), */
    );
  }

  public function createControlBlock($blockName, $blockConf, $showTitle) {

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
      $containerClasses = array('az-control', 'az-control-' . $controlConf[1]);
      $defaultValue = (isset($controlConf[2])) ? $controlConf[2] : '';
      switch ($controlConf[1]) {

        case 'selectyml':

          $control = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('selectyml')),
            'selectyml' => array (
              '#type' => 'select',
              '#title' => $controlConf[0],
              '#default_value' => $controlConf[2],
              '#options' => AtomizerFiles::createFileList(drupal_get_path('module', 'atomizer') . '/' . $controlConf[4], '/\.yml/'),
            ),
            'overwrite_button' => array(
              '#type' => 'item',
              '#prefix' => '<div id="' . $id . '--button" class="button-wrapper">',
              '#suffix' => '</div>',
              '#markup' => t('Overwrite'),
            ),
          );
          break;

        case 'saveyml':
          $control = array(
            '#type' => 'container',
            '#attributes' => array('class' => array('saveyml')),
            'name' => array(
              '#type' => 'textfield',
              '#maxlength' => 24,
              '#title' => 'Name',
            ),
            'filename' => array(
              '#type' => 'textfield',
              '#maxlength' => 16,
              '#title' => 'File name',
              '#description' => t('Only characters, numbers, and underscores allowed - Leave blank to have it automatically generated.'),
            ),
/*          'description' => array(
              '#type' => 'textarea',
              '#maxlength' => 30,
              '#title' => 'Description',
              '#maxlength' => 64,
              '#rows' => 4,
            ), */
            'save_button' => array(
              '#type' => 'item',
              '#prefix' => '<div id="' . $id . '--button" class="button-wrapper">',
              '#suffix' => '</div>',
              '#markup' => t('Save'),
            ),
          );
          break;

        case 'link':
          $options = array(
            'component' => $controlConf[3],
            'directory' => drupal_get_path('module', 'atomizer') . '/' . $controlConf[4],
            'filename' => $controlConf[2],
          );
          $control = array(
            '#type' => 'container',
            'link' => array(
              '#type' => 'link',
              '#title' => $controlConf[0],
              '#url' => Url::fromRoute($controlConf[2], $options),
              '#attributes' => array('class' => array('use-ajax')),
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
          $control = $this->makeRangeControl(
            $id,
            '&nbsp;&nbsp;' . $controlConf[0],
            $defaultValue,
            $controlConf[3][0],
            $controlConf[3][1],
            $controlConf[3][2]
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
          $control = array(
            '#type' => 'container',
            '#attributes' => ['class' => ['multi-slider']],
            'title' => array(
              '#markup' => '<div class="az-label">' . $controlConf[0] . '</div>',
            ),
          );
          $i = 0;
          foreach (['x', 'y', 'z'] as $axis) {
            $did = str_replace('_', '-', $id) . '--' . $axis;
            $control[$id . '__' . $axis] = $this->makeRangeControl(
              $did,
              strtoupper($axis),
              $controlConf[2][$i],
              $controlConf[3][0],
              $controlConf[3][1],
              $controlConf[3][2]
            );
            $control[$id . '__' . $axis]['#attributes']['class'][] = 'az-indent';
            $i++;
          }
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
          $control = array('#markup' => "<div class='az-header'>$controlConf[0]</div>");
          break;

        case 'label':
          $control = array('#markup' => "<div class='az-label'>$controlConf[0]</div>");
          break;

        case 'hr':
          $control = array('#markup' => '<hr>');
          break;

        default:
          break;
      }
      $control['#attributes']['id'] = $id;
      $control['#attributes']['name'] = $id;
      $control['#attributes']['class'] = $containerClasses;

      $block[$blockName][$controlName] = $control;
    }
    return $block;
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $controlSet = array()) {

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
      $form['controls'][$blockName] = $this->createControlBlock($blockName, $block, $styleSet, false);
    }

    $form['#attributes'] = array('name' => 'atomizer-controls-form');

//  $styleSet['name'] = "Base new";
//  file_put_contents(drupal_get_path('module', 'atomizer') . '/config/style/base2.yml', Yaml::encode($styleSet));
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
