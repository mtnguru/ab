/**
 * @file - atom_object.js
 *
 */

Drupal.atom_builder.object = {};

Drupal.atom_builder.objectD = function () {

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
        scale: 1.66,
      },
      axis: {
        scale: 2.5
      }
    },
  };

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

  return {
    makeObject: makeObject,
  };
};
