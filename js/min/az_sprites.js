Drupal.atomizer.spritesC=function(e,r){function t(e,r){var t,o,a;for(t=0,o=e.length;t<o;t++)(a=e[t]).centroid=new THREE.Vector3,a.centroid.set(0,0,0),a.centroid.add(r[a.a]),a.centroid.add(r[a.b]),a.centroid.add(r[a.c]),a.centroid.divideScalar(3)}function o(e,r,t,o,a,i){e.beginPath(),e.moveTo(r+i,t),e.lineTo(r+o-i,t),e.quadraticCurveTo(r+o,t,r+o,t+i),e.lineTo(r+o,t+a-i),e.quadraticCurveTo(r+o,t+a,r+o-i,t+a),e.lineTo(r+i,t+a),e.quadraticCurveTo(r,t+a,r,t+a-i),e.lineTo(r,t+i),e.quadraticCurveTo(r,t,r+i,t),e.closePath(),e.fill(),e.stroke()}function a(e,r){void 0===r&&(r={});var t=r.hasOwnProperty("fontface")?r.fontface:"Arial",a=r.hasOwnProperty("fontsize")?r.fontsize:16,i=r.hasOwnProperty("borderThickness")?r.borderThickness:0,n=r.hasOwnProperty("borderColor")?r.borderColor:"#990099",c=r.hasOwnProperty("backgroundColor")?r.backgroundColor:"#009999",s=r.hasOwnProperty("color")?r.color:"#ffffff",d=document.createElement("canvas"),l=d.getContext("2d");l.font="Bold "+a+"px "+t;var f=l.measureText(e).width;l.fillStyle=c,l.strokeStyle=n,l.lineWidth=i,o(l,0,0,f,1.35*a+i,8),l.fillStyle=s,l.fillText(e,i,a);var v=l.getImageData(0,0,f,88);d.width=f,d.height=88,l.putImageData(v,0,0);var p=new THREE.Texture(d);p.needsUpdate=!0;var u=new THREE.SpriteMaterial({map:p});u.opacity=r.opacity||0,u.transparent=r.transparent||!1,u.visible=r.visible||!0;var h=new THREE.Sprite(u);return h.scale.set(20,20,1),h}var i=e;return{createVerticeIds:function(e,r){var t=new THREE.Group;t.name=e+"Vertexids";var o=i.theme.get(e+"Vertexid--opacity"),n="proton"==e?"Vertexid--color":"Wireframe--color";n=e+n;for(var c={fontsize:60,color:"#000000",backgroundColor:i.theme.get(n),opacity:o,transparent:o<.97,visible:o>.03},s=0;s<r.vertices.length;s++){var d=a(" "+s+" ",c);d.name=e+"Vertexid",l=2,d.position.x=l*r.vertices[s].x,d.position.y=l*r.vertices[s].y,d.position.z=l*r.vertices[s].z,t.add(d)}var l=1;return t.scale.set(l,l,l),t},createFaceIds:function(e,r){var o=new THREE.Group;t(r.faces,r.vertices),o.name=e+"Faceids";for(var n=i.theme.get(e+"Faceid--opacity"),c={fontsize:60,color:i.theme.get(e+"Wireframe--color"),backgroundColor:"#000000",opacity:n,transparent:n<.97,visible:n>.03},s=0;s<r.faces.length;s++){var d=a(" "+s+" ",c);d.name=e+"Faceid",l=2,d.position.x=l*r.faces[s].centroid.x,d.position.y=l*r.faces[s].centroid.y,d.position.z=l*r.faces[s].centroid.z,o.add(d)}var l=1;return o.scale.set(l,l,l),o}}};
//# sourceMappingURL=maps/az_sprites.js.map
