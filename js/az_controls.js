/**
 * @file - az_controls.js
 *
 * Initialize controls.
 * Listen for events and dispense them to the appropriate modules.
 */

(function ($) {
  Drupal.atomizer.controlsC = function (_viewer, controlSet) {

    var abc = ['a', 'b', 'c'];

    var viewer = _viewer;
    var constants = Drupal.atomizer.base.constants;
    var cameraTrackballControls;
    var objectTrackballControls;
    var mouseMode = 'none';
    var selectBlock = $('#theme--selectBlock', viewer.context)[0];
    var $popup;

    // Variables for detecting items mouse is hovering over.
    var raycaster;
    var mouse = new THREE.Vector2(-1000, -1000);

    /**
     * Change the mouse mode - builder, move camera, none, etc.
     *
     * @param newMode
     */
    function changeMode(newMode) {

      switch (mouseMode) {
        case 'atom_builder':
          cameraTrackballControls.dispose();
          delete cameraTrackballControls;
          viewer.canvasContainer.removeEventListener('mousemove', onMouseMove);
          break;
        case 'camera':
          cameraTrackballControls.dispose();
          delete cameraTrackballControls;
          break;
        case 'atom':
          objectTrackballControls.dispose();
          delete objectTrackballControls;
          break;
        case 'attach':
          viewer.canvasContainer.removeEventListener('mousemove', onMouseMove);
          break;
        case 'none':
          break;
      }

      mouseMode = newMode;
      switch (mouseMode) {
        case 'atom_builder':
          cameraTrackballControls = createCameraTrackballControls();
          viewer.canvasContainer.addEventListener('mousemove', onMouseMove, false);
          viewer.canvasContainer.addEventListener('mouseup', onMouseClick, false);
          break;
        case 'camera':
          cameraTrackballControls = createCameraTrackballControls();
          break;
        case 'atom':
          objectTrackballControls = createObjectTrackballControls(Drupal.atomizer.octolet);
          break;
        case 'attach':
          viewer.canvasContainer.addEventListener('mousemove', onMouseMove, false);
          break;
        case 'none':
          break;
      }
    }

    /**
     * One of the styling controls has changed, get the value of the control and apply control through the theme module.
     * @param event
     */
    function onControlChanged(event) {
      var args = this.id.split("--");
      if (this.className.indexOf('az-slider') > -1) {
        $('#' + args[0] + '--' + args[1] + '--' + args[2] + '--az-value', viewer.context)[0].value = event.target.value;
      } else if (this.className.indexOf('az-control-range') > -1) {
        $('#' + this.id + '--az-value', viewer.context)[0].value = event.target.value;
      }
      viewer.theme.applyControl(this.id, event.target.value);
    }

    /**
     * A control to select a new yml file has changed - execute the AJAX call to load a new one.
     * @param event
     */
    function selectYmlChanged(event) {
      var args = this.id.split("--");
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadYml',
        { component: args[0],
          filepath: viewer[args[0]].getYmlDirectory() + '/' + event.target.value,
          filename: event.target.value
        },
        viewer[args[0]].loadYml
      );
    }

    /**
     * The user has pressed a button, do something with it.
     *
     * @param event
     * @returns {boolean}
     */
    function onButtonClicked(event) {

      event.preventDefault();
      var args = this.id.split("--");
      switch (args[1]) {
        case 'selectyml':
          viewer[args[0]].overwriteYml();
          break;
        case 'saveyml':
          var wrapper  = $('3' + args[0] + '--saveyml', viewer.context)[0];
          var name = wrapper.querySelector('input[name=name]').value;
          var filename = wrapper.querySelector('input[name=filename]').value;
          // If user didn't enter a file name then generate it from the Name
          if (name.length) {
            if (filename.length == 0) {
              filename = name;
            }
            if (filename.indexOf('.yml') == -1) {
              filename += '.yml';
            }
            // Save the yml file154G
            viewer[args[0]].saveYml({
              name: name,
              filepath: viewer[args[0]].getYmlDirectory() + '/' + filename.replace(/[|&;$%@"<>()+,]/g, "").replace(/[ -]/g, '_')
            });
          }
          break;
        default:
          if (args[0] === 'viewer') {
            viewer.buttonClicked(event.target);
          }
          else {
            if (viewer[args[0]] && viewer[args[0]].buttonClicked) {
              event.preventDefault();
              viewer[args[0]].buttonClicked(event.target);
            }
          }
          break;
      }
      return false;
    }

    function popupDialog(response) {
      if ($popup == null) {
        $html = '<div class="' + + '"></div>';
        var $popup = $('#blocks--popup', viewer.context);
        $html =
          '<div class="az-popup">' +
          '<div class="az-popup-titlebar">' +
          '<div class="az-popup-title">' +
          'Yo Dude' +
          '</div>' +
          '</div>' +
          '<div class="az-popup-content">' +
          'Hey James' +
          '</div>' +
          '</div>';

      }

      // Declare this as a block - it'll have already been rendered then.
      // create a div,
      // place html into it
      // give the div a title area and close button in the upper right.
    }

    function onPopupNode(event) {
      event.preventDefault();
      var nid = $(event.target).data('nid');
      var viewMode = $(event.target).data('viewmode');
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadYml',
        {
          nid: nid,
          viewMode: viewMode,
          popupId: 'popupNode'
        },
        popupDialog
      );
      return;
    }

    /**
     * Display the currently selected block - hide the rest
     */
    function setThemeDefaults() {
      // Initialize all the sliders, buttons and color fields in the selectBlock blocks
      if (!viewer.atomizer.theme) return;
      for (var controlId in viewer.atomizer.theme.settings) {
        var control = viewer.atomizer.theme.settings[controlId];
        var id = controlId.replace(/_/g, "-");
        var element = $('#' + id, viewer.context)[0];
        if (element || control.type == 'rotation' || control.type == 'position') {
          switch (control.type) {
            case 'color':
            case 'range':
              viewer.theme.set(control.defaultValue, id, control.type);
              break;
            case 'rotation':
            case 'position':
              var sid;
              sid = id + '--az-slider';
              viewer.theme.set(control.defaultValue, sid, control.type);
              break;
          }
          // Make sure that theme has default values for all controls
        }
      }
    }

    function showThemeBlock() {
      for (var i=0; i < selectBlock.length; i++) {
        if (selectBlock[i].selected) {
          var blockName = selectBlock[i].id.split('--')[1];
          showSelectedThemeBlock($(blockName));
        }
      }
    }

    function showSelectedThemeBlock($block) {
      // Hide all .control-block's in theme block.
      $('#blocks--theme .control-block').addClass('az-hidden');

      // get value of #theme--selectBlock and move block into theme block.
      var $selectedBlock = $('#blocks--' + selectBlock.value);
      $selectedBlock.insertAfter($(selectBlock));
      $selectedBlock.removeClass('az-hidden');
    }

    /**
     * Initialize controls
     *
     * Set defaults as per the current theme.  Add Event listeners
     *
     * @returns {controls|*}
     */
    function initializeControls() {

      // Extract default values to initialize settings
      setThemeDefaults();

      var form = $('.az-controls-form', viewer.context)[0];
      if (!form) return;

      showThemeBlock();
      selectBlock.addEventListener("change", function(e) {
        showSelectedThemeBlock($('#blocks--' + e.value));
      });

      // Set up event listeners
      for (var controlId in viewer.atomizer.theme.settings) {
        var control = viewer.atomizer.theme.settings[controlId];
        var id = controlId.replace(/_/g, "-");
        var element = $('#' + id, viewer.context)[0];
        if (element || control.type == 'rotation' || control.type == 'position') {
          switch (control.type) {
            case 'color':
            case 'range':
              element.addEventListener("input", onControlChanged);
              break;
            case 'rotation':
            case 'position':
              var sid = id + '--az-slider';
              $('#' + sid, viewer.context)[0].addEventListener("input", onControlChanged);
              viewer.theme.set(control.defaultValue, sid, control.type);
              break;
            case 'saveyml':
              var elem = $('#' + id + '--button', viewer.context)[0];
              $('#' + id + '--button', viewer.context)[0].addEventListener("click", onButtonClicked);
              break;
            case 'selectyml':
              element.addEventListener("change", selectYmlChanged);
              break;
            case 'link':
            case 'button':
            case 'toggle':
              element.addEventListener("click", onButtonClicked);
              break;
            case 'popup-node':
              element.addEventListener("click", onPopupNode);
              break;
          }
          // Make sure that theme has default values for all controls
        }
      }

      // Initialize the theme block select list - move form elements into
      // Initialize toggle-block buttons
      $('.toggle-block').click(function(e) {
        var $block = $('#' + $(this).data('blockid'));
        if ($block.hasClass('az-hidden')) {
          var blockid = $(this).data('blockid');
          $block.removeClass('az-hidden');
          $(this).addClass('az-selected');

          // Move selected block to immediately after buttons.
          $block.insertAfter($('#blocks--buttons'));

          // If this is the theme block then move selected control block into it.
          if (blockid === 'blocks--theme') {
            showThemeBlock();
          }
        } else {
          $block.addClass('az-hidden');
          $(this).removeClass('az-selected');
        }
      });

      return false;
    }

    /**
     * Create Trackball controls.
     *
     * @returns {THREE.TrackballControls}
     */
    function createCameraTrackballControls() {
      var controls = new THREE.OrbitControls(viewer.camera, viewer.renderer.domElement);
      controls.rotateSpeed =   .25;
      controls.zoomSpeed =     .5;
      controls.panSpeed =      .5;
      controls.enableZoom =    true;
      controls.enablePan =     true;
      controls.enableDamping = true;
      controls.dampingFactor=  0.3;

      controls.keys = [65, 83, 68];
      return controls;
    }

    /**
     * Create Trackball controls.
     *
     * @returns {THREE.TrackballControls}
     */
    function createObjectTrackballControls(object) {
      var controls = new THREE.TrackballControls(object, viewer.renderer.domElement);
      controls.rotateSpeed = 2.0;
      controls.zoomSpeed = 1.0;
      controls.panSpeed = 3.0;
      controls.noZoom = false;
      controls.noPan = false;
      controls.staticMoving = true;
      // controls.dynamicDampingFactor=0.3;

      controls.keys = [65, 83, 68];
      controls.addEventListener('change', viewer.render);
      return controls;
    }

    /**
     * Find intersection with mouse and the producers list of intersection objects.
     *
     * @returns {*}
     */
    function findIntersects(objects) {
      if (objects) {
        var vector = new THREE.Vector3(mouse.x, mouse.y, .5);
        vector.unproject(viewer.camera);

        var raycaster = new THREE.Raycaster(viewer.camera.position, vector.sub(viewer.camera.position).normalize());
        viewer.render();
        var intersectedObjects = raycaster.intersectObjects(objects);
        if (intersectedObjects.length) {
          var dude = 1;
        }
        return intersectedObjects;
      }
      else {
        return [];
      }
    }

    /**
     * Save the current mouse position - X, Y
     * When the user moves the mouse, if the producer has a intersected handler,
     * then * build a list of intersected objects and call the producers intersected handler.
     * @param event
     */
    function onMouseMove(event) {
      mouse.x =  (event.offsetX / viewer.canvasWidth) * 2 - 1;
      mouse.y = -(event.offsetY / viewer.canvasHeight) * 2 + 1;
      if (viewer.producer.hoverObjects) {
        viewer.producer.hovered(findIntersects(viewer.producer.hoverObjects()));
      }
      viewer.render();
    }

    /**
     * When user clicks mouse button, call the producers mouseClick function if it exists.
     * @param event
     */
    function onMouseClick(event) {
      mouse.x =  (event.offsetX / viewer.canvasWidth) * 2 - 1;
      mouse.y = -(event.offsetY / viewer.canvasHeight) * 2 + 1;
      if (viewer.producer.mouseClick) {
//    event.preventDefault();
        return viewer.producer.mouseClick(event);
      }
    }

    /**
     * Get the default setting for a control.
     *
     * Used when the current theme does not define a valid default.
     *
     * @param id
     * @param index
     * @returns
     */
    var getDefault = function getDefault(id, index) {
      var element = $('#' + id, viewer.context);
      if (element.length) {
        if (element[0].className.indexOf('az-control-range') > -1 ||
          element[0].className.indexOf('az-control-rotation') > -1 ||
          element[0].className.indexOf('az-control-position') > -1) {
          if (index) {
            return $('#' + id + '--' + index + '--az-slider', viewer.context)[0].value;
          } else {
            return $('#' + id + '--az-slider', viewer.context)[0].value;
          }
        } else {
          return element[0].value;
        }
      } else {
        console.log('atomizer_controls.js - control not found - ' + id);
        return null;
      }
    };

    /**
     * Initialize all controls.
     */
    var init = function init() {
//  cameraTrackballControls = createCameraTrackballControls();
      initializeControls();

      // Set the current mouse mode.
//  changeMode(viewer.theme.get('mouse--mode'));
      changeMode('atom_builder');

      // Set any default values the producer may have.
      if (viewer.producer.setDefaults) viewer.producer.setDefaults();

      // Set up raycaster and projector for selecting objects with mouse.
      raycaster = new THREE.Raycaster();
      raycaster.ray.direction.set(0,-1,0);
      viewer.controls.projector = new THREE.Projector();
    };

    /**
     * Interface to this module.
     */
    return {
      init: init,
      getDefault: getDefault,
      findIntersects: findIntersects,
      cameraTrackballControls: cameraTrackballControls
    }
  };
})(jQuery);
