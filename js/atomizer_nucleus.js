/**
 * @file - atomizer_nucleus.js
 *
 * Manage nucleus's - load, save, create
 */

Drupal.atomizer.nucleusC = function (_viewer) {

  var viewer = _viewer;
  var nucleus;
  var nucleusConf;

  /**
   * Initiate the AJAX call to load a nucleus.
   *
   * @param filepath
   * @param settings
   */
  var loadNucleus = function loadNucleus (filepath, settings) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/loadYml',
      { component: 'nucleus',
        settings: {fart: 'cool'},
        filepath: filepath
      },
      createNucleus
    );
  };

  /**
   * Align an object to an internal axis (x, y or z) and then align that axis
   * to an external axis in the scene.
   *
   * @param object
   * @param initialAxis
   * @param alignAxis
   * @param finalAxis
   */

  function alignNuclet(object, initialAxis, alignAxis, finalAxis) {

    initialAxis.normalize();
    alignAxis.normalize();
    finalAxis.normalize();

    // Align nuclets Y axis to the attach point normal
    Drupal.atomizer.base.alignObjectToAxis(
      object.children[0],
      initialAxis,
      alignAxis,
      false
    );

    // Align nuclets Y axis to the grow point normal
    Drupal.atomizer.base.alignObjectToAxis(
      object,
      alignAxis,
      finalAxis,
      false
    );
  }

  /**
   * User has selected a new nuclet state, change the nuclet.
   *
   * @param value
   */
  function changeNucletState(nuclet, state) {
    var az = nuclet.az;
    viewer.nuclet.deleteNuclet(nuclet);

    az.conf.state = state;
    var nucletOuterShell = createNuclet(az.id, az.conf, parent);
    nuclet = nucletOuterShell.children[0].children[0];
    nucleus.az.nuclets[nuclet.az.id] = nuclet;

    return nuclet;
  }

  /**
   * When the user has clicked on an add nuclet button,
   * create the new nuclet with a carbon ending.
   *
   * @param event
   */
  function addNuclet(id) {
    var conf = nucleusConf.nuclets[id];
    if (!conf) {
      conf = {
        state: 'carbon'
      };
    }
    // Find the parent nuclet PID
    var pid = id.slice(0, -1);

    // Create the new nuclet
    var nucletOuterShell = createNuclet(id, conf, nucleus.az.nuclets[pid]);
    var nuclet = nucletOuterShell.children[0].children[0];
    nucleus.az.nuclets[nuclet.az.id] = nuclet;
    return nuclet;
  }

  /**
   * User has changed the slider to select the attachment angle.
   *
   * @param event
   */
  function changeNucletAngle(id, angle) {
    var nuclet = nucleus.az.nuclets[id];
    nuclet.parent.rotation.y = (nuclet.parent.initial_rotation_y + ((angle - 1) * 72)) / 180 *Math.PI;
    nuclet.az.conf.attachAngle = angle;
  }

  /**
   * Create a nuclet and rotate it into position.
   *
   * @param nucletConf
   */
  function createNuclet(id, nucletConf, parent) {
    // Create Nuclet - get references to nuclet and shells
    var nucletOuterShell = viewer.nuclet.createNuclet(id, nucletConf);
    var nucletInnerShell = nucletOuterShell.children[0];
    var nuclet = nucletOuterShell.children[0].children[0];
    parent.add(nucletOuterShell);

    // Rotate and position the nuclet onto it's parents grow point.
    if (nuclet.az.id != 'N0') {
      var growSide = nuclet.az.id.substr(nuclet.az.id.length - 1);
      var growId;
      var attachId;
      if (growSide == 0) {  // left side
        growId = 0;

        // attach on 10
        attachId = 10;
        nucletInnerShell.initial_rotation_y = -18;

        // attach on 11
//      attachId = 11;
//      nucletInnerShell.initial_rotation_y = -18;
      } else {              // right side
        growId = 2;

        // attach on 10
        attachId = 10;
        nucletInnerShell.initial_rotation_y = -198;

        // attach on 11
//      attachId = 11;
//      nucletInnerShell.initial_rotation_y = -162;
      }

      var growProton = nucleus.children[0].children[0].children[0].az.protons[growId];
      var growPt = growProton.position.clone();

      // Create normalized axis of vector to rotate to.
      //  The following 4 lines adjust the angle, position and length of the grow axis.
      var angleOrigin = new THREE.Vector3(0, 31, 0);
      var origin = new THREE.Vector3(0, 13, 0);
      growPt.y = growPt.y + 11;
      var attachScale = 2.42;

      var attachVertice = nuclet.az.protonGeometry.vertices[attachId];
      var initialAxis = attachVertice.clone().normalize();
      var alignAxis = new THREE.Vector3(0, 1, 0);
      var attachAxis = angleOrigin.clone().sub(growPt);
      var attachLen = attachAxis.length();
      attachAxis.normalize();

      // Align the axis through the attach vertice to the y axis.
      Drupal.atomizer.base.alignObjectToAxis(
        nuclet,
        initialAxis,
        alignAxis,
        false
      );

      // Align the new y axis to the grow point axis.
      Drupal.atomizer.base.alignObjectToAxis(
        nucletOuterShell,
        alignAxis,
        attachAxis,
        false
      );

      // Move the nuclet to the correct spot on the grow point axis.
      var attachPt = origin.clone().add(attachAxis.multiplyScalar(-attachLen * attachScale));
      nucletOuterShell.position.set(attachPt.x, attachPt.y, attachPt.z);

      // Set the initial y rotation
      nucletInnerShell.rotation.y = (nucletInnerShell.initial_rotation_y + (((nucletConf.attachAngle || 1) - 1) * 72)) / 180 *Math.PI;
    }

    nucleus.az.nuclets[nuclet.az.id] = nuclet;

    if (nucletConf.nuclets) {
      for (var n in nucletConf.nuclets) {
        createNuclet(n, nucletConf.nuclets[n], nuclet);
      }
    }

    return nucletOuterShell;
  }

  /**
   * Create a nucleus
   *
   * Cycle through the nuclets and build each nuclet with the nucletC.
   * Then position the new nuclets onto the central backbone.
   *
   * @param results
   */
  var createNucleus = function createNucleus (results) {
    var az;
    viewer.objects = {};
    if (nucleus) {
      // Remove any nucleus's currently displayed
      viewer.scene.remove(nucleus);
      az = nucleus.az;
    } else {
      az = {
        nuclets: {},
        nucletEditList: {}
      }
    }
    nucleusConf = results[0].ymlContents;
    nucleusConf['filepath'] = results[0].data.filepath;
    localStorage.setItem('atomizer_builder_nucleus', results[0].data.filepath.replace(/^.*[\\\/]/, ''));

    // Create the nucleus group - create first nuclet, remaining nuclets are created recursively.
    nucleus = new THREE.Group();
    nucleus.name = 'nucleus';
    nucleus.az = az;
    createNuclet('N0', nucleusConf.nuclets['N0'], nucleus);

    viewer.scene.add(nucleus);
    viewer.render();
  };

  /**
   * Add a single proton to the current nucleus.
   *
   * @param nuclet
   * @param face
   */
  var addProton = function addProton (nuclet, face) {
    // Ok, so we have our first proton to add.  We are adding it to an existing nuclet.
  };

  /**
   * The nucleus has been saved, display a message to the user. @TODO
   *
   * @param response
   */
  var savedYml = function (response) {
    var select = document.getElementById('style--selectyml').querySelector('select');
    // Remove current options
  }

  /**
   * Initiate the AJAX call to save the current nucleus as a new nucleus.
   *
   * @param controls
   */
  var saveYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    currentSet.name = controls.name;
    currentSet.filename = controls.filename;
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: controls.name,
        component: 'style',
        filename: controls.filename,
        ymlContents: currentSet },
      savedYml
    );
  };

  /**
   * Initiate the AJAX call to overwrite the current nucleus with changes.
   *
   * @param controls
   */
  var overwriteYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: currentSet.name,
        component: 'style',
        filename: currentSet.filename,
        ymlContents: currentSet },
      null  // TODO: Put in useful error codes and have them be displayed.
    );
  };

  /**
   * Interface to this nucleusC.
   */
  return {
    loadYml: createNucleus,
    saveYml: saveYml,
    overwriteYml: overwriteYml,
    loadNucleus: loadNucleus,
    changeNucletState: changeNucletState,
    changeNucletAngle: changeNucletAngle,
    az: function () { return nucleus.az; },
    addProton: addProton,
    addNuclet: addNuclet,
    getYmlDirectory: function () { return 'config/nucleus'; }
  };
};
