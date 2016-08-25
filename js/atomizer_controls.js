/**
 * @file - atomizercontrols.js
 *
 */

Drupal.atomizer.controlsC = function (_viewer, controlSet) {

  var viewer = _viewer;
  var cameraTrackballControls;
  var objectTrackballControls;
  var mouseMode = 'none';
  var mouse = {x: 10000, y: 10000};
  var styler;
  var styler = document.getElementById('edit-styler');
  var projector;
  var intersected = null;
  var highlightedFace = null;
  var highlightedNuclet = null;

  function changeMode(newMode) {

    switch (mouseMode) {
      case 'camera':
        cameraTrackballControls.dispose();
        delete cameraTrackballControls;
        break;
      case 'atom':
        objectTrackballControls.dispose();
        delete objectTrackballControls;
        break;
      case 'attach':
        viewer.canvasContainer.removeEventListener('mousemove', onDocumentMouseHoverFaces);
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
        objectTrackballControls = createObjectTrackballControls(Drupal.atomizer.octolet);
        break;
      case 'attach':
        viewer.canvasContainer.addEventListener('mousemove', onDocumentMouseHoverFaces, false);
        break;
      case 'none':
        break;
    }
  }

  function controlChanged(event) {
    var args = this.id.split("--");
    if (this.className.indexOf('az-slider') > -1) {
      document.getElementById(args[0] + '--' + args[1] + '--' + args[2] + '--az-value').value = event.target.value;
    } else if (this.className.indexOf('az-control-range') > -1) {
      document.getElementById(this.id + '--az-value').value = event.target.value;
    }
    viewer.style.applyControl(this.id, event.target.value);
  }

  function selectYmlChanged(event) {
    var args = this.id.split("--");
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/loadYml',
      { component: args[0],
        filepath: viewer[args[0]].getYmlDirectory() + '/' + event.target.value },
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

    var form = document.forms['atomizer-controls-form'];
    projector = new THREE.Projector();

    // Add a change listener to each item in the styler select list
    showStylerBlock();
    styler.addEventListener("change", showStylerBlock);

    // Initialize the Mouse Mode radio buttons
    var radios = document.forms["atomizer-controls-form"].elements["mouse--mode"];
    for(var i = 0, max = radios.length; i < max; i++) {
      radios[i].onclick = function (event) {
        changeMode(event.target.value);
      }
    }

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
            document.getElementById(id + '--button').addEventListener("click", buttonClicked);
            break;
          case 'selectyml':
            element.addEventListener("change", selectYmlChanged);
            document.getElementById(id + '--button').addEventListener("click", buttonClicked);
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
  function createObjectTrackballControls(object) {
    var objectTrackballControls = new THREE.TrackballControls(object, viewer.renderer.domElement);
    objectTrackballControls.rotateSpeed = 2.0;
    objectTrackballControls.zoomSpeed = 1.0;
    objectTrackballControls.panSpeed = 3.0;
    objectTrackballControls.noZoom = false;
    objectTrackballControls.noPan = false;
    objectTrackballControls.staticMoving = true;
    // objectTrackballControls.dynamicDampingFactor=0.3;

    objectTrackballControls.keys = [65, 83, 68];
    objectTrackballControls.addEventListener('change', viewer.render);
    return objectTrackballControls;
  }

  function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(viewer.camera);

    var ray = new THREE.Raycaster(viewer.camera.position, vector.sub(viewer.camera.position).normalize());
    var intersects;
    switch (mouseMode) {
      case 'Select Atom':
        intersects = ray.intersectObjects(objects.protons);
        break;
      case 'Select Proton':
        intersects = ray.intersectObjects(objects.protons);
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

  function onDocumentMouseHoverFaces(event) {
    var y;
    var x = event.offsetX || (event.pageX - viewer.canvasContainer.offsetLeft);
    if (event.offsetY) {
      y = event.offsetY || (event.pageY - viewer.canvasContainer.offsetTop);
    } else {
      y = event.layerY + viewer.canvasContainer.offsetTop;
    }

//  var y = event.clientY + event.pageY - viewer.canvasContainer.offsetHeight;
    console.log('mouse  ' + event.clientX + '  ' + event.clientY);
    console.log('layer  ' + event.layerX + '  ' + event.layerY);
    console.log('canvas ' + viewer.canvasContainer.offsetLeft + '  ' + viewer.canvasContainer.offsetHeight);
    console.log('pos    ' + x + '  ' + y);

//  console.log('event ' + event.clientX + '  ' + event.clientY);
    mouse.x =  (x / viewer.canvasWidth) * 2 - 1;
    mouse.y = -(y / viewer.canvasHeight) * 2 + 1;
//  mouse.x =  (event.layerX / viewer.canvasWidth) * 2 + 1;
//  mouse.y = -(event.layerY / viewer.canvasHeight) * 2 + 1;
  }

  function highlightAttachProtons(nuclet, face, color) {
    var p = ['a', 'b', 'c'];
    for (var i in p) {
      var proton = nuclet[face[p[i]]];
      if (color) {
        proton.currentHex = proton.material.color.getHex();
        proton.material.color.setHex(color);
      } else {
        proton.material.color.setHex(proton.currentHex);
      }
    }
  }

  function updateAttach() {
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    vector = vector.unproject(viewer.camera);
    var ray = new THREE.Raycaster(viewer.camera.position, vector.sub(viewer.camera.position).normalize());
    var intersects = ray.intersectObjects(viewer.nuclet.objects.aface);
    if (intersects.length > 0) {
      if (highlightedFace != intersects[0].face) {
        if (highlightedFace) {
          highlightAttachProtons(highlightedNuclet.children, highlightedFace);
        }
        highlightedFace = intersects[0].face;
        highlightedNuclet = intersects[0].object.parent;
        highlightAttachProtons(highlightedNuclet.children, highlightedFace, 0x33aa33);
        viewer.render();
      }
    } else {
      if (highlightedFace) {
        highlightAttachProtons(highlightedNuclet.children, highlightedFace);
        highlightedFace = null;
        viewer.render();
      }
    }
  }

  var init = function init() {
    var cameraControls = createCameraTrackballControls();
    var controls = createControls();
    styler = document.getElementById('edit-styler');
    changeMode(viewer.style.get('mouse--mode'));
  };

  var animate = function animate() {
    requestAnimationFrame(animate);
    if (cameraTrackballControls) {
      cameraTrackballControls.update();
    }
    if (objectTrackballControls) {
      objectTrackballControls.update();
    }
    if (mouseMode == 'attach') {
      updateAttach();
    }
  };

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
      alert('controls - element not found - ' + id);
      return 0;
    }
  };

  return {
    init: init,
    animate: animate,
    getDefault: getDefault
  }
};
