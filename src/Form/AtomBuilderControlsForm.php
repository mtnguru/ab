<?php

namespace Drupal\atom_builder\Form;

use Drupal\Core\Form\FormBase;
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
      $containerClass = 'sa-control';
      switch ($controlConf[1]) {

        case 'button':
          $control = array(
            '#type' => 'button',
            '#value' => $controlConf[0],
          );
          break;

        case 'range':
          $control = array(
            '#type' => 'range',
            '#title' => $controlConf[0],
            '#default_value' => $controlConf[2],
            '#min' => $controlConf[3][0],
            '#max' => $controlConf[3][1],
            '#step' => $controlConf[3][2],
          );
          break;

        case 'radios':
          $control = array(
            '#type' => 'radios',
            '#title' => $controlConf[0],
            '#default_value' => $controlConf[2],
            '#options' => $controlConf[3],
          );
          break;

        case 'select':
          $control = array(
            '#type' => 'radios',
            '#title' => $controlConf[0],
            '#default_value' => $controlConf[2],
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
              '#default_value' => $controlConf[2],
              '#attributes' => array('id' => $id . '--x'),
              '#min' => $controlConf[3][0],
              '#max' => $controlConf[3][1],
              '#step' => $controlConf[3][2],
            ),
            $controlConf[0] . '__y' => array(
              '#type' => 'range',
              '#title' => 'Y',
              '#default_value' => $controlConf[2],
              '#attributes' => array('id' => $id . '--y'),
              '#min' => $controlConf[3][0],
              '#max' => $controlConf[3][1],
              '#step' => $controlConf[3][2],
            ),
            $controlConf[0] . '__z' => array(
              '#type' => 'range',
              '#title' => 'Z',
              '#default_value' => $controlConf[2],
              '#attributes' => array('id' => $id . '--z'),
              '#attributes' => array('id' => $id . '--z', 'class' => array('sa-indent')),
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
            '#default_value' => $controlConf[2],
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
      $control['#attributes'] = array(
        'id' => $id,
        'class' => array($containerClass),
        'name' => $id,
      );
      $block[$blockName][$controlName] = $control;
    }
    return $block;
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {

    $controlsConf = Yaml::decode(file_get_contents(drupal_get_path('module', 'atom_builder') . '/controls/atom_builder.yml'));

    $form['#attached']['library'][] = 'atom_builder/atom-builder-js';
    $form['#attached']['drupalSettings']['atom_builder']['controls'] = $controlsConf;
    $form['#attributes'] = array('name' => 'atom-builder-controls-form');

    // Styler Select list
    foreach ($controlsConf['styler'] as $blockName => $block) {
      $options[$blockName] = $block['title'];
    }
    $form['styler'] = array(
      '#type' => 'select',
      '#options' => $options,
    );

    // Add block controls
    $form['controls'] = array(
      '#type' => 'container',
      '#attributes' => array('id' => 'controls'),
    );
    foreach ($controlsConf['styler'] as $blockName => $block) {
      $form['controls'][$blockName] = $this->createControlBlock($blockName, $block, false);
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {

  }

}
