!function(e){Drupal.atomizer.producers={},Drupal.atomizer.viewerC=function(a){function t(e,a){var t=new THREE.SpotLight(a.c);return t.position.set(a.x||-40,a.y||60,a.z||-10),t.castShadow=!0,t.name=e,t}function n(e){for(var a={},t=e;(t=t.parentElement)&&!t.classList.contains("az-view-mode-atomizer"););if(t&&t.attributes["data-az"]){var n=t.attributes["data-az"].value.split(" ");for(var i in n)if(n.hasOwnProperty(i)){var r=n[i].split("-");a[r[0]]=r[1]}}return a}var i,r=[],o={objects:{},context:e("#az-id-"+a.atomizerId.toLowerCase())},s=!1,c=function(){o.renderer.render(o.scene,o.camera)},l=function(){var a=o.atomizer.atomizerId.replace(/[ _]/g,"-").toLowerCase()+"-canvas-wrapper";if(o.canvasContainer=e("#"+a)[0],o.dataAttr=n(o.canvasContainer),o.canvas=o.canvasContainer.getElementsByTagName("canvas")[0],o.canvasWidth=o.canvasContainer.clientWidth,o.atomizer.canvasRatio&&"window"!==o.atomizer.canvasRatio)o.canvasHeight=o.canvasWidth*o.atomizer.canvasRatio;else{var s=window.innerHeight/window.innerWidth;o.canvasHeight=o.canvasWidth*s}o.canvas.height=o.canvasHeight,o.producer=Drupal.atomizer.producers[o.view.producer+"C"](o),o.scene=new THREE.Scene,o.scene.position.set(0,0,0),o.controls=Drupal.atomizer.controlsC(o);var l={antialias:!0,canvas:o.canvas};o.renderer=new THREE.WebGLRenderer(l),o.renderer.setClearColor(o.theme.get("renderer--color"),1),o.renderer.setSize(o.canvasWidth,o.canvasHeight),o.renderer.shadowEnabled=!0,o.canvasContainer.appendChild(o.renderer.domElement),window.addEventListener("resize",function(){if(o.canvasWidth=o.canvasContainer.clientWidth,o.atomizer.canvasRatio&&"window"!==o.atomizer.canvasRatio)o.canvasHeight=o.canvasWidth*o.atomizer.canvasRatio;else{var e=window.innerHeight/window.innerWidth;o.canvasHeight=o.canvasWidth*e}o.canvas.width=o.canvasWidth,o.canvas.height=o.canvasHeight,o.renderer.setSize(o.canvas.width,o.canvas.height),o.renderer.setViewport(0,0,o.canvas.width,o.canvas.height),o.camera.aspect=o.canvas.width/o.canvas.height,o.camera.updateProjectionMatrix(),o.render()}),o.camera=new THREE.PerspectiveCamera(o.theme.get("camera--perspective"),o.canvasWidth/o.canvasHeight,.1,1e4),zoom=o.dataAttr.zoom?o.dataAttr.zoom:1,o.camera.position.set(zoom*o.theme.get("camera--position","x"),zoom*o.theme.get("camera--position","y"),zoom*o.theme.get("camera--position","z")),o.camera.lookAt(o.scene.position),o.controls.init(),(i=new THREE.AmbientLight(o.theme.get("ambient--color"))).name="ambient",o.scene.add(i);for(var d=1;d<4;d++)r[d]=t("spotlight-"+d,{c:o.theme.get("spotlight-"+d+"--color"),x:o.theme.get("spotlight-"+d+"--position","x"),y:o.theme.get("spotlight-"+d+"--position","y"),z:o.theme.get("spotlight-"+d+"--position","z")}),o.scene.add(r[d]);o.nuclet=Drupal.atomizer.nucletC(o),o.shapes=Drupal.atomizer.shapesC(o),o.sprites=Drupal.atomizer.spritesC(o),o.animation=Drupal.atomizer.animationC(o);o.theme.get("plane--color");o.scene.add(o.nuclet.makeObject("plane",{lambert:{color:o.theme.get("plane--color"),opacity:o.theme.get("plane--opacity"),transparent:!0}},{width:o.theme.get("plane--width"),depth:o.theme.get("plane--depth")},{x:o.theme.get("plane--position","x"),y:o.theme.get("plane--position","y"),z:o.theme.get("plane--position","z"),rotation:{x:-.5*Math.PI}})),o.producer.createView(),c()};return o.context.hover(function(){var e=window.scrollX,a=window.scrollY;this.focus(),window.scrollTo(e,a)},function(){this.blur()}).keyup(function(e){switch(e.keyCode){case 70:s=!s,screenfull.toggle(o.context[0]),s?o.context.addClass("az-fullscreen"):o.context.removeClass("az-fullscreen"),e.preventDefault()}}),o.context.dblclick(function(){s&&(s=!1,o.context.removeClass("az-fullscreen"),screenfull.exit())}),Drupal.behaviors.atomizer_viewer={attach:function(a,t){e(".az-dialog").each(function(a){e(this).hasClass("az-dialog-processed")||e(this).addClass("az-dialog-processed")})}},o.buttonClicked=function(e){"viewer--fullScreen"===e.id&&((s=!s)?(screenfull.request(o.context[0]),o.context.addClass("az-fullscreen")):(screenfull.exit(),o.context.removeClass("az-fullscreen")))},o.render=c,o.makeScene=l,o.atomizer=a,o.view=a.views[a.defaultView],o.theme=Drupal.atomizer.themeC(o,l),o}}(jQuery);
//# sourceMappingURL=maps/az_viewer.js.map