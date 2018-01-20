!function(e){Drupal.atomizer.producers.atom_builderC=function(t){function a(e){var t=e.target.id.split("-",2)[1],a=m.atom.addNuclet(t);m.atom.setValenceRings(),n(),r(a),m.render()}function n(){k=[],A=[];var e=m.atom.az().nuclets;for(var t in e)if(e.hasOwnProperty(t))for(var a=e[t].az.protons,n=0;n<a.length;n++)a[n]&&(a[n].az.active&&k.push(a[n]),a[n].az.visible&&A.push(a[n]))}function o(e,t){var n=t.getElementsByTagName("LABEL")[0],o=t.getElementsByTagName("DIV")[0];if(n.innerHTML=e,m.atom.az().nuclets[e])o.innerHTML=m.atom.az().nuclets[e].az.state;else{o.innerHTML="";var r=document.createElement("input");r.setAttribute("type","button"),r.setAttribute("name","nuclet-add-"+e+"-button"),r.setAttribute("value","Add"),r.classList.add("nuclet-list-button"),r.id="nuclet-"+e,r.addEventListener("click",a),t.getElementsByTagName("DIV")[0].appendChild(r)}}function r(t){var a=t.az.id;c(m.atom.atom),x.insertAfter(y.find(".nuclet-"+a)),"hydrogen"!=t.az.conf.state&&"helium"!=t.az.conf.state&&(e("#nuclet--state--"+t.az.conf.state).attr("checked",!0),h.value=t.az.conf.attachAngle||1,v.value=t.az.conf.attachAngle||1),"N0"==a?(z.classList.add("az-hidden"),g.classList.add("az-hidden")):(z.classList.remove("az-hidden"),g.classList.remove("az-hidden")),"initial"!=t.az.conf.state&&"final"!=t.az.conf.state?(e("#nuclet--grow-label").addClass("az-hidden"),e("#edit-nuclet-grow-0").addClass("az-hidden"),e("#edit-nuclet-grow-1").addClass("az-hidden")):(e("#nuclet--grow-label").removeClass("hidden"),e("#edit-nuclet-grow-0").removeClass("az-hidden"),e("#edit-nuclet-grow-1").removeClass("az-hidden")),o(a+"0",p),o(a+"1",b),s=t}function c(t){function a(e,n){var o=t.az.nuclets[e],r=0,c=0;for(var s in o.az.protons){var i=o.az.protons[s];i.az&&i.az.visible&&("neutral"==i.az.type?c++:r++)}var l='<div class="nuclet shell-'+n+" "+o.name+'">'+e+" "+o.az.state+" - "+r;c&&(l+=" - "+c),l+="</div>\n";var d=t.az.nuclets[e+"0"],u=t.az.nuclets[e+"1"];return(d||u)&&(d&&(l+=a(e+"0",n+1)),u&&(l+=a(e+"1",n+1))),l}x.insertAfter(e("#blocks--nuclet-list")),y.html(a("N0",0)),$nucletButtons=y.find(".nuclet"),$nucletButtons.click(function(e){var t=e.target.innerHTML.split(" ")[0],a=m.atom.getNuclet(t);x.hasClass("az-hidden")||a!==s?(r(a),x.removeClass("az-hidden")):x.addClass("az-hidden")})}var s,i,l,d,u,m=t,f="none",g=e("#nuclet--attachAngle",m.context)[0],h=e("#nuclet--attachAngle--az-slider",m.context)[0],v=e("#nuclet--attachAngle--az-value",m.context)[0],z=e("#nuclet--delete",m.context)[0],p=e("#edit-nuclet-grow-0",m.context)[0],b=e("#edit-nuclet-grow-1",m.context)[0],y=e("#nuclet--list"),x=e("#blocks--nuclet-form"),j=(e(".az-controls-form",m.context),[]),C=[],k=[],A=[];h.addEventListener("input",function(e){m.atom.changeNucletAngle(s.az.id,e.target.value),m.render()}),z.addEventListener("click",function(e){m.atom.deleteNuclet(s.az.id),delete m.atom.az().nuclets[s.az.id],c(m.atom.atom),n(),m.render(),x.addClass("az-hidden")});var N=e("#edit-nuclet-state .az-control-radios",m.context);return N.click(function(t){"INPUT"==t.target.tagName&&(s=m.atom.changeNucletState(s,t.target.value),n(),m.render(),r(s)),e(this).attr("id",e(this).attr("id")+"--"+e(this).val())}),(N=e("#blocks--mouse-mode .az-control-radios",m.context)).click(function(t){"INPUT"==t.target.tagName&&(console.log("mode: "+t.target.value),f=t.target.value,e(this).attr("id",e(this).id+"--"+e(this).val()),"checked"==e(this).attr("checked")&&(f=e(this).val()))}),{createView:function(){m.nuclet=Drupal.atomizer.nucletC(m),m.atom=Drupal.atomizer.atomC(m);var e=localStorage.getItem("atomizer_builder_atom_nid");m.view.atom=m.atom.loadAtom(e&&"undefined"!=e?e:73),m.view.ghostProton=m.nuclet.makeProton({type:"ghost"},1,{x:300,y:50,z:0},{state:"default"})},setDefaults:function(){if(userAtomFile=localStorage.getItem("atomizer_builder_atom_nid"),userAtomFile&&"undefined"!=userAtomFile){var t=e("#atom--selectyml",m.context)[0];t&&(select=t.querySelector("select"),select.value=userAtomFile)}},mouseClick:function(e){switch(e.which){case 1:case 3:switch(e.preventDefault(),f){case"none":break;case"protons":if((a=m.controls.findIntersects(k)).length){var t=a[0].object;t.az.optional&&(t.az.visible=!t.az.visible,t.material.visible=t.az.visible,m.atom.setValenceRings(),n(),m.render()),m.atom.showStats()}break;case"nuclets":var a=m.controls.findIntersects(A);return 0==a.length?(x.addClass("az-hidden"),s=void 0,!1):(s=a[0].object.parent.parent,x.removeClass("az-hidden"),x.insertAfter(y.find("."+s.name)),r(s),!1);case"inner-faces":var o=m.controls.findIntersects(j);if(o.length){for(var c=o[0].object,i=o[0].face,l=0;l<c.geometry.faces.length;l++)if(c.geometry.faces[l]===i){var d=c.geometry.reactiveState.indexOf(l);d>-1?c.geometry.reactiveState.splice(d,1):c.geometry.reactiveState.push(l);break}m.objects.icosaFaces=null;var u=m.nuclet.createGeometryFaces(c.name,1,c.geometry,c.geometry.compConf.rotation||null,c.geometry.reactiveState),g=c.parent;m.objects[c.name]=[],m.objects[c.name].push(u),u.geometry.reactiveState=c.geometry.reactiveState,u.geometry.compConf=c.geometry.compConf,g.remove(c),g.add(u),m.render()}}}},hoverObjects:function(){switch(f){case"none":return null;case"protons":return k;case"nuclets":return A;case"inner-faces":return m.objects.icosaFaces;case"outer-faces":return C}},hovered:function(e){switch(f){case"none":return[];case"protons":if(m.theme.get("proton--opacity"),i){if(e.length&&i==e[0])return;var t=i.object,a=m.theme.get("proton-"+t.az.type+"--color");t.material.color.setHex(parseInt(a.replace(/#/,"0x")),16),t.material.visible=t.az.visible}if(e.length){if(!e[0].object.az.optional||!e[0].object.az.active)return;(i=e[0]).object.material.visible=!0,a=m.theme.get("proton-ghost--color"),i.object.material.color.setHex(parseInt(a.replace(/#/,"0x")),16)}break;case"nuclets":break;case"inner-faces":if(m.theme.get("icosaFaces--opacity--az-slider"),l){if(e.length&&l==e[0])return;l.color.setHex(parseInt("0x00ff00")),d.geometry.colorsNeedUpdate=!0,l=null}e.length&&(l=e[0].face,d=e[0].object,l.color.setHex(parseInt("0x00ffff")),d.geometry.colorsNeedUpdate=!0,d.geometry.elementsNeedUpdate=!0,d.geometry.dynamic=!0,d.geometry.verticesNeedUpdate=!0);break;case"outer-faces":if(m.theme.get(" icosaOutFaces--opacity"),u){if(e.length&&u==e[0])return;u.color.setHex(parseInt("0xff00ff")),u=null}e.length&&(u=e[0].face).color.setHex(parseInt("0xffff00")),e[0].object.geometry.colorsNeedUpdate=!0}},atomLoaded:function(e){localStorage.setItem("atomizer_builder_atom_nid",e.az.nid),n(),m.objects.icosaFaces&&(j=m.objects.icosaFaces),m.objects.icosaOutFaces&&(C=m.objects.icosaOutFaces),c(e)}}}}(jQuery);
//# sourceMappingURL=../maps/producers/prod_atom_builder.js.map