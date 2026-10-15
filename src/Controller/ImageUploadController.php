<?php

namespace Drupal\atomizer\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\file\FileInterface;
use Drupal\media\MediaInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * REST controller for uploading and updating atom images.
 */
class ImageUploadController extends ControllerBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a new ImageUploadController object.
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
   * Handles POST request to upload or update an atom image.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The incoming request containing the uploaded file.
   * @param \Drupal\node\NodeInterface $node
   *   The atom node to attach/update the image for.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   Success response with media and file details.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException
   * @throws \Symfony\Component\HttpKernel\Exception\BadRequestHttpException
   */
  public function uploadImage(Request $request, NodeInterface $node) {
    // 1. Security: User must be able to update this specific atom node
    if (!$node->access('update')) {
      throw new AccessDeniedHttpException('You do not have permission to edit this atom.');
    }

    // 2. Validate uploaded file
    $files = $request->files;
    if (!$files->has('file') || !$files->get('file') instanceof \Symfony\Component\HttpFoundation\File\UploadedFile) {
      throw new BadRequestHttpException('No valid file uploaded. Expecting multipart "file" field.');
    }

    /** @var \Symfony\Component\HttpFoundation\File\UploadedFile $uploadedFile */
    $uploadedFile = $files->get('file');

    // Only allow PNG
    if ($uploadedFile->getMimeType() !== 'image/png') {
      throw new BadRequestHttpException('Only PNG images are allowed.');
    }

    $originalName = $uploadedFile->getClientOriginalName();
    if (!preg_match('/\.png$/i', $originalName)) {
      throw new BadRequestHttpException('File must have .png extension.');
    }

    // Optional: Validate file size (e.g., max 10MB)
    if ($uploadedFile->getSize() > 10 * 1024 * 1024) {
      throw new BadRequestHttpException('File size exceeds 10MB limit.');
    }

    // 3. Save uploaded file to Drupal managed files
    $destination = 'public://atoms_primary/' . $originalName;
    $file = file_save_upload('file', [], $destination, FILE_EXISTS_REPLACE);

    if (!$file) {
      throw new \RuntimeException('Failed to save uploaded file.');
    }

    $file->setPermanent();
    $file->save();

    // 4. Check for existing media reference
    $existing_media = NULL;
    if ($node->hasField('field_atom_image') && !$node->field_atom_image->isEmpty()) {
      $existing_media = $node->field_atom_image->entity;
    }

    if ($existing_media instanceof MediaInterface) {
      // === UPDATE EXISTING MEDIA ===
      $old_file = $existing_media->field_media_image->entity;

      // Replace image field
      $existing_media->field_media_image = [
        'target_id' => $file->id(),
        'alt' => $originalName,
        'title' => $originalName,
      ];

      // Optional: Update media name to match new filename
      $existing_media->setName($originalName);

      $existing_media->save();

      // Cleanup old file if no longer used anywhere
      if ($old_file instanceof FileInterface) {
        $usage = \Drupal::service('file.usage')->listUsage($old_file);
        if (empty($usage)) {
          $old_file->delete();
        }
      }

      $media = $existing_media;
      $action = 'updated';
    }
    else {
      // === CREATE NEW MEDIA ===
      $media = $this->entityTypeManager->getStorage('media')->create([
        'bundle' => 'image',  // Ensure this matches your media bundle machine name
        'uid' => $this->currentUser()->id(),
        'name' => $originalName,
        'status' => 1,
        'field_media_image' => [
          'target_id' => $file->id(),
          'alt' => $originalName,
          'title' => $originalName,
        ],
      ]);

      $media->save();

      // Attach to atom node
      $node->field_atom_image = ['target_id' => $media->id()];
      $node->save();

      $action = 'created';
    }

    // 5. Build success response
    $file_url_generator = \Drupal::service('file_url_generator');

    return new JsonResponse([
      'status' => 'success',
      'action' => $action,
      'message' => 'Image successfully ' . $action . ' and attached to atom.',
      'media_id' => $media->id(),
      'media_name' => $media->getName(),
      'file_url' => $file_url_generator->generateAbsoluteString($file->getFileUri()),
      'node_id' => $node->id(),
      'timestamp' => \Drupal::time()->getRequestTime(),
    ]);
  }
}
