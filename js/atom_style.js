/**
 * @file - atom_style.js
 *
 */

'use strict';

Drupal.AjaxCommands.prototype.loadStyle = function(ajax, response, status) {
  return;
//  response.styleSet;
}

Drupal.atom_builder.styleC = function (_viewer, styleSet) {
  var viewer = _viewer;
  var currentSet = styleSet.controls;
  var defaultSet = (JSON.parse(JSON.stringify(currentSet)));
  var styleSetName = styleSet.name;

  var load = function ($path) {
    return styleSet;
  };

  var save = function ($path, description) {
    return
  };

  var reset = function () {
    for (var id in currentSet) {
      if (Object.prototype.toString.call(currentSet[id].defaultValue) === '[object Array]') {  // If it's an array
        for (var i in currentSet[id].defaultValue) {
          if (currentSet[id].defaultValue[i] != defaultSet[id].defaultValue[i]) {
            applyStyle(id, defaultSet[id].defaultValue);
          }
        }
      } else {
        if (currentSet[id].defaultValue != defaultSet[id].defaultValue) {
          applyStyle(id, defaultSet[id].defaultValue);
        }
      }
    }
  };

  var applyStyle = function (id, value) {
    id = id.replace(/_/g, '-');
    var args = id.split("--");
    var argNames = args[0].split("-");
    currentSet[id.replace(/-/g, '_')].defaultValue = value;
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

  return {
    load: load,
    save: save,
    reset: reset,
    applyStyle: applyStyle,
    current: currentSet
  };
};
