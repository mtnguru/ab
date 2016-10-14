/**
 * @file - atomizer_controls.js
 *
 * Initialize controls.  Listen for events and deliver them to the appropriate modules.
 */

Drupal.atomizer.controlsC = function (_viewer, controlSet) {

  var abc = ['a', 'b', 'c'];

  var viewer = _viewer;
  var cameraTrackballControls;
  var objectTrackballControls;
  var mouseMode = 'none';
  var styler = document.getElementById('edit-styler');

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
   * One of the styling controls has changed, get the value of the control and apply control through the style module.
   * @param event
   */
  function controlChanged(event) {
    var args = this.id.split("--");
    if (this.className.indexOf('az-slider') > -1) {
      document.getElementById(args[0] + '--' + args[1] + '--' + args[2] + '--az-value').value = event.target.value;
    } else if (this.className.indexOf('az-control-range') > -1) {
      document.getElementById(this.id + '--az-value').value = event.target.value;
    }
    viewer.style.applyControl(this.id, event.target.value);
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
        filepath: viewer[args[0]].getYmlDirectory() + '/' + event.target.value },
      viewer[args[0]].loadYml
    );
  }

  /**
   * The user has pressed a button, do something with it.
   *
   * @param event
   * @returns {boolean}
   */
  function buttonClicked(event) {

    var args = this.id.split("--");
    switch (args[1]) {
      case 'selectyml':
        viewer[args[0]].overwriteYml();
        break;
      case 'saveyml':
        var wrapper  = document.getElementById(args[0] + '--saveyml');
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
          // Save the yml file
          viewer[args[0]].saveYml({name: name, filepath: viewer[args[0]].getYmlDirectory() + '/' + filename.replace(/[|&;$%@"<>()+,]/g, "").replace(/[ -]/g, '_')});
        }
        break;
      case 'reset':
        if (args[0] == 'camera') {
          viewer.style.cameraReset();
        } else {
          viewer[args[0]].reset();
        }
        break;

    }
    return false;
  }

  /**
   * Display the currently selected block - hide the rest
   */
  function showStylerBlock() {
    for (var i=0; i < styler.length; i++) {
      document.getElementById('control-' + styler[i].value).style.display = (styler[i].selected) ? 'block' : 'none';
    }

  }

  /**
   * Initialize controls
   *
   * Set defaults as per the current style.  Add Event listeners
   *
   * @returns {controls|*}
   */
  function initializeControls() {

    var form = document.forms['atomizer-controls-form'];

    // Add a change listener to each item in the styler select list
    showStylerBlock();
    styler.addEventListener("change", showStylerBlock);

    // Initialize the Mouse Mode radio buttons
//  var radios = document.forms["atomizer-controls-form"].elements["mouse--mode"];
//  for(var i = 0, max = radios.length; i < max; i++) {
//    radios[i].onclick = function (event) {
//      changeMode(event.target.value);
//    }
//  }

    // Initialize all the sliders, buttons and color fields in the styler blocks
    for (var controlId in viewer.atomizer.styleSet.styles) {
      var control = viewer.atomizer.styleSet.styles[controlId];
      var id = controlId.replace(/_/g, "-");
      var element = document.getElementById(id);
      if (element || control.type == 'rotation' || control.type == 'position') {
        switch (control.type) {
          case 'color':
            element.addEventListener("input", controlChanged);
            viewer.style.set(control.defaultValue, id, control.type);
            break;
          case 'range':
            element.addEventListener("input", controlChanged);
            viewer.style.set(control.defaultValue, id, control.type);
            break;
          case 'rotation':
          case 'position':
            var sid;
            sid = id + '--az-slider';
            document.getElementById(sid).addEventListener("input", controlChanged);
            viewer.style.set(control.defaultValue, id, control.type);

            sid = id + '--az-slider';
            document.getElementById(sid).addEventListener("input", controlChanged);
            viewer.style.set(control.defaultValue, id, control.type);

            sid = id + '--az-slider';
            document.getElementById(sid).addEventListener("input", controlChanged);
            viewer.style.set(control.defaultValue, id, control.type);
            break;
          case 'saveyml':
            var elem = document.getElementById(id + '--button');
            document.getElementById(id + '--button').addEventListener("click", buttonClicked);
            break;
          case 'selectyml':
            element.addEventListener("change", selectYmlChanged);
//          document.getElementById(id + '--button').addEventListener("click", buttonClicked);
            break;
          case 'link':
          case 'button':
            element.addEventListener("click", buttonClicked);
            break;
        }
        // Make sure that style has default values for all controls
      }
    }

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
//  controls.addEventListener('change', viewer.render);
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
    var vector = new THREE.Vector3(mouse.x, mouse.y, .5);
    vector.unproject(viewer.camera);

    var raycaster = new THREE.Raycaster(viewer.camera.position, vector.sub(viewer.camera.position).normalize());
//  raycaster.setFromCamera( mouse, viewer.camera );
    viewer.render();
    return raycaster.intersectObjects(objects);
  }

  /**
   * Save the current mouse position - X, Y
   * @param event
   */
  function onMouseMove(event) {
    mouse.x =  (event.offsetX / viewer.canvasWidth) * 2 - 1;
    mouse.y = -(event.offsetY / viewer.canvasHeight) * 2 + 1;
    animate();
  }

  /**
   * When user clicks mouse button, call the producers mouseClick function if it exists.
   * @param event
   */
  function onMouseClick(event) {
    mouse.x =  (event.offsetX / viewer.canvasWidth) * 2 - 1;
    mouse.y = -(event.offsetY / viewer.canvasHeight) * 2 + 1;
    if (viewer.producer.mouseClick) {
      event.preventDefault();
      return viewer.producer.mouseClick(event);
    }
  }

  /**
   * When the user moves the mouse, if the producer has a intersected handler,
   * then * build a list of intersected objects and call the producers intersected handler.
   */
  function mouseMove() {
//  if (viewer.producer.intersected) {
//    viewer.producer.intersected(findIntersects(viewer.producer.intersectObjects()));
//  }
  }

  /**
   * Perform animations.
   *
   * @TODO - make this only executed when the mouse has been moved or clicked recently - otherwise deactivate it.
   */
  var animate = function animate() {
//  requestAnimationFrame(animate);
    if (cameraTrackballControls) {
      cameraTrackballControls.update();
    }
    viewer.render();
  };

  /**
   * Get the default setting for a control.
   *
   * Used when the current style does not define a valid default.
   *
   * @param id
   * @param index
   * @returns {*}
   */
  var getDefault = function getDefault(id, index) {
    var element = document.getElementById(id);
    if (element) {
      if (element.className.indexOf('az-control-range') > -1 ||
          element.className.indexOf('az-control-rotation') > -1 ||
          element.className.indexOf('az-control-position') > -1) {
        if (index) {
          return document.getElementById(id + '--' + index + '--az-slider').value;
        } else {
          return document.getElementById(id + '--az-slider').value;
        }
      } else {
        return element.value;
      }
    } else {
      console.log('atomizer_controls.js - default for element not found - ' + id);
      return null;
    }
  };

  /**
   * Initialize all controls.
   */
  var init = function init() {
    cameraTrackballControls = createCameraTrackballControls();
    initializeControls();

    // Find the styler block.  @TODO this needs to be smarter.  Not all controls will have styler blocks
    styler = document.getElementById('edit-styler');

    // Set the current mouse mode.
//  changeMode(viewer.style.get('mouse--mode'));
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
    animate: animate,
    getDefault: getDefault,
    findIntersects: findIntersects
  }
};
