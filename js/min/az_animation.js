var _0x30ef=['getNextAtom','log','getPreviousAtom','getSelectedAtom','zoom','applyTimer:\x20','atom','loadObject','render','snapshot','takeSnapshot','nid','name','primary','parms','applyControl','opacity','time','steps','length','animations','rotation','birkeland','particles','animate','stopped','removeClass','az-selected','addClass','target','animation--play','animation--pause','animation--previous','animation--next','atomizer','animationC','.animation--selectyml\x20select','.blocks--animation--wrapper','find','.az-button','data','filename','ymlContents','setItem','val','theme','get','animation--speed','camera','position','sin','cos','lookAt','scene','/ajax/loadYml','animateDirectory','paused','running','timers','atom_select','setSelectedAtom','cycleimageatoms','cycleatoms','applyTimer::getNextAtom\x20'];(function(_0x8dd604,_0x160e62){var _0x4217a3=function(_0x55c24c){while(--_0x55c24c){_0x8dd604['push'](_0x8dd604['shift']());}};_0x4217a3(++_0x160e62);}(_0x30ef,0x1e2));var _0x41e8=function(_0x5d9961,_0x54c3ff){_0x5d9961=_0x5d9961-0x0;var _0x5bdcdf=_0x30ef[_0x5d9961];return _0x5bdcdf;};(function(_0x2aec57){'use strict';Drupal[_0x41e8('0x0')][_0x41e8('0x1')]=function(_0x17c1ad){const _0x84f5f=0x1;const _0x487525=-0x1;let _0x4b855e=_0x17c1ad;let _0x5e7e03='stopped';let _0x22a444=![];let _0x132ba3=_0x84f5f;let _0x4015bc;let _0x3742ab;let _0x5a3eec;let _0x160524;let _0x30c598=_0x2aec57(_0x41e8('0x2'));let _0x58265a={};let _0x4ab48e;let _0x52701e;let _0xa59ef0=0x0;let _0x5d32de=0x0;let _0x154070;let _0x2fff09;let _0x126e7a=0x0;let _0x293b85=![];let _0x4740d9=_0x2aec57(_0x41e8('0x3'));let _0x2b88f8=_0x4740d9[_0x41e8('0x4')](_0x41e8('0x5'));let _0x66b79=function(_0x4a350d){_0x4015bc=_0x4a350d[0x0][_0x41e8('0x6')][_0x41e8('0x7')];_0x3742ab=_0x4a350d[0x0][_0x41e8('0x8')];localStorage[_0x41e8('0x9')]('atomizer_animation_file',_0x4015bc);_0x30c598[_0x41e8('0xa')](_0x4015bc);_0x1a78a2();};function _0x5e44a7(){let _0x37adcb=_0x4b855e[_0x41e8('0xb')][_0x41e8('0xc')](_0x41e8('0xd'))/0x3e8;let _0x2935ec=_0x4b855e[_0x41e8('0xe')][_0x41e8('0xf')]['x'],_0x3b68de=_0x4b855e[_0x41e8('0xe')][_0x41e8('0xf')]['y'],_0x16e8e2=_0x4b855e['camera'][_0x41e8('0xf')]['z'];_0x4b855e['camera'][_0x41e8('0xf')]['x']=_0x2935ec*Math['cos'](_0x37adcb)+_0x16e8e2*Math['sin'](_0x37adcb);_0x4b855e[_0x41e8('0xe')][_0x41e8('0xf')]['y']=_0x3b68de*Math['cos'](_0x37adcb)-_0x2935ec*Math[_0x41e8('0x10')](_0x37adcb);_0x4b855e['camera'][_0x41e8('0xf')]['z']=_0x16e8e2*Math[_0x41e8('0x11')](_0x37adcb)-_0x2935ec*Math[_0x41e8('0x10')](_0x37adcb);_0x4b855e['camera'][_0x41e8('0x12')](_0x4b855e[_0x41e8('0x13')][_0x41e8('0xf')]);}function _0x572196(_0x2d38b1){_0x132ba3=_0x2d38b1;let _0x19dba1=_0x30c598['val']();if(_0x4015bc!=_0x19dba1){_0x4015bc=_0x19dba1;Drupal[_0x41e8('0x0')]['base']['doAjax'](_0x41e8('0x14'),{'component':'animation','directory':_0x4b855e[_0x41e8('0x0')][_0x41e8('0x15')],'filepath':_0x4b855e[_0x41e8('0x0')][_0x41e8('0x15')]+'/'+_0x4015bc,'filename':_0x4015bc},_0x66b79);}else{_0x293b85=!![];if(_0x5e7e03==_0x41e8('0x16')){_0x5e7e03=_0x41e8('0x17');if(_0x52701e){_0x125d11();}_0x1a78a2();}else{_0x1a78a2();}}}function _0x1a04eb(){for(let _0x5a5698 in _0x3742ab[_0x41e8('0x18')]){clearTimeout(_0x58265a[_0x5a5698]);}_0x58265a={};if(_0x154070){clearTimeout(_0x154070);_0x154070=null;}}function _0x9fdb78(){_0x5a3eec=_0x4b855e[_0x41e8('0xe')][_0x41e8('0xf')];_0x160524=0x0;_0x4b855e[_0x41e8('0x19')][_0x41e8('0x1a')]({'index':_0x160524});_0x37a8a8();}function _0x37a8a8(){for(let _0x229a20 in _0x3742ab[_0x41e8('0x18')]){let _0x5dbe57=_0x3742ab[_0x41e8('0x18')][_0x229a20];let _0x261ff9=_0x4b855e[_0x41e8('0xb')]['get']('animation--speed');_0x58265a[_0x229a20]=setTimeout(()=>{_0x22399e(_0x229a20,_0x5dbe57);_0x293b85=!![];},_0x5dbe57['time']*(0x64-_0x261ff9)/0xfa);}if(_0x52701e){_0x125d11();}function _0x22399e(_0x40fdf7,_0x4a6dca){switch(_0x40fdf7){case _0x41e8('0x1b'):case _0x41e8('0x1c'):if(_0x293b85){if(_0x132ba3==_0x84f5f){console['log'](_0x41e8('0x1d')+_0x126e7a);_0x126e7a=_0x4b855e['atom_select'][_0x41e8('0x1e')]();_0x160524++;}else{console[_0x41e8('0x1f')](_0x41e8('0x1d')+_0x126e7a);_0x126e7a=_0x4b855e[_0x41e8('0x19')][_0x41e8('0x20')]();_0x160524--;}}else{console[_0x41e8('0x1f')]('applyTimer::getSelectedAtom\x20'+_0x126e7a);_0x126e7a=_0x4b855e['atom_select'][_0x41e8('0x21')]();}if(_0x4a6dca[_0x41e8('0x22')]&&_0x4a6dca['zoom'][_0x160524]){_0x4b855e[_0x41e8('0xe')][_0x41e8('0xf')]['x']=_0x5a3eec['x']*_0x4a6dca['zoom'][_0x160524];_0x4b855e['camera'][_0x41e8('0xf')]['y']=_0x5a3eec['y']*_0x4a6dca[_0x41e8('0x22')][_0x160524];_0x4b855e[_0x41e8('0xe')]['position']['z']=_0x5a3eec['z']*_0x4a6dca[_0x41e8('0x22')][_0x160524];}console[_0x41e8('0x1f')](_0x41e8('0x23')+_0x126e7a);_0x1561e9();_0x4b855e['atom_select'][_0x41e8('0x1a')]({'nid':_0x126e7a});_0x4b855e[_0x41e8('0x24')][_0x41e8('0x25')]({'nid':_0x126e7a,'type':_0x41e8('0x24')},function(_0x104b52){_0x4b855e[_0x41e8('0x26')]();setTimeout(function(){_0x4b855e[_0x41e8('0x27')][_0x41e8('0x28')]({'nid':_0x104b52['az'][_0x41e8('0x29')],'width':0x1e0,'height':0x1e0,'filename':_0x104b52['az'][_0x41e8('0x2a')],'overwrite':!![],'imageType':_0x41e8('0x2b')});setTimeout(function(){_0x2b78e9();},0x7d0);},0x7d0);});break;case'loop':_0x4ab48e=_0x4a6dca;_0x2fff09=[];_0xa59ef0=0x0;_0x5d32de=0x0;_0x52701e=_0x4ab48e[_0xa59ef0];if(_0x52701e[_0x41e8('0x2c')]){for(let _0x38667c in _0x52701e['parms']){let _0x2ec10a=_0x52701e[_0x41e8('0x2c')][_0x38667c];_0x2ec10a[0x2]=(_0x2ec10a[0x0]-_0x2ec10a[0x1])/_0x52701e['steps'];_0x2ec10a[0x3]=_0x2ec10a[0x0];_0x4b855e[_0x41e8('0xb')][_0x41e8('0x2d')](_0x38667c,_0x2ec10a[0x3]);}}_0x125d11();break;case _0x41e8('0x2e'):break;}}}function _0x1561e9(){_0x1a04eb();_0x5e7e03=_0x41e8('0x16');}function _0x2b78e9(){if(_0x22a444){_0x1561e9();_0x5e7e03=_0x41e8('0x16');}else{_0x37a8a8();_0x5e7e03='running';_0x160763();}}function _0x125d11(){_0x154070=setTimeout(function(){_0x45d9e2(name,_0x4ab48e);},_0x52701e[_0x41e8('0x2f')]/_0x52701e[_0x41e8('0x30')]);}function _0x45d9e2(_0x1e9171,_0x4ab48e){if(_0x5d32de==_0x52701e['steps']){_0xa59ef0=_0xa59ef0+0x1==_0x4ab48e[_0x41e8('0x31')]?0x0:_0xa59ef0+0x1;_0x52701e=_0x4ab48e[_0xa59ef0];_0x5d32de=0x0;for(let _0x178453 in _0x52701e[_0x41e8('0x2c')]){let _0x400c00=_0x52701e[_0x41e8('0x2c')][_0x178453];_0x400c00[0x2]=(_0x400c00[0x0]-_0x400c00[0x1])/_0x52701e[_0x41e8('0x30')],_0x400c00[0x3]=_0x400c00[0x0];}}if(_0x52701e[_0x41e8('0x2c')]){for(let _0xa1a1d6 in _0x52701e[_0x41e8('0x2c')]){let _0x400c00=_0x52701e[_0x41e8('0x2c')][_0xa1a1d6];_0x400c00[0x3]-=_0x400c00[0x2];_0x4b855e[_0x41e8('0xb')][_0x41e8('0x2d')](_0xa1a1d6,_0x400c00[0x3]);}}_0x5d32de++;_0x125d11();}function _0x1a78a2(){let _0x4f4788;if(_0x3742ab[_0x41e8('0x18')]){_0x9fdb78();}if(_0x3742ab[_0x41e8('0x32')]){_0x5e7e03=_0x41e8('0x17');_0x160763();}}function _0x160763(){if(_0x22a444){_0x22a444=![];_0x1561e9();_0x5e7e03=_0x41e8('0x16');}if(_0x5e7e03=='running'){switch(_0x3742ab['type']){case'atoms':requestAnimationFrame(_0x160763);if(_0x3742ab[_0x41e8('0x32')]&&_0x3742ab[_0x41e8('0x32')]['rotation']){if(_0x3742ab['animations'][_0x41e8('0x33')][_0x41e8('0x2a')]==='orbitals'){_0x5e44a7();}}break;case _0x41e8('0x34'):let _0x519fdd=_0x4b855e[_0x41e8('0xb')]['get'](_0x41e8('0xd'));requestAnimationFrame(_0x160763);if(_0x3742ab[_0x41e8('0x32')][_0x41e8('0x35')]){_0x4b855e[_0x41e8('0x34')][_0x41e8('0x36')](_0x3742ab);}break;}_0x4b855e['render']();}}const _0x4e47ed=function(){_0x5e7e03=_0x41e8('0x37');_0x1a04eb();_0x2b88f8[_0x41e8('0x38')](_0x41e8('0x39'));_0x2aec57(button)[_0x41e8('0x3a')]('az-selected');};const _0x38e8bc=function _0x38e8bc(_0x4a21df){switch(_0x4a21df[_0x41e8('0x3b')]['id']){case'animation--reverse':_0x572196(_0x487525);_0x2b88f8[_0x41e8('0x38')](_0x41e8('0x39'));_0x2aec57(_0x4a21df[_0x41e8('0x3b')])[_0x41e8('0x3a')](_0x41e8('0x39'));break;case _0x41e8('0x3c'):_0x572196(_0x84f5f);_0x2b88f8[_0x41e8('0x38')](_0x41e8('0x39'));_0x2aec57(_0x4a21df[_0x41e8('0x3b')])[_0x41e8('0x3a')](_0x41e8('0x39'));break;case _0x41e8('0x3d'):_0x22a444=!![];_0x2b88f8[_0x41e8('0x38')](_0x41e8('0x39'));_0x2aec57(_0x4a21df['target'])[_0x41e8('0x3a')](_0x41e8('0x39'));break;case'animation--stop':_0x4e47ed();break;case _0x41e8('0x3e'):break;case _0x41e8('0x3f'):break;}};return{'buttonClicked':_0x38e8bc,'loadYml':_0x66b79,'play':_0x572196,'stopAnimation':_0x4e47ed,'getYmlDirectory':()=>_0x4b855e[_0x41e8('0x0')]['animateDirectory']};};}(jQuery));