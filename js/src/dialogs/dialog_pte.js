// import { dialogC } from './dialog.js';

(function ($) {

  Drupal.atomizer.pteDialogC = function (_viewer, _elements) {
    let viewer = _viewer;
    let elements = _elements;
    let dialog = Object.create(Drupal.atomizer.dialogs.baseC);
    dialog.name('Periodic Table of Elements');

    dialog.onCreate = function () {
      let $content = this.$dialog.find('.content-pane');
//    window.addEventListener('resize', dialog.onResize);
      viewer.pte.create($content, elements);
      $('.element .symbol-large').removeClass('az-hidden');
    };

    dialog.onOpen = function () {
      $('.element .symbol-large').removeClass('az-hidden');
      return;
    };

    dialog.onClose = function () {
      return;
    };

    dialog.onResize = function() {
      viewer.pte.onResize();
//     dialog.canvas.width = dialog.img.width;
//     dialog.canvas.height = dialog.img.height;
//     dialog.$dialog.resizeable({aspectRatio: imageSpecs.width / (imageSpecs.height + 28)});
    };

    dialog.onButtonClick = function () {
      // Nothing?
      return;
    };

    let settings = {
      name: 'pte',
      title: '<i class="fas fa-table"></i>Periodic Table of Elements',
      id: `${dialog.name().replace(/ /g,'-')}-dialog-container`,
      class: ['az-dialog', 'pte-container'],
      containerSelector: '.az-wrapper',
      content: '<div class="image-wrapper">Periodic Table goes here</div>',
      resizeable: {aspectRatio: 1.50},
      closeButton: true,
      draggable: true,
      isLoaded: true,
      isOpen: true,
    };

    dialog.create(settings);

    return dialog;
  }

})(jQuery);
