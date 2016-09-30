/**
 * @file - atomizernuclets.js
 *
 * File that generates nuclets  proton, helium, lithium, helium - 1, 4, 7, 11
 */

Array.prototype.contains = function ( needle ) {
  for (var i in this) {
    if (this[i] == needle) return true;
  }
  return false;
};

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

  /**
   * Align the axis of an object to another axis.
   *
   * @param object
   * @param objectAxis
   * @param finalAxis
   * @param negate
   */
  function alignObjectToAxis(object, objectAxis, finalAxis, negate) {
    // Find the rotation axis.
    var rotationAxis = new THREE.Vector3();
    rotationAxis.crossVectors( objectAxis, finalAxis ).normalize();

    // calculate the angle between the element axis vector and rotation vector
    radians = Math.acos(objectAxis.dot(finalAxis) );

    // set the quaternion
    object.quaternion.setFromAxisAngle(rotationAxis, (negate) ? -radians : radians);
  }

  return {
    doAjax: doAjax,
    alignObjectToAxis: alignObjectToAxis
  };
};
