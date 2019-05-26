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
    let audio = $('#blocks--snapshot audio', viewer.context)[0];

    function takeSnapshot(settings) {
      // Play the click sound
      audio.volume = .2;
      audio.play();

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
      filename = filename.replace(/ /g, "-");

      Drupal.atomizer.base.doAjax(
        '/ajax/saveImage',
        {
          sceneNid: viewer.scene.az.sceneNid,
          action: 'saveImage',
          filename: filename,
          directory: 'atoms',
          overwrite: settings.overwrite || false,
          sceneName: viewer.scene.az.atomName,
          imgBase64: img
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
      if (event.target.id == 'snapshot--save') {
        if (snapshotType == 'single') {
          takeSnapshot({
            width: 1240,
            height: 1240,
            filename: `${viewer.scene.az.atomName}`,
            overwrite: true,
          });
        } else {
          let cycle = $('.snapshot-cycle', viewer.context).is(':checked');
          if (cycle) {
          } else {
            takeSnapshot({
              width: 1240,
              height: 1240,
              filename: `${viewer.scene.az.atomName}--${snapsnotType}`,
              overwrite: true,
            });
          }
        }
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
