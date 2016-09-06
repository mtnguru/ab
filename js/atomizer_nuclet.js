/**
 * @file - atomizer_nuclet.js
 *
 */

Drupal.atomizer.nucletC = function (_viewer) {
  var viewer = _viewer;
  var visibleThresh = .03;
  var transparentThresh = .97;
  var axes = ['x', 'y', 'z'];
  var objects = {};
  var protonColors = {
    default: viewer.style.get('proton-default--color'),
    ghost:   viewer.style.get('proton-ghost--color'),
    valence: viewer.style.get('proton-valence--color'),
    isotope: viewer.style.get('proton-isotope--color'),
    decalet: viewer.style.get('proton-decalet--color'),
    vattach: viewer.style.get('proton-vattach--color'),
    iattach: viewer.style.get('proton-iattach--color')
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

  function createAxes(name, conf, geometry) {
    var axisGeometry = new THREE.Geometry();
    for (var i = 0; i < conf.vertices.length; i++) {
      var vertice;
      vertice = geometry.vertices[conf.vertices[i][0]];
      axisGeometry.vertices.push(new THREE.Vector3(vertice.x, vertice.y, vertice.z));
      vertice = geometry.vertices[conf.vertices[i][1]];
      axisGeometry.vertices.push(new THREE.Vector3(vertice.x, vertice.y, vertice.z));
    }
    var opacity = viewer.style.get(name + 'Axes--opacity');
    var lineMaterial = new THREE.LineBasicMaterial({
      color: viewer.style.get(name + 'Axes--color'),
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
      linewidth: 2
    });
    var axes = new THREE.LineSegments(axisGeometry, lineMaterial);
    if (conf.scale) {
      axes.scale.set(conf.scale, conf.scale, conf.scale);
    }
    axes.name = name + 'Axes';
    return axes;
  }

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
  }

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
      for (var v in face.indices) {
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
    faces = new THREE.Mesh(geometry, material);
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
          geo.widthSegments || 50,
          geo.heightSegments || 50
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



  function createGeometry(shape, scale, height, detail) {
    switch (shape) {
      case 'icosahedron':
        return viewer.shapes.getGeometry('icosahedron', scale, null, detail);
      case 'decahedron':
        return viewer.shapes.getGeometry('decahedron', scale, height, detail);
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
        return viewer.shapes.getGeometry('dodecahedron', scale, null, detail);
      case 'octahedron':
        return new THREE.OctahedronGeometry(scale, detail);
      case 'hexahedron':
        return viewer.shapes.getGeometry('hexahedron', scale, null, detail);
    }
  }

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
      {radius: protonRadius},
      {
        x: pos.x,
        y: pos.y,
        z: pos.z
      }
    );
    proton.name = 'proton-' + protonType;
    return proton;
  }

  function createNuclet(nucletConf) {
    var nuclet = new THREE.Group();
    nuclet.name = nucletConf.type;
    nuclet.protonRadius = protonRadius;

    var nucletGeo = drupalSettings.atomizer_config.nuclets[nucletConf.type];
    nuclet.geo = drupalSettings.atomizer_config.nuclets[nucletConf.type];
    for (var groupName in nucletGeo.geoGroups) {
      var groupConf = nucletGeo.geoGroups[groupName];
      var nucletGroup = new THREE.Group();
      nuclet.add(nucletGroup);
      nucletGroup.name = groupName;

      //// Set rotation for this group
      if (groupConf.rotation) {
        var radians;
        if (groupConf.rotation.x) {
          radians = groupConf.rotation.x / 360 * 2 * Math.PI;
          nucletGroup.rotation.init_x = radians;
          nucletGroup.rotation.x = radians;
        }
        if (groupConf.rotation.y) {
          radians = groupConf.rotation.y / 360 * 2 * Math.PI;
          nucletGroup.rotation.init_y = radians;
          nucletGroup.rotation.y = radians;
        }
        if (groupConf.rotation.z) {
          radians = groupConf.rotation.z / 360 * 2 * Math.PI;
          nucletGroup.rotation.init_z = radians;
          nucletGroup.rotation.z = radians;
        }
      }

      // Loop through the groups of geometries
      for (var geoName in groupConf.geometries) {
        var geo = groupConf.geometries[geoName];
        var geometry = createGeometry(geo.shape, (geo.scale || 1) * protonRadius, (geo.scaleHeight || 1) * protonRadius);

        //// Add Protons
        if (geo.protons) {
          var opacity = viewer.style.get('proton--opacity') || 1;
          nuclet.protons = [];
          for (var key in nucletConf.protons) {
            if (nucletConf.protons[key].present == false) continue;
            var vertice = geometry.vertices[key];
            var protonType = geo.protons[key].type;
            var proton = makeProton(protonType, opacity, vertice);
            addObject('protons', proton);
            nucletGroup.add(proton);
            nuclet.protons.push(proton);
          }
        }

        //// Add Electrons
        if (geo.electrons) {
          var opacity = viewer.style.get('electron--opacity') || 1;
          for (var key in nucletConf.electrons) {
            if (nucletConf.electrons[key].present == false) continue;
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
              {radius: electronRadius},
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

        //// Create axes
        if (geo.axes) {
          nucletGroup.add(createAxes(groupName, geo.axes, geometry));
        }

        //// Create geometry wireframe
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

        //// Create geometry faces
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
            objects['selectFace'] = [faces];
            nuclet.attachFaces = geo.faces;
          }
        }

        if (geo.vertexids) {
          nucletGroup.add(viewer.sprites.createVerticeIds(groupName, geometry));
        }

        if (geo.faceids) {
          nucletGroup.add(viewer.sprites.createFaceIds(groupName, geometry));
        }

        viewer.render();
      }
    }

    //// Set the nuclet position
    if (nucletConf.position) {
      nuclet.position.x = nucletConf.position.x || 0;
      nuclet.position.y = nucletConf.position.y || 0;
      nuclet.position.z = nucletConf.position.z || 0;
    }

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

    return nuclet;
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

  function addObject(name, object) {
    if (objects[name]) {
      objects[name].push(object);
    } else {
      objects[name] = [object];
    }
  }


  return {
    makeObject: makeObject,
    makeProton: makeProton,
    create: createNuclet,
    objects: objects
  };
};

