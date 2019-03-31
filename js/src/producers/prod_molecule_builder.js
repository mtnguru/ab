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
    let atoms = [];

    var moleculeLoad = function(nid) {
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/loadMolecule',
        { nid: nid },
        moleculeLoaded
      );
    };

    var moleculeLoaded = function (response) {
      for (var i = 0; i < response.length; i++) {
        if (response[i].command == 'loadMoleculeCommand') {
          let data = response[i].data;
          viewer.scene.az = {
            title: data.moleculeTitle,
            name: data.moleculeName,
            sceneNid: data.nid,
          };
          viewer.labels.display();
          localStorage.setItem('atomizer_molecule_nid', data.nid);

          moleculeConf = data.moleculeConf;
          for (let a in moleculeConf.atoms) {
            let atom = moleculeConf.atoms[a];
            viewer.atom.loadObject(atom.nid);
          }
        }
      }
    };

    var objectLoaded = function (_atom) {
      atoms.push(_atom);
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

      // Set eventhandler for select molecule block
      $('#select-molecule-wrapper .select-item-wrapper a').click((event) => {
        let $link = $(event.target).closest('a');
        let nid = $link.data('nid');
        moleculeLoad(nid);
      });

      // Read in the molecule .yml file
      moleculeNid = localStorage.getItem('atomizer_molecule_nid');
      moleculeNid = (!moleculeNid || moleculeNid == 'undefined') ? 1060 : moleculeNid;
      moleculeLoad(moleculeNid);
    };

    return {
      createView: createView,
      objectLoaded: objectLoaded,
    };
    };

})(jQuery);
