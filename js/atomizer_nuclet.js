/**
 * @file - atomizer_nuclet.js
 *
 */

Drupal.atomizer.nucletC = function (_viewer) {
  var viewer = _viewer;
  var visibleThresh = .03;
  var transparentThresh = .97;
  var axes = ['x', 'y', 'z'];

  var objects = {
    protons: [],
    nuclets: []
  };

  function createAxisLine(scale, vertices) {
    var axisGeometry = new THREE.Geometry();
    axisGeometry.vertices.push(new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z));
    axisGeometry.vertices.push(new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z));
    var opacity = viewer.style.get('aaxis__opacity');
    var lineMaterial = new THREE.LineBasicMaterial({
      color: viewer.style.get('aaxis__color'),
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
      linewidth: 2
    });
    var axisLine = new THREE.Line(axisGeometry, lineMaterial);
    axisLine.scale.set(scale, scale, scale);
    axisLine.name = 'aaxis';
    return axisLine;
  }

  function createGeometryWireframe(id, scale, geometry, rotation, offsetY) {

    var opacity = viewer.style.get(id + '__opacity');
    var wireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: viewer.style.get(id + '__color'),
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
      wireframe: true,
      wireframeLinewidth: viewer.style.get(id + '__linewidth')
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
      wireframe.position.y = offsetY * viewer.style.get('proton__radius');
      wireframe.init_offsetY = offsetY * viewer.style.get('proton__radius');
    }
    return wireframe;
  }

  function createGeometryFaces(id, scale, geometry, rotation, offset) {

    // add one random mesh to each scene
    var opacity = viewer.style.get(id + '__opacity');
    var material = new THREE.MeshStandardMaterial( {
      color: viewer.style.get(id + '__color'),
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
    return faces;
  }

  function createGeometryVertices(scale, geometry, offset) {
    var vertices = new THREE.Group();
    vertices.name = 'verticeIDs';
    for (var key in geometry.vertices) {
      var vertice = geometry.vertices[key];
      var textGeometry = new THREE.TextGeometry( key, {
        size: 80,
        height: 20,
        curveSegments: 20
      });
      textGeometry.computeBoundingBox();
      var centerOffset = -0.5 * ( textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x );
      var material = new THREE.MultiMaterial( [
        new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
        new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
      ] );
      var mesh = new THREE.Mesh( textGeometry, material );
      mesh.position.x = vertice.x;
      mesh.position.y = vertice.y;
      mesh.position.z = vertice.z;
      mesh.rotation.x = 0;
      mesh.rotation.y = Math.PI * 2;
      vertices.add(mesh);
    }
    return vertices;
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
          geo.radius || viewer.style.get('proton__radius'),
          geo.widthSegments || 50,
          geo.heightSegments || 50
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

  function setProtonColors() {
    return {
      default: viewer.style.get('proton_default__color'),
      top:     viewer.style.get('proton_top__color'),
      bottom:  viewer.style.get('proton_bottom__color'),
      marker:  viewer.style.get('proton_marker__color'),
    };
  }

  function icosahedronGeometry ( radius, detail ) {

    var t = ( 1 + Math.sqrt( 5 ) ) / 2;

    var vertices = [
      t,  0,  1,    1,  t,  0,    t,  0, -1,   1, -t,  0,
      0, -1,  t,    0,  1,  t,    0,  1, -t,   0, -1, -t,
     -1, -t,  0,   -t,  0,  1,   -1,  t,  0,  -t,  0, -1
    ];

    var indices = [
     10,  9,  5,   10,  5,  1,   10,  1,  6,   10,  6, 11,   10, 11,  9,
      1,  5,  0,    5,  9,  4,    9, 11,  8,   11,  6,  7,    6,  1,  2,
      3,  0,  4,    3,  4,  8,    3,  8,  7,    3,  7,  2,    3,  2,  0,
      4,  0,  5,    8,  4,  9,    7,  8, 11,    2,  7,  6,    0,  2,  1
    ];

    THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );
    this.type = 'IcosahedronGeometry';
    this.parameters = { radius: radius, detail: detail };
  };
 icosahedronGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
 icosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry;



  function getConfig(type) {
    var protonRadius = viewer.style.get('proton__radius');
    var config;
    switch (type) {

      /////////// Define MonoLet - Hydrogen nuclet
      case 'monolet':
        var lineGeometry = new THREE.Geometry();
        var pos = protonRadius * 2;
        lineGeometry.vertices.push(new THREE.Vector3( pos, 0, 0));
        lineGeometry.vertices.push(new THREE.Vector3( 0,   0, 0));
        lineGeometry.vertices.push(new THREE.Vector3(-pos, 0, 0));

        config = {
          protons: {
            types: [
              'bottom',
              'top',
              'default'
            ]
          },
          shape: {
            scale: 2,
            geometry: lineGeometry
          },
          axis: {
            scale: 2,
            vertices: [lineGeometry.vertices[0], lineGeometry.vertices[2]]
          },
          position: {
            x: 0,
            y: 0,
            z: 0,
          }
        };
        break;

      /////////// Define TetraLet - Helium nuclet
      case 'tetralet':
        var radius = 1.16 * viewer.style.get('proton__radius');
        var height = radius * 1.40;
        config = {
          protons: {
            types: [
              'top',      //  0  0   left
              'marker',   //  1  1
              'default',  //  2  2
              'default',  //  3  3
            ]
          },
          shape: {
            scale: 2.43,
            offsetY: .58,
            geometry: createPyramid(3, radius, height)
          },
          axis: {
            scale: 2.5,
          },
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotation: {
//          z: -90
          }
        };
        config.axis.vertices = [config.shape.geometry.vertices[0], config.shape.geometry.vertices[1]];
        break;

      /////////// Define Octolet - Boron
      case 'octolet':
        config = {
          protons: {
            types: [
              'top',      //  0  0   left
              'marker',   //  1  1
              'default',  //  2  2
              'default',  //  3  3
              'default',  //  4  2
              'default',  //  5  2
              'default',  //  6  3
              'default',  //  7  3
            ]
          },
          shape: {
            scale: 2.43,
            offsetY: .58,
            geometry: new THREE.OctahedronGeometry(1.2 * protonRadius),
          },
          axis: {
            scale: 2.5,
          },
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotation: {
//          z: -90
          }
        };
        config.axis.vertices = [config.shape.geometry.vertices[0], config.shape.geometry.vertices[1]];
        break;

      /////////// Define PentaLet - Lithium nuclet
      case 'pentalet':
        var radiusScale = 1.7;
        var radius = radiusScale * protonRadius;
        var heightScale = .61;
        var geoScale = 1.66;
        var geoScaleDual = 1.66;
        config = {
          protons: {
            types: [
              'top',      //  0  0   left
              'bottom',   //  1  1   right
              'marker',   //  2  2
              'default',  //  3  3
              'default',  //  4  4
              'default',  //  5  5
              'default',  //  6  5
            ]
          },
          shape: {
            scale: geoScale,
            geometry: createBiPyramid(5, radius, radius * heightScale),
          },
          axis: {
            scale: 2.5,
          },
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotation: {
            z: -90
          }
        };
        config.axis.vertices = [config.shape.geometry.vertices[0], config.shape.geometry.vertices[1]];
        break;

      /////////// Define IcosaLet - Carbon nuclet
      case 'icosalet':
        var geoScale = 1.60;
        var geoScaleDual = 1.60;
        config = {
          protons: {
            types: [
              'top',     // 0
              'marker',  // 1
              'default', // 2
              'default', // 3
              'default', // 4
              'default', // 5
              'default', // 6
              'default', // 7
              'marker',  // 8
              'default', // 9
              'default', // 10
              'bottom'   // 11
            ]
          },
          shape: {
            scale: geoScale,
            geometry: new icosahedronGeometry(geoScale * protonRadius)
          },
          shapeDual: {
            scale: geoScaleDual,
            geometry: new THREE.DodecahedronGeometry(geoScaleDual * protonRadius),
            rotation: {
              y: -90,
            }
          },
          axis: {
            scale: 2,
          },
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
          rotation: {
            y: 31.7
          }
        };
        config.axis.vertices = [config.shape.geometry.vertices[0], config.shape.geometry.vertices[11]];
        break;
    }
    return config;
  }

  function createNuclet(nucletConf) {
    var protonColors = setProtonColors();
    var nuclet = new THREE.Group();
    nuclet.name = nucletConf.type;

    var config = getConfig(nucletConf.type);
    nuclet.config = config;

    // Add Protons
    var opacity = viewer.style.get('proton__opacity') || 1;
//  for (var key in config.shape.geometry.vertices) {
    for (var key in nucletConf.protons) {
      var vertice = config.shape.geometry.vertices[key];
      if (nucletConf.protons[key].present == false) continue;
      var proton = makeObject('proton',
        {
          phong: {
            color: protonColors[config.protons.types[key]],
            opacity: opacity,
            transparent: (opacity < transparentThresh),
            visible: (opacity > visibleThresh)
          }
        },
        {radius: viewer.style.get('proton__radius')},
        {
          x: vertice.x,
          y: vertice.y,
          z: vertice.z
        }
      );
      proton.name = 'proton-' + config.protons.types[key];
      objects.protons.push(proton);
      nuclet.add(proton);
    }

    // Create axis
    if (config.axis) {
      nuclet.add(createAxisLine(
        config.axis.scale,
        [
          config.axis.vertices[0],
          config.axis.vertices[1]
        ]
      ));
    }

    if (config.shape) {
      nuclet.add(createGeometryWireframe(
        'awireframe',
        config.shape.scale,
        config.shape.geometry,
        config.shape.rotation || null,
        config.shape.offsetY || null
      ));
      nuclet.add(createGeometryFaces(
        'aface',
        config.shape.scale,
        config.shape.geometry,
        config.shape.rotation || null,
        config.shape.offsetY || null
      ));
    }

    // Create dual geometry wireframe and faces - dodecahedron
    if (config.shapeDual) {
      nuclet.add(createGeometryWireframe('bwireframe', config.shapeDual.scale, config.shapeDual.geometry, config.shapeDual.rotation));
      nuclet.add(createGeometryFaces('bface', config.shapeDual.scale, config.shapeDual.geometry, config.shapeDual.rotation));
    }

    // Position and rotate the atom
    nuclet.position.x = config.position.x || 0;
    nuclet.position.y = config.position.y || 0;
    nuclet.position.z = config.position.z || 0;

    if (config.rotation) {
      for (var i in axes) {
        var axis = axes[i];
        if (config.rotation[axis]) {
          var radians = config.rotation[axis] / 360 * 2 * Math.PI;
          nuclet.rotation['init_' + axis] = radians;
          nuclet.rotation[axis] = radians;
        }
      }
    }

    return nuclet;
  }

  function createMonoLet(pos) {
  }


  function createIcosaLet(pos) {
    // Set proton colors
    var protonColors = setProtonColors();
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
    atom.name = 'icosaLet';
    var geometry = new THREE.IcosahedronGeometry(1.9 * viewer.style.get('proton__radius'));

    // Create geometry wireframe and faces - icosahedron

    // Add Protons
    for (var key in geometry.vertices) {
      var vertice = geometry.vertices[key];
      var opacity = viewer.style.get('proton__opacity') || 1;
      var proton = makeObject('proton',
        {phong: {
          color: protonColors[c[key]],
          opacity: opacity,
          transparent: (opacity < transparentThresh),
          visible:     (opacity > visibleThresh)
        }},
        {radius: viewer.style.get('proton__radius')},
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

    // Create dual geometry wireframe and faces - dodecahedron
//  var dualGeometry = new THREE.DodecahedronGeometry(60);
//  atom.add(createGeometryWireframe('bwireframe', 1.66, dualGeometry));
//  atom.add(createGeometryFaces('bface', 1.66, dualGeometry));

    // Create axis
    atom.add(createAxisLine(2, [geometry.vertices[1], geometry.vertices[2]]));
    atom.add(createGeometryWireframe('awireframe', 1.64, geometry));
    atom.add(createGeometryFaces('aface', 1.64, geometry));

    // Position and rotate the atom
    atom.position.x = pos.x;
    atom.position.y = pos.y;
    atom.position.z = pos.z;
    atom.rotation.init_z = .552;
    atom.rotation.z = .552;

    return atom;
  }

  function createPentaLet(pos) {
    // Set proton colors
    var protonColors = setProtonColors();
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
    var radius = viewer.style.get('proton__radius') * 1.70;
    var height = radius * .61;
    var geometry = createBiPyramid(5, radius, height);

    // Add the protons
    for (var key in geometry.vertices) {
      var vertice = geometry.vertices[key];
      var opacity = viewer.style.get('proton__opacity') || 1;
      var proton = makeObject('proton',
        {phong: {
          color: protonColors[c[key]],
          opacity: opacity,
          transparent: (opacity < transparentThresh),
          visible:     (opacity > visibleThresh)
        }},
        {radius: viewer.style.get('proton__radius')},
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

    atom.add(createGeometryWireframe('awireframe', 2.15, geometry));
    atom.add(createGeometryFaces('aface', 2.15, geometry));
    atom.add(createAxisLine(2, [geometry.vertices[0], geometry.vertices[1]]));

    // Position the atom
    atom.position.x = pos.x;
    atom.position.y = pos.y;
    atom.position.z = pos.z;
    objects.nuclets.push(atom);
    return atom;
  }

  function createTetraLet(pos) {
    // Set proton colors
    var protonColors = setProtonColors();
    var c = [
      'top', 'marker', 'default', 'default'
    ];

    var atom = new THREE.Group();
    atom.name = 'tetraLet';
    var radius = 1.16 * viewer.style.get('proton__radius');
    var height = radius * 1.40;
    var geometry = createPyramid(3, radius, height);

    // Add the protons
    for (var key in geometry.vertices) {
      var vertice = geometry.vertices[key];
      var opacity = viewer.style.get('proton__opacity') || 1;
      var proton = makeObject('proton',
        {phong: {
          color: protonColors[c[key]],
          opacity: opacity,
          transparent: (opacity < transparentThresh),
          visible:     (opacity > visibleThresh)
        }},
        {radius: viewer.style.get('proton__radius')},
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

    atom.add(createGeometryWireframe('awireframe', 2.43, geometry, {y:.59 * viewer.style.get('proton__radius')}));
    atom.add(createGeometryFaces('aface', 1.2, geometry));
    atom.add(createAxisLine(2,
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


  return {
    makeObject: makeObject,
    create: createNuclet,
    createMonoLet:  createMonoLet,
    createIcosaLet: createIcosaLet,
    createPentaLet: createPentaLet,
    createTetraLet: createTetraLet
  };
};
