/**
 * @file - atomizerstyle.js
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
  var nucletNames = ['monolet', 'tetralet', 'octalet', 'icosalet', 'pentalet'];
//var nucletNames = ['bwireframe', 'bface'];


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

  var savedYml = function (response) {
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/listDirectory',
      {
        directory: styleSetDirectory,
        component: 'style'
      },
      updateStyleSelect
    );
  };

  var updateStyleSelect = function updateStyleSelect(response) {
    var select = document.getElementById('style--selectyml').querySelector('select');
    // Remove current options
    while (select.hasChildNodes()) {
      select.removeChild(select.lastChild);
    }

    // Create the new option list
    for (var file in response[0].filelist) {
      var opt = document.createElement('option');
      opt.appendChild( document.createTextNode(response[0].filelist[file]));
      opt.value = file;
      select.appendChild(opt);
    }

    // Set select to new file
    select.value = response[0].filepath;

    // Clear the Name and File name fields
    var inputs = document.getElementById('style--saveyml').querySelectorAll('input');
    inputs[0].value = '';
    inputs[1].value = '';
  };

  var saveYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    currentSet.name = controls.name;
    currentSet.filepath = controls.filepath;
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: controls.name,
        component: 'style',
        filepath: controls.filepath,
        ymlContents: currentSet },
      savedYml
    );
    return;
  };

  var overwriteYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: currentSet.name,
        component: 'style',
        filepath: currentSet.filepath,
        ymlContents: currentSet },
      null  // TODO: Put in useful error codes and have them be displayed.
    );
    return;
  };

  var reset = function reset(controlsOnly, updateAll) {

    var def;
    for (var id in currentSet.controls) {
      // if defaultValue defines an array then set all elements.
      if (Object.prototype.toString.call(currentSet.controls[id].defaultValue) === '[object Array]') {  // If it's an array
        for (var i in currentSet.controls[id].defaultValue) {
          def = defaultSet.controls[id].defaultValue[i];
          if (updateAll || currentSet.controls[id].defaultValue[i] != def) {
            if (!controlsOnly) {
              applyControl(id, def);
            }
            var element = document.getElementById(id.replace(/_/g, '-'));
            if (element) {
              element.value = def;
            }
          }
        }
      // else defaultValue is not an array, set the one value
      } else {
        if (defaultSet.controls[id]) {
          def = defaultSet.controls[id].defaultValue;
        } else {
          alert('Error: No defaultValue found for ' + id + ' in ' + defaultSet.filepath);
        }
        if (updateAll || currentSet.controls[id].defaultValue != def) {
          if (!controlsOnly) {
            applyControl(id, defaultSet.controls[id].defaultValue);
          }
          var element = document.getElementById(id.replace(/_/g, '-'));
          if (element) {
            if (element.className.indexOf('az-control-range') > -1) {
              document.getElementById(id.replace(/_/g, '-') + '--az-slider').value = def;
              document.getElementById(id.replace(/_/g, '-') + '--az-value').value = def;
            } else {
              element.value = def;
            }
          }
        }
      }
    }
  };

  var applyControl = function applyControl(id, value) {
    var did = id.replace(/_/g, '-');
    var uid = id.replace(/-/g, '_');
    var args = did.split("--");
    var argNames = args[0].split("-");
    // Set the currentSet
//  currentSet.controls[id.replace(/-/g, '_')].defaultValue = value;
    if (args.length > 2) {
      var $indice = { 'x': 0, 'y': 1, 'z': 2 }[args[2]];
      currentSet.controls[args[0].replace(/-/, '_') + '__' + args[1]].defaultValue[$indice] = value;
    } else {
      currentSet.controls[args[0].replace(/-/, '_') + '__' + args[1]].defaultValue = value;
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
          if (args[0] == 'nucleus') {
            if (nucletNames.includes(nodeNames[0])) {
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
                  node.geometry = THREE.PlaneBufferGeometry(currentSet['plane__width'], currentSet['plane__depth']);
                }
                break;
              case 'opacity':
                node.material.opacity = value;
                node.material.visible =     (value > .05);
                node.material.transparent = (value < .97);
                break;
              case 'linewidth':
                if (argNames[0] == 'awireframe' || argNames == 'bwireframe') {
                  if (node.parent.name == 'icosalet') {   // The dual - dodecahedron is drawn with lines
                    for (var i = 0; i < node.children.length; i++) {
                      node.children[i].material.linewidth = value;
                    }
                  } else {
                    node.material.wireframeLinewidth = value;
                  }
                } else {
                  node.material.linewidth = value;
                }
                break;
              case 'color':
                if (argNames[0] == 'spotlight') {
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
    viewer.render();
  };


  var getStyleDefault = function getStyleDefault(id, index) {
    if (index == null) {
      return currentSet.controls[id]['defaultValue'];
    } else {
      return currentSet.controls[id]['defaultValue'][index];
    }
  };

  var getCurrentControls = function() {
    return currentSet.controls;
  };

  Drupal.atomizer.base.doAjax(
    '/ajax-ab/loadYml',
    { filepath: viewer.view.styleSetPath,
      component: 'style'
    },
    loadYml
  );

  return {
    reset: reset,
    applyControl: applyControl,
    loadYml: loadYml,
    saveYml: saveYml,
    overwriteYml: overwriteYml,
    get: getStyleDefault,
    getCurrentControls: getCurrentControls,
    getYmlDirectory: function () { return styleSetDirectory; }
  };
};
