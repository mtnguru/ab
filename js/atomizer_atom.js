/**
 * @file - atomizer_atom.js
 *
 * Manage atom's - load, save, create
 */

Drupal.atomizer.atomC = function (_viewer) {

  var viewer = _viewer;
  var atom;
  var atomConf;

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
    var parent = nuclet.parent.parent.parent;
    delete atom.az.nuclets[nuclet.az.id];
    viewer.nuclet.deleteNuclet(nuclet);

    az.conf = {
      state: state,
      attachAngle: az.attachAngle
    };

    var nucletOuterShell = createNuclet(az.id, az.conf, parent);
    nuclet = nucletOuterShell.children[0].children[0];
    atom.az.nuclets[nuclet.az.id] = nuclet;

    return nuclet;
  }

  /**
   * When the user has clicked on an add nuclet button,
   * create the new nuclet with a carbon ending.
   *
   * @param event
   */
  function addNuclet(id) {
    conf = {
      state: 'backbone-final',
      nucletAngle: 3,
      protons: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
      electrons: [0,1,2,3,4,5]
    };

    // Find the parent nuclet
    var parent = atom.az.nuclets[id.slice(0, -1)];

    // Deactivate the neutral ending protons.
    var np = (id.charAt(id.length-1) == '0') ? [12,13,14,15,20] : [16,17,18,19,21];
    for (var p = 0; p < np.length; p++) {
      parent.az.protons[np[p]].material.visible = false;
      parent.az.protons[np[p]].az.active = false;
    }

    // Create the new nuclet
    var nucletOuterShell = createNuclet(id, conf, parent);
    var nuclet = nucletOuterShell.children[0].children[0];
    atom.az.nuclets[nuclet.az.id] = nuclet;
    return nuclet;
  }

  function deleteNuclet(id) {
    var nuclet = viewer.objects.nuclets[id];
    var parent = atom.az.nuclets[id.slice(0, -1)];

    viewer.nuclet.deleteNuclet(nuclet);

    // Activate the neutral ending protons.
    var np = (id.charAt(id.length-1) == '0') ? [12,13,14,15,20] : [16,17,18,19,21];
    for (var p = 0; p < np.length; p++) {
      parent.az.protons[np[p]].material.visible = false;
      parent.az.protons[np[p]].az.active = false;
    }
  }

  /**
   * User has changed the slider to select the attachment angle.
   *
   * @param event
   */
  function changeNucletAngle(id, angle) {
    var nuclet = atom.az.nuclets[id];
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

      var growProton = atom.children[0].children[0].children[0].az.protons[growId];
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

    atom.az.nuclets[nuclet.az.id] = nuclet;

    if (nucletConf.nuclets) {
      for (var n in nucletConf.nuclets) {
        createNuclet(n, nucletConf.nuclets[n], nuclet);
      }
    }

    return nucletOuterShell;
  }

  /**
   * Create a atom
   *
   * Cycle through the nuclets and build each nuclet with the nucletC.
   * Then position the new nuclets onto the central backbone.
   *
   * @param results
   */
  var createAtom = function createAtom (results) {
    var az;
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      if (result.command == 'loadAtomCommand') {
        document.getElementById('atom--information').innerHTML = result.data.teaser;

        viewer.objects = {
          protons: [],
          hiddenProtons: [],
          optionalProtons: [],
          electrons: []
        };
        if (atom) {
          // Remove any atom's currently displayed
          viewer.scene.remove(atom);
          az = atom.az;
        } else {
          az = {
            nuclets: {},
            nucletEditList: {}
          }
        }
        atomConf = result.data.atomConf;
        localStorage.setItem('atomizer_builder_atom_nid', result.data.nid);

        // Post the Atom information.
        document.getElementById("")

        // Create the atom group - create first nuclet, remaining nuclets are created recursively.
        atom = new THREE.Group();
        atom.name = 'atom';
        atom.az = az;
        createNuclet('N0', atomConf['N0'], atom);

        setValenceRings();

        viewer.scene.add(atom);
        viewer.render();
      }
    }
  };

  /**
   * Check all valence rings and color active/inactive rings - count total Active and update atom information.
   */
  function setValenceRings() {
    var numActive = 0;
    var activeColor = viewer.style.get('valence-active--color');
    var inactiveColor = viewer.style.get('valence-inactive--color');
    for (var n in atom.az.nuclets) {
      var nuclet = atom.az.nuclets[n];
      if (nuclet.az.state === 'backbone-initial' || nuclet.az.state === 'backbone-final') {
        for (var r in nuclet.az.rings) {
          if (!nuclet.az.rings.hasOwnProperty(r)) continue;
          var ring = nuclet.az.rings[r];
          var gid = nuclet.az.id + ring.az.grow;
          var color = activeColor;
          if (atom.az.nuclets[nuclet.az.id + ring.az.grow] ||
              (nuclet.az.protons[ring.az.lock[0]].az.visible && nuclet.az.protons[ring.az.lock[1]].az.visible)) {
            color = inactiveColor;
          } else {
            numActive++;
          }
          ring.material.color.setHex(parseInt(color.replace(/#/, "0x")), 16);
        }
      }
    }
    return;
  }

  /**
   * Add a single proton to the current atom.
   *
   * @param nuclet
   * @param face
   */
  var addProton = function addProton (nuclet, face) {
    // Ok, so we have our first proton to add.  We are adding it to an existing nuclet.
  };

  /**
   * The atom has been saved, display a message to the user. @TODO
   *
   * @param response
   */
  var savedYml = function (response) {
    var select = document.getElementById('style--selectyml').querySelector('select');
    // Remove current options
  }

  /**
   * Initiate the AJAX call to save the current atom as a new atom.
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
   * Initiate the AJAX call to overwrite the current atom with changes.
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

  function dialogDisplayed(value) {
    return;
  }

  var buttonClicked = function buttonClicked(id) {
    location.href = 'ajax-ab/loadAtomForm';
    /*
    if (id == 'atom--new') {
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadAtomForm',
        { component: 'atom'
        },
        dialogDisplayed  // function to call on completion.
      );
      // Run AJAX command to popup node-atom-form
    }
    */
  };

  var loadAtom = function loadAtom (nid) {
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/loadAtom',
      { nid: nid },
      createAtom
    );
  }

  function onSelectAtom(event) {
    // Extract the node id from class nid
    var nid = event.target.id.split('-')[1];
    loadAtom(nid);
    return;
  }

  function extractStructure () {

    function addNucletToStructure(id, spacing) {
      var nuclet = atom.az.nuclets[id];
      var out = spacing + id + ':\n';
      spacing += '  ';
      out += spacing + 'state: ' + nuclet.az.state + '\n';
      if (id !== 'N0') {
        out += spacing + 'attachAngle: ' + nuclet.az.conf.attachAngle + '\n';
      }

      out += spacing + 'protons: ['
      var np = 0;
      for (var i = 0; i < nuclet.az.protons.length; i++) {
        if (nuclet.az.protons[i]) {
          var proton = nuclet.az.protons[i];
          if (proton.az.active && proton.az.visible) {
            if (np++) {
              out += ', ' ;
            }
            out += i;
          }
        }
      }
      out += ']\n';

      var grow0 = atom.az.nuclets[id + '0'];
      var grow1 = atom.az.nuclets[id + '1'];
      if (grow0 || grow1) {
        out += spacing + 'nuclets:\n';
        if (grow0) {
          out += addNucletToStructure(id + '0', spacing + '  ');
        }
        if (grow1) {
          out += addNucletToStructure(id + '1', spacing + '  ');
        }
      }
      return out;
    }

    return addNucletToStructure('N0', '');
  }
  /**
   * Define Drupal behavior attach functions.
   *
   * Nuclet Edit form popup
   *   Attach Listener to "Add nuclet" button
   * Atom Edit form popup
   *   Populate Atomic Structure field with current Viewer contents.
   *
   * @type {{attach: Drupal.behaviors.atomizer_atom.attach}}
   */
  Drupal.behaviors.atomizer_atom = {
    attach: function (context, settings) {
      var value = '';


      // Add Event listeners to atoms to select.
      var selectAtom = document.getElementsByClassName('select-atom');
      if (selectAtom.length) {
        for (var i = 0; i < selectAtom.length; i++) {
          selectAtom[i].addEventListener('click', onSelectAtom, false);
        }
        jQuery('#az-dialog').dialog('option', 'draggable', true);
      }

      // If this is the node-atom-form being opened then fill in the atomic structure field.
      var nodeForm = document.getElementsByClassName('node-atom-form')[0];
      if (nodeForm) {
        var atomicStructure = nodeForm.getElementsByClassName('field--name-field-atomic-structure')[0];
        var textarea = atomicStructure.getElementsByTagName('textarea')[0];
        textarea.value = extractStructure();
      }
    }
  };

  /**
   * Interface to this atomC.
   */
  return {
    saveYml: saveYml,
    overwriteYml: overwriteYml,
    loadAtom: loadAtom,
    changeNucletState: changeNucletState,
    changeNucletAngle: changeNucletAngle,
    az: function () { return atom.az; },
    addProton: addProton,
    addNuclet: addNuclet,
    setValenceRings: setValenceRings,
    buttonClicked: buttonClicked,
    getYmlDirectory: function () { return 'config/atom'; }
  };
};
