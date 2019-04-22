/**
 * @file - az_viewer.js
 */


// Initialize namespace for viewer classes in js/producers directory

(function ($) {

  Drupal.atomizer.producers = {};

  Drupal.atomizer.viewerC = function (atomizer) {

    var ambient;
    var spotlights = [];
    var viewer = {
      items: {},  // icosafaces, couple other things - need to look into what this is for.,
      objects: {},
      context: $('#azid-' + atomizer.atomizerId.toLowerCase())
    };
    var fullScreen = false;
    var displayMode = ''; // mobile, tablet, desktop

//Physijs.scripts.worker = '/modules/custom/atomizer/js/physijs/physijs_worker.js';
//Physijs.scripts.ammo =   '/modules/custom/atomizer/js/libs/ammo.js';

    viewer.render = function render () {
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
     * Search backward up the parent chaa
     *
     * @param canvasContainer
     */
    function getDataAttr(canvasContainer) {
      var attr = {};
      // Look for a parent with class 'az-atomizer'
      var el = viewer.canvasContainer;
      while ((el = el.parentElement) && !el.classList.contains('az-embed'));
      if (el && el.attributes['data-az']) {
        var value = el.attributes['data-az'].value;
        var pairs = value.split(' ');
        for (var pair in pairs) {
          if (!pairs.hasOwnProperty(pair)) continue;
          var pieces = pairs[pair].split('=');
          attr[pieces[0]] = pieces[1];
        }
      }
      return attr;
    }

    /**
     * Set size of the canvas based on screen size
     */
    function setSize() {
      viewer.context.removeClass('display-mode-mobile');
      viewer.context.removeClass('display-mode-table');
      viewer.context.removeClass('display-mode-desktop');

      var $atomList = $('#az-select-atom', viewer.content);

      // Get container width and calculate new height
      if (fullScreen) {
        viewer.canvas.height = window.innerHeight;
        viewer.canvas.width = window.innerWidth;
      } else {
        var $toolbarHeight = 0;

        var $bar = $('.toolbar-bar');
        if ($bar.length) {
          $toolbarHeight += ($bar.length) ? $bar.height() : 0;
        }

        var $tray = $('.toolbar-tray');
        if ($tray.length && $tray.hasClass('is-active')) {
          $toolbarHeight += ($tray.length) ? $tray.height() : 0;
        }

        if (window.innerWidth < 960) {
          if (displayMode != 'mobile') {
            $atomList.addClass('az-hidden');
          }
          displayMode = 'mobile';
          viewer.context.addClass('display-mode-' + displayMode);
          viewer.canvasContainer.style.width = null;
          viewer.canvas.width = viewer.canvasContainer.clientWidth;
          viewer.canvasContainer.style.width = viewer.canvas.width + 'px';
          viewer.canvas.height = window.innerHeight - 40 - $toolbarHeight;
          viewer.canvasContainer.style.height = viewer.canvas.height + 'px';
//        viewer.canvas.width = viewer.canvasContainer.clientWidth;
        }
        else {
          if (displayMode != 'desktop') {
            $atomList.removeClass('az-hidden');
          }
          displayMode = 'desktop';
          viewer.context.addClass('display-mode-' + displayMode);
          viewer.canvasContainer.style.width = null;
          viewer.canvas.width = viewer.canvasContainer.clientWidth;

          if (!viewer.atomizer.canvasRatio || viewer.atomizer.canvasRatio === 'window') {
            viewer.canvas.height = window.innerHeight - 40 - $toolbarHeight;
          } else {
            viewer.canvas.height = viewer.canvas.width * viewer.atomizer.canvasRatio;
          }
          viewer.canvasContainer.style.height = viewer.canvas.height + 'px';
          // Now that we set the height, set the width again,
          // the page scrollbar changes the container width.
          viewer.canvas.width = viewer.canvasContainer.clientWidth;
        }
      }

      if (viewer.renderer) {
        // Tell the renderer and camera about the new canvas size.
        viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
        if (viewer.renderer.setViewPort) {
          viewer.renderer.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
        }
        viewer.camera.aspect = viewer.canvas.width / viewer.canvas.height;
        viewer.camera.updateProjectionMatrix();
        viewer.render();
      }
    }

    viewer.makeScene = function () {

      // Canvas size is set through CSS.
      // Retrieve canvas dimensions and set renderer size to that.

      viewer.theme.addDataAttr();
      viewer.canvas = viewer.canvasContainer.getElementsByTagName('canvas')[0];

      setSize();

      // Create the producer.
      viewer.producer = Drupal.atomizer.producers[viewer.view.producer + 'C'](viewer);

      // Create and position the scene
      viewer.scene = new THREE.Scene();
//    viewer.scene = new Physijs.Scene();

      // Make controls
      viewer.controls = Drupal.atomizer.controlsC(viewer);

      // Set the camera lookAt
      viewer.scene.position.set(
          viewer.theme.get('camera--focus', 'x'),
          viewer.theme.get('camera--focus', 'y'),
          viewer.theme.get('camera--focus', 'z')
      );

      // Create the renderer
      switch (viewer.atomizer.renderer) {

        case 'webgl':
          viewer.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: viewer.canvas,
            preserveDrawingBuffer: true,
            shadowEnabled: true
          });
          viewer.renderer.setClearColor(viewer.theme.get('renderer--color'), 1.0);
          viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
          // Create camera, and point it at the scene
          viewer.camera = new THREE.PerspectiveCamera(
              viewer.theme.get('camera--perspective'),
              viewer.canvas.width / viewer.canvas.height,
              .1, 10000
          );
          break;

        case 'css2d':
          break;
        case 'css3d':
          viewer.renderer = new THREE.CSS3DRenderer({ });
          viewer.CSS2DRenderer({
            antialias: true,
//          canvas: viewer.canvas,
            preserveDrawingBuffer: true,
//          shadowEnabled: true
          });

          viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
          viewer.canvasContainer.appendChild(viewer.renderer.domElement);

          // Create camera, and point it at the scene
          viewer.camera = new THREE.PerspectiveCamera(
              viewer.theme.get('camera--perspective'),
              viewer.canvas.width / viewer.canvas.height,
              .1, 10000
          );
          break;
      }
//    viewer.renderer.shadowEnabled = true;


      // add the output of the renderer to the html element

      window.addEventListener('resize', setSize);

      zoom = (viewer.dataAttr['zoom']) ? viewer.dataAttr['zoom'] : 1;
      viewer.camera.position.set(
        zoom * viewer.theme.get('camera--position', 'x'),
        zoom * viewer.theme.get('camera--position', 'y'),
        zoom * viewer.theme.get('camera--position', 'z')
      );
      viewer.camera.lookAt(viewer.scene.position);

      // Add the trackball and page controls
      viewer.controls.init();

      // Create an ambient light and 3 spotlights
      ambient = new THREE.AmbientLight(viewer.theme.get('ambient--color'));
      ambient.name = 'ambient';
      viewer.scene.add(ambient);

      for (var i = 1; i < 4; i++) {
        spotlights[i] = makeSpotLight('spotlight-' + i, {
          c: viewer.theme.get('spotlight-' + i + '--color'),
          x: viewer.theme.get('spotlight-' + i + '--position', 'x'),
          y: viewer.theme.get('spotlight-' + i + '--position', 'y'),
          z: viewer.theme.get('spotlight-' + i + '--position', 'z')
        });
        viewer.scene.add(spotlights[i]);
      }

      // Make the back plane
      var color = viewer.theme.get('plane--color');
      viewer.scene.add(Drupal.atomizer.base.makeObject('plane',
        {
          lambert: {
            color: viewer.theme.get('plane--color'),
            opacity: viewer.theme.get('plane--opacity'),
            transparent: true
          }
        },
        {
          width: viewer.theme.get('plane--width'),
          depth: viewer.theme.get('plane--depth')
        },
        {
          x: viewer.theme.get('plane--position', 'x'),
          y: viewer.theme.get('plane--position', 'y'),
          z: viewer.theme.get('plane--position', 'z'),
          rotation: {x: -0.5 * Math.PI}
        }
      ));

      // Render the initial scene
      viewer.producer.createView();
      viewer.render();
    };


    viewer.context.hover(function () {
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
          screenfull.toggle(viewer.context[0]);
          if (fullScreen) {
            viewer.context.addClass('az-fullscreen');
          }
          else {
            viewer.context.removeClass('az-fullscreen');
          }
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

    viewer.context.dblclick(function () {
      if (fullScreen) {
        fullScreen = false;
        viewer.context.removeClass('az-fullscreen');
        screenfull.exit();
      }
    });

    Drupal.behaviors.atomizer_viewer = {
      // Attach functions are executed by Drupal upon page load or ajax loads.
      attach: function (context, settings) {
        var $dialogs = $('.az-dialog', viewer.context);
        $dialogs.each(function ($dialog) {
          if (!$(this).hasClass('az-dialog-processed')) {
            $(this).addClass('az-dialog-processed');
//          viewer.context.append($(this));
          }
        });
      }
    };

    viewer.buttonClicked = function buttonClicked (event) {
      if (event.target.id === 'viewer--fullScreen') {
        fullScreen = !fullScreen;
        if (fullScreen) {
          screenfull.request(viewer.context[0]);
          viewer.context.addClass('az-fullscreen');
        }
        else {
          screenfull.exit();
          viewer.context.removeClass('az-fullscreen');
        }
      }
    };

    viewer.deleteObject = (key) => {
      let object = viewer.objects[key];
      if (object) {
        viewer.scene.remove(object);
        viewer[object.name].deleteObject(object);
        delete(viewer.objects[object.az.id]);
      }
      else {
        console.log(`Could not delete object - not found: ${key}`);
      }
    }

    viewer.addObject = (object) => {
      let numObjects = Object.keys(viewer.objects).length;
      object.az.id = `${object.az.conf.type}-${numObjects}`;
      viewer.objects[object.az.id] = object;
      viewer.scene.add(object);
    };

    viewer.clearScene = function clearScene () {
      for (let key in viewer.objects) {
        viewer.deleteObject(key);
      }
    };

    // Attach functions for external access/api
    viewer.getObject = (name) => viewer.objects[name];
    viewer.getDisplayMode = function() { return displayMode };
    viewer.atomizer = atomizer;
    viewer.view = atomizer.views[atomizer.defaultView];

    viewer.canvasContainer = $('.az-canvas-wrapper', viewer.context)[0];
    viewer.dataAttr = getDataAttr(viewer.canvasContainer);

    if (viewer.dataAttr['theme']) {
      viewer.atomizer.views[viewer.atomizer.defaultView].defaultTheme = viewer.dataAttr['theme'];
    }

    viewer.theme = Drupal.atomizer.themeC(viewer, viewer.makeScene);

    return viewer;
  };

})(jQuery);
