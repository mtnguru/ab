/**
 * @file - dir_molecule.js
 */

(function ($) {

  Drupal.atomizer.dir_moleculeC = function (_viewer) {
    let viewer = _viewer;

    let editAtom;

    let $atomList = $('.atom--list', viewer.context);
    let $atomFormBlock = $('#blocks--atom-form', viewer.context);
    if ($atomFormBlock.length) {
      var $atomPosition = $('.atom--position', viewer.context);
      var $atomRotation = $('.atom--rotation', viewer.context);
    }
    let $atomButtons;

    /**
     * Set value for the az-value and az-slider components.
     * @TODO move this to controls?  Requires creating a SetControl function.
     * @TODO How about set Position and Rotation sliders that gets all three?
     *
     *
     * @param id
     * @param value
     */
    const setSlider = (id, value) => {
      $(`#${id}--az-value`, viewer.context).val(value);
      $(`#${id}--az-slider`, viewer.context).val(value);
    };

    /**
     * Set values for position sliders.
     *
     * @param atom
     */
    const setPositionSliders = (atom) => {
      setSlider('atom--position--x', parseInt(atom.parent.position.x));
      setSlider('atom--position--y', parseInt(atom.parent.position.y));
      setSlider('atom--position--z', parseInt(atom.parent.position.z));
    };

    /**
     * Set values for rotation sliders
     *
     * @param atom
     */
    const setRotationSliders = (atom) => {
      setSlider('atom--rotation--x', parseInt(Drupal.atomizer.base.toDegrees(atom.rotation.x)));
      setSlider('atom--rotation--y', parseInt(Drupal.atomizer.base.toDegrees(atom.rotation.y)));
      setSlider('atom--rotation--z', parseInt(Drupal.atomizer.base.toDegrees(atom.rotation.z)));
    };

    const setEditAtom = (atom) => {
      if (atom) {
        var id = atom.az.conf.id;
        createAtomList();
//      viewer.controls.changeControlsMode('dir_molecule::setEditAtom', 'object', atom);

        if (editAtom) {
          viewer.atom.highlight(editAtom, false);
        }
        viewer.atom.highlight(atom, 'darken');
        editAtom = atom;

        // Move the atom edit form to the appropriate nuclet
        $atomFormBlock.insertAfter($atomList.find('.atom-' + id));
        $atomFormBlock.attr('data-object-id', id);
        $atomFormBlock.data('object-id', id);
        $atomFormBlock.removeClass('az-hidden');

        setPositionSliders(atom);
        setRotationSliders(atom);
      }
      else {
        $atomFormBlock.addClass('az-hidden');
      }
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
      out += `<div class="header" data-type="${atom.az.conf.type}" data-atom-id="${atom.az.id}">${atom.az.conf.name.replace(' ','-')}</div>`;
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
        for (let key in viewer.objects) {
          let atom = viewer.objects[key];
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
          }
          else {
            if (editAtom) {
              viewer.atom.highlight(editAtom, false);
              viewer.render();
            }
//          viewer.controls.changeControlsMode('dir_molecule::setEditAtom', 'scene');
            $atomFormBlock.addClass('az-hidden');
          }
        });
      }
    };

    /**
     * Extract the yml structure of the molecule.
     */
    function extractStructure (molecule) {
      var out = '';

      out += `name: ${molecule.conf.name}\n`;
      out += `zoom: ${molecule.conf.zoom}\n`;
      out += `objects:\n`;
      for (let a in viewer.objects) {
        let object = viewer.objects[a];
        out += `  ${object.az.id}:\n`;
        out += `    type: ${object.az.conf.type}\n`;
        out += `    name: ${object.az.conf.name}\n`;
        out += `    nid: ${object.az.conf.nid}\n`;

        out += '    position: [';
        out += parseInt(object.parent.position.x) + ', ';
        out += parseInt(object.parent.position.y) + ', ';
        out += parseInt(object.parent.position.z) + ']\n';

        out += '    rotation: [';
        out += parseInt(Drupal.atomizer.base.toDegrees(object.rotation.x)) + ', ';
        out += parseInt(Drupal.atomizer.base.toDegrees(object.rotation.y)) + ', ';
        out += parseInt(Drupal.atomizer.base.toDegrees(object.rotation.z)) + ']\n';
      }
      return out;
    }

    /**
     * Define Drupal behavior attach functions.
     * When the molecule edit form is popped up, initialize the molecule structure.
     *
     * @type {{attach: Drupal.behaviors.atomizer_molecule.attach}}
     */
    Drupal.behaviors.atomizer_molecule = {
      attach: function (context, settings) {
        // If this is the node-molecule-form being opened then fill in the molecule structure field.
        if ($(context).hasClass('node-molecule-edit-form') || $(context).hasClass('node-molecule-form')) {
          var $nodeForm = $(context);
          var $textarea = $nodeForm.find('.field--name-field-molecule-structure textarea');
          let molecule = viewer.scene.az;
          let txt = extractStructure(molecule);
          $textarea.val(txt);
        }
      }
    };

    /**
     * mouseUp
     *
     * @param event
     * @param mouse
     */
    const mouseUp = (event, mouse) => {
      return;
    };

    /**
     * mouseDown
     *
     * @param event
     * @param mouse
     */
    const mouseDown = (event, mouse) => {
      if (editAtom) {
        // The mouseDown event applies to the current edit atom?
      } else {
        // The mouseDown even
      }
    };

    /**
     * onAtomAddButton
     *
     * @param event
     */
    const onAtomAddButton = (event) => {

    };

    /**
     * User pressed button to delete atom.
     */
    $atomFormBlock.find('.atom--delete').click(() => {
      viewer.producer.deleteObject($atomFormBlock.data('object-id'));
      createAtomList();
      viewer.render();
    });

    /**
     * User pressed button to Add Atom.
     */
    /*
    let shit = $('#molecule--addAtom', viewer.context);
    $('#molecule--addAtom', viewer.context).mousedown((event) => {
      event.preventDefault();
      return false;
    });
    $('#molecule--addAtom', viewer.context).click((event) => {
      event.preventDefault();
      return false;
    });
    */

    /**
     * moleculeLoaded
     *
     * @param molecule
     */
    const moleculeLoaded = (molecule) => {
      viewer.objects = {};

      // Replace the link on the save button with a link to the current molecule.
      var $save = $('.molecule--save a', viewer.context);
      if ($save.length) {
        $save.replaceWith(molecule.az.link);
        if (Drupal.attachBehaviors) {
          Drupal.attachBehaviors($save[0]);
        }
      }
    };

    /**
     * objectLoaded
     *
     * @param object
     */
    const objectLoaded = (object) => {
      viewer.objects[object.az.id] = object;
      createAtomList();
    };


    return {
      objectLoaded,
      moleculeLoaded,
      setEditAtom,
      setPositionSliders,
      setRotationSliders,
    };
  };

})(jQuery);
