/**
 * @file - prod_platonic_solids.js
 *
 */

Drupal.atomizer.prod_platonic_solidsC = function (_viewer) {
  var viewer = _viewer;
  viewer.controls = Drupal.atomizer.controlsC(viewer);
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.sprites = Drupal.atomizer.spritesC(viewer);
  viewer.labels = Drupal.atomizer.labelsC(viewer);
  viewer.shapes = Drupal.atomizer.shapesC(viewer);
  viewer.atom = Drupal.atomizer.atomC(viewer);

  viewer.objects = [];
  const addObject = (object) => {
    viewer.objects[object.az.id] = object;
    viewer.scene.add(object);
  };


  var createView = function () {

    var atom;

    atom = viewer.atom.createAtom({ protons: [0,1,2,3], state: 'tetrahedron' });
    atom.position.set( 400, 0,  -200);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ protons: [0,1,2,3,4,5,6,7,8,9,10,11], state: 'hexahedron' });
    atom.position.set(   0, 0,  -200);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ protons: [0,1,2,3,4,5,6,7,8,9,10,11], state: 'octahedron' });
    atom.position.set(-400, 0,  -200);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ protons: [0,1,2,3,4,5,6,7,8,9,10,11], state: 'icosahedron' });
    atom.position.set( 275, 0,   200);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ protons: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], state: 'dodecahedron' });
    atom.position.set(-275, 0,   200);
    viewer.producer.addObject(atom);

    viewer.render();
  };

  var setDefaults = function (){};
  var hoverObjects = () => [];
  var mouseUp   = function () {};
  var mouseDown = function () {};
  var mouseMove = function () {};

  return {
    createView: createView,
    setDefaults: setDefaults,
    hoverObjects: hoverObjects,
    mouseUp: mouseUp,
    mouseDown: mouseDown,
    mouseMove: mouseMove,
    addObject: addObject,
  };
};
