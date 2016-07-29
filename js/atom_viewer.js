/**
 * @file - atom_scene.js
 *
 */

Drupal.atom_builder.viewerC = function (view) {

  var ambient;
  var spotlights = [];
  var viewer = {};

  var render = function render () {
    viewer.renderer.render(viewer.scene, viewer.camera);
  }
  /**
   * Create a spotlight.
   *
   * @param v
   * @returns {THREE.SpotLight}
   */
  function makeSpotLight(name, v) {
    var spotLight = new THREE.SpotLight(v.c);
    spotLight.position.set(v.x || -40, v.y || 60, v.z || -10);
    spotLight.castShadow = true;
    spotLight.name = name;
    return spotLight;
  }

  var makeScene = function () {

    // Calculate dimensions of canvas - offsetWidth determines width
    // If offsetHeight is not 0, use it for the height, otherwise make the
    // canvas the same aspect ratio as the browser window.
    var canvasWidth = window.innerWidth - 450;
    var canvasHeight = window.innerHeight / window.innerWidth * canvasWidth;

    // Create and position the scene
    viewer.scene = new THREE.Scene();
    viewer.scene.position.x = 0;
    viewer.scene.position.y = 0;
    viewer.scene.position.z = 0;

    // Create the renderer
    viewer.renderer = new THREE.WebGLRenderer();
    viewer.renderer.setClearColor(viewer.style.current.renderer__color.defaultValue, 1.0);
    viewer.renderer.setSize(canvasWidth, canvasHeight);
    viewer.renderer.shadowEnabled = true;

    // add the output of the renderer to the html element
    viewer.canvasContainer = document.getElementById("atom-builder-wrapper");
    viewer.canvasContainer.appendChild(viewer.renderer.domElement);

    // Create camera, and point it at the scene
    viewer.camera = new THREE.PerspectiveCamera(
      viewer.style.current.camera__perspective.defaultValue,
      canvasWidth / canvasHeight,
      .1, 10000
    );
    viewer.camera.position.x = viewer.style.current.camera__position.defaultValue[0];
    viewer.camera.position.y = viewer.style.current.camera__position.defaultValue[1];
    viewer.camera.position.z = viewer.style.current.camera__position.defaultValue[2];
    viewer.camera.lookAt(viewer.scene.position);

    // Create an ambient light and 2 spotlights
    ambient = new THREE.AmbientLight(viewer.style.current.ambient__color.defaultValue);
    ambient.name = 'ambient';
    viewer.scene.add(ambient);

    if (viewer.style.current.spotlight_1__color.defaultValue != "#000000") {
      spotlights[0] = makeSpotLight('spotlight-1', {
        c: viewer.style.current.spotlight_1__color.defaultValue,
        x: viewer.style.current.spotlight_1__position.defaultValue[0],
        y: viewer.style.current.spotlight_1__position.defaultValue[1],
        z: viewer.style.current.spotlight_1__position.defaultValue[2]
      });
      viewer.scene.add(spotlights[0]);
    }
    if (viewer.style.current.spotlight_2__color.defaultValue != "#000000") {
      spotlights[1] = makeSpotLight('spotlight-2', {
        c: viewer.style.current.spotlight_2__color.defaultValue,
        x: viewer.style.current.spotlight_2__position.defaultValue[0],
        y: viewer.style.current.spotlight_2__position.defaultValue[1],
        z: viewer.style.current.spotlight_2__position.defaultValue[2]
      });
      viewer.scene.add(spotlights[1]);
    }
    if (viewer.style.current.spotlight_3__color.defaultValue != "#000000") {
      spotlights[2] = makeSpotLight('spotlight-3', {
        c: viewer.style.current.spotlight_3__color.defaultValue,
        x: viewer.style.current.spotlight_3__position.defaultValue[0],
        y: viewer.style.current.spotlight_3__position.defaultValue[1],
        z: viewer.style.current.spotlight_3__position.defaultValue[2]
      });
      viewer.scene.add(spotlights[2]);
    }
  }


  // End of functions, start code for ViewerC initialization

  viewer.render = render;
  viewer.style = Drupal.atom_builder.styleC(viewer, view.styleSet);
  makeScene();
  viewer.controls = Drupal.atom_builder.controlsC(viewer, view.controlSet);

  viewer.object = Drupal.atom_builder.objectC(viewer);
  viewer.scene.add(viewer.object.makeObject('plane',
    {lambert: {color: viewer.style.current.plane__color.defaultValue}},
    {
      width: viewer.style.current.plane__width.defaultValue,
      depth: viewer.style.current.plane__depth.defaultValue
    },
    {
      x: viewer.style.current.plane__position.defaultValue[0],
      y: viewer.style.current.plane__position.defaultValue[1],
      z: viewer.style.current.plane__position.defaultValue[2],
      rotation: {x: -0.5 * Math.PI}
    }
  ));

  viewer.object.addAtoms();

  render();
  viewer.controls.animate();

  return viewer;
};
