/**
 * @file - atomizerscene.js
 *
 */


// Initialize namespace for viewer classes in js/producers directory

(function ($) {

  Drupal.atomizer.producers = {};

  Drupal.atomizer.viewerC = function (atomizer) {

    var ambient;
    var spotlights = [];
    var viewer = {};
    var fullScreen = false;
    var $wrapper = $('#az-wrapper-' + atomizer.atomizerId.toLowerCase());

//Physijs.scripts.worker = '/modules/custom/atomizer/js/physijs/physijs_worker.js';
//Physijs.scripts.ammo =   '/modules/custom/atomizer/js/libs/ammo.js';

    var render = function render () {
//  viewer.scene.simulate();
      viewer.renderer.render(viewer.scene, viewer.camera);
    };

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

    /**
     * Search backward up the parent chain and extract an data-az attributes.
     *
     * @param canvasContainer
     */
    function getDataAttr(canvasContainer) {
      var attr = {};
      // Look for a parent with class 'az-atomizer'
      var el = canvasContainer;
      while ((el = el.parentElement) && !el.classList.contains('az-atomizer'));
      if (el) {
        var value = el.children[0].attributes['data-az'].value;
        var pairs = value.split(' ');
        for (var pair in pairs) {
          if (!pairs.hasOwnProperty(pair)) continue;
          var pieces = pairs[pair].split('-');
          attr[pieces[0]] = pieces[1];
        }
      }
      return attr;
    }

    var makeScene = function () {

      // Canvas size is set through CSS.
      // Retrieve canvas dimensions and set renderer size to that.

      var containerId = viewer.atomizer.atomizerId.replace(/[ _]/g, '-').toLowerCase() + '-canvas-wrapper';
      viewer.canvasContainer = document.getElementById(containerId);
      viewer.dataAttr = getDataAttr(viewer.canvasContainer);
      viewer.canvas = viewer.canvasContainer.getElementsByTagName('canvas')[0];
      viewer.canvasWidth = viewer.canvasContainer.clientWidth;
      if (!viewer.atomizer.canvasRatio || viewer.atomizer.canvasRatio === 'window') {
        var windowRatio = window.innerHeight / window.innerWidth;
        viewer.canvasHeight = viewer.canvasWidth * windowRatio;
      } else {
        viewer.canvasHeight = viewer.canvasWidth * viewer.atomizer.canvasRatio;
      }
      viewer.canvas.height = viewer.canvasHeight;

      // Create the producer.
      viewer.producer = Drupal.atomizer.producers[viewer.view.producer + 'C'](viewer);

      // Create and position the scene
      viewer.scene = new THREE.Scene();
//  viewer.scene = new Physijs.Scene();
      viewer.scene.position.set(0,0,0);

      // Make controls
      viewer.controls = Drupal.atomizer.controlsC(viewer);

      // Create the renderer
      var parameters = {
        antialias: true,
        canvas: viewer.canvas
      };
      viewer.renderer = new THREE.WebGLRenderer(parameters);
      viewer.renderer.setClearColor(viewer.style.get('renderer--color'), 1.0);
      viewer.renderer.setSize(viewer.canvasWidth, viewer.canvasHeight);
      viewer.renderer.shadowEnabled = true;

      // add the output of the renderer to the html element
      viewer.canvasContainer.appendChild(viewer.renderer.domElement);

      window.addEventListener('resize', function () {
        // Get container width and calculate new height
        viewer.canvasWidth  = viewer.canvasContainer.clientWidth;
        if (!viewer.atomizer.canvasRatio || viewer.atomizer.canvasRatio === 'window') {
          var windowRatio = window.innerHeight / window.innerWidth;
          viewer.canvasHeight = viewer.canvasWidth * windowRatio;
        } else {
          viewer.canvasHeight = viewer.canvasWidth * viewer.atomizer.canvasRatio;
        }
        viewer.canvas.width = viewer.canvasWidth;
        viewer.canvas.height = viewer.canvasHeight;

        // Tell the renderer and camera about the new canvas size.
        viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
        viewer.renderer.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
        viewer.camera.aspect = viewer.canvas.width / viewer.canvas.height;
        viewer.camera.updateProjectionMatrix();
        viewer.render();
      });
      // Create camera, and point it at the scene
      viewer.camera = new THREE.PerspectiveCamera(
        viewer.style.get('camera--perspective'),
        viewer.canvasWidth / viewer.canvasHeight,
        .1, 10000
      );
      zoom = (viewer.dataAttr['zoom']) ? viewer.dataAttr['zoom'] : 1;
      viewer.camera.position.set(
        zoom * viewer.style.get('camera--position', 'x'),
        zoom * viewer.style.get('camera--position', 'y'),
        zoom * viewer.style.get('camera--position', 'z')
      );
      viewer.camera.lookAt(viewer.scene.position);

      // Add the trackball and page controls
      viewer.controls.init();

      // Create an ambient light and 3 spotlights
      ambient = new THREE.AmbientLight(viewer.style.get('ambient--color'));
      ambient.name = 'ambient';
      viewer.scene.add(ambient);

      for (var i = 1; i < 4; i++) {
        spotlights[i] = makeSpotLight('spotlight-' + i, {
          c: viewer.style.get('spotlight-' + i + '--color'),
          x: viewer.style.get('spotlight-' + i + '--position', 'x'),
          y: viewer.style.get('spotlight-' + i + '--position', 'y'),
          z: viewer.style.get('spotlight-' + i + '--position', 'z')
        });
        viewer.scene.add(spotlights[i]);
      }

      // Initialize the nuclet, shapes, and sprites modules
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
    };


    $wrapper.hover(function () {
      var x = window.scrollX;
      var y = window.scrollY;
      this.focus();
      window.scrollTo(x, y);
    }, function () {
      this.blur();
    }).keyup(function (event) {
      switch (event.keyCode) {
        case 70: // F
          fullScreen = !fullScreen;
          screenfull.toggle($wrapper[0]);
          event.preventDefault();
          break;

//    case 88: // X
//    case 27: // escape
//      if (localStorage.imagerFullScreen === 'TRUE') {
//        screenfull.exit();
//      }
//      else {
//      }
//      event.preventDefault();
//      break;
      }
    });

    $wrapper.dblclick(function () {
      if (fullScreen) {
        fullScreen = false;
        screenfull.exit();
      }
    });

    Drupal.behaviors.atomizer_viewer = {
      // Attach functions are executed by Drupal upon page load or ajax loads.
      attach: function (context, settings) {
        var $dialogs = $('.az-dialog');
        $dialogs.each(function ($dialog) {
          if (!$(this).hasClass('az-dialog-processed')) {
            $(this).addClass('az-dialog-processed');
//          $wrapper.append($(this));
          }
        });
      }
    };

    viewer.buttonClicked = function buttonClicked (target) {
      if (target.id === 'viewer--fullScreen') {
        fullScreen = !fullScreen;
        if (fullScreen) {
          screenfull.request($wrapper[0]);
        }
        else {
          screenfull.exit();
        }
      }
    };

    // Attach functions for external use
    viewer.render = render;
    viewer.makeScene = makeScene;
    viewer.atomizer = atomizer;
    viewer.view = atomizer.views[atomizer.defaultView];

    // Load styles
    viewer.style = Drupal.atomizer.styleC(viewer, makeScene);

    return viewer;
  };

})(jQuery);
