/**
 * @file - atomizer_nuclet.js
 *
 */

Drupal.atomizer.shapesC = function (_viewer) {
  var viewer = _viewer;
  var axes = ['x', 'y', 'z'];

  /**
   * Create the icosahedron geometry.
   *
   * Defines a different order of vertices and indices than the THREE.js library.
   *
   * @param radius
   * @param detail
   */
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

  /**
   * Create the Dodecahedron geometry.
   *
   * Defines a different order to the vertices and indices than the THREE.js library.
   * Adds the azfaces array which defines the faces and wireframes around them.
   *
   * @param radius
   * @param detail
   */
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

  /**
   * Create the Cube geometry.
   *
   * @param radius
   * @param detail
   */
  function cubeGeometry (radius, detail) {
    var vertices = [
      1,  1,  1,     1, -1,  1,
      1, -1, -1,     1,  1, -1,
     -1,  1, -1,    -1, -1, -1,
     -1, -1,  1,    -1,  1,  1
    ];

    var indices = [
      0, 1, 3,   1, 2, 3,
      4, 5, 7,   5, 6, 7,
      4, 7, 3,   7, 0, 3,
      6, 5, 1,   5, 2, 1,
      7, 6, 0,   6, 1, 0,
      3, 2, 4,   2, 5, 4
    ];

    THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

    this.type = 'DodecahedronGeometry';

    this.parameters = {
      radius: radius,
      detail: detail
    };

    this.azfaces = [
      {  // 0
        'indices': [0, 1, 2, 3],
        'faces': [0, 1]
      },
      {  // 1
        'indices': [4, 5, 6, 7],
        'faces': [2, 3]
      },
      {  // 2
        'indices': [0, 3, 4, 7],
        'faces': [4, 5]
      },
      {  // 3
        'indices': [1, 6, 5, 2],
        'faces': [6, 7]
      },
      {  // 4
        'indices': [0, 7, 6, 1],
        'faces': [8, 9]
      },
      {  // 5
        'indices': [2, 5, 4, 3],
        'faces': [10, 11]
      },
    ];
  }

  cubeGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
  cubeGeometry.prototype.constructor = cubeGeometry;

  var getGeometry = function (type, radius, height, detail) {
    switch (type) {
      case 'icosahedron':
        return new icosahedronGeometry(radius, detail);
      case 'dodecahedron':
        return new dodecahedronGeometry(radius, detail);
      case 'decahedron':
        return createBiPyramid(5, radius, height, detail);
      case 'hexahedron':
        return new cubeGeometry(radius, detail);
    }
  };

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
    createPyramid: createPyramid,
    createBiPyramid: createBiPyramid,
    getGeometry: getGeometry,
  };
};
