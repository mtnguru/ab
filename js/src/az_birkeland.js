/**
 * @file - az_atom.js
 *
 * Manage atom's - load, save, create
 */

(function ($) {

  Drupal.atomizer.birkelandC = function (_viewer) {

    var viewer = _viewer;
    var bc;
    var $sceneName = $('.scene--name', viewer.context);
    var sceneInformation = $('.scene--information', viewer.context)[0];
    var sceneProperties = $('.scene--properties', viewer.context)[0];
    var cylinders = {};

    var loadCallback;

    function toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
    /**
     * Execute AJAX command to load a new atom.
     *
     * @param nid
     */
    var loadObject = function loadObject (nid, callback) {
      loadCallback = callback;
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/load-node',
        { nid: nid },
        doCreateBirkeland
      );
    };

    /**
     * Callback from ajax call to load and display an atom.
     *
     * @param results
     */
    var doCreateBirkeland = function doCreateBirkeland (results) {
      var az;
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        if (result.command == 'loadNodeCommand') {
          if ($sceneName) {
            $sceneName.html(result.data.nodeTitle);
          }
          if (sceneInformation) {
            sceneInformation.innerHTML = result.data.information;
          }
          if (sceneProperties) {
            sceneProperties.innerHTML = result.data.properties;
          }

          if (bc) {
            // Remove any atom's currently displayed
            deleteObject(bc);
            bc = null;
          }

          bc = createObject(result.data.nodeConf);
          bc.az = {
            nid: result.data.nid,
            name: result.data.nodeName,
            title: result.data.nodeTitle,
          };
//        bc.az.nid = result.data.nid;
//        bc.az.name = result.data.nodeName;
//        bc.az.title = result.data.nodeTitle;

          // Move bc position
          if (viewer.dataAttr['object--position--x']) {
            if (!object.position) object.position = new THREE.Vector3();
            bc.position.x = viewer.dataAttr['bc--position--x'];
          }
          if (viewer.dataAttr['bc--position--y']) {
            if (!bc.position) bc.position = new THREE.Vector3();
            bc.position.y = viewer.dataAttr['bc--position--y'];
          }
          if (viewer.dataAttr['bc--position--z']) {
            if (!bc.position) bc.position = new THREE.Vector3();
            bc.position.z = viewer.dataAttr['bc--position--z'];
          }

//        if (!bc.rotation) bc.rotation = new THREE.Vector3();
//        bc.rotation.x =  30 / 360 * 2 * Math.PI;
//        bc.rotation.z = -45 / 360 * 2 * Math.PI;

          // Rotate bc
          if (viewer.dataAttr['bc--rotation--x']) {
            if (!bc.rotation) bc.rotation = new THREE.Vector3();
            bc.rotation.x = viewer.dataAttr['bc--rotation--x'] * Math.PI / 180;
          }
          if (viewer.dataAttr['bc--rotation--y']) {
            if (!bc.rotation) bc.rotation = new THREE.Vector3();
            bc.rotation.y = viewer.dataAttr['bc--rotation--y'] * Math.PI / 180;
          }
          if (viewer.dataAttr['bc--rotation--z']) {
            if (!bc.rotation) bc.rotation = new THREE.Vector3();
            bc.rotation.z = viewer.dataAttr['bc--rotation--z'] * Math.PI / 180;
          }
          viewer.producer.objectLoaded(bc);
          viewer.render();

          if (loadCallback) {
            loadCallback();
          }
        }
      }
    };

    function makeCylinder(radius, height, color, opacity) {
      var cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 50, 10, true);
      var cylinderMaterial = new THREE.MeshLambertMaterial({
        color: color,
        transparent: true,
        visible: true,
        opacity: opacity
      });
      cylinderMaterial.side = THREE.DoubleSide;
      cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      return cylinder;
    }

    /**
     * Create a birkeland current
     *
     * @param atomConf
     * @returns {THREE.Group|*}
     */
    var createObject = function createObject (conf) {
      // Create the atom group - create first nuclet, remaining nuclets are created recursively.

      var bc = new THREE.Group();
      bc.cylinders = {};
      if (conf.object.rotation) {
        bc.rotation = new THREE.Vector3();
        bc.rotation.set(
          (conf.object.rotation.x) ? conf.object.rotation.x * Math.PI / 180 : 0,
          (conf.object.rotation.y) ? conf.object.rotation.y * Math.PI / 180 : 0,
          (conf.object.rotation.z) ? conf.object.rotation.z * Math.PI / 180 : 0
        );
      }
      viewer.scene.add(bc);

      for (var cylinder in conf.cylinders) {
        if (cylinder == 'defaults') continue;
        var parms = [];
        for (var parm in conf.cylinders.defaults) {
          parms[parm] = conf.cylinders.defaults[parm];
        }
        for (var parm in conf.cylinders[cylinder]) {
          parms[parm] = conf.cylinders[cylinder][parm];
        }

        var circumference = 2 * Math.PI * parms.radius;
        var length = circumference * parms.chargeLength / 360;


        var cyl = makeCylinder(
          parms.radius,
          parms.length,
          parms.color,
          viewer.theme.get('cylinders-' + cylinder + '--opacity')
        );
        cyl.name = 'cylinders-' + cylinder.replace(' ', '_');
        cyl.conf = parms;
        bc.add(cyl);
        bc.cylinders[cylinder] = cyl;

        // Add the arrows can be one set of points
        var ptsGeometry = new THREE.Geometry();
        var ptsMaterial = new THREE.PointsMaterial({
          size: parms.markerSize,
          sizeAttenuation: false,
          color: parms.color
        });
        var rotate = 360 / parms.numArrowPaths;
        for (var path = 0; path < parms.numArrowPaths; path++) {
          var radians = toRadians(path * rotate + parms.rotateInitial);
          var spacing = parms.length / (parms.numArrows + 1);
          var x = parms.radius * Math.sin(radians);
          var y = -parms.length / 2 + spacing * Math.random();
          var z = parms.radius * Math.cos(radians);
          for (var arrow = 0; arrow < parms.numArrows; arrow++) {
            y += parms.length / parms.numArrows;
            // This is the only part that is different
            switch (parms.chargeMarker) {
              case 'arrows':
                switch (parms.animationRotate) {
                  case 0: // Current goes straight up or down the cylinder
                    for (var p = 0; p < 16; p += parms.markerSize) {
                      var point = new THREE.Vector3(x, y + p, z);
                      point = movePoint(cyl, point, 0);
                      ptsGeometry.vertices.push(point);
                    }
                    break;
                  case 2:  // Current goes at a 45 to the cylinder?
                  case -2:
                    for (var p = 0; p < 16; p += parms.markerSize) {
                      var point = new THREE.Vector3(x, y + p, z);
                      point = movePoint(cyl, point, 0);
                      ptsGeometry.vertices.push(point);
                    }
                    break;
                  case 4:
                  case -4: // Current is completely wrapped around the cylinder,
                    for (var p = 0; p < 16; p += parms.markerSize) {
                      var point = new THREE.Vector3(x, y + p, z);
                      point = movePoint(cyl, point, 0);
                      ptsGeometry.vertices.push(point);
                    }
                    break;
                }
                break;

              case 'particles':
                ptsGeometry.vertices.push(new THREE.Vector3(x, y, z));
                break;
            }
          }
          var points = new THREE.Points(ptsGeometry, ptsMaterial);
          points.name = 'particles-' + cylinder.replace(' ', '_');
          cyl.add(points);
        }
      }

      viewer.render();
      return bc;
    };

    function movePoint (cyl, point, distance) {
      point.y += distance;
      if (distance >= 0) {
        if (point.y > cyl.conf.length / 2) {
          point.y -= cyl.conf.length;
        }
      } else {
        if (point.y < -cyl.conf.length / 2) {
          point.y += cyl.conf.length;
        }
      }
      return point;
    }

    function animate(animateConf) {
      var speed = viewer.theme.get('animation--speed') / 100;
      for (var cylinder in bc.cylinders) {
        var conf = bc.cylinders[cylinder].conf;
        var cyl = bc.cylinders[cylinder];
        if (cyl) {
          var vertices = cyl.children[0].geometry.vertices;
          cyl.children[0].geometry.verticesNeedUpdate = true;
          for (var v = 0; v < vertices.length; v++) {
            vertices[v] = movePoint(cyl, vertices[v], conf.animationDistance * speed);
          }
          cyl.rotation.y += toRadians(conf.animationRotate * speed);
        }
      }
      viewer.render();
    }

    /**
     * Delete a birkeland current
     * @param bc
     */
    var deleteObject = function deleteObject (bc) {
      viewer.scene.remove(bc);
    };

    /**
     * User pressed a button on the main form - act on it.
     *
     * @param id
     */
    var buttonClicked = function buttonClicked(button) {
      if (button.id == 'atom--select') {
        $(viewer.context).toggleClass('select-atom-enabled');
      }
    };

    // Set up event handler when user closes atom-select button
    $('.atom--select-close').click(function () {
      $(viewer.context).removeClass('select-atom-enabled');
    });

    /**
     * Interface to this birkelandC.
     */
    return {
      az: function () { return atom.az; },
      buttonClicked: buttonClicked,
      createObject: createObject,
      deleteObject: deleteObject,
      loadObject: loadObject,
      animate: animate
    };
  };

})(jQuery);
