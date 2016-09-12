/**
 * @file - atomizer.js
 *
 */

Drupal.atomizer.producers.atom_builderC = function (_viewer) {
  var viewer = _viewer;
  var abc = ['a', 'b', 'c'];

  var nucleus;
  var nucleusFile;
  var userNucleusFile;
  var highlightedFace;
  var highlightedNuclet;

  var mouseClick = function mouseClick(event) {
    return;
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
      if (highlightedFace) {
        highlightAttachProtons(highlightedNuclet.protons, highlightedFace);
        highlightedFace = null;
        highlightedNuclet.children[0].remove(viewer.view.ghostProton);
        viewer.scene.remove(viewer.view.ghostProton);
        viewer.render();
      }
    } else {
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
    return viewer.nuclet.objects.selectFace;
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
    intersectObjects: intersectObjects,
    intersected: intersected,
    mouseClick: mouseClick
  };
};
