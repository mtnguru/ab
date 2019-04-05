/**
 * @file - prod_atom_builder.js
 *
 * This 'producer' creates the view with a single atom for editing 
 * with the atom_builder.
 */

(function ($) {

  Drupal.atomizer.producers.atom_builderC = function (_viewer) {
    var viewer = _viewer;
    var atom;
    /**
     * Create the view - add any objects to scene.
     */
    var createView = function () {
      let ctx = viewer.canvas.getContext("2d");
      viewer.nuclet = Drupal.atomizer.nucletC(viewer);
      viewer.atom = Drupal.atomizer.atomC(viewer);
      viewer.shapes = Drupal.atomizer.shapesC(viewer);
      viewer.sprites = Drupal.atomizer.spritesC(viewer);
      viewer.labels = Drupal.atomizer.labelsC(viewer);
      viewer.animation = Drupal.atomizer.animationC(viewer);
      viewer.prod_atom = Drupal.atomizer.prod_atomC(viewer);

      // Load and display the default atom
      var userAtomNid = localStorage.getItem('atomizer_builder_atom_nid');
      viewer.atom.loadObject((!userAtomNid || userAtomNid == 'undefined') ? 249 : userAtomNid);
    };

    var objectLoaded = function (_atom) {
//    atom = _atom;
//    viewer.scene.az = {
//      title: atom.az.title, // Use atom title as scene title
//      name: atom.az.name,  // Use atom name as the scene name
//       sceneNid: atom.az.nid
//    };
//    viewer.labels.display();
    };

    return {
      createView: createView,
      objectLoaded: function (atom) { return viewer.prod_atom.objectLoaded(atom)},
      mouseUp: function (event) { return viewer.prod_atom.mouseUp(event)},
      hovered: function (hovered) { return viewer.prod_atom.hovered(hovered)},
      hoverObjects: function () { return viewer.prod_atom.hoverObjects()},
    };
  };

})(jQuery);
