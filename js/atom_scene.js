/**
 * @file - atom_scene.js
 *
 */

Drupal.atom_builder.sceneD = function () {

  var scene;
  var renderer;
  var camera;
  var ambient;

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

  var makeScene = function (style) {
    var canvasContainer = document.getElementById("atom-builder-wrapper");

    // Calculate dimensions of canvas - offsetWidth determines width
    // If offsetHeight is not 0, use it for the height, otherwise make the
    // canvas the same aspect ratio as the browser window.
    var canvasWidth = window.innerWidth - 450;
    var canvasHeight = window.innerHeight / window.innerWidth * canvasWidth;

    // Create and position the scene
    scene = new THREE.Scene();
    scene.position.x = 0;
    scene.position.y = 0;
    scene.position.z = 0;

    // Create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(style.renderer__color.defaultValue, 1.0);
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.shadowEnabled = true;

    // Create camera, and point it at the scene
    camera = new THREE.PerspectiveCamera(style.camera__perspective.defaultValue, canvasWidth / canvasHeight, .1, 10000);
    camera.position.x = style.camera__position.defaultValue[0];
    camera.position.y = style.camera__position.defaultValue[1];
    camera.position.z = style.camera__position.defaultValue[2];
    camera.lookAt(scene.position);

    // Create an ambient light and 2 spotlights
    ambient = new THREE.AmbientLight(style.ambient__color.defaultValue);
    ambient.name = 'ambient';
    scene.add(ambient);

    if (style.spotlight_1__color.defaultValue != "#000000") {
      scene.add(makeSpotLight('spotlight-1', {
        c: style.spotlight_1__color.defaultValue,
        x: style.spotlight_1__position.defaultValue[0],
        y: style.spotlight_1__position.defaultValue[1],
        z: style.spotlight_1__position.defaultValue[2]
      }));
    }
    if (style.spotlight_2__color.defaultValue != "#000000") {
      scene.add(makeSpotLight('spotlight-2', {
        c: style.spotlight_2__color.defaultValue,
        x: style.spotlight_2__position.defaultValue[0],
        y: style.spotlight_2__position.defaultValue[1],
        z: style.spotlight_2__position.defaultValue[2]
      }));
    }
    if (style.spotlight_3__color.defaultValue != "#000000") {
      scene.add(makeSpotLight('spotlight-3', {
        c: style.spotlight_3__color.defaultValue,
        x: style.spotlight_3__position.defaultValue[0],
        y: style.spotlight_3__position.defaultValue[1],
        z: style.spotlight_3__position.defaultValue[2]
      }));
    }

    return scene;
  };

  return {
    makeScene: makeScene,
    getScene: scene
  };
};
