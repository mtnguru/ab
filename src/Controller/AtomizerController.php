<?php

namespace Drupal\atomizer\Controller;

use Drupal\atomizer\Ajax\GenCommand;
use Drupal\atomizer\Ajax\LoadAtomListCommand;
use Drupal\atomizer\AtomizerInit;
use Drupal\atomizer\Dialogs\AtomizerDialogs;
use Drupal\Component\Serialization\Json;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\File\FileSystemInterface;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Drupal\node\Entity\Node;
use Drupal\Core\Url;

use Drupal\Component\Serialization\Yaml;

use Drupal\atomizer\Ajax\RenderNodeCommand;
use Drupal\atomizer\Ajax\LoadYmlCommand;
use Drupal\atomizer\Ajax\SaveYmlCommand;
use Drupal\atomizer\Ajax\LoadAtomCommand;
use Drupal\atomizer\Ajax\LoadMoleculeCommand;
use Drupal\atomizer\Ajax\LoadNodeCommand;
use Drupal\atomizer\Ajax\LoadDialogCommand;
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
      $container->get('entity_type.manager')
    );
  }

  /**
   * renderArray - Execute the service renderRoot
   * @param array $build
   * @return string
   */
  private function renderArray(array $build): string {
    return \Drupal::service('renderer')->renderRoot($build);
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
    $response->addCommand(new RenderNodeCommand($data, $this->renderArray($htmlContents)));

    return $response;
  }

  /**
   * Load a Node and render it.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function loadYml() {
    $data = json_decode(file_get_contents("php://input"), true);

    $module_path = DRUPAL_ROOT . '/' . \Drupal::service('extension.path.resolver')->getPath('module', 'atomizer');
    $path = $module_path . '/' . $data['filepath'];
    if (!file_exists($path)) {
       $path =  dirname($path) . '/Default.yml';
       $data['message'] = 'Could not find ' . $data['filepath'] . ' -- Default.yml file loaded.';
       $data['filepath'] = $path;
       $data['themeId'] = 'default';
    }
    $response = new AjaxResponse();
    $ymlContents = Yaml::decode(file_get_contents($module_path . '/' . $data['filepath']));
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
    $module_path = DRUPAL_ROOT . '/' . \Drupal::service('extension.path.resolver')->getPath('module', 'atomizer');
    $data['success'] = file_put_contents($module_path . '/' . $data['filepath'], Yaml::encode($data['ymlContents']));
    $response->addCommand(new SaveYmlCommand($data));

    return $response;
  }

  /**
   * List the contents of a directory.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function listDirectory() {
    $data = json_decode(file_get_contents("php://input"), true);

    $module_path = DRUPAL_ROOT . '/' . \Drupal::service('extension.path.resolver')->getPath('module', 'atomizer');
    $files = \Drupal::service('file_system')->scanDirectory($module_path . '/' . $data['directory'], '/\.yml/');
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
      '#title' => 'Save Atom',
      '#url' => Url::fromRoute('entity.node.edit_form',['node' => $data['conf']['nid']]),
      '#attached' => ['library' => ['core/drupal.dialog.ajax']],
      '#attributes' => [
        'class' => ['use-ajax'],
        'data-dialog-type' => 'modal',
        'data-dialog-options' => Json::encode([
          'dialogClass' => 'az-dialog az-atom-form',
          'width' => '700px',
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
    $data['link'] = $this->renderArray($link);

    $node = Node::load($data['conf']['nid']);
    $element = $node->field_element->entity;
    $data['element'] = $element->label();
    $data['atomicNumber'] = $element->field_atomic_number->value;
    $enid = $element->field_default_atom->target_id;
    $anid = $node->id();
    $data['defaultAtom'] = ($node->id() == $element->field_default_atom->target_id) ? '1' : '0';

    if ($node->hasField('field_bounding_sphere') && !$node->get('field_bounding_sphere')->isEmpty()) {
      $boundingSphere = $node->field_bounding_sphere->entity;
      $data['boundingSphere'] = [
        'x' => $boundingSphere->field_center_x->value,
        'y' => $boundingSphere->field_center_y->value,
        'z' => $boundingSphere->field_center_z->value,
        'radius' => $boundingSphere->field_radius->value,
        'ratio' => $boundingSphere->field_ratio->value,
        'volume' => $boundingSphere->field_volume->value,
      ];
    }

    // Render the node/atom using teaser atom_viewer mode.
    $data['atomName'] = $node->label();
    $data['atomTitle'] = '<h3 class="scene-name"><a href="/node/' . $node->id() . '">' . $node->label() . '</a></h3>';

    // Build the properties block using the atom_viewer view'.
    $build = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'atom_viewer');

    // Add the create link to Wikipedia Isotopes page for this element
    $element = strtolower($node->field_element->entity->label());
    $isotopeUrl = 'https://en.wikipedia.org/wiki/Isotopes_of_' . $element;
    $build['links'] = [
      '#type' => 'link',
      '#title' => 'Isotopes',
      '#attributes' => [
        'title' => t('Wikipedias Isotope page for this element'),
        'target' => '_blank',
      ],
      '#url' => Url::fromUri($isotopeUrl),
    ];
    // Render the properties block.
    $data['properties'] = $this->renderArray($build);

    // Render the atom information using teaser view.
    $build = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'teaser');
    $data['information'] = $this->renderArray($build);

    // Get the atomic structure field.
    $field = $node->field_atomic_structure;
    $data['atomConf'] = (empty($field)) ? 'Object not found' : Yaml::decode($field->value);

    $response->addCommand(new LoadAtomCommand($data));
    return $response;
  }

  /**
   * Load hierarchical list of elements and their isotopes.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function loadAtomList()
  {
    $data = json_decode(file_get_contents("php://input"), true);
    $list = NULL;
    $cid = 'loadAtomList';
    $access = ($data['access']) ? $data['access'] : 'permissions';
    if ($cache = \Drupal::cache()->get($cid . '1')) {   // The . '1' prevents cache from working.
//  if ($cache = \Drupal::cache()->get($cid)) {   // The . '1' prevents cache from working.
      $list = $cache->data;
    } else {
      // Query for the elements and atoms.
      $elements = AtomizerInit::queryElements();
      $atoms = AtomizerInit::queryAtoms($access)['results'];

      // Go through each atom and count number of isotopes per element
      $isobars = [];
      foreach ($atoms as $atom) {
        $eid = $atom->field_element_target_id;
        if (!empty($elements[$eid])) {
          // Count the number of isotopes
          $elements[$eid]['isotopes'][] = $atom;
          $isobars[$atom->field_protons_value][] = $atom;
          if (empty($elements[$eid]['numIsotopes'])) {
            $elements[$eid]['numIsotopes'] = 1;
          } else {
            $elements[$eid]['numIsotopes']++;
          }
        }
      }

      // Create list of elements and their isotopes.
      $list = [];
      $image_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('large');
      $file_url_generator = \Drupal::service('file_url_generator');

      foreach ($elements as $element) {
        $defaultAtom = null;
        $imageUrl = '';
        $title = '';

        if ($element['numIsotopes'] > 0) {
          $defaultAtomNid = $element['defaultAtom'] ?? $element['isotopes'][0]->nid ?? NULL;

          if (!empty($defaultAtomNid) && !empty($atoms[$defaultAtomNid])) {
            $defaultAtom = $atoms[$defaultAtomNid];
            $title = $defaultAtom->title ?? '';

            // New: Use field_atom_image (media reference)
            if ($defaultAtom->uri) {
              if ($image_style) {
                $imageUrl = $image_style->buildUrl($defaultAtom->uri);
              } else {
                $imageUrl = $file_url_generator->generateAbsoluteString($defaultAtom->uri);
              }
            } else {
              \Drupal::logger('atomizer')->warning('Missing file entity for media @mid on atom @nid', [
                '@mid' => 209,
                '@nid' => $defaultAtomNid,
              ]);
            }
          }
        }

        $name = strtolower($element['name']);
        $list[$name] = [
          'symbol' => $element['symbol'],
          'name' => $element['name'],
          'defaultAtomName' => $title,
          'nid' => $element['nid'],
          'default_atom_nid' => $defaultAtomNid,
          'stability' => $defaultAtom->name ?? 'Not Set',
          'atomic_number' => $element['atomicNumber'],
          'image_url' => $imageUrl,
          'pte_row' => $element['pte_row'],
          'pte_column' => $element['pte_column'],
          'sam_row' => $element['sam_row'],
          'sam_column' => $element['sam_column'],
          'num_isotopes' => $element['numIsotopes'],
          'num_isobars' => $element['numIsobars'],
          'valence' => $element['valence'],
          'isotopes' => $element['numIsotopes'] ? $element['isotopes'] : NULL,
        ];
      }

//    \Drupal::cache()->set($cid, $list, Cache::PERMANENT, ['node_list:atom']);
    }

    $data['list'] = &$list;
    $response = new AjaxResponse();
    $response->addCommand(new LoadAtomListCommand($data));
    return $response;
  }

  /**
   * Load a molecule.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function loadMolecule() {
    $response = new AjaxResponse();
    $data = json_decode(file_get_contents("php://input"), true);
    $link = [
      '#type' => 'link',
      '#title' => 'Save Molecule',
      '#url' => Url::fromRoute('entity.node.edit_form',['node' => $data['conf']['nid']]),
      '#attached' => ['library' => ['core/drupal.dialog.ajax']],
      '#attributes' => [
        'class' => ['use-ajax'],
        'data-dialog-type' => 'modal',
        'data-dialog-options' => Json::encode([
          'dialogClass' => 'az-dialog az-molecule-form',
          'width' => '700px',
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
    $data['link'] = $this->renderArray($link);

    $node = Node::load($data['conf']['nid']);

    // Get the atomic structure field. -- append it to the conf array.
    $field = $node->field_molecule_structure;
    if ($field == empty('field')) {
      $data['conf']['error'][] = 'field_molecule_structure field is empty';
    } else {
      $data['conf'] = array_merge($data['conf'], YAML::decode($field->value));
    }

    // Render the node/atom using teaser atom_viewer mode.
    $data['name'] = $node->label();
    $data['title'] = '<h3 class="scene-name"><a href="/node/' . $node->id() . '">' . $node->label() . '</a></h3>';

    // Build the properties block using the atom_viewer view'.
    $build = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'atom_viewer');

    // Render the properties block.
    $data['properties'] = $this->renderArray($build);

    // Render the atom information using teaser view.
    $build = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'teaser');
    $data['information'] = $this->renderArray($build);


    $response->addCommand(new LoadMoleculeCommand($data));
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
//  system($cmd);
  }

  static private $dialogs = NULL;
  /**
   * Render a dialog - why do I need this?  Look at imager code.
   */
  public function loadDialog() {
    $data = json_decode(file_get_contents("php://input"), TRUE);

    if (empty(self::$dialogs)) {
      self::$dialogs = new AtomizerDialogs();
    }

    $dialog = self::$dialogs->buildDialog($data);
    $data['content'] = $this->renderArray($dialog['content']);
    if (!empty($dialog['buttonpane'])) {
      $data['buttonpane'] = $this->renderArray($dialog['buttonpane']);
    }
    $data['id'] = $dialog['id'];

    $response = new AjaxResponse();
    return $response->addCommand(new LoadDialogCommand($data));

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
   * Save Binding Energy for an atom
   */
  public function saveBindingEnergy() {
    $data = json_decode(file_get_contents("php://input"), TRUE);
    $atom = Node::load($data['nid']);
    if (!empty($data['lines'] != '0')) {
      $samBE = $data['lines'] * 2.225;
      $atom->set('field_sam_lines', $samBE);
      if ($atom->hasField('field_actual_be') && !$atom->get('field_actual_be')->isEmpty()) {
        $actualBE = $atom->field_actual_be->value;
        $perc = (($samBE > $actualBE) ? $actualBE / $samBE : -$samBE / $actualBE) * 100;
        $atom->set('field_be_sam_lines', $samBE);
        $atom->set('field_be_sam_lines_', $perc);
      }
    }
    $atom->setNewRevision(TRUE);
    $retcode = $atom->save();
    return new AjaxResponse();
  }

  /**
   * Save data for an atom - currently just saving binding energy.
   */
  public function saveAtom() {
    $data = json_decode(file_get_contents("php://input"), TRUE);
    $atom = Node::load($data['nid']);
    if ($data['be_sam_nuclets'] != '0') {
      $atom->set('field_be_sam_nuclets', $data['be_sam_nuclets']);
    }
    if ($data['be_sam_nuclets_perc'] != '0%') {
      $atom->set('field_be_sam_nuclets_', str_replace('%', '', $data['be_sam_nuclets_perc']));
    }
    $atom->setNewRevision(TRUE);
    $retcode = $atom->save();
    $nuclets = $data['be_sam_nuclets'];
    $perc = $data['be_sam_nuclets_perc'];
    \Drupal::logger('atomizer')->notice("AtomizerController::saveAtom - $retcode  nuclets: $nuclets  nuclets perc: $perc");
    return new AjaxResponse();
  }

  /**
   * _saveAtomImage()
   *
   * @param $data
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   * @throws \Drupal\Core\Entity\EntityStorageException
   * @throws \Drupal\Core\TypedData\Exception\ReadOnlyException
   */

  public function _saveAtomImage($data) {
    \Drupal::logger('atomizer')->notice('_saveAtomImage - enter');

    $atom = $this->entityTypeManager->getStorage('node')->load($data['sceneNid']);
    if (!$atom) {
      throw new \Exception("Node not found: {$data['sceneNid']}");
    }

    $filename = $data['filename'] . '.png';

    // 1. Decode base64 (robust version)
    $base64_string = $data['imgBase64'];
    if (strpos($base64_string, 'data:') === 0) {
      $base64_string = explode(',', $base64_string, 2)[1];
    }
    $base64_string = str_replace(["\r", "\n", " ", "\t"], '', $base64_string);

    $mod = strlen($base64_string) % 4;
    if ($mod) {
      $base64_string .= str_repeat('=', 4 - $mod);
    }

    $image_data = base64_decode($base64_string, TRUE);
    if ($image_data === FALSE) {
      throw new \Exception('Invalid base64 image data - decoding failed');
    }

    // 2. Write to temporary://
    $tmp_uri = 'temporary://' . $filename;
    $file_repository = \Drupal::service('file.repository');

    $temp_file = $file_repository->writeData(
      $image_data,
      $tmp_uri,
      FileSystemInterface::EXISTS_REPLACE
    );

    if (!$temp_file) {
      throw new \Exception('Failed to write temporary file');
    }

    // 3. Move to permanent public location
    $destination = 'public://atoms_primary/' . $filename;
    $file = $file_repository->move(
      $temp_file,
      $destination,
      FileSystemInterface::EXISTS_REPLACE
    );

    if (!$file) {
      throw new \Exception('Failed to move file to permanent destination');
    }

    $file->setPermanent();
    $file->save();

    // 4. Clean up old media + file (if exists)
    if ($atom->hasField('field_atom_image') && !$atom->field_atom_image->isEmpty()) {
      $old_media = $atom->field_atom_image->entity;
      if ($old_media instanceof Media) {
        $old_file = $old_media->field_media_image->entity;
        if ($old_file instanceof File) {
          $old_file->delete();
        }
        $old_media->delete();
      }
    }

    // 5. Create new Media entity
    $media = Media::create([
      'bundle' => 'image',  // ← Verify this matches your media bundle
      'uid' => $atom->getOwnerId(),
      'name' => $data['filename'],
      'status' => 1,
      'field_media_image' => [
        'target_id' => $file->id(),
        'alt' => $data['alt'] ?? $filename,
        'title' => $data['title'] ?? '',
      ],
    ]);
    $media->save();

    // 6. Attach media to node
    $atom->field_atom_image->setValue(['target_id' => $media->id()]);
    $atom->save();

    \Drupal::logger('atomizer')->notice(
      '_saveAtomImage - success | Media: @media | Node: @node',
      ['@media' => $media->id(), '@node' => $atom->id()]
    );

    return new AjaxResponse();
  }

  /**
   * Save an edited image into a new media entity.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   *   Ajax response.
   */
  public function saveImage() {
    $data = json_decode(file_get_contents("php://input"), TRUE);
    if ($data['type'] == 'atom' && $data['imageType'] == 'primary') {
      return self::_saveAtomImage($data);
    }

    $n = 0;
    $filename = $data['filename'];
    do {
      $newfilename = $filename . '_' . ++$n . '.jpg';
      $newpath = DRUPAL_ROOT . '/sites/default/files/' . $data['directory'] . '/' . $newfilename;
    } while (file_exists($newpath));

    // Save image, process through 'convert' command to reduce file size.
    $tmpPath = $temp_dir = \Drupal::service('file_system')->getTempDirectory() . '/' . $newfilename;
    $this->writeImage($tmpPath, $data['imgBase64']);
    $this->convertImage($tmpPath, $newpath);

    $file = File::create(['uri' => 'public://atoms/' . $newfilename]);
    $file->save();

    // Create the media entity.
    $media = $this->entityTypeManager->getStorage('media')->create(['bundle' => 'image']);

    // Assign the media name
    $media->name->setValue($data['atomName']);

    // Get the image and thumbnail values - not sure this does anything.
    $image = $media->get('image')->getValue();
    $thumb = $media->get('thumbnail')->getValue();

    // if we are overwriting then duplicate the old media entity.
    $media = ($data['overwrite'] == "TRUE") ? $media : $media->createDuplicate();

    // Set published status and moderation state.
//  $media->status->setValue(NODE_PUBLISHED);
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
//  $media = $this->entityTypeManager->loadEntityByUuid('media', $media->uuid->value);

    // Read in the Atom, assign the media entity and save.
    $atom = $this->entityTypeManager->getStorage('node')->load($data['sceneNid']);
    $atom->field_media->target_id = $media->id();
    $atom->save();

    // @TODO - return confirmation message.
    $response = new AjaxResponse();
    return $response;
  }

  public function deleteAtomImages()
  {
    $data = json_decode(file_get_contents("php://input"), true);
    // Clear the styles directory for all atoms.
    system('rm -r ' . DRUPAL_ROOT . '/sites/default/files/styles/*/*/atoms_primary/*');
    system('rm ' . DRUPAL_ROOT . '/sites/default/files/atoms_primary/*');

    $response = new AjaxResponse();
    $response->addCommand(new GenCommand($data));
    return $response;
  }

  /**
   * Save a CSV file of coordinates of protons, electrons, etc.
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function saveCoordinates() {
    $data = json_decode(file_get_contents("php://input"), true);
    $atomicNumber = (($data['atomicNumber'] < 10) ? '0' : '') . $data['atomicNumber'];
    $module_path = DRUPAL_ROOT . '/' . \Drupal::service('extension.path.resolver')->getPath('module', 'atomizer');
    $path = $module_path .
              '/config/coordinates/' .
              $atomicNumber . '.' .
              str_replace(' ', '-',$data['name']) . '.' .
              $data['numProtons'] . '.' .
              $data['defaultAtom'] . '.' .
              $data['nid'] .
              '.csv';
    $f = fopen($path, 'w');
    foreach($data['coordinates'] as $row) {
      fputcsv($f, $row);
    }
    fclose($f);

    $response = new AjaxResponse();
    $response->addCommand(new GenCommand($data));
    return $response;
  }


  /**
   * Load a Birkland current definition file.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   *   Ajax response.
   */
  public function loadNode() {
    $response = new AjaxResponse();
    $data = json_decode(file_get_contents("php://input"), true);

    $node = Node::load($data['conf']['nid']);

    // Render the node using teaser atom_viewer mode.
    $data['nodeName'] = $node->label();
    $data['nodeTitle'] = '<h3 class="scene-name"><a href="/node/' . $node->id() . '">' . $node->label() . '</a></h3>';

    // Get the atomic structure field.
    $type = $node->getType();
    $field = null;
    switch ($type) {
      case 'atom':
        $build = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'atom_viewer');
        $data['properties'] = $this->renderArray($build);

        // Render the node/atom using teaser view mode.
        $build = \Drupal::entityTypeManager()->getViewBuilder('node')->view($node, 'teaser');
        $data['information'] = $this->renderArray($build);

        $field = $node->field_atomic_structure;
        if ($field) {
          $data['nodeConf'] = (empty($field)) ? 'Node not found' : Yaml::decode($field->value);
        }
        break;
      case 'birkeland':
        $field = $node->field_structure;
        $module_path = DRUPAL_ROOT . '/' . \Drupal::service('extension.path.resolver')->getPath('module', 'atomizer');
        $path = $module_path . '/config/objects/birkeland/' . $data['conf']['nid'] . '.yml';
        if (file_exists($path)) {
          $data['nodeConf'] = Yaml::decode(file_get_contents($path));
        } else {
          if ($field) {
            $data['nodeConf'] = (empty($field)) ? 'Node not found' : Yaml::decode($field->value);
          }
        }
        break;
      case 'episode':
        $scenes = [];
        if (!$node->field_scenes->isEmpty()) {
          foreach($node->field_scenes->getValue() as $scene) {
            $pid = $scene['target_id']; // get scene id;
            $scene = \Drupal::entityTypeManager()->getStorage('paragraph')->load($pid);
            $scenes[] = [
              'title' => $scene->field_title->value,
              'type' => $scene->field_scene_type->target_id,
              'script' => Yaml::decode($scene->field_script->value),
              'description' => $scene->field_description->value,
              'description_format' => $scene->field_description->format,
            ];
          }
        }
        $data['scenes'] = $scenes;
        break;
    }
    $response->addCommand(new LoadNodeCommand($data));
    return $response;
  }
}
