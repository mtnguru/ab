Drupal.behaviors.atom_builder = {
  attach: function (context, settings) {
    var controls;  // Controls in left sidebar
    var scene;     // The full scene being displayed
    var renderer;  // WebGLRenderer
    var canvasContainer;
    var canvas;
    var canvasWidth;
    var canvasHeight;
    var camera;
    var cameraTrackballControls;
    var atomTrackballControls;
    var style = drupalSettings.atom_builder.styleSet.controls;
    var styler = document.getElementById('edit-styler');
    var selectedObject;
    var objects = {
      protons: [],
      nuclets: [],
    };
    var mouseMode = 'Camera';
    var nucletNames = ['tetraLet', 'octaLet', 'icoLet', 'pentaLet'];

    var protonColors = {
      'marker':  style.proton_marker__color.defaultValue,
      'top':     style.proton_top__color.defaultValue,
      'bottom':  style.proton_bottom__color.defaultValue,
      'default': style.proton_default__color.defaultValue,
    };

    var conf = {
      proton: {
        radius: 32
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
    };

    /**
     * Create a spotlight.
     *
     * @param v
     * @returns {THREE.SpotLight}
     */
    function makeSpotLight(name, v) {
      var spotLight = new THREE.SpotLight(v.c);
      spotLight.position.set(v.x || -40, v.y || 60, v.z || -10);
      spotLight.castShadow = true;
      spotLight.name = name;
      return spotLight;
    }

    function createAxisLine(scale, vertices) {
      var axisGeometry = new THREE.Geometry();
      axisGeometry.vertices.push(new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z));
      axisGeometry.vertices.push(new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z));
      var lineMaterial = new THREE.LineBasicMaterial({
        color: style.aaxis__color.defaultValue,
        transparent: true,
        opacity: style.aaxis__opacity.defaultValue,
        linewidth: 2
      });
      var axisLine = new THREE.Line(axisGeometry, lineMaterial);
      axisLine.scale.set(scale, scale, scale);
      axisLine.name = 'aaxis';
      return axisLine;
    }

    function createGeometryWireframe(scale, geometry, offset) {
      var wireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: style.awireframe__color.defaultValue,
        transparent: true,
        opacity: style.awireframe__opacity.defaultValue,
        wireframe: true,
        wireframeLinewidth: 10
      }));
      wireframe.scale.set(scale, scale, scale);
      wireframe.init_scale = scale;
      wireframe.name = 'awireframe';
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
        case 'pentagonalBipyramid':
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
      var c = ['marker',
               'top',
               'bottom',
               'default',
               'default',
               'default',
               'default',
               'default',
               'default',
               'default',
               'default',
               'default'];

      var atom = new THREE.Group();
      atom.name = 'icoLet';
      var geometry = new THREE.IcosahedronGeometry(60);

      // Add Protons
      for (var key in geometry.vertices) {
        var vertice = geometry.vertices[key];
        var proton = makeObject('proton',
          {phong: {color: protonColors[c[key]], opacity: style.proton__opacity.defaultValue || 1, transparent: true}},
          {radius: conf.proton.radius},
          {
            x: vertice.x,
            y: vertice.y,
            z: vertice.z
          }
        );
        proton.name = 'proton-' + c[key];
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
      var c = [
        'top',
        'bottom',
        'marker',
        'default',
        'default',
        'default',
        'default'];

      var atom = new THREE.Group();
      atom.name = 'pentaLet';
      var geometry = createBiPyramid(5, conf.pentaLet.radius, conf.pentaLet.height);

      // Add the protons
      for (var key in geometry.vertices) {
        var vertice = geometry.vertices[key];
        var proton = makeObject('proton',
          {phong: {color: protonColors[c[key]], opacity: style.proton__opacity.defaultValue || 1, transparent: true}},
          {radius: conf.proton.radius},
          {
            x: vertice.x,
            y: vertice.y,
            z: vertice.z
          }
        );
        proton.name = 'proton-' + c[key];
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
      var c = [
        'top', 'marker', 'default', 'default'
      ];

      var atom = new THREE.Group();
      atom.name = 'tetraLet';
      var geometry = createPyramid(3, conf.tetraLet.length, conf.tetraLet.height);

      // Add the protons
      for (var key in geometry.vertices) {
        var vertice = geometry.vertices[key];
        var proton = makeObject('proton',
          {phong: {color: protonColors[c[key]], opacity: style.proton__opacity.defaultValue || 1, transparent: true}},
          {radius: conf.proton.radius},
          {
            x: vertice.x,
            y: vertice.y,
            z: vertice.z
          }
        );
        proton.name = 'proton-' + c[key];
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
        case 'camera':
          cameraTrackballControls.dispose();
          delete cameraTrackballControls;
          break;
        case 'atom':
          canvasContainer.removeEventListener('mousedown', onDocumentMouseDown);
          break;
        case 'attach':
          break;
        case 'none':
          break;
      }

      mouseMode = newMode;
      switch (mouseMode) {
        case 'camera':
          cameraTrackballControls = createCameraTrackballControls();
          break;
        case 'atom':
          canvasContainer.addEventListener('mousedown', onDocumentMouseDown, false);
          break;
        case 'attach':
          atomTrackballControls = createAtomTrackballControls(selectedObject);
          break;
        case 'none':
          break;
      }
      render();

      return;
    }

    /**
     * Apply controls effecting all atoms from the panel in the upper right corner.
     *
     * @param name
     * @param value
     * @param prop
     */
    function listenSliderChange(id, prop) {
      document.getElementById(id).onchange(function (event) {
        if (mouseMode == 'Rotate Selection') {
          var radians = value / 360 * 2 * Math.PI;
          selectedObject.rotation[prop] = radians + (selectedObject.rotation['init_' + prop] || 0);
        } else {
          scene.traverse(function (node) {
            switch (name) {
              case 'rotation':
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
      });
    };

    function controlChanged(event) {
      var args = this.id.split("--");
      var argNames = args[0].split("-");
      var value = event.target.value;
      switch (argNames[0]) {
        case "renderer":
          renderer.setClearColor(new THREE.Color(parseInt(value.replace(/^#/, ''), 16)), 1);
          break;
        case "camera":
          if (args[1] == 'perspective') {
            camera.fov = value;
            camera.updateProjectionMatrix();
          }
          break;
        default:
          scene.traverse(function (node) {
            var nodeNames = node.name.split("-");
            var ok = false;
            if (argNames.length == 2) {
              if (args[0] == node.name) {
                ok = true;
              }
            } else if (nodeNames[0] == argNames[0]) {
              ok = true;
            }
            if (ok) {
              switch (args[1]) {
                case 'rotation':
                  if (nucletNames.indexOf(node.name) > -1) {
                    var radians = value / 360 * 2 * Math.PI;
                    node.rotation[prop] = radians + (node.rotation['init_' + prop] || 0);
                  }
                  break;
                case 'scale':
                  var scale = (node.init_scale) ? value * node.init_scale : value;
                  node.scale.set(scale, scale, scale);
                  break;
                case 'opacity':
                  node.material.opacity = value;
                  node.material.visible = (value > .02);
                  break;
                case 'linewidth':
                  if (argNames[0] == 'awireframe') {
                    node.material.wireframeLinewidth = value;
                  } else {
                    node.material.linewidth = value;
                  }
                  break;
                case 'color':
                  if (argNames[0] == 'spotlight' || argNames[0] == 'ambient') {
                    node.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                  } else {
                    node.material.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                  }
                  break;
              }
            }
          });
          break;
      }
      render();
      return;
    }

    function showStylerBlock() {
      // Display the currently selected block - hide the rest
      for (var i=0; i < styler.length; i++) {
        document.getElementById('control-' + styler[i].value).style.display = (styler[i].selected) ? 'block' : 'none';
      }

    }
    /**
     * Create the controls in the upper right corner of screen.
     *
     * Uses the dat.gui.js library.
     *
     * @returns {controls|*}
     */
    function initControls() {

      var form = document.forms['atom-builder-controls-form'];

      // Add a change listener to each item in the styler select list
      showStylerBlock();
      styler.addEventListener("change", showStylerBlock);

      // Initialize the Mouse Mode radio buttons
      var radios = document.forms["atom-builder-controls-form"].elements["mouse--mode"];
      for(var i = 0, max = radios.length; i < max; i++) {
        radios[i].onclick = function (event) {
          changeMode(event.target.value);
        }
      }

      // Initialize all the sliders, buttons and color fields in the styler blocks
      for (var controlId in style) {
        var id = controlId.replace(/_/g, "-");
        switch (style[controlId].type) {
          case 'range':
            document.getElementById(id).addEventListener("input", controlChanged);
            break;
          case 'color':
            document.getElementById(id).addEventListener("input", controlChanged);
            break;
        }
      }

      return;
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
      /*  scene.add(makeObject('pentagonalBipyramid',
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
      canvasContainer = document.getElementById("atom-builder-wrapper");

      // Calculate dimensions of canvas - offsetWidth determines width
      // If offsetHeight is not 0, use it for the height, otherwise make the
      // canvas the same aspect ratio as the browser window.
      canvasWidth = window.innerWidth - 450;
//    canvasWidth = canvasContainer.offsetWidth || 800;
      canvasHeight = window.innerHeight / window.innerWidth * canvasWidth;

      // Create and position the scene
      scene = new THREE.Scene();
      scene.position.x = 0;
      scene.position.y = 0;
      scene.position.z = 0;

      // Create the renderer
//    renderer = new THREE.WebGLRenderer({alpha: true});
      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor(style.renderer__color.defaultValue, 1.0);
      renderer.setSize(canvasWidth, canvasHeight);
      renderer.shadowEnabled = true;

      // Create camera, and point it at the scene
      camera = new THREE.PerspectiveCamera(style.camera__perspective.defaultValue, canvasWidth / canvasHeight, .1, 10000);
      camera.position.x = style.camera__position.defaultValue[0];
      camera.position.y = style.camera__position.defaultValue[1];
      camera.position.z = style.camera__position.defaultValue[2];
      camera.lookAt(scene.position);

      // Create an ambient light and 2 spotlights
      var ambient = new THREE.AmbientLight(style.ambient__color.defaultValue);
      ambient.name = 'ambient';
      scene.add(ambient);

      if (style.spotlight_1__color.defaultValue != "#000000") {
        scene.add(makeSpotLight('spotlight-1', {
          c: style.spotlight_1__color.defaultValue,
          x: style.spotlight_1__position.defaultValue[0],
          y: style.spotlight_1__position.defaultValue[1],
          z: style.spotlight_1__position.defaultValue[2]
        }));
      }
      if (style.spotlight_2__color.defaultValue != "#000000") {
        scene.add(makeSpotLight('spotlight-2', {
          c: style.spotlight_2__color.defaultValue,
          x: style.spotlight_2__position.defaultValue[0],
          y: style.spotlight_2__position.defaultValue[1],
          z: style.spotlight_2__position.defaultValue[2]
        }));
      }
      if (style.spotlight_3__color.defaultValue != "#000000") {
        scene.add(makeSpotLight('spotlight-3', {
          c: style.spotlight_3__color.defaultValue,
          x: style.spotlight_3__position.defaultValue[0],
          y: style.spotlight_3__position.defaultValue[1],
          z: style.spotlight_3__position.defaultValue[2]
        }));
      }

      // Create a background plane
      scene.add(makeObject('plane',
        {lambert: {color: style.plane__color.defaultValue}},
        {
          width: style.plane__width.defaultValue,
          depth: style.plane__depth.defaultValue
        },
        {
          x: style.plane__position.defaultValue[0],
          y: style.plane__position.defaultValue[1],
          z: style.plane__position.defaultValue[2],
          rotation: {x: -0.5 * Math.PI}
        }
      ));

      // Add the Atoms to the screen
      addAtoms();

      // add the output of the renderer to the html element
      canvasContainer.appendChild(renderer.domElement);
      canvas = canvasContainer.querySelector('canvas');

      // Set mode so the mouse moves the camera
      changeMode('camera');

      // Create the controls in the upper right corner of screen
      controls = initControls();

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
      renderer.render(scene, camera);
    }

    init();
  }
};
