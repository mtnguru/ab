<?php

/**
 * @file
 * Contains \Drupal\atomizer\Plugin\Field\FieldFormatter\AtomFormatter 
 */

namespace Drupal\atomizer\Plugin\Field\FieldFormatter;

// use Drupal\Core\Access\AccessResult;
// use Drupal\Core\Entity\EntityInterface;
// use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\atomizer\Utils\AtomizerFiles;
use Drupal\Component\Serialization\Yaml;

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
    static $js_loaded = false;
    $elements = array();

    foreach ($items as $delta => $entity) {
      // Read in the config/atomizer file
      $atomizerFile = $this->getSetting('atomizer');
      $atomizerId = 'atomizer';

      $atomizer = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/atomizers/' . $atomizerFile));
      $atomizer['filename']   = $atomizerFile;
      $atomizer['atomizerId'] = $atomizerId;  // For now hard code this as atomizer.

      $elements[$delta] = array(
        'atomizer' => array(
          'atomizer' => array(
            'wrapper' => array(
              'scene' => array('#markup' => '<div id="' . $atomizerId . '-wrapper"></div>'),
            ),
          ),
        ),
      );
      if (!$js_loaded) {
        $js_loaded = true;

        // Read in the nuclets
        $files = file_scan_directory(drupal_get_path('module','atomizer') . '/config/nuclets', '/\.yml/');
        foreach ($files as $file) {
          $nuclets[str_replace('nuclet_', '', $file->name)] = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/config/nuclets/' . $file->filename));
        }

        // Attach atomizer libraries and the nuclet information.
        $elements[$delta]['#attached'] = [
          'library' => ['atomizer/atomizer-js'],
          'drupalSettings' => [
            'atomizer' => [
              $atomizerId => $atomizer,
            ],
            'atomizer_config' =>[
              'nuclets' => $nuclets,
            ],
          ],
        ];
      }
    }

    return $elements;
  }

}
