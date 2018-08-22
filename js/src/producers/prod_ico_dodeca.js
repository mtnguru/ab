/**
 * @file - prod_ico_dodeca.js
 *
 */

Drupal.atomizer.producers.ico_dodecaC = function (_viewer) {
  var viewer = _viewer;
  viewer.controls = Drupal.atomizer.controlsC(viewer);
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.atom = Drupal.atomizer.atomC(viewer);

  var createView = function () {
    var scale = .59;

    // Rings
    viewer.theme.set('rings', 'proton--color-style', 'radios');
    var atomRings = viewer.atom.createObject({ protons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], state: 'icosahedron' });
    atomRings.position.set(  350, 100, -150);

    atomRings = viewer.atom.createObject({ state: 'dodecahedron' });
    atomRings.position.set(  350, 100, -150);
    atomRings.scale.set(scale,scale,scale);

    // Pairs
    viewer.theme.set('pairs', 'proton--color-style', 'radios');
    var atomPairs = viewer.atom.createObject({ protons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], state: 'icosahedron' });
    atomPairs.position.set(  0, 100, 100);

    atomPairs = viewer.atom.createObject({ state: 'dodecahedron' });
    atomPairs.position.set(  0, 100, 100);
    atomPairs.scale.set(scale,scale,scale);

    // Triple Alpha
    viewer.theme.set('alpha3', 'proton--color-style', 'radios');
    var atomAlpha = viewer.atom.createObject({ protons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], state: 'icosahedron' });
    atomAlpha.position.set(  -350, 100, -150);

    atomAlpha = viewer.atom.createObject({ state: 'dodecahedron' });
    atomAlpha.position.set(  -350, 100, -150);
    atomAlpha.scale.set(scale,scale,scale);

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
