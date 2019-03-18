// import { dialogC } from './dialog.js';

(function ($) {

  Drupal.atomizer.dialogs.besselC = function (_viewer) {
    let viewer = _viewer;
    let dialog = Object.create(Drupal.atomizer.dialogs.baseC);
    dialog.name('Bessel Graph');

    let imageSpecs = {
      top: .030,
      bottom: .073,
      left: .114,
      right: .034,

      width: 544,
      height: 356,
      locY: .983,        // y location of x value label
      xMax: 112,        // Maximum value of x in the image.
      correction: .073, // Correct for different scales
      spread: .40,      // Width of the opacity
    };

    dialog.onCreate = function () {
      // Load the image.
      dialog.img = this.$dialog.find('img')[0];
      dialog.img.onload = function() {
        dialog.canvas = dialog.$dialog.find('canvas')[0];
        dialog.canvas.width = dialog.img.width;
        dialog.canvas.height = dialog.img.height;

        let ctx = dialog.canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#441166';
        ctx.font = "14pt Callibri";
        ctx.textAlign = "center";

        dialog.line = new Line(ctx);
        dialog.canvas.onmousemove = update;
        window.addEventListener('resize', function() {
          dialog.onResize();
        });
        dialog.canvas.onmouseleave = function (event) {
          let opacity = viewer.theme.get('particles-master--opacity');
          viewer.theme.applyControl('particles-master--opacity', opacity);
        };

        /// This lets us define a custom line object which self-draws
        function Line(ctx) {
          var that = this;

          this.x1 = 0;
          this.x2 = 0;
          this.y1 = imageSpecs.top * dialog.img.width;
          this.y2 = dialog.img.height - dialog.img.height * imageSpecs.bottom;

          // update the line
          this.draw = function () {
            ctx.beginPath();
            ctx.moveTo(that.x1, that.y1);
            ctx.lineTo(that.x2, that.y2);
            ctx.stroke();
          }
        }

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

        function updateOpacity(_x) {
          // Subtract space to the left of image.
          let x = _x - imageSpecs.left * dialog.img.width;
          let sx = x * imageSpecs.xMax / (dialog.img.width - (imageSpecs.left + imageSpecs.right) * dialog.img.width);
          ctx.fillText(Math.round(sx * 100) / 100, x + imageSpecs.left * dialog.img.width, imageSpecs.locY * dialog.img.height);

          let nx = sx * imageSpecs.correction;
          ctx.fillText(Math.round(nx * 1000) / 1000, x + imageSpecs.left * dialog.img.width, imageSpecs.locY * dialog.img.height - 30);

          let bc = viewer.scene.az.bc;
          for (let c in bc.cylinders) {
            if (bc.cylinders.hasOwnProperty(c)) {
              let cyl = bc.cylinders[c];
              let cx = cyl.conf.radius;
              let diff = (cx - nx > 0) ? cx - nx : nx - cx;
              let opacity = 1 - (diff / imageSpecs.spread);
              opacity = (opacity < 0) ? 0 : opacity;
              opacity = (opacity > 1) ? 1 : opacity;

              let cylName = cyl.name.split('-')[1];
              let name = `particles-${cylName}--opacity`;
              viewer.theme.applyControl(name, opacity);
              $('#' + name).find('.az-slider, .az-value').val(opacity);
            }
          }
          viewer.render();
        }
      }
      dialog.img.src = '/sites/default/files/image/2019-01/bessel_graph.jpg';
    };

    dialog.onOpen = function () {
      return;
    };

    dialog.onClose = function () {
      let opacity = viewer.theme.get('particles-master--opacity');
      viewer.theme.applyControl('particles-master--opacity', opacity);
      // Nothing?
      return;
    };

    dialog.onResize = function() {
       dialog.canvas.width = dialog.img.width;
       dialog.canvas.height = dialog.img.height;
       dialog.line.y1 = imageSpecs.top * dialog.img.width;
       dialog.line.y2 = dialog.img.height - dialog.img.height * imageSpecs.bottom;
       dialog.$dialog.resizeable({aspectRatio: imageSpecs.width / (imageSpecs.height + 28)});
    };

    dialog.onButtonClick = function () {
      // Nothing?
      return;
    };

    let settings = {
      name: 'bessel',
      title: 'Bessel Function',
      id: `${dialog.name()}-dialog-container`,
      class: 'az-dialog',
      containerSelector: '.az-wrapper',
      content: '<div class="image-wrapper"><img><canvas></canvas></div>',
//    selectButtonId: 'open-bessel-dialog',
      resizeable: {aspectRatio: imageSpecs.width / (imageSpecs.height + 28)},
      closeButton: true,
      draggable: true,
      isLoaded: true,
      isOpen: true,
    };

    dialog.create(settings);

    return dialog;
  }

})(jQuery);
