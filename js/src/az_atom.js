/**
 * @file - az_atom.js
 *
 * Manage atom's - load, save, create
 */

(function ($) {

  Drupal.atomizer.atomC = function (_viewer) {

    var viewer = _viewer;
    var atom;
    var atomConf;
    var atomInformation = $('.atom--information', viewer.context)[0];
    var atomProperties = $('.atom--properties', viewer.context)[0];
    var $atomSelect = $('.atom-name, .atomic-number');
    var loadCallback;

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
      var id = nuclet.az.id;
      var attachAngle = nuclet.az.attachAngle;
      var parent = nuclet.parent.parent.parent;
      viewer.nuclet.deleteNuclet(nuclet);

      var nucletOuterShell = createNuclet(
        id,
        {state: state, attachAngle: attachAngle},
        parent
      );
      nuclet = nucletOuterShell.children[0].children[0];
      updateValenceRings();
      updateProtonCount();

      return nuclet;
    }

    /**
     * Show/unshow protons on neutral endings
     *
     * @param side
     * @param nuclet
     * @param activate
     * @param show
     */
    function activateNeutralProtons(side, nuclet, activate, show) {
      // Activate/Deactivate the neutral ending protons.
      var np = (side == '0') ? [12,13,14,15,20] : [16,17,18,19,21];
      for (var p = 0; p < np.length; p++) {
        nuclet.az.protons[np[p]].material.visible = show;
        nuclet.az.protons[np[p]].az.visible = show;
        nuclet.az.protons[np[p]].az.active = activate;
      }
    }

    /**
     * Given an id, return corresponding nuclet
     *
     * @param id
     * @returns {null}
     */
    function getNuclet(id) {
      return (atom.az.nuclets[id]) ? atom.az.nuclets[id] : null;
    }

    /**
     * When the user has clicked on an add nuclet button,
     * create the new nuclet with a lithium ending.
     *
     * @param event
     */
    function addNuclet(id) {
      /*  conf = {
       state: 'final',
       attachAngle: 3,
       protons: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
       electrons: [0,1,2,3,4,5]
       }; */

      conf = {
        state: 'lithium',
        attachAngle: 3,
        protons: [10, 1, 4, 5, 3, 11, 9],
        electrons: [0,1,2]
      };

      // Find the parent nuclet
      var parent = atom.az.nuclets[id.slice(0, -1)];

      // Deactivate the neutral protons on the parent nuclet
      activateNeutralProtons(id.charAt(id.length-1), parent, false, false);

      // Create the new nuclet
      var nucletOuterShell = createNuclet(id, conf, parent);
      updateValenceRings();
      updateProtonCount();
      return nucletOuterShell.children[0].children[0];
    }

    /**
     * Delete a nuclet from the current atom.
     *
     * @param id
     */
    function deleteNuclet(id) {
      var nuclet = atom.az.nuclets[id];
      var parent = atom.az.nuclets[id.slice(0, -1)];

      viewer.nuclet.deleteNuclet(nuclet);

      // Activate the neutral ending protons on the parent but don't show.
      activateNeutralProtons(id.charAt(id.length-1), parent, true, false);
      updateValenceRings();
      updateProtonCount();
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
      nuclet.az.attachAngle = nucletConf.attachAngle;
      parent.add(nucletOuterShell);

      // Rotate and position the nuclet onto it's parents grow point.
      if (nuclet.az.id != 'N0') {
        var side = nuclet.az.id.substr(nuclet.az.id.length - 1);
        var parentId = nuclet.az.id.slice(0, -1);
        activateNeutralProtons( side, atom.az.nuclets[parentId], false, false );
        var growId;
        var attachId;
        if (side == 0) {  // left side
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

        var growProton = atom.az.nuclets[parentId].az.protons[growId];
        var growPt = growProton.position.clone();

        // Create normalized axis of vector to rotate to.
        //  The following 4 lines adjust the angle, position and length of the grow axis.
//      var angleOrigin = new THREE.Vector3(0, 31, 0);
//      var origin = new THREE.Vector3(0, 13, 0);
//      growPt.y = growPt.y + 11;
//      var attachScale = 2.28;

        var angleOrigin = new THREE.Vector3(0, 28, 0);
        var origin = new THREE.Vector3(0, 6, 0);
        growPt.y = growPt.y + 11;
        var attachScale = 2.37;

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
        for (var id in nucletConf.nuclets) {
          createNuclet(id, nucletConf.nuclets[id], nuclet);
          activateNeutralProtons(id.charAt(id.length-1), nuclet, false, false);
        }
      }
      return nucletOuterShell;
    }

    /**
     * Execute AJAX command to load a new atom.
     *
     * @param nid
     */
    var loadAtom = function loadAtom (nid, callback) {
      loadCallback = callback;
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadAtom',
        { nid: nid },
        doCreateAtom
      );
    };

    /**
     * Callback from ajax call to load and display an atom.
     *
     * @param results
     */
    var doCreateAtom = function doCreateAtom (results) {
      var az;
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        if (result.command == 'loadAtomCommand') {
          if (atomInformation) {
            atomInformation.innerHTML = result.data.information;
          }
          if (atomProperties) {
            atomProperties.innerHTML = result.data.properties;
          }
          if ($atomSelect.length > 0) {
            $atomSelect.removeClass('atom-active');
            $('.atom-select-' + result.data.nid, viewer.context).addClass('atom-active');
          }
          var $save = $('.atom--save a', viewer.context);
          if ($save.length) {
            $save.replaceWith(result.data.link);
            if (Drupal.attachBehaviors) {
              Drupal.attachBehaviors('.atom--save a');
            }
          }

          if (atom) {
            // Remove any atom's currently displayed
            deleteAtom(atom);
            atom = null;
            az = null;
            viewer.atom.atom = null;
          } else {
            az = {nuclets: {}}
          }

          createAtom(result.data.atomConf['N0']);
          atom.az.nid = result.data.nid;
          viewer.producer.atomLoaded(atom);

          if (loadCallback) {
            loadCallback();
          }
        }
      }
    };

    var createAtom = function createAtom (atomConf) {
      // Create the atom group - create first nuclet, remaining nuclets are created recursively.
      atom = new THREE.Group();
      atom.name = 'atom';
      atom.az = {nuclets: {}};
      viewer.atom.atom = atom;
      createNuclet('N0', atomConf, atom);
      updateValenceRings();
      updateProtonCount();

      viewer.scene.add(atom);
      viewer.render();

      return atom;
    };

    /**
     * Delete an atom - calls recursive function deleteNuclet
     * @param atom
     */
    var deleteAtom = function deleteAtom (atom) {
      for (var n in atom.az.nuclets) {
        viewer.nuclet.deleteNuclet(atom.az.nuclets[n]);
      }
      viewer.scene.remove(atom);
    };

    /**
     * Check all valence rings and color active/inactive rings - count total Active and update atom information.
     */
    function updateValenceRings() {
      var numActive = 0;
      var activeColor = viewer.theme.get('valence-active--color');
      var inactiveColor = viewer.theme.get('valence-inactive--color');
      for (var n in atom.az.nuclets) {
        var nuclet = atom.az.nuclets[n];
        if (nuclet.az.state === 'initial' || nuclet.az.state === 'final') {
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
    }

    /**
     * Show the number of protons
     */
    function updateProtonCount() {
      var numProtons = 0;
      var numNuclets = 0;
      var numUnclassified = 0;
      for (var n in atom.az.nuclets) {
        numNuclets++;
        var nuclet = atom.az.nuclets[n];
        for (var p in nuclet.az.protons) {
          var proton = nuclet.az.protons[p];
          if (!proton.az) {
            numUnclassified++;
          }
          else if (proton.az.visible) {
            numProtons++;
          }
        }
      }

      $('.atom--num-protons .text-value', viewer.context).html(numProtons);
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
      var select = $('.theme--selectyml', viewer.context)[0].querySelector('select');
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
          component: 'theme',
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
          component: 'theme',
          filename: currentSet.filename,
          ymlContents: currentSet },
        null  // TODO: Put in useful error codes and have them be displayed.
      );
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

    $('.atom--select-close').click(function () {
      $(viewer.context).removeClass('select-atom-enabled');
    });

    /**
     * User has selected an atom from the select popup, load the atom.
     *
     * @param event
     */
    function onSelectAtom(event) {
      // Extract the node id from class nid
      loadAtom($(event.target).data('nid'), null);
      event.preventDefault();
    }

    /**
     * Extract the text description of the atom currently displayed.
     *
     * @returns {*}
     */
    function extractStructure () {

      /**
       * Recursive function to extract a nuclets information.
       *
       * @param id
       * @param spacing
       * @returns {string}
       */
      function addNucletToStructure(id, spacing) {
        var nuclet = atom.az.nuclets[id];
        var out = spacing + id + ':\n';
        spacing += '  ';
        out += spacing + 'state: ' + nuclet.az.state + '\n';
        if (id !== 'N0') {
          out += spacing + 'attachAngle: ' + nuclet.az.conf.attachAngle + '\n';
        }

        // Add the protons.
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

        // Recursively add the children nuclets.
        var grow0 = atom.az.nuclets[id + '0'];
        var grow1 = atom.az.nuclets[id + '1'];
        if (grow0 || grow1) {
          out += spacing + 'nuclets:\n';
          if (grow0) { out += addNucletToStructure(id + '0', spacing + '  '); }
          if (grow1) { out += addNucletToStructure(id + '1', spacing + '  '); }
        }
        return out;
      }

      return addNucletToStructure('N0', '');
    }

    function addSelectAtomEventListeners() {
      // Add Event listeners to atoms to select.
      $atomSelect.click(onSelectAtom);
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
        $(context).find('#az-page-select-atom').once('selectAtomAttached').each(function () {
          addSelectAtomEventListeners();
        });


        // If this is the node-atom-form being opened then fill in the atomic structure field.
        var nodeForm = $('.node-atom-form, .node-atom-edit-form')[0];
        if (nodeForm) {
          var atomicStructure = nodeForm.getElementsByClassName('field--name-field-atomic-structure')[0];
          var textarea = atomicStructure.getElementsByTagName('textarea')[0];
          textarea.value = extractStructure();
        }
      }
    };

    addSelectAtomEventListeners();

    /**
     * Interface to this atomC.
     */
    return {
      addNuclet: addNuclet,
      addProton: addProton,
      az: function () { return atom.az; },
      buttonClicked: buttonClicked,
      changeNucletState: changeNucletState,
      changeNucletAngle: changeNucletAngle,
      createAtom: createAtom,
      deleteAtom: deleteAtom,
      deleteNuclet: deleteNuclet,
      getNuclet: getNuclet,
      getYmlDirectory: function () { return 'config/atom'; },
      loadAtom: loadAtom,
      overwriteYml: overwriteYml,
      saveYml: saveYml,
      updateValenceRings: updateValenceRings,
      updateProtonCount: updateProtonCount
    };
  };

})(jQuery);
