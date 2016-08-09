/**
 * @file - atomizerobject.js
 *
 */

Drupal.atomizer.nucletC = function (_viewer) {

  function setProtonColors() {
    return {
      default: viewer.style.get('proton_default__color'),
      top:     viewer.style.get('proton_top__color'),
      bottom:  viewer.style.get('proton_bottom__color'),
      marker:  viewer.style.get('proton_marker__color'),
    };
  }

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

  function createGeometryWireframe(id, scale, geometry, offset) {

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

  // Derive the nuclet from the object Class
  nuclet = Drupal.atomizer.atomizer_objectC(_viewer);

  // Build the nuclet here

  return nuclet;
};
