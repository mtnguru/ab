var PRNG=function(){this.seed=1,this.next=function(){return this.gen()/2147483647},this.nextRange=function(t,n){return t+(n-t)*this.next()},this.gen=function(){return this.seed=16807*this.seed%2147483647}};
//# sourceMappingURL=../maps/threejs/PRNG.js.map
