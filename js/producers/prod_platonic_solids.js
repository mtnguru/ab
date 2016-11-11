/**
 * @file - prod_platonic_solids.js
 *
 */

Drupal.atomizer.producers.platonic_solidsC = function (_viewer) {
  var viewer = _viewer;
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.atom = Drupal.atomizer.atomC(viewer);
  var atomFilename;

  var createView = function () {
    atomFilename = viewer.view.defaultAtom;
    viewer.atom.loadAtom(
      'config/atom/' + atomFilename,
      {
        position: {
          x: 0,
          y: 0,
          z: 0
        }
      }
    );

    return;
  };

  var setDefaults = function () {};
  var mouseClick = function () {};
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
