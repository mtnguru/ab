/**
 * @file - az_nuclet.js
 *
 * Functions to create a nuclet.
 */

/**
 * Class to build and maintain individual nuclets
 * d$does not really do anything except define function to call.
 *
 * @param _viewer
 * @returns {
 *   {makeObject: makeObject,
 *    makeProton: makeProton,
 *    getProtonName: getProtonName,
 *    showProtons: showProtons,
 *    createNuclet: createNuclet,
 *    deleteNuclet: deleteNuclet,
 *    createGeometry: createGeometry,
 *    createGeometryWireframe: createGeometryWireframe,
 *    createGeometryFaces: createGeometryFaces,
 *    protonRadius}
 * }
 */
(function ($) {
  Drupal.atomizer.nucletC = function (_viewer) {
    var viewer = _viewer;
    var constants = Drupal.atomizer.base.constants;
    var axes = ['x', 'y', 'z'];

    var protonRadius = viewer.theme.get('proton--radius');
    var electronRadius = viewer.theme.get('electron--radius');

    /*
     computeFaceNormals: function () {
     var cb = new THREE.Vector3(), ab = new THREE.Vector3();
     for ( var f = 0, fl = this.faces.length; f < fl; f ++ ) {
     var face = this.faces[ f ];

     var vA = this.vertices[ face.a ];
     var vB = this.vertices[ face.b ];
     var vC = this.vertices[ face.c ];

     cb.subVectors( vC, vB );
     ab.subVectors( vA, vB );
     cb.cross( ab );
     cb.normalize();
     face.normal.copy( cb );
     }
     } */

    /**
     * Create the axis lines for a nuclet.
     *
     * @param name
     * @param conf
     * @param geometry
     * @returns {THREE.LineSegments}
     */
    function createAxes(name, conf, geometry) {
      var axisGeometry = new THREE.Geometry();
      var opacity = viewer.theme.get(name + 'Axes--opacity');
      var lineMaterial = new THREE.LineBasicMaterial({
        color: viewer.theme.get(name + 'Axes--color'),
        opacity: opacity,
        transparent: (opacity < constants.transparentThresh),
        visible: (opacity > constants.visibleThresh),
        linewidth: 2
      });
      for (var i = 0; i < conf.vertices.length; i++) {
        var vertice;
        vertice = geometry.vertices[conf.vertices[i][0]];
        axisGeometry.vertices.push(new THREE.Vector3(vertice.x, vertice.y, vertice.z));
        vertice = geometry.vertices[conf.vertices[i][1]];
        axisGeometry.vertices.push(new THREE.Vector3(vertice.x, vertice.y, vertice.z));
      }
      var axes = new THREE.LineSegments(axisGeometry, lineMaterial);
      if (conf.scale) {
        axes.scale.set(conf.scale, conf.scale, conf.scale);
      }
      axes.name = name + 'Axes';
      return axes;
    }

    /**
     * Create a line anywhere in 3d space
     *
     * @param name
     * @param conf
     * @param geometry
     * @returns {THREE.LineSegments}
     */
    function createLine(name, vertices, opacity) {
      var lineGeometry = new THREE.Geometry();
      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff00ff,
        opacity: opacity,
        transparent: (opacity < constants.transparentThresh),
        visible: (opacity > constants.visibleThresh),
        linewidth: 2
      });
      for (var i = 0; i < vertices.length; i++) {
        var vertice = vertices[i];
        lineGeometry.vertices.push(new THREE.Vector3(vertice.x, vertice.y, vertice.z));
      }
      var lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      lines.name = name + 'Lines';
      return lines;
    }

    /**
     * Create a wireframe for a geometry using the standard three.js wireframes.
     *
     * This creates the three.js default wireframes.  These draw triangles.  To create
     * a wireframe for the cube (square) and pentagon (dodecahedron) use the createGeometryLines function.
     *
     * @param id
     * @param scale
     * @param geometry
     * @param rotation
     * @returns {THREE.Mesh}
     */
    function createGeometryWireframe(id, scale, geometry, rotation) {

      var opacity = viewer.theme.get(id + '--opacity');

      var wireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: viewer.theme.get(id + '--color'),
        opacity: opacity,
        transparent: (opacity < constants.transparentThresh),
        visible: (opacity > constants.visibleThresh),
        wireframe: true,
        wireframeLinewidth: viewer.theme.get(id + '--linewidth')
      }));

      wireframe.scale.set(scale, scale, scale);
      wireframe.name = id;
      if (rotation) {
        for (var i in axes) {
          var axis = axes[i];
          if (rotation[axis]) {
            var radians = rotation[axis] / 360 * 2 * Math.PI;
            wireframe.rotation['init_' + axis] = radians;
            wireframe.rotation[axis] = radians;
          }
        }
      }
//  if (offsetY) {
//    wireframe.position.y = offsetY * viewer.theme.get('proton--radius');
//    wireframe.init_offsetY = offsetY * viewer.theme.get('proton--radius');
//  }
      addObject(id, wireframe);
      return wireframe;
    }

    /**
     * Create a wireframe of lines.
     *
     * The three.js library creates wireframes that draw triangles.
     * This function draw individual lines and is useful for non-triangular faces like those found in the
     * cube and dodecahedron.
     *
     * @param id
     * @param scale
     * @param geometry
     * @param rotation
     * @returns {THREE.Group}
     */
    function createGeometryLines(id, scale, geometry, rotation) {

      if (!geometry.azfaces) return null;

      var opacity = viewer.theme.get(id + '--opacity');
      var material = new THREE.LineBasicMaterial({
        color: viewer.theme.get(id + '--color'),
        opacity: opacity,
        transparent: (opacity < constants.transparentThresh),
        visible: (opacity > constants.visibleThresh),
        linewidth: viewer.theme.get(id + '--linewidth')
      });

      var lines = new THREE.Group();
      lines.name = id;
      for (var f = 0; f < geometry.azfaces.length; f++) {
        var face = geometry.azfaces[f];
        var lineGeometry = new THREE.Geometry();
        var vertex;
        for (var v = 0; v < face.indices.length; v++) {
          vertex = geometry.vertices[face.indices[v]];
          lineGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
        }
        vertex = geometry.vertices[face.indices[0]];
        lineGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

        lines.add(new THREE.Line(lineGeometry, material));
      }
      lines.scale.set(scale, scale, scale);

      if (rotation) {
        for (var i in axes) {
          var axis = axes[i];
          if (rotation[axis]) {
            var radians = rotation[axis] / 360 * 2 * Math.PI;
            lines.rotation['init_' + axis] = radians;
            lines.rotation[axis] = radians;
          }
        }
      }
//  if (offsetY) {
//    lines.position.y = offsetY * viewer.theme.get('proton--radius');
//    lines.init_offsetY = offsetY * viewer.theme.get('proton--radius');
//  }
      addObject(id, lines);
      return lines;
    }

    /**
     * Create the faces for a geometry.
     *
     * @param id
     * @param scale
     * @param geometry
     * @param rotation
     * @returns {THREE.Mesh|*}
     */
    function createGeometryFaces(id, scale, geometry, rotation, reactiveState) {
      var faces;
      if (reactiveState) {
        geometry.dynamic = true;
        // add one random mesh to each scene
        var opaqueMaterial = new THREE.MeshLambertMaterial({
          color: viewer.theme.get(id + '--color'),
          opacity: viewer.theme.get(id + '--opacity'),
          transparent: true,
          vertexColors: THREE.FaceColors
        });
        var transparentMaterial = new THREE.MeshLambertMaterial({
          color: viewer.theme.get(id + '--color'),
          opacity: 0,
          transparent: true,
          vertexColors: THREE.FaceColors
        });

        faces = new THREE.Mesh(
          geometry,
          new THREE.MultiMaterial([transparentMaterial, opaqueMaterial])
        );
        for (var i = 0; i < reactiveState.length; i++) {
          geometry.faces[reactiveState[i]].materialIndex = 1;
        }
      } else {
        var opacity = viewer.theme.get(id + '--opacity');
        var material = new THREE.MeshStandardMaterial({
          color: viewer.theme.get(id + '--color'),
          opacity: opacity,
          transparent: (opacity < constants.transparentThresh),
          visible: (opacity > constants.visibleThresh),
          roughness: 0.5,
          metalness: 0,
          vertexColors: THREE.FaceColors
        });
        faces = new THREE.Mesh(geometry, material);
      }

      faces.scale.set(scale, scale, scale);
      faces.name = id;
      if (rotation) {
        for (var i in axes) {
          var axis = axes[i];
          if (rotation[axis]) {
            var radians = rotation[axis] / 360 * 2 * Math.PI;
            faces.rotation['init_' + axis] = radians;
            faces.rotation[axis] = radians;
          }
        }
      }
      /*
       if (offsetY) {
       if (offsetY.x) faces.position.x = offsetY.x;
       if (offsetY.y) faces.position.y = offsetY.y;
       if (offsetY.z) faces.position.z = offsetY.z;
       faces.init_offset = offsetY;
       } */
      addObject(id, faces);
      return faces;
    }

    function highlight(nuclet, doHighlight) {
      for (var p = 0; p < nuclet.az.protons.length; p++) {
        if (nuclet.az.protons[p]) {
          var proton = nuclet.az.protons[p];
          var name = getProtonName(proton.az) + '--color';
          proton.material.color = viewer.theme.getColor(name, doHighlight);
        }
      }
    }

    /**
     * Make an object - sphere, tetrahedron, line, etc.
     *
     * @param name
     * @param mat
     * @param geo
     * @param pos
     * @returns {*}
     */
    function makeObject(name, mat, compConf, pos) {
      // Set the geometry
      var geometry;
      var receiveShadow = false;
      switch (name) {
        case 'plane':
          receiveShadow = true;
          geometry = new THREE.PlaneGeometry(
            compConf.width || 1000,
            compConf.depth || 1000
          );
          break;
        case 'proton':
        case 'sphere':
          geometry = new THREE.SphereGeometry(
            compConf.radius || viewer.theme.get('proton--radius'),
            compConf.widthSegments || 20,
            compConf.heightSegments || 20
          );
          break;
        case 'electron':
          geometry = new THREE.SphereGeometry(
            compConf.radius || viewer.theme.get('electron--radius'),
            compConf.widthSegments || 10,
            compConf.heightSegments || 10
          );
          break;
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(compConf.length || 3);
          break;
        case 'tetrahedron':
          geometry = new THREE.TetrahedronGeometry(compConf.length || 3);
          break;
        case 'icosahedron':
          geometry = new THREE.IcosahedronGeometry(compConf.length || 3);
          break;
        case 'dodecahedron':
          geometry = new THREE.DodecahedronGeometry(compConf.length || 3);
          break;
        case 'cube':
          var l = compConf.length || 4;
          geometry = new THREE.BoxGeometry(l, l, l);
          break;
        case 'pentagonalBipyramid':
          geometry = createBiPyramid(5, compConf.length, compConf.height, 35);
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
        if (name == 'proton') {
//      object = new Physijs.SphereMesh(geometry, materials[0]);
          object = new THREE.Mesh(geometry, materials[0]);
        } else {
          object = new THREE.Mesh(geometry, materials[0]);
        }
      } else {
        object = new THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
      }

      // Set scale
      if (compConf.scale) {
        object.scale.set(compConf.scale, compConf.scale, compConf.scale);
      }

      // Set rotation
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

      object.name = name;

      return object;
    }

    /**
     * Create a geometry for the primary shapes - icosahedron, dodecahedron, tetrahedron, line, etc.
     *
     * @param shape
     * @param scale
     * @param height
     * @param detail
     * @returns {*}
     */
    function createGeometry(shape, state, scale, height, detail) {
      switch (shape) {
        case 'neutral':
        case 'boron':
        case 'beryllium':
        case 'icosahedron':
          return viewer.shapes.getGeometry('icosahedron', shape, scale, null, detail);
        case 'lithium':
        case 'decahedron':
          return viewer.shapes.getGeometry('decahedron', 'final', scale, height, detail);
        case 'line':
          var lineGeometry = new THREE.Geometry();
          var pos = protonRadius * 2;
          lineGeometry.vertices.push(new THREE.Vector3(pos, 0, 0));
          lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
          lineGeometry.vertices.push(new THREE.Vector3(-pos, 0, 0));
          return lineGeometry;
        case 'tetrahedron':
          return new THREE.TetrahedronGeometry(scale, detail);
        case 'dodecahedron':
        case 'hexahedron':
        case 'backbone':
          return viewer.shapes.getGeometry(shape, state, scale, null, detail);
        case 'octahedron':
          return new THREE.OctahedronGeometry(scale, detail);
      }
    }

    function getProtonName(conf) {
      var colorType = viewer.theme.get('proton--color-style');
      if (!colorType) { colorType = 'nuclet'; }

      name = 'proton-default';
      switch (conf.type) {
        case 'grey':
          name = 'proton-default';
          break;
        case 'ghost':
          name = 'proton-ghost';
          break;
        case 'neutron':
          name = 'neutron';
          break;
        case 'proton':
          switch (colorType) {
            case 'default':
              break;
            case 'pairs':
              name = 'proton-' + conf.pairs;
              break;
            case 'rings':
              name = 'proton-' + conf.rings;
              break;
            case 'alpha3':
              name = 'proton-' + conf.alpha3;
              break;
            case 'nuclet':
              if (conf.nuclet) {
                var state = conf.nuclet.state;
                // If hydrogen or helium return the default color.
                if (state === 'hydrogen' || state === 'helium') {
                  name = 'proton-default';
                } else if (conf.pairs === 'neutral') {
                  name = 'proton-neutral';
                } else if (conf.nuclet.state === 'initial') {
                  name = (conf.id < 12) ? 'proton-initial' : 'proton-neutral';
                } else {
                  name = 'proton-' + state;
                }
              } else {
                name = 'proton-default';
              }
              break;

            default:
              name = 'proton-default';
              break;
          }
          break;

      }
      return name;
    }

    function makeProtonName(conf) {
      name = 'proton';
      return;
      var colorType;
      colorType = viewer.theme.get('proton--color-style');
      if (!colorType) {
        colorType = 'nuclet';
      }

      if (colorType === 'nuclet' && conf.nuclet && conf.nuclet && conf.nuclet !== undefined) {
        // If hydrogen or helium return the default color.
        if (conf.nuclet.state === 'hydrogen' || conf.nuclet.state === 'helium') {
          return 'proton-default';
        }

        if (conf.pairs === 'neutral') {
          return 'proton-neutral';
        }
        if (conf.nuclet.state === 'initial') {
          var caps = [12, 13, 14, 15, 16, 17, 18, 19];
          for (var c = 0; c < caps.length; c++) {
            if (conf.nuclet.conf.protons.indexOf(caps[c]) === -1) {
              return 'proton-initial';
            }
          }
          return 'proton-capped';
        }
        return 'proton-' + conf.nuclet.state;
      }
      else if (colorType === 'pairs' && conf.pairs && conf.pairs !== undefined) {
        return 'proton-' + conf.pairs;
      }
      else if (colorType === 'rings' && conf.pairs && conf.rings !== undefined) {
        return 'proton-' + conf.rings;
      }
      else if (colorType === 'alpha3' && conf.alpha3 && conf.alpha3 !== undefined) {
        return 'proton-' + conf.alpha3;
      }
      else {
        return 'proton-default';
      }
    }

    /**
     * Make one proton.
     *
     * @param protonConf
     * @param opacity
     * @param pos
     *
     * @returns {*}
     */
    function makeProton(id, conf, opacity, pos, azNuclet) {

      var az = {
        id: id,
        type: conf.type || 'proton',
        pairs: conf.pairs || 'default',
        alpha3: conf.alpha3 || 'default',
        rings: conf.rings || 'default',
        visible: ('visible' in conf) ? conf.visible : true,
        optional: conf.optional || false,
        active: conf.active || true,
        nuclet: azNuclet
      };

      var opacity = viewer.theme.get('proton--opacity');

      var visible;
      if (az.active === false) {
        visible = false;
      } else {
        visible = (az.visible === false) ? false : (opacity > constants.visibleThresh);
      }

      var name = getProtonName(az);
      var proton = makeObject('proton',
        {
          phong: {
            color: viewer.theme.getColor(name + '--color'),
            opacity: opacity,
            transparent: (opacity < constants.transparentThresh),
            visible: visible
          }
        },
        {
          scale: viewer.theme.get('proton--scale'),
          radius: protonRadius
        },
        {
          x: pos.x,
          y: pos.y,
          z: pos.z
        }
      );
      proton.name = name;
      proton.material.visible = visible;
      proton.az = az;
      return proton;
    }

    /**
     * Delete a proton
     *
     * @param proton
     */
    function deleteProtons(protons) {
      /*
       // Remove the proton from the viewer.objects.protons array
       for (var p = 0; p < protons.length; p++) {
       var proton = protons[p];
       // Remove protons from the objects.protons array
       viewer.objects.protons = viewer.objects.protons.filter(function (e) {return e !== proton;})
       }
       */
    }

    /**
     * Show or hide a list of protons
     *
     * @param proton
     */
    function showProtons(nuclet, show, protons) {
      // Remove the proton from the viewer.objects.protons array
      for (var p = 0; p < protons.length; p++) {
        var proton = nuclet.az.protons[protons[p]];
        if (show) {
//      if (viewer.objects.protons.indexOf(proton) === -1) viewer.objects.protons.push(proton);
          proton.material.visible = true;
          proton.material.opacity = 1;
          proton.material.transparent = false;
        } else {
//      viewer.objects.protons = viewer.objects.protons.filter(function (e) { return e !== proton; });
          proton.material.visible = false;
          proton.material.opacity = 0;
          proton.material.transparent = true;
        }
      }
    }

    /**
     * Create the helper XYZ axes.
     *
     * @param name
     * @param length
     * @param linewidth
     *
     * @returns {THREE.AxisHelper}
     */
    function createHelperAxes(name, length, linewidth) {
      var opacity = viewer.theme.get(name + '--opacity');
      var axis = new THREE.AxisHelper(length);
      axis.name = name;
      axis.material.linewidth = linewidth;
      axis.material.opacity = opacity;
      axis.material.visible = (opacity > .02);
      axis.material.transparent = (opacity < .97);
      return axis;
    }

    function createProtons(geometry, compConf, azNuclet) {
      var p;
      switch (azNuclet.state) {

        case 'neutral':
          geometry.vertices[9].set(
            0,
            protonRadius * 0.1616236535868876,
            protonRadius * .0998889113026354
          );
          break;

        case 'beryllium':
          vids = [0, 2];
          for (p = 0; p < vids.length; p++) {
            geometry.vertices[vids[p]].x = geometry.vertices[vids[p]].x * 1.2;
          }
          geometry.vertices[9].set(0, protonRadius * 0.2, 0);
          break;

        case 'boron':
          vids = [0, 2];
          for (p = 0; p < vids.length; p++) {
            geometry.vertices[vids[p]].x = geometry.vertices[vids[p]].x * 1.23;
            geometry.vertices[vids[p]].y = geometry.vertices[vids[p]].y * 0.95;
          }
          vids = [4, 5, 6, 7];
          for (p = 0; p < vids.length; p++) {
            geometry.vertices[vids[p]].z = geometry.vertices[vids[p]].z * 0.85;
          }
          geometry.vertices[9].set(0, protonRadius * 0.95, 0);
          break;

        case 'lithium':
          // Move the top center proton to the correct position.
          geometry.vertices[9].set(
            0,
            protonRadius * 0.1616236535868876,
            protonRadius * .0998889113026354
          );
          break;

        case 'initial':
        case 'final':
          break;

        case 'carbon':
          break;
      }

      // Create protons
      azNuclet.protons = [];
      azNuclet.protonGeometry = geometry;
      if (azNuclet.conf.protons) {
        var opacity = viewer.theme.get('proton--opacity');
        for (p in compConf.protons) {
          if (!compConf.protons.hasOwnProperty(p)) continue;
          compConf.protons[p].visible = (azNuclet.conf.protons.indexOf(parseInt(p)) > -1);
          var proton = makeProton(p, compConf.protons[p], opacity, geometry.vertices[p], azNuclet);
          azNuclet.protons[p] = proton;
        }
      }
      return azNuclet.protons;
    }

    function createNeutrons(geometry, compConf, azNuclet) {
      azNuclet.neutrons = [];
      if (compConf.neutrons) {
        var opacity = viewer.theme.get('proton--opacity');
        for (var n in compConf.neutrons) {
          if (!compConf.neutrons.hasOwnProperty(n)) continue;
          compConf.neutrons[n].visible = true;
          compConf.neutrons[n].type = 'neutron';

          // Get the 3 vertices
          var vA = geometry.vertices[compConf.neutrons[n][0]];
          var vB = geometry.vertices[compConf.neutrons[n][1]];
          var vC = geometry.vertices[compConf.neutrons[n][2]];

          // Calculate face normal
          var cb = new THREE.Vector3();
          var ab = new THREE.Vector3();
          cb.subVectors( vC, vA );
          ab.subVectors( vB, vA );
          cb.cross( ab );
          cb.normalize();
          cb.multiplyScalar(Math.sqrt(2/3) * 100);

          // Calculate centroid
          var pos = new THREE.Vector3();
          pos = pos.add(vA).add(vB).add(vC).divideScalar(3);
          pos.add(cb);

          var neutron = makeProton(n, compConf.neutrons[n], opacity, pos, azNuclet);
          azNuclet.neutrons[n] = neutron;
        }
      }
      return azNuclet.neutrons;
    }

    function createValenceRings(compConf, azNuclet) {
      var color = viewer.theme.get('valence-active--color');
      var opacity = viewer.theme.get('valence--opacity');
      var radius = viewer.theme.get('valence--scale') * protonRadius;
      var diameter = viewer.theme.get('valence--diameter') * protonRadius;

      azNuclet.rings = [];
      for (var v in compConf.valence) {
        var ringConf = compConf.valence[v];

        var torusGeometry = new THREE.TorusGeometry(radius, diameter, 10, 40);
        var material = new THREE.MeshPhongMaterial({
          color: color,
          opacity: opacity,
          transparent: (opacity < constants.transparentThresh),
          visible: (opacity > constants.visibleThresh)
        });
        var ring = new THREE.Mesh(torusGeometry, material);
        ring.name = 'valence-active';
        ring.az = ringConf;
        azNuclet.rings[v] = ring;
        if (ringConf.rotation) {
          if (ringConf.rotation.x) {
            ring.rotation.x = ringConf.rotation.x / 360 * 2 * Math.PI;
          }
          if (ringConf.rotation.y) {
            ring.rotation.y = ringConf.rotation.y / 360 * 2 * Math.PI;
          }
          if (ringConf.rotation.z) {
            ring.rotation.z = ringConf.rotation.z / 360 * 2 * Math.PI;
          }
        }
        azNuclet.protons[parseInt(v)].add(ring);
      }
    }

    function createTetrahedrons(compConf, geometry, azNuclet) {
      azNuclet.tetrahedrons = [];
      for (var i = 0; i < compConf.tetrahedrons.length; i++) {
        var tetrahedron = createTetrahedron('tetra');
        tetrahedron.azid = 't' + i;
//    intersectList.push(tetrahedron.children[1]); // Attach the faces Mesh
        azNuclet.tetrahedrons[i] = tetrahedron;

        // Set 4 vertices of tetrahedron
        tetrahedron.children[1].geometry.protons = [];
        for (var v = 0; v < 4; v++) {

          var p = compConf.tetrahedrons[i].vertices[v];
          tetrahedron.children[0].geometry.vertices[v].x = geometry.vertices[p].x;
          tetrahedron.children[0].geometry.vertices[v].y = geometry.vertices[p].y;
          tetrahedron.children[0].geometry.vertices[v].z = geometry.vertices[p].z;

          tetrahedron.children[1].geometry.vertices[v].x = geometry.vertices[p].x;
          tetrahedron.children[1].geometry.vertices[v].y = geometry.vertices[p].y;
          tetrahedron.children[1].geometry.vertices[v].z = geometry.vertices[p].z;

          // Save the proton list in tetrafaces mesh
          tetrahedron.protons[v] = azNuclet.protons[p];
        }
      }
      return azNuclet.tetrahedrons;
    }

    function createElectrons(groupName, geometry, compConf, nucletConf) {
      var opacity = viewer.theme.get('electron--opacity') || 1;
//    var scale = viewer.theme.get(groupName + '--scale');
      var scale = compConf.scale;
      var electrons = [];
      for (var e in compConf.electrons) {
        if (!compConf.electrons.hasOwnProperty(e)) continue;
        if (nucletConf.electrons && !nucletConf.electrons.contains(e)) continue;
        var vertice = geometry.vertices[e];
        var electron = makeObject('electron',
          {
            phong: {
              color: viewer.theme.get('electron--color'),
              opacity: opacity,
              transparent: (opacity < constants.transparentThresh),
              visible: (opacity > constants.visibleThresh)
            }
          },
          {
            scale: viewer.theme.get('proton--scale'),
            radius: electronRadius
          },
          {
            x: vertice.x * scale,
            y: vertice.y * scale,
            z: vertice.z * scale
          }
        );
        electron.name = 'electron';
        addObject('electrons', electron);
        electrons[e] = electron;
      }
      return electrons;
    }

    function createWireframe(name, geometry, compConf) {
      var wireframe;
      if (compConf.shape == 'dodecahedron' ||
          compConf.shape == 'hexahedron' ||
          compConf.shape == 'beryllium' ||
          compConf.shape == 'boron') {
        wireframe = createGeometryLines(
          name,
          compConf.scale + .02,
          geometry,
          compConf.rotation || null
        );
      } else {
        wireframe = createGeometryWireframe(
          name,
          compConf.scale + .02,
          geometry,
          compConf.rotation || null
        );
      }
      return wireframe;
    }

    function createNucletGroupGeometry(groupName, geoGroup, compConf, nucletGroup, azNuclet) {
      var geometry = createGeometry(
        compConf.shape,
        azNuclet.state || '',
        compConf.scale * protonRadius,
        (compConf.scaleHeight || 1) * protonRadius
      );
      geometry.compConf = compConf;
      geometry.scaleInit = compConf.scale;

      var radians;
      if (geoGroup.rotation) {
        if (geoGroup.rotation.x) {
          radians = geoGroup.rotation['x'] / 360 * 2 * Math.PI;
          geometry.applyMatrix(new THREE.Matrix4().makeRotationX(radians));
        }
        if (geoGroup.rotation.y) {
          radians = geoGroup.rotation['y'] / 360 * 2 * Math.PI;
          geometry.applyMatrix(new THREE.Matrix4().makeRotationY(radians));
        }
        if (geoGroup.rotation.z) {
          radians = geoGroup.rotation['z'] / 360 * 2 * Math.PI;
          geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(radians));
        }
      }

      if (compConf.protons) {
        var protons = createProtons(geometry, compConf, azNuclet);
        for (var p = 0; p < protons.length; p++) {
          if (protons[p]) {
            nucletGroup.add(protons[p]);
          }
        }
      }

/*    if (compConf.neutrinos) {
        var neutrons = createNeutrons(geometry, compConf, azNuclet);
        for (var p = 0; p < neutrons.length; p++) {
          if (neutrons[p]) {
            nucletGroup.add(neutrons[p]);
          }
        }
      } */

      if (compConf.valence) {
        createValenceRings(compConf, azNuclet);
      }

      if (compConf.tetrahedrons) {
        var tetrahedrons = createTetrahedrons(compConf, geometry, azNuclet);
        for (var t = 0; t < tetrahedrons.length; t++) {
          nucletGroup.add(tetrahedrons[t]);
        }
      }

      if (compConf.electrons) {
        var electrons = createElectrons(groupName, geometry, compConf, azNuclet.conf);
        for (var e = 0; e < electrons.length; e++) {
          nucletGroup.add(electrons[e]);
        }
      }

      if (compConf.axes) {
//      nucletGroup.add(createAxes(groupName, compConf.axes, geometry));
      }

      if (compConf.wireframe) {
        var wireframe = createWireframe(groupName + 'Wireframe', geometry, compConf);
        if (wireframe) {
          nucletGroup.add(wireframe);
        }
      }

      if (compConf.faces) {
        var reactiveState;
        if (compConf.assignFaceOpacity && azNuclet.conf.reactiveState) {
          var reactiveState = (azNuclet.conf.reactiveState[groupName]) ? azNuclet.conf.reactiveState[groupName].slice() : [];
          geometry.reactiveState = azNuclet.reactiveState = reactiveState;
          geometry.compConf = compConf;
        }

        var faces = createGeometryFaces(
          groupName + 'Faces',
          compConf.scale,
          geometry,
          compConf.rotation || null,
          azNuclet.reactiveState
        );
        nucletGroup.add(faces);
//    viewer.objects['selectFace'] = [faces];
      }

      if (compConf.vertexids) {
        nucletGroup.add(viewer.sprites.createVerticeIds(groupName, geometry));
      }

      if (compConf.faceids) {
//      nucletGroup.add(viewer.sprites.createFaceIds(groupName, geometry));
      }

      if (compConf.particleids) {
        nucletGroup.add(viewer.sprites.createVerticeIds(compConf.particleids, geometry));
      }
      return geometry;
    }

    function createNucletGroup(groupName, geoGroup, azNuclet) {
      var nucletGroup = new THREE.Group();
      nucletGroup.name = groupName;
      var tscale = parseFloat(viewer.theme.get(groupName + '--scale'));
      nucletGroup.scale.set(tscale, tscale, tscale);

      if (geoGroup.alignyaxis) {
        var vertice1 = azNuclet.protonGeometry.vertices[geoGroup.alignyaxis.vertices[0]];
        var vertice2 = azNuclet.protonGeometry.vertices[geoGroup.alignyaxis.vertices[1]];
        var newAxis = vertice1.clone().sub(vertice2);
        Drupal.atomizer.base.alignObjectToAxis(
          nucletGroup,
          new THREE.Vector3(0, 1, 0),
          newAxis.clone().normalize(),
          false
        );
        var origin = new THREE.Vector3(0, 0, 0);
        var attachPt = origin.add(newAxis).multiplyScalar(geoGroup.alignyaxis.attachPt);
        nucletGroup.position.set(attachPt.x, attachPt.y, attachPt.z);

        var radians = geoGroup.alignyaxis.rotatey / 360 * 2 * Math.PI;
        nucletGroup.rotation['y'] = radians;
      }

      // Create each of the components for this group
      for (var compName in geoGroup.components) {
        if (!geoGroup.components.hasOwnProperty(compName)) continue;
        var compConf = geoGroup.components[compName];
        createNucletGroupGeometry(groupName, geoGroup, compConf, nucletGroup, azNuclet);
      }
      return nucletGroup;
    }

    /**
     * Create a nuclet as defined in the nucletConf array.
     *
     * @param nucletConf
     *
     * @returns {THREE.Group}
     */
    function createNuclet(id, nucletConf) {
      var nuclet = new THREE.Group();
      nuclet.name = 'nuclet-' + id;
      nucletConf.state = nucletConf.state.replace('backbone-', '');

      // Determine of it's capped here'
      nuclet.az = {
        protonRadius: protonRadius,
        conf: nucletConf,
        id: id,
        state: nucletConf.state
      };

      nuclet.geo = drupalSettings.atomizer_config.objects[nucletConf.state];

      var protons;
      var electrons;
      switch (nuclet.az.state) {
        case 'dodecahedron':
//        protons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
          break;
        case 'neutral':
          protons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
          electrons = [0, 1, 2, 3, 4, 5];
          break;
        case 'lithium':
          protons = [0, 1, 3, 4, 5, 9, 11];
          electrons = [0, 1, 2];
          break;
        case 'beryllium':
          protons = [1, 3, 4, 5, 6, 7, 9, 10, 11];
          electrons = [0, 1, 2];
          break;
        case 'boron':
          protons = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11];
          electrons = [0, 1, 2];
          break;
        case 'initial':
        case 'final':
          protons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
          electrons = [0, 1, 2, 3, 4, 5];
          break;
        case 'carbon':
//      case 'icosahedron':
          protons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
          electrons = [0, 1, 2, 3, 4, 5];
      }

      // If the configuration for protons and electrons is not set then use the default values set above.
      // @TODO This needs to be pulled from configuration, get rid of the above switch statement.
      if (!nuclet.az.conf.electrons) nuclet.az.conf.electrons = electrons;
      if (!nuclet.az.conf.protons) nuclet.az.conf.protons = protons;

      // Remove the attach proton if this isn't 'N0'
      if (id != 'N0') {
        var i = nuclet.az.conf.protons.indexOf(10);
        if (i > -1) nuclet.az.conf.protons[i] = undefined;
        // If this is a child nuclet and it's boron then remove one proton from the base boron.
        if (nuclet.az.conf.state === 'boron') {
          var i = nuclet.az.conf.protons.indexOf(0);
          if (i > -1) {
            nuclet.az.conf.protons[i] = undefined;
          }
        }
      }

      // Loop through each of the Geometry Groups - Ex: Proton framework, icosahedron, dodecahedron, etc.
      for (var groupName in nuclet.geo.geoGroups) {
        if (!nuclet.geo.geoGroups.hasOwnProperty(groupName)) continue;
        var geoGroup = nuclet.geo.geoGroups[groupName];

        var nucletGroup = createNucletGroup(groupName, geoGroup, nuclet.az);
        nuclet.add(nucletGroup);
      }

      // Create nuclet helper axes.
      nuclet.add(createHelperAxes('nucletAxes', protonRadius * 6, 1));

      //// Set the nuclet rotation
      if (nuclet.az.conf.rotation) {
        for (var i in axes) {
          var axis = axes[i];
          if (nuclet.az.conf.rotation[axis]) {
            var radians = nuclet.az.conf.rotation[axis] / 360 * 2 * Math.PI;
            nuclet.rotation['init_' + axis] = radians;
            nuclet.rotation[axis] = radians;
          }
        }
      }

      //// Add attachAxis line
      var geometry = createGeometry('icosahedron', '', protonRadius, 1);
      geometry.applyMatrix(new THREE.Matrix4().makeRotationY(90 / 360 * 2 * Math.PI));
      var line = createLine('attach', [geometry.vertices[9], geometry.vertices[10]], viewer.theme.get('attachLines--opacity'));
      line.scale.set(5, 5, 5);
      nuclet.add(line);

      //// Create inner shell
      var innerShell = new THREE.Object3D();
      innerShell.name = 'nucletInner-' + id;
      innerShell.add(nuclet);

      // Create inner shell helper axis
      innerShell.add(createHelperAxes('nucletInnerAxes', protonRadius * 5, 3));

      //// Create outer shell
      var outerShell = new THREE.Object3D();
      outerShell.name = 'nucletOuter-' + id;
      outerShell.add(innerShell);

      // Create outer shell helper axis
      outerShell.add(createHelperAxes('nucletOuterAxes', protonRadius * 4, 5));

      //// Set the nucletShell position
      if (nuclet.az.conf.position) {
        outerShell.position.x = nuclet.az.conf.position.x || 0;
        outerShell.position.y = nuclet.az.conf.position.y || 0;
        outerShell.position.z = nuclet.az.conf.position.z || 0;
      }
      return outerShell;
    }

    /**
     * Delete a nuclet from the scene.
     *
     * @param nuclet
     */
    function deleteNuclet(nuclet) {

      // If there is a '0' nuclet, delete it recursively
      if (viewer.atom.az().nuclets[nuclet.az.id + '0']) {
        deleteNuclet(viewer.atom.az().nuclets[nuclet.az.id + '0'])
      }

      // If there is a '1' nuclet, delete it recursively
      if (viewer.atom.az().nuclets[nuclet.az.id + '1']) {
        deleteNuclet(viewer.atom.az().nuclets[nuclet.az.id + '1'])
      }

      // Delete protons
      for (var i = 0; i < nuclet.az.protons.length; i++) {
        if (nuclet.az.protons[i]) {
          deleteProtons([nuclet.az.protons[i]]);
        }
      }

      // Remove nuclet from the atom
      delete viewer.atom.az().nuclets[nuclet.az.id];
      nuclet.parent.parent.parent.remove(nuclet.parent.parent);
    }

    /**
     * Create an n-sided pyramid.
     *
     * @param n
     * @param rad
     * @param len
     * @returns {THREE.Geometry}
     */
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

    /**
     * Create an n-sided bi pyramid.
     *
     * @param n
     * @param rad
     * @param len
     * @returns {THREE.Geometry}
     */
    function createBiPyramid(n, rad, len) {
      var geom = new THREE.Geometry();
      mesth

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
     * Add an object to the objects array.
     *
     * @param name
     * @param object
     */
    function addObject(name, object) {
      if (!viewer.objects) viewer.objects = {};
      if (viewer.objects[name]) {
        viewer.objects[name].push(object);
      } else {
        viewer.objects[name] = [object];
      }
    }

    // Return references to class functions - makes this into a pseudo-class.
    return {
      makeObject: makeObject,
      makeProton: makeProton,
      getProtonName: getProtonName,
      showProtons: showProtons,
      createNuclet: createNuclet,
      deleteNuclet: deleteNuclet,
      createGeometry: createGeometry,
      createGeometryWireframe: createGeometryWireframe,
      createGeometryFaces: createGeometryFaces,
      highlight: highlight,
      protonRadius: protonRadius
    };
  };

})(jQuery);
