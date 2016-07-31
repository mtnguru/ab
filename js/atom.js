/**
 * @file - atom_viewer.js
 *
 */
  'use strict';

Drupal.behaviors.atom_builder = {
  // Attach functions are executed by Drupal upon page load or ajax loads.
  attach: function (context, settings) {
    if (Drupal.atom_builder.base) {  // Ensures we only run this once
      return;
    }
    Drupal.atom_builder.base     = Drupal.atom_builder.baseC();
    var viewer = Drupal.atom_builder.viewerC({
      nuclet: 'carbon.yml',
      controlSet: drupalSettings.atom_builder.controlSet,
      styleSet: drupalSettings.atom_builder.styleSet,
      styleSetName: drupalSettings.atom_builder.styleSet.name
    });
  }
};

