THREE.toHalf=function(){var r=new Float32Array(1),n=new Int32Array(r.buffer);return function(t){r[0]=t;var a=n[0],e=a>>16&32768,f=a>>12&2047,u=a>>23&255;return u<103?e:u>142?(e|=31744,e|=(255==u?0:1)&&8388607&a):u<113?(f|=2048,e|=(f>>114-u)+(f>>113-u&1)):(e|=u-112<<10|f>>1,e+=1&f)}}();
//# sourceMappingURL=../maps/threejs/Half.js.map
