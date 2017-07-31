/**
 * @file - prod_backbone_builder.js
 *
 * Viewer to create the initial backbone nuclet geometry.
 * Allows a user to add protons one at a time to a helium nuclet.
 * Once the nuclet is completed, the geometry will be stored to build further nuclets.
 *
 */

Drupal.atomizer.producers.backbone_builderC = function (_viewer) {

  var buildInitialBackbone = false;
  var viewer = _viewer;

  var abc = ['a', 'b', 'c'];

  var highlightedFace;
  var highlightedNuclet;
  var intersectList = [];
  var protonRadius = viewer.theme.get('proton--radius');
  var tetrahedronId = 0;
  var protonId = 0;

  var atomConf;
  var atom = new THREE.Group();
  atom.name = 'atom';
  atom.az = {
    protons: {},
    tetrahedrons: {}
  };

  /**
   * Set the defaults for this producer.
   */
  function setDefaults() {
  }

  /**
   * Create the ghost proton and wireframe that appear when hovering over a valid face to add a proton.
   *
   * @param type
   * @returns {THREE.Group}
   */
  var createTetrahedron = function createTetrahedron(type) {
    // Create a new ghost wireframe
    var tetrahedron = new THREE.Group();
    tetrahedron.name = 'tetrahedron';
    tetrahedron.protons = [];
    tetrahedron.protonRadius = protonRadius;

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

  /** Add a new proton and wireframe to the nuclet.
   *
   * @param event
   */
  var mouseClick = function mouseClick(event) {
    if (highlightedFace) {

      highlightAttachProtons(highlightedNuclet.protons, highlightedFace);

      var proton = viewer.view.ghostProton;
      proton.material.color.setHex(parseInt(viewer.theme.get('proton-default--color').replace(/#/, "0x")), 16);

      var tetrahedron = viewer.view.ghostTetrahedron;
      tetrahedron.children[0].material.color.setHex(parseInt(viewer.theme.get('tetraWireframe--color').replace(/#/, "0x")), 16);
      tetrahedron.children[0].name = 'tetraWireframe';
      tetrahedron.children[1].material.color.setHex(parseInt(viewer.theme.get('tetraFaces--color').replace(/#/, "0x")), 16);
      tetrahedron.children[1].name = 'tetraFaces';

      intersectList.push(tetrahedron.children[1]);

      // Add proton to atom list and tetrahedron list
      proton.azid = 'p' + Object.keys(atom.az.protons).length;
      atom.az.protons[proton.azid] = proton;   // Add proton to list of protons
      tetrahedron.protons[3] = proton;    // Add proton to tetrahedron

      // Add tetrahedron to atom list
      tetrahedron.azid = 't' + Object.keys(atom.az.tetrahedrons).length;
      atom.az.tetrahedrons[tetrahedron.azid] = tetrahedron;

      highlightedFace = null;
      highlightedNuclet = null;

      // Create a new ghost Proton
      viewer.view.ghostProton = viewer.nuclet.makeProton(
        'ghost',
        viewer.theme.get('proton--opacity'),
        {x: 300, y: 50, z: 0}
      );

      // Create a new ghost Tetrahedron
      viewer.view.ghostTetrahedron = createTetrahedron('ghost');

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
        highlightAttachProtons(highlightedNuclet.protons, highlightedFace);
        highlightedFace = null;
        highlightedNuclet.children[0].remove(viewer.view.ghostProton);
        highlightedNuclet.children[0].remove(viewer.view.ghostTetrahedron);
        viewer.render();
      }
    } else {
      if (highlightedFace != intersects[0].face) {
        // Change protons back to their original color
        if (highlightedFace) {
          highlightAttachProtons(highlightedNuclet.protons, highlightedFace);
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
          var proton = highlightedNuclet.protons[vertice];

          // Add the protons position to the centroid
          highlightedFace.centroid.add(proton.position);

          // Set the tetrahedron vertice from the proton position
          viewer.view.ghostTetrahedron.children[0].geometry.vertices[i].copy(proton.position);

          viewer.view.ghostTetrahedron.protons[i] = proton;
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

        color = viewer.theme.get('proton-vattach--color');
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

  /**
   * Create an array for the protons and faces of the current atom.  Save to YAML file.
   * @param data
   */
  var saveYml = function saveYml(data) {
    var nuclet = {
      name: data.name,
      protonRadius: protonRadius,
      protons: {},
      components: {}
    };

    for (var pid in atom.az.protons) {
      var proton = atom.az.protons[pid];
      nuclet.protons[pid] = {
//      position: proton.position.multiplyScalar(1 / protonRadius),
        position: proton.position,
        attachments: []
      };
    }

    for (var tid in atom.az.tetrahedrons) {
      var tetrahedron = atom.az.tetrahedrons[tid];
      var list = [];
      for (var i = 0; i < tetrahedron.protons.length; i++) {
        var pid = tetrahedron.protons[i].azid;
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
        source: 'backbone_builder',
        component: 'theme',
        filepath: data.filepath,
        ymlContents: nuclet
      },
      savedYml
    );
    return;
  };

  /**
   * The atom was saved, display a message.
   *
   * @param response
   */
  var savedYml = function savedYml (response) {
    // display a message.
    return;
  };

  /**
   * Load a theme yml file and make it the current theme set.
   *
   * @param results
   */
  var loadYml = function (results) {
    createAtom(results);
  };

  /**
   * Start the AJAX load of a new atom.
   *
   * @param filepath
   * @param settings
   */
  var loadAtom = function loadAtom (filepath, settings) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/loadYml',
      { component: 'backbone',
        settings: {fart: 'cool'},
        filepath: filepath
      },
      createAtom
    );
  };

  /**
   * A new atom has been successfully loaded, create it and render it.
   *
   * @param results
   */
  var createAtom = function createAtom (results) {

    function createNuclet(num) {
      // Use the proton configuration information to create a geometry.
      var geometry = new THREE.Geometry();
      for (var pid in atomConf.protons) {
        var protonConf = atomConf.protons[pid];
        var pos = new THREE.Vector3(
          protonConf.position['x'],
          protonConf.position['y'],
          protonConf.position['z']
        );
        geometry.vertices.push(pos);
      }

      if (buildInitialBackbone) {
        // Do translations to initial geometry
        geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 4));
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-geometry.vertices[8].x, -geometry.vertices[8].y, 0));
        geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
        geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI / 2.125));
        geometry.verticesNeedUpdate = true;
        viewer.render();
        if (num == 1) {
          geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));
          geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI));
        }
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -geometry.vertices[6].y, 0));
      }

      //  Create Protons
      var p = 0;
      for (var pid in atomConf.protons) {
        var protonConf = atomConf.protons[pid];
        var position = geometry.vertices[p];
        var proton = viewer.nuclet.makeProton(
          'default',
          viewer.theme.get('proton--opacity'),
          {
            x: position['x'],
            y: position['y'],
            z: position['z']
          }
        );
        proton.azid = 'p' + protonId++;
        atom.az.protons[proton.azid] = proton;
        atom.add(proton);
        p++;
      }
      var verticeIds = viewer.sprites.createVerticeIds ('proton', geometry);
      atom.add(verticeIds);

      // Create Tetrahedrons
      for (var tid in atomConf.components) {
        var geometryConf = atomConf.components[tid];
        if (geometryConf.geometry == 'tetrahedron') {
          // Add the first tetrahedrons
          var tetrahedron = createTetrahedron('tetra');
          tetrahedron.azid = 't' + tetrahedronId++;
          intersectList.push(tetrahedron.children[1]); // Attach the faces Mesh
          atom.az.tetrahedrons[tetrahedron.azid] = tetrahedron;

          // Set 4 vertices of tetrahedron
          tetrahedron.children[1].geometry.protons = [];
          for (var v = 0; v < 4; v++) {
            var pid;
            if (num == 1) {
              var pid2 = parseInt(geometryConf.protons[v].replace('p', '')) + 10;
              pid = 'p' + pid2.toString();
              if (pid == 'p09') pid = 'p9';
            } else {
              pid = geometryConf.protons[v];
            }
            var proton = atomConf.protons[pid];
            tetrahedron.children[0].geometry.vertices[v].x = atom.az.protons[pid].position.x;
            tetrahedron.children[0].geometry.vertices[v].y = atom.az.protons[pid].position.y;
            tetrahedron.children[0].geometry.vertices[v].z = atom.az.protons[pid].position.z;

            tetrahedron.children[1].geometry.vertices[v].x = atom.az.protons[pid].position.x;
            tetrahedron.children[1].geometry.vertices[v].y = atom.az.protons[pid].position.y;
            tetrahedron.children[1].geometry.vertices[v].z = atom.az.protons[pid].position.z;

            // Save the proton list in tetrafaces mesh
            tetrahedron.protons[v] = atom.az.protons[pid];
          }

  //      tetrahedron.children[0].geometry.verticesNeedUpdate = true;
  //      tetrahedron.children[0].geometry.normalsNeedUpdate = true;
  //      tetrahedron.children[0].geometry.elementsNeedUpdate = true;
  //      tetrahedron.children[0].geometry.uvsNeedUpdate = true;
  //      tetrahedron.children[0].geometry.tangentsNeedUpdate = true;
  //      tetrahedron.children[0].geometry.computeFaceNormals();
  //      tetrahedron.children[0].geometry.computeVertexNormals();

  //      tetrahedron.children[1].geometry.verticesNeedUpdate = true;
  //      tetrahedron.children[1].geometry.normalsNeedUpdate = true;
  //      tetrahedron.children[1].geometry.elementsNeedUpdate = true;
  //      tetrahedron.children[1].geometry.uvsNeedUpdate = true;
  //      tetrahedron.children[1].geometry.tangentsNeedUpdate = true;
  //      tetrahedron.children[1].geometry.computeFaceNormals();
  //      tetrahedron.children[1].geometry.computeVertexNormals();

//        tetrahedron.scale.set(5, 5, 5);
          atom.add(tetrahedron);
        }
      }
    } // end function createNuclet()

    tetrahedronId = 0;
    protonId = 0;

    if (atom) {
      viewer.scene.remove(atom);
    }
    atomConf = results[0].ymlContents;
    atomConf['filepath'] = results[0].data.filepath;
    localStorage.setItem('atomizer_builder_backbone', results[0].data.filepath.replace(/^.*[\\\/]/, ''));

    atom = new THREE.Group();
    atom.add(new THREE.AxisHelper(500));
    atom.name = 'atom';
    atom.az = {
      protons: [],
      tetrahedrons: []
    }

    for (var i = 0; i < 2; i++) {
      if (!buildInitialBackbone && i == 1) {

      } else {
        createNuclet(i);
      }
    }

    if (buildInitialBackbone) {
      var proton;
      x = 0;
      y = -80.25;
      z = 50;
      // Create ghost proton
      proton = viewer.nuclet.makeProton(
        'default',
        viewer.theme.get('proton--opacity'),
        {x: x, y: y, z: z}
      );
      proton.azid = 'p18';
      atom.az.protons['p18'] = proton;
      atom.add(proton);

      // Create ghost proton
      proton = viewer.nuclet.makeProton(
        'default',
        viewer.theme.get('proton--opacity'),
        {x: x, y: y, z: -z}
      );
      proton.azid = 'p19';
      atom.az.protons['p19'] = proton;
      atom.add(proton);
    }

    // Add the atom to the scene and render it.
    viewer.scene.add(atom);
    viewer.render();
  };

  /**
   * Create the initial view.
   */
  var createView = function () {
    viewer.nuclet = Drupal.atomizer.nucletC(viewer);
    viewer.atom = Drupal.atomizer.atomC(viewer);

    // model after the atom - read in the file and build it.
    viewer.backbone = {
      getYmlDirectory: function () { return 'config/backbone'; },
      saveYml: saveYml,
      loadYml: loadYml
    };

    // Create ghost proton
    viewer.view.ghostProton = viewer.nuclet.makeProton(
      'ghost',
      viewer.theme.get('proton--opacity'),
      {x: 300, y: 50, z: 0}
    );


    // Create ghost Tetrahedron
    var tetrahedron = createTetrahedron('ghost');
    tetrahedron.protons = [];
    viewer.view.ghostTetrahedron = tetrahedron;

    // Start loading the default atom.
//  loadAtom('config/backbone/half_backbone.yml');
    if (buildInitialBackbone) {
      loadAtom('config/backbone/half_backbone.yml');
    } else {
      loadAtom('config/backbone/back.yml');
    }
  };

  // Set functions to return for external use - makes this into a pseudo class.
  return {
    setDefaults: setDefaults,
    createView: createView,
    intersectObjects: intersectObjects,
    intersected: intersected,
    mouseClick: mouseClick,
  };
};
