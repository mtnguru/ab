/**
 * @file - az_atom.js
 *
 * Manage atom's - load, save, create
 */

(function ($) {

  Drupal.atomizer.atom_selectC = function (_viewer) {

    var viewer = _viewer;

    // Page elements to select a new atom.
    var $atomList = $('#select-atom-wrapper', viewer.content);
    var $atomSelectEnable = $('#atom-select-enable', viewer.context);
    var $atomSelectClose = $atomList.find('.az-close');
    var $atoms = $('.atom-name, .atomic-number', viewer.context);

    /**
     * User pressed a button on the main form - act on it.
     *
     * @param id
     */
    var buttonClicked = function buttonClicked(event) {
      // User pressed Select Atom button
      if (event.target.id == 'atom--select') {
        $(viewer.context).toggleClass('select-atom-enabled', viewer.context);
      }
    };

    // Set up event handler when user closes atom-select button
    $('.atom--select-close').click(function () {
      $(viewer.context).removeClass('select-atom-enabled');
    });

    /**
     *
     */
    function addIsotopeEnableEventListeners () {
      $('.num-isotopes').click(function () {
        var $isotopes = $(this).parent().siblings('.isotopes');
        if ($isotopes.hasClass('az-closed')) {
          $(this).removeClass('az-closed');
          $isotopes.removeClass('az-closed');
        } else {
          $isotopes.addClass('az-closed');
        }
      });
    }

    /**
     * Add event listeners for when a user selects an atom.
     */
    function addSelectAtomEventListeners() {
      // Add Event listeners to atoms to select.
      $atoms.click(function (event) {
        viewer.atom.loadObject({
          nid: $(event.target.parentNode).data('nid'),
        }, null);
        if (viewer.getDisplayMode() == 'mobile' ||
            viewer.getDisplayMode() == 'tablet') {
          $atomList.addClass('az-hidden');
        }
        event.preventDefault();
      });


      $atomSelectEnable.click(function () {
        if ($atomList.hasClass('az-hidden')) {
          $atomList.removeClass('az-hidden');
        } else {
          $atomList.addClass('az-hidden');
        }
      });

      $atomSelectClose.click(function () {
        $atomList.addClass('az-hidden');
      })
    }

    addIsotopeEnableEventListeners();
    addSelectAtomEventListeners();

    /**
     * Interface to this atom_selectC.
     */
    return {
      buttonClicked: buttonClicked,
    };
  };

})(jQuery);
