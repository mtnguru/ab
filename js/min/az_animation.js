var _0x2ed1=['position','camera','cos','sin','lookAt','scene','atomizer','base','doAjax','/ajax-ab/loadYml','animateDirectory','animation','paused','running','timers','atoms','atom','loadObject','nid','loop','parms','steps','opacity','time','length','applyControl','loadatoms','animations','rotation','orbitals','particles','birkeland','animate','render','stopped','removeClass','az-selected','addClass','animation--pause','animation--stop','animation--previous','animation--next','animationC','.animation--selectyml\x20select','.blocks--animation--wrapper','.az-button','data','filename','ymlContents','setItem','atomizer_animation_file','val','theme','get','animation--speed'];(function(_0x20e12b,_0xde57f6){var _0x25ab75=function(_0x2b7e66){while(--_0x2b7e66){_0x20e12b['push'](_0x20e12b['shift']());}};_0x25ab75(++_0xde57f6);}(_0x2ed1,0x1ab));var _0x5cd3=function(_0xe5d5b,_0x13225e){_0xe5d5b=_0xe5d5b-0x0;var _0x4af22d=_0x2ed1[_0xe5d5b];return _0x4af22d;};(function(_0x519990){'use strict';Drupal['atomizer'][_0x5cd3('0x0')]=function(_0x4c81e9){var _0x1209e3=_0x4c81e9;var _0x3d7f9e='stopped';var _0x500b65;var _0x33ffba;var _0x463b44;var _0x1af08f=_0x519990(_0x5cd3('0x1'));var _0x5f5d16={};var _0x50b749;var _0x4f382d;var _0x16498e=0x0;var _0x32adf1=0x0;var _0xc2d05c;var _0xed39e6;var _0x38c2e1=-0x1;var _0x19d18b=null;var _0x5d9f02=_0x519990(_0x5cd3('0x2'));var _0x561d10=_0x5d9f02['find'](_0x5cd3('0x3'));var _0x4dbcae=function(_0x228272){_0x33ffba=_0x228272[0x0][_0x5cd3('0x4')][_0x5cd3('0x5')];_0x463b44=_0x228272[0x0][_0x5cd3('0x6')];localStorage[_0x5cd3('0x7')](_0x5cd3('0x8'),_0x33ffba);_0x1af08f[_0x5cd3('0x9')](_0x33ffba);_0x337653();};function _0x58df68(){var _0x534f28=_0x1209e3[_0x5cd3('0xa')][_0x5cd3('0xb')](_0x5cd3('0xc'))/0x3e8;var _0x2a5ba7=_0x1209e3['camera'][_0x5cd3('0xd')]['x'],_0x350401=_0x1209e3[_0x5cd3('0xe')][_0x5cd3('0xd')]['y'],_0x294f9d=_0x1209e3[_0x5cd3('0xe')][_0x5cd3('0xd')]['z'];_0x1209e3[_0x5cd3('0xe')]['position']['x']=_0x2a5ba7*Math[_0x5cd3('0xf')](_0x534f28)+_0x294f9d*Math[_0x5cd3('0x10')](_0x534f28);_0x1209e3[_0x5cd3('0xe')][_0x5cd3('0xd')]['y']=_0x350401*Math[_0x5cd3('0xf')](_0x534f28)-_0x2a5ba7*Math['sin'](_0x534f28);_0x1209e3[_0x5cd3('0xe')][_0x5cd3('0xd')]['z']=_0x294f9d*Math['cos'](_0x534f28)-_0x2a5ba7*Math['sin'](_0x534f28);_0x1209e3[_0x5cd3('0xe')][_0x5cd3('0x11')](_0x1209e3[_0x5cd3('0x12')][_0x5cd3('0xd')]);};function _0x384f47(){var _0x295340=_0x1af08f[_0x5cd3('0x9')]();if(_0x33ffba!=_0x295340){_0x33ffba=_0x295340;Drupal[_0x5cd3('0x13')][_0x5cd3('0x14')][_0x5cd3('0x15')](_0x5cd3('0x16'),{'directory':_0x1209e3[_0x5cd3('0x13')]['animateDirectory'],'filepath':_0x1209e3[_0x5cd3('0x13')][_0x5cd3('0x17')]+'/'+_0x33ffba,'filename':_0x33ffba,'component':_0x5cd3('0x18')},_0x4dbcae);}else{if(_0x3d7f9e==_0x5cd3('0x19')){_0x3d7f9e=_0x5cd3('0x1a');_0x18f69c();if(_0x4f382d){_0x145629();}}else{_0x337653();}}}function _0x2dc947(){for(var _0xac6dc7 in _0x463b44['timers']){clearTimeout(_0x5f5d16[_0xac6dc7]);}_0x5f5d16={};if(_0xc2d05c){clearTimeout(_0xc2d05c);_0xc2d05c=null;}}function _0x24767d(){for(var _0x33c01b in _0x463b44[_0x5cd3('0x1b')]){var _0x275bf1=_0x463b44[_0x5cd3('0x1b')][_0x33c01b];_0x5f5d16[_0x33c01b]=setTimeout(function(){_0x45e144(_0x33c01b,_0x275bf1);},_0x275bf1['time']);}if(_0x4f382d){_0x145629();}}function _0x45e144(_0x3ee179,_0x1dfb3d){switch(_0x3ee179){case'loadatoms':_0x38c2e1=_0x38c2e1>=_0x1dfb3d[_0x5cd3('0x1c')]['length']-0x1?0x0:_0x38c2e1+0x1;_0x2dc947();_0x3d7f9e=_0x5cd3('0x19');_0x1209e3[_0x5cd3('0x1d')][_0x5cd3('0x1e')](_0x1dfb3d['atoms'][_0x38c2e1][_0x5cd3('0x1f')],function(){if(_0x1dfb3d[_0x5cd3('0x1c')][_0x38c2e1]['time']){_0x1dfb3d['time']=_0x1dfb3d[_0x5cd3('0x1c')][_0x38c2e1]['time'];}_0x12fe41;});break;case _0x5cd3('0x20'):_0x50b749=_0x1dfb3d;_0xed39e6=[];_0x16498e=0x0;_0x32adf1=0x0;_0x4f382d=_0x50b749[_0x16498e];if(_0x4f382d[_0x5cd3('0x21')]){for(var _0x5c2c9e in _0x4f382d['parms']){var _0x41e43b=_0x4f382d[_0x5cd3('0x21')][_0x5c2c9e];_0x41e43b[0x2]=(_0x41e43b[0x0]-_0x41e43b[0x1])/_0x4f382d[_0x5cd3('0x22')];_0x41e43b[0x3]=_0x41e43b[0x0];_0x1209e3[_0x5cd3('0xa')]['applyControl'](_0x5c2c9e,_0x41e43b[0x3]);}}_0x145629();break;case _0x5cd3('0x23'):break;}}function _0x12fe41(){_0x24767d();_0x3d7f9e=_0x5cd3('0x1a');_0x18f69c();}function _0x145629(){_0xc2d05c=setTimeout(function(){_0x177aaf(name,_0x50b749);},_0x4f382d[_0x5cd3('0x24')]/_0x4f382d[_0x5cd3('0x22')]);}function _0x177aaf(_0xfd9340,_0xc55e6e){if(_0x32adf1==_0x4f382d[_0x5cd3('0x22')]){_0x16498e=_0x16498e+0x1==_0xc55e6e[_0x5cd3('0x25')]?0x0:_0x16498e+0x1;_0x4f382d=_0xc55e6e[_0x16498e];_0x32adf1=0x0;for(var _0x2b759d in _0x4f382d[_0x5cd3('0x21')]){var _0x37356b=_0x4f382d[_0x5cd3('0x21')][_0x2b759d];_0x37356b[0x2]=(_0x37356b[0x0]-_0x37356b[0x1])/_0x4f382d['steps'],_0x37356b[0x3]=_0x37356b[0x0];}}if(_0x4f382d[_0x5cd3('0x21')]){for(var _0x2b759d in _0x4f382d[_0x5cd3('0x21')]){var _0x37356b=_0x4f382d[_0x5cd3('0x21')][_0x2b759d];_0x37356b[0x3]-=_0x37356b[0x2];_0x1209e3[_0x5cd3('0xa')][_0x5cd3('0x26')](_0x2b759d,_0x37356b[0x3]);}}_0x32adf1++;_0x145629();}function _0x337653(){_0x3d7f9e=_0x5cd3('0x1a');var _0x1b04d6;if(_0x463b44[_0x5cd3('0x1b')]){if(_0x463b44[_0x5cd3('0x1b')][_0x5cd3('0x27')]){_0x463b44[_0x5cd3('0x1b')][_0x5cd3('0x27')][_0x5cd3('0x24')]=_0x463b44['timers'][_0x5cd3('0x27')]['atoms'][0x0][_0x5cd3('0x24')];}_0x24767d();}if(_0x463b44['animations']){_0x3d7f9e='running';_0x18f69c();}}function _0x18f69c(){if(_0x3d7f9e==_0x5cd3('0x1a')){requestAnimationFrame(_0x18f69c);}if(_0x463b44[_0x5cd3('0x28')][_0x5cd3('0x29')]){if(_0x463b44['animations'][_0x5cd3('0x29')]['name']===_0x5cd3('0x2a')){_0x58df68();}}if(_0x463b44['animations'][_0x5cd3('0x2b')]){_0x1209e3[_0x5cd3('0x2c')][_0x5cd3('0x2d')](_0x463b44);}_0x1209e3[_0x5cd3('0x2e')]();}var _0x1ac7f3=function(){_0x3d7f9e=_0x5cd3('0x2f');_0x2dc947();_0x561d10[_0x5cd3('0x30')](_0x5cd3('0x31'));_0x519990(button)['addClass']('az-selected');};var _0x71f5a0=function _0x71f5a0(_0x3c6060){switch(_0x3c6060['id']){case'animation--play':_0x384f47();_0x561d10[_0x5cd3('0x30')](_0x5cd3('0x31'));_0x519990(_0x3c6060)[_0x5cd3('0x32')](_0x5cd3('0x31'));break;case _0x5cd3('0x33'):_0x3d7f9e='paused';_0x2dc947();_0x561d10[_0x5cd3('0x30')](_0x5cd3('0x31'));_0x519990(_0x3c6060)[_0x5cd3('0x32')](_0x5cd3('0x31'));break;case _0x5cd3('0x34'):_0x1ac7f3();break;case _0x5cd3('0x35'):break;case _0x5cd3('0x36'):break;}};return{'buttonClicked':_0x71f5a0,'loadYml':_0x4dbcae,'play':_0x384f47,'stopAnimation':_0x1ac7f3};};}(jQuery));