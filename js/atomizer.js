/**
 * @file - atomizerviewer.js
 *
 */
  'use strict';

Drupal.behaviors.atomizer = {
  // Attach functions are executed by Drupal upon page load or ajax loads.
  attach: function (context, settings) {
    if (!Drupal.atomizer.base) {  // Ensures we only run this once
      Drupal.atomizer.base     = Drupal.atomizer.baseC();
      for (var atomizerKey in drupalSettings.atomizer) {
        Drupal.atomizer.viewerC(drupalSettings.atomizer[atomizerKey]);
      }
    }
  }
};

