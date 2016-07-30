/**
 * @file - atom_nuclets.js
 *
 * File that generates nuclets  proton, helium, lithium, helium - 1, 4, 7, 11
 */

Drupal.atom_builder = {};

Drupal.atom_builder.baseC = function () {

  Drupal.AjaxCommands.prototype.loadYmlCommand = function(ajax, response, status) {
    Drupal.atom_builder[response.component].loadYml(response);
  };

  Drupal.AjaxCommands.prototype.saveYmlCommand = function(ajax, response, status) {
    Drupal.atom_builder[response.component].saveYml(response);
  };

  var doAjax = function doAjax (url, data, success, error) {
    jQuery.ajax({
      url: url,
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (response) {
        success(response);
      },
      error: function (response) {
        (error) ? error(response) : success(response);
      }
    });
  }

  return {
    doAjax: doAjax
  };
};
