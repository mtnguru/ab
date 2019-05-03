/**
 * @file - prod_atom_builder.js
 *
 * This 'producer' creates the view with a single atom for editing 
 * with the atom_builder.
 */

(function ($) {

  Drupal.atomizer.prod_atom_builderC = function (_viewer) {
    let viewer = _viewer;
    let mouseMode = 'electronsAdd';
    let atom;
    let $sceneName = $('.scene--name, .az-scene-name, .az-canvas-labels', viewer.context);
    let $atomInformation = $('.atom--information', viewer.context);
    let $atomProperties = $('.atom--properties', viewer.context);

    var $protonsColor = $('#edit-proton-colors--wrapper', viewer.context);
    var protonColor;


    viewer.objects = [];

    const deleteObject = (key) => {
      let object = viewer.objects[key];
      if (object) {
        viewer.scene.remove(object);
        viewer[object.name].deleteObject(object);
        delete(viewer.objects[object.az.id]);
      }
      else {
        console.log(`Could not delete object - not found: ${key}`);
      }
    }

    const addObject = (object) => {
      viewer.objects[object.az.id] = object;
      viewer.scene.add(object);
    };

    const clearScene = function clearScene () {
      var keys = Object.keys(viewer.objects);
      if (keys.length) {
        for (let key in viewer.objects) {
          if (viewer.objects.hasOwnProperty(key)) {
            deleteObject(key);
          }
        }
      }
    };

    // Attach functions for external access/api
    const getObject = () => atom;

    let createIntersectLists = () => {
    };

    /**
     * Return the objects which are active for hovering
     *
     * @returns {*}
     */
    var hoverObjects = function hoverObjects() {
      switch (mouseMode) {
        case 'none':
          return null;
        case 'electronsAdd':
          return atom.az.intersect.visibleParticles;
        case 'protonsAdd':
          return atom.az.intersect.optionalProtons;
        case 'protonsColor':
          return atom.az.intersect.visibleProtons;
        case 'inner-faces':
          return atom.az.intersect.hoverInnerFaces;
        case 'outer-faces':
          return atom.az.intersect.hoverOuterFaces;
      }
    };

    const mouseUp = (event, distance) => viewer.dir_atom.mouseUp(event, distance, mouseMode);

    const mouseDown = (event, distance) => viewer.dir_atom.mouseDown(event, distance, {mouseMode, protonColor});

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
      viewer.dir_atom = Drupal.atomizer.dir_atomC(viewer);

      // Load and display the default atom
      var userAtomNid = localStorage.getItem('atomizer_builder_atom_nid');
      if (atom) {
        viewer.atom.deleteObject(atom);
      }
      nid = (!userAtomNid || userAtomNid == 'undefined') ? 249 : userAtomNid;
      viewer.atom.loadObject({
        nid: nid,
        type: 'atom',
      });

      viewer.atom_select.setSelectedAtom(nid);
    };

    var objectLoaded = function (_atom) {
      atom = _atom;
//    console.log(`dir_atom_builder::objectLoaded ${atom.az.nid}`);
      viewer.producer.clearScene();
      localStorage.setItem('atomizer_builder_atom_nid', atom.az.nid);
      atom.az.id = "A1";
      viewer.dir_atom.objectLoaded(atom);

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
        name: atom.az.name,   // Use atom name as the scene name
        sceneNid: atom.az.nid
      };
      viewer.labels.display();
      viewer.producer.addObject(atom);

      viewer.render();
    };

    const initMouse = () => {
      var $mouseBlock = $('#blocks--mouse-mode', viewer.context);
      $protonsColor.addClass('az-hidden');
      if ($mouseBlock.length) {
        mouseMode = $mouseBlock.find('input[name=mouse]:checked').val();
        // Add event listeners to mouse mode form radio buttons
        var $mouseRadios = $mouseBlock.find('#edit-mouse--wrapper input');
        $mouseRadios.click(function (event) {
          console.log('mode: ' + event.target.value);
          mouseMode = event.target.value;
          if (mouseMode == 'protonsColor') {
            $protonsColor.removeClass('az-hidden');
          } else {
            $protonsColor.addClass('az-hidden');
          }
        });

        // Add event listeners to proton colors block
        // Set default color
        $mouseBlock.find('#proton-original-color').addClass('selected');
        protonColor = 'original';

        var $colorRadios = $mouseBlock.find('.proton-color');

        // Set the background color of buttons
        $colorRadios.each(function () {
          var name = $(this).attr('id').split("-")[1];
          if (name != 'original') {
            var color = viewer.theme.getColor('proton-' + name + '--color', 'lighten');
            $(this).css('background-color', color.hex);
          }
        });

        // Set button click event handler.
        $colorRadios.click(function (event) {
          $colorRadios.removeClass('selected');
          $(this).addClass('selected');
          var $input = $(this).parent().parent().find('input');
          $input.prop('checked', true);
          protonColor = $input.val();
        });
      }
    };

    const explode = (value) => {
      viewer.dir_atom.explode(atom, value);
    };

    initMouse();

    return {
      createView,
      objectLoaded,

      deleteObject,
      getObject,
      addObject,
      clearScene,

      explode,

      mouseUp,
      mouseDown,

      intersect: () => atom.az.intersect,
      hovered: (hovered) => viewer.dir_atom.hovered(mouseMode, hovered),
      hoverObjects: hoverObjects,
    };
  };

})(jQuery);
