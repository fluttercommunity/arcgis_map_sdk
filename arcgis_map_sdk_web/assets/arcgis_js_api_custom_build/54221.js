"use strict";(self.webpackChunkarcgis_webpack01=self.webpackChunkarcgis_webpack01||[]).push([[54221],{19870:(e,t,i)=>{i.d(t,{L:()=>v,b:()=>_});var n=i(32114),s=i(3308),r=i(36531),a=i(84164),l=i(10767),o=i(80670),c=i(49016),h=i(24603),d=i(20200),p=i(61002),u=i(87621),f=i(21414),g=i(9229);function _(e){const t=new g.kG;t.include(l.j,e);const{vertex:i,fragment:s}=t;i.uniforms.add(new u.g("modelView",((e,{camera:t})=>(0,n.Iu)(P,t.viewMatrix,e.origin))),new p.C("proj",(({camera:e})=>e.projectionMatrix)),new h.p("glowWidth",((e,{camera:t})=>e.glowWidth*t.pixelRatio)),new o.$("pixelToNDC",(({camera:e})=>(0,r.t8)(m,2/e.fullViewport[2],2/e.fullViewport[3])))),t.attributes.add(f.T.START,"vec3"),t.attributes.add(f.T.END,"vec3"),e.spherical&&(t.attributes.add(f.T.START_UP,"vec3"),t.attributes.add(f.T.END_UP,"vec3")),t.attributes.add(f.T.EXTRUDE,"vec2"),t.varyings.add("uv","vec2"),t.varyings.add("vViewStart","vec3"),t.varyings.add("vViewEnd","vec3"),t.varyings.add("vViewSegmentNormal","vec3"),t.varyings.add("vViewStartNormal","vec3"),t.varyings.add("vViewEndNormal","vec3");const a=!e.spherical;return i.main.add(d.H`
    vec3 pos = mix(start, end, extrude.x);

    vec4 viewPos = modelView * vec4(pos, 1);
    vec4 projPos = proj * viewPos;
    vec2 ndcPos = projPos.xy / projPos.w;

    // in planar we hardcode the up vectors to be Z-up */
    ${(0,d.If)(a,d.H`vec3 startUp = vec3(0, 0, 1);`)}
    ${(0,d.If)(a,d.H`vec3 endUp = vec3(0, 0, 1);`)}

    // up vector corresponding to the location of the vertex, selecting either startUp or endUp */
    vec3 up = extrude.y * mix(startUp, endUp, extrude.x);
    vec3 viewUp = (modelView * vec4(up, 0)).xyz;

    vec4 projPosUp = proj * vec4(viewPos.xyz + viewUp, 1);
    vec2 projUp = normalize(projPosUp.xy / projPosUp.w - ndcPos);

    // extrude ndcPos along projUp to the edge of the screen
    vec2 lxy = abs(sign(projUp) - ndcPos);
    ndcPos += length(lxy) * projUp;

    vViewStart = (modelView * vec4(start, 1)).xyz;
    vViewEnd = (modelView * vec4(end, 1)).xyz;

    vec3 viewStartEndDir = vViewEnd - vViewStart;

    vec3 viewStartUp = (modelView * vec4(startUp, 0)).xyz;

    // the normal of the plane that aligns with the segment and the up vector
    vViewSegmentNormal = normalize(cross(viewStartUp, viewStartEndDir));

    // the normal orthogonal to the segment normal and the start up vector
    vViewStartNormal = -normalize(cross(vViewSegmentNormal, viewStartUp));

    // the normal orthogonal to the segment normal and the end up vector
    vec3 viewEndUp = (modelView * vec4(endUp, 0)).xyz;
    vViewEndNormal = normalize(cross(vViewSegmentNormal, viewEndUp));

    // Add enough padding in the X screen space direction for "glow"
    float xPaddingPixels = sign(dot(vViewSegmentNormal, viewPos.xyz)) * (extrude.x * 2.0 - 1.0) * glowWidth;
    ndcPos.x += xPaddingPixels * pixelToNDC.x;

    // uv is used to read back depth to reconstruct the position at the fragment
    uv = ndcPos * 0.5 + 0.5;

    gl_Position = vec4(ndcPos, 0, 1);
  `),s.uniforms.add(new c.z("perScreenPixelRatio",(e=>e.camera.perScreenPixelRatio))),s.code.add(d.H`float planeDistance(vec3 planeNormal, vec3 planeOrigin, vec3 pos) {
return dot(planeNormal, pos - planeOrigin);
}
float segmentDistancePixels(vec3 segmentNormal, vec3 startNormal, vec3 endNormal, vec3 pos, vec3 start, vec3 end) {
float distSegmentPlane = planeDistance(segmentNormal, start, pos);
float distStartPlane = planeDistance(startNormal, start, pos);
float distEndPlane = planeDistance(endNormal, end, pos);
float dist = max(max(distStartPlane, distEndPlane), abs(distSegmentPlane));
float width = fwidth(distSegmentPlane);
float maxPixelDistance = length(pos) * perScreenPixelRatio * 2.0;
float pixelDist = dist / min(width, maxPixelDistance);
return abs(pixelDist);
}`),s.main.add(d.H`fragColor = vec4(0.0);
vec3 dEndStart = vViewEnd - vViewStart;
if (dot(dEndStart, dEndStart) < 1e-5) {
return;
}
vec3 pos;
vec3 normal;
float angleCutoffAdjust;
float depthDiscontinuityAlpha;
if (!laserlineReconstructFromDepth(pos, normal, angleCutoffAdjust, depthDiscontinuityAlpha)) {
return;
}
float distance = segmentDistancePixels(
vViewSegmentNormal,
vViewStartNormal,
vViewEndNormal,
pos,
vViewStart,
vViewEnd
);
vec4 color = laserlineProfile(distance);
float alpha = (1.0 - smoothstep(0.995 - angleCutoffAdjust, 0.999 - angleCutoffAdjust, abs(dot(normal, vViewSegmentNormal))));
fragColor = laserlineOutput(color * alpha * depthDiscontinuityAlpha);`),t}const m=(0,a.Ue)(),P=(0,s.Ue)(),v=Object.freeze(Object.defineProperty({__proto__:null,build:_},Symbol.toStringTag,{value:"Module"}))},15199:(e,t,i)=>{i.d(t,{L:()=>H,b:()=>x,d:()=>E});var n=i(19431),s=i(36531),r=i(84164),a=i(86717),l=i(81095),o=i(56999),c=i(52721),h=i(56215),d=i(69430),p=i(73687),u=i(10767),f=i(55208),g=i(93072),_=i(20998),m=i(43036),P=i(63371),v=i(49016),b=i(24603),w=i(20200),D=i(9229);const E=(0,n.Vl)(6);function x(e){const t=new D.kG;t.include(f.k),t.include(u.j,e);const i=t.fragment;if(e.lineVerticalPlaneEnabled||e.heightManifoldEnabled)if(i.uniforms.add(new b.p("maxPixelDistance",((t,i)=>e.heightManifoldEnabled?2*i.camera.computeScreenPixelSizeAt(t.heightManifoldTarget):2*i.camera.computeScreenPixelSizeAt(t.lineVerticalPlaneSegment.origin)))),i.code.add(w.H`float planeDistancePixels(vec4 plane, vec3 pos) {
float dist = dot(plane.xyz, pos) + plane.w;
float width = fwidth(dist);
dist /= min(width, maxPixelDistance);
return abs(dist);
}`),e.spherical){const e=(e,t,i)=>(0,a.t)(e,t.heightManifoldTarget,i.camera.viewMatrix),t=(e,t)=>(0,a.t)(e,[0,0,0],t.camera.viewMatrix);i.uniforms.add(new P.N("heightManifoldOrigin",((i,n)=>(e(C,i,n),t(T,n),(0,a.d)(T,T,C),(0,a.n)(y,T),y[3]=(0,a.l)(T),y))),new _.d("globalOrigin",(e=>t(C,e))),new b.p("cosSphericalAngleThreshold",((e,t)=>1-Math.max(2,(0,a.j)(t.camera.eye,e.heightManifoldTarget)*t.camera.perRenderPixelRatio)/(0,a.l)(e.heightManifoldTarget)))),i.code.add(w.H`float globeDistancePixels(float posInGlobalOriginLength) {
float dist = abs(posInGlobalOriginLength - heightManifoldOrigin.w);
float width = fwidth(dist);
dist /= min(width, maxPixelDistance);
return abs(dist);
}
float heightManifoldDistancePixels(vec4 heightPlane, vec3 pos) {
vec3 posInGlobalOriginNorm = normalize(globalOrigin - pos);
float cosAngle = dot(posInGlobalOriginNorm, heightManifoldOrigin.xyz);
vec3 posInGlobalOrigin = globalOrigin - pos;
float posInGlobalOriginLength = length(posInGlobalOrigin);
float sphericalDistance = globeDistancePixels(posInGlobalOriginLength);
float planarDistance = planeDistancePixels(heightPlane, pos);
return cosAngle < cosSphericalAngleThreshold ? sphericalDistance : planarDistance;
}`)}else i.code.add(w.H`float heightManifoldDistancePixels(vec4 heightPlane, vec3 pos) {
return planeDistancePixels(heightPlane, pos);
}`);if(e.pointDistanceEnabled&&(i.uniforms.add(new b.p("maxPixelDistance",((e,t)=>2*t.camera.computeScreenPixelSizeAt(e.pointDistanceTarget)))),i.code.add(w.H`float sphereDistancePixels(vec4 sphere, vec3 pos) {
float dist = distance(sphere.xyz, pos) - sphere.w;
float width = fwidth(dist);
dist /= min(width, maxPixelDistance);
return abs(dist);
}`)),e.intersectsLineEnabled&&i.uniforms.add(new v.z("perScreenPixelRatio",(e=>e.camera.perScreenPixelRatio))).code.add(w.H`float lineDistancePixels(vec3 start, vec3 dir, float radius, vec3 pos) {
float dist = length(cross(dir, pos - start)) / (length(pos) * perScreenPixelRatio);
return abs(dist) - radius;
}`),(e.lineVerticalPlaneEnabled||e.intersectsLineEnabled)&&i.code.add(w.H`bool pointIsWithinLine(vec3 pos, vec3 start, vec3 end) {
vec3 dir = end - start;
float t2 = dot(dir, pos - start);
float l2 = dot(dir, dir);
return t2 >= 0.0 && t2 <= l2;
}`),i.main.add(w.H`vec3 pos;
vec3 normal;
float angleCutoffAdjust;
float depthDiscontinuityAlpha;
if (!laserlineReconstructFromDepth(pos, normal, angleCutoffAdjust, depthDiscontinuityAlpha)) {
fragColor = vec4(0.0);
return;
}
vec4 color = vec4(0.0);`),e.heightManifoldEnabled){i.uniforms.add(new g.A("angleCutoff",(e=>V(e))),new P.N("heightPlane",((e,t)=>S(e.heightManifoldTarget,e.renderCoordsHelper.worldUpAtPosition(e.heightManifoldTarget,C),t.camera.viewMatrix))));const t=e.spherical?w.H`normalize(globalOrigin - pos)`:w.H`heightPlane.xyz`;i.main.add(w.H`
      vec2 angleCutoffAdjusted = angleCutoff - angleCutoffAdjust;
      // Fade out laserlines on flat surfaces
      float heightManifoldAlpha = 1.0 - smoothstep(angleCutoffAdjusted.x, angleCutoffAdjusted.y, abs(dot(normal, ${t})));
      vec4 heightManifoldColor = laserlineProfile(heightManifoldDistancePixels(heightPlane, pos));
      color = max(color, heightManifoldColor * heightManifoldAlpha);`)}return e.pointDistanceEnabled&&(i.uniforms.add(new g.A("angleCutoff",(e=>V(e))),new P.N("pointDistanceSphere",((e,t)=>function(e,t){return(0,a.t)((0,p.a)(R),e.pointDistanceOrigin,t.camera.viewMatrix),R[3]=(0,a.j)(e.pointDistanceOrigin,e.pointDistanceTarget),R}(e,t)))),i.main.add(w.H`float pointDistanceSphereDistance = sphereDistancePixels(pointDistanceSphere, pos);
vec4 pointDistanceSphereColor = laserlineProfile(pointDistanceSphereDistance);
float pointDistanceSphereAlpha = 1.0 - smoothstep(angleCutoff.x, angleCutoff.y, abs(dot(normal, normalize(pos - pointDistanceSphere.xyz))));
color = max(color, pointDistanceSphereColor * pointDistanceSphereAlpha);`)),e.lineVerticalPlaneEnabled&&(i.uniforms.add(new g.A("angleCutoff",(e=>V(e))),new P.N("lineVerticalPlane",((e,t)=>function(e,t){const i=(0,h.KU)(e.lineVerticalPlaneSegment,.5,C),n=e.renderCoordsHelper.worldUpAtPosition(i,A),s=(0,a.n)(T,e.lineVerticalPlaneSegment.vector),r=(0,a.e)(C,n,s);return(0,a.n)(r,r),S(e.lineVerticalPlaneSegment.origin,r,t.camera.viewMatrix)}(e,t))),new m.J("lineVerticalStart",((e,t)=>function(e,t){const i=(0,a.c)(C,e.lineVerticalPlaneSegment.origin);return e.renderCoordsHelper.setAltitude(i,0),(0,a.t)(i,i,t.camera.viewMatrix)}(e,t))),new m.J("lineVerticalEnd",((e,t)=>function(e,t){const i=(0,a.g)(C,e.lineVerticalPlaneSegment.origin,e.lineVerticalPlaneSegment.vector);return e.renderCoordsHelper.setAltitude(i,0),(0,a.t)(i,i,t.camera.viewMatrix)}(e,t)))),i.main.add(w.H`if (pointIsWithinLine(pos, lineVerticalStart, lineVerticalEnd)) {
float lineVerticalDistance = planeDistancePixels(lineVerticalPlane, pos);
vec4 lineVerticalColor = laserlineProfile(lineVerticalDistance);
float lineVerticalAlpha = 1.0 - smoothstep(angleCutoff.x, angleCutoff.y, abs(dot(normal, lineVerticalPlane.xyz)));
color = max(color, lineVerticalColor * lineVerticalAlpha);
}`)),e.intersectsLineEnabled&&(i.uniforms.add(new g.A("angleCutoff",(e=>V(e))),new m.J("intersectsLineStart",((e,t)=>(0,a.t)(C,e.lineStartWorld,t.camera.viewMatrix))),new m.J("intersectsLineEnd",((e,t)=>(0,a.t)(C,e.lineEndWorld,t.camera.viewMatrix))),new m.J("intersectsLineDirection",((e,t)=>((0,a.c)(y,e.intersectsLineSegment.vector),y[3]=0,(0,a.n)(C,(0,o.t)(y,y,t.camera.viewMatrix))))),new b.p("intersectsLineRadius",(e=>e.intersectsLineRadius))),i.main.add(w.H`if (pointIsWithinLine(pos, intersectsLineStart, intersectsLineEnd)) {
float intersectsLineDistance = lineDistancePixels(intersectsLineStart, intersectsLineDirection, intersectsLineRadius, pos);
vec4 intersectsLineColor = laserlineProfile(intersectsLineDistance);
float intersectsLineAlpha = 1.0 - smoothstep(angleCutoff.x, angleCutoff.y, 1.0 - abs(dot(normal, intersectsLineDirection)));
color = max(color, intersectsLineColor * intersectsLineAlpha);
}`)),i.main.add(w.H`fragColor = laserlineOutput(color * depthDiscontinuityAlpha);`),t}function V(e){return(0,s.t8)(L,Math.cos(e.angleCutoff),Math.cos(Math.max(0,e.angleCutoff-(0,n.Vl)(2))))}function S(e,t,i){return(0,a.t)(M,e,i),(0,a.c)(y,t),y[3]=0,(0,o.t)(y,y,i),(0,d.Yq)(M,y,U)}const L=(0,r.Ue)(),C=(0,l.Ue)(),y=(0,c.Ue)(),A=(0,l.Ue)(),T=(0,l.Ue)(),M=(0,l.Ue)(),U=(0,d.Ue)(),R=(0,p.c)(),H=Object.freeze(Object.defineProperty({__proto__:null,build:x,defaultAngleCutoff:E},Symbol.toStringTag,{value:"Module"}))},54221:(e,t,i)=>{i.d(t,{W:()=>K});i(39994);var n=i(86717),s=i(81095),r=i(56215),a=i(76169),l=i(36663),o=i(61681),c=i(81977),h=(i(13802),i(4157),i(40266)),d=i(70740),p=i(59934),u=i(97537),f=i(65684),g=i(7590),_=i(25534),m=i(62058),P=i(92570),v=i(95397),b=i(44685),w=i(9969),D=i(62575),E=i(19431),x=i(15199),V=i(86765);class S extends V.K{constructor(){super(...arguments),this.innerColor=(0,s.al)(1,1,1),this.innerWidth=1,this.glowColor=(0,s.al)(1,.5,0),this.glowWidth=8,this.glowFalloff=8,this.globalAlpha=.75,this.globalAlphaContrastBoost=2,this.angleCutoff=(0,E.Vl)(6),this.pointDistanceOrigin=(0,s.Ue)(),this.pointDistanceTarget=(0,s.Ue)(),this.lineVerticalPlaneSegment=(0,r.Ue)(),this.intersectsLineSegment=(0,r.Ue)(),this.intersectsLineRadius=3,this.heightManifoldTarget=(0,s.Ue)(),this.lineStartWorld=(0,s.Ue)(),this.lineEndWorld=(0,s.Ue)()}}class L extends D.A{constructor(e,t){super(e,t,new w.J(x.L,(()=>i.e(14078).then(i.bind(i,14078)))))}}var C=i(21414),y=i(19870);class A extends S{constructor(){super(...arguments),this.origin=(0,s.Ue)()}}class T extends D.A{constructor(e,t){super(e,t,new w.J(y.L,(()=>i.e(36807).then(i.bind(i,36807)))),M)}}const M=new Map([[C.T.START,0],[C.T.END,1],[C.T.EXTRUDE,2],[C.T.START_UP,3],[C.T.END_UP,4]]);var U=i(44125),R=i(78951),H=i(91907);class I{constructor(e){this._renderCoordsHelper=e,this._buffers=null,this._origin=(0,s.Ue)(),this._dirty=!1,this._count=0,this._vao=null}set vertices(e){const t=(0,P.bg)(3*e.length);let i=0;for(const n of e)t[i++]=n[0],t[i++]=n[1],t[i++]=n[2];this.buffers=[t]}set buffers(e){if(this._buffers=e,this._buffers.length>0){const e=this._buffers[0],t=3*Math.floor(e.length/3/2);(0,n.i)(this._origin,e[t],e[t+1],e[t+2])}else(0,n.i)(this._origin,0,0,0);this._dirty=!0}get origin(){return this._origin}draw(e){const t=this._ensureVAO(e);null!=t&&(e.bindVAO(t),e.drawArrays(H.MX.TRIANGLES,0,this._count))}dispose(){null!=this._vao&&this._vao.dispose()}get _layout(){return this._renderCoordsHelper.viewingMode===f.JY.Global?j:z}_ensureVAO(e){return null==this._buffers?null:(this._vao??=this._createVAO(e,this._buffers),this._ensureVertexData(this._vao,this._buffers),this._vao)}_createVAO(e,t){const i=this._createDataBuffer(t);return this._dirty=!1,new U.U(e,M,new Map([["data",(0,v.K)(this._layout)]]),new Map([["data",R.f.createVertex(e,H.l1.STATIC_DRAW,i)]]))}_ensureVertexData(e,t){if(!this._dirty)return;const i=this._createDataBuffer(t);e.vertexBuffers.get("data")?.setData(i),this._dirty=!1}_createDataBuffer(e){const t=e.reduce(((e,t)=>e+O(t)),0);this._count=t;const i=this._layout.createBuffer(t),s=this._origin;let r=0,a=0;const l="startUp"in i?this._setUpVectors.bind(this,i):void 0;for(const t of e){for(let e=0;e<t.length;e+=3){const o=(0,n.i)(N,t[e],t[e+1],t[e+2]);0===e?a=this._renderCoordsHelper.getAltitude(o):this._renderCoordsHelper.setAltitude(o,a);const c=r+2*e;l?.(e,c,t,o);const h=(0,n.d)(N,o,s);if(e<t.length-3){for(let e=0;e<6;e++)i.start.setVec(c+e,h);i.extrude.setValues(c,0,-1),i.extrude.setValues(c+1,1,-1),i.extrude.setValues(c+2,1,1),i.extrude.setValues(c+3,0,-1),i.extrude.setValues(c+4,1,1),i.extrude.setValues(c+5,0,1)}if(e>0)for(let e=-6;e<0;e++)i.end.setVec(c+e,h)}r+=O(t)}return i.buffer}_setUpVectors(e,t,i,n,s){const r=this._renderCoordsHelper.worldUpAtPosition(s,q);if(t<n.length-3)for(let t=0;t<6;t++)e.startUp.setVec(i+t,r);if(t>0)for(let t=-6;t<0;t++)e.endUp.setVec(i+t,r)}}function O(e){return 2*(e.length/3-1)*3}const q=(0,s.Ue)(),N=(0,s.Ue)(),j=(0,b.U$)().vec3f(C.T.START).vec3f(C.T.END).vec2f(C.T.EXTRUDE).vec3f(C.T.START_UP).vec3f(C.T.END_UP),z=(0,b.U$)().vec3f(C.T.START).vec3f(C.T.END).vec2f(C.T.EXTRUDE);var W=i(12907);class X extends W.m{constructor(){super(...arguments),this.contrastControlEnabled=!1,this.spherical=!1}}(0,l._)([(0,W.o)()],X.prototype,"contrastControlEnabled",void 0),(0,l._)([(0,W.o)()],X.prototype,"spherical",void 0);class G extends X{constructor(){super(...arguments),this.heightManifoldEnabled=!1,this.pointDistanceEnabled=!1,this.lineVerticalPlaneEnabled=!1,this.intersectsLineEnabled=!1}}(0,l._)([(0,W.o)()],G.prototype,"heightManifoldEnabled",void 0),(0,l._)([(0,W.o)()],G.prototype,"pointDistanceEnabled",void 0),(0,l._)([(0,W.o)()],G.prototype,"lineVerticalPlaneEnabled",void 0),(0,l._)([(0,W.o)()],G.prototype,"intersectsLineEnabled",void 0);var B=i(70984),J=i(25584),F=i(42199);let k=class extends _.Z{constructor(e){super(e),this.produces=g.CM.LASERLINES,this.consumes={required:[g.CM.LASERLINES,"normals"]},this.requireGeometryDepth=!0,this._configuration=new G,this._pathTechniqueConfiguration=new X,this._heightManifoldEnabled=!1,this._pointDistanceEnabled=!1,this._lineVerticalPlaneEnabled=!1,this._intersectsLineEnabled=!1,this._intersectsLineInfinite=!1,this._pathVerticalPlaneEnabled=!1,this._passParameters=new A;const t=e.view._stage.renderView.techniques,i=new X;i.contrastControlEnabled=e.contrastControlEnabled,t.precompile(T,i)}initialize(){this._passParameters.renderCoordsHelper=this.view.renderCoordsHelper,this._pathTechniqueConfiguration.spherical=this.view.state.viewingMode===f.JY.Global,this._pathTechniqueConfiguration.contrastControlEnabled=this.contrastControlEnabled,this._techniques.precompile(T,this._pathTechniqueConfiguration),this._blit=new m.N(this._techniques,F.J.PremultipliedAlpha)}destroy(){this._pathVerticalPlaneData=(0,o.M2)(this._pathVerticalPlaneData),this._blit=null}get _techniques(){return this.view._stage.renderView.techniques}get heightManifoldEnabled(){return this._heightManifoldEnabled}set heightManifoldEnabled(e){this._heightManifoldEnabled!==e&&(this._heightManifoldEnabled=e,this.requestRender(B.Xx.UPDATE))}get heightManifoldTarget(){return this._passParameters.heightManifoldTarget}set heightManifoldTarget(e){(0,n.c)(this._passParameters.heightManifoldTarget,e),this.requestRender(B.Xx.UPDATE)}get pointDistanceEnabled(){return this._pointDistanceEnabled}set pointDistanceEnabled(e){e!==this._pointDistanceEnabled&&(this._pointDistanceEnabled=e,this.requestRender(B.Xx.UPDATE))}get pointDistanceTarget(){return this._passParameters.pointDistanceTarget}set pointDistanceTarget(e){(0,n.c)(this._passParameters.pointDistanceTarget,e),this.requestRender(B.Xx.UPDATE)}get pointDistanceOrigin(){return this._passParameters.pointDistanceOrigin}set pointDistanceOrigin(e){(0,n.c)(this._passParameters.pointDistanceOrigin,e),this.requestRender(B.Xx.UPDATE)}get lineVerticalPlaneEnabled(){return this._lineVerticalPlaneEnabled}set lineVerticalPlaneEnabled(e){e!==this._lineVerticalPlaneEnabled&&(this._lineVerticalPlaneEnabled=e,this.requestRender(B.Xx.UPDATE))}get lineVerticalPlaneSegment(){return this._passParameters.lineVerticalPlaneSegment}set lineVerticalPlaneSegment(e){(0,r.JG)(e,this._passParameters.lineVerticalPlaneSegment),this.requestRender(B.Xx.UPDATE)}get intersectsLineEnabled(){return this._intersectsLineEnabled}set intersectsLineEnabled(e){e!==this._intersectsLineEnabled&&(this._intersectsLineEnabled=e,this.requestRender(B.Xx.UPDATE))}get intersectsLineSegment(){return this._passParameters.intersectsLineSegment}set intersectsLineSegment(e){(0,r.JG)(e,this._passParameters.intersectsLineSegment),this.requestRender(B.Xx.UPDATE)}get intersectsLineInfinite(){return this._intersectsLineInfinite}set intersectsLineInfinite(e){e!==this._intersectsLineInfinite&&(this._intersectsLineInfinite=e,this.requestRender(B.Xx.UPDATE))}get pathVerticalPlaneEnabled(){return this._pathVerticalPlaneEnabled}set pathVerticalPlaneEnabled(e){e!==this._pathVerticalPlaneEnabled&&(this._pathVerticalPlaneEnabled=e,null!=this._pathVerticalPlaneData&&this.requestRender(B.Xx.UPDATE))}set pathVerticalPlaneVertices(e){null==this._pathVerticalPlaneData&&(this._pathVerticalPlaneData=new I(this._passParameters.renderCoordsHelper)),this._pathVerticalPlaneData.vertices=e,this.pathVerticalPlaneEnabled&&this.requestRender(B.Xx.UPDATE)}set pathVerticalPlaneBuffers(e){null==this._pathVerticalPlaneData&&(this._pathVerticalPlaneData=new I(this._passParameters.renderCoordsHelper)),this._pathVerticalPlaneData.buffers=e,this.pathVerticalPlaneEnabled&&this.requestRender(B.Xx.UPDATE)}setParameters(e){(0,J.LO)(this._passParameters,e)&&this.requestRender(B.Xx.UPDATE)}precompile(){this._acquireTechnique()}render(e){const t=e.find((({name:e})=>e===this.produces));if(!this.bindParameters.decorations||null==this._blit)return t;const i=this.renderingContext,n=e.find((({name:e})=>"normals"===e));this._passParameters.normals=n?.getTexture();const s=()=>{(this.heightManifoldEnabled||this.pointDistanceEnabled||this.lineVerticalPlaneSegment||this.intersectsLineEnabled)&&this._renderUnified(),this.pathVerticalPlaneEnabled&&this._renderPath()};if(!this.contrastControlEnabled)return i.bindFramebuffer(t.fbo),s(),t;this._passParameters.colors=t.getTexture();const r=this.fboCache.acquire(t.fbo.width,t.fbo.height,"laser lines");return i.bindFramebuffer(r.fbo),i.setClearColor(0,0,0,0),i.clear(H.Hf.COLOR|H.Hf.DEPTH),s(),i.unbindTexture(t.getTexture()),this._blit.blend(i,r,t,this.bindParameters)||this.requestRender(B.Xx.UPDATE),r.release(),t}_acquireTechnique(){return this._configuration.heightManifoldEnabled=this.heightManifoldEnabled,this._configuration.lineVerticalPlaneEnabled=this.lineVerticalPlaneEnabled,this._configuration.pointDistanceEnabled=this.pointDistanceEnabled,this._configuration.intersectsLineEnabled=this.intersectsLineEnabled,this._configuration.contrastControlEnabled=this.contrastControlEnabled,this._configuration.spherical=this.view.state.viewingMode===f.JY.Global,this._techniques.get(L,this._configuration)}_renderUnified(){if(!this._updatePassParameters())return;const e=this._acquireTechnique();if(e.compiled){const t=this.renderingContext;t.bindTechnique(e,this.bindParameters,this._passParameters),t.screen.draw()}else this.requestRender(B.Xx.UPDATE)}_renderPath(){if(null==this._pathVerticalPlaneData)return;const e=this._techniques.get(T,this._pathTechniqueConfiguration);if(e.compiled){const t=this.renderingContext;this._passParameters.origin=this._pathVerticalPlaneData.origin,t.bindTechnique(e,this.bindParameters,this._passParameters),this._pathVerticalPlaneData.draw(t)}else this.requestRender(B.Xx.UPDATE)}_updatePassParameters(){if(!this._intersectsLineEnabled)return!0;const e=this.bindParameters.camera,t=this._passParameters;if(this._intersectsLineInfinite){if((0,d.iL)((0,u.re)(t.intersectsLineSegment.origin,t.intersectsLineSegment.vector),$),$.c0=-Number.MAX_VALUE,!(0,p.zq)(e.frustum,$))return!1;(0,d.Ws)($,t.lineStartWorld),(0,d.S$)($,t.lineEndWorld)}else(0,n.c)(t.lineStartWorld,t.intersectsLineSegment.origin),(0,n.g)(t.lineEndWorld,t.intersectsLineSegment.origin,t.intersectsLineSegment.vector);return!0}get test(){}};(0,l._)([(0,c.Cb)({constructOnly:!0})],k.prototype,"contrastControlEnabled",void 0),(0,l._)([(0,c.Cb)({constructOnly:!0})],k.prototype,"isDecoration",void 0),(0,l._)([(0,c.Cb)()],k.prototype,"produces",void 0),(0,l._)([(0,c.Cb)()],k.prototype,"consumes",void 0),k=(0,l._)([(0,h.j)("esri.views.3d.webgl-engine.effects.laserlines.LaserLineRenderer")],k);const $=(0,d.Ue)();class K extends a.l{constructor(e){super(e),this._angleCutoff=x.d,this._style={},this._heightManifoldTarget=(0,s.Ue)(),this._heightManifoldEnabled=!1,this._intersectsLine=(0,r.Ue)(),this._intersectsLineEnabled=!1,this._intersectsLineInfinite=!1,this._lineVerticalPlaneSegment=null,this._pathVerticalPlaneBuffers=null,this._pointDistanceLine=null,this.applyProperties(e)}get testData(){}createResources(){this._ensureRenderer()}destroyResources(){this._disposeRenderer()}updateVisibility(){this._syncRenderer(),this._syncHeightManifold(),this._syncIntersectsLine(),this._syncPathVerticalPlane(),this._syncLineVerticalPlane(),this._syncPointDistance()}get angleCutoff(){return this._angleCutoff}set angleCutoff(e){this._angleCutoff!==e&&(this._angleCutoff=e,this._syncAngleCutoff())}get style(){return this._style}set style(e){this._style=e,this._syncStyle()}get heightManifoldTarget(){return this._heightManifoldEnabled?this._heightManifoldTarget:null}set heightManifoldTarget(e){null!=e?((0,n.c)(this._heightManifoldTarget,e),this._heightManifoldEnabled=!0):this._heightManifoldEnabled=!1,this._syncRenderer(),this._syncHeightManifold()}set intersectsWorldUpAtLocation(e){if(null==e)return void(this.intersectsLine=null);const t=this.view.renderCoordsHelper.worldUpAtPosition(e,Y);this.intersectsLine=(0,r.al)(e,t),this.intersectsLineInfinite=!0}get intersectsLine(){return this._intersectsLineEnabled?this._intersectsLine:null}set intersectsLine(e){null!=e?((0,r.JG)(e,this._intersectsLine),this._intersectsLineEnabled=!0):this._intersectsLineEnabled=!1,this._syncIntersectsLine(),this._syncRenderer()}get intersectsLineInfinite(){return this._intersectsLineInfinite}set intersectsLineInfinite(e){this._intersectsLineInfinite=e,this._syncIntersectsLineInfinite()}get lineVerticalPlaneSegment(){return this._lineVerticalPlaneSegment}set lineVerticalPlaneSegment(e){this._lineVerticalPlaneSegment=null!=e?(0,r.JG)(e):null,this._syncLineVerticalPlane(),this._syncRenderer()}get pathVerticalPlane(){return this._pathVerticalPlaneBuffers}set pathVerticalPlane(e){this._pathVerticalPlaneBuffers=e,this._syncPathVerticalPlane(),this._syncLineVerticalPlane(),this._syncPointDistance(),this._syncRenderer()}get pointDistanceLine(){return this._pointDistanceLine}set pointDistanceLine(e){this._pointDistanceLine=null!=e?{origin:(0,s.d9)(e.origin),target:e.target?(0,s.d9)(e.target):null}:null,this._syncPointDistance(),this._syncRenderer()}_syncRenderer(){this.attached&&this.visible&&(this._intersectsLineEnabled||this._heightManifoldEnabled||null!=this._pointDistanceLine||null!=this._pathVerticalPlaneBuffers)?this._ensureRenderer():this._disposeRenderer()}_ensureRenderer(){null==this._renderer&&(this._renderer=new k({view:this.view,contrastControlEnabled:!0,isDecoration:this.isDecoration}),this._syncStyle(),this._syncHeightManifold(),this._syncIntersectsLine(),this._syncIntersectsLineInfinite(),this._syncPathVerticalPlane(),this._syncLineVerticalPlane(),this._syncPointDistance(),this._syncAngleCutoff())}_syncStyle(){null!=this._renderer&&this._renderer.setParameters(this._style)}_syncAngleCutoff(){this._renderer?.setParameters({angleCutoff:this._angleCutoff})}_syncHeightManifold(){null!=this._renderer&&(this._renderer.heightManifoldEnabled=this._heightManifoldEnabled&&this.visible,this._heightManifoldEnabled&&(this._renderer.heightManifoldTarget=this._heightManifoldTarget))}_syncIntersectsLine(){null!=this._renderer&&(this._renderer.intersectsLineEnabled=this._intersectsLineEnabled&&this.visible,this._intersectsLineEnabled&&(this._renderer.intersectsLineSegment=this._intersectsLine))}_syncIntersectsLineInfinite(){null!=this._renderer&&(this._renderer.intersectsLineInfinite=this._intersectsLineInfinite)}_syncPathVerticalPlane(){null!=this._renderer&&(this._renderer.pathVerticalPlaneEnabled=null!=this._pathVerticalPlaneBuffers&&this.visible,null!=this._pathVerticalPlaneBuffers&&(this._renderer.pathVerticalPlaneBuffers=this._pathVerticalPlaneBuffers))}_syncLineVerticalPlane(){null!=this._renderer&&(this._renderer.lineVerticalPlaneEnabled=null!=this._lineVerticalPlaneSegment&&this.visible,null!=this._lineVerticalPlaneSegment&&(this._renderer.lineVerticalPlaneSegment=this._lineVerticalPlaneSegment))}_syncPointDistance(){if(null==this._renderer)return;const e=this._pointDistanceLine,t=null!=e;this._renderer.pointDistanceEnabled=t&&null!=e.target&&this.visible,t&&(this._renderer.pointDistanceOrigin=e.origin,null!=e.target&&(this._renderer.pointDistanceTarget=e.target))}_disposeRenderer(){null!=this._renderer&&this.view._stage&&(this._renderer.destroy(),this._renderer=null)}}const Y=(0,s.Ue)()},10767:(e,t,i)=>{i.d(t,{j:()=>h});var n=i(31227),s=i(77334),r=i(43036),a=i(24603),l=i(20200),o=i(99126),c=i(15176);function h(e,t){const i=e.fragment;i.include(n.K),e.include(s.GZ),i.uniforms.add(new a.p("globalAlpha",(e=>e.globalAlpha)),new r.J("glowColor",(e=>e.glowColor)),new a.p("glowWidth",((e,t)=>e.glowWidth*t.camera.pixelRatio)),new a.p("glowFalloff",(e=>e.glowFalloff)),new r.J("innerColor",(e=>e.innerColor)),new a.p("innerWidth",((e,t)=>e.innerWidth*t.camera.pixelRatio)),new o.e("depthMap",(e=>e.depth?.attachment)),new c.A("normalMap",(e=>e.normals))),i.code.add(l.H`vec4 blendPremultiplied(vec4 source, vec4 dest) {
float oneMinusSourceAlpha = 1.0 - source.a;
return vec4(
source.rgb + dest.rgb * oneMinusSourceAlpha,
source.a + dest.a * oneMinusSourceAlpha
);
}`),i.code.add(l.H`vec4 premultipliedColor(vec3 rgb, float alpha) {
return vec4(rgb * alpha, alpha);
}`),i.code.add(l.H`vec4 laserlineProfile(float dist) {
if (dist > glowWidth) {
return vec4(0.0);
}
float innerAlpha = (1.0 - smoothstep(0.0, innerWidth, dist));
float glowAlpha = pow(max(0.0, 1.0 - dist / glowWidth), glowFalloff);
return blendPremultiplied(
premultipliedColor(innerColor, innerAlpha),
premultipliedColor(glowColor, glowAlpha)
);
}`),i.code.add(l.H`bool laserlineReconstructFromDepth(out vec3 pos, out vec3 normal, out float angleCutoffAdjust, out float depthDiscontinuityAlpha) {
float depth = depthFromTexture(depthMap, uv);
if (depth == 1.0) {
return false;
}
float linearDepth = linearizeDepth(depth);
pos = reconstructPosition(gl_FragCoord.xy, linearDepth);
float minStep = 6e-8;
float depthStep = clamp(depth + minStep, 0.0, 1.0);
float linearDepthStep = linearizeDepth(depthStep);
float depthError = abs(linearDepthStep - linearDepth);
if (depthError > 0.2) {
normal = texture(normalMap, uv).xyz * 2.0 - 1.0;
angleCutoffAdjust = 0.004;
} else {
normal = normalize(cross(dFdx(pos), dFdy(pos)));
angleCutoffAdjust = 0.0;
}
float ddepth = fwidth(linearDepth);
depthDiscontinuityAlpha = 1.0 - smoothstep(0.0, 0.01, -ddepth / linearDepth);
return true;
}`),t.contrastControlEnabled?i.uniforms.add(new c.A("frameColor",((e,t)=>e.colors)),new a.p("globalAlphaContrastBoost",(e=>e.globalAlphaContrastBoost))).code.add(l.H`float rgbToLuminance(vec3 color) {
return dot(vec3(0.2126, 0.7152, 0.0722), color);
}
vec4 laserlineOutput(vec4 color) {
float backgroundLuminance = rgbToLuminance(texture(frameColor, uv).rgb);
float alpha = clamp(globalAlpha * max(backgroundLuminance * globalAlphaContrastBoost, 1.0), 0.0, 1.0);
return color * alpha;
}`):i.code.add(l.H`vec4 laserlineOutput(vec4 color) {
return color * globalAlpha;
}`)}}}]);