var _0x4bbe=['az-selected','addClass','animation--pause','animation--previous','animation--next','atomizer','animationC','stopped','.blocks--animation--wrapper','filename','ymlContents','setItem','atomizer_animation_file','val','theme','animation--speed','position','camera','cos','sin','lookAt','scene','base','/ajax-ab/loadYml','animateDirectory','animation','paused','running','timers','time','loadatoms','atoms','length','atom','nid','opacity','animations','rotation','name','orbitals','render','animation--play','removeClass'];(function(_0x19d96b,_0x72d391){var _0x1f9343=function(_0x200520){while(--_0x200520){_0x19d96b['push'](_0x19d96b['shift']());}};_0x1f9343(++_0x72d391);}(_0x4bbe,0x132));var _0x3d69=function(_0x578bfd,_0xafc7d7){_0x578bfd=_0x578bfd-0x0;var _0x4c5c9e=_0x4bbe[_0x578bfd];return _0x4c5c9e;};(function(_0x44e3b7){'use strict';Drupal[_0x3d69('0x0')][_0x3d69('0x1')]=function(_0x4cdfc0){var _0x141c0a=_0x4cdfc0;var _0x5c025e=_0x3d69('0x2');var _0x164757;var _0x5bd8b4;var _0x557853;var _0x47e475=_0x44e3b7('.animation--selectyml\x20select');var _0xa9d649={};var _0x2be5a5=-0x1;var _0x3142ca=null;var _0x3e5e41=_0x44e3b7(_0x3d69('0x3'));var _0x543c2e=_0x3e5e41['find']('.az-button');var _0x2697df=function(_0x2a5ca2){_0x5bd8b4=_0x2a5ca2[0x0]['data'][_0x3d69('0x4')];_0x557853=_0x2a5ca2[0x0][_0x3d69('0x5')];localStorage[_0x3d69('0x6')](_0x3d69('0x7'),_0x5bd8b4);_0x47e475[_0x3d69('0x8')](_0x5bd8b4);_0x1025c9();};function _0x38feb6(){var _0x39eeb4=_0x141c0a[_0x3d69('0x9')]['get'](_0x3d69('0xa'))/0x3e8;var _0x52a933=_0x141c0a['camera'][_0x3d69('0xb')]['x'],_0x16e614=_0x141c0a[_0x3d69('0xc')][_0x3d69('0xb')]['y'],_0x48184e=_0x141c0a['camera']['position']['z'];_0x141c0a[_0x3d69('0xc')][_0x3d69('0xb')]['x']=_0x52a933*Math[_0x3d69('0xd')](_0x39eeb4)+_0x48184e*Math[_0x3d69('0xe')](_0x39eeb4);_0x141c0a['camera'][_0x3d69('0xb')]['y']=_0x16e614*Math['cos'](_0x39eeb4)-_0x52a933*Math[_0x3d69('0xe')](_0x39eeb4);_0x141c0a[_0x3d69('0xc')][_0x3d69('0xb')]['z']=_0x48184e*Math['cos'](_0x39eeb4)-_0x52a933*Math['sin'](_0x39eeb4);_0x141c0a[_0x3d69('0xc')][_0x3d69('0xf')](_0x141c0a[_0x3d69('0x10')][_0x3d69('0xb')]);};function _0xdaba59(){var _0x504944=_0x47e475[_0x3d69('0x8')]();if(_0x5bd8b4!=_0x504944){_0x5bd8b4=_0x504944;Drupal[_0x3d69('0x0')][_0x3d69('0x11')]['doAjax'](_0x3d69('0x12'),{'directory':_0x141c0a[_0x3d69('0x0')][_0x3d69('0x13')],'filepath':_0x141c0a[_0x3d69('0x0')]['animateDirectory']+'/'+_0x5bd8b4,'filename':_0x5bd8b4,'component':_0x3d69('0x14')},_0x2697df);}else{if(_0x5c025e==_0x3d69('0x15')){_0x5c025e=_0x3d69('0x16');_0x13d34c();}else{_0x1025c9();}}}function _0x617392(){for(var _0x594a0 in _0x557853[_0x3d69('0x17')]){clearTimeout(_0xa9d649[_0x594a0]);}_0xa9d649={};}function _0x52e9e9(){for(var _0x281f2f in _0x557853['timers']){var _0x1fd2b4=_0x557853[_0x3d69('0x17')][_0x281f2f];_0xa9d649[_0x281f2f]=setTimeout(function(){_0xa10bc9(_0x281f2f,_0x1fd2b4);},_0x1fd2b4[_0x3d69('0x18')]);}}function _0xa10bc9(_0x5dcfab,_0x5f075b){switch(_0x5dcfab){case _0x3d69('0x19'):if(_0x2be5a5>=_0x5f075b[_0x3d69('0x1a')][_0x3d69('0x1b')]-0x1){_0x2be5a5=0x0;}else{_0x2be5a5++;}_0x617392();_0x5c025e=_0x3d69('0x15');_0x141c0a[_0x3d69('0x1c')]['loadAtom'](_0x5f075b[_0x3d69('0x1a')][_0x2be5a5][_0x3d69('0x1d')],function(){if(_0x5f075b[_0x3d69('0x1a')][_0x2be5a5]['time']){_0x5f075b[_0x3d69('0x18')]=_0x5f075b[_0x3d69('0x1a')][_0x2be5a5][_0x3d69('0x18')];}_0xe8cd93;});break;case _0x3d69('0x1e'):break;}}function _0xe8cd93(){_0x52e9e9();_0x5c025e=_0x3d69('0x16');_0x13d34c();}function _0x1025c9(){_0x5c025e=_0x3d69('0x16');var _0x1264ab;if(_0x557853[_0x3d69('0x17')]){if(_0x557853['timers'][_0x3d69('0x19')]){_0x557853['timers'][_0x3d69('0x19')]['time']=_0x557853['timers'][_0x3d69('0x19')][_0x3d69('0x1a')][0x0][_0x3d69('0x18')];}_0x52e9e9();}if(_0x557853[_0x3d69('0x1f')]){_0x5c025e='running';_0x13d34c();}}function _0x13d34c(){if(_0x5c025e==_0x3d69('0x16')){requestAnimationFrame(_0x13d34c);}if(_0x557853[_0x3d69('0x1f')][_0x3d69('0x20')]){if(_0x557853['animations'][_0x3d69('0x20')][_0x3d69('0x21')]===_0x3d69('0x22')){_0x38feb6();}}_0x141c0a[_0x3d69('0x23')]();}var _0x15719b=function _0x15719b(_0x2ffadb){switch(_0x2ffadb['id']){case _0x3d69('0x24'):_0xdaba59();_0x543c2e[_0x3d69('0x25')](_0x3d69('0x26'));_0x44e3b7(_0x2ffadb)[_0x3d69('0x27')](_0x3d69('0x26'));break;case _0x3d69('0x28'):_0x5c025e=_0x3d69('0x15');_0x617392();_0x543c2e[_0x3d69('0x25')](_0x3d69('0x26'));_0x44e3b7(_0x2ffadb)['addClass'](_0x3d69('0x26'));break;case'animation--stop':_0x5c025e='stopped';_0x617392();_0x543c2e[_0x3d69('0x25')](_0x3d69('0x26'));_0x44e3b7(_0x2ffadb)[_0x3d69('0x27')](_0x3d69('0x26'));break;case _0x3d69('0x29'):break;case _0x3d69('0x2a'):break;}};return{'buttonClicked':_0x15719b,'loadYml':_0x2697df};};}(jQuery));