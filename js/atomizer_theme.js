/**
 * @file - atomizer_theme.js
 *
 * Class to manage and apply settings
 * Sets the color, position, opacity, linewidth, or rendered items.
 */

'use strict';

Drupal.atomizer.themeC = function (_viewer, callback) {
  var viewer = _viewer;
  var currentSet = {};
  var defaultSet = {};
  var themeDirectory = viewer.atomizer.themeDirectory;
  var currentThemeName = '';
//var nucletNames = ['monolet', 'tetralet', 'octalet', 'icosalet', 'decalet'];
  var saveMessage = document.getElementById('theme--saveMessage');
  var saveNewMessage = document.getElementById('theme--saveNewMessage');

  /**
   * Load a theme yml file and make it the current theme set.
   *
   * @param results
   */
  var loadYml = function (results) {
    // Save the theme file name in browser local storage.
    localStorage.setItem('atomizer_theme_file', results[0].data.filename);
    document.getElementById('edit-selectyml').value = results[0].data.filename;

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

    // This is a hack, the callback is only run the first time the theme file is loaded.
    if (callback) {
      callback();
      callback = null;
    }
  };

  /**
   * The current theme set was saved, now re-list the theme set directory with AJAX.
   *
   * @param response
   */
// The current theme set has been saved,
  var savedYml = function (response) {
    saveNewMessage.innerHTML = '.... Loading Theme list';
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/listDirectory',
      {
        directory: themeDirectory,
        component: 'theme'
      },
      updateThemeSelect
    );
  };

  /**
   * Update the theme select widget.
   *
   * @param response
   */
  var updateThemeSelect = function updateThemeSelect(response) {
    var select = document.getElementById('edit-selectyml');

    // Remove current options from theme select widget
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
    var inputs = document.getElementById('theme--saveNewName').value = '';

    saveNewMessage.innerHTML = 'Theme saved successfully';
    setTimeout(function () { saveNewMessage.innerHTML = ''; }, 3000);
  };

  /**
   * Overwrite the current theme set.
   *
   * @param theme
   */
  var saveTheme = function (theme) {

    var settings = theme.settings;
    var sortedKeys = Object.keys(settings).sort();
    delete theme.settings;
    theme.settings = {};
    for (var key in sortedKeys) {
      var pname = sortedKeys[key];
      theme.settings[sortedKeys[key]] = settings[sortedKeys[key]];
    }
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: theme.name,
        component: 'theme',
        filepath: theme.filepath,
        ymlContents: theme },
      savedYml
    );
    return;
  };

  /**
   * Reset the current settings to the default.
   *
   * @param controlsOnly - only update the controls, not the objects in the scene.
   * @param updateAll - update everything to the current theme even if current == default.
   */
  var reset = function reset(controlsOnly, updateAll) {
    var def;
    for (var id in currentSet.settings) {
      // if defaultValue defines an array then set all elements.
      if (Object.prototype.toString.call(currentSet.settings[id].defaultValue) === '[object Array]') {  // If it's an array
        var comp = id.split('--');
        var ind = 'xyz'.indexOf(comp[2]);
        def = defaultSet.settings[id].defaultValue[ind];
        if (updateAll || currentSet.settings[id].defaultValue[ind] != def) {
          if (!controlsOnly) {
            applyControl(id, def);
          }
          var element;

          element = document.getElementById(id);
          if (element) element.value = def;

          element = document.getElementById(id + '--az-value');
          if (element) element.value = def;
        }
      // else defaultValue is not an array, set the one value
      } else {
        if (defaultSet.settings[id]) {
          def = defaultSet.settings[id].defaultValue;
        } else {
//        alert('Error: No defaultValue found for ' + id + ' in ' + defaultSet.filepath);
          console.log('Error: No defaultValue found for ' + id + ' in ' + defaultSet.filepath);
        }
        if (updateAll || currentSet.settings[id].defaultValue != def) {
          if (!controlsOnly) {
            applyControl(id, defaultSet.settings[id].defaultValue);
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
      currentSet.settings[args[0] + '--' + args[1] + '--' + args[2]].defaultValue = value;
    } else {
      currentSet.settings[args[0] + '--' + args[1]].defaultValue = value;
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

//    case 'ambient':
//      node.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
//      break;

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
//              var scale = (node.scaleInit) ? value * node.scaleInit : value;
                var scale = value;
                console.log('applyControl  configuration ' + scale);
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
                if (argNames[0] == 'proton') {
                  if (node.az.active) {
                    node.material.opacity = opacity;
                    node.material.visible = visible;
                    node.material.transparent = transparent;
                  }
                } else if (argNames[0].indexOf('Wireframe') > -1) {
                  if (node.name == 'dodecaWireframe' || 
                      node.name == 'dodecaOutWireframe' || 
                      node.name == 'hexaWireframe') {
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
                  if (node.material[0]) {
                    node.material[0].opacity = opacity;
                    node.material[0].visible = visible;
                    node.material[0].transparent = transparent;
                  } else {
                    node.material.opacity = opacity;
                    node.material.visible = visible;
                    node.material.transparent = transparent;
                  }
                }
                break;

              case 'linewidth':
                if (argNames[0].indexOf('Wireframe') > -1) {
                  if (node.name == 'dodecaWireframe' || 
                      node.name == 'dodecaOutWireframe' || 
                      node.name == 'hexaWireframe') {
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
                switch (argNames[0]) {
                  case 'ambient':
                  case 'spotlight':
                    node.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                    break;
                  default:
                    if (argNames[0].indexOf('Wireframe') > -1) {
                      if (node.name == 'dodecaWireframe' || 
                          node.name == 'dodecaOutWireframe' || 
                          node.name == 'hexaWireframe') {
                        for (var i = 0; i < node.children.length; i++) {
                          node.children[i].material.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                        }
                      } else {
                        node.material.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                      }
                    } else {
                      if (node.material.materials) {
                        for (var i = 0; i < node.material.materials.length; i++) {
                          node.material.materials[i].color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                        }
                      }
                      else {
                        node.material.color.setHex(parseInt(value.replace(/#/, "0x")), 16);
                      }
                    }
                    break;
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
   * Set the theme of an element externally
   *
   * Used when initializing controls - creates a default theme set with all values,
   * The set initially loaded may be incomplete due to changes and not have a default value.
   *
   * @param value
   * @param id
   * @param type
   */
  var set = function set(value, id, type) {
    if (!currentSet.settings[id]) {
      currentSet.settings[id] = {
        'defaultValue': value,
        'type': type
      }
    } else {
//    currentSet.settings[id]['defaultValue'] = value;
    }
  };

  var setBaseSetting = function set(value, id) {
    currentSet.settings[id]['baseSetting'] = value;
  };

  /**
   * Get the theme for an element
   *
   * @param id
   * @param index
   * @returns {*}
   */
  var get = function get(id, index) {
    if (index == null) {
      if (currentSet.settings[id]) {
        return currentSet.settings[id]['defaultValue'];
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
      if (currentSet.settings[id + '--' + index]) {
        return currentSet.settings[id + '--' + index]['defaultValue'];
      } else {
//      alert('theme for rotation or position needs fixed');
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

  var buttonClicked = function buttonClicked (target) {
    switch (target.id) {
      case 'theme--saveButton':
        saveTheme(currentSet);
        break;
      case 'theme--saveNewButton':
        var name = document.getElementById('theme--saveNewName').value;
        if (name.length) {
          var filename = name.replace(/[|&;$%@"<>()+,]/g, "").replace(/[ -]/g, '_');
          if (filename.indexOf('.yml') == -1) {
            filename += '.yml';
          }
          // Save the yml file

          currentSet.name = name;
          currentSet.filepath = themeDirectory + '/' + filename;
          saveNewMessage.classList.remove('az-error');
          saveNewMessage.innerHTML = '.... Saving theme';

          saveTheme(currentSet);

          setTimeout(function () { saveNewMessage.innerHTML = '' }, 3000)
        } else {
          saveNewMessage.innerHTML = 'Please enter a Name....';
          saveNewMessage.classList.add('az-error');
        }
        break;
      case 'theme--reset':
        reset();
        break;
      case 'theme--cameraReset':
        viewer.camera.position.x = viewer.theme.get('camera--position', 'x');
        viewer.camera.position.y = viewer.theme.get('camera--position', 'y');
        viewer.camera.position.z = viewer.theme.get('camera--position', 'z');
        viewer.camera.lookAt(viewer.scene.position);
        viewer.render();
        break;
    }
  };

  // Get theme file from browser local storage if it exists.
  var themeFile = localStorage.getItem('atomizer_theme_file');
  if (!themeFile || themeFile == 'undefined') {
    themeFile = viewer.view.defaultTheme;
  }
  viewer.view.themePath = viewer.atomizer.themeDirectory + '/' + themeFile;

  // Load theme file
  Drupal.atomizer.base.doAjax(
    '/ajax-ab/loadYml',
    { filepath: viewer.view.themePath,
      filename: themeFile,
      component: 'theme'
    },
    loadYml
  );

  // Return references to functions available for external use.
  return {
    buttonClicked: buttonClicked,
    applyControl: applyControl,
    loadYml: loadYml,
    get: get,
    set: set,
    getCurrentControls: function() { return currentSet.settings; },
    getYmlDirectory:    function () { return themeDirectory; }
  };
};
