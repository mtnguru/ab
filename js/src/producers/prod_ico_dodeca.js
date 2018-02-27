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

    var atom;

    atom = viewer.atom.createAtom({ protons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], state: 'icosahedron' });
    atom.position.set(  0, 100, -150);

    atom = viewer.atom.createAtom({ state: 'dodecahedron' });
    atom.position.set(  0, 100, -150);
    var scale = .59;
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
