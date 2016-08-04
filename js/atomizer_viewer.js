/**
 * @file - atomizerscene.js
 *
 */

// Initialize namespace for viewer classes in js/producers directory
Drupal.atomizer.producers = {};

Drupal.atomizer.viewerC = function (atomizer) {

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
    viewer.renderer.setClearColor(viewer.style.get('renderer__color'), 1.0);
    viewer.renderer.setSize(canvasWidth, canvasHeight);
    viewer.renderer.shadowEnabled = true;

    // add the output of the renderer to the html element
    viewer.canvasContainer = document.getElementById(viewer.atomizer.atomizerId + '-wrapper');
    viewer.canvasContainer.appendChild(viewer.renderer.domElement);

    // Create camera, and point it at the scene
    viewer.camera = new THREE.PerspectiveCamera(
      viewer.style.get('camera__perspective'),
      canvasWidth / canvasHeight,
      .1, 10000
    );
    viewer.camera.position.x = viewer.style.get('camera__position')[0];
    viewer.camera.position.y = viewer.style.get('camera__position')[1];
    viewer.camera.position.z = viewer.style.get('camera__position')[2];
    viewer.camera.lookAt(viewer.scene.position);

    // Create an ambient light and 2 spotlights
    ambient = new THREE.AmbientLight(viewer.style.get('ambient__color'));
    ambient.name = 'ambient';
    viewer.scene.add(ambient);

    if (viewer.style.get('spotlight_1__color') != "#000000") {
      spotlights[0] = makeSpotLight('spotlight-1', {
        c: viewer.style.get('spotlight_1__color'),
        x: viewer.style.get('spotlight_1__position', 0),
        y: viewer.style.get('spotlight_1__position', 1),
        z: viewer.style.get('spotlight_1__position', 2)
      });
      viewer.scene.add(spotlights[0]);
    }
    if (viewer.style.get('spotlight_2__color') != "#000000") {
      spotlights[1] = makeSpotLight('spotlight-2', {
        c: viewer.style.get('spotlight_2__color'),
        x: viewer.style.get('spotlight_2__position', 0),
        y: viewer.style.get('spotlight_2__position', 1),
        z: viewer.style.get('spotlight_2__position', 2)
      });
      viewer.scene.add(spotlights[1]);
    }
    if (viewer.style.get('spotlight_3__color') != "#000000") {
      spotlights[2] = makeSpotLight('spotlight-3', {
        c: viewer.style.get('spotlight_3__color'),
        x: viewer.style.get('spotlight_3__position', 0),
        y: viewer.style.get('spotlight_3__position', 1),
        z: viewer.style.get('spotlight_3__position', 2)
      });
      viewer.scene.add(spotlights[2]);
    }

    // Make controls
    viewer.controls = Drupal.atomizer.controlsC(viewer);

    // Initialize the ObjectC - doesn't actually create anything.
    viewer.object = Drupal.atomizer.objectC(viewer);

    // Make the back plane
    viewer.scene.add(viewer.object.makeObject('plane',
      {lambert: {color: viewer.style.get('plane__color')}},
      {
        width: viewer.style.get('plane__width'),
        depth: viewer.style.get('plane__depth')
      },
      {
        x: viewer.style.get('plane__position', 0),
        y: viewer.style.get('plane__position', 1),
        z: viewer.style.get('plane__position', 2),
        rotation: {x: -0.5 * Math.PI}
      }
    ));

    // Create the producer for the current view and create it.
    var producerC = Drupal.atomizer.producers[viewer.view.producer + 'C'];
    viewer.producer = producerC(viewer);
    viewer.producer.createView();

    // Render the image
    render();
    // Start any animationj and trackball controls tracking.
    viewer.controls.animate();
  }


  // Attach functions for external use
  viewer.render = render;
  viewer.makeScene = makeScene;
  viewer.atomizer = atomizer;
  viewer.view = atomizer.views[atomizer.defaultView];

  // Initialize the objectC
  viewer.object = Drupal.atomizer.objectC(viewer);

  // Load styles
  viewer.style = Drupal.atomizer.styleC(viewer, makeScene);

  return viewer;
};
