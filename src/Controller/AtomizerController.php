<?php

namespace Drupal\atomizer\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\FormBuilderInterface;

use Drupal\Component\Serialization\Yaml;

use Drupal\atomizer\Ajax\LoadYmlCommand;
use Drupal\atomizer\Ajax\LoadAtomCommand;
use Drupal\atomizer\Ajax\ListDirectoryCommand;

// use Symfony\Component\Yaml\Yaml;

/**
 * Class AtomizerController.
 *
 * @package Drupal\atomizer\Controller
 */
class AtomizerController extends ControllerBase {

  /**
   * Load a YML file.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function loadYml() {
    $data = json_decode(file_get_contents("php://input"), true);

    $response = new AjaxResponse();
    $ymlContents = Yaml::decode(file_get_contents(drupal_get_path('module', 'atomizer') . '/' . $data['filepath']));
    $response->addCommand(new LoadYmlCommand($data, $ymlContents));

    return $response;
  }

  /**
   * Save a YML file.
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function saveYml() {
    $data = json_decode(file_get_contents("php://input"), true);

    $response = new AjaxResponse();
    file_put_contents(drupal_get_path('module', 'atomizer') . '/' . $data['filepath'], Yaml::encode($data['ymlContents']));

    return $response;
  }

  /**
   * List the contents of a directory.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function listDirectory() {
    $data = json_decode(file_get_contents("php://input"), true);

    $files = file_scan_directory(drupal_get_path('module', 'atomizer') . '/' . $data['directory'], '/\.yml/');
    foreach ($files as $file) {
      $filelist[$file->filename] = $file->name;
    }
    $response = new AjaxResponse();
    $response->addCommand(new ListDirectoryCommand($data, $filelist));
    return $response;
  }

  /**
   * Load the atom edit form.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function loadAtomForm() {
    $node = \Drupal::entityTypeManager()
      ->getStorage('node')
      ->create(array('type' => 'atom'));

    $form = \Drupal::entityTypeManager()
      ->getFormObject('node', 'default')
      ->setEntity($node);
    $content = \Drupal::formBuilder()->getForm($form, 'popup');

    $response = new AjaxResponse();
    $title = 'Atom Edit Form';
    $html = drupal_render($content);

    $is_modal = true;
    if ($is_modal) {
      $dialog = new OpenModalDialogCommand($title, $html);
      $response->addCommand($dialog);
    }
    else {
      $selector = '#ajax-test-dialog-wrapper-1';
      $response->addCommand(new OpenDialogCommand($selector, $title, $html));
    }
    return $response;
  }

  /**
   * Load a atom.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function loadAtom() {
    $response = new AjaxResponse();
    $data = json_decode(file_get_contents("php://input"), true);

    $node = Node::load($data['nid']);

    // Render the node/atom using teaser view mode.
    $data['teaser'] = render(\Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'teaser'));

    // Get the atomic structure field.
    $field = $node->field_atomic_structure;
    if (!empty($field)) {
      $data['atomConf'] = Yaml::decode($field->value);
    } else {
      $data['atomConf'] = 'Atom not found';
    }

    $response->addCommand(new LoadAtomCommand($data));
    return $response;
  }
}
