jQuery,Drupal.atomizer.nucletC=function(e){function t(e,t,r){for(var a=new THREE.Geometry,o=b.theme.get(e+"Axes--opacity"),n=new THREE.LineBasicMaterial({color:b.theme.get(e+"Axes--color"),opacity:o,transparent:o<R.transparentThresh,visible:o>R.visibleThresh,linewidth:2}),i=0;i<t.vertices.length;i++){var s;s=r.vertices[t.vertices[i][0]],a.vertices.push(new THREE.Vector3(s.x,s.y,s.z)),s=r.vertices[t.vertices[i][1]],a.vertices.push(new THREE.Vector3(s.x,s.y,s.z))}var c=new THREE.LineSegments(a,n);return t.scale&&c.scale.set(t.scale,t.scale,t.scale),c.name=e+"Axes",c}function r(e,t,r){for(var a=new THREE.Geometry,o=new THREE.LineBasicMaterial({color:16711935,opacity:r,transparent:r<R.transparentThresh,visible:r>R.visibleThresh,linewidth:2}),n=0;n<t.length;n++){var i=t[n];a.vertices.push(new THREE.Vector3(i.x,i.y,i.z))}var s=new THREE.LineSegments(a,o);return s.name=e+"Lines",s}function a(e,t,r,a){var o=b.theme.get(e+"--opacity"),n=new THREE.Mesh(r,new THREE.MeshBasicMaterial({color:b.theme.get(e+"--color"),opacity:o,transparent:o<R.transparentThresh,visible:o>R.visibleThresh,wireframe:!0,wireframeLinewidth:b.theme.get(e+"--linewidth")}));if(n.scale.set(t,t,t),n.name=e,a)for(var i in z){var s=z[i];if(a[s]){var c=a[s]/360*2*Math.PI;n.rotation["init_"+s]=c,n.rotation[s]=c}}return T(e,n),n}function o(e,t,r,a){var o=b.theme.get(e+"--opacity"),n=new THREE.LineBasicMaterial({color:b.theme.get(e+"--color"),opacity:o,transparent:o<R.transparentThresh,visible:o>R.visibleThresh,linewidth:b.theme.get(e+"--linewidth")}),i=new THREE.Group;i.name=e;for(var s=0;s<r.azfaces.length;s++){for(var c,l=r.azfaces[s],h=new THREE.Geometry,p=0;p<l.indices.length;p++)c=r.vertices[l.indices[p]],h.vertices.push(new THREE.Vector3(c.x,c.y,c.z));c=r.vertices[l.indices[0]],h.vertices.push(new THREE.Vector3(c.x,c.y,c.z)),i.add(new THREE.Line(h,n))}if(i.scale.set(t,t,t),a)for(var v in z){var d=z[v];if(a[d]){var m=a[d]/360*2*Math.PI;i.rotation["init_"+d]=m,i.rotation[d]=m}}return T(e,i),i}function n(e,t,r,a,o){var n;if(o){r.dynamic=!0;var i=new THREE.MeshLambertMaterial({color:b.theme.get(e+"--color"),opacity:b.theme.get(e+"--opacity"),transparent:!0,vertexColors:THREE.FaceColors}),s=new THREE.MeshLambertMaterial({color:b.theme.get(e+"--color"),opacity:0,transparent:!0,vertexColors:THREE.FaceColors});n=new THREE.Mesh(r,new THREE.MultiMaterial([s,i]));for(h=0;h<o.length;h++)r.faces[o[h]].materialIndex=1}else{var c=b.theme.get(e+"--opacity"),l=new THREE.MeshStandardMaterial({color:b.theme.get(e+"--color"),opacity:c,transparent:c<R.transparentThresh,visible:c>R.visibleThresh,roughness:.5,metalness:0,vertexColors:THREE.FaceColors});n=new THREE.Mesh(r,l)}if(n.scale.set(t,t,t),n.name=e,a)for(var h in z){var p=z[h];if(a[p]){var v=a[p]/360*2*Math.PI;n.rotation["init_"+p]=v,n.rotation[p]=v}}return T(e,n),n}function i(e,t,r,a){var o;switch(e){case"plane":!0,o=new THREE.PlaneGeometry(r.width||1e3,r.depth||1e3);break;case"proton":case"sphere":o=new THREE.SphereGeometry(r.radius||b.theme.get("proton--radius"),r.widthSegments||36,r.heightSegments||36);break;case"electron":o=new THREE.SphereGeometry(r.radius||b.theme.get("electron--radius"),r.widthSegments||24,r.heightSegments||24);break;case"octahedron":o=new THREE.OctahedronGeometry(r.length||3);break;case"tetrahedron":o=new THREE.TetrahedronGeometry(r.length||3);break;case"icosahedron":o=new THREE.IcosahedronGeometry(r.length||3);break;case"dodecahedron":o=new THREE.DodecahedronGeometry(r.length||3);break;case"cube":var n=r.length||4;o=new THREE.BoxGeometry(n,n,n);break;case"pentagonalBipyramid":o=w(5,r.length,r.height)}var i=[];t.wireframe&&i.push(new THREE.MeshBasicMaterial(t.wireframe)),t.lambert&&i.push(new THREE.MeshLambertMaterial(t.lambert)),t.phong&&i.push(new THREE.MeshPhongMaterial(t.phong)),t.doubleSided&&(i[0].side=THREE.DoubleSide);var s;return s=1==i.length?new THREE.Mesh(o,i[0]):new THREE.SceneUtils.createMultiMaterialObject(o,i),r.scale&&s.scale.set(r.scale,r.scale,r.scale),a.rotation&&(a.rotation.x&&(s.rotation.x=a.rotation.x),a.rotation.y&&(s.rotation.y=a.rotation.y),a.rotation.z&&(s.rotation.z=a.rotation.z)),s.position.x=a.x||0,s.position.y=a.y||0,s.position.z=a.z||0,s.name=e,s}function s(e,t,r,a,o){switch(e){case"neutral":case"lithium":case"boron":case"beryllium":case"icosahedron":return b.shapes.getGeometry("icosahedron","final",r,null,o);case"decahedron":return b.shapes.getGeometry("decahedron","final",r,a,o);case"line":var n=new THREE.Geometry,i=2*x;return n.vertices.push(new THREE.Vector3(i,0,0)),n.vertices.push(new THREE.Vector3(0,0,0)),n.vertices.push(new THREE.Vector3(-i,0,0)),n;case"tetrahedron":return new THREE.TetrahedronGeometry(r,o);case"dodecahedron":case"hexahedron":case"backbone":return b.shapes.getGeometry(e,t,r,null,o);case"octahedron":return new THREE.OctahedronGeometry(r,o)}}function c(e,t){var r;if((r=b.theme.get("proton--color-style"))||(r="nuclet"),"nuclet"===r&&e&&e.state&&void 0!==e.state){if("hydrogen"===e.state||"helium"===e.state)return"proton-default";if("neutral"===t)return"proton-neutral";if("initial"===e.state){for(var a=[12,13,14,15,16,17,18,19],o=0;o<a.length;o++)if(-1===e.conf.protons.indexOf(a[o]))return"proton-initial";return"proton-capped"}return"proton-"+e.state}return"proton"===r&&t&&void 0!==t?"proton-"+t:"proton-default"}function l(e,t,r,a){var o,n={type:e.type||"default",visible:!("visible"in e)||e.visible,optional:e.optional||!1,active:e.active||!0},t=b.theme.get("proton--opacity");o=!1!==n.active&&(!1!==n.visible&&t>R.visibleThresh);var s=c(a,n.type),l=i("proton",{phong:{color:H[s.replace("proton-","")],opacity:t,transparent:t<R.transparentThresh,visible:o}},{scale:b.theme.get("proton--scale"),radius:x},{x:r.x,y:r.y,z:r.z});return l.name=s,l.material.visible=o,l.az=n,l}function h(e){}function p(e,t,r){var a=b.theme.get(e+"--opacity"),o=new THREE.AxisHelper(t);return o.name=e,o.material.linewidth=r,o.material.opacity=a,o.material.visible=a>.02,o.material.transparent=a<.97,o}function v(e,t,r){var a;switch(r.state){case"neutral":e.vertices[9].set(0,.1616236535868876*x,.0998889113026354*x);break;case"beryllium":for(vids=[0,2],a=0;a<vids.length;a++)e.vertices[vids[a]].x=1.2*e.vertices[vids[a]].x;e.vertices[9].set(0,.2*x,0);break;case"boron":for(vids=[0,2],a=0;a<vids.length;a++)e.vertices[vids[a]].x=1.23*e.vertices[vids[a]].x,e.vertices[vids[a]].y=.95*e.vertices[vids[a]].y;for(vids=[4,5,6,7],a=0;a<vids.length;a++)e.vertices[vids[a]].z=.85*e.vertices[vids[a]].z;e.vertices[9].set(0,.95*x,0);break;case"lithium":e.vertices[9].set(0,.1616236535868876*x,.0998889113026354*x)}r.protons=[],r.protonGeometry=e;var o=b.theme.get("proton--opacity");for(a in t.protons)if(t.protons.hasOwnProperty(a)){r.conf.protons.indexOf(parseInt(a));t.protons[a].visible=r.conf.protons.indexOf(parseInt(a))>-1;var n=l(t.protons[a],o,e.vertices[a],r);r.protons[a]=n}return r.protons}function d(e,t){var r=b.theme.get("valence-active--color"),a=b.theme.get("valence--opacity"),o=b.theme.get("valence--scale")*x,n=b.theme.get("valence--diameter")*x;t.rings=[];for(var i in e.valence){var s=e.valence[i],c=new THREE.TorusGeometry(o,n,10,40),l=new THREE.MeshPhongMaterial({color:r,opacity:a,transparent:a<R.transparentThresh,visible:a>R.visibleThresh}),h=new THREE.Mesh(c,l);h.name="valence-active",h.az=s,t.rings[i]=h,s.rotation&&(s.rotation.x&&(h.rotation.x=s.rotation.x/360*2*Math.PI),s.rotation.y&&(h.rotation.y=s.rotation.y/360*2*Math.PI),s.rotation.z&&(h.rotation.z=s.rotation.z/360*2*Math.PI)),t.protons[parseInt(i)].add(h)}}function m(e,t,r){r.tetrahedrons=[];for(var a=0;a<e.tetrahedrons.length;a++){var o=G("tetra");o.azid="t"+a,r.tetrahedrons[a]=o,o.children[1].geometry.protons=[];for(var n=0;n<4;n++){var i=e.tetrahedrons[a].vertices[n];o.children[0].geometry.vertices[n].x=t.vertices[i].x,o.children[0].geometry.vertices[n].y=t.vertices[i].y,o.children[0].geometry.vertices[n].z=t.vertices[i].z,o.children[1].geometry.vertices[n].x=t.vertices[i].x,o.children[1].geometry.vertices[n].y=t.vertices[i].y,o.children[1].geometry.vertices[n].z=t.vertices[i].z,o.protons[n]=r.protons[i]}}return r.tetrahedrons}function u(e,t,r,a){var o=b.theme.get("electron--opacity")||1,n=b.theme.get(e+"--scale"),s=[];for(var c in r.electrons)if(r.electrons.hasOwnProperty(c)&&(!a.electrons||a.electrons.contains(c))){var l=t.vertices[c],h=i("electron",{phong:{color:b.theme.get("electron--color"),opacity:o,transparent:o<R.transparentThresh,visible:o>R.visibleThresh}},{scale:b.theme.get("proton--scale"),radius:M},{x:l.x*n,y:l.y*n,z:l.z*n});h.name="electron",T("electrons",h),s[c]=h}return s}function E(e,t,r){return"dodecahedron"==r.shape||"hexahedron"==r.shape?o(e,r.scale+.02,t,r.rotation||null):a(e,r.scale+.02,t,r.rotation||null)}function f(e,r,a,o,i){var c=s(a.shape,i.state||"",a.scale*x,(a.scaleHeight||1)*x);c.compConf=a,c.scaleInit=a.scale;var l;if(r.rotation&&(r.rotation.x&&(l=r.rotation.x/360*2*Math.PI,c.applyMatrix((new THREE.Matrix4).makeRotationX(l))),r.rotation.y&&(l=r.rotation.y/360*2*Math.PI,c.applyMatrix((new THREE.Matrix4).makeRotationY(l))),r.rotation.z&&(l=r.rotation.z/360*2*Math.PI,c.applyMatrix((new THREE.Matrix4).makeRotationZ(l)))),a.protons)for(var h=v(c,a,i),p=0;p<h.length;p++)h[p]&&o.add(h[p]);if(a.valence&&d(a,i),a.tetrahedrons)for(var f=m(a,c,i),y=0;y<f.length;y++)o.add(f[y]);if(a.electrons)for(var g=u(e,c,a,i.conf),w=0;w<g.length;w++)o.add(g[w]);if(a.axes&&o.add(t(e,a.axes,c)),a.wireframe&&o.add(E(e+"Wireframe",c,a)),a.faces){if(a.assignFaceOpacity&&i.conf.reactiveState){var T=i.conf.reactiveState[e]?i.conf.reactiveState[e].slice():[];c.reactiveState=i.reactiveState=T,c.compConf=a}var R=n(e+"Faces",a.scale,c,a.rotation||null,i.reactiveState);o.add(R)}return a.vertexids&&o.add(b.sprites.createVerticeIds(e,c)),a.faceids&&o.add(b.sprites.createFaceIds(e,c)),a.particleids&&o.add(b.sprites.createVerticeIds(a.particleids,c)),c}function y(e,t,r){var a=new THREE.Group;a.name=e;var o=parseFloat(b.theme.get(e+"--scale"));if(a.scale.set(o,o,o),t.alignyaxis){var n=r.protonGeometry.vertices[t.alignyaxis.vertices[0]],i=r.protonGeometry.vertices[t.alignyaxis.vertices[1]],s=n.clone().sub(i);Drupal.atomizer.base.alignObjectToAxis(a,new THREE.Vector3(0,1,0),s.clone().normalize(),!1);var c=new THREE.Vector3(0,0,0).add(s).multiplyScalar(t.alignyaxis.attachPt);a.position.set(c.x,c.y,c.z);var l=t.alignyaxis.rotatey/360*2*Math.PI;a.rotation.y=l}for(var h in t.components)t.components.hasOwnProperty(h)&&f(e,t,t.components[h],a,r);return a}function g(e){b.atom.az().nuclets[e.az.id+"0"]&&g(b.atom.az().nuclets[e.az.id+"0"]),b.atom.az().nuclets[e.az.id+"1"]&&g(b.atom.az().nuclets[e.az.id+"1"]);for(var t=0;t<e.az.protons.length;t++)e.az.protons[t]&&h([e.az.protons[t]]);delete b.atom.az().nuclets[e.az.id],e.parent.parent.parent.remove(e.parent.parent)}function w(e,t,r){var a=new THREE.Geometry;mesth,a.vertices.push(new THREE.Vector3(0,r,0)),a.vertices.push(new THREE.Vector3(0,-r,0));for(var o=2*Math.PI/e,n=0,i=Math.PI;n<e;n++,i+=o){var s=Math.cos(i),c=Math.sin(i);a.vertices.push(new THREE.Vector3(t*s,0,t*c))}for(n=2;n<e+1;n++)a.faces.push(new THREE.Face3(n+1,n,0)),a.faces.push(new THREE.Face3(1,n,n+1));return a.faces.push(new THREE.Face3(2,e+1,0)),a.faces.push(new THREE.Face3(1,e+1,2)),a.computeFaceNormals(),a}function T(e,t){b.objects||(b.objects={}),b.objects[e]?b.objects[e].push(t):b.objects[e]=[t]}var b=e,R=Drupal.atomizer.base.constants,z=["x","y","z"],H={default:b.theme.get("proton-default--color"),ghost:b.theme.get("proton-ghost--color"),valence:b.theme.get("proton-valence--color"),grow:b.theme.get("proton-grow--color"),polar:b.theme.get("proton-polar--color"),neutral:b.theme.get("proton-neutral--color"),lithium:b.theme.get("proton-lithium--color"),beryllium:b.theme.get("proton-beryllium--color"),boron:b.theme.get("proton-boron--color"),carbon:b.theme.get("proton-carbon--color"),initial:b.theme.get("proton-initial--color"),capped:b.theme.get("proton-capped--color"),final:b.theme.get("proton-final--color")},x=b.theme.get("proton--radius"),M=b.theme.get("electron--radius"),G=function(e){var t=new THREE.Group;t.name="tetrahedron",t.protons=[],t.protonRadius=x;var r=new THREE.TetrahedronGeometry(1.222*b.nuclet.protonRadius);return r.dynamic=!0,t.add(b.nuclet.createGeometryWireframe(e+"Wireframe",1,r,null,null)),t.add(b.nuclet.createGeometryFaces(e+"Faces",1,r,null,null)),t};return{makeObject:i,makeProton:l,showProtons:function(e,t,r){for(var a=0;a<r.length;a++){var o=e.az.protons[r[a]];t?(o.material.visible=!0,o.material.opacity=1,o.material.transparent=!1):(o.material.visible=!1,o.material.opacity=0,o.material.transparent=!0)}},createNuclet:function(e,t){var a=new THREE.Group;a.name="nuclet-"+e,t.state=t.state.replace("backbone-",""),a.az={protonRadius:x,conf:t,id:e,state:t.state},a.geo=drupalSettings.atomizer_config.objects[t.state];var o,n;switch(a.az.state){case"dodecahedron":o=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];break;case"neutral":o=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],n=[0,1,2,3,4,5];break;case"lithium":o=[0,1,3,4,5,9,11],n=[0,1,2];break;case"beryllium":o=[1,3,4,5,6,7,9,10,11],n=[0,1,2];break;case"boron":o=[1,2,3,4,5,6,7,9,10,11],n=[0,1,2];break;case"initial":case"final":o=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],n=[0,1,2,3,4,5];break;case"carbon":case"icosahedron":o=[0,1,2,3,4,5,6,7,8,9,10,11],n=[0,1,2,3,4,5]}a.az.conf.electrons||(a.az.conf.electrons=n),a.az.conf.protons||(a.az.conf.protons=o),"N0"!=e&&((l=a.az.conf.protons.indexOf(10))>-1&&(a.az.conf.protons[l]=void 0),"boron"===a.az.conf.state&&(l=a.az.conf.protons.indexOf(0))>-1&&(a.az.conf.protons[l]=void 0));for(var i in a.geo.geoGroups)if(a.geo.geoGroups.hasOwnProperty(i)){var c=y(i,a.geo.geoGroups[i],a.az);a.add(c)}if(a.add(p("nucletAxes",6*x,1)),a.az.conf.rotation)for(var l in z){var h=z[l];if(a.az.conf.rotation[h]){var v=a.az.conf.rotation[h]/360*2*Math.PI;a.rotation["init_"+h]=v,a.rotation[h]=v}}var d=s("icosahedron","",x,1);d.applyMatrix((new THREE.Matrix4).makeRotationY(.5*Math.PI));var m=r("attach",[d.vertices[9],d.vertices[10]],b.theme.get("attachLines--opacity"));m.scale.set(5,5,5),a.add(m);var u=new THREE.Object3D;u.name="nucletInner-"+e,u.add(a),u.add(p("nucletInnerAxes",5*x,3));var E=new THREE.Object3D;return E.name="nucletOuter-"+e,E.add(u),E.add(p("nucletOuterAxes",4*x,5)),a.az.conf.position&&(E.position.x=a.az.conf.position.x||0,E.position.y=a.az.conf.position.y||0,E.position.z=a.az.conf.position.z||0),E},deleteNuclet:g,createGeometry:s,createGeometryWireframe:a,createGeometryFaces:n,protonRadius:x}};
//# sourceMappingURL=maps/az_nuclet.js.map