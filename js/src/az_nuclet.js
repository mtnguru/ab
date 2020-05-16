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
 *   {makeProton: makeProton,
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
      axes.name = name + 'Axis';
      if (conf.scale) {
        axes.scale.set(conf.scale, conf.scale, conf.scale);
      }
      return axes;
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
      addItem(id, wireframe);
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

      if (geometry.azfaces) { // dodecahedron - maybe more?
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
      addItem(id, lines);
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
      addItem(id, faces);
      return faces;
    }

    function highlight(nuclet, highlight) {
      highlight = highlight || false;
      nuclet.az.highlight = highlight;
      for (var id in nuclet.az.protons) {
        if (nuclet.az.protons.hasOwnProperty(id)) {
          setProtonColor(nuclet.az.protons[id], null, highlight);
        }
      }
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

      let name = 'proton-default';

      let nucletColors = viewer.theme.get('proton--nuclet-colors');

      if (!nucletColors) {    // Name the proton as carbon - @TODO should be 'default'
//      name = 'proton-carbon';
        name = 'proton-default';
      } else {                // Name the proton with the nuclet type
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
          case 'neutron':
            name = 'proton-neutron';
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
                    name = (conf.id.replace('P', '') < 12) ? 'proton-initial' : 'proton-neutral';
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
    function makeProton(id, shapeConf, atomConf, opacity, pos, azNuclet) {

      var az = {
        id: id,
        type: shapeConf.type || 'proton',
        pairs: shapeConf.pairs || 'default',
        alpha3: shapeConf.alpha3 || 'default',
        rings: shapeConf.rings || 'default',
        visible: ('visible' in shapeConf) ? shapeConf.visible : true,
        optional: shapeConf.optional || false,
        active: shapeConf.active || true,
        nuclet: azNuclet,
        atomConf: atomConf
      };

      var opacity = viewer.theme.get('proton--opacity');

      var visible;
      if (az.active === false) {
        visible = false;
      } else {
        visible = (az.visible === false) ? false : (opacity > constants.visibleThresh);
      }

      var name = getProtonName(az);
      var proton = Drupal.atomizer.base.makeObject('proton',
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
        },
        Drupal.atomizer.constants.protonGeometry,
      );
      if (!Drupal.atomizer.constants.protonGeometry) {
        Drupal.atomizer.constants.protonGeometry;
      }

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
      // Remove the proton from the viewer.items.protons array
//    for (var p = 0; p < protons.length; p++) {
//      var proton = protons[p];
//      // Remove protons from the objects.protons array
//      viewer.items.protons = viewer.items.protons.filter(function (e) {return e !== proton;})
//    }
    }

    /**
     * Show or hide a list of protons
     *
     * @param proton
     */
    function showProtons(nuclet, show, protons) {
      // Remove the proton from the viewer.items.protons array
      for (var p = 0; p < protons.length; p++) {
        var proton = nuclet.az.protons[protons[p]];
        if (show) {
//      if (viewer.items.protons.indexOf(proton) === -1) viewer.items.protons.push(proton);
          proton.material.visible = true;
          proton.material.opacity = 1;
          proton.material.transparent = false;
        } else {
//      viewer.items.protons = viewer.items.protons.filter(function (e) { return e !== proton; });
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
     * @returns {THREE.AxesHelper}
     */
    function createHelperAxis(name, length, linewidth) {
      var opacity = viewer.theme.get(name + '--opacity');
      var axis = new THREE.AxesHelper(length);
      axis.name = name;
      axis.material.linewidth = linewidth;
      axis.material.opacity = opacity;
      axis.material.visible = (opacity > .01);
      axis.material.transparent = (opacity < .99);
      return axis;
    }

    function convertArrayToObject(array) {
      var object = {};
      for (var i = 0; i < array.length; ++i) {
        object[array[i]] = null;
      }
      return object;
    }

    function createProtons(geometry, shapeConf, azNuclet) {
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
//      if (Array.isArray(azNuclet.conf.protons)) {
//        azNuclet.conf.protons = convertArrayToObject(azNuclet.conf.protons);
//      }
        var opacity = viewer.theme.get('proton--opacity');
        for (p in shapeConf.protons) {
          if (!shapeConf.protons.hasOwnProperty(p)) continue;
          if (shapeConf.protons[p].hasOwnProperty('optional') && shapeConf.protons[p].optional == 'placeholder') continue;
          shapeConf.protons[p].visible = (p in azNuclet.conf.protons);
          var pnum = p.replace('P', '');
          if (geometry.vertices[pnum]) {
            var proton = makeProton(p, shapeConf.protons[p], azNuclet.conf.protons[p], opacity, geometry.vertices[pnum], azNuclet);
            if (azNuclet.conf.protons[p] && azNuclet.conf.protons[p].color)  {
              setProtonColor(proton, azNuclet.conf.protons[p].color);
            }
            azNuclet.protons[p] = proton;
          }
        }
      }

      return azNuclet.protons;
    }

    function createNeutrons(geometry, shapeConf, azNuclet, nucletGroup) {

      function calculateFourthPoint (vA, vB, vC, dir) {

        // Calculate face normal
        var cb = new THREE.Vector3();
        var ab = new THREE.Vector3();
        cb.subVectors(vC, vA);
        ab.subVectors(vB, vA);
        cb.cross(ab);
        cb.normalize();
        cb.multiplyScalar(Math.sqrt(2 / 3) * 100);

        // Calculate centroid
        var pos = new THREE.Vector3();
        pos = pos.add(vA).add(vB).add(vC).divideScalar(3);
        if (dir == null || dir >= 0) {
          pos.add(cb);
        } else {
          pos.sub(cb);
        }
        return pos;
      }

      var pos;
      azNuclet.neutrons = [];
      if (shapeConf.neutrons) {
        var opacity = viewer.theme.get('proton--opacity');
        var neutrons = shapeConf.neutrons;
        for (var id in neutrons) {
          if (neutrons.hasOwnProperty(id)) {

            pos = new THREE.Vector3();
            for (var v = 0; v < neutrons[id].length; v++) {
              pos.add(calculateFourthPoint(
                geometry.vertices[neutrons[id][v][0].replace('P','')],
                geometry.vertices[neutrons[id][v][1].replace('P','')],
                geometry.vertices[neutrons[id][v][2].replace('P','')],
                neutrons[id][v][3] || 0
              ));
            }
            pos.divideScalar(neutrons[id].length);

//          console.log(pos.x / protonRadius + ', ' + pos.y / protonRadius + ', ' + pos.z / protonRadius + ',     ');

            // Kludge - move the first two neutrons to where defined by geometry instead of calculated position.
            if (id.charAt(2) == '0' && (shapeConf.shape == 'initial' || shapeConf.shape == 'final')) {
              var num = Number(id.charAt(1));
              pos = geometry.vertices[20 + Number(id.charAt(1))];
            }

            var visible = (azNuclet.conf.neutrons && azNuclet.conf.neutrons.contains(id)) ? true : false;
            neutrons[id].visible = visible;
            neutrons[id].optional = true;
            neutrons[id].type = 'neutron';

            var neutron = makeProton(id, neutrons[id], null, opacity, pos, azNuclet);
            neutron.az.protons = neutrons[id];
            neutron.az.position = pos;
//          neutron.az.nucletGroup = nucletGroup;
//          nucletGroup.add(neutron);
            azNuclet.neutrons[id] = neutron;

            neutron.az.tetrahedrons = [];
            for (var t = 0; t < neutron.az.protons.length; t++) {       // for each tetrahedron
              var vertices = [neutron.az.position]; // Add vertice for the proton.
              for (var p in neutron.az.protons[t]) {
                if (p == 3) continue;
                if (neutron.az.protons[t].hasOwnProperty(p)) {
                  var position = neutron.az.nuclet.protonGeometry.vertices[neutron.az.protons[t][p].replace('P', '')];
                  var vector = new THREE.Vector3();
                  vector.add(position);
                  vertices.push(vector);
                }
              }
              var tetrahedron = viewer.nuclet.createTetrahedronLines('tetraLinesWireframe', vertices, visible);
              tetrahedron.name = 'tetraLinesWireframe';
              neutron.az.tetrahedrons.push(tetrahedron);
              neutron.az.nucletGroup = nucletGroup;
              nucletGroup.add(tetrahedron);
            }
//          neutron.az.tetrahedrons = [];
//          for (var t = 0; t < neutron.az.protons.length; t++) {       // for each tetrahedron
//            var vertices = [neutron.az.position]; // Add vertice for the proton.
//            for (var p in neutron.az.protons[t]) {
//              if (neutron.az.protons.hasOwnProperty(p)) {
//                var index = neutron.az.protons[t][p];
//                var position = neutron.az.nuclet.protons[neutron.az.protons[t][p]].position;
//                var vector = new THREE.Vector3();
//                vector.add(position);
//                vertices.push(vector);
//              }
//            }
//            var tetrahedron = viewer.nuclet.createTetrahedronLines('tetraLinesWireframe', vertices);
//            neutron.az.tetrahedrons.push(tetrahedron);
//            nucletGroup.add(tetrahedron);
//          }
          }
        }
      }
      return azNuclet.neutrons;
    }

    function createValenceRings(shapeConf, azNuclet) {
      var color = viewer.theme.get('valence-active--color');
      var opacity = viewer.theme.get('valence--opacity');
      var radius = viewer.theme.get('valence--scale') * protonRadius;
      var diameter = viewer.theme.get('valence--diameter') * protonRadius;

      azNuclet.rings = [];
      for (var v in shapeConf.valence) {
        var ringConf = shapeConf.valence[v];

        if (!Drupal.atomizer.constants.torusGeometry) {
          torusGeometry = new THREE.TorusGeometry(radius, diameter, 10, 40);
        }
        var material = new THREE.MeshPhongMaterial({
          color: color,
          opacity: opacity,
          transparent: (opacity < constants.transparentThresh),
          visible: (opacity > constants.visibleThresh)
        });
        var ring = new THREE.Mesh(Drupal.atomizer.constants.torusGeometry, material);
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
        azNuclet.protons['P' + v].add(ring);
      }
    }

    var createTetrahedronLines = function createTetrahedronLines(id, vertices, visible) {

      var opacity = viewer.theme.get(id + '--opacity');
      var material = new THREE.LineBasicMaterial({
        color: viewer.theme.get(id + '--color'),
        opacity: opacity,
        transparent: (opacity < constants.transparentThresh),
        visible: visible,
        linewidth: viewer.theme.get(id + '--linewidth')
      });

      var lineGeometry = new THREE.Geometry();
      lineGeometry.vertices.push(vertices[3]);
      lineGeometry.vertices.push(vertices[2]);
      lineGeometry.vertices.push(vertices[1]);
      lineGeometry.vertices.push(vertices[3]);
      lineGeometry.vertices.push(vertices[0]);
      lineGeometry.vertices.push(vertices[1]);
      lineGeometry.vertices.push(vertices[2]);
      lineGeometry.vertices.push(vertices[0]);
      var tetrahedron = new THREE.Line(lineGeometry, material);
      return tetrahedron;
    };

    function createTetrahedrons(shapeConf, geometry, azNuclet) {
      azNuclet.tetrahedrons = [];
      for (var i = 0; i < shapeConf.tetrahedrons.length; i++) {
        var tetrahedron = createTetrahedron('tetra');
        tetrahedron.azid = 't' + i;
//    intersectList.push(tetrahedron.children[1]); // Attach the faces Mesh
        azNuclet.tetrahedrons[i] = tetrahedron;

        // Set 4 vertices of tetrahedron
        tetrahedron.children[1].geometry.protons = [];
        for (var v = 0; v < 4; v++) {

          var p = shapeConf.tetrahedrons[i].vertices[v];
          var pnum = p.replace('P', '').replace('U', '');
          tetrahedron.children[0].geometry.vertices[v].x = geometry.vertices[pnum].x;
          tetrahedron.children[0].geometry.vertices[v].y = geometry.vertices[pnum].y;
          tetrahedron.children[0].geometry.vertices[v].z = geometry.vertices[pnum].z;

          tetrahedron.children[1].geometry.vertices[v].x = geometry.vertices[pnum].x;
          tetrahedron.children[1].geometry.vertices[v].y = geometry.vertices[pnum].y;
          tetrahedron.children[1].geometry.vertices[v].z = geometry.vertices[pnum].z;

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
     * @param shapeConf
     * @param nucletConf
     * @returns {Array}
     */
    function createElectrons(geometry, shapeConf, nucletConf) {
      var opacity = viewer.theme.get('electron--opacity') || 1;
      var scale = shapeConf.scale;
      var electrons = [];
      var pos = new THREE.Vector3(0,0,0);
      for (var e in shapeConf.electrons) {
        if (!shapeConf.electrons.hasOwnProperty(e)) continue;
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
      var core = Drupal.atomizer.base.makeObject('electron',
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
        pos,
        Drupal.atomizer.constants.electronGeometry
      );
      if (!Drupal.atomizer.constants.electronGeometry) {
        Drupal.atomizer.constants.electronGeometry = core.geometry;
      }
      core.name = name + '-core';
      electronGroup.add(core);

      // Make the electron field
      var fieldOpacity = viewer.theme.get(name + '-field--opacity') || 1;
      var field = Drupal.atomizer.base.makeObject(
        'proton',
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
        pos,
        Drupal.atomizer.constants.protonGeometry
      );
      if (!Drupal.atomizer.constants.protonGeometry) {
        Drupal.atomizer.constants.protonGeometry = electronGroup.geometry;
      }
      field.name = name + '-field';
      electronGroup.add(field);

      // Make the electron orbital
      var orbitalOpacity = viewer.theme.get(name + '-orbital--opacity') || 1;
      var orbital = Drupal.atomizer.base.makeObject(
        'proton',
        {
          phong: {
            color: viewer.theme.get(name + '-orbital--color'),
            opacity: orbitalOpacity,
            transparent: (orbitalOpacity < constants.transparentThresh),
            visible: (orbitalOpacity > constants.visibleThresh)
          }
        },
        {
          scale: viewer.theme.get(name + '-orbital--scale'),
          radius: protonRadius
        },
        pos,
        Drupal.atomizer.constants.protonGeometry
      );
      if (!Drupal.atomizer.constants.protonGeometry) {
        Drupal.atomizer.constants.protonGeometry = electronGroup.geometry;
      }
      orbital.name = name + '-orbital';
      electronGroup.add(orbital);

      return electronGroup;
    }

    /**
     * Given a list of sets of vertices, make an electron for each set.
     * If 3 vertices in set, put it in the center of the triangle.
     * If 2 vertices in set, put it between the two protons.
     *
     * @param groupName
     * @param geometry
     * @param shapeConf
     * @param nucletConf
     * @returns {Array}
     */
    function createNElectrons(geometry, azNuclet) {
      var nelectrons = [];
      for (var e in azNuclet.conf.electrons) {
        if (!azNuclet.conf.electrons.hasOwnProperty(e)) continue;
        var pos = new THREE.Vector3();
        var protons = azNuclet.conf.electrons[e].protons;
        for (var p = 0; p < protons.length; p++) {
          var id = protons[p];
          if (typeof(id) == 'string' && id.includes('U')) {  // Neutron
            var neutron = azNuclet.neutrons[id.charAt(1)];
            pos.add(azNuclet.neutrons[id].position);
          } else {                 // Proton
            pos.add(geometry.vertices[id.replace('P', '')]);
          }
        }
        pos.divideScalar(protons.length);
        var nelectron = createNElectron('electronSpherical', pos);

        nelectron.az.vertices = protons;
        nelectron.az.id = e;
        nelectrons[e] = nelectron;
      }
      return nelectrons;
    }

    function createWireframe(name, geometry, shapeConf) {
      var wireframe;
      if (shapeConf.shape == 'dodecahedron' ||
          shapeConf.shape == 'carbon' ||
          shapeConf.shape == 'lithium' ||
          shapeConf.shape == 'hexahedron' ||
          shapeConf.shape == 'beryllium' ||
          shapeConf.shape == 'initial' ||
          shapeConf.shape == 'final' ||
          shapeConf.shape == 'boron' ||
          shapeConf.shape == 'boron10' ||
          shapeConf.shape == 'boron11') {
        wireframe = createGeometryLines(
          name,
          shapeConf.scale,
          geometry,
          shapeConf.rotation || null
        );
      } else {
        wireframe = createGeometryWireframe(
          name,
          shapeConf.scale + .02,
          geometry,
          shapeConf.rotation || null
        );
      }
      return wireframe;
    }

    function createNucletGroupGeometry(groupName, geoGroup, shapeConf, nucletGroup, azNuclet) {
      var geometry = createGeometry(
        shapeConf.shape,
        azNuclet.state || '',
        shapeConf.scale * protonRadius,
        (shapeConf.scaleHeight || 1) * protonRadius
      );
      geometry.shapeConf = shapeConf;
      geometry.scaleInit = shapeConf.scale;

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

      if (shapeConf.protons) {
        var protons = createProtons(geometry, shapeConf, azNuclet);
        for (var p in protons) {
          if (protons.hasOwnProperty(p)) {
            protons[p].az.nucletGroup = nucletGroup;
            nucletGroup.add(protons[p]);
          }
        }
      }

      if (shapeConf.neutrons) {
        var neutrons = createNeutrons(geometry, shapeConf, azNuclet, nucletGroup);
        for (var p in neutrons) {
          if (neutrons.hasOwnProperty(p)) {
            if (neutrons[p]) {
              neutrons[p].az.nucletGroup = nucletGroup;
              nucletGroup.add(neutrons[p]);
            }
          }
        }
      }

      if (shapeConf.nelectrons && azNuclet.conf.electrons) {
        var nelectrons = createNElectrons(geometry, azNuclet);
        for (var e in nelectrons) {
          if (nelectrons.hasOwnProperty(e)) {
            nucletGroup.add(nelectrons[e]);
            nelectrons[e].az.nuclet = azNuclet;
            azNuclet.nelectrons[nelectrons[e].az.id] = nelectrons[e];
          }
        }
      }

      if (shapeConf.valence) {
//      createValenceRings(shapeConf, azNuclet);
      }

      // OBSOLETE - electrons are positioned based on the octahedron
//    if (shapeConf.electrons) {
//      var electrons = createElectrons(geometry, shapeConf, azNuclet.conf);
//      for (var e = 0; e < electrons.length; e++) {
//        nucletGroup.add(electrons[e]);
//        electrons[e].az.nuclet = azNuclet;
//        azNuclet.electrons[electrons[e].az.id] = electrons[e];
//      }
//    }

      if (shapeConf.axes) {
//      nucletGroup.add(createAxis(groupName, shapeConf.axes, geometry));
      }

      if (shapeConf.tetrahedrons) {
        var tetrahedrons = createTetrahedrons(shapeConf, geometry, azNuclet);
        for (var t = 0; t < tetrahedrons.length; t++) {
          nucletGroup.add(tetrahedrons[t]);
        }
      }

      if (shapeConf.wireframe) {
        var wireframe = createWireframe(groupName + 'Wireframe', geometry, shapeConf);
        if (wireframe) {
          nucletGroup.add(wireframe);
        }
      }

      // Create nuclet volume spheres.
      if (shapeConf.volumeNuclet) {
        var volumeOpacity = viewer.theme.get('nuclet-volume--opacity') || 0;
        var volume = Drupal.atomizer.base.makeObject(
            'proton',
            {
              phong: {
                color: viewer.theme.get('nuclet-volume--color'),
                opacity: volumeOpacity,
                transparent: (volumeOpacity < constants.transparentThresh),
                visible: (volumeOpacity > constants.visibleThresh)
              }
            },
            {
              scale: viewer.theme.get('nuclet-volume--scale'),
              radius: protonRadius
            },
            new THREE.Vector3(),
            Drupal.atomizer.constants.protonGeometry
        );
        volume.name = 'nuclet-volume';
        nucletGroup.add(volume);
      }

      // Create faces for the structure
      if (shapeConf.faces) {
        var reactiveState;
        if (shapeConf.assignFaceOpacity && azNuclet.conf.reactiveState) {
          var reactiveState = (azNuclet.conf.reactiveState[groupName]) ? azNuclet.conf.reactiveState[groupName].slice() : [];
          geometry.reactiveState = azNuclet.reactiveState = reactiveState;
          geometry.shapeConf = shapeConf;
        }

        var faces = createGeometryFaces(
          groupName + 'Faces',
          shapeConf.scale,
          geometry,
          shapeConf.rotation || null,
          azNuclet.reactiveState
        );
        nucletGroup.add(faces);
  //    viewer.items['selectFace'] = [faces];
      }

//    if (shapeConf.vertexids) {
//      nucletGroup.add(viewer.sprites.createVerticeIds(groupName, geometry));
//    }

//    if (shapeConf.faceids) {
//      nucletGroup.add(viewer.sprites.createFaceIds(groupName, geometry));
//    }

//    if (shapeConf.particleids) {
//      nucletGroup.add(viewer.sprites.createVerticeIds(shapeConf.particleids, geometry));
//    }
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
        var shapeConf = geoGroup.components[compName];
        createNucletGroupGeometry(groupName, geoGroup, shapeConf, nucletGroup, azNuclet);
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
        case 'dodecahedron': protons = {P0: null, P1: null, P2: null, P3: null, P4: null, P5: null, P6: null, P7: null, P8: null, P9: null, P10: null, P11: null, P12: null, P13: null, P14: null, P15: null, P16: null, P17: null, P18: null, P19: null}; break;
        case 'neutral':      protons = {P0: null, P1: null, P2: null, P3: null, P4: null, P5: null, P6: null, P7: null, P8: null, P9: null, P10: null, P11: null, P12: null, P13: null, P14: null, P15: null, P16: null, P17: null, P18: null, P19: null, P20: null, P21: null}; break;
        case 'lithium':      protons = {P0: null, P1: null, P3: null, P4: null, P5: null, P9: null, P11: null}; break;
        case 'beryllium':    protons = {P1: null, P3: null, P4: null, P5: null, P6: null, P7: null, P9: null, P10: null, P11: null}; break;
        case 'boron':
        case 'boron10':      protons = {P1: null, P2: null, P3: null, P4: null, P5: null, P6: null, P7: null, P9: null, P10: null, P11: null}; break;
        case 'boron11':      protons = {P0: null, P1: null, P2: null, P3: null, P4: null, P5: null, P6: null, P7: null, P9: null, P10: null, P11: null}; break;
        case 'carbon':       protons = {P0: null, P1: null, P2: null, P3: null, P4: null, P5: null, P6: null, P7: null, P8: null, P9: null, P10: null, P11: null};  break;
        case 'initial':      protons = {P0: null, P1: null, P2: null, P3: null, P4: null, P5: null, P6: null, P7: null, P8: null, P9: null, P10: null, P11: null, P12: null, P13: null, P14: null, P15: null, P16: null, P17: null, P18: null, P19: null}; break;
        case 'final':        protons = {P0: null, P1: null, P2: null, P3: null, P4: null, P5: null, P6: null, P7: null, P8: null, P9: null, P10: null, P11: null, P12: null, P13: null, P14: null, P15: null, P16: null, P17: null, P18: null, P19: null}; break;
      }

      // If the configuration for protons and electrons is not set then use the default values set above.
      if (!nuclet.az.conf.protons) nuclet.az.conf.protons = protons;


      // Remove the attach proton if this isn't 'N0'
      if (id != 'N0') {
        if ('P10' in nuclet.az.conf.protons) {
          delete (nuclet.az.conf.protons['P10']);
        }

        // If this is a child nuclet and it's boron then remove one proton from the base boron.
        if (nuclet.az.conf.state === 'boron10' && nuclet.az.conf.state === 'boron') {
          if (i in nuclet.az.conf.protons) {
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
//    nuclet.add(createHelperAxis('nucletAxis', protonRadius * 6, 1));

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

      //// Create inner shell
      var innerShell = new THREE.Object3D();
      innerShell.name = 'nucletInner-' + id;
      innerShell.add(nuclet);

      // Create inner shell helper axis
//    innerShell.add(createHelperAxis('nucletInnerAxis', protonRadius * 5, 3));

      //// Create outer shell
      var outerShell = new THREE.Object3D();
      outerShell.name = 'nucletOuter-' + id;
      outerShell.add(innerShell);

      // Create outer shell helper axis
//    outerShell.add(createHelperAxis('nucletOuterAxis', protonRadius * 4, 5));

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
      let atom = nuclet.az.atom;
      if (atom.az.nuclets[nuclet.az.id + '0']) {
        deleteNuclet(atom.az.nuclets[nuclet.az.id + '0'])
      }

      // If there is a '1' nuclet, delete it recursively
      if (atom.az.nuclets[nuclet.az.id + '1']) {
        deleteNuclet(atom.az.nuclets[nuclet.az.id + '1'])
      }

      // Delete protons
      for (var i = 0; i < nuclet.az.protons.length; i++) {
        if (nuclet.az.protons[i]) {
          deleteProtons([nuclet.az.protons[i]]);
        }
      }

      // Remove nuclet from the atom
      delete atom.az.nuclets[nuclet.az.id];
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
    function addItem(name, object) {
      if (!viewer.items) viewer.items = {};
      if (viewer.items[name]) {
        viewer.items[name].push(object);
      } else {
        viewer.items[name] = [object];
      }
    }

    function clearSelectedProtons () {

    }

    function setProtonColor(proton, name) {
      let protonColors = viewer.theme.get('proton--proton-colors');
      highlight = (proton.az.nuclet.highlight) ? proton.az.nuclet.highlight : false;
      if (protonColors && name) {
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
        proton.material.color = viewer.theme.getColor(proton.az.tmpColor.base, highlight);
      } else {
        proton.material.color = viewer.theme.getColor(proton.name + '--color', highlight);
      }
    }

    function setElectronColor(electron, doHighlight, doProtons) {
      var nuclet = electron.az.nuclet;
      var proton;
      if (electron.az.selected || doHighlight) {
        electron.children[0].material.color = viewer.theme.getColor(electron.name + '-core--color-highlight');
        electron.children[1].material.color = viewer.theme.getColor(electron.name + '-field--color-highlight');
        electron.children[2].material.color = viewer.theme.getColor(electron.name + '-orbital--color-highlight');
        if (doProtons) {
          for (var v in electron.az.vertices) {
            if (!electron.az.vertices.hasOwnProperty(v)) continue;
            var vertice = electron.az.vertices[v];
            if (typeof(vertice) == 'string' && vertice.includes('U')) {
              proton = nuclet.neutrons[vertice];
            } else {
              proton = nuclet.protons[vertice];
            }
            proton.az.selected = true;
            viewer.nuclet.setProtonColor(proton, null);
          }
        }
      } else {
        electron.children[0].material.color = viewer.theme.getColor(electron.name + '-core--color');
        electron.children[1].material.color = viewer.theme.getColor(electron.name + '-field--color');
        electron.children[2].material.color = viewer.theme.getColor(electron.name + '-orbital--color');
        if (doProtons) {
          for (var v in electron.az.vertices) {
            if (!electron.az.vertices.hasOwnProperty(v)) continue;
            var vertice = electron.az.vertices[v];
            if (typeof(vertice) == 'string' && vertice.includes('U')) {
              proton = nuclet.neutrons[vertice];
            } else {
              proton = nuclet.protons[vertice];
            }

            proton.az.selected = false;
            viewer.nuclet.setProtonColor(proton, null);
          }

        }
      }
    }

    /**
     * Show the number of protons and electrons
     */
    function countParticles(nuclet) {
      let particles = {
        numProtons: 0,
        numElectrons: 0,
        numUnclassified: 0,
      };

      // Add protons
      for (let p in nuclet.az.protons) {
        let proton = nuclet.az.protons[p];
        if (!proton.az) {
          particles.numUnclassified++;
        }
        else if (proton.az.visible) {
          particles.numProtons++;
        }
      }

      // Add neutrons
      for (let p in nuclet.az.neutrons) {
        if (nuclet.az.neutrons.hasOwnProperty(p)) {
          let neutron = nuclet.az.neutrons[p];
          if (neutron.az.visible) {
            particles.numProtons++;
          }
        }
      }

      // Add NElectrons
      for (let p in nuclet.az.nelectrons) {
        particles.numElectrons++;
      }

      return particles;
    }


    // Return references to class functions - makes this into a pseudo-class.
    return {
      makeProton,
      createNElectron,
      getProtonName,
      showProtons,
      createNuclet,
      deleteNuclet,
      createGeometry,
      createGeometryWireframe,
      createGeometryFaces,
      createTetrahedronLines,
      highlight,
      protonRadius,
      setProtonColor,
      setElectronColor,
      countParticles,
      getConstants: function () { return constants; },
    };
  };

})(jQuery);
