var _0x4568=['Axes','LineBasicMaterial','length','--opacity','Mesh','MeshBasicMaterial','--color','--linewidth','rotation','indices','azfaces','Group','add','Line','faces','init_','MeshLambertMaterial','FaceColors','MultiMaterial','MeshStandardMaterial','protons','color','getColor','PlaneGeometry','width','depth','proton','sphere','SphereGeometry','radius','heightSegments','electron','electron--radius','widthSegments','octahedron','OctahedronGeometry','TetrahedronGeometry','DodecahedronGeometry','cube','BoxGeometry','pentagonalBipyramid','wireframe','lambert','phong','MeshPhongMaterial','doubleSided','side','DoubleSide','SceneUtils','createMultiMaterialObject','position','boron','boron10','boron11','lithium','shapes','nuclet','initial','final','getGeometry','backbone','icosahedron','decahedron','line','tetrahedron','hexahedron','proton-default','type','proton-ghost','neutral','default','pairs','proton-','rings','alpha3','state','helium','proton-neutral','neutron','proton-neutron','proton-initial','visible','optional','active','proton--opacity','opacity','material','transparent','AxisHelper','linewidth','protonGeometry','conf','hasOwnProperty','indexOf','neutrons','subVectors','cross','multiplyScalar','divideScalar','log','valence-active--color','valence--opacity','valence--scale','valence','TorusGeometry','valence-active','tetra','azid','tetrahedrons','children','geometry','electron--opacity','electrons','contains','electron--color','proton--scale','shape','carbon','beryllium','scaleHeight','compConf','scaleInit','applyMatrix','Matrix4','makeRotationX','makeRotationZ','axes','particleids','alignyaxis','clone','alignObjectToAxis','normalize','attachPt','rotatey','components','nuclet-','replace','backbone-','geo','atomizer_config','objects','dodecahedron','geoGroups','nucletAxes','makeRotationY','attach','attachLines--opacity','Object3D','nucletInner-','nucletOuter-','atom','nuclets','parent','remove','cos','sin','Face3','computeFaceNormals','protonRadius','dynamic','createGeometryWireframe','createGeometryFaces','Faces','atomizer','base','constants','theme','proton--radius','get','Geometry','Axes--color','transparentThresh','visibleThresh','vertices','push','Vector3','LineSegments','scale','set','name'];(function(_0x26a305,_0x33db05){var _0x710ccc=function(_0x822047){while(--_0x822047){_0x26a305['push'](_0x26a305['shift']());}};_0x710ccc(++_0x33db05);}(_0x4568,0x157));var _0x9c65=function(_0x63dfbb,_0x1796c7){_0x63dfbb=_0x63dfbb-0x0;var _0x4d7d80=_0x4568[_0x63dfbb];return _0x4d7d80;};(function(_0x937a10){Drupal['atomizer']['nucletC']=function(_0x319aed){var _0x38f216=_0x319aed;var _0x19ad5b=Drupal[_0x9c65('0x0')][_0x9c65('0x1')][_0x9c65('0x2')];var _0x2a3d5e=['x','y','z'];var _0x1b421c=_0x38f216[_0x9c65('0x3')]['get'](_0x9c65('0x4'));var _0x2ce3bd=_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')]('electron--radius');var _0x57e360;function _0x45a97a(_0x4cb317,_0x5e913d,_0x5a500f){var _0x5b17e9=new THREE[(_0x9c65('0x6'))]();var _0xf9cc88=_0x38f216['theme'][_0x9c65('0x5')](_0x4cb317+'Axes--opacity');var _0xbdeb8b=new THREE['LineBasicMaterial']({'color':_0x38f216[_0x9c65('0x3')]['get'](_0x4cb317+_0x9c65('0x7')),'opacity':_0xf9cc88,'transparent':_0xf9cc88<_0x19ad5b[_0x9c65('0x8')],'visible':_0xf9cc88>_0x19ad5b[_0x9c65('0x9')],'linewidth':0x2});for(var _0xe0fc37=0x0;_0xe0fc37<_0x5e913d[_0x9c65('0xa')]['length'];_0xe0fc37++){var _0x4f0c5f;_0x4f0c5f=_0x5a500f['vertices'][_0x5e913d[_0x9c65('0xa')][_0xe0fc37][0x0]];_0x5b17e9['vertices'][_0x9c65('0xb')](new THREE[(_0x9c65('0xc'))](_0x4f0c5f['x'],_0x4f0c5f['y'],_0x4f0c5f['z']));_0x4f0c5f=_0x5a500f['vertices'][_0x5e913d['vertices'][_0xe0fc37][0x1]];_0x5b17e9['vertices'][_0x9c65('0xb')](new THREE[(_0x9c65('0xc'))](_0x4f0c5f['x'],_0x4f0c5f['y'],_0x4f0c5f['z']));}var _0x1bb35a=new THREE[(_0x9c65('0xd'))](_0x5b17e9,_0xbdeb8b);if(_0x5e913d[_0x9c65('0xe')]){_0x1bb35a[_0x9c65('0xe')][_0x9c65('0xf')](_0x5e913d[_0x9c65('0xe')],_0x5e913d['scale'],_0x5e913d[_0x9c65('0xe')]);}_0x1bb35a[_0x9c65('0x10')]=_0x4cb317+_0x9c65('0x11');return _0x1bb35a;}function _0x51f826(_0x4938ea,_0x139619,_0x32b9d4){var _0x5e7363=new THREE[(_0x9c65('0x6'))]();var _0x40323e=new THREE[(_0x9c65('0x12'))]({'color':0xff00ff,'opacity':_0x32b9d4,'transparent':_0x32b9d4<_0x19ad5b[_0x9c65('0x8')],'visible':_0x32b9d4>_0x19ad5b[_0x9c65('0x9')],'linewidth':0x2});for(var _0x3c62fb=0x0;_0x3c62fb<_0x139619[_0x9c65('0x13')];_0x3c62fb++){var _0x1d2725=_0x139619[_0x3c62fb];_0x5e7363[_0x9c65('0xa')][_0x9c65('0xb')](new THREE['Vector3'](_0x1d2725['x'],_0x1d2725['y'],_0x1d2725['z']));}var _0x1a9ed8=new THREE['LineSegments'](_0x5e7363,_0x40323e);_0x1a9ed8[_0x9c65('0x10')]=_0x4938ea+'Lines';return _0x1a9ed8;}function _0x2ed499(_0x359a1b,_0x23ece3,_0x39a33e,_0x2e08cd){var _0x20574b=_0x38f216['theme'][_0x9c65('0x5')](_0x359a1b+_0x9c65('0x14'));var _0x54038a=new THREE[(_0x9c65('0x15'))](_0x39a33e,new THREE[(_0x9c65('0x16'))]({'color':_0x38f216[_0x9c65('0x3')]['get'](_0x359a1b+_0x9c65('0x17')),'opacity':_0x20574b,'transparent':_0x20574b<_0x19ad5b[_0x9c65('0x8')],'visible':_0x20574b>_0x19ad5b[_0x9c65('0x9')],'wireframe':!![],'wireframeLinewidth':_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x359a1b+_0x9c65('0x18'))}));_0x54038a[_0x9c65('0xe')][_0x9c65('0xf')](_0x23ece3,_0x23ece3,_0x23ece3);_0x54038a[_0x9c65('0x10')]=_0x359a1b;if(_0x2e08cd){for(var _0x2230f7 in _0x2a3d5e){var _0x2c2ea5=_0x2a3d5e[_0x2230f7];if(_0x2e08cd[_0x2c2ea5]){var _0x176101=_0x2e08cd[_0x2c2ea5]/0x168*0x2*Math['PI'];_0x54038a['rotation']['init_'+_0x2c2ea5]=_0x176101;_0x54038a[_0x9c65('0x19')][_0x2c2ea5]=_0x176101;}}}_0x19a51b(_0x359a1b,_0x54038a);return _0x54038a;}function _0x4bf627(_0x11f409,_0xc86c38,_0x7ac44,_0x1c69f0){if(!_0x7ac44[_0x9c65('0x1a')]&&!_0x7ac44[_0x9c65('0x1b')])return null;var _0x51a396=_0x38f216['theme'][_0x9c65('0x5')](_0x11f409+_0x9c65('0x14'));var _0x7be6e5=new THREE[(_0x9c65('0x12'))]({'color':_0x38f216[_0x9c65('0x3')]['get'](_0x11f409+_0x9c65('0x17')),'opacity':_0x51a396,'transparent':_0x51a396<_0x19ad5b[_0x9c65('0x8')],'visible':_0x51a396>_0x19ad5b[_0x9c65('0x9')],'linewidth':_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x11f409+_0x9c65('0x18'))});var _0x3ab479;var _0x203002=new THREE[(_0x9c65('0x1c'))]();_0x203002[_0x9c65('0x10')]=_0x11f409;if(_0x7ac44[_0x9c65('0x1b')]){for(var _0x373da2=0x0;_0x373da2<_0x7ac44[_0x9c65('0x1b')][_0x9c65('0x13')];_0x373da2++){var _0x2c2dfb=_0x7ac44[_0x9c65('0x1b')][_0x373da2];var _0x21177f=new THREE[(_0x9c65('0x6'))]();for(var _0x476089=0x0;_0x476089<_0x2c2dfb['indices'][_0x9c65('0x13')];_0x476089++){_0x3ab479=_0x7ac44[_0x9c65('0xa')][_0x2c2dfb[_0x9c65('0x1a')][_0x476089]];_0x21177f[_0x9c65('0xa')]['push'](new THREE['Vector3'](_0x3ab479['x'],_0x3ab479['y'],_0x3ab479['z']));}_0x3ab479=_0x7ac44[_0x9c65('0xa')][_0x2c2dfb['indices'][0x0]];_0x21177f[_0x9c65('0xa')]['push'](new THREE[(_0x9c65('0xc'))](_0x3ab479['x'],_0x3ab479['y'],_0x3ab479['z']));_0x203002[_0x9c65('0x1d')](new THREE[(_0x9c65('0x1e'))](_0x21177f,_0x7be6e5));}}else{var _0x255f6e=['a','b','c','d','e'];for(var _0x373da2=0x0;_0x373da2<_0x7ac44['faces']['length'];_0x373da2++){var _0x21177f=new THREE[(_0x9c65('0x6'))]();var _0x2c2dfb=_0x7ac44[_0x9c65('0x1f')][_0x373da2];for(var _0x476089=0x0;_0x476089<_0x255f6e[_0x9c65('0x13')];_0x476089++){if(_0x255f6e[_0x476089]in _0x2c2dfb){_0x3ab479=_0x7ac44[_0x9c65('0xa')][_0x2c2dfb[_0x255f6e[_0x476089]]];_0x21177f[_0x9c65('0xa')][_0x9c65('0xb')](new THREE['Vector3'](_0x3ab479['x'],_0x3ab479['y'],_0x3ab479['z']));}}_0x3ab479=_0x7ac44[_0x9c65('0xa')][_0x2c2dfb['a']];_0x21177f[_0x9c65('0xa')][_0x9c65('0xb')](new THREE['Vector3'](_0x3ab479['x'],_0x3ab479['y'],_0x3ab479['z']));_0x203002[_0x9c65('0x1d')](new THREE[(_0x9c65('0x1e'))](_0x21177f,_0x7be6e5));}}_0x203002[_0x9c65('0xe')]['set'](_0xc86c38,_0xc86c38,_0xc86c38);if(_0x1c69f0){for(var _0x58f159 in _0x2a3d5e){var _0x2326c8=_0x2a3d5e[_0x58f159];if(_0x1c69f0[_0x2326c8]){var _0x193dba=_0x1c69f0[_0x2326c8]/0x168*0x2*Math['PI'];_0x203002[_0x9c65('0x19')][_0x9c65('0x20')+_0x2326c8]=_0x193dba;_0x203002['rotation'][_0x2326c8]=_0x193dba;}}}_0x19a51b(_0x11f409,_0x203002);return _0x203002;}function _0x2f73f3(_0x5939f7,_0x15dc72,_0x557039,_0x48e74c,_0x268f61){var _0x5dfe01;if(_0x268f61){_0x557039['dynamic']=!![];var _0x173dd8=new THREE[(_0x9c65('0x21'))]({'color':_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x5939f7+'--color'),'opacity':_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x5939f7+'--opacity'),'transparent':!![],'vertexColors':THREE[_0x9c65('0x22')]});var _0x4c82b=new THREE[(_0x9c65('0x21'))]({'color':_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x5939f7+'--color'),'opacity':0x0,'transparent':!![],'vertexColors':THREE[_0x9c65('0x22')]});_0x5dfe01=new THREE[(_0x9c65('0x15'))](_0x557039,new THREE[(_0x9c65('0x23'))]([_0x4c82b,_0x173dd8]));for(var _0x39bd56=0x0;_0x39bd56<_0x268f61[_0x9c65('0x13')];_0x39bd56++){_0x557039[_0x9c65('0x1f')][_0x268f61[_0x39bd56]]['materialIndex']=0x1;}}else{var _0x1c8025=_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x5939f7+_0x9c65('0x14'));var _0x3f21ac=new THREE[(_0x9c65('0x24'))]({'color':_0x38f216['theme'][_0x9c65('0x5')](_0x5939f7+_0x9c65('0x17')),'opacity':_0x1c8025,'transparent':_0x1c8025<_0x19ad5b[_0x9c65('0x8')],'visible':_0x1c8025>_0x19ad5b[_0x9c65('0x9')],'roughness':0.5,'metalness':0x0,'vertexColors':THREE['FaceColors']});_0x5dfe01=new THREE['Mesh'](_0x557039,_0x3f21ac);}_0x5dfe01[_0x9c65('0xe')][_0x9c65('0xf')](_0x15dc72,_0x15dc72,_0x15dc72);_0x5dfe01[_0x9c65('0x10')]=_0x5939f7;if(_0x48e74c){for(var _0x39bd56 in _0x2a3d5e){var _0x45d089=_0x2a3d5e[_0x39bd56];if(_0x48e74c[_0x45d089]){var _0x180a1a=_0x48e74c[_0x45d089]/0x168*0x2*Math['PI'];_0x5dfe01[_0x9c65('0x19')]['init_'+_0x45d089]=_0x180a1a;_0x5dfe01[_0x9c65('0x19')][_0x45d089]=_0x180a1a;}}}_0x19a51b(_0x5939f7,_0x5dfe01);return _0x5dfe01;}function _0x3240cf(_0xc1b86e,_0x44f0a2){for(var _0x32a03f=0x0;_0x32a03f<_0xc1b86e['az']['protons'][_0x9c65('0x13')];_0x32a03f++){if(_0xc1b86e['az'][_0x9c65('0x25')][_0x32a03f]){var _0x4ed664=_0xc1b86e['az'][_0x9c65('0x25')][_0x32a03f];var _0x33ac31=_0x1835da(_0x4ed664['az'])+'--color';_0x4ed664['material'][_0x9c65('0x26')]=_0x38f216[_0x9c65('0x3')][_0x9c65('0x27')](_0x33ac31,_0x44f0a2);}}}function _0x5243f1(_0x1aeec2,_0x1d4464,_0x3ec76f,_0x1caf26){var _0xa7d1d4;var _0x145ba5=![];switch(_0x1aeec2){case'plane':_0x145ba5=!![];_0xa7d1d4=new THREE[(_0x9c65('0x28'))](_0x3ec76f[_0x9c65('0x29')]||0x3e8,_0x3ec76f[_0x9c65('0x2a')]||0x3e8);break;case _0x9c65('0x2b'):case _0x9c65('0x2c'):if(_0x57e360){_0xa7d1d4=_0x57e360;}else{_0xa7d1d4=new THREE[(_0x9c65('0x2d'))](_0x3ec76f[_0x9c65('0x2e')]||_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x9c65('0x4')),_0x3ec76f['widthSegments']||0x24,_0x3ec76f[_0x9c65('0x2f')]||0x24);_0x57e360=_0xa7d1d4;}break;case _0x9c65('0x30'):_0xa7d1d4=new THREE[(_0x9c65('0x2d'))](_0x3ec76f[_0x9c65('0x2e')]||_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x9c65('0x31')),_0x3ec76f[_0x9c65('0x32')]||0xa,_0x3ec76f[_0x9c65('0x2f')]||0xa);break;case _0x9c65('0x33'):_0xa7d1d4=new THREE[(_0x9c65('0x34'))](_0x3ec76f[_0x9c65('0x13')]||0x3);break;case'tetrahedron':_0xa7d1d4=new THREE[(_0x9c65('0x35'))](_0x3ec76f[_0x9c65('0x13')]||0x3);break;case'icosahedron':_0xa7d1d4=new THREE['IcosahedronGeometry'](_0x3ec76f[_0x9c65('0x13')]||0x3);break;case'dodecahedron':_0xa7d1d4=new THREE[(_0x9c65('0x36'))](_0x3ec76f[_0x9c65('0x13')]||0x3);break;case _0x9c65('0x37'):var _0x59436b=_0x3ec76f['length']||0x4;_0xa7d1d4=new THREE[(_0x9c65('0x38'))](_0x59436b,_0x59436b,_0x59436b);break;case _0x9c65('0x39'):_0xa7d1d4=_0x5dc525(0x5,_0x3ec76f[_0x9c65('0x13')],_0x3ec76f['height'],0x23);break;}var _0x3005ce=[];if(_0x1d4464[_0x9c65('0x3a')]){_0x3005ce[_0x9c65('0xb')](new THREE[(_0x9c65('0x16'))](_0x1d4464['wireframe']));}if(_0x1d4464[_0x9c65('0x3b')]){_0x3005ce[_0x9c65('0xb')](new THREE[(_0x9c65('0x21'))](_0x1d4464[_0x9c65('0x3b')]));}if(_0x1d4464[_0x9c65('0x3c')]){_0x3005ce[_0x9c65('0xb')](new THREE[(_0x9c65('0x3d'))](_0x1d4464['phong']));}if(_0x1d4464[_0x9c65('0x3e')]){_0x3005ce[0x0][_0x9c65('0x3f')]=THREE[_0x9c65('0x40')];}var _0x49c1e5;if(_0x3005ce[_0x9c65('0x13')]==0x1){if(_0x1aeec2==_0x9c65('0x2b')){_0x49c1e5=new THREE[(_0x9c65('0x15'))](_0xa7d1d4,_0x3005ce[0x0]);}else{_0x49c1e5=new THREE[(_0x9c65('0x15'))](_0xa7d1d4,_0x3005ce[0x0]);}}else{_0x49c1e5=new THREE[(_0x9c65('0x41'))][(_0x9c65('0x42'))](_0xa7d1d4,_0x3005ce);}if(_0x3ec76f['scale']){_0x49c1e5[_0x9c65('0xe')][_0x9c65('0xf')](_0x3ec76f[_0x9c65('0xe')],_0x3ec76f['scale'],_0x3ec76f[_0x9c65('0xe')]);}if(_0x1caf26[_0x9c65('0x19')]){if(_0x1caf26['rotation']['x']){_0x49c1e5[_0x9c65('0x19')]['x']=_0x1caf26[_0x9c65('0x19')]['x'];}if(_0x1caf26[_0x9c65('0x19')]['y']){_0x49c1e5['rotation']['y']=_0x1caf26[_0x9c65('0x19')]['y'];}if(_0x1caf26['rotation']['z']){_0x49c1e5[_0x9c65('0x19')]['z']=_0x1caf26[_0x9c65('0x19')]['z'];}}_0x49c1e5[_0x9c65('0x43')]['x']=_0x1caf26['x']||0x0;_0x49c1e5[_0x9c65('0x43')]['y']=_0x1caf26['y']||0x0;_0x49c1e5[_0x9c65('0x43')]['z']=_0x1caf26['z']||0x0;_0x49c1e5[_0x9c65('0x10')]=_0x1aeec2;return _0x49c1e5;}function _0x39e1b4(_0x23b90c,_0x309951,_0x4cc0b9,_0x396534,_0x494331){switch(_0x23b90c){case'beryllium':case _0x9c65('0x44'):case _0x9c65('0x45'):case _0x9c65('0x46'):case'carbon':case _0x9c65('0x47'):return _0x38f216[_0x9c65('0x48')]['getGeometry'](_0x9c65('0x49'),_0x23b90c,_0x4cc0b9,null,_0x494331);case _0x9c65('0x4a'):case _0x9c65('0x4b'):return _0x38f216[_0x9c65('0x48')][_0x9c65('0x4c')](_0x9c65('0x4d'),_0x23b90c,_0x4cc0b9,null,_0x494331);case'neutral':case _0x9c65('0x4e'):return _0x38f216[_0x9c65('0x48')][_0x9c65('0x4c')](_0x9c65('0x4e'),_0x23b90c,_0x4cc0b9,null,_0x494331);case _0x9c65('0x4f'):return _0x38f216[_0x9c65('0x48')]['getGeometry'](_0x9c65('0x4f'),'final',_0x4cc0b9,_0x396534,_0x494331);case _0x9c65('0x50'):var _0x13a5c4=new THREE[(_0x9c65('0x6'))]();var _0x6c14a8=_0x1b421c*0x2;_0x13a5c4[_0x9c65('0xa')][_0x9c65('0xb')](new THREE[(_0x9c65('0xc'))](_0x6c14a8,0x0,0x0));_0x13a5c4[_0x9c65('0xa')][_0x9c65('0xb')](new THREE[(_0x9c65('0xc'))](0x0,0x0,0x0));_0x13a5c4['vertices'][_0x9c65('0xb')](new THREE[(_0x9c65('0xc'))](-_0x6c14a8,0x0,0x0));return _0x13a5c4;case _0x9c65('0x51'):return new THREE[(_0x9c65('0x35'))](_0x4cc0b9,_0x494331);case'dodecahedron':case _0x9c65('0x52'):case _0x9c65('0x4d'):return _0x38f216[_0x9c65('0x48')][_0x9c65('0x4c')](_0x23b90c,_0x309951,_0x4cc0b9,null,_0x494331);case _0x9c65('0x33'):return new THREE[(_0x9c65('0x34'))](_0x4cc0b9,_0x494331);}}function _0x1835da(_0x4c74e7){var _0x38ea74=_0x38f216['theme'][_0x9c65('0x5')]('proton--color-style');if(!_0x38ea74){_0x38ea74=_0x9c65('0x49');}name=_0x9c65('0x53');switch(_0x4c74e7[_0x9c65('0x54')]){case'grey':name=_0x9c65('0x53');break;case'ghost':name=_0x9c65('0x55');break;case _0x9c65('0x56'):name=_0x9c65('0x56');break;case _0x9c65('0x2b'):switch(_0x38ea74){case _0x9c65('0x57'):break;case _0x9c65('0x58'):name=_0x9c65('0x59')+_0x4c74e7[_0x9c65('0x58')];break;case _0x9c65('0x5a'):name=_0x9c65('0x59')+_0x4c74e7[_0x9c65('0x5a')];break;case _0x9c65('0x5b'):name=_0x9c65('0x59')+_0x4c74e7[_0x9c65('0x5b')];break;case'nuclet':if(_0x4c74e7[_0x9c65('0x49')]){var _0x582d7a=_0x4c74e7[_0x9c65('0x49')][_0x9c65('0x5c')];if(_0x582d7a==='hydrogen'||_0x582d7a===_0x9c65('0x5d')){name=_0x9c65('0x53');}else if(_0x4c74e7['pairs']==='neutral'){name=_0x9c65('0x5e');}else if(_0x4c74e7[_0x9c65('0x58')]===_0x9c65('0x5f')){name=_0x9c65('0x60');}else if(_0x4c74e7[_0x9c65('0x49')][_0x9c65('0x5c')]===_0x9c65('0x4a')){name=_0x4c74e7['id']<0xc?_0x9c65('0x61'):_0x9c65('0x5e');}else{name=_0x9c65('0x59')+_0x582d7a;}}else{name=_0x9c65('0x53');}break;default:name=_0x9c65('0x53');break;}break;}return name;}function _0x164e5c(_0x45a58b,_0x4526cb,_0x4aa299,_0x494a55,_0x35f157){var _0x415aef={'id':_0x45a58b,'type':_0x4526cb[_0x9c65('0x54')]||_0x9c65('0x2b'),'pairs':_0x4526cb['pairs']||_0x9c65('0x57'),'alpha3':_0x4526cb['alpha3']||'default','rings':_0x4526cb[_0x9c65('0x5a')]||_0x9c65('0x57'),'visible':_0x9c65('0x62')in _0x4526cb?_0x4526cb[_0x9c65('0x62')]:!![],'optional':_0x4526cb[_0x9c65('0x63')]||![],'active':_0x4526cb[_0x9c65('0x64')]||!![],'nuclet':_0x35f157};var _0x4aa299=_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x9c65('0x65'));var _0x374886;if(_0x415aef[_0x9c65('0x64')]===![]){_0x374886=![];}else{_0x374886=_0x415aef[_0x9c65('0x62')]===![]?![]:_0x4aa299>_0x19ad5b['visibleThresh'];}var _0x4f7d72=_0x1835da(_0x415aef);var _0x35c0e6=_0x5243f1(_0x9c65('0x2b'),{'phong':{'color':_0x38f216[_0x9c65('0x3')][_0x9c65('0x27')](_0x4f7d72+_0x9c65('0x17')),'opacity':_0x4aa299,'transparent':_0x4aa299<_0x19ad5b[_0x9c65('0x8')],'visible':_0x374886}},{'scale':_0x38f216['theme'][_0x9c65('0x5')]('proton--scale'),'radius':_0x1b421c},{'x':_0x494a55['x'],'y':_0x494a55['y'],'z':_0x494a55['z']});_0x35c0e6[_0x9c65('0x10')]=_0x4f7d72;_0x35c0e6['material']['visible']=_0x374886;_0x35c0e6['az']=_0x415aef;return _0x35c0e6;}function _0x3fe313(_0x5404ca){}function _0x72ee4c(_0x331052,_0x185820,_0x1171bf){for(var _0x4106d=0x0;_0x4106d<_0x1171bf[_0x9c65('0x13')];_0x4106d++){var _0xf33c31=_0x331052['az'][_0x9c65('0x25')][_0x1171bf[_0x4106d]];if(_0x185820){_0xf33c31['material']['visible']=!![];_0xf33c31['material'][_0x9c65('0x66')]=0x1;_0xf33c31[_0x9c65('0x67')][_0x9c65('0x68')]=![];}else{_0xf33c31['material']['visible']=![];_0xf33c31[_0x9c65('0x67')][_0x9c65('0x66')]=0x0;_0xf33c31[_0x9c65('0x67')][_0x9c65('0x68')]=!![];}}}function _0x40999e(_0x1f85e3,_0x26cde8,_0x4d097b){var _0x16f491=_0x38f216['theme'][_0x9c65('0x5')](_0x1f85e3+_0x9c65('0x14'));var _0x177758=new THREE[(_0x9c65('0x69'))](_0x26cde8);_0x177758[_0x9c65('0x10')]=_0x1f85e3;_0x177758['material'][_0x9c65('0x6a')]=_0x4d097b;_0x177758[_0x9c65('0x67')][_0x9c65('0x66')]=_0x16f491;_0x177758[_0x9c65('0x67')][_0x9c65('0x62')]=_0x16f491>0.02;_0x177758[_0x9c65('0x67')][_0x9c65('0x68')]=_0x16f491<0.97;return _0x177758;}function _0x41bd50(_0x51e150,_0x11d799,_0x477b2d){var _0x513ece;switch(_0x477b2d[_0x9c65('0x5c')]){case'neutral':_0x51e150[_0x9c65('0xa')][0x9][_0x9c65('0xf')](0x0,_0x1b421c*0.1616236535868876,_0x1b421c*0.0998889113026354);break;}_0x477b2d[_0x9c65('0x25')]=[];_0x477b2d[_0x9c65('0x6b')]=_0x51e150;if(_0x477b2d[_0x9c65('0x6c')][_0x9c65('0x25')]){var _0x29f4c9=_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x9c65('0x65'));for(_0x513ece in _0x11d799[_0x9c65('0x25')]){if(!_0x11d799['protons'][_0x9c65('0x6d')](_0x513ece))continue;_0x11d799[_0x9c65('0x25')][_0x513ece][_0x9c65('0x62')]=_0x477b2d[_0x9c65('0x6c')][_0x9c65('0x25')][_0x9c65('0x6e')](parseInt(_0x513ece))>-0x1;if(_0x51e150[_0x9c65('0xa')][_0x513ece]){var _0x29a319=_0x164e5c(_0x513ece,_0x11d799[_0x9c65('0x25')][_0x513ece],_0x29f4c9,_0x51e150[_0x9c65('0xa')][_0x513ece],_0x477b2d);_0x477b2d[_0x9c65('0x25')][_0x513ece]=_0x29a319;}}}return _0x477b2d[_0x9c65('0x25')];}function _0x21c6e4(_0x104b70,_0x444be1,_0x5d7878){_0x5d7878[_0x9c65('0x6f')]=[];if(_0x444be1[_0x9c65('0x6f')]){var _0x141866=_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x9c65('0x65'));for(var _0x1ccbb5 in _0x444be1[_0x9c65('0x6f')]){if(!_0x444be1[_0x9c65('0x6f')][_0x9c65('0x6d')](_0x1ccbb5))continue;_0x444be1[_0x9c65('0x6f')][_0x1ccbb5][_0x9c65('0x62')]=!![];_0x444be1['neutrons'][_0x1ccbb5][_0x9c65('0x54')]='neutron';var _0x3c5cd2=_0x104b70['vertices'][_0x444be1[_0x9c65('0x6f')][_0x1ccbb5][0x0]];var _0x28eb3e=_0x104b70[_0x9c65('0xa')][_0x444be1['neutrons'][_0x1ccbb5][0x1]];var _0x4d77ac=_0x104b70[_0x9c65('0xa')][_0x444be1[_0x9c65('0x6f')][_0x1ccbb5][0x2]];var _0x167a7d=new THREE[(_0x9c65('0xc'))]();var _0x48ab8d=new THREE[(_0x9c65('0xc'))]();_0x167a7d['subVectors'](_0x4d77ac,_0x3c5cd2);_0x48ab8d[_0x9c65('0x70')](_0x28eb3e,_0x3c5cd2);_0x167a7d[_0x9c65('0x71')](_0x48ab8d);_0x167a7d['normalize']();_0x167a7d[_0x9c65('0x72')](Math['sqrt'](0x2/0x3)*0x64);var _0x47d4a9=new THREE['Vector3']();_0x47d4a9=_0x47d4a9[_0x9c65('0x1d')](_0x3c5cd2)[_0x9c65('0x1d')](_0x28eb3e)[_0x9c65('0x1d')](_0x4d77ac)[_0x9c65('0x73')](0x3);if(_0x444be1[_0x9c65('0x6f')][_0x1ccbb5][0x3]){_0x47d4a9['sub'](_0x167a7d);}else{_0x47d4a9[_0x9c65('0x1d')](_0x167a7d);}console[_0x9c65('0x74')](_0x47d4a9['x']/0x32+',\x20'+_0x47d4a9['y']/0x32+',\x20'+_0x47d4a9['z']/0x32+',\x20\x20\x20\x20\x20');var _0x5dc66a=_0x164e5c(_0x1ccbb5,_0x444be1[_0x9c65('0x6f')][_0x1ccbb5],_0x141866,_0x47d4a9,_0x5d7878);_0x5d7878[_0x9c65('0x6f')][_0x1ccbb5]=_0x5dc66a;}}return _0x5d7878[_0x9c65('0x6f')];}function _0x5a8c52(_0x16c7d7,_0x270b54){var _0x3d2524=_0x38f216['theme'][_0x9c65('0x5')](_0x9c65('0x75'));var _0x3dea42=_0x38f216[_0x9c65('0x3')]['get'](_0x9c65('0x76'));var _0xb6f32e=_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x9c65('0x77'))*_0x1b421c;var _0xf3ff15=_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')]('valence--diameter')*_0x1b421c;_0x270b54[_0x9c65('0x5a')]=[];for(var _0x4977a2 in _0x16c7d7[_0x9c65('0x78')]){var _0x51c1f7=_0x16c7d7[_0x9c65('0x78')][_0x4977a2];var _0x1f41ef=new THREE[(_0x9c65('0x79'))](_0xb6f32e,_0xf3ff15,0xa,0x28);var _0x123ed3=new THREE[(_0x9c65('0x3d'))]({'color':_0x3d2524,'opacity':_0x3dea42,'transparent':_0x3dea42<_0x19ad5b['transparentThresh'],'visible':_0x3dea42>_0x19ad5b[_0x9c65('0x9')]});var _0x11f4f3=new THREE[(_0x9c65('0x15'))](_0x1f41ef,_0x123ed3);_0x11f4f3['name']=_0x9c65('0x7a');_0x11f4f3['az']=_0x51c1f7;_0x270b54[_0x9c65('0x5a')][_0x4977a2]=_0x11f4f3;if(_0x51c1f7[_0x9c65('0x19')]){if(_0x51c1f7[_0x9c65('0x19')]['x']){_0x11f4f3['rotation']['x']=_0x51c1f7[_0x9c65('0x19')]['x']/0x168*0x2*Math['PI'];}if(_0x51c1f7[_0x9c65('0x19')]['y']){_0x11f4f3['rotation']['y']=_0x51c1f7[_0x9c65('0x19')]['y']/0x168*0x2*Math['PI'];}if(_0x51c1f7['rotation']['z']){_0x11f4f3['rotation']['z']=_0x51c1f7[_0x9c65('0x19')]['z']/0x168*0x2*Math['PI'];}}_0x270b54[_0x9c65('0x25')][parseInt(_0x4977a2)][_0x9c65('0x1d')](_0x11f4f3);}}function _0x1c705b(_0x41801e,_0x4df3c6,_0x1a7f2f){_0x1a7f2f['tetrahedrons']=[];for(var _0x51a56d=0x0;_0x51a56d<_0x41801e['tetrahedrons'][_0x9c65('0x13')];_0x51a56d++){var _0x579ee7=_0x5062c7(_0x9c65('0x7b'));_0x579ee7[_0x9c65('0x7c')]='t'+_0x51a56d;_0x1a7f2f[_0x9c65('0x7d')][_0x51a56d]=_0x579ee7;_0x579ee7[_0x9c65('0x7e')][0x1][_0x9c65('0x7f')][_0x9c65('0x25')]=[];for(var _0x383bba=0x0;_0x383bba<0x4;_0x383bba++){var _0x1253fa=_0x41801e[_0x9c65('0x7d')][_0x51a56d][_0x9c65('0xa')][_0x383bba];_0x579ee7[_0x9c65('0x7e')][0x0][_0x9c65('0x7f')][_0x9c65('0xa')][_0x383bba]['x']=_0x4df3c6[_0x9c65('0xa')][_0x1253fa]['x'];_0x579ee7[_0x9c65('0x7e')][0x0][_0x9c65('0x7f')]['vertices'][_0x383bba]['y']=_0x4df3c6[_0x9c65('0xa')][_0x1253fa]['y'];_0x579ee7[_0x9c65('0x7e')][0x0][_0x9c65('0x7f')][_0x9c65('0xa')][_0x383bba]['z']=_0x4df3c6[_0x9c65('0xa')][_0x1253fa]['z'];_0x579ee7[_0x9c65('0x7e')][0x1][_0x9c65('0x7f')][_0x9c65('0xa')][_0x383bba]['x']=_0x4df3c6[_0x9c65('0xa')][_0x1253fa]['x'];_0x579ee7[_0x9c65('0x7e')][0x1][_0x9c65('0x7f')][_0x9c65('0xa')][_0x383bba]['y']=_0x4df3c6[_0x9c65('0xa')][_0x1253fa]['y'];_0x579ee7[_0x9c65('0x7e')][0x1][_0x9c65('0x7f')][_0x9c65('0xa')][_0x383bba]['z']=_0x4df3c6['vertices'][_0x1253fa]['z'];_0x579ee7[_0x9c65('0x25')][_0x383bba]=_0x1a7f2f['protons'][_0x1253fa];}}return _0x1a7f2f[_0x9c65('0x7d')];}function _0x326ddf(_0x19e5cd,_0xc2d307,_0x263c27,_0x2aefdf){var _0x3e1a54=_0x38f216['theme']['get'](_0x9c65('0x80'))||0x1;var _0x4237ac=_0x263c27[_0x9c65('0xe')];var _0x361bf1=[];for(var _0x353c27 in _0x263c27[_0x9c65('0x81')]){if(!_0x263c27[_0x9c65('0x81')][_0x9c65('0x6d')](_0x353c27))continue;if(_0x2aefdf[_0x9c65('0x81')]&&!_0x2aefdf[_0x9c65('0x81')][_0x9c65('0x82')](_0x353c27))continue;var _0x31aec7=_0xc2d307[_0x9c65('0xa')][_0x353c27];var _0x279311=_0x5243f1('electron',{'phong':{'color':_0x38f216[_0x9c65('0x3')]['get'](_0x9c65('0x83')),'opacity':_0x3e1a54,'transparent':_0x3e1a54<_0x19ad5b['transparentThresh'],'visible':_0x3e1a54>_0x19ad5b[_0x9c65('0x9')]}},{'scale':_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x9c65('0x84')),'radius':_0x2ce3bd},{'x':_0x31aec7['x']*_0x4237ac,'y':_0x31aec7['y']*_0x4237ac,'z':_0x31aec7['z']*_0x4237ac});_0x279311[_0x9c65('0x10')]=_0x9c65('0x30');_0x19a51b(_0x9c65('0x81'),_0x279311);_0x361bf1[_0x353c27]=_0x279311;}return _0x361bf1;}function _0xc1634(_0x4902fd,_0x569374,_0x2266f7){var _0x5cdd9c;if(_0x2266f7[_0x9c65('0x85')]=='dodecahedron'||_0x2266f7[_0x9c65('0x85')]==_0x9c65('0x86')||_0x2266f7['shape']==_0x9c65('0x47')||_0x2266f7[_0x9c65('0x85')]==_0x9c65('0x52')||_0x2266f7[_0x9c65('0x85')]==_0x9c65('0x87')||_0x2266f7['shape']==_0x9c65('0x4a')||_0x2266f7['shape']==_0x9c65('0x4b')||_0x2266f7[_0x9c65('0x85')]==_0x9c65('0x44')||_0x2266f7[_0x9c65('0x85')]==_0x9c65('0x45')||_0x2266f7[_0x9c65('0x85')]==_0x9c65('0x46')){_0x5cdd9c=_0x4bf627(_0x4902fd,_0x2266f7[_0x9c65('0xe')],_0x569374,_0x2266f7['rotation']||null);}else{_0x5cdd9c=_0x2ed499(_0x4902fd,_0x2266f7[_0x9c65('0xe')]+0.02,_0x569374,_0x2266f7[_0x9c65('0x19')]||null);}return _0x5cdd9c;}function _0x2a2f07(_0x34e712,_0x2fc41b,_0x14dbd4,_0x2599bc,_0x4531d1){var _0x1aad88=_0x39e1b4(_0x14dbd4[_0x9c65('0x85')],_0x4531d1['state']||'',_0x14dbd4[_0x9c65('0xe')]*_0x1b421c,(_0x14dbd4[_0x9c65('0x88')]||0x1)*_0x1b421c);_0x1aad88[_0x9c65('0x89')]=_0x14dbd4;_0x1aad88[_0x9c65('0x8a')]=_0x14dbd4[_0x9c65('0xe')];var _0x2a1235;if(_0x2fc41b[_0x9c65('0x19')]){if(_0x2fc41b[_0x9c65('0x19')]['x']){_0x2a1235=_0x2fc41b[_0x9c65('0x19')]['x']/0x168*0x2*Math['PI'];_0x1aad88[_0x9c65('0x8b')](new THREE[(_0x9c65('0x8c'))]()[_0x9c65('0x8d')](_0x2a1235));}if(_0x2fc41b[_0x9c65('0x19')]['y']){_0x2a1235=_0x2fc41b[_0x9c65('0x19')]['y']/0x168*0x2*Math['PI'];_0x1aad88[_0x9c65('0x8b')](new THREE[(_0x9c65('0x8c'))]()['makeRotationY'](_0x2a1235));}if(_0x2fc41b[_0x9c65('0x19')]['z']){_0x2a1235=_0x2fc41b[_0x9c65('0x19')]['z']/0x168*0x2*Math['PI'];_0x1aad88['applyMatrix'](new THREE[(_0x9c65('0x8c'))]()[_0x9c65('0x8e')](_0x2a1235));}}if(_0x14dbd4['protons']){var _0x3ca35a=_0x41bd50(_0x1aad88,_0x14dbd4,_0x4531d1);for(var _0x330b14=0x0;_0x330b14<_0x3ca35a[_0x9c65('0x13')];_0x330b14++){if(_0x3ca35a[_0x330b14]){_0x2599bc[_0x9c65('0x1d')](_0x3ca35a[_0x330b14]);}}}if(_0x14dbd4[_0x9c65('0x6f')]){var _0x5ee282=_0x21c6e4(_0x1aad88,_0x14dbd4,_0x4531d1);for(var _0x330b14=0x0;_0x330b14<_0x5ee282[_0x9c65('0x13')];_0x330b14++){if(_0x5ee282[_0x330b14]){_0x2599bc['add'](_0x5ee282[_0x330b14]);}}}if(_0x14dbd4[_0x9c65('0x78')]){_0x5a8c52(_0x14dbd4,_0x4531d1);}if(_0x14dbd4['electrons']){var _0x3fface=_0x326ddf(_0x34e712,_0x1aad88,_0x14dbd4,_0x4531d1[_0x9c65('0x6c')]);for(var _0x4ce5a5=0x0;_0x4ce5a5<_0x3fface[_0x9c65('0x13')];_0x4ce5a5++){_0x2599bc[_0x9c65('0x1d')](_0x3fface[_0x4ce5a5]);}}if(_0x14dbd4[_0x9c65('0x8f')]){_0x2599bc['add'](_0x45a97a(_0x34e712,_0x14dbd4[_0x9c65('0x8f')],_0x1aad88));}if(_0x14dbd4[_0x9c65('0x7d')]){var _0x4eaf69=_0x1c705b(_0x14dbd4,_0x1aad88,_0x4531d1);for(var _0x1557d4=0x0;_0x1557d4<_0x4eaf69[_0x9c65('0x13')];_0x1557d4++){_0x2599bc[_0x9c65('0x1d')](_0x4eaf69[_0x1557d4]);}}if(_0x14dbd4[_0x9c65('0x3a')]){var _0x3aeeea=_0xc1634(_0x34e712+'Wireframe',_0x1aad88,_0x14dbd4);if(_0x3aeeea){_0x2599bc[_0x9c65('0x1d')](_0x3aeeea);}}if(_0x14dbd4['particleids']){_0x2599bc[_0x9c65('0x1d')](_0x38f216['sprites']['createVerticeIds'](_0x14dbd4[_0x9c65('0x90')],_0x1aad88));}return _0x1aad88;}function _0x2e7ff4(_0x32608a,_0x47d192,_0x530de8){var _0x120f4d=new THREE[(_0x9c65('0x1c'))]();_0x120f4d[_0x9c65('0x10')]=_0x32608a;var _0x92ccf4=parseFloat(_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x32608a+'--scale'));_0x120f4d['scale']['set'](_0x92ccf4,_0x92ccf4,_0x92ccf4);if(_0x47d192[_0x9c65('0x91')]){var _0x498536=_0x530de8[_0x9c65('0x6b')][_0x9c65('0xa')][_0x47d192[_0x9c65('0x91')][_0x9c65('0xa')][0x0]];var _0x4204e1=_0x530de8[_0x9c65('0x6b')][_0x9c65('0xa')][_0x47d192[_0x9c65('0x91')]['vertices'][0x1]];var _0x211737=_0x498536[_0x9c65('0x92')]()['sub'](_0x4204e1);Drupal[_0x9c65('0x0')][_0x9c65('0x1')][_0x9c65('0x93')](_0x120f4d,new THREE['Vector3'](0x0,0x1,0x0),_0x211737['clone']()[_0x9c65('0x94')](),![]);var _0x4fd65b=new THREE[(_0x9c65('0xc'))](0x0,0x0,0x0);var _0x354f88=_0x4fd65b[_0x9c65('0x1d')](_0x211737)[_0x9c65('0x72')](_0x47d192[_0x9c65('0x91')][_0x9c65('0x95')]);_0x120f4d[_0x9c65('0x43')][_0x9c65('0xf')](_0x354f88['x'],_0x354f88['y'],_0x354f88['z']);var _0x5bd30b=_0x47d192['alignyaxis'][_0x9c65('0x96')]/0x168*0x2*Math['PI'];_0x120f4d[_0x9c65('0x19')]['y']=_0x5bd30b;}for(var _0x29e998 in _0x47d192['components']){if(!_0x47d192[_0x9c65('0x97')]['hasOwnProperty'](_0x29e998))continue;var _0x2bf517=_0x47d192[_0x9c65('0x97')][_0x29e998];_0x2a2f07(_0x32608a,_0x47d192,_0x2bf517,_0x120f4d,_0x530de8);}return _0x120f4d;}function _0x2b0c9d(_0x515c7a,_0xf1ffe6){var _0x52ae82=new THREE[(_0x9c65('0x1c'))]();_0x52ae82[_0x9c65('0x10')]=_0x9c65('0x98')+_0x515c7a;_0xf1ffe6[_0x9c65('0x5c')]=_0xf1ffe6[_0x9c65('0x5c')][_0x9c65('0x99')](_0x9c65('0x9a'),'');_0x52ae82['az']={'protonRadius':_0x1b421c,'conf':_0xf1ffe6,'id':_0x515c7a,'state':_0xf1ffe6[_0x9c65('0x5c')]};_0x52ae82[_0x9c65('0x9b')]=drupalSettings[_0x9c65('0x9c')][_0x9c65('0x9d')][_0xf1ffe6[_0x9c65('0x5c')]];var _0x14bca3;var _0x118b27;switch(_0x52ae82['az'][_0x9c65('0x5c')]){case _0x9c65('0x9e'):break;case _0x9c65('0x56'):_0x14bca3=[0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xa,0xb,0xc,0xd,0xe,0xf,0x10,0x11,0x12,0x13,0x14,0x15];_0x118b27=[0x0,0x1,0x2,0x3,0x4,0x5];break;case _0x9c65('0x47'):_0x14bca3=[0x0,0x1,0x3,0x4,0x5,0x9,0xb];_0x118b27=[0x0,0x1,0x2];break;case _0x9c65('0x87'):_0x14bca3=[0x1,0x3,0x4,0x5,0x6,0x7,0x9,0xa,0xb];_0x118b27=[0x0,0x1,0x2];break;case'boron':case'boron10':_0x14bca3=[0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x9,0xa,0xb];_0x118b27=[0x0,0x1,0x2];break;case _0x9c65('0x46'):_0x14bca3=[0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x9,0xa,0xb];_0x118b27=[0x0,0x1,0x2];break;case _0x9c65('0x4a'):case _0x9c65('0x4b'):_0x14bca3=[0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xa,0xb,0xc,0xd,0xe,0xf,0x10,0x11,0x12,0x13,0x14,0x15];_0x118b27=[0x0,0x1,0x2,0x3,0x4,0x5];break;case _0x9c65('0x86'):_0x14bca3=[0x0,0x1,0x2,0x3,0x4,0x5,0x6,0x7,0x8,0x9,0xa,0xb,0xc,0xd,0xe,0xf,0x10,0x11,0x12,0x13];_0x118b27=[0x0,0x1,0x2,0x3,0x4,0x5];}if(!_0x52ae82['az']['conf']['electrons'])_0x52ae82['az'][_0x9c65('0x6c')][_0x9c65('0x81')]=_0x118b27;if(!_0x52ae82['az'][_0x9c65('0x6c')][_0x9c65('0x25')])_0x52ae82['az'][_0x9c65('0x6c')][_0x9c65('0x25')]=_0x14bca3;if(_0x515c7a!='N0'){var _0x2a7fcf=_0x52ae82['az']['conf']['protons'][_0x9c65('0x6e')](0xa);if(_0x2a7fcf>-0x1)_0x52ae82['az'][_0x9c65('0x6c')]['protons'][_0x2a7fcf]=undefined;if(_0x52ae82['az']['conf']['state']==='boron10'&&_0x52ae82['az'][_0x9c65('0x6c')][_0x9c65('0x5c')]===_0x9c65('0x44')){var _0x2a7fcf=_0x52ae82['az']['conf'][_0x9c65('0x25')][_0x9c65('0x6e')](0x0);if(_0x2a7fcf>-0x1){_0x52ae82['az'][_0x9c65('0x6c')][_0x9c65('0x25')][_0x2a7fcf]=undefined;}}}for(var _0x5dc2a1 in _0x52ae82[_0x9c65('0x9b')]['geoGroups']){if(!_0x52ae82[_0x9c65('0x9b')][_0x9c65('0x9f')][_0x9c65('0x6d')](_0x5dc2a1))continue;var _0x2822c6=_0x52ae82[_0x9c65('0x9b')][_0x9c65('0x9f')][_0x5dc2a1];var _0x250dd1=_0x2e7ff4(_0x5dc2a1,_0x2822c6,_0x52ae82['az']);_0x52ae82['add'](_0x250dd1);}_0x52ae82[_0x9c65('0x1d')](_0x40999e(_0x9c65('0xa0'),_0x1b421c*0x6,0x1));if(_0x52ae82['az'][_0x9c65('0x6c')]['rotation']){for(var _0x2a7fcf in _0x2a3d5e){var _0xf37b1=_0x2a3d5e[_0x2a7fcf];if(_0x52ae82['az'][_0x9c65('0x6c')][_0x9c65('0x19')][_0xf37b1]){var _0x204810=_0x52ae82['az']['conf']['rotation'][_0xf37b1]/0x168*0x2*Math['PI'];_0x52ae82['rotation']['init_'+_0xf37b1]=_0x204810;_0x52ae82[_0x9c65('0x19')][_0xf37b1]=_0x204810;}}}var _0x1794e6=_0x39e1b4('icosahedron','',_0x1b421c,0x1);_0x1794e6[_0x9c65('0x8b')](new THREE['Matrix4']()[_0x9c65('0xa1')](0x5a/0x168*0x2*Math['PI']));var _0x2f559f=_0x51f826(_0x9c65('0xa2'),[_0x1794e6['vertices'][0x9],_0x1794e6['vertices'][0xa]],_0x38f216[_0x9c65('0x3')][_0x9c65('0x5')](_0x9c65('0xa3')));_0x2f559f[_0x9c65('0xe')]['set'](0x5,0x5,0x5);_0x52ae82[_0x9c65('0x1d')](_0x2f559f);var _0x2fd058=new THREE[(_0x9c65('0xa4'))]();_0x2fd058[_0x9c65('0x10')]=_0x9c65('0xa5')+_0x515c7a;_0x2fd058[_0x9c65('0x1d')](_0x52ae82);_0x2fd058[_0x9c65('0x1d')](_0x40999e('nucletInnerAxes',_0x1b421c*0x5,0x3));var _0x3f6547=new THREE[(_0x9c65('0xa4'))]();_0x3f6547[_0x9c65('0x10')]=_0x9c65('0xa6')+_0x515c7a;_0x3f6547[_0x9c65('0x1d')](_0x2fd058);_0x3f6547[_0x9c65('0x1d')](_0x40999e('nucletOuterAxes',_0x1b421c*0x4,0x5));if(_0x52ae82['az']['conf'][_0x9c65('0x43')]){_0x3f6547[_0x9c65('0x43')]['x']=_0x52ae82['az']['conf'][_0x9c65('0x43')]['x']||0x0;_0x3f6547[_0x9c65('0x43')]['y']=_0x52ae82['az'][_0x9c65('0x6c')]['position']['y']||0x0;_0x3f6547[_0x9c65('0x43')]['z']=_0x52ae82['az'][_0x9c65('0x6c')][_0x9c65('0x43')]['z']||0x0;}return _0x3f6547;}function _0x7ac2b8(_0x1b07bf){if(_0x38f216[_0x9c65('0xa7')]['az']()['nuclets'][_0x1b07bf['az']['id']+'0']){_0x7ac2b8(_0x38f216['atom']['az']()[_0x9c65('0xa8')][_0x1b07bf['az']['id']+'0']);}if(_0x38f216[_0x9c65('0xa7')]['az']()[_0x9c65('0xa8')][_0x1b07bf['az']['id']+'1']){_0x7ac2b8(_0x38f216['atom']['az']()[_0x9c65('0xa8')][_0x1b07bf['az']['id']+'1']);}for(var _0x25c963=0x0;_0x25c963<_0x1b07bf['az'][_0x9c65('0x25')]['length'];_0x25c963++){if(_0x1b07bf['az'][_0x9c65('0x25')][_0x25c963]){_0x3fe313([_0x1b07bf['az'][_0x9c65('0x25')][_0x25c963]]);}}delete _0x38f216['atom']['az']()[_0x9c65('0xa8')][_0x1b07bf['az']['id']];_0x1b07bf['parent'][_0x9c65('0xa9')][_0x9c65('0xa9')][_0x9c65('0xaa')](_0x1b07bf['parent'][_0x9c65('0xa9')]);}function _0x22796e(_0x3cdcd3,_0x1fb082,_0x9a4b6d){var _0x5c5a2d=_0x9a4b6d/0x2;var _0x1de56b=new THREE[(_0x9c65('0x6'))]();_0x1de56b[_0x9c65('0xa')][_0x9c65('0xb')](new THREE['Vector3'](0x0,_0x5c5a2d,0x0));var _0x32b3e2=0x2*Math['PI']/_0x3cdcd3;for(var _0x457705=0x0,_0x5e8887=Math['PI'];_0x457705<_0x3cdcd3;_0x457705++,_0x5e8887+=_0x32b3e2){var _0x32fd10=Math[_0x9c65('0xab')](_0x5e8887);var _0x5d0411=Math[_0x9c65('0xac')](_0x5e8887);_0x1de56b[_0x9c65('0xa')][_0x9c65('0xb')](new THREE[(_0x9c65('0xc'))](_0x1fb082*_0x32fd10,-_0x5c5a2d,_0x1fb082*_0x5d0411));}for(var _0x457705=0x1;_0x457705<_0x3cdcd3;_0x457705++){_0x1de56b['faces'][_0x9c65('0xb')](new THREE[(_0x9c65('0xad'))](_0x457705+0x1,_0x457705,0x0));}_0x1de56b['faces'][_0x9c65('0xb')](new THREE[(_0x9c65('0xad'))](0x1,_0x3cdcd3,0x0));for(var _0x457705=0x2;_0x457705<_0x3cdcd3;_0x457705++){_0x1de56b[_0x9c65('0x1f')][_0x9c65('0xb')](new THREE[(_0x9c65('0xad'))](_0x457705,_0x457705+0x1,0x1));}_0x1de56b[_0x9c65('0xae')]();return _0x1de56b;}function _0x5dc525(_0x189a68,_0x486e36,_0x540d1e){var _0x5522d9=new THREE['Geometry']();mesth;_0x5522d9[_0x9c65('0xa')]['push'](new THREE[(_0x9c65('0xc'))](0x0,_0x540d1e,0x0));_0x5522d9[_0x9c65('0xa')][_0x9c65('0xb')](new THREE[(_0x9c65('0xc'))](0x0,-_0x540d1e,0x0));var _0x63daa=0x2*Math['PI']/_0x189a68;for(var _0x2d6c3b=0x0,_0x178372=Math['PI'];_0x2d6c3b<_0x189a68;_0x2d6c3b++,_0x178372+=_0x63daa){var _0x565cba=Math[_0x9c65('0xab')](_0x178372);var _0x3fcb00=Math[_0x9c65('0xac')](_0x178372);_0x5522d9[_0x9c65('0xa')][_0x9c65('0xb')](new THREE[(_0x9c65('0xc'))](_0x486e36*_0x565cba,0x0,_0x486e36*_0x3fcb00));}for(var _0x2d6c3b=0x2;_0x2d6c3b<_0x189a68+0x1;_0x2d6c3b++){_0x5522d9['faces'][_0x9c65('0xb')](new THREE[(_0x9c65('0xad'))](_0x2d6c3b+0x1,_0x2d6c3b,0x0));_0x5522d9[_0x9c65('0x1f')][_0x9c65('0xb')](new THREE[(_0x9c65('0xad'))](0x1,_0x2d6c3b,_0x2d6c3b+0x1));}_0x5522d9[_0x9c65('0x1f')]['push'](new THREE[(_0x9c65('0xad'))](0x2,_0x189a68+0x1,0x0));_0x5522d9[_0x9c65('0x1f')][_0x9c65('0xb')](new THREE[(_0x9c65('0xad'))](0x1,_0x189a68+0x1,0x2));_0x5522d9[_0x9c65('0xae')]();return _0x5522d9;}var _0x5062c7=function _0x5062c7(_0x11cbd8){var _0x407b66=new THREE[(_0x9c65('0x1c'))]();_0x407b66[_0x9c65('0x10')]='tetrahedron';_0x407b66[_0x9c65('0x25')]=[];_0x407b66[_0x9c65('0xaf')]=_0x1b421c;var _0x359f87=new THREE[(_0x9c65('0x35'))](_0x38f216[_0x9c65('0x49')][_0x9c65('0xaf')]*1.222);_0x359f87[_0x9c65('0xb0')]=!![];_0x407b66[_0x9c65('0x1d')](_0x38f216[_0x9c65('0x49')][_0x9c65('0xb1')](_0x11cbd8+'Wireframe',0x1,_0x359f87,null,null));_0x407b66[_0x9c65('0x1d')](_0x38f216[_0x9c65('0x49')][_0x9c65('0xb2')](_0x11cbd8+_0x9c65('0xb3'),0x1,_0x359f87,null,null));return _0x407b66;};function _0x19a51b(_0x4c2587,_0x3aa907){if(!_0x38f216['objects'])_0x38f216['objects']={};if(_0x38f216[_0x9c65('0x9d')][_0x4c2587]){_0x38f216[_0x9c65('0x9d')][_0x4c2587]['push'](_0x3aa907);}else{_0x38f216[_0x9c65('0x9d')][_0x4c2587]=[_0x3aa907];}}return{'makeObject':_0x5243f1,'makeProton':_0x164e5c,'getProtonName':_0x1835da,'showProtons':_0x72ee4c,'createNuclet':_0x2b0c9d,'deleteNuclet':_0x7ac2b8,'createGeometry':_0x39e1b4,'createGeometryWireframe':_0x2ed499,'createGeometryFaces':_0x2f73f3,'highlight':_0x3240cf,'protonRadius':_0x1b421c};};}(jQuery));