/**
 * @file - prod_molecule_builder.js
 *
 */

Drupal.atomizer.producers.molecule_builderC = function (_viewer) {
  var viewer = _viewer;

  var createView = function () {
    viewer.object.addAtoms();

    return;
  };

  return {
    createView: createView
  };
};
