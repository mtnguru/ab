/**
 * @file - prod_backbone.js
 *
 * Viewer to create the initial backbone nuclet geometry.
 * Allows a user to add protons one at a time to a helium nuclet.
 * Once the nuclet is completed, the geometry will be stored to build further nuclets.
 *
 */

Drupal.atomizer.producers.backbone_builderC = function (_viewer) {

  var viewer = _viewer;
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.nucleus = Drupal.atomizer.nucleusC(viewer);

  var abc = ['a', 'b', 'c'];

  var highlightedFace;
  var highlightedNuclet;
  var intersectList = [];

  var nucleus = new THREE.Group();
  nucleus.name = 'nucleus';
  nucleus.az = {
    protons: [],
    tetrahedrons: []
  };

  /**
   * Set the defaults for this producer.
   */
  function setDefaults() {
  }

  /**
   * Highlight the protons the new proton will attach to.
   *
   * @param protons
   * @param face
   * @param color
   */
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

  /**
   * Create the ghost proton and wireframe that appear when hovering over a valid face to add a proton.
   */
  var createTetrahedron = function createTetrahedron(type) {
    // Create a new ghost wireframe
    var tetrahedron = new THREE.Group();
    tetrahedron.name = 'tetrahedron';
    tetrahedron.protons = [];
    tetrahedron.protonRadius = viewer.style.get('proton--radius');

    var geometry = new THREE.TetrahedronGeometry(viewer.nuclet.protonRadius * 1.222);
    geometry.dynamic = true;

    // Create Wireframe
    tetrahedron.add(viewer.nuclet.createGeometryWireframe(
      type + 'Wireframe',
      1,
      geometry,
      null,
      null
    ));

    // Create faces
    tetrahedron.add(viewer.nuclet.createGeometryFaces(
      type + 'Faces',
      1,
      geometry,
      null,
      null
    ));

    return tetrahedron;
  };

  /** Add a new proton and wireframe to the nuclet.
   *
   * @param event
   */
  var mouseClick = function mouseClick(event) {
    if (highlightedFace) {

      highlightAttachProtons(nucleus.az.protons, highlightedFace);

      var proton = viewer.view.ghostProton;
      proton.material.color.setHex(parseInt(viewer.style.get('proton-default--color').replace(/#/, "0x")), 16);

      var tetrahedron = viewer.view.ghostTetrahedron;
      tetrahedron.children[0].material.color.setHex(parseInt(viewer.style.get('tetraWireframe--color').replace(/#/, "0x")), 16);
      tetrahedron.children[1].name = 'tetraWireframe';
      tetrahedron.children[1].material.color.setHex(parseInt(viewer.style.get('tetraFaces--color').replace(/#/, "0x")), 16);
      tetrahedron.children[1].name = 'tetraFaces';
      tetrahedron.protons[3] = proton;
      intersectList.push(tetrahedron.children[1]);

      nucleus.az.protons.push(proton);
      nucleus.az.tetrahedrons.push(tetrahedron);

      // Add proton to nuclet
      highlightedFace = null;
      highlightedNuclet = null;

      // Create new ghost Proton
      viewer.view.ghostProton = viewer.nuclet.makeProton(
        'ghost',
        viewer.style.get('proton--opacity'),
        {x: 300, y: 50, z: 0}
      );

      // Create new ghost Tetrahedron
      var tetrahedron = createTetrahedron('ghost');
      viewer.view.ghostTetrahedron = tetrahedron;

      viewer.render();
    }
  };

  /**
   * Mouse intersects an active face on a tetrahedron.
   * @param intersects
   */
  var intersected = function intersected(intersects) {
    // If a face is intersected then add the new tetrahedron/proton temporarily until intersect is gone.
    if (intersects.length == 0) {
      if (highlightedFace) {
        highlightAttachProtons(nucleus.az.protons, highlightedFace);
        highlightedFace = {};
        highlightedNuclet.children[0].remove(viewer.view.ghostProton);
        highlightedNuclet.children[0].remove(viewer.view.ghostTetrahedron);
        viewer.render();
      }
    } else {
      if (highlightedFace != intersects[0].face) {
        // Change protons back to their original color
        if (highlightedFace) {
          highlightAttachProtons(nucleus.az.protons, highlightedFace);
          highlightedNuclet.children[0].remove(viewer.view.ghostProton);
          highlightedNuclet.children[0].remove(viewer.view.ghostTetrahedron);
        }

        highlightedFace = intersects[0].face;
        var faceIndex = intersects[0].faceIndex;
        highlightedNuclet = intersects[0].object.parent;

//      if (!highlightedNuclet.azfaces[faceIndex].attachProton) return;

        // Find vertices for this face and find the centroid.
        highlightedFace.centroid = new THREE.Vector3(0, 0, 0);
        for (var i in abc) {
          var vertice = highlightedFace[abc[i]];
          if (nucleus.az.protons[vertice]) {
            var proton   = nucleus.az.protons[vertice];
            var position = nucleus.az.protons[vertice].position;
            highlightedFace.centroid.add(position);
            viewer.view.ghostTetrahedron.children[0].geometry.vertices[i].copy(position);
            if (!nucleus.az.protons[vertice]) {
              alert('highlighted protons not found ' + vertice);
            } else if (!viewer.view.ghostTetrahedron.protons) {
              alert('ghost protons not found ' + vertice);
            } else {
              viewer.view.ghostTetrahedron.protons[i] = nucleus.az.protons[vertice];
            }
          } else {
            return;
          }
        }
        highlightedFace.centroid.divideScalar(3);


        // Scale the face normal to proper length.
        var normal = highlightedFace.normal;
        var scale = 1.615;
        var scaled_normal = {
          x: normal.x * scale * highlightedNuclet.protonRadius,
          y: normal.y * scale * highlightedNuclet.protonRadius,
          z: normal.z * scale * highlightedNuclet.protonRadius
        };

        // Calculate the location of the fourth vertex.
        var v4 = {
          x: highlightedFace.centroid.x + scaled_normal.x,
          y: highlightedFace.centroid.y + scaled_normal.y,
          z: highlightedFace.centroid.z + scaled_normal.z,
        };

        // Set the ghost protons fourth vertice and add to the nuclet
        viewer.view.ghostProton.position.copy(v4);
        highlightedNuclet.children[0].add(viewer.view.ghostProton);

        // Set the ghost wireframes fourth vertex and add to the nuclet
        viewer.view.ghostTetrahedron.children[0].geometry.vertices[3].copy(v4);
        viewer.view.ghostTetrahedron.children[0].geometry.verticesNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[0].geometry.normalsNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[0].geometry.elementsNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[0].geometry.uvsNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[0].geometry.tangentsNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[0].geometry.computeFaceNormals();
        viewer.view.ghostTetrahedron.children[0].geometry.computeVertexNormals();

        viewer.view.ghostTetrahedron.children[1].geometry.vertices[3].copy(v4);
        viewer.view.ghostTetrahedron.children[1].geometry.verticesNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[1].geometry.normalsNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[1].geometry.elementsNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[1].geometry.uvsNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[1].geometry.tangentsNeedUpdate = true;
        viewer.view.ghostTetrahedron.children[1].geometry.computeFaceNormals();
        viewer.view.ghostTetrahedron.children[1].geometry.computeVertexNormals();
        highlightedNuclet.children[0].add(viewer.view.ghostTetrahedron);

        color = viewer.style.get('proton-vattach--color');
        highlightAttachProtons(highlightedNuclet.protons, highlightedFace, color.replace('#', '0x'));

        viewer.render();
      }
    }
  };

  /**
   * Provide external access to the objects which are to be intersected with the mouse.
   *
   * @returns {Array}
   */
  var intersectObjects = function intersectObjects() {
    return intersectList;
  };

  var saveYml = function saveYml(data) {
    var nuclet = {
      name: data.name,
      protonRadius: viewer.style.get('proton--radius'),
      protons: {},
      geometries: {}
    };

    for (var p = 0; p < nucleus.az.protons.length; p++) {
      var proton = nucleus.az.protons[p];
      var pid = 'p' + p.toString();
      nuclet.protons[pid] = {
        position: proton.position,
        attachments: []
      };
    }

    for (var t = 0; t < nucleus.az.tetrahedrons.length; t++) {
      var tetrahedron = nucleus.az.tetrahedrons[t];
      var list = [];
      var tid = 't' + t.toString();
      for (var i = 0; i < tetrahedron.protons.length; i++) {
        var pid = 'p' + tetrahedron.protons[i].protonId;
        list[i] = pid;
        nuclet.protons[pid].attachments.push(tid);
      }
      nuclet.geometries[tid] = {
        geometry: 'tetrahedron',
        protons: list
      }
    }

    // Create file which stores position of all protons.
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: data.name,
        component: 'style',
        filepath: data.filepath,
        ymlContents: nuclet
      },
      savedYml
    );
    return;
  };

  var savedYml = function savedYml (response) {
    // display a message.
    return;
  };

  /**
   * Load a style yml file and make it the current style set.
   *
   * @param results
   */
  var loadYml = function (results) {
    createNucleus(results);
  };

  var loadNucleus = function loadNucleus (filepath, settings) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/loadYml',
      { component: 'backbone',
        settings: {fart: 'cool'},
        filepath: filepath
      },
      createNucleus
    );
  };

  var createNucleus = function createNucleus (results) {
    if (nucleus) {
      viewer.scene.remove(nucleus);
    }
    var nucleusConf = results[0].ymlContents;
    nucleusConf['filepath'] = results[0].data.filepath;
    localStorage.setItem('atomizer_builder_backbone', results[0].data.filepath.replace(/^.*[\\\/]/, ''));

    nucleus = new THREE.Group();
    nucleus.name = 'nucleus';
    nucleus.az = {
      protons: [],
      tetrahedrons: []
    }

    //  Create Protons
    for (var n in nucleusConf.protons) {
      var protonConf = nucleusConf.protons[n];
      var proton = viewer.nuclet.makeProton(
        'default',
        viewer.style.get('proton--opacity'),
        {
          x: protonConf.position['x'],
          y: protonConf.position['y'],
          z: protonConf.position['z']
        }
      );
      nucleus.az.protons.push(proton);
      nucleus.add(proton);
    }

    // Create Tetrahedrons
    for (var n in nucleusConf.geometries) {
      var geometryConf = nucleusConf.geometries[n];
      if (geometryConf.geometry == 'tetrahedron') {
        // Add the first tetrahedrons
        var tetrahedron = createTetrahedron('tetra');
        intersectList.push(tetrahedron.children[1]); // Attach the faces Mesh
        nucleus.az.tetrahedrons.push(tetrahedron);

        for (var v = 0; v < 4; v++) {
          var pid = geometryConf.protons[v];
          var proton = nucleusConf.protons[pid];
          tetrahedron.children[0].geometry.vertices[v].x = proton.position.x;
          tetrahedron.children[0].geometry.vertices[v].y = proton.position.y;
          tetrahedron.children[0].geometry.vertices[v].z = proton.position.z;
          tetrahedron.children[0].geometry.verticesNeedUpdate = true;
          tetrahedron.children[0].geometry.normalsNeedUpdate = true;
          tetrahedron.children[0].geometry.elementsNeedUpdate = true;
          tetrahedron.children[0].geometry.uvsNeedUpdate = true;
          tetrahedron.children[0].geometry.tangentsNeedUpdate = true;
          tetrahedron.children[0].geometry.computeFaceNormals();
          tetrahedron.children[0].geometry.computeVertexNormals();

          tetrahedron.children[1].geometry.vertices[v].x = proton.position.x;
          tetrahedron.children[1].geometry.vertices[v].y = proton.position.y;
          tetrahedron.children[1].geometry.vertices[v].z = proton.position.z;
          tetrahedron.children[1].geometry.verticesNeedUpdate = true;
          tetrahedron.children[1].geometry.normalsNeedUpdate = true;
          tetrahedron.children[1].geometry.elementsNeedUpdate = true;
          tetrahedron.children[1].geometry.uvsNeedUpdate = true;
          tetrahedron.children[1].geometry.tangentsNeedUpdate = true;
          tetrahedron.children[1].geometry.computeFaceNormals();
          tetrahedron.children[1].geometry.computeVertexNormals();

        }

        nucleus.add(tetrahedron);
      }
    }

    // Add the nucleus to the scene and render it.
    viewer.scene.add(nucleus);
    viewer.render();
  };



  /**
   * Create the initial view.
   */
  var createView = function () {


    // model after the nucleus - read in the file and build it.
    viewer.backbone = {
      getYmlDirectory: function () { return 'config/backbone'; },
      saveYml: saveYml,
      loadYml: loadYml
    };

    /**
    // Add the first tetrahedron
    var tetrahedron = createTetrahedron('tetra');
    intersectList.push(tetrahedron.children[1]); // Attach the faces Mesh
    nucleus.az.tetrahedrons.push(tetrahedron);

    nucleus.add(tetrahedron);

    // Add the protons
    var vertices = tetrahedron.children[0].geometry.vertices;
    for (var i = 0; i < 4; i++) {
      var proton = viewer.nuclet.makeProton(
        'default',
        viewer.style.get('proton--opacity'),
        {
          x: vertices[i].x,
          y: vertices[i].y,
          z: vertices[i].z
        }
      );
      tetrahedron.protons[i] = proton;
      nucleus.az.protons.push(proton);
      tetrahedron.add(proton);
    }
    **/

    // Create ghost proton
    viewer.view.ghostProton = viewer.nuclet.makeProton(
      'ghost',
      viewer.style.get('proton--opacity'),
      {x: 300, y: 50, z: 0}
    );

    // Create ghost Tetrahedron
    var tetrahedron = createTetrahedron('ghost');
    tetrahedron.protons = [];
    viewer.view.ghostTetrahedron = tetrahedron;

    loadNucleus('config/backbone/backbone.yml');
  };

  return {
    setDefaults: setDefaults,
    createView: createView,
    intersectObjects: intersectObjects,
    intersected: intersected,
    mouseClick: mouseClick,
  };
};
