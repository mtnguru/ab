/**
 * @file - atomizerobject.js
 *
 */

Drupal.atomizer.atomizer_icosaletC = function (_viewer) {
  var viewer = _viewer;
  var visibleThresh = .03;
  var transparentThresh = .97;

  icoLet: {          // Carbon 12
      wireframe: {
        scale: 1.66
      },
      axis: {
        scale: 2.5
      }
    }
  };


  function create(pos) {
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

    // Create geometry wireframe and faces - isocahedron

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
//  var dualGeometry = new THREE.DodecahedronGeometry(60);
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


  return {
    makeObject: makeObject,
    createIcoLet: createIcoLet,
    createPentaLet: createPentaLet,
    createTetraLet: createTetraLet
  };
};
