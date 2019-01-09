/**
 * @file - az_atom.js
 *
 * Manage atom's - load, save, create
 */

(function ($) {

  Drupal.atomizer.atomC = function (_viewer) {

    var viewer = _viewer;
    var atom;
    var $sceneName = $('.scene--name, .az-scene-name, .az-canvas-labels', viewer.context);
    var atomInformation = $('.atom--information', viewer.context)[0];
    var atomProperties = $('.atom--properties', viewer.context)[0];

    var $atomList = $('#az-select-atom', viewer.content);
    var $atomSelectEnable = $('#atom-select-enable', viewer.context);
    var $atomSelectClose = $atomList.find('.az-close');
    var $atoms = $('.atom-name, .atomic-number', viewer.context);

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
      updateParticleCount();

      return nuclet;
    }

    /**
     * Delete an electron
     *
     * @param electron
     */
    function deleteNElectron(electron) {
      electron.az.selected = false;
      viewer.nuclet.setElectronColor(electron, false, true);
      electron.parent.remove(electron);
      delete electron.az.nuclet.nelectrons[electron.az.id];
    }

    /**
     * Show/unshow protons on neutral endings
     *
     * @param side
     * @param nuclet
     * @param activate
     * @param show
     */
    function activateNeutralParticles(side, nuclet, activate, show) {
      // Activate/Deactivate the neutral ending protons.

      // Neutral ending protons
      var np = (side == '0') ? ['P12','P13','P14','P15'] : ['P16','P17','P18','P19'];
      for (var p = 0; p < np.length; p++) {
        nuclet.az.protons[np[p]].material.visible = show;
        nuclet.az.protons[np[p]].az.visible = show;
        nuclet.az.protons[np[p]].az.active = activate;
      }

      // Neutrons
      for (var n in nuclet.az.neutrons) {
        if (nuclet.az.neutrons.hasOwnProperty(n)) {
          if (n.charAt(1) == side) {
            nuclet.az.neutrons[n].material.visible = false;
            nuclet.az.neutrons[n].az.visible = false;
            nuclet.az.neutrons[n].az.active = activate;
          }
        }
      }

      // Electrons
      if (!activate && nuclet.az.nelectrons) {
        for (var e in nuclet.az.nelectrons) {
          if (nuclet.az.nelectrons.hasOwnProperty(e)) {
            var deleteIt = false;
            // Check to see if any of the protons for this electron are neutral ending protons, if so delete it.
            for (var p = 0; p < np.length; p++) {
              if (np[p] in nuclet.az.nelectrons[e].az.vertices) {
                deleteIt = true;
              }
            }
            if (deleteIt) {
              deleteNElectron(nuclet.az.nelectrons[e]);
            }
          }
        }
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
        protons: {P10: null, P1: null, P4: null, P5: null, P3: null, P11: null, P9: null},
      };

      // Find the parent nuclet
      var parent = atom.az.nuclets[id.slice(0, -1)];

      // Deactivate the neutral protons on the parent nuclet
      activateNeutralParticles(id.charAt(id.length-1), parent, false, false);

      // Create the new nuclet
      var nucletOuterShell = createNuclet(id, conf, parent);
      updateValenceRings();
      updateParticleCount();
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
      activateNeutralParticles(id.charAt(id.length-1), parent, true, false);
      updateValenceRings();
      updateParticleCount();
    }

    /**
     * User has changed the slider to select the attachment angle.
     *
     * @param event
     */
    function changeNucletAngle(id, angle) {
      var nuclet = atom.az.nuclets[id];
      nuclet.parent.rotation.y = (nuclet.parent.initial_rotation_y + ((angle - 1) * 72.2)) / 180 * Math.PI;
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
        var growNuclet = atom.az.nuclets[parentId];
        activateNeutralParticles( side, growNuclet, false, false );
        var growId;
        var attachId;
        if (side == 0) {  // left side
          growId = 'P0';

          // attach on 10
          attachId = 'P10';
          nucletInnerShell.initial_rotation_y = -18;

          // attach on 11
//        attachId = 'P11';
//        nucletInnerShell.initial_rotation_y = -18;
        } else {              // right side
          growId = 'P2';

          // attach on 10
          attachId = 'P10';
          nucletInnerShell.initial_rotation_y = -198;

          // attach on 11
//        attachId = 'P11';
//        nucletInnerShell.initial_rotation_y = -162;
        }

        var growProton = growNuclet.az.protons[growId];
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
        var attachScale;
        if (growNuclet.az.conf.state == 'initial') {
          attachScale = 2.08;
        } else {
          attachScale = 2.37;
        }

        var attachVertice = nuclet.az.protonGeometry.vertices[attachId.replace('P', '')];
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
        nucletInnerShell.rotation.y = (nucletInnerShell.initial_rotation_y + (((nucletConf.attachAngle || 1) - 1) * 72.2)) / 180 *Math.PI;

        // Add attach Axis Lines
        nuclet.az.attachPt = attachPt;
        var opacity = viewer.theme.get('attachLines--opacity');
        var lineGeometry = new THREE.Geometry();
        var constants = viewer.nuclet.getConstants();
        var lineMaterial = new THREE.LineBasicMaterial({
          color: viewer.theme.get('attachLines--color'),
          opacity: opacity,
          transparent: (opacity < viewer.nuclet.getConstants().transparentThresh),
          visible: (opacity > viewer.nuclet.getConstants().visibleThresh),
          linewidth: viewer.theme.get('attachLines--linewidth')
        });
        lineGeometry.vertices[0] = attachPt;
        lineGeometry.vertices[1] = new THREE.Vector3(0,0,0);
        var lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        lines.name = 'attachLines';
        growNuclet.add(lines);
      }

      atom.az.nuclets[nuclet.az.id] = nuclet;

      if (nucletConf.nuclets) {
        for (var id in nucletConf.nuclets) {
          createNuclet(id, nucletConf.nuclets[id], nuclet);
          activateNeutralParticles(id.charAt(id.length-1), nuclet, false, false);
        }
      }
      return nucletOuterShell;
    }

    /**
     * Execute AJAX command to load a new atom.
     *
     * @param nid
     */
    var loadObject = function loadObject (nid, callback) {
      var loadCallback = callback;
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadAtom',
        { nid: nid },
        doCreateAtom
      );

      /**
       * Callback from ajax call to load and display an atom.
       *
       * @param results
       */
      function doCreateAtom (results) {
        var az;
        // Write a PHP program to read in all atoms one by one and convert the proton and electron arrays to associative arrays?
        // Don't use javascript for it.
        // Query all atoms using the atom query thing
        //   Read in the atom
        //   Convert the arrays
        //   Save the atom
        for (var i = 0; i < results.length; i++) {
          var result = results[i];
          if (result.command == 'loadAtomCommand') {
            if ($sceneName) {
              $sceneName.html(result.data.atomTitle);
            }
            if (atomInformation) {
              atomInformation.innerHTML = result.data.information;
            }
            if (atomProperties) {
              atomProperties.innerHTML = result.data.properties;
            }
            if ($atoms.length > 0) {
              $atoms.removeClass('atom-active');
              $('.atom-select-' + result.data.nid, viewer.context).addClass('atom-active');
            }
            var $save = $('.atom--save a', viewer.context);
            if ($save.length) {
              $save.replaceWith(result.data.link);
              if (Drupal.attachBehaviors) {
                Drupal.attachBehaviors($save[0]);
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
            atom.az.name = result.data.atomName;
            atom.az.title = result.data.atomTitle;

            // Move atom position
            if (viewer.dataAttr['atom--position--x']) {
              if (!atom.position) atom.position = new THREE.Vector3();
              atom.position.x = viewer.dataAttr['atom--position--x'];
            }
            if (viewer.dataAttr['atom--position--y']) {
              if (!atom.position) atom.position = new THREE.Vector3();
              atom.position.y = viewer.dataAttr['atom--position--y'];
            }
            if (viewer.dataAttr['atom--position--z']) {
              if (!atom.position) atom.position = new THREE.Vector3();
              atom.position.z = viewer.dataAttr['atom--position--z'];
            }

//        if (!atom.rotation) atom.rotation = new THREE.Vector3();
//        atom.rotation.x =  30 / 360 * 2 * Math.PI;
//        atom.rotation.z = -45 / 360 * 2 * Math.PI;

            // Rotate atom
            if (viewer.dataAttr['atom--rotation--x']) {
              if (!atom.rotation) atom.rotation = new THREE.Vector3();
              atom.rotation.x = viewer.dataAttr['atom--rotation--x'] * Math.PI / 180;
            }
            if (viewer.dataAttr['atom--rotation--y']) {
              if (!atom.rotation) atom.rotation = new THREE.Vector3();
              atom.rotation.y = viewer.dataAttr['atom--rotation--y'] * Math.PI / 180;
            }
            if (viewer.dataAttr['atom--rotation--z']) {
              if (!atom.rotation) atom.rotation = new THREE.Vector3();
              atom.rotation.z = viewer.dataAttr['atom--rotation--z'] * Math.PI / 180;
            }
            viewer.producer.objectLoaded(atom);
            viewer.render();

            if (loadCallback) {
              loadCallback();
            }
          }
        }
      };
    };

    /**
     * Create an atom, most of the work is a call to the recursive function createNuclet.
     *
     * @param atomConf
     * @returns {THREE.Group|*}
     */
    var createAtom = function createAtom (atomConf) {
      // Create the atom group - create first nuclet, remaining nuclets are created recursively.
      atom = new THREE.Group();
      atom.name = 'atom';
      atom.az = {nuclets: {}};
      viewer.atom.atom = atom;
      createNuclet('N0', atomConf, atom);
      updateValenceRings();
      updateParticleCount();

      var explode = viewer.theme.get('attachLines--scale');
      if (explode != 1) {
        explodeAtom(explode);
      }

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

    var explodeAtom = function explodeAtom(scale) {
      for (var n in atom.az.nuclets) {
        var nuclet = atom.az.nuclets[n];
        if (nuclet.az.id !== 'N0') {
          nuclet.parent.parent.position.set(
            nuclet.az.attachPt.x * scale,
            nuclet.az.attachPt.y * scale,
            nuclet.az.attachPt.z * scale
          );
        }
      }
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
     * Show the number of protons and electrons
     */
    function updateParticleCount() {
      var numProtons = 0;
      var numElectrons = 0;
      var numNuclets = 0;
      var numUnclassified = 0;
      for (var n in atom.az.nuclets) {
        numNuclets++;
        var nuclet = atom.az.nuclets[n];

        // Add protons
        for (var p in nuclet.az.protons) {
          var proton = nuclet.az.protons[p];
          if (!proton.az) {
            numUnclassified++;
          }
          else if (proton.az.visible) {
            numProtons++;
          }
        }

        // Add neutrons
        for (var p in nuclet.az.neutrons) {
          if (nuclet.az.neutrons.hasOwnProperty(p)) {
            var neutron = nuclet.az.neutrons[p];
            if (neutron.az.visible) {
              numProtons++;
            }
          }
        }

        // Add NElectrons
        for (var p in nuclet.az.nelectrons) {
          numElectrons++;
        }
      }

      $('.atom--num-protons .text-value', viewer.context).html(numProtons);
      $('.atom--num-electrons .text-value', viewer.context).html(numElectrons);
    }

    /**
     * Cycle through all atoms, calculate their BE, save it to Drupal.
     */
    var running = false;
    function calculateAllBindingEnergies(event) {
      if (running) {
        running = false;
        $(event.target).removeClass('az-selected');
      } else {
        running = true;
        $(event.target).addClass('az-selected');
        var $isotopes = $('.isotope', viewer.context);
        var lastIsotope = $isotopes.length;
        var isotope = 0;

        var $isotope = $($isotopes[isotope]);
        var nid = $isotope.data('nid');
        loadObject (nid, displayAtom);
      }

      function displayAtom() {
        console.log('Save Atom ' + nid);

        var be_sam = $('.atom--binding-sam--value',viewer.context).html();
        var be_accuracy = $('.atom--binding-accuracy--value',viewer.context).html();
        if (be_sam != '0') {
          Drupal.atomizer.base.doAjax(
              '/ajax-ab/saveAtom',
              { nid: nid,
                be_sam: be_sam,
                be_accuracy: be_accuracy
              },
              null  // No callback - assume it saved okay.
          );
        }
        // Save the binding energy to Drupal
        if (++isotope < lastIsotope && running) {
          setTimeout(function() {
            $isotope = $($isotopes[isotope]);
            nid = $isotope.data('nid');
            loadObject (nid, displayAtom);
          }, 10);
        } else {
          $(event.target).removeClass('az-selected');
        }
      }
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
    var buttonClicked = function buttonClicked(event) {
      // User pressed Select Atom button
      if (event.target.id == 'atom--select') {
        $(viewer.context).toggleClass('select-atom-enabled', viewer.context);
      }

      // User pressed button to view binding energies
      if (event.target.id == 'atom--be-button') {
        var $bindingEnergy = $('.binding-energy-wrapper', viewer.context);
        if ($(event.target).hasClass('az-selected')) {
          $(event.target).removeClass('az-selected');
          $bindingEnergy.addClass('az-hidden');
        } else {
          $(event.target).addClass('az-selected');
          $bindingEnergy.removeClass('az-hidden');
        }
        event.preventDefault();
      }
      // User pressed button to view binding energies
      if (event.target.id == 'atom--calc-button') {
        event.preventDefault();
        calculateAllBindingEnergies(event);
      }
    };

    // Set up event handler when user closes atom-select button
    $('.atom--select-close').click(function () {
      $(viewer.context).removeClass('select-atom-enabled');
    });

    /**
     * Extract the text description of the current atom currently displayed.
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
        if (nuclet.az.protons) {
          var nl = 0;
          for (var p in nuclet.az.protons) {
            if (nuclet.az.protons.hasOwnProperty(p)) {
              var proton = nuclet.az.protons[p];
              if (proton.az.active && proton.az.visible) {
                if (nl++ == 0) {
                  out += spacing + 'protons:\n';
                }
                out += spacing + '  ' + p + ':';
                if (proton.az.tmpColor) {
                  args = proton.az.tmpColor.name.split('-');
                  out += ' {color: ' + args[1] + '}';
                }
                out += '\n';
              }
            }
          }
        }

        // Add the neutrons.
        nl = 0;
        for (var e in nuclet.az.neutrons) {
          if (nuclet.az.neutrons.hasOwnProperty(e) && nuclet.az.neutrons[e].az.visible) {
            out += (nl++ == 0) ? spacing + 'neutrons: [' : ', ';
            out += nuclet.az.neutrons[e].az.id;
          }
        }
        if (nl) out += ']\n';

        // Add the nelectrons.
        if (nuclet.az.nelectrons) {
          nl = 0;
          for (var e in nuclet.az.nelectrons) {
            if (nuclet.az.nelectrons.hasOwnProperty(e)) {
              var electron = nuclet.az.nelectrons[e];
              if (nl++ == 0) {
                out += spacing + 'electrons:\n';
              }
              var num = (nl < 10) ? '0' + nl : nl;
              out += spacing + '  E' + num + ': {protons: [';
              var np = 0;
              for (var v = 0; v < electron.az.vertices.length; v++) {
                if (np++ != 0) out += ', ';
                out += electron.az.vertices[v];
              }
              if (np) out += ']}\n';
            }
          }
        }

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

    /**
     *
     */
    function addIsotopeEnableEventListeners () {
      $('.num-isotopes').click(function () {
        var $isotopes = $(this).parent().siblings('.isotopes');
        if ($isotopes.hasClass('az-closed')) {
          $(this).removeClass('az-closed');
          $isotopes.removeClass('az-closed');
        } else {
          $(this).addClass('az-closed');
          $isotopes.addClass('az-closed');
        }
      });
    }

    /**
     * Add event listeners for when a user selects an atom.
     */
    function addSelectAtomEventListeners() {
      // Add Event listeners to atoms to select.
      $atoms.click(function (event) {
        loadObject($(event.target).data('nid'), null);
        if (viewer.getDisplayMode() == 'mobile' ||
            viewer.getDisplayMode() == 'tablet') {
          $atomList.addClass('az-hidden');
        }
        event.preventDefault();
      });


      $atomSelectEnable.click(function () {
        if ($atomList.hasClass('az-hidden')) {
          $atomList.removeClass('az-hidden');
        } else {
          $atomList.addClass('az-hidden');
        }
      });

      $atomSelectClose.click(function () {
        $atomList.addClass('az-hidden');
      })
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
        $(context).find('#az-select-atom').once('selectAtomAttached').each(function () {
          addIsotopeEnableEventListeners();
          addSelectAtomEventListeners();
        });


        // If this is the node-atom-form being opened then fill in the atomic structure field.
        var $nodeForm = $('.node-atom-form, .node-atom-edit-form');
        if ($(context).hasClass('node-atom-edit-form') || $(context).hasClass('node-atom-form')) {

          var $textarea = $nodeForm.find('.field--name-field-atomic-structure textarea');
          $textarea.val(extractStructure());

          var protons = $('.atom--num-protons--value').html();
          $nodeForm.find('.field--name-field__protons input').val(protons);

          var electrons = $('.atom--num-electrons--value').html();
          $nodeForm.find('.field--name-field__electrons input').val(electrons);

          var be_calc = $('.atom--binding-sam--value').html();
          $nodeForm.find('.field--name-field-be-sam input').val(be_calc);

          var be_accuracy = $('.atom--binding-accuracy--value').html().replace('%','');
          var $fart = $nodeForm.find('.field--name-field-be-accuracy input');
          $nodeForm.find('.field--name-field-be-accuracy input').val(be_accuracy);
        }
      }
    };

    addIsotopeEnableEventListeners();
    addSelectAtomEventListeners();

    /**
     * Interface to this atomC.
     */
    return {
      addNuclet: addNuclet,
      addProton: addProton,
      deleteNElectron: deleteNElectron,
      az: function () { return atom.az; },
      buttonClicked: buttonClicked,
      changeNucletState: changeNucletState,
      changeNucletAngle: changeNucletAngle,
      createAtom: createAtom,
      deleteAtom: deleteAtom,
      deleteNuclet: deleteNuclet,
      explodeAtom: explodeAtom,
      getNuclet: getNuclet,
      getYmlDirectory: function () { return 'config/atom'; },
      loadObject: loadObject,
      overwriteYml: overwriteYml,
      saveYml: saveYml,
      updateValenceRings: updateValenceRings,
      updateParticleCount: updateParticleCount
    };
  };

})(jQuery);
