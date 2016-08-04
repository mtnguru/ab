/**
 * @file - atomizer.js
 *
 */

Drupal.atomizer.producers.platonic_solidsC = function (_viewer) {
  var viewer = _viewer;

  var createView = function () {
    viewer.object.addAtoms();

    return;
  };

  return {
    createView: createView
  };
};
