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
    let mouseMode = 'electronsAdd';

    var $protonsColor = $('#edit-proton-colors--wrapper', viewer.context);
    var protonColor;

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

    const addObject = (object) => {
      viewer.objects[object.az.id] = object;
      viewer.scene.add(object.parent);
    };

    const getObject = (name) => viewer.objects[name];

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
    var hoverObjects = function hoverObjects() {
      switch (mouseMode) {
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

    let hovered = (hovered) => {

      viewer.dir_atom.hovered(mouseMode, hovered)
    };

    const mouseUp = (event, distance) => {
      if (mouseMode == 'atomsMove') {
      } else {
        viewer.dir_atom.mouseUp(event, distance, mouseMode);
      }
    };

    const mouseDown = (event, distance) => {
      event.preventDefault();
      switch (mouseMode) {
        case 'none':
          return null;
        case 'atomsMove':
          switch (event.which) {
            case 1:   // Left button clicked -  Look at intersects and set either object or camera controls mode
              break;

            case 2:   // Center button clicked - Intersects - select this atom - enable the form
              break;

            case 3:   // Right button clicked - Select this atom to move in x/y plane - CTRL z/y plane - SHIFT x/z place
              break;

          } // switch which mouse button
          break;

        case 'electronsAdd':
          viewer.dir_atom.mouseDown(event, distance, {mouseMode, protonColor});
          break;

        case 'protonsAdd':
          viewer.dir_atom.mouseDown(event, distance, {mouseMode, protonColor});
          break;

        case 'protonsColor':
          viewer.dir_atom.mouseDown(event, distance, {mouseMode, protonColor});
          break;

        case 'inner-faces':
          viewer.dir_atom.mouseDown(event, distance, {mouseMode, protonColor});
          break;

        case 'outer-faces':
          viewer.dir_atom.mouseDown(event, distance, {mouseMode, protonColor});
          break;

      }
      viewer.render();
    };

    const sceneLoad = function(conf) {
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadMolecule',
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
            title: data.title,
            name: data.name,
            sceneNid: data.nid,
          };

          if ($sceneName)                            { $sceneName.html(data.title); }
          if ($sceneInformation && data.information) { $sceneInformation.html(data.information); }
          if ($sceneProperties && data.properties)   { $sceneProperties.html(data.properties); }

          viewer.labels.display();
          localStorage.setItem('atomizer_scene_nid', data.conf.nid);

          // Build the scene
          sceneConf = data.conf;
          let scene = {
            az: sceneConf,
          };
          // The scene is a single molecule for now.
          // A molecule is one drupal node. - Currently called molecule
          // Let me keep it that way - I'll distinguish the scene type and load the correct object that way.
          viewer.dir_molecule.moleculeLoaded(scene);

          // Load the scene objects - they themselves are also nodes - atoms in this case
          // @TODO Have objects that aren't loaded, they are defined in the yml.  Create them directly.
          objects = {};
          for (let key in sceneConf.objects) {
            let objectConf = sceneConf.objects[key];
            objectConf.id = key;
            viewer[objectConf.type].loadObject(objectConf);
          }
        }
      }
    };

    var objectLoaded = function (object) {
      object.az.id = object.az.conf.id;

      object.rotation.set(...object.az.conf.rotation);

      let objectShell = new THREE.Object3D();
      objectShell.name = 'objectShell';
      objectShell.position.set(...object.az.conf.position);
      objectShell.add(object);

      addObject(object);
      viewer.dir_molecule.objectLoaded(object);
      viewer.dir_atom.objectLoaded(object);

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
      viewer.dir_atom = Drupal.atomizer.dir_atomC(viewer);
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
        mouseMode = $mouseBlock.find('input[name=mouse]:checked').val();
        // Add event listeners to mouse mode form radio buttons
        var $mouseRadios = $mouseBlock.find('#edit-mouse--wrapper input');
        $mouseRadios.click(function (event) {
          console.log('mode: ' + event.target.value);
          mouseMode = event.target.value;
          if (mouseMode == 'protonsColor') {
            $protonsColor.removeClass('az-hidden');
          } else {
            $protonsColor.addClass('az-hidden');
          }
        });

        // Add event listeners to proton colors block
        // Set default color
        $mouseBlock.find('#proton-original-color').addClass('selected');
        protonColor = 'original';

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
          protonColor = $input.val();
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
        }
      }
    };

    initMouse();


    return {
      createView,
      objectLoaded,

      deleteObject,
      getObject,
      addObject,
      clearScene,

      explode,
      updateIntersectLists,

      mouseUp,
      mouseDown,


      intersect: intersect,
      hovered: hovered,
      hoverObjects,
    };
  };

})(jQuery);
