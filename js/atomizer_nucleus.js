/**
 * @file - atomizernucleus.js
 *
 */

Drupal.atomizer.nucleusC = function () {
  var nuclei;

  var loadYml = function (results) {
    results[0].ymlContents['filename'] = results[0].filename;
    defaultSet = results[0].ymlContents;
    currentSet.name = defaultSet.name;
    currentSet.description = defaultSet.description;
    currentSet.filename = defaultSet.filename;
    reset();
  };

  var savedYml = function (response) {
    var select = document.getElementById('style--selectyml').querySelector('select');
    // Remove current options
    while (select.hasChildNodes()) {
      select.removeChild(select.lastChild);
    }

    // Create the new option list
    for (var file in response[0].filelist) {
      var opt = document.createElement('option');
      opt.appendChild( document.createTextNode(response[0].filelist[file]));
      opt.value = file;
      select.appendChild(opt);
    }

    // Set select to new file
    select.value = response[0].filename;

    // Clear the Name and File name fields
    var inputs = document.getElementById('style--saveyml').querySelectorAll('input');
    inputs[0].value = '';
    inputs[1].value = '';
  }

  var saveYml = function (controls) {
    // Verify they entered a name.  If not popup an alert. return
    currentSet.name = controls.name;
    currentSet.filename = controls.filename;
    Drupal.atomizer.base.doAjax(
      'ajax-ab/saveYml',
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
      'ajax-ab/saveYml',
      { name: currentSet.name,
        component: 'style',
        filename: currentSet.filename,
        ymlContents: currentSet },
      null  // TODO: Put in useful error codes and have them be displayed.
    );
    return;
  };

  return {
    loadYml: loadYml,
    saveYml: saveYml,
    overwriteYml: overwriteYml
  };
};
