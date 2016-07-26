/**
 * @file - atom_nuclets.js
 *
 * File that generates nuclets  proton, helium, lithium, helium - 1, 4, 7, 11
 */

Drupal.atom_builder.nuclets = {};

Drupal.atom_builder.nucletsC = function () {

  function createAxisLine(scale, vertices) {
    var axisGeometry = new THREE.Geometry();
    axisGeometry.vertices.push(new THREE.Vector3(vertices[0].x, vertices[0].y, vertices[0].z));
    axisGeometry.vertices.push(new THREE.Vector3(vertices[1].x, vertices[1].y, vertices[1].z));
    var lineMaterial = new THREE.LineBasicMaterial({
      color: style.aaxis__color.defaultValue,
      transparent: true,
      opacity: style.aaxis__opacity.defaultValue,
      linewidth: 2
    });
    var axisLine = new THREE.Line(axisGeometry, lineMaterial);
    axisLine.scale.set(scale, scale, scale);
    axisLine.name = 'aaxis';
    return axisLine;
  }

  function createGeometryWireframe(scale, geometry, offset) {
    var wireframe = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: style.awireframe__color.defaultValue,
      transparent: true,
      opacity: style.awireframe__opacity.defaultValue,
      wireframe: true,
      wireframeLinewidth: 10
    }));
    wireframe.scale.set(scale, scale, scale);
    wireframe.init_scale = scale;
    wireframe.name = 'awireframe';
    if (offset) {
      if (offset.x) wireframe.position.x = offset.x;
      if (offset.y) wireframe.position.y = offset.y;
      if (offset.z) wireframe.position.z = offset.z;
      wireframe.init_offset = offset;
    }
    return wireframe;
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

  icosahedronGeometry = function ( radius, detail ) {
      var t = ( 1 + Math.sqrt( 5 ) ) / 2;
      var vertices = [
        - 1,  t,  0,    1,  t,  0,   - 1, - t,  0,    1, - t,  0,
        0, - 1,  t,    0,  1,  t,    0, - 1, - t,    0,  1, - t,
        t,  0, - 1,    t,  0,  1,   - t,  0, - 1,   - t,  0,  1
      ];
      var indices = [
        0, 11,  5,    0,  5,  1,    0,  1,  7,    0,  7, 10,    0, 10, 11,
        1,  5,  9,    5, 11,  4,   11, 10,  2,   10,  7,  6,    7,  1,  8,
        3,  9,  4,    3,  4,  2,    3,  2,  6,    3,  6,  8,    3,  8,  9,
        4,  9,  5,    2,  4, 11,    6,  2, 10,    8,  6,  7,    9,  8,  1
      ];

      THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );
      this.type = 'IcosahedronGeometry';
      this.parameters = {
        radius: radius,
        detail: detail
      };

    /**
    icoLet: {          // Carbon 12
      wireframe: {
        scale: 1.66,
      },
      axis: {
        scale: 2.5
      }
    },
    **/
    };

  createNuclet = function createNuclet (nucletType) {
  }

  return {
    createNuclet: createNuclet
  };
}




