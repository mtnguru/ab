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

  Physijs.scripts.worker = '/modules/custom/atomizer/js/physijs/physijs_worker.js';
  Physijs.scripts.ammo =   '/modules/custom/atomizer/js/libs/ammo.js';

  var render = function render () {
//  viewer.scene.simulate();
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
//  var canvasWidth = window.innerWidth - 422;
    viewer.canvasWidth = window.innerWidth - 273;
    viewer.canvasHeight = window.innerHeight / window.innerWidth * viewer.canvasWidth;

    // Create the producer for the current view and create it.
    viewer.producer = Drupal.atomizer.producers[viewer.view.producer + 'C'](viewer);

    // Create and position the scene
//  viewer.scene = new THREE.Scene();
    viewer.scene = new Physijs.Scene();
    viewer.scene.position.x = 0;
    viewer.scene.position.y = 0;
    viewer.scene.position.z = 0;

    // Make controls
    viewer.controls = Drupal.atomizer.controlsC(viewer);

    // Create the renderer
    viewer.renderer = new THREE.WebGLRenderer({ antialias: true});
    viewer.renderer.setClearColor(viewer.style.get('renderer--color'), 1.0);
    viewer.renderer.setSize(viewer.canvasWidth, viewer.canvasHeight);
    viewer.renderer.shadowEnabled = true;

    // add the output of the renderer to the html element
    viewer.canvasContainer = document.getElementById(viewer.atomizer.atomizerId + '-wrapper');
    viewer.canvasContainer.appendChild(viewer.renderer.domElement);

    // Create camera, and point it at the scene
    viewer.camera = new THREE.PerspectiveCamera(
      viewer.style.get('camera--perspective'),
      viewer.canvasWidth / viewer.canvasHeight,
      .1, 10000
    );
    viewer.camera.position.x = viewer.style.get('camera--position', 'x');
    viewer.camera.position.y = viewer.style.get('camera--position', 'y');
    viewer.camera.position.z = viewer.style.get('camera--position', 'z');
    viewer.camera.lookAt(viewer.scene.position);

    // Add the trackball and page controls
    viewer.controls.init();

    // Create an ambient light and 2 spotlights
    ambient = new THREE.AmbientLight(viewer.style.get('ambient--color'));
    ambient.name = 'ambient';
    viewer.scene.add(ambient);

    for (var i = 1; i < 3; i++) {
      spotlights[i] = makeSpotLight('spotlight-' + i, {
        c: viewer.style.get('spotlight-' + i + '--color'),
        x: viewer.style.get('spotlight-' + i + '--position', 'x'),
        y: viewer.style.get('spotlight-' + i + '--position', 'y'),
        z: viewer.style.get('spotlight-' + i + '--position', 'z')
      });
      viewer.scene.add(spotlights[i]);
    }

    // Initialize the ObjectC - doesn't actually create anything.
    viewer.nuclet = Drupal.atomizer.nucletC(viewer);
    viewer.shapes = Drupal.atomizer.shapesC(viewer);
    viewer.sprites = Drupal.atomizer.spritesC(viewer);

    // Make the back plane
    var color = viewer.style.get('plane--color');
    viewer.scene.add(viewer.nuclet.makeObject('plane',
      {lambert: {color: viewer.style.get('plane--color')}},
      {
        width: viewer.style.get('plane--width'),
        depth: viewer.style.get('plane--depth')
      },
      {
        x: viewer.style.get('plane--position', 'x'),
        y: viewer.style.get('plane--position', 'y'),
        z: viewer.style.get('plane--position', 'z'),
        rotation: {x: -0.5 * Math.PI}
      }
    ));

    viewer.producer.createView();

    // Render the initial image
    render();
//  viewer.controls.animate();
  }

  // Attach functions for external use
  viewer.render = render;
  viewer.makeScene = makeScene;
  viewer.atomizer = atomizer;
  viewer.view = atomizer.views[atomizer.defaultView];

  // Load styles
  viewer.style = Drupal.atomizer.styleC(viewer, makeScene);

  return viewer;
};
