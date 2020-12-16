/**
 * @file - prod_pCtable.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

(function ($) {

  Drupal.atomizer.prod_pteC = function (_viewer) {
    let viewer = _viewer;
    let scenes;
    let elements;

    let $snapshotName = $('.snapshot--name', viewer.context);
    if ($snapshotName) {
      let name = 'pte';
      $snapshotName.val(name.replace(' ', '-'));
    }

    /**
     * Return the objects which are active for hovering
     *
     * @returns {*}
     */
    var hoverObjects = function hoverObjects(mouse) {
      switch (mouse.mode) {
        case 'none':
          return null;
        case 'electronsAdd':
          return null;
        case 'protonsAdd':
          return optionalProtons;
      }
    };

    /**
     * User has hovered over a proton, reset last highlighted proton to original color
     * Make the current hovered proton pink.
     *
     * @param event
     */
    var mouseMove = function mouseMove(event, mouse) {
      switch (mouse.mode) {
        case 'none':
          return;

        case 'electronsAdd':
        case 'protonsAdd':

          viewer.render();
          break;
      }
    };

    /**
     * User clicked on a Checkbox button
     *
     * @param event
     */
    var buttonClicked = (event) => {
      let args = event.target.id.split("--");
      let checked = event.target.checked;
      if (args[1] == 'cell') {
        if (checked) {
          $(`.element .${event.target.value}`).removeClass('az-hidden');
        } else {
          $(`.element .${event.target.value}`).addClass('az-hidden');
        }
      }
    };

    /**
     * User clicked on a Radio button
     *
     * @param event
     */
    var radioClicked = (target) => {
      let args = target.id.split("--");
      if (args[1] == 'layout') {
        viewer.pte.setLayout(args[2]);
        viewer.pte.onResize();
        setCellContent();
      }
    };
    /**
     * User has clicked somewhere in the scene with the mouse.
     *
     * If they right clicked on a proton, find the parent nuclet and popup the nuclet edit form.
     * If they right clicked anywhere else, pop down the nuclet edit form
     *
     * @param event
     * @returns {boolean}
     */
    function mouseUp(event, mouse) {
      event.preventDefault();
      switch (event.which) {
        case 1:   // Select/Unselect protons to add an electron to.
          switch (mouse.mode) {
            case 'electronsAdd_breakit':
              viewer.render();
              break;
          }
          break;

        case 2:
          // Middle button always sets the edit nuclet
          viewer.render();
          break;
      } // switch which mouse button
    }

    /**
     * Create the intersect lists used to detect objects that are hovered over.
     */
    function createIntersectLists() {
    }

    /**
     * Set Default values for any forms.
     */
    function setDefaults() {}

    var objectLoaded = function objectLoaded(bc) {
      localStorage.setItem('atomizer_pte_nid', bc.az.nid);
      createIntersectLists();
      viewer.scene.az = {
        title: bc.az.title, // Use object title as scene title
        name: bc.az.name,  // Use object name as the scene name
        objectNid: bc.az.nid
      };

    };

    const setCellContent = () => {
      // Get current state of cell content checkboxes.
      let $cells = $('#edit-producer-cell .producer--cell');
      $cells.each(function (index, cell) {
        if (cell.checked) {
          $(`.element .${cell.value}`).removeClass('az-hidden');
        } else {
          $(`.element .${cell.value}`).addClass('az-hidden');
        }
      });
    };

    const applyScene = (scene) => {
      for (let c in scene.script.classification) {
        if (scene.script.classification.hasOwnProperty(c)) {
          let group = scene.script.classification[c];
          let className = group.className;

          // Cycle through the elements in this group
          for (let e in group.elements) {
            if (group.elements.hasOwnProperty(e)) {
              // Assign the className to the element.
              $(`.element#${group.elements[e].toLowerCase()}`, viewer.context).addClass(className);
            }
          }
        }
      }
    };

    /**
     * Load the Episode node that defines this PTE.
     *
     * @param nid
     */
    const loadEpisode = (nid) => {
      return new Promise(function (resolve, reject) {
        Drupal.atomizer.base.promiseAjax(
          '/ajax/loadNode', {
            conf: {
              nid: nid,
              fields: {
                field_scenes: 'raw',
                body: 'raw',
              }
            }
          }
        ).then(function(response) {
          for (let r = 0; r < response.length; r++) {
            if (response[r].command == 'loadNodeCommand') {
              resolve(response[r].data);
            }
          }
//        reject('loadEpisode: Invalid ajax response');
        }, function(error) {
          reject(`loadEpisode: ERROR - ${error}`);
        });
      });
    };

    var pteLoaded = function pteLoaded(results) {
      var conf = results[0].ymlContents;
      viewer.pte.createScene(conf);
    };

    /**
     * Create the view - add any objects to scene.
     */
    var createView = function () {
      // Initialize pteC and animationC
      viewer.pte = Drupal.atomizer.pteC(viewer);
      viewer.atom_list = Drupal.atomizer.atom_listC(viewer);
      viewer.snapshot = Drupal.atomizer.snapshotC(viewer);
      viewer.animation = Drupal.atomizer.animationC(viewer);

//    let nid = localStorage.getItem('atomizer_pte_nid', 2344);
      let nid = 2552;
      viewer.atom_list.getAtomList('full').then(function(list) {
        elements = list;
        return loadEpisode(nid);
      }).catch(function(msg) {
        alert(`prod_pte.js::createView: Error calling getAtomList: ${msg}`);
      }).then(function(node) {
        // conf, information, nodeName, nodeTitle, properties, scenes[0].description w/format, script, type
        $container = $('.css3d-renderer', viewer.context);
        viewer.pte.create($container, elements);
        viewer.scene.az = { nid: nid};
        setCellContent();
        scenes = node.scenes
        applyScene(node.scenes[0]);
        viewer.render();
        console.log(`createView: node is read in`) ;
      });

      // Implement 'change' event listener to reset rotation to 0
//    viewer.controls.addEventListener('change', function (event) {
//      return;
//     });

      animate();
      return;
    };

    function animate() {
      requestAnimationFrame( animate );
      viewer.controls.getControls().update();
    }

    return {
      createView,
      setDefaults,

      mouseUp,
      mouseMove,
      buttonClicked,
      radioClicked,

      hoverObjects,
      objectLoaded,
      setCellContent,
    };
  };

})(jQuery);
