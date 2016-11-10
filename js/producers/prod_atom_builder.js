/**
 * @file - prod_atom_builder.js
 *
 */

Drupal.atomizer.producers.atom_builderC = function (_viewer) {
  var viewer = _viewer;
  var abc = ['a', 'b', 'c'];

  var atom;
  var atomNid;
  var userAtomNid;

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

  function onAngleChanged(event) {
    viewer.atom.changeNucletAngle(editNuclet.az.id, event.target.value);
    viewer.render();
  }

  function onNucletDelete(event) {
    // Delete the protons from the
    delete viewer.atom.az().nuclets[editNuclet.az.id];
    viewer.nuclet.deleteNuclet(editNuclet);
    nucletEditForm.classList.add('az-hidden');
    viewer.render();
  }

  function onNucletAddButton(event) {
    var id = event.target.id.split('-',2)[1];
    var nuclet = viewer.atom.addNuclet(id);
    setEditNuclet(nuclet);
    viewer.render();
  }

  var hoverObjects = function hoverObjects() {
    if (viewer.objects.optionalProtons) {
      return viewer.objects.optionalProtons;
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
    if (protons.length) {
      if (highlightedProton) {
        if (highlightedProton == protons[0])
          return;
        highlightedProton.object.material.opacity = 1;
        highlightedProton.object.material.transparent = false;
        highlightedProton.object.material.visible = true;
      }
      highlightedProton = protons[0];
      highlightedProton.object.material.opacity = .7;
      highlightedProton.object.material.visible = true;
      highlightedProton.object.material.transparent = true;
    } else {
      if (highlightedProton) {
        highlightedProton.object.material.opacity = 1;
        highlightedProton.object.material.visible = true;
        highlightedProton.object.material.transparent = false;
        highlightedProton = undefined;
      }
    }
    viewer.render();
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
    if (event.which == 3) { // right mouse button
      event.preventDefault();
      var intersects = viewer.controls.findIntersects(viewer.objects.protons);
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
//      nucletEditForm.style.top =  (event.clientY - 250) + 'px';
//      nucletEditForm.style.left = (event.clientX - 300)+ 'px';
        nucletEditForm.style.top =  10  +'px';
        nucletEditForm.style.left = 214 + 'px';
        return false;
      }
    }
  };

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

  function setDefaults() {
    userAtomFile = localStorage.getItem('atomizer_builder_atom');
    if (userAtomFile && userAtomFile != 'undefined') {
      var selectyml = document.getElementById('atom--selectyml');
      if (selectyml) {
        select = selectyml.querySelector('select');
        select.value = userAtomFile;
      }
      return;
    }
  }

  var createView = function () {

    viewer.nuclet = Drupal.atomizer.nucletC(viewer);
    viewer.atom = Drupal.atomizer.atomC(viewer);

    // Load and display the default atom
    userAtomNid = localStorage.getItem('atomizer_builder_atom_nid');
    if (userAtomNid == 'undefined') {
      // Use the backbone.
      atomNid = 73;
    } else {
      atomNid = (userAtomNid && userAtomNid != 'undefined') ? userAtomNid : 39;

    }

    viewer.view.atom = viewer.atom.loadAtom(atomNid);

    // Create the ghost proton.  Displayed when hovering over attachment points.  Initially hidden
    viewer.view.ghostProton = viewer.nuclet.makeProton('ghost', 1, {x: 300, y: 50, z: 0});

    return;
  };

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


