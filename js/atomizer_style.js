/**
 * @file - atomizer_style.js
 *
 * Class to manage and apply styles
 * Sets the color, position, opacity, linewidth, or rendered items.
 */

'use strict';

Drupal.atomizer.styleC = function (_viewer, callback) {
  var viewer = _viewer;
  var currentSet = {};
  var defaultSet = {};
  var styleSetDirectory = viewer.atomizer.styleSetDirectory;
  var currentStyleName = '';
//var nucletNames = ['monolet', 'tetralet', 'octalet', 'icosalet', 'decalet'];
  var saveMessage = document.getElementById('style--saveMessage');
  var saveNewMessage = document.getElementById('style--saveNewMessage');

  /**
   * Load a style yml file and make it the current style set.
   *
   * @param results
   */
  var loadYml = function (results) {
    results[0].ymlContents.filepath = results[0].data.filepath;
    defaultSet = results[0].ymlContents;
    if (currentSet.name) {
      reset(false, false);
      currentSet.name = defaultSet.name;
      currentSet.description = defaultSet.description;
      currentSet.filepath = defaultSet.filepath;
    } else {
      currentSet = JSON.parse(JSON.stringify(defaultSet));
      reset(true, true);
    }
    // This is a hack, the callback is only run the first time the style file is loaded.
    if (callback) {
      callback();
      callback = null;
    }
  };

  /**
   * The current style set was saved, now re-list the style set directory with AJAX.
   *
   * @param response
   */
// The current style set has been saved,
  var savedYml = function (response) {
    saveNewMessage.innerHTML = '.... Loading Style list';
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/listDirectory',
      {
        directory: styleSetDirectory,
        component: 'style'
      },
      updateStyleSelect
    );
  };

  /**
   * Update the style select widget.
   *
   * @param response
   */
  var updateStyleSelect = function updateStyleSelect(response) {
    var select = document.getElementById('edit-selectyml');

    // Remove current options from style select widget
    while (select.hasChildNodes()) {
      select.removeChild(select.lastChild);
    }

    // Create and append the new select option list
    for (var file in response[0].filelist) {
      var opt = document.createElement('option');
      opt.appendChild( document.createTextNode(response[0].filelist[file]));
      opt.value = file;
      select.appendChild(opt);
    }

    // Set select to the currently selected file
    select.value = currentSet.filepath.replace(/^.*[\\\/]/, '');

    // Clear the Name and File name fields
    var inputs = document.getElementById('style--saveNewName').value = '';

    saveNewMessage.innerHTML = 'Style saved successfully';
    setTimeout(function () { saveNewMessage.innerHTML = ''; }, 3000);
  };

  /**
   * Overwrite the current style set.
   *
   * @param styles
   */
  var saveStyle = function (styleSet) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: styleSet.name,
        component: 'style',
        filepath: styleSet.filepath,
        ymlContents: styleSet },
      savedYml
    );
    return;
  };

  /**
   * Reset the current styles to the default.
   *
   * @param controlsOnly - only update the controls, not the objects in the scene.
   * @param updateAll - update everything to the current style even if current == default.
   */
  var reset = function reset(controlsOnly, updateAll) {
    var def;
    for (var id in currentSet.styles) {
      // if defaultValue defines an array then set all elements.
      if (Object.prototype.toString.call(currentSet.styles[id].defaultValue) === '[object Array]') {  // If it's an array
        var comp = id.split('--');
        var ind = 'xyz'.indexOf(comp[2]);
        def = defaultSet.styles[id].defaultValue[ind];
        if (updateAll || currentSet.styles[id].defaultValue[ind] != def) {
          if (!controlsOnly) {
            applyControl(id, def);
          }
          var element;

          element = document.getElementById(id + '--az-slider');
          if (element) element.value = def;

          element = document.getElementById(id + '--az-value');
          if (element) element.value = def;
        }
      // else defaultValue is not an array, set the one value
      } else {
        if (defaultSet.styles[id]) {
          def = defaultSet.styles[id].defaultValue;
        } else {
//        alert('Error: No defaultValue found for ' + id + ' in ' + defaultSet.filepath);
          console.log('Error: No defaultValue found for ' + id + ' in ' + defaultSet.filepath);
        }
        if (updateAll || currentSet.styles[id].defaultValue != def) {
          if (!controlsOnly) {
            applyControl(id, defaultSet.styles[id].defaultValue);
          }
          var element = document.getElementById(id);
          if (element) {
            if (element.className.indexOf('az-control-range') > -1) {
              document.getElementById(id + '--az-slider').value = def;
              document.getElementById(id + '--az-value').value = def;
            } else {
              element.value = def;
            }
          }
        }
      }
    }
  };

  /**
   * Apply a control setting to the proper scene elements.
   *
   * @param id
   * @param value
   */
  var applyControl = function applyControl(id, value) {
    var args = id.split("--");
    var argNames = args[0].split("-");
    // Set the currentSet
    if (args.length > 2) {
      currentSet.styles[args[0] + '--' + args[1] + '--' + args[2]].defaultValue = value;
    } else {
      currentSet.styles[args[0] + '--' + args[1]].defaultValue = value;
    }

    switch (argNames[0]) {

      case 'renderer':
        viewer.renderer.setClearColor(new THREE.Color(parseInt(value.replace(/^#/, ''), 16)), 1);
        break;

      case 'camera':
        if (args[1] == 'perspective') {
          viewer.camera.fov = value;
          viewer.camera.updateProjectionMatrix();
        }
        break;

      case 'ambient':
        node.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
        break;

      default:
        viewer.scene.traverse(function (node) {
          var nodeNames = node.name.split("-");
          var ok = false;
          if (args[0] == 'atom') {
            if (nodeNames[0] == 'atom') {
              ok = true;
            }
          } else if (args[0] == 'decahedron') {
            if (nodeNames[0] == 'lithium') {
              ok = true;
            }
          } else if (args[0].indexOf('wireframe') > -1 &&
                     args[1] == 'scale'                &&
                     nodeNames[0].indexOf('face') > -1 &&
                     nodeNames[0].charAt(0) == args[0].charAt(0)) {
            ok = true;
          } else {
            if (argNames.length == 2) {
              if (args[0] == node.name) {
                ok = true;
              }
            } else if (nodeNames[0] == argNames[0]) {
              ok = true;
            }
          }

          if (ok) {
            switch (args[1]) {

              case 'rotation':
                var radians = value / 360 * 2 * Math.PI;
                node.rotation[args[2]] = radians + (node.rotation['init_' + args[2]] || 0);
                break;

              case 'position':
                node.position[args[2]] = value;
                break;

              case 'scale':
                var scale = (node.init_scale) ? value * node.init_scale : value;
                node.scale.set(scale, scale, scale);
                break;

              case 'width':
              case 'depth':
                if (argNames[0] == 'plane') {
                  node.geometry = THREE.PlaneBufferGeometry(currentSet['plane--width'], currentSet['plane--depth']);
                }
                break;

              case 'opacity':
                var opacity =     value;
                var visible =     (value > .02);
                var transparent = (value < .97);
                if (argNames[0].indexOf('Wireframe') > -1) {
                  if (node.name == 'dodecaWireframe' || node.name == 'hexaWireframe') {
                    for (var i = 0; i < node.children.length; i++) {
                      node.children[i].material.opacity = opacity;
                      node.children[i].material.visible = visible;
                      node.children[i].material.transparent = transparent;
                    }
                  } else {
                    node.material.opacity = opacity;
                    node.material.visible = visible;
                    node.material.transparent = transparent;
                  }
                } else {
                  node.material.opacity = opacity;
                  node.material.visible = visible;
                  node.material.transparent = transparent;
                }
                break;

              case 'linewidth':
                if (argNames[0].indexOf('Wireframe') > -1) {
                  if (node.name == 'dodecaWireframe' || node.name == 'hexaWireframe') {
                    for (var i = 0; i < node.children.length; i++) {
                      node.children[i].material.linewidth = value;
                      node.children[i].material.visible = (value >.05);
                    }
                  } else {
                    node.material.visible = (value >.05);
                    node.material.wireframeLinewidth = value;
                  }
                } else {
                  node.material.linewidth = value;
                  node.material.visible = (value >.05);
                }
                break;

              case 'color':
                if (argNames[0] == 'spotlight') {
                  node.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                } else if (argNames[0].indexOf('Wireframe') > -1) {
                  if (node.name == 'dodecaWireframe' || node.name == 'hexaWireframe') {
                    for (var i = 0; i < node.children.length; i++) {
                      node.children[i].material.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                    }
                  } else {
                    node.material.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                  }
                } else {
                  node.material.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                }
                break;

            }
          }
        });
        break;
    }
    viewer.render();
  };

  /**
   * Set the style of an element externally
   *
   * Used when initializing controls - creates a default style set with all values,
   * The set initially loaded may be incomplete due to changes and not have a default value.
   *
   * @param value
   * @param id
   * @param type
   */
  var setStyle = function setStyle(value, id, type) {
    if (!currentSet.styles[id]) {
      currentSet.styles[id] = {
        'defaultValue': value,
        'type': type
      }
    } else {
//    currentSet.styles[id]['defaultValue'] = value;
    }
  };

  /**
   * Get the style for an element
   *
   * @param id
   * @param index
   * @returns {*}
   */
  var getStyle = function getStyle(id, index) {
    if (index == null) {
      if (currentSet.styles[id]) {
        return currentSet.styles[id]['defaultValue'];
      } else {
        var value = viewer.controls.getDefault(id, index);
        if (value == null) {
          if (id.indexOf('--color')) {
            return '#ffff00';   // yellow
          }
          return 1;
        }
        return value;
      }
    } else {
      if (currentSet.styles[id] && currentSet.styles[id][index]) {
        return currentSet.styles[id]['defaultValue'][index];
      } else {
//      alert('style for rotation or position needs fixed');
        var value = viewer.controls.getDefault(id, index);
        if (value == null) {
          if (id.indexOf('--color')) {
            return '#ffff00';   // yellow
          }
          return 1;
        }
        return value;
      }
    }
  };

  var buttonClicked = function buttonClicked (id) {
    switch (id) {
      case 'style--saveButton':
        saveStyle(currentSet);
        break;
      case 'style--saveNewButton':
        var name = document.getElementById('style--saveNewName').value;
        if (name.length) {
          var filename = name.replace(/[|&;$%@"<>()+,]/g, "").replace(/[ -]/g, '_');
          if (filename.indexOf('.yml') == -1) {
            filename += '.yml';
          }
          // Save the yml file

          currentSet.name = name;
          currentSet.filepath = styleSetDirectory + '/' + filename;
          saveNewMessage.classList.remove('az-error');
          saveNewMessage.innerHTML = '.... Saving style';

          saveStyle(currentSet);

          setTimeout(function () { saveNewMessage.innerHTML = '' }, 3000)
        } else {
          saveNewMessage.innerHTML = 'Please enter a Name....';
          saveNewMessage.classList.add('az-error');
        }
        break;
      case 'style--reset':
        reset();
        break;
      case 'style--cameraReset':
        viewer.camera.position.x = viewer.style.get('camera--position', 'x');
        viewer.camera.position.y = viewer.style.get('camera--position', 'y');
        viewer.camera.position.z = viewer.style.get('camera--position', 'z');
        viewer.camera.lookAt(viewer.scene.position);
        viewer.render();
        break;
    }
  };

  /// Load the default style set.
  Drupal.atomizer.base.doAjax(
    '/ajax-ab/loadYml',
    { filepath: viewer.view.styleSetPath,
      component: 'style'
    },
    loadYml
  );

  // Return references to functions available for external use.
  return {
    buttonClicked: buttonClicked,
    applyControl: applyControl,
    loadYml: loadYml,
    get: getStyle,
    set: setStyle,
    getCurrentControls: function() { return currentSet.styles; },
    getYmlDirectory:    function () { return styleSetDirectory; }
  };
};
