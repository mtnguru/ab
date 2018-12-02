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

  Drupal.atomizer.dialogs = {};

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
          $button.click(dialog.dialogToggle);
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

  Drupal.atomizer.dialogs.baseC = function baseC(spec) {
    var dialog = {
      settings: {},
      spec: spec || {}
    };

    // Return if dialog is loaded.
    dialog.dialogHave = function dialogHave() {
      return (dialog.$elem) ? true : false;
    };

    // Load the dialog using AJAX.
    dialog.dialogLoad = function dialogLoad() {
      Drupal.atomizer.core.ajaxProcess(dialog,
        Drupal.atomizer.settings.actions.renderDialog.url,
        {
          action: 'render-dialog',
          dialogName: dialog.spec.name
        },
        dialog.dialogCreate);
    };

    // Create dialog from AJAX response.
    dialog.dialogCreate = function dialogCreate(response, $callingElement) {
      // Create the dialog wrapper.
      dialog.$wrapper = $(document.createElement('DIV'))
        .attr('id', dialog.spec.cssId)
        .addClass('atomizer-dialog');
      Drupal.atomizer.$wrapper.append(dialog.$wrapper);

      // Create the dialog title
      if (dialog.spec.title) {
        dialog.$title = $(document.createElement('DIV'))
                         .addClass('atomizer-title')
                         .html(dialog.spec.title);
        dialog.$wrapper.append(dialog.$title);
      }

      // Create the dialog content
      dialog.$content = $(document.createElement('DIV'))
        .addClass('atomizer-content')
        .html(response.content);
      dialog.$wrapper.append(dialog.$content);


      if (response.buttonpane) {
        // Create the dialog buttonpane
        dialog.$buttonpane = $(document.createElement('DIV'))
          .addClass('atomizer-buttonpane')
          .html(response.buttonpane);
        dialog.$wrapper.append(dialog.$buttonpane);
        dialog.$buttonpane.find('input').click(function (event) {
          dialog.onButtonClick(event.target.id);
        });
      }

      dialog.$elem = $('#' + dialog.spec.cssId);

      // Make the dialog resizable.
      if (dialog.spec.resizable) {
        dialog.$elem.resizable({
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

      // Position the dialog.
      if (dialog.spec.position) {
        dialog.$wrapper.css(dialog.spec.position);
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
      return (dialog.$elem && dialog.isOpen) ? true : false;
    };

    /**
     * If the dialog is open then close it.
     */
    dialog.dialogClose = function dialogClose() {
      if (dialog.$elem) {
        if (dialog.spec.$selectButton) {
          dialog.spec.$selectButton.removeClass('checked');
        }
        if (dialog.isOpen) {
          dialog.isOpen = false;
          dialog.$elem.hide();
        }
        dialog.dialogOnClose();
        dialog.settings = {};
      }
    };
    // Open the dialog if it exists, otherwise create it.
    dialog.dialogOpen = function dialogOpen(settings) {
      $.extend(dialog.settings, settings);
      if (dialog.$elem) {
        if (dialog.spec.$selectButton) {
          dialog.spec.$selectButton.addClass('checked');
        }
        if (!dialog.isOpen) {
          dialog.isOpen = true;
          dialog.$elem.show();
          dialog.dialogOnOpen();
        }
      }
      else {
        dialog.dialogLoad();
      }
    };
    // Toggle the dialog if it exists, otherwise create it.
    dialog.dialogToggle = function dialogToggle(settings) {
      $.extend(dialog.settings, settings);
      if (dialog.dialogHave()) {
        if (dialog.dialogIsOpen()) {
          dialog.dialogClose();
        }
        else {
          dialog.dialogOpen(settings);
        }
      }
      else {
        dialog.dialogLoad();
      }
    };

    dialog.setSelectButton = function setSelectButton($elem) {
      dialog.spec.$selectButton = $elem;
      if (dialog.dialogHave()) {
//      dialog.$elem.dialog({
//        position: {
//          my: 'left',
//          at: 'right',
//          of: $elem
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
