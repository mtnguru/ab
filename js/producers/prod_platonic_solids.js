/**
 * @file - prod_platonic_solids.js
 *
 */

Drupal.atomizer.producers.platonic_solidsC = function (_viewer) {
  var viewer = _viewer;
  viewer.controls = Drupal.atomizer.controlsC(viewer);
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.atom = Drupal.atomizer.atomC(viewer);
  var atomFilename;

  var createView = function () {

    var atom;

    atom = viewer.atom.createAtom({ protons: [0,1,2,3], state: 'tetrahedron' });
    atom.position.set( 400, 0,  -200);

    atom = viewer.atom.createAtom({ protons: [0,1,2,3,4,5,6,7,8,9,10,11], state: 'hexahedron' });
    atom.position.set(   0, 0,  -200);

    atom = viewer.atom.createAtom({ protons: [0,1,2,3,4,5,6,7,8,9,10,11], state: 'octahedron' });
    atom.position.set(-400, 0,  -200);

    atom = viewer.atom.createAtom({ protons: [0,1,2,3,4,5,6,7,8,9,10,11], state: 'icosahedron' });
    atom.position.set( 275, 0,   200);

    atom = viewer.atom.createAtom({ protons: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], state: 'dodecahedron' });
    atom.position.set(-275, 0,   200);

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
