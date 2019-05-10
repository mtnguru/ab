// import { dialogC } from './dialog.js';

(function ($) {

  Drupal.atomizer.pteDialogC = function (_viewer) {
    let viewer = _viewer;
    let dialog = Object.create(Drupal.atomizer.dialogs.baseC);
    dialog.name('Periodic Table');

    dialog.onCreate = function () {
      let $content = this.$dialog.find('.content-pane');
//    window.addEventListener('resize', dialog.onResize);
      viewer.pte.create($content)
    };

    function update(e) {
      /// correct mouse position so it's relative to canvas
      let r = dialog.canvas.getBoundingClientRect(),
        x = e.clientX - r.left,
        y = e.clientY - r.top;

      if (x < imageSpecs.left * dialog.img.width) x = imageSpecs.left * dialog.img.width;
      if (x > dialog.img.width - imageSpecs.right * dialog.img.width) x = dialog.img.width - imageSpecs.right * dialog.img.width;

      /// draw background image to clear previous line and text
      ctx.drawImage(dialog.img, 0, 0, dialog.canvas.width, dialog.canvas.height);

      /// update line object and draw it
      dialog.line.x1 = x;
      dialog.line.x2 = x;
      dialog.line.draw();

      // Update the particles opacity
      updateOpacity(dialog.line.x1);
    }


    dialog.onOpen = function () {
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
      title: '<i class="fas fa-table"></i>Periodic Table',
      id: `${dialog.name().replace(/ /g,'-')}-dialog-container`,
      class: 'az-dialog',
      containerSelector: '.az-wrapper',
      content: '<div class="image-wrapper">Shit</div>',
      resizeable: {aspectRatio: 1.50},
//    resizeable: {},
      closeButton: true,
      draggable: true,
      isLoaded: true,
      isOpen: true,
    };

    dialog.create(settings);

    return dialog;
  }

})(jQuery);
