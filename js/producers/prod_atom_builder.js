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

  var editNuclet;
  var nucletEditForm =    document.getElementById('hidden-nuclet');
  var hiddenControls =    document.getElementById('hidden-controls');

  var nucletAngle =       document.getElementById('nuclet--attachAngle');
  var nucletAngleSlider = document.getElementById('nuclet--attachAngle--az-slider');
  var nucletAngleValue =  document.getElementById('nuclet--attachAngle--az-value');
  var nucletDelete =      document.getElementById('nuclet--delete');
  var nucletAttachPt =    document.getElementById('edit-nuclet-attachproton--wrapper');

  var nucletGrow0 =       document.getElementById('edit-nuclet-grow-0');
  var nucletGrow1 =       document.getElementById('edit-nuclet-grow-1');

  // Add Event Listener to attachAngle slider
  nucletAngleSlider.addEventListener('input', onAngleChanged);
  nucletDelete.addEventListener('click', onNucletDelete);

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
    nucletEditForm.classList.add('az-hidden');
    viewer.render();
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
    viewer.render();
  }

  /**
   * Return the objects which are active for hovering
   *
   * @returns {*}
   */
  var hoverObjects = function hoverObjects() {
    if (viewer.objects && viewer.objects.protons) {
      return viewer.objects.protons;
    } else {
      return [];
    }

  };

  var highlightedProton;
  /**
   * User has hovered over a proton, set transparency to .5.
   *
   * @param event
   */
  var hovered = function hovered(protons) {
    var opacity = viewer.style.get('proton--opacity');

    // If there is already a highlighted proton
    if (highlightedProton) {
      // Return if the proton is already highlighted
      if (protons.length && highlightedProton == protons[0]) return;

      var proton = highlightedProton.object;

      // Change the proton back to it's original color and visibility.
      var color = viewer.style.get('proton-' + proton.az.type + '--color');
      proton.material.color.setHex(parseInt(color.replace(/#/, "0x")), 16);
      proton.material.visible = proton.az.visible;
    }

    if (protons.length) {
      // Return if this proton isn't optional
      if (!protons[0].object.az.optional || !protons[0].object.az.active) return;

      // Highlight the proton
      highlightedProton = protons[0];
      highlightedProton.object.material.visible = true;
      var color = viewer.style.get('proton-ghost--color');
      highlightedProton.object.material.color.setHex(parseInt(color.replace(/#/, "0x")), 16);
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
      case 1:
        var intersects = viewer.controls.findIntersects(viewer.objects.protons);
        event.preventDefault();
        if (intersects.length) {
          var proton = intersects[0].object;
          if (proton.az.optional) {
            proton.az.visible = !proton.az.visible;
            proton.material.visible = proton.az.visible;
            viewer.atom.setValenceRings();
            viewer.render();
          }
        }
        break;
      case 3:
        event.preventDefault();
        var activeProtons = [];
        for (var p = 0; p < viewer.objects.protons.length; p++) {
          var proton = viewer.objects.protons[p];
          if (proton.az.active) {
            activeProtons.push(proton);
          }
        }
        var intersects = viewer.controls.findIntersects(activeProtons);
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
    }
  };

  /**
   * Create the button or label for a grow point
   *
   * @param id
   * @param nucletGrow
   */
  function createGrowItem(id, nucletGrow) {
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
    createGrowItem(id + '0', nucletGrow0);
    createGrowItem(id + '1', nucletGrow1);
    editNuclet = nuclet;
  }

  /**
   * Set Default values for any forms.
   */
  function setDefaults() {
    userAtomFile = localStorage.getItem('atomizer_builder_atom');
    if (userAtomFile && userAtomFile != 'undefined') {
      var selectyml = document.getElementById('atom--selectyml');
      if (selectyml) {
        select = selectyml.querySelector('select');
        select.value = userAtomFile;
      }
    }
  }

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
    viewer.view.ghostProton = viewer.nuclet.makeProton({type: 'ghost'}, 1, {x: 300, y: 50, z: 0});
  };

  // Add event listeners to the nuclet edit form
  var radios = document.forms["atomizer-controls-form"].elements["nuclet--state"];
  for(var i = radios.length - 1; i > 0; i--) {
    radios[i].onclick = function (event) {
      if (event.target.tagName == 'INPUT') {
        editNuclet = viewer.atom.changeNucletState(editNuclet, event.target.value);
        viewer.render();
      }
    }
    radios[i].id = radios[i].id + '--' + radios[i].value;
  }

  return {
    createView: createView,
    setDefaults: setDefaults,
    mouseClick: mouseClick,
    hoverObjects: hoverObjects,
    hovered: hovered
  };
};


