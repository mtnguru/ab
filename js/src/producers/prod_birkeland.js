/**
 * @file - az_birkeland.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

(function ($) {

  Drupal.atomizer.producers.birkelandC = function (_viewer) {
    var viewer = _viewer;
    var mouseMode;

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
    var hovered = function hovered(objects) {
      switch (mouseMode) {
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
    function mouseUp(event, distance) {
      event.preventDefault();
      switch (event.which) {
        case 1:   // Select/Unselect protons to add an electron to.
          switch (mouseMode) {
            case 'electronsAdd_breakit':
              break;
          }
          break;

        case 2:
          // Middle button always sets the edit nuclet
/*        var intersects = viewer.controls.findIntersects(visibleProtons);
          if (intersects.length == 0) {
            viewer.render();
            return false;
          } else {
            viewer.render();
            return false;
          } */
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
      localStorage.setItem('atomizer_birkeland_nid', bc.az.nid);
      createIntersectLists();
      viewer.scene.az = {
        title: bc.az.title,    // Use object title as scene title
        name: bc.az.name,      // Use object name as the scene name
        objectNid: bc.az.nid,  // Nid of current birkeland current
        bc: bc                 // Birkeland current object
      };

      $('opacity--')
      for (var c in bc.cylinders) {
        if (bc.cylinders.hasOwnProperty(c)) {
          var conf = bc.cylinders[c].conf;
          if (conf.name) {
            $('#particles-' + c + '--opacity .az-name', viewer.context).html(conf.name);
            $('#cylinders-' + c + '--opacity .az-name', viewer.context).html(conf.name);
            $('#particles-' + c + '--opacity .az-color', viewer.context).css('background', '#' + conf.color.toString(16));
            $('#cylinders-' + c + '--opacity .az-color', viewer.context).css('background', '#' + conf.color.toString(16));
          }
        }
      }

      viewer.render();
    };

    /**
     * Create the view - add any objects to scene.
     */
    var createView = function () {
      // Start birkelandC and animationC
      viewer.birkeland = Drupal.atomizer.birkelandC(viewer);
      viewer.animation = Drupal.atomizer.animationC(viewer);

      // Load and display the initial birkeland current
      var objectNid = localStorage.getItem('atomizer_birkeland_nid');
      objectNid = ((!objectNid || objectNid == 'undefined') ? 627 : objectNid);  // Loads a birkeland content type
      viewer.birkeland.loadObject(objectNid);

      // Set the ID of the scene select radio buttons - scene--select--610
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
          viewer.scene.remove(viewer.scene.az.bc);
          viewer.birkeland.loadObject(event.target.value);
        }
      });

      // Enable the scene select label to accept a click also.
      $radios.siblings('label').click(function (event) {
        var input =$(this).siblings('input')[0];
        $(input).prop('checked', true);
        viewer.birkeland.loadObject(event.target.value);
      });

    };

    var loadBirkeland = function loadBirkeland(filename) {
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadYml',
        { component: 'birkeland--select',
          filepath: 'config/objects/birkeland/' + filename + '.yml',
        },
        birkelandLoaded
      );
    };

    var birkelandLoaded = function birkelandLoaded(results) {
      var conf = results[0].ymlContents;
      var bc = viewer.birkeland.createScene(conf);
    };

    // Initialize Event Handlers

    var $mouseBlock = $('#blocks--mouse-mode', viewer.context);
    if ($mouseBlock.length) {
      mouseMode = $mouseBlock.find('input[name=mouse]:checked').val();
      // Add event listeners to mouse mode form radio buttons
      var $mouseRadios = $mouseBlock.find('#edit-mouse--wrapper input');
      $mouseRadios.click(function (event) {
        console.log('mode: ' + event.target.value);
        mouseMode = event.target.value;
      });
    }

    function applyControl (id, value) {
      var bc = viewer.scene.az.bc;
      if (id == 'cylinders--extrude') {           // Expand the Y axis
        viewer.birkeland.extrudeCylinders(bc, value);
        viewer.render();
      } else if (id == 'cylinders--radius') {     // Change radius of all cylinders
        for (var c in bc.cylinders) {
          if (bc.cylinders.hasOwnProperty(c)) {
            var cyl = bc.cylinders[c];
            cyl.position.y = value * cn;
            cn++;
          }
        }
        viewer.render();
      }
    }

    return {
      createView: createView,
      setDefaults: setDefaults,
      mouseUp: mouseUp,
      hoverObjects: hoverObjects,
      hovered: hovered,
      objectLoaded: objectLoaded,
      applyControl: applyControl
    };
  };

})(jQuery);
