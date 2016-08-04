/**
 * @file - atomizer.js
 *
 */

Drupal.atomizer.producers.atom_builderC = function (_viewer) {
  var viewer = _viewer;
  var nucleus = Drupal.atomizer.nucleusC(viewer);

  var createView = function (nucleusFilename) {
//  nucleus.add(nucleusFilename);

    return;
  };

  return {
    createView: createView
  };
};
