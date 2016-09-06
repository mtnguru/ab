/**
 * @file - atomizercontrols.js
 *
 */

Drupal.atomizer.controlsC = function (_viewer, controlSet) {

  var abc = ['a', 'b', 'c'];

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
      case 'builder':
        cameraTrackballControls.dispose();
        delete cameraTrackballControls;
        viewer.canvasContainer.removeEventListener('mousemove', onDocumentMouseHoverFaces);
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
        viewer.canvasContainer.removeEventListener('mousemove', onDocumentMouseHoverFaces);
        break;
      case 'none':
        break;
    }

    mouseMode = newMode;
    switch (mouseMode) {
      case 'builder':
        cameraTrackballControls = createCameraTrackballControls();
        viewer.canvasContainer.addEventListener('mousemove', onDocumentMouseHoverFaces, false);
        viewer.canvasContainer.addEventListener('mousedown', onDocumentMouseDown, false);
        break;
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
        if (args[0] == 'camera') {
          viewer.style.cameraReset();
        } else {
          viewer[args[0]].reset();
        }
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

  function findIntersects(objects) {
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
    vector = vector.unproject(viewer.camera);
    var ray = new THREE.Raycaster(viewer.camera.position, vector.sub(viewer.camera.position).normalize());
    return ray.intersectObjects(objects);
  }

  function onDocumentMouseDown(event) {
    switch (mouseMode) {
      case 'builder':
        if (highlightedFace) {
          viewer.nucleus.addProton(highlightedNuclet, highlightedFace);
        }
        break;
    }
    viewer.render();
  }

  function onDocumentMouseHoverFaces(event) {
    var y;
    var x = event.offsetX || (event.pageX - viewer.canvasContainer.offsetLeft);
    if (event.offsetY) {
      y = event.offsetY || (event.pageY - viewer.canvasContainer.offsetTop);
    } else {
      y = event.layerY + viewer.canvasContainer.offsetTop;
    }

    mouse.x =  (x / viewer.canvasWidth) * 2 - 1;
    mouse.y = -(y / viewer.canvasHeight) * 2 + 1;
  }

  function highlightAttachProtons(protons, face, color) {
    for (var i in abc) {
      var proton = protons[face[abc[i]]];
      if (color) {
        proton.currentHex = proton.material.color.getHex();
        proton.material.color.setHex(color);
      } else {
        proton.material.color.setHex(proton.currentHex);
      }
    }
  }

  function updateAttach() {
    var intersects = findIntersects(viewer.nuclet.objects.selectFace);
    if (intersects.length > 0) {
      if (highlightedFace != intersects[0].face) {
        var face = intersects[0].face;
        face.centroid = new THREE.Vector3( 0, 0, 0 );
        highlightedNuclet = intersects[0].object.parent.parent;
        for (var i in abc) {
          if (highlightedNuclet.protons[face[abc[i]]]) {
            face.centroid.add(highlightedNuclet.protons[face[abc[i]]].position);
          } else {
            return;
          }
        }
        face.centroid.divideScalar( 3 );

        if (highlightedFace) {
          highlightAttachProtons(highlightedNuclet.protons, highlightedFace);
        }

        highlightedFace = face;

        var normal = face.normal;
        var scale = 1.68;
        var scaled_normal = {
          x: normal.x * scale * highlightedNuclet.protonRadius,
          y: normal.y * scale * highlightedNuclet.protonRadius,
          z: normal.z * scale * highlightedNuclet.protonRadius
        };

        var v4 = {
          x: face.centroid.x + scaled_normal.x,
          y: face.centroid.y + scaled_normal.y,
          z: face.centroid.z + scaled_normal.z,
        };
        viewer.view.ghostProton.position.copy(v4);
        highlightedNuclet.children[0].add(viewer.view.ghostProton);


        if (highlightedNuclet.attachFaces[intersects[0].faceIndex].type == 'valence') {
          color = viewer.style.get('proton-vattach--color');
        } else {
          color = viewer.style.get('proton-iattach--color');
        }
        highlightAttachProtons(highlightedNuclet.protons, face, color.replace('#', '0x'));
        viewer.render();
      }
    } else {
      if (highlightedFace) {
        highlightAttachProtons(highlightedNuclet.protons, highlightedFace);
        highlightedFace = null;
        highlightedNuclet.children[0].remove(viewer.view.ghostProton);
        viewer.scene.remove(viewer.view.ghostProton);
        viewer.render();
      }
    }
  }

  function setLocalDefaults() {
    var userNucleusFile = localStorage.getItem('atomizer_builder_nucleus');
    if (userNucleusFile && userNucleusFile != 'undefined') {
      var select = document.getElementById('nucleus--selectyml').querySelector('select');
      select.value = userNucleusFile;
      return;
    }
  }

  var init = function init() {
    cameraTrackballControls = createCameraTrackballControls();
    var controls = createControls();
    styler = document.getElementById('edit-styler');
    changeMode(viewer.style.get('mouse--mode'));
    setLocalDefaults();
  };

  var animate = function animate() {
    requestAnimationFrame(animate);
    if (cameraTrackballControls) {
      cameraTrackballControls.update();
    }
    if (objectTrackballControls) {
      objectTrackballControls.update();
    }
    viewer.render();
    if (mouseMode == 'builder' || mouseMode == 'attach') {
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
