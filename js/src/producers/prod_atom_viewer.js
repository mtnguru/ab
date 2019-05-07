/**
 * @file - prod_atom_viewer.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

Drupal.atomizer.prod_atom_viewerC = function (_viewer) {
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

  /**
   * Return the objects which are active for hovering
   *
   * @returns {*}
   */
  var hoverObjects = function hoverObjects(mouse) {
    return [];
  };

  /**
   * User has hovered over a proton, set transparency to .5.
   *
   * @param event
   */
  var mouseMove = function mouseMove(event, mouse) {
//  return;
  };

  /**
   * User has clicked somewhere in the scene with the mouse.
   *
   * If they right clicked on a proton, find the parent nuclet and popup the nuclet edit form.
   * If they right clicked anywhere else, pop down the nuclet edit form.
   *
   * @param event
   * @returns {boolean}
   */
  var mouseUp = function mouseUp(event) {
    switch (event.which) {
      case 1:
//      event.preventDefault();
        break;
      case 3:
//      event.preventDefault();
        break;
    }
  };

  var mouseDown = function mouseDown(event) {
//  event.preventDefault();
  };


  /**
   * Set Default values for any forms.
   */
  function setDefaults() {
    var userAtomFile = localStorage.getItem('atomizer_viewer_atom');
    if (userAtomFile && userAtomFile != 'undefined') {
      var selectyml = $('#atom--selectyml', viewer.context)[0];
      if (selectyml) {
        select = selectyml.querySelector('select');
        select.value = userAtomFile;
      }
    }
  }

  var objectLoaded = function objectLoaded(atom) {
    localStorage.setItem('atomizer_viewer_atom_nid', atom.az.nid);
    viewer.producer.addObject(atom);
    viewer.render();
//  viewer.labels.display();
  };

  /**
   * Create the view - add any objects to scene.
   */
  var createView = function () {
    viewer.nuclet = Drupal.atomizer.nucletC(viewer);
    viewer.atom = Drupal.atomizer.atomC(viewer);

    // Load and display the default atom - done asynchronously
    viewer.atom.loadObject({nid: viewer.atomizer.nid}, null);

    // Create the ghost proton.  Displayed when hovering over attachment points.  Initially hidden
    viewer.view.ghostProton = viewer.nuclet.makeProton(0, {type: 'ghost'}, null, 1, {x: 300, y: 50, z: 0});
  };

  return {
    createView: createView,
    setDefaults: setDefaults,
    hoverObjects: hoverObjects,
    mouseUp: mouseUp,
    mouseDown: mouseDown,
    mouseMove: mouseMove,
    objectLoaded: objectLoaded,
    addObject: addObject,
  };
};


