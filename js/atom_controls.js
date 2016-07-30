/**
 * @file - atom_controls.js
 *
 */

Drupal.atom_builder.controlsC = function (_viewer, controlSet) {

  var viewer = _viewer;
  var cameraTrackballControls;
  var atomTrackballControls;
  var mouseMode = 'none';
  var styler = document.getElementById('edit-styler');

  function changeMode(newMode) {

    switch (mouseMode) {
      case 'camera':
        cameraTrackballControls.dispose();
        delete cameraTrackballControls;
        break;
      case 'atom':
        viewer.canvasContainer.removeEventListener('mousedown', onDocumentMouseDown);
        break;
      case 'attach':
        break;
      case 'none':
        break;
    }

    mouseMode = newMode;
    switch (mouseMode) {
      case 'camera':
        cameraTrackballControls = createCameraTrackballControls();
        break;
      case 'atom':
        viewer.canvasContainer.addEventListener('mousedown', onDocumentMouseDown, false);
        break;
      case 'attach':
        atomTrackballControls = createAtomTrackballControls(selectedObject);
        break;
      case 'none':
        break;
    }
  }

  function controlChanged(event) {
    var args = this.id.split("--");
    viewer.style.applyControl(this.id, event.target.value);
  }

  function selectYmlChanged(event) {
    var args = this.id.split("--");
    Drupal.atom_builder.base.doAjax(
      'ajax-ab/loadYml',
      { component: args[0],
        filename: event.target.value },
      viewer[args[0]].loadYml
    );
  }

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
        if (name.length) {
          if (filename.length == 0) {
            filename = name;
          }
          if (filename.indexOf('.yml') == -1) {
            filename += '.yml';
          }
          viewer[args[0]].saveYml({name: name, filename: filename.replace(/[|&;$%@"<>()+,]/g, "").replace(/[ -]/g, '_')});
        }
        break;
      case 'reset':
        viewer[args[0]].reset();
        break;

    }
    return false;
  }

  function showStylerBlock() {
    // Display the currently selected block - hide the rest
    for (var i=0; i < styler.length; i++) {
      document.getElementById('control-' + styler[i].value).style.display = (styler[i].selected) ? 'block' : 'none';
    }

  }

  /**
   * Create the controls in the upper right corner of screen.
   *
   * Uses the dat.gui.js library.
   *
   * @returns {controls|*}
   */
  function createControls() {

    var form = document.forms['atom-builder-controls-form'];

    // Add a change listener to each item in the styler select list
    showStylerBlock();
    styler.addEventListener("change", showStylerBlock);

    // Initialize the Mouse Mode radio buttons
    var radios = document.forms["atom-builder-controls-form"].elements["mouse--mode"];
    for(var i = 0, max = radios.length; i < max; i++) {
      radios[i].onclick = function (event) {
        changeMode(event.target.value);
      }
    }

    // Initialize all the sliders, buttons and color fields in the styler blocks
    for (var controlId in viewer.style.current) {
      var id = controlId.replace(/_/g, "-");
      switch (viewer.style.current[controlId].type) {
        case 'color':
        case 'range':
          document.getElementById(id).addEventListener("input", controlChanged);
          break;
        case 'saveyml':
          document.getElementById(id + '--button').addEventListener("click", buttonClicked);
          break;
        case 'selectyml':
          document.getElementById(id).addEventListener("input", selectYmlChanged);
          document.getElementById(id + '--button').addEventListener("click", buttonClicked);
          break;
        case 'link':
        case 'button':
          document.getElementById(id).addEventListener("click", buttonClicked);
          break;
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
    var cameraTrackballControls = new THREE.TrackballControls(viewer.camera, viewer.renderer.domElement);
    cameraTrackballControls.rotateSpeed = 2.0;
    cameraTrackballControls.zoomSpeed = 1.0;
    cameraTrackballControls.panSpeed = 3.0;
    cameraTrackballControls.noZoom = false;
    cameraTrackballControls.noPan = false;
    cameraTrackballControls.staticMoving = true;
    //  cameraTrackballControls.dynamicDampingFactor=0.3;

    cameraTrackballControls.keys = [65, 83, 68];
    cameraTrackballControls.addEventListener('change', viewer.render);
    return cameraTrackballControls;
  }

  /**
   * Create Trackball controls.
   *
   * @returns {THREE.TrackballControls}
   */
  function createAtomTrackballControls(atom) {
    var atomTrackballControls = new THREE.TrackballControls(atom, viewer.renderer.domElement);
    atomTrackballControls.rotateSpeed = 2.0;
    atomTrackballControls.zoomSpeed = 1.0;
    atomTrackballControls.panSpeed = 3.0;
    atomTrackballControls.noZoom = false;
    atomTrackballControls.noPan = false;
    atomTrackballControls.staticMoving = true;
    //  atomTrackballControls.dynamicDampingFactor=0.3;

    atomTrackballControls.keys = [65, 83, 68];
    atomTrackballControls.addEventListener('change', render);
    return atomTrackballControls;
  }

  function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(viewer.camera);

    var raycaster = new THREE.Raycaster(viewer.camera.position, vector.sub(viewer.camera.position).normalize());
    var intersects;
    switch (mouseMode) {
      case 'Select Atom':
        intersects = raycaster.intersectObjects(objects.protons);
        break;
      case 'Select Proton':
        intersects = raycaster.intersectObjects(objects.protons);
        break;
    }
    if (intersects.length > 0) {
      console.log(intersects[0]);

      switch (mouseMode) {
        case 'Select Atom':
          var parent = intersects[0].object.parent;
          selectedObject = parent;
          for (var key in parent.children) {
            var child = parent.children[key];
            child.material.transparent = true;
            child.material.opacity = 0.4;
          }
          break;
        case 'Select Proton':
          intersects[0].object.material.transparent = true;
          intersects[0].object.material.opacity = 0.4;
          break;
      }
//    render();
    }
  }

  var animate = function animate() {
    requestAnimationFrame(animate);
    if (cameraTrackballControls) {
      cameraTrackballControls.update();
    }
    if (atomTrackballControls) {
      atomTrackballControls.update();
    }
  };

  var cameraControls = createCameraTrackballControls();
  var controls = createControls();
  changeMode('camera');
  return {
    animate: animate
  }
};
