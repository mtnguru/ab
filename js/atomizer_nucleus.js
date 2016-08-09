/**
 * @file - atomizernucleus.js
 *
 */

Drupal.atomizer.nucleusC = function (_viewer) {
  var viewer = _viewer;
  var nucleus;
  var nucleusConf;

  var loadNucleus = function loadNucleus (filepath, settings) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/loadYml',
      { component: 'nucleus',
        settings: {fart: 'cool'},
        filepath: filepath
      },
      createNucleus
    );
  };

  var createNucleus = function createNucleus (results) {
    if (nucleus) {
      viewer.scene.remove(nucleus);
    }
    nucleusConf = results[0].ymlContents;
    nucleusConf['filepath'] = results[0].filepath;
    nucleus = new THREE.Group();
    for (var n in nucleusConf.nuclets) {
      var nuclet =  viewer.nuclet.create(nucleusConf.nuclets[n]);
      nucleus.add(nuclet);
    }
    viewer.scene.add(nucleus);
    viewer.render();
  };

  var savedYml = function (response) {
    var select = document.getElementById('style--selectyml').querySelector('select');
    // Remove current options
  }

  var saveYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    currentSet.name = controls.name;
    currentSet.filename = controls.filename;
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: controls.name,
        component: 'style',
        filename: controls.filename,
        ymlContents: currentSet },
      savedYml
    );
    return;
  };

  var overwriteYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    Drupal.atomizer.base.doAjax(
      '/ajax-ab/saveYml',
      { name: currentSet.name,
        component: 'style',
        filename: currentSet.filename,
        ymlContents: currentSet },
      null  // TODO: Put in useful error codes and have them be displayed.
    );
    return;
  };

  return {
    loadYml: createNucleus,
    saveYml: saveYml,
    overwriteYml: overwriteYml,
    loadNucleus: loadNucleus,
    getYmlDirectory: function () { return 'config/nucleus'; }
  };
};
