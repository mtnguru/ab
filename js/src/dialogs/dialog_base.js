/**
 * @file
 * Declare Imager module base class - Drupal.atomizer.dialogC.
 *
 * The dialog base class is the basis for all dialogs in the Imager module.
 *
 * When a dialog is opened for the first time an AJAX call is made which loads
 * the render array for the dialog and renders it.  The resulting HTML is then
 * inserted into the content area of the dialog.
 *
 * The easy way to open a dialog is to call dialogToggle.  The base class
 * loads the dialog if necessary, it then opens the dialog and calls
 * dialogOnOpen().  This results in the following logic:
 *
 * First column is the implementing class - either baseC or impC.
 * Substitute impC with the name of a real class implementing a dialogC dialog.
 *
 * baseC  dialogToggle()
 * baseC    if dialogHave()
 * baseC      if dialogIsOpen()
 * baseC        dialogClose()
 * impC           dialogOnClose()
 *            else
 * baseC        dialogOpen()
 * impC           dialogOnOpen()
 * impC             dialogUpdate()
 *          else
 * baseC       dialogLoad()
 * baseC          dialogCreate()
 * impC              dialogOnCreate()
 * baseC                dialogOpen()
 * impC                    dialogOnOpen()
 * impC                       dialogUpdate()
 */

/*
 * Note: Variables ending with capital C or M designate Classes and Modules.
 * They can be found in their own files using the following convention:
 *   i.e. Drupal.atomizer.coreM is in file atomizer/src/js/az.core.js
 *        Drupal.atomizer.dialogs.baseC is in file atomizer/src/js/dialogs/base.js
 */

/**
 * Wrap file in JQuery();.
 *
 * @param $
 */
(function ($) {
  'use strict';

  Drupal.atomizer.dialogs = {loaded: {}};

  /**
   * Initialize a dialog.
   *
   * Convenience function to initialize a dialog and set up buttons
   * to open and close it.
   *
   * @param {string} name
   *   Name of the dialog.
   * @param {string} buttonId [optional]
   *   CSS ID of the button which opens and closes this dialog.
   * @param {Object} processFunc [optional]
   *   Function to execute when button is clicked.
   *   If not specified it defaults to dialogToggle().
   *
   * @return {baseC} dialog
   */
  /*
  Drupal.atomizer.dialogs.initDialog = function initDialog(name, buttonId, processFunc) {
    var Dialogs = Drupal.atomizer.dialogs;
    var dialog;
    if (buttonId) {
      var $button = $(buttonId);
      if ($button) {
        // Execute dialogs constructor.
        dialog = Dialogs[name + 'C']({$selectButton: $button});
        if (processFunc) {
          $button.click(processFunc);
        }
        else {
          $button.click(this.dialogToggle);
        }
      }
    }
    else {
      // Execute dialogs constructor.
      dialog = Dialogs[name + 'C']({$selectButton: null});
    }
    Dialogs[name] = dialog;
    return dialog;
  };
  */

  Drupal.atomizer.dialogs.getDialog = function (viewer, name) {
    if (Drupal.atomizer.dialogs.loaded[name]) {
      return Drupal.atomizer.dialogs.loaded[name];
    } else {
      return Drupal.atomizer.dialogs[name + 'C'](viewer, {});
    }
  };

  Drupal.atomizer.dialogs.baseC = function baseC(spec) {
    var dialog = {
      settings: {},
      spec: spec || {}
    };

    // Return if dialog is loaded.
    dialog.dialogHave = function dialogHave() {
      return (this.$dialog) ? true : false;
    };

    // Load the dialog using AJAX.
    dialog.dialogLoad = function dialogLoad() {
      Drupal.atomizer.base.doAjax(
        '/ajax-ab/load-dialog',
        {
          action: 'load-dialog',
          dialogName: this.spec.name
        },
        this.dialogCreate);
    };

    // Create dialog from AJAX response.
    dialog.dialogCreate = function dialogCreate(response, $callingElement) {

      var settings = response[0].data;

      // Create the wrapper for this dialog.
      dialog.$wrapper = $(document.createElement('DIV'))
        .attr('id', dialog.spec.cssId)
        .addClass('atomizer-dialog');
      $(dialog.spec.container).append(dialog.$wrapper);
      Drupal.atomizer.dialogs.loaded[settings.id] = dialog;

      // Create the dialog title
      if (dialog.spec.title) {
        dialog.$title = $(document.createElement('H2'))
                         .addClass('title')
                         .html(dialog.spec.title);
        dialog.$wrapper.append(dialog.$title);
      }

      // Create the dialog content
      dialog.$content = $(document.createElement('DIV'))
        .addClass('content')
        .html(settings.content);
      dialog.$wrapper.append(dialog.$content);


      if (response.buttonpane) {
        // Create the dialog buttonpane
        dialog.$buttonpane = $(document.createElement('DIV'))
          .addClass('buttonpane')
          .html(response.buttonpane);
        dialog.$wrapper.append(dialog.$buttonpane);
        dialog.$buttonpane.find('input').click(function (event) {
          dialog.onButtonClick(event.target.id);
        });
      }

      dialog.$dialog = $('#' + dialog.spec.cssId);

      // Make the dialog resizable.
      if (dialog.spec.resizable) {
        dialog.$dialog.resizable({
          resize: function (event, ui) {
            if (dialog.dialogOnResize) {
              dialog.dialogOnResize(event, ui);
            }
          }
        });
      }

      // Make the dialog draggable.
      if (dialog.spec.draggable) {
        dialog.$wrapper.draggable();
      }

      // Set the zIndex.
      if (dialog.spec.zIndex) {
        dialog.$wrapper.css('zindex', dialog.spec.zIndex);
      }

      // Set CSS styles on the dialog
      if (dialog.spec.styles) {
        dialog.$wrapper.css(dialog.spec.styles);
      }
      else {
        dialog.$wrapper.css({left: '75px', bottom: '100px'});
      }

      // Let inheriting class make any final changes.
      dialog.dialogOnCreate();
    };

    /**
     * Actions to take when the dialog is opened.
     *
     * @return {boolean}
     *   True if open, False if closed.
     */
    dialog.dialogIsOpen = function dialogIsOpen() {
      return (this.$dialog && this.isOpen) ? true : false;
    };

    /**
     * If the dialog is open then close it.
     */
    dialog.dialogClose = function dialogClose() {
      if (this.$dialog) {
        if (this.spec.$selectButton) {
          this.spec.$selectButton.removeClass('checked');
        }
        if (this.isOpen) {
          this.isOpen = false;
          this.$dialog.hide();
        }
        this.dialogOnClose();
        this.settings = {};
      }
    };
    // Open the dialog if it exists, otherwise create it.
    dialog.dialogOpen = function dialogOpen(settings) {
      $.extend(this.settings, settings);
      if (this.$dialog) {
        if (this.spec.$selectButton) {
          this.spec.$selectButton.addClass('checked');
        }
        if (!this.isOpen) {
          this.isOpen = true;
          this.$dialog.show();
          this.dialogOnOpen();
        }
      }
      else {
        this.dialogLoad();
      }
    };
    // Toggle the dialog if it exists, otherwise create it.
    dialog.dialogToggle = function dialogToggle(settings) {
      $.extend(this.settings, settings);
      if (this.dialogHave()) {
        if (this.dialogIsOpen()) {
          this.dialogClose();
        }
        else {
          this.dialogOpen(settings);
        }
      }
      else {
        this.dialogLoad();
      }
    };

    dialog.setSelectButton = function setSelectButton($dialog) {
      this.spec.$selectButton = $dialog;
      if (this.dialogHave()) {
//      dialog.$dialog.dialog({
//        position: {
//          my: 'left',
//          at: 'right',
//          of: $dialog
//        }
//      });
      }
    };

    dialog.dialogUpdate = function dialogUpdate() {
    };
    dialog.dialogOnCreate = function dialogOnCreate() {
    };
    dialog.dialogOnOpen = function dialogOnOpen() {
    };
    dialog.dialogOnClose = function dialogOnClose() {
    };

    return dialog;
  };
})(jQuery);
