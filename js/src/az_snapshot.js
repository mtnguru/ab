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
    let downloadLink = document.createElement('a');

    function takeSnapshot(settings) {
      // Play the click sound
      if (audio) {
        audio.volume = .2;
        audio.play();
      }

      // Save the current size of the canvas
      let width = viewer.canvas.width;
      let height = viewer.canvas.height;

      let $snapshotWidth = $('#snapshot--width--az-slider', viewer.context);
      let $snapshotHeight = $('#snapshot--height--az-slider', viewer.context);

      let nwidth  = 2560;
      let nheight = 2560;
      if (settings['width']) {
        nwidth  = settings['width'];
        nheight = settings['height'];
      } else if ($snapshotWidth) {
        nwidth = $snapshotWidth.val();
        nheight = $snapshotHeight.val();
      }

      // Change canvas size to 2560x2560 pixels
      viewer.canvas.width  = nwidth;
      viewer.canvas.height = nheight;
      viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
      if (viewer.render.setViewport) {
        viewer.renderer.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
      }
      viewer.camera.aspect = viewer.canvas.width / viewer.canvas.height;
      viewer.camera.updateProjectionMatrix();
      viewer.render();

      let $snapshotName = $('.snapshot--name', viewer.context);
      let filename = viewer.scene.az.name;
      if (settings.filename) {
        filename  = settings['width'];
      } else if ($snapshotName) {
        filename = $snapshotName.val();
      }
      filename = filename.replace(/ /g, "-").toLowerCase();

      // Create image from canvas
      let dataurl;
      if (viewer.renderer.name == 'WebGL') {
        dataurl = viewer.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        downloadLink.setAttribute('download', filename + '.png');
        downloadLink.setAttribute('href', dataurl);
        downloadLink.click();
      } else if (viewer.renderer.name == 'CSS3D') {
        window.open(viewer.renderer.domElement.toDataURL('image/png'), 'screenshot');
      }

      // Put canvas back to original size.
      viewer.canvas.width = width;
      viewer.canvas.height = height;
      viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
      if (viewer.render.setViewport) {
        viewer.renderer.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
      }
      viewer.camera.aspect = viewer.canvas.width / viewer.canvas.height;
      viewer.camera.updateProjectionMatrix();
      viewer.render();

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
          imgBase64: dataurl,
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
            overwrite: true,
            imageType: 'snapshot',
          });
          break;
        case 'snapshot--save':
          if (snapshotType == 'single') {
            takeSnapshot({
              nid: viewer.scene.az.sceneNid,
              overwrite: true,
              imageType: 'snapshot',
            });
          } else {
            let cycle = $('.snapshot-cycle', viewer.context).is(':checked');
            if (cycle) {
            } else {
              takeSnapshot({
                nid: viewer.scene.az.sceneNid,
//              filename: `${viewer.scene.az.name}--${snapsnotType}`,
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
