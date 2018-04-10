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

    var protonGeometry;
    var electronGeometry;

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
    function createAxis(name, conf, geometry) {
      var axisGeometry = new THREE.Geometry();
      var opacity = viewer.theme.get(name + 'Axis--opacity');
      var lineMaterial = new THREE.LineBasicMaterial({
        color: viewer.theme.get(name + 'Axis--color'),
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
      axes.name = name + 'Axis';
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

      if (!geometry.indices && !geometry.azfaces) return null;

      var opacity = viewer.theme.get(id + '--opacity');
      var material = new THREE.LineBasicMaterial({
        color: viewer.theme.get(id + '--color'),
        opacity: opacity,
        transparent: (opacity < constants.transparentThresh),
        visible: (opacity > constants.visibleThresh),
        linewidth: viewer.theme.get(id + '--linewidth')
      });

      var vertex;
      var lines = new THREE.Group();
      lines.name = id;

      if (geometry.azfaces) { // dodecahedron - maybe more
        for (var f = 0; f < geometry.azfaces.length; f++) {
          var face = geometry.azfaces[f];
          var lineGeometry = new THREE.Geometry();
          for (var v = 0; v < face.indices.length; v++) {
            vertex = geometry.vertices[face.indices[v]];
            lineGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
          }
          vertex = geometry.vertices[face.indices[0]];
          lineGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

          lines.add(new THREE.Line(lineGeometry, material));
        }
      } else {
        var vids = ['a', 'b', 'c', 'd', 'e'];
        for (var f = 0; f < geometry.faces.length; f++) {
          var lineGeometry = new THREE.Geometry();
          var face = geometry.faces[f];
          for (var v = 0; v < vids.length; v++) {
            if (vids[v] in face) {
              vertex = geometry.vertices[face[vids[v]]];
              lineGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
            }
          }
          vertex = geometry.vertices[face['a']];
          lineGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

          lines.add(new THREE.Line(lineGeometry, material));
        }

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

    function highlight(nuclet, highlight) {
      highlight = highlight || false;
      for (var id in nuclet.az.protons) {
        if (nuclet.az.protons.hasOwnProperty(id)) {
          setProtonColor(nuclet.az.protons[id], null, highlight);
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
          if (protonGeometry) {
            geometry = protonGeometry;
          } else {
            geometry = new THREE.SphereGeometry(
              compConf.radius || viewer.theme.get('proton--radius'),
              compConf.widthSegments || 36,
              compConf.heightSegments || 36
            );
            protonGeometry = geometry;
          }
          break;
        case 'electron':
          if (electronGeometry) {
            geometry = electronGeometry;
          } else {
            geometry = new THREE.SphereGeometry(
              compConf.radius || viewer.theme.get('electron--radius'),
              compConf.widthSegments || 20,
              compConf.heightSegments || 20
            );
            electronGeometry = geometry;
          }
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
      if (pos) {
        if (pos.rotation) {
          if (pos.rotation.x) { object.rotation.x = pos.rotation.x; }
          if (pos.rotation.y) { object.rotation.y = pos.rotation.y; }
          if (pos.rotation.z) { object.rotation.z = pos.rotation.z; }
        }

        // Position the object
        object.position.x = pos.x || 0;
        object.position.y = pos.y || 0;
        object.position.z = pos.z || 0;
      }

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
        case 'beryllium':
        case 'boron':
        case 'boron10':
        case 'boron11':
        case 'carbon':
        case 'lithium':
          return viewer.shapes.getGeometry('nuclet', shape, scale, null, detail);
        case 'initial':
        case 'final':
          return viewer.shapes.getGeometry('backbone', shape, scale, null, detail);
        case 'neutral':
        case 'icosahedron':
          return viewer.shapes.getGeometry('icosahedron', shape, scale, null, detail);
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
        case 'neutral':
          name = 'neutral';
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
                } else if (conf.pairs === 'neutron') {
                  name = 'proton-neutron';
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
      // Remove the proton from the viewer.objects.protons array
//    for (var p = 0; p < protons.length; p++) {
//      var proton = protons[p];
//      // Remove protons from the objects.protons array
//      viewer.objects.protons = viewer.objects.protons.filter(function (e) {return e !== proton;})
//    }
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
    function createHelperAxis(name, length, linewidth) {
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
      }

      // Create protons
      azNuclet.protons = [];
      azNuclet.protonGeometry = geometry;
      if (azNuclet.conf.protons) {
        var opacity = viewer.theme.get('proton--opacity');
        for (p in compConf.protons) {
          if (!compConf.protons.hasOwnProperty(p)) continue;
          compConf.protons[p].visible = (azNuclet.conf.protons.indexOf(parseInt(p)) > -1);
          if (geometry.vertices[p]) {
            var proton = makeProton(p, compConf.protons[p], opacity, geometry.vertices[p], azNuclet);
            azNuclet.protons[p] = proton;
          }
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
          if (compConf.neutrons[n][3]) {
            pos.sub(cb);
          } else {
            pos.add(cb);
          }

          console.log(pos.x/50 + ', ' + pos.y/50 + ', ' + pos.z/50 + ',     ');

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

    /**
     * Use the object/nuclet config to create electrons - this may go away.
     *
     * @param groupName
     * @param geometry
     * @param compConf
     * @param nucletConf
     * @returns {Array}
     */
    function createElectrons(geometry, compConf, nucletConf) {
      var opacity = viewer.theme.get('electron--opacity') || 1;
      var scale = compConf.scale;
      var electrons = [];
      var pos = new THREE.Vector3(0,0,0);
      for (var e in compConf.electrons) {
        if (!compConf.electrons.hasOwnProperty(e)) continue;
//      if (nucletConf.electrons && !nucletConf.electrons.contains(e)) continue;
        var vertice = geometry.vertices[e];
//      pos.setScalar(0);
        pos.copy(vertice).multiplyScalar(scale);
        var electron = createNElectron('electron2', pos);
        electrons.push(electron);
      }
      return electrons;
    }

    function createNElectron (name, pos) {
      var electronGroup = new THREE.Group();
      electronGroup.name = name;
      electronGroup.az = {
        type: name
      };
      // Make the electron core
      var coreOpacity = viewer.theme.get(name + '-core--opacity') || 1;
      var core = makeObject('electron',
        {
          phong: {
            color: viewer.theme.get(name + '-core--color'),
            opacity: coreOpacity,
            transparent: (coreOpacity < constants.transparentThresh),
            visible: (coreOpacity > constants.visibleThresh)
          }
        },
        {
          scale: viewer.theme.get(name + '-core--scale'),
          radius: electronRadius
        },
        pos
      );
      core.name = name + '-core';
      electronGroup.add(core);

      // Make the electron pair
      var fieldOpacity = viewer.theme.get(name + '-field--opacity') || 1;
      var field = makeObject('proton',
        {
          phong: {
            color: viewer.theme.get(name + '-field--color'),
            opacity: fieldOpacity,
            transparent: (fieldOpacity < constants.transparentThresh),
            visible: (fieldOpacity > constants.visibleThresh)
          }
        },
        {
          scale: viewer.theme.get(name + '-field--scale'),
          radius: protonRadius
        },
        pos
      );
      field.name = name + '-field';

      electronGroup.add(field);
      return electronGroup;
    }

    /**
     * Given a list of sets of vertices, make an electron for each set.
     * If 3 vertices in set, put it in the center of the triangle.
     * If 2 vertices in set, put it between the two protons.
     *
     * @param groupName
     * @param geometry
     * @param compConf
     * @param nucletConf
     * @returns {Array}
     */
    function createNElectrons(geometry, nucletConf) {
      var nelectrons = [];
      for (var e in nucletConf.electrons) {
        if (!nucletConf.electrons.hasOwnProperty(e)) continue;
        var pos = new THREE.Vector3();
        var vertices = nucletConf.electrons[e];
        for (var v = 0; v < vertices.length; v++) {
          pos.add(geometry.vertices[vertices[v]]);
        }
        pos.divideScalar(vertices.length);
        var nelectron = createNElectron('electron1', pos);
        nelectron.az.vertices = vertices;
        nelectron.az.id = 'E' + nelectrons.length;
        nelectrons.push(nelectron);
      }
      return nelectrons;
    }

    function createWireframe(name, geometry, compConf) {
      var wireframe;
      if (compConf.shape == 'dodecahedron' ||
          compConf.shape == 'carbon' ||
          compConf.shape == 'lithium' ||
          compConf.shape == 'hexahedron' ||
          compConf.shape == 'beryllium' ||
          compConf.shape == 'initial' ||
          compConf.shape == 'final' ||
          compConf.shape == 'boron' ||
          compConf.shape == 'boron10' ||
          compConf.shape == 'boron11') {
        wireframe = createGeometryLines(
          name,
          compConf.scale,
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
      if (geoGroup.rotate) {
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

      if (compConf.nelectrons && azNuclet.conf.electrons) {
        var nelectrons = createNElectrons(geometry, azNuclet.conf);
        for (var e = 0; e < nelectrons.length; e++) {
          nucletGroup.add(nelectrons[e]);
          nelectrons[e].az.nuclet = azNuclet;
          azNuclet.nelectrons[nelectrons[e].az.id] = nelectrons[e];
        }
      }

      if (compConf.protons) {
        var protons = createProtons(geometry, compConf, azNuclet);
        for (var p = 0; p < protons.length; p++) {
          if (protons[p]) {
            protons[p].az.nucletGroup = nucletGroup;
            nucletGroup.add(protons[p]);
          }
        }
      }

      if (compConf.neutrons) {
        var neutrons = createNeutrons(geometry, compConf, azNuclet);
        for (var p = 0; p < neutrons.length; p++) {
          if (neutrons[p]) {
            neutrons[p].az.nucletGroup = nucletGroup;
            nucletGroup.add(neutrons[p]);
          }
        }
      }

      if (compConf.valence) {
        createValenceRings(compConf, azNuclet);
      }

      if (compConf.electrons) {
        var electrons = createElectrons(geometry, compConf, azNuclet.conf);
        for (var e = 0; e < electrons.length; e++) {
          nucletGroup.add(electrons[e]);
          electrons[e].az.nuclet = azNuclet;
          azNuclet.electrons[electrons[e].az.id] = electrons[e];
        }
      }

      if (compConf.axes) {
        nucletGroup.add(createAxis(groupName, compConf.axes, geometry));
      }

      if (compConf.tetrahedrons) {
        var tetrahedrons = createTetrahedrons(compConf, geometry, azNuclet);
        for (var t = 0; t < tetrahedrons.length; t++) {
          nucletGroup.add(tetrahedrons[t]);
        }
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

//    if (compConf.vertexids) {
//      nucletGroup.add(viewer.sprites.createVerticeIds(groupName, geometry));
//    }

//    if (compConf.faceids) {
//      nucletGroup.add(viewer.sprites.createFaceIds(groupName, geometry));
//    }

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
        state: nucletConf.state,
        protons: [],
        electrons: {},
        nelectrons: {}
      };

      nuclet.geo = drupalSettings.atomizer_config.objects[nucletConf.state];

      var protons;
      switch (nuclet.az.state) {
        case 'dodecahedron': protons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; break;
        case 'neutral':   protons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]; break;
        case 'lithium':   protons = [0, 1, 3, 4, 5, 9, 11]; break;
        case 'beryllium': protons = [1, 3, 4, 5, 6, 7, 9, 10, 11]; break;
        case 'boron':
        case 'boron10':   protons = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11]; break;
        case 'boron11':   protons = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11]; break;
        case 'initial':
        case 'final':     protons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]; break;
        case 'carbon':    protons = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];  break; }

      // If the configuration for protons and electrons is not set then use the default values set above.
      if (!nuclet.az.conf.protons) nuclet.az.conf.protons = protons;

      // Remove the attach proton if this isn't 'N0'
      if (id != 'N0') {
        var i = nuclet.az.conf.protons.indexOf(10);
        if (i > -1) nuclet.az.conf.protons[i] = undefined;

        // If this is a child nuclet and it's boron then remove one proton from the base boron.
        if (nuclet.az.conf.state === 'boron10' && nuclet.az.conf.state === 'boron') {
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
      nuclet.add(createHelperAxis('nucletAxis', protonRadius * 6, 1));

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
//    var geometry = createGeometry('icosahedron', '', protonRadius, 1);
//    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(90 / 360 * 2 * Math.PI));
//    var line = createLine('attach', [geometry.vertices[9], geometry.vertices[10]], viewer.theme.get('attachLines--opacity'));
//    line.scale.set(5, 5, 5);
//    nuclet.add(line);

      //// Create inner shell
      var innerShell = new THREE.Object3D();
      innerShell.name = 'nucletInner-' + id;
      innerShell.add(nuclet);

      // Create inner shell helper axis
      innerShell.add(createHelperAxis('nucletInnerAxis', protonRadius * 5, 3));

      //// Create outer shell
      var outerShell = new THREE.Object3D();
      outerShell.name = 'nucletOuter-' + id;
      outerShell.add(innerShell);

      // Create outer shell helper axis
      outerShell.add(createHelperAxis('nucletOuterAxis', protonRadius * 4, 5));

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

    function clearSelectedProtons () {

    }

    function setProtonColor(proton, name, highlight) {
      var color;
      highlight = highlight || false;
      if (name) {
        if (name == 'original') {
          proton.material.color = viewer.theme.getColor(proton.name + '--color', highlight);
          if (proton.az.tmpColor) {
            delete proton.az.tmpColor;
          }
          if (proton.az.selected) {
            delete proton.az.selected;
          }
          return;
        }
        proton.az.tmpColor = viewer.theme.getColor('proton-' + name + '--color', highlight);
      }
      if (proton.az.selected) {
        proton.material.color = viewer.theme.getColor('proton-ghost--color', highlight);
      } else if (proton.az.tmpColor) {
        proton.material.color = viewer.theme.getColor(proton.az.tmpColor.name, highlight);
      } else {
        proton.material.color = viewer.theme.getColor(proton.name + '--color', highlight);
      }
    }

    // Return references to class functions - makes this into a pseudo-class.
    return {
      makeObject: makeObject,
      makeProton: makeProton,
      createNElectron: createNElectron,
      getProtonName: getProtonName,
      showProtons: showProtons,
      createNuclet: createNuclet,
      deleteNuclet: deleteNuclet,
      createGeometry: createGeometry,
      createGeometryWireframe: createGeometryWireframe,
      createGeometryFaces: createGeometryFaces,
      highlight: highlight,
      protonRadius: protonRadius,
      setProtonColor: setProtonColor,
    };
  };

})(jQuery);
