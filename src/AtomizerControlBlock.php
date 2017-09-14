<?php

namespace Drupal\atomizer;

use Drupal\core\Url;
use Drupal\Component\Serialization\Json;
// use Drupal\Component\Serialization\Yaml;
//use Drupal\atomizer\AtomizerFiles;

/**
 * Class AtomizerControlBlock.
 *
 * @package Drupal\atomizer
 */
class AtomizerControlBlock {

  static private function makeRangeControl($id, $name, $defaultValue, $min, $max, $step) {
    $sliderClass = 'az-slider';
    $sliderId = $id . '--'  . $sliderClass;
    $valueClass = 'az-value';
    $valueId = $id . '--' . $valueClass;

    return [
      '#type' => 'container',
      'title' => [
        '#markup' => '<div class="az-name">' . $name . '</div>'
      ],
      'value' => [
        '#type' => 'textfield',
        '#default_value' => $defaultValue,
        '#attributes' => [
          'id' => $valueId,
          'class' => [$valueClass],
        ],
      ],
      'range' => [
        '#type' => 'range',
        '#default_value' => $defaultValue,
        '#min' => $min,
        '#max' => $max,
        '#step' => $step,
        '#attributes' => [
          'id' => $sliderId,
          'class' => [$sliderClass],
        ],
      ],
    ];
  }

  static function makeControl($controlName, $controlConf, &$theme) {
    $id = str_replace('_', '-', $controlName);
    $control = [];
    $containerClasses = ['az-control', 'az-control-' . $controlConf[1]];
    $defaultValue = (isset($controlConf[2])) ? $controlConf[2] : '';
    $addValue = false;
    switch ($controlConf[1]) {

      case 'selectyml':

        $control = [
          '#type' => 'container',
          '#attributes' => ['class' => ['selectyml']],
          'selectyml' => [
            '#type' => 'select',
            '#title' => $controlConf[0],
            '#default_value' => $controlConf[2],
            '#attributes' => [
              'id' => $id . '--select',
            ],
            '#options' => AtomizerFiles::createFileList(drupal_get_path('module', 'atomizer') . '/' . $controlConf[4], '/\.yml/'),
          ],
          /*          'overwrite_button' => array(
                        '#type' => 'item',
                        '#prefix' => '<div id="' . $id . '--button" class="button-wrapper">',
                        '#suffix' => '</div>',
                        '#markup' => t('Overwrite'),
                      ), */
          /*          'overwrite_message' => array(
                        '#type' => 'item',
                        '#prefix' => '<div id="' . $id . '--message" class="message-wrapper">',
                        '#suffix' => '</div>',
                        '#markup' => t(''),
                      ) */
        ];
        $containerClasses[] = 'selectyml';
        $addValue = true;
        break;

      case 'saveyml':
        $control = [
          '#type' => 'container',
          '#attributes' => ['class' => ['saveyml']],
          /*          'name' => array(
                        '#type' => 'textfield',
                        '#maxlength' => 24,
                        '#title' => 'Name',
                      ), */
          /*          'filename' => array(
                        '#type' => 'textfield',
                        '#maxlength' => 16,
                        '#title' => 'File name',
                        '#description' => t('Only characters, numbers, and underscores allowed - Leave blank to have it automatically generated.'),
                      ), */
          /*          'description' => array(
                        '#type' => 'textarea',
                        '#maxlength' => 30,
                        '#title' => 'Description',
                        '#maxlength' => 64,
                        '#rows' => 4,
                      ), */
          'save_button' => [
            '#type' => 'item',
            '#prefix' => '<div id="' . $id . '--button" class="button-wrapper">',
            '#suffix' => '</div>',
            '#markup' => t('Save'),
          ],
          'overwrite_message' => [
            '#type' => 'item',
            '#prefix' => '<div id="' . $id . '--message" class="message-wrapper">',
            '#suffix' => '</div>',
            '#markup' => t(''),
          ]
        ];
        $addValue = true;
        break;

      case 'link':
        if (empty($controlConf[4])) {
          $controlConf[4] = [];
        }
        $control = [
          '#type' => 'container',
          'link' => [
            '#type' => 'link',
            '#title' => $controlConf[0],
            '#url' => Url::fromRoute($controlConf[3], $controlConf[4]),
            '#attached' => ['library' => ['core/drupal.dialog.ajax']],
            '#attributes' => [
              'class' => ['use-ajax'],
              'data-dialog-type' => $controlConf[2],
              'data-dialog-options' => Json::encode([
                'dialogClass' => 'az-dialog',
                'width' => '520px',
                'draggable' => TRUE,
                'autoResize' => FALSE,
                'position' => ['my' => 'right top', 'at' => 'right-10 top-10'],
              ]),
            ],
          ],
        ];
        break;

      case 'button':
      case 'popup-node':
        $control = [
          '#type' => 'button',
          '#value' => $controlConf[0],
        ];
        if (!empty($controlConf[2])) {
          foreach ($controlConf[2] as $key => $value) {
            if (preg_match('/^data\-/', $key)) {
              $control['#attributes'][$key] = $value;
              if ($key == 'data-blockid') {
                $containerClasses[] = 'toggle-block';
              }
            } else if ($key == 'class') {
              $containerClasses[] = $value;
            } else if ($key == 'font-awesome') {
              $control = [
                '#type' => 'container',
                '#attributes' => [
                  'title' => $controlConf[0],
                ],
              ];
              $containerClasses[] = 'az-button';
              $containerClasses[] = 'fa';
              $containerClasses[] = $controlConf[2]['font-awesome'];
            }
          }
        }
        $addValue = true;
        break;

      case 'toggle':
        $control = [
          '#type' => 'button',
          '#value' => $controlConf[0],
        ];
        if (!empty($controlConf[2]['font-awesome'])) {
          $control = [
            '#type' => 'container',
            '#attributes' => [
              'title' => $controlConf[0],
            ],
          ];
          $containerClasses[] = 'fa';
          $containerClasses[] = $controlConf[2]['font-awesome'];
          $addValue = TRUE;
        }
        break;

      case 'checkbox':
        $control = [
          '#type' => 'checkbox',
//          '#attributes' => array('onclick' => 'return (false);'),
          '#title' => $controlConf[0],
        ];
        $addValue = true;
        break;

      case 'range':
        $control = AtomizerControlBlock::makeRangeControl(
          $id,
          $controlConf[0],
          $defaultValue,
          $controlConf[3][0],
          $controlConf[3][1],
          $controlConf[3][2]
        );
        $addValue = true;
        break;

      case 'radios':
        $control = [
          '#type' => 'radios',
          '#title' => $controlConf[0],
          '#default_value' => $defaultValue,
          '#options' => $controlConf[3],
        ];
        // Hide the control -- #proton--color--style
        // @TODO - make this general and apply to all types
        if (!empty($controlConf[4])) {
          if (!empty($controlConf[4]['hidden'])) {
            $containerClasses[] = 'az-hidden';
          }
        }
        $addValue = true;
        break;

      case 'select':
        $control = [
          '#type' => 'select',
          '#title' => $controlConf[0],
          '#default_value' => $defaultValue,
          '#options' => $controlConf[3],
        ];
        $addValue = true;
        break;

      case 'selectblock':
        $control = [
          '#type' => 'select',
          '#title' => $controlConf[0],
//          '#default_value' => $defaultValue,
          '#default_value' => 'dude',
        ];
        $addValue = true;
        break;

      case 'rotation':
      case 'position':
        $control = [
          '#type' => 'container',
          '#attributes' => ['class' => ['multi-slider']],
          'title' => [
            '#markup' => '<div class="az-label">' . $controlConf[0] . '</div>',
          ],
        ];
        foreach (['x', 'y', 'z'] as $ind => $axis) {
          $control[$id . '--' . $axis] = AtomizerControlBlock::makeRangeControl(
            $id . '--' . $axis,
            strtoupper($axis),
            $controlConf[2][$ind],
            $controlConf[3][0],
            $controlConf[3][1],
            $controlConf[3][2]
          );
          $control[$id . '--' . $axis]['#attributes']['class'][] = 'az-indent';
          $theme[$id . '--' . $axis] = [
            'type' => $controlConf[1],
            'defaultValue' => $defaultValue[$ind],
          ];
        }
        break;

      case 'color':
        $control = [
          '#type' => 'color',
          '#title' => $controlConf[0],
          '#default_value' => $defaultValue,
        ];
        $addValue = true;
        break;

      case 'textfield':
        $control = [
          '#type' => 'textfield',
          '#title' => $controlConf[0],
          '#maxlength' => $controlConf[3],
        ];
        $addValue = true;
        break;

      case 'html':
        $control = [
          '#type' => 'item',
          '#title' => $controlConf[0],
          'value' => [
            '#type' => 'item',
            '#markup' => $controlConf[2],
          ],
        ];
        $addValue = true;
        break;

      case 'textarea':
        $control = [
          '#type' => 'textarea',
          '#title' => 'Description',
          '#maxlength' => $controlConf[3],
          '#rows' => $controlConf[4],
        ];
        $addValue = true;
        break;

      case 'text':
        $control = [
          '#type' => 'container',
          '#attributes' => [
            'class' => ['text-wrapper'],
          ],
          'label' => ['#markup' => "<div class='text-label " . $id . "--label'>$controlConf[0]</div>"],
          'value' => ['#markup' => "<div class='text-value " . $id . "--value'>$controlConf[2]</div"],
        ];
        break;

      case 'number':
        $control = [
          '#type' => 'number',
          '#title' => $controlConf[0],
          '#default_value' => $controlConf[2],
          '#min' => $controlConf[3][0],
          '#max' => $controlConf[3][1],
          '#maxlength' => $controlConf[3][2],
        ];
        $addValue = true;
        break;

      case 'container':
        $control = ['#type' => 'container'];
        $addValue = true;
        break;

      case 'header':
        $control = ['#markup' => "<div class='az-header'>$controlConf[0]</div>"];
        break;

      case 'label':
        $control = ['#markup' => "<div id='$controlName' class='az-label'>$controlConf[0]</div>"];
        break;

      case 'hr':
        $control = ['#markup' => '<hr>'];
        break;

      default:
        break;
    }
    if ($addValue) {
      $theme[$id] = [
        'type' => $controlConf[1],
        'defaultValue' => $defaultValue,
      ];
    }
    $control['#attributes']['id'] = $id;
    $control['#attributes']['name'] = $id;
    $control['#attributes']['class'] = $containerClasses;

    return $control;
  }

  /**
   * @param $type
   * @param $blockName
   * @param $blockConf
   * @param $theme
   * @param $showTitle
   * @return mixed
   */
  static public function create($type, $blockName, $blockConf, &$theme) {
    // Create a container for the block
    $block = [
      '#type' => 'container',
      '#attributes' => [
        'id' => $type . '--' . $blockName,
        'class' => ['control-block'],
      ],
    ];
    if (!empty($blockConf['title'])) {
      $block['#title'] = $blockConf['title'];
    }

    // Create each control
    foreach ($blockConf['controls'] as $controlName => $controlConf) {
      $idArgs = explode('--', $controlName);
      if (!empty($idArgs[1]) && $idArgs[1] == 'wrapper') {
        $block[$controlName] = AtomizerControlBlock::create('blocks', $controlName, $controlConf, $theme);
      }
      else {
        $block[$controlName] = AtomizerControlBlock::makeControl($controlName, $controlConf, $theme);
      }
    }
    return $block;
  }
}

