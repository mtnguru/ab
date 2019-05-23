/**
 * @file - az_atom.js
 *
 * Manage atom's - load, save, create
 */

(function ($) {

  Drupal.atomizer.atom_selectC = function (_viewer, showDialog = true) {

    let viewer = _viewer;

    // Page elements to select a new atom.
    const $wrapper = $('#select-atom-wrapper', viewer.context);
    if (showDialog) {
      $wrapper.removeClass('az-hidden');
    }
    const $atomSelectEnable = $('#atom-select-enable, #molecule--addAtom', viewer.context);
    const $atomSelectClose = $wrapper.find('.az-close');
    let $isotopes;
    const $pteEnable = $wrapper.find('.pte-enable, .sam-enable');

    let elements = {};
    let $atoms;
    let atomListSequence = [];   // List of atoms so we can step through them
    let selectedIndex = 0;
    let selectedNid;
    let includeIsotopes = false;

    const createSelectList = (conf) => {

      Drupal.atomizer.base.doAjax(
        '/ajax/loadAtomList',
        { conf: conf },
        doCreateSelectList
      );
    };

    const doCreateSelectList = (results) => {
      let html = '';
      for (let i = 0; i < results.length; i++) {
        if (results[i].command == 'loadAtomListCommand') {
          elements = results[i].data.list;
          for (let e in elements) {
            let element = elements[e];
            if (element.num_isotopes == 0) continue;

            html += '<div class="select-item-wrapper">\n';

            // Create the element div
            html += `
              <div class="default-isotope stability-${element.stability.toLowerCase()}">
                <span class="atomic-number">${element.atomic_number}</span>
                <span class="atom-title ${element.stability.toLowerCase()}">
                  <a href="#" class="atom-name select-item-name nid-${element.default_atom_nid}"
                    data-nid="${element.default_atom_nid}"
                    data-stability="${element.stability.toLowerCase()}"
                  >
                    <span class="symbol">${element.symbol}</span>
                    <span class="title">${element.name}</span>
                  </a>
                </span>
                <span class="num-isotopes az-closed expand">${element.num_isotopes}</span>
              </div>
              
              <div class="isotopes az-closed" title="Isotopes">
                <ul class="isotope-list">
            `;

            // Add the isotope list
            for (let i = 0; i < element.isotopes.length; i++) {
              let isotope = element.isotopes[i];
              html += `
                <li class="isotope not-default">
                  <a href="#" class="atom-name nid-${isotope.nid}"
                     data-nid="${isotope.nid}"
                     data-stability="${isotope.name.toLowerCase()}"
                  >
                    ${isotope.title}
                  </a>
                </li>
              `;
            } // for each isotope

            // Close the isotope list elements
            html += `
                  </ul>
                </div>
              </div>
            `;
          } // for each element

          $('#select-atom-list').html(html);

          $atoms =    $wrapper.find('.default-isotope');
          $isotopes = $wrapper.find('.isotopes .isotope');

          // Add the event listeners.
          addIsotopeEnableEventListeners();
          addSelectAtomEventListeners();


        } // if loadAtomListCommand
      } // for each ajax response item

//  viewer.pte.create($('#select-atom-wrapper .pte-container', viewer.context));

    };

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
    $('.atom--select-close').click(() => {
      $(viewer.context).removeClass('select-atom-enabled');
    });

    // User clicked on PTE enable/disabl button - popup or close the pte dialog.
    $pteEnable.click((event) => {
      viewer.pte.setLayout($(event.target).data('layout'));
      if (!viewer.pteDialog) {
        viewer.pteDialog = Drupal.atomizer.pteDialogC(viewer, elements);
      } else {
        viewer.pteDialog.toggle();
      }
    });

    /**
     *
     */
    function addIsotopeEnableEventListeners () {
      $('.num-isotopes').click((event) => {
        let $isotopes = $(event.currentTarget).parent().siblings('.isotopes');
        if ($isotopes.hasClass('az-closed')) {
          $(event.currentTarget).removeClass('az-closed');
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
      let $satoms = $('.atom-name, .atomic-number', viewer.context);
      $satoms.click((event) => {
        event.preventDefault();
        if (!showDialog) {
          $wrapper.addClass('az-hidden');
        }
        let nid = $(event.target.parentNode).data('nid');
        nid = (nid) ? nid : $(event.target).data('nid');
        viewer.atom_select.setSelectedAtom(nid);
        let name = event.target.textContent;
        let id = viewer.producer.createUniqueObjectKey(name);
        viewer.atom.loadObject({
          nid,
          id,
          name,
          type: 'atom',
          needsPosition: true,
        },null);
        if (viewer.getDisplayMode() == 'mobile' ||
            viewer.getDisplayMode() == 'tablet') {
          $wrapper.addClass('az-hidden');
        }
      });

      $atomSelectEnable.click((event) => {
        event.preventDefault();
        if ($wrapper.hasClass('az-hidden')) {
          $wrapper.removeClass('az-hidden');
        } else {
          $wrapper.addClass('az-hidden');
        }
        return false;
      });

      $atomSelectClose.click(() => {
        $wrapper.addClass('az-hidden');
      });
    }

    function buildList() {
      // If the list doesn't exist then build it.
      if (atomListSequence.length == 0) {
        // Extract the list of atoms from the html
        for (let e in elements) {
          let element = elements[e];
          atomListSequence.push(element.default_atom_nid);
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
      if (atomListSequence.length == 0) {
        buildList();
      }
      selectedNid = atomNid;
      selectedIndex = atomListSequence.indexOf(selectedNid);

      if ($atoms) {
        $atoms.removeClass('selected');
        $atoms.find(`.nid-${atomNid}`).parents('.default-isotope').addClass('selected');
      }
      if ($isotopes) {
        $isotopes.removeClass('selected');
        $isotopes.find(`.nid-${atomNid}`).parent('.isotope').addClass('selected');
      }
      console.log(`setSelectedAtom ${atomNid}`);
    };

    createSelectList({});

    /**
     * Interface to this atom_selectC.
     */
    return {
      createSelectList,
      buttonClicked,
      getSelectedAtom,
      getNextAtom,
      getPreviousAtom,
      setSelectedAtom,
      setIncludeIsotopes: (include) => {
        includeIsotopes = include;
        buildList();
      }
    };
  };

})(jQuery);
