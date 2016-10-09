/**
 * @file - atomizer_nucleus.js
 *
 * Manage nucleus's - load, save, create
 */

Drupal.atomizer.nucleusC = function (_viewer) {

  var viewer = _viewer;
  var nucleus;
  var nucleusConf;

  var editNuclet;
  var nucletEditForm =    document.getElementById('hidden-nuclet');
  var hiddenControls =    document.getElementById('hidden-controls');

  var nucletAngle =       document.getElementById('nuclet--attachAngle');
  var nucletAngleSlider = document.getElementById('nuclet--attachAngle--az-slider');
  var nucletAngleValue =  document.getElementById('nuclet--attachAngle--az-value');
  var nucletList =        document.getElementById('nucleus--nuclets');
  var nucletDelete =      document.getElementById('nuclet--delete');
  var nucletAttachPt =    document.getElementById('edit-nuclet-attachproton--wrapper');


  // Add Event Listener to attachAngle slider
  nucletAngleSlider.addEventListener('input', onAngleChanged);
  nucletDelete.addEventListener('click', onNucletDelete);

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
  function changeNucletState(name, value) {
    var az = editNuclet.az;
    var parent = editNuclet.parent.parent.parent;
    parent.remove(editNuclet.parent.parent);

    az.conf.state = value;
    var nucletOuterShell = createNuclet(az.id, az.conf, parent);
    var nuclet = nucletOuterShell.children[0].children[0];
//  nuclet.az.stateName = name;
    nucleus.az.nuclets[nuclet.az.id] = nuclet;

    editNuclet = nuclet;

    var oldItem = nucleus.az.nucletEditList[az.id]
    var newItem = createNucletButton (az.id, 'Edit', az.conf.state);
    oldItem.parentNode.replaceChild(newItem, oldItem);
    setEditNuclet(az.id);

    viewer.render();
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
    var pid = id.slice(0, -1);
    var nucletOuterShell = createNuclet(id, conf, nucleus.az.nuclets[pid]);
    var nuclet = nucletOuterShell.children[0].children[0];
    nucleus.az.nuclets[nuclet.az.id] = nuclet;
    setEditNuclet(id);

    editNuclet = nuclet;

    var oldItem = nucleus.az.nucletEditList[id]
    var newItem = createNucletButton (id, 'Edit', conf.state);
    oldItem.parentNode.replaceChild(newItem, oldItem);
    setEditNuclet(id);

    viewer.render();
    return;

  }

  /**
   * Carry out the selection of a new nuclet to edit.
   *
   * @param nuclet
   */
  function setEditNuclet(id) {
    if (editNuclet) {
      nucleus.az.nucletEditList[editNuclet.az.id].classList.remove('nuclet-selected');
    }

    if (!id) {
      hiddenControls.appendChild(nucletEditForm);
      return;
    }

    var nuclet = nucleus.az.nuclets[id];
    editNuclet = nuclet;

    var listItem = nucleus.az.nucletEditList[id];
    listItem.appendChild(nucletEditForm);
    listItem.classList.add('nuclet-selected');

    // Set the state of the nuclet
    if (editNuclet.az.conf.state != 'hydrogen' && editNuclet.az.conf.state != 'helium') {
      document.getElementById("nuclet--state--" + editNuclet.az.conf.state).checked = true;
      nucletAngleSlider.value = editNuclet.az.conf.attachAngle || 1;
      nucletAngleValue.value = editNuclet.az.conf.attachAngle || 1;
    }

    // Show/Hide the delete, angle and attach points
    if (editNuclet.az.id == 'N0') {
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
  function onNucletButton(event) {
    var segments = event.target.id.split('-');
    if (event.target.classList.contains('nuclet-list-button')) {
      var segments = event.target.id.split('-');
      if (event.target.value == 'Edit') {
        setEditNuclet(segments[1]);
      }
      if (event.target.value == 'Add') {
        addNuclet(segments[1]);
      }
    };
  }

  /**
   * User has changed the slider to select the attachment angle.
   *
   * @param event
   */
  function onAngleChanged(event) {
    editNuclet.parent.rotation.y = (editNuclet.parent.initial_rotation_y + ((event.target.value - 1) * 72)) / 180 *Math.PI;
    editNuclet.az.conf.attachAngle = event.target.value;
    viewer.render();
    return;
  }

  function onNucletDelete(event) {
    var id = editNuclet.az.id;

    // Remove nuclet from the nucleus
    editNuclet.parent.parent.parent.remove(editNuclet.parent.parent);
    viewer.render();

    var listItem;

    listItem = nucleus.az.nucletEditList[id];
    var newListLabel = createNucletItemLabel(id, null);
    var listItemLabel = listItem.getElementsByTagName('SPAN')[0];
    listItemLabel.parentNode.replaceChild(newListLabel, listItemLabel);
    listItem.getElementsByTagName('INPUT')[0].value = 'Add';

    listItem = nucleus.az.nucletEditList[id + '0'];
    if (listItem) {
      listItem.parentNode.removeChild(listItem);
    }

    listItem = nucleus.az.nucletEditList[id + '1'];
    if (listItem) {
      listItem.parentNode.removeChild(listItem);
    }

    setEditNuclet(null);
    // Replace the edit form with the Add button
    return;
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

      var growProton = nucleus.children[0].children[0].children[0].protons[growId];
      var growPt = growProton.position.clone();

      // Create normalized axis of vector to rotate to.
      //  The following 4 lines adjust the angle, position and length of the grow axis.
      var angleOrigin = new THREE.Vector3(0, 31, 0);
      var origin = new THREE.Vector3(0, 13, 0);
      growPt.y = growPt.y + 11;
      var attachScale = 2.42;

      var attachVertice = nuclet.protonGeometry.vertices[attachId];
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

  function createNucletItemLabel(id, state) {
    var label = document.createElement('SPAN');
    var spacing = '';
    for (var i = 0; i < id.length - 2; i++) {
//    spacing += "&ndash;";
//    spacing += "&nbsp;";
      spacing += "-";
    }
    label.innerHTML = spacing + ' ' + id;
    if (state) {
      label.innerHTML += ' ' + state;
    }
    label.classList.add('nuclet-list-label');
    return label;
  }

  function createNucletButton (id, value, state) {
    // Create the div listing this nuclet in the control panel.
    var item = document.createElement('DIV');
    item.id = 'nuclet-' + id;
    item.classList.add('nuclet-list');
    item.appendChild(createNucletItemLabel(id,state));
    nucleus.az.nucletEditList[id] = item;


    var button= document.createElement('input');
    button.setAttribute('type','button');
    button.setAttribute('name','nuclet-' + value + '-' + id + '-button');
    button.setAttribute('value',value);
    button.classList.add('nuclet-list-button');
    button.id = 'nuclet-' + id;
    button.addEventListener('click',onNucletButton);
    item.appendChild(button);

    return item;
  }

  function createNucletEditList(id) {
    var button;
    var item;
    if (nucleus.az.nuclets[id]) {
      var nuclet = nucleus.az.nuclets[id];
      item = createNucletButton(id, 'Edit', nuclet.az.state);
      nucletList.appendChild(item);
      if (id.length < 5) {
        createNucletEditList(id + '0');
        createNucletEditList(id + '1');
      }
    } else {
      item = createNucletButton(id, 'Add');
      nucletList.appendChild(item);
    }
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
    // Move the nucletEditForm into the hiddenControls div
    hiddenControls.appendChild(nucletEditForm);
    nucletList.innerHTML = '';
    nucleusConf = results[0].ymlContents;
    nucleusConf['filepath'] = results[0].data.filepath;
    localStorage.setItem('atomizer_builder_nucleus', results[0].data.filepath.replace(/^.*[\\\/]/, ''));

    // Create the nucleus group - create first nuclet, remaining nuclets are created recursively.
    nucleus = new THREE.Group();
    nucleus.name = 'nucleus';
    nucleus.az = az;
    createNuclet('N0', nucleusConf.nuclets['N0'], nucleus);

    // Create the nuclet edit list
    var id = 'N0';
    createNucletEditList(id);
    setEditNuclet(id);

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
  for(var i = radios.length - 1; i > 0; i--) {
    radios[i].onclick = function (event) {
      if (event.target.tagName == 'INPUT') {
        changeNucletState(event.target.parentElement.innerHTML, event.target.value);
      }
    }
    radios[i].id = radios[i].id + '--' + radios[i].value;
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
