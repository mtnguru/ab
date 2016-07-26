/**
 * @file - atom_controls.js
 *
 */

Drupal.atom_builder.controls = {};

Drupal.atom_builder.controlsC = function () {
  function changeMode(newMode) {

    switch (mouseMode) {
      case 'camera':
        cameraTrackballControls.dispose();
        delete cameraTrackballControls;
        break;
      case 'atom':
        canvasContainer.removeEventListener('mousedown', onDocumentMouseDown);
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
        canvasContainer.addEventListener('mousedown', onDocumentMouseDown, false);
        break;
      case 'attach':
        atomTrackballControls = createAtomTrackballControls(selectedObject);
        break;
      case 'none':
        break;
    }
    render();

    return;
  }

  /**
   * Apply controls effecting all atoms from the panel in the upper right corner.
   *
   * @param name
   * @param value
   * @param prop
   */
  function listenSliderChange(id, prop) {
    document.getElementById(id).onchange(function (event) {
      if (mouseMode == 'Rotate Selection') {
        var radians = value / 360 * 2 * Math.PI;
        selectedObject.rotation[prop] = radians + (selectedObject.rotation['init_' + prop] || 0);
      } else {
        scene.traverse(function (node) {
          switch (name) {
            case 'rotation':
              if (nucletNames.indexOf(node.name) > -1) {
                var radians = value / 360 * 2 * Math.PI;
                node.rotation[prop] = radians + (node.rotation['init_' + prop] || 0);
              }
              break;
            case 'scaleProtons':
              if (node.name == 'proton') {
                node.scale.set(value, value, value);
              }
              break;
            case 'scaleGeometry':
              if (node.name == 'geometry') {
                var scale = (node.init_scale) ? value * node.init_scale : value;
                node.scale.set(scale, scale, scale);
              }
              break;
            case 'opacityPlane':
              if (node.name == 'plane') {
                node.material.opacity = value
                node.material.visible = (value > .01);
              }
              break;
            case 'opacityProtons':
              if (node.name == 'proton') {
                node.material.opacity = value
                node.material.visible = (value > .01);
              }
              break;
            case 'opacityGeometry':
              if (node.name == 'geometry') {
                node.material.opacity = value;
                node.material.visible = (value > .05);
              }
              break;
            case 'opacityAxis':
              if (node.name == 'axis') {
                node.material.opacity = value;
                node.material.visible = (value > .05);
              }
              break;
            case 'opacityValence':
              if (node.name == 'valence') {
                node.material.opacity = value;
                node.material.visible = (value > .05);
              }
              break;
          }
        });
      }
      render();
    });
  };

  function controlChanged(event) {
    var args = this.id.split("--");
    var argNames = args[0].split("-");
    var value = event.target.value;
    switch (argNames[0]) {
      case "renderer":
        renderer.setClearColor(new THREE.Color(parseInt(value.replace(/^#/, ''), 16)), 1);
        break;
      case "camera":
        if (args[1] == 'perspective') {
          camera.fov = value;
          camera.updateProjectionMatrix();
        }
        break;
      default:
        scene.traverse(function (node) {
          var nodeNames = node.name.split("-");
          var ok = false;
          if (argNames.length == 2) {
            if (args[0] == node.name) {
              ok = true;
            }
          } else if (nodeNames[0] == argNames[0]) {
            ok = true;
          }
          if (ok) {
            switch (args[1]) {
              case 'rotation':
                if (nucletNames.indexOf(node.name) > -1) {
                  var radians = value / 360 * 2 * Math.PI;
                  node.rotation[prop] = radians + (node.rotation['init_' + prop] || 0);
                }
                break;
              case 'scale':
                var scale = (node.init_scale) ? value * node.init_scale : value;
                node.scale.set(scale, scale, scale);
                break;
              case 'opacity':
                node.material.opacity = value;
                node.material.visible = (value > .02);
                break;
              case 'linewidth':
                if (argNames[0] == 'awireframe') {
                  node.material.wireframeLinewidth = value;
                } else {
                  node.material.linewidth = value;
                }
                break;
              case 'color':
                if (argNames[0] == 'spotlight' || argNames[0] == 'ambient') {
                  node.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                } else {
                  node.material.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                }
                break;
            }
          }
        });
        break;
    }
    render();
    return;
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
  function initControls() {

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
    for (var controlId in style) {
      var id = controlId.replace(/_/g, "-");
      switch (style[controlId].type) {
        case 'range':
          document.getElementById(id).addEventListener("input", controlChanged);
          break;
        case 'color':
          document.getElementById(id).addEventListener("input", controlChanged);
          break;
      }
    }

    return;
  }

  /**
   * Create Trackball controls.
   *
   * @returns {THREE.TrackballControls}
   */
  function createCameraTrackballControls() {
    var cameraTrackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    cameraTrackballControls.rotateSpeed = 2.0;
    cameraTrackballControls.zoomSpeed = 1.0;
    cameraTrackballControls.panSpeed = 3.0;
    cameraTrackballControls.noZoom = false;
    cameraTrackballControls.noPan = false;
    cameraTrackballControls.staticMoving = true;
    //  cameraTrackballControls.dynamicDampingFactor=0.3;

    cameraTrackballControls.keys = [65, 83, 68];
    cameraTrackballControls.addEventListener('change', render);
    return cameraTrackballControls;
  }

  /**
   * Create Trackball controls.
   *
   * @returns {THREE.TrackballControls}
   */
  function createAtomTrackballControls(atom) {
    var atomTrackballControls = new THREE.TrackballControls(atom, renderer.domElement);
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
    vector = vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
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
      render();
    }
  }

  return {
    saveYml: saveYml
  };
};
