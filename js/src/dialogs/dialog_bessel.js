// import { dialogC } from './dialog.js';

(function ($) {

  Drupal.atomizer.dialogs.besselC = function (_viewer) {
    let viewer = _viewer;
    let dialog = Object.create(Drupal.atomizer.dialogs.baseC);
    dialog.name('Bessel Graph');

    let imageSpecs = {
      top: 15,
      bottom: 26,
      left: 62,
      right: 19,

      locY: 350,        // y location of x value label
      xMax: 112,        // Maximum value of x in the image.
      correction: .073, // Correct for different scales
      spread: .40,      // Width of the opacity
    };

    dialog.onCreate = function () {
      // Load the image.
      let img = this.$dialog.find('img')[0];
      img.onload = function() {
        let canvas = dialog.$dialog.find('canvas')[0];
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#441166';
        ctx.font = "14pt Callibri";
        ctx.textAlign = "center";

        let line = new Line(ctx);
        canvas.onmousemove = update;

        /// This lets us define a custom line object which self-draws
        function Line(ctx) {
          var that = this;

          this.x1 = 0;
          this.x2 = 0;
          this.y1 = imageSpecs.top;
          this.y2 = img.height - imageSpecs.bottom;

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
          let r = canvas.getBoundingClientRect(),
              x = e.clientX - r.left,
              y = e.clientY - r.top;

          if (x < imageSpecs.left) x = imageSpecs.left;
          if (x > img.width - imageSpecs.right) x = img.width - imageSpecs.right;

          /// draw background image to clear previous line and text
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          /// update line object and draw it
          line.x1 = x;
          line.x2 = x;
          line.draw();

          // Update the particles opacity
          updateOpacity(line.x1);
        }

        function updateOpacity(_x) {
          // Subtract space to the left of image.
          let x = _x - imageSpecs.left;
          let sx = x * imageSpecs.xMax / (img.width - (imageSpecs.left + imageSpecs.right));
          ctx.fillText(Math.round(sx * 100) / 100, x + imageSpecs.left, imageSpecs.locY);

          let nx = sx * imageSpecs.correction;
          ctx.fillText(Math.round(nx * 1000) / 1000, x + imageSpecs.left, imageSpecs.locY - 30);

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
      img.src = '/sites/default/files/image/2019-01/bessel_graph.jpg';
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

    dialog.onButtonClick = function () {
      // Nothing?
      return;
    };

    let settings = {
      name: 'bessel',
      title: 'Bessel Function Graph',
      id: `${dialog.name()}-dialog-container`,
      class: 'az-dialog',
      containerSelector: '.az-wrapper',
      content: '<div class="image-wrapper"><img><canvas></canvas></div>',
//    selectButtonId: 'open-bessel-dialog',
      closeButton: true,
      draggable: true,
      isLoaded: true,
    };

    dialog.create(settings);

    return dialog;
  }

})(jQuery);
