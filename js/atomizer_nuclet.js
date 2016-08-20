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
    nuclets: [],
    aface: [],
    bface: [],
    awireframe: [],
    bwireframe: [],
    aaxis: [],
    baxis: [],
    vertexIds: [],
    faceIds: []
  };

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

  function createAxisLine(id, scale, vertices) {
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
    axisLine.name = id;
    objects[id].push(axisLine);
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
    objects[id].push(wireframe);
    return wireframe;
  }

  function createGeometryLines(id, scale, geometry, rotation, offsetY) {

    var opacity = viewer.style.get(id + '__opacity');
    var material = new THREE.LineBasicMaterial({
      color: viewer.style.get(id + '__color'),
      opacity: opacity,
      transparent: (opacity < transparentThresh),
      visible:     (opacity > visibleThresh),
      linewidth: viewer.style.get(id + '__linewidth')
    });

    var lines = new THREE.Group();
    lines.name = id;
    for (var f = 0; f < geometry.azfaces.length; f++) {
//  for (var f = 0; f < 10; f++) {
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
      lines.position.y = offsetY * viewer.style.get('proton__radius');
      lines.init_offsetY = offsetY * viewer.style.get('proton__radius');
    }
    objects[id].push(lines);
    return lines;
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
    objects[id].push(faces);
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
  }
 icosahedronGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
 icosahedronGeometry.prototype.constructor = icosahedronGeometry;

 function dodecahedronGeometry ( radius, detail ) {

   var t = ( 1 + Math.sqrt( 5 ) ) / 2;
   var r = 1 / t;

   var vertices = [
      1,  1,  1,     r,  t,  0,
     -r,  t,  0,    -1,  1,  1,
      0,  r,  t,     1,  1, -1,
      t,  0,  r,     0, -r,  t,
     -t,  0,  r,    -1,  1, -1,
      1, -1, -1,     r, -t,  0,
     -r, -t,  0,    -1, -1, -1,
      0, -r, -t,     t,  0, -r,
      1, -1,  1,    -1, -1,  1,
     -t,  0, -r,     0,  r, -t
   ];

   var indices = [
     15, 10, 14,    15, 14, 19,    15, 19,  5,  //  0
     5, 19,  9,     5,  9,  2,     5,  2,  1,  //  1
     14, 13, 18,    14, 18,  9,    14,  9, 19,  //  2
     10, 11, 12,    10, 12, 13,    10, 13, 14,  //  3
     6, 16, 11,     6, 11, 10,     6, 10, 15,  //  4
     0,  6, 15,     0, 15,  5,     0,  5,  1,  //  5
     9, 18,  8,     9,  8,  3,     9,  3,  2,  //  6
     13, 12, 17,    13, 17,  8,    13,  8, 18,  //  7
     17, 12, 11,    17, 11, 16,    17, 16,  7,  //  8
     4,  7, 16,     4, 16,  6,     4,  6,  0,  //  9
     3,  4,  0,     3,  0,  1,     3,  1,  2,  // 10
     8, 17,  7,     8,  7,  4,     8,  4,  3   // 11
   ];


   THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

   this.type = 'DodecahedronGeometry';

   this.parameters = {
     radius: radius,
     detail: detail
   };

   this.azfaces = [
     {  // 0
       'indices': [5, 19, 14, 10, 15],
       'faces': [0, 1, 2]
     },
     {  // 1
       'indices': [1, 2, 9, 19, 5],
       'faces': [3, 4, 5]
     },
     {  // 2
       'indices': [9, 18, 13, 14, 19],
       'faces': [6, 7, 8]
     },
     {  // 3
       'indices': [10, 11, 12, 13, 14],
       'faces': [9, 10, 11]
     },
     {  // 4
       'indices': [6, 15, 10, 11, 16],
       'faces': [12, 13, 14]
     },
     {  // 5
       'indices': [0, 1, 5, 15, 6],
       'faces': [15, 16, 17]
     },
     {  // 6
       'indices': [2, 3, 8, 18, 9],
       'faces': [18, 19, 20]
     },
     {  // 7
       'indices': [8, 17, 12, 13, 18],
       'faces': [21, 22, 23]
     },
     {  // 8
       'indices': [7, 16, 11, 12, 17],
       'faces': [24, 25, 26]
     },
     {  // 9
       'indices': [0, 6, 16, 7, 4],
       'faces': [27, 28, 29]
     },
     {  // 10
       'indices': [0, 1, 2, 3, 4],
       'faces': [30, 31, 32]
     },
     {  // 11
       'indices': [3, 4, 7, 17, 8],
       'faces': [33, 34, 35]
     }
   ];
  }

  dodecahedronGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
  dodecahedronGeometry.prototype.constructor = dodecahedronGeometry;




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
          frame: {
            scale: 2,
            geometry: lineGeometry
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
          frame: {
            scale: 3,
            geometry: createPyramid(3, radius, height)
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
          frame: {
            scale: frameScale,
            geometry: new icosahedronGeometry(frameScale * protonRadius)
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
          frame: {
            scale: geoScale,
            geometry: createBiPyramid(5, radius, radius * heightScale),
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
        var frameScale = 1.90;
        var geoScale = 1.37;
        var geoScaleDual = 1.52;
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
          frame: {
            scale: frameScale,
            geometry: new icosahedronGeometry(frameScale * protonRadius)
          },
          shape: {
            scale: geoScale,
            geometry: new icosahedronGeometry(geoScale * protonRadius)
          },
          shapeDual: {
            scale: geoScaleDual,
            geometry: new dodecahedronGeometry(geoScaleDual * protonRadius),
            rotation: {
              y: -90,
            }
          },
          axis: {
            scale: 2.1
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

    //// Add Protons
    var opacity = viewer.style.get('proton__opacity') || 1;
    for (var key in nucletConf.protons) {
      if (nucletConf.protons[key].present == false) continue;
      var vertice = config.frame.geometry.vertices[key];
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

    //// Create axis
    if (config.axis) {
      nuclet.add(createAxisLine(
        'aaxis',
        config.axis.scale,
        [
          config.axis.vertices[0],
          config.axis.vertices[1]
        ]
      ));
    }

    //// Create Primary Geometry wireframe and faces
    if (config.shape) {
      nuclet.add(createGeometryWireframe(
        'awireframe',
        config.shape.scale +.01,
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
      nuclet.add(viewer.sprites.createVerticeIds('a', config.shape.geometry, config.shape.rotation));
      nuclet.add(viewer.sprites.createFaceIds('a', config.shape.geometry, config.shape.rotation));
    }

    // Create dual geometry wireframe and faces - dodecahedron
    if (config.shapeDual) {
      if (nuclet.name == 'icosalet') {
        nuclet.add(createGeometryLines(
          'bwireframe',
          config.shapeDual.scale +.01,
          config.shapeDual.geometry,
          config.shapeDual.rotation
        ));
      } else {
        nuclet.add(createGeometryWireframe(
          'bwireframe',
          config.shapeDual.scale +.01,
          config.shapeDual.geometry,
          config.shapeDual.rotation
        ));
      }

      nuclet.add(createGeometryFaces(
        'bface',
        config.shapeDual.scale,
        config.shapeDual.geometry,
        config.shapeDual.rotation
      ));
      nuclet.add(viewer.sprites.createVerticeIds('b', config.shapeDual.geometry, config.shapeDual.rotation));
      nuclet.add(viewer.sprites.createFaceIds('b', config.shapeDual.geometry, config.shapeDual.rotation));
    }

    //// Set the nuclet position
    nuclet.position.x = config.position.x || 0;
    nuclet.position.y = config.position.y || 0;
    nuclet.position.z = config.position.z || 0;

    //// Set the nuclet rotation
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
    atom.add(createAxisLine('aaxis', 2, [geometry.vertices[1], geometry.vertices[2]]));
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
    atom.add(createAxisLine('aaxis', 2, [geometry.vertices[0], geometry.vertices[1]]));

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
    atom.add(createAxisLine('aaxis', 2,
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
    createTetraLet: createTetraLet,
    objects: objects
  };
};
