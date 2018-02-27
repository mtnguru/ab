/**
 * @file - prod_platonic_duals.js
 *
 */

Drupal.atomizer.producers.platonic_dualsC = function (_viewer) {
  var viewer = _viewer;
  viewer.controls = Drupal.atomizer.controlsC(viewer);
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.atom = Drupal.atomizer.atomC(viewer);

  var createView = function () {

    var atom;

    // Tetrahedron/Tetrahedron
    atom = viewer.atom.createAtom({state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var scale = 2.8;
    atom.scale.set(scale,scale,scale);

    atom = viewer.atom.createAtom({ state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var radians = 90 / 360 * 2 * Math.PI;
    atom.rotation['init_y'] = radians;
    atom.rotation['x'] = radians;

    atom = viewer.atom.createAtom({state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var scale = .4;
    atom.scale.set(scale,scale,scale);

    // Octahedron/Hexahedron/Octahedron
    atom = viewer.atom.createAtom({ state: 'octahedron' });
    atom.position.set(  -400, 0, 150);
    var scale = .7;
    atom.scale.set(scale,scale,scale);


    atom = viewer.atom.createAtom({ state: 'hexahedron' });
    atom.position.set(  -400, 0, 150);

    atom = viewer.atom.createAtom({ state: 'octahedron' });
    atom.position.set(  -400, 0, 150);
    var scale = 2;
    atom.scale.set(scale,scale,scale);


    // Icosahedron/Dedecahedron/Icosahedron
    atom = viewer.atom.createAtom({ state: 'icosahedron' });
    atom.position.set(  0, 0, -150);
    var scale = 1.23;
    atom.scale.set(scale,scale,scale);

    atom = viewer.atom.createAtom({ state: 'dodecahedron' });
    atom.position.set(  0, 0, -150);

    atom = viewer.atom.createAtom({ state: 'icosahedron' });
    atom.position.set(  0, 0, -150);
    var scale = 1.92;
    atom.scale.set(scale,scale,scale);


    return;
  };

  var setDefaults = function (){};
  var mouseClick = function (){viewer.render();}
//var hoverObjects = function () {};
  var hovered = function () {};

  return {
    createView: createView,
    setDefaults: setDefaults,
    mouseClick: mouseClick,
//  hoverObjects: hoverObjects,
    hovered: hovered
  };
};
