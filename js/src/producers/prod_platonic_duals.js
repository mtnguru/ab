/**
 * @file - prod_platonic_duals.js
 *
 */

Drupal.atomizer.producers.platonic_dualsC = function (_viewer) {
  var viewer = _viewer;
  viewer.controls = Drupal.atomizer.controlsC(viewer);
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.sprites = Drupal.atomizer.spritesC(viewer);
  viewer.shapes = Drupal.atomizer.shapesC(viewer);
  viewer.atom = Drupal.atomizer.atomC(viewer);

  var createView = function () {

    var atom;
    var radians = 90 / 360 * 2 * Math.PI;

    // Tetrahedron/Tetrahedron
    atom = viewer.atom.createObject({state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var scale = 2.7;
    atom.scale.set(scale,scale,scale);

    atom = viewer.atom.createObject({ state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    atom.rotation['init_y'] = radians;
    atom.rotation['x'] = radians;

    atom = viewer.atom.createObject({state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var scale = .45;
    atom.scale.set(scale,scale,scale);

    // Octahedron/Hexahedron/Octahedron
    atom = viewer.atom.createObject({ state: 'octahedron' });
    atom.position.set(  -400, 0, 150);
    var scale = .7;
    atom.scale.set(scale,scale,scale);


    atom = viewer.atom.createObject({ state: 'hexahedron' });
    atom.position.set(  -400, 0, 150);

    atom = viewer.atom.createObject({ state: 'octahedron' });
    atom.position.set(  -400, 0, 150);
    var scale = 2;
    atom.scale.set(scale,scale,scale);


    // Icosahedron/Dedecahedron/Icosahedron
    atom = viewer.atom.createObject({ state: 'icosahedron' });
    atom.position.set(  0, 0, -150);
    var scale = 1.15;
    atom.scale.set(scale,scale,scale);
    atom.rotation['init_y'] = radians;
    atom.rotation['x'] = radians;

    atom = viewer.atom.createObject({ state: 'dodecahedron' });
    atom.position.set(  0, 0, -150);

    atom = viewer.atom.createObject({ state: 'icosahedron' });
    atom.position.set(  0, 0, -150);
    var scale = 1.70;
    atom.scale.set(scale,scale,scale);
    atom.rotation['init_y'] = radians;
    atom.rotation['x'] = radians;


    return;
  };

  var setDefaults = function (){};
  var mouseUp = function (){viewer.render();}
//var hoverObjects = function () {};
  var hovered = function () {};

  return {
    createView: createView,
    setDefaults: setDefaults,
    mouseUp: mouseUp,
//  hoverObjects: hoverObjects,
    hovered: hovered
  };
};
