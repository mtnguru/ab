<?php

namespace Drupal\atomizer\Controller;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\FormBuilderInterface;
use Drupal\Core\Url;

use Drupal\Component\Serialization\Yaml;

use Drupal\atomizer\Ajax\RenderNodeCommand;
use Drupal\atomizer\Ajax\LoadYmlCommand;
use Drupal\atomizer\Ajax\LoadAtomCommand;
use Drupal\atomizer\Ajax\ListDirectoryCommand;
use Symfony\Component\DependencyInjection\ContainerInterface;

// use Symfony\Component\Yaml\Yaml;

/**
 * Class AtomizerController.
 *
 * @package Drupal\atomizer\Controller
 */
class AtomizerController extends ControllerBase {

   /**
   * The Entity Manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * AtomizerController constructor.
   *
   * @param EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager service.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager) {
    $this->entityTypeManager = $entity_type_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity.manager')
    );
  }

  /**
   * Load a YML file.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function renderNode() {
    $data = json_decode(file_get_contents("php://input"), true);

    $nid = $data['nid'];
    $snippet = $this->entityTypeManager->getStorage('node')->load($nid);
    $htmlContents = $this->entityTypeManager->getViewBuilder('node')->view($snippet, 'full');

    $response = new AjaxResponse();
    $response->addCommand(new RenderNodeCommand($data, render($htmlContents)));

    return $response;
  }

  /**
   * Load a Node and render it.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function loadYml() {
    $data = json_decode(file_get_contents("php://input"), true);

    $path = drupal_get_path('module', 'atomizer') . '/' . $data['filepath'];
    if (!file_exists($path)) {
       $path =  dirname($path) . '/Default.yml';
       $data['message'] = 'Could not find ' . $data['filepath'] . ' -- Default.yml file loaded.';
       $data['filepath'] = $path;
       $data['themeId'] = 'default';
    }
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
    $node = $this->entityTypeManager()->getStorage('node')->create(array('type' => 'atom'));

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
    $link = [
      '#type' => 'link',
      '#title' => 'Save',
      '#url' => Url::fromRoute('entity.node.edit_form',['node' => $data['nid']]),
      '#attached' => ['library' => ['core/drupal.dialog.ajax']],
      '#attributes' => [
        'class' => ['use-ajax'],
        'data-dialog-type' => 'modal',
        'data-dialog-options' => Json::encode([
          'dialogClass' => 'az-dialog az-atom-form',
          'width' => '600px',
          'draggable' => true,
          'autoResize' => false,
          'position' => [
            'my' => 'center top-20',
            'at' => 'center top',
          ],
        ]),
        'data-drupal-selector' => "edit-link",
        'id' =>"edit-link",
      ],
    ];
    $data['link'] = render($link);

    $node = Node::load($data['nid']);

    // Render the node/atom using teaser atom_viewer mode.
    $data['atomName'] = $node->label();

    $build = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'atom_viewer');
    $data['properties'] = render($build);

    // Render the node/atom using teaser view mode.
    $build = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'teaser');
    $data['information'] = render($build);

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

  /**
   * Execute ImageMagick convert command to scale image.
   *
   * @param string $spath
   *   Source path for image.
   * @param string $dpath
   *   Destination path for image.
   * @param string $type
   *   If $type == browser then scale to saved configuration settings.
   */
  private function convertImage($spath, $dpath, $type = NULL) {
    switch ($type) {
      case 'browser':
        $geometry = variable_get('imager_browser_width', 1200) . 'x' .
          variable_get('imager_browser_height', 1200);
        $cmd = "/usr/bin/convert -quality 60 -scale $geometry \"$spath\" \"$dpath\" > /tmp/convert.log 2>&1";
        break;

      default:
        $cmd = "/usr/bin/convert -quality 60 \"$spath\" \"$dpath\" > /tmp/convert.log 2>&1";
        break;
    }
    system($cmd);
    if (!file_exists($dpath)) {
      $cmd = "cp $spath $dpath";
      system($cmd);
    }
//  $cmd = "rm $spath";
    system($cmd);
  }

  /**
   * Write POSTed image to file path.
   *
   * @param string $path
   *   Path to write image to.
   */
  private function writeImage($path, $base64Img) {
    $filtered_data = explode(',', $base64Img);
    $fp = fopen($path, 'w');
    fwrite($fp, base64_decode($filtered_data[1]));
    fclose($fp);
  }

  /**
   * Save an edited image into a new media entity.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   *   Ajax response.
   */
  public function saveImage() {
    $data = json_decode(file_get_contents("php://input"), TRUE);

    $n = 0;
    $filename = $data['filename'];
    do {
      $newfilename = $filename . '_' . ++$n . '.jpg';
      $newpath = DRUPAL_ROOT . '/sites/default/files/' . $data['directory'] . '/' . $newfilename;
    } while (file_exists($newpath));

    // Save image, process through 'convert' command to reduce file size.
    $tmpPath = file_directory_temp() . '/' . $newfilename;

//  $this->writeImage($newpath, $data['imgBase64']);
    $this->writeImage($tmpPath, $data['imgBase64']);
    $this->convertImage($tmpPath, $newpath);

    $file = File::create(['uri' => 'public://atoms/' . $newfilename]);
    $file->save();

    // Create the media entity.
    $media = $this->entityTypeManager->getStorage('media')->create(['bundle' => 'image']);

    // Assign the media name
    $media->name->setValue($data['sceneName']);

    // Get the image and thumbnail values - not sure this does anything.
    $image = $media->get('image')->getValue();
    $thumb = $media->get('thumbnail')->getValue();

    // if we are overwriting then duplicate the old media entity.
    $media = ($data['overwrite'] == "TRUE") ? $media : $media->createDuplicate();

    // Set published status and moderation state.
    $media->status->setValue(NODE_PUBLISHED);
    $media->moderation_state->setValue('published');

    // Set the image
    $image[0]['target_id'] = $file->id();
    $media->get('image')->setValue(($image));

    // Set the thumbnail.
    $thumb[0]['target_id'] = $file->id();
    $media->get('thumbnail')->setValue($thumb);

    // Set the changed time to current time.
    $media->get('changed')->setValue(REQUEST_TIME);

    // Save the media entity.
    $media->save();

    // Re-read the media to get the newly assigned mid.
    $media = $this->entityTypeManager->loadEntityByUuid('media', $media->uuid->value);

    // Read in the Atom, assign the media entity and save.
    $atom = $this->entityTypeManager->getStorage('node')->load($data['atomNid']);
    $atom->field_media->target_id = $media->id();
    $atom->save();

    // @TODO - return confirmation message.
    $response = new AjaxResponse();
    return $response;
  }
}
