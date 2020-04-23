/**
 * @file - az.js
 *
 */


(function ($) {

  'use strict';

  Drupal.behaviors.atomizer = {
    // Attach functions are executed by Drupal upon page load or ajax loads.
    attach: function (context, settings) {
      if (!Drupal.atomizer.base) {  // Ensures we only run this once
        console.log('Initial startup')
        Drupal.atomizer.base     = Drupal.atomizer.baseC();
        for (var atomizerKey in drupalSettings.atomizer) {
          Drupal.atomizer.viewerC(drupalSettings.atomizer[atomizerKey]);
        }

        // jQuery dialogs need this executed once to enable the close button in the upper right.
        // See: http://stackoverflow.com/questions/8681707/jqueryui-modal-dialog-does-not-show-close-button-x
//      $.fn.bootstrapBtn = $.fn.button.noConflict();
      }
    }
  };

})(jQuery);
