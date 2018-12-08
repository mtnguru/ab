/**
 * @file
 * Declare Atomizer module Bessel Graph dialog - Drupal.atomizer.dialogs.besselC.
 */

/*
 * Note: Variables ending with capital C or M designate Classes and Modules.
 * They can be found in their own files using the following convention:
 *   i.e. Drupal.atomizer.coreM is in file atomizer/js/src/atomizer.core.js
 *        Drupal.atomizer.dialogs.baseC is in file atomizer/js/src//dialogs/dialog_base.js
 * Variables starting with $ are only used for jQuery 'wrapped sets' of objects.
 */

(function ($) {
  'use strict';

  if (!Drupal.atomizer.dialogs) {
    Drupal.atomizer.dialogs = {};
  }

  /**
   * Define the bessel dialog - Display Bessel graph with interactive display.
   *
   * @param {object} spec
   *   Specifications for opening dialog, can also have ad-hoc properties
   *   not used by jQuery dialog but needed for other purposes.
   *
   * @return {dialog}
   *   Return the bessel dialog.
   */
  Drupal.atomizer.dialogs.besselC = function besselC(_viewer, spec) {
    var dialog;
    var $wrapper;
    var $image;
    var $canvas;
    var ctx;
    var iw, ih;
    var cw, ch;

    var viewer = _viewer;
    viewer.bessel = this;

    // merge spec into dspec - then create the dialog
    var dspec = $.extend({
      name: 'Bessel',
      title: 'Bessel Graph',
      zIndex: 1015,
      cssId: 'atomizer-bessel',
      draggable: true,
      resizable: true,
      styles: {
        position: 'absolute',
        left: '0px',
        top: '0px'
      }
    }, spec);
    dialog = Drupal.atomizer.dialogs.baseC(dspec);
    dialog.spec = dspec;
    dialog.viewer = _viewer;

    dialog.onButtonClick = function onButtonClick(buttonName) {
      switch (buttonName) {
        case 'atomizer-bessel-apply':
//        Viewer.applyFilter(adjustColor);
          break;

        case 'atomizer-bessel-reset':
          init();
//        $('#slider-hue').val(0);
//        $('#slider-saturation').val(0);
//        $('#slider-lightness').val(0);
//        adjustColor(Viewer.$canvas2, Viewer.$canvas);
          break;

        case 'atomizer-bessel-cancel':
//        Viewer.setEditMode('view');
//        Viewer.redraw();
//        dialog.dialogClose();
//        dialog.updateStatus();
          break;
      }
    };

    dialog.dialogOnCreate = function dialogOnCreate() {
      dialog.dialogOpen();
    };

    dialog.dialogOnOpen = function dialogOnOpen() {
      dialog.dialogInit();
    };

    dialog.dialogOnClose = function dialogOnClose() {
    };

    function init() {
      // load the image and set the loading callback.
    }

    dialog.dialogInit = function dialogInit() {

      if (!$wrapper) {
        $wrapper = $('#atomizer-bessel');
        $image = $wrapper.find('img');
        $canvas = $wrapper.find('canvas');
        ctx = $canvas[0].getContext('2d');
      }
      iw = $image[0].width;
      ih = $image[0].height;
      ch = dialog.viewer.canvas.height * .33;
      cw = ch * iw / ih;

      $canvas.attr({width: cw, height: ch});
      ctx.drawImage($image[0], 0 ,0, cw, ch);

      if (dialog.dialogIsOpen()) {
      }
    };

    dialog.dialogUpdate = function dialogUpdate() {
    };

    return dialog;
  };
})(jQuery);
