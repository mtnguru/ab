var _0x2bf3=['objectStartRotation','copy','changeControlsSettings','preventDefault','mode','which','dir_atom','mouseUp','atomsMove','mouseDown','hovered:\x20','intersects','mouseMove','atomizer','base','doAjax','/ajax/loadMolecule','command','loadMoleculeCommand','conf','title','properties','information','html','labels','display','setItem','atomizer_scene_nid','nid','moleculeLoaded','type','rotation','toRadians','Object3D','objectShell','set','objectLoaded','mouse','canvas','getContext','atomC','spritesC','labelsC','animation','snapshot','dir_atomC','atom_select','atom_selectC','dir_moleculeC','#select-molecule-wrapper\x20.select-item-wrapper\x20a','click','target','closest','data','getItem','#blocks--mouse-mode','addClass','az-hidden','find','val','#edit-mouse--wrapper\x20input','mode:\x20','value','removeClass','selected','protonColor','original','.proton-color','each','attr','split','theme','getColor','--color','css','background-color','hex','input','checked','explode','visibleProtons','intersect','concat','visibleNElectrons','prod_sceneC','.scene--name,\x20.az-scene-name,\x20.az-canvas-labels','context','.scene--properties','objects','controls','mouseMode','electronsAdd','scene','remove','name','deleteObject','log','toLowerCase','replace','add','parent','now','down','position','objectStartPosition','object','shiftKey','dir_molecule','mouse:\x20','render','keys','length','none','visibleParticles','protonsAdd','optionalProtons','protonsColor','inner-faces','hoverInnerFaces','outer-faces','changeControlsMode','prod_scene::setControlsObject','nuclet','atom'];(function(_0xe2e8cc,_0x42628e){var _0x19f788=function(_0xc221fe){while(--_0xc221fe){_0xe2e8cc['push'](_0xe2e8cc['shift']());}};_0x19f788(++_0x42628e);}(_0x2bf3,0xd0));var _0x450c=function(_0x17d4d8,_0x3a09e6){_0x17d4d8=_0x17d4d8-0x0;var _0x263c5a=_0x2bf3[_0x17d4d8];return _0x263c5a;};(function(_0x347cdf){Drupal['atomizer'][_0x450c('0x0')]=function(_0x21b933){let _0x2f02a7=_0x21b933;let _0x5dff26;let _0x372d83;var _0x4e6de1=_0x347cdf(_0x450c('0x1'),_0x2f02a7[_0x450c('0x2')]);var _0x4a73a2=_0x347cdf('.scene--information',_0x2f02a7[_0x450c('0x2')]);var _0x582d17=_0x347cdf(_0x450c('0x3'),_0x2f02a7[_0x450c('0x2')]);_0x2f02a7[_0x450c('0x4')]={};let _0x1144c5={};let _0x413e14=![];var _0x47c378=_0x347cdf('#edit-proton-colors--wrapper',_0x2f02a7[_0x450c('0x2')]);_0x2f02a7[_0x450c('0x5')][_0x450c('0x6')](_0x450c('0x7'));const _0x20b4e6=_0x5bc0cb=>{let _0xc24a38=_0x2f02a7[_0x450c('0x4')][_0x5bc0cb];if(_0xc24a38){_0x2f02a7[_0x450c('0x8')][_0x450c('0x9')](_0xc24a38);_0x2f02a7[_0xc24a38[_0x450c('0xa')]][_0x450c('0xb')](_0xc24a38);delete _0x2f02a7['objects'][_0xc24a38['az']['id']];}else{console[_0x450c('0xc')]('Could\x20not\x20delete\x20object\x20-\x20not\x20found:\x20'+_0x5bc0cb);}};const _0x46d599=_0x2f1b8c=>{let _0x2ea5d8=0x0;let _0x179559;do{_0x179559=_0x2f1b8c[_0x450c('0xd')]()[_0x450c('0xe')]('\x20','-')+'-'+ ++_0x2ea5d8;}while(_0x2f02a7[_0x450c('0x4')][_0x179559]);return _0x179559;};const _0x502006=_0x2a1fdb=>{_0x2f02a7[_0x450c('0x4')][_0x2a1fdb['az']['id']]=_0x2a1fdb;_0x2f02a7['scene'][_0x450c('0xf')](_0x2a1fdb[_0x450c('0x10')]);};const _0x579674=_0xd84cad=>_0x2f02a7['objects'][_0xd84cad];const _0x5289d6=(_0x59a717,_0x159dfc)=>{let _0x4dbf02=0x2bc*(_0x159dfc[_0x450c('0x11')]['x']-_0x159dfc[_0x450c('0x12')]['x']);let _0x4dda18=0x2bc*(_0x159dfc[_0x450c('0x11')]['y']-_0x159dfc[_0x450c('0x12')]['y']);if(_0x59a717['ctrlKey']){_0x159dfc['object'][_0x450c('0x10')][_0x450c('0x13')]['z']=_0x159dfc[_0x450c('0x14')]['z']-_0x4dbf02;_0x159dfc[_0x450c('0x15')]['parent'][_0x450c('0x13')]['y']=_0x159dfc[_0x450c('0x14')]['y']+_0x4dda18;}else if(_0x59a717[_0x450c('0x16')]){_0x159dfc['object'][_0x450c('0x10')][_0x450c('0x13')]['x']=_0x159dfc[_0x450c('0x14')]['x']-_0x4dbf02;_0x159dfc[_0x450c('0x15')]['parent'][_0x450c('0x13')]['z']=_0x159dfc[_0x450c('0x14')]['z']+_0x4dda18;}else{_0x159dfc['object']['parent']['position']['x']=_0x159dfc[_0x450c('0x14')]['x']-_0x4dbf02;_0x159dfc[_0x450c('0x15')][_0x450c('0x10')][_0x450c('0x13')]['y']=_0x159dfc['objectStartPosition']['y']+_0x4dda18;}_0x2f02a7[_0x450c('0x17')]['setPositionSliders'](_0x159dfc[_0x450c('0x15')]);console[_0x450c('0xc')](_0x450c('0x18')+_0x159dfc[_0x450c('0x11')]['x']+'\x20'+_0x159dfc[_0x450c('0x11')]['y']);_0x2f02a7[_0x450c('0x19')]();};const _0x381cbb=()=>{var _0x5a5cc8=Object[_0x450c('0x1a')](_0x2f02a7['objects']);if(_0x5a5cc8[_0x450c('0x1b')]){for(let _0x134624 in _0x2f02a7['objects']){if(_0x2f02a7[_0x450c('0x4')]['hasOwnProperty'](_0x134624)){_0x20b4e6(_0x134624);}}}};var _0x23d0b8=function _0x23d0b8(_0x51e8c1){switch(_0x51e8c1['mode']){case _0x450c('0x1c'):return null;case'atomsMove':return _0x1144c5[_0x450c('0x1d')];case'electronsAdd':return _0x1144c5[_0x450c('0x1d')];case _0x450c('0x1e'):return _0x1144c5[_0x450c('0x1f')];case _0x450c('0x20'):return _0x1144c5['visibleProtons'];case _0x450c('0x21'):return _0x1144c5[_0x450c('0x22')];case _0x450c('0x23'):return _0x1144c5['hoverOuterFaces'];}};const _0x5da4f0=(_0x558c66,_0x527c54)=>{if(_0x527c54){_0x2f02a7[_0x450c('0x5')][_0x450c('0x24')](_0x450c('0x25'),'none');}else{_0x2f02a7[_0x450c('0x5')][_0x450c('0x24')](_0x450c('0x25'),_0x450c('0x8'));}};const _0x567c05=_0x2aab3c=>{if(!_0x2aab3c['length'])return null;if(_0x2aab3c[0x0][_0x450c('0x15')]['az'])return _0x2aab3c[0x0][_0x450c('0x15')]['az'][_0x450c('0x26')]['atom'];return _0x2aab3c[0x0][_0x450c('0x15')][_0x450c('0x10')]['parent'][_0x450c('0x10')]['az'][_0x450c('0x27')];};const _0x39af55=(_0x3b9e3e,_0x295074)=>{if(_0x295074){_0x3b9e3e[_0x450c('0x15')]=_0x295074;_0x3b9e3e[_0x450c('0x14')]['copy'](_0x295074['parent'][_0x450c('0x13')]);_0x3b9e3e[_0x450c('0x28')][_0x450c('0x29')](_0x295074['rotation']);_0x2f02a7[_0x450c('0x5')][_0x450c('0x2a')]({'enablePan':![]});}else{_0x3b9e3e['object']=null;_0x2f02a7['controls']['changeControlsSettings']({'enablePan':!![]});}};const _0x1f665d=(_0x41e363,_0x1533b4)=>{_0x41e363[_0x450c('0x2b')]();_0x413e14=![];if(_0x1533b4[_0x450c('0x2c')]=='atomsMove'){switch(_0x41e363[_0x450c('0x2d')]){case 0x1:break;case 0x2:break;case 0x3:_0x1533b4[_0x450c('0x15')]=null;break;}}else{_0x2f02a7[_0x450c('0x2e')][_0x450c('0x2f')](_0x41e363,_0x1533b4);}};const _0x280613=(_0x2e1e9d,_0x2be1de)=>{_0x2e1e9d[_0x450c('0x2b')]();_0x413e14=!![];switch(_0x2be1de[_0x450c('0x2c')]){case'none':return null;case _0x450c('0x30'):let _0x588900=_0x567c05(_0x2f02a7['controls']['findIntersects'](_0x1144c5[_0x450c('0x1d')]));switch(_0x2e1e9d[_0x450c('0x2d')]){case 0x1:break;case 0x2:_0x2f02a7[_0x450c('0x17')]['setEditAtom'](_0x588900);break;case 0x3:_0x39af55(_0x2be1de,_0x588900);break;}break;case'electronsAdd':case _0x450c('0x1e'):case _0x450c('0x20'):case _0x450c('0x21'):case _0x450c('0x23'):_0x2f02a7[_0x450c('0x2e')][_0x450c('0x31')](_0x2e1e9d,_0x2be1de);break;}_0x2f02a7[_0x450c('0x19')]();};let _0x595caa=(_0x44d2cc,_0x16caf5)=>{if(_0x16caf5[_0x450c('0x15')]){_0x44d2cc[_0x450c('0x2b')]();_0x5289d6(_0x44d2cc,_0x16caf5);}else{if(_0x16caf5['intersects']){console[_0x450c('0xc')](_0x450c('0x32')+_0x16caf5[_0x450c('0x33')][_0x450c('0x1b')]);}switch(_0x16caf5[_0x450c('0x2c')]){case'none':return null;case _0x450c('0x30'):if(!_0x413e14){}_0x2f02a7[_0x450c('0x2e')]['mouseMove'](_0x44d2cc,_0x16caf5);break;case _0x450c('0x7'):case _0x450c('0x1e'):case _0x450c('0x20'):case _0x450c('0x21'):case _0x450c('0x23'):_0x2f02a7[_0x450c('0x2e')][_0x450c('0x34')](_0x44d2cc,_0x16caf5);break;}}};const _0x404747=function(_0x53b4b3){Drupal[_0x450c('0x35')][_0x450c('0x36')][_0x450c('0x37')](_0x450c('0x38'),{'conf':_0x53b4b3},_0x379eb0);};const _0x379eb0=function(_0x4860a8){for(var _0xed4a48=0x0;_0xed4a48<_0x4860a8[_0x450c('0x1b')];_0xed4a48++){if(_0x4860a8[_0xed4a48][_0x450c('0x39')]==_0x450c('0x3a')){_0x381cbb();_0x38f0cc();_0x2f02a7['render']();_0x2f02a7['objects']={};let _0x4cd3d4=_0x4860a8[_0xed4a48]['data'];_0x2f02a7[_0x450c('0x8')]['az']={'conf':_0x4cd3d4[_0x450c('0x3b')],'title':_0x4cd3d4[_0x450c('0x3c')],'name':_0x4cd3d4[_0x450c('0xa')],'sceneNid':_0x4cd3d4['nid'],'properties':_0x4cd3d4[_0x450c('0x3d')],'information':_0x4cd3d4[_0x450c('0x3e')],'link':_0x4cd3d4['link']};if(_0x4e6de1){_0x4e6de1[_0x450c('0x3f')](_0x4cd3d4[_0x450c('0x3c')]);}if(_0x4a73a2&&_0x4cd3d4[_0x450c('0x3e')]){_0x4a73a2[_0x450c('0x3f')](_0x4cd3d4[_0x450c('0x3e')]);}if(_0x582d17&&_0x4cd3d4[_0x450c('0x3d')]){_0x582d17[_0x450c('0x3f')](_0x4cd3d4[_0x450c('0x3d')]);}_0x2f02a7[_0x450c('0x40')][_0x450c('0x41')]();localStorage[_0x450c('0x42')](_0x450c('0x43'),_0x4cd3d4[_0x450c('0x3b')][_0x450c('0x44')]);_0x2f02a7[_0x450c('0x17')][_0x450c('0x45')](_0x2f02a7[_0x450c('0x8')]);objects={};for(let _0x4db18d in _0x4cd3d4['conf'][_0x450c('0x4')]){let _0xec74c3=_0x4cd3d4[_0x450c('0x3b')]['objects'][_0x4db18d];_0xec74c3['id']=_0x4db18d;_0x2f02a7[_0xec74c3[_0x450c('0x46')]]['loadObject'](_0xec74c3);}}}};var _0x2cf8e5=function(_0x401be0){_0x401be0['az']['id']=_0x401be0['az']['conf']['id'];if(_0x401be0['az'][_0x450c('0x3b')][_0x450c('0x47')]){_0x401be0[_0x450c('0x47')]['x']=parseInt(Drupal['atomizer'][_0x450c('0x36')][_0x450c('0x48')](_0x401be0['az']['conf'][_0x450c('0x47')][0x0]));_0x401be0[_0x450c('0x47')]['y']=parseInt(Drupal['atomizer'][_0x450c('0x36')][_0x450c('0x48')](_0x401be0['az'][_0x450c('0x3b')]['rotation'][0x1]));_0x401be0[_0x450c('0x47')]['z']=parseInt(Drupal[_0x450c('0x35')][_0x450c('0x36')][_0x450c('0x48')](_0x401be0['az']['conf'][_0x450c('0x47')][0x2]));}let _0xc612c3=new THREE[(_0x450c('0x49'))]();_0xc612c3[_0x450c('0xa')]=_0x450c('0x4a');if(_0x401be0['az'][_0x450c('0x3b')][_0x450c('0x13')]){_0xc612c3[_0x450c('0x13')][_0x450c('0x4b')](..._0x401be0['az'][_0x450c('0x3b')][_0x450c('0x13')]);}_0xc612c3[_0x450c('0xf')](_0x401be0);_0x502006(_0x401be0);_0x2f02a7['dir_molecule'][_0x450c('0x4c')](_0x401be0);_0x2f02a7[_0x450c('0x2e')]['objectLoaded'](_0x401be0);if(_0x401be0['az'][_0x450c('0x3b')]['needsPosition']){_0x39af55(_0x2f02a7[_0x450c('0x5')][_0x450c('0x4d')],_0x401be0);}_0x2f02a7[_0x450c('0x19')]();};let _0xb80ef5=function(){let _0x51a985=_0x2f02a7[_0x450c('0x4e')][_0x450c('0x4f')]('2d');_0x2f02a7['nuclet']=Drupal['atomizer']['nucletC'](_0x2f02a7);_0x2f02a7[_0x450c('0x27')]=Drupal[_0x450c('0x35')][_0x450c('0x50')](_0x2f02a7);_0x2f02a7['shapes']=Drupal[_0x450c('0x35')]['shapesC'](_0x2f02a7);_0x2f02a7['sprites']=Drupal['atomizer'][_0x450c('0x51')](_0x2f02a7);_0x2f02a7[_0x450c('0x40')]=Drupal[_0x450c('0x35')][_0x450c('0x52')](_0x2f02a7);_0x2f02a7[_0x450c('0x53')]=Drupal[_0x450c('0x35')]['animationC'](_0x2f02a7);_0x2f02a7[_0x450c('0x54')]=Drupal[_0x450c('0x35')]['snapshotC'](_0x2f02a7);_0x2f02a7[_0x450c('0x2e')]=Drupal['atomizer'][_0x450c('0x55')](_0x2f02a7);_0x2f02a7[_0x450c('0x56')]=Drupal['atomizer'][_0x450c('0x57')](_0x2f02a7,![]);_0x2f02a7['dir_molecule']=Drupal[_0x450c('0x35')][_0x450c('0x58')](_0x2f02a7);let _0x36f761=_0x347cdf(_0x450c('0x59'));_0x347cdf('#select-molecule-wrapper\x20.select-item-wrapper\x20a')[_0x450c('0x5a')](_0x122f68=>{let _0x6eceb2=_0x347cdf(_0x122f68[_0x450c('0x5b')])[_0x450c('0x5c')]('a');let _0x2de99a=_0x6eceb2[_0x450c('0x5d')](_0x450c('0x44'));_0x404747({'nid':_0x2de99a});});_0x372d83=localStorage[_0x450c('0x5e')]('atomizer_scene_nid');_0x372d83=!_0x372d83||_0x372d83=='undefined'?0x523:_0x372d83;_0x404747({'nid':_0x372d83});};const _0x36dfe4=()=>{var _0x563e5e=_0x347cdf(_0x450c('0x5f'),_0x2f02a7[_0x450c('0x2')]);_0x47c378[_0x450c('0x60')](_0x450c('0x61'));if(_0x563e5e[_0x450c('0x1b')]){_0x2f02a7[_0x450c('0x5')][_0x450c('0x4d')][_0x450c('0x2c')]=_0x563e5e[_0x450c('0x62')]('input[name=mouse]:checked')[_0x450c('0x63')]();var _0xc23a52=_0x563e5e[_0x450c('0x62')](_0x450c('0x64'));_0xc23a52[_0x450c('0x5a')](function(_0x311b3d){console[_0x450c('0xc')](_0x450c('0x65')+_0x311b3d[_0x450c('0x5b')]['value']);mouse[_0x450c('0x2c')]=_0x311b3d[_0x450c('0x5b')][_0x450c('0x66')];if(mouse[_0x450c('0x2c')]==_0x450c('0x20')){_0x47c378[_0x450c('0x67')](_0x450c('0x61'));}else{_0x47c378['addClass'](_0x450c('0x61'));}});_0x563e5e[_0x450c('0x62')]('#proton-original-color')[_0x450c('0x60')](_0x450c('0x68'));_0x2f02a7['controls'][_0x450c('0x4d')][_0x450c('0x69')]=_0x450c('0x6a');var _0xe56245=_0x563e5e[_0x450c('0x62')](_0x450c('0x6b'));_0xe56245[_0x450c('0x6c')](function(){var _0x2ac262=_0x347cdf(this)[_0x450c('0x6d')]('id')[_0x450c('0x6e')]('-')[0x1];if(_0x2ac262!='original'){var _0x296669=_0x2f02a7[_0x450c('0x6f')][_0x450c('0x70')]('proton-'+_0x2ac262+_0x450c('0x71'),'lighten');_0x347cdf(this)[_0x450c('0x72')](_0x450c('0x73'),_0x296669[_0x450c('0x74')]);}});_0xe56245[_0x450c('0x5a')](function(_0x177108){_0xe56245[_0x450c('0x67')]('selected');_0x347cdf(this)['addClass']('selected');var _0x52c830=_0x347cdf(this)[_0x450c('0x10')]()['parent']()['find'](_0x450c('0x75'));_0x52c830['prop'](_0x450c('0x76'),!![]);_0x2f02a7[_0x450c('0x5')][_0x450c('0x4d')]['protonColor']=_0x52c830[_0x450c('0x63')]();});}};const _0x437e96=_0x5273fa=>{_0x2f02a7['dir_atom'][_0x450c('0x77')](atom,_0x5273fa);};const _0x38f0cc=()=>{_0x1144c5={'visibleParticles':[],'visibleProtons':[],'visibleNElectrons':[],'hoverInnerFaces':[],'hoverOuterFaces':[],'optionalProtons':[]};};const _0x30898a=()=>{let _0x2f761c=_0x2f02a7[_0x450c('0x4')][_0x450c('0x1b')];for(let _0x3cc8db in _0x2f02a7['objects']){let _0x471a37=_0x2f02a7['objects'][_0x3cc8db];if(_0x471a37['az'][_0x450c('0x3b')][_0x450c('0x46')]==_0x450c('0x27')){_0x1144c5[_0x450c('0x1d')]=_0x1144c5['visibleParticles']['concat'](_0x471a37['az']['intersect'][_0x450c('0x1d')]);_0x1144c5[_0x450c('0x78')]=_0x1144c5[_0x450c('0x78')]['concat'](_0x471a37['az'][_0x450c('0x79')][_0x450c('0x78')]);_0x1144c5['visibleNElectrons']=_0x1144c5['visibleNElectrons'][_0x450c('0x7a')](_0x471a37['az'][_0x450c('0x79')][_0x450c('0x7b')]);_0x1144c5[_0x450c('0x1f')]=_0x1144c5['optionalProtons'][_0x450c('0x7a')](_0x471a37['az']['intersect'][_0x450c('0x1f')]);}}};_0x36dfe4();return{'createView':_0xb80ef5,'objectLoaded':_0x2cf8e5,'createUniqueObjectKey':_0x46d599,'getObject':_0x579674,'addObject':_0x502006,'deleteObject':_0x20b4e6,'clearScene':_0x381cbb,'grabObject':_0x39af55,'explode':_0x437e96,'updateIntersectLists':_0x30898a,'mouseUp':_0x1f665d,'mouseDown':_0x280613,'mouseMove':_0x595caa,'intersect':_0x1144c5,'hoverObjects':_0x23d0b8};};}(jQuery));