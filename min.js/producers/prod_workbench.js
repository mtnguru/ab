Drupal.atomizer.producers.workbenchC=function(e){var t=e,n=function(e,n){switch(e){case"tetralet":r={position:1,type:"tetralet",numProtons:4,protons:[{present:!0},{present:!0},{present:!0},{present:!0}]};break;case"decalet":r={position:1,type:"decalet",numProtons:7,protons:[{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0}]};break;case"icosalet":r={position:1,type:"icosalet",numProtons:12,protons:[{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0}]};break;case"octolet":var r={position:1,type:"octolet",numProtons:6,protons:[{present:!0},{present:!0},{present:!0},{present:!0},{present:!0},{present:!0}]}}return r.position={x:n.x,y:n.y,z:n.z},nuclet=t.nuclet.createNuclet(r)};return{createView:function(){t.nuclet=Drupal.atomizer.nucletC(t),t.atom=Drupal.atomizer.atomC(t);t.nuclet;var e=n("octolet",{x:0,y:92,z:-200});Drupal.atomizer.octolet=e,t.scene.add(e)},setDefaults:function(){},intersectObjects:function(){return[]},intersected:function(){},mouseClick:function(){}}};
//# sourceMappingURL=../maps/producers/prod_workbench.js.map
