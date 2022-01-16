/**
 * @file - prod_scene.js
 *
 * This 'producer' creates the view with a single atom for editing
 * with the atom_builder.
 */

(function ($) {

  Drupal.atomizer.prod_sceneC = function (_viewer) {
    let viewer = _viewer;
    let sceneConf;
    let sceneNid;
    var $sceneName = $('.scene--name, .az-scene-name, .az-canvas-labels', viewer.context);
    var $sceneInformation = $('.scene--information', viewer.context);
    var $sceneProperties = $('.scene--properties', viewer.context);
    viewer.objects = {};
    let intersect = {};
    let mousePressed = false;

    var $protonsColor = $('#edit-proton-colors--wrapper', viewer.context);
    viewer.controls.mouseMode('electronsAdd');

    /**
     * deleteObject from scene and objects arraw
     * @param key
     */
    const deleteObject = (key) => {
      let object = viewer.objects[key];
      if (object) {
        viewer.scene.remove(object);
        viewer[object.name].deleteObject(object);
        delete(viewer.objects[object.az.id]);
      }
      else {
        console.log(`Could not delete object - not found: ${key}`);
      }
    }

    /**
     * Create a unique object key
     *
     * @param basename
     * @returns {string}
     */
    const createUniqueObjectKey = (basename) => {
      let num = 0;
      let name;
      do {
        name = `${basename.toLowerCase().replace(' ', '-')}-${++num}`;
      } while (viewer.objects[name]);
      return name;
    };

    /**
     * addObject to the viewer.objects array
     *
     * @param object
     */
    const addObject = (object) => {
      viewer.objects[object.az.id] = object;
      viewer.scene.add(object.parent);
    };

    const getObject = (name) => viewer.objects[name];

    const moveObject = (event, mouse) => {
      // Calculate the difference in x and y.
      let x = 700 * (mouse.now.x - mouse.down.x);
      let y = 700 * (mouse.now.y - mouse.down.y);
      if (event.ctrlKey) {        // Y/Z plane
        mouse.object.parent.position.z = mouse.objectStartPosition.z - x;
        mouse.object.parent.position.y = mouse.objectStartPosition.y + y;
      }
      else if (event.shiftKey) {  // X/Z plane
        mouse.object.parent.position.x = mouse.objectStartPosition.x - x;
        mouse.object.parent.position.z = mouse.objectStartPosition.z + y;
      }
      else {                      // X/Y plane
        mouse.object.parent.position.x = mouse.objectStartPosition.x - x;
        mouse.object.parent.position.y = mouse.objectStartPosition.y + y;
      }
      viewer.dir_molecule.setPositionSliders(mouse.object);
      console.log(`mouse: ${mouse.now.x} ${mouse.now.y}`);
//    console.log(`moveObject: ${x} ${y} - ${mouse.object.parent.position.x} ${mouse.object.parent.position.y}`);

      viewer.render();
    };

//  const moveObject = () => {
//
//  };

    const clearScene = () => {
      var keys = Object.keys(viewer.objects);
      if (keys.length) {
        for (let key in viewer.objects) {
          if (viewer.objects.hasOwnProperty(key)) {
            deleteObject(key);
          }
        }
      }
    };

    /**
     * Return the objects which are active for hovering
     *
     * @returns {*}
     */
    var hoverObjects = function hoverObjects(mouse) {
      switch (mouse.mode) {
        case 'none':
          return null;
        case 'atomsMove':
          return intersect.visibleParticles;
        case 'electronsAdd':
          return intersect.visibleParticles;
        case 'protonsAdd':
          return intersect.optionalProtons;
        case 'protonsColor':
          return intersect.visibleProtons;
        case 'inner-faces':
          return intersect.hoverInnerFaces;
        case 'outer-faces':
          return intersect.hoverOuterFaces;
      }
    };

    const setControlsObject = (mode, object) => {
      if (object) {
        viewer.controls.changeControlsMode('prod_scene::setControlsObject','none');
      } else {
        viewer.controls.changeControlsMode('prod_scene::setControlsObject','scene');
      }
    };

    const findObjectFromIntersects = (intersects) => {
      if (!intersects.length)      return null;
      if (intersects[0].object.az) return intersects[0].object.az.nuclet.atom;  // It's a proton
      return intersects[0].object.parent.parent.parent.az.atom;
    };

    const grabObject = (mouse, object) => {
      if (object) {
//      setControlsObject('none');
        mouse.object = object;
        mouse.objectStartPosition.copy(object.parent.position);
        mouse.objectStartRotation.copy(object.rotation);
        viewer.controls.changeControlsSettings({enablePan: false});
      } else {
//      setControlsObject('scene');
        mouse.object = null;
        viewer.controls.changeControlsSettings({enablePan: true});
      }
    };

    const mouseUp = (event, mouse) => {
      event.preventDefault();
      mousePressed = false;
      if (mouse.mode == 'atomsMove') {
        switch (event.which) {
          case 1:
            break;
          case 2:
            break;
          case 3:
            mouse.object = null;
//          setControlsObject('scene');
            break;
        } // switch which mouse button
      } else {
        viewer.dir_atom.mouseUp(event, mouse);
      }
    };

    const mouseDown = (event, mouse) => {
      event.preventDefault();
      mousePressed = true;

      switch (mouse.mode) {
        case 'none':
          return null;

        case 'atomsMove':
          let object = findObjectFromIntersects(viewer.controls.findIntersects(intersect.visibleParticles));
          switch (event.which) {
            case 1:   // Left button clicked -  Look at intersects and set either object or camera controls mode
              break;
            case 2:   // Center button clicked - Intersects - select this object - enable the form
              viewer.dir_molecule.setEditAtom(object);
              break;
            case 3:   // Right button clicked - Select this object to move in x/y plane - CTRL z/y plane - SHIFT x/z place
              grabObject(mouse, object);
              break;
          } // switch which mouse button
          break;

        case 'electronsAdd':
        case 'protonsAdd':
        case 'protonsColor':
        case 'inner-faces':
        case 'outer-faces':
          viewer.dir_atom.mouseDown(event, mouse);
          break;
      }
      viewer.render();
    };

    let mouseMove = (event, mouse) => {
      if (mouse.object) {
        event.preventDefault();
        moveObject(event, mouse);
      }
      else {
        if (mouse.intersects) {
          console.log(`hovered: ${mouse.intersects.length}`);
        }
        switch (mouse.mode) {
          case 'none':
            return null;
          case 'atomsMove':
            if (!mousePressed) {
//            let object = findObjectFromIntersects(viewer.controls.findIntersects(intersect.visibleParticles));
//            setControlsObject('object', object);
            }
            viewer.dir_atom.mouseMove(event, mouse);
            break;

          case 'electronsAdd':
          case 'protonsAdd':
          case 'protonsColor':
          case 'inner-faces':
          case 'outer-faces':
            viewer.dir_atom.mouseMove(event, mouse);
            break;
        }
      }
    };

    const sceneLoad = function(conf) {
      Drupal.atomizer.base.doAjax(
        '/ajax/loadMolecule',
        { conf },
        sceneLoaded
      );
    };

    const sceneLoaded = function (response) {
      for (var i = 0; i < response.length; i++) {
        if (response[i].command == 'loadMoleculeCommand') {
          clearScene();
          clearIntersectLists();
          viewer.render();
          viewer.objects = {};
          let data = response[i].data;
          viewer.scene.az = {
            conf: data.conf,
            title: data.title,
            name: data.name,
            sceneNid: data.nid,
            properties: data.properties,
            information: data.information,
            link: data.link,
          };

          if ($sceneName)                            { $sceneName.html(data.title); }
          if ($sceneInformation && data.information) { $sceneInformation.html(data.information); }
          if ($sceneProperties && data.properties)   { $sceneProperties.html(data.properties); }

          viewer.labels.display();
          localStorage.setItem('atomizer_scene_nid', data.conf.nid);

          // The scene is a single molecule for now.
          // A molecule is one drupal node. - Currently called molecule
          viewer.dir_molecule.moleculeLoaded(viewer.scene);

          // Load the scene objects - atoms
          // @TODO Have objects that aren't loaded, they are defined in the yml.  Create them directly.
          objects = {};
          for (let key in data.conf.objects) {
            let objectConf = data.conf.objects[key];
            objectConf.id = key;
            viewer[objectConf.type].loadObject(objectConf);
          }
        }
      }
    };

    var objectLoaded = function (object) {
      object.az.id = object.az.conf.id;

      if (object.az.conf.rotation) {
        object.rotation.x = parseInt(Drupal.atomizer.base.toRadians(object.az.conf.rotation[0]));
        object.rotation.y = parseInt(Drupal.atomizer.base.toRadians(object.az.conf.rotation[1]));
        object.rotation.z = parseInt(Drupal.atomizer.base.toRadians(object.az.conf.rotation[2]));
      }

      let objectShell = new THREE.Object3D();
      objectShell.name = 'objectShell';
      if (object.az.conf.position) {
        objectShell.position.set(...object.az.conf.position);
      }
      objectShell.add(object);

//    let objectShell1 = new THREE.Object3D();
//    objectShell1.name = 'objectShell1';
//    objectShell1.position.set(...object.az.conf.position);
//    objectShell1.add(objectShell);

      addObject(object);
      viewer.dir_molecule.objectLoaded(object);
      viewer.dir_atom.objectLoaded(object);

      if (object.az.conf.needsPosition) {
        grabObject(viewer.controls.mouse, object);
      }

      viewer.render();
    };

    /**
     * Create the view - add any objects to scene.
     */
    let createView = function () {
      let ctx = viewer.canvas.getContext("2d");
      viewer.nuclet = Drupal.atomizer.nucletC(viewer);
      viewer.atom = Drupal.atomizer.atomC(viewer);
      viewer.shapes = Drupal.atomizer.shapesC(viewer);
      viewer.sprites = Drupal.atomizer.spritesC(viewer);
      viewer.labels = Drupal.atomizer.labelsC(viewer);
      viewer.animation = Drupal.atomizer.animationC(viewer);
      viewer.snapshot  = Drupal.atomizer.snapshotC(viewer);
      viewer.dir_atom = Drupal.atomizer.dir_atomC(viewer);
      viewer.atom_select = Drupal.atomizer.atom_selectC(viewer, false);
      viewer.dir_molecule = Drupal.atomizer.dir_moleculeC(viewer);

      // Set eventhandler for select molecule block
      let $d = $('#select-molecule-wrapper .select-item-wrapper a');
      $('#select-molecule-wrapper .select-item-wrapper a').click((event) => {
        let $link = $(event.target).closest('a');
        let nid = $link.data('nid');
        sceneLoad({nid: nid});
      });

      // Read in the scene .yml file
      sceneNid = localStorage.getItem('atomizer_scene_nid');
      sceneNid = (!sceneNid || sceneNid == 'undefined') ? 1315 : sceneNid;
      sceneLoad({nid: sceneNid});
    };

    const initMouse = () => {
      var $mouseBlock = $('#blocks--mouse-mode', viewer.context);
      $protonsColor.addClass('az-hidden');
      if ($mouseBlock.length) {
        viewer.controls.mouse.mode = $mouseBlock.find('input[name=mouse]:checked').val();
        // Add event listeners to mouse mode form radio buttons
        var $mouseRadios = $mouseBlock.find('#edit-mouse--wrapper input');
        $mouseRadios.click(function (event) {
          console.log('mode: ' + event.target.value);
          mouse.mode = event.target.value;
          if (mouse.mode == 'protonsColor') {
            $protonsColor.removeClass('az-hidden');
          } else {
            $protonsColor.addClass('az-hidden');
          }
        });

        // Add event listeners to proton colors block
        // Set default color
        $mouseBlock.find('#proton-original-color').addClass('selected');
        viewer.controls.mouse.protonColor = 'original';

        var $colorRadios = $mouseBlock.find('.proton-color');

        // Set the background color of buttons
        $colorRadios.each(function () {
          var name = $(this).attr('id').split("-")[1];
          if (name != 'original') {
            var color = viewer.theme.getColor('proton-' + name + '--color', 'lighten');
            $(this).css('background-color', color.hex);
          }
        });

        // Set button click event handler.
        $colorRadios.click(function (event) {
          $colorRadios.removeClass('selected');
          $(this).addClass('selected');
          var $input = $(this).parent().parent().find('input');
          $input.prop('checked', true);
          viewer.controls.mouse.protonColor = $input.val();
        });
      }
    };

    const explode = (value) => {
      viewer.dir_atom.explode(atom, value);
    };

    const clearIntersectLists = () => {
      intersect = {
        visibleParticles: [],
        visibleProtons: [],
        visibleNElectrons: [],
        hoverInnerFaces: [],
        hoverOuterFaces: [],
        optionalProtons: [],
      };
    };

    const updateIntersectLists = () => {
      let num = viewer.objects.length;
      for (let key in viewer.objects) {
        let object = viewer.objects[key];
        if (object.az.conf.type == 'atom') {
          intersect.visibleParticles =  intersect.visibleParticles.concat(object.az.intersect.visibleParticles);
          intersect.visibleProtons =    intersect.visibleProtons.concat(object.az.intersect.visibleProtons);
          intersect.visibleNElectrons = intersect.visibleNElectrons.concat(object.az.intersect.visibleNElectrons);
          intersect.optionalProtons =   intersect.optionalProtons.concat(object.az.intersect.optionalProtons);
          intersect.hoverOuterFaces =   intersect.hoverOuterFaces.concat(object.az.intersect.hoverOuterFaces);
        }
      }
    };

    initMouse();


    return {
      createView,
      objectLoaded,

      createUniqueObjectKey,
      getObject,
      addObject,
      deleteObject,
      clearScene,

      grabObject,

      explode,
      updateIntersectLists,

      mouseUp,
      mouseDown,
      mouseMove,
      intersect: intersect,
      hoverObjects,
    };
  };

})(jQuery);
