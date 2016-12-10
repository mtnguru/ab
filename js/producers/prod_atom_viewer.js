/**
 * @file - prod_atom_viewer.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

Drupal.atomizer.producers.atom_viewerC = function (_viewer) {
  var viewer = _viewer;

  /**
   * Return the objects which are active for hovering
   *
   * @returns {*}
   */
  var hoverObjects = function hoverObjects() {
    return [];
  };

  /**
   * User has hovered over a proton, set transparency to .5.
   *
   * @param event
   */
  var hovered = function hovered(protons) {
    return;
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
  var mouseClick = function mouseClick(event) {
    switch (event.which) {
      case 1:
        event.preventDefault();
        break;
      case 3:
        event.preventDefault();
        break;
    }
  };


  /**
   * Set Default values for any forms.
   */
  function setDefaults() {
    userAtomFile = localStorage.getItem('atomizer_viewer_atom');
    if (userAtomFile && userAtomFile != 'undefined') {
      var selectyml = document.getElementById('atom--selectyml');
      if (selectyml) {
        select = selectyml.querySelector('select');
        select.value = userAtomFile;
      }
    }
  }

  var atomLoaded = function atomLoaded(atom) {
    localStorage.setItem('atomizer_viewer_atom_nid', atom.az.nid);
  };

  /**
   * Create the view - add any objects to scene.
   */
  var createView = function () {
    viewer.nuclet = Drupal.atomizer.nucletC(viewer);
    viewer.atom = Drupal.atomizer.atomC(viewer);

    // Load and display the default atom
    viewer.view.atom = viewer.atom.loadAtom(viewer.atomizer.nid);

    // Create the ghost proton.  Displayed when hovering over attachment points.  Initially hidden
    viewer.view.ghostProton = viewer.nuclet.makeProton({type: 'ghost'}, 1, {x: 300, y: 50, z: 0});
  };

  return {
    createView: createView,
    setDefaults: setDefaults,
    mouseClick: mouseClick,
    hoverObjects: hoverObjects,
    hovered: hovered,
    atomLoaded: atomLoaded
  };
};


