/**
 * @file - prod_pCtable.js
 *
 * This is a 'producer' which allows users to build atoms.
 * This module provides functions to handle deleting/adding nuclets,
 * changing a nuclets slider angle, etc.
 */

(function ($) {

  Drupal.atomizer.prod_pteC = function (_viewer) {
    var viewer = _viewer;
    let elements;

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
     * User has clicked somewhere in the scene with the mouse.
     *
     * If they right clicked on a proton, find the parent nuclet and popup the nuclet edit form.
     * If they right clicked anywhere else, pop down the nuclet edit form.
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

    /**
     * Load the Episode node that defines this PTE.
     *
     * @param nid
     */
//  Drupal.atomizer.base.promiseAjax('/ajax/loadAtomList',{}).then(function(response) {
//    resolve(response[0].data.list);
//  }, function(error) {
//    reject(`getAtomList: ERROR - ${error}`);
//  })

    const loadPte = (nid) => {
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
//        reject('loadPte: Invalid ajax response');
        }, function(error) {
          reject(`loadPte: ERROR - ${error}`);
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
      viewer.animation = Drupal.atomizer.animationC(viewer);

//    let nid = localStorage.getItem('atomizer_pte_nid', 2344);
      let nid = 2344;
      viewer.atom_list.getAtomList().then(function(list) {
        elements = list;
        return loadPte(nid);
      }).catch(function(msg) {
        alert(`prod_pte.js::createView: Error calling getAtomList: ${msg}`);
      }).then(function(node) {
        // conf, information, nodeName, nodeTitle, properties, scenes[0].description w/format, script, type
        $container = $('.css3d-renderer', viewer.context);
        viewer.pte.create($container, elements);
        viewer.render();
        console.log(`createView: node is read in`) ;
      });
      return;
    };


    // Initialize Event Handlers

    /*
    var $mouseBlock = $('#blocks--mouse-mode', viewer.context);
    if ($mouseBlock.length) {
      mouse.mode = $mouseBlock.find('input[name=mouse]:checked').val();
      // Add event listeners to mouse mode form radio buttons
      var $mouseRadios = $mouseBlock.find('#edit-mouse--wrapper input');
      $mouseRadios.click(function (event) {
        console.log('mode: ' + event.target.value);
        mouse.mode = event.target.value;
      });
    }
    */

    return {
      createView: createView,
      setDefaults: setDefaults,
      mouseUp: mouseUp,
      mouseMove: mouseMove,
      hoverObjects: hoverObjects,
      objectLoaded: objectLoaded
    };
  };

})(jQuery);
