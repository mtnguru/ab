THREE.Gyroscope=function(){THREE.Object3D.call(this)},THREE.Gyroscope.prototype=Object.create(THREE.Object3D.prototype),THREE.Gyroscope.prototype.constructor=THREE.Gyroscope,THREE.Gyroscope.prototype.updateMatrixWorld=function(){var t=new THREE.Vector3,r=new THREE.Quaternion,e=new THREE.Vector3,o=new THREE.Vector3,i=new THREE.Quaternion,a=new THREE.Vector3;return function(s){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||s)&&(null!==this.parent?(this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorld.decompose(o,i,a),this.matrix.decompose(t,r,e),this.matrixWorld.compose(o,r,a)):this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1,s=!0);for(var c=0,p=this.children.length;c<p;c++)this.children[c].updateMatrixWorld(s)}}();
//# sourceMappingURL=../maps/threejs/Gyroscope.js.map