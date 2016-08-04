/**
 * @file - atomizernuclets.js
 *
 * File that generates nuclets  proton, helium, lithium, helium - 1, 4, 7, 11
 */

Drupal.atomizer = {};

Drupal.atomizer.baseC = function () {

  Drupal.AjaxCommands.prototype.loadYmlCommand = function(ajax, response, status) {
    Drupal.atomizer[response.component].loadYml(response);
  };

  Drupal.AjaxCommands.prototype.saveYmlCommand = function(ajax, response, status) {
    Drupal.atomizer[response.component].saveYml(response);
  };

  var doAjax = function doAjax (url, data, success, error) {
    jQuery.ajax({
      url: url,
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (response) {
        if (success) success(response);
      },
      error: function (response) {
        alert(response.responseText);
        (error) ? error(response) : success(response);
      }
    });
  }

  return {
    doAjax: doAjax
  };
};
