/**
 * @file - atomizer.js
 *
 */

Drupal.atomizer.producers.moleculesC = function (_viewer) {
  var viewer = _viewer;

  var createView = function () {
    viewer.object.addAtoms();

    return;
  };

  return {
    createView: createView
  };
};
