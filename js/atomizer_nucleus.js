/**
 * @file - atomizer_nucleus.js
 *
 * Manage nucleus's - load, save, create
 */

Drupal.atomizer.nucleusC = function (_viewer) {
  var viewer = _viewer;
  var nucleus;
  var nucleusConf;

  var nucletDivEdit;
  var nucletEditForm =    document.getElementById('hidden-nuclet');
  var hiddenControls =    document.getElementById('hidden-controls');

  var nucletAngle =       document.getElementById('nuclet--attachAngle');
  var nucletAngleSlider = document.getElementById('nuclet--attachAngle--az-slider');
  var nucletAngleValue =  document.getElementById('nuclet--attachAngle--az-value');
  var nucletList =        document.getElementById('nucleus--nuclets');
  var nucletDelete =      document.getElementById('nuclet--delete');
  var nucletAttachPt =    document.getElementById('edit-nuclet-attachproton--wrapper');
  var nucletGrow0 =       document.getElementById('nuclet--grow-0--value');
  var nucletGrow1 =       document.getElementById('nuclet--grow-1--value');


  // Add Event Listener to attachAngle slider
  nucletAngleSlider.addEventListener('input', onAngleChanged);

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
   * Align the axis of an object to another axis.
   *
   * @param object
   * @param objectAxis
   * @param finalAxis
   * @param negate
   */
  function alignObjectToAxis(object, objectAxis, finalAxis, negate) {
    // Find the rotation axis.
    var rotationAxis = new THREE.Vector3();
    rotationAxis.crossVectors( objectAxis, finalAxis ).normalize();

    // calculate the angle between the element axis vector and rotation vector
    radians = Math.acos(objectAxis.dot(finalAxis) );

    // set the quaternion
    object.quaternion.setFromAxisAngle(rotationAxis, (negate) ? -radians : radians);
  }

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
    alignObjectToAxis(
      object.children[0],
      initialAxis,
      alignAxis,
      false
    );

    // Align nuclets Y axis to the grow point normal
    alignObjectToAxis(
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
  function selectNucletState(value) {
    var nucletConf = nucletDivEdit.nuclet.az.conf;
    nucletConf.state = value;
    var deadman = nucletDivEdit.nuclet.parent.parent;
    nucleus.remove(deadman);
    var nuclet = createNuclet(nucletConf);
    nucletDivEdit.nuclet = nuclet;
    viewer.render();
    return;
  }

  /**
   * When the user has clicked on an add nuclet button, create the new nuclet add form and add a lithium ending.
   *
   * @param event
   */
  function onAddNuclet(event) {

  }

  /**
   * Carry out the selection of a new nuclet to edit.
   *
   * @param nuclet
   */
  function setEditNuclet(nucletDiv) {
    if (nucletDivEdit) {
      nucletDivEdit.classList.remove('nuclet-selected');
    }
    var nuclet = nucletDiv.nuclet;

    nucletDiv.appendChild(nucletEditForm);
    nucletDiv.classList.add('nuclet-selected');
    nucletDivEdit = nucletDiv;

    // Set the state of the nuclet
    document.getElementById("nuclet--state--" + nuclet.az.conf.state).checked = true;
    nucletAngleSlider.value = nuclet.az.conf.attachAngle || 1;
    nucletAngleValue.value = nuclet.az.conf.attachAngle || 1;

    // Initialize Nuclet grow point 0
    var nucletItem = document.getElementById('edit-nuclet-grow-0');
    var labelElement = nucletItem.getElementsByTagName('LABEL')[0];
    var valueElement = nucletItem.getElementsByTagName('DIV')[0];

    var newId = nuclet.nucletId + '0';
    labelElement.innerHTML = '&nbsp;&nbsp;&nbsp;' + newId;

    var nuclet0 = nucleus.nuclets[newId];
    if (nuclet0) {
      valueElement.innerHTML = nuclet0.az.conf.state;
    } else {
      var buttonnode= document.createElement('input');
      buttonnode.setAttribute('type','button');
      buttonnode.setAttribute('name','nuclet--grow-0-button');
      buttonnode.setAttribute('value','Add');
      buttonnode.addEventListener('click',onAddNuclet);
      valueElement.innerHTML = '';
      valueElement.appendChild(buttonnode);
    }

    // Initialize Nuclet grow point 1
    var nucletItem = document.getElementById('edit-nuclet-grow-1');
    var labelElement = nucletItem.getElementsByTagName('LABEL')[0];
    var valueElement = nucletItem.getElementsByTagName('DIV')[0];

    var newId = nuclet.nucletId + '1';
    labelElement.innerHTML = '&nbsp;&nbsp;&nbsp;' + newId;
    var nuclet1 = nucleus.nuclets[newId];
    if (nuclet1) {
      valueElement.innerHTML = nuclet1.az.conf.state;
    } else {
      var buttonnode= document.createElement('input');
      buttonnode.setAttribute('type','button');
      buttonnode.setAttribute('name','nuclet--grow-1-button');
      buttonnode.setAttribute('value','Add');
      buttonnode.addEventListener('click',onAddNuclet);
      valueElement.innerHTML = '';
      valueElement.appendChild(buttonnode);
    }

    // Show/Hide the delete, angle and attach points
    if (nuclet.nucletId == 'N0') {
      nucletDelete.classList.add('az-hidden');
      nucletAngle.classList.add('az-hidden');
      nucletAttachPt.classList.add('az-hidden');
    } else {
      nucletDelete.classList.remove('az-hidden');
      nucletAngle.classList.remove('az-hidden');
      nucletAttachPt.classList.remove('az-hidden');
    }
  }

  /**
   * User has selected a different nuclet to edit.
   *
   * @param event
   */
  function onSelectNuclet(event) {
    if (event.target.classList.contains('nuclet-list')) {
      setEditNuclet(event.target);
    };
  }

  /**
   * User has changed the slider to select the attachment angle.
   *
   * @param event
   */
  function onAngleChanged(event) {
    nucletDivEdit.nuclet.parent.rotation.y = (nucletDivEdit.nuclet.parent.initial_rotation_y + ((event.target.value - 1) * 72)) / 180 *Math.PI;
    viewer.render();
    return;
  }

  function createEditNucletDiv (nuclet) {
    // Create the div listing this nuclet in the control panel.
    var nucletDiv = document.createElement('DIV');
    nucletDiv.classList.add('nuclet-list');
    var spacing = '';
    for (var i = 0; i < nuclet.nucletId.length - 2; i++) {
      spacing += "&ndash;";
    }
    nucletDiv.innerHTML = spacing + ' ' + nuclet.nucletId;
    nucletDiv.id = nuclet.nucletId;
    nucletList.appendChild(nucletDiv);
    nucletDiv.addEventListener('click', onSelectNuclet)
    nucletDiv.nuclet = nuclet;
    nuclet.nucletDiv = nucletDiv;

    return nucletDiv;
  }

  /**
   * Create a nuclet and rotate it into position.
   *
   * @param nucletConf
   */
  function createNuclet(nucletConf) {
    // Create Nuclet - get references to nuclet and shells
    var nucletOuterShell = viewer.nuclet.createNuclet(nucletConf);
    var nucletInnerShell = nucletOuterShell.children[0];
    var nuclet = nucletOuterShell.children[0].children[0];
    nucleus.add(nucletOuterShell);
    nucleus.nuclets[nuclet.nucletId] = nuclet;

    if (nuclet.nucletId != 'N0') {
      var growSide = nuclet.nucletId.substr(nuclet.nucletId.length - 1);
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

      var growProton = nucleus.children[0].children[0].children[0].protons[growId];
      var finalAxis = growProton.position.clone();

      // Create normalized axis of vector to rotate to.
      var origin = new THREE.Vector3(0, 0, 0);
      origin.y = 8;
      finalAxis.y = finalAxis.y - 10;
      var attachVertice = nucletOuterShell.children[0].children[0].protonGeometry.vertices[attachId];

      var initialAxis = attachVertice.clone().normalize();
      var alignAxis = new THREE.Vector3(0, 1, 0).normalize();

      // Align the axis through the attach vertice to the y axis.
      alignObjectToAxis(
        nuclet,
        initialAxis,
        alignAxis,
        false
      );

      // Align the new y axis to the grow point axis.
      alignObjectToAxis(
        nucletOuterShell,
        alignAxis,
        finalAxis.clone().multiplyScalar(-1).normalize(),
        false
      );

      // Move the nuclet to the correct spot on the grow point axis.
      var attachPt = origin.add(finalAxis.sub(origin)).multiplyScalar(2.17);
      nucletOuterShell.position.set(attachPt.x, attachPt.y, attachPt.z);

      // Rotate the new nuclet to it's initial position
      nucletInnerShell.rotation.y = nucletInnerShell.initial_rotation_y / 180 * Math.PI;

      if (nucletConf.rotation) {
        var radians;
        if (nucletConf.rotation.x) {
          radians = nucletConf.rotation.x / 180 * Math.PI;
          nucletInnerShell.rotation.x = radians;
        }
        if (nucletConf.rotation.y) {
          radians = nucletConf.rotation.y / 180 * Math.PI;
          nucletInnerShell.rotation.y = radians;
        }
        if (nucletConf.rotation.z) {
          radians = nucletConf.rotation.z / 180 * Math.PI;
          nucletInnerShell.rotation.z = radians;
        }
      }
    }
    return nuclet;
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
    // Remove any nucleus's currently displayed -
    if (nucleus) {
      viewer.scene.remove(nucleus);
    }
    hiddenControls.appendChild(nucletEditForm);
    nucletList.innerHTML = '';
    nucleusConf = results[0].ymlContents;
    nucleusConf['filepath'] = results[0].data.filepath;
    localStorage.setItem('atomizer_builder_nucleus', results[0].data.filepath.replace(/^.*[\\\/]/, ''));
    nucleus = new THREE.Group();
    nucleus.name = 'nucleus';
    nucleus.nuclets = {};
    for (var n in nucleusConf.nuclets) {
      var nucletConf = nucleusConf.nuclets[n];
      nucletConf.nucletId = n;

      var nuclet = createNuclet(nucletConf);
      var nucletDiv = createEditNucletDiv(nuclet);
    }
    setEditNuclet(nucleus.nuclets['N0'].nucletDiv);
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

  var radios = document.forms["atomizer-controls-form"].elements["nuclet--state"];
  for(var i = 1, max = radios.length; i < max; i++) {
    radios[i].id = radios[i].id + '--' + radios[i].value;
    radios[i].onclick = function (event) {
      if (event.target.tagName == 'INPUT') {
        selectNucletState(event.target.value);
      }
    }
  }

  /**
   * Interface to this nucleusC.
   */
  return {
    loadYml: createNucleus,
    saveYml: saveYml,
    overwriteYml: overwriteYml,
    loadNucleus: loadNucleus,
    addProton: addProton,
    getYmlDirectory: function () { return 'config/nucleus'; }
  };
};
