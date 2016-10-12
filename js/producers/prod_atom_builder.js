/**
 * @file - prod_atom_builder.js
 *
 * Orchestrates the user interface for building atoms.
 */

Drupal.atomizer.producers.atom_builderC = function (_viewer) {
  var viewer = _viewer;
  var abc = ['a', 'b', 'c'];

  var nucleus;
  var nucleusFile;
  var userNucleusFile;

  var editNuclet;
  var nucletEditForm =    document.getElementById('hidden-nuclet');
  var hiddenControls =    document.getElementById('hidden-controls');

  var nucletAngle =       document.getElementById('nuclet--attachAngle');
  var nucletAngleSlider = document.getElementById('nuclet--attachAngle--az-slider');
  var nucletAngleValue =  document.getElementById('nuclet--attachAngle--az-value');
  var nucletList =        document.getElementById('nucleus--nuclets');
  var nucletDelete =      document.getElementById('nuclet--delete');
  var nucletAttachPt =    document.getElementById('edit-nuclet-attachproton--wrapper');


  // Add Event Listener to attachAngle slider
  nucletAngleSlider.addEventListener('input', onAngleChanged);
  nucletDelete.addEventListener('click', onNucletDelete);


  var mouseClick = function mouseClick(event, mouse) {
    var intersects = viewer.controls.findIntersects(intersectObjects());
    intersected(intersects);
  };

  function highlightAttachProtons(protons, face, color) {
    for (var i in abc) {
      var proton = protons[face[abc[i]]];
      if (color) {
        proton.currentHex = proton.material.color.getHex();
        proton.material.color.setHex(color);
      } else {
        proton.material.color.setHex(proton.currentHex);
      }
    }
  }

  var intersected = function intersected(intersects) {
    if (intersects.length == 0) {
      // We've clicked on nothing, hide the nuclet edit form if currently displayed.
      ve
    } else {
      // We've clicked on a proton, find the nuclet and popup the edit menu, the nucleus should be doing this.
      if (highlightedFace != intersects[0].face) {
        var face = intersects[0].face;
        face.centroid = new THREE.Vector3(0, 0, 0);
        highlightedNuclet = intersects[0].object.parent.parent;
        for (var i in abc) {
          if (highlightedNuclet.protons[face[abc[i]]]) {
            face.centroid.add(highlightedNuclet.protons[face[abc[i]]].position);
          } else {
            return;
          }
        }
        face.centroid.divideScalar(3);

        if (highlightedFace) {
          highlightAttachProtons(highlightedNuclet.protons, highlightedFace);
        }

        highlightedFace = face;

        var normal = face.normal;
        var scale = 1.68;
        var scaled_normal = {
          x: normal.x * scale * highlightedNuclet.protonRadius,
          y: normal.y * scale * highlightedNuclet.protonRadius,
          z: normal.z * scale * highlightedNuclet.protonRadius
        };

        var v4 = {
          x: face.centroid.x + scaled_normal.x,
          y: face.centroid.y + scaled_normal.y,
          z: face.centroid.z + scaled_normal.z,
        };
        viewer.view.ghostProton.position.copy(v4);
        highlightedNuclet.children[0].add(viewer.view.ghostProton);

        if (highlightedNuclet.attachFaces[intersects[0].faceIndex].type == 'valence') {
          color = viewer.style.get('proton-vattach--color');
        } else {
          color = viewer.style.get('proton-iattach--color');
        }
        highlightAttachProtons(highlightedNuclet.protons, face, color.replace('#', '0x'));
        viewer.render();
      }
    }
  };

  var intersectObjects = function intersectObjects() {
    return viewer.nuclet.objects.protons;
  };

  function setDefaults() {
    userNucleusFile = localStorage.getItem('atomizer_builder_nucleus');
    if (userNucleusFile && userNucleusFile != 'undefined') {
      var selectyml = document.getElementById('nucleus--selectyml');
      if (selectyml) {
        select = selectyml.querySelector('select');
        select.value = userNucleusFile;
      }
      return;
    }
  }

  var createView = function () {

    viewer.nuclet = Drupal.atomizer.nucletC(viewer);
    viewer.nucleus = Drupal.atomizer.nucleusC(viewer);

    // Load and display the default nucleus.
    userNucleusFile = localStorage.getItem('atomizer_builder_nucleus');
    nucleusFile = (userNucleusFile && userNucleusFile != 'undefined') ? userNucleusFile : viewer.view.defaultNucleus;

    viewer.view.nucleus = viewer.nucleus.loadNucleus(
      'config/nucleus/' + nucleusFile,
      {position: {x: 0, y: 0, z: 0}}
    );

    // Create the ghost proton.  Displayed when hovering over attachment points.  Initially hidden
    viewer.view.ghostProton = viewer.nuclet.makeProton('ghost', 1, {x: 300, y: 50, z: 0});

    return;
  };

  return {
    createView: createView,
    setDefaults: setDefaults,
    mouseClick: mouseClick
  };
};


// Dude ===================================================================================

  /**
  function changeNucletState(name, value) {
    var az = editNuclet.az;
    var parent = editNuclet.parent.parent.parent;
    parent.remove(editNuclet.parent.parent);

    az.conf.state = value;
    var nucletOuterShell = createNuclet(az.id, az.conf, parent);
    var nuclet = nucletOuterShell.children[0].children[0];
//  nuclet.az.stateName = name;
    nucleus.az.nuclets[nuclet.az.id] = nuclet;

    editNuclet = nuclet;

    var oldItem = nucleus.az.nucletEditList[az.id]
    var newItem = createNucletButton (az.id, 'Edit', az.conf.state);
    oldItem.parentNode.replaceChild(newItem, oldItem);
    setEditNuclet(az.id);

    viewer.render();
  }

  function addNuclet(id) {
    var conf = nucleusConf.nuclets[id];
    if (!conf) {
      conf = {
        state: 'carbon'
      };
    }
    var pid = id.slice(0, -1);
    var nucletOuterShell = createNuclet(id, conf, nucleus.az.nuclets[pid]);
    var nuclet = nucletOuterShell.children[0].children[0];
    nucleus.az.nuclets[nuclet.az.id] = nuclet;
    setEditNuclet(id);

    editNuclet = nuclet;

    var oldItem = nucleus.az.nucletEditList[id]
    var newItem = createNucletButton (id, 'Edit', conf.state);
    oldItem.parentNode.replaceChild(newItem, oldItem);
    setEditNuclet(id);

    viewer.render();
    return;

  }

  function setEditNuclet(id) {
    if (editNuclet) {
      nucleus.az.nucletEditList[editNuclet.az.id].classList.remove('nuclet-selected');
    }

    if (!id) {
      hiddenControls.appendChild(nucletEditForm);
      return;
    }

    var nuclet = nucleus.az.nuclets[id];
    editNuclet = nuclet;

    var listItem = nucleus.az.nucletEditList[id];
    listItem.appendChild(nucletEditForm);
    listItem.classList.add('nuclet-selected');

    // Set the state of the nuclet
    if (editNuclet.az.conf.state != 'hydrogen' && editNuclet.az.conf.state != 'helium') {
      document.getElementById("nuclet--state--" + editNuclet.az.conf.state).checked = true;
      nucletAngleSlider.value = editNuclet.az.conf.attachAngle || 1;
      nucletAngleValue.value = editNuclet.az.conf.attachAngle || 1;
    }

    // Show/Hide the delete, angle and attach points
    if (editNuclet.az.id == 'N0') {
      nucletDelete.classList.add('az-hidden');
      nucletAngle.classList.add('az-hidden');
      nucletAttachPt.classList.add('az-hidden');
    } else {
      nucletDelete.classList.remove('az-hidden');
      nucletAngle.classList.remove('az-hidden');
      nucletAttachPt.classList.remove('az-hidden');
    }
  }

  function onNucletButton(event) {
    var segments = event.target.id.split('-');
    if (event.target.classList.contains('nuclet-list-button')) {
      var segments = event.target.id.split('-');
      if (event.target.value == 'Edit') {
        setEditNuclet(segments[1]);
      }
      if (event.target.value == 'Add') {
        addNuclet(segments[1]);
      }
    };
  }

  function onAngleChanged(event) {
    editNuclet.parent.rotation.y = (editNuclet.parent.initial_rotation_y + ((event.target.value - 1) * 72)) / 180 *Math.PI;
    editNuclet.az.conf.attachAngle = event.target.value;
    viewer.render();
    return;
  }

  function onNucletDelete(event) {
    var id = editNuclet.az.id;

    // Remove nuclet from the nucleus
    editNuclet.parent.parent.parent.remove(editNuclet.parent.parent);
    viewer.render();

    var listItem;

    listItem = nucleus.az.nucletEditList[id];
    var newListLabel = createNucletItemLabel(id, null);
    var listItemLabel = listItem.getElementsByTagName('SPAN')[0];
    listItemLabel.parentNode.replaceChild(newListLabel, listItemLabel);
    listItem.getElementsByTagName('INPUT')[0].value = 'Add';

    listItem = nucleus.az.nucletEditList[id + '0'];
    if (listItem) {
      listItem.parentNode.removeChild(listItem);
    }

    listItem = nucleus.az.nucletEditList[id + '1'];
    if (listItem) {
      listItem.parentNode.removeChild(listItem);
    }

    setEditNuclet(null);
    // Replace the edit form with the Add button
    return;
  }


  var addProton = function addProton (nuclet, face) {
    // Ok, so we have our first proton to add.  We are adding it to an existing nuclet.
  };

*/

