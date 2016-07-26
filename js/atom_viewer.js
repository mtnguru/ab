/**
 * @file - atom_viewer.js
 *
 */
(function ($) {
  'use strict';

  Drupal.behaviors.atom_builder = {
    // Attach functions are executed by Drupal upon page load or ajax loads.
    attach: function (context, settings) {

       $('#imager-wrapper').once(function () {
        function init() {

          // Create a background plane
          scene.add(Drupal.atom_builder.object.makeObject('plane',
            {lambert: {color: style.plane__color.defaultValue}},
            {
              width: style.plane__width.defaultValue,
              depth: style.plane__depth.defaultValue
            },
            {
              x: style.plane__position.defaultValue[0],
              y: style.plane__position.defaultValue[1],
              z: style.plane__position.defaultValue[2],
              rotation: {x: -0.5 * Math.PI}
            }
          ));

          // Add the Atoms to the screen
          addAtoms();

          // add the output of the renderer to the html element
          canvasContainer.appendChild(renderer.domElement);
          canvas = canvasContainer.querySelector('canvas');

          // Set mode so the mouse moves the camera
          changeMode('camera');

          // Create the controls in the upper right corner of screen
          controls = initControls();

          // Render the scene and animate it
          render();
          animate();
        }

         function animate() {
           requestAnimationFrame(animate);
           if (cameraTrackballControls) {
             cameraTrackballControls.update();
           }
           if (atomTrackballControls) {
             atomTrackballControls.update();
           }
         }

         function render() {
           renderer.render(scene, camera);
         }
      }

    };

})(jQuery);

