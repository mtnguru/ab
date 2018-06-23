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
    var loop;
    var loopStep;
    var loopIndex = 0;
    var loopStepIndex = 0;
    var loopTimeout;
    var loopValues
    var currentAtom = -1;
    var atomIndex = null;

    var $wrapper = $('.blocks--animation--wrapper');
    var $buttons = $wrapper.find('.az-button');

    var loadYml = function (results) {
      animateFile = results[0].data.filename;
      animateConf = results[0].ymlContents;
      localStorage.setItem('atomizer_animation_file', animateFile);

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
      for (var timeout in animateConf.timers) {
        clearTimeout(timeouts[timeout]);
      }
      timeouts = {};
    }

    function startTimers() {
      for (var timerName in animateConf.timers) {
        var timerConf = animateConf.timers[timerName];
        timeouts[timerName] = setTimeout(function() {
          applyTimer(timerName, timerConf);
        }, timerConf.time);
      }
    }

    function applyTimer(name, conf) {
      switch (name) {
        case 'loadatoms':
          currentAtom = (currentAtom >= conf.atoms.length - 1) ? 0 : currentAtom + 1;

          stopTimers();
          state = 'paused';
          viewer.atom.loadAtom(conf.atoms[currentAtom].nid, function() {
            if (conf.atoms[currentAtom].time) {
               conf.time = conf.atoms[currentAtom].time;
            }
            continueAnimation;
          });
          break;

        case 'loop':
          loop = conf;
          loopValues = [];
          loopIndex = 0;
          loopStepIndex = 0;
          loopStep = loop[loopIndex];
          if (loopStep.parms) {
            for (var parm in loopStep.parms) {
              var vals = loopStep.parms[parm];
              vals[2] = (vals[0] - vals[1]) / loopStep.steps;
              vals[3] = vals[0];
              viewer.theme.applyControl(parm, vals[3]);
            }
          }

          loopTimeout = setTimeout(function() {
            updateLoop(name, conf);
          }, loopStep.time / loopStep.steps);
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

    function updateLoop(name, loop) {
      // If this step is done increment to next step
      if (loopStepIndex == loopStep.steps) {
        loopIndex = (loopIndex + 1 == loop.length) ? 0 : loopIndex + 1;
        loopStep = loop[loopIndex];
        loopStepIndex = 0;
        for (var parm in loopStep.parms) {
          var vals = loopStep.parms[parm];
          vals[2] = (vals[0] - vals[1]) / loopStep.steps,
          vals[3] = vals[0];
        }
      }

      if (loopStep.parms) {
        for (var parm in loopStep.parms) {
          var vals = loopStep.parms[parm];
          vals[3] -= vals[2];
          viewer.theme.applyControl(parm, vals[3]);
        }
      }

      loopStepIndex++;

      loopTimeout = setTimeout(function() {
        updateLoop(name, loop);
      }, loopStep.time / loopStep.steps);
    }

    function startLoop() {
      loopValues = [];
      loopIndex = 0;
      loopStepIndex = 0;
      loopStep = animateConf.loop[loopIndex]
      if (loopStep.parms) {
        for (var parm in loopStep.parms) {
          loopValues[parm] = loopStep.parms[parm];
          viewer.theme.applyControl(parm, loopValues[parm]);
        }
      }

      loopTimeout = setTimeout(function() {
        updateLoop(timerName, timerConf);
      }, loopStep.time);
    }

    function startAnimation() {
      state = 'running';
      var key;
      if (animateConf.timers) {
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

    var stopAnimation = function() {
      state = 'stopped';
      stopTimers();
      $buttons.removeClass('az-selected');
      $(button).addClass('az-selected');
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
          stopAnimation();
          break;

        case 'animation--previous':
          break;

        case 'animation--next':
          break;
      }
    };

    return {
      buttonClicked: buttonClicked,
      loadYml: loadYml,
      play: play,
      stopAnimation: stopAnimation
    };
  };
})(jQuery);

