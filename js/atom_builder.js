Drupal.behaviors.atom_builder = {
  attach: function (context, settings) {
    var stats;     // Statistics pane in upper left corner of screen
    var controls;  // Controls in upper left corner of screen
    var scene;     // The full scene being displayed
    var renderer;  // WebGLRenderer
    var canvasContainer;
    var canvas;
    var canvasWidth;
    var canvasHeight;
    var camera;
    var cameraTrackballControls;
    var atomTrackballControls;
    var selectedObject;
    var objects = {
      protons: [],
      nuclets: [],
    };
    var mouseMode = 'Camera';
    var nucletNames = ['tetraLet', 'octaLet', 'icoLet', 'pentaLet'];

    var conf = {
      proton: {
        radius: 32,
        opacity: .9,
        colors: {
          default: 0x6666dd,
          top: 0xd4af37,
          bottom: 0xdd66dd,
          marker: 0x55dddd
        }
      },
      innerElectron: {
        opacity: .9
      },
      outerElectron: {
        opacity: .9
      },
      tetraLet: {          // Helium 4
        scale: 1.5,
        length: 36.5,
        height: 52,
        wireframe: {
          scale: 2.45,
          offset: {
            y: 20
          }
        },
        axis: {
          scale: 4.0
        }
      },
      pentaLet: {  // Lithium 7
        radius: 50,
        height: 35,
        wireframe: {
          scale: 2.15,
        },
        axis: {
          scale: 3.0
        }
      },
      icoLet: {          // Carbon 12
        wireframe: {
          scale: 1.66,
        },
        axis: {
          scale: 2.5
        }
      },
      geometry: {
        opacity: .3,
        color: 0xaaffff
      },
      axis: {
        opacity: .3,
        color: 0xffffaa
      },
      isotope: {
        opacity: .3,
        color: 0xffffff
      },
      valence: {
        opacity: .3,
        color: 0xffbbff
      },
      camera: {
        perspective: 25,
        position: {
          x: 0,
          y: 1400,
          z: -1400
        }
      },
      renderer: {
        clearColor: 0xddeedd
      },
      plane: {
        color: 0xcceecc,
        width: 860,
        depth: 860
      }
    };

    /**
     * Initialize the statistics displayed in upper left corner of screen.
     * @returns {Stats}
     */
    function initStats() {

      var stats = new Stats();
      stats.setMode(0); // 0: fps, 1: ms

      // Align top-left
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';

      document.getElementById("Stats-output").appendChild(stats.domElement);

      return stats;
    }

    /**
     * Create a spotlight.
     *
     * @param v
     * @returns {THREE.SpotLight}
     */
    function makeSpotLight(v) {
      var spotLight = new THREE.SpotLight(v.c);
      spotLight.position.set(v.x || -40, v.y || 60, v.z || -10);
      spotLight.castShadow = true;
      return spotLight;
    }

    function createAxisLine(scale, vertices) {
      var axisGeometry = new THREE.Geometry();
      axisGeometry.vertices.push(new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z));
      axisGeometry.vertices.push(new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z));
      var lineMaterial = new THREE.LineBasicMaterial({
        color: conf.axis.color,
        transparent: true,
        opacity: conf.axis.opacity,
        linewidth: 2
      });
      var axisLine = new THREE.Line(axisGeometry, lineMaterial);
      axisLine.scale.set(scale, scale, scale);
      axisLine.name = 'axis';
      return axisLine;
    }

    function createGeometryWireframe(scale, geometry, offset) {
      var wireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: conf.geometry.color,
        transparent: true,
        opacity: conf.geometry.opacity,
        wireframe: true,
      }));
      wireframe.scale.set(scale, scale, scale);
      wireframe.init_scale = scale;
      wireframe.name = 'geometry';
      if (offset) {
        if (offset.x) wireframe.position.x = offset.x;
        if (offset.y) wireframe.position.y = offset.y;
        if (offset.z) wireframe.position.z = offset.z;
        wireframe.init_offset = offset;
      }
      return wireframe;
    }

    function makeObject(name, mat, geo, pos) {
      // Set the geometry
      var geometry;
      var receiveShadow = false;
      switch (name) {
        case 'plane':
          receiveShadow = true;
          geometry = new THREE.PlaneGeometry(
            geo.width || 1000,
            geo.depth || 1000
          );
          break;
        case 'proton':
        case 'sphere':
          geometry = new THREE.SphereGeometry(
            geo.radius || 50,
            geo.widthSegments || 25,
            geo.heightSegments || 25
          );
          break;
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(geo.length || 3);
          break;
        case 'tetrahedron':
          geometry = new THREE.TetrahedronGeometry(geo.length || 3);
          break;
        case 'icosahedron':
          geometry = new THREE.IcosahedronGeometry(geo.length || 3);
          break;
        case 'cube':
          var l = geo.length || 4;
          geometry = new THREE.BoxGeometry(l, l, l);
          break;
        case 'pentagonal_bipyramid':
          geometry = createBiPyramid(5, geo.length, geo.height, 35);
          break;
      }

      // Set the Mesh material
      var materials = [];
      if (mat.wireframe) {
        materials.push(new THREE.MeshBasicMaterial(mat.wireframe));
      }

      if (mat.lambert) {
        materials.push(new THREE.MeshLambertMaterial(mat.lambert));
      }

      if (mat.phong) {
        materials.push(new THREE.MeshPhongMaterial(mat.phong));
      }

      if (mat.doubleSided) {
        materials[0].side = THREE.DoubleSide;
      }

      // Create the object
      var object;
      if (materials.length == 1) {
        object = new THREE.Mesh(geometry, materials[0]);
      } else {
        object = new THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
      }

      // Set rotation and shadows
      if (pos.rotation) {
        if (pos.rotation.x) {
          object.rotation.x = pos.rotation.x;
        }
        if (pos.rotation.y) {
          object.rotation.y = pos.rotation.y;
        }
        if (pos.rotation.z) {
          object.rotation.z = pos.rotation.z;
        }
      }

      // Position the object
      object.position.x = pos.x || 0;
      object.position.y = pos.y || 0;
      object.position.z = pos.z || 0;

      object.receiveShadow = receiveShadow;
      object.name = name;

      return object;
    }

    function createIcosahedron(prop, pos) {
      // Set proton colors
      var c = {
        0: conf.proton.colors.marker,
        1: conf.proton.colors.top,
        2: conf.proton.colors.bottom,
        3: conf.proton.colors.default,
        4: conf.proton.colors.default,
        5: conf.proton.colors.default,
        6: conf.proton.colors.default,
        7: conf.proton.colors.default,
        8: conf.proton.colors.default,
        9: conf.proton.colors.default,
        10: conf.proton.colors.default,
        11: conf.proton.colors.default
      };
      var c2 = {
        0: conf.proton.colors.default,
        1: conf.proton.colors.default,
        2: conf.proton.colors.default,
        3: conf.proton.colors.default,
        4: conf.proton.colors.default,
        5: conf.proton.colors.default,
        6: conf.proton.colors.default,
        7: conf.proton.colors.default,
        8: conf.proton.colors.default,
        9: conf.proton.colors.default,
        10: conf.proton.colors.default,
        11: conf.proton.colors.default
      };

      var atom = new THREE.Group();
      atom.name = 'icoLet';
      var geometry = new THREE.IcosahedronGeometry(60);

      // Add Protons
      for (var key in geometry.vertices) {
        var vertice = geometry.vertices[key];
        var proton = makeObject('proton',
          {phong: {color: c[key], opacity: conf.proton.opacity || 1, transparent: true}},
          {radius: conf.proton.radius},
          {
            x: vertice.x,
            y: vertice.y,
            z: vertice.z,
          }
        );
        objects.protons.push(proton);
        atom.add(proton);
      }

      atom.add(createGeometryWireframe(1.66, geometry));
      atom.add(createAxisLine(2.5, [geometry.vertices[1], geometry.vertices[2]]));

      // Position and rotate the atom
      atom.position.x = pos.x;
      atom.position.y = pos.y;
      atom.position.z = pos.z;
      atom.rotation.init_z = .552;
      atom.rotation.z = .552;

      return atom;
    }

    function createPentagonalBiPyramid(prop, pos) {
      // Set proton colors
      var c = {
        0: conf.proton.colors.top,
        1: conf.proton.colors.bottom,
        2: conf.proton.colors.marker,
        3: conf.proton.colors.default,
        4: conf.proton.colors.default,
        5: conf.proton.colors.default,
        6: conf.proton.colors.default
      };

      var atom = new THREE.Group();
      atom.name = 'pentaLet';
      var geometry = createBiPyramid(5, conf.pentaLet.radius, conf.pentaLet.height);

      // Add the protons
      for (var key in geometry.vertices) {
        var vertice = geometry.vertices[key];
        var proton = makeObject('proton',
          {phong: {color: c[key], opacity: conf.proton.opacity, transparent: true}},
          {radius: conf.proton.radius},
          {
            x: vertice.x,
            y: vertice.y,
            z: vertice.z
          }
        );
        objects.protons.push(proton);
        atom.add(proton);
      }

      atom.add(createGeometryWireframe(conf.pentaLet.wireframe.scale, geometry));
      atom.add(createAxisLine(conf.pentaLet.wireframe.scale, [geometry.vertices[0], geometry.vertices[1]]));

      // Position the atom
      atom.position.x = pos.x;
      atom.position.y = pos.y;
      atom.position.z = pos.z;
      objects.nuclets.push(atom);
      return atom;
    }

    function createTetrahedron(prop, pos) {
      // Set proton colors
      var c = {
        0: conf.proton.colors.top,
        1: conf.proton.colors.marker,
        2: conf.proton.colors.default,
        3: conf.proton.colors.default,
      };

      var atom = new THREE.Group();
      atom.name = 'tetraLet';
      var geometry = createPyramid(3, conf.tetraLet.length, conf.tetraLet.height);

      // Add the protons
      for (var key in geometry.vertices) {
        var vertice = geometry.vertices[key];
        var proton = makeObject('proton',
          {phong: {color: c[key], opacity: conf.proton.opacity, transparent: true}},
          {radius: conf.proton.radius},
          {
            x: vertice.x,
            y: vertice.y,
            z: vertice.z
          }
        );
        objects.protons.push(proton);
        atom.add(proton);
      }

      atom.add(createGeometryWireframe(conf.tetraLet.wireframe.scale, geometry, {y: conf.tetraLet.wireframe.offset.y}));
      atom.add(createAxisLine(conf.tetraLet.axis.scale,
        [geometry.vertices[0], {
          x: geometry.vertices[0].x,
          y: -geometry.vertices[0].y,
          z: geometry.vertices[0].z

        }]
      ));

      //  atom.add(THREE.axisHelper(200));

      // Position the atom
      atom.position.x = pos.x;
      atom.position.y = pos.y;
      atom.position.z = pos.z;
      objects.nuclets.push(atom);
      return atom;
    }

    function createPyramid(n, rad, len) {
      var len2 = len / 2;
      var geom = new THREE.Geometry();

      // Create the apexes
      geom.vertices.push(new THREE.Vector3(0, len2, 0));
      // Then the vertices of the base
      var inc = 2 * Math.PI / n;
      for (var i = 0, a = Math.PI; i < n; i++, a += inc) {
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad * cos, -len2, rad * sin));
      }

      // push the n triangular faces...
      for (var i = 1; i < n; i++) {
        geom.faces.push(new THREE.Face3(i + 1, i, 0));
      }
      // push the last face
      geom.faces.push(new THREE.Face3(1, n, 0));       // top

      // push the n-2 faces of the base
      for (var i = 2; i < n; i++) {
        geom.faces.push(new THREE.Face3(i, i + 1, 1));
      }
      // set face normals and return the geometry
      geom.computeFaceNormals();
      return geom;
    }

    function createBiPyramid(n, rad, len) {
      var geom = new THREE.Geometry();

      // Create the apexes
      geom.vertices.push(new THREE.Vector3(0, len, 0));
      geom.vertices.push(new THREE.Vector3(0, -len, 0));
      // Then the vertices of the base
      var inc = 2 * Math.PI / n;
      for (var i = 0, a = Math.PI; i < n; i++, a += inc) {
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad * cos, 0, rad * sin));
      }

      // push the n triangular faces...
      for (var i = 2; i < n + 1; i++) {
        geom.faces.push(new THREE.Face3(i + 1, i, 0));   // top pyramid
        geom.faces.push(new THREE.Face3(1, i, i + 1));   // bottom pyramid
      }
      // push the last face
      geom.faces.push(new THREE.Face3(2, n + 1, 0));       // top
      geom.faces.push(new THREE.Face3(1, n + 1, 2));       // bottom
      // set face normals and return the geometry
      geom.computeFaceNormals();
      return geom;
    }

    function changeMode(newMode) {
      switch (mouseMode) {
        case 'Move Camera':
          cameraTrackballControls.dispose();
          delete cameraTrackballControls;
          render();
          break;
        case 'Select/Move Atom':
          canvasContainer.removeEventListener('mousedown', onDocumentMouseDown);
          break;
        case 'Select/Move Proton':
          canvasContainer.removeEventListener('mousedown', onDocumentMouseDown);
          break;
        case 'Rotate Selection':
          cameraTrackballControls.dispose();
          delete cameraTrackballControls;
          break;
      }
      switch (newMode) {
        case 'Move Camera':
          cameraTrackballControls = createCameraTrackballControls();
          break;
        case 'Select Atom':
          canvasContainer.addEventListener('mousedown', onDocumentMouseDown, false);
          break;
        case 'Select Proton':
          canvasContainer.addEventListener('mousedown', onDocumentMouseDown, false);
          break;
        case 'Rotate Selection':
          atomTrackballControls = createAtomTrackballControls(selectedObject);
          break;
      }
      mouseMode = newMode;
      render();

      return;
    }

    /**
     * Change the transparency of all proton on the screen.
     *
     * @param value
     * @returns {*}
     */
    function changeProtonTransparency(value) {
      return value;
      // Change all items transparency.
    }

    /**
     * Apply controls effecting all atoms from the panel in the upper right corner.
     *
     * @param name
     * @param value
     * @param prop
     */
    function applyAtomControl(name, value, prop) {
      if (mouseMode == 'Rotate Selection') {
        var radians = value / 360 * 2 * Math.PI;
        selectedObject.rotation[prop] = radians + (selectedObject.rotation['init_' + prop] || 0);
      } else {
        scene.traverse(function (node) {
          switch (name) {
            case 'rotation':
              var index = nucletNames.indexOf(name);
              if (nucletNames.indexOf(node.name) > -1) {
                var radians = value / 360 * 2 * Math.PI;
                node.rotation[prop] = radians + (node.rotation['init_' + prop] || 0);
              }
              break;
            case 'scaleProtons':
              if (node.name == 'proton') {
                node.scale.set(value, value, value);
              }
              break;
            case 'scaleGeometry':
              if (node.name == 'geometry') {
                var scale = (node.init_scale) ? value * node.init_scale : value;
                node.scale.set(scale, scale, scale);
              }
              break;
            case 'opacityPlane':
              if (node.name == 'plane') {
                node.material.opacity = value
                node.material.visible = (value > .01);
              }
              break;
            case 'opacityProtons':
              if (node.name == 'proton') {
                node.material.opacity = value
                node.material.visible = (value > .01);
              }
              break;
            case 'opacityGeometry':
              if (node.name == 'geometry') {
                node.material.opacity = value;
                node.material.visible = (value > .05);
              }
              break;
            case 'opacityAxis':
              if (node.name == 'axis') {
                node.material.opacity = value;
                node.material.visible = (value > .05);
              }
              break;
            case 'opacityValence':
              if (node.name == 'valence') {
                node.material.opacity = value;
                node.material.visible = (value > .05);
              }
              break;
          }
        });
      }
      render();
    }

    function rotateReset() {
      controls.rotateX = 0;
      controls.rotateY = 0;
      controls.rotateZ = 0;
      scene.traverse(function (node) {
        if (node.name == 'tetraLet' ||
          node.name == 'pentaLet' ||
          node.name == 'icoLet') {
          node.rotation.x = node.rotation['init_x'] || 0;
          node.rotation.y = node.rotation['init_y'] || 0;
          node.rotation.z = node.rotation['init_z'] || 0;
        }
      });
      render();
    }

    function opacityReset() {
      controls.opacityPlane = conf.plane.opacity;
      controls.opacityProtons = conf.proton.opacity;
      controls.opacityAxis = conf.axis.opacity;
      controls.opacityGeometry = conf.geometry.opacity;
      controls.opacityValence = conf.valence.opacity;
      controls.opacityIsotope = conf.isotope.opacity;
      controls.opacityInnerElectrons = conf.innerElectrons.opacity;
      controls.opacityOuterElectrons = conf.outerElectrons.opacity;

      scene.traverse(function (node) {
        var blankline = 5;
        if (node.name == 'proton')   node.material.opacity = conf.proton.opacity;
        if (node.name == 'geometry') node.material.opacity = conf.geometry.opacity;
        if (node.name == 'axis')     node.material.opacity = conf.axis.opacity;
      });
      render();
    }

    function scaleReset() {
      controls.scaleProtons = 1;
      controls.scaleGeometry = 1;
      scene.traverse(function (node) {
        if (node.name == 'proton')   node.scale.set(1, 1, 1);
        if (node.name == 'geometry') node.scale.set(1, 1, 1);
      });
      render();
    }

    /**
     * Create the controls in the upper right corner of screen.
     *
     * Uses the dat.gui.js library.
     *
     * @returns {controls|*}
     */
    function createControls() {
      vars = controls = new function () {

        this.mouseMode = 'Move Camera';
        this.atomicNumber = 0;
        this.element = 'Carbon';
        this.atomicNumber = 6;
        this.numProtons = 12;
        this.valence = 4;

        this.scaleProtons = 1;
        this.scaleGeometry = 1;

        this.opacityPlane = 1;
        this.opacityProtons = 0.90;
        this.opacityAxis = .3;
        this.opacityGeometry = .3;
        this.opacityValence = .3;
        this.opacityIsotope = 0;
        this.opacityInnerElectrons = 0;
        this.opacityOuterElectrons = 0;

        this.setProtonColor = '#8888aa';
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.opacityReset = opacityReset;
        this.scaleReset = scaleReset;
        this.rotateReset = rotateReset;
        this.resetProtonColor = function () {
        }
        this.addProton = function () {
        }
        this.addBlock = function () {
        }
        this.clearScene = function () {
        }
        this.loadBlock = function () {
        }
        this.loadElement = function () {
        }
        this.saveAtom = function () {
        }
      };
      var gui = new dat.GUI({width: 350});
      gui.add(controls, 'mouseMode', ['Move Camera', 'Select Atom', 'Select Proton', 'Rotate Selection']).name('Mouse Mode').onChange(function (value) {
        changeMode(value)
      });

      var objectsFolder = gui.addFolder('--Objects');
      objectsFolder.add(controls, 'addProton').name('--Add Proton');
      objectsFolder.add(controls, 'addBlock').name('--Add Block');
      objectsFolder.add(controls, 'saveAtom').name('--Save Atom');
      objectsFolder.add(controls, 'loadElement').name('--Load Element');
      objectsFolder.add(controls, 'loadBlock').name('--Load Block');
      objectsFolder.add(controls, 'clearScene').name('--Clear Scene');

      var transFolder = gui.addFolder('Transparency');
      transFolder.add(controls, 'opacityPlane', 0, 1, .01).name('Plane').listen().onChange(function (value) {
        applyAtomControl('opacityPlane', value)
      });
      transFolder.add(controls, 'opacityProtons', 0, 1, .01).name('Protons').listen().onChange(function (value) {
        applyAtomControl('opacityProtons', value)
      });
      transFolder.add(controls, 'opacityGeometry', 0, 1, .01).name('Nuclet Geometry').listen().onChange(function (value) {
        applyAtomControl('opacityGeometry', value)
      });
      transFolder.add(controls, 'opacityAxis', 0, 1, .01).name('Nuclet Axis').listen().onChange(function (value) {
        applyAtomControl('opacityAxis', value)
      });
      transFolder.add(controls, 'opacityValence', 0, 1, .01).name('--Valence Attach').listen().onChange(function (value) {
        applyAtomControl('opacityValence', value)
      });
      transFolder.add(controls, 'opacityIsotope', 0, 1, .01).name('--Isotope Attach');
      transFolder.add(controls, 'opacityInnerElectrons', 0, 1, .01).name('--Nuclear Electrons');
      transFolder.add(controls, 'opacityOuterElectrons', 0, 1, .01).name('--Outer Electrons');
      transFolder.add(controls, 'opacityReset').name('Reset Transparency');

      var scaleFolder = gui.addFolder('Scale');
      scaleFolder.add(controls, 'scaleProtons', 0, 2, .1).name('Proton Scale').listen().onChange(function (value) {
        applyAtomControl('scaleProtons', value)
      });
      scaleFolder.add(controls, 'scaleGeometry', 0, 2, .1).name('Geometry Scale').listen().onChange(function (value) {
        applyAtomControl('scaleGeometry', value)
      });
      scaleFolder.add(controls, 'scaleReset').name('Reset Scaling');

      var rotateFolder = gui.addFolder('Rotate Atoms');
      rotateFolder.add(controls, 'rotateX', -360, 360, 1).name('X').listen().onChange(function (value) {
        applyAtomControl('rotation', value, 'x');
      });
      rotateFolder.add(controls, 'rotateY', -360, 360, 1).name('Y').listen().onChange(function (value) {
        applyAtomControl('rotation', value, 'y');
      });
      rotateFolder.add(controls, 'rotateZ', -360, 360, 1).name('Z').listen().onChange(function (value) {
        applyAtomControl('rotation', value, 'z');
      });
      rotateFolder.add(controls, 'rotateReset').name('Reset Rotation');

      var styleFolder = gui.addFolder('--Style');
      styleFolder.addColor(controls, 'setProtonColor').name('--Proton Color');
      styleFolder.add(controls, 'resetProtonColor').name('--Reset Proton Color');

      //  gui.add(controls, 'animateElectrons').name('--Animate Electrons');
      //  gui.add(controls, 'stopControls').name('--Stop Controls');

      return controls;
    }

    /**
     * Create Trackball controls.
     *
     * @returns {THREE.TrackballControls}
     */
    function createCameraTrackballControls() {
      var cameraTrackballControls = new THREE.TrackballControls(camera, renderer.domElement);
      cameraTrackballControls.rotateSpeed = 2.0;
      cameraTrackballControls.zoomSpeed = 1.0;
      cameraTrackballControls.panSpeed = 3.0;
      cameraTrackballControls.noZoom = false;
      cameraTrackballControls.noPan = false;
      cameraTrackballControls.staticMoving = true;
      //  cameraTrackballControls.dynamicDampingFactor=0.3;

      cameraTrackballControls.keys = [65, 83, 68];
      cameraTrackballControls.addEventListener('change', render);
      return cameraTrackballControls;
    }

    /**
     * Create Trackball controls.
     *
     * @returns {THREE.TrackballControls}
     */
    function createAtomTrackballControls(atom) {
      var atomTrackballControls = new THREE.TrackballControls(atom, renderer.domElement);
      atomTrackballControls.rotateSpeed = 2.0;
      atomTrackballControls.zoomSpeed = 1.0;
      atomTrackballControls.panSpeed = 3.0;
      atomTrackballControls.noZoom = false;
      atomTrackballControls.noPan = false;
      atomTrackballControls.staticMoving = true;
      //  atomTrackballControls.dynamicDampingFactor=0.3;

      atomTrackballControls.keys = [65, 83, 68];
      atomTrackballControls.addEventListener('change', render);
      return atomTrackballControls;
    }

    /**
     * Add 3x3 array of Atoms for development purposes.
     */
    function addAtoms() {
      scene.add(createIcosahedron({}, {x: 0, y: 92, z: -300}));
      scene.add(createIcosahedron({}, {x: 0, y: 92, z: 0}));
      scene.add(createIcosahedron({}, {x: 0, y: 92, z: 300}));

      scene.add(createPentagonalBiPyramid({}, {x: -300, y: 67, z: -300}));
      scene.add(createPentagonalBiPyramid({}, {x: -300, y: 67, z: 0}));
      scene.add(createPentagonalBiPyramid({}, {x: -300, y: 67, z: 300}));

      scene.add(createTetrahedron({}, {x: 300, y: 67, z: -300}));
      scene.add(createTetrahedron({}, {x: 300, y: 67, z: 0}));
      scene.add(createTetrahedron({}, {x: 300, y: 67, z: 300}));

      // Playing with solids
      /*
       scene.add(makeObject('tetrahedron',
       { lambert: {color: 0xdd8888},
       wireframe: {color: 0x440000, wireframe: true}},
       { length: 50},
       { x:  300, y: 67, z: -300,
       rotation: {
       x: 0,
       y: .26 * Math.PI,
       z:.2 * Math.PI
       }}
       ));
       scene.add(makeObject('icosahedron',
       { lambert:   {color: 0x88dd88, opacity: .7, transparent: true},
       wireframe: {color: 0x004400, wireframe: true}},
       { length: 70},
       { x: 300, y: 67, z:    0 }
       ));
       scene.add(makeObject('octahedron',
       { lambert:   {color: 0xdd8888, opacity: .7, transparent: true},
       wireframe: {color: 0x440000, wireframe: true}},
       { length: 70},
       { x: 300, y: 67, z:  300}
       )); */
      /*  scene.add(makeObject('pentagonal_bipyramid',
       { lambert:   {color: 0xffaaaa, opacity: .8, transparent: true},
       wireframe: {color: 0x550000, wireframe: true}},
       { length: 75,
       height: 50},
       { x: -400, y: 50, z: 300 }
       )); */
    }

    function onDocumentMouseDown(event) {
      var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
      vector = vector.unproject(camera);

      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersects;
      switch (mouseMode) {
        case 'Select Atom':
          intersects = raycaster.intersectObjects(objects.protons);
          break;
        case 'Select Proton':
          intersects = raycaster.intersectObjects(objects.protons);
          break;
      }
      if (intersects.length > 0) {
        console.log(intersects[0]);

        switch (mouseMode) {
          case 'Select Atom':
            var parent = intersects[0].object.parent;
            selectedObject = parent;
            for (var key in parent.children) {
              var child = parent.children[key];
              child.material.transparent = true;
              child.material.opacity = 0.4;
            }
            break;
          case 'Select Proton':
            intersects[0].object.material.transparent = true;
            intersects[0].object.material.opacity = 0.4;
            break;
        }
        render();
      }
    }

    /**
     * Initialize the Atom Builder.
     */
    function init() {
      stats = initStats();

      canvasContainer = document.getElementById("atom-builder-wrapper");

      // Calculate dimensions of canvas - offsetWidth determines width
      // If offsetHeight is not 0, use it for the height, otherwise make the
      // canvas the same aspect ratio as the browser window.
      canvasWidth = canvasContainer.offsetWidth;
      canvasHeight = (canvasContainer.offsetHeight) ? canvasHeight :
      window.innerHeight / window.innerWidth * canvasContainer.offsetWidth;

      // Create and position the scene
      scene = new THREE.Scene();
      scene.position.x = 0;
      scene.position.y = 0;
      scene.position.z = 0;

      // Create the renderer
      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(conf.renderer.clearColor, 1.0);
      renderer.setSize(canvasWidth, canvasHeight);
      renderer.shadowEnabled = true;

      // Create camera, and point it at the scene
      camera = new THREE.PerspectiveCamera(conf.camera.perspective, canvasWidth / canvasHeight, .1, 10000);
      camera.position.x = conf.camera.position.x;
      camera.position.y = conf.camera.position.y;
      camera.position.z = conf.camera.position.z;
      camera.lookAt(scene.position);

      // Create an ambient light and 2 spotlights
      scene.add(new THREE.AmbientLight(0x555555));
      scene.add(makeSpotLight({c: 0x777744, x: -500, y: 800, z: -500}));
      scene.add(makeSpotLight({c: 0x774477, x: 500, y: 800, z: -500}))

      // Create a background plane
      scene.add(makeObject('plane',
        {lambert: {color: conf.plane.color}},
        {
          width: conf.plane.width,
          depth: conf.plane.depth
        },
        {
          x: 0,
          y: 0,
          z: 0,
          rotation: {x: -0.5 * Math.PI}
        }
      ));

      // Add the Atoms to the screen
      addAtoms();

      // add the output of the renderer to the html element
      canvasContainer.appendChild(renderer.domElement);
      canvas = canvasContainer.querySelector('canvas');

      // Set mode so the mouse moves the camera
      changeMode('Move Camera');

      // Create the controls in the upper right corner of screen
      controls = createControls();

      // Render the scene and animate it
      render();
      animate();
    }

    function animate() {
      requestAnimationFrame(animate);
      if (cameraTrackballControls) {
        cameraTrackballControls.update();
      }
      if (atomTrackballControls) {
        atomTrackballControls.update();
      }
    }

    function render() {
      stats.update();
      renderer.render(scene, camera);
    }

    init();
  }
};
