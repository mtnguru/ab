var _0x4cb3=['properties','labels','display','setItem','atomizer_scene_nid','moleculeLoaded','loadObject','toRadians','Object3D','objectShell','set','objectLoaded','needsPosition','canvas','getContext','nuclet','atomC','shapes','shapesC','sprites','labelsC','animation','animationC','snapshot','snapshotC','dir_atomC','atom_select','dir_moleculeC','#select-molecule-wrapper\x20.select-item-wrapper\x20a','click','target','undefined','addClass','mouse','find','input[name=mouse]:checked','val','#edit-mouse--wrapper\x20input','mode:\x20','value','removeClass','az-hidden','#proton-original-color','protonColor','original','.proton-color','each','getColor','proton-','--color','lighten','css','background-color','hex','selected','prop','checked','explode','type','concat','intersect','visibleElectrons','electronOrbitals','atomizer','prod_sceneC','.scene--name,\x20.az-scene-name,\x20.az-canvas-labels','context','objects','#edit-proton-colors--wrapper','mouseMode','electronsAdd','remove','deleteObject','log','Could\x20not\x20delete\x20object\x20-\x20not\x20found:\x20','toLowerCase','replace','scene','add','parent','now','down','ctrlKey','object','objectStartPosition','position','shiftKey','dir_molecule','mouse:\x20','render','keys','hasOwnProperty','mode','none','atomsMove','visibleProtonsElectrons','protonsAdd','optionalProtons','protonsColor','visibleProtons','hoverInnerFaces','outer-faces','hoverOuterFaces','prod_scene::setControlsObject','controls','length','atom','copy','objectStartRotation','rotation','changeControlsSettings','which','mouseUp','preventDefault','findIntersects','inner-faces','dir_atom','mouseDown','intersects','mouseMove','base','doAjax','/ajax/loadMolecule','command','data','conf','title','name','nid','information','link','html'];(function(_0x175663,_0x3df60b){var _0x28ddad=function(_0x1d61fb){while(--_0x1d61fb){_0x175663['push'](_0x175663['shift']());}};_0x28ddad(++_0x3df60b);}(_0x4cb3,0x1cb));var _0x478a=function(_0x1a1876,_0x2fcecc){_0x1a1876=_0x1a1876-0x0;var _0x21ad34=_0x4cb3[_0x1a1876];return _0x21ad34;};(function(_0x324fcb){Drupal[_0x478a('0x0')][_0x478a('0x1')]=function(_0x2525fa){let _0x45192a=_0x2525fa;let _0x3818bd;let _0x5b71b8;var _0x40af13=_0x324fcb(_0x478a('0x2'),_0x45192a['context']);var _0x552f20=_0x324fcb('.scene--information',_0x45192a[_0x478a('0x3')]);var _0x443cd4=_0x324fcb('.scene--properties',_0x45192a[_0x478a('0x3')]);_0x45192a[_0x478a('0x4')]={};let _0x47950e={};let _0x547f18=![];var _0x565267=_0x324fcb(_0x478a('0x5'),_0x45192a[_0x478a('0x3')]);_0x45192a['controls'][_0x478a('0x6')](_0x478a('0x7'));const _0x1be717=_0x37b48a=>{let _0x55a401=_0x45192a['objects'][_0x37b48a];if(_0x55a401){_0x45192a['scene'][_0x478a('0x8')](_0x55a401);_0x45192a[_0x55a401['name']][_0x478a('0x9')](_0x55a401);delete _0x45192a[_0x478a('0x4')][_0x55a401['az']['id']];}else{console[_0x478a('0xa')](_0x478a('0xb')+_0x37b48a);}};const _0x320807=_0x1d8400=>{let _0x3789aa=0x0;let _0x402fbf;do{_0x402fbf=_0x1d8400[_0x478a('0xc')]()[_0x478a('0xd')]('\x20','-')+'-'+ ++_0x3789aa;}while(_0x45192a[_0x478a('0x4')][_0x402fbf]);return _0x402fbf;};const _0x46ff65=_0x56e301=>{_0x45192a[_0x478a('0x4')][_0x56e301['az']['id']]=_0x56e301;_0x45192a[_0x478a('0xe')][_0x478a('0xf')](_0x56e301[_0x478a('0x10')]);};const _0x13af34=_0xf5bf2d=>_0x45192a[_0x478a('0x4')][_0xf5bf2d];const _0x1c816f=(_0x248226,_0x503dbb)=>{let _0x4989ce=0x2bc*(_0x503dbb[_0x478a('0x11')]['x']-_0x503dbb[_0x478a('0x12')]['x']);let _0x59501a=0x2bc*(_0x503dbb['now']['y']-_0x503dbb[_0x478a('0x12')]['y']);if(_0x248226[_0x478a('0x13')]){_0x503dbb[_0x478a('0x14')]['parent']['position']['z']=_0x503dbb[_0x478a('0x15')]['z']-_0x4989ce;_0x503dbb[_0x478a('0x14')][_0x478a('0x10')][_0x478a('0x16')]['y']=_0x503dbb[_0x478a('0x15')]['y']+_0x59501a;}else if(_0x248226[_0x478a('0x17')]){_0x503dbb['object'][_0x478a('0x10')][_0x478a('0x16')]['x']=_0x503dbb[_0x478a('0x15')]['x']-_0x4989ce;_0x503dbb[_0x478a('0x14')][_0x478a('0x10')][_0x478a('0x16')]['z']=_0x503dbb['objectStartPosition']['z']+_0x59501a;}else{_0x503dbb[_0x478a('0x14')][_0x478a('0x10')]['position']['x']=_0x503dbb['objectStartPosition']['x']-_0x4989ce;_0x503dbb[_0x478a('0x14')][_0x478a('0x10')]['position']['y']=_0x503dbb[_0x478a('0x15')]['y']+_0x59501a;}_0x45192a[_0x478a('0x18')]['setPositionSliders'](_0x503dbb['object']);console[_0x478a('0xa')](_0x478a('0x19')+_0x503dbb[_0x478a('0x11')]['x']+'\x20'+_0x503dbb[_0x478a('0x11')]['y']);_0x45192a[_0x478a('0x1a')]();};const _0x318b3d=()=>{var _0x89342f=Object[_0x478a('0x1b')](_0x45192a[_0x478a('0x4')]);if(_0x89342f['length']){for(let _0x5bcfd4 in _0x45192a[_0x478a('0x4')]){if(_0x45192a['objects'][_0x478a('0x1c')](_0x5bcfd4)){_0x1be717(_0x5bcfd4);}}}};var _0x31231d=function _0x31231d(_0x3263bd){switch(_0x3263bd[_0x478a('0x1d')]){case _0x478a('0x1e'):return null;case _0x478a('0x1f'):return _0x47950e[_0x478a('0x20')];case _0x478a('0x7'):return _0x47950e[_0x478a('0x20')];case _0x478a('0x21'):return _0x47950e[_0x478a('0x22')];case _0x478a('0x23'):return _0x47950e[_0x478a('0x24')];case'inner-faces':return _0x47950e[_0x478a('0x25')];case _0x478a('0x26'):return _0x47950e[_0x478a('0x27')];}};const _0x423a96=(_0x454a4b,_0x52553c)=>{if(_0x52553c){_0x45192a['controls']['changeControlsMode'](_0x478a('0x28'),_0x478a('0x1e'));}else{_0x45192a[_0x478a('0x29')]['changeControlsMode'](_0x478a('0x28'),_0x478a('0xe'));}};const _0x4c6f8d=_0x42b0b5=>{if(!_0x42b0b5[_0x478a('0x2a')])return null;if(_0x42b0b5[0x0][_0x478a('0x14')]['az'])return _0x42b0b5[0x0][_0x478a('0x14')]['az']['nuclet'][_0x478a('0x2b')];return _0x42b0b5[0x0][_0x478a('0x14')][_0x478a('0x10')][_0x478a('0x10')][_0x478a('0x10')]['az'][_0x478a('0x2b')];};const _0x480392=(_0x2d8931,_0x2a7b3e)=>{if(_0x2a7b3e){_0x2d8931['object']=_0x2a7b3e;_0x2d8931[_0x478a('0x15')][_0x478a('0x2c')](_0x2a7b3e['parent'][_0x478a('0x16')]);_0x2d8931[_0x478a('0x2d')]['copy'](_0x2a7b3e[_0x478a('0x2e')]);_0x45192a[_0x478a('0x29')][_0x478a('0x2f')]({'enablePan':![]});}else{_0x2d8931[_0x478a('0x14')]=null;_0x45192a[_0x478a('0x29')][_0x478a('0x2f')]({'enablePan':!![]});}};const _0x563d4=(_0x5c6d0d,_0x5be455)=>{_0x5c6d0d['preventDefault']();_0x547f18=![];if(_0x5be455[_0x478a('0x1d')]=='atomsMove'){switch(_0x5c6d0d[_0x478a('0x30')]){case 0x1:break;case 0x2:break;case 0x3:_0x5be455['object']=null;break;}}else{_0x45192a['dir_atom'][_0x478a('0x31')](_0x5c6d0d,_0x5be455);}};const _0x2dc876=(_0x4f81a9,_0x10467b)=>{_0x4f81a9[_0x478a('0x32')]();_0x547f18=!![];switch(_0x10467b[_0x478a('0x1d')]){case _0x478a('0x1e'):return null;case _0x478a('0x1f'):let _0x56351e=_0x4c6f8d(_0x45192a[_0x478a('0x29')][_0x478a('0x33')](_0x47950e[_0x478a('0x20')]));switch(_0x4f81a9[_0x478a('0x30')]){case 0x1:break;case 0x2:_0x45192a['dir_molecule']['setEditAtom'](_0x56351e);break;case 0x3:_0x480392(_0x10467b,_0x56351e);break;}break;case _0x478a('0x7'):case _0x478a('0x21'):case _0x478a('0x23'):case _0x478a('0x34'):case _0x478a('0x26'):_0x45192a[_0x478a('0x35')][_0x478a('0x36')](_0x4f81a9,_0x10467b);break;}_0x45192a[_0x478a('0x1a')]();};let _0x1c71ec=(_0xf8ab1c,_0x3a1972)=>{if(_0x3a1972[_0x478a('0x14')]){_0xf8ab1c[_0x478a('0x32')]();_0x1c816f(_0xf8ab1c,_0x3a1972);}else{if(_0x3a1972[_0x478a('0x37')]){console[_0x478a('0xa')]('hovered:\x20'+_0x3a1972['intersects']['length']);}switch(_0x3a1972[_0x478a('0x1d')]){case _0x478a('0x1e'):return null;case'atomsMove':if(!_0x547f18){}_0x45192a[_0x478a('0x35')][_0x478a('0x38')](_0xf8ab1c,_0x3a1972);break;case _0x478a('0x7'):case _0x478a('0x21'):case _0x478a('0x23'):case _0x478a('0x34'):case _0x478a('0x26'):_0x45192a[_0x478a('0x35')]['mouseMove'](_0xf8ab1c,_0x3a1972);break;}}};const _0x32a8cd=function(_0xdd217d){Drupal[_0x478a('0x0')][_0x478a('0x39')][_0x478a('0x3a')](_0x478a('0x3b'),{'conf':_0xdd217d},_0x523662);};const _0x523662=function(_0x2e36ce){for(var _0x54a90c=0x0;_0x54a90c<_0x2e36ce[_0x478a('0x2a')];_0x54a90c++){if(_0x2e36ce[_0x54a90c][_0x478a('0x3c')]=='loadMoleculeCommand'){_0x318b3d();_0x360595();_0x45192a['render']();_0x45192a['objects']={};let _0xe8017=_0x2e36ce[_0x54a90c][_0x478a('0x3d')];_0x45192a['scene']['az']={'conf':_0xe8017[_0x478a('0x3e')],'title':_0xe8017[_0x478a('0x3f')],'name':_0xe8017[_0x478a('0x40')],'sceneNid':_0xe8017[_0x478a('0x41')],'properties':_0xe8017['properties'],'information':_0xe8017[_0x478a('0x42')],'link':_0xe8017[_0x478a('0x43')]};if(_0x40af13){_0x40af13['html'](_0xe8017['title']);}if(_0x552f20&&_0xe8017['information']){_0x552f20[_0x478a('0x44')](_0xe8017[_0x478a('0x42')]);}if(_0x443cd4&&_0xe8017[_0x478a('0x45')]){_0x443cd4['html'](_0xe8017[_0x478a('0x45')]);}_0x45192a[_0x478a('0x46')][_0x478a('0x47')]();localStorage[_0x478a('0x48')](_0x478a('0x49'),_0xe8017['conf'][_0x478a('0x41')]);_0x45192a[_0x478a('0x18')][_0x478a('0x4a')](_0x45192a[_0x478a('0xe')]);objects={};for(let _0x2d63fb in _0xe8017[_0x478a('0x3e')][_0x478a('0x4')]){let _0x563723=_0xe8017[_0x478a('0x3e')][_0x478a('0x4')][_0x2d63fb];_0x563723['id']=_0x2d63fb;_0x45192a[_0x563723['type']][_0x478a('0x4b')](_0x563723);}}}};var _0x1102be=function(_0x2b0a96){_0x2b0a96['az']['id']=_0x2b0a96['az'][_0x478a('0x3e')]['id'];if(_0x2b0a96['az']['conf'][_0x478a('0x2e')]){_0x2b0a96['rotation']['x']=parseInt(Drupal['atomizer'][_0x478a('0x39')][_0x478a('0x4c')](_0x2b0a96['az']['conf']['rotation'][0x0]));_0x2b0a96[_0x478a('0x2e')]['y']=parseInt(Drupal[_0x478a('0x0')][_0x478a('0x39')][_0x478a('0x4c')](_0x2b0a96['az'][_0x478a('0x3e')][_0x478a('0x2e')][0x1]));_0x2b0a96[_0x478a('0x2e')]['z']=parseInt(Drupal[_0x478a('0x0')][_0x478a('0x39')][_0x478a('0x4c')](_0x2b0a96['az'][_0x478a('0x3e')][_0x478a('0x2e')][0x2]));}let _0x35cfa7=new THREE[(_0x478a('0x4d'))]();_0x35cfa7[_0x478a('0x40')]=_0x478a('0x4e');if(_0x2b0a96['az']['conf'][_0x478a('0x16')]){_0x35cfa7[_0x478a('0x16')][_0x478a('0x4f')](..._0x2b0a96['az']['conf'][_0x478a('0x16')]);}_0x35cfa7['add'](_0x2b0a96);_0x46ff65(_0x2b0a96);_0x45192a[_0x478a('0x18')][_0x478a('0x50')](_0x2b0a96);_0x45192a[_0x478a('0x35')][_0x478a('0x50')](_0x2b0a96);if(_0x2b0a96['az'][_0x478a('0x3e')][_0x478a('0x51')]){_0x480392(_0x45192a[_0x478a('0x29')]['mouse'],_0x2b0a96);}_0x45192a[_0x478a('0x1a')]();};let _0x2b67a5=function(){let _0x2ae4ba=_0x45192a[_0x478a('0x52')][_0x478a('0x53')]('2d');_0x45192a[_0x478a('0x54')]=Drupal[_0x478a('0x0')]['nucletC'](_0x45192a);_0x45192a['atom']=Drupal[_0x478a('0x0')][_0x478a('0x55')](_0x45192a);_0x45192a[_0x478a('0x56')]=Drupal[_0x478a('0x0')][_0x478a('0x57')](_0x45192a);_0x45192a[_0x478a('0x58')]=Drupal[_0x478a('0x0')]['spritesC'](_0x45192a);_0x45192a[_0x478a('0x46')]=Drupal['atomizer'][_0x478a('0x59')](_0x45192a);_0x45192a[_0x478a('0x5a')]=Drupal[_0x478a('0x0')][_0x478a('0x5b')](_0x45192a);_0x45192a[_0x478a('0x5c')]=Drupal[_0x478a('0x0')][_0x478a('0x5d')](_0x45192a);_0x45192a[_0x478a('0x35')]=Drupal['atomizer'][_0x478a('0x5e')](_0x45192a);_0x45192a[_0x478a('0x5f')]=Drupal[_0x478a('0x0')]['atom_selectC'](_0x45192a,![]);_0x45192a[_0x478a('0x18')]=Drupal[_0x478a('0x0')][_0x478a('0x60')](_0x45192a);let _0xe30759=_0x324fcb(_0x478a('0x61'));_0x324fcb(_0x478a('0x61'))[_0x478a('0x62')](_0x300b93=>{let _0x817536=_0x324fcb(_0x300b93[_0x478a('0x63')])['closest']('a');let _0x57e82b=_0x817536[_0x478a('0x3d')](_0x478a('0x41'));_0x32a8cd({'nid':_0x57e82b});});_0x5b71b8=localStorage['getItem']('atomizer_scene_nid');_0x5b71b8=!_0x5b71b8||_0x5b71b8==_0x478a('0x64')?0x523:_0x5b71b8;_0x32a8cd({'nid':_0x5b71b8});};const _0x252967=()=>{var _0x1b6253=_0x324fcb('#blocks--mouse-mode',_0x45192a[_0x478a('0x3')]);_0x565267[_0x478a('0x65')]('az-hidden');if(_0x1b6253[_0x478a('0x2a')]){_0x45192a['controls'][_0x478a('0x66')][_0x478a('0x1d')]=_0x1b6253[_0x478a('0x67')](_0x478a('0x68'))[_0x478a('0x69')]();var _0x100afd=_0x1b6253[_0x478a('0x67')](_0x478a('0x6a'));_0x100afd['click'](function(_0x1e4959){console[_0x478a('0xa')](_0x478a('0x6b')+_0x1e4959['target'][_0x478a('0x6c')]);mouse[_0x478a('0x1d')]=_0x1e4959[_0x478a('0x63')][_0x478a('0x6c')];if(mouse['mode']=='protonsColor'){_0x565267[_0x478a('0x6d')](_0x478a('0x6e'));}else{_0x565267[_0x478a('0x65')]('az-hidden');}});_0x1b6253[_0x478a('0x67')](_0x478a('0x6f'))[_0x478a('0x65')]('selected');_0x45192a[_0x478a('0x29')][_0x478a('0x66')][_0x478a('0x70')]=_0x478a('0x71');var _0x166a54=_0x1b6253[_0x478a('0x67')](_0x478a('0x72'));_0x166a54[_0x478a('0x73')](function(){var _0x28ab9d=_0x324fcb(this)['attr']('id')['split']('-')[0x1];if(_0x28ab9d!=_0x478a('0x71')){var _0x218234=_0x45192a['theme'][_0x478a('0x74')](_0x478a('0x75')+_0x28ab9d+_0x478a('0x76'),_0x478a('0x77'));_0x324fcb(this)[_0x478a('0x78')](_0x478a('0x79'),_0x218234[_0x478a('0x7a')]);}});_0x166a54[_0x478a('0x62')](function(_0x58aaa7){_0x166a54[_0x478a('0x6d')]('selected');_0x324fcb(this)[_0x478a('0x65')](_0x478a('0x7b'));var _0x1e4c82=_0x324fcb(this)[_0x478a('0x10')]()['parent']()[_0x478a('0x67')]('input');_0x1e4c82[_0x478a('0x7c')](_0x478a('0x7d'),!![]);_0x45192a[_0x478a('0x29')][_0x478a('0x66')]['protonColor']=_0x1e4c82['val']();});}};const _0x5287cf=_0x24d856=>{_0x45192a[_0x478a('0x35')][_0x478a('0x7e')](atom,_0x24d856);};const _0x360595=()=>{_0x47950e={'visibleProtonsElectrons':[],'visibleProtonsOrbitals':[],'visibleProtons':[],'visibleElectrons':[],'hoverInnerFaces':[],'hoverOuterFaces':[],'optionalProtons':[],'electronOrbitals':[]};};const _0x31aac9=()=>{let _0x31bcf7=_0x45192a[_0x478a('0x4')]['length'];for(let _0x2efc2e in _0x45192a[_0x478a('0x4')]){let _0x44e159=_0x45192a['objects'][_0x2efc2e];if(_0x44e159['az']['conf'][_0x478a('0x7f')]==_0x478a('0x2b')){_0x47950e['visibleProtonsElectrons']=_0x47950e[_0x478a('0x20')][_0x478a('0x80')](_0x44e159['az'][_0x478a('0x81')]['visibleProtonsElectrons']);_0x47950e[_0x478a('0x24')]=_0x47950e['visibleProtons'][_0x478a('0x80')](_0x44e159['az']['intersect'][_0x478a('0x24')]);_0x47950e[_0x478a('0x82')]=_0x47950e['visibleElectrons']['concat'](_0x44e159['az'][_0x478a('0x81')][_0x478a('0x82')]);_0x47950e[_0x478a('0x22')]=_0x47950e[_0x478a('0x22')][_0x478a('0x80')](_0x44e159['az'][_0x478a('0x81')][_0x478a('0x22')]);_0x47950e['hoverOuterFaces']=_0x47950e[_0x478a('0x27')][_0x478a('0x80')](_0x44e159['az'][_0x478a('0x81')][_0x478a('0x27')]);_0x47950e[_0x478a('0x83')]=_0x47950e['electronOrbitals'][_0x478a('0x80')](_0x44e159['az'][_0x478a('0x81')]['electronOrbitals']);}}};_0x252967();return{'createView':_0x2b67a5,'objectLoaded':_0x1102be,'createUniqueObjectKey':_0x320807,'getObject':_0x13af34,'addObject':_0x46ff65,'deleteObject':_0x1be717,'clearScene':_0x318b3d,'grabObject':_0x480392,'explode':_0x5287cf,'updateIntersectLists':_0x31aac9,'mouseUp':_0x563d4,'mouseDown':_0x2dc876,'mouseMove':_0x1c71ec,'intersect':_0x47950e,'hoverObjects':_0x31231d};};}(jQuery));