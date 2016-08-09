/**
 * @file - atomizer.js
 *
 */

Drupal.atomizer.producers.workbenchC = function (_viewer) {
  var viewer = _viewer;
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);

  var createView = function () {
    var nuclet = viewer.nuclet;
    viewer.scene.add(nuclet.createIcosaLet({x: 0, y: 92, z: -300}));
    viewer.scene.add(nuclet.createIcosaLet({x: 0, y: 92, z: 0}));
    viewer.scene.add(nuclet.createIcosaLet({x: 0, y: 92, z: 300}));

    viewer.scene.add(nuclet.createPentaLet({x: -300, y: 67, z: -300}));
    viewer.scene.add(nuclet.createPentaLet({x: -300, y: 67, z: 0}));
    viewer.scene.add(nuclet.createPentaLet({x: -300, y: 67, z: 300}));

    viewer.scene.add(nuclet.createTetraLet({x: 300, y: 67, z: -300}));
    viewer.scene.add(nuclet.createTetraLet({x: 300, y: 67, z: 0}));
    viewer.scene.add(nuclet.createTetraLet({x: 300, y: 67, z: 300}));

    return;
  };

  return {
    createView: createView
  };
};
