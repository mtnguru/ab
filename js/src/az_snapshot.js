/**
 * @file - az_snapshot.js
 *
 * Takes pictures of the canvas, saves them to drupal.
 */

// Wrap code in jQuery
(function ($) {
  Drupal.atomizer.snapshotC = function (_viewer) {

    let viewer = _viewer;
    let snapshotType = 'single';
    let audio = $('#snapshot--shutter audio', viewer.context)[0];

    function takeSnapshot(settings) {
      // Play the click sound
      if (audio) {
        audio.volume = .2;
        audio.play();
      }

      // Save the current size of the canvas
      let width = viewer.canvas.width;
      let height = viewer.canvas.height;

      // Change canvas size to 2560x2560 pixels
      viewer.canvas.width  = settings['width'] || 2560;
      viewer.canvas.height = settings['height'] || 2560;
      viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
      viewer.renderer.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
      viewer.camera.aspect = viewer.canvas.width / viewer.canvas.height;
      viewer.camera.updateProjectionMatrix();
      viewer.render();

      // Create image from canvas
      img = viewer.canvas.toDataURL('image/jpeg');

      // Put canvas back to original size.
      viewer.canvas.width = width;
      viewer.canvas.height = height;
      viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
      viewer.renderer.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
      viewer.camera.aspect = viewer.canvas.width / viewer.canvas.height;
      viewer.camera.updateProjectionMatrix();
      viewer.render();

      let filename = settings.filename || viewer.scene.az.name;
      filename = filename.replace(/ /g, "-").toLowerCase();

      Drupal.atomizer.base.doAjax(
        '/ajax/saveImage',
        {
          type: 'atom',
          sceneNid: viewer.scene.az.sceneNid,
          action: 'saveImage',
          filename: filename,
          directory: 'atoms',
          overwrite: settings.overwrite || false,
          sceneName: viewer.scene.az.name,
          imgBase64: img,
          imageType: settings.imageType,
        },
        imageSaved
      );

      function imageSaved(response) {
        return;
      }
    }

    /**
     * Initialize all controls.
     */
    function init() {
    }

    function buttonClicked(event) {
      switch (event.target.id) {
        case 'snapshot--shutter':
          takeSnapshot({
            nid: viewer.scene.az.sceneNid,
            width: 1240,
            height: 1240,
            filename: viewer.scene.az.name,
            overwrite: true,
            imageType: 'snapshot',
          });
          break;
        case 'snapshot--save':
          if (snapshotType == 'single') {
            takeSnapshot({
              nid: viewer.scene.az.sceneNid,
              width: 1240,
              height: 1240,
              filename: viewer.scene.az.name,
              overwrite: true,
              imageType: 'snapshot',
            });
          } else {
            let cycle = $('.snapshot-cycle', viewer.context).is(':checked');
            if (cycle) {
            } else {
              takeSnapshot({
                nid: viewer.scene.az.sceneNid,
                width: 1240,
                height: 1240,
                filename: `${viewer.scene.az.name}--${snapsnotType}`,
                overwrite: true,
                imageType: 'snapshot',
              });
            }
          }
          break;
      }
    }

    function radioClicked(target) {
      let args = target.id.split('--');
      if (args[1] == 'set') {
        snapshotType = args[2];
        // Set the snapshot type?  Is this needed?
      }
      return;
    }

    /**
     * Interface to this module.
     */
    return {
      takeSnapshot,
      init,
      buttonClicked,
      radioClicked,
    }
  };
})(jQuery);
