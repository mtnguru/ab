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

  var doAjax = function doAjax (url, data, successCallback, errorCallback) {
    jQuery.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      processData: false,
      success: function (response) {
        if (successCallback) successCallback(response);
      },
      error: function (response) {
        alert(response.responseText);
        (errorCallback) ? errorCallback(response) : successCallback(response);
      }
    });
  }

  return {
    doAjax: doAjax
  };
};
