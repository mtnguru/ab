/**
 * @file - atomizer_nuclet.js
 *
 * Functions to create a nuclet.
 */

/**
 * Creates an instance of a nucletC - does not really do anything except define function to call.
 *
 * @param _viewer
 * @returns {{makeObject: makeObject, makeProton: makeProton, create: createNuclet, createGeometryWireframe: createGeometryWireframe, createGeometryFaces: createGeometryFaces, objects: {}, protonRadius: *}}
 */
Drupal.atomizer.nucletC = function (_viewer) {
  var viewer = _viewer;
  var visibleThresh = .03;
  var transparentThresh = .97;
  var axes = ['x', 'y', 'z'];
  var protonColors = {
    default:    viewer.style.get('proton-default--color'),
    ghost:      viewer.style.get('proton-ghost--color'),
    valence:    viewer.style.get('proton-valence--color'),
    isotope:    viewer.style.get('proton-isotope--color'),
    grow:       viewer.style.get('proton-grow--color'),
    polar:      viewer.style.get('proton-polar--color'),
    lithium:    viewer.style.get('proton-lithium--color'),
    newneutron: viewer.style.get('proton-newneutron--color'),
    newproton:  viewer.style.get('proton-newproton--color'),
    vattach:    viewer.style.get('proton-vattach--color'),
    iattach:    viewer.style.get('proton-iattach--color')
  };

  var protonRadius = viewer.style.get('proton--radius');
  var electronRadius = viewer.style.get('electron--radius');

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
    var opacity = viewer.style.get(name + 'Axes--opacity');
    var lineMaterial = new THREE.LineBasicMaterial({
      color: viewer.style.get(name + 'Axes--color'),
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
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
  function createLine(name, vertices) {
    var lineGeometry = new THREE.Geometry();
//  var opacity = viewer.style.get(name + 'Axes--opacity');
    var opacity = 1;
    var lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
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
   * @param offsetY
   * @returns {THREE.Mesh}
   */
  function createGeometryWireframe(id, scale, geometry, rotation, offsetY) {

    var opacity = viewer.style.get(id + '--opacity');
    var wireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: viewer.style.get(id + '--color'),
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
      wireframe: true,
      wireframeLinewidth: viewer.style.get(id + '--linewidth')
    }));
    wireframe.scale.set(scale, scale, scale);
    wireframe.init_scale = scale;
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
    if (offsetY) {
      wireframe.position.y = offsetY * viewer.style.get('proton--radius');
      wireframe.init_offsetY = offsetY * viewer.style.get('proton--radius');
    }
    addObject(id, wireframe);
    return wireframe;
  };

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
   * @param offsetY
   * @returns {THREE.Group}
   */
  function createGeometryLines(id, scale, geometry, rotation, offsetY) {

    var opacity = viewer.style.get(id + '--opacity');
    var material = new THREE.LineBasicMaterial({
      color: viewer.style.get(id + '--color'),
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
      linewidth: viewer.style.get(id + '--linewidth')
    });

    var lines = new THREE.Group();
    lines.name = id ;
    for (var f = 0; f < geometry.azfaces.length; f++) {
      var face = geometry.azfaces[f];
      var lineGeometry = new THREE.Geometry();
      var vertex;
      for (var v = 0; v < face.indices.length; v++) {
        vertex = geometry.vertices[face.indices[v]];
        lineGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
      }
      vertex = geometry.vertices[face.indices[0]] ;
      lineGeometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));

      lines.add(new THREE.Line(lineGeometry, material));
    }
    lines.scale.set(scale, scale, scale);
    lines.init_scale = scale;

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
    if (offsetY) {
      lines.position.y = offsetY * viewer.style.get('proton--radius');
      lines.init_offsetY = offsetY * viewer.style.get('proton--radius');
    }
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
   * @param offset
   * @returns {THREE.Mesh|*}
   */
  function createGeometryFaces(id, scale, geometry, rotation, offset) {

    // add one random mesh to each scene
    var opacity = viewer.style.get(id + '--opacity');
    var material = new THREE.MeshStandardMaterial( {
      color: viewer.style.get(id + '--color'),
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
      roughness: 0.5,
      metalness: 0,
//    shading: THREE.FlatShading
    } );
    var faces = new THREE.Mesh(geometry, material);
//  for (var i = 0; i < faces.geometry.faces.length; i++) {
//    var face = faces.geometry.faces[i];
//    face.azid = ''
//    continue;
//  }
    faces.scale.set(scale, scale, scale);
    faces.init_scale = scale;
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
    if (offset) {
      if (offset.x) faces.position.x = offset.x;
      if (offset.y) faces.position.y = offset.y;
      if (offset.z) faces.position.z = offset.z;
      faces.init_offset = offset;
    }
    addObject(id, faces);
    return faces;
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
          geo.radius || viewer.style.get('proton--radius'),
          geo.widthSegments || 30,
          geo.heightSegments || 30
        );
        break;
      case 'electron':
        geometry = new THREE.SphereGeometry(
          geo.radius || viewer.style.get('electron--radius'),
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
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(geo.length || 3);
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
//    object = new THREE.Mesh(geometry, materials[0]);
      if (name == 'proton') {
        object = new Physijs.SphereMesh(geometry, materials[0]);
      } else {
        object = new THREE.Mesh(geometry, materials[0]);
      }
    } else {
      object = new THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    }

    // Set scale
    if (geo.scale) {
      object.scale.set(geo.scale, geo.scale, geo.scale);
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
      case 'lithium':
      case 'icosahedron':
        return viewer.shapes.getGeometry('icosahedron', 'final', scale, null, detail);
      case 'decahedron':
        return viewer.shapes.getGeometry('decahedron', 'final', scale, height, detail);
        break;
      case 'line':
        var lineGeometry = new THREE.Geometry();
        var pos = protonRadius * 2;
        lineGeometry.vertices.push(new THREE.Vector3( pos, 0, 0));
        lineGeometry.vertices.push(new THREE.Vector3( 0,   0, 0));
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

  /**
   * Make one proton.
   *
   * @param protonType
   * @param opacity
   * @param pos
   *
   * @returns {*}
   */
  function makeProton(protonType, opacity, pos) {
    var proton = makeObject('proton',
      {
        phong: {
          color: protonColors[protonType],
          opacity: opacity,
          transparent: (opacity < transparentThresh),
          visible: (opacity > visibleThresh)
        }
      },
      {
        scale: viewer.style.get('proton--scale'),
        radius: protonRadius
      },
      {
        x: pos.x,
        y: pos.y,
        z: pos.z
      }
    );
    proton.name = 'proton-' + protonType;
    return proton;
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
    var opacity = viewer.style.get(name + '--opacity');
    var axis = new THREE.AxisHelper(length);
    axis.name = name;
    axis.material.linewidth = linewidth;
    axis.material.opacity     = opacity;
    axis.material.visible     = (opacity >.02);
    axis.material.transparent = (opacity < .97);
    return axis;
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
    nuclet.az = {
      protonRadius: protonRadius,
      conf: nucletConf,
      id: id,
      state: nucletConf.state
    };

    nuclet.geo = drupalSettings.atomizer_config.nuclets[nucletConf.state.replace('-', '_')];

    // Loop through each of the Geometry Groups - Ex: Proton framework, icosahedron, dodecahedron, etc.
    for (var groupName in nuclet.geo.geoGroups) {
      if (!nuclet.geo.geoGroups.hasOwnProperty(groupName)) continue;
      var geoGroup = nuclet.geo.geoGroups[groupName];
      var nucletGroup = new THREE.Group();
      nuclet.add(nucletGroup);
      nucletGroup.name = groupName;

      // Loop through each of the geometries for this group
      for (var geoName in geoGroup.geometries) {
        if (!geoGroup.geometries.hasOwnProperty(geoName)) continue;
        var geo = geoGroup.geometries[geoName];
        var geometry = createGeometry(
          geo.shape,
          nucletConf.state || '',
          (geo.scale || 1) * protonRadius,
          (geo.scaleHeight || 1) * protonRadius
        );

        if (geoGroup.rotation) {
          if (geoGroup.rotation.x) {
            var radians = geoGroup.rotation['x'] / 360 * 2 * Math.PI;
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(radians));
          }
          if (geoGroup.rotation.y) {
            var radians = geoGroup.rotation['y'] / 360 * 2 * Math.PI;
            geometry.applyMatrix(new THREE.Matrix4().makeRotationY(radians));
          }
          if (geoGroup.rotation.z) {
            var radians = geoGroup.rotation['z'] / 360 * 2 * Math.PI;
            geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(radians));
          }
        }

        // Scale the geometry
        var scale = viewer.style.get(groupName + '--scale');
        if (scale) {
//        nuclet.scale.set(scale,scale,scale);
        }

        // Add Protons
        if (geo.protons) {
          var opacity = viewer.style.get('proton--opacity') || 1;

          // Move nucleons to a new location
          switch (nucletConf.state) {
            case 'neutral':
              geometry.vertices[9].set(
                0,
                protonRadius * 0.1616236535868876,
                protonRadius * .0998889113026354
              );
              break;
            case 'lithium':
              // Move the top center proton to the correct position.
              geometry.vertices[9].set(
                0,
                protonRadius * 0.1616236535868876,
                protonRadius * .0998889113026354
              );
              nucletConf.protons = [10, 1, 4, 5, 3, 11, 9];
              if (id != 'N0') {
                nucletConf.protons[10] = undefined;
              }
              break;
            case 'backbone-initial':
              nucletConf.protons = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
              if (id != 'N0') {
                nucletConf.protons[10] = undefined;
              }
              break;
            case 'carbon':
            case 'backbone-final':
              nucletConf.protons = [0,1,2,3,4,5,6,7,8,9,10,11];
              if (id != 'N0') {
                nucletConf.protons[10] = undefined;
              }
          }

          nuclet.az.protons = [];
          nuclet.az.protonGeometry = geometry;
          for (var p in geo.protons) {
            if (!geo.protons.hasOwnProperty(p)) continue;
//          if (!nucletConf.protons.contains(p)) continue;
            var proton = makeProton(geo.protons[p].type, opacity, geometry.vertices[p]);
            addObject('protons', proton);
            if (geo.protons[p].optional && geo.protons[p].optional == true) {
              addObject('optionalProtons', proton);
            }
            nucletGroup.add(proton);
            nuclet.az.protons[p] = proton;
          }
        }

        if (geoGroup.alignyaxis) {
//        var vertice1 = nuclet.az.protons[geoGroup.alignyaxis.vertices[0]].position;
//        var vertice2 = nuclet.az.protons[geoGroup.alignyaxis.vertices[1]].position;
          var vertice1 = nuclet.az.protonGeometry.vertices[geoGroup.alignyaxis.vertices[0]];
          var vertice2 = nuclet.az.protonGeometry.vertices[geoGroup.alignyaxis.vertices[1]];
          var newAxis = vertice1.clone().sub(vertice2);
          Drupal.atomizer.base.alignObjectToAxis(
            nucletGroup,
            new THREE.Vector3(0,1,0),
            newAxis.clone().normalize(),
            false
          );
          var origin = new THREE.Vector3(0,0,0);
          var attachPt = origin.add(newAxis).multiplyScalar(geoGroup.alignyaxis.attachPt);
          nucletGroup.position.set(attachPt.x, attachPt.y, attachPt.z);
  
          var radians = geoGroup.alignyaxis.rotatey / 360 * 2 * Math.PI;
          nucletGroup.rotation['y'] = radians;
          radians
        }

        // Add Tetrahedrons
        if (geo.tetrahedrons) {
          nuclet.tetrahedrons = [];
          for (var i = 0; i < geo.tetrahedrons.length; i++) {
            var tetrahedron = createTetrahedron('tetra');
            tetrahedron.azid = 't' + i;
//          intersectList.push(tetrahedron.children[1]); // Attach the faces Mesh
            nuclet.tetrahedrons.push[tetrahedron.azid] = tetrahedron;
            nuclet.add(tetrahedron);

            // Set 4 vertices of tetrahedron
            tetrahedron.children[1].geometry.protons = [];
            for (var v = 0; v < 4; v++) {

              var p = geo.tetrahedrons[i].vertices[v];
              tetrahedron.children[0].geometry.vertices[v].x = geometry.vertices[p].x;
              tetrahedron.children[0].geometry.vertices[v].y = geometry.vertices[p].y;
              tetrahedron.children[0].geometry.vertices[v].z = geometry.vertices[p].z;

              tetrahedron.children[1].geometry.vertices[v].x = geometry.vertices[p].x;
              tetrahedron.children[1].geometry.vertices[v].y = geometry.vertices[p].y;
              tetrahedron.children[1].geometry.vertices[v].z = geometry.vertices[p].z;

              // Save the proton list in tetrafaces mesh
              tetrahedron.protons[v] = nuclet.az.protons[p];
            }
          }
        }

        // Add Electrons
        if (geo.electrons) {
          var opacity = viewer.style.get('electron--opacity') || 1;
          for (var key = 0; key < nucletConf.numInnerElectrons; key++) {
            var vertice = geometry.vertices[key];
            var electron = makeObject('electron',
              {
                phong: {
                  color: viewer.style.get('electron--color'),
                  opacity: opacity,
                  transparent: (opacity < transparentThresh),
                  visible: (opacity > visibleThresh)
                }
              },
              {
                scale: viewer.style.get('proton--scale'),
                radius: electronRadius
              },
              {
                x: vertice.x * geo.scale,
                y: vertice.y * geo.scale,
                z: vertice.z * geo.scale
              }
            );
            electron.name = 'electron';
            addObject('electrons', electron);
            nucletGroup.add(electron);
          }
        }

        // Create axes
        if (geo.axes) {
          nucletGroup.add(createAxes(groupName, geo.axes, geometry));
        }

        // Create geometry wireframe
        if (geo.wireframe) {
          var name = groupName + 'Wireframe';
          if (geo.shape == 'dodecahedron' || geo.shape == 'hexahedron') {
            nucletGroup.add(createGeometryLines(
              name,
              geo.scale + .02,
              geometry,
              geo.rotation || null,
              geo.offsetY || null
            ));
          } else {
            nucletGroup.add(createGeometryWireframe(
              name,
              geo.scale + .02,
              geometry,
              geo.rotation || null,
              geo.offsetY || null
            ));
          }
        }

        // Create geometry faces
        if (geo.faces) {
          var name = groupName + 'Faces';
          var faces =createGeometryFaces(
            name,
            geo.scale,
            geometry,
            geo.rotation || null,
            geo.offsetY || null
          );
          nucletGroup.add(faces);
          if (geo.attachFaces) {
            viewer.objects['selectFace'] = [faces];
            nuclet.attachFaces = geo.faces;
          }
        }

        // Create vertexids
        if (geo.vertexids) {
//        nucletGroup.add(viewer.sprites.createVerticeIds(groupName, geometry));
        }

        // Create faceids
        if (geo.faceids) {
//        nucletGroup.add(viewer.sprites.createFaceIds(groupName, geometry));
        }

        // Create particle ids
        if (geo.particleids) {
//        nucletGroup.add(viewer.sprites.createVerticeIds(geo.particleids, geometry));
        }

        viewer.render();
      }

    }

    // Create nuclet helper axes.
    nuclet.add(createHelperAxes('nucletAxes', protonRadius * 6, 1));

    //// Set the nuclet rotation
    if (nucletConf.rotation) {
      for (var i in axes) {
        var axis = axes[i];
        if (nucletConf.rotation[axis]) {
          var radians = nucletConf.rotation[axis] / 360 * 2 * Math.PI;
          nuclet.rotation['init_' + axis] = radians;
          nuclet.rotation[axis] = radians;
        }
      }
    }

    //// Add attachAxis line

    var geometry = createGeometry(
      'icosahedron',
      '',
      protonRadius,
      1
    );
    var radians = 90 / 360 * 2 * Math.PI;
    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(radians));
    var line = createLine('attach',
      [geometry.vertices[9], geometry.vertices[10]]
    );
    line.scale.set(5, 5, 5);
    nuclet.add(line);
//  nuclet.az.protons[9].position.set(0, 0, 0);

    //// Create inner shell
    var innerShell = new THREE.Object3D();
    innerShell.name = 'nucletInner-' + id;
    innerShell.add(nuclet);

    // Create helper axis
    innerShell.add(createHelperAxes('nucletInnerAxes', protonRadius * 5, 3));

    //// Create outer shell
    var outerShell = new THREE.Object3D();
    outerShell.name = 'nucletOuter-' + id;
    outerShell.add(innerShell);

    // Create helper axis
    outerShell.add(createHelperAxes('nucletOuterAxes', protonRadius * 4, 5));

    //// Set the nucletShell position
    if (nucletConf.position) {
      outerShell.position.x = nucletConf.position.x || 0;
      outerShell.position.y = nucletConf.position.y || 0;
      outerShell.position.z = nucletConf.position.z || 0;
    }

    return outerShell;
  }

  function deleteNuclet(nuclet) {
    if (viewer.nucleus.az().nuclets[nuclet.az.id + '0']) {
      deleteNuclet(viewer.nucleus.az().nuclets[nuclet.az.id + '0'])
    }
    if (viewer.nucleus.az().nuclets[nuclet.az.id + '1']) {
      deleteNuclet(viewer.nucleus.az().nuclets[nuclet.az.id + '1'])
    }

    for (var i = 0; i < nuclet.az.protons.length; i++) {
      if (nuclet.az.protons[i]) {
        viewer.objects.protons = viewer.objects.protons.filter(function(e) { return e !== nuclet.az.protons[i]; })
      }
    }
    // Remove nuclet from the nucleus
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
    var geom = new THREE.Geometry();mesth


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
    createNuclet: createNuclet,
    deleteNuclet: deleteNuclet,
    createGeometry: createGeometry,
    createGeometryWireframe: createGeometryWireframe,
    createGeometryFaces: createGeometryFaces,
    protonRadius: protonRadius
  };
};

