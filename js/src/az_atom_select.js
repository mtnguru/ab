/**
 * @file - az_atom.js
 *
 * Manage atom's - load, save, create
 */

(function ($) {

  Drupal.atomizer.atom_selectC = function (_viewer) {

    let viewer = _viewer;

    // Page elements to select a new atom.
    const $wrapper = ('#select-atom-wrapper', viewer.context);
    const $atomSelectEnable = $('#atom-select-enable', viewer.context);
    const $atomSelectClose = $wrapper.find('.az-close');
    const $isotopes = $wrapper.find('#select-atom-wrapper .isotopes .isotope');
    const $atoms = $wrapper.find('#select-atom-wrapper .default-isotope');

    let atomListSequence = [];
    let selectedNid;
    let selectedIndex = 0;
    let includeIsotopes = false;

    /**
     * User pressed a button on the main form - act on it.
     *
     * @param id
     */
    const buttonClicked = function buttonClicked(event) {
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
        let $isotopes = $(this).parent().siblings('.isotopes');
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
      let $atoms = $('.atom-name, .atomic-number', viewer.context);
      $atoms.click(function (event) {
        let nid = $(event.target.parentNode).data('nid');
        nid = (nid) ? nid : $(event.target).data('nid');
        viewer.atom.loadObject({ nid: nid }, null);
        if (viewer.getDisplayMode() == 'mobile' ||
            viewer.getDisplayMode() == 'tablet') {
          $wrapper.addClass('az-hidden');
        }
        event.preventDefault();
      });

      $atomSelectEnable.click(function () {
        if ($wrapper.hasClass('az-hidden')) {
          $wrapper.removeClass('az-hidden');
        } else {
          $wrapper.addClass('az-hidden');
        }
      });

      $atomSelectClose.click(function () {
        $wrapper.addClass('az-hidden');
      })
    }

    function buildList() {

      // If the list doesn't exist then build it.
      if (atomListSequence.length == 0) {
        // Extract the list of atoms from the html
        for (let atom of $atoms) {
//        let atom = $atoms[key];
          let nid = $(atom).find('.atom-name').data('nid');
          atomListSequence.push(nid);
//        atomList[`A${nid}`] = {
//          nid: $(atom).data('nid'),
//          name: atom.text,
//          stability: $(atom).data('stability'),
//        };
        }
      }
    }

    const getSelectedAtom = () => selectedNid;

    const getNextAtom = () => {
      if (atomListSequence.length == 0) {
        buildList();
      }
      selectedIndex = (++selectedIndex < atomListSequence.length) ? selectedIndex : 0;
      return selectedNid = atomListSequence[selectedIndex];
    };

    const getPreviousAtom = () => {
      if (atomListSequence.length == 0) {
        buildList();
      }
      selectedIndex = (--selectedIndex < 0) ? atomListSequence.length - 1 : selectedIndex;
      return selectedNid = atomListSequence[selectedIndex];
    };

    const setSelectedAtom = (atomNid) => {
      selectedNid = atomNid;
      selectedIndex = atomListSequence.indexOf(selectedNid);

      $atoms.removeClass('selected');
      $isotopes.removeClass('selected');

      $atoms.find(`.nid-${atomNid}`).parents('.default-isotope').addClass('selected');
      $isotopes.find(`.nid-${atomNid}`).parent('.isotope').addClass('selected');
    };

    addIsotopeEnableEventListeners();
    addSelectAtomEventListeners();

    /**
     * Interface to this atom_selectC.
     */
    return {
      buttonClicked: buttonClicked,
      getSelectedAtom: getSelectedAtom,
      getNextAtom: getNextAtom,
      getPreviousAtom: getPreviousAtom,
      setSelectedAtom: setSelectedAtom,
      setIncludeIsotopes: setIncludeIsotopes = (include) => {
        includeIsotopes = include;
        buildList();
      }
    };
  };

})(jQuery);
