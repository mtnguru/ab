var _0x24c8=['time','cycleatoms','log','applyTimer::getNextAtom\x20','getNextAtom','getPreviousAtom','zoom','applyTimer:\x20','setSelectedAtom','loadObject','atom','render','snapshot','takeSnapshot','nid','parms','steps','paused','length','applyControl','animations','type','atoms','rotation','name','orbitals','animation--speed','removeClass','az-selected','addClass','animation--reverse','target','animation--stop','animation--next','animationC','stopped','.animation--selectyml\x20select','.blocks--animation--wrapper','find','.az-button','data','filename','ymlContents','setItem','atomizer_animation_file','val','get','position','camera','cos','sin','scene','base','doAjax','/ajax/loadYml','animation','animateDirectory','atomizer','running','timers','atom_select','theme'];(function(_0x1d6f40,_0x2cf842){var _0x1d9201=function(_0x4f8eac){while(--_0x4f8eac){_0x1d6f40['push'](_0x1d6f40['shift']());}};_0x1d9201(++_0x2cf842);}(_0x24c8,0xdc));var _0x46dd=function(_0x5c9416,_0x4c52e2){_0x5c9416=_0x5c9416-0x0;var _0x250165=_0x24c8[_0x5c9416];return _0x250165;};(function(_0x4807b8){'use strict';Drupal['atomizer'][_0x46dd('0x0')]=function(_0x47b589){const _0x2eb2a8=0x1;const _0x5a71ff=-0x1;let _0x2f3ee7=_0x47b589;let _0x4df42e=_0x46dd('0x1');let _0x1aa7d7=![];let _0x18b10a=_0x2eb2a8;let _0x1eb462;let _0xfa945f;let _0x224fca;let _0x116669;let _0x174ed5=_0x4807b8(_0x46dd('0x2'));let _0x5e7821={};let _0x52db53;let _0x12dec9;let _0x74bf73=0x0;let _0x296675=0x0;let _0xc031e1;let _0x398c11;let _0x540d1b=0x0;let _0x2ff130=![];let _0xb7fd98=_0x4807b8(_0x46dd('0x3'));let _0x14d70a=_0xb7fd98[_0x46dd('0x4')](_0x46dd('0x5'));let _0x38807a=function(_0xad5b6d){_0x1eb462=_0xad5b6d[0x0][_0x46dd('0x6')][_0x46dd('0x7')];_0xfa945f=_0xad5b6d[0x0][_0x46dd('0x8')];localStorage[_0x46dd('0x9')](_0x46dd('0xa'),_0x1eb462);_0x174ed5[_0x46dd('0xb')](_0x1eb462);_0x23cce2();};function _0x396096(){let _0x31bdd2=_0x2f3ee7['theme'][_0x46dd('0xc')]('animation--speed')/0x3e8;let _0x2ec877=_0x2f3ee7['camera'][_0x46dd('0xd')]['x'],_0x1bf6d6=_0x2f3ee7['camera'][_0x46dd('0xd')]['y'],_0x3041bc=_0x2f3ee7[_0x46dd('0xe')][_0x46dd('0xd')]['z'];_0x2f3ee7[_0x46dd('0xe')][_0x46dd('0xd')]['x']=_0x2ec877*Math[_0x46dd('0xf')](_0x31bdd2)+_0x3041bc*Math[_0x46dd('0x10')](_0x31bdd2);_0x2f3ee7[_0x46dd('0xe')][_0x46dd('0xd')]['y']=_0x1bf6d6*Math[_0x46dd('0xf')](_0x31bdd2)-_0x2ec877*Math[_0x46dd('0x10')](_0x31bdd2);_0x2f3ee7['camera'][_0x46dd('0xd')]['z']=_0x3041bc*Math[_0x46dd('0xf')](_0x31bdd2)-_0x2ec877*Math[_0x46dd('0x10')](_0x31bdd2);_0x2f3ee7[_0x46dd('0xe')]['lookAt'](_0x2f3ee7[_0x46dd('0x11')][_0x46dd('0xd')]);}function _0xb04df6(_0xddd2ea){_0x18b10a=_0xddd2ea;let _0x507f34=_0x174ed5[_0x46dd('0xb')]();if(_0x1eb462!=_0x507f34){_0x1eb462=_0x507f34;Drupal['atomizer'][_0x46dd('0x12')][_0x46dd('0x13')](_0x46dd('0x14'),{'component':_0x46dd('0x15'),'directory':_0x2f3ee7['atomizer'][_0x46dd('0x16')],'filepath':_0x2f3ee7[_0x46dd('0x17')][_0x46dd('0x16')]+'/'+_0x1eb462,'filename':_0x1eb462},_0x38807a);}else{_0x2ff130=!![];if(_0x4df42e=='paused'){_0x4df42e=_0x46dd('0x18');if(_0x12dec9){_0x1e709c();}_0x23cce2();}else{_0x23cce2();}}}function _0x19026e(){for(let _0x3f3a2d in _0xfa945f[_0x46dd('0x19')]){clearTimeout(_0x5e7821[_0x3f3a2d]);}_0x5e7821={};if(_0xc031e1){clearTimeout(_0xc031e1);_0xc031e1=null;}}function _0x9611c7(){_0x224fca=_0x2f3ee7['camera'][_0x46dd('0xd')];_0x116669=0x0;_0x2f3ee7[_0x46dd('0x1a')]['setSelectedAtom']({'index':_0x116669});_0x19b1fe();}function _0x19b1fe(){for(let _0x18a35b in _0xfa945f['timers']){let _0x1cd244=_0xfa945f[_0x46dd('0x19')][_0x18a35b];let _0x8e6362=_0x2f3ee7[_0x46dd('0x1b')][_0x46dd('0xc')]('animation--speed');_0x5e7821[_0x18a35b]=setTimeout(()=>{_0x3a170c(_0x18a35b,_0x1cd244);_0x2ff130=!![];},_0x1cd244[_0x46dd('0x1c')]*(0x64-_0x8e6362)/0xfa);}if(_0x12dec9){_0x1e709c();}function _0x3a170c(_0x503736,_0x4817a3){switch(_0x503736){case'cycleimageatoms':case _0x46dd('0x1d'):if(_0x2ff130){if(_0x18b10a==_0x2eb2a8){console[_0x46dd('0x1e')](_0x46dd('0x1f')+_0x540d1b);_0x540d1b=_0x2f3ee7[_0x46dd('0x1a')][_0x46dd('0x20')]();_0x116669++;}else{console[_0x46dd('0x1e')](_0x46dd('0x1f')+_0x540d1b);_0x540d1b=_0x2f3ee7[_0x46dd('0x1a')][_0x46dd('0x21')]();_0x116669--;}}else{console[_0x46dd('0x1e')]('applyTimer::getSelectedAtom\x20'+_0x540d1b);_0x540d1b=_0x2f3ee7[_0x46dd('0x1a')]['getSelectedAtom']();}if(_0x4817a3['zoom']&&_0x4817a3[_0x46dd('0x22')][_0x116669]){_0x2f3ee7['camera']['position']['x']=_0x224fca['x']*_0x4817a3[_0x46dd('0x22')][_0x116669];_0x2f3ee7[_0x46dd('0xe')][_0x46dd('0xd')]['y']=_0x224fca['y']*_0x4817a3['zoom'][_0x116669];_0x2f3ee7[_0x46dd('0xe')][_0x46dd('0xd')]['z']=_0x224fca['z']*_0x4817a3[_0x46dd('0x22')][_0x116669];}console[_0x46dd('0x1e')](_0x46dd('0x23')+_0x540d1b);_0x2e77c6();_0x2f3ee7[_0x46dd('0x1a')][_0x46dd('0x24')]({'nid':_0x540d1b});_0x2f3ee7['atom'][_0x46dd('0x25')]({'nid':_0x540d1b,'type':_0x46dd('0x26')},function(_0x2ce36a){_0x2f3ee7[_0x46dd('0x27')]();setTimeout(function(){_0x2f3ee7[_0x46dd('0x28')][_0x46dd('0x29')]({'nid':_0x2ce36a['az'][_0x46dd('0x2a')],'width':0x4d8,'height':0x4d8,'filename':_0x2ce36a['az']['name'],'overwrite':!![]});setTimeout(function(){_0x3259e6();},0x7d0);},0x7d0);});break;case'loop':_0x52db53=_0x4817a3;_0x398c11=[];_0x74bf73=0x0;_0x296675=0x0;_0x12dec9=_0x52db53[_0x74bf73];if(_0x12dec9[_0x46dd('0x2b')]){for(let _0x20f986 in _0x12dec9[_0x46dd('0x2b')]){let _0x2a5886=_0x12dec9[_0x46dd('0x2b')][_0x20f986];_0x2a5886[0x2]=(_0x2a5886[0x0]-_0x2a5886[0x1])/_0x12dec9[_0x46dd('0x2c')];_0x2a5886[0x3]=_0x2a5886[0x0];_0x2f3ee7['theme']['applyControl'](_0x20f986,_0x2a5886[0x3]);}}_0x1e709c();break;case'opacity':break;}}}function _0x2e77c6(){_0x19026e();_0x4df42e=_0x46dd('0x2d');}function _0x3259e6(){if(_0x1aa7d7){_0x2e77c6();_0x4df42e=_0x46dd('0x2d');}else{_0x19b1fe();_0x4df42e=_0x46dd('0x18');_0x2d6d06();}}function _0x1e709c(){_0xc031e1=setTimeout(function(){_0x504716(name,_0x52db53);},_0x12dec9[_0x46dd('0x1c')]/_0x12dec9[_0x46dd('0x2c')]);}function _0x504716(_0x16536c,_0x52db53){if(_0x296675==_0x12dec9[_0x46dd('0x2c')]){_0x74bf73=_0x74bf73+0x1==_0x52db53[_0x46dd('0x2e')]?0x0:_0x74bf73+0x1;_0x12dec9=_0x52db53[_0x74bf73];_0x296675=0x0;for(let _0x468b1a in _0x12dec9[_0x46dd('0x2b')]){let _0x2e7c6f=_0x12dec9['parms'][_0x468b1a];_0x2e7c6f[0x2]=(_0x2e7c6f[0x0]-_0x2e7c6f[0x1])/_0x12dec9[_0x46dd('0x2c')],_0x2e7c6f[0x3]=_0x2e7c6f[0x0];}}if(_0x12dec9[_0x46dd('0x2b')]){for(let _0x67b63e in _0x12dec9['parms']){let _0x2e7c6f=_0x12dec9[_0x46dd('0x2b')][_0x67b63e];_0x2e7c6f[0x3]-=_0x2e7c6f[0x2];_0x2f3ee7[_0x46dd('0x1b')][_0x46dd('0x2f')](_0x67b63e,_0x2e7c6f[0x3]);}}_0x296675++;_0x1e709c();}function _0x23cce2(){let _0x3ac89b;if(_0xfa945f[_0x46dd('0x19')]){_0x9611c7();}if(_0xfa945f[_0x46dd('0x30')]){_0x4df42e=_0x46dd('0x18');_0x2d6d06();}}function _0x2d6d06(){if(_0x1aa7d7){_0x1aa7d7=![];_0x2e77c6();_0x4df42e='paused';}if(_0x4df42e==_0x46dd('0x18')){switch(_0xfa945f[_0x46dd('0x31')]){case _0x46dd('0x32'):requestAnimationFrame(_0x2d6d06);if(_0xfa945f[_0x46dd('0x30')]&&_0xfa945f[_0x46dd('0x30')][_0x46dd('0x33')]){if(_0xfa945f['animations'][_0x46dd('0x33')][_0x46dd('0x34')]===_0x46dd('0x35')){_0x396096();}}break;case'birkeland':let _0x4a5a0c=_0x2f3ee7[_0x46dd('0x1b')][_0x46dd('0xc')](_0x46dd('0x36'));requestAnimationFrame(_0x2d6d06);if(_0xfa945f[_0x46dd('0x30')]['particles']){_0x2f3ee7['birkeland']['animate'](_0xfa945f);}break;}_0x2f3ee7[_0x46dd('0x27')]();}}const _0x3847ab=function(){_0x4df42e=_0x46dd('0x1');_0x19026e();_0x14d70a[_0x46dd('0x37')](_0x46dd('0x38'));_0x4807b8(button)[_0x46dd('0x39')](_0x46dd('0x38'));};const _0x49e432=function _0x49e432(_0x3cfae2){switch(_0x3cfae2['target']['id']){case _0x46dd('0x3a'):_0xb04df6(_0x5a71ff);_0x14d70a[_0x46dd('0x37')]('az-selected');_0x4807b8(_0x3cfae2[_0x46dd('0x3b')])[_0x46dd('0x39')](_0x46dd('0x38'));break;case'animation--play':_0xb04df6(_0x2eb2a8);_0x14d70a['removeClass'](_0x46dd('0x38'));_0x4807b8(_0x3cfae2['target'])[_0x46dd('0x39')](_0x46dd('0x38'));break;case'animation--pause':_0x1aa7d7=!![];_0x14d70a['removeClass'](_0x46dd('0x38'));_0x4807b8(_0x3cfae2[_0x46dd('0x3b')])['addClass'](_0x46dd('0x38'));break;case _0x46dd('0x3c'):_0x3847ab();break;case'animation--previous':break;case _0x46dd('0x3d'):break;}};return{'buttonClicked':_0x49e432,'loadYml':_0x38807a,'play':_0xb04df6,'stopAnimation':_0x3847ab,'getYmlDirectory':()=>_0x2f3ee7[_0x46dd('0x17')][_0x46dd('0x16')]};};}(jQuery));