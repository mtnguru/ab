/**
 * @file - prod_atom_builder.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

(function ($) {

  Drupal.atomizer.producers.atom_builderC = function (_viewer) {
    var viewer = _viewer;
    var atom;

    var mouseMode = 'none';
    var editNuclet;

    var $nucletBlock = $('.blocks--nuclet-list', viewer.context);
    var $nucletList =  $('.nuclet--list', viewer.context);
    var $nucletFormBlock = $('.blocks--nuclet-form', viewer.context);
    var $nucletButtons;
    if ($nucletFormBlock.length) {
      var nucletAngle =       $('.nuclet--attachAngle', viewer.context)[0];
      var nucletAngleSlider = $('.nuclet--attachAngle--az-slider', viewer.context)[0]
      var nucletAngleValue =  $('.nuclet--attachAngle--az-value', viewer.context)[0];
      var nucletDelete =      $('.nuclet--delete', viewer.context)[0];

      var nucletAttach0 =     $('#edit-nuclet-grow-0', viewer.context)[0];
      var nucletAttach1 =     $('#edit-nuclet-grow-1', viewer.context)[0];
    }

    var hoverInnerFaces = [];
    var hoverOuterFaces = [];
    var optionalProtons = [];
    var visibleProtons = [];
    var highlightedProton;
    var highlightedFace;
    var highlightedIcosa;
    var highlightedOuterFace;

    /**
     * User has changed the nuclet angle slider.
     *
     * @param event
     */
    function onAngleChanged(event) {
      viewer.atom.changeNucletAngle(editNuclet.az.id, event.target.value);
      viewer.render();
    }

    /**
     * User pressed the Delete button on the nuclet edit form.
     *
     * @param event
     */
    function onNucletDelete(event) {
      // Delete the protons from the
      viewer.atom.deleteNuclet(editNuclet.az.id);
      delete viewer.atom.az().nuclets[editNuclet.az.id];
      createNucletList(viewer.atom.atom);
      createProtonLists();
      viewer.render();

      $nucletFormBlock.addClass('az-hidden');
    }

    /**
     * User pressed a nuclet Add button - so add a nuclet.
     * @param event
     */
    function onNucletAddButton(event) {
      var id = event.target.id.split('-',2)[1];
      var nuclet = viewer.atom.addNuclet(id);
      viewer.atom.updateValenceRings();
      createProtonLists();
      setEditNuclet(nuclet);
      viewer.render();
    }

    /**
     * Return the objects which are active for hovering
     *
     * @returns {*}
     */
    var hoverObjects = function hoverObjects() {
      switch (mouseMode) {
        case 'none':
          return null;
        case 'protonsAdd':
          return optionalProtons;
        case 'protonsColor':
          return visibleProtons;
        case 'nucletsEdit':
          return visibleProtons;
        case 'inner-faces':
          return viewer.objects.icosaFaces;
        case 'outer-faces':
          return hoverOuterFaces;
      }
    };

    /**
     * User has hovered over a proton, set transparency to .5.
     *
     * @param event
     */
    var hovered = function hovered(objects) {
      switch (mouseMode) {
        case 'none':
          return [];
        case 'protonsAdd':
          var opacity = viewer.theme.get('proton--opacity');

          // If there is already a highlighted proton
          if (highlightedProton) {
            // Return if the proton is already highlighted
            if (objects.length && highlightedProton == objects[0]) return;

            var proton = highlightedProton.object;

            // Change the proton back to it's original color and visibility.
            var color =viewer.theme.getColor(proton.name + '--color');
            proton.material.color = color;
            proton.material.visible = proton.az.visible;
            highlightedProton = null;
          }

          if (objects.length) {
            // Return if this proton isn't optional
            if (!objects[0].object.az.optional || !objects[0].object.az.active) return;

            // Highlight the proton
            highlightedProton = objects[0];
            var proton = highlightedProton.object;
            proton.material.visible = true;
            var color =viewer.theme.getColor('proton-ghost--color');
            proton.material.color = color;
          }
          break;

        case 'protonsColor':
          break;

        case 'nucletsEdit':
//      Get the nuclet form working, display all current nuclets in a tree.
          break;

        case 'inner-faces':
          var opacity = viewer.theme.get('icosaFaces--opacity--az-slider');

          // If there is already a highlighted proton
          if (highlightedFace) {
            if (objects.length && highlightedFace == objects[0]) return;
            highlightedFace.color.setHex(parseInt("0x00ff00"));
            highlightedIcosa.geometry.colorsNeedUpdate = true;
            highlightedFace = null;
          }

          if (objects.length) {
            highlightedFace = objects[0].face;
            highlightedIcosa = objects[0].object;
            highlightedFace.color.setHex(parseInt("0x00ffff"));
            highlightedIcosa.geometry.colorsNeedUpdate = true;
            highlightedIcosa.geometry.elementsNeedUpdate = true;
            highlightedIcosa.geometry.dynamic = true;
            highlightedIcosa.geometry.verticesNeedUpdate = true;
          }
          break;

        case 'outer-faces':
          var opacity = viewer.theme.get(' icosaOutFaces--opacity');

          // If there is already a highlighted proton
          if (highlightedOuterFace) {
            if (objects.length && highlightedOuterFace == objects[0]) return;
            highlightedOuterFace.color.setHex(parseInt("0xff00ff"));
            highlightedOuterFace = null;
          }

          if (objects.length) {
            highlightedOuterFace = objects[0].face;
            highlightedOuterFace.color.setHex(parseInt("0xffff00"));
          }
          objects[0].object.geometry.colorsNeedUpdate = true;
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
    var mouseClick = function mouseClick(event) {
      switch (event.which) {

        case 1:       // Left mouse click
        case 3:       // Right click
          event.preventDefault();
          switch (mouseMode) {
            case 'none':
              break;

            case 'protonsAdd':
              var intersects = viewer.controls.findIntersects(optionalProtons);
              if (intersects.length) {
                var proton = intersects[0].object;
                if (proton.az.optional) {
                  proton.az.visible = !proton.az.visible;
                  proton.material.visible = proton.az.visible;
                  viewer.atom.updateValenceRings();
                  createProtonLists();
                  viewer.render();
                }
                viewer.atom.updateProtonCount();
              }
              break;

            case 'protonsColor':
              var intersects = viewer.controls.findIntersects(visibleProtons);
              if (intersects.length == 0) {
              }
              break;

            case 'nucletsEdit':
              var intersects = viewer.controls.findIntersects(visibleProtons);
              if (intersects.length == 0) {
                // Pop down the nuclet edit dialog.
                if (editNuclet) {
                  viewer.nuclet.highlight(editNuclet, false);
                }
                $nucletFormBlock.addClass('az-hidden');
                editNuclet = undefined;
                return false;
              } else {
                // Initialize to current nuclet.
                setEditNuclet(intersects[0].object.parent.parent);
                $nucletFormBlock.removeClass('az-hidden');
                $nucletFormBlock.insertAfter($nucletList.find('.' + editNuclet.name));
                return false;
              }
              break;

            case 'inner-faces':
              var objects = viewer.controls.findIntersects(hoverInnerFaces);
              if (objects.length) {
                var oldFaces = objects[0].object;
                var face = objects[0].face;

                for (var i = 0; i < oldFaces.geometry.faces.length; i++) {
                  if (oldFaces.geometry.faces[i] === face) {
                    var index = oldFaces.geometry.reactiveState.indexOf(i);
                    if (index > -1) {
                      oldFaces.geometry.reactiveState.splice(index, 1);
                    } else {
                      oldFaces.geometry.reactiveState.push(i);
                    }
                    break;
                  }
                }

                viewer.objects.icosaFaces = null;
                var faces = viewer.nuclet.createGeometryFaces(
                  oldFaces.name,
                  1,
                  oldFaces.geometry,
                  oldFaces.geometry.compConf.rotation || null,
                  oldFaces.geometry.reactiveState
                );
                var nucletGroup = oldFaces.parent;
                viewer.objects[oldFaces.name] = [];
                viewer.objects[oldFaces.name].push(faces);
                faces.geometry.reactiveState = oldFaces.geometry.reactiveState;
                faces.geometry.compConf = oldFaces.geometry.compConf;
                nucletGroup.remove(oldFaces);
                nucletGroup.add(faces);
                viewer.render();
              }
              break;
          }
      }
    };

    /**
     * Create the visibleProtons and optionalProtons lists.
     */
    function createProtonLists() {
      optionalProtons = [];
      visibleProtons = [];
      var nuclets = viewer.atom.az().nuclets;
      for (var id in nuclets) {
        if (nuclets.hasOwnProperty(id)) {
          var protons = nuclets[id].az.protons;
          for (var p = 0; p < protons.length; p++) {
            if (protons[p]) {
              if (protons[p].az.active)   optionalProtons.push(protons[p]);
              if (protons[p].az.visible)  visibleProtons.push(protons[p]);
            }
          }
        }
      }
    }

    /**
     * Create the button or label for a grow point
     *
     * @param id
     * @param nucletAttach
     */
    function createNucletAttachItem(id, nucletAttach) {
      var label = nucletAttach.getElementsByTagName('LABEL')[0];
      var div = nucletAttach.getElementsByTagName('DIV')[0];

      label.innerHTML = id;

      if (viewer.atom.az().nuclets[id]) {
        div.innerHTML = viewer.atom.az().nuclets[id].az.state;
      } else {
        div.innerHTML = '';
        var button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('name', 'nuclet-add-' + id + '-button');
        button.setAttribute('value', 'Add');
        button.classList.add('nuclet-list-button');
        button.id = 'nuclet-' + id;
        button.addEventListener('click', onNucletAddButton);
        nucletAttach.getElementsByTagName('DIV')[0].appendChild(button);
      }
    }

    /**
     * Carry out the selection of a new nuclet to edit.
     *
     * @param nuclet
     */
    function setEditNuclet(nuclet) {
      var id = nuclet.az.id;
      createNucletList(viewer.atom.atom);
      if (editNuclet) {
        viewer.nuclet.highlight(editNuclet, false);
      }
      viewer.nuclet.highlight(nuclet, true);
      viewer.render();

      // Move the nuclet edit form to the appropriate nuclet
      $nucletFormBlock.insertAfter($nucletList.find('.nuclet-' + id));

      // Initialize the nuclet form
      if (nuclet.az.conf.state != 'hydrogen' && nuclet.az.conf.state != 'helium') {
        var $select = $('#nuclet--state--' + nuclet.az.conf.state, viewer.context);
        $select[0].checked = true;
        nucletAngleSlider.value = nuclet.az.conf.attachAngle || 1;
        nucletAngleValue.value = nuclet.az.conf.attachAngle || 1;
      }
      // Show/Hide the delete, angle and attach points
      if (id == 'N0') {
        nucletDelete.classList.add('az-hidden');
        nucletAngle.classList.add('az-hidden');
      } else {
        nucletDelete.classList.remove('az-hidden');
        nucletAngle.classList.remove('az-hidden');
      }

      if (nuclet.az.conf.state != 'initial' &&
          nuclet.az.conf.state != 'final') {
        $('.nuclet--grow-label', viewer.context).addClass('az-hidden');
        $('.edit-nuclet-grow-0', viewer.context).addClass('az-hidden');
        $('.edit-nuclet-grow-1', viewer.context).addClass('az-hidden');
      }
      else {
        $('.nuclet--grow-label', viewer.context).removeClass('hidden');
        $('.edit-nuclet-grow-0', viewer.context).removeClass('az-hidden');
        $('.edit-nuclet-grow-1', viewer.context).removeClass('az-hidden');
      }
      // Add buttons to add nuclet.
      createNucletAttachItem(id + '0', nucletAttach0);
      createNucletAttachItem(id + '1', nucletAttach1);
      editNuclet = nuclet;
    }

    /**
     * Create a list of nuclets for the nuclet edit form.
     */
    function createNucletList(atom) {
      /**
       * Recursive function to extract a nuclets information.
       *
       * @param id
       * @param spacing
       * @returns {string}
       */
      function addNucletToList(id, shell) {
        var nuclet = atom.az.nuclets[id];
        var numProtons = 0;
        var numNeutral = 0;
        for (var p in nuclet.az.protons) {
          var proton = nuclet.az.protons[p];
          if (proton.az && proton.az.visible) {
            if (proton.az.type == 'neutral') {
              numNeutral++;
            }
            else {
              numProtons++;
            }
          }
        }
        var out = '<div class="nuclet shell-' + shell + ' ' + nuclet.name + '">' +
          id + ' ' + nuclet.az.state +
          ' - ' + numProtons;
        if (numNeutral) {
          out += ' - ' + numNeutral;
        }
        out += '</div>\n';

        // Recursively add the children nuclets.
        var grow0 = atom.az.nuclets[id + '0'];
        var grow1 = atom.az.nuclets[id + '1'];
        if (grow0 || grow1) {
          if (grow0) { out += addNucletToList(id + '0', shell + 1); }
          if (grow1) { out += addNucletToList(id + '1', shell + 1); }
        }
        return out;
      }

      // Save the nuclet form before overwriting the list.
      if ($nucletFormBlock.length) {
        $nucletFormBlock.insertAfter($('.blocks--nuclet-list'), viewer.context);
        $nucletList.html(addNucletToList('N0', 0));

        $nucletButtons = $nucletList.find('.nuclet');
        $nucletButtons.click(function(e) {
          var nucletName = e.target.innerHTML.split(' ')[0];
          var nuclet = viewer.atom.getNuclet(nucletName);
          if ($nucletFormBlock.hasClass('az-hidden') || nuclet !== editNuclet) {
            setEditNuclet(nuclet);
            $nucletFormBlock.removeClass('az-hidden');
          }
          else {
            if (editNuclet) {
              viewer.nuclet.highlight(editNuclet, false);
              viewer.render();
            }
            $nucletFormBlock.addClass('az-hidden');
          }
        });
      } else {
        $nucletList.html(addNucletToList('N0', 0));
      }
    }

    /**
     * Set Default values for any forms.
     */
    function setDefaults() {
      var userAtomFile = localStorage.getItem('atomizer_builder_atom_nid');
      if (userAtomFile && userAtomFile != 'undefined') {
        var selectyml = $('.atom--selectyml', viewer.context)[0];
        if (selectyml) {
          select = selectyml.querySelector('select');
          select.value = userAtomFile;
        }
      }
    }

    var atomLoaded = function atomLoaded(atom) {
      localStorage.setItem('atomizer_builder_atom_nid', atom.az.nid);
      createProtonLists();
      if (viewer.objects.icosaFaces) {
        hoverInnerFaces = viewer.objects.icosaFaces;
      }
      if (viewer.objects.icosaOutFaces) {
        hoverOuterFaces = viewer.objects.icosaOutFaces;
      }
      createNucletList(atom);
    };

    /**
     * Create the view - add any objects to scene.
     */
    var createView = function () {
      viewer.nuclet = Drupal.atomizer.nucletC(viewer);
      viewer.atom = Drupal.atomizer.atomC(viewer);

      // Load and display the default atom
      var userAtomNid = localStorage.getItem('atomizer_builder_atom_nid');
      viewer.view.atom = viewer.atom.loadAtom((!userAtomNid || userAtomNid == 'undefined') ? 249 : userAtomNid);

      // Create the ghost proton.  Displayed when hovering over attachment points.  Initially hidden
      viewer.view.ghostProton = viewer.nuclet.makeProton(0, {type: 'ghost'}, 1, {x: 300, y: 50, z: 0});
    };

    /////////// Attach event listeners

    if ($nucletFormBlock.length) {
      // Add Event Listener to attachAngle slider
      nucletAngleSlider.addEventListener('input', onAngleChanged);
      nucletDelete.addEventListener('click', onNucletDelete);

      // Add event listeners to the nuclet edit form state radio buttons
      var $radios = $('#edit-nuclet-state .az-control-radios', viewer.context);
      $radios.once('az-processed').each(function() {
        $(this).attr('id', 'nuclet--state--' + $(this).val());
      });
      $radios.click(function (event) {
        if (event.target.tagName == 'INPUT') {
          var nuclet = viewer.atom.changeNucletState(editNuclet, event.target.value);
          createProtonLists();
          setEditNuclet(nuclet);
          viewer.render();
        }
//      $(this).attr('id', $(this).attr('id') + '--' + $(this).val());
//      $(this).attr('id', 'nuclet--state--' + $(this).val());
      });
    }

    var mouseBlock = $('.blocks--mouse-mode', viewer.context)[0];
    if (mouseBlock) {
      // Add event listeners to mouse mode form radio buttons
      var $radios = $('.blocks--mouse-mode .az-control-radios', viewer.context);
      $radios.click(function (event) {
        if (event.target.tagName == 'INPUT') {
          console.log('mode: ' + event.target.value);
          mouseMode = event.target.value;
          $(this).attr('id', $(this).id + '--' + $(this).val());
          if ($(this).attr('checked') == 'checked') {
            mouseMode = $(this).val();
          }
        }
      });
    }

    return {
      createView: createView,
      setDefaults: setDefaults,
      mouseClick: mouseClick,
      hoverObjects: hoverObjects,
      hovered: hovered,
      atomLoaded: atomLoaded
    };
  };

})(jQuery);
