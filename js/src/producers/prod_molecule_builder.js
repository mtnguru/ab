/**
 * @file - prod_molecule_builder.js
 *
 * This 'producer' creates the view with a single atom for editing
 * with the atom_builder.
 */

(function ($) {

  Drupal.atomizer.producers.molecule_builderC = function (_viewer) {
    let viewer = _viewer;
    let moleculeConf;
    let moleculeNid;
    var $sceneName = $('.scene--name, .az-scene-name, .az-canvas-labels', viewer.context);
    var $sceneInformation = $('.molecule--information', viewer.context);
    var $sceneProperties = $('.molecule--properties', viewer.context);
    var objects = {};

    var moleculeLoad = function(conf) {
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadMolecule',
        { conf },
        moleculeLoaded
      );
    };

    var moleculeLoaded = function (response) {
      for (var i = 0; i < response.length; i++) {
        if (response[i].command == 'loadMoleculeCommand') {
          viewer.clearScene();
          viewer.render();
          let data = response[i].data;
          viewer.scene.az = {
            title: data.moleculeTitle,
            name: data.moleculeName,
            sceneNid: data.nid,
          };
          if ($sceneName) {
            $sceneName.html(data.moleculeTitle);
          }
          if ($sceneInformation) {
            $sceneInformation.html(data.information);
          }
          if ($sceneProperties) {
            $sceneProperties.html(data.properties);
          }
          viewer.labels.display();
          localStorage.setItem('atomizer_molecule_nid', data.conf.nid);

          moleculeConf = data.moleculeConf;
          let molecule = {
            az: moleculeConf,
          };
          viewer.prod_molecule.moleculeLoaded(molecule);

          objects = {};
          for (let key in moleculeConf.objects) {
            let objectConf = moleculeConf.objects[key];
            objectConf.id = key;
            viewer[objectConf.type].loadObject(objectConf);
          }

        }
      }
    };

    var objectLoaded = function (object) {
      viewer.prod_molecule.objectLoaded(object);

      object.position.x = object.az.conf.position[0];
      object.position.y = object.az.conf.position[1];
      object.position.z = object.az.conf.position[2];

      object.rotation.x = object.az.conf.rotation[0] / 360 * 2 * Math.PI;
      object.rotation.y = object.az.conf.rotation[1] / 360 * 2 * Math.PI;
      object.rotation.z = object.az.conf.rotation[2] / 360 * 2 * Math.PI;
      viewer.scene.add(object);
      object.az.id = object.az.conf.id;
      objects[object.az.id] = object;
      viewer.addObject(object);
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
      viewer.prod_atom = Drupal.atomizer.prod_atomC(viewer);
      viewer.prod_molecule = Drupal.atomizer.prod_moleculeC(viewer);

      // Set eventhandler for select molecule block
      let $d = $('#select-molecule-wrapper .select-item-wrapper a');
      $('#select-molecule-wrapper .select-item-wrapper a').click((event) => {
        let $link = $(event.target).closest('a');
        let nid = $link.data('nid');
        moleculeLoad({nid: nid});
      });

      // Read in the molecule .yml file
      moleculeNid = localStorage.getItem('atomizer_molecule_nid');
      moleculeNid = (!moleculeNid || moleculeNid == 'undefined') ? 1315 : moleculeNid;
      moleculeLoad({nid: moleculeNid});
    };

    const hovered = () => {

    };

    const hoverObjects = () => {
      let objects = [];
      for (let id in objects) {
        let atom = objects[id];
        objects = viewer.prod_atom.hoverObjects(atom);
      }
      return objects;
    };

    return {
      createView: createView,
      objectLoaded: objectLoaded,
      getObject: () => atom,
      mouseUp: function (event) { return viewer.prod_atom.mouseUp(event)},
      mouseDown: function (event) { return viewer.prod_atom.mouseDown(event)},
      hovered: function (hovered) { return viewer.prod_atom.hovered(hovered)},
      hoverObjects: function () { return viewer.prod_atom.hoverObjects()},
    };
  };

})(jQuery);
