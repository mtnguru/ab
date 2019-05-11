/**
 * @file - prod_pCtable.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

(function ($) {

  Drupal.atomizer.prod_pteC = function (_viewer) {
    var viewer = _viewer;

    /**
     * Return the objects which are active for hovering
     *
     * @returns {*}
     */
    var hoverObjects = function hoverObjects(mouse) {
      switch (mouse.mode) {
        case 'none':
          return null;
        case 'electronsAdd':
          return null;
        case 'protonsAdd':
          return optionalProtons;
      }
    };

    /**
     * User has hovered over a proton, reset last highlighted proton to original color
     * Make the current hovered proton pink.
     *
     * @param event
     */
    var mouseMove = function mouseMove(event, mouse) {
      switch (mouse.mode) {
        case 'none':
          return;

        case 'electronsAdd':
        case 'protonsAdd':

          viewer.render();
          break;
      }
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
    function mouseUp(event, mouse) {
      event.preventDefault();
      switch (event.which) {
        case 1:   // Select/Unselect protons to add an electron to.
          switch (mouse.mode) {
            case 'electronsAdd_breakit':
              viewer.render();
              break;
          }
          break;

        case 2:
          // Middle button always sets the edit nuclet
          viewer.render();
          break;
      } // switch which mouse button
    }

    /**
     * Create the intersect lists used to detect objects that are hovered over.
     */
    function createIntersectLists() {
    }

    /**
     * Set Default values for any forms.
     */
    function setDefaults() {
/*    var userAtomFile = localStorage.getItem('atomizer_builder_atom_nid');
      if (userAtomFile && userAtomFile != 'undefined') {
        var selectyml = $('.atom--selectyml', viewer.context)[0];
        if (selectyml) {
          select = selectyml.querySelector('select');
          select.value = userAtomFile;
        }
      } */
    }

    var objectLoaded = function objectLoaded(bc) {
      localStorage.setItem('atomizer_pte_nid', bc.az.nid);
      createIntersectLists();
      viewer.scene.az = {
        title: bc.az.title, // Use object title as scene title
        name: bc.az.name,  // Use object name as the scene name
        objectNid: bc.az.nid
      };
    };

    /**
     * Create the view - add any objects to scene.
     */
    var createView = function () {
      // Start pteC and animationC
      viewer.pte = Drupal.atomizer.pteC(viewer);
      viewer.animation = Drupal.atomizer.animationC(viewer);

      // Load and display the periodic table.
      var objectNid = localStorage.getItem('atomizer_pte_nid');
      objectNid = ((!objectNid || objectNid == 'undefined') ? 627 : objectNid);  // Loads a pte content type
      viewer.pte.loadObject({nid: objectNid});

      // Set the ID of the scene select radio buttons - scene--select--610  // TODO Do I need scenes for the table?  Not really
      var $radios = $('#edit-scene-select .az-control-radios', viewer.context);
      $radios.once('az-processed').each(function() {
        var id = 'scene--select--' + $(this).val();
        $(this).attr('id', id);
        if ($(this).val() == objectNid) {
          $(this).prop('checked', true);
        }
      });

      // Click on the scene select radio button
      $radios.click(function (event) {
        if (event.target.tagName == 'INPUT') {
          viewer.pte.loadObject({nid: event.target.value});
//        loadPtable(scene, event.target.value);
        }
      });

      // Enable the scene select label to accept a click also.
      $radios.siblings('label').click(function (event) {
        var input =$(this).siblings('input')[0];
        $(input).prop('checked', true);
        viewer.pte.loadObject({nid: event.target.value});
//      loadPtable(scene, input.value);
      });

    };

    var loadPtable = function loadPtable(filename) {
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadYml',
        { component: 'pte--select',
          filepath: 'config/objects/pte/' + filename + '.yml',
        },
        pteLoaded
      );
    };

    var pteLoaded = function pteLoaded(results) {
      var conf = results[0].ymlContents;
      viewer.pte.createScene(conf);
    };

    // Initialize Event Handlers

    /*
    var $mouseBlock = $('#blocks--mouse-mode', viewer.context);
    if ($mouseBlock.length) {
      mouse.mode = $mouseBlock.find('input[name=mouse]:checked').val();
      // Add event listeners to mouse mode form radio buttons
      var $mouseRadios = $mouseBlock.find('#edit-mouse--wrapper input');
      $mouseRadios.click(function (event) {
        console.log('mode: ' + event.target.value);
        mouse.mode = event.target.value;
      });
    }
    */

    return {
      createView: createView,
      setDefaults: setDefaults,
      mouseUp: mouseUp,
      mouseMove: mouseMove,
      hoverObjects: hoverObjects,
      objectLoaded: objectLoaded
    };
  };

})(jQuery);