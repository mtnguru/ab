/**
 * @file - atomizer.js
 *
 */

Drupal.atomizer.producers.workbenchC = function (_viewer) {
  var viewer = _viewer;

  var createView = function () {
    var object = viewer.object;
    viewer.scene.add(object.createIcoLet({x: 0, y: 92, z: -300}));
    viewer.scene.add(object.createIcoLet({x: 0, y: 92, z: 0}));
    viewer.scene.add(object.createIcoLet({x: 0, y: 92, z: 300}));

    viewer.scene.add(object.createPentaLet({x: -300, y: 67, z: -300}));
    viewer.scene.add(object.createPentaLet({x: -300, y: 67, z: 0}));
    viewer.scene.add(object.createPentaLet({x: -300, y: 67, z: 300}));

    viewer.scene.add(object.createTetraLet({x: 300, y: 67, z: -300}));
    viewer.scene.add(object.createTetraLet({x: 300, y: 67, z: 0}));
    viewer.scene.add(object.createTetraLet({x: 300, y: 67, z: 300}));

    return;
  };

  return {
    createView: createView
  };
};
