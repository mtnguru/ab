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

  public function createControlBlock($type, $blockName, $blockConf, &$styleSet, $showTitle) {

    // Create a container for the block
    $block[$blockName] = array(
      '#type' => 'container',
      '#attributes' => array(
        'id' => $type . '-' . $blockName,
        'class' => array('control-block'),
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
      $addValue = false;
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
          $addValue = true;
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
          $addValue = true;
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
          $addValue = true;
          break;

        case 'button':
          $control = array(
            '#type' => 'button',
            '#attributes' => array('onclick' => 'return (false);'),
            '#value' => $controlConf[0],
          );
          $addValue = true;
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
          $addValue = true;
          break;

        case 'radios':
          $control = array(
            '#type' => 'radios',
            '#title' => $controlConf[0],
            '#default_value' => $defaultValue,
            '#options' => $controlConf[3],
          );
          $addValue = true;
          break;

        case 'select':
          $control = array(
            '#type' => 'radios',
            '#title' => $controlConf[0],
            '#default_value' => $defaultValue,
            '#options' => $controlConf[3],
          );
          $addValue = true;
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
          foreach (['x', 'y', 'z'] as $ind => $axis) {
            $control[$id . '--' . $axis] = $this->makeRangeControl(
              $id . '--' . $axis,
              strtoupper($axis),
              $controlConf[2][$ind],
              $controlConf[3][0],
              $controlConf[3][1],
              $controlConf[3][2]
            );
            $control[$id . '--' . $axis]['#attributes']['class'][] = 'az-indent';
            $styleSet[$id . '--' . $axis] = array(
              'type' => $controlConf[1],
              'defaultValue' => $defaultValue[$ind],
            );
          }
          break;

        case 'color':
          $control = array(
            '#type' => 'color',
            '#title' => $controlConf[0],
            '#default_value' => $defaultValue,
          );
          $addValue = true;
          break;

        case 'textfield':
          $control = array(
            '#type' => 'textfield',
            '#title' => 'Style Name',
            '#maxlength' => $controlConf[3],
          );
          $addValue = true;
          break;

        case 'textarea':
          $control = array(
            '#type' => 'textarea',
            '#title' => 'Description',
            '#maxlength' => $controlConf[3],
            '#rows' => $controlConf[4],
          );
          $addValue = true;
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
      if ($addValue) {
        $styleSet[$id] = array(
          'type' => $controlConf[1],
          'defaultValue' => $defaultValue,
        );
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

    ////////// Create empty style set
    $styleSet = array(
      'name' => 'Default',
      'description' => 'Initial style set',
      'styles' => array(),
    );

    ////////// Create static controls at top of control form
    if (isset($controlSet['static'])) {
      // Add the statis blocks
      $form['static'] = array(
        '#type' => 'container',
        '#attributes' => array('id' => 'static-controls'),
      );
      foreach ($controlSet['static'] as $blockName => $block) {
        $form['static'][$blockName] = $this->createControlBlock('static', $blockName, $block, $styleSet['styles'], false);
      }
    }

    ////////// Create Styler select list for control blocks
    if (isset($controlSet['styler'])) {
      // Create Styler Select list
      foreach ($controlSet['styler'] as $blockName => $block) {
        $options[$blockName] = $block['title'];
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
        $form['controls'][$blockName] = $this->createControlBlock('control', $blockName, $block, $styleSet['styles'], false);
      }
    }

    $form['#attributes'] = array('name' => 'atomizer-controls-form');

    $form['#az-styleset'] =  $styleSet;
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
