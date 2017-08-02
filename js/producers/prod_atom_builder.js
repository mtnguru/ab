/**
 * @file - prod_atom_builder.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

Drupal.atomizer.producers.atom_builderC = function (_viewer) {
  var viewer = _viewer;
  var atom;

  var mouseMode = 'none';
  var mouseModeRadios =   document.getElementById('edit-nuclet-attachproton--wrapper');

  var editNuclet;
  var nucletEditForm =    document.getElementById('hidden-nuclet');

  var nucletAngle =       document.getElementById('nuclet--attachAngle');
  var nucletAngleSlider = document.getElementById('nuclet--attachAngle--az-slider');
  var nucletAngleValue =  document.getElementById('nuclet--attachAngle--az-value');
  var nucletDelete =      document.getElementById('nuclet--delete');
  var nucletAttachPt =    document.getElementById('edit-nuclet-attachproton--wrapper');

  var nucletAttach0 =     document.getElementById('edit-nuclet-grow-0');
  var nucletAttach1 =     document.getElementById('edit-nuclet-grow-1');

  var hoverInnerFaces = [];
  var hoverOuterFaces = [];
  var hoverNuclets = [];  // The
  var hoverProtons = [];
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
    createProtonLists();
    viewer.render();

    nucletEditForm.classList.add('az-hidden');
  }

  /**
   * User pressed a nuclet Add button - so add a nuclet.
   * @param event
   */
  function onNucletAddButton(event) {
    var id = event.target.id.split('-',2)[1];
    var nuclet = viewer.atom.addNuclet(id);
    setEditNuclet(nuclet);
    viewer.atom.setValenceRings();
    createProtonLists();
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
      case 'protons':
        return hoverProtons;
      case 'nuclets':
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
      case 'protons':
        var opacity = viewer.theme.get('proton--opacity');

        // If there is already a highlighted proton
        if (highlightedProton) {
          // Return if the proton is already highlighted
          if (objects.length && highlightedProton == objects[0]) return;

          var proton = highlightedProton.object;

          // Change the proton back to it's original color and visibility.
          var color = viewer.theme.get('proton-' + proton.az.type + '--color');
          proton.material.color.setHex(parseInt(color.replace(/#/, "0x")), 16);
          proton.material.visible = proton.az.visible;
        }

        if (objects.length) {
          // Return if this proton isn't optional
          if (!objects[0].object.az.optional || !objects[0].object.az.active) return;

          // Highlight the proton
          highlightedProton = objects[0];
          highlightedProton.object.material.visible = true;
          var color = viewer.theme.get('proton-ghost--color');
          highlightedProton.object.material.color.setHex(parseInt(color.replace(/#/, "0x")), 16);
        }
        break;

      case 'nuclets':
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
        event.preventDefault();
        break;

      case 3:       // Right click
        event.preventDefault();
        switch (mouseMode) {
          case 'none':
            break;

          case 'protons':
            var intersects = viewer.controls.findIntersects(hoverProtons);
            if (intersects.length) {
              var proton = intersects[0].object;
              if (proton.az.optional) {
                proton.az.visible = !proton.az.visible;
                proton.material.visible = proton.az.visible;
                viewer.atom.setValenceRings();
                createProtonLists();
                viewer.render();
              }
            }
            break;

          case 'nuclets':
            var intersects = viewer.controls.findIntersects(visibleProtons);
            if (intersects.length == 0) {
              // Pop down the nuclet edit dialog.
              nucletEditForm.classList.add('az-hidden');
              editNuclet = undefined;
              return false;
            } else {
              // Initialize to current nuclet.
              editNuclet = intersects[0].object.parent.parent;
              nucletEditForm.classList.remove('az-hidden');
              setEditNuclet(editNuclet);
              nucletEditForm.style.top =  10  +'px';
              nucletEditForm.style.left = 214 + 'px';
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

  function createProtonLists() {
    hoverProtons = [];
    visibleProtons = [];
    var nuclets = viewer.atom.az().nuclets;
    for (var id in nuclets) {
      if (nuclets.hasOwnProperty(id)) {
        var protons = nuclets[id].az.protons;
        for (var p = 0; p < protons.length; p++) {
          if (protons[p]) {
            if (protons[p].az.active)  hoverProtons.push(protons[p]);
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
   * @param nucletGrow
   */
  function createNucletAttachItem(id, nucletAttach) {
    var label = nucletGrow.getElementsByTagName('LABEL')[0];
    var div = nucletGrow.getElementsByTagName('DIV')[0];

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
      nucletGrow.getElementsByTagName('DIV')[0].appendChild(button);
    }
  }

  /**
   * Carry out the selection of a new nuclet to edit.
   *
   * @param nuclet
   */
  function setEditNuclet(nuclet) {
    var id = nuclet.az.id;
    var nucletLabel = document.getElementById('nuclet--id');
    nucletLabel.innerHTML = '<span class="az-label">Nuclet ID: </span><span class="az-id"> ' + id + '</span>';
    // Set the state of the nuclet
    if (nuclet.az.conf.state != 'hydrogen' && nuclet.az.conf.state != 'helium') {
      document.getElementById("nuclet--state--" + nuclet.az.conf.state).checked = true;
      nucletAngleSlider.value = nuclet.az.conf.attachAngle || 1;
      nucletAngleValue.value = nuclet.az.conf.attachAngle || 1;
    }

    // Show/Hide the delete, angle and attach points
    if (id == 'N0') {
      nucletDelete.classList.add('az-hidden');
      nucletAngle.classList.add('az-hidden');
      nucletAttachPt.classList.add('az-hidden');
    } else {
      nucletDelete.classList.remove('az-hidden');
      nucletAngle.classList.remove('az-hidden');
      nucletAttachPt.classList.remove('az-hidden');
    }

    if (nuclet.az.conf.state == 'backbone-initial') {
//    Display
    }
    createNucletAttachItem(id + '0', nucletAttach0);
    createNucletAttachItem(id + '1', nucletAttach1);
    editNuclet = nuclet;
  }

  /**
   * Set Default values for any forms.
   */
  function setDefaults() {
    userAtomFile = localStorage.getItem('atomizer_builder_atom_nid');
    if (userAtomFile && userAtomFile != 'undefined') {
      var selectyml = document.getElementById('atom--selectyml');
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
  };

  /**
   * Create the view - add any objects to scene.
   */
  var createView = function () {
    viewer.nuclet = Drupal.atomizer.nucletC(viewer);
    viewer.atom = Drupal.atomizer.atomC(viewer);

    // Load and display the default atom
    var userAtomNid = localStorage.getItem('atomizer_builder_atom_nid');
    viewer.view.atom = viewer.atom.loadAtom((userAtomNid == 'undefined') ? 73 : userAtomNid);

    // Create the ghost proton.  Displayed when hovering over attachment points.  Initially hidden
    viewer.view.ghostProton = viewer.nuclet.makeProton({type: 'ghost'}, 1, {x: 300, y: 50, z: 0}, {state: 'default'});
  };


  /////////// Attach event listeners

  // Add Event Listener to attachAngle slider
  nucletAngleSlider.addEventListener('input', onAngleChanged);
  nucletDelete.addEventListener('click', onNucletDelete);

  // Add event listeners to the nuclet edit form
  var radios = document.forms["atomizer-controls-form"].elements["nuclet--state"];
  for(var i = radios.length - 1; i > 0; i--) {
    radios[i].onclick = function (event) {
      if (event.target.tagName == 'INPUT') {
        editNuclet = viewer.atom.changeNucletState(editNuclet, event.target.value);
        createProtonLists();
        viewer.render();
      }
    }
    radios[i].id = radios[i].id + '--' + radios[i].value;
  }

  // Add event listeners to mode form
  var radios = document.forms["atomizer-controls-form"].elements["mouse--mode"];
  for(var i = radios.length - 1; i > 0; i--) {
    radios[i].onclick = function (event) {
      if (event.target.tagName == 'INPUT') {
        console.log('mode: ' + event.target.value);
        mouseMode = event.target.value;
//      viewer.render();
      }
    }
    radios[i].id = radios[i].id + '--' + radios[i].value;
    if (radios[i].checked) {
      mouseMode = radios[i].value;
    }
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


