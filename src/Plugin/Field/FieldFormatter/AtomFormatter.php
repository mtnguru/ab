<?php

/**
 * @file
 * Contains \Drupal\atomizer\Plugin\Field\FieldFormatter\AtomFormatter 
 */

namespace Drupal\atomizer\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\atomizer\Utils\AtomizerFiles;
use Drupal\atomizer\Utils\AtomizerInit;

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
    );
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $fileList = AtomizerFiles::createFileList(drupal_get_path('module', 'atomizer') . '/config/atomizers', '/\.yml/');
    $atomizer = $this->getSetting('atomizer');
    $elements['atomizer'] = array(
      '#type' => 'select',
      '#options' => $fileList,
      '#title' => t('Atomizer mode'),
      '#default_value' => ($atomizer) ? $atomizer : defaultSettings()['atomizer'],
      '#required' => TRUE,
    );

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = array();
    $fileList = AtomizerFiles::createFileList(drupal_get_path('module', 'atomizer') . '/config/atomizers', '/\.yml/');

    $atomizer = $this->getSetting('atomizer');
    $atomizer = ($atomizer) ? $atomizer : defaultSettings()['atomizer'];
    $summary[] = t('Atomizer: @atomizer', array('@atomizer' => $fileList[$atomizer]));

    return $summary;
  }


  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = array();

    foreach ($items as $delta => $item) {
      // Read in the config/atomizer file
      $config = [
        'atom_id' => 1,
        'atomizer_id' => 'Atomizer Viewer',
        'atomizer_file' => $this->getSetting('atomizer'),
        'label' => 'Atomizer Embed',
        'nid' => $items->getEntity()->nid->value,
      ];

      $elements[$delta] = AtomizerInit::start($config);
    }

    return $elements;
  }

}
