/**
 * @file - prod_platonic_duals.js
 *
 */

Drupal.atomizer.prod_platonic_dualsC = function (_viewer) {
  var viewer = _viewer;
  viewer.controls = Drupal.atomizer.controlsC(viewer);
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.sprites = Drupal.atomizer.spritesC(viewer);
  viewer.labels = Drupal.atomizer.labelsC(viewer);
  viewer.shapes = Drupal.atomizer.shapesC(viewer);
  viewer.atom = Drupal.atomizer.atomC(viewer);
  
  viewer.objects = [];
  const addObject = (object) => {
    let numObjects = Object.keys(viewer.objects).length;
    viewer.objects[object.az.id] = object;
    viewer.scene.add(object);
  };

  var createView = function () {

    var atom;
    var radians = 90 / 360 * 2 * Math.PI;

    // Tetrahedron/Tetrahedron
    atom = viewer.atom.createAtom({state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var scale = .3;
    atom.scale.set(scale,scale,scale);
    atom.rotation['init_y'] = radians;
    atom.rotation['x'] = radians;
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var scale = .65;
    atom.scale.set(scale,scale,scale);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var scale = 1.7;
    atom.scale.set(scale,scale,scale);
    atom.rotation['init_y'] = radians;
    atom.rotation['x'] = radians;
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({state: 'tetrahedron' });
    atom.position.set(  400, 0, 150);
    var scale = 5;
    atom.scale.set(scale,scale,scale);
    viewer.producer.addObject(atom);

    // Octahedron/Hexahedron/Octahedron
    atom = viewer.atom.createAtom({ state: 'hexahedron' });
    atom.position.set(  -400, 0, 150);
    var scale = .55;
    atom.scale.set(scale,scale,scale);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ state: 'octahedron' });
    atom.position.set(  -400, 0, 150);
    var scale = 1.0;
    atom.scale.set(scale,scale,scale);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ state: 'hexahedron' });
    atom.position.set(  -400, 0, 150);
    var scale = 1.4;
    atom.scale.set(scale,scale,scale);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ state: 'octahedron' });
    atom.position.set(  -400, 0, 150);
    var scale = 2.8;
    atom.scale.set(scale,scale,scale);
    viewer.producer.addObject(atom);


    // Icosahedron/Dedecahedron/Icosahedron
    atom = viewer.atom.createAtom({ state: 'dodecahedron' });
    atom.position.set(  0, 0, -150);
    var scale = .70;
    atom.scale.set(scale,scale,scale);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ state: 'icosahedron' });
    atom.position.set(  0, 0, -150);
    var scale = 1.15;
    atom.scale.set(scale,scale,scale);
    atom.rotation['init_y'] = radians;
    atom.rotation['x'] = radians;
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ state: 'dodecahedron' });
    atom.position.set(  0, 0, -150);
    viewer.producer.addObject(atom);

    atom = viewer.atom.createAtom({ state: 'icosahedron' });
    atom.position.set(  0, 0, -150);
    var scale = 1.70;
    atom.scale.set(scale,scale,scale);
    atom.rotation['init_y'] = radians;
    atom.rotation['x'] = radians;
    viewer.producer.addObject(atom);

    viewer.render();


    return;
  };

  return {
    createView: createView,
    setDefaults: () => null,
    hoverObjects: () => [],
    mouseUp: () => null,
    mouseUp: () => null,
    mouseMove: () => null,
    addObject: addObject,
  };
};
