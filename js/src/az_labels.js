/**
 * @file az_labels.js
 */

(function ($) {

  Drupal.atomizer.labelsC = function (_viewer, controlSet) {
    let viewer = _viewer;
    let $div = $('.az-canvas-labels', viewer.context);

    let buttonClicked = function (event) {
      if (event.target.checked) {
        $div.show();
      } else {
        $div.hide();
      }
    };

    return {
      buttonClicked: buttonClicked,
    }
  };
})(jQuery);


