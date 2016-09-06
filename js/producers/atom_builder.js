/**
 * @file - atomizer.js
 *
 */

Drupal.atomizer.producers.atom_builderC = function (_viewer) {
  var viewer = _viewer;
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);
  viewer.nucleus = Drupal.atomizer.nucleusC(viewer);
  var nucleusFilename;
  var nucleus;

  //Should the builder contain all the math?


  var createView = function () {

    // Load and display the default nucleus.
    var userNucleusFile = localStorage.getItem('atomizer_builder_nucleus');
    var nucleusFile = (userNucleusFile && userNucleusFile != 'undefined') ? userNucleusFile : viewer.view.defaultNucleus;

    viewer.view.nucleus = viewer.nucleus.loadNucleus(
      'config/nucleus/' + nucleusFile,
      {position: {x: 0, y: 0, z: 0}}
    );

    // Create the ghost proton.  Displayed when hovering over attachment points.  Initially hidden
    viewer.view.ghostProton = viewer.nuclet.makeProton('ghost', 1, {x: 300, y: 50, z: 0});

    return;
  };

  return {
    createView: createView
  };
};
