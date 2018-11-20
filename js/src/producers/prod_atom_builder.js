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

//  var mouseMode = $('#blocks--mouse-mode input[name=mouse--mode]:checked', viewer.context).val();
    var mouseMode;
    var editNuclet;

    var $nucletBlock = $('.blocks--nuclet-list', viewer.context);

    var $nucletList = $('.nuclet--list', viewer.context);
    var $nucletFormBlock = $('.blocks--nuclet-form', viewer.context);
    var $nucletButtons;

    var $protonsColor = $('#edit-proton-colors--wrapper', viewer.context);
    var protonColor;
    if ($nucletFormBlock.length) {
      var nucletAngle = $('.nuclet--attachAngle', viewer.context)[0];
      var nucletAngleSlider = $('.nuclet--attachAngle--az-slider', viewer.context)[0]
      var nucletAngleValue = $('.nuclet--attachAngle--az-value', viewer.context)[0];
      var nucletDelete = $('.nuclet--delete', viewer.context)[0];

      var nucletAttach0 = $('#edit-nuclet-grow-0', viewer.context)[0];
      var nucletAttach1 = $('#edit-nuclet-grow-1', viewer.context)[0];
    }

    var hoverInnerFaces = [];
    var hoverOuterFaces = [];
    var optionalProtons = [];
    var visibleProtons = [];
    var selectedProtons = [];
    var selectedNElectron = null;
    var visibleNElectrons = [];
    var visibleParticles = [];
    var highlightedProton;
    var highlightedNElectron;
    var highlightedFace;
    var highlightedIcosa;
    var highlightedOuterFace;

    var nElectronsId = 0;

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
//    event.preventDefault();
      viewer.atom.deleteNuclet(editNuclet.az.id);
      delete viewer.atom.az().nuclets[editNuclet.az.id];
      createNucletList(viewer.atom.atom);
      createIntersectLists();
      viewer.render();

      $nucletFormBlock.addClass('az-hidden');
//    return false;
    }

    /**
     * User pressed a nuclet Add button - so add a nuclet.
     * @param event
     */
    function onNucletAddButton(event) {
      var id = event.target.id.split('-', 2)[1];
      var nuclet = viewer.atom.addNuclet(id);
      viewer.atom.updateValenceRings();
      createIntersectLists();
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
        case 'electronsAdd':
          return visibleParticles;
        case 'protonsAdd':
          return optionalProtons;
        case 'protonsColor':
          return visibleProtons;
        case 'inner-faces':
          return viewer.objects.icosaFaces;
        case 'outer-faces':
          return hoverOuterFaces;
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
        case 'protonsColor':
        case 'protonsAdd':

          // If there is already a highlighted proton then set it back to original color
          if (highlightedProton) {
            // Return if the proton is already highlighted
            if (objects.length && highlightedProton == objects[0].object) return;

            // Change the proton back to it's original color and visibility.
            viewer.nuclet.setProtonColor(highlightedProton, null);
            if (highlightedProton.az.selected) {
              highlightedProton.material.color = viewer.theme.getColor('proton-ghost--color');
            } else {
              viewer.nuclet.setProtonColor(highlightedProton, null);
            }
//            highlightedProton.material.color = highlightedProton.az.tmpColor;
//          } else {
//            highlightedProton.material.color = viewer.theme.getColor(highlightedProton.name + '--color');
//          }
            highlightedProton.material.visible = highlightedProton.az.visible;
            highlightedProton = null;
          }

          // If there is already a highlighted electron then set it back to original color
          if (highlightedNElectron) {
            // Return if the proton is already highlighted
            if (objects.length && highlightedNElectron == objects[0].object.parent) return;

            // 1 is the field - 0 is the core.

            viewer.nuclet.setElectronColor(highlightedNElectron, false, false);
            highlightedNElectron = null;
          }

          if (objects.length) {

            if (objects[0].object.az) {  // PROTON
              if (!objects[0].object.az.active) return;

              if (mouseMode == 'protonsAdd') {
                // Return if this proton isn't optional
                if (!objects[0].object.az.optional) return;
              }

              // Highlight the proton
              highlightedProton = objects[0].object;
              highlightedProton.material.visible = true;
              highlightedProton.material.color = viewer.theme.getColor('proton-ghost--color');
            } else {                     // ELECTRON
              // Highlight the electron
              highlightedNElectron = objects[0].object.parent;
              viewer.nuclet.setElectronColor(highlightedNElectron, true, false);
            }
          }
          viewer.render();
          break;

        case 'inner-faces':
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
    function mouseUp(event, distance) {

      /**
       * A electron has been deselected, deselect the protons also.
       */
      function deselectProtons() {
        for (var p in selectedProtons) {
          if (selectedProtons.hasOwnProperty(p)) {
            selectedProtons[p].az.selected = false;
            viewer.nuclet.setProtonColor(selectedProtons[p]);
          }
        }
        selectedProtons = [];
      }

      /**
       * Deselect an Electron
       */
      function deselectNElectron() {
        selectedNElectron.az.selected = false;
        viewer.nuclet.setElectronColor(selectedNElectron, false, true);
        selectedNElectron = null;
      }

      event.preventDefault();
      var proton;
      switch (event.which) {
        case 1:   // Select/Unselect protons to add an electron to.
          switch (mouseMode) {
            case 'electronsAdd':
              var objects = viewer.controls.findIntersects(visibleParticles);
              if (objects.length) {          // Object found

                // PROTON
                if (objects[0].object.az) {
                  if (!objects[0].object.az.active) return;
                  // An electron is selected - unselect it.
                  if (selectedNElectron) {
                    deselectNElectron();
                  }

                  // Set the proton color
                  if (!objects[0].object.az.active) return;
                  proton = objects[0].object;
                  var pid = proton.az.nuclet.id + '-' + proton.az.id;
                  if (proton.az.selected) {
                    proton.az.selected = false;
                    delete selectedProtons[pid];
                  } else {
                    proton.az.selected = true;
                    selectedProtons[pid] = proton;
                  }
                  viewer.nuclet.setProtonColor(proton);

                  // ELECTRON
                } else {
                  deselectProtons();

                  var electron = objects[0].object.parent;

                  var pid = electron.az.nuclet.id + '-' + electron.az.id;
                  if (selectedNElectron == electron) {  // Electron already selected, unselect it.
                    deselectNElectron();
                  } else {
                    if (selectedNElectron) {  // Set selected electron back to normal.
                      deselectNElectron();
                    }
                    electron.az.selected = true;
                    selectedNElectron = electron;
                    viewer.nuclet.setElectronColor(electron, true, true);
                  }
                }

                // No objects intersected - clear everything.
              } else {                      // No object found
                deselectProtons();

                if (selectedNElectron) {
                  deselectNElectron(selectedNElectron);
                }
              }
              viewer.render();
              break;

            case 'protonsAdd':
              var intersects = viewer.controls.findIntersects(optionalProtons);
              if (intersects.length) {
                proton = intersects[0].object;
                switch (event.which) {
                  case 1:       // Left click - select
                    if (proton.az.optional) {
                      proton.az.visible = !proton.az.visible;
                      proton.material.visible = proton.az.visible;
                      if (proton.az.id.charAt(0) == 'U') {
                        for (var t = 0; t < proton.az.tetrahedrons.length; t++) {       // for each tetrahedron
                          proton.az.tetrahedrons[t].material.visible = proton.az.visible;
                        }
                      }
                      viewer.atom.updateValenceRings();
                      createIntersectLists();
                      viewer.atom.updateParticleCount();
                    }
                    break;
                  case 3:       // Right click - deselect
                    break;
                }
                viewer.render();
              }
              break;

            case 'protonsColor':
              var intersects = viewer.controls.findIntersects(visibleProtons);
              if (intersects.length != 0) {
                viewer.nuclet.setProtonColor(intersects[0].object, protonColor);
                viewer.render();
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
                  oldFaces.geometry.shapeConf.rotation || null,
                  oldFaces.geometry.reactiveState
                );
                var nucletGroup = oldFaces.parent;
                viewer.objects[oldFaces.name] = [];
                viewer.objects[oldFaces.name].push(faces);
                faces.geometry.reactiveState = oldFaces.geometry.reactiveState;
                faces.geometry.shapeConf = oldFaces.geometry.shapeConf;
                nucletGroup.remove(oldFaces);
                nucletGroup.add(faces);
                viewer.render();
              }
              break;
          }
          break;

        case 2:
          // Middle button always sets the edit nuclet
          var intersects = viewer.controls.findIntersects(visibleProtons);
          if (intersects.length == 0) {
            // Pop down the nuclet edit dialog.
            if (editNuclet) {
              viewer.nuclet.highlight(editNuclet, false);
            }
            $nucletFormBlock.addClass('az-hidden');
            editNuclet = undefined;
            viewer.render();
            return false;
          } else {
            // Initialize to current nuclet.
            setEditNuclet(intersects[0].object.parent.parent);
            $nucletFormBlock.removeClass('az-hidden');
            $nucletFormBlock.insertAfter($nucletList.find('.' + editNuclet.name));
            viewer.render();
            return false;
          }
          break;

        case 3:
          switch (mouseMode) {
            case 'electronsAdd':
              var objects = viewer.controls.findIntersects(visibleParticles);
              if (objects.length) {          // Object found
                // PROTON
                if (objects[0].object.az) {
                  var proton = objects[0].object;
                  var nuclet = proton.az.nuclet;
                  var pid = proton.az.nuclet.id + '-' + proton.az.id;
                  var arr = Object.keys(selectedProtons);
                  var len = Object.keys(selectedProtons).length;
                  if (len >= 2 && len <= 6) {
                    var pos = new THREE.Vector3();
                    var vertices = [];
                    for (var p in selectedProtons) {
                      if (selectedProtons.hasOwnProperty(p)) {
                        pos.add(selectedProtons[p].position);
                        vertices.push(selectedProtons[p].az.id);
                        var dude = selectedProtons[p].az.id;
                      }
                    }
                    pos.divideScalar(len);
                    var nelectron = viewer.nuclet.createNElectron('electron1', pos);
                    nelectron.az.vertices = vertices;
                    var id = 'N' + nElectronsId++;
                    nelectron.az.id = id;
                    nelectron.az.nuclet = nuclet;
                    nuclet.nelectrons[id] = nelectron;
                    // Use any proton (P1) to find the nucletGroup
                    nuclet.protons['P1'].az.nucletGroup.add(nelectron);
                    viewer.nuclet.setElectronColor(nelectron, false, true);
                    selectedProtons = [];
                  }

                  // ELECTRON
                } else {
                  electron = objects[0].object.parent;
                  if (electron == selectedNElectron) {
                    viewer.atom.deleteNElectron(selectedNElectron);
                    selectedNElectron = null;
                    createIntersectLists();
                  }
                }
                createIntersectLists();
                viewer.atom.updateParticleCount();
                viewer.render();
              }
              break;   // electronsAdd

          } // switch mouseMode
          break;
      } // switch which mouse button
    }

    /**
     * Create the visibleProtons and optionalProtons lists.
     */
    function createIntersectLists() {
      optionalProtons = [];
      visibleProtons = [];
      visibleNElectrons = [];
      var nuclets = viewer.atom.az().nuclets;
      for (var id in nuclets) {
        if (nuclets.hasOwnProperty(id)) {

          // Add protons
          var protons = nuclets[id].az.protons;
          if (protons) {
            for (var p in protons) {
              if (protons.hasOwnProperty(p)) {
                if (protons[p]) {
                  if (!protons[p].az.active) continue;
                  if (protons[p].az.optional) optionalProtons.push(protons[p]);
                  if (protons[p].az.visible)  visibleProtons.push(protons[p]);
                }
              }
            }
          }

          // Add neutrons - the purple ones
          var neutrons = nuclets[id].az.neutrons;
          if (neutrons) {
            for (var p in neutrons) {
              if (neutrons.hasOwnProperty(p)) {
                if (neutrons[p]) {
                  if (!neutrons[p].az.active) continue;
                  if (neutrons[p].az.optional) optionalProtons.push(neutrons[p]);
                  if (neutrons[p].az.visible)  visibleProtons.push(neutrons[p]);
                }
              }
            }
          }

          // Add electrons
          var nelectrons = nuclets[id].az.nelectrons;
          if (nelectrons) {
            for (var e in nelectrons) {
              if (nelectrons.hasOwnProperty(e)) {
                visibleNElectrons.push(nelectrons[e].children[1]);  // 0 is the core, 1 is the field
              }
            }
          }
        }
      }
      visibleParticles = visibleProtons.concat();
      for (var e in visibleNElectrons) {
        if (visibleNElectrons.hasOwnProperty(e)) {
          visibleParticles.push(visibleNElectrons[e]);
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
      viewer.nuclet.highlight(nuclet, 'darken');
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
        $('#edit-nuclet-grow-0', viewer.context).addClass('az-hidden');
        $('#edit-nuclet-grow-1', viewer.context).addClass('az-hidden');
      }
      else {
        $('.nuclet--grow-label', viewer.context).removeClass('hidden');
        $('#edit-nuclet-grow-0', viewer.context).removeClass('az-hidden');
        $('#edit-nuclet-grow-1', viewer.context).removeClass('az-hidden');
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
          if (grow0) {
            out += addNucletToList(id + '0', shell + 1);
          }
          if (grow1) {
            out += addNucletToList(id + '1', shell + 1);
          }
        }
        return out;
      }

      // Save the nuclet form before overwriting the list.
      if ($nucletFormBlock.length) {
        $nucletFormBlock.insertAfter($('.blocks--nuclet-list'), viewer.context);
        $nucletList.html(addNucletToList('N0', 0));

        $nucletButtons = $nucletList.find('.nuclet');
        $nucletButtons.click(function (e) {
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

    var objectLoaded = function objectLoaded(atom) {
      localStorage.setItem('atomizer_builder_atom_nid', atom.az.nid);
      createIntersectLists();
      if (viewer.objects.icosaFaces) {
        hoverInnerFaces = viewer.objects.icosaFaces;
      }
      if (viewer.objects.icosaOutFaces) {
        hoverOuterFaces = viewer.objects.icosaOutFaces;
      }
      createNucletList(atom);
      viewer.scene.az = {
        title: atom.az.title, // Use atom title as scene title
        name: atom.az.name,  // Use atom name as the scene name
        atomNid: atom.az.nid
      };
    };

    function changeNuclet(editNuclet, id) {
      var nuclet = viewer.atom.changeNucletState(editNuclet, id);
      createIntersectLists();
      setEditNuclet(nuclet);
      viewer.render();
    }

    /**
     * Create the view - add any objects to scene.
     */
    var createView = function () {
      viewer.nuclet = Drupal.atomizer.nucletC(viewer);
      viewer.atom = Drupal.atomizer.atomC(viewer);
      viewer.shapes = Drupal.atomizer.shapesC(viewer);
      viewer.sprites = Drupal.atomizer.spritesC(viewer);
      viewer.animation = Drupal.atomizer.animationC(viewer);

      // Load and display the default atom
      var userAtomNid = localStorage.getItem('atomizer_builder_atom_nid');
      viewer.atom.loadObject((!userAtomNid || userAtomNid == 'undefined') ? 249 : userAtomNid);

      // Create the ghost proton.  Displayed when hovering over attachment points.  Initially hidden
      viewer.view.ghostProton = viewer.nuclet.makeProton(0, {type: 'ghost'}, null, 1, {x: 300, y: 50, z: 0});
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
          changeNuclet(editNuclet, event.target.value);
        }
//      $(this).attr('id', $(this).attr('id') + '--' + $(this).val());
//      $(this).attr('id', 'nuclet--state--' + $(this).val());
      });

      $radios.siblings('label').click(function (event) {
        var input =$(this).siblings('input')[0];
        $(input).prop('checked', true);
        changeNuclet(editNuclet, input.value);
      });
    }

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

    function applyControl (id, value) {
      if (id == 'electron1-orbital--scale') {
        var volume = 4.0 / 3.0 *  Math.PI * Math.pow(value, 3);
        var normalizedVolume = Math.round(volume / 4.1887902047863905 * 1000) / 1000;
        $('#electron1-orbital--volume').html('<span class="az-name">Volume: &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="az-value">' + normalizedVolume + '</span>');
      }
      if (id == 'nuclet-volume--scale') {
        var volume = 4.0 / 3.0 *  Math.PI * Math.pow(value, 3);
        var normalizedVolume = Math.round(volume / 4.1887902047863905 * 1000) / 1000;
        $('#nuclet-volume--volume').html('<span class="az-name">Volume: &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="az-value">' + normalizedVolume + '</span>');
      }
      var fart = 5;
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
