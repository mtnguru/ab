/**
 * @file - az_shapes.js
 *
 */

Drupal.atomizer.shapesC = function (_viewer) {

  var savedGeometries = [];
  /**
   * Create the icosahedron geometry.
   *
   * Defines a different order of vertices and indices than the THREE.js library.
   *
   * @param radius
   * @param detail
   */
  function icosahedronGeometry (state, radius, detail ) {
    var t = ( 1 + Math.sqrt( 5 ) ) / 2;

    var vertices = [
      0,  1,  t,    0, -1,  t,    0,  1, -t,   0, -1, -t,
      t,  0,  1,    t,  0, -1,   -t,  0, -1,  -t,  0,  1,
      1,  t,  0,   -1,  t,  0,    1, -t,  0,  -1, -t,  0
    ];

    var indices = [
      9,  0,  8,     9,  8,  2,     10,  1, 11,     10, 11,  3,
      8,  0,  4,     1,  4,  0,     10,  4,  1,      4,  5,  8,
     10,  5,  4,     2,  8,  5,      5,  3,  2,     10,  3,  5,
      9,  2,  6,     6,  2,  3,      3, 11,  6,      9,  6,  7,
      7,  6, 11,     9,  7,  0,      0,  7,  1,     11,  1,  7
    ];

    THREE.PolyhedronGeometry.call(this, vertices, indices, radius, detail);
    this.type = 'IcosahedronGeometry';
    this.parameters = {radius: radius, detail: detail};
  }
  icosahedronGeometry.prototype = Object.create(THREE.PolyhedronGeometry.prototype);
  icosahedronGeometry.prototype.constructor = icosahedronGeometry;

  /**
   * Create the geometry for nuclets based on the icosahedron.
   *
   * @param state
   * @param radius
   * @param detail
   */

  function nucletGeometry ( state, radius, detail ) {

    // Create a perfect Icosahedron
    var t = ( 1 + Math.sqrt( 5 ) ) / 2;
    var vertices = [
       t,  1,  0,    t, -1,  0,   -t,  1,  0,
      -t, -1,  0,    1,  0, -t,   -1,  0, -t,
      -1,  0,  t,    1,  0,  t,    0,  t, -1,
       0,  t,  1,    0, -t, -1,    0, -t,  1,
    ];

    this.indices = [];
    switch (state) {

      case 'lithium':
        // Assign indices to the 10 faces.
        this.indices = [
          1, 4,10,    4, 5,10,    3, 5,10,   3,10,11,   1,10,11,
          1, 4, 9,    4, 5, 9,    3, 5, 9,   3, 9,11,   1, 9,11
        ];

        // Append the Neutron vertices - almost the same as neutral endings.
        vertices.push.apply(vertices, [
               0,  1.679, -1.198,
          -1.809,  0.988, -0.080,
          -1.118, -0.129,  1.729,
           1.118, -0.129,  1.729,
           1.809,  0.988, -0.080
        ]);

        // Move the 9th center proton down
        vertices[27] = 0;
        vertices[28] = 0.1616;
        vertices[29] = .09989;
        break;

      case 'beryllium':

        this.indices = [
          1, 4,10,    4, 5,10,    3, 5,10,   3,10,11,   1,10,11,
          1, 4, 9,    4, 5, 9,    3, 5, 9,   1, 7, 9,   6, 7,9,
          3, 6, 9,    3, 6,11,    1, 7,11,   6, 7,11,
        ];

        // Move protons 1 and 3 up a little
        vertices[3]  = vertices[3]  * .80;  // 1.x
        vertices[4]  = vertices[4]  * .80;  // 1.y
        vertices[9]  = vertices[9]  * .80;  // 3.x
        vertices[10] = vertices[10] * .80;  // 3.y

        // Push protons 4, 5, 6, 7 in 'z' a little
        vertices[14] = vertices[14] * 1.0;  // 4.z
        vertices[17] = vertices[17] * 1.0;  // 5.z
        vertices[20] = vertices[20] * 1.0;  // 6.z
        vertices[23] = vertices[23] * 1.0;  // 7.z

        // Move the 9th center proton down
        vertices[27] = 0;
        vertices[28] = 0.60;
        vertices[29] = 0;
        break;

      case 'boron':
      case 'boron10':
      case 'boron11':
        this.indices = [
          1, 4,10,    4, 5,10,    3, 5,10,   3,10,11,   1,10,11,
          0, 4, 9,    4, 5, 9,    2, 5, 9,   0, 7, 9,   6, 7, 9,
          2, 6, 9,    3, 6,11,    1, 7,11,   6, 7,11,   1, 0, 7,
          0, 4, 1,    2, 3, 5,    2, 3, 6
        ];

        // Push protons 0 and 2 out in 'x' and 'y' a little
        vertices[0]  = vertices[0]  * 1.23; // 0.x
        vertices[1]  = vertices[1]  *  .95; // 0.y
        vertices[6]  = vertices[6]  * 1.23; // 2.x
        vertices[7]  = vertices[7]  *  .95; // 2.y

        // Move protons 4, 5, 6, 7 in a little in 'z'
        vertices[14] = vertices[14] * .85;  // 4.z
        vertices[17] = vertices[17] * .85;  // 5.z
        vertices[20] = vertices[20] * .85;  // 6.z
        vertices[23] = vertices[23] * .85;  // 7.z

        // Move the 9th center proton down
        vertices[27] = 0;      // 9.x
        vertices[28] = 0.95;   // 9.y
        vertices[29] = 0;      // 9.z
        break;

      case 'carbon':
        this.indices = [
          9,  0,  8,     9,  8,  2,     10,  1, 11,     10, 11,  3,
          8,  0,  4,     1,  4,  0,     10,  4,  1,      4,  5,  8,
          10,  5,  4,     2,  8,  5,      5,  3,  2,     10,  3,  5,
          9,  2,  6,     6,  2,  3,      3, 11,  6,      9,  6,  7,
          7,  6, 11,     9,  7,  0,      0,  7,  1,     11,  1,  7
        ];

        // Append the Neutron vertices - almost the same as neutral endings.
        vertices.push.apply(vertices, [
          1.8155, 1.8155,-1.8155,
          2.9375,      0,-1.1220,
          2.9375,      0, 1.1220,
          1.8155, 1.8155, 1.8155,
         -1.8155, 1.8155,-1.8155,
         -2.9375,      0,-1.1220,
         -2.9375,      0, 1.1220,
         -1.8155, 1.8155, 1.8155
        ]);
        break;
    }


    // Set geometry vertices
    var numVertices = vertices.length / 3;
    this.vertices = [];
    for (var v = 0; v < numVertices; v++) {
      var offset = v * 3;
      var x = vertices[offset] * radius;
      var y = vertices[offset + 1] * radius;
      var z = vertices[offset + 2] * radius;

      var vertice = new THREE.Vector3(x, y, z);
      vertice.index = v;
      this.vertices.push(vertice);
    }

    // Create the faces
    var p = this.vertices;
    this.faces = [];
    for ( var i = 0, j = 0, l = this.indices.length; i < l; i += 3, j ++ ) {

      var v1 = p[this.indices[i]];
      var v2 = p[this.indices[i + 1]];
      var v3 = p[this.indices[i + 2]];

      this.faces[ j ] = new THREE.Face3( v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ] );

    }

    this.type = 'IcoGeometry';
    this.parameters = { radius: radius, detail: detail };
  }

  nucletGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
  nucletGeometry.prototype.constructor = nucletGeometry;

  /**
   * Create the backbone geometry.
   *
   * This geometry was created manually adding protons one at a time using tetrahedrons to position them
   *
   * @param radius
   * @param detail
   */

  function backboneGeometry ( state, radius, detail ) {
    var vertices = [
       1.358,  1.036,      0,
       1.542, -0.950,      0,
      -1.358,  1.036,      0,
      -1.542, -0.950,      0,
       0.990,      0, -1.651,
      -0.990,      0, -1.651,
      -0.990,      0,  1.651,
       0.990,      0,  1.651,
           0,  1.674, -1.291,
           0,  1.674,  1.291,
           0, -1.605,     -1,
           0, -1.605,      1,
       1.919,  1.743,  1.765,
       2.855,  0.172,  0.997,
       2.855,  0.172, -0.997,
       1.919,  1.743, -1.765,
      -1.919,  1.743, -1.765,
      -2.855,  0.172, -0.997,
      -2.855,  0.172,  0.997,
      -1.919,  1.743,  1.765,
       2.850,  1.900,      0,
      -2.850,  1.900,      0
    ];

    this.indices = [
      9,  0,  8,     9,  8,  2,     10,  1, 11,     10, 11,  3,
      8,  0,  4,     1,  4,  0,     10,  4,  1,      4,  5,  8,
     10,  5,  4,     2,  8,  5,      5,  3,  2,     10,  3,  5,
      9,  2,  6,     6,  2,  3,      3, 11,  6,      9,  6,  7,
      7,  6, 11,     9,  7,  0,      0,  7,  1,     11,  1,  7
    ];


    // Set geometry vertices
    var numVertices = vertices.length / 3;
    this.vertices = [];
    for (var v = 0; v < numVertices; v++) {
      var offset = v * 3;
      var x = vertices[offset] * radius;
      var y = vertices[offset + 1] * radius;
      var z = vertices[offset + 2] * radius;

      // When completing the lithium ring, the carbon ring is squeezed and the gap is changed.
      if (state == 'initial') {
        percent = .00;
        if (v == 0 || v == 2) {
          x = x * (1 - percent);
        }
        if (v == 8 || v == 9) {
          z = z * (1 + percent);
        }
      }
      if (state == 'final') {
        percent = .1;
        if (v == 0 || v == 2) {
          x = x * (1 - percent);
        }
        if (v == 8 || v == 9) {
          z = z * (1 + percent);
        }
      }
      var vertice = new THREE.Vector3(x, y, z);
      vertice.index = v;
      this.vertices.push(vertice);
    }

    // Create the faces
    var p = this.vertices;
    this.faces = [];
    for (var i=0, j=0, l=this.indices.length; i < l; i += 3, j++) {

      var v1 = p[this.indices[i]];
      var v2 = p[this.indices[i + 1 ]];
      var v3 = p[this.indices[i + 2 ]];

      this.faces[j] = new THREE.Face3(v1.index, v2.index, v3.index, [v1.clone(), v2.clone(), v3.clone()]);
    }

    this.type = 'BackboneGeometry';
    this.parameters = {radius: radius, detail: detail};
  }

  backboneGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
  backboneGeometry.prototype.constructor = backboneGeometry;

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
      5, 19,  9,     5,  9,  2,     5,  2,  1,   //  1
      14, 13, 18,    14, 18,  9,    14,  9, 19,  //  2
      10, 11, 12,    10, 12, 13,    10, 13, 14,  //  3
      6, 16, 11,     6, 11, 10,     6, 10, 15,   //  4
      0,  6, 15,     0, 15,  5,     0,  5,  1,   //  5
      9, 18,  8,     9,  8,  3,     9,  3,  2,   //  6
      13, 12, 17,    13, 17,  8,    13,  8, 18,  //  7
      17, 12, 11,    17, 11, 16,    17, 16,  7,  //  8
      4,  7, 16,     4, 16,  6,     4,  6,  0,   //  9
      3,  4,  0,     3,  0,  1,     3,  1,  2,   // 10
      8, 17,  7,     8,  7,  4,     8,  4,  3    // 11
    ];

    THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

    this.type = 'DodecahedronGeometry';

    this.parameters = {
      radius: radius,
      detail: detail
    };

    this.azfaces = [
      {'indices': [5, 19, 14, 10, 15], 'faces': [0, 1, 2] },    // 0
      {'indices': [1, 2, 9, 19, 5], 'faces': [3, 4, 5] },       // 1
      {'indices': [9, 18, 13, 14, 19], 'faces': [6, 7, 8] },    // 2
      {'indices': [10, 11, 12, 13, 14], 'faces': [9, 10, 11] }, // 3
      {'indices': [6, 15, 10, 11, 16], 'faces': [12, 13, 14] }, // 4
      {'indices': [0, 1, 5, 15, 6], 'faces': [15, 16, 17] },    // 5
      {'indices': [2, 3, 8, 18, 9], 'faces': [18, 19, 20] },    // 6
      {'indices': [8, 17, 12, 13, 18], 'faces': [21, 22, 23] }, // 7
      {'indices': [7, 16, 11, 12, 17], 'faces': [24, 25, 26] }, // 8
      {'indices': [0, 6, 16, 7, 4], 'faces': [27, 28, 29] },    // 9
      {'indices': [0, 1, 2, 3, 4], 'faces': [30, 31, 32] },     // 10
      {'indices': [3, 4, 7, 17, 8], 'faces': [33, 34, 35] }     // 11
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

    this.type = 'CubeGeometry';

    this.parameters = {
      radius: radius,
      detail: detail
    };

    this.azfaces = [
      {'indices': [0, 1, 2, 3], 'faces': [0, 1] },  // 0
      {'indices': [4, 5, 6, 7], 'faces': [2, 3] },  // 1
      {'indices': [0, 3, 4, 7], 'faces': [4, 5] },  // 2
      {'indices': [1, 6, 5, 2], 'faces': [6, 7] },  // 3
      {'indices': [0, 7, 6, 1], 'faces': [8, 9] },  // 4
      {'indices': [2, 5, 4, 3], 'faces': [10, 11] } // 5
    ];
  }

  cubeGeometry.prototype = Object.create( THREE.PolyhedronGeometry.prototype );
  cubeGeometry.prototype.constructor = cubeGeometry;

  var getGeometry = function (type, state, radius, height, detail) {
    if (savedGeometries[type] && savedGeometries[type][state]) {
      return savedGeometries[type][state];
    }
    var geometry;
    switch (type) {
      case 'nuclet':       geometry = new nucletGeometry(state, radius, detail); break;
      case 'backbone':     geometry = new backboneGeometry(state, radius, detail); break;
      case 'icosahedron':  geometry = new icosahedronGeometry(state, radius, detail); break;
      case 'dodecahedron': geometry = new dodecahedronGeometry(radius, detail); break;
      case 'decahedron':   geometry = createBiPyramid(5, radius, height, detail); break;
      case 'hexahedron':   geometry = new cubeGeometry(radius, detail); break;
      case 'backbone':     geometry = new backboneGeometry(state, radius, detail); break;
    }
    if (!savedGeometries[type]) {
      savedGeometries[type] = {};
    }
    savedGeometries[type][state] = geometry;
    return geometry;
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
