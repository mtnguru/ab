/**
 * @file - dir_molecule.js
 */

(function ($) {

  Drupal.atomizer.dir_moleculeC = function (_viewer) {
    let viewer = _viewer;

    let editAtom;
    let objects = {};

    let $atomList = $('.atom--list', viewer.context);
    let $atomFormBlock = $('#blocks--atom-form', viewer.context);
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
      viewer.render();
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

      $atomFormBlock.attr('data-object-id', id);
      $atomFormBlock.data('object-id', id);

//    setTimeout(() => {
        setSlider('atom--position--x', atom.parent.position.x);
        setSlider('atom--position--y', atom.parent.position.y);
        setSlider('atom--position--z', atom.parent.position.z);

        setSlider('atom--rotation--x', atom.rotation.x * 180 / Math.PI);
        setSlider('atom--rotation--y', atom.rotation.y * 180 / Math.PI);
        setSlider('atom--rotation--z', atom.rotation.z * 180 / Math.PI);
        viewer.render();
//      setTimeout(() => {
//      }, 1000);
//    }, 1000);
      viewer.render();
    };

    /**
     * addAtomToList
     *
     * @param atom
     * @returns {string}
     */
    const addAtomToList = (atom) => {
      let out = '<div class="atom atom-' + atom.az.id + '">';
      out += `<div class="header" data-type="${atom.az.conf.type}" data-atom-id="${atom.az.id}">${atom.az.conf.name}</div>`;
      out += '</div>\n';
      return out;
    };

    /**
     * createAtomList
     */
    const createAtomList = () => {
      if ($atomFormBlock.length) {
        // Save the atom form before overwriting the list.
        $atomFormBlock.insertAfter($('.blocks--molecule-structure'), viewer.context);

        let out = '';
        for (let key in objects) {
          let atom = objects[key];
          if (atom.az.conf.type == 'atom') {
            out += addAtomToList(atom);
          }
        }
        $atomList.html(out);

        // If a molecule name is clicked
        $atomButtons = $atomList.find('.atom');
        $atomButtons.click((e) => {
          let atomId = $(e.target).data('atom-id');
          let atom = viewer.producer.getObject(atomId);
          if ($atomFormBlock.hasClass('az-hidden') || atom !== editAtom) {
            setEditAtom(atom);
//          viewer.controls.changeControlsMode('object', atom);
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

    /**
     * Extract the yml structure of the molecule.
     *
     * -------------------------------
     * name: Calcium Chloride
     * zoom: 1
     * objects:
     *   calcium-1:
     *     type: atom
     *     name: Calcium 40
     *     nid: 730
     *     position: {x: 0, y: -150, z: 0}
     *     rotation: {x: 0, y: 0, z: 0}
     *   chlorine-1:
     *     type: atom
     *     name: Chlorine 35
     *     nid: 466
     *     position: {x: -250, y: 250, z: 0}
     *     rotation: {x: 0, y: 0, z: 0}
     *   chlorine-2:
     *     type: atom
     *     name: Chlorine 35
     *     nid: 466
     *     position: {x: 250, y: 250, z: 0}
     *     rotation: {x: 0, y: 180, z: 0}
     * -------------------------------
     *
     * @returns {*}
     */
    function extractStructure (molecule) {
      var out = spacing + id + ':\n';
      out += `name: ${molecule}\n`;
      out += `zoom: ${molecule}\n`;
      out += `objects: ${molecule}\n`;
      out += `    ${molecule.id}\n:`;
      out += `      type: atom`;
      out += `      name: ${atom.id}\n`;
      out += `      nid: ${atom.nid}\n`;
      out += `      position: {xatom.position.x]${atom.id}\n`;
      out += `      name: ${atom.id}\n`;
      out += `      name: ${atom.id}\n`;
      out += `      name: ${atom.id}\n`;
      /*
      * name: Calcium Chloride
      * zoom: 1
      * objects:
      *   calcium-1:
      *     type: atom
      *     name: Calcium 40
      *     nid: 730
      *     position: [0,-150,0]
      *     rotation: [0,0,0]
      *   chlorine-1:
      *     type: atom
      *     name: Chlorine 35
      *     nid: 466
      *     position: [-250,250,0]
      *     rotation: [0,0,0]
      *   chlorine-2:
    *     type: atom
      *     name: Chlorine 35
      *     nid: 466
      *     position: [250,250,0]
      *     rotation: [0,0,0]
      *     */

      return out;
    }

    /**
     * Define Drupal behavior attach functions.
     *
     * Nuclet Edit form popup
     *   Attach Listener to "Add nuclet" button
     * Atom Edit form popup
     *   Populate Atomic Structure field with current Viewer contents.
     *
     * @type {{attach: Drupal.behaviors.atomizer_atom.attach}}
     */
    Drupal.behaviors.atomizer_molecule = {
      attach: function (context, settings) {
        // If this is the node-molecule-form being opened then fill in the molecule structure field.
        var $nodeForm = $('.node-molecule-form, .node-molecule-edit-form');
        if ($(context).hasClass('node-molecule-edit-form') || $(context).hasClass('node-molecule-form')) {

          var $textarea = $nodeForm.find('.field--name-field-molecule-structure textarea');
          let molecule = viewer.getObject("A1");
          $textarea.val(extractStructure(molecule));
        }
      }
    };

    /**
     * mouseUp
     *
     * @param event
     * @param distance
     */
    const mouseUp = (event, distance) => {
      return;
    };

    /**
     * mouseDown
     *
     * @param event
     * @param distance
     * @param protonColor
     */
    const mouseDown = (event, distance, protonColor) => {
      if (editAtom) {
        // The mouseDown event applies to the current edit atom?
      } else {
        // The mouseDown even
      }
      return;
    };

    /**
     * onAtomAddButton
     */
    const onAtomAddButton = (event) => {

    };

    /**
     * onAtomDeleteButton
     *
     * @param event
     */
    const onAtomDeleteButton = (event) => {

    };

    /**
     * moleculeLoaded
     * @param molecule
     */
    const moleculeLoaded = (molecule) => {
      objects = {};
    };

    /**
     * objectLoaded
     *
     * @param object
     */
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
