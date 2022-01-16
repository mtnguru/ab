/**
 * @file - az_atom.js
 *
 * Manage atom's - load, save, create
 */

(function ($) {

  Drupal.atomizer.atomC = function (_viewer) {

    let viewer = _viewer;
    var constants = Drupal.atomizer.base.constants;

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
      let id = nuclet.az.id;
      let atom = nuclet.az.atom;
      let attachAngle = nuclet.az.attachAngle;
      let fizzer = nuclet.az.fizzer;
      let parent = nuclet.parent.parent.parent;
      viewer.nuclet.deleteNuclet(nuclet);

      let nucletOuterShell = createNuclet(
        atom,
        id,
        {state: state, attachAngle: attachAngle},
        parent
      );
      nuclet = nucletOuterShell.children[0].children[0];
      updateValenceRings(atom);
      updateParticleCount(atom);
      updateSamLines(atom);

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
      let np = (side == '0') ? ['P12','P13','P14','P15'] : ['P16','P17','P18','P19'];
      for (let p = 0; p < np.length; p++) {
        nuclet.az.protons[np[p]].material.visible = show;
        nuclet.az.protons[np[p]].az.visible = show;
        nuclet.az.protons[np[p]].az.active = activate;
      }

      // Neutrons
      for (let n in nuclet.az.neutrons) {
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
        for (let e in nuclet.az.nelectrons) {
          if (nuclet.az.nelectrons.hasOwnProperty(e)) {
            let deleteIt = false;
            // Check to see if any of the protons for this electron are neutral ending protons, if so delete it.
            for (let p = 0; p < np.length; p++) {
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
    function getNuclet(atom, id) {
      return (atom.az.nuclets[id]) ? atom.az.nuclets[id] : null;
    }

    /**
     * When the user has clicked on an add nuclet button,
     * create the new nuclet with a lithium ending.
     *
     * @param event
     */
    function addNuclet(atom, id) {
      /*  conf = {
       state: 'final',
       attachAngle: 3,
       protons: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
       electrons: [0,1,2,3,4,5]
       }; */

      conf = {
        state: 'lithium',
        attachAngle: 3,
        fizzer: 1,
        protons: {P10: null, P1: null, P4: null, P5: null, P3: null, P11: null, P9: null},
      };

      // Find the parent nuclet
      let parent = atom.az.nuclets[id.slice(0, -1)];

      // Deactivate the neutral protons on the parent nuclet
      activateNeutralParticles(id.charAt(id.length-1), parent, false, false);

      // Create the new nuclet
      let nucletOuterShell = createNuclet(atom, id, conf, parent);
      updateValenceRings(atom);
      updateParticleCount(atom);
      updateSamLines(atom);
      return nucletOuterShell.children[0].children[0];
    }

    /**
     * Delete a nuclet from the current atom.
     *
     * @param id
     */
    function deleteNuclet(nuclet) {
      let id = nuclet.az.id;
      let atom = nuclet.az.atom;
      let parentNuclet = nuclet.az.atom.az.nuclets[id.slice(0, -1)];

      viewer.nuclet.deleteNuclet(nuclet);

      // Activate the neutral ending protons on the parent but don't show.
      activateNeutralParticles(id.charAt(id.length-1), parentNuclet, true, false);
      updateValenceRings(atom);
      updateParticleCount(atom);
      updateSamLines(atom);
    }

    /**
     * User has changed the slider to select the attachment angle.
     *
     * @param event
     */
    function changeNucletAngle(nuclet, angle) {
      nuclet.parent.rotation.y = (nuclet.parent.initial_rotation_y + ((angle - 1) * 72.2)) / 180 * Math.PI;
      nuclet.az.conf.attachAngle = angle;
    }

    function changeNucletFizzer(nuclet, scale) {
      nuclet.parent.parent.position.set(
        nuclet.az.attachPt.x * scale,
        nuclet.az.attachPt.y * scale,
        nuclet.az.attachPt.z * scale
      );
    }

    /**
     * Create a nuclet and rotate it into position.
     *
     * @param nucletConf
     */
    function createNuclet(atom, id, nucletConf, parent) {
      // Create Nuclet - get references to nuclet and shells
      let nucletOuterShell = viewer.nuclet.createNuclet(id, nucletConf);
      let nucletInnerShell = nucletOuterShell.children[0];
      let nuclet = nucletOuterShell.children[0].children[0];
      nuclet.az.attachAngle = nucletConf.attachAngle;
      nuclet.az.fizzer = nucletConf.fizzer;
      nuclet.az.atom = atom;
      parent.add(nucletOuterShell);

      // Rotate and position the nuclet onto it's parents grow point.
      if (nuclet.az.id != 'N0') {
        let side = nuclet.az.id.substr(nuclet.az.id.length - 1);
        let parentId = nuclet.az.id.slice(0, -1);
        let growNuclet = atom.az.nuclets[parentId];
        activateNeutralParticles( side, growNuclet, false, false );
        let growId;
        let attachId;
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

        let growProton = growNuclet.az.protons[growId];
        let growPt = growProton.position.clone();

        // Create normalized axis of vector to rotate to.
        //  The following 4 lines adjust the angle, position and length of the grow axis.
//      let angleOrigin = new THREE.Vector3(0, 31, 0);
//      let origin = new THREE.Vector3(0, 13, 0);
//      growPt.y = growPt.y + 11;
//      let attachScale = 2.28;

        let angleOrigin = new THREE.Vector3(0, 28, 0);
        let origin = new THREE.Vector3(0, 6, 0);
        growPt.y = growPt.y + 11;
        let attachScale;
        if (growNuclet.az.conf.state == 'initial') {
          attachScale = 2.08;
        } else {
          attachScale = 2.37;
        }

        let attachVertice = nuclet.az.protonGeometry.vertices[attachId.replace('P', '')];
        let initialAxis = attachVertice.clone().normalize();
        let alignAxis = new THREE.Vector3(0, 1, 0);
        let attachAxis = angleOrigin.clone().sub(growPt);
        let attachLen = attachAxis.length();
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
        let attachPt = origin.clone().add(attachAxis.multiplyScalar(-attachLen * attachScale));
        nucletOuterShell.position.set(attachPt.x, attachPt.y, attachPt.z);

        // Set the initial y rotation
        nucletInnerShell.rotation.y = (nucletInnerShell.initial_rotation_y + (((nucletConf.attachAngle || 1) - 1) * 72.2)) / 180 *Math.PI;

        // Add attach Axis Lines
        nuclet.az.attachPt = attachPt;
        let opacity = viewer.theme.get('attachLines--opacity');
        let lineGeometry = new THREE.Geometry();
        let constants = viewer.nuclet.getConstants();
        let lineMaterial = new THREE.LineBasicMaterial({
          color: viewer.theme.get('attachLines--color'),
          opacity: opacity,
          transparent: (opacity < viewer.nuclet.getConstants().transparentThresh),
          visible: (opacity > viewer.nuclet.getConstants().visibleThresh),
          linewidth: viewer.theme.get('attachLines--linewidth')
        });
        lineGeometry.vertices[0] = attachPt;
        lineGeometry.vertices[1] = new THREE.Vector3(0,0,0);
        let lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        lines.name = 'attachLines';
        growNuclet.add(lines);
      }

      atom.az.nuclets[nuclet.az.id] = nuclet;

      if (nucletConf.nuclets) {
        for (let id in nucletConf.nuclets) {
          createNuclet(atom, id, nucletConf.nuclets[id], nuclet);
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
    let loadObject = function loadObject (conf, callback) {
      let loadCallback = callback;
      Drupal.atomizer.base.doAjax(
        '/ajax/loadAtom',
        { conf: conf },
        doCreateAtom,
        loadObjectError
      );

      function loadObjectError(response) {
        alert(`ERROR: ${response.responseText} - ${response.statusText}`);
      }

      /**
       * Callback from ajax call to load and display an atom.
       *
       * @param results
       */
      function doCreateAtom (results) {
        //   Read in the atom
        //   Convert the arrays
        // Write a PHP program to read in all atoms one by one and convert the proton and electron arrays to associative arrays?
        // Don't use javascript for it.
        // Query all atoms using the atom query thing
        //   Save the atom
        for (let i = 0; i < results.length; i++) {
          let result = results[i];
          if (result.command == 'loadAtomCommand') {
// @TODO - move this to az_atom_select.js - needs rewriting
//          if ($atoms.length > 0) {
//            $atoms.removeClass('atom-active');
//            $('.atom-select-' + result.data.nid, viewer.context).addClass('atom-active');
//          }

            let $save = $('.atom--save a', viewer.context);
            if ($save.length) {
              $save.replaceWith(result.data.link);
              if (Drupal.attachBehaviors) {
                Drupal.attachBehaviors($save[0]);
              }
            }

            let atom = createAtom(result.data.atomConf['N0']);
            atom.az.nid = result.data.conf.nid;
            atom.az.id = result.data.conf.id;
            atom.az.name = result.data.atomName;
            atom.az.element = result.data.element;
            atom.az.atomicNumber = result.data.atomicNumber;
            atom.az.defaultAtom = result.data.defaultAtom;
            atom.az.title = result.data.atomTitle;
            atom.az.link = result.data.link;
            atom.az.conf = result.data.conf;
            atom.az.information = result.data.information;
            atom.az.properties = result.data.properties;
            atom.az.intersect = {
              visibleParticles: [],
              visibleProtons: [],
              visibleNElectrons: [],
              hoverInnerFaces: [],
              hoverOuterFaces: [],
              optionalProtons: [],
            };

            updateValenceRings(atom);
            updateParticleCount(atom);
            updateSamLines(atom);

            if (result.data.boundingSphere) {
              let bs = result.data.boundingSphere;
              var opacity = viewer.theme.get('atom-spherical--opacity') || 0;
              var volume = Drupal.atomizer.base.makeObject(
                'proton',
                {
                  phong: {
                    color: viewer.theme.get('atom-spherical--color'),
                    opacity: opacity,
                    transparent: (opacity < constants.transparentThresh),
                    visible: (opacity > constants.visibleThresh)
                  }
                },
                {
//                scale: viewer.theme.get('nuclet-volume--scale'),
                  radius: bs.radius,
                },
                new THREE.Vector3(),
                Drupal.atomizer.constants.protonGeometry
              );
              volume.position.set(bs.x, bs.y, bs.z);
              volume.name = 'atom-spherical';
              atom.add(volume);
            }


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
            /*
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
            */

            viewer.producer.objectLoaded(atom);

            if (loadCallback) {
              loadCallback(atom);
            }
          }
        }
      }
    };

    /**
     * Create an atom, most of the work is a call to the recursive function createNuclet.
     *
     * @param atomConf
     * @returns {THREE.Group|*}
     */
    const createAtom = function createAtom (atomConf) {
      // Create the atom group - create first nuclet, remaining nuclets are created recursively.
      let atom = new THREE.Object3D();
      atom.name = 'atom';
      atom.az = {nuclets: {},
                 pelectrons: {}};
      createNuclet(atom, 'N0', atomConf, atom);

      let explode = viewer.theme.get('attachLines--scale');
      if (explode > 1) {
        explodeAtom(atom, explode);
      }

      return atom;
    };

    /**
     * Delete an atom - calls recursive function deleteNuclet
     * @param atom
     */
    deleteObject = function deleteObject (atom) {
      for (let n in atom.az.nuclets) {
        viewer.nuclet.deleteNuclet(atom.az.nuclets[n]);
      }
      viewer.scene.remove(atom);
    };

    const explodeAtom = function explodeAtom(atom, scale) {
      for (let n in atom.az.nuclets) {
        let nuclet = atom.az.nuclets[n];
        if (nuclet.az.id !== 'N0') {
          explodeNuclet(nuclet, scale);
        }
      }
    };

    const explodeNuclet = function explodeAtom(nuclet, scale) {
      nuclet.parent.parent.position.set(
        nuclet.az.attachPt.x * scale,
        nuclet.az.attachPt.y * scale,
        nuclet.az.attachPt.z * scale
      );
    };

    function highlight(atom, highlight) {
      highlight = highlight || false;
      atom.az.highlight = highlight;
      /*
      for (let id in nuclet.az.protons) {
        if (nuclet.az.protons.hasOwnProperty(id)) {
          setProtonColor(nuclet.az.protons[id], null, highlight);
        }
      }
      */
    }

    /**
     * Check all valence rings and color active/inactive rings - count total Active and update atom information.
     */
    function updateValenceRings(atom) {
      let numActive = 0;
      let activeColor = viewer.theme.get('valence-active--color');
      let inactiveColor = viewer.theme.get('valence-inactive--color');
      for (let n in atom.az.nuclets) {
        let nuclet = atom.az.nuclets[n];
        if (nuclet.az.state === 'initial' || nuclet.az.state === 'final') {
          for (let r in nuclet.az.rings) {
            if (!nuclet.az.rings.hasOwnProperty(r)) continue;
            let ring = nuclet.az.rings[r];
            let gid = nuclet.az.id + ring.az.grow;
            let color = activeColor;
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
    function updateParticleCount(atom) {
      let numProtons = 0;
      let numElectrons = 0;
      let numNuclets = 0;
      let numUnclassified = 0;
      for (let n in atom.az.nuclets) {
        numNuclets++;
        let nuclet = atom.az.nuclets[n];

        // Add protons
        for (let p in nuclet.az.protons) {
          let proton = nuclet.az.protons[p];
          if (!proton.az) {
            numUnclassified++;
          }
          else if (proton.az.visible) {
            numProtons++;
          }
        }

        // Add neutrons
        for (let p in nuclet.az.neutrons) {
          if (nuclet.az.neutrons.hasOwnProperty(p)) {
            let neutron = nuclet.az.neutrons[p];
            if (neutron.az.visible) {
              numProtons++;
            }
          }
        }

        // Add NElectrons
        for (let p in nuclet.az.nelectrons) {
          numElectrons++;
        }
      }

      $('.atom--num-protons .text-value', viewer.context).html(numProtons);
      $('.atom--num-electrons .text-value', viewer.context).html(numElectrons);
    }

    function updateSamLines(atom) {
      let lines = calculateSamLines(atom);
      Drupal.atomizer.base.doAjax(
        '/ajax/saveBindingEnergy',
        {
          name: atom.az.name,
          nid: atom.az.conf.nid,
          lines: lines,
        },
        null // No callback function
      );
    }


    /**
     * Cycle through all atoms, calculate their BE, save it to Drupal.
     */
    let running = false;
    function calculateAllBindingEnergies(event) {
      let lastIsotope;
      let isotope = 0;
      let $isotopes = $('.isotope', viewer.context);
      if (running) {
        running = false;
        $(event.target).removeClass('az-selected');
      } else {
        running = true;
        $(event.target).addClass('az-selected');
        let $isotopes = $('.isotope', viewer.context);
        lastIsotope = $isotopes.length;

        $isotope = $($isotopes[isotope]);
        let nid = $isotope.find('.atom-name').data('nid');
        loadObject ({nid: nid}, displayAtom);
      }

      function displayAtom() {
        console.log('Save Atom ' + nid);

        let be_sam_nuclets = $('.atom--be-sam-nuclets--value',viewer.context).html();
        let be_sam_nuclets_perc = $('.atom--be-sam-nuclets-perc--value',viewer.context).html();
        // Save the binding energy to Drupal
        if (be_sam_nuclets != '0') {
          Drupal.atomizer.base.doAjax(
              '/ajax/saveAtom',
              { nid: nid,
                be_sam_nuclets: be_sam_nuclets,
                be_sam_nuclets_perc: be_sam_nuclets_perc
              },
              null  // No callback - assume it saved okay.
          );
        }
        if (++isotope < lastIsotope && running) {
//        setTimeout(function() {
            $isotope = $($isotopes[isotope]);
            nid = $isotope.find('.atom-name').data('nid');
            loadObject ({nid: nid}, displayAtom);
//        }, 10);
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
    const addProton = function addProton (nuclet, face) {
      // Ok, so we have our first proton to add.  We are adding it to an existing nuclet.
    };

    /**
     * The atom has been saved, display a message to the user. @TODO
     *
     * @param response
     */
    let savedYml = function (response) {
      let select = $('.theme--selectyml', viewer.context)[0].querySelector('select');
      // Remove current options
    }

    /**
     * Initiate the AJAX call to save the current atom as a new atom.
     *
     * @param controls
     */
    const saveYml = function (controls) {
      // Verify they entered a name.  If not popup an alert. return
      currentSet.name = controls.name;
      currentSet.filename = controls.filename;
    };

    /**
     * Initiate the AJAX call to overwrite the current atom with changes.
     *
     * @param controls
     */
    const overwriteYml = function (controls) {
      // Verify they entered a name.  If not popup an alert. return
      Drupal.atomizer.base.doAjax(
        '/ajax/saveYml',
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
    const buttonClicked = function buttonClicked(event) {

      // User pressed button to view binding energies
      if (event.target.id == 'atom--sam-lines-button') {
        let $bindingEnergy = $('.sam-lines-wrapper', viewer.context);
        if ($(event.target).hasClass('az-selected')) {
          $(event.target).removeClass('az-selected');
          $bindingEnergy.addClass('az-hidden');
        } else {
          $(event.target).addClass('az-selected');
          $bindingEnergy.removeClass('az-hidden');
        }
        event.preventDefault();
      }
      // User pressed button to calculate all binding energies
      if (event.target.id == 'atom--calc-button') {
        event.preventDefault();
        calculateAllBindingEnergies(event);
      }
    };

    function deleteAtomImages () {
      Drupal.atomizer.base.doAjax(
        '/ajax/deleteAtomImages',
        { command: 'deleteAtomImages' },
        null  // TODO: Put in useful error codes and have them be displayed.
      );
    }

    function saveWorldCoordinates (atom) {
      let objects = [];
      let position = new THREE.Vector3();
      let world = new THREE.Vector3();
      let numProtons = 0;

      /**
       * Recursive function to extract particle 3d coordinates
       *
       * @param id
       * @returns {string}
       */
      function addNucletToCoordinates(id) {
        let nuclet = atom.az.nuclets[id];
        world = nuclet.getWorldPosition();
        objects.push([
          atom.az.name,
//        'atomic number',
//        'number protons',
          'nuclet',
          id,
          nuclet.az.state,
          id,
          world.x,
          world.y,
          world.z,
          nuclet.position.x,
          nuclet.position.y,
          nuclet.position.z,
        ]);

        // Add the protons.
        if (nuclet.az.protons) {
          for (let p in nuclet.az.protons) {
            if (nuclet.az.protons.hasOwnProperty(p)) {
              let proton = nuclet.az.protons[p];
              position.set(proton.position.x, proton.position.y, proton.position.z);
              world = proton.getWorldPosition();
              if (proton.az.active && proton.az.visible) {
                numProtons++;
                objects.push([
                  atom.az.name,
//                'atomic number',
//                'number protons',
                  'proton',
                  id,
                  nuclet.az.state,
                  p,
                  world.x,
                  world.y,
                  world.z,
                  proton.position.x,
                  proton.position.y,
                  proton.position.z,
                ]);
              }
            }
          }
        }

        // Add the neutrons.
        if (nuclet.az.neutrons) {
          for (let n in nuclet.az.neutrons) {
            if (nuclet.az.neutrons.hasOwnProperty(n) && nuclet.az.neutrons[n].az.visible) {
              let neutron = nuclet.az.neutrons[n];
              numProtons++;
              world = neutron.getWorldPosition();
              objects.push([
                atom.az.name,
//              'atomic number',
//              'number protons',
                'neutron',
                id,
                nuclet.az.state,
                n,
                world.x,
                world.y,
                world.z,
                neutron.position.x,
                neutron.position.y,
                neutron.position.z,
              ]);
            }
          }
        }

        // Add the nelectrons.
        if (nuclet.az.nelectrons) {
          for (let e in nuclet.az.nelectrons) {
            if (nuclet.az.nelectrons.hasOwnProperty(e)) {
              let electron = nuclet.az.nelectrons[e];
              position.set(
                electron.children[0].position.x,
                electron.children[0].position.y,
                electron.children[0].position.z
              );
              world = electron.children[0].getWorldPosition();
              objects.push([
                atom.az.name,
//              'atomic number',
//              'number protons',
                'electron',
                id,
                nuclet.az.state,
                e,
                world.x,
                world.y,
                world.z,
                electron.children[0].position.x,
                electron.children[0].position.y,
                electron.children[0].position.z,
              ]);
            }
          }
        }

        // Recursively add the children nuclets.
        let grow0 = atom.az.nuclets[id + '0'];
        let grow1 = atom.az.nuclets[id + '1'];
        if (grow0 || grow1) {
          if (grow0) { addNucletToCoordinates(id + '0'); }
          if (grow1) { addNucletToCoordinates(id + '1'); }
        }
      }

      // Start with the N0 nuclet, build yml text recursively.
      console.log('calculateWorldCoordinates - addNucletToCoordinates(N0)');

      objects.push([
        'Element',
        // 'Atomic Number',
        // '# Protons',
        'Type',
        'Nuclet ID',
        'Nuclet Type',
        'Particle ID',
        'X',
        'Y',
        'Z',
        'Xn',
        'Yn',
        'Zn',
      ]);

      atom.updateMatrixWorld();

      addNucletToCoordinates('N0', '');

      Drupal.atomizer.base.doAjax(
        '/ajax/saveCoordinates',
        {
          name: atom.az.name,
          nid: atom.az.conf.nid,
          atomicNumber: atom.az.atomicNumber,
          numProtons: numProtons,
          defaultAtom: atom.az.defaultAtom,
          component: 'atom',
          coordinates: objects },
        savedCoordinates
      );
      return objects;
    }

    function calculateSamLines (atom) {
      let lines = 0;

      /**
       * Recursive function to extract particle 3d coordinates
       *
       * @param id
       * @returns {string}
       */
      function addNucletSamLines(id) {
        let nuclet = atom.az.nuclets[id];
        let nucletLines = 0;
        let neutrons = 0;
        let protons = 0;

        // Add the protons.
        if (nuclet.az.protons) {
          for (let p in nuclet.az.protons) {
            if (nuclet.az.protons.hasOwnProperty(p)) {
              let proton = nuclet.az.protons[p];
              if (proton.az.visible) {
                protons++;
              }
            }
          }
        }

        // Add the neutrons.
        if (nuclet.az.neutrons) {
          for (let n in nuclet.az.neutrons) {
            if (nuclet.az.neutrons.hasOwnProperty(n) ) {
              let neutron = nuclet.az.neutrons[n];
              if (neutron.az.visible) {
                let neutron = nuclet.az.neutrons[n];
                neutrons++;
              }
            }
          }
        }

        switch (nuclet.az.state) {
          case 'lithium':
            nucletLines += 24;
            break;
          case 'beryllium':
            nucletLines += 32;
            break;
          case 'boron10':
            nucletLines += 40;
            break;
          case 'boron11':
            nucletLines += 40;
            break;
          case 'carbon':
            nucletLines += 41;
            break;
          case 'initial':
            if (id == 'N0') {
              nucletLines += 41;
            } else {
              nucletLines += 45;
            }
            break;
          case 'final':
            if (id == 'N0') {
              nucletLines += 41;
            } else {
              nucletLines += 45;
            }
            break;
          default:
            break;
        }

        lines += nucletLines;


        // Recursively add the children nuclets.
        let grow0 = atom.az.nuclets[id + '0'];
        let grow1 = atom.az.nuclets[id + '1'];
        if (grow0 || grow1) {
          if (grow0) { addNucletSamLines(id + '0'); }
          if (grow1) { addNucletSamLines(id + '1'); }
        }
      }

      // Start with the N0 nuclet, build yml text recursively.
      console.log('calculateSamLines - addNucletSamLines(N0)');

      addNucletSamLines('N0', '');

      return lines;
    }

    let savedCoordinates = function (response) {
//    let select = $('.theme--selectyml', viewer.context)[0].querySelector('select');
      // Remove current options
    };

    /**
     * Extract the text description of the current atom currently displayed.
     *
     * @returns {*}
     */
    function extractStructure (atom) {

      /**
       * Recursive function to extract a nuclets information.
       *
       * @param id
       * @param spacing
       * @returns {string}
       */
      function addNucletToStructure(id, spacing) {
        let nuclet = atom.az.nuclets[id];
        let out = spacing + id + ':\n';
        spacing += '  ';
        out += spacing + 'state: ' + nuclet.az.state + '\n';
        if (id !== 'N0') {
          out += spacing + 'attachAngle: ' + nuclet.az.conf.attachAngle + '\n';
        }

        // Add the protons.
        let nl = 0;
        if (nuclet.az.protons) {
          for (let p in nuclet.az.protons) {
            if (nuclet.az.protons.hasOwnProperty(p)) {
              let proton = nuclet.az.protons[p];
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
        for (let e in nuclet.az.neutrons) {
          if (nuclet.az.neutrons.hasOwnProperty(e) && nuclet.az.neutrons[e].az.visible) {
            out += (nl++ == 0) ? spacing + 'neutrons: [' : ', ';
            out += nuclet.az.neutrons[e].az.id;
          }
        }
        if (nl) out += ']\n';

        // Add the nelectrons.
        if (nuclet.az.nelectrons) {
          nl = 0;
          for (let e in nuclet.az.nelectrons) {
            if (nuclet.az.nelectrons.hasOwnProperty(e)) {
              let electron = nuclet.az.nelectrons[e];
              if (nl++ == 0) {
                out += spacing + 'electrons:\n';
              }
              let num = (nl < 10) ? '0' + nl : nl;
              out += spacing + '  E' + num + ': {protons: [';
              let np = 0;
              for (let v = 0; v < electron.az.vertices.length; v++) {
                if (np++ != 0) out += ', ';
                out += electron.az.vertices[v];
              }
              if (np) out += ']}\n';
            }
          }
        }

        // Add the outerIcosaFaces.
        if (nuclet.az.conf.outerIcosaFaces && nuclet.az.conf.outerIcosaFaces.length) {
          out += spacing + 'outerIcosaFaces: [';
          nl = 0;
          for (let f in nuclet.az.conf.outerIcosaFaces) {
            if (nuclet.az.conf.outerIcosaFaces.hasOwnProperty(f)) {
              if (nl >= 1) {
                out += ',';
              }
              out += nuclet.az.conf.outerIcosaFaces[f];
              nl++;
            }
          }
          out += ']\n';
        }

        // Recursively add the children nuclets.
        let grow0 = atom.az.nuclets[id + '0'];
        let grow1 = atom.az.nuclets[id + '1'];
        if (grow0 || grow1) {
          out += spacing + 'nuclets:\n';
          if (grow0) { out += addNucletToStructure(id + '0', spacing + '  '); }
          if (grow1) { out += addNucletToStructure(id + '1', spacing + '  '); }
        }
        return out;
      }

      // Start with the N0 nuclet, build yml text recursively.
      console.log('extractStructure - addNucletToStructure(N0)');
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

 //     console.log('Attach Behaviors');
        // If this is the node-atom-form being opened then automatcially fill in:
        // Atomic Structure field, #protons, #electrons, be-sam-nuclets, be-sam-nuclets-perc
        let $nodeForm = $('.node-atom-form, .node-atom-edit-form');
        if ($(context).hasClass('node-atom-edit-form') || $(context).hasClass('node-atom-form')) {
          console.log('Seriously, do it');

          let $textarea = $nodeForm.find('.field--name-field-atomic-structure textarea');
          let atom = viewer.producer.getObject("A1");
          $textarea.val(extractStructure(atom));

          let protons = $('.atom--num-protons--value').html();
          $nodeForm.find('.field--name-field__protons input').val(protons);

          let electrons = $('.atom--num-electrons--value').html();
          $nodeForm.find('.field--name-field__electrons input').val(electrons);

          let be_sam_nuclets = $('.atom--be-sam-nuclets--value').html();
          $nodeForm.find('.field--name-field-be-sam-nuclets input').val(be_sam_nuclets);

          let be_sam_nuclets_perc = $('.atom--be-sam-nuclets-perc--value').html().replace('%','');
          $nodeForm.find('.field--name-field-be-sam-nuclets- input').val(be_sam_nuclets_perc);
        }
      }
    };

    /**
     * Interface to atomC.
     */
    return {
      addNuclet,
      addProton,
      deleteNElectron,
      buttonClicked,
      changeNucletState,
      changeNucletAngle,
      changeNucletFizzer,
      createAtom,
      deleteNuclet,
      explodeAtom,
      highlight,
      getNuclet,
      loadObject,
      deleteObject,
      overwriteYml,
      saveYml,
      updateValenceRings,
      updateParticleCount,
      updateSamLines,
      deleteAtomImages,
      saveWorldCoordinates,
      calculateSamLines,
    };
  };

})(jQuery);
