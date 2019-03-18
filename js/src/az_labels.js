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

    let display = (doit) => {
      if (doit == null) {
        doit = viewer.theme.get('labels--enable');
      }
      if (doit) {
        $div.show();
      }
      else {
        $div.hide();
      }
    };

    return {
      buttonClicked: buttonClicked,
      display: display,
    }
  };
})(jQuery);


