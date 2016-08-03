/**
 * @file - atomizerstyle.js
 *
 */

'use strict';

Drupal.atomizer.styleC = function (_viewer, styleSetDir, styleSetFile) {
  var viewer = _viewer;
  var currentSet = {};
  var defaultSet = {};

  var loadYml = function (results) {
    results[0].ymlContents['filename'] = results[0].filename;
    defaultSet = results[0].ymlContents;
    currentSet.name = defaultSet.name;
    currentSet.description = defaultSet.description;
    currentSet.filename = defaultSet.filename;
    reset();
  };

  var savedYml = function (response) {
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
    select.value = response[0].filename;

    // Clear the Name and File name fields
    var inputs = document.getElementById('style--saveyml').querySelectorAll('input');
    inputs[0].value = '';
    inputs[1].value = '';
  }

  var saveYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    currentSet.name = controls.name;
    currentSet.filename = controls.filename;
    Drupal.atomizer.base.doAjax(
      'ajax-ab/saveYml',
      { name: controls.name,
        component: 'style',
        filename: controls.filename,
        ymlContents: currentSet },
      savedYml
    );
    return;
  };

  var overwriteYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      'ajax-ab/saveYml',
      { name: currentSet.name,
        component: 'style',
        filename: currentSet.filename,
        ymlContents: currentSet },
      null  // TODO: Put in useful error codes and have them be displayed.
    );
    return;
  };

  var reset = function reset() {
    for (var id in currentSet.controls) {
      if (Object.prototype.toString.call(currentSet.controls[id].defaultValue) === '[object Array]') {  // If it's an array
        for (var i in currentSet.controls[id].defaultValue) {
          if (currentSet.controls[id].defaultValue[i] != defaultSet.controls[id].defaultValue[i]) {
            applyControl(id, defaultSet.controls[id].defaultValue);
          }
        }
      } else {
        if (currentSet.controls[id].defaultValue != defaultSet.controls[id].defaultValue) {
          applyControl(id, defaultSet.controls[id].defaultValue);
        }
      }
    }
  };

  var applyControl = function applyControl(id, value) {
    id = id.replace(/_/g, '-');
    var args = id.split("--");
    var argNames = args[0].split("-");
    currentSet.controls[id.replace(/-/g, '_')].defaultValue = value;
    switch (argNames[0]) {
      case "renderer":
        viewer.renderer.setClearColor(new THREE.Color(parseInt(value.replace(/^#/, ''), 16)), 1);
        break;
      case "camera":
        if (args[1] == 'perspective') {
          viewer.camera.fov = value;
          viewer.camera.updateProjectionMatrix();
        }
        break;
      default:
        viewer.scene.traverse(function (node) {
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
                if (argNames[0] == 'awireframe' || argNames == 'bwireframe') {
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
    viewer.render();
  };

  Drupal.atomizer.base.doAjax(
    'ajax-ab/loadYml',
    { directory: styleSetDir,
      filename:  styleSetFile },
    loadYml
  );

  return {
    reset: reset,
    applyControl: applyControl,
    loadYml: loadYml,
    saveYml: saveYml,
    overwriteYml: overwriteYml,
    current: currentSet.controls
  };
};
