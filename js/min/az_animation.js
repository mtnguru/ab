var _0x14b5=['paused','timers','setSelectedAtom','time','cycleimageatoms','cycleatoms','applyTimer::getNextAtom\x20','atom_select','getNextAtom','log','applyTimer::getSelectedAtom\x20','getSelectedAtom','zoom','applyTimer:\x20','atom','loadObject','render','snapshot','takeSnapshot','nid','primary','loop','parms','applyControl','opacity','running','steps','animations','type','rotation','orbitals','birkeland','animation--speed','particles','animate','stopped','az-selected','addClass','target','animation--reverse','removeClass','animation--play','animation--pause','animation--stop','animation--previous','atomizer','animationC','.animation--selectyml\x20select','find','data','filename','ymlContents','atomizer_animation_file','theme','get','camera','position','sin','cos','lookAt','scene','val','animateDirectory'];(function(_0x4016d5,_0x175933){var _0x14193e=function(_0xfee6ca){while(--_0xfee6ca){_0x4016d5['push'](_0x4016d5['shift']());}};_0x14193e(++_0x175933);}(_0x14b5,0x168));var _0x26b2=function(_0x4bc433,_0xe7a4ef){_0x4bc433=_0x4bc433-0x0;var _0x4718e3=_0x14b5[_0x4bc433];return _0x4718e3;};(function(_0x530166){'use strict';Drupal[_0x26b2('0x0')][_0x26b2('0x1')]=function(_0x3154f5){const _0x285962=0x1;const _0x44bed7=-0x1;let _0x1bb57a=_0x3154f5;let _0x30ee09='stopped';let _0x56d9ce=![];let _0x1c0354=_0x285962;let _0x47e83d;let _0x4462a4;let _0x2f0989;let _0x243db5;let _0x5f0a04=_0x530166(_0x26b2('0x2'));let _0x1771f7={};let _0x9cb8ad;let _0x3893f6;let _0x34b29a=0x0;let _0xebaafa=0x0;let _0x385a47;let _0x1722ca;let _0x5a70b1=0x0;let _0x3a884a=![];let _0x1523fe=_0x530166('.blocks--animation--wrapper');let _0x4eb733=_0x1523fe[_0x26b2('0x3')]('.az-button');let _0x3bf017=function(_0x46e2d6){_0x47e83d=_0x46e2d6[0x0][_0x26b2('0x4')][_0x26b2('0x5')];_0x4462a4=_0x46e2d6[0x0][_0x26b2('0x6')];localStorage['setItem'](_0x26b2('0x7'),_0x47e83d);_0x5f0a04['val'](_0x47e83d);_0x391eeb();};function _0x23c34b(){let _0x2233f7=_0x1bb57a[_0x26b2('0x8')][_0x26b2('0x9')]('animation--speed')/0x3e8;let _0x316277=_0x1bb57a[_0x26b2('0xa')]['position']['x'],_0x17f495=_0x1bb57a['camera'][_0x26b2('0xb')]['y'],_0x1546de=_0x1bb57a[_0x26b2('0xa')][_0x26b2('0xb')]['z'];_0x1bb57a[_0x26b2('0xa')][_0x26b2('0xb')]['x']=_0x316277*Math['cos'](_0x2233f7)+_0x1546de*Math[_0x26b2('0xc')](_0x2233f7);_0x1bb57a[_0x26b2('0xa')][_0x26b2('0xb')]['y']=_0x17f495*Math['cos'](_0x2233f7)-_0x316277*Math['sin'](_0x2233f7);_0x1bb57a[_0x26b2('0xa')][_0x26b2('0xb')]['z']=_0x1546de*Math[_0x26b2('0xd')](_0x2233f7)-_0x316277*Math[_0x26b2('0xc')](_0x2233f7);_0x1bb57a[_0x26b2('0xa')][_0x26b2('0xe')](_0x1bb57a[_0x26b2('0xf')][_0x26b2('0xb')]);}function _0x15900f(_0x2dbd00){_0x1c0354=_0x2dbd00;let _0x1d052b=_0x5f0a04[_0x26b2('0x10')]();if(_0x47e83d!=_0x1d052b){_0x47e83d=_0x1d052b;Drupal['atomizer']['base']['doAjax']('/ajax/loadYml',{'component':'animation','directory':_0x1bb57a[_0x26b2('0x0')][_0x26b2('0x11')],'filepath':_0x1bb57a[_0x26b2('0x0')][_0x26b2('0x11')]+'/'+_0x47e83d,'filename':_0x47e83d},_0x3bf017);}else{_0x3a884a=!![];if(_0x30ee09==_0x26b2('0x12')){_0x30ee09='running';if(_0x3893f6){_0x266cb5();}_0x391eeb();}else{_0x391eeb();}}}function _0xca82d3(){for(let _0x2a27bf in _0x4462a4[_0x26b2('0x13')]){clearTimeout(_0x1771f7[_0x2a27bf]);}_0x1771f7={};if(_0x385a47){clearTimeout(_0x385a47);_0x385a47=null;}}function _0x3be963(){_0x2f0989=_0x1bb57a[_0x26b2('0xa')][_0x26b2('0xb')];_0x243db5=0x0;_0x1bb57a['atom_select'][_0x26b2('0x14')]({'index':_0x243db5});_0x39f10d();}function _0x39f10d(){for(let _0x560d1b in _0x4462a4[_0x26b2('0x13')]){let _0x46e3a7=_0x4462a4[_0x26b2('0x13')][_0x560d1b];let _0x7c1e3c=_0x1bb57a[_0x26b2('0x8')][_0x26b2('0x9')]('animation--speed');_0x1771f7[_0x560d1b]=setTimeout(()=>{_0xc37449(_0x560d1b,_0x46e3a7);_0x3a884a=!![];},_0x46e3a7[_0x26b2('0x15')]*(0x64-_0x7c1e3c)/0xfa);}if(_0x3893f6){_0x266cb5();}function _0xc37449(_0x375b4c,_0x522ad4){switch(_0x375b4c){case _0x26b2('0x16'):case _0x26b2('0x17'):if(_0x3a884a){if(_0x1c0354==_0x285962){console['log'](_0x26b2('0x18')+_0x5a70b1);_0x5a70b1=_0x1bb57a[_0x26b2('0x19')][_0x26b2('0x1a')]();_0x243db5++;}else{console['log']('applyTimer::getNextAtom\x20'+_0x5a70b1);_0x5a70b1=_0x1bb57a[_0x26b2('0x19')]['getPreviousAtom']();_0x243db5--;}}else{console[_0x26b2('0x1b')](_0x26b2('0x1c')+_0x5a70b1);_0x5a70b1=_0x1bb57a['atom_select'][_0x26b2('0x1d')]();}if(_0x522ad4[_0x26b2('0x1e')]&&_0x522ad4['zoom'][_0x243db5]){_0x1bb57a['camera']['position']['x']=_0x2f0989['x']*_0x522ad4[_0x26b2('0x1e')][_0x243db5];_0x1bb57a[_0x26b2('0xa')][_0x26b2('0xb')]['y']=_0x2f0989['y']*_0x522ad4[_0x26b2('0x1e')][_0x243db5];_0x1bb57a[_0x26b2('0xa')][_0x26b2('0xb')]['z']=_0x2f0989['z']*_0x522ad4[_0x26b2('0x1e')][_0x243db5];}console['log'](_0x26b2('0x1f')+_0x5a70b1);_0x11fb93();_0x1bb57a[_0x26b2('0x19')]['setSelectedAtom']({'nid':_0x5a70b1});_0x1bb57a[_0x26b2('0x20')][_0x26b2('0x21')]({'nid':_0x5a70b1,'type':'atom'},function(_0x302ab8){_0x1bb57a[_0x26b2('0x22')]();setTimeout(function(){_0x1bb57a[_0x26b2('0x23')][_0x26b2('0x24')]({'nid':_0x302ab8['az'][_0x26b2('0x25')],'width':0x1e0,'height':0x1e0,'filename':_0x302ab8['az']['name'],'overwrite':!![],'imageType':_0x26b2('0x26')});setTimeout(function(){_0xae835b();},0x7d0);},0x7d0);});break;case _0x26b2('0x27'):_0x9cb8ad=_0x522ad4;_0x1722ca=[];_0x34b29a=0x0;_0xebaafa=0x0;_0x3893f6=_0x9cb8ad[_0x34b29a];if(_0x3893f6[_0x26b2('0x28')]){for(let _0x36905e in _0x3893f6[_0x26b2('0x28')]){let _0x4c3acb=_0x3893f6['parms'][_0x36905e];_0x4c3acb[0x2]=(_0x4c3acb[0x0]-_0x4c3acb[0x1])/_0x3893f6['steps'];_0x4c3acb[0x3]=_0x4c3acb[0x0];_0x1bb57a[_0x26b2('0x8')][_0x26b2('0x29')](_0x36905e,_0x4c3acb[0x3]);}}_0x266cb5();break;case _0x26b2('0x2a'):break;}}}function _0x11fb93(){_0xca82d3();_0x30ee09=_0x26b2('0x12');}function _0xae835b(){if(_0x56d9ce){_0x11fb93();_0x30ee09=_0x26b2('0x12');}else{_0x39f10d();_0x30ee09=_0x26b2('0x2b');_0xec446c();}}function _0x266cb5(){_0x385a47=setTimeout(function(){_0x36810e(name,_0x9cb8ad);},_0x3893f6[_0x26b2('0x15')]/_0x3893f6[_0x26b2('0x2c')]);}function _0x36810e(_0x28fbca,_0x9cb8ad){if(_0xebaafa==_0x3893f6[_0x26b2('0x2c')]){_0x34b29a=_0x34b29a+0x1==_0x9cb8ad['length']?0x0:_0x34b29a+0x1;_0x3893f6=_0x9cb8ad[_0x34b29a];_0xebaafa=0x0;for(let _0x8a3bcd in _0x3893f6['parms']){let _0x2f1f81=_0x3893f6[_0x26b2('0x28')][_0x8a3bcd];_0x2f1f81[0x2]=(_0x2f1f81[0x0]-_0x2f1f81[0x1])/_0x3893f6[_0x26b2('0x2c')],_0x2f1f81[0x3]=_0x2f1f81[0x0];}}if(_0x3893f6[_0x26b2('0x28')]){for(let _0x59f88c in _0x3893f6[_0x26b2('0x28')]){let _0x2f1f81=_0x3893f6[_0x26b2('0x28')][_0x59f88c];_0x2f1f81[0x3]-=_0x2f1f81[0x2];_0x1bb57a[_0x26b2('0x8')]['applyControl'](_0x59f88c,_0x2f1f81[0x3]);}}_0xebaafa++;_0x266cb5();}function _0x391eeb(){let _0x41ca8d;if(_0x4462a4[_0x26b2('0x13')]){_0x3be963();}if(_0x4462a4[_0x26b2('0x2d')]){_0x30ee09=_0x26b2('0x2b');_0xec446c();}}function _0xec446c(){if(_0x56d9ce){_0x56d9ce=![];_0x11fb93();_0x30ee09=_0x26b2('0x12');}if(_0x30ee09==_0x26b2('0x2b')){switch(_0x4462a4[_0x26b2('0x2e')]){case'atoms':requestAnimationFrame(_0xec446c);if(_0x4462a4[_0x26b2('0x2d')]&&_0x4462a4['animations'][_0x26b2('0x2f')]){if(_0x4462a4[_0x26b2('0x2d')][_0x26b2('0x2f')]['name']===_0x26b2('0x30')){_0x23c34b();}}break;case _0x26b2('0x31'):let _0x24c286=_0x1bb57a[_0x26b2('0x8')][_0x26b2('0x9')](_0x26b2('0x32'));requestAnimationFrame(_0xec446c);if(_0x4462a4['animations'][_0x26b2('0x33')]){_0x1bb57a[_0x26b2('0x31')][_0x26b2('0x34')](_0x4462a4);}break;}_0x1bb57a[_0x26b2('0x22')]();}}const _0x4e06a6=function(){_0x30ee09=_0x26b2('0x35');_0xca82d3();_0x4eb733['removeClass'](_0x26b2('0x36'));_0x530166(button)[_0x26b2('0x37')](_0x26b2('0x36'));};const _0x376193=function _0x376193(_0x153525){switch(_0x153525[_0x26b2('0x38')]['id']){case _0x26b2('0x39'):_0x15900f(_0x44bed7);_0x4eb733[_0x26b2('0x3a')](_0x26b2('0x36'));_0x530166(_0x153525[_0x26b2('0x38')])['addClass']('az-selected');break;case _0x26b2('0x3b'):_0x15900f(_0x285962);_0x4eb733[_0x26b2('0x3a')](_0x26b2('0x36'));_0x530166(_0x153525[_0x26b2('0x38')])[_0x26b2('0x37')](_0x26b2('0x36'));break;case _0x26b2('0x3c'):_0x56d9ce=!![];_0x4eb733[_0x26b2('0x3a')]('az-selected');_0x530166(_0x153525[_0x26b2('0x38')])[_0x26b2('0x37')]('az-selected');break;case _0x26b2('0x3d'):_0x4e06a6();break;case _0x26b2('0x3e'):break;case'animation--next':break;}};return{'buttonClicked':_0x376193,'loadYml':_0x3bf017,'play':_0x15900f,'stopAnimation':_0x4e06a6,'getYmlDirectory':()=>_0x1bb57a['atomizer'][_0x26b2('0x11')]};};}(jQuery));