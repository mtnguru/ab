/**
 * @file - prod_molecule.js
 */

(function ($) {

  Drupal.atomizer.prod_moleculeC = function (_viewer) {
    let viewer = _viewer;

    let editAtom;
    let objects = {};

    let $atomList = $('.atom--list', viewer.context);
    let $atomFormBlock = $('.blocks--atom-form', viewer.context);
    if ($atomFormBlock.length) {
      var $atomPosition = $('.atom--position', viewer.context);
      var $atomRotation = $('.atom--rotation', viewer.context);
    }
    let $atomButtons;

    const setSlider = (id, value) => {
      $(`#${id}--az-value`, viewer.context).val(value);
      $(`#${id}--az-slider`, viewer.context).val(value);
    };

    const setEditAtom = (atom) => {
      var id = atom.az.id;
      createAtomList(atom.az.atom);
      if (editAtom) {
        viewer.atom.highlight(editAtom, false);
      }
      viewer.atom.highlight(atom, 'darken');
      editAtom = atom;

      viewer.render();

      // Move the atom edit form to the appropriate nuclet
      $atomFormBlock.insertAfter($atomList.find('.atom-' + id));

      setSlider('atom--position--x', atom.position.x);
      setSlider('atom--position--y', atom.position.y);
      setSlider('atom--position--z', atom.position.z);

      setSlider('atom--rotation--x', atom.rotation.x);
      setSlider('atom--rotation--y', atom.rotation.y);
      setSlider('atom--rotation--z', atom.rotation.z);
    };

    const addAtomToList = (atom) => {
      let out = '<div class="atom atom-' + atom.az.id + '">';
      out += `<div class="header" data-type="${atom.az.conf.type}" data-atom-id="${atom.az.id}">${atom.az.conf.name}</div>`;
      out += '</div>\n';
      return out;
    };

    const createAtomList = () => {
      if ($atomFormBlock.length) {
        // Save the atom form before overwriting the list.
        $atomFormBlock.insertAfter($('.blocks--molecule-scene'), viewer.context);

        let out = '';
        for (let key in objects) {
          let atom = objects[key];
          if (atom.az.conf.type == 'atom') {
            out += addAtomToList(atom);
          }
        }
        $atomList.html(out);

        // If an atom name is clicked on the - hides/displays atom form for selected atom
        $atomButtons = $atomList.find('.atom');
        $atomButtons.click((e) => {
          let atomId = $(e.target).data('atom-id');
          let atom = viewer.getObject(atomId);
          if ($atomFormBlock.hasClass('az-hidden') || atom !== editAtom) {
            setEditAtom(atom);
            viewer.controls.changeControlsMode('object', atom);
            $atomFormBlock.removeClass('az-hidden');
          }
          else {
            if (editAtom) {
              viewer.atom.highlight(editAtom, false);
              viewer.render();
            }
            viewer.controls.changeControlsMode('scene');
            $atomFormBlock.addClass('az-hidden');
          }
        });
      }
    };

    const mouseUp = (event, distance) => {
      return;
    };

    const mouseDown = (event, distance) => {
      if (editAtom) {
        // The mouseDown event applies to the current edit atom?
      } else {
        // The mouseDown even
      }
      return;
    };

    const onAtomAddButton = (event) => {

    };

    const onAtomDeleteButton = (event) => {

    };

    const moleculeLoaded = (molecule) => {

    };

    const objectLoaded = (object) => {
      objects[object.az.id] = object;
      createAtomList();
      return;
    };

    return {
      objectLoaded: objectLoaded,
      moleculeLoaded: moleculeLoaded,
    };
  };

})(jQuery);
