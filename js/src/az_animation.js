/**
 * @file - az_animation.js
 *
 * Class to manage and apply settings
 * Sets the color, position, opacity, linewidth, or rendered items.
 */

(function($) {
  'use strict';

  Drupal.atomizer.animationC = function (_viewer) {
    var viewer = _viewer;
    var state = 'stopped';
    var animation;
    var animateFile;
    var animateConf;
    var $selectAnimation = $('.animation--selectyml select');
    var timeouts = {};
    var currentAtom = -1;
    var atomIndex = null;

    var $wrapper = $('.blocks--animation--wrapper');
    var $buttons = $wrapper.find('.az-button');

    var loadYml = function (results) {
      // Save the theme file name in browser local storage.
      animateFile = results[0].data.filename;
      animateConf = results[0].ymlContents;
      localStorage.setItem('atomizer_animation_file', animateFile);

      // Set the theme select list to the currently loaded file.
      $selectAnimation.val(animateFile);
      startAnimation();
    };

    /**
     * Perform animations.
     *
     * @TODO - make this only executed when the mouse has been moved or clicked recently - otherwise deactivate it.
     */
    function advanceOrbitals() {

      var rotSpeed = viewer.theme.get('animation--speed') / 1000;

      var x = viewer.camera.position.x,
        y = viewer.camera.position.y,
        z = viewer.camera.position.z;

      viewer.camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
      viewer.camera.position.y = y * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
      viewer.camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);

      viewer.camera.lookAt(viewer.scene.position);
    };

    function play() {
      var currentFile = $selectAnimation.val();
      if (animateFile != currentFile) {
        // Check to see if file is loaded, load if necessary.
        animateFile = currentFile;
        Drupal.atomizer.base.doAjax(
          '/ajax-ab/loadYml',
          {
            directory: viewer.atomizer.animateDirectory,
            filepath: viewer.atomizer.animateDirectory + '/' + animateFile,
            filename: animateFile,
            component: 'animation'
          },
          loadYml
        );
      } else {
        if (state == 'paused') {
          state = 'running';
          animate();
        } else {
          startAnimation();
        }
      }
    }

    function stopTimers() {
      for (var timeout in animateConf['timers']) {
        clearTimeout(timeouts[timeout]);
      }
      timeouts = {};
    }

    function startTimers() {
      for (var timerName in animateConf['timers']) {
        var timerConf = animateConf['timers'][timerName];
        timeouts[timerName] = setTimeout(function() {
          applyTimer(timerName, timerConf);
        }, timerConf.time);
      }
    }

    function applyTimer(name, conf) {
      switch (name) {
        case 'loadatoms':
          if (currentAtom >= conf.atoms.length - 1) {
            currentAtom = 0;
          } else {
            currentAtom++;
          }

          stopTimers();
          state = 'paused';
          viewer.atom.loadAtom(conf.atoms[currentAtom].nid, function() {
            if (conf.atoms[currentAtom].time) {
               conf.time = conf.atoms[currentAtom].time;
            }
            continueAnimation;
          });
          break;
        case 'opacity':
          break
      }
    }

    function continueAnimation() {
      startTimers();
      state = 'running';
      animate();
    }

    function startAnimation() {
      state = 'running';
      var key;
      if (animateConf['timers']) {
        if (animateConf.timers.loadatoms) {
          animateConf.timers.loadatoms.time = animateConf.timers.loadatoms.atoms[0].time;
        }
        startTimers();
      }

      if (animateConf.animations) {
        state = 'running';
        animate();
      }
    }

    function animate() {
      if (state == 'running') {
        requestAnimationFrame(animate);
      }
      if (animateConf.animations.rotation) {
        if (animateConf.animations.rotation.name === 'orbitals') {
          advanceOrbitals();
        }
      }

      viewer.render();
    }

    var buttonClicked = function buttonClicked(button) {
      switch (button.id) {
        case 'animation--play':
          play();
          $buttons.removeClass('az-selected');
          $(button).addClass('az-selected');
          break;

        case 'animation--pause':
          state = 'paused';
          stopTimers();
          $buttons.removeClass('az-selected');
          $(button).addClass('az-selected');
          break;

        case 'animation--stop':
          state = 'stopped';
          stopTimers();
          $buttons.removeClass('az-selected');
          $(button).addClass('az-selected');
          break;

        case 'animation--previous':
          break;

        case 'animation--next':
          break;
      }
    };

    return {
      buttonClicked: buttonClicked,
      loadYml: loadYml
    };
  };
})(jQuery);

