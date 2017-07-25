<?php

/**
 * @file
 * Contains \Drupal\atomizer\Plugin\Field\FieldFormatter\AtomFormatter 
 */

namespace Drupal\atomizer\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\atomizer\AtomizerFiles;
use Drupal\atomizer\AtomizerInit;

/**
 * Plugin implementation of the 'atom' formatter.
 *
 * @FieldFormatter(
 *   id = "atom_formatter",
 *   label = @Translation("Atom embed"),
 *   description = @Translation("Display the referenced atom in the atomizer viewer."),
 *   field_types = {
 *     "string", "string_long"
 *   }
 * )
 */
class AtomFormatter extends FormatterBase {

//private static $fileList;

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return array(
      'atomizer' => 'atom_builder',
      'atomizer_class' => '',
    );
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $fileList = AtomizerFiles::createFileList(drupal_get_path('module', 'atomizer') . '/config/atomizers.old', '/\.yml/');
    $atomizer = $this->getSetting('atomizer');
    $atomizer_class = $this->getSetting('atomizer_class');

    $elements['atomizer'] = array(
      '#type' => 'select',
      '#options' => $fileList,
      '#title' => t('Atomizer mode'),
      '#default_value' => ($atomizer) ? $atomizer : $this->defaultSettings()['atomizer'],
      '#required' => TRUE,
    );
    $elements['atomizer_class'] = array(
      '#type' => 'textfield',
      '#title' => t('Class'),
      '#default_value' => ($atomizer_class) ? $atomizer_class : $this->defaultSettings()['atomizer_class'],
      '#required' => TRUE,
    );

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = array();
    $fileList = AtomizerFiles::createFileList(drupal_get_path('module', 'atomizer') . '/config/atomizers.old', '/\.yml/');

    $atomizer = $this->getSetting('atomizer');
    $atomizer = ($atomizer) ? $atomizer : defaultSettings()['atomizer'];
    $summary[] = t('Atomizer: @atomizer', array('@atomizer' => $fileList[$atomizer]));

    $atomizer_class = $this->getSetting('atomizer_class');
    $summary[] = t('Class: @class', array('@class' => $atomizer_class));

    return $summary;
  }


  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = array();

    foreach ($items as $delta => $item) {
      // Read in the config/atomizer file
      $nid = $items->getEntity()->nid->value;
      $config = [
        'atom_id' => 1,
        'atomizer_id' => 'Atomizer Viewer ' . $nid,
        'atomizer_file' => $this->getSetting('atomizer'),
        'atomizer_class' => $this->getSetting('atomizer_class'),
        'label' => 'Atomizer Embed',
        'nid' => $nid,
      ];

      $elements[$delta] = AtomizerInit::start($config);
    }

    return $elements;
  }

}
