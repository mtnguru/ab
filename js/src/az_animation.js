/**
 * @file - az_animation.js
 *
 * Class to manage and apply settings
 * Sets the color, position, opacity, linewidth, or rendered items.
 */

(function($) {
  'use strict';

  Drupal.atomizer.animationC = function (_viewer) {
    const FORWARD = 1;
    const REVERSE = -1;

    var viewer = _viewer;
    var state = 'stopped';
    var pausing = false;
    var direction = FORWARD;
    var animateFile;
    var animateConf;
    var $selectAnimation = $('.animation--selectyml select');
    var timeouts = {};
    var loop;
    var loopStep;
    var loopIndex = 0;
    var loopStepIndex = 0;
    var loopTimeout;
    var loopValues;
    var currentAtom = 0;
    var increment = false;

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
    }

    function play(_direction) {
      direction = _direction;
      var currentFile = $selectAnimation.val();
      if (animateFile != currentFile) {
        // Check to see if file is loaded, load if necessary.
        animateFile = currentFile;
        Drupal.atomizer.base.doAjax(
          '/ajax-ab/loadYml',
          {
            component: 'animation',
            directory: viewer.atomizer.animateDirectory,
            filepath: viewer.atomizer.animateDirectory + '/' + animateFile,
            filename: animateFile,
          },
          loadYml
        );
      } else {
        increment = true;
        if (state == 'paused') {
          state = 'running';
          if (loopStep) {
            setLoopTimeout();
          }
          startAnimation();
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
      if (loopTimeout) {
        clearTimeout(loopTimeout);
        loopTimeout = null;
      }
    }

    function startTimers() {
      for (var timerName in animateConf.timers) {
        var timerConf = animateConf.timers[timerName];
        var speed = viewer.theme.get('animation--speed');
        timeouts[timerName] = setTimeout(() => {
          applyTimer(timerName, timerConf);
          increment = true;
        }, timerConf.time * (100 - speed) / 250);
      }
      if (loopStep) {
        setLoopTimeout();
      }

      function applyTimer(name, conf) {
        switch (name) {
          case 'cycleatoms':
            if (increment) {
              if (direction == FORWARD) {
                console.log(`applyTimer::getNextAtom ${currentAtom}`);
                currentAtom = viewer.atom_select.getNextAtom();
              } else {
                console.log(`applyTimer::getNextAtom ${currentAtom}`);
                currentAtom = viewer.atom_select.getPreviousAtom();
              }
            }
            else {
              console.log(`applyTimer::getSelectedAtom ${currentAtom}`);
              currentAtom = viewer.atom_select.getSelectedAtom();
            }

            console.log(`applyTimer: ${currentAtom}`);
            pauseAnimation();
            viewer.atom_select.setSelectedAtom(currentAtom);
            viewer.atom.loadObject({
              nid: currentAtom,
              type: 'atom'
            }, function (object) {
//            viewer.producer.objectLoaded(object);
//            viewer.render();
              continueAnimation();
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

            setLoopTimeout();
            break;

          case 'opacity':
            break
        }
      }
    }

    function pauseAnimation() {
      stopTimers();
      state = 'paused';
    }

    function continueAnimation() {
      if (pausing) {
        pauseAnimation();
        state = 'paused';

      } else {
        startTimers();
        state = 'running';
        animate();
      }
    }

    function setLoopTimeout() {
      // Set the next timeout
      loopTimeout = setTimeout(function() {
        updateLoop(name, loop);
      }, loopStep.time / loopStep.steps);
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
      setLoopTimeout();
    }

    /*
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
    } */

    function startAnimation() {
      var key;
      if (animateConf.timers) {
        startTimers();
      }

      if (animateConf.animations) {
        state = 'running';
        animate();
      }
    }

    function animate() {
      if (pausing) {
        pausing = false;
        pauseAnimation();
        state = 'paused';
      }
      if (state == 'running') {
        switch (animateConf.type) {
          case 'atoms':
            requestAnimationFrame(animate);
            if (animateConf.animations && animateConf.animations.rotation) {
              if (animateConf.animations.rotation.name === 'orbitals') {
                advanceOrbitals();
              }
            }
            break;
          case 'birkeland':
            var speed = viewer.theme.get('animation--speed');
//          setTimeout(function() {
              requestAnimationFrame(animate);
//          }, (100 - viewer.theme.get('animation--speed')));
            if (animateConf.animations.particles) {
              viewer.birkeland.animate(animateConf);
            }
            break;
        }
        viewer.render();
      }
    }

    var stopAnimation = function() {
      state = 'stopped';
      stopTimers();
      $buttons.removeClass('az-selected');
      $(button).addClass('az-selected');
    }

    var buttonClicked = function buttonClicked(event) {
      switch (event.target.id) {
        case 'animation--reverse':
          play(REVERSE);
          $buttons.removeClass('az-selected');
          $(event.target).addClass('az-selected');
          break;

        case 'animation--play':
          play(FORWARD);
          $buttons.removeClass('az-selected');
          $(event.target).addClass('az-selected');
          break;

        case 'animation--pause':
          pausing = true;
          $buttons.removeClass('az-selected');
          $(event.target).addClass('az-selected');
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
      stopAnimation: stopAnimation,
      getYmlDirectory: () => viewer.atomizer.animateDirectory,
    };
  };
})(jQuery);

