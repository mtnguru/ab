THREE.MarchingCubes=function(i,t,s,h){THREE.ImmediateRenderObject.call(this,t),this.enableUvs=void 0!==s&&s,this.enableColors=void 0!==h&&h,this.init=function(i){this.resolution=i,this.isolation=80,this.size=i,this.size2=this.size*this.size,this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.field=new Float32Array(this.size3),this.normal_cache=new Float32Array(3*this.size3),this.vlist=new Float32Array(36),this.nlist=new Float32Array(36),this.maxCount=4096,this.count=0,this.hasPositions=!1,this.hasNormals=!1,this.hasColors=!1,this.hasUvs=!1,this.positionArray=new Float32Array(3*this.maxCount),this.normalArray=new Float32Array(3*this.maxCount),this.enableUvs&&(this.uvArray=new Float32Array(2*this.maxCount)),this.enableColors&&(this.colorArray=new Float32Array(3*this.maxCount))},this.lerp=function(i,t,s){return i+(t-i)*s},this.VIntX=function(i,t,s,h,r,o,a,e,n,l){var c=(r-n)/(l-n),m=this.normal_cache;t[h]=o+c*this.delta,t[h+1]=a,t[h+2]=e,s[h]=this.lerp(m[i],m[i+3],c),s[h+1]=this.lerp(m[i+1],m[i+4],c),s[h+2]=this.lerp(m[i+2],m[i+5],c)},this.VIntY=function(i,t,s,h,r,o,a,e,n,l){var c=(r-n)/(l-n),m=this.normal_cache;t[h]=o,t[h+1]=a+c*this.delta,t[h+2]=e;var f=i+3*this.yd;s[h]=this.lerp(m[i],m[f],c),s[h+1]=this.lerp(m[i+1],m[f+1],c),s[h+2]=this.lerp(m[i+2],m[f+2],c)},this.VIntZ=function(i,t,s,h,r,o,a,e,n,l){var c=(r-n)/(l-n),m=this.normal_cache;t[h]=o,t[h+1]=a,t[h+2]=e+c*this.delta;var f=i+3*this.zd;s[h]=this.lerp(m[i],m[f],c),s[h+1]=this.lerp(m[i+1],m[f+1],c),s[h+2]=this.lerp(m[i+2],m[f+2],c)},this.compNorm=function(i){var t=3*i;0===this.normal_cache[t]&&(this.normal_cache[t]=this.field[i-1]-this.field[i+1],this.normal_cache[t+1]=this.field[i-this.yd]-this.field[i+this.yd],this.normal_cache[t+2]=this.field[i-this.zd]-this.field[i+this.zd])},this.polygonize=function(i,t,s,h,r,o){var a=h+1,e=h+this.yd,n=h+this.zd,l=a+this.yd,c=a+this.zd,m=h+this.yd+this.zd,f=a+this.yd+this.zd,y=0,d=this.field[h],v=this.field[a],p=this.field[e],u=this.field[l],z=this.field[n],A=this.field[c],E=this.field[m],N=this.field[f];d<r&&(y|=1),v<r&&(y|=2),p<r&&(y|=8),u<r&&(y|=4),z<r&&(y|=16),A<r&&(y|=32),E<r&&(y|=128),N<r&&(y|=64);var b=THREE.edgeTable[y];if(0===b)return 0;var T=this.delta,C=i+T,I=t+T,R=s+T;1&b&&(this.compNorm(h),this.compNorm(a),this.VIntX(3*h,this.vlist,this.nlist,0,r,i,t,s,d,v)),2&b&&(this.compNorm(a),this.compNorm(l),this.VIntY(3*a,this.vlist,this.nlist,3,r,C,t,s,v,u)),4&b&&(this.compNorm(e),this.compNorm(l),this.VIntX(3*e,this.vlist,this.nlist,6,r,i,I,s,p,u)),8&b&&(this.compNorm(h),this.compNorm(e),this.VIntY(3*h,this.vlist,this.nlist,9,r,i,t,s,d,p)),16&b&&(this.compNorm(n),this.compNorm(c),this.VIntX(3*n,this.vlist,this.nlist,12,r,i,t,R,z,A)),32&b&&(this.compNorm(c),this.compNorm(f),this.VIntY(3*c,this.vlist,this.nlist,15,r,C,t,R,A,N)),64&b&&(this.compNorm(m),this.compNorm(f),this.VIntX(3*m,this.vlist,this.nlist,18,r,i,I,R,E,N)),128&b&&(this.compNorm(n),this.compNorm(m),this.VIntY(3*n,this.vlist,this.nlist,21,r,i,t,R,z,E)),256&b&&(this.compNorm(h),this.compNorm(n),this.VIntZ(3*h,this.vlist,this.nlist,24,r,i,t,s,d,z)),512&b&&(this.compNorm(a),this.compNorm(c),this.VIntZ(3*a,this.vlist,this.nlist,27,r,C,t,s,v,A)),1024&b&&(this.compNorm(l),this.compNorm(f),this.VIntZ(3*l,this.vlist,this.nlist,30,r,C,I,s,u,N)),2048&b&&(this.compNorm(e),this.compNorm(m),this.VIntZ(3*e,this.vlist,this.nlist,33,r,i,I,s,p,E)),y<<=4;for(var H,V,w,M=0,g=0;-1!=THREE.triTable[y+g];)V=(H=y+g)+1,w=H+2,this.posnormtriv(this.vlist,this.nlist,3*THREE.triTable[H],3*THREE.triTable[V],3*THREE.triTable[w],o),g+=3,M++;return M},this.posnormtriv=function(i,t,s,h,r,o){var a=3*this.count;if(this.positionArray[a]=i[s],this.positionArray[a+1]=i[s+1],this.positionArray[a+2]=i[s+2],this.positionArray[a+3]=i[h],this.positionArray[a+4]=i[h+1],this.positionArray[a+5]=i[h+2],this.positionArray[a+6]=i[r],this.positionArray[a+7]=i[r+1],this.positionArray[a+8]=i[r+2],this.normalArray[a]=t[s],this.normalArray[a+1]=t[s+1],this.normalArray[a+2]=t[s+2],this.normalArray[a+3]=t[h],this.normalArray[a+4]=t[h+1],this.normalArray[a+5]=t[h+2],this.normalArray[a+6]=t[r],this.normalArray[a+7]=t[r+1],this.normalArray[a+8]=t[r+2],this.enableUvs){var e=2*this.count;this.uvArray[e]=i[s],this.uvArray[e+1]=i[s+2],this.uvArray[e+2]=i[h],this.uvArray[e+3]=i[h+2],this.uvArray[e+4]=i[r],this.uvArray[e+5]=i[r+2]}this.enableColors&&(this.colorArray[a]=i[s],this.colorArray[a+1]=i[s+1],this.colorArray[a+2]=i[s+2],this.colorArray[a+3]=i[h],this.colorArray[a+4]=i[h+1],this.colorArray[a+5]=i[h+2],this.colorArray[a+6]=i[r],this.colorArray[a+7]=i[r+1],this.colorArray[a+8]=i[r+2]),this.count+=3,this.count>=this.maxCount-3&&(this.hasPositions=!0,this.hasNormals=!0,this.enableUvs&&(this.hasUvs=!0),this.enableColors&&(this.hasColors=!0),o(this))},this.begin=function(){this.count=0,this.hasPositions=!1,this.hasNormals=!1,this.hasUvs=!1,this.hasColors=!1},this.end=function(i){if(0!==this.count){for(var t=3*this.count;t<this.positionArray.length;t++)this.positionArray[t]=0;this.hasPositions=!0,this.hasNormals=!0,this.enableUvs&&(this.hasUvs=!0),this.enableColors&&(this.hasColors=!0),i(this)}},this.addBall=function(i,t,s,h,r){var o=this.size*Math.sqrt(h/r),a=s*this.size,e=t*this.size,n=i*this.size,l=Math.floor(a-o);l<1&&(l=1);var c=Math.floor(a+o);c>this.size-1&&(c=this.size-1);var m=Math.floor(e-o);m<1&&(m=1);var f=Math.floor(e+o);f>this.size-1&&(f=this.size-1);var y=Math.floor(n-o);y<1&&(y=1);var d=Math.floor(n+o);d>this.size-1&&(d=this.size-1);var v,p,u,z,A,E,N,b,T,C,I;for(u=l;u<c;u++)for(A=this.size2*u,T=(b=u/this.size-s)*b,p=m;p<f;p++)for(z=A+this.size*p,C=(N=p/this.size-t)*N,v=y;v<d;v++)(I=h/(1e-6+(E=v/this.size-i)*E+C+T)-r)>0&&(this.field[z+v]+=I)},this.addPlaneX=function(i,t){var s,h,r,o,a,e,n,l=this.size,c=this.yd,m=this.zd,f=this.field,y=l*Math.sqrt(i/t);for(y>l&&(y=l),s=0;s<y;s++)if(e=s/l,o=e*e,(a=i/(1e-4+o)-t)>0)for(h=0;h<l;h++)for(n=s+h*c,r=0;r<l;r++)f[m*r+n]+=a},this.addPlaneY=function(i,t){var s,h,r,o,a,e,n,l,c=this.size,m=this.yd,f=this.zd,y=this.field,d=c*Math.sqrt(i/t);for(d>c&&(d=c),h=0;h<d;h++)if(e=h/c,o=e*e,(a=i/(1e-4+o)-t)>0)for(n=h*m,s=0;s<c;s++)for(l=n+s,r=0;r<c;r++)y[f*r+l]+=a},this.addPlaneZ=function(i,t){var s,h,r,o,a,e,n,l,c=this.size,m=this.yd,f=this.zd,y=this.field,d=c*Math.sqrt(i/t);for(d>c&&(d=c),r=0;r<d;r++)if(e=r/c,o=e*e,(a=i/(1e-4+o)-t)>0)for(n=f*r,h=0;h<c;h++)for(l=n+h*m,s=0;s<c;s++)y[l+s]+=a},this.reset=function(){var i;for(i=0;i<this.size3;i++)this.normal_cache[3*i]=0,this.field[i]=0},this.render=function(i){this.begin();for(var t=this.size-2,s=1;s<t;s++)for(var h=this.size2*s,r=(s-this.halfsize)/this.halfsize,o=1;o<t;o++)for(var a=h+this.size*o,e=(o-this.halfsize)/this.halfsize,n=1;n<t;n++){var l=(n-this.halfsize)/this.halfsize,c=a+n;this.polygonize(l,e,r,c,this.isolation,i)}this.end(i)},this.generateGeometry=function(){var i=0,t=new THREE.Geometry,s=[];return this.render(function(h){var r,o,a,e,n,l,c,m,f,y,d,v,p,u;for(r=0;r<h.count;r++)f=1+(m=3*r),y=m+2,o=h.positionArray[m],a=h.positionArray[f],e=h.positionArray[y],n=new THREE.Vector3(o,a,e),o=h.normalArray[m],a=h.normalArray[f],e=h.normalArray[y],(l=new THREE.Vector3(o,a,e)).normalize(),t.vertices.push(n),s.push(l);for(u=h.count/3,r=0;r<u;r++)f=1+(m=3*(i+r)),y=m+2,d=s[m],v=s[f],p=s[y],c=new THREE.Face3(m,f,y,[d,v,p]),t.faces.push(c);i+=u,h.count=0}),t},this.init(i)},THREE.MarchingCubes.prototype=Object.create(THREE.ImmediateRenderObject.prototype),THREE.MarchingCubes.prototype.constructor=THREE.MarchingCubes,THREE.edgeTable=new Int32Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),THREE.triTable=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);
//# sourceMappingURL=../maps/threejs/MarchingCubes.js.map
