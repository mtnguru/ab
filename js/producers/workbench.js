/**
 * @file - atomizer.js
 *
 */

Drupal.atomizer.producers.workbenchC = function (_viewer) {
  var viewer = _viewer;
  viewer.nuclet = Drupal.atomizer.nucletC(viewer);

  var createObject = function createObject (type, position) {
    switch (type) {
      case 'tetralet':
        var nucletConf = {
          position: 1,
          type: 'tetralet',
          numProtons: 4,
          protons: [
            {present: true},
            {present: true},
            {present: true},
            {present: true}
          ]
        };
        break;
      case 'decalet':
        var nucletConf = {
          position: 1,
          type: 'decalet',
          numProtons: 7,
          protons: [
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true}
          ]
        };
        break;
      case 'icosalet':
        var nucletConf = {
          position: 1,
          type: 'icosalet',
          numProtons: 12,
          protons: [
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true}
          ]
        };
        break;
      case 'octolet':
        var nucletConf = {
          position: 1,
          type: 'octolet',
          numProtons: 6,
          protons: [
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true},
            {present: true}
          ]
        };
        break;
    }
    nucletConf.position = {
      x: position.x,
      y: position.y,
      z: position.z
    };
    return nuclet = viewer.nuclet.create(nucletConf);
  };


  var createView = function () {
    var nuclet = viewer.nuclet;

    var octolet = createObject('octolet',  {x: 0, y: 92, z: -200});
    Drupal.atomizer.octolet = octolet;
    viewer.scene.add(octolet);

//  viewer.scene.add(createObject('icosalet', {x: 0, y: 92, z:  200}));

//  viewer.scene.add(createObject('icosalet', {x: 0, y: 92, z: -300}));
//  viewer.scene.add(createObject('octolet', {x: 0, y: 92, z: 0}));
//  viewer.scene.add(createObject('icosalet', {x: 0, y: 92, z: 300}));

//  viewer.scene.add(createObject('pentalet', {x: -300, y: 67, z: -300}));
//  viewer.scene.add(createObject('pentalet', {x: -300, y: 67, z: 0}));
//  viewer.scene.add(createObject('pentalet', {x: -300, y: 67, z: 300}));

//  viewer.scene.add(createObject('tetralet', {x: 300, y: 67, z: -300}));
//  viewer.scene.add(createObject('tetralet', {x: 300, y: 67, z: 0}));
//  viewer.scene.add(createObject('tetralet', {x: 300, y: 67, z: 300}));

    return;
  };

  return {
    createView: createView
  };
};
