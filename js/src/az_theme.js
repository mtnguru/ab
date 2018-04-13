/**
 * @file - az_theme.js
 *
 * Class to manage and apply settings
 * Sets the color, position, opacity, linewidth, or rendered items.
 */

(function($) {
  'use strict';

  Drupal.atomizer.themeC = function (_viewer, callback) {
    var viewer = _viewer;
    var currentSet = {};
    var defaultSet = {};
    var themeDirectory = viewer.atomizer.themeDirectory;
    var loadedColors = {};
    var saveMessage = $('#theme--message', viewer.context)[0];

    /**
     * Load a theme yml file and make it the current theme set.
     *
     * @param results
     */
    var loadYml = function (results) {
      // Set the theme select list to the currently loaded file.

//    var $radios = $('#blocks--selectTheme #theme--select--' + results[0].data.themeId, viewer.context);
      var $radio = $('#theme--select--' + results[0].data.themeId, viewer.context);
      $radio.prop('checked', true);

      if (results[0].ymlContents) {
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
      }
    };

    var addDataAttr = function () {
      for (var name in viewer.dataAttr) {
        if (currentSet.settings[name]) {
          currentSet.settings[name].defaultValue = viewer.dataAttr[name];
        }
      }
    };

    /**
     * The current theme set was saved, now re-list the theme set directory with AJAX.
     *
     * @param response
     */
// The current theme set has been saved,
    var savedYml = function (response) {
      saveMessage.innerHTML = 'Theme saved successfully';
      setTimeout(function () { saveMessage.innerHTML = ''; }, 3000);

//    saveMessage.innerHTML = '.... Loading Theme list';
//    Drupal.atomizer.base.doAjax(
//      '/ajax-ab/listDirectory',
//      {
//        directory: themeDirectory,
//        component: 'theme'
//      },
//      updateThemeSelect
//    );
    };

    /**
     * Update the theme select widget.
     *
     * @param response
     */
    var updateThemeSelect = function updateThemeSelect(response) {
      var select = $('#theme--selectyml--select', viewer.context)[0];

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
      var inputs = $('#theme--saveNewName', viewer.context)[0].value = '';

      saveMessage.innerHTML = 'Theme saved successfully';
      setTimeout(function () { saveMessage.innerHTML = ''; }, 3000);
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
        if (!currentSet.settings.hasOwnProperty(id)) continue;
//      console.log(id);
        if (!currentSet.settings[id]) continue;

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

            element = $('#' + id)[0];
            if (element) element.value = def;

            element = $('#' + id + '--az-value')[0];
            if (element) element.value = def;
          }
          // else defaultValue is not an array, set the one value
        } else {
          if (viewer.dataAttr && viewer.dataAttr[id]) {
            def = viewer.dataAttr[id];
          } else if (defaultSet.settings[id]) {
              def = defaultSet.settings[id].defaultValue;
          } else {
//          alert('Error: No defaultValue found for ' + id + ' in ' + defaultSet.filepath);
            console.log('Error: No defaultValue found for ' + id + ' in ' + defaultSet.filepath);
          }
          if (updateAll || currentSet.settings[id].defaultValue != def) {
            if (!controlsOnly && defaultSet.settings[id]) {
              applyControl(id, defaultSet.settings[id].defaultValue);
            }
            var element = $('#' + id)[0];
            if (element) {
              if (element.className.indexOf('az-control-range') > -1) {
                $('#' + id + '--az-slider').val(def);
                $('#' + id + '--az-value').val(def);
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
      if (args.length === 4) {
        currentSet.settings[args[0] + '--' + args[1] + '--' + args[2] + '--' + args[3]].defaultValue = value;
      } else if (args.length === 3) {
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
                  if (args[0] == 'protonVertexid') {
                    if (!node.initScale) {
                      node.initScale = node.scale.clone();
                    }
                    node.scale.x = value * node.initScale.x;
                    node.scale.y = value * node.initScale.y;
                    node.scale.z = value * node.initScale.z;
                  } else {
                    var scale = value;
//                  console.log('applyControl  configuration ' + scale);
                    node.scale.set(scale, scale, scale);
                  }
                  break;

                case 'width':
                case 'depth':
                  if (argNames[0] == 'plane') {
                    node.geometry = THREE.PlaneBufferGeometry(
                      currentSet['settings']['plane--width'],
                      currentSet['settings']['plane--depth']
                    );
                  }
                  break;

                case 'opacity':
                  var opacity =     value;
                  var visible =     (value > .02);
                  var transparent = (value < .97);
                  if (argNames[0] == 'proton') {
                    if (node.az.active) {
                      node.material.opacity = opacity;
                      if (node.az.visible) {
                        node.material.visible = visible;
                        node.material.transparent = transparent;
                      }
                    }
                  } else if (argNames[0].indexOf('Wireframe') > -1) {
                    if (node.name == 'dodecaWireframe' ||
                        node.name == 'dodecaOutWireframe' ||
                        node.name == 'icosaWireframe' ||
                        node.name == 'icosaOutWireframe' ||
                        node.name == 'lithiumWireframe' ||
                        node.name == 'berylliumWireframe' ||
                        node.name == 'boron11Wireframe' ||
                        node.name == 'boron10Wireframe' ||
                        node.name == 'carbonWireframe' ||
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
                    if (node.material.materials) {
                      node.material.materials[1].opacity = opacity;
                      node.material.materials[1].visible = visible;
                      node.material.materials[1].transparent = transparent;
                    }
                    else if (node.material[0]) {
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
                      node.name == 'icosaWireframe' ||
                      node.name == 'icosaOutWireframe' ||
                      node.name == 'lithiumWireframe' ||
                      node.name == 'berylliumWireframe' ||
                      node.name == 'boron11Wireframe' ||
                      node.name == 'boron10Wireframe' ||
                      node.name == 'carbonWireframe' ||
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
                          node.name == 'icosaWireframe' ||
                          node.name == 'icosaOutWireframe' ||
                          node.name == 'lithiumWireframe' ||
                          node.name == 'berylliumWireframe' ||
                          node.name == 'boron11Wireframe' ||
                          node.name == 'boron10Wireframe' ||
                          node.name == 'carbonWireframe' ||
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
    var set = function set(value, id) {
      currentSet.settings[id]['defaultValue'] = value;
    };

    var setInit = function setInit(value, id, type) {
      if (!currentSet.settings[id]) {
        currentSet.settings[id] = {
          'defaultValue': value,
          'type': type
        }
      } else {
//      currentSet.settings[id]['defaultValue'] = value;
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
      var idArgs = id.split('--');
      var sid = id;
      if (index) {
        sid += '--' + index;
      }
//    if (idArgs[1] == 'position' || idArgs[1] == 'rotation' || idArgs[1] == 'scale' || idArgs[1] == 'opacity') {
//      sid += '--az-slider';
//    }
      if (currentSet.settings[sid]) {
        return currentSet.settings[sid]['defaultValue'];
      } else
      {
        return viewer.controls.getDefault(sid, index);
      }
    };

    function getColor(_name, highlight) {
      var name = (highlight) ? _name + '-' + highlight : _name;
      if (!loadedColors[name]) {
        var color = viewer.theme.get(_name);
        var percent;
        var num;
        var amt, R, G, B;
        switch (highlight) {
          case 'darken':
            percent = -15;
            num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
            color = "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
            break;
          case 'lighten':
            percent = 15;
            num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
            color = "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
            break;
        }
        if (!color) {
          alert('color is null ' + _name);
        }
        loadedColors[name] = new THREE.Color().setHex(parseInt(color.replace(/#/, "0x")), 16);
        loadedColors[name].hex = color;
        loadedColors[name].name = name;
      }
      return loadedColors[name];
    }

    var radioClicked = function radioClicked (target) {
      switch (target.name) {
        case 'theme--select':
          var file = target.value;
          var directory = $(target).parents('fieldset').data('directory');
          Drupal.atomizer.base.doAjax(
            '/ajax-ab/loadYml',
            { component: 'theme--select',
              filepath: 'config/themes/' + directory + '/' + file + '.yml',
              themeId: event.target.value
            },
            loadYml
          );
          break;
      }
    };

    var buttonClicked = function buttonClicked (target) {
      switch (target.id) {
        case 'theme--saveButton':
          saveTheme(currentSet);
          break;
        case 'theme--saveNewButton':
          var name = $('#theme--saveNewName').val();
          if (name.length) {
            var filename = name.replace(/[|&;$%@"<>()+,]/g, "").replace(/[ -]/g, '_');
            if (filename.indexOf('.yml') == -1) {
              filename += '.yml';
            }
            // Save the yml file

            currentSet.name = name;
            currentSet.filepath = themeDirectory + '/' + filename;
            saveMessage.classList.remove('az-error');
            saveMessage.innerHTML = '.... Saving theme';

            saveTheme(currentSet);

            setTimeout(function () { saveMessage.innerHTML = '' }, 3000)
          } else {
            saveMessage.innerHTML = 'Please enter a Name....';
            saveMessage.classList.add('az-error');
          }
          break;
        case 'theme--reset':
          reset();
          break;
        case 'theme--cameraReset':
          var zoom = (viewer.dataAttr['zoom']) ? viewer.dataAttr['zoom'] : 1;
          viewer.camera.position.set(
            zoom * viewer.theme.get('camera--position', 'x'),
            zoom * viewer.theme.get('camera--position', 'y'),
            zoom * viewer.theme.get('camera--position', 'z')
          );
          viewer.camera.lookAt(viewer.scene.position);
          viewer.render();
          break;
      }
    };

    var themeId = viewer.view.defaultTheme;
    viewer.view.themePath = viewer.atomizer.themeDirectory + '/' + themeId + '.yml' ;

    // Load theme file
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/loadYml',
      { filepath: viewer.view.themePath,
        themeId: viewer.view.defaultTheme,
        directory: themeDirectory,
        component: 'theme'
      },
      loadYml
    );

    // Return references to functions available for external use.
    return {
      radioClicked: radioClicked,
      buttonClicked: buttonClicked,
      applyControl: applyControl,
      loadYml: loadYml,
      addDataAttr: addDataAttr,
      setInit: setInit,
      set: set,
      get: get,
      getColor: getColor,
//    getCurrentControls: function() { return currentSet.settings; },
      getYmlDirectory:    function () { return themeDirectory; }
    };
  };
})(jQuery);

