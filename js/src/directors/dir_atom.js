/**
 * @file - dir_atom.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

(function ($) {

  Drupal.atomizer.dir_atomC = function (_viewer) {
    var viewer = _viewer;
    var bindingEnergies = drupalSettings.atomizer_bindingEnergies;

    var editNuclet;   // The nuclet currently being edited.

    var $nucletList = $('.nuclet--list', viewer.context);
    var $nucletFormBlock = $('.blocks--nuclet-form', viewer.context);
    var $nucletButtons;

    if ($nucletFormBlock.length) {
      var nucletAngle = $('.nuclet--attachAngle', viewer.context)[0];
      var nucletAngleSlider = $('.nuclet--attachAngle--az-slider', viewer.context)[0]
      var nucletAngleValue = $('.nuclet--attachAngle--az-value', viewer.context)[0];
      var nucletFizzer = $('.nuclet--fizzer', viewer.context)[0];
      var nucletDelete = $('.nuclet--delete', viewer.context)[0];

      var nucletAttach0 = $('#edit-nuclet-grow-0', viewer.context)[0];
      var nucletAttach1 = $('#edit-nuclet-grow-1', viewer.context)[0];
    }

    // @TODO These all have to be added to the atoms themselves - on demand
    var optionalProtons = [];
    var selectedProtons = [];
    var selectedElectron = null;
    var visibleElectrons = [];
    var visibleOrbitals = [];

    var highlightedProton;
    var highlightedElectron;
    var highlightedFace;
    var highlightedIcosa;
    var highlightedOuterFace;

    var outerFaces = null;

    var nElectronsId = 0;

    /**
     * User has changed the nuclet angle slider.
     *
     * @param event
     */
    function onAngleChanged(event) {
      viewer.atom.changeNucletAngle(editNuclet, event.target.value);
      viewer.render();
    }

    function onFizzerChanged(event) {
      viewer.atom.changeNucletFizzer(editNuclet, event.target.value);
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
      let atom = editNuclet.az.atom;
      viewer.atom.deleteNuclet(editNuclet);
//    delete viewer.atom.az().nuclets[editNuclet.az.id];
      createNucletList(atom);
      createIntersectLists(atom);
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
      var atom = editNuclet.az.atom;
      var nuclet = viewer.atom.addNuclet(atom, id);
      viewer.atom.updateValenceRings(atom);
      createIntersectLists(atom);
      setEditNuclet(nuclet);
      viewer.render();
    }

    function highlightProton() {
      // Return if the proton is already highlighted
      if (mouse.intersected.length && highlightedProton == mouse.intersected[0].object) return;

      // Change the proton back to it's original color and visibility.
      viewer.nuclet.setProtonColor(highlightedProton, null);
      if (highlightedProton.az.selected) {
        highlightedProton.material.color = viewer.theme.getColor('proton-ghost--color');
      } else {
        viewer.nuclet.setProtonColor(highlightedProton, null);
      }

      highlightedProton.material.visible = highlightedProton.az.visible;
      highlightedProton = null;
    }
    function highlightElectron() {
      // Return if the proton is already highlighted
      if (mouse.intersected.length && highlightedElectron == mouse.intersected[0].object.parent) return;

      // 1 is the field - 0 is the core.

      viewer.nuclet.setElectronColor(highlightedElectron, false, false);
      highlightedElectron = null;
    }

    /**
     * function mouseMove
     *
     * button none
     *    mode none
     *     // highlight the intersected proton or electron
     *     mode atomsMove
     *     mode electronsInnerEdit
     *     mode electronsOuterEdit
     *     mode protonsColor
     *     mode protonsEdit
     *     mode innerFacesEdit - highlight the appropriate inner face
     *     mode outerFacesEdit - highlight the appropriate outer face
     *
     * @param event
     */
    var mouseMove = function mouseMove(event, mouse) {
      switch (mouse.mode) {
        case 'none':
          return;

        // highLight/De-highlight the current proton
        case 'atomsMove':
        case 'electronsInnerEdit':
        case 'electronsOuterEdit':
        case 'protonsColor':
        case 'protonsEdit':
          // If there is already a highlighted proton then set it back to original color
          if (highlightedProton) {
            highlightProton()
          }
          // If there is already a highlighted electron then set it back to original color
          if (highlightedElectron) {
            highlightElectron()
          }

          if (mouse.intersected.length) {
            if (mouse.intersected[0].object.az) {  // PROTON
              if (!mouse.intersected[0].object.az.active) return;

              if (mouse.mode == 'protonsEdit') {
                // Return if this proton isn't optional
                if (!mouse.intersected[0].object.az.optional) return;
              }

              // if Mouse mode == electronsOuterEdit and we already have 2 selected
              if (mouse.mode == 'electronsOuterEdit' && Object.keys(selectedProtons).length == 2) return;

              // Highlight the proton
              highlightedProton = mouse.intersected[0].object;
              highlightedProton.material.visible = true;
              highlightedProton.material.color = viewer.theme.getColor('proton-ghost--color');
            } else {                     // ELECTRON
              // Highlight the electron
              highlightedElectron = mouse.intersected[0].object.parent;
              viewer.nuclet.setElectronColor(highlightedElectron, true, false);
            }
          }
          viewer.render();
          break;

        case 'inner-faces':
          // If there is already a highlighted proton
          if (highlightedFace) {
            if (mouse.intersected.length && highlightedFace == mouse.intersected[0]) return;
            highlightedFace.color.setHex(parseInt("0x00ff00"));
            highlightedIcosa.geometry.colorsNeedUpdate = true;
            highlightedFace = null;
          }

          if (mouse.intersected.length) {
            highlightedFace = mouse.intersected[0].face;
            highlightedIcosa = mouse.intersected[0].object;
            highlightedFace.color.setHex(parseInt("0x00ffff"));
            highlightedIcosa.geometry.colorsNeedUpdate = true;
            highlightedIcosa.geometry.elementsNeedUpdate = true;
            highlightedIcosa.geometry.dynamic = true;
            highlightedIcosa.geometry.verticesNeedUpdate = true;
          }
          break;
      }
    }

    function drawOrbital(protons) {
    }

    function mouseUp(event, mouse) {
      // Do nothing
      return;
    }

    /**
     * function mouseDown()
     *
     * button left - selects/deselects the current proton or electron
     *    if no objects are intersected
     *       deselect all protons and deselect all electrons - if any
     *    else
     *       mode electronsInnerEdit
     *       mode electronsOuterEdit
     *          if intersecting a proton
     *            if this proton is already selected
     *              deselect proton
     *            else
     *              if two protons are already selected
     *                ignore this - return
     *              else
     *                select proton
     *          if intersecting an electron
     *            if this electron is already selected
     *              deselect electron
     *            else
     *              select electron
     *
     *       mode protonsAdd
     *          hide/unhide 'U' protons - 4 and 5
     *
     *       mode protonsColor
     *          change color of intersected proton
     *
     *       mode inner-faces
     *          select/deselect intersected inner face
     *
     *       mode outer-faces
     *          select/deselect intersected outer face
     *
     * button center - select/deselect edit Nuclet
     *    if nothing is intersected
     *      popdown nuclet dialog
     *      editNuclet = undefined
     *    else
     *      setEditNuclet
     *      display nucletFormBlock
     *      position nucletFormBlock after editNuclet
     *
     *
     * button right
     *    mode electronsInnerEdit
     *       if proton is intersected
     *          if no or 1 protons or > 6 protons are selected
     *             ignore this - return
     *          if 2 -> 6 protons are selected and this is one of them
     *             addInnerElectron
     *      if electron is intersected and this electron is selected
     *         deleteElectron
     *
     *    mode electronsOuterEdit
     *       if intersecting a proton
     *       if intersecting an electron
     *
     * @param event
     * @param mouse
     */
    function mouseDown(event, mouse) {

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
      function deselectElectron() {
        deselectProtons();

        var electron = objects[0].object.parent;

        var pid = electron.az.nuclet.id + '-' + electron.az.id;
        if (selectedElectron == electron) {  // Electron already selected, unselect it.
          deselectElectron();
        } else {
          if (selectedElectron) {  // Set selected electron back to normal.
            deselectElectron();
          }
          electron.az.selected = true;
          selectedElectron = electron;
          viewer.nuclet.setElectronColor(electron, true, true);
        }
        selectedElectron.az.selected = false;
        viewer.nuclet.setElectronColor(selectedElectron, false, true);
        selectedElectron = null;
      }
      function protonsColor () {
        var objects = viewer.controls.findIntersects(viewer.producer.intersect().visibleProtons);
        if (objects.length != 0) {
          viewer.nuclet.setProtonColor(objects[0].object, mouse.protonColor);
          viewer.render();
        }
      }

      function selectProton() {
        if (!objects[0].object.az.active) return;

        // If an electron is selected - unselect it.
        if (selectedElectron) {
          deselectElectron();
        }
      }

      function selectNuclet() {
        // Middle button always sets the edit nuclet
        var objects = viewer.controls.findIntersects(viewer.producer.intersect().visibleProtons);
        if (objects.length == 0) {
          // Pop down the nuclet edit dialog.
          if (editNuclet) {
            viewer.nuclet.highlight(editNuclet, false);
          }
          $nucletFormBlock.addClass('az-hidden');
          editNuclet = undefined;
        } else {
          // Initialize to current nuclet.
          setEditNuclet(objects[0].object.parent.parent);
          $nucletFormBlock.removeClass('az-hidden');
          $nucletFormBlock.insertAfter($nucletList.find('.' + editNuclet.name));
        }
      }

      function addInnerElectron() {
        nuclet = objects[0].object.az.nuclet;
        atom = nuclet.atom;
        let p;
        let isPelectron = false;
        // Check to see if all protons are all in the same nuclet.
        let nucletId = '';
        for (p in selectedProtons) {
          if (selectedProtons.hasOwnProperty(p)) {
            proton = selectedProtons[p];
            if (nucletId == '') {
              nucletId = proton.az.nuclet.id;
            } else if (nucletId != proton.az.nuclet.id) {
              isPelectron = true;
            }
          }
        }

        if (isPelectron) {
          if (nprotons >= 2 && nprotons <= 6) {
            var pos = new THREE.Vector3();
            var protons = {};
            for (p in selectedProtons) {
              if (selectedProtons.hasOwnProperty(p)) {
                protons.push = selectedProtons[p];
                pos.add(selectedProtons[p].getWorldPosition());
              }
            }
            pos.divideScalar(nprotons);

            var id = 'S' + nElectronsId++;
            var pelectron = viewer.nuclet.createNElectron('electronSpherical', pos);
            pelectron.az.protons = protons;
            pelectron.az.id = id;
            atom.add(pelectron);   // add the pelectron to the atom
            viewer.nuclet.setPElectronColor(pelectron, false, true);
            selectedProtons = [];
          }
        } else {
          if (nprotons >= 2 && nprotons <= 6) {
            var pos = new THREE.Vector3();
            var vertices = [];
            for (p in selectedProtons) {
              if (selectedProtons.hasOwnProperty(p)) {
                proton = selectedProtons[p];
                pos.add(selectedProtons[p].position);
                vertices.push(selectedProtons[p].az.id);
              }
            }
            pos.divideScalar(nprotons);
            var nelectron = viewer.nuclet.createNElectron('electronSpherical', pos);
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
        }
      }
      function protonsEdit() {
      }

      function orbitalEdit() {
      }

      function deleteOrbital() {
      }

      function innerFacesEdit() {
        var objects = viewer.controls.findIntersects(viewer.producer.intersect().hoverInnerFaces);
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
          viewer.items.icosaFaces = null;
          var faces = viewer.nuclet.createGeometryFaces(
            oldFaces.name,
            1,
            oldFaces.geometry,
            oldFaces.geometry.shapeConf.rotation || null,
            oldFaces.geometry.reactiveState
          );
          var nucletGroup = oldFaces.parent;
          viewer.items[oldFaces.name] = [];
          viewer.items[oldFaces.name].push(faces);
          faces.geometry.reactiveState = oldFaces.geometry.reactiveState;
          faces.geometry.shapeConf = oldFaces.geometry.shapeConf;
          nucletGroup.remove(oldFaces);
          nucletGroup.add(faces);
          viewer.render();
        }
      }
      function outerFacesEdit() {
        return;
        // If there is already a highlighted proton
        if (highlightedOuterFace) {
          if (mouse.intersected.length && highlightedOuterFace == mouse.intersected[0]) return;
          if (highlightedOuterFace.selected) {
            highlightedOuterFace.materialIndex = 2;
          } else {
            highlightedOuterFace.materialIndex = 0;
          }
          highlightedOuterFace = null;
          outerFaces.geometry.elementsNeedUpdate = true;
        }

        if (mouse.intersected.length) {
          highlightedOuterFace = mouse.intersected[0].face;
          highlightedOuterFace.materialIndex = 1;
          outerFaces = mouse.intersected[0].object;
          outerFaces.geometry.elementsNeedUpdate = true;
        }
        viewer.render();
      }
      function editOrbital() {
      }


      event.preventDefault();

      let proton;
      let atom;
      let nuclet;
      switch (event.which) {
        case 1:   // Left button - Select/Unselect protons to add an electron to.
          // If no objects are selected
          //    deselect all electrons
          //    deselect all protons
          switch (mouse.mode) {
            case 'electronsInnerEdit':
            case 'electronsInnerEdit':
              selectProton();
              break;
            case 'protonsAdd':
              protonsAdd()
              break;
            case 'protonsColor':
              protonsColor()
              break;
            case 'innerFacesEdit':
              innerFacesEdit()
              break;
            case 'outerFacesEdit':
              outerFacesEdit()
              break;
          }
          break;

        case 2:   // Center button - Select/deselect nucleus
          selectNuclet();
          viewer.render();
          return false;

        case 3:   // Right button - add/delete inner electron or orbital
          switch (mouse.mode) {
            case 'electronsInnerEdit':
              particles = viewer.producer.intersect().visibleProtonsElectrons;
              var objects = viewer.controls.findIntersects(particles);
              if (objects.length) {          // Object found
                if (objects[0].object.az) {    // Only protons have this record, electrons do not
                  addInnerElectron();
                } else {
                  deleteInnerElectron()       //              deleteInnerElectron();
                }
              }
              break;   // electronsInnerEdit
            case 'electronsOuterEdit':
              particles = viewer.producer.intersect().visibleProtonsElectrons;
              var objects = viewer.controls.findIntersects(particles);
              if (objects.length) {          // Object found
                if (objects[0].object.az) {    // Only protons have this record, electrons do not
                  editOrbital();
                } else {  // electron
                  deleteOrbital()
                }
              }
          } // switch mouse.mode
          break;
      } // switch which mouse button
    }

    /**
     * createIntersectLists
     *
     * foreach nuclet
     *    Add to intersect Create lists of protons, neutrons, Create the visibleProtons and optionalProtons lists.
     */
    function createIntersectLists(atom) {
      var nuclets = atom.az.nuclets;
      visibleElectrons = [];
      visibleOrbitals = [];
      for (var id in nuclets) {
        if (nuclets.hasOwnProperty(id)) {

          // Add protons
          var protons = nuclets[id].az.protons;
          if (protons) {
            for (var p in protons) {
              if (protons.hasOwnProperty(p)) {
                if (protons[p]) {
                  if (!protons[p].az.active) continue;
                  if (protons[p].az.optional) atom.az.intersect.optionalProtons.push(protons[p]);
                  if (protons[p].az.visible) atom.az.intersect.visibleProtons.push(protons[p]);
                }
              }
            }
          }

          // Add neutrons
          var neutrons = nuclets[id].az.neutrons;
          if (neutrons) {
            for (var p in neutrons) {
              if (neutrons.hasOwnProperty(p)) {
                if (neutrons[p]) {
                  if (!neutrons[p].az.active) continue;
                  if (neutrons[p].az.optional) atom.az.intersect.optionalProtons.push(neutrons[p]);
                  if (neutrons[p].az.visible)  atom.az.intersect.visibleProtons.push(neutrons[p]);
                }
              }
            }
          }

          // Add electrons
          var nelectrons = nuclets[id].az.nelectrons;
          if (nelectrons) {
            for (var e in nelectrons) {
              if (nelectrons.hasOwnProperty(e)) {
                visibleElectrons.push(nelectrons[e].children[1]);  // 0 is the core, 1 is the field
              }
            }
          }

          // Add Outer Icosahedron Faces
          if (viewer.items.icosaOutFaces) {
             var temp = viewer.items.icosaOutFaces[0];
             atom.az.intersect.hoverOuterFaces.push(temp);
          }

          /*
          var faces = viewer.items['icosaOutFaces'][0].geometry.faces;
          if (faces) {
            for (var f in faces) {
              if (faces.hasOwnProperty(f)) {
                atom.az.intersect.hoverOuterFaces.push(faces[f]);
              }
            }
          } */
        }
      }

      // Combine protons and electrons
      atom.az.intersect.visibleProtonsElectrons = atom.az.intersect.visibleProtons.concat();
      for (var e in visibleElectrons) {
        if (visibleElectrons.hasOwnProperty(e)) {
          atom.az.intersect.visibleProtonsElectrons.push(visibleElectrons[e]);
        }
      }

      // Combine protons and electronsOuterEdit
      atom.az.intersect.visibleProtonsOrbitals = atom.az.intersect.visibleProtons.concat();
      for (var o in visibleOrbitals) {
        if (visibleOrbitals.hasOwnProperty(e)) {
          atom.az.intersect.visibleProtonsOrbitals.push(visibleOrbitals[e]);
        }
      }

      if (viewer.producer.updateIntersectLists) {
        viewer.producer.updateIntersectLists();
      }
    }

    /**
     * Create the button or label for a grow point
     *
     * @param id
     * @param nucletAttach
     */
    function createNucletAttachItem(atom, id, nucletAttach) {
      var label = nucletAttach.getElementsByTagName('LABEL')[0];
      var div = nucletAttach.getElementsByTagName('DIV')[0];

      label.innerHTML = id;

      if (atom.az.nuclets[id]) {
        div.innerHTML = atom.az.nuclets[id].az.state;
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
      createNucletList(nuclet.az.atom);
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
        nucletFizzer.classList.add('az-hidden');
      } else {
        nucletDelete.classList.remove('az-hidden');
        nucletAngle.classList.remove('az-hidden');
        nucletFizzer.classList.remove('az-hidden');
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
      createNucletAttachItem(nuclet.az.atom, id + '0', nucletAttach0);
      createNucletAttachItem(nuclet.az.atom, id + '1', nucletAttach1);
      editNuclet = nuclet;
    }

    function findNeutralEnding(az, id) {
      var bes = [];
      var pList = (id == 0) ? [12,13,14,15] : [16,17,18,19];
      var np = 0;
      for (var p in pList) {
        if (pList.hasOwnProperty(p)) {
          var proton = az.protons['P' + pList[p]];
          if (proton.az.visible) {
            np++;
          }
        }
      }

      switch (np) {
        case 1:
          bes =['PEP'];
          break;

        case 2:
          bes = ['Deuteron'];
          break;

        case 3:
          bes = ['Deuteron', 'PEP'];
          break;

        case 4:
          var uid = 'U' + id + '0';
          if (az.neutrons[uid].az.visible) {
            bes = ['Five ending'];
          } else {
            bes = ['Four ending'];
          }
          break;
      }
      // check the protons on this grow point and categorize it
      return bes;
    }

    let samLines = {
      'Carbon prime': 41,
      'Deuteron': 8,
      'Four ending': 16,
      'Five ending': 21,
      'Lithium': 24,
      'Beryllium': 32,
      'Boron': 40,
      'Carbon': 45,
      'PEP': 3,
    };

    function findExtraNeutrons(az) {
      var bes = [];
      for (var u in az.neutrons) {
        if (az.neutrons.hasOwnProperty(u)) {
          if ((az.state == 'initial' || az.state == 'final') &&
              (u == 'U00' || u == 'U10')) continue;
          var neutron = az.neutrons[u];
          if (neutron.az.visible) {
            bes.push('PEP');
          }
        }
      }
      return bes;
    }

    function findSamLines(az) {
      var be = [];
      var extra = [];
      var grow0 = az.id + '0';
      var grow1 = az.id + '1';
      if (az.id == 'N0') {  // disabled
        switch (az.state) {

          case 'lithium':
            if (az.protons.P5.az.active) {
              be.push('Lithium');
            } else {
              be.push('Lithium');
            }
            break;

          case 'beryllium':
            be.push('Beryllium');
            break;

          case 'boron10':
            be.push('Boron');
            break;

          case 'boron11':
            be.push('Boron');
            break;

          case 'carbon':
            be.push('Carbon prime');
            break;

          case 'initial':
          case 'final':
            if (az.conf.nuclets) {
              // if it has 2 nuclets attached
              if (az.conf.nuclets[grow0] && az.conf.nuclets[grow1]) {
                be.push('Carbon prime');
              } // if only the 0 nuclet is attached
              else if (az.conf.nuclets[grow0]) {
                be.push('Carbon prime');
                be.push.apply(be, findNeutralEnding(az, 1));
              } // if only the 1 nuclet is attached
              else if (az.conf.nuclets[grow1]) {
                be.push('Carbon prime');
                be.push.apply(be, findNeutralEnding(az, 0));
              } // no nuclets are attached
            }
            else {
              be.push('Carbon prime');
              be.push.apply(be, findNeutralEnding(az, 0));
              be.push.apply(be, findNeutralEnding(az, 1));
            }
            break;
        }
      } else { // if this in NOT 'N0'
        switch (az.state) {

          case 'lithium':
            be.push('Lithium');
            break;

          case 'beryllium':
            be.push('Beryllium');
            break;

          case 'boron10':
            be.push('Boron');
            break;

          case 'boron11':
            be.push('Boron');
            break;

          case 'carbon':
            be.push('Carbon');
            break;

          case 'initial':
          case 'final':
            if (az.conf.nuclets) {
              if (az.conf.nuclets[grow0] && az.conf.nuclets[grow1]) {
                be.push('Carbon');
              } // if only the 0 nuclet is attached
              else if (az.conf.nuclets[grow0]) {
                be.push('Carbon');
                be.push.apply(be, findNeutralEnding(az, 1));
              } // if only the 1 nuclet is attached
              else if (az.conf.nuclets[grow1]) {
                be.push('Carbon');
                be.push.apply(be, findNeutralEnding(az, 0));
              } // no nuclets are attached
            }
            else {
              be.push('Carbon');
              be.push.apply(be, findNeutralEnding(az, 0));
              be.push.apply(be, findNeutralEnding(az, 1));
            }
//          Check the grow points?
            break;
        }
      }

      be.push.apply(be, findExtraNeutrons(az));

      return be;
    }

    /**
     * Create a list of nuclets for the nuclet edit form - recursive.
     *
     * @param atom
     */
    function createNucletList(atom) {
      let totalLines = 0; // total Binding Energy for this atom.
      let actualBE = parseFloat($('.field--name-field-be-actual .field__item').html());
      let showSamLines = $('#atom--sam-lines-button').hasClass('az-selected') ? '' : 'az-hidden';
      /**
       * Recursive function to extract a nuclets information.
       *
       * @param id
       * @param shell
       * @returns {string}
       */
      function addNucletToList(id, shell) {
        let nuclet = atom.az.nuclets[id];

        let totalProtons = 0;
        let particles;
        particles = viewer.nuclet.countParticles(nuclet);

        // Recursively add the children nuclets.
        let grow0 = atom.az.nuclets[id + '0'];
        let grow1 = atom.az.nuclets[id + '1'];
        let children = '';
        let n;
        if (grow0 || grow1) {
          if (grow0) {
            n = addNucletToList(id + '0', shell + 1);
            children += n.out;
            totalProtons += n.totalProtons
          }
          if (grow1) {
            n = addNucletToList(id + '1', shell + 1);
            children += n.out;
            totalProtons += n.totalProtons
          }
        }

        totalProtons += particles.numProtons;

        let out = '<div class="nuclet shell-' + shell + ' ' + nuclet.name + '">';
        out += `<div
          class="header"
          data-nuclet-id="${id}"
          data-atom-id="${atom.az.id}"
        >
           ${id} ${nuclet.az.state} - ${particles.numProtons} ${totalProtons != particles.numProtons ? ' - ' + totalProtons : ''}
        </div>`;

        // Add the binding energy
        let beList = findSamLines(nuclet.az);
        if (beList.length > 0) {
          out += `<div class="sam-lines-wrapper ${showSamLines}">\n`;
          for (let b = 0; b < beList.length; b++) {
            let en = beList[b];
            out += '  <div class="sam-lines">\n';
            out += '    <span class="title">' + en + '</span>\n';
            out += '    <span class="value">' + samLines[en] + '</span>\n';
            out += '  </div>\n';
            totalLines += parseFloat(samLines[en]);
          }
          out += '</div>\n';
        }
        out += '</div>\n';

        out += children;

        return {out, totalProtons};
      } // end function  addNucletToList

      if ($nucletFormBlock.length) {
        // Save the nuclet form before overwriting the list.
        $nucletFormBlock.insertAfter($('.blocks--nuclet-list'), viewer.context);

        // Create a new list recursively
        let branchProtons = 0;
        $nucletList.empty();
        let n = addNucletToList('N0', 0);
        $nucletList.html(n.out);

        $nucletButtons = $nucletList.find('.nuclet');
        $nucletButtons.click((e) => {
          let nucletId = $(e.target).data('nuclet-id');
          let atomId = $(e.target).data('atom-id');
          let atom = viewer.producer.getObject(atomId);
          let nuclet = viewer.atom.getNuclet(atom, nucletId);
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
        $nucletList.empty();
        $nucletList.html(addNucletToList('N0', 0));
      }

      $('.atom--sam-lines--value').html(totalLines.toString().substring(0,6));
      if (actualBE) {
        let totalBE = totalLines * 2.225;
        let perc = ((totalBE > actualBE) ? actualBE / totalBE : -totalBE / actualBE) * 100;
        $('.atom--be-actual--value').html(actualBE.toString().substring(0,7));
        $('.atom--be-sam-lines--value').html(Math.round(totalBE *100) / 100);
        $('.atom--be-sam-lines-perc--value').html(perc.toString().substring(0,5) + '%');
      }
      else {
        $('.atom--be-actual--value').html('');
        $('.atom--be-sam-lines--value').html('');
        $('.atom--be-sam-lines-perc--value').html('');
      }
    }

    /**
     * Set Default values for forms.
     */
    function setDefaults() {
      let userAtomFile = localStorage.getItem('atomizer_builder_atom_nid');
      if (userAtomFile && userAtomFile != 'undefined') {
        let selectyml = $('.atom--selectyml', viewer.context)[0];
        if (selectyml) {
          select = selectyml.querySelector('select');
          select.value = userAtomFile;
        }
      }
    }

    const objectLoaded = function objectLoaded(atom) {
      localStorage.setItem('atomizer_builder_atom_nid', atom.az.nid);
      createIntersectLists(atom);
      if (viewer.items.icosaFaces) {
        hoverInnerFaces = viewer.items.icosaFaces;
      }
      if (viewer.items.icosaOutFaces) {
        hoverOuterFaces = viewer.items.icosaOutFaces;
      }
      createNucletList(atom);
    };

    function changeNuclet(editNuclet, id) {
      let nuclet = viewer.atom.changeNucletState(editNuclet, id);
      createIntersectLists(nuclet.az.atom);
      setEditNuclet(nuclet);
      viewer.render();
    }

    /////////// Attach event listeners

    if ($nucletFormBlock.length) {
      // Add Event Listener to attachAngle slider
      nucletAngleSlider.addEventListener('input', onAngleChanged);
      nucletFizzer.addEventListener('input', onFizzerChanged);
      nucletDelete.addEventListener('click', onNucletDelete);

      // Add event listeners to the nuclet edit form state radio buttons
      let $radios = $('#edit-nuclet-state .az-control-radios', viewer.context);
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
        let input =$(this).siblings('input')[0];
        $(input).prop('checked', true);
        changeNuclet(editNuclet, input.value);
      });
    }

    function applyControl (id, value) {
      if (id == 'electron-orbital--scale') {
        let volume = 4.0 / 3.0 *  Math.PI * Math.pow(value, 3);
        let normalizedVolume = Math.round(volume / 4.1887902047863905 * 1000) / 1000;
        $('#electron-orbital--volume').html('<span class="az-name">Volume: &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="az-value">' + normalizedVolume + '</span>');
      }
      if (id == 'nuclet-volume--scale') {
        let volume = 4.0 / 3.0 *  Math.PI * Math.pow(value, 3);
        let normalizedVolume = Math.round(volume / 4.1887902047863905 * 1000) / 1000;
        $('#nuclet-volume--volume').html('<span class="az-name">Volume: &nbsp;&nbsp;&nbsp;&nbsp;</span><span class="az-value">' + normalizedVolume + '</span>');
      }
    }

    return {
      setDefaults,
      mouseUp,
      mouseDown,
      mouseMove,
      objectLoaded,
      applyControl,
      createIntersectLists,
    };
  };

})(jQuery);
