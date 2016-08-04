/**
 * @file - atomizerobject.js
 *
 */

Drupal.atomizer.objectC = function (_viewer) {
  var viewer = _viewer;

  var objects = {
    protons: [],
    nuclets: []
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
        scale: 1.66
      },
      axis: {
        scale: 2.5
      }
    }
  };

  function createAxisLine(scale, vertices) {
    var axisGeometry = new THREE.Geometry();
    axisGeometry.vertices.push(new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z));
    axisGeometry.vertices.push(new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z));
    var lineMaterial = new THREE.LineBasicMaterial({
      color: viewer.style.get('aaxis__color'),
      transparent: true,
//    opacity: viewer.style.get('aaxis__opacity'),
      linewidth: 2
    });
    var axisLine = new THREE.Line(axisGeometry, lineMaterial);
    axisLine.scale.set(scale, scale, scale);
    axisLine.name = 'aaxis';
    return axisLine;
  }

  function createGeometryWireframe(id, scale, geometry, offset) {

    var wireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: viewer.style.get(id + '__color'),
      transparent: true,
      opacity: viewer.style.get(id + '__opacity'),
      wireframe: true,
      wireframeLinewidth: viewer.style.get(id + '__linewidth')
    }));
    wireframe.scale.set(scale, scale, scale);
    wireframe.init_scale = scale;
    wireframe.name = id;
    if (offset) {
      if (offset.x) wireframe.position.x = offset.x;
      if (offset.y) wireframe.position.y = offset.y;
      if (offset.z) wireframe.position.z = offset.z;
      wireframe.init_offset = offset;
    }
    return wireframe;
  }

  function createGeometryFaces(id, scale, geometry, offset) {

    // add one random mesh to each scene
    var material = new THREE.MeshStandardMaterial( {
      color: viewer.style.get(id + '__color'),
      transparent: true,
      opacity: viewer.style.get(id + '__opacity'),
      roughness: 0.5,
      metalness: 0,
//    shading: THREE.FlatShading
    } );
    faces = new THREE.Mesh(geometry, material);
    faces.scale.set(scale, scale, scale);
    faces.init_scale = scale;
    faces.name = id;
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
        curveSegments: 2
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

  function setProtonColors() {
    return {
      default: viewer.style.get('proton_default__color'),
      top:     viewer.style.get('proton_top__color'),
      bottom:  viewer.style.get('proton_bottom__color'),
      marker:  viewer.style.get('proton_marker__color'),
    };
  }


  function createIcoLet(pos) {
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
    atom.name = 'icoLet';
    var geometry = new THREE.IcosahedronGeometry(60);
    var dualGeometry = new THREE.DodecahedronGeometry(60);

    // Create geometry wireframe and faces - isocahedron

    // Add Protons
    for (var key in geometry.vertices) {
      var vertice = geometry.vertices[key];
      var proton = makeObject('proton',
        {phong: {color: protonColors[c[key]], opacity: viewer.style.get('proton__opacity') || 1, transparent: true}},
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


    // Create dual geometry wireframe and faces - dodecahedron
//  atom.add(createGeometryWireframe('bwireframe', 1.66, dualGeometry));
//  atom.add(createGeometryFaces('bface', 1.66, dualGeometry));

    // Create axis
    atom.add(createAxisLine(2.5, [geometry.vertices[1], geometry.vertices[2]]));
    atom.add(createGeometryWireframe('awireframe', 1.66, geometry));
    atom.add(createGeometryFaces('aface', 1.66, geometry));

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
    var geometry = createBiPyramid(5, conf.pentaLet.radius, conf.pentaLet.height);

    // Add the protons
    for (var key in geometry.vertices) {
      var vertice = geometry.vertices[key];
      var proton = makeObject('proton',
        {phong: {color: protonColors[c[key]], opacity: viewer.style.get('proton__opacity') || 1, transparent: true}},
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

    atom.add(createGeometryWireframe('awireframe', conf.pentaLet.wireframe.scale, geometry));
    atom.add(createGeometryFaces('aface', conf.pentaLet.wireframe.scale, geometry));
    atom.add(createAxisLine(conf.pentaLet.axis.scale, [geometry.vertices[0], geometry.vertices[1]]));

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
    var geometry = createPyramid(3, conf.tetraLet.length, conf.tetraLet.height);

    // Add the protons
    for (var key in geometry.vertices) {
      var vertice = geometry.vertices[key];
      var proton = makeObject('proton',
        {phong: {color: protonColors[c[key]], opacity: viewer.style.get('proton__opacity') || 1, transparent: true}},
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

    atom.add(createGeometryWireframe('awireframe', conf.tetraLet.wireframe.scale, geometry, {y: conf.tetraLet.wireframe.offset.y}));
    atom.add(createGeometryFaces('aface', conf.tetraLet.wireframe.scale, geometry));
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


  return {
    makeObject: makeObject,
    createIcoLet: createIcoLet,
    createPentaLet: createPentaLet,
    createTetraLet: createTetraLet
  };
};
