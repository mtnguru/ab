/**
 * @file - az_controls.js
 *
 * Initialize controls.
 * Listen for events and dispense them to the appropriate modules.
 */

// Wrap code in jQuery
(function ($) {
  Drupal.atomizer.controlsC = function (_viewer, controlSet) {

    var viewer = _viewer;
    var cameraTrackballControls;
    var objectTrackballControls;
    var cameraMode = 'none';
    var selectBlock = $('.theme--selectBlock', viewer.context)[0];
    var img = document.createElement('IMG'); // Storage for current image.

    // Variables for detecting items mouse is hovering over.
    var raycaster;
    var mouse = new THREE.Vector2(-1000, -1000);
    var mouseDown = new THREE.Vector2(-1000, -1000);

    /**
     * Change the mouse mode - builder, move camera, none, etc.
     *
     * @NOTE - This function isn't really used - called once with mode atom_builder.
     *
     * @param newMode
     */
    function changeCameraMode(newMode) {

      switch (cameraMode) {
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

      cameraMode = newMode;
      switch (cameraMode) {
        case 'atom_builder':
          cameraTrackballControls = createCameraTrackballControls();
          viewer.canvasContainer.addEventListener('mousemove', onMouseMove, false);
          viewer.canvasContainer.addEventListener('mousedown', onMouseDown, false);
          viewer.canvasContainer.addEventListener('mouseup',   onMouseUp, false);
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
      var id = this.id;
      if (this.className.indexOf('az-slider') > -1) {
        id = id.replace('--az-slider', '');
        $('#' + id + '--az-value', viewer.context)[0].value = event.target.value;
      } else if (this.className.indexOf('az-control-range') > -1) {
        $('#' + id + '--az-value', viewer.context)[0].value = event.target.value;
      }
      viewer.theme.applyControl(id, event.target.value);
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

        case 'snapshot':
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

    /**
     * When a radio button label is clicked, call module with the corresponding input element.
     *
     * @param event
     */
    function onRadioLabelClicked(event) {
      var input =$(this).siblings('input')[0];
      var args = input.id.split("--");
      $(input).prop('checked', true);
      if (viewer[args[0]] && viewer[args[0]].radioClicked) {
        viewer[args[0]].radioClicked($(this).siblings('input')[0]);
      }
    }

    /**
     * When a radio button is clicked, call appropriate module.
     *
     * @param event
     */
    function onRadioClicked(event) {
      var args = this.id.split("--");
      if (viewer[args[0]] && viewer[args[0]].radioClicked) {
        viewer[args[0]].radioClicked(event.target);
      }
    }

    /**
     * Callback to display popup of rendered node.
     *
     * @param response
     */
    function popupDialog(response) {
      for (var i = 0; i < response.length; i++) {
        if (response[i].command == 'renderNodeCommand') {
          var $popup = $('#' + response[i].data.popupId + ' .container', viewer.context);
          if ($popup != null) {
            $popup.html(response[i].htmlContents);
          }
        }
      }
    }

    /**
     * Ajax call to get a rendered node then popup a dialog to show it in.
     *
     * @param event
     */
    function onPopupNode(event) {
      event.preventDefault();
      var nid = $(event.target, viewer.context).data('nid');
      var viewMode = $(event.target, viewer.context).data('viewmode');
      var blockid = $(event.target, viewer.context).data('blockid');
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/renderNode',
        {
          nid: nid,
          viewMode: viewMode,
          popupId: blockid
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
        var element = $('.' + id, viewer.context)[0];
        if (element || control.type == 'rotation' || control.type == 'position') {
          switch (control.type) {
            case 'color':
            case 'range':
            case 'opacity':
            case 'scale':
            case 'rotation':
            case 'position':
              viewer.theme.setInit(control.defaultValue, id, control.type);
              break;
          }
        }
      }
    }

    function showThemeBlock() {
      if (selectBlock) {
        if (!selectBlock.value) {
          selectBlock[0].selected = true;
        }
        showSelectedThemeBlock();
      }
    }

    function showSelectedThemeBlock() {
      // Hide all .control-block's in theme block.
      $('.blocks--theme .control-block', viewer.context).addClass('az-hidden');

      // get value of .theme--selectBlock and move block into theme block.
      var $selectedBlock = $('.blocks--' + selectBlock.value, viewer.context);
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

      initTouch();

      var form = $('.az-controls-form', viewer.context)[0];
      if (!form) return;

      showThemeBlock();
      if (selectBlock) {
        selectBlock.addEventListener("change", function (e) {
          showSelectedThemeBlock($('.blocks--' + e.value, viewer.context));
        });
      }

      // Set up event listeners
      for (var controlId in viewer.atomizer.theme.settings) {
        var control = viewer.atomizer.theme.settings[controlId];
        var id = controlId.replace(/_/g, "-");
        var element = $('.' + id, viewer.context)[0];
        if (element || control.type == 'rotation' || control.type == 'position') {
          switch (control.type) {
            case 'color':
              element.addEventListener("input", onControlChanged);
              break;
            case 'range':
            case 'rotation':
            case 'position':
              var sid = id + '--az-slider';
              $('.' + sid, viewer.context)[0].addEventListener("input", onControlChanged);
              viewer.theme.setInit(control.defaultValue, id, control.type);
              break;
            case 'saveyml':
              var elem = $('.' + id + '--button', viewer.context)[0];
              $('.' + id + '--button', viewer.context)[0].addEventListener("click", onButtonClicked);
              break;
            case 'selectyml':
              element.addEventListener("change", selectYmlChanged);
              break;
            case 'link':
            case 'button':
            case 'toggle':
              element.addEventListener("click", onButtonClicked);
              break;
            case 'radios':
              var $radios = $(element).find('input');
              $radios.click(onRadioClicked);
              $radios.siblings('label').click(onRadioLabelClicked);
              break;
            case 'popup-node':
              element.addEventListener("click", onPopupNode);
              break;
          }
          // Make sure that theme has default values for all controls
        }
      }

      // Block header event handler - close block.
      $('.toggle-block', viewer.context).each(function () {
        var blockName = $(this).data('blockid').split('--')[1];
        var $block = $('#blocks--' + blockName, viewer.context);
        $block.find('.az-block-header').click(function (ev) {
          $block.addClass('az-hidden');
          $('#blocks--buttons #toggle--' + blockName, viewer.context).removeClass('az-selected');
        });
      });

      // Top Button bar event handlers
      $('.toggle-block', viewer.context).click(function(e) {
        var $block = $('.' + $(this).data('blockid'), viewer.context);
        if ($block.hasClass('az-hidden')) {

          if (viewer.context.hasClass('az-overlay-controls') && viewer.context.hasClass('display-mode-desktop')) {
            $('.toggle-block', viewer.context).removeClass('az-selected');
            $('.control-block', viewer.context).each(function () {
              if (this.id != 'blocks--buttons' && this.id != 'blocks--animation--wrapper') {
                $(this).addClass('az-hidden');
              }
            });
          }

          var blockid = $(this).data('blockid');

          // Make the block visible and set the button to selected.
          $block.removeClass('az-hidden');
          $(this).addClass('az-selected');

          // Move selected block to immediately after buttons.
          $block.insertAfter($('.blocks--buttons', viewer.context));

          // If this is the theme block then move selected control block into it.
          if (blockid === 'blocks--theme') {
            showThemeBlock();
          }
        } else {
          $block.addClass('az-hidden');
          $(this).removeClass('az-selected');
        }
      });

      $('#controls--snapshot', viewer.context).click(function () {

        // Play the click sound
        var audio = $(this).find('audio')[0];
        audio.volume = .1;
        audio.play();

        // Save the current size of the canvas
        var width = viewer.canvas.width;
        var height = viewer.canvas.height;

        // Change canvas size to 2560x2560 pixels
        viewer.canvas.width = 2560;
        viewer.canvas.height= 2560;
        viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
        viewer.renderer.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
        viewer.camera.aspect = viewer.canvas.width / viewer.canvas.height;
        viewer.camera.updateProjectionMatrix();
        viewer.render();
//      img = viewer.scene.components.screenshot.getCanvas('perspective').toDataURL('image/jpeg')

        // Create image from canvas
        img = viewer.canvas.toDataURL('image/jpeg');

        // Put canvas back to original size.
        viewer.canvas.width = width;
        viewer.canvas.height = height;
        viewer.renderer.setSize(viewer.canvas.width, viewer.canvas.height);
        viewer.renderer.setViewport(0, 0, viewer.canvas.width, viewer.canvas.height);
        viewer.camera.aspect = viewer.canvas.width / viewer.canvas.height;
        viewer.camera.updateProjectionMatrix();
        viewer.render();

        var filename = viewer.scene.az.name.replace(/ /g, "-");

        // Make ajax call to save it
        Drupal.atomizer.base.doAjax(
          '/ajax-ab/save-image',
          {
            atomNid: viewer.scene.az.atomNid,
            action: 'save-image',
            filename: filename,
            directory: 'atoms',
            overwrite: false,
            sceneName: viewer.scene.az.atomName,
            imgBase64: img
          },
          imageSaved
        );

        function imageSaved(response) {
          var fart = response;
          return;
        }
      });

      return false;
    }

    /**
     * When a touch event happens, simulate an equivalent mouse event.
     *
     * All touch events become mouse events instead - left mouse button only.
     * @param event
     */
    function touchHandler(event) {
      var touches = event.changedTouches,
        first = touches[0],
        type = "";
      switch(event.type)
      {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type = "mousemove"; break;
        case "touchend":   type = "mouseup";   break;
        default:           return;
      }

      var button = 0;
      var x = first.clientX;
      var x1 = viewer.canvas.width * .9;
      if (viewer.canvas.width * .9 < first.clientX) {
        button = 1;
      };

      // initMouseEvent(type, canBubble, cancelable, view, clickCount,
      //                screenX, screenY, clientX, clientY, ctrlKey,
      //                altKey, shiftKey, metaKey, button, relatedTarget);

      var simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, button, null);

      first.target.dispatchEvent(simulatedEvent);
//    event.preventDefault();
    }

    /**
     * Add event handlers to touch events.
     */
    function initTouch()
    {
      document.addEventListener("touchstart", touchHandler, true);
      document.addEventListener("touchmove", touchHandler, true);
      document.addEventListener("touchend", touchHandler, true);
      document.addEventListener("touchcancel", touchHandler, true);
    }
    /**
     * Create Trackball controls.
     *
     * @returns {THREE.TrackballControls}
     */
    function createCameraTrackballControls() {
      var controls = new THREE.OrbitControls(viewer.camera, viewer.renderer.domElement);
      controls.rotateSpeed =   .45;
      controls.zoomSpeed =     .8;
      controls.panSpeed =      .5;
      controls.enableZoom =    true;
      controls.enablePan =     true;
      controls.enableDamping = true;
      controls.dampingFactor=  .3;

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
        return intersectedObjects;
      }
      else {
        return [];
      }
    }

    /**
     * Save the current mouse position - X, Y
     * When the user moves the mouse, if the producer has an intersected handler,
     * then build a list of intersected objects and call the producers intersected handler.
     * @param event
     */
    function onMouseMove(event) {
      mouse.x =  (event.offsetX / viewer.canvas.width) * 2 - 1;
      mouse.y = -(event.offsetY / viewer.canvas.height) * 2 + 1;
      if (viewer.producer.hoverObjects) {
        viewer.producer.hovered(findIntersects(viewer.producer.hoverObjects()));
      }
      viewer.render();
    }

    /**
     * When user clicks mouse button, call the producers mouseDown function if it exists.
     * @param event
     */
    function onMouseDown(event) {
      mouseDown.x =  (event.offsetX / viewer.canvas.width) * 2 - 1;
      mouseDown.y = -(event.offsetY / viewer.canvas.height) * 2 + 1;
      console.log('onMouseDown ' + mouse.x + ' ' + mouse.y);
      if (viewer.producer.mouseDown) {
//      event.preventDefault();
        return viewer.producer.mouseDown(event);
      }
    }

    /**
     * When user clicks mouse button, call the producers mouseUp function if it exists.
     * @param event
     */
    function onMouseUp(event) {
      mouse.x =  (event.offsetX / viewer.canvas.width) * 2 - 1;
      mouse.y = -(event.offsetY / viewer.canvas.height) * 2 + 1;
      var distance = mouse.distanceTo(mouseDown);
      console.log('onMouseUp ' + mouse.x + ' ' + mouse.y + '  ' + distance);

      if (viewer.producer.mouseUp) {
//      event.preventDefault();
        return viewer.producer.mouseUp(event, distance);
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
      var $element = $('.' + id, viewer.context);
      if ($element.length) {
        if ($element.hasClass('az-control-range') ||
            $element.hasClass('az-control-rotation') ||
            $element.hasClass('az-control-position')) {
          if (index) {
            return $('#' + id + '--' + index + '--az-slider', viewer.context)[0].value;
          } else {
            return $('#' + id + '--az-slider', viewer.context)[0].value;
          }
        } else if ($element.hasClass('az-control-radios')) {
          return $('input[name=' + $element.attr('id') + ']:checked', viewer.context).val();
        } else {
          return $element.val();
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
      initializeControls();

      // Set the current camera mode - this could probably go away.
      changeCameraMode('atom_builder');

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
    }
  };
})(jQuery);
