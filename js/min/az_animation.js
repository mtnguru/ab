var _0x3292=['setItem','atomizer_animation_file','val','animation--speed','camera','position','cos','sin','lookAt','scene','base','/ajax-ab/loadYml','animation','animateDirectory','paused','theme','get','atom_select','getNextAtom','getPreviousAtom','getSelectedAtom','log','applyTimer:\x20','setSelectedAtom','loop','parms','steps','applyControl','opacity','running','time','timers','animations','type','atoms','rotation','orbitals','birkeland','particles','animate','render','removeClass','az-selected','addClass','target','animation--reverse','animation--stop','animation--previous','animation--next','atomizer','stopped','.animation--selectyml\x20select','.blocks--animation--wrapper','find','.az-button','data','filename','ymlContents'];(function(_0x110dc9,_0x1ae32b){var _0x2028ab=function(_0x3c0373){while(--_0x3c0373){_0x110dc9['push'](_0x110dc9['shift']());}};_0x2028ab(++_0x1ae32b);}(_0x3292,0x119));var _0x55f9=function(_0x99077a,_0x54349d){_0x99077a=_0x99077a-0x0;var _0x562faa=_0x3292[_0x99077a];return _0x562faa;};(function(_0x3805da){'use strict';Drupal[_0x55f9('0x0')]['animationC']=function(_0x664831){const _0x212da7=0x1;const _0x33eeb4=-0x1;var _0x42af59=_0x664831;var _0x45f459=_0x55f9('0x1');var _0x2cc0fb=![];var _0x4a98f1=_0x212da7;var _0x282c4c;var _0x3ce43f;var _0x511516=_0x3805da(_0x55f9('0x2'));var _0x347a5d={};var _0x33496f;var _0x3cec26;var _0x559138=0x0;var _0xf622ef=0x0;var _0x18e34f;var _0x309817;var _0x3f44da=0x0;var _0x3b0597=![];var _0x2c56b8=_0x3805da(_0x55f9('0x3'));var _0x5ba735=_0x2c56b8[_0x55f9('0x4')](_0x55f9('0x5'));var _0x1e3f5e=function(_0x57099d){_0x282c4c=_0x57099d[0x0][_0x55f9('0x6')][_0x55f9('0x7')];_0x3ce43f=_0x57099d[0x0][_0x55f9('0x8')];localStorage[_0x55f9('0x9')](_0x55f9('0xa'),_0x282c4c);_0x511516[_0x55f9('0xb')](_0x282c4c);_0x38e23c();};function _0xa1e891(){var _0x32669d=_0x42af59['theme']['get'](_0x55f9('0xc'))/0x3e8;var _0x2cd703=_0x42af59[_0x55f9('0xd')]['position']['x'],_0x38c984=_0x42af59[_0x55f9('0xd')][_0x55f9('0xe')]['y'],_0x4307cb=_0x42af59[_0x55f9('0xd')]['position']['z'];_0x42af59[_0x55f9('0xd')][_0x55f9('0xe')]['x']=_0x2cd703*Math[_0x55f9('0xf')](_0x32669d)+_0x4307cb*Math[_0x55f9('0x10')](_0x32669d);_0x42af59['camera'][_0x55f9('0xe')]['y']=_0x38c984*Math['cos'](_0x32669d)-_0x2cd703*Math[_0x55f9('0x10')](_0x32669d);_0x42af59[_0x55f9('0xd')]['position']['z']=_0x4307cb*Math[_0x55f9('0xf')](_0x32669d)-_0x2cd703*Math['sin'](_0x32669d);_0x42af59['camera'][_0x55f9('0x11')](_0x42af59[_0x55f9('0x12')][_0x55f9('0xe')]);}function _0x27b8da(_0x1c2932){_0x4a98f1=_0x1c2932;var _0x5a6a7d=_0x511516[_0x55f9('0xb')]();if(_0x282c4c!=_0x5a6a7d){_0x282c4c=_0x5a6a7d;Drupal[_0x55f9('0x0')][_0x55f9('0x13')]['doAjax'](_0x55f9('0x14'),{'component':_0x55f9('0x15'),'directory':_0x42af59[_0x55f9('0x0')][_0x55f9('0x16')],'filepath':_0x42af59[_0x55f9('0x0')][_0x55f9('0x16')]+'/'+_0x282c4c,'filename':_0x282c4c},_0x1e3f5e);}else{_0x3b0597=!![];if(_0x45f459==_0x55f9('0x17')){_0x45f459='running';if(_0x3cec26){_0x2f531f();}_0x38e23c();}else{_0x38e23c();}}}function _0x1acac6(){for(var _0x3b303e in _0x3ce43f['timers']){clearTimeout(_0x347a5d[_0x3b303e]);}_0x347a5d={};if(_0x18e34f){clearTimeout(_0x18e34f);_0x18e34f=null;}}function _0x54fef6(){for(var _0x4ea90c in _0x3ce43f['timers']){var _0x44550c=_0x3ce43f['timers'][_0x4ea90c];var _0x58208b=_0x42af59[_0x55f9('0x18')][_0x55f9('0x19')](_0x55f9('0xc'));_0x347a5d[_0x4ea90c]=setTimeout(()=>{_0x18dc7b(_0x4ea90c,_0x44550c);_0x3b0597=!![];},_0x44550c['time']*(0x64-_0x58208b)/0xfa);}if(_0x3cec26){_0x2f531f();}function _0x18dc7b(_0x16df35,_0x552ed1){switch(_0x16df35){case'cycleatoms':if(_0x3b0597){if(_0x4a98f1==_0x212da7){_0x3f44da=_0x42af59[_0x55f9('0x1a')][_0x55f9('0x1b')]();}else{_0x3f44da=_0x42af59[_0x55f9('0x1a')][_0x55f9('0x1c')]();}}else{_0x3f44da=_0x42af59['atom_select'][_0x55f9('0x1d')]();}console[_0x55f9('0x1e')](_0x55f9('0x1f')+_0x3f44da);_0x4db6b7();_0x42af59['atom_select'][_0x55f9('0x20')](_0x3f44da);_0x42af59['atom']['loadObject']({'nid':_0x3f44da},function(_0x10cc1e){_0x3c7c3c();});break;case _0x55f9('0x21'):_0x33496f=_0x552ed1;_0x309817=[];_0x559138=0x0;_0xf622ef=0x0;_0x3cec26=_0x33496f[_0x559138];if(_0x3cec26[_0x55f9('0x22')]){for(var _0x2720f6 in _0x3cec26['parms']){var _0x27a45d=_0x3cec26[_0x55f9('0x22')][_0x2720f6];_0x27a45d[0x2]=(_0x27a45d[0x0]-_0x27a45d[0x1])/_0x3cec26[_0x55f9('0x23')];_0x27a45d[0x3]=_0x27a45d[0x0];_0x42af59['theme'][_0x55f9('0x24')](_0x2720f6,_0x27a45d[0x3]);}}_0x2f531f();break;case _0x55f9('0x25'):break;}}}function _0x4db6b7(){_0x1acac6();_0x45f459=_0x55f9('0x17');}function _0x3c7c3c(){if(_0x2cc0fb){_0x4db6b7();_0x45f459=_0x55f9('0x17');}else{_0x54fef6();_0x45f459=_0x55f9('0x26');_0x3578e9();}}function _0x2f531f(){_0x18e34f=setTimeout(function(){_0xe65f05(name,_0x33496f);},_0x3cec26[_0x55f9('0x27')]/_0x3cec26[_0x55f9('0x23')]);}function _0xe65f05(_0x481c90,_0x33496f){if(_0xf622ef==_0x3cec26[_0x55f9('0x23')]){_0x559138=_0x559138+0x1==_0x33496f['length']?0x0:_0x559138+0x1;_0x3cec26=_0x33496f[_0x559138];_0xf622ef=0x0;for(var _0x3b2cf8 in _0x3cec26[_0x55f9('0x22')]){var _0x403e80=_0x3cec26['parms'][_0x3b2cf8];_0x403e80[0x2]=(_0x403e80[0x0]-_0x403e80[0x1])/_0x3cec26['steps'],_0x403e80[0x3]=_0x403e80[0x0];}}if(_0x3cec26[_0x55f9('0x22')]){for(var _0x3b2cf8 in _0x3cec26[_0x55f9('0x22')]){var _0x403e80=_0x3cec26[_0x55f9('0x22')][_0x3b2cf8];_0x403e80[0x3]-=_0x403e80[0x2];_0x42af59[_0x55f9('0x18')][_0x55f9('0x24')](_0x3b2cf8,_0x403e80[0x3]);}}_0xf622ef++;_0x2f531f();}function _0x38e23c(){var _0x263dd3;if(_0x3ce43f[_0x55f9('0x28')]){_0x54fef6();}if(_0x3ce43f[_0x55f9('0x29')]){_0x45f459='running';_0x3578e9();}}function _0x3578e9(){if(_0x2cc0fb){_0x2cc0fb=![];_0x4db6b7();_0x45f459='paused';}if(_0x45f459=='running'){switch(_0x3ce43f[_0x55f9('0x2a')]){case _0x55f9('0x2b'):requestAnimationFrame(_0x3578e9);if(_0x3ce43f[_0x55f9('0x29')]&&_0x3ce43f[_0x55f9('0x29')][_0x55f9('0x2c')]){if(_0x3ce43f[_0x55f9('0x29')]['rotation']['name']===_0x55f9('0x2d')){_0xa1e891();}}break;case _0x55f9('0x2e'):var _0x42ce7d=_0x42af59[_0x55f9('0x18')][_0x55f9('0x19')](_0x55f9('0xc'));requestAnimationFrame(_0x3578e9);if(_0x3ce43f[_0x55f9('0x29')][_0x55f9('0x2f')]){_0x42af59[_0x55f9('0x2e')][_0x55f9('0x30')](_0x3ce43f);}break;}_0x42af59[_0x55f9('0x31')]();}}var _0x55ef90=function(){_0x45f459='stopped';_0x1acac6();_0x5ba735[_0x55f9('0x32')](_0x55f9('0x33'));_0x3805da(button)[_0x55f9('0x34')](_0x55f9('0x33'));};var _0xfebddf=function _0xfebddf(_0x19c3c4){switch(_0x19c3c4[_0x55f9('0x35')]['id']){case _0x55f9('0x36'):_0x27b8da(_0x33eeb4);_0x5ba735[_0x55f9('0x32')](_0x55f9('0x33'));_0x3805da(_0x19c3c4[_0x55f9('0x35')])[_0x55f9('0x34')](_0x55f9('0x33'));break;case'animation--play':_0x27b8da(_0x212da7);_0x5ba735[_0x55f9('0x32')](_0x55f9('0x33'));_0x3805da(_0x19c3c4[_0x55f9('0x35')])[_0x55f9('0x34')]('az-selected');break;case'animation--pause':_0x2cc0fb=!![];_0x5ba735[_0x55f9('0x32')](_0x55f9('0x33'));_0x3805da(_0x19c3c4[_0x55f9('0x35')])[_0x55f9('0x34')](_0x55f9('0x33'));break;case _0x55f9('0x37'):_0x55ef90();break;case _0x55f9('0x38'):break;case _0x55f9('0x39'):break;}};return{'buttonClicked':_0xfebddf,'loadYml':_0x1e3f5e,'play':_0x27b8da,'stopAnimation':_0x55ef90,'getYmlDirectory':()=>_0x42af59[_0x55f9('0x0')]['animateDirectory']};};}(jQuery));