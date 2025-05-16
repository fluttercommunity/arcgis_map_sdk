"use strict";(self.webpackChunkRemoteClient=self.webpackChunkRemoteClient||[]).push([[958],{97937:(t,e,n)=>{n.d(e,{a:()=>y,c:()=>g,e:()=>A,f:()=>x,g:()=>C,i:()=>T,o:()=>q,s:()=>E,w:()=>M}),n(44208),n(53966);var r=n(34727),o=n(58083),i=n(38954),c=n(51850),a=n(87317),s=n(91829),u=n(34304),l=n(88582),d=n(71351);function h(t,e){const n=(0,i.l)(t),o=(0,r.YN)(t[2]/n),c=Math.atan2(t[1]/n,t[0]/n);return(0,i.i)(e,n,o,c),e}var f=n(44280),v=n(32114);const m=g();function g(){return(0,s.vt)()}const p=a.e,b=a.e;function A(t,e){return(0,a.c)(e,t)}function M(t){return t}function C(t){return t[3]}function y(t){return t}function x(t,e,n,r){return(0,s.fA)(t,e,n,r)}function _(t,e,n){if(null==e)return!1;if(!R(t,e,w))return!1;let{t0:r,t1:o}=w;if((r<0||o<r&&o>0)&&(r=o),r<0)return!1;if(n){const{origin:t,direction:o}=e;n[0]=t[0]+o[0]*r,n[1]=t[1]+o[1]*r,n[2]=t[2]+o[2]*r}return!0}const w={t0:0,t1:0};function R(t,e,n){const{origin:r,direction:o}=e,i=S;i[0]=r[0]-t[0],i[1]=r[1]-t[1],i[2]=r[2]-t[2];const c=o[0]*o[0]+o[1]*o[1]+o[2]*o[2];if(0===c)return!1;const a=2*(o[0]*i[0]+o[1]*i[1]+o[2]*i[2]),s=a*a-4*c*(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]-t[3]*t[3]);if(s<0)return!1;const u=Math.sqrt(s);return n.t0=(-a-u)/(2*c),n.t1=(-a+u)/(2*c),!0}const S=(0,c.vt)();function T(t,e){return _(t,e,null)}function P(t,e,n){const r=v.rq.get(),c=v.Rc.get();(0,i.e)(r,e.origin,e.direction);const a=C(t);(0,i.e)(n,r,e.origin),(0,i.h)(n,n,1/(0,i.l)(n)*a);const s=O(t,e.origin),u=(0,f.g7)(e.origin,n);return(0,o.$0)(c,u+s,r),(0,i.t)(n,n,c),n}function F(t,e,n){const r=(0,i.d)(v.rq.get(),e,t),o=(0,i.h)(v.rq.get(),r,t[3]/(0,i.l)(r));return(0,i.g)(n,o,t)}function O(t,e){const n=(0,i.d)(v.rq.get(),e,t),o=(0,i.l)(n),c=C(t),a=c+Math.abs(c-o);return(0,r.XM)(c/a)}const B=(0,c.vt)();function D(t,e,n,r){const o=(0,i.d)(B,e,t);switch(n){case l._.X:{const t=h(o,B)[2];return(0,i.i)(r,-Math.sin(t),Math.cos(t),0)}case l._.Y:{const t=h(o,B),e=t[1],n=t[2],c=Math.sin(e);return(0,i.i)(r,-c*Math.cos(n),-c*Math.sin(n),Math.cos(e))}case l._.Z:return(0,i.n)(r,o);default:return}}function H(t,e){const n=(0,i.d)(N,e,t);return(0,i.l)(n)-t[3]}function q(t,e){const n=(0,i.s)(t,e),r=C(t);return n<=r*r}const N=(0,c.vt)(),k=g(),E=Object.freeze(Object.defineProperty({__proto__:null,NullSphere:m,altitudeAt:H,angleToSilhouette:O,axisAt:D,cameraFrustumCoverage:function(t,e,n,r){const o=C(t),i=o*o,c=e+.5*Math.PI,a=n*n+i-2*Math.cos(c)*n*o,s=Math.sqrt(a),u=a-i;if(u<=0)return.5;const l=Math.sqrt(u),d=Math.acos(l/s)-Math.asin(o/(s/Math.sin(c)));return Math.min(1,(d+.5*r)/r)},clear:function(t){t[0]=t[1]=t[2]=t[3]=0},closestPoint:function(t,e,n){return _(t,e,n)?n:((0,d.oC)(e,t,n),F(t,n,n))},closestPointOnSilhouette:P,containsPoint:q,copy:A,create:g,distanceToSilhouette:function(t,e){const n=(0,i.d)(v.rq.get(),e,t),r=(0,i.k)(n),o=t[3]*t[3];return Math.sqrt(Math.abs(r-o))},elevate:function(t,e,n){return t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2]),n[3]=t[3]+e,n},equals:b,exactEquals:p,fromCenterAndRadius:function(t,e){return(0,s.fA)(t[0],t[1],t[2],e)},fromRadius:function(t,e){return t[0]=t[1]=t[2]=0,t[3]=e,t},fromValues:x,getCenter:y,getExtent:function(t,e){return e},getRadius:C,intersectLine:function(t,e,n){const r=(0,d.Cr)(e,n);if(!R(t,r,w))return[];const{origin:o,direction:a}=r,{t0:s,t1:l}=w,h=e=>{const n=(0,c.vt)();return(0,i.b)(n,o,a,e),F(t,n,n)};return Math.abs(s-l)<(0,u.FD)()?[h(s)]:[h(s),h(l)]},intersectRay:_,intersectRayClosestSilhouette:function(t,e,n){if(_(t,e,n))return n;const r=P(t,e,v.rq.get());return(0,i.g)(n,e.origin,(0,i.h)(v.rq.get(),e.direction,(0,i.j)(e.origin,r)/(0,i.l)(e.direction))),n},intersectsRay:T,projectPoint:F,setAltitudeAt:function(t,e,n,r){const o=H(t,e),c=D(t,e,l._.Z,N),a=(0,i.h)(N,c,n-o);return(0,i.g)(r,e,a)},setExtent:function(t,e,n){return t!==n&&A(t,n),n},tmpSphere:k,union:function(t,e,n=(0,s.vt)()){const r=(0,i.j)(t,e),o=t[3],c=e[3];return r+c<o?((0,a.c)(n,t),n):r+o<c?((0,a.c)(n,e),n):((0,i.m)(n,t,e,(r+c-o)/(2*r)),n[3]=(r+o+c)/2,n)},wrap:M},Symbol.toStringTag,{value:"Module"}))},4341:(t,e,n)=>{n.d(e,{I:()=>o});var r=n(26390);class o{constructor(t){this._allocator=t,this._items=[],this._itemsPtr=0,this._grow()}get(){return 0===this._itemsPtr&&(0,r.d)((()=>this._reset())),this._itemsPtr===this._items.length&&this._grow(),this._items[this._itemsPtr++]}_reset(){const t=Math.min(3*Math.max(8,this._itemsPtr),this._itemsPtr+3*i);this._items.length=Math.min(t,this._items.length),this._itemsPtr=0}_grow(){for(let t=0;t<Math.max(8,Math.min(this._items.length,i));t++)this._items.push(this._allocator())}}const i=1024},40804:(t,e,n)=>{n.d(e,{U:()=>o});var r=n(34727);function o(t,e,n=0){const o=(0,r.qE)(t,0,a);for(let t=0;t<4;t++)e[n+t]=Math.floor(256*s(o*i[t]))}const i=[1,256,65536,16777216],c=[1/256,1/65536,1/16777216,1/4294967296],a=function(t,e=0){let n=0;for(let r=0;r<4;r++)n+=t[e+r]*c[r];return n}(new Uint8ClampedArray([255,255,255,255]));function s(t){return t-Math.floor(t)}},65806:(t,e,n)=>{n.d(e,{g:()=>c});var r=n(51850),o=n(57251),i=n(9762);function c(t,e,n,r){if((0,o.canProjectWithoutEngine)(t.spatialReference,n)){a[0]=t.x,a[1]=t.y;const o=t.z;return a[2]=o??r??0,(0,i.projectBuffer)(a,t.spatialReference,0,e,n,0)}const c=(0,o.tryProjectWithZConversion)(t,n);return!!c&&(e[0]=c?.x,e[1]=c?.y,e[2]=c?.z??r??0,!0)}const a=(0,r.vt)()},27993:(t,e,n)=>{n.d(e,{F:()=>i}),n(57251);var r=n(16930),o=n(65806);function i(t,e,n,r,i){return!(null==e||null==r||t.length<2)&&(c.x=t[0],c.y=t[1],c.z=t[2],c.spatialReference=e,(0,o.g)(c,n,r,i))}const c=function(t,e,n,r){return{x:0,y:0,z:0,hasZ:!0,hasM:!1,spatialReference:r,type:"point"}}(0,0,0,r.A.WGS84)},71351:(t,e,n)=>{n.d(e,{C:()=>d,Cr:()=>h,LV:()=>l,kb:()=>f,oC:()=>v,vt:()=>s}),n(4576);var r=n(4341),o=(n(77690),n(29242)),i=n(38954),c=n(51850),a=n(32114);function s(t){return t?u((0,c.o8)(t.origin),(0,c.o8)(t.direction)):u((0,c.vt)(),(0,c.vt)())}function u(t,e){return{origin:t,direction:e}}function l(t,e){const n=m.get();return n.origin=t,n.direction=e,n}function d(t,e=s()){return function(t,e,n=s()){return(0,i.c)(n.origin,t),(0,i.c)(n.direction,e),n}(t.origin,t.direction,e)}function h(t,e,n=s()){return(0,i.c)(n.origin,t),(0,i.d)(n.direction,e,t),n}function f(t,e){const n=(0,i.e)(a.rq.get(),(0,i.n)(a.rq.get(),t.direction),(0,i.d)(a.rq.get(),e,t.origin));return(0,i.f)(n,n)}function v(t,e,n){const r=(0,i.f)(t.direction,(0,i.d)(n,e,t.origin));return(0,i.g)(n,t.origin,(0,i.h)(n,t.direction,r)),n}const m=new r.I((()=>s()));(0,c.vt)(),(0,c.vt)(),(0,c.vt)(),(0,o.vt)()},66104:(t,e,n)=>{var r,o;n.d(e,{k5:()=>r}),n(34727),(o=r||(r={}))[o.Multiply=1]="Multiply",o[o.Ignore=2]="Ignore",o[o.Replace=3]="Replace",o[o.Tint=4]="Tint"},42583:(t,e,n)=>{n.d(e,{A:()=>i});var r=n(66104),o=n(31821);function i(t){t.vertex.code.add(o.H`
    vec4 decodeSymbolColor(vec4 symbolColor, out int colorMixMode) {
      float symbolAlpha = 0.0;

      const float maxTint = 85.0;
      const float maxReplace = 170.0;
      const float scaleAlpha = 3.0;

      if (symbolColor.a > maxReplace) {
        colorMixMode = ${o.H.int(r.k5.Multiply)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxReplace);
      } else if (symbolColor.a > maxTint) {
        colorMixMode = ${o.H.int(r.k5.Replace)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxTint);
      } else if (symbolColor.a > 0.0) {
        colorMixMode = ${o.H.int(r.k5.Tint)};
        symbolAlpha = scaleAlpha * symbolColor.a;
      } else {
        colorMixMode = ${o.H.int(r.k5.Multiply)};
        symbolAlpha = 0.0;
      }

      return vec4(symbolColor.r, symbolColor.g, symbolColor.b, symbolAlpha);
    }
  `)}},49255:(t,e,n)=>{var r;function o(t){return t===r.Shadow||t===r.ShadowHighlight||t===r.ShadowExcludeHighlight||t===r.ViewshedShadow}function i(t){return function(t){return function(t){return s(t)||a(t)}(t)||d(t)}(t)||t===r.Normal}function c(t){return function(t){return l(t)||d(t)}(t)||t===r.Normal}function a(t){return t===r.Highlight||t===r.ObjectAndLayerIdColor}function s(t){return t===r.Color}function u(t){return s(t)||h(t)}function l(t){return u(t)||a(t)}function d(t){return t===r.Depth}function h(t){return t===r.ColorEmission}n.d(e,{LG:()=>h,Mb:()=>l,PJ:()=>o,RN:()=>u,V:()=>r,XY:()=>i,iq:()=>c}),function(t){t[t.Color=0]="Color",t[t.ColorEmission=1]="ColorEmission",t[t.Depth=2]="Depth",t[t.Normal=3]="Normal",t[t.Shadow=4]="Shadow",t[t.ShadowHighlight=5]="ShadowHighlight",t[t.ShadowExcludeHighlight=6]="ShadowExcludeHighlight",t[t.ViewshedShadow=7]="ViewshedShadow",t[t.Highlight=8]="Highlight",t[t.ObjectAndLayerIdColor=9]="ObjectAndLayerIdColor",t[t.COUNT=10]="COUNT"}(r||(r={}))},96336:(t,e,n)=>{n.d(e,{W:()=>r,Y:()=>s});var r,o,i=n(21818),c=n(31821),a=n(46540);function s(t,e){switch(e.normalType){case r.Compressed:t.attributes.add(a.r.NORMALCOMPRESSED,"vec2"),t.vertex.code.add(c.H`vec3 decompressNormal(vec2 normal) {
float z = 1.0 - abs(normal.x) - abs(normal.y);
return vec3(normal + sign(normal) * min(z, 0.0), z);
}
vec3 normalModel() {
return decompressNormal(normalCompressed);
}`);break;case r.Attribute:t.attributes.add(a.r.NORMAL,"vec3"),t.vertex.code.add(c.H`vec3 normalModel() {
return normal;
}`);break;case r.ScreenDerivative:t.fragment.code.add(c.H`vec3 screenDerivativeNormal(vec3 positionView) {
return normalize(cross(dFdx(positionView), dFdy(positionView)));
}`);break;default:(0,i.Xb)(e.normalType);case r.COUNT:}}(o=r||(r={}))[o.Attribute=0]="Attribute",o[o.Compressed=1]="Compressed",o[o.ScreenDerivative=2]="ScreenDerivative",o[o.COUNT=3]="COUNT"},26425:(t,e,n)=>{n.d(e,{u:()=>o});var r=n(31821);function o({code:t},e){e.doublePrecisionRequiresObfuscation?t.add(r.H`vec3 dpPlusFrc(vec3 a, vec3 b) {
return mix(a, a + b, vec3(notEqual(b, vec3(0))));
}
vec3 dpMinusFrc(vec3 a, vec3 b) {
return mix(vec3(0), a - b, vec3(notEqual(a, b)));
}
vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 t1 = dpPlusFrc(hiA, hiB);
vec3 e = dpMinusFrc(t1, hiA);
vec3 t2 = dpMinusFrc(hiB, e) + dpMinusFrc(hiA, dpMinusFrc(t1, e)) + loA + loB;
return t1 + t2;
}`):t.add(r.H`vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
vec3 t1 = hiA + hiB;
vec3 e = t1 - hiA;
vec3 t2 = ((hiB - e) + (hiA - (t1 - e))) + loA + loB;
return t1 + t2;
}`)}},26835:(t,e,n)=>{n.d(e,{W:()=>o});var r=n(31821);function o(t){t.code.add(r.H`const float MAX_RGBA_FLOAT =
255.0 / 256.0 +
255.0 / 256.0 / 256.0 +
255.0 / 256.0 / 256.0 / 256.0 +
255.0 / 256.0 / 256.0 / 256.0 / 256.0;
const vec4 FIXED_POINT_FACTORS = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
vec4 float2rgba(const float value) {
float valueInValidDomain = clamp(value, 0.0, MAX_RGBA_FLOAT);
vec4 fixedPointU8 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);
const float toU8AsFloat = 1.0 / 255.0;
return fixedPointU8 * toU8AsFloat;
}`),t.code.add(r.H`const vec4 RGBA_TO_FLOAT_FACTORS = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgbaTofloat(vec4 rgba) {
return dot(rgba, RGBA_TO_FLOAT_FACTORS);
}`),t.code.add(r.H`const vec4 uninterpolatedRGBAToFloatFactors = vec4(
1.0 / 256.0,
1.0 / 256.0 / 256.0,
1.0 / 256.0 / 256.0 / 256.0,
1.0 / 256.0 / 256.0 / 256.0 / 256.0
);
float uninterpolatedRGBAToFloat(vec4 rgba) {
return (dot(round(rgba * 255.0), uninterpolatedRGBAToFloatFactors) - 0.5) * 2.0;
}`)}},40710:(t,e,n)=>{n.d(e,{W:()=>i});var r=n(69270),o=n(74333);class i extends o.n{constructor(t,e){super(t,"vec3",r.c.Draw,((n,r,o,i)=>n.setUniform3fv(t,e(r,o,i))))}}},33079:(t,e,n)=>{n.d(e,{t:()=>i});var r=n(69270),o=n(74333);class i extends o.n{constructor(t,e){super(t,"vec3",r.c.Pass,((n,r,o)=>n.setUniform3fv(t,e(r,o))))}}},81961:(t,e,n)=>{n.d(e,{V:()=>i});var r=n(69270),o=n(74333);class i extends o.n{constructor(t,e){super(t,"vec4",r.c.Draw,((n,r,o)=>n.setUniform4fv(t,e(r,o))))}}},98353:(t,e,n)=>{n.d(e,{h:()=>i});var r=n(69270),o=n(74333);class i extends o.n{constructor(t,e){super(t,"mat3",r.c.Draw,((n,r,o)=>n.setUniformMatrix3fv(t,e(r,o))))}}},35644:(t,e,n)=>{n.d(e,{k:()=>i});var r=n(69270),o=n(74333);class i extends o.n{constructor(t,e){super(t,"mat3",r.c.Pass,((n,r,o)=>n.setUniformMatrix3fv(t,e(r,o))))}}},58029:(t,e,n)=>{n.d(e,{F:()=>i});var r=n(69270),o=n(74333);class i extends o.n{constructor(t,e){super(t,"mat4",r.c.Bind,((n,r)=>n.setUniformMatrix4fv(t,e(r))))}}},15976:(t,e,n)=>{n.d(e,{o:()=>i});var r=n(69270),o=n(74333);class i extends o.n{constructor(t,e){super(t,"sampler2D",r.c.Draw,((n,r,o)=>n.bindTexture(t,e(r,o))))}}},31821:(t,e,n)=>{function r(t,...e){let n="";for(let r=0;r<e.length;r++)n+=t[r]+e[r];return n+=t[t.length-1],n}function o(t,e,n=""){return t?e:n}n.d(e,{H:()=>r,If:()=>o}),function(t){t.int=function(t){return Math.round(t).toString()},t.float=function(t){return t.toPrecision(8)}}(r)},16943:(t,e,n)=>{n.d(e,{E:()=>o});var r=n(44208);function o(){return!!(0,r.A)("enable-feature:objectAndLayerId-rendering")}},69270:(t,e,n)=>{var r;n.d(e,{c:()=>r}),function(t){t[t.Bind=0]="Bind",t[t.Pass=1]="Pass",t[t.Draw=2]="Draw"}(r||(r={}))},74333:(t,e,n)=>{n.d(e,{n:()=>o}),n(44208);var r=n(69270);class o{constructor(t,e,n,o,i=null){if(this.name=t,this.type=e,this.arraySize=i,this.bind={[r.c.Bind]:null,[r.c.Pass]:null,[r.c.Draw]:null},o)switch(n){case void 0:break;case r.c.Bind:this.bind[r.c.Bind]=o;break;case r.c.Pass:this.bind[r.c.Pass]=o;break;case r.c.Draw:this.bind[r.c.Draw]=o}}equals(t){return this.type===t.type&&this.name===t.name&&this.arraySize===t.arraySize}}}}]);