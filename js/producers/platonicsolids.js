/**
 * @file - platonicsolids.js
 *
 */

Drupal.atomizer.producers.platonicsolidsC = function (_viewer) {
  var viewer = _viewer;
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.nucleus = Drupal.atomizer.nucleusC(viewer);
  var nucleusFilename;

  var createView = function () {
    nucleusFilename = viewer.view.defaultNucleus;
    viewer.nucleus.loadNucleus(
      'config/nucleus/' + nucleusFilename,
      {
        position: {
          x: 0,
          y: 0,
          z: 0
        }
      }
    );

    return;
  };

  return {
    createView: createView
  };
};
