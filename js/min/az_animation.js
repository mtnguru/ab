var _0x1e1c=['animation','running','timers','time','loadatoms','length','paused','atom','loadAtom','atoms','nid','loop','parms','applyControl','steps','animations','rotation','name','stopped','removeClass','az-selected','addClass','animation--pause','animation--stop','animation--previous','atomizer','find','.az-button','data','ymlContents','setItem','atomizer_animation_file','val','theme','camera','position','cos','sin','lookAt','scene','base','doAjax','/ajax-ab/loadYml','animateDirectory'];(function(_0x4be9c1,_0x3b982b){var _0x5cb465=function(_0x53f26b){while(--_0x53f26b){_0x4be9c1['push'](_0x4be9c1['shift']());}};_0x5cb465(++_0x3b982b);}(_0x1e1c,0xc9));var _0xf22a=function(_0x4a2389,_0x5aa205){_0x4a2389=_0x4a2389-0x0;var _0x1af5ae=_0x1e1c[_0x4a2389];return _0x1af5ae;};(function(_0x28b2d4){'use strict';Drupal[_0xf22a('0x0')]['animationC']=function(_0x2bf6eb){var _0x6490de=_0x2bf6eb;var _0x491acf='stopped';var _0x2e6586;var _0x5dcb55;var _0xbf2363;var _0x16b711=_0x28b2d4('.animation--selectyml\x20select');var _0x5e4107={};var _0x55f51e;var _0xd4dfad;var _0x36ebf4=0x0;var _0x3ebbfc=0x0;var _0x2e4005;var _0x4c68dc;var _0x16086a=-0x1;var _0x5c7063=null;var _0xd9aa98=_0x28b2d4('.blocks--animation--wrapper');var _0xb7cca=_0xd9aa98[_0xf22a('0x1')](_0xf22a('0x2'));var _0x16f593=function(_0x4132b4){_0x5dcb55=_0x4132b4[0x0][_0xf22a('0x3')]['filename'];_0xbf2363=_0x4132b4[0x0][_0xf22a('0x4')];localStorage[_0xf22a('0x5')](_0xf22a('0x6'),_0x5dcb55);_0x16b711[_0xf22a('0x7')](_0x5dcb55);_0x28ed67();};function _0x17c884(){var _0x2d1598=_0x6490de[_0xf22a('0x8')]['get']('animation--speed')/0x3e8;var _0x2adfa2=_0x6490de[_0xf22a('0x9')]['position']['x'],_0xc413cc=_0x6490de['camera'][_0xf22a('0xa')]['y'],_0xa16446=_0x6490de[_0xf22a('0x9')][_0xf22a('0xa')]['z'];_0x6490de[_0xf22a('0x9')][_0xf22a('0xa')]['x']=_0x2adfa2*Math[_0xf22a('0xb')](_0x2d1598)+_0xa16446*Math[_0xf22a('0xc')](_0x2d1598);_0x6490de[_0xf22a('0x9')][_0xf22a('0xa')]['y']=_0xc413cc*Math['cos'](_0x2d1598)-_0x2adfa2*Math[_0xf22a('0xc')](_0x2d1598);_0x6490de[_0xf22a('0x9')][_0xf22a('0xa')]['z']=_0xa16446*Math[_0xf22a('0xb')](_0x2d1598)-_0x2adfa2*Math[_0xf22a('0xc')](_0x2d1598);_0x6490de['camera'][_0xf22a('0xd')](_0x6490de[_0xf22a('0xe')][_0xf22a('0xa')]);};function _0x25e564(){var _0x4e82b5=_0x16b711[_0xf22a('0x7')]();if(_0x5dcb55!=_0x4e82b5){_0x5dcb55=_0x4e82b5;Drupal[_0xf22a('0x0')][_0xf22a('0xf')][_0xf22a('0x10')](_0xf22a('0x11'),{'directory':_0x6490de[_0xf22a('0x0')][_0xf22a('0x12')],'filepath':_0x6490de[_0xf22a('0x0')]['animateDirectory']+'/'+_0x5dcb55,'filename':_0x5dcb55,'component':_0xf22a('0x13')},_0x16f593);}else{if(_0x491acf=='paused'){_0x491acf=_0xf22a('0x14');_0x32b01e();if(_0xd4dfad){_0x1e952f();}}else{_0x28ed67();}}}function _0x54750b(){for(var _0x50a31d in _0xbf2363[_0xf22a('0x15')]){clearTimeout(_0x5e4107[_0x50a31d]);}_0x5e4107={};if(_0x2e4005){clearTimeout(_0x2e4005);_0x2e4005=null;}}function _0x2d750d(){for(var _0x226dc2 in _0xbf2363['timers']){var _0x10505e=_0xbf2363['timers'][_0x226dc2];_0x5e4107[_0x226dc2]=setTimeout(function(){_0x45ed38(_0x226dc2,_0x10505e);},_0x10505e[_0xf22a('0x16')]);}if(_0xd4dfad){_0x1e952f();}}function _0x45ed38(_0x5b3961,_0x4df8e0){switch(_0x5b3961){case _0xf22a('0x17'):_0x16086a=_0x16086a>=_0x4df8e0['atoms'][_0xf22a('0x18')]-0x1?0x0:_0x16086a+0x1;_0x54750b();_0x491acf=_0xf22a('0x19');_0x6490de[_0xf22a('0x1a')][_0xf22a('0x1b')](_0x4df8e0[_0xf22a('0x1c')][_0x16086a][_0xf22a('0x1d')],function(){if(_0x4df8e0['atoms'][_0x16086a][_0xf22a('0x16')]){_0x4df8e0[_0xf22a('0x16')]=_0x4df8e0[_0xf22a('0x1c')][_0x16086a][_0xf22a('0x16')];}_0x5d1c48;});break;case _0xf22a('0x1e'):_0x55f51e=_0x4df8e0;_0x4c68dc=[];_0x36ebf4=0x0;_0x3ebbfc=0x0;_0xd4dfad=_0x55f51e[_0x36ebf4];if(_0xd4dfad['parms']){for(var _0x1dccce in _0xd4dfad[_0xf22a('0x1f')]){var _0x10ea22=_0xd4dfad[_0xf22a('0x1f')][_0x1dccce];_0x10ea22[0x2]=(_0x10ea22[0x0]-_0x10ea22[0x1])/_0xd4dfad['steps'];_0x10ea22[0x3]=_0x10ea22[0x0];_0x6490de[_0xf22a('0x8')][_0xf22a('0x20')](_0x1dccce,_0x10ea22[0x3]);}}_0x1e952f();break;case'opacity':break;}}function _0x5d1c48(){_0x2d750d();_0x491acf=_0xf22a('0x14');_0x32b01e();}function _0x1e952f(){_0x2e4005=setTimeout(function(){_0x9924d(name,_0x55f51e);},_0xd4dfad[_0xf22a('0x16')]/_0xd4dfad[_0xf22a('0x21')]);}function _0x9924d(_0x28a8e7,_0x1a5cf2){if(_0x3ebbfc==_0xd4dfad[_0xf22a('0x21')]){_0x36ebf4=_0x36ebf4+0x1==_0x1a5cf2[_0xf22a('0x18')]?0x0:_0x36ebf4+0x1;_0xd4dfad=_0x1a5cf2[_0x36ebf4];_0x3ebbfc=0x0;for(var _0x447a19 in _0xd4dfad[_0xf22a('0x1f')]){var _0x2629cb=_0xd4dfad[_0xf22a('0x1f')][_0x447a19];_0x2629cb[0x2]=(_0x2629cb[0x0]-_0x2629cb[0x1])/_0xd4dfad[_0xf22a('0x21')],_0x2629cb[0x3]=_0x2629cb[0x0];}}if(_0xd4dfad['parms']){for(var _0x447a19 in _0xd4dfad['parms']){var _0x2629cb=_0xd4dfad[_0xf22a('0x1f')][_0x447a19];_0x2629cb[0x3]-=_0x2629cb[0x2];_0x6490de[_0xf22a('0x8')][_0xf22a('0x20')](_0x447a19,_0x2629cb[0x3]);}}_0x3ebbfc++;_0x1e952f();}function _0x28ed67(){_0x491acf=_0xf22a('0x14');var _0x54238b;if(_0xbf2363['timers']){if(_0xbf2363[_0xf22a('0x15')][_0xf22a('0x17')]){_0xbf2363[_0xf22a('0x15')]['loadatoms']['time']=_0xbf2363['timers'][_0xf22a('0x17')][_0xf22a('0x1c')][0x0][_0xf22a('0x16')];}_0x2d750d();}if(_0xbf2363['animations']){_0x491acf='running';_0x32b01e();}}function _0x32b01e(){if(_0x491acf==_0xf22a('0x14')){requestAnimationFrame(_0x32b01e);}if(_0xbf2363[_0xf22a('0x22')][_0xf22a('0x23')]){if(_0xbf2363[_0xf22a('0x22')]['rotation'][_0xf22a('0x24')]==='orbitals'){_0x17c884();}}_0x6490de['render']();}var _0x43bb5c=function(){_0x491acf=_0xf22a('0x25');_0x54750b();_0xb7cca[_0xf22a('0x26')](_0xf22a('0x27'));_0x28b2d4(button)['addClass'](_0xf22a('0x27'));};var _0x1b2410=function _0x1b2410(_0xb826d0){switch(_0xb826d0['id']){case'animation--play':_0x25e564();_0xb7cca['removeClass'](_0xf22a('0x27'));_0x28b2d4(_0xb826d0)[_0xf22a('0x28')](_0xf22a('0x27'));break;case _0xf22a('0x29'):_0x491acf=_0xf22a('0x19');_0x54750b();_0xb7cca[_0xf22a('0x26')]('az-selected');_0x28b2d4(_0xb826d0)['addClass']('az-selected');break;case _0xf22a('0x2a'):_0x43bb5c();break;case _0xf22a('0x2b'):break;case'animation--next':break;}};return{'buttonClicked':_0x1b2410,'loadYml':_0x16f593,'play':_0x25e564,'stopAnimation':_0x43bb5c};};}(jQuery));