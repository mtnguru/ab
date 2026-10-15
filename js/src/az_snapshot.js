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
    //let audio = true;
    let downloadLink = document.createElement('a');


    /**
     * takeSnapshot()
     */
    async function takeSnapshot(settings, viewer2, callback = null) {
      const cleanup = () => {
        // any cleanup code you had (revoke URLs, etc.)
      };

      try {
        const blob = await new Promise((resolve, reject) => {
          viewer.canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('toBlob returned null'))),
            settings.imageType || 'image/png',
            settings.quality || 0.92
          );
        });

        const formData = new FormData();
        const safeFilename = settings.filename
          .replace(/[^a-z0-9-_]/gi, '-')
          .toLowerCase() + '.png';

        formData.append('file', blob, safeFilename);
        formData.append('nid', settings.nid || viewer.scene.az.sceneNid);
        formData.append('action', 'saveImage');
        formData.append('type', 'atom');
        formData.append('overwrite', settings.overwrite ? 'true' : 'false');
        formData.append('sceneName', viewer.scene.az.name);
        formData.append('imageType', settings.imageType);

        const response = await fetch('/ajax/saveImage', {
          method: 'POST',
          body: formData,
          credentials: 'same-origin',
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log('Image saved successfully:', data);

        // Success callback / event
        if (typeof imageSaved === 'function') {
          imageSaved(data);
        }
        if (typeof callback === 'function') {
          callback(data);
        }

      } catch (err) {
        console.error('Snapshot save failed:', err);
        alert('Failed to save atom snapshot. Check console for details.');
      } finally {
        cleanup();
      }
    }

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
