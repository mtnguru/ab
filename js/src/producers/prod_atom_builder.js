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
    var $sceneName = $('.scene--name, .az-scene-name, .az-canvas-labels', viewer.context);
    var $atomInformation = $('.atom--information', viewer.context);
    var $atomProperties = $('.atom--properties', viewer.context);

    /**
     * Create the view - add any objects to scene.
     */
    var createView = function () {
      let ctx = viewer.canvas.getContext("2d");
      viewer.nuclet = Drupal.atomizer.nucletC(viewer);
      viewer.atom = Drupal.atomizer.atomC(viewer);
      viewer.atom_select = Drupal.atomizer.atom_selectC(viewer);
      viewer.shapes = Drupal.atomizer.shapesC(viewer);
      viewer.sprites = Drupal.atomizer.spritesC(viewer);
      viewer.labels = Drupal.atomizer.labelsC(viewer);
      viewer.animation = Drupal.atomizer.animationC(viewer);
      viewer.prod_atom = Drupal.atomizer.prod_atomC(viewer);

      // Load and display the default atom
      var userAtomNid = localStorage.getItem('atomizer_builder_atom_nid');
      if (atom) {
        viewer.atom.deleteObject(atom);
      }
      viewer.atom.loadObject({
        nid: (!userAtomNid || userAtomNid == 'undefined') ? 249 : userAtomNid,
        type: 'atom',
      });
    };

    var objectLoaded = function (atom) {
      viewer.clearScene();
      localStorage.setItem('atomizer_builder_atom_nid', atom.az.nid);
      atom.az.id = "A1";
      viewer.prod_atom.objectLoaded(atom);
      if ($sceneName) {
        $sceneName.html(atom.az.title);
      }
      if ($atomInformation) {
        $atomInformation.html(atom.az.information);
      }
      if ($atomProperties) {
        $atomProperties.html(atom.az.properties);
      }

      viewer.scene.az = {
        title: atom.az.title, // Use atom title as scene title
        name: atom.az.name,  // Use atom name as the scene name
        sceneNid: atom.az.nid
      };
      viewer.labels.display();
      viewer.addObject(atom);

      viewer.render();
    };

    return {
      createView: createView,
      objectLoaded: objectLoaded,
      getObject: () => atom,
      mouseUp: function (event) { return viewer.prod_atom.mouseUp(event)},
      mouseDown: function (event) { return viewer.prod_atom.mouseDown(event)},
      hovered: function (hovered) { return viewer.prod_atom.hovered(hovered)},
      hoverObjects: function () { return viewer.prod_atom.hoverObjects()},
    };
  };

})(jQuery);
