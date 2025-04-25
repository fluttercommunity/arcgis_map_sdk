"use strict";(self.webpackChunkRemoteClient=self.webpackChunkRemoteClient||[]).push([[2728],{28491:(e,t,r)=>{r.d(t,{D:()=>z,b:()=>G});var i=r(46686),n=r(32680),o=r(49255),a=r(76591),s=r(76597),c=r(82991),l=r(96336),d=r(10764),u=r(71955),h=r(53466),m=r(92700),f=r(72824),p=r(35640),v=r(40261),g=r(77695),_=r(54849),T=r(74081),x=r(98619),A=r(62602),b=r(22393),E=r(59469),S=r(25618),M=r(96598),C=r(51406),R=r(42398),w=r(11955),I=r(27950),O=r(20693),N=r(33079),y=r(71988),P=r(20304),L=r(31821),D=r(63761),H=r(46540),F=r(60517),B=r(14113),U=r(49788);function G(e){const t=new B.N5,{vertex:r,fragment:G,varyings:z}=t,{output:V,normalType:W,offsetBackfaces:j,instancedColor:k,spherical:Y,receiveShadows:q,snowCover:$,pbrMode:X,textureAlphaPremultiplied:Z,instancedDoublePrecision:J,hasVertexColors:K,hasVertexTangents:Q,hasColorTexture:ee,hasNormalTexture:te,hasNormalTextureTransform:re,hasColorTextureTransform:ie}=e;if((0,O.NB)(r,e),t.include(d.I),z.add("vpos","vec3"),t.include(R.A,e),t.include(c.B,e),t.include(p.G,e),t.include(C.q2,e),!(0,o.RN)(V))return t.include(v.E,e),t;t.include(C.Sx,e),t.include(C.MU,e),t.include(C.O1,e),t.include(C.QM,e),(0,O.yu)(r,e),t.include(l.Y,e),t.include(s.d,e);const ne=W===l.W.Attribute||W===l.W.Compressed;return ne&&j&&t.include(n.M),t.include(g.W,e),t.include(f.Mh,e),k&&t.attributes.add(H.r.INSTANCECOLOR,"vec4"),z.add("vPositionLocal","vec3"),t.include(h.U,e),t.include(i.oD,e),t.include(u.K,e),t.include(m.c,e),r.uniforms.add(new y.E("externalColor",(e=>e.externalColor))),z.add("vcolorExt","vec4"),t.include(M.Z,e),r.main.add(L.H`
    forwardNormalizedVertexColor();
    vcolorExt = externalColor;
    ${(0,L.If)(k,"vcolorExt *= instanceColor * 0.003921568627451;")}
    vcolorExt *= vvColor();
    vcolorExt *= getSymbolColor();
    forwardColorMixMode();

    vpos = getVertexInLocalOriginSpace();
    vPositionLocal = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    ${(0,L.If)(ne,"vNormalWorld = dpNormal(vvLocalNormal(normalModel()));")}
    vpos = addVerticalOffset(vpos, localOrigin);
    ${(0,L.If)(Q,"vTangent = dpTransformVertexTangent(tangent);")}
    gl_Position = transformPosition(proj, view, vpos);
    ${(0,L.If)(ne&&j,"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);")}

    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    forwardLinearDepth();
    forwardTextureCoordinates();
    forwardColorUV();
    forwardNormalUV();
    forwardEmissiveUV();
    forwardOcclusionUV();
    forwardMetallicRoughnessUV();

    if (vcolorExt.a < ${L.H.float(U.Q)}) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
    }
  `),t.include(T.kA,e),t.include(_.n,e),t.include(w.S,e),t.include(J?S.G:S.Bz,e),t.fragment.include(a.HQ,e),t.include(F.z,e),(0,O.yu)(G,e),G.uniforms.add(r.uniforms.get("localOrigin"),new N.t("ambient",(e=>e.ambient)),new N.t("diffuse",(e=>e.diffuse)),new P.m("opacity",(e=>e.opacity)),new P.m("layerOpacity",(e=>e.layerOpacity))),ee&&G.uniforms.add(new D.N("tex",(e=>e.texture))),t.include(E._Z,e),t.include(b.c,e),G.include(I.N),t.include(A.r,e),(0,T.a8)(G),(0,T.eU)(G),(0,x.O4)(G),G.main.add(L.H`
    discardBySlice(vpos);
    discardByTerrainDepth();
    ${ee?L.H`
            vec4 texColor = texture(tex, ${ie?"colorUV":"vuv0"});
            ${(0,L.If)(Z,"texColor.rgb /= texColor.a;")}
            discardOrAdjustAlpha(texColor);`:L.H`vec4 texColor = vec4(1.0);`}
    shadingParams.viewDirection = normalize(vpos - cameraPosition);
    ${W===l.W.ScreenDerivative?L.H`vec3 normal = screenDerivativeNormal(vPositionLocal);`:L.H`shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

    vec3 posWorld = vpos + localOrigin;

      float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
      float shadow = ${q?"max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth))":(0,L.If)(Y,"lightingGlobalFactor * (1.0 - additionalAmbientScale)","0.0")};

    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(${(0,L.If)(K,"vColor.rgb *")} matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
    float opacity_ = layerOpacity * mixExternalOpacity(${(0,L.If)(K,"vColor.a * ")} opacity, texColor.a, vcolorExt.a, int(colorMixMode));
    ${te?`mat3 tangentSpace = computeTangentSpace(${Q?"normal":"normal, vpos, vuv0"});\n            vec3 shadingNormal = computeTextureNormal(tangentSpace, ${re?"normalUV":"vuv0"});`:"vec3 shadingNormal = normal;"}
    vec3 normalGround = ${Y?"normalize(posWorld);":"vec3(0.0, 0.0, 1.0);"}

    ${(0,L.If)($,L.H`
          float snow = smoothstep(0.5, 0.55, dot(normal, normalGround));
          albedo = mix(albedo, vec3(1), snow);
          shadingNormal = mix(shadingNormal, normal, snow);
          ssao = mix(ssao, 1.0, snow);`)}

    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

    ${X===E.A9.Normal||X===E.A9.Schematic?L.H`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            ${(0,L.If)($,L.H`mrr = mix(mrr, vec3(0.0, 1.0, 0.04), snow);`)}
            vec4 emission = ${$?"mix(getEmissions(), vec4(0.0), snow)":"getEmissions()"};
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:L.H`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOID(finalColor, vpos);
  `),t}const z=Object.freeze(Object.defineProperty({__proto__:null,build:G},Symbol.toStringTag,{value:"Module"}))},57323:(e,t,r)=>{r.d(t,{R:()=>F,b:()=>H});var i=r(46686),n=r(32680),o=r(49255),a=r(76591),s=r(76597),c=r(82991),l=r(96336),d=r(10764),u=r(71955),h=r(53466),m=r(92700),f=r(35640),p=r(40261),v=r(54849),g=r(74081),_=r(98619),T=r(22393),x=r(59469),A=r(25618),b=r(96598),E=r(42398),S=r(11955),M=r(27950),C=r(20693),R=r(33079),w=r(71988),I=r(20304),O=r(31821),N=r(63761),y=r(46540),P=r(60517),L=r(14113),D=r(49788);function H(e){const t=new L.N5,{vertex:r,fragment:H,varyings:F}=t,{output:B,offsetBackfaces:U,instancedColor:G,pbrMode:z,snowCover:V,spherical:W}=e,j=z===x.A9.Normal||z===x.A9.Schematic;if((0,C.NB)(r,e),t.include(d.I),F.add("vpos","vec3"),t.include(E.A,e),t.include(c.B,e),t.include(f.G,e),t.include(b.Z,e),(0,o.RN)(B)&&((0,C.yu)(t.vertex,e),t.include(l.Y,e),t.include(s.d,e),U&&t.include(n.M),G&&t.attributes.add(y.r.INSTANCECOLOR,"vec4"),F.add("vNormalWorld","vec3"),F.add("localvpos","vec3"),t.include(h.U,e),t.include(i.oD,e),t.include(u.K,e),t.include(m.c,e),r.uniforms.add(new w.E("externalColor",(e=>e.externalColor))),F.add("vcolorExt","vec4"),r.main.add(O.H`
      forwardNormalizedVertexColor();
      vcolorExt = externalColor;
      ${(0,O.If)(G,"vcolorExt *= instanceColor * 0.003921568627451;")}
      vcolorExt *= vvColor();
      vcolorExt *= getSymbolColor();
      forwardColorMixMode();

      bool alphaCut = vcolorExt.a < ${O.H.float(D.Q)};
      vpos = getVertexInLocalOriginSpace();
      localvpos = vpos - view[3].xyz;
      vpos = subtractOrigin(vpos);
      vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
      vpos = addVerticalOffset(vpos, localOrigin);
      vec4 basePosition = transformPosition(proj, view, vpos);

      forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
      forwardLinearDepth();
      forwardTextureCoordinates();

      gl_Position = alphaCut ? vec4(1e38, 1e38, 1e38, 1.0) :
      ${(0,O.If)(U,"offsetBackfacingClipPosition(basePosition, vpos, vNormalWorld, cameraPosition);","basePosition;")}
    `)),(0,o.RN)(B)){const{hasColorTexture:i,hasColorTextureTransform:n,receiveShadows:o}=e;t.include(g.kA,e),t.include(v.n,e),t.include(S.S,e),t.include(e.instancedDoublePrecision?A.G:A.Bz,e),t.fragment.include(a.HQ,e),t.include(P.z,e),(0,C.yu)(t.fragment,e),(0,_.Gc)(H),(0,g.a8)(H),(0,g.eU)(H),H.uniforms.add(r.uniforms.get("localOrigin"),r.uniforms.get("view"),new R.t("ambient",(e=>e.ambient)),new R.t("diffuse",(e=>e.diffuse)),new I.m("opacity",(e=>e.opacity)),new I.m("layerOpacity",(e=>e.layerOpacity))),i&&H.uniforms.add(new N.N("tex",(e=>e.texture))),t.include(x._Z,e),t.include(T.c,e),H.include(M.N),(0,_.O4)(H),H.main.add(O.H`
      discardBySlice(vpos);
      discardByTerrainDepth();
      vec4 texColor = ${i?`texture(tex, ${n?"colorUV":"vuv0"})`:" vec4(1.0)"};
      ${(0,O.If)(i,`${(0,O.If)(e.textureAlphaPremultiplied,"texColor.rgb /= texColor.a;")}\n        discardOrAdjustAlpha(texColor);`)}
      vec3 viewDirection = normalize(vpos - cameraPosition);
      applyPBRFactors();
      float ssao = evaluateAmbientOcclusionInverse();
      ssao *= getBakedOcclusion();

      float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
      vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
      float shadow = ${o?"max(lightingGlobalFactor * (1.0 - additionalAmbientScale), readShadowMap(vpos, linearDepth))":W?"lightingGlobalFactor * (1.0 - additionalAmbientScale)":"0.0"};
      vec3 matColor = max(ambient, diffuse);
      ${e.hasVertexColors?O.H`vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
             float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:O.H`vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
             float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));`}
      ${(0,O.If)(V,"albedo = mix(albedo, vec3(1), 0.9);")}
      ${O.H`vec3 shadingNormal = normalize(vNormalWorld);
             albedo *= 1.2;
             vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
             float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
             float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
             float treeRadialFalloff = vColor.r;
             float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
             additionalLight += backLightFactor * mainLightIntensity;`}
      ${(0,O.If)(j,`vec3 normalGround = ${W?"normalize(vpos + localOrigin)":"vec3(0.0, 0.0, 1.0)"};`)}
      ${j?O.H`float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
                 ${(0,O.If)(V,O.H`mrr = vec3(0.0, 1.0, 0.04);`)}
            vec4 emission = ${V?"vec4(0.0)":"getEmissions()"};
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:O.H`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
      vec4 finalColor = vec4(shadedColor, opacity_);
      outputColorHighlightOID(finalColor, vpos);`)}return t.include(p.E,e),t}const F=Object.freeze(Object.defineProperty({__proto__:null,build:H},Symbol.toStringTag,{value:"Module"}))},15581:(e,t,r)=>{r.d(t,{S:()=>_,b:()=>p,g:()=>v});var i=r(37585),n=r(48163),o=r(82048),a=r(52540),s=r(34845),c=r(77108),l=r(47286),d=r(33094),u=r(20304),h=r(31821),m=r(63761),f=r(14113);function p(){const e=new f.N5,t=e.fragment;return e.include(o.c),e.include(s.Ir),t.include(a.E),t.uniforms.add(new d.U("radius",(e=>v(e.camera)))).code.add(h.H`vec3 sphere[16] = vec3[16](
vec3(0.186937, 0.0, 0.0),
vec3(0.700542, 0.0, 0.0),
vec3(-0.864858, -0.481795, -0.111713),
vec3(-0.624773, 0.102853, -0.730153),
vec3(-0.387172, 0.260319, 0.007229),
vec3(-0.222367, -0.642631, -0.707697),
vec3(-0.01336, -0.014956, 0.169662),
vec3(0.122575, 0.1544, -0.456944),
vec3(-0.177141, 0.85997, -0.42346),
vec3(-0.131631, 0.814545, 0.524355),
vec3(-0.779469, 0.007991, 0.624833),
vec3(0.308092, 0.209288,0.35969),
vec3(0.359331, -0.184533, -0.377458),
vec3(0.192633, -0.482999, -0.065284),
vec3(0.233538, 0.293706, -0.055139),
vec3(0.417709, -0.386701, 0.442449)
);
float fallOffFunction(float vv, float vn, float bias) {
float f = max(radius * radius - vv, 0.0);
return f * f * f * max(vn - bias, 0.0);
}`),t.code.add(h.H`float aoValueFromPositionsAndNormal(vec3 C, vec3 n_C, vec3 Q) {
vec3 v = Q - C;
float vv = dot(v, v);
float vn = dot(normalize(v), n_C);
return fallOffFunction(vv, vn, 0.1);
}`),t.uniforms.add(new m.N("normalMap",(e=>e.normalTexture)),new m.N("depthMap",(e=>e.depthTexture)),new u.m("projScale",(e=>e.projScale)),new m.N("rnm",(e=>e.noiseTexture)),new l.G("rnmScale",((e,t)=>(0,i.hZ)(g,t.camera.fullWidth/e.noiseTexture.descriptor.width,t.camera.fullHeight/e.noiseTexture.descriptor.height))),new u.m("intensity",(e=>e.intensity)),new c.E("screenSize",(e=>(0,i.hZ)(g,e.camera.fullWidth,e.camera.fullHeight)))),e.outputs.add("fragOcclusion","float"),t.main.add(h.H`
      float depth = depthFromTexture(depthMap, uv);

      // Early out if depth is out of range, such as in the sky
      if (depth >= 1.0 || depth <= 0.0) {
        fragOcclusion = 1.0;
        return;
      }

      // get the normal of current fragment
      vec4 norm4 = texture(normalMap, uv);
      if(norm4.a != 1.0) {
        fragOcclusion = 1.0;
        return;
      }
      vec3 norm = vec3(-1.0) + 2.0 * norm4.xyz;

      float currentPixelDepth = linearizeDepth(depth);
      vec3 currentPixelPos = reconstructPosition(gl_FragCoord.xy, currentPixelDepth);

      float sum = 0.0;
      vec3 tapPixelPos;

      vec3 fres = normalize(2.0 * texture(rnm, uv * rnmScale).xyz - 1.0);

      // note: the factor 2.0 should not be necessary, but makes ssao much nicer.
      // bug or deviation from CE somewhere else?
      float ps = projScale / (2.0 * currentPixelPos.z * zScale.x + zScale.y);

      for(int i = 0; i < ${h.H.int(16)}; ++i) {
        vec2 unitOffset = reflect(sphere[i], fres).xy;
        vec2 offset = vec2(-unitOffset * radius * ps);

        // don't use current or very nearby samples
        if( abs(offset.x) < 2.0 || abs(offset.y) < 2.0){
          continue;
        }

        vec2 tc = vec2(gl_FragCoord.xy + offset);
        if (tc.x < 0.0 || tc.y < 0.0 || tc.x > screenSize.x || tc.y > screenSize.y) continue;
        vec2 tcTap = tc / screenSize;
        float occluderFragmentDepth = linearDepthFromTexture(depthMap, tcTap);

        tapPixelPos = reconstructPosition(tc, occluderFragmentDepth);

        sum += aoValueFromPositionsAndNormal(currentPixelPos, norm, tapPixelPos);
      }

      // output the result
      float A = max(1.0 - sum * intensity / float(${h.H.int(16)}), 0.0);

      // Anti-tone map to reduce contrast and drag dark region farther: (x^0.2 + 1.2 * x^4) / 2.2
      A = (pow(A, 0.2) + 1.2 * A * A * A * A) / 2.2;

      fragOcclusion = A;`),e}function v(e){return Math.max(10,20*e.computeScreenPixelSizeAtDist(Math.abs(4*e.relativeElevation)))}const g=(0,n.vt)(),_=Object.freeze(Object.defineProperty({__proto__:null,build:p,getRadius:v},Symbol.toStringTag,{value:"Module"}))},95774:(e,t,r)=>{r.d(t,{S:()=>h,b:()=>u});var i=r(82048),n=r(52540),o=r(68259),a=r(20304),s=r(31821),c=r(15976),l=r(63761),d=r(14113);function u(){const e=new d.N5,t=e.fragment;e.include(i.c);return t.include(n.E),t.uniforms.add(new l.N("depthMap",(e=>e.depthTexture)),new c.o("tex",(e=>e.colorTexture)),new o.t("blurSize",(e=>e.blurSize)),new a.m("projScale",((e,t)=>{const r=t.camera.distance;return r>5e4?Math.max(0,e.projScale-(r-5e4)):e.projScale}))),t.code.add(s.H`
    void blurFunction(vec2 uv, float r, float center_d, float sharpness, inout float wTotal, inout float bTotal) {
      float c = texture(tex, uv).r;
      float d = linearDepthFromTexture(depthMap, uv);

      float ddiff = d - center_d;

      float w = exp(-r * r * ${s.H.float(.08)} - ddiff * ddiff * sharpness);
      wTotal += w;
      bTotal += w * c;
    }
  `),e.outputs.add("fragBlur","float"),t.main.add(s.H`
    float b = 0.0;
    float w_total = 0.0;

    float center_d = linearDepthFromTexture(depthMap, uv);

    float sharpness = -0.05 * projScale / center_d;
    for (int r = -${s.H.int(4)}; r <= ${s.H.int(4)}; ++r) {
      float rf = float(r);
      vec2 uvOffset = uv + rf * blurSize;
      blurFunction(uvOffset, rf, center_d, sharpness, w_total, b);
    }
    fragBlur = b / w_total;`),e}const h=Object.freeze(Object.defineProperty({__proto__:null,build:u},Symbol.toStringTag,{value:"Module"}))},17352:(e,t,r)=>{r.d(t,{b:()=>j,f:()=>x}),r(44208);var i=r(53966),n=r(34727),o=r(4341),a=r(58083),s=r(9093),c=r(38954),l=r(51850),d=r(19419),u=r(88582),h=r(11964),m=r(27921),f=r(71351),p=r(44280),v=r(32114);const g=()=>i.A.getLogger("esri.views.3d.support.geometryUtils.boundedPlane");function _(e=H){return{plane:(0,m.vt)(e.plane),origin:(0,l.o8)(e.origin),basis1:(0,l.o8)(e.basis1),basis2:(0,l.o8)(e.basis2)}}function T(e,t=_()){return x(e.origin,e.basis1,e.basis2,t)}function x(e,t,r,i=_()){return(0,c.c)(i.origin,e),(0,c.c)(i.basis1,t),(0,c.c)(i.basis2,r),A(i),function(e,t){Math.abs((0,c.f)(e.basis1,e.basis2)/((0,c.l)(e.basis1)*(0,c.l)(e.basis2)))>1e-6&&g().warn(t,"Provided basis vectors are not perpendicular"),Math.abs((0,c.f)(e.basis1,N(e)))>1e-6&&g().warn(t,"Basis vectors and plane normal are not perpendicular"),Math.abs(-(0,c.f)(N(e),e.origin)-e.plane[3])>1e-6&&g().warn(t,"Plane offset is not consistent with plane origin")}(i,"fromValues()"),i}function A(e){(0,m.mR)(e.basis2,e.basis1,e.origin,e.plane)}function b(e,t,r){e!==r&&T(e,r);const i=(0,c.h)(v.rq.get(),N(e),t);return(0,c.g)(r.origin,r.origin,i),r.plane[3]-=t,r}function E(e,t=_()){const r=(e[2]-e[0])/2,i=(e[3]-e[1])/2;return(0,c.i)(t.origin,e[0]+r,e[1]+i,0),(0,c.i)(t.basis1,r,0,0),(0,c.i)(t.basis2,0,i,0),(0,m.fA)(0,0,1,0,t.plane),t}function S(e,t,r){return!!(0,m.Ui)(e.plane,t,r)&&y(e,r)}function M(e,t,r){const i=F.get();D(e,t,i,F.get());let o=Number.POSITIVE_INFINITY;for(const a of z){const s=L(e,a,B.get()),l=v.rq.get();if((0,m.T7)(i,s,l)){const e=(0,c.o)(v.rq.get(),t.origin,l),i=Math.abs((0,n.XM)((0,c.f)(t.direction,e)));i<o&&(o=i,(0,c.c)(r,l))}}return o===Number.POSITIVE_INFINITY?C(e,t,r):r}function C(e,t,r){if(S(e,t,r))return r;const i=F.get(),n=F.get();D(e,t,i,n);let o=Number.POSITIVE_INFINITY;for(const a of z){const s=L(e,a,B.get()),l=v.rq.get();if((0,m.gv)(i,s,l)){const e=(0,f.kb)(t,l);if(!(0,m.Tj)(n,l))continue;e<o&&(o=e,(0,c.c)(r,l))}}return I(e,t.origin)<o&&R(e,t.origin,r),r}function R(e,t,r){const i=(0,m._I)(e.plane,t,v.rq.get()),n=(0,h.H6)(P(e,e.basis1),i,-1,1,v.rq.get()),o=(0,h.H6)(P(e,e.basis2),i,-1,1,v.rq.get());return(0,c.d)(r,(0,c.g)(v.rq.get(),n,o),e.origin),r}function w(e,t,r){const{origin:i,basis1:n,basis2:o}=e,a=(0,c.d)(v.rq.get(),t,i),s=(0,p.gr)(n,a),l=(0,p.gr)(o,a),d=(0,p.gr)(N(e),a);return(0,c.i)(r,s,l,d)}function I(e,t){const r=w(e,t,v.rq.get()),{basis1:i,basis2:n}=e,o=(0,c.l)(i),a=(0,c.l)(n),s=Math.max(Math.abs(r[0])-o,0),l=Math.max(Math.abs(r[1])-a,0),d=r[2];return s*s+l*l+d*d}function O(e,t){const r=-e.plane[3];return(0,p.gr)(N(e),t)-r}function N(e){return(0,m.Qj)(e.plane)}function y(e,t){const r=(0,c.d)(v.rq.get(),t,e.origin),i=(0,c.k)(e.basis1),n=(0,c.k)(e.basis2),o=(0,c.f)(e.basis1,r),a=(0,c.f)(e.basis2,r);return-o-i<0&&o-i<0&&-a-n<0&&a-n<0}function P(e,t){const r=B.get();return(0,c.c)(r.origin,e.origin),(0,c.c)(r.vector,t),r}function L(e,t,r){const{basis1:i,basis2:n,origin:o}=e,a=(0,c.h)(v.rq.get(),i,t.origin[0]),s=(0,c.h)(v.rq.get(),n,t.origin[1]);(0,c.g)(r.origin,a,s),(0,c.g)(r.origin,r.origin,o);const l=(0,c.h)(v.rq.get(),i,t.direction[0]),d=(0,c.h)(v.rq.get(),n,t.direction[1]);return(0,c.h)(r.vector,(0,c.g)(l,l,d),2),r}function D(e,t,r,i){const n=N(e);(0,m.mR)(n,t.direction,t.origin,r),(0,m.mR)((0,m.Qj)(r),n,t.origin,i)}const H={plane:(0,m.vt)(),origin:(0,l.fA)(0,0,0),basis1:(0,l.fA)(1,0,0),basis2:(0,l.fA)(0,1,0)},F=new o.I(m.vt),B=new o.I(h.vt),U=(0,l.vt)(),G=new o.I((()=>_())),z=[{origin:[-1,-1],direction:[1,0]},{origin:[1,-1],direction:[0,1]},{origin:[1,1],direction:[-1,0]},{origin:[-1,1],direction:[0,-1]}],V=(0,s.vt)(),W=(0,s.vt)(),j=Object.freeze(Object.defineProperty({__proto__:null,BoundedPlaneClass:class{constructor(){this.plane=(0,m.vt)(),this.origin=(0,l.vt)(),this.basis1=(0,l.vt)(),this.basis2=(0,l.vt)()}},altitudeAt:O,axisAt:function(e,t,r,i){return function(e,t,r){switch(t){case u._.X:(0,c.c)(r,e.basis1),(0,c.n)(r,r);break;case u._.Y:(0,c.c)(r,e.basis2),(0,c.n)(r,r);break;case u._.Z:(0,c.c)(r,N(e))}return r}(e,r,i)},cameraFrustumCoverage:function(e,t){return(t-e)/t},closestPoint:C,closestPointOnSilhouette:M,copy:T,copyWithoutVerify:function(e,t){(0,c.c)(t.origin,e.origin),(0,c.c)(t.basis1,e.basis1),(0,c.c)(t.basis2,e.basis2),(0,m.C)(t.plane,e.plane)},create:_,distance:function(e,t){return Math.sqrt(I(e,t))},distance2:I,distanceToSilhouette:function(e,t){let r=Number.NEGATIVE_INFINITY;for(const i of z){const n=L(e,i,B.get()),o=(0,h.kb)(n,t);o>r&&(r=o)}return Math.sqrt(r)},elevate:b,equals:function(e,t){return(0,c.p)(e.basis1,t.basis1)&&(0,c.p)(e.basis2,t.basis2)&&(0,c.p)(e.origin,t.origin)},extrusionContainsPoint:function(e,t){return(0,m.Tj)(e.plane,t)&&y(e,t)},fromAABoundingRect:E,fromValues:x,getExtent:function(e,t){const r=e.basis1[0],i=e.basis2[1],[n,o]=e.origin;return(0,d.fA)(n-r,o-i,n+r,o+i,t)},intersectRay:S,intersectRayClosestSilhouette:function(e,t,r){if(S(e,t,r))return r;const i=M(e,t,v.rq.get());return(0,c.g)(r,t.origin,(0,c.h)(v.rq.get(),t.direction,(0,c.j)(t.origin,i)/(0,c.l)(t.direction))),r},normal:N,projectPoint:R,projectPointLocal:w,rotate:function(e,t,r,i){return e!==i&&T(e,i),(0,a.$0)(W,t,r),(0,c.t)(i.basis1,e.basis1,W),(0,c.t)(i.basis2,e.basis2,W),A(i),i},setAltitudeAt:function(e,t,r,i){const n=O(e,t),o=(0,c.h)(U,N(e),r-n);return(0,c.g)(i,t,o),i},setExtent:function(e,t,r){return E(t,r),b(r,O(e,e.origin),r),r},transform:function(e,t,r){return e!==r&&T(e,r),(0,a.B8)(V,t),(0,a.mg)(V,V),(0,c.t)(r.basis1,e.basis1,V),(0,c.t)(r.basis2,e.basis2,V),(0,c.t)((0,m.Qj)(r.plane),(0,m.Qj)(e.plane),V),(0,c.t)(r.origin,e.origin,t),(0,m.mP)(r.plane,r.plane,r.origin),r},up:H,updateUnboundedPlane:A,wrap:function(e,t,r){const i=G.get();return i.origin=e,i.basis1=t,i.basis2=r,i.plane=(0,m.LV)(0,0,0,0),A(i),i}},Symbol.toStringTag,{value:"Module"}))},11964:(e,t,r)=>{r.d(t,{Cr:()=>l,H6:()=>h,_I:()=>u,kb:()=>d,vt:()=>c});var i=r(34727),n=r(4341),o=r(38954),a=r(51850),s=r(32114);function c(e){return e?{origin:(0,a.o8)(e.origin),vector:(0,a.o8)(e.vector)}:{origin:(0,a.vt)(),vector:(0,a.vt)()}}function l(e,t,r=c()){return(0,o.c)(r.origin,e),(0,o.d)(r.vector,t,e),r}function d(e,t){const r=(0,o.d)(s.rq.get(),t,e.origin),n=(0,o.f)(e.vector,r),a=(0,o.f)(e.vector,e.vector),c=(0,i.qE)(n/a,0,1),l=(0,o.d)(s.rq.get(),(0,o.h)(s.rq.get(),e.vector,c),r);return(0,o.f)(l,l)}function u(e,t,r){return h(e,t,0,1,r)}function h(e,t,r,n,a){const{vector:c,origin:l}=e,d=(0,o.d)(s.rq.get(),t,l),u=(0,o.f)(c,d)/(0,o.k)(c);return(0,o.h)(a,c,(0,i.qE)(u,r,n)),(0,o.g)(a,a,e.origin)}(0,a.vt)(),(0,a.vt)(),new n.I((()=>c()))},92993:(e,t,r)=>{var i;r.d(t,{n:()=>i}),function(e){e[e.ETC1_RGB=0]="ETC1_RGB",e[e.ETC2_RGBA=1]="ETC2_RGBA",e[e.BC1_RGB=2]="BC1_RGB",e[e.BC3_RGBA=3]="BC3_RGBA",e[e.BC4_R=4]="BC4_R",e[e.BC5_RG=5]="BC5_RG",e[e.BC7_M6_RGB=6]="BC7_M6_RGB",e[e.BC7_M5_RGBA=7]="BC7_M5_RGBA",e[e.PVRTC1_4_RGB=8]="PVRTC1_4_RGB",e[e.PVRTC1_4_RGBA=9]="PVRTC1_4_RGBA",e[e.ASTC_4x4_RGBA=10]="ASTC_4x4_RGBA",e[e.ATC_RGB=11]="ATC_RGB",e[e.ATC_RGBA=12]="ATC_RGBA",e[e.FXT1_RGB=17]="FXT1_RGB",e[e.PVRTC2_4_RGB=18]="PVRTC2_4_RGB",e[e.PVRTC2_4_RGBA=19]="PVRTC2_4_RGBA",e[e.ETC2_EAC_R11=20]="ETC2_EAC_R11",e[e.ETC2_EAC_RG11=21]="ETC2_EAC_RG11",e[e.RGBA32=13]="RGBA32",e[e.RGB565=14]="RGB565",e[e.BGR565=15]="BGR565",e[e.RGBA4444=16]="RGBA4444"}(i||(i={}))},99677:(e,t,r)=>{r.d(t,{D:()=>n});var i=r(78888);async function n(e,t){const{data:r}=await(0,i.A)(e,{responseType:"image",...t});return r}},78662:(e,t,r)=>{r.d(t,{Gd:()=>u,VC:()=>h}),r(44208);var i,n,o,a=r(34727),s=(r(77690),r(29242),r(58083),r(9093)),c=r(38954),l=r(51850),d=(r(31756),r(26857),r(65786));(o=i||(i={}))[o.Undefined=0]="Undefined",o[o.DefinedSize=1]="DefinedSize",o[o.DefinedScale=2]="DefinedScale",function(e){e[e.Undefined=0]="Undefined",e[e.DefinedAngle=1]="DefinedAngle"}(n||(n={}));class u extends d.Y{constructor(e){super(),this.vvSize=e?.size??null,this.vvColor=e?.color??null,this.vvOpacity=e?.opacity??null}}function h(e,t,r){if(!t.vvSize)return(0,c.i)(e,1,1,1),e;for(let i=0;i<3;++i){const n=t.vvSize.offset[i]+r[0]*t.vvSize.factor[i];e[i]=(0,a.qE)(n,t.vvSize.minSize[i],t.vvSize.maxSize[i])}return e}(0,s.vt)(),(0,l.vt)(),(0,s.vt)()},26857:(e,t,r)=>{r.d(t,{b:()=>c});var i=r(90237),n=r(69622),o=r(10107),a=(r(44208),r(53966),r(87811),r(40608));let s=class extends n.A{constructor(){super(...arguments),this.SCENEVIEW_HITTEST_RETURN_INTERSECTOR=!1,this.DECONFLICTOR_SHOW_VISIBLE=!1,this.DECONFLICTOR_SHOW_INVISIBLE=!1,this.DECONFLICTOR_SHOW_GRID=!1,this.LABELS_SHOW_BORDER=!1,this.TEXT_SHOW_BASELINE=!1,this.TEXT_SHOW_BORDER=!1,this.OVERLAY_DRAW_DEBUG_TEXTURE=!1,this.OVERLAY_SHOW_CENTER=!1,this.SHOW_POI=!1,this.TESTS_DISABLE_OPTIMIZATIONS=!1,this.TESTS_DISABLE_FAST_UPDATES=!1,this.DRAW_MESH_GEOMETRY_NORMALS=!1,this.FEATURE_TILE_FETCH_SHOW_TILES=!1,this.FEATURE_TILE_TREE_SHOW_TILES=!1,this.TERRAIN_TILE_TREE_SHOW_TILES=!1,this.I3S_TREE_SHOW_TILES=!1,this.I3S_SHOW_MODIFICATIONS=!1,this.LOD_INSTANCE_RENDERER_DISABLE_UPDATES=!1,this.LOD_INSTANCE_RENDERER_COLORIZE_BY_LEVEL=!1,this.EDGES_SHOW_HIDDEN_TRANSPARENT_EDGES=!1,this.LINE_WIREFRAMES=!1}};(0,i._)([(0,o.MZ)()],s.prototype,"SCENEVIEW_HITTEST_RETURN_INTERSECTOR",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"DECONFLICTOR_SHOW_VISIBLE",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"DECONFLICTOR_SHOW_INVISIBLE",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"DECONFLICTOR_SHOW_GRID",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"LABELS_SHOW_BORDER",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"TEXT_SHOW_BASELINE",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"TEXT_SHOW_BORDER",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"OVERLAY_DRAW_DEBUG_TEXTURE",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"OVERLAY_SHOW_CENTER",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"SHOW_POI",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"TESTS_DISABLE_OPTIMIZATIONS",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"TESTS_DISABLE_FAST_UPDATES",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"DRAW_MESH_GEOMETRY_NORMALS",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"FEATURE_TILE_FETCH_SHOW_TILES",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"FEATURE_TILE_TREE_SHOW_TILES",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"TERRAIN_TILE_TREE_SHOW_TILES",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"I3S_TREE_SHOW_TILES",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"I3S_SHOW_MODIFICATIONS",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"LOD_INSTANCE_RENDERER_DISABLE_UPDATES",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"LOD_INSTANCE_RENDERER_COLORIZE_BY_LEVEL",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"EDGES_SHOW_HIDDEN_TRANSPARENT_EDGES",void 0),(0,i._)([(0,o.MZ)()],s.prototype,"LINE_WIREFRAMES",void 0),s=(0,i._)([(0,a.$)("esri.views.3d.support.debugFlags")],s);const c=new s},46686:(e,t,r)=>{r.d(t,{i$:()=>l,oD:()=>d,xJ:()=>c});var i=r(49255),n=r(33752),o=r(77108),a=r(31821);function s(e){e.varyings.add("linearDepth","float")}function c(e){e.vertex.uniforms.add(new o.E("nearFar",(e=>e.camera.nearFar)))}function l(e){e.vertex.code.add(a.H`float calculateLinearDepth(vec2 nearFar,float z) {
return (-z - nearFar[0]) / (nearFar[1] - nearFar[0]);
}`)}function d(e,t){const{vertex:r}=e;switch(t.output){case i.V.Color:case i.V.ColorEmission:if(t.receiveShadows)return s(e),void r.code.add(a.H`void forwardLinearDepth() { linearDepth = gl_Position.w; }`);break;case i.V.Shadow:case i.V.ShadowHighlight:case i.V.ShadowExcludeHighlight:case i.V.ViewshedShadow:return e.include(n.em,t),s(e),c(e),l(e),void r.code.add(a.H`void forwardLinearDepth() {
linearDepth = calculateLinearDepth(nearFar, vPosition_view.z);
}`)}r.code.add(a.H`void forwardLinearDepth() {}`)}},32680:(e,t,r)=>{r.d(t,{M:()=>n});var i=r(31821);function n(e){e.vertex.code.add(i.H`vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
vec3 camToVert = posWorld - camPosWorld;
bool isBackface = dot(camToVert, normalWorld) > 0.0;
if (isBackface) {
posClip.z += 0.0000003 * posClip.w;
}
return posClip;
}`)}},82048:(e,t,r)=>{r.d(t,{c:()=>o});var i=r(31821),n=r(46540);function o(e,t=!0){e.attributes.add(n.r.POSITION,"vec2"),t&&e.varyings.add("uv","vec2"),e.vertex.main.add(i.H`
      gl_Position = vec4(position, 0.0, 1.0);
      ${t?i.H`uv = position * 0.5 + vec2(0.5);`:""}
  `)}},76591:(e,t,r)=>{r.d(t,{HQ:()=>l,rA:()=>d});var i=r(58083),n=r(9093),o=r(38954),a=r(51850),s=r(40710),c=(r(33079),r(31821));function l(e,t){!function(e,t,...r){h(e,t,...r),t.hasSlicePlane?e.code.add("\n    void discardBySlice(vec3 pos) {\n      if (sliceByPlane(pos)) {\n        discard;\n      }\n    }\n\n    vec4 applySliceOutline(vec4 color, vec3 pos) {\n      SliceFactors factors = calculateSliceFactors(pos);\n\n      factors.front /= 2.0 * fwidth(factors.front);\n      factors.side0 /= 2.0 * fwidth(factors.side0);\n      factors.side1 /= 2.0 * fwidth(factors.side1);\n      factors.side2 /= 2.0 * fwidth(factors.side2);\n      factors.side3 /= 2.0 * fwidth(factors.side3);\n\n      // return after calling fwidth, to avoid aliasing caused by discontinuities in the input to fwidth\n      if (sliceByFactors(factors)) {\n        return color;\n      }\n\n      float outlineFactor = (1.0 - step(0.5, factors.front))\n        * (1.0 - step(0.5, factors.side0))\n        * (1.0 - step(0.5, factors.side1))\n        * (1.0 - step(0.5, factors.side2))\n        * (1.0 - step(0.5, factors.side3));\n\n      return mix(color, vec4(vec3(0.0), color.a), outlineFactor * 0.3);\n    }\n\n    vec4 applySlice(vec4 color, vec3 pos) {\n      return sliceEnabled() ? applySliceOutline(color, pos) : color;\n    }\n  "):e.code.add(c.H`void discardBySlice(vec3 pos) { }
vec4 applySlice(vec4 color, vec3 pos) { return color; }`)}(e,t,new s.W("slicePlaneOrigin",((e,r)=>v(t,e,r))),new s.W("slicePlaneBasis1",((e,r)=>g(t,e,r,r.slicePlane?.basis1))),new s.W("slicePlaneBasis2",((e,r)=>g(t,e,r,r.slicePlane?.basis2))))}function d(e,t){h(e,t,new s.W("slicePlaneOrigin",((e,r)=>v(t,e,r))),new s.W("slicePlaneBasis1",((e,r)=>g(t,e,r,r.slicePlane?.basis1))),new s.W("slicePlaneBasis2",((e,r)=>g(t,e,r,r.slicePlane?.basis2))))}r(65786).Y;const u=c.H`struct SliceFactors {
float front;
float side0;
float side1;
float side2;
float side3;
};
SliceFactors calculateSliceFactors(vec3 pos) {
vec3 rel = pos - slicePlaneOrigin;
vec3 slicePlaneNormal = -cross(slicePlaneBasis1, slicePlaneBasis2);
float slicePlaneW = -dot(slicePlaneNormal, slicePlaneOrigin);
float basis1Len2 = dot(slicePlaneBasis1, slicePlaneBasis1);
float basis2Len2 = dot(slicePlaneBasis2, slicePlaneBasis2);
float basis1Dot = dot(slicePlaneBasis1, rel);
float basis2Dot = dot(slicePlaneBasis2, rel);
return SliceFactors(
dot(slicePlaneNormal, pos) + slicePlaneW,
-basis1Dot - basis1Len2,
basis1Dot - basis1Len2,
-basis2Dot - basis2Len2,
basis2Dot - basis2Len2
);
}
bool sliceByFactors(SliceFactors factors) {
return factors.front < 0.0
&& factors.side0 < 0.0
&& factors.side1 < 0.0
&& factors.side2 < 0.0
&& factors.side3 < 0.0;
}
bool sliceEnabled() {
return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
}
bool sliceByPlane(vec3 pos) {
return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
}
bool rejectBySlice(vec3 pos) {
return sliceByPlane(pos);
}`;function h(e,t,...r){t.hasSlicePlane?(e.uniforms.add(...r),e.code.add(u)):e.code.add("bool rejectBySlice(vec3 pos) { return false; }")}function m(e,t,r){return e.instancedDoublePrecision?(0,o.i)(_,r.camera.viewInverseTransposeMatrix[3],r.camera.viewInverseTransposeMatrix[7],r.camera.viewInverseTransposeMatrix[11]):t.slicePlaneLocalOrigin}function f(e,t){return null!=e?(0,o.d)(T,t.origin,e):t.origin}function p(e,t,r){return e.hasSliceTranslatedView?null!=t?(0,i.Tl)(A,r.camera.viewMatrix,t):r.camera.viewMatrix:null}function v(e,t,r){if(null==r.slicePlane)return a.uY;const i=m(e,t,r),n=f(i,r.slicePlane),s=p(e,i,r);return null!=s?(0,o.t)(T,n,s):n}function g(e,t,r,i){if(null==i||null==r.slicePlane)return a.uY;const n=m(e,t,r),s=f(n,r.slicePlane),c=p(e,n,r);return null!=c?((0,o.g)(x,i,s),(0,o.t)(T,s,c),(0,o.t)(x,x,c),(0,o.d)(x,x,T)):i}const _=(0,a.vt)(),T=(0,a.vt)(),x=(0,a.vt)(),A=(0,n.vt)()},76597:(e,t,r)=>{r.d(t,{d:()=>o});var i=r(46686),n=r(31821);function o(e){(0,i.i$)(e),e.vertex.code.add(n.H`vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
vec4 eye = view * vec4(pos, 1.0);
depth = calculateLinearDepth(nearFar,eye.z);
return proj * eye;
}`),e.vertex.code.add(n.H`vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
return proj * (view * vec4(pos, 1.0));
}`)}},82991:(e,t,r)=>{r.d(t,{B:()=>_});var i=r(77690),n=r(29242),o=r(9093),a=r(38954),s=r(51850),c=r(49255),l=r(26425),d=r(20693),u=r(23205),h=r(31821),m=r(35644),f=r(40095),p=r(46540),v=r(28449);r(65786).Y;const g=(0,n.vt)();function _(e,t){const r=t.hasModelTransformation,n=t.instancedDoublePrecision;r&&(e.vertex.uniforms.add(new f.X("model",(e=>e.modelTransformation??o.zK))),e.vertex.uniforms.add(new m.k("normalLocalOriginFromModel",(e=>((0,i.Ge)(g,e.modelTransformation??o.zK),g))))),t.instanced&&n&&(e.attributes.add(p.r.INSTANCEMODELORIGINHI,"vec3"),e.attributes.add(p.r.INSTANCEMODELORIGINLO,"vec3"),e.attributes.add(p.r.INSTANCEMODEL,"mat3"),e.attributes.add(p.r.INSTANCEMODELNORMAL,"mat3"));const s=e.vertex;n&&(s.include(l.u,t),s.uniforms.add(new u.d("viewOriginHi",(e=>(0,v.Zo)((0,a.i)(T,e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]),T))),new u.d("viewOriginLo",(e=>(0,v.jA)((0,a.i)(T,e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]),T))))),s.code.add(h.H`
    vec3 getVertexInLocalOriginSpace() {
      return ${r?n?"(model * vec4(instanceModel * localPosition().xyz, 1.0)).xyz":"(model * localPosition()).xyz":n?"instanceModel * localPosition().xyz":"localPosition().xyz"};
    }

    vec3 subtractOrigin(vec3 _pos) {
      ${n?h.H`
          // Negated inputs are intentionally the first two arguments. The other way around the obfuscation in dpAdd() stopped
          // working for macOS 14+ and iOS 17+.
          // Issue: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/56280
          vec3 originDelta = dpAdd(-instanceModelOriginHi, -instanceModelOriginLo, viewOriginHi, viewOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `),s.code.add(h.H`
    vec3 dpNormal(vec4 _normal) {
      return normalize(${r?n?"normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz)":"normalLocalOriginFromModel * _normal.xyz":n?"instanceModelNormal * _normal.xyz":"_normal.xyz"});
    }
    `),t.output===c.V.Normal&&((0,d.S7)(s),s.code.add(h.H`
    vec3 dpNormalView(vec4 _normal) {
      return normalize((viewNormal * ${r?n?"vec4(normalLocalOriginFromModel * (instanceModelNormal * _normal.xyz), 1.0)":"vec4(normalLocalOriginFromModel * _normal.xyz, 1.0)":n?"vec4(instanceModelNormal * _normal.xyz, 1.0)":"_normal"}).xyz);
    }
    `)),t.hasVertexTangents&&s.code.add(h.H`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${r?n?"return vec4(normalLocalOriginFromModel * (instanceModelNormal * _tangent.xyz), _tangent.w);":"return vec4(normalLocalOriginFromModel * _tangent.xyz, _tangent.w);":n?"return vec4(instanceModelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}
    }`)}const T=(0,s.vt)()},36782:(e,t,r)=>{r.d(t,{g:()=>a});var i=r(49255),n=r(31821),o=r(46540);function a(e,t){if(t.output!==i.V.ObjectAndLayerIdColor)return e.vertex.code.add(n.H`void forwardObjectAndLayerIdColor() {}`),void e.fragment.code.add(n.H`void outputObjectAndLayerIdColor() {}`);const r=t.objectAndLayerIdColorInstanced;e.varyings.add("objectAndLayerIdColorVarying","vec4"),e.attributes.add(r?o.r.INSTANCEOBJECTANDLAYERIDCOLOR:o.r.OBJECTANDLAYERIDCOLOR,"vec4"),e.vertex.code.add(n.H`
    void forwardObjectAndLayerIdColor() {
      objectAndLayerIdColorVarying = ${r?"instanceObjectAndLayerIdColor":"objectAndLayerIdColor"} * 0.003921568627451;
    }`),e.fragment.code.add(n.H`void outputObjectAndLayerIdColor() {
fragColor = objectAndLayerIdColorVarying;
}`)}},10764:(e,t,r)=>{r.d(t,{I:()=>o});var i=r(31821),n=r(46540);function o(e){e.attributes.add(n.r.POSITION,"vec3"),e.vertex.code.add(i.H`vec3 positionModel() { return position; }`)}},71955:(e,t,r)=>{r.d(t,{K:()=>d});var i=r(42583),n=r(31821),o=r(69270),a=r(74333);class s extends a.n{constructor(e,t){super(e,"int",o.c.Pass,((r,i,n)=>r.setUniform1i(e,t(i,n))))}}var c=r(46540),l=r(43616);function d(e,t){t.hasSymbolColors?(e.include(i.A),e.attributes.add(c.r.SYMBOLCOLOR,"vec4"),e.varyings.add("colorMixMode","mediump float"),e.vertex.code.add(n.H`int symbolColorMixMode;
vec4 getSymbolColor() {
return decodeSymbolColor(symbolColor, symbolColorMixMode) * 0.003921568627451;
}
void forwardColorMixMode() {
colorMixMode = float(symbolColorMixMode) + 0.5;
}`)):(e.fragment.uniforms.add(new s("colorMixMode",(e=>l.Um[e.colorMixMode]))),e.vertex.code.add(n.H`vec4 getSymbolColor() { return vec4(1.0); }
void forwardColorMixMode() {}`))}},53466:(e,t,r)=>{r.d(t,{I:()=>i,U:()=>c});var i,n,o=r(21818),a=r(31821),s=r(46540);function c(e,t){switch(t.textureCoordinateType){case i.Default:return e.attributes.add(s.r.UV0,"vec2"),e.varyings.add("vuv0","vec2"),void e.vertex.code.add(a.H`void forwardTextureCoordinates() {
vuv0 = uv0;
}`);case i.Compressed:return e.attributes.add(s.r.UV0,"vec2"),e.varyings.add("vuv0","vec2"),void e.vertex.code.add(a.H`vec2 getUV0() {
return uv0 / 16384.0;
}
void forwardTextureCoordinates() {
vuv0 = getUV0();
}`);case i.Atlas:return e.attributes.add(s.r.UV0,"vec2"),e.varyings.add("vuv0","vec2"),e.attributes.add(s.r.UVREGION,"vec4"),e.varyings.add("vuvRegion","vec4"),void e.vertex.code.add(a.H`void forwardTextureCoordinates() {
vuv0 = uv0;
vuvRegion = uvRegion;
}`);default:(0,o.Xb)(t.textureCoordinateType);case i.None:return void e.vertex.code.add(a.H`void forwardTextureCoordinates() {}`);case i.COUNT:return}}(n=i||(i={}))[n.None=0]="None",n[n.Default=1]="Default",n[n.Atlas=2]="Atlas",n[n.Compressed=3]="Compressed",n[n.COUNT=4]="COUNT"},92700:(e,t,r)=>{r.d(t,{c:()=>o});var i=r(31821),n=r(46540);function o(e,t){t.hasVertexColors?(e.attributes.add(n.r.COLOR,"vec4"),e.varyings.add("vColor","vec4"),e.vertex.code.add(i.H`void forwardVertexColor() { vColor = color; }`),e.vertex.code.add(i.H`void forwardNormalizedVertexColor() { vColor = color * 0.003921568627451; }`)):e.vertex.code.add(i.H`void forwardVertexColor() {}
void forwardNormalizedVertexColor() {}`)}},72824:(e,t,r)=>{r.d(t,{Mh:()=>u,Zo:()=>h,gy:()=>m});var i=r(21818),n=r(29242),o=r(91829),a=r(96336),s=r(33752),c=r(31821),l=r(98353),d=r(35644);function u(e,t){switch(t.normalType){case a.W.Attribute:case a.W.Compressed:e.include(a.Y,t),e.varyings.add("vNormalWorld","vec3"),e.varyings.add("vNormalView","vec3"),e.vertex.uniforms.add(new l.h("transformNormalGlobalFromModel",(e=>e.transformNormalGlobalFromModel)),new d.k("transformNormalViewFromGlobal",(e=>e.transformNormalViewFromGlobal))),e.vertex.code.add(c.H`void forwardNormal() {
vNormalWorld = transformNormalGlobalFromModel * normalModel();
vNormalView = transformNormalViewFromGlobal * vNormalWorld;
}`);break;case a.W.ScreenDerivative:e.vertex.code.add(c.H`void forwardNormal() {}`);break;default:(0,i.Xb)(t.normalType);case a.W.COUNT:}}class h extends s.dO{constructor(){super(...arguments),this.transformNormalViewFromGlobal=(0,n.vt)()}}class m extends s.EM{constructor(){super(...arguments),this.transformNormalGlobalFromModel=(0,n.vt)(),this.toMapSpace=(0,o.vt)()}}},33752:(e,t,r)=>{r.d(t,{EM:()=>g,dO:()=>v,em:()=>p});var i=r(29242),n=r(9093),o=r(51850),a=r(10764),s=r(26425),c=r(40710),l=r(33079),d=r(31821),u=r(98353),h=r(35644),m=r(40095),f=r(65786);function p(e,t){e.include(a.I);const r=e.vertex;r.include(s.u,t),e.varyings.add("vPositionWorldCameraRelative","vec3"),e.varyings.add("vPosition_view","vec3"),r.uniforms.add(new l.t("transformWorldFromViewTH",(e=>e.transformWorldFromViewTH)),new l.t("transformWorldFromViewTL",(e=>e.transformWorldFromViewTL)),new h.k("transformViewFromCameraRelativeRS",(e=>e.transformViewFromCameraRelativeRS)),new m.X("transformProjFromView",(e=>e.transformProjFromView)),new u.h("transformWorldFromModelRS",(e=>e.transformWorldFromModelRS)),new c.W("transformWorldFromModelTH",(e=>e.transformWorldFromModelTH)),new c.W("transformWorldFromModelTL",(e=>e.transformWorldFromModelTL))),r.code.add(d.H`vec3 positionWorldCameraRelative() {
vec3 rotatedModelPosition = transformWorldFromModelRS * positionModel();
vec3 transform_CameraRelativeFromModel = dpAdd(
transformWorldFromModelTL,
transformWorldFromModelTH,
-transformWorldFromViewTL,
-transformWorldFromViewTH
);
return transform_CameraRelativeFromModel + rotatedModelPosition;
}`),r.code.add(d.H`
    void forwardPosition(float fOffset) {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      if (fOffset != 0.0) {
        vPositionWorldCameraRelative += fOffset * ${t.spherical?d.H`normalize(transformWorldFromViewTL + vPositionWorldCameraRelative)`:d.H`vec3(0.0, 0.0, 1.0)`};
      }

      vPosition_view = transformViewFromCameraRelativeRS * vPositionWorldCameraRelative;
      gl_Position = transformProjFromView * vec4(vPosition_view, 1.0);
    }
  `),e.fragment.uniforms.add(new l.t("transformWorldFromViewTL",(e=>e.transformWorldFromViewTL))),r.code.add(d.H`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`),e.fragment.code.add(d.H`vec3 positionWorld() {
return transformWorldFromViewTL + vPositionWorldCameraRelative;
}`)}class v extends f.Y{constructor(){super(...arguments),this.transformWorldFromViewTH=(0,o.vt)(),this.transformWorldFromViewTL=(0,o.vt)(),this.transformViewFromCameraRelativeRS=(0,i.vt)(),this.transformProjFromView=(0,n.vt)()}}class g extends f.Y{constructor(){super(...arguments),this.transformWorldFromModelRS=(0,i.vt)(),this.transformWorldFromModelTH=(0,o.vt)(),this.transformWorldFromModelTL=(0,o.vt)()}}},99208:(e,t,r)=>{r.d(t,{r:()=>a});var i=r(53466),n=r(31821);function o(e){e.fragment.code.add(n.H`vec4 textureAtlasLookup(sampler2D tex, vec2 textureCoordinates, vec4 atlasRegion) {
vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;
float maxdUV = 0.125;
vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
return textureGrad(tex, uvAtlas, dUVdx, dUVdy);
}`)}function a(e,t){const{textureCoordinateType:r}=t;if(r===i.I.None||r===i.I.COUNT)return;e.include(i.U,t);const a=r===i.I.Atlas;a&&e.include(o),e.fragment.code.add(n.H`
    vec4 textureLookup(sampler2D tex, vec2 uv) {
      return ${a?"textureAtlasLookup(tex, uv, vuvRegion)":"texture(tex, uv)"};
    }
  `)}},35640:(e,t,r)=>{r.d(t,{G:()=>l,V:()=>u});var i=r(87317),n=r(91829),o=r(52587),a=r(20693),s=r(71988),c=r(31821);function l(e,t){const r=e.vertex;t.hasVerticalOffset?(u(r),t.hasScreenSizePerspective&&(e.include(o.Y6),(0,o.OH)(r),(0,a.yu)(e.vertex,t)),r.code.add(c.H`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${t.spherical?c.H`vec3 worldNormal = normalize(worldPos + localOrigin);`:c.H`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${t.hasScreenSizePerspective?c.H`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:c.H`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):r.code.add(c.H`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}const d=(0,n.vt)();function u(e){e.uniforms.add(new s.E("verticalOffset",((e,t)=>{const{minWorldLength:r,maxWorldLength:n,screenLength:o}=e.verticalOffset,a=Math.tan(.5*t.camera.fovY)/(.5*t.camera.fullViewport[3]),s=t.camera.pixelRatio||1;return(0,i.s)(d,o*s,a,r,n)})))}},40261:(e,t,r)=>{r.d(t,{E:()=>x});var i=r(46686),n=r(49255),o=r(76591),a=r(76597),s=r(96336),c=r(36782),l=r(53466),d=r(72824),u=r(80730),h=r(31821);function m(e,t){switch(t.output){case n.V.Shadow:case n.V.ShadowHighlight:case n.V.ShadowExcludeHighlight:case n.V.ViewshedShadow:e.fragment.include(u.U),e.fragment.code.add(h.H`float _calculateFragDepth(const in float depth) {
const float SLOPE_SCALE = 2.0;
const float BIAS = 20.0 * .000015259;
float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
return depth + SLOPE_SCALE * m + BIAS;
}
void outputDepth(float _linearDepth) {
fragColor = floatToRgba4(_calculateFragDepth(_linearDepth));
}`)}}var f=r(2981),p=r(42398),v=r(11955),g=r(20693),_=r(63761),T=r(89192);function x(e,t){const{vertex:r,fragment:u}=e,x=t.hasColorTexture&&t.alphaDiscardMode!==T.sf.Opaque,{output:A,normalType:b,hasColorTextureTransform:E}=t;switch(A){case n.V.Depth:(0,g.NB)(r,t),e.include(a.d,t),e.fragment.include(o.HQ,t),e.include(l.U,t),x&&u.uniforms.add(new _.N("tex",(e=>e.texture))),r.main.add(h.H`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),e.include(v.S,t),u.main.add(h.H`
        discardBySlice(vpos);
        ${(0,h.If)(x,h.H`vec4 texColor = texture(tex, ${E?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}`);break;case n.V.Shadow:case n.V.ShadowHighlight:case n.V.ShadowExcludeHighlight:case n.V.ViewshedShadow:case n.V.ObjectAndLayerIdColor:(0,g.NB)(r,t),e.include(a.d,t),e.include(l.U,t),e.include(p.A,t),e.include(m,t),e.fragment.include(o.HQ,t),e.include(c.g,t),(0,i.xJ)(e),e.varyings.add("depth","float"),x&&u.uniforms.add(new _.N("tex",(e=>e.texture))),r.main.add(h.H`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);
forwardTextureCoordinates();
forwardObjectAndLayerIdColor();`),e.include(v.S,t),u.main.add(h.H`
        discardBySlice(vpos);
        ${(0,h.If)(x,h.H`vec4 texColor = texture(tex, ${E?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}
        ${A===n.V.ObjectAndLayerIdColor?h.H`outputObjectAndLayerIdColor();`:h.H`outputDepth(depth);`}`);break;case n.V.Normal:{(0,g.NB)(r,t),e.include(a.d,t),e.include(s.Y,t),e.include(d.Mh,t),e.include(l.U,t),e.include(p.A,t),x&&u.uniforms.add(new _.N("tex",(e=>e.texture))),b===s.W.ScreenDerivative&&e.varyings.add("vPositionView","vec3");const i=b===s.W.Attribute||b===s.W.Compressed;r.main.add(h.H`
        vpos = getVertexInLocalOriginSpace();
        ${i?h.H`vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:h.H`vPositionView = (view * vec4(vpos, 1.0)).xyz;`}
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();`),e.fragment.include(o.HQ,t),e.include(v.S,t),u.main.add(h.H`
        discardBySlice(vpos);
        ${(0,h.If)(x,h.H`vec4 texColor = texture(tex, ${E?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}

        ${b===s.W.ScreenDerivative?h.H`vec3 normal = screenDerivativeNormal(vPositionView);`:h.H`vec3 normal = normalize(vNormalWorld);
                    if (gl_FrontFacing == false){
                      normal = -normal;
                    }`}
        fragColor = vec4(0.5 + 0.5 * normal, 1.0);`);break}case n.V.Highlight:(0,g.NB)(r,t),e.include(a.d,t),e.include(l.U,t),e.include(p.A,t),x&&u.uniforms.add(new _.N("tex",(e=>e.texture))),r.main.add(h.H`vpos = getVertexInLocalOriginSpace();
vpos = subtractOrigin(vpos);
vpos = addVerticalOffset(vpos, localOrigin);
gl_Position = transformPosition(proj, view, vpos);
forwardTextureCoordinates();`),e.fragment.include(o.HQ,t),e.include(v.S,t),e.include(f.Q,t),u.main.add(h.H`
        discardBySlice(vpos);
        ${(0,h.If)(x,h.H`vec4 texColor = texture(tex, ${E?"colorUV":"vuv0"});
                discardOrAdjustAlpha(texColor);`)}
        calculateOcclusionAndOutputHighlight();`)}}},22911:(e,t,r)=>{r.d(t,{NL:()=>m,ZX:()=>i});var i,n,o=r(49255),a=r(99208),s=r(40710),c=r(33079),l=r(31821),d=r(15976),u=r(63761),h=(r(25634),r(69270));function m(e,t){if(!(0,o.RN)(t.output))return;const{emissionSource:r,hasEmissiveTextureTransform:n,bindType:m}=t,f=r===i.Texture;f&&(e.include(a.r,t),e.fragment.uniforms.add(m===h.c.Pass?new u.N("texEmission",(e=>e.textureEmissive)):new d.o("texEmission",(e=>e.textureEmissive))));const p=r===i.Value||f;p&&e.fragment.uniforms.add(m===h.c.Pass?new c.t("emissionFactor",(e=>e.emissiveFactor)):new s.W("emissionFactor",(e=>e.emissiveFactor))),e.fragment.code.add(l.H`
    vec4 getEmissions() {
      vec4 emissions = ${p?"vec4(emissionFactor, 1.0)":"vec4(0.0)"};
      ${(0,l.If)(f,`emissions *= textureLookup(texEmission, ${n?"emissiveUV":"vuv0"});\n         emissions.w = emissions.rgb == vec3(0.0) ? 0.0: emissions.w;`)}
      return emissions;
    }
  `)}(n=i||(i={}))[n.None=0]="None",n[n.Value=1]="Value",n[n.Texture=2]="Texture",n[n.COUNT=3]="COUNT"},2981:(e,t,r)=>{r.d(t,{Q:()=>u});var i=r(31821);function n(e){const{fragment:t}=e;t.code.add(i.H`uint readChannelBits(uint channel, int highlightLevel) {
int llc = (highlightLevel & 3) << 1;
return (channel >> llc) & 3u;
}
uint readChannel(vec2 texel, int highlightLevel) {
int lic = (highlightLevel >> 2) & 1;
return uint(texel[lic] * 255.0);
}
uint readLevelBits(vec2 texel, int highlightLevel) {
return readChannelBits(readChannel(texel, highlightLevel), highlightLevel);
}`)}var o=r(49255),a=r(69270),s=r(74333);class c extends s.n{constructor(e,t){super(e,"ivec2",a.c.Bind,((r,i)=>r.setUniform2iv(e,t(i))))}}var l=r(35818),d=r(12791);function u(e,t){const{fragment:r}=e;t.output===o.V.Highlight?(r.uniforms.add(new d.x("depthTexture",(e=>e.mainDepth)),new d.x("highlightTexture",(e=>e.highlightMixTexture)),new l.W("highlightLevel",(e=>e.highlightLevel??0)),new c("highlightMixOrigin",(e=>e.highlightMixOrigin))),e.outputs.add("fragHighlight","vec2",0),e.include(n),r.code.add(i.H`vec2 getAccumulatedHighlight() {
return texelFetch(highlightTexture, ivec2(gl_FragCoord.xy) - highlightMixOrigin, 0).rg;
}
void outputHighlight(bool occluded) {
if (highlightLevel == 0) {
uint bits = occluded ? 3u : 1u;
fragHighlight = vec2(float(bits) / 255.0, 0.0);
} else {
int ll = (highlightLevel & 3) << 1;
int li = (highlightLevel >> 2) & 3;
uint bits;
if (occluded) {
bits = 3u << ll;
} else {
bits = 1u << ll;
}
vec2 combinedHighlight = getAccumulatedHighlight();
uint accumulatedI = uint(combinedHighlight[li] * 255.0);
combinedHighlight[li] = float(bits | accumulatedI) / 255.0;
fragHighlight = combinedHighlight;
}
}
bool isHighlightOccluded() {
float sceneDepth = texelFetch(depthTexture, ivec2(gl_FragCoord.xy), 0).x;
return gl_FragCoord.z > sceneDepth + 5e-7;
}
void calculateOcclusionAndOutputHighlight() {
outputHighlight(isHighlightOccluded());
}`),t.canHaveOverlay&&r.code.add(i.H`void calculateOcclusionAndOutputHighlightOverlay(vec2 highlightToAdd) {
uint levelBits = readLevelBits(highlightToAdd, highlightLevel);
if ((levelBits & 1u) == 0u) { discard; }
outputHighlight(isHighlightOccluded());
}`)):r.code.add(i.H`void calculateOcclusionAndOutputHighlight() {}`)}},52540:(e,t,r)=>{r.d(t,{E:()=>s});var i=r(37585),n=r(48163),o=r(77108),a=r(31821);function s(e){e.uniforms.add(new o.E("zProjectionMap",(e=>function(e){const t=e.projectionMatrix;return(0,i.hZ)(c,t[14],t[10])}(e.camera)))),e.code.add(a.H`float linearizeDepth(float depth) {
float depthNdc = depth * 2.0 - 1.0;
float c1 = zProjectionMap[0];
float c2 = zProjectionMap[1];
return -(c1 / (depthNdc + c2 + 1e-7));
}`),e.code.add(a.H`float depthFromTexture(sampler2D depthTexture, vec2 uv) {
ivec2 iuv = ivec2(uv * vec2(textureSize(depthTexture, 0)));
float depth = texelFetch(depthTexture, iuv, 0).r;
return depth;
}`),e.code.add(a.H`float linearDepthFromTexture(sampler2D depthTexture, vec2 uv) {
return linearizeDepth(depthFromTexture(depthTexture, uv));
}`)}const c=(0,n.vt)()},77695:(e,t,r)=>{r.d(t,{W:()=>p});var i=r(29242),n=r(48163),o=r(53466),a=r(99208),s=r(62602),c=r(47286),l=r(31821),d=r(35644),u=r(15976),h=r(63761),m=r(46540),f=r(69270);function p(e,t){const r=e.fragment;t.hasVertexTangents?(e.attributes.add(m.r.TANGENT,"vec4"),e.varyings.add("vTangent","vec4"),t.doubleSidedMode===s.W.WindingOrder?r.code.add(l.H`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):r.code.add(l.H`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):r.code.add(l.H`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),t.textureCoordinateType!==o.I.None&&(e.include(a.r,t),r.uniforms.add(t.bindType===f.c.Pass?new h.N("normalTexture",(e=>e.textureNormal)):new u.o("normalTexture",(e=>e.textureNormal))),t.hasNormalTextureTransform&&(r.uniforms.add(new c.G("scale",(e=>e.scale??n.Un))),r.uniforms.add(new d.k("normalTextureTransformMatrix",(e=>e.normalTextureTransformMatrix??i.zK)))),r.code.add(l.H`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;`),t.hasNormalTextureTransform&&r.code.add(l.H`mat3 normalTextureRotation = mat3(normalTextureTransformMatrix[0][0]/scale[0], normalTextureTransformMatrix[0][1]/scale[1], 0.0,
normalTextureTransformMatrix[1][0]/scale[0], normalTextureTransformMatrix[1][1]/scale[1], 0.0,
0.0, 0.0, 0.0 );
rawNormal.xy = (normalTextureRotation * vec3(rawNormal.x, rawNormal.y, 1.0)).xy;`),r.code.add(l.H`return tangentSpace * rawNormal;
}`))}},54849:(e,t,r)=>{r.d(t,{n:()=>V});var i,n,o,a,s,c,l=r(31821),d=r(12791),u=r(90237),h=r(34727),m=r(97768),f=r(36708),p=r(78659),v=r(10107),g=(r(44208),r(53966),r(87811),r(40608)),_=r(37585);r(9093),r(48353),r(9762),(c=i||(i={})).OPAQUE="opaque-color",c.TRANSPARENT="transparent-color",c.COMPOSITE="composite-color",c.FINAL="final-color",function(e){e.SSAO="ssao",e.LASERLINES="laserline-color",e.ANTIALIASING="aa-color",e.HIGHLIGHTS="highlight-color",e.MAGNIFIER="magnifier-color",e.OCCLUDED="occluded-color",e.VIEWSHED="viewshed-color",e.OPAQUE_ENVIRONMENT="opaque-environment-color",e.TRANSPARENT_ENVIRONMENT="transparent-environment-color",e.FOCUSAREA="focus-area"}(n||(n={})),(s=o||(o={}))[s.RED=0]="RED",s[s.RG=1]="RG",s[s.RGBA4=2]="RGBA4",s[s.RGBA=3]="RGBA",s[s.RGBA_MIPMAP=4]="RGBA_MIPMAP",s[s.R16F=5]="R16F",s[s.RGBA16F=6]="RGBA16F",function(e){e[e.DEPTH_STENCIL_TEXTURE=0]="DEPTH_STENCIL_TEXTURE",e[e.DEPTH16_BUFFER=1]="DEPTH16_BUFFER"}(a||(a={}));var T=r(69622),x=r(49186),A=r(89192);let b=class extends T.A{constructor(e){super(e),this.view=null,this.consumes={required:[]},this.produces=i.COMPOSITE,this.requireGeometryDepth=!1,this._dirty=!0}initialize(){this.addHandles([(0,f.wB)((()=>this.view.ready),(e=>{e&&this.view._stage?.renderer.addRenderNode(this)}),f.Vh)])}destroy(){this.view._stage?.renderer?.removeRenderNode(this)}precompile(){}render(){throw new x.A("RenderNode:render-function-not-implemented","render() is not implemented.")}get camera(){return this.view.state.camera.clone()}get sunLight(){return this.bindParameters.lighting.legacy}get gl(){return this.view._stage.renderView.renderingContext.gl}get techniques(){return this.view._stage.renderView.techniques}acquireOutputFramebuffer(){const e=this._frameBuffer?.getTexture()?.descriptor,t=this.view._stage.renderer.fboCache.acquire(e?.width??640,e?.height??480,this.produces);return t.fbo?.initializeAndBind(),t}bindRenderTarget(){return this._frameBuffer?.fbo?.initializeAndBind(),this._frameBuffer}requestRender(e){e===A.C7.UPDATE&&this.view._stage?.renderView.requestRender(e),this._dirty=!0}resetWebGLState(){this.renderingContext.resetState(),this.renderingContext.bindFramebuffer(this._frameBuffer?.fbo)}get fboCache(){return this.view._stage.renderer.fboCache}get bindParameters(){return this.renderContext.bind}get renderingContext(){return this.view._stage.renderView.renderingContext}get renderContext(){return this.view._stage?.renderer.renderContext}updateAnimation(e){return!!this._dirty&&(this._dirty=!1,!0)}doRender(e){this._frameBuffer=e.find((({name:e})=>e===this.produces));try{return this.render(e)}finally{this._frameBuffer=null}}};(0,u._)([(0,v.MZ)({constructOnly:!0})],b.prototype,"view",void 0),(0,u._)([(0,v.MZ)({constructOnly:!0})],b.prototype,"consumes",void 0),(0,u._)([(0,v.MZ)()],b.prototype,"produces",void 0),(0,u._)([(0,v.MZ)({readOnly:!0})],b.prototype,"techniques",null),b=(0,u._)([(0,g.$)("esri.views.3d.webgl.RenderNode")],b);const E=b;var S=r(97220),M=r(98958),C=r(95774),R=r(90644);class w extends M.w{constructor(e,t){super(e,t,new S.$(C.S,(()=>r.e(9384).then(r.bind(r,59384)))))}initializePipeline(){return(0,R.Ey)({colorWrite:R.kn})}}var I=r(48163),O=r(65786);class N extends O.Y{constructor(){super(...arguments),this.projScale=1}}class y extends N{constructor(){super(...arguments),this.intensity=1}}class P extends O.Y{}class L extends P{constructor(){super(...arguments),this.blurSize=(0,I.vt)()}}var D=r(15581);class H extends M.w{constructor(e,t){super(e,t,new S.$(D.S,(()=>r.e(191).then(r.bind(r,90191)))))}initializePipeline(){return(0,R.Ey)({colorWrite:R.kn})}}var F=r(63907),B=r(30164),U=r(67171);let G=class extends E{constructor(e){super(e),this.consumes={required:["normals"]},this.produces=n.SSAO,this.isEnabled=()=>!1,this._enableTime=(0,p.l5)(0),this._passParameters=new y,this._drawParameters=new L}initialize(){const e=Uint8Array.from(atob("eXKEvZaUc66cjIKElE1jlJ6MjJ6Ufkl+jn2fcXp5jBx7c6KEflSGiXuXeW6OWs+tfqZ2Yot2Y7Zzfo2BhniEj3xoiXuXj4eGZpqEaHKDWjSMe7palFlzc3BziYOGlFVzg6Zzg7CUY5JrjFF7eYJ4jIKEcyyEonSXe7qUfqZ7j3xofqZ2c4R5lFZ5Y0WUbppoe1l2cIh2ezyUho+BcHN2cG6DbpqJhqp2e1GcezhrdldzjFGUcyxjc3aRjDyEc1h7Sl17c6aMjH92pb6Mjpd4dnqBjMOEhqZleIOBYzB7gYx+fnqGjJuEkWlwnCx7fGl+c4hjfGyRe5qMlNOMfnqGhIWHc6OMi4GDc6aMfqZuc6aMzqJzlKZ+lJ6Me3qRfoFue0WUhoR5UraEa6qMkXiPjMOMlJOGe7JrUqKMjK6MeYRzdod+Sl17boiPc6qEeYBlcIh2c1WEe7GDiWCDa0WMjEmMdod+Y0WcdntzhmN8WjyMjKJjiXtzgYxYaGd+a89zlEV7e2GJfnd+lF1rcK5zc4p5cHuBhL6EcXp5eYB7fnh8iX6HjIKEeaxuiYOGc66RfG2Ja5hzjlGMjEmMe9OEgXuPfHyGhPeEdl6JY02McGuMfnqGhFiMa3WJfnx2l4hwcG1uhmN8c0WMc39og1GBbrCEjE2EZY+JcIh2cIuGhIWHe0mEhIVrc09+gY5+eYBlnCyMhGCDl3drfmmMgX15aGd+gYx+fnuRfnhzY1SMsluJfnd+hm98WtNrcIuGh4SEj0qPdkqOjFF7jNNjdnqBgaqUjMt7boeBhnZ4jDR7c5pze4GGjEFrhLqMjHyMc0mUhKZze4WEa117kWlwbpqJjHZ2eX2Bc09zeId+e0V7WlF7jHJ2l72BfId8l3eBgXyBe897jGl7c66cgW+Xc76EjKNbgaSEjGx4fId8jFFjgZB8cG6DhlFziZhrcIh2fH6HgUqBgXiPY8dahGFzjEmMhEFre2dxhoBzc5SGfleGe6alc7aUeYBlhKqUdlp+cH5za4OEczxza0Gcc4J2jHZ5iXuXjH2Jh5yRjH2JcFx+hImBjH+MpddCl3dreZeJjIt8ZW18bm1zjoSEeIOBlF9oh3N7hlqBY4+UeYFwhLJjeYFwaGd+gUqBYxiEYot2fqZ2ondzhL6EYyiEY02Ea0VjgZB8doaGjHxoc66cjEGEiXuXiXWMiZhreHx8frGMe75rY02Ec5pzfnhzlEp4a3VzjM+EhFFza3mUY7Zza1V5e2iMfGyRcziEhDyEkXZ2Y4OBnCx7g5t2eyBjgV6EhEFrcIh2dod+c4Z+nJ5zjm15jEmUeYxijJp7nL6clIpjhoR5WrZraGd+fnuRa6pzlIiMg6ZzfHx5foh+eX1ufnB5eX1ufnB5aJt7UqKMjIh+e3aBfm5lbYSBhGFze6J4c39oc0mUc4Z+e0V7fKFVe0WEdoaGY02Ec4Z+Y02EZYWBfH6HgU1+gY5+hIWUgW+XjJ57ebWRhFVScHuBfJ6PhBx7WqJzlM+Ujpd4gHZziX6HjHmEgZN+lJt5boiPe2GJgX+GjIGJgHZzeaxufnB5hF2JtdN7jJ57hp57hK6ElFVzg6ZzbmiEbndzhIWHe3uJfoFue3qRhJd2j3xoc65zlE1jc3p8lE1jhniEgXJ7e657vZaUc3qBh52BhIF4aHKDa9drgY5+c52GWqZzbpqJe8tjnM+UhIeMfo2BfGl+hG1zSmmMjKJjZVaGgX15c1lze0mEp4OHa3mUhIWHhDyclJ6MeYOJkXiPc0VzhFiMlKaEboSJa5Jze41re3qRhn+HZYWBe0mEc4p5fnORbox5lEp4hGFjhGGEjJuEc1WEhLZjeHeGa7KlfHx2hLaMeX1ugY5+hIWHhKGPjMN7c1WEho1zhoBzZYx7fnhzlJt5exyUhFFziXtzfmmMa6qMYyiEiXxweV12kZSMeWqXSl17fnhzxmmMrVGEe1mcc4p5eHeGjK6MgY5+doaGa6pzlGV7g1qBh4KHkXiPeW6OaKqafqZ2eXZ5e1V7jGd7boSJc3BzhJd2e0mcYot2h1RoY8dahK6EQmWEWjx7e1l2lL6UgXyBdnR4eU9zc0VreX1umqaBhld7fo2Bc6KEc5Z+hDyEcIeBWtNrfHyGe5qMhMuMe5qMhEGEbVVupcNzg3aHhIF4boeBe0mEdlptc39ofFl5Y8uUlJOGiYt2UmGEcyxjjGx4jFF7a657ZYWBnElzhp57iXtrgZN+tfOEhIOBjE2HgU1+e8tjjKNbiWCDhE15gUqBgYN7fnqGc66ce9d7iYSBj0qPcG6DnGGcT3eGa6qMZY+JlIiMl4hwc3aRdnqBlGV7eHJ2hLZjfnuRhDyEeX6MSk17g6Z+c6aUjHmEhIF4gXyBc76EZW18fGl+fkl+jCxrhoVwhDyUhIqGlL2DlI6EhJd2tdN7eYORhEGMa2Faa6pzc3Bzc4R5lIRznM+UY9eMhDycc5Z+c4p5c4iGY117pb6MgXuPrbJafnx2eYOJeXZ5e657hDyEcziElKZjfoB5eHeGj4WRhGGEe6KGeX1utTStc76EhFGJnCyMa5hzfH6HnNeceYB7hmN8gYuMhIVrczSMgYF8h3N7c5pza5hzjJqEYIRdgYuMlL2DeYRzhGGEeX1uhLaEc4iGeZ1zdl6JhrVteX6Me2iMfm5lWqJzSpqEa6pzdnmchHx2c6OMhNdrhoR5g3aHczxzeW52gV6Ejm15frGMc0Vzc4Z+l3drfniJe+9rWq5rlF1rhGGEhoVwe9OEfoh+e7pac09+c3qBY0lrhDycdnp2lJ6MiYOGhGCDc3aRlL2DlJt5doaGdnp2gYF8gWeOjF2Uc4R5c5Z+jEmMe7KEc4mEeYJ4dmyBe0mcgXiPbqJ7eYB7fmGGiYSJjICGlF1reZ2PnElzbpqJfH6Hc39oe4WEc5eJhK6EhqyJc3qBgZB8c09+hEmEaHKDhFGJc5SGiXWMUpaEa89zc6OMnCyMiXtrho+Be5qMc7KEjJ57dmN+hKGPjICGbmiEe7prdod+hGCDdnmchBx7eX6MkXZ2hGGEa657hm98jFFjY5JreYOJgY2EjHZ2a295Y3FajJ6Mc1J+YzB7e4WBjF2Uc4R5eV12gYxzg1qBeId+c9OUc5pzjFFjgY5+hFiMlIaPhoR5lIpjjIKBlNdSe7KEeX2BfrGMhIqGc65zjE2UhK6EklZ+QmWEeziMWqZza3VzdnR4foh+gYF8n3iJiZhrnKp7gYF8eId+lJ6Me1lrcIuGjKJjhmN8c66MjFF7a6prjJ6UnJ5zezyUfruRWlF7nI5zfHyGe657h4SEe8tjhBx7jFFjc09+c39ojICMeZeJeXt+YzRzjHZ2c0WEcIeBeXZ5onSXkVR+gYJ+eYFwdldzgYF7eX2BjJ6UiXuXlE1jh4SEe1mchLJjc4Z+hqZ7eXZ5bm1zlL6Ue5p7iWeGhKqUY5pzjKJjcIeBe8t7gXyBYIRdlEp4a3mGnK6EfmmMZpqEfFl5gYxzjKZuhGFjhoKGhHx2fnx2eXuMe3aBiWeGvbKMe6KGa5hzYzB7gZOBlGV7hmN8hqZlYot2Y117a6pzc6KEfId8foB5rctrfneJfJ6PcHN2hFiMc5pzjH92c0VzgY2EcElzdmCBlFVzg1GBc65zY4OBboeBcHiBeYJ4ewxzfHx5lIRzlEmEnLKEbk1zfJ6PhmN8eYBljBiEnMOEiXxwezyUcIeBe76EdsKEeX2BdnR4jGWUrXWMjGd7fkl+j4WRlEGMa5Jzho+BhDyEfnqMeXt+g3aHlE1jczClhNN7ZW18eHx8hGFjZW18iXWMjKJjhH57gYuMcIuGWjyMe4ZtjJuExmmMj4WRdntzi4GDhFFzYIRdnGGcjJp7Y0F7e4WEkbCGiX57fnSHa657a6prhBCMe3Z+SmmMjH92eHJ2hK6EY1FzexhrvbKMnI5za4OEfnd+eXuMhImBe897hLaMjN+EfG+BeIOBhF1+eZeJi4GDkXZ2eXKEgZ6Ejpd4c2GHa1V5e5KUfqZuhCx7jKp7lLZrg11+hHx2hFWUoot2nI5zgbh5mo9zvZaUe3qRbqKMfqZ2kbCGhFiM"),(e=>e.charCodeAt(0))),t=new U.R;t.wrapMode=F.pF.CLAMP_TO_EDGE,t.pixelFormat=F.Ab.RGB,t.wrapMode=F.pF.REPEAT,t.hasMipmap=!0,t.width=32,t.height=32,this._passParameters.noiseTexture=new B.g(this.renderingContext,t,e),this.techniques.precompile(H),this.techniques.precompile(w),this.addHandles((0,f.wB)((()=>this.isEnabled()),(()=>this._enableTime=(0,p.l5)(0))))}destroy(){this._passParameters.noiseTexture=(0,m.WD)(this._passParameters.noiseTexture)}render(e){const t=this.bindParameters,r=e.find((({name:e})=>"normals"===e)),i=r?.getTexture(),a=r?.getTexture(F.nI),s=this.fboCache,c=t.camera,l=c.fullViewport[2],d=c.fullViewport[3],u=Math.round(l/2),m=Math.round(d/2),f=this.techniques.get(H),v=this.techniques.get(w);if(!f.compiled||!v.compiled)return this._enableTime=(0,p.l5)(performance.now()),this.requestRender(A.C7.UPDATE),s.acquire(u,m,n.SSAO,o.RED);0===this._enableTime&&(this._enableTime=(0,p.l5)(performance.now()));const g=this.renderingContext,T=this.view.qualitySettings.fadeDuration,x=c.relativeElevation,b=(0,h.qE)((5e5-x)/2e5,0,1),E=T>0?Math.min(T,performance.now()-this._enableTime)/T:1,S=E*b;this._passParameters.normalTexture=i,this._passParameters.depthTexture=a,this._passParameters.projScale=1/c.computeScreenPixelSizeAtDist(1),this._passParameters.intensity=4*z/(0,D.g)(c)**6*S;const M=s.acquire(l,d,"ssao input",o.RG);g.bindFramebuffer(M.fbo),g.setViewport(0,0,l,d),g.bindTechnique(f,t,this._passParameters,this._drawParameters),g.screen.draw();const C=s.acquire(u,m,"ssao blur",o.RED);g.bindFramebuffer(C.fbo),this._drawParameters.colorTexture=M.getTexture(),(0,_.hZ)(this._drawParameters.blurSize,0,2/d),g.bindTechnique(v,t,this._passParameters,this._drawParameters),g.setViewport(0,0,u,m),g.screen.draw(),M.release();const R=s.acquire(u,m,n.SSAO,o.RED);return g.bindFramebuffer(R.fbo),g.setViewport(0,0,l,d),g.setClearColor(1,1,1,0),g.clear(F.NV.COLOR),this._drawParameters.colorTexture=C.getTexture(),(0,_.hZ)(this._drawParameters.blurSize,2/l,0),g.bindTechnique(v,t,this._passParameters,this._drawParameters),g.setViewport(0,0,u,m),g.screen.draw(),g.setViewport4fv(c.fullViewport),C.release(),E<1&&this.requestRender(A.C7.UPDATE),R}};(0,u._)([(0,v.MZ)()],G.prototype,"consumes",void 0),(0,u._)([(0,v.MZ)()],G.prototype,"produces",void 0),(0,u._)([(0,v.MZ)({constructOnly:!0})],G.prototype,"isEnabled",void 0),G=(0,u._)([(0,g.$)("esri.views.3d.webgl-engine.effects.ssao.SSAO")],G);const z=.5;function V(e,t){const r=e.fragment;t.receiveAmbientOcclusion?(r.uniforms.add(new d.x("ssaoTex",(e=>e.ssao?.getTexture()))),r.constants.add("blurSizePixelsInverse","float",.5),r.code.add(l.H`float evaluateAmbientOcclusionInverse() {
vec2 ssaoTextureSizeInverse = 1.0 / vec2(textureSize(ssaoTex, 0));
return texture(ssaoTex, gl_FragCoord.xy * blurSizePixelsInverse * ssaoTextureSizeInverse).r;
}
float evaluateAmbientOcclusion() {
return 1.0 - evaluateAmbientOcclusionInverse();
}`)):r.code.add(l.H`float evaluateAmbientOcclusionInverse() { return 1.0; }
float evaluateAmbientOcclusion() { return 0.0; }`)}},74081:(e,t,r)=>{r.d(t,{kA:()=>S,a8:()=>b,eU:()=>E});var i=r(40876),n=r(21818),o=r(38954),a=r(51850),s=r(87317),c=r(91829),l=r(59469),d=r(23205),u=r(14314),h=r(31821);function m(e,t){const r=e.fragment,i=void 0!==t.lightingSphericalHarmonicsOrder?t.lightingSphericalHarmonicsOrder:2;0===i?(r.uniforms.add(new d.d("lightingAmbientSH0",(({lighting:e})=>(0,o.i)(f,e.sh.r[0],e.sh.g[0],e.sh.b[0])))),r.code.add(h.H`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
return ambientLight * (1.0 - ambientOcclusion);
}`)):1===i?(r.uniforms.add(new u.I("lightingAmbientSH_R",(({lighting:e})=>(0,s.s)(p,e.sh.r[0],e.sh.r[1],e.sh.r[2],e.sh.r[3]))),new u.I("lightingAmbientSH_G",(({lighting:e})=>(0,s.s)(p,e.sh.g[0],e.sh.g[1],e.sh.g[2],e.sh.g[3]))),new u.I("lightingAmbientSH_B",(({lighting:e})=>(0,s.s)(p,e.sh.b[0],e.sh.b[1],e.sh.b[2],e.sh.b[3])))),r.code.add(h.H`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec4 sh0 = vec4(
0.282095,
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y
);
vec3 ambientLight = vec3(
dot(lightingAmbientSH_R, sh0),
dot(lightingAmbientSH_G, sh0),
dot(lightingAmbientSH_B, sh0)
);
return ambientLight * (1.0 - ambientOcclusion);
}`)):2===i&&(r.uniforms.add(new d.d("lightingAmbientSH0",(({lighting:e})=>(0,o.i)(f,e.sh.r[0],e.sh.g[0],e.sh.b[0]))),new u.I("lightingAmbientSH_R1",(({lighting:e})=>(0,s.s)(p,e.sh.r[1],e.sh.r[2],e.sh.r[3],e.sh.r[4]))),new u.I("lightingAmbientSH_G1",(({lighting:e})=>(0,s.s)(p,e.sh.g[1],e.sh.g[2],e.sh.g[3],e.sh.g[4]))),new u.I("lightingAmbientSH_B1",(({lighting:e})=>(0,s.s)(p,e.sh.b[1],e.sh.b[2],e.sh.b[3],e.sh.b[4]))),new u.I("lightingAmbientSH_R2",(({lighting:e})=>(0,s.s)(p,e.sh.r[5],e.sh.r[6],e.sh.r[7],e.sh.r[8]))),new u.I("lightingAmbientSH_G2",(({lighting:e})=>(0,s.s)(p,e.sh.g[5],e.sh.g[6],e.sh.g[7],e.sh.g[8]))),new u.I("lightingAmbientSH_B2",(({lighting:e})=>(0,s.s)(p,e.sh.b[5],e.sh.b[6],e.sh.b[7],e.sh.b[8])))),r.code.add(h.H`vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
vec3 ambientLight = 0.282095 * lightingAmbientSH0;
vec4 sh1 = vec4(
0.488603 * normal.x,
0.488603 * normal.z,
0.488603 * normal.y,
1.092548 * normal.x * normal.y
);
vec4 sh2 = vec4(
1.092548 * normal.y * normal.z,
0.315392 * (3.0 * normal.z * normal.z - 1.0),
1.092548 * normal.x * normal.z,
0.546274 * (normal.x * normal.x - normal.y * normal.y)
);
ambientLight += vec3(
dot(lightingAmbientSH_R1, sh1),
dot(lightingAmbientSH_G1, sh1),
dot(lightingAmbientSH_B1, sh1)
);
ambientLight += vec3(
dot(lightingAmbientSH_R2, sh2),
dot(lightingAmbientSH_G2, sh2),
dot(lightingAmbientSH_B2, sh2)
);
return ambientLight * (1.0 - ambientOcclusion);
}`),t.pbrMode!==l.A9.Normal&&t.pbrMode!==l.A9.Schematic||r.code.add(h.H`const vec3 skyTransmittance = vec3(0.9, 0.9, 1.0);
vec3 calculateAmbientRadiance(float ambientOcclusion)
{
vec3 ambientLight = 1.2 * (0.282095 * lightingAmbientSH0) - 0.2;
return ambientLight *= (1.0 - ambientOcclusion) * skyTransmittance;
}`))}const f=(0,a.vt)(),p=(0,c.vt)();var v=r(54849),g=r(98619),_=r(22393),T=r(89786),x=r(32976),A=r(33094);r(34727),(0,a.vt)();function b(e){e.constants.add("ambientBoostFactor","float",.4)}function E(e){e.uniforms.add(new A.U("lightingGlobalFactor",(e=>e.lighting.globalFactor)))}function S(e,t){const r=e.fragment;switch(e.include(v.n,t),t.pbrMode!==l.A9.Disabled&&e.include(_.c,t),e.include(m,t),e.include(T.p),r.code.add(h.H`
    const float GAMMA_SRGB = ${h.H.float(i.Tf)};
    const float INV_GAMMA_SRGB = 0.4761904;
    ${t.pbrMode===l.A9.Disabled?"":"const vec3 GROUND_REFLECTANCE = vec3(0.2);"}
  `),b(r),E(r),(0,g.Gc)(r),r.code.add(h.H`
    float additionalDirectedAmbientLight(vec3 vPosWorld) {
      float vndl = dot(${t.spherical?h.H`normalize(vPosWorld)`:h.H`vec3(0.0, 0.0, 1.0)`}, mainLightDirection);
      return smoothstep(0.0, 1.0, clamp(vndl * 2.5, 0.0, 1.0));
    }
  `),(0,g.O4)(r),r.code.add(h.H`vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
float additionalAmbientScale = additionalDirectedAmbientLight(vPosWorld);
return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * mainLightIntensity;
}`),t.pbrMode){case l.A9.Disabled:case l.A9.WaterOnIntegratedMesh:case l.A9.Water:e.include(g.Vt),r.code.add(h.H`vec3 evaluateSceneLighting(vec3 normalWorld, vec3 albedo, float shadow, float ssao, vec3 additionalLight) {
vec3 mainLighting = applyShading(normalWorld, shadow);
vec3 ambientLighting = calculateAmbientIrradiance(normalWorld, ssao);
vec3 albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
vec3 totalLight = mainLighting + ambientLighting + additionalLight;
totalLight = min(totalLight, vec3(PI));
vec3 outColor = vec3((albedoLinear / PI) * totalLight);
return pow(outColor, vec3(INV_GAMMA_SRGB));
}`);break;case l.A9.Normal:case l.A9.Schematic:r.code.add(h.H`const float fillLightIntensity = 0.25;
const float horizonLightDiffusion = 0.4;
const float additionalAmbientIrradianceFactor = 0.02;
vec3 evaluateSceneLightingPBR(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight, vec3 viewDir, vec3 normalGround, vec3 mrr, vec4 _emission, float additionalAmbientIrradiance)
{
vec3 viewDirection = -viewDir;
vec3 h = normalize(viewDirection + mainLightDirection);
PBRShadingInfo inputs;
inputs.NdotV = clamp(abs(dot(normal, viewDirection)), 0.001, 1.0);
inputs.NdotNG = clamp(dot(normal, normalGround), -1.0, 1.0);
vec3 reflectedView = normalize(reflect(viewDirection, normal));
inputs.RdotNG = clamp(dot(reflectedView, normalGround), -1.0, 1.0);
inputs.albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
inputs.ssao = ssao;
inputs.metalness = mrr[0];
inputs.roughness = clamp(mrr[1] * mrr[1], 0.001, 0.99);`),r.code.add(h.H`inputs.f0 = (0.16 * mrr[2] * mrr[2]) * (1.0 - inputs.metalness) + inputs.albedoLinear * inputs.metalness;
inputs.f90 = vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0));
inputs.diffuseColor = inputs.albedoLinear * (vec3(1.0) - inputs.f0) * (1.0 - inputs.metalness);`),t.useFillLights?r.uniforms.add(new x.o("hasFillLights",(e=>e.enableFillLights))):r.constants.add("hasFillLights","bool",!1),r.code.add(h.H`vec3 ambientDir = vec3(5.0 * normalGround[1] - normalGround[0] * normalGround[2], - 5.0 * normalGround[0] - normalGround[2] * normalGround[1], normalGround[1] * normalGround[1] + normalGround[0] * normalGround[0]);
ambientDir = ambientDir != vec3(0.0) ? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));
inputs.NdotAmbDir = hasFillLights ? abs(dot(normal, ambientDir)) : 1.0;
float NdotL = clamp(dot(normal, mainLightDirection), 0.001, 1.0);
vec3 mainLightIrradianceComponent = NdotL * (1.0 - shadow) * mainLightIntensity;
vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * mainLightIntensity * fillLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(normal, ssao) + additionalLight;
inputs.skyIrradianceToSurface = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
inputs.groundIrradianceToSurface = GROUND_REFLECTANCE * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;`),r.uniforms.add(new A.U("lightingSpecularStrength",(e=>e.lighting.mainLight.specularStrength)),new A.U("lightingEnvironmentStrength",(e=>e.lighting.mainLight.environmentStrength))).code.add(h.H`vec3 horizonRingDir = inputs.RdotNG * normalGround - reflectedView;
vec3 horizonRingH = normalize(viewDirection + horizonRingDir);
inputs.NdotH_Horizon = dot(normal, horizonRingH);
float NdotH = clamp(dot(normal, h), 0.0, 1.0);
vec3 mainLightRadianceComponent = lightingSpecularStrength * normalDistribution(NdotH, inputs.roughness) * mainLightIntensity * (1.0 - shadow);
vec3 horizonLightRadianceComponent = lightingEnvironmentStrength * normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * mainLightIntensity * fillLightIntensity;
vec3 ambientLightRadianceComponent = lightingEnvironmentStrength * calculateAmbientRadiance(ssao) + additionalLight;
float normalDirectionModifier = mix(1., min(mix(0.1, 2.0, (inputs.NdotNG + 1.) * 0.5), 1.0), clamp(inputs.roughness * 5.0, 0.0 , 1.0));
inputs.skyRadianceToSurface = (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;
inputs.groundRadianceToSurface = 0.5 * GROUND_REFLECTANCE * (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;
inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + GROUND_REFLECTANCE[1]);`),r.code.add(h.H`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 emissionComponent = _emission.rgb == vec3(0.0) ? _emission.rgb : pow(_emission.rgb, vec3(GAMMA_SRGB));
        vec3 outColorLinear = reflectedColorComponent + additionalMaterialReflectanceComponent + emissionComponent;
        ${t.pbrMode!==l.A9.Schematic||t.hasColorTexture?h.H`vec3 outColor = pow(blackLevelSoftCompression(outColorLinear, inputs), vec3(INV_GAMMA_SRGB));`:h.H`vec3 outColor = pow(max(vec3(0.0), outColorLinear - 0.005 * inputs.averageAmbientRadiance), vec3(INV_GAMMA_SRGB));`}
        return outColor;
      }
    `);break;case l.A9.Simplified:case l.A9.TerrainWithWater:(0,g.Gc)(r),(0,g.O4)(r),r.code.add(h.H`const float roughnessTerrain = 0.5;
const float specularityTerrain = 0.5;
const vec3 fresnelReflectionTerrain = vec3(0.04);
vec3 evaluatePBRSimplifiedLighting(vec3 n, vec3 c, float shadow, float ssao, vec3 al, vec3 vd, vec3 nup) {
vec3 viewDirection = -vd;
vec3 h = normalize(viewDirection + mainLightDirection);
float NdotL = clamp(dot(n, mainLightDirection), 0.001, 1.0);
float NdotV = clamp(abs(dot(n, viewDirection)), 0.001, 1.0);
float NdotH = clamp(dot(n, h), 0.0, 1.0);
float NdotNG = clamp(dot(n, nup), -1.0, 1.0);
vec3 albedoLinear = pow(c, vec3(GAMMA_SRGB));
float lightness = 0.3 * albedoLinear[0] + 0.5 * albedoLinear[1] + 0.2 * albedoLinear[2];
vec3 f0 = (0.85 * lightness + 0.15) * fresnelReflectionTerrain;
vec3 f90 =  vec3(clamp(dot(f0, vec3(50.0 * 0.33)), 0.0, 1.0));
vec3 mainLightIrradianceComponent = (1. - shadow) * NdotL * mainLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(n, ssao) + al;
vec3 ambientSky = ambientLightIrradianceComponent + mainLightIrradianceComponent;
vec3 indirectDiffuse = ((1.0 - NdotNG) * mainLightIrradianceComponent + (1.0 + NdotNG ) * ambientSky) * 0.5;
vec3 outDiffColor = albedoLinear * (1.0 - f0) * indirectDiffuse / PI;
vec3 mainLightRadianceComponent = normalDistribution(NdotH, roughnessTerrain) * mainLightIntensity;
vec2 dfg = prefilteredDFGAnalytical(roughnessTerrain, NdotV);
vec3 specularColor = f0 * dfg.x + f90 * dfg.y;
vec3 specularComponent = specularityTerrain * specularColor * mainLightRadianceComponent;
vec3 outColorLinear = outDiffColor + specularComponent;
vec3 outColor = pow(outColorLinear, vec3(INV_GAMMA_SRGB));
return outColor;
}`);break;default:(0,n.Xb)(t.pbrMode);case l.A9.COUNT:}}(0,a.vt)()},98619:(e,t,r)=>{r.d(t,{Gc:()=>o,O4:()=>a,Vt:()=>s});var i=r(23205),n=r(31821);function o(e){e.uniforms.add(new i.d("mainLightDirection",(e=>e.lighting.mainLight.direction)))}function a(e){e.uniforms.add(new i.d("mainLightIntensity",(e=>e.lighting.mainLight.intensity)))}function s(e){o(e.fragment),a(e.fragment),e.fragment.code.add(n.H`vec3 applyShading(vec3 shadingNormalWorld, float shadow) {
float dotVal = clamp(dot(shadingNormalWorld, mainLightDirection), 0.0, 1.0);
return mainLightIntensity * ((1.0 - shadow) * dotVal);
}`)}},62602:(e,t,r)=>{r.d(t,{W:()=>i,r:()=>s});var i,n,o=r(21818),a=r(31821);function s(e,t){const r=e.fragment;switch(r.code.add(a.H`struct ShadingNormalParameters {
vec3 normalView;
vec3 viewDirection;
} shadingParams;`),t.doubleSidedMode){case i.None:r.code.add(a.H`vec3 shadingNormal(ShadingNormalParameters params) {
return normalize(params.normalView);
}`);break;case i.View:r.code.add(a.H`vec3 shadingNormal(ShadingNormalParameters params) {
return dot(params.normalView, params.viewDirection) > 0.0 ? normalize(-params.normalView) : normalize(params.normalView);
}`);break;case i.WindingOrder:r.code.add(a.H`vec3 shadingNormal(ShadingNormalParameters params) {
return gl_FrontFacing ? normalize(params.normalView) : normalize(-params.normalView);
}`);break;default:(0,o.Xb)(t.doubleSidedMode);case i.COUNT:}}(n=i||(i={}))[n.None=0]="None",n[n.View=1]="View",n[n.WindingOrder=2]="WindingOrder",n[n.COUNT=3]="COUNT"},22393:(e,t,r)=>{r.d(t,{c:()=>s});var i=r(31821);function n(e){const t=e.fragment.code;t.add(i.H`vec3 evaluateDiffuseIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float NdotNG)
{
return ((1.0 - NdotNG) * ambientGround + (1.0 + NdotNG) * ambientSky) * 0.5;
}`),t.add(i.H`float integratedRadiance(float cosTheta2, float roughness)
{
return (cosTheta2 - 1.0) / (cosTheta2 * (1.0 - roughness * roughness) - 1.0);
}`),t.add(i.H`vec3 evaluateSpecularIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float RdotNG, float roughness)
{
float cosTheta2 = 1.0 - RdotNG * RdotNG;
float intRadTheta = integratedRadiance(cosTheta2, roughness);
float ground = RdotNG < 0.0 ? 1.0 - intRadTheta : 1.0 + intRadTheta;
float sky = 2.0 - ground;
return (ground * ambientGround + sky * ambientSky) * 0.5;
}`)}var o=r(59469),a=r(89786);function s(e,t){const r=e.fragment.code;e.include(a.p),t.pbrMode!==o.A9.Normal&&t.pbrMode!==o.A9.Schematic&&t.pbrMode!==o.A9.Simplified&&t.pbrMode!==o.A9.TerrainWithWater||(r.add(i.H`float normalDistribution(float NdotH, float roughness)
{
float a = NdotH * roughness;
float b = roughness / (1.0 - NdotH * NdotH + a * a);
return b * b * INV_PI;
}`),r.add(i.H`const vec4 c0 = vec4(-1.0, -0.0275, -0.572,  0.022);
const vec4 c1 = vec4( 1.0,  0.0425,  1.040, -0.040);
const vec2 c2 = vec2(-1.04, 1.04);
vec2 prefilteredDFGAnalytical(float roughness, float NdotV) {
vec4 r = roughness * c0 + c1;
float a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
return c2 * a004 + r.zw;
}`)),t.pbrMode!==o.A9.Normal&&t.pbrMode!==o.A9.Schematic||(e.include(n),r.add(i.H`struct PBRShadingInfo
{
float NdotV;
float LdotH;
float NdotNG;
float RdotNG;
float NdotAmbDir;
float NdotH_Horizon;
vec3 skyRadianceToSurface;
vec3 groundRadianceToSurface;
vec3 skyIrradianceToSurface;
vec3 groundIrradianceToSurface;
float averageAmbientRadiance;
float ssao;
vec3 albedoLinear;
vec3 f0;
vec3 f90;
vec3 diffuseColor;
float metalness;
float roughness;
};`),r.add(i.H`vec3 evaluateEnvironmentIllumination(PBRShadingInfo inputs) {
vec3 indirectDiffuse = evaluateDiffuseIlluminationHemisphere(inputs.groundIrradianceToSurface, inputs.skyIrradianceToSurface, inputs.NdotNG);
vec3 indirectSpecular = evaluateSpecularIlluminationHemisphere(inputs.groundRadianceToSurface, inputs.skyRadianceToSurface, inputs.RdotNG, inputs.roughness);
vec3 diffuseComponent = inputs.diffuseColor * indirectDiffuse * INV_PI;
vec2 dfg = prefilteredDFGAnalytical(inputs.roughness, inputs.NdotV);
vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
vec3 specularComponent = specularColor * indirectSpecular;
return (diffuseComponent + specularComponent);
}`),r.add(i.H`float gamutMapChanel(float x, vec2 p){
return (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
}`),r.add(i.H`vec3 blackLevelSoftCompression(vec3 inColor, PBRShadingInfo inputs){
vec3 outColor;
vec2 p = vec2(0.02 * (inputs.averageAmbientRadiance), 0.0075 * (inputs.averageAmbientRadiance));
outColor.x = gamutMapChanel(inColor.x, p) ;
outColor.y = gamutMapChanel(inColor.y, p) ;
outColor.z = gamutMapChanel(inColor.z, p) ;
return outColor;
}`))}},59469:(e,t,r)=>{r.d(t,{A9:()=>i,_Z:()=>m});var i,n,o=r(99208),a=r(40710),s=r(33079),c=r(31821),l=r(15976),d=r(63761),u=r(25634),h=(r(74810),r(69270));function m(e,t){const r=t.pbrMode,n=e.fragment;if(r!==i.Schematic&&r!==i.Disabled&&r!==i.Normal)return void n.code.add(c.H`void applyPBRFactors() {}`);if(r===i.Disabled)return void n.code.add(c.H`void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);if(r===i.Schematic)return void n.code.add(c.H`vec3 mrr = vec3(0.0, 0.6, 0.2);
float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);const{hasMetallicRoughnessTexture:u,hasMetallicRoughnessTextureTransform:m,hasOcclusionTexture:f,hasOcclusionTextureTransform:p,bindType:v}=t;(u||f)&&e.include(o.r,t),n.code.add(c.H`vec3 mrr;
float occlusion;`),u&&n.uniforms.add(v===h.c.Pass?new d.N("texMetallicRoughness",(e=>e.textureMetallicRoughness)):new l.o("texMetallicRoughness",(e=>e.textureMetallicRoughness))),f&&n.uniforms.add(v===h.c.Pass?new d.N("texOcclusion",(e=>e.textureOcclusion)):new l.o("texOcclusion",(e=>e.textureOcclusion))),n.uniforms.add(v===h.c.Pass?new s.t("mrrFactors",(e=>e.mrrFactors)):new a.W("mrrFactors",(e=>e.mrrFactors))),n.code.add(c.H`
    ${(0,c.If)(u,c.H`void applyMetallicRoughness(vec2 uv) {
            vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
            mrr[0] *= metallicRoughness.b;
            mrr[1] *= metallicRoughness.g;
          }`)}

    ${(0,c.If)(f,"void applyOcclusion(vec2 uv) { occlusion *= textureLookup(texOcclusion, uv).r; }")}

    float getBakedOcclusion() {
      return ${f?"occlusion":"1.0"};
    }

    void applyPBRFactors() {
      mrr = mrrFactors;
      occlusion = 1.0;

      ${(0,c.If)(u,`applyMetallicRoughness(${m?"metallicRoughnessUV":"vuv0"});`)}
      ${(0,c.If)(f,`applyOcclusion(${p?"occlusionUV":"vuv0"});`)}
    }
  `)}(n=i||(i={}))[n.Disabled=0]="Disabled",n[n.Normal=1]="Normal",n[n.Schematic=2]="Schematic",n[n.Water=3]="Water",n[n.WaterOnIntegratedMesh=4]="WaterOnIntegratedMesh",n[n.Simplified=5]="Simplified",n[n.TerrainWithWater=6]="TerrainWithWater",n[n.COUNT=7]="COUNT",u.NV},89786:(e,t,r)=>{function i(e){const t=3.141592653589793,r=.3183098861837907;e.vertex.constants.add("PI","float",t),e.fragment.constants.add("PI","float",t),e.fragment.constants.add("LIGHT_NORMALIZATION","float",r),e.fragment.constants.add("INV_PI","float",r),e.fragment.constants.add("HALF_PI","float",1.570796326794897),e.fragment.constants.add("TWO_PI","float",6.28318530717958)}r.d(t,{p:()=>i})},25618:(e,t,r)=>{r.d(t,{Bz:()=>f,G:()=>m}),r(9093),r(51850);var i=r(80730),n=r(14314),o=r(31821),a=r(35818),s=r(69270),c=r(74333);class l extends c.n{constructor(e,t,r){super(e,"mat4",s.c.Draw,((r,i,n,o)=>r.setUniformMatrix4fv(e,t(i,n,o))),r)}}class d extends c.n{constructor(e,t,r){super(e,"mat4",s.c.Pass,((r,i,n)=>r.setUniformMatrix4fv(e,t(i,n))),r)}}var u=r(12791),h=r(65786);function m(e,t){t.receiveShadows&&(e.fragment.uniforms.add(new d("shadowMapMatrix",((e,t)=>t.shadowMap.getShadowMapMatrices(e.origin)),4)),p(e))}function f(e,t){t.receiveShadows&&(e.fragment.uniforms.add(new l("shadowMapMatrix",((e,t)=>t.shadowMap.getShadowMapMatrices(e.origin)),4)),p(e))}function p(e){const t=e.fragment;t.include(i.U),t.uniforms.add(new u.x("shadowMap",(e=>e.shadowMap.depthTexture)),new a.W("numCascades",(e=>e.shadowMap.numCascades)),new n.I("cascadeDistances",(e=>e.shadowMap.cascadeDistances))).code.add(o.H`int chooseCascade(float depth, out mat4 mat) {
vec4 distance = cascadeDistances;
int i = depth < distance[1] ? 0 : depth < distance[2] ? 1 : depth < distance[3] ? 2 : 3;
mat = i == 0 ? shadowMapMatrix[0] : i == 1 ? shadowMapMatrix[1] : i == 2 ? shadowMapMatrix[2] : shadowMapMatrix[3];
return i;
}
vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
vec4 lv = mat * vec4(_vpos, 1.0);
lv.xy /= lv.w;
return 0.5 * lv.xyz + vec3(0.5);
}
vec2 cascadeCoordinates(int i, ivec2 textureSize, vec3 lvpos) {
float xScale = float(textureSize.y) / float(textureSize.x);
return vec2((float(i) + lvpos.x) * xScale, lvpos.y);
}
float readShadowMapDepth(ivec2 uv, sampler2D _depthTex) {
return rgba4ToFloat(texelFetch(_depthTex, uv, 0));
}
float posIsInShadow(ivec2 uv, vec3 lvpos, sampler2D _depthTex) {
return readShadowMapDepth(uv, _depthTex) < lvpos.z ? 1.0 : 0.0;
}
float filterShadow(vec2 uv, vec3 lvpos, ivec2 texSize, sampler2D _depthTex) {
vec2 st = fract(uv * vec2(texSize) + vec2(0.5));
ivec2 base = ivec2(uv * vec2(texSize) - vec2(0.5));
float s00 = posIsInShadow(ivec2(base.x, base.y), lvpos, _depthTex);
float s10 = posIsInShadow(ivec2(base.x + 1, base.y), lvpos, _depthTex);
float s11 = posIsInShadow(ivec2(base.x + 1, base.y + 1), lvpos, _depthTex);
float s01 = posIsInShadow(ivec2(base.x, base.y + 1), lvpos, _depthTex);
return mix(mix(s00, s10, st.x), mix(s01, s11, st.x), st.y);
}
float readShadowMap(const in vec3 _vpos, float _linearDepth) {
mat4 mat;
int i = chooseCascade(_linearDepth, mat);
if (i >= numCascades) { return 0.0; }
vec3 lvpos = lightSpacePosition(_vpos, mat);
if (lvpos.z >= 1.0 || lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) { return 0.0; }
ivec2 size = textureSize(shadowMap, 0);
vec2 uv = cascadeCoordinates(i, size, lvpos);
return filterShadow(uv, lvpos, size, shadowMap);
}`)}h.Y,h.Y},96598:(e,t,r)=>{r.d(t,{Z:()=>a});var i=r(52540),n=r(31821),o=r(12791);function a(e,{occlusionPass:t,terrainDepthTest:r,cullAboveTerrain:a}){const s=e.vertex,c=e.fragment;if(!r)return s.code.add("void forwardViewPosDepth(vec3 pos) {}"),void c.code.add(`${t?"bool":"void"} discardByTerrainDepth() { ${(0,n.If)(t,"return false;")}}`);e.varyings.add("viewPosDepth","float"),s.code.add("void forwardViewPosDepth(vec3 pos) {\n    viewPosDepth = pos.z;\n  }"),c.include(i.E),c.uniforms.add(new o.x("terrainDepthTexture",(e=>e.terrainDepth?.attachment))).code.add(n.H`
    ${t?"bool":"void"} discardByTerrainDepth() {
      float depth = texelFetch(terrainDepthTexture, ivec2(gl_FragCoord.xy), 0).r;
      float linearDepth = linearizeDepth(depth);
      ${t?"return viewPosDepth < linearDepth && depth < 1.0;":`if(viewPosDepth ${a?">":"<="} linearDepth) discard;`}
    }`)}},51406:(e,t,r)=>{r.d(t,{MU:()=>l,O1:()=>d,QM:()=>u,Sx:()=>c,q2:()=>s});var i=r(29242),n=r(53466),o=r(31821),a=r(35644);function s(e,t){t.hasColorTextureTransform?(e.varyings.add("colorUV","vec2"),e.vertex.uniforms.add(new a.k("colorTextureTransformMatrix",(e=>e.colorTextureTransformMatrix??i.zK))).code.add(o.H`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(o.H`void forwardColorUV(){}`)}function c(e,t){t.hasNormalTextureTransform&&t.textureCoordinateType!==n.I.None?(e.varyings.add("normalUV","vec2"),e.vertex.uniforms.add(new a.k("normalTextureTransformMatrix",(e=>e.normalTextureTransformMatrix??i.zK))).code.add(o.H`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(o.H`void forwardNormalUV(){}`)}function l(e,t){t.hasEmissionTextureTransform&&t.textureCoordinateType!==n.I.None?(e.varyings.add("emissiveUV","vec2"),e.vertex.uniforms.add(new a.k("emissiveTextureTransformMatrix",(e=>e.emissiveTextureTransformMatrix??i.zK))).code.add(o.H`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(o.H`void forwardEmissiveUV(){}`)}function d(e,t){t.hasOcclusionTextureTransform&&t.textureCoordinateType!==n.I.None?(e.varyings.add("occlusionUV","vec2"),e.vertex.uniforms.add(new a.k("occlusionTextureTransformMatrix",(e=>e.occlusionTextureTransformMatrix??i.zK))).code.add(o.H`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(o.H`void forwardOcclusionUV(){}`)}function u(e,t){t.hasMetallicRoughnessTextureTransform&&t.textureCoordinateType!==n.I.None?(e.varyings.add("metallicRoughnessUV","vec2"),e.vertex.uniforms.add(new a.k("metallicRoughnessTextureTransformMatrix",(e=>e.metallicRoughnessTextureTransformMatrix??i.zK))).code.add(o.H`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):e.vertex.code.add(o.H`void forwardMetallicRoughnessUV(){}`)}},42398:(e,t,r)=>{r.d(t,{A:()=>h});var i=r(33079),n=r(69270),o=r(74333);class a extends o.n{constructor(e,t,r){super(e,"vec4",n.c.Pass,((r,i,n)=>r.setUniform4fv(e,t(i,n))),r)}}class s extends o.n{constructor(e,t,r){super(e,"float",n.c.Pass,((r,i,n)=>r.setUniform1fv(e,t(i,n))),r)}}var c=r(31821),l=r(35644),d=r(46540),u=r(78662);r(11725),u.Gd;function h(e,t){const{vertex:r,attributes:n}=e;t.hasVvInstancing&&(t.vvSize||t.vvColor)&&n.add(d.r.INSTANCEFEATUREATTRIBUTE,"vec4"),t.vvSize?(r.uniforms.add(new i.t("vvSizeMinSize",(e=>e.vvSize.minSize))),r.uniforms.add(new i.t("vvSizeMaxSize",(e=>e.vvSize.maxSize))),r.uniforms.add(new i.t("vvSizeOffset",(e=>e.vvSize.offset))),r.uniforms.add(new i.t("vvSizeFactor",(e=>e.vvSize.factor))),r.uniforms.add(new l.k("vvSymbolRotationMatrix",(e=>e.vvSymbolRotationMatrix))),r.uniforms.add(new i.t("vvSymbolAnchor",(e=>e.vvSymbolAnchor))),r.code.add(c.H`vec3 vvScale(vec4 _featureAttribute) {
return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
}
vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
}`),r.code.add(c.H`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 vvScale = clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize + eps, vvSizeMaxSize);
        return vec4(vvSymbolRotationMatrix * _normal / vvScale, 1.0);
      }

      ${t.hasVvInstancing?c.H`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(position, instanceFeatureAttribute);
      }`:""}
    `)):r.code.add(c.H`vec4 localPosition() { return vec4(position, 1.0); }
vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }`),t.vvColor?(r.constants.add("vvColorNumber","int",8),r.uniforms.add(new s("vvColorValues",(e=>e.vvColor.values),8),new a("vvColorColors",(e=>e.vvColor.colors),8)),r.code.add(c.H`
      vec4 interpolateVVColor(float value) {
        if (value <= vvColorValues[0]) {
          return vvColorColors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (vvColorValues[i] >= value) {
            float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
            return mix(vvColorColors[i-1], vvColorColors[i], f);
          }
        }
        return vvColorColors[vvColorNumber - 1];
      }

      vec4 vvGetColor(vec4 featureAttribute) {
        return interpolateVVColor(featureAttribute.y);
      }

      ${t.hasVvInstancing?c.H`
            vec4 vvColor() {
              return vvGetColor(instanceFeatureAttribute);
            }`:"vec4 vvColor() { return vec4(1.0); }"}
    `)):r.code.add(c.H`vec4 vvColor() { return vec4(1.0); }`)}},34845:(e,t,r)=>{r.d(t,{Ir:()=>d});var i=r(37585),n=r(48163),o=r(87317),a=r(91829),s=r(77108),c=r(14314),l=r(31821);function d(e){e.fragment.uniforms.add(new c.I("projInfo",(e=>function(e){const t=e.projectionMatrix;return 0===t[11]?(0,o.s)(u,2/(e.fullWidth*t[0]),2/(e.fullHeight*t[5]),(1+t[12])/t[0],(1+t[13])/t[5]):(0,o.s)(u,-2/(e.fullWidth*t[0]),-2/(e.fullHeight*t[5]),(1-t[8])/t[0],(1-t[9])/t[5])}(e.camera)))),e.fragment.uniforms.add(new s.E("zScale",(e=>0===e.camera.projectionMatrix[11]?(0,i.hZ)(h,0,1):(0,i.hZ)(h,1,0)))),e.fragment.code.add(l.H`vec3 reconstructPosition(vec2 fragCoord, float depth) {
return vec3((fragCoord * projInfo.xy + projInfo.zw) * (zScale.x * depth + zScale.y), depth);
}`)}const u=(0,a.vt)(),h=(0,n.vt)()},63365:(e,t,r)=>{r.d(t,{a:()=>n});var i=r(31821);function n(e){e.code.add(i.H`vec4 premultiplyAlpha(vec4 v) {
return vec4(v.rgb * v.a, v.a);
}
vec3 rgb2hsv(vec3 c) {
vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
float d = q.x - min(q.w, q.y);
float e = 1.0e-10;
return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), min(d / (q.x + e), 1.0), q.x);
}
vec3 hsv2rgb(vec3 c) {
vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float rgb2v(vec3 c) {
return max(c.x, max(c.y, c.z));
}`)}},11955:(e,t,r)=>{r.d(t,{S:()=>s}),r(69270),r(74333).n;var i=r(20304),n=r(31821),o=r(89192),a=r(49788);function s(e,t){!function(e,t,r){const i=e.fragment,s=t.alphaDiscardMode,c=s===o.sf.Blend;s!==o.sf.Mask&&s!==o.sf.MaskBlend||i.uniforms.add(r),i.code.add(n.H`
    void discardOrAdjustAlpha(inout vec4 color) {
      ${s===o.sf.Opaque?"color.a = 1.0;":`if (color.a < ${c?n.H.float(a.Q):"textureAlphaCutoff"}) {\n              discard;\n             } ${(0,n.If)(s===o.sf.Mask,"else { color.a = 1.0; }")}`}
    }
  `)}(e,t,new i.m("textureAlphaCutoff",(e=>e.textureAlphaCutoff)))}},27950:(e,t,r)=>{r.d(t,{N:()=>a});var i=r(66104),n=r(63365),o=r(31821);function a(e){e.include(n.a),e.code.add(o.H`
    vec3 mixExternalColor(vec3 internalColor, vec3 textureColor, vec3 externalColor, int mode) {
      // workaround for artifacts in macOS using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      vec3 internalMixed = internalColor * textureColor;
      vec3 allMixed = internalMixed * externalColor;

      if (mode == ${o.H.int(i.k5.Multiply)}) {
        return allMixed;
      }
      if (mode == ${o.H.int(i.k5.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${o.H.int(i.k5.Replace)}) {
        return externalColor;
      }

      // tint (or something invalid)
      float vIn = rgb2v(internalMixed);
      vec3 hsvTint = rgb2hsv(externalColor);
      vec3 hsvOut = vec3(hsvTint.x, hsvTint.y, vIn * hsvTint.z);
      return hsv2rgb(hsvOut);
    }

    float mixExternalOpacity(float internalOpacity, float textureOpacity, float externalOpacity, int mode) {
      // workaround for artifacts in macOS using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      float internalMixed = internalOpacity * textureOpacity;
      float allMixed = internalMixed * externalOpacity;

      if (mode == ${o.H.int(i.k5.Ignore)}) {
        return internalMixed;
      }
      if (mode == ${o.H.int(i.k5.Replace)}) {
        return externalOpacity;
      }

      // multiply or tint (or something invalid)
      return allMixed;
    }
  `)}},80730:(e,t,r)=>{r.d(t,{U:()=>n});var i=r(31821);function n(e){e.code.add(i.H`const float MAX_RGBA4_FLOAT =
15.0 / 16.0 +
15.0 / 16.0 / 16.0 +
15.0 / 16.0 / 16.0 / 16.0 +
15.0 / 16.0 / 16.0 / 16.0 / 16.0;
const vec4 FIXED_POINT_FACTORS_RGBA4 = vec4(1.0, 16.0, 16.0 * 16.0, 16.0 * 16.0 * 16.0);
vec4 floatToRgba4(const float value) {
float valueInValidDomain = clamp(value, 0.0, MAX_RGBA4_FLOAT);
vec4 fixedPointU4 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS_RGBA4) * 16.0);
const float toU4AsFloat = 1.0 / 15.0;
return fixedPointU4 * toU4AsFloat;
}
const vec4 RGBA4_2_FLOAT_FACTORS = vec4(
15.0 / (16.0),
15.0 / (16.0 * 16.0),
15.0 / (16.0 * 16.0 * 16.0),
15.0 / (16.0 * 16.0 * 16.0 * 16.0)
);
float rgba4ToFloat(vec4 rgba) {
return dot(rgba, RGBA4_2_FLOAT_FACTORS);
}`)}},52587:(e,t,r)=>{r.d(t,{OH:()=>l,Y6:()=>s,pM:()=>c});var i=r(38954),n=r(51850),o=r(33079),a=r(31821);function s(e){e.vertex.code.add(a.H`float screenSizePerspectiveViewAngleDependentFactor(float absCosAngle) {
return absCosAngle * absCosAngle * absCosAngle;
}`),e.vertex.code.add(a.H`vec3 screenSizePerspectiveScaleFactor(float absCosAngle, float distanceToCamera, vec3 params) {
return vec3(
min(params.x / (distanceToCamera - params.y), 1.0),
screenSizePerspectiveViewAngleDependentFactor(absCosAngle),
params.z
);
}`),e.vertex.code.add(a.H`float applyScreenSizePerspectiveScaleFactorFloat(float size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),e.vertex.code.add(a.H`float screenSizePerspectiveScaleFloat(float size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorFloat(
size,
screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params)
);
}`),e.vertex.code.add(a.H`vec2 applyScreenSizePerspectiveScaleFactorVec2(vec2 size, vec3 factor) {
return mix(size * clamp(factor.x, factor.z, 1.0), size, factor.y);
}`),e.vertex.code.add(a.H`vec2 screenSizePerspectiveScaleVec2(vec2 size, float absCosAngle, float distanceToCamera, vec3 params) {
return applyScreenSizePerspectiveScaleFactorVec2(size, screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params));
}`)}function c(e){e.uniforms.add(new o.t("screenSizePerspective",(e=>d(e.screenSizePerspective))))}function l(e){e.uniforms.add(new o.t("screenSizePerspectiveAlignment",(e=>d(e.screenSizePerspectiveAlignment||e.screenSizePerspective))))}function d(e){return(0,i.i)(u,e.parameters.divisor,e.parameters.offset,e.minScaleFactor)}const u=(0,n.vt)()},20693:(e,t,r)=>{r.d(t,{yu:()=>f,Nz:()=>T,NB:()=>p,S7:()=>_});var i=r(58083),n=r(9093),o=r(38954),a=r(51850),s=r(23205),c=r(40710),l=r(33094),d=r(58029),u=r(69270),h=r(74333);class m extends h.n{constructor(e,t){super(e,"mat4",u.c.Draw,((r,i,n)=>r.setUniformMatrix4fv(e,t(i,n))))}}function f(e,t){t.instancedDoublePrecision?e.constants.add("cameraPosition","vec3",a.uY):e.uniforms.add(new c.W("cameraPosition",((e,t)=>(0,o.i)(g,t.camera.viewInverseTransposeMatrix[3]-e.origin[0],t.camera.viewInverseTransposeMatrix[7]-e.origin[1],t.camera.viewInverseTransposeMatrix[11]-e.origin[2]))))}function p(e,t){if(!t.instancedDoublePrecision)return void e.uniforms.add(new d.F("proj",(e=>e.camera.projectionMatrix)),new m("view",((e,t)=>(0,i.Tl)(v,t.camera.viewMatrix,e.origin))),new c.W("localOrigin",(e=>e.origin)));const r=({camera:e})=>(0,o.i)(g,e.viewInverseTransposeMatrix[3],e.viewInverseTransposeMatrix[7],e.viewInverseTransposeMatrix[11]);e.uniforms.add(new d.F("proj",(e=>e.camera.projectionMatrix)),new d.F("view",(e=>(0,i.Tl)(v,e.camera.viewMatrix,r(e)))),new s.d("localOrigin",(e=>r(e))))}const v=(0,n.vt)(),g=(0,a.vt)();function _(e){e.uniforms.add(new d.F("viewNormal",(e=>e.camera.viewInverseTransposeMatrix)))}function T(e){e.uniforms.add(new l.U("pixelRatio",(e=>e.camera.pixelRatio/e.overlayStretch)))}},32976:(e,t,r)=>{r.d(t,{o:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"bool",i.c.Bind,((r,i)=>r.setUniform1b(e,t(i))))}}},77108:(e,t,r)=>{r.d(t,{E:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"vec2",i.c.Bind,((r,i)=>r.setUniform2fv(e,t(i))))}}},68259:(e,t,r)=>{r.d(t,{t:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"vec2",i.c.Draw,((r,i,n,o)=>r.setUniform2fv(e,t(i,n,o))))}}},47286:(e,t,r)=>{r.d(t,{G:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"vec2",i.c.Pass,((r,i,n)=>r.setUniform2fv(e,t(i,n))))}}},23205:(e,t,r)=>{r.d(t,{d:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"vec3",i.c.Bind,((r,i)=>r.setUniform3fv(e,t(i))))}}},14314:(e,t,r)=>{r.d(t,{I:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"vec4",i.c.Bind,((r,i)=>r.setUniform4fv(e,t(i))))}}},71988:(e,t,r)=>{r.d(t,{E:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"vec4",i.c.Pass,((r,i,n)=>r.setUniform4fv(e,t(i,n))))}}},33094:(e,t,r)=>{r.d(t,{U:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"float",i.c.Bind,((r,i)=>r.setUniform1f(e,t(i))))}}},20304:(e,t,r)=>{r.d(t,{m:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"float",i.c.Pass,((r,i,n)=>r.setUniform1f(e,t(i,n))))}}},35818:(e,t,r)=>{r.d(t,{W:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"int",i.c.Bind,((r,i)=>r.setUniform1i(e,t(i))))}}},40095:(e,t,r)=>{r.d(t,{X:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"mat4",i.c.Pass,((r,i,n)=>r.setUniformMatrix4fv(e,t(i,n))))}}},12791:(e,t,r)=>{r.d(t,{x:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"sampler2D",i.c.Bind,((r,i)=>r.bindTexture(e,t(i))))}}},63761:(e,t,r)=>{r.d(t,{N:()=>o});var i=r(69270),n=r(74333);class o extends n.n{constructor(e,t){super(e,"sampler2D",i.c.Pass,((r,i,n)=>r.bindTexture(e,t(i,n))))}}},97220:(e,t,r)=>{r.d(t,{$:()=>i});class i{constructor(e,t){this._module=e,this._load=t}get(){return this._module}async reload(){return this._module=await this._load(),this._module}}},98958:(e,t,r)=>{r.d(t,{w:()=>u});var i=r(53966),n=r(97768),o=r(39341),a=r(3694),s=r(94656);class c{constructor(e,t,r){this._context=e,this._locations=r,this._textures=new Map,this._freeTextureUnits=new a.A({deallocator:null}),this._glProgram=e.programCache.acquire(t.generate("vertex",!0),t.generate("fragment",!0),r),this._glProgram.stop=()=>{throw new Error("Wrapped _glProgram used directly")},this.bind=t.generateBind(this),this.bindPass=t.generateBindPass(this),this.bindDraw=t.generateBindDraw(this),this._fragmentUniforms=(0,s.en)()?t.fragmentUniforms:null}dispose(){this._glProgram.dispose()}get glName(){return this._glProgram.glName}get hasTransformFeedbackVaryings(){return this._glProgram.hasTransformFeedbackVaryings}get compiled(){return this._glProgram.compiled}setUniform1b(e,t){this._glProgram.setUniform1i(e,t?1:0)}setUniform1i(e,t){this._glProgram.setUniform1i(e,t)}setUniform1f(e,t){this._glProgram.setUniform1f(e,t)}setUniform2fv(e,t){this._glProgram.setUniform2fv(e,t)}setUniform3fv(e,t){this._glProgram.setUniform3fv(e,t)}setUniform4fv(e,t){this._glProgram.setUniform4fv(e,t)}setUniformMatrix3fv(e,t){this._glProgram.setUniformMatrix3fv(e,t)}setUniformMatrix4fv(e,t){this._glProgram.setUniformMatrix4fv(e,t)}setUniform1fv(e,t){this._glProgram.setUniform1fv(e,t)}setUniform1iv(e,t){this._glProgram.setUniform1iv(e,t)}setUniform2iv(e,t){this._glProgram.setUniform2iv(e,t)}setUniform3iv(e,t){this._glProgram.setUniform3iv(e,t)}setUniform4iv(e,t){this._glProgram.setUniform4iv(e,t)}assertCompatibleVertexAttributeLocations(e){e.locations!==this._locations&&console.error("VertexAttributeLocations are incompatible")}stop(){this._textures.clear(),this._freeTextureUnits.clear()}bindTexture(e,t){if(null==t?.glName){const t=this._textures.get(e);return t&&(this._context.bindTexture(null,t.unit),this._freeTextureUnit(t),this._textures.delete(e)),null}let r=this._textures.get(e);return null==r?(r=this._allocTextureUnit(t),this._textures.set(e,r)):r.texture=t,this._context.useProgram(this),this.setUniform1i(e,r.unit),this._context.bindTexture(t,r.unit),r.unit}rebindTextures(){this._context.useProgram(this),this._textures.forEach(((e,t)=>{this._context.bindTexture(e.texture,e.unit),this.setUniform1i(t,e.unit)})),this._fragmentUniforms?.forEach((e=>{"sampler2D"!==e.type&&"samplerCube"!==e.type||this._textures.has(e.name)||console.error(`Texture sampler ${e.name} has no bound texture`)}))}_allocTextureUnit(e){return{texture:e,unit:0===this._freeTextureUnits.length?this._textures.size:this._freeTextureUnits.pop()}}_freeTextureUnit(e){this._freeTextureUnits.push(e.unit)}}var l=r(63907),d=r(90644);class u{constructor(e,t,r,a=o.D){this.locations=a,this.primitiveType=l.WR.TRIANGLES,this.key=t.key,this._program=new c(e.rctx,r.get().build(t),a),this._pipeline=this.initializePipeline(t),this.reload=async o=>{o&&await r.reload(),this.key.equals(t.key)||i.A.getLogger("esri.views.3d.webgl.ShaderTechnique").warn("Configuration was changed after construction, cannot reload shader.",r),(0,n.WD)(this._program),this._program=new c(e.rctx,r.get().build(t),a),this._pipeline=this.initializePipeline(t)}}destroy(){this._program=(0,n.WD)(this._program),this._pipeline=null}get program(){return this._program}get compiled(){return this.program.compiled}ensureAttributeLocations(e){this.program.assertCompatibleVertexAttributeLocations(e)}getPipeline(e,t){return this._pipeline}initializePipeline(e){return(0,d.Ey)({blending:d.Os,colorWrite:d.kn})}}},51976:(e,t,r)=>{r.d(t,{K:()=>s,W:()=>c});var i=r(49186),n=r(4576);class o{constructor(e){this._bits=[...e]}equals(e){return(0,n.aI)(this._bits,e.bits)}get code(){return this._code??=String.fromCharCode(...this._bits),this._code}get bits(){return this._bits}}var a=r(65786);class s extends a.Y{constructor(){super(),this._parameterBits=this._parameterBits?.map((()=>0))??[],this._parameterNames??=[]}get key(){return this._key??=new o(this._parameterBits),this._key}decode(e=this.key){const t=this._parameterBits;this._parameterBits=[...e.bits];const r=this._parameterNames.map((e=>`    ${e}: ${this[e]}`)).join("\n");return this._parameterBits=t,r}}function c(e={}){return(t,r)=>{t.hasOwnProperty("_parameterNames")||Object.defineProperty(t,"_parameterNames",{value:t._parameterNames?.slice()??[],configurable:!0,writable:!0}),t.hasOwnProperty("_parameterBits")||Object.defineProperty(t,"_parameterBits",{value:t._parameterBits?.slice()??[0],configurable:!0,writable:!0}),t._parameterNames.push(r);const n=e.count||2,o=Math.ceil(Math.log2(n)),a=t._parameterBits;let s=0;for(;a[s]+o>16;)s++,s>=a.length&&a.push(0);const c=a[s],l=(1<<o)-1<<c;a[s]+=o,e.count?Object.defineProperty(t,r,{get(){return(this._parameterBits[s]&l)>>c},set(t){if(this[r]!==t){if(this._key=null,this._parameterBits[s]=this._parameterBits[s]&~l|+t<<c&l,"number"!=typeof t)throw new i.A(`Configuration value for ${r} must be a number, got ${typeof t}`);if(null==e.count)throw new i.A(`Configuration value for ${r} must provide a count option`)}}}):Object.defineProperty(t,r,{get(){return!!((this._parameterBits[s]&l)>>c)},set(e){if(this[r]!==e&&(this._key=null,this._parameterBits[s]=this._parameterBits[s]&~l|+e<<c&l,"boolean"!=typeof e))throw new i.A(`Configuration value for ${r} must be boolean, got ${typeof e}`)}})}}},57917:(e,t,r)=>{r.d(t,{S:()=>n});var i=r(34275);function n(e){if(e.length<i.y9)return Array.from(e);if(Array.isArray(e))return Float64Array.from(e);if(!("BYTES_PER_ELEMENT"in e))return Array.from(e);switch(e.BYTES_PER_ELEMENT){case 1:return Uint8Array.from(e);case 2:return(0,i.jq)(e)?Uint16Array.from(e):Int16Array.from(e);case 4:return Float32Array.from(e);default:return Float64Array.from(e)}}},29920:(e,t,r)=>{r.d(t,{j:()=>s});var i=r(3694),n=r(38954),o=r(51850),a=r(620);class s{constructor(e,t,r){this.primitiveIndices=e,this._numIndexPerPrimitive=t,this.position=r,this._children=void 0,(0,a.vA)(e.length>=1),(0,a.vA)(3===r.size||4===r.size);const{data:i,size:s,indices:l}=r;(0,a.vA)(l.length%this._numIndexPerPrimitive==0),(0,a.vA)(l.length>=e.length*this._numIndexPerPrimitive);const d=e.length;let u=s*l[this._numIndexPerPrimitive*e[0]];c.clear(),c.push(u);const h=(0,o.fA)(i[u],i[u+1],i[u+2]),m=(0,o.o8)(h);for(let t=0;t<d;++t){const r=this._numIndexPerPrimitive*e[t];for(let e=0;e<this._numIndexPerPrimitive;++e){u=s*l[r+e],c.push(u);let t=i[u];h[0]=Math.min(t,h[0]),m[0]=Math.max(t,m[0]),t=i[u+1],h[1]=Math.min(t,h[1]),m[1]=Math.max(t,m[1]),t=i[u+2],h[2]=Math.min(t,h[2]),m[2]=Math.max(t,m[2])}}this.bbMin=h,this.bbMax=m;const f=(0,n.m)((0,o.vt)(),this.bbMin,this.bbMax,.5);this.radius=.5*Math.max(Math.max(m[0]-h[0],m[1]-h[1]),m[2]-h[2]);let p=this.radius*this.radius;for(let e=0;e<c.length;++e){u=c.at(e);const t=i[u]-f[0],r=i[u+1]-f[1],n=i[u+2]-f[2],o=t*t+r*r+n*n;if(o<=p)continue;const a=Math.sqrt(o),s=.5*(a-this.radius);this.radius=this.radius+s,p=this.radius*this.radius;const l=s/a;f[0]+=t*l,f[1]+=r*l,f[2]+=n*l}this.center=f,c.clear()}getChildren(){if(this._children||(0,n.s)(this.bbMin,this.bbMax)<=1)return this._children;const e=(0,n.m)((0,o.vt)(),this.bbMin,this.bbMax,.5),t=this.primitiveIndices.length,r=new Uint8Array(t),i=new Array(8);for(let e=0;e<8;++e)i[e]=0;const{data:a,size:c,indices:l}=this.position;for(let n=0;n<t;++n){let t=0;const o=this._numIndexPerPrimitive*this.primitiveIndices[n];let s=c*l[o],d=a[s],u=a[s+1],h=a[s+2];for(let e=1;e<this._numIndexPerPrimitive;++e){s=c*l[o+e];const t=a[s],r=a[s+1],i=a[s+2];t<d&&(d=t),r<u&&(u=r),i<h&&(h=i)}d<e[0]&&(t|=1),u<e[1]&&(t|=2),h<e[2]&&(t|=4),r[n]=t,++i[t]}let d=0;for(let e=0;e<8;++e)i[e]>0&&++d;if(d<2)return;const u=new Array(8);for(let e=0;e<8;++e)u[e]=i[e]>0?new Uint32Array(i[e]):void 0;for(let e=0;e<8;++e)i[e]=0;for(let e=0;e<t;++e){const t=r[e];u[t][i[t]++]=this.primitiveIndices[e]}this._children=new Array;for(let e=0;e<8;++e)void 0!==u[e]&&this._children.push(new s(u[e],this._numIndexPerPrimitive,this.position));return this._children}static prune(){c.prune()}}const c=new i.A({deallocator:null})},69720:(e,t,r)=>{r.d(t,{J:()=>n});var i=r(24326);class n{constructor(){this.id=(0,i.c)()}}},96672:(e,t,r)=>{var i;r.d(t,{X:()=>i}),function(e){e[e.Layer=0]="Layer",e[e.Object=1]="Object",e[e.Mesh=2]="Mesh",e[e.Line=3]="Line",e[e.Point=4]="Point",e[e.Material=5]="Material",e[e.Texture=6]="Texture",e[e.COUNT=7]="COUNT"}(i||(i={}))},39341:(e,t,r)=>{r.d(t,{D:()=>n});var i=r(46540);const n=new Map([[i.r.POSITION,0],[i.r.NORMAL,1],[i.r.NORMALCOMPRESSED,1],[i.r.UV0,2],[i.r.COLOR,3],[i.r.COLORFEATUREATTRIBUTE,3],[i.r.SIZE,4],[i.r.TANGENT,4],[i.r.CENTEROFFSETANDDISTANCE,5],[i.r.SYMBOLCOLOR,5],[i.r.FEATUREATTRIBUTE,6],[i.r.INSTANCEFEATUREATTRIBUTE,6],[i.r.INSTANCECOLOR,7],[i.r.OBJECTANDLAYERIDCOLOR,7],[i.r.INSTANCEOBJECTANDLAYERIDCOLOR,7],[i.r.ROTATION,8],[i.r.INSTANCEMODEL,8],[i.r.INSTANCEMODELNORMAL,12],[i.r.INSTANCEMODELORIGINHI,11],[i.r.INSTANCEMODELORIGINLO,15]])},25634:(e,t,r)=>{r.d(t,{m8:()=>c,NV:()=>d});var i=r(97768),n=r(74887),o=r(89192);class a{constructor(e){this._material=e.material,this._techniques=e.techniques,this._output=e.output}dispose(){}get _stippleTextures(){return this._techniques.context.stippleTextures}get _markerTextures(){return this._techniques.context.markerTextures}getTechnique(e,t){return this._techniques.get(e,this._material.getConfiguration(this._output,t))}ensureResources(e){return o.Am.LOADED}}var s=r(65786);class c extends a{constructor(e){super(e),this._numLoading=0,this._disposed=!1,this._textures=e.textures,this.updateTexture(e.textureId),this._acquire(e.normalTextureId,(e=>this._textureNormal=e)),this._acquire(e.emissiveTextureId,(e=>this._textureEmissive=e)),this._acquire(e.occlusionTextureId,(e=>this._textureOcclusion=e)),this._acquire(e.metallicRoughnessTextureId,(e=>this._textureMetallicRoughness=e))}dispose(){super.dispose(),this._texture=(0,i.Gz)(this._texture),this._textureNormal=(0,i.Gz)(this._textureNormal),this._textureEmissive=(0,i.Gz)(this._textureEmissive),this._textureOcclusion=(0,i.Gz)(this._textureOcclusion),this._textureMetallicRoughness=(0,i.Gz)(this._textureMetallicRoughness),this._disposed=!0}ensureResources(e){return 0===this._numLoading?o.Am.LOADED:o.Am.LOADING}get textureBindParameters(){return new d(null!=this._texture?this._texture.glTexture:null,null!=this._textureNormal?this._textureNormal.glTexture:null,null!=this._textureEmissive?this._textureEmissive.glTexture:null,null!=this._textureOcclusion?this._textureOcclusion.glTexture:null,null!=this._textureMetallicRoughness?this._textureMetallicRoughness.glTexture:null)}updateTexture(e){null!=this._texture&&e===this._texture.id||(this._texture=(0,i.Gz)(this._texture),this._textureId=e,this._acquire(this._textureId,(e=>this._texture=e)))}_acquire(e,t){if(null==e)return void t(null);const r=this._textures.acquire(e);if((0,n.$X)(r))return++this._numLoading,void r.then((e=>{if(this._disposed)return(0,i.Gz)(e),void t(null);t(e)})).finally((()=>--this._numLoading));t(r)}}class l extends s.Y{constructor(e=null){super(),this.textureEmissive=e}}class d extends l{constructor(e=null,t=null,r=null,i=null,n=null,o,a){super(r),this.texture=e,this.textureNormal=t,this.textureOcclusion=i,this.textureMetallicRoughness=n,this.scale=o,this.normalTextureTransformMatrix=a}}},87170:(e,t,r)=>{r.d(t,{V:()=>C});var i=r(9093),n=r(38954),o=r(97146),a=r(57917),s=r(29920),c=r(69720),l=r(96672),d=r(51850),u=r(4341),h=r(11964);function m(e,t,r){return(0,n.d)(f,t,e),(0,n.d)(p,r,e),.5*(0,n.l)((0,n.e)(f,f,p))}r(32114),new u.I(h.vt),new u.I((()=>({p0:(0,d.vt)(),p1:(0,d.vt)(),p2:(0,d.vt)()})));const f=(0,d.vt)(),p=(0,d.vt)(),v=(0,d.vt)(),g=(0,d.vt)(),_=(0,d.vt)(),T=(0,d.vt)();var x=r(24326),A=r(89192);class b{constructor(){this.uid=(0,x.c)()}}class E extends b{constructor(e){super(),this.highlightName=e,this.channel=A.Mg.Highlight}}var S=r(620),M=r(46540);class C extends c.J{constructor(e,t,r=null,i=l.X.Mesh,n=null,a=-1){super(),this.material=e,this.mapPositions=r,this.type=i,this.objectAndLayerIdColor=n,this.edgeIndicesLength=a,this.highlights=new Set,this._highlightOptionsCounts=new Map,this.visible=!0,this._attributes=new Map,this._boundingInfo=null;for(const[e,r]of t)this._attributes.set(e,{...r,indices:(0,o.Dg)(r.indices)}),e===M.r.POSITION&&(this.edgeIndicesLength=this.edgeIndicesLength<0?this._attributes.get(e).indices.length:this.edgeIndicesLength)}instantiate(e={}){const t=new C(e.material||this.material,[],this.mapPositions,this.type,this.objectAndLayerIdColor,this.edgeIndicesLength);return this._attributes.forEach(((e,r)=>{e.exclusive=!1,t._attributes.set(r,e)})),t._boundingInfo=this._boundingInfo,t.transformation=e.transformation||this.transformation,t}get attributes(){return this._attributes}getMutableAttribute(e){let t=this._attributes.get(e);return t&&!t.exclusive&&(t={...t,exclusive:!0,data:(0,a.S)(t.data)},this._attributes.set(e,t)),t}setAttributeData(e,t){const r=this._attributes.get(e);r&&this._attributes.set(e,{...r,exclusive:!0,data:t})}get indexCount(){const e=this._attributes.values().next().value?.indices;return e?.length??0}get faceCount(){return this.indexCount/3}get boundingInfo(){return null==this._boundingInfo&&(this._boundingInfo=this._calculateBoundingInfo()),this._boundingInfo}computeAttachmentOrigin(e){return!!(this.type===l.X.Mesh?this._computeAttachmentOriginTriangles(e):this.type===l.X.Line?this._computeAttachmentOriginLines(e):this._computeAttachmentOriginPoints(e))&&(null!=this._transformation&&(0,n.t)(e,e,this._transformation),!0)}_computeAttachmentOriginTriangles(e){return function(e,t){if(!e)return!1;const{size:r,data:i,indices:o}=e;(0,n.i)(t,0,0,0),(0,n.i)(T,0,0,0);let a=0,s=0;for(let e=0;e<o.length-2;e+=3){const c=o[e]*r,l=o[e+1]*r,d=o[e+2]*r;(0,n.i)(v,i[c],i[c+1],i[c+2]),(0,n.i)(g,i[l],i[l+1],i[l+2]),(0,n.i)(_,i[d],i[d+1],i[d+2]);const u=m(v,g,_);u?((0,n.g)(v,v,g),(0,n.g)(v,v,_),(0,n.h)(v,v,1/3*u),(0,n.g)(t,t,v),a+=u):((0,n.g)(T,T,v),(0,n.g)(T,T,g),(0,n.g)(T,T,_),s+=3)}return!(0===s&&0===a||(0!==a?((0,n.h)(t,t,1/a),0):0===s||((0,n.h)(t,T,1/s),0)))}(this.attributes.get(M.r.POSITION),e)}_computeAttachmentOriginLines(e){const t=this.attributes.get(M.r.POSITION);return function(e,t,r){if(!e)return!1;(0,n.i)(r,0,0,0),(0,n.i)(T,0,0,0);let i=0,o=0;const{size:a,data:s,indices:c}=e,l=c.length-1,d=l+(t?2:0);for(let e=0;e<d;e+=2){const t=e<l?e+1:0,d=c[e<l?e:l]*a,u=c[t]*a;v[0]=s[d],v[1]=s[d+1],v[2]=s[d+2],g[0]=s[u],g[1]=s[u+1],g[2]=s[u+2],(0,n.h)(v,(0,n.g)(v,v,g),.5);const h=(0,n.G)(v,g);h>0?((0,n.g)(r,r,(0,n.h)(v,v,h)),i+=h):0===i&&((0,n.g)(T,T,v),o++)}return 0!==i?((0,n.h)(r,r,1/i),!0):0!==o&&((0,n.h)(r,T,1/o),!0)}(t,function(e,t){return!(!("isClosed"in e)||!e.isClosed)&&t.indices.length>2}(this.material.parameters,t),e)}_computeAttachmentOriginPoints(e){return function(e,t){if(!e)return!1;const{size:r,data:i,indices:o}=e;(0,n.i)(t,0,0,0);let a=-1,s=0;for(let e=0;e<o.length;e++){const n=o[e]*r;a!==n&&(t[0]+=i[n],t[1]+=i[n+1],t[2]+=i[n+2],s++),a=n}return s>1&&(0,n.h)(t,t,1/s),s>0}(this.attributes.get(M.r.POSITION),e)}invalidateBoundingInfo(){this._boundingInfo=null}_calculateBoundingInfo(){const e=this.attributes.get(M.r.POSITION);if(!e||0===e.indices.length)return null;const t=this.type===l.X.Mesh?3:1;(0,S.vA)(e.indices.length%t==0,"Indexing error: "+e.indices.length+" not divisible by "+t);const r=(0,o.tM)(e.indices.length/t);return new s.j(r,t,e)}get transformation(){return this._transformation??i.zK}set transformation(e){this._transformation=e&&e!==i.zK?(0,i.o8)(e):null}get highlightNames(){return this._highlightOptionsCounts}get hasHighlights(){return this._highlightOptionsCounts.size>0}foreachHighlightOptions(e){this._highlightOptionsCounts.forEach(((t,r)=>e(r)))}allocateIdAndHighlight(e){const t=new E(e);return this.addHighlight(t)}addHighlight(e){this.highlights.add(e);const{highlightName:t}=e,r=(this._highlightOptionsCounts.get(t)??0)+1;return this._highlightOptionsCounts.set(t,r),e}removeHighlight(e){if(this.highlights.delete(e)){const{highlightName:t}=e,r=this._highlightOptionsCounts.get(t)??0;r<=1?this._highlightOptionsCounts.delete(t):this._highlightOptionsCounts.set(t,r-1)}}}},11725:(e,t,r)=>{r.d(t,{im:()=>u,m$:()=>i});var i,n,o=r(51850),a=r(69720),s=r(96672),c=r(39341),l=r(43616),d=r(65786);class u extends a.J{constructor(e,t){super(),this.type=s.X.Material,this.supportsEdges=!1,this._renderPriority=0,this.vertexAttributeLocations=c.D,this._pp0=(0,o.fA)(0,0,1),this._pp1=(0,o.fA)(0,0,0),this._parameters=new t,(0,l.MB)(this._parameters,e),this.validateParameters(this._parameters)}get parameters(){return this._parameters}update(e){return!1}setParameters(e,t=!0){(0,l.MB)(this._parameters,e)&&(this.validateParameters(this._parameters),t&&this._parametersChanged())}validateParameters(e){}shouldRender(e){return this.visible&&this.isVisibleForOutput(e.output)&&(!this.parameters.isDecoration||e.bind.decorations)&&!!(this.parameters.renderOccluded&e.renderOccludedMask)}isVisibleForOutput(e){return!0}get renderPriority(){return this._renderPriority}set renderPriority(e){e!==this._renderPriority&&(this._renderPriority=e,this._parametersChanged())}_parametersChanged(){this.repository?.materialChanged(this)}queryRenderOccludedState(e){return this.visible&&this.parameters.renderOccluded===e}get hasEmissions(){return!1}intersectDraped(e,t,r,i,n,o){return this._pp0[0]=this._pp1[0]=i[0],this._pp0[1]=this._pp1[1]=i[1],this.intersect(e,t,r,this._pp0,this._pp1,n)}}(n=i||(i={}))[n.None=0]="None",n[n.Occlude=1]="Occlude",n[n.Transparent=2]="Transparent",n[n.OccludeAndTransparent=4]="OccludeAndTransparent",n[n.OccludeAndTransparentStencil=8]="OccludeAndTransparentStencil",n[n.Opaque=16]="Opaque",d.Y},59643:(e,t,r)=>{var i;r.d(t,{Y:()=>i}),function(e){e[e.NONE=0]="NONE",e[e.ColorAlpha=1]="ColorAlpha",e[e.FrontFace=2]="FrontFace",e[e.COUNT=3]="COUNT"}(i||(i={}))},33524:(e,t,r)=>{r.d(t,{K_:()=>f,Yf:()=>l,aB:()=>m,ez:()=>c,m6:()=>p,xt:()=>u,z5:()=>d});var i=r(49255),n=r(59643),o=r(63907),a=r(90644);const s=(0,a.p3)(o.dn.ONE,o.dn.ZERO,o.dn.ONE,o.dn.ONE_MINUS_SRC_ALPHA);function c(e){return e===n.Y.FrontFace?null:s}function l(e){switch(e){case n.Y.NONE:return a.Ky;case n.Y.ColorAlpha:return s;case n.Y.FrontFace:case n.Y.COUNT:return null}}function d(e){if(e.draped)return null;switch(e.oitPass){case n.Y.NONE:case n.Y.FrontFace:return e.writeDepth?a.Uy:null;case n.Y.ColorAlpha:case n.Y.COUNT:return null}}const u=5e5,h={factor:-1,units:-2};function m(e){return e?h:null}function f(e,t=o.MT.LESS){return e===n.Y.NONE||e===n.Y.FrontFace?t:o.MT.LEQUAL}function p(e,t){const r=(0,i.LG)(t);return e===n.Y.ColorAlpha?r?{buffers:[o.Nm.COLOR_ATTACHMENT0,o.Nm.COLOR_ATTACHMENT1,o.Nm.COLOR_ATTACHMENT2]}:{buffers:[o.Nm.COLOR_ATTACHMENT0,o.Nm.COLOR_ATTACHMENT1]}:r?{buffers:[o.Nm.COLOR_ATTACHMENT0,o.Nm.COLOR_ATTACHMENT1]}:null}},13464:(e,t,r)=>{var i;r.d(t,{N:()=>i}),function(e){e[e.INTEGRATED_MESH=0]="INTEGRATED_MESH",e[e.OPAQUE_TERRAIN=1]="OPAQUE_TERRAIN",e[e.OPAQUE_MATERIAL=2]="OPAQUE_MATERIAL",e[e.OPAQUE_MATERIAL_WITHOUT_NORMALS=3]="OPAQUE_MATERIAL_WITHOUT_NORMALS",e[e.TRANSPARENT_MATERIAL=4]="TRANSPARENT_MATERIAL",e[e.TRANSPARENT_MATERIAL_WITHOUT_NORMALS=5]="TRANSPARENT_MATERIAL_WITHOUT_NORMALS",e[e.TRANSPARENT_TERRAIN=6]="TRANSPARENT_TERRAIN",e[e.TRANSPARENT_MATERIAL_WITHOUT_DEPTH=7]="TRANSPARENT_MATERIAL_WITHOUT_DEPTH",e[e.OCCLUDED_TERRAIN=8]="OCCLUDED_TERRAIN",e[e.OCCLUDER_MATERIAL=9]="OCCLUDER_MATERIAL",e[e.TRANSPARENT_OCCLUDER_MATERIAL=10]="TRANSPARENT_OCCLUDER_MATERIAL",e[e.OCCLUSION_PIXELS=11]="OCCLUSION_PIXELS",e[e.HUD_MATERIAL=12]="HUD_MATERIAL",e[e.LABEL_MATERIAL=13]="LABEL_MATERIAL",e[e.LINE_CALLOUTS=14]="LINE_CALLOUTS",e[e.LINE_CALLOUTS_HUD_DEPTH=15]="LINE_CALLOUTS_HUD_DEPTH",e[e.OVERLAY=16]="OVERLAY",e[e.DRAPED_MATERIAL=17]="DRAPED_MATERIAL",e[e.DRAPED_WATER=18]="DRAPED_WATER",e[e.VOXEL=19]="VOXEL",e[e.MAX_SLOTS=20]="MAX_SLOTS"}(i||(i={}))},48833:(e,t,r)=>{r.d(t,{g:()=>U}),r(44208);var i=r(49186),n=r(65529),o=r(97768),a=r(74887),s=r(34275),c=r(84952),l=r(99677),d=r(56058),u=r(89192),h=r(2741);let m;var f=r(92993),p=r(63907),v=r(30164),g=r(42293);let _=null,T=null;async function x(){return null==T&&(m??=(async()=>{const e=await r.e(9321).then(r.bind(r,49321)),t=await e.default({locateFile:e=>(0,h.s)(`esri/libs/basisu/${e}`)});return t.initializeBasis(),t})(),T=m,_=await T),T}function A(e,t,r,i,n){const o=(0,g.IB)(t?p.CQ.COMPRESSED_RGBA8_ETC2_EAC:p.CQ.COMPRESSED_RGB8_ETC2),a=n&&e>1?(4**e-1)/(3*4**(e-1)):1;return Math.ceil(r*i*o*a)}function b(e){return e.getNumImages()>=1&&!e.isUASTC()}function E(e){return e.getFaces()>=1&&e.isETC1S()}function S(e,t,r,i,n,o,a,s){const{compressedTextureETC:c,compressedTextureS3TC:l}=e.capabilities,[d,u]=c?i?[f.n.ETC2_RGBA,p.CQ.COMPRESSED_RGBA8_ETC2_EAC]:[f.n.ETC1_RGB,p.CQ.COMPRESSED_RGB8_ETC2]:l?i?[f.n.BC3_RGBA,p.CQ.COMPRESSED_RGBA_S3TC_DXT5_EXT]:[f.n.BC1_RGB,p.CQ.COMPRESSED_RGB_S3TC_DXT1_EXT]:[f.n.RGBA32,p.Ab.RGBA],h=t.hasMipmap?r:Math.min(1,r),m=[];for(let e=0;e<h;e++)m.push(new Uint8Array(a(e,d))),s(e,d,m[e]);return t.internalFormat=u,t.hasMipmap=m.length>1,t.samplingMode=t.hasMipmap?p.Cj.LINEAR_MIPMAP_LINEAR:p.Cj.LINEAR,t.width=n,t.height=o,new v.g(e,t,{type:"compressed",levels:m})}var M=r(69720),C=r(96672),R=r(53966);const w=()=>R.A.getLogger("esri.views.3d.webgl-engine.lib.DDSUtil");function I(e){return e.charCodeAt(0)+(e.charCodeAt(1)<<8)+(e.charCodeAt(2)<<16)+(e.charCodeAt(3)<<24)}const O=I("DXT1"),N=I("DXT3"),y=I("DXT5");function P(e,t,r){if(e instanceof ImageData)return P(L(e),t,r);const i=document.createElement("canvas");return i.width=t,i.height=r,i.getContext("2d").drawImage(e,0,0,i.width,i.height),i}function L(e){const t=document.createElement("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");if(null==r)throw new i.A("Failed to create 2d context from HTMLCanvasElement");return r.putImageData(e,0,0),t}var D,H,F=r(620),B=r(67171);class U extends M.J{constructor(e,t){super(),this._data=e,this.type=C.X.Texture,this.events=new n.A,this._glTexture=null,this._loadingPromise=null,this._loadingController=null,this._parameters={...z,...t},this._startPreload(e)}dispose(){this.unload(),this._data=this.frameUpdate=void 0}_startPreload(e){null!=e&&(e instanceof HTMLVideoElement?(this.frameUpdate=t=>this._frameUpdate(e,t),this._startPreloadVideoElement(e)):e instanceof HTMLImageElement&&this._startPreloadImageElement(e))}_startPreloadVideoElement(e){if(!((0,c.w8)(e.src)||"auto"===e.preload&&e.crossOrigin)){e.preload="auto",e.crossOrigin="anonymous";const t=!e.paused;if(e.src=e.src,t&&e.autoplay){const t=()=>{e.removeEventListener("canplay",t),e.play()};e.addEventListener("canplay",t)}}}_startPreloadImageElement(e){(0,c.DB)(e.src)||(0,c.w8)(e.src)||e.crossOrigin||(e.crossOrigin="anonymous",e.src=e.src)}_createDescriptor(e){const t=new B.R;return t.wrapMode=this._parameters.wrap??p.pF.REPEAT,t.flipped=!this._parameters.noUnpackFlip,t.samplingMode=this._parameters.mipmap?p.Cj.LINEAR_MIPMAP_LINEAR:p.Cj.LINEAR,t.hasMipmap=!!this._parameters.mipmap,t.preMultiplyAlpha=!!this._parameters.preMultiplyAlpha,t.maxAnisotropy=this._parameters.maxAnisotropy??(this._parameters.mipmap?e.parameters.maxMaxAnisotropy:1),t}get glTexture(){return this._glTexture}get memoryEstimate(){return this._glTexture?.usedMemory||function(e,t){if(null==e)return 0;if((0,s.mw)(e)||(0,s.mg)(e))return t.encoding===u.JS.KTX2_ENCODING?function(e,t){if(null==_)return e.byteLength;const r=new _.KTX2File(new Uint8Array(e)),i=E(r)?A(r.getLevels(),r.getHasAlpha(),r.getWidth(),r.getHeight(),t):0;return r.close(),r.delete(),i}(e,!!t.mipmap):t.encoding===u.JS.BASIS_ENCODING?function(e,t){if(null==_)return e.byteLength;const r=new _.BasisFile(new Uint8Array(e)),i=b(r)?A(r.getNumLevels(0),r.getHasAlpha(),r.getImageWidth(0,0),r.getImageHeight(0,0),t):0;return r.close(),r.delete(),i}(e,!!t.mipmap):e.byteLength;const{width:r,height:i}=e instanceof Image||e instanceof ImageData||e instanceof HTMLCanvasElement||e instanceof HTMLVideoElement?G(e):t;return(t.mipmap?4/3:1)*r*i*(t.components||4)||0}(this._data,this._parameters)}load(e){if(this._glTexture)return this._glTexture;if(this._loadingPromise)return this._loadingPromise;const t=this._data;return null==t?(this._glTexture=new v.g(e,this._createDescriptor(e),null),this._glTexture):(this._parameters.reloadable||(this._data=void 0),"string"==typeof t?this._loadFromURL(e,t):t instanceof Image?this._loadFromImageElement(e,t):t instanceof HTMLVideoElement?this._loadFromVideoElement(e,t):t instanceof ImageData||t instanceof HTMLCanvasElement?this._loadFromImage(e,t):(0,s.mg)(t)&&this._parameters.encoding===u.JS.DDS_ENCODING?this._loadFromDDSData(e,t):(0,s.mw)(t)&&this._parameters.encoding===u.JS.DDS_ENCODING?this._loadFromDDSData(e,new Uint8Array(t)):((0,s.mw)(t)||(0,s.mg)(t))&&this._parameters.encoding===u.JS.KTX2_ENCODING?this._loadFromKTX2(e,t):((0,s.mw)(t)||(0,s.mg)(t))&&this._parameters.encoding===u.JS.BASIS_ENCODING?this._loadFromBasis(e,t):(0,s.mg)(t)?this._loadFromPixelData(e,t):(0,s.mw)(t)?this._loadFromPixelData(e,new Uint8Array(t)):null)}_frameUpdate(e,t){return null==this._glTexture||e.readyState<D.HAVE_CURRENT_DATA||t===e.currentTime?t:(this._glTexture.setData(e),this._glTexture.descriptor.hasMipmap&&this._glTexture.generateMipmap(),this._parameters.updateCallback&&this._parameters.updateCallback(),e.currentTime)}_loadFromDDSData(e,t){return this._glTexture=function(e,t,r){const i=function(e,t){const r=new Int32Array(e.buffer,e.byteOffset,31);if(542327876!==r[0])return w().error("Invalid magic number in DDS header"),null;if(!(4&r[20]))return w().error("Unsupported format, must contain a FourCC code"),null;const i=r[21];let n,o;switch(i){case O:n=8,o=p.CQ.COMPRESSED_RGB_S3TC_DXT1_EXT;break;case N:n=16,o=p.CQ.COMPRESSED_RGBA_S3TC_DXT3_EXT;break;case y:n=16,o=p.CQ.COMPRESSED_RGBA_S3TC_DXT5_EXT;break;default:return w().error("Unsupported FourCC code:",function(e){return String.fromCharCode(255&e,e>>8&255,e>>16&255,e>>24&255)}(i)),null}let a=1,s=r[4],c=r[3];(3&s||3&c)&&(w().warn("Rounding up compressed texture size to nearest multiple of 4."),s=s+3&-4,c=c+3&-4);const l=s,d=c;let u,h;131072&r[2]&&!1!==t&&(a=Math.max(1,r[7]));let m=e.byteOffset+r[1]+4;const f=[];for(let t=0;t<a;++t)h=(s+3>>2)*(c+3>>2)*n,u=new Uint8Array(e.buffer,m,h),f.push(u),m+=h,s=Math.max(1,s>>1),c=Math.max(1,c>>1);return{textureData:{type:"compressed",levels:f},internalFormat:o,width:l,height:d}}(r,t.hasMipmap??!1);if(null==i)throw new Error("DDS texture data is null");const{textureData:n,internalFormat:o,width:a,height:s}=i;return t.samplingMode=n.levels.length>1?p.Cj.LINEAR_MIPMAP_LINEAR:p.Cj.LINEAR,t.hasMipmap=n.levels.length>1,t.internalFormat=o,t.width=a,t.height=s,new v.g(e,t,n)}(e,this._createDescriptor(e),t),this._glTexture}_loadFromKTX2(e,t){return this._loadAsync((()=>async function(e,t,r){null==_&&(_=await x());const i=new _.KTX2File(new Uint8Array(r));if(!E(i))return null;i.startTranscoding();const n=S(e,t,i.getLevels(),i.getHasAlpha(),i.getWidth(),i.getHeight(),((e,t)=>i.getImageTranscodedSizeInBytes(e,0,0,t)),((e,t,r)=>i.transcodeImage(r,e,0,0,t,0,-1,-1)));return i.close(),i.delete(),n}(e,this._createDescriptor(e),t).then((e=>(this._glTexture=e,e)))))}_loadFromBasis(e,t){return this._loadAsync((()=>async function(e,t,r){null==_&&(_=await x());const i=new _.BasisFile(new Uint8Array(r));if(!b(i))return null;i.startTranscoding();const n=S(e,t,i.getNumLevels(0),i.getHasAlpha(),i.getImageWidth(0,0),i.getImageHeight(0,0),((e,t)=>i.getImageTranscodedSizeInBytes(0,e,t)),((e,t,r)=>i.transcodeImage(r,0,e,t,0,0)));return i.close(),i.delete(),n}(e,this._createDescriptor(e),t).then((e=>(this._glTexture=e,e)))))}_loadFromPixelData(e,t){(0,F.vA)(this._parameters.width>0&&this._parameters.height>0);const r=this._createDescriptor(e);return r.pixelFormat=1===this._parameters.components?p.Ab.LUMINANCE:3===this._parameters.components?p.Ab.RGB:p.Ab.RGBA,r.width=this._parameters.width??0,r.height=this._parameters.height??0,this._glTexture=new v.g(e,r,t),this._glTexture}_loadFromURL(e,t){return this._loadAsync((async r=>{const i=await(0,l.D)(t,{signal:r});return(0,a.Te)(r),this._loadFromImage(e,i)}))}_loadFromImageElement(e,t){return t.complete?this._loadFromImage(e,t):this._loadAsync((async r=>{const i=await(0,d.Sx)(t,t.src,!1,r);return(0,a.Te)(r),this._loadFromImage(e,i)}))}_loadFromVideoElement(e,t){return t.readyState>=D.HAVE_CURRENT_DATA?this._loadFromImage(e,t):this._loadFromVideoElementAsync(e,t)}_loadFromVideoElementAsync(e,t){return this._loadAsync((r=>new Promise(((n,s)=>{const c=()=>{t.removeEventListener("loadeddata",l),t.removeEventListener("error",d),(0,o.xt)(u)},l=()=>{t.readyState>=D.HAVE_CURRENT_DATA&&(c(),n(this._loadFromImage(e,t)))},d=e=>{c(),s(e||new i.A("Failed to load video"))};t.addEventListener("loadeddata",l),t.addEventListener("error",d);const u=(0,a.u7)(r,(()=>d((0,a.NK)())))}))))}_loadFromImage(e,t){let r=t;if(!(r instanceof HTMLVideoElement)){const{maxTextureSize:t}=e.parameters;r=this._parameters.downsampleUncompressed?function(e,t){let r=e.width*e.height;if(r<4096)return e instanceof ImageData?L(e):e;let i=e.width,n=e.height;do{i=Math.ceil(i/2),n=Math.ceil(n/2),r=i*n}while(r>1048576||null!=t&&(i>t||n>t));return P(e,i,n)}(r,t):function(e,t){const r=Math.max(e.width,e.height);if(r<=t)return e;const i=t/r;return P(e,Math.round(e.width*i),Math.round(e.height*i))}(r,t)}const i=G(r);this._parameters.width=i.width,this._parameters.height=i.height;const n=this._createDescriptor(e);return n.pixelFormat=3===this._parameters.components?p.Ab.RGB:p.Ab.RGBA,n.width=i.width,n.height=i.height,n.shouldCompress=this._parameters.shouldCompress,this._glTexture=new v.g(e,n,r),this._glTexture}_loadAsync(e){const t=new AbortController;this._loadingController=t;const r=e(t.signal);this._loadingPromise=r;const i=()=>{this._loadingController===t&&(this._loadingController=null),this._loadingPromise===r&&(this._loadingPromise=null)};return r.then(i,i),r}unload(){if(this._glTexture=(0,o.WD)(this._glTexture),null!=this._loadingController){const e=this._loadingController;this._loadingController=null,this._loadingPromise=null,e.abort()}this.events.emit("unloaded")}get parameters(){return this._parameters}}function G(e){return e instanceof HTMLVideoElement?{width:e.videoWidth,height:e.videoHeight}:e}(H=D||(D={}))[H.HAVE_NOTHING=0]="HAVE_NOTHING",H[H.HAVE_METADATA=1]="HAVE_METADATA",H[H.HAVE_CURRENT_DATA=2]="HAVE_CURRENT_DATA",H[H.HAVE_FUTURE_DATA=3]="HAVE_FUTURE_DATA",H[H.HAVE_ENOUGH_DATA=4]="HAVE_ENOUGH_DATA";const z={wrap:{s:p.pF.REPEAT,t:p.pF.REPEAT},mipmap:!0,noUnpackFlip:!1,preMultiplyAlpha:!1,downsampleUncompressed:!1,shouldCompress:!1}},89192:(e,t,r)=>{var i,n,o,a,s,c,l,d;r.d(t,{Am:()=>a,C7:()=>o,JS:()=>d,Mg:()=>c,dd:()=>s,it:()=>n,s2:()=>i,sf:()=>l}),function(e){e[e.None=0]="None",e[e.Front=1]="Front",e[e.Back=2]="Back",e[e.COUNT=3]="COUNT"}(i||(i={})),function(e){e[e.Less=0]="Less",e[e.Lequal=1]="Lequal",e[e.COUNT=2]="COUNT"}(n||(n={})),function(e){e[e.BACKGROUND=0]="BACKGROUND",e[e.UPDATE=1]="UPDATE"}(o||(o={})),function(e){e[e.NOT_LOADED=0]="NOT_LOADED",e[e.LOADING=1]="LOADING",e[e.LOADED=2]="LOADED"}(a||(a={})),function(e){e[e.IntegratedMeshMaskExcluded=1]="IntegratedMeshMaskExcluded",e[e.OutlineVisualElementMask=2]="OutlineVisualElementMask"}(s||(s={})),function(e){e[e.Highlight=0]="Highlight",e[e.MaskOccludee=1]="MaskOccludee"}(c||(c={})),function(e){e[e.Blend=0]="Blend",e[e.Opaque=1]="Opaque",e[e.Mask=2]="Mask",e[e.MaskBlend=3]="MaskBlend",e[e.COUNT=4]="COUNT"}(l||(l={})),function(e){e.DDS_ENCODING="image/vnd-ms.dds",e.KTX2_ENCODING="image/ktx2",e.BASIS_ENCODING="image/x.basis"}(d||(d={}))},77194:(e,t,r)=>{r.d(t,{MD:()=>c,cJ:()=>s,hs:()=>l,m0:()=>a});var i=r(34727),n=(r(17352),r(97937));function o(e,t,r){const i=r.parameters;return d.scale=Math.min(i.divisor/(t-i.offset),1),d.factor=function(e){return Math.abs(e*e*e)}(e),d}function a(e,t){return(0,i.Cc)(e*Math.max(t.scale,t.minScaleFactor),e,t.factor)}function s(e,t,r,i){i.scale=function(e,t,r){const i=o(e,t,r);return i.minScaleFactor=0,a(1,i)}(e,t,r),i.factor=0,i.minScaleFactor=r.minScaleFactor}function c(e,t,r=[0,0]){const i=Math.min(Math.max(t.scale,t.minScaleFactor),1);return r[0]=e[0]*i,r[1]=e[1]*i,r}function l(e,t,r,i){return a(e,o(t,r,i))}r(24151),(0,i.kU)(10),(0,i.kU)(12),(0,i.kU)(70),(0,i.kU)(40);const d={scale:0,factor:0,minScaleFactor:0};(0,n.c)()},16396:(e,t,r)=>{r.d(t,{ou:()=>l}),r(77690),r(29242),r(58083),r(9093);var i=r(38954),n=r(51850),o=r(97937),a=r(24151),s=r(57005);const c=new class{constructor(e=0){this.offset=e,this.sphere=(0,o.c)(),this.tmpVertex=(0,n.vt)()}applyToVertex(e,t,r){const n=this.objectTransform.transform,o=(0,i.i)(d,e,t,r),a=(0,i.t)(o,o,n),s=this.offset/(0,i.l)(a);(0,i.b)(a,a,a,s);const c=this.objectTransform.inverse;return(0,i.t)(this.tmpVertex,a,c),this.tmpVertex}applyToMinMax(e,t){const r=this.offset/(0,i.l)(e);(0,i.b)(e,e,e,r);const n=this.offset/(0,i.l)(t);(0,i.b)(t,t,t,n)}applyToAabb(e){const t=this.offset/Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);e[0]+=e[0]*t,e[1]+=e[1]*t,e[2]+=e[2]*t;const r=this.offset/Math.sqrt(e[3]*e[3]+e[4]*e[4]+e[5]*e[5]);return e[3]+=e[3]*r,e[4]+=e[4]*r,e[5]+=e[5]*r,e}applyToBoundingSphere(e){const t=(0,i.l)((0,o.a)(e)),r=this.offset/t;return(0,i.b)((0,o.a)(this.sphere),(0,o.a)(e),(0,o.a)(e),r),this.sphere[3]=e[3]+e[3]*this.offset/t,this.sphere}};function l(e){return null!=e?(c.offset=e,c):null}new class{constructor(e=0){this.componentLocalOriginLength=0,this._totalOffset=0,this._offset=0,this._tmpVertex=(0,n.vt)(),this._tmpMbs=(0,o.c)(),this._tmpObb=new s.ab,this._resetOffset(e)}_resetOffset(e){this._offset=e,this._totalOffset=e}set offset(e){this._resetOffset(e)}get offset(){return this._offset}set componentOffset(e){this._totalOffset=this._offset+e}set localOrigin(e){this.componentLocalOriginLength=(0,i.l)(e)}applyToVertex(e,t,r){const n=(0,i.i)(d,e,t,r),o=(0,i.i)(u,e,t,r+this.componentLocalOriginLength),a=this._totalOffset/(0,i.l)(o);return(0,i.b)(this._tmpVertex,n,o,a),this._tmpVertex}applyToAabb(e){const t=this.componentLocalOriginLength,r=e[0],i=e[1],n=e[2]+t,o=e[3],a=e[4],s=e[5]+t,c=Math.abs(r),l=Math.abs(i),d=Math.abs(n),u=Math.abs(o),h=Math.abs(a),m=Math.abs(s),f=.5*(1+Math.sign(r*o))*Math.min(c,u),p=.5*(1+Math.sign(i*a))*Math.min(l,h),v=.5*(1+Math.sign(n*s))*Math.min(d,m),g=Math.max(c,u),_=Math.max(l,h),T=Math.max(d,m),x=Math.sqrt(f*f+p*p+v*v),A=Math.sign(c+r),b=Math.sign(l+i),E=Math.sign(d+n),S=Math.sign(u+o),M=Math.sign(h+a),C=Math.sign(m+s),R=this._totalOffset;if(x<R)return e[0]-=(1-A)*R,e[1]-=(1-b)*R,e[2]-=(1-E)*R,e[3]+=S*R,e[4]+=M*R,e[5]+=C*R,e;const w=R/Math.sqrt(g*g+_*_+T*T),I=R/x,O=I-w,N=-O;return e[0]+=r*(A*N+I),e[1]+=i*(b*N+I),e[2]+=n*(E*N+I),e[3]+=o*(S*O+w),e[4]+=a*(M*O+w),e[5]+=s*(C*O+w),e}applyToMbs(e){const t=(0,i.l)((0,o.a)(e)),r=this._totalOffset/t;return(0,i.b)((0,o.a)(this._tmpMbs),(0,o.a)(e),(0,o.a)(e),r),this._tmpMbs[3]=e[3]+e[3]*this._totalOffset/t,this._tmpMbs}applyToObb(e){return(0,s.gm)(e,this._totalOffset,this._totalOffset,a.RT.Global,this._tmpObb),this._tmpObb}},new class{constructor(e=0){this.offset=e,this.tmpVertex=(0,n.vt)()}applyToVertex(e,t,r){const n=(0,i.i)(d,e,t,r),o=(0,i.g)(u,n,this.localOrigin),a=this.offset/(0,i.l)(o);return(0,i.b)(this.tmpVertex,n,o,a),this.tmpVertex}applyToAabb(e){const t=h,r=m,i=f;for(let n=0;n<3;++n)t[n]=e[0+n]+this.localOrigin[n],r[n]=e[3+n]+this.localOrigin[n],i[n]=t[n];const n=this.applyToVertex(t[0],t[1],t[2]);for(let t=0;t<3;++t)e[t]=n[t],e[t+3]=n[t];const o=t=>{const r=this.applyToVertex(t[0],t[1],t[2]);for(let t=0;t<3;++t)e[t]=Math.min(e[t],r[t]),e[t+3]=Math.max(e[t+3],r[t])};for(let e=1;e<8;++e){for(let n=0;n<3;++n)i[n]=e&1<<n?r[n]:t[n];o(i)}let a=0;for(let e=0;e<3;++e)t[e]*r[e]<0&&(a|=1<<e);if(0!==a&&7!==a)for(let e=0;e<8;++e)if(!(a&e)){for(let n=0;n<3;++n)i[n]=a&1<<n?0:e&1<<n?t[n]:r[n];o(i)}for(let t=0;t<3;++t)e[t]-=this.localOrigin[t],e[t+3]-=this.localOrigin[t];return e}};const d=(0,n.vt)(),u=(0,n.vt)(),h=(0,n.vt)(),m=(0,n.vt)(),f=(0,n.vt)()},11787:(e,t,r)=>{r.d(t,{$U:()=>te});var i=r(38954),n=r(51850),o=r(24151),a=r(1843),s=r(49255),c=r(96336),l=r(22911),d=r(62602),u=r(59469),h=r(16943),m=r(89192),f=r(25634),p=r(11725),v=r(33524),g=r(70328),_=r(96672),T=r(620),x=r(46540);class A{constructor(e=!1,t=!0){this.isVerticalRay=e,this.normalRequired=t}}const b=(0,g.vt)();function E(e,t,r,n,o,a){if(!e.visible)return;const s=(0,i.a)(H,n,r),c=(e,t,r)=>{a(e,r,t,!1)},l=new A(!1,t.options.normalRequired);if(e.boundingInfo){(0,T.vA)(e.type===_.X.Mesh);const i=t.tolerance;M(e.boundingInfo,r,s,i,o,l,c)}else{const t=e.attributes.get(x.r.POSITION),n=t.indices;!function(e,t,r,n,o,a,s,c,l,d){const u=t,h=F,m=Math.abs(u[0]),f=Math.abs(u[1]),p=Math.abs(u[2]),v=m>=f?m>=p?0:2:f>=p?1:2,g=v,_=u[g]<0?2:1,T=(v+_)%3,x=(v+(3-_))%3,A=u[T]/u[g],b=u[x]/u[g],E=1/u[g],S=R,M=w,C=I,{normalRequired:O}=l;for(let t=0;t<n;++t){const r=3*t,n=s*o[r];(0,i.i)(h[0],a[n+0],a[n+1],a[n+2]);const l=s*o[r+1];(0,i.i)(h[1],a[l+0],a[l+1],a[l+2]);const u=s*o[r+2];(0,i.i)(h[2],a[u+0],a[u+1],a[u+2]),c&&((0,i.c)(h[0],c.applyToVertex(h[0][0],h[0][1],h[0][2],t)),(0,i.c)(h[1],c.applyToVertex(h[1][0],h[1][1],h[1][2],t)),(0,i.c)(h[2],c.applyToVertex(h[2][0],h[2][1],h[2][2],t))),(0,i.a)(S,h[0],e),(0,i.a)(M,h[1],e),(0,i.a)(C,h[2],e);const m=S[T]-A*S[g],f=S[x]-b*S[g],p=M[T]-A*M[g],v=M[x]-b*M[g],_=C[T]-A*C[g],R=C[x]-b*C[g],w=_*v-R*p,I=m*R-f*_,y=p*f-v*m;if((w<0||I<0||y<0)&&(w>0||I>0||y>0))continue;const P=w+I+y;if(0===P)continue;const L=w*(E*S[g])+I*(E*M[g])+y*(E*C[g]);if(L*Math.sign(P)<0)continue;const D=L/P;D>=0&&d(D,t,O?N(h):null)}}(r,s,0,n.length/3,n,t.data,t.stride,o,l,c)}}const S=(0,n.vt)();function M(e,t,r,n,o,a,s){if(null==e)return;const c=function(e,t){return(0,i.i)(t,1/e[0],1/e[1],1/e[2])}(r,S);if((0,g.Ne)(b,e.bbMin),(0,g.vI)(b,e.bbMax),null!=o&&o.applyToAabb(b),function(e,t,r,i){return function(e,t,r,i){const n=(e[0]-i-t[0])*r[0],o=(e[3]+i-t[0])*r[0];let a=Math.min(n,o),s=Math.max(n,o);const c=(e[1]-i-t[1])*r[1],l=(e[4]+i-t[1])*r[1];if(s=Math.min(s,Math.max(c,l)),s<0)return!1;if(a=Math.max(a,Math.min(c,l)),a>s)return!1;const d=(e[2]-i-t[2])*r[2],u=(e[5]+i-t[2])*r[2];return s=Math.min(s,Math.max(d,u)),!(s<0)&&(a=Math.max(a,Math.min(d,u)),!(a>s)&&a<1/0)}(e,t,r,i)}(b,t,c,n)){const{primitiveIndices:i,position:c}=e,l=i?i.length:c.indices.length/3;if(l>L){const i=e.getChildren();if(void 0!==i){for(const e of i)M(e,t,r,n,o,a,s);return}}!function(e,t,r,i,n,o,a,s,c,l,d){const u=e[0],h=e[1],m=e[2],f=t[0],p=t[1],v=t[2],{normalRequired:g}=l;for(let e=0;e<i;++e){const t=s[e],r=3*t,i=a*n[r];let l=o[i],_=o[i+1],T=o[i+2];const x=a*n[r+1];let A=o[x],b=o[x+1],E=o[x+2];const S=a*n[r+2];let M=o[S],R=o[S+1],w=o[S+2];null!=c&&([l,_,T]=c.applyToVertex(l,_,T,e),[A,b,E]=c.applyToVertex(A,b,E,e),[M,R,w]=c.applyToVertex(M,R,w,e));const I=A-l,N=b-_,y=E-T,P=M-l,L=R-_,H=w-T,F=p*H-L*v,B=v*P-H*f,U=f*L-P*p,G=I*F+N*B+y*U;if(Math.abs(G)<=D)continue;const z=u-l,V=h-_,W=m-T,j=z*F+V*B+W*U;if(G>0){if(j<0||j>G)continue}else if(j>0||j<G)continue;const k=V*y-N*W,Y=W*I-y*z,q=z*N-I*V,$=f*k+p*Y+v*q;if(G>0){if($<0||j+$>G)continue}else if($>0||j+$<G)continue;const X=(P*k+L*Y+H*q)/G;X>=0&&d(X,t,g?O(I,N,y,P,L,H,C):null)}}(t,r,0,l,c.indices,c.data,c.stride,i,o,a,s)}}const C=(0,n.vt)(),R=(0,n.vt)(),w=(0,n.vt)(),I=(0,n.vt)();function O(e,t,r,n,o,a,s){return(0,i.i)(y,e,t,r),(0,i.i)(P,n,o,a),(0,i.e)(s,y,P),(0,i.n)(s,s),s}function N(e){return(0,i.a)(y,e[1],e[0]),(0,i.a)(P,e[2],e[0]),(0,i.e)(C,y,P),(0,i.n)(C,C),C}const y=(0,n.vt)(),P=(0,n.vt)(),L=1e3,D=1e-7,H=(0,n.vt)(),F=[(0,n.vt)(),(0,n.vt)(),(0,n.vt)()];var B=r(13464),U=r(16396),G=r(13030),z=r(59907);class V{constructor(e){this.vertexBufferLayout=e}elementCount(e){return e.get(x.r.POSITION).indices.length}write(e,t,r,i,n,o){(0,z.SA)(r,i,this.vertexBufferLayout,e,t,n,o)}intersect(e,t,r,n,o){const a=this.vertexBufferLayout.createView(e).getField(x.r.POSITION,G.xs);if(null==a)return;const s=(0,i.a)(W,n,r),c=a.elementCount/3,l=t.options.normalRequired;!function(e,t,r,i,n,o,a,s){const c=e[0],l=e[1],d=e[2],u=t[0],h=t[1],m=t[2];for(let e=0;e<i;++e){const t=3*e,r=t+1,i=t+2,f=o*t,p=n[f],v=n[f+1],g=n[f+2],_=o*r,T=o*i,x=n[_]-p,A=n[_+1]-v,b=n[_+2]-g,E=n[T]-p,S=n[T+1]-v,M=n[T+2]-g,R=h*M-S*m,w=m*E-M*u,I=u*S-E*h,N=x*R+A*w+b*I;if(Math.abs(N)<=D)continue;const y=c-p,P=l-v,L=d-g,H=y*R+P*w+L*I;if(N>0){if(H<0||H>N)continue}else if(H>0||H<N)continue;const F=P*b-A*L,B=L*x-b*y,U=y*A-x*P,G=u*F+h*B+m*U;if(N>0){if(G<0||H+G>N)continue}else if(G>0||H+G<N)continue;const z=(E*F+S*B+M*U)/N;z>=0&&s(z,e,a?O(x,A,b,E,S,M,C):null)}}(r,s,0,c,a.typedBuffer,a.typedBufferStride,l,((e,t,r)=>{o(e,r,t,!1)}))}}const W=(0,n.vt)();var j=r(43616),k=r(97225),Y=r(90237),q=r(53466),$=r(51976),X=r(35256);class Z extends X.E{constructor(e,t){super(),this.spherical=e,this.doublePrecisionRequiresObfuscation=t,this.alphaDiscardMode=m.sf.Opaque,this.doubleSidedMode=d.W.None,this.pbrMode=u.A9.Disabled,this.cullFace=m.s2.None,this.normalType=c.W.Attribute,this.customDepthTest=m.it.Less,this.emissionSource=l.ZX.None,this.hasVertexColors=!1,this.hasSymbolColors=!1,this.hasVerticalOffset=!1,this.hasColorTexture=!1,this.hasMetallicRoughnessTexture=!1,this.hasOcclusionTexture=!1,this.hasNormalTexture=!1,this.hasScreenSizePerspective=!1,this.hasVertexTangents=!1,this.hasOccludees=!1,this.hasModelTransformation=!1,this.offsetBackfaces=!1,this.vvSize=!1,this.vvColor=!1,this.receiveShadows=!1,this.receiveAmbientOcclusion=!1,this.textureAlphaPremultiplied=!1,this.instanced=!1,this.instancedColor=!1,this.writeDepth=!0,this.transparent=!1,this.enableOffset=!0,this.terrainDepthTest=!1,this.cullAboveTerrain=!1,this.snowCover=!1,this.hasColorTextureTransform=!1,this.hasEmissionTextureTransform=!1,this.hasNormalTextureTransform=!1,this.hasOcclusionTextureTransform=!1,this.hasMetallicRoughnessTextureTransform=!1,this.occlusionPass=!1,this.hasVvInstancing=!0,this.useCustomDTRExponentForWater=!1,this.useFillLights=!0}get textureCoordinateType(){return this.hasColorTexture||this.hasMetallicRoughnessTexture||this.emissionSource===l.ZX.Texture||this.hasOcclusionTexture||this.hasNormalTexture?q.I.Default:q.I.None}get objectAndLayerIdColorInstanced(){return this.instanced}get discardInvisibleFragments(){return this.transparent}}(0,Y._)([(0,$.W)({count:m.sf.COUNT})],Z.prototype,"alphaDiscardMode",void 0),(0,Y._)([(0,$.W)({count:d.W.COUNT})],Z.prototype,"doubleSidedMode",void 0),(0,Y._)([(0,$.W)({count:u.A9.COUNT})],Z.prototype,"pbrMode",void 0),(0,Y._)([(0,$.W)({count:m.s2.COUNT})],Z.prototype,"cullFace",void 0),(0,Y._)([(0,$.W)({count:c.W.COUNT})],Z.prototype,"normalType",void 0),(0,Y._)([(0,$.W)({count:m.it.COUNT})],Z.prototype,"customDepthTest",void 0),(0,Y._)([(0,$.W)({count:l.ZX.COUNT})],Z.prototype,"emissionSource",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasVertexColors",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasSymbolColors",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasVerticalOffset",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasColorTexture",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasMetallicRoughnessTexture",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasOcclusionTexture",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasNormalTexture",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasScreenSizePerspective",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasVertexTangents",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasOccludees",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasModelTransformation",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"offsetBackfaces",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"vvSize",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"vvColor",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"receiveShadows",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"receiveAmbientOcclusion",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"textureAlphaPremultiplied",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"instanced",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"instancedColor",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"writeDepth",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"transparent",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"enableOffset",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"terrainDepthTest",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"cullAboveTerrain",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"snowCover",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasColorTextureTransform",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasEmissionTextureTransform",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasNormalTextureTransform",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasOcclusionTextureTransform",void 0),(0,Y._)([(0,$.W)()],Z.prototype,"hasMetallicRoughnessTextureTransform",void 0);var J=r(97220),K=r(57323);class Q extends k.R5{constructor(e,t){super(e,t,new J.$(K.R,(()=>r.e(9933).then(r.bind(r,39933))))),this.type="RealisticTreeTechnique"}}var ee=r(49788);class te extends p.im{constructor(e,t){super(e,ie),this.materialType="default",this.supportsEdges=!0,this.produces=new Map([[B.N.OPAQUE_MATERIAL,e=>((0,s.iq)(e)||(0,s.PJ)(e))&&!this.parameters.transparent],[B.N.TRANSPARENT_MATERIAL,e=>((0,s.iq)(e)||(0,s.PJ)(e))&&this.parameters.transparent&&this.parameters.writeDepth],[B.N.TRANSPARENT_MATERIAL_WITHOUT_DEPTH,e=>((0,s.XY)(e)||(0,s.PJ)(e))&&this.parameters.transparent&&!this.parameters.writeDepth]]),this._vertexBufferLayout=function(e){const t=(0,a.BP)().vec3f(x.r.POSITION);return e.normalType===c.W.Compressed?t.vec2i16(x.r.NORMALCOMPRESSED,{glNormalized:!0}):t.vec3f(x.r.NORMAL),e.hasVertexTangents&&t.vec4f(x.r.TANGENT),(e.textureId||e.normalTextureId||e.metallicRoughnessTextureId||e.emissiveTextureId||e.occlusionTextureId)&&t.vec2f(x.r.UV0),e.hasVertexColors&&t.vec4u8(x.r.COLOR),e.hasSymbolColors&&t.vec4u8(x.r.SYMBOLCOLOR),(0,h.E)()&&t.vec4u8(x.r.OBJECTANDLAYERIDCOLOR),t}(this.parameters),this._configuration=new Z(t.spherical,t.doublePrecisionRequiresObfuscation)}isVisibleForOutput(e){return e!==s.V.Shadow&&e!==s.V.ShadowExcludeHighlight&&e!==s.V.ShadowHighlight||this.parameters.castShadows}get visible(){const e=this.parameters;if(e.layerOpacity<ee.Q)return!1;const{hasInstancedColor:t,hasVertexColors:r,hasSymbolColors:i,vvColor:n}=e,o=t||n||i,a="replace"===e.colorMixMode,s=e.opacity>=ee.Q;if(r&&o)return a||s;const c=e.externalColor&&e.externalColor[3]>=ee.Q;return r?a?c:s:o?a||s:a?c:s}get hasEmissions(){return!!this.parameters.emissiveTextureId||!(0,i.p)(this.parameters.emissiveFactor,n.uY)}getConfiguration(e,t){const r=this.parameters,{treeRendering:i,doubleSided:n,doubleSidedType:o}=r;return this._configuration.output=e,this._configuration.hasNormalTexture=!i&&!!r.normalTextureId,this._configuration.hasColorTexture=!!r.textureId,this._configuration.hasVertexTangents=!i&&r.hasVertexTangents,this._configuration.instanced=r.isInstanced,this._configuration.instancedDoublePrecision=r.instancedDoublePrecision,this._configuration.vvSize=!!r.vvSize,this._configuration.hasVerticalOffset=null!=r.verticalOffset,this._configuration.hasScreenSizePerspective=null!=r.screenSizePerspective,this._configuration.hasSlicePlane=r.hasSlicePlane,this._configuration.alphaDiscardMode=r.textureAlphaMode,this._configuration.normalType=i?c.W.Attribute:r.normalType,this._configuration.transparent=r.transparent,this._configuration.writeDepth=r.writeDepth,null!=r.customDepthTest&&(this._configuration.customDepthTest=r.customDepthTest),this._configuration.hasOccludees=t.hasOccludees,this._configuration.cullFace=r.hasSlicePlane?m.s2.None:r.cullFace,this._configuration.cullAboveTerrain=t.cullAboveTerrain,this._configuration.hasModelTransformation=!i&&null!=r.modelTransformation,this._configuration.hasVertexColors=r.hasVertexColors,this._configuration.hasSymbolColors=r.hasSymbolColors,this._configuration.doubleSidedMode=i?d.W.WindingOrder:n&&"normal"===o?d.W.View:n&&"winding-order"===o?d.W.WindingOrder:d.W.None,this._configuration.instancedColor=r.hasInstancedColor,(0,s.RN)(e)?(this._configuration.terrainDepthTest=t.terrainDepthTest,this._configuration.receiveShadows=r.receiveShadows,this._configuration.receiveAmbientOcclusion=r.receiveAmbientOcclusion&&null!=t.ssao):(this._configuration.terrainDepthTest=!1,this._configuration.receiveShadows=this._configuration.receiveAmbientOcclusion=!1),this._configuration.vvColor=!!r.vvColor,this._configuration.textureAlphaPremultiplied=!!r.textureAlphaPremultiplied,this._configuration.pbrMode=r.usePBR?r.isSchematic?u.A9.Schematic:u.A9.Normal:u.A9.Disabled,this._configuration.hasMetallicRoughnessTexture=!i&&!!r.metallicRoughnessTextureId,this._configuration.emissionSource=i?l.ZX.None:null!=r.emissiveTextureId?l.ZX.Texture:r.usePBR?l.ZX.Value:l.ZX.None,this._configuration.hasOcclusionTexture=!i&&!!r.occlusionTextureId,this._configuration.offsetBackfaces=!(!r.transparent||!r.offsetTransparentBackfaces),this._configuration.oitPass=t.oitPass,this._configuration.enableOffset=t.camera.relativeElevation<v.xt,this._configuration.snowCover=function(e){return null!=e.weather&&e.weatherVisible&&"snowy"===e.weather.type&&"enabled"===e.weather.snowCover}(t),this._configuration.hasColorTextureTransform=!!r.colorTextureTransformMatrix,this._configuration.hasNormalTextureTransform=!!r.normalTextureTransformMatrix,this._configuration.hasEmissionTextureTransform=!!r.emissiveTextureTransformMatrix,this._configuration.hasOcclusionTextureTransform=!!r.occlusionTextureTransformMatrix,this._configuration.hasMetallicRoughnessTextureTransform=!!r.metallicRoughnessTextureTransformMatrix,this._configuration}intersect(e,t,r,n,a,s){if(null!=this.parameters.verticalOffset){const e=r.camera;(0,i.i)(le,t[12],t[13],t[14]);let s=null;switch(r.viewingMode){case o.RT.Global:s=(0,i.n)(se,le);break;case o.RT.Local:s=(0,i.c)(se,ae)}let c=0;const l=(0,i.d)(de,le,e.eye),d=(0,i.l)(l),u=(0,i.h)(l,l,1/d);let h=null;this.parameters.screenSizePerspective&&(h=(0,i.f)(s,u)),c+=(0,j.kE)(e,d,this.parameters.verticalOffset,h??0,this.parameters.screenSizePerspective),(0,i.h)(s,s,c),(0,i.q)(ce,s,r.transform.inverseRotation),n=(0,i.d)(ne,n,ce),a=(0,i.d)(oe,a,ce)}E(e,r,n,a,(0,U.ou)(r.verticalOffset),s)}createGLMaterial(e){return new re(e)}createBufferWriter(){return new V(this._vertexBufferLayout)}}class re extends f.m8{constructor(e){super({...e,...e.material.parameters})}beginSlot(e){this._material.setParameters({receiveShadows:e.shadowMap.enabled});const t=this._material.parameters;this.updateTexture(t.textureId);const r=e.camera.viewInverseTransposeMatrix;return(0,i.i)(t.origin,r[3],r[7],r[11]),this._material.setParameters(this.textureBindParameters),this.getTechnique(t.treeRendering?Q:k.R5,e)}}class ie extends k.uD{constructor(){super(...arguments),this.treeRendering=!1,this.hasVertexTangents=!1}}const ne=(0,n.vt)(),oe=(0,n.vt)(),ae=(0,n.fA)(0,0,1),se=(0,n.vt)(),ce=(0,n.vt)(),le=(0,n.vt)(),de=(0,n.vt)()},35256:(e,t,r)=>{r.d(t,{E:()=>l});var i=r(90237),n=r(49255),o=r(51976);class a extends o.K{constructor(){super(...arguments),this.instancedDoublePrecision=!1,this.hasModelTransformation=!1}}(0,i._)([(0,o.W)()],a.prototype,"instancedDoublePrecision",void 0),(0,i._)([(0,o.W)()],a.prototype,"hasModelTransformation",void 0);var s=r(59643),c=r(69270);class l extends a{constructor(){super(...arguments),this.output=n.V.Color,this.oitPass=s.Y.NONE,this.hasSlicePlane=!1,this.bindType=c.c.Pass,this.writeDepth=!0}}(0,i._)([(0,o.W)({count:n.V.COUNT})],l.prototype,"output",void 0),(0,i._)([(0,o.W)({count:s.Y.COUNT})],l.prototype,"oitPass",void 0),(0,i._)([(0,o.W)()],l.prototype,"hasSlicePlane",void 0)},43616:(e,t,r)=>{r.d(t,{MB:()=>s,Um:()=>c,kE:()=>a});var i=r(4576),n=r(34727),o=r(77194);function a(e,t,r,i,a){let s=(r.screenLength||0)*e.pixelRatio;null!=a&&(s=(0,o.hs)(s,i,t,a));const c=s*Math.tan(.5*e.fovY)/(.5*e.fullHeight);return(0,n.qE)(c*t,r.minWorldLength||0,null!=r.maxWorldLength?r.maxWorldLength:1/0)}function s(e,t){let r=!1;for(const n in t){const o=t[n];void 0!==o&&(Array.isArray(o)?Array.isArray(e[n])&&(0,i.aI)(o,e[n])||(e[n]=o.slice(),r=!0):e[n]!==o&&(r=!0,e[n]=o))}return r}const c={multiply:1,ignore:2,replace:3,tint:4}},59907:(e,t,r)=>{r.d(t,{Hk:()=>h,Pq:()=>u,SA:()=>v,Ut:()=>d,p1:()=>m,tH:()=>p,tb:()=>f,uO:()=>s});var i=r(58083),n=r(13030),o=r(620),a=r(46540);function s(e,t,r,i=1){const{data:n,indices:o}=e,a=t.typedBuffer,s=t.typedBufferStride,c=o.length;if(r*=s,1===i)for(let e=0;e<c;++e)a[r]=n[o[e]],r+=s;else for(let e=0;e<c;++e){const t=n[o[e]];for(let e=0;e<i;e++)a[r]=t,r+=s}}function c(e,t,r){const{data:i,indices:n}=e,o=t.typedBuffer,a=t.typedBufferStride,s=n.length;r*=a;for(let e=0;e<s;++e){const t=2*n[e];o[r]=i[t],o[r+1]=i[t+1],r+=a}}function l(e,t,r,i){const{data:n,indices:o}=e,a=t.typedBuffer,s=t.typedBufferStride,c=o.length;if(r*=s,null==i||1===i)for(let e=0;e<c;++e){const t=3*o[e];a[r]=n[t],a[r+1]=n[t+1],a[r+2]=n[t+2],r+=s}else for(let e=0;e<c;++e){const t=3*o[e];for(let e=0;e<i;++e)a[r]=n[t],a[r+1]=n[t+1],a[r+2]=n[t+2],r+=s}}function d(e,t,r,i=1){const{data:n,indices:o}=e,a=t.typedBuffer,s=t.typedBufferStride,c=o.length;if(r*=s,1===i)for(let e=0;e<c;++e){const t=4*o[e];a[r]=n[t],a[r+1]=n[t+1],a[r+2]=n[t+2],a[r+3]=n[t+3],r+=s}else for(let e=0;e<c;++e){const t=4*o[e];for(let e=0;e<i;++e)a[r]=n[t],a[r+1]=n[t+1],a[r+2]=n[t+2],a[r+3]=n[t+3],r+=s}}function u(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride;t*=n;for(let e=0;e<r;++e)i[t]=0,i[t+1]=0,i[t+2]=0,i[t+3]=0,t+=n}function h(e,t,r,n,o=1){if(!t)return void l(e,r,n,o);const{data:a,indices:s}=e,c=r.typedBuffer,d=r.typedBufferStride,u=s.length,h=t[0],m=t[1],f=t[2],p=t[4],v=t[5],g=t[6],_=t[8],T=t[9],x=t[10],A=t[12],b=t[13],E=t[14];n*=d;let S=0,M=0,C=0;const R=(0,i.tZ)(t)?e=>{S=a[e]+A,M=a[e+1]+b,C=a[e+2]+E}:e=>{const t=a[e],r=a[e+1],i=a[e+2];S=h*t+p*r+_*i+A,M=m*t+v*r+T*i+b,C=f*t+g*r+x*i+E};if(1===o)for(let e=0;e<u;++e)R(3*s[e]),c[n]=S,c[n+1]=M,c[n+2]=C,n+=d;else for(let e=0;e<u;++e){R(3*s[e]);for(let e=0;e<o;++e)c[n]=S,c[n+1]=M,c[n+2]=C,n+=d}}function m(e,t,r,n,o=1){if(!t)return void l(e,r,n,o);const{data:a,indices:s}=e,c=t,d=r.typedBuffer,u=r.typedBufferStride,h=s.length,m=c[0],f=c[1],p=c[2],v=c[4],g=c[5],_=c[6],T=c[8],x=c[9],A=c[10],b=!(0,i.ut)(c),E=1e-6,S=1-E;n*=u;let M=0,C=0,R=0;const w=(0,i.tZ)(c)?e=>{M=a[e],C=a[e+1],R=a[e+2]}:e=>{const t=a[e],r=a[e+1],i=a[e+2];M=m*t+v*r+T*i,C=f*t+g*r+x*i,R=p*t+_*r+A*i};if(1===o)if(b)for(let e=0;e<h;++e){w(3*s[e]);const t=M*M+C*C+R*R;if(t<S&&t>E){const e=1/Math.sqrt(t);d[n]=M*e,d[n+1]=C*e,d[n+2]=R*e}else d[n]=M,d[n+1]=C,d[n+2]=R;n+=u}else for(let e=0;e<h;++e)w(3*s[e]),d[n]=M,d[n+1]=C,d[n+2]=R,n+=u;else for(let e=0;e<h;++e){if(w(3*s[e]),b){const e=M*M+C*C+R*R;if(e<S&&e>E){const t=1/Math.sqrt(e);M*=t,C*=t,R*=t}}for(let e=0;e<o;++e)d[n]=M,d[n+1]=C,d[n+2]=R,n+=u}}function f(e,t,r,i,n=1){const{data:o,indices:a}=e,s=r.typedBuffer,c=r.typedBufferStride,l=a.length;if(i*=c,t!==o.length||4!==t)if(1!==n)if(4!==t)for(let e=0;e<l;++e){const t=3*a[e];for(let e=0;e<n;++e)s[i]=o[t],s[i+1]=o[t+1],s[i+2]=o[t+2],s[i+3]=255,i+=c}else for(let e=0;e<l;++e){const t=4*a[e];for(let e=0;e<n;++e)s[i]=o[t],s[i+1]=o[t+1],s[i+2]=o[t+2],s[i+3]=o[t+3],i+=c}else{if(4===t){for(let e=0;e<l;++e){const t=4*a[e];s[i]=o[t],s[i+1]=o[t+1],s[i+2]=o[t+2],s[i+3]=o[t+3],i+=c}return}for(let e=0;e<l;++e){const t=3*a[e];s[i]=o[t],s[i+1]=o[t+1],s[i+2]=o[t+2],s[i+3]=255,i+=c}}else{s[i]=o[0],s[i+1]=o[1],s[i+2]=o[2],s[i+3]=o[3];const e=new Uint32Array(r.typedBuffer.buffer,r.start),t=c/4,a=e[i/=4];i+=t;const d=l*n;for(let r=1;r<d;++r)e[i]=a,i+=t}}function p(e,t,r,i,n=1){const o=t.typedBuffer,a=t.typedBufferStride;if(i*=a,1===n)for(let t=0;t<r;++t)o[i]=e[0],o[i+1]=e[1],o[i+2]=e[2],o[i+3]=e[3],i+=a;else for(let t=0;t<r;++t)for(let t=0;t<n;++t)o[i]=e[0],o[i+1]=e[1],o[i+2]=e[2],o[i+3]=e[3],i+=a}function v(e,t,r,i,o,s,c){for(const l of r.fields.keys()){const r=e.get(l),d=r?.indices;if(r&&d)g(l,r,i,o,s,c);else if(l===a.r.OBJECTANDLAYERIDCOLOR&&null!=t){const r=e.get(a.r.POSITION)?.indices;if(r){const e=r.length;p(t,s.getField(l,n.XP),e,c)}}}}function g(e,t,r,s,l,u){switch(e){case a.r.POSITION:{(0,o.vA)(3===t.size);const i=l.getField(e,n.xs);(0,o.vA)(!!i,`No buffer view for ${e}`),i&&h(t,r,i,u);break}case a.r.NORMAL:{(0,o.vA)(3===t.size);const r=l.getField(e,n.xs);(0,o.vA)(!!r,`No buffer view for ${e}`),r&&m(t,s,r,u);break}case a.r.NORMALCOMPRESSED:{(0,o.vA)(2===t.size);const r=l.getField(e,n.mJ);(0,o.vA)(!!r,`No buffer view for ${e}`),r&&c(t,r,u);break}case a.r.UV0:{(0,o.vA)(2===t.size);const r=l.getField(e,n.gH);(0,o.vA)(!!r,`No buffer view for ${e}`),r&&c(t,r,u);break}case a.r.COLOR:case a.r.SYMBOLCOLOR:{const r=l.getField(e,n.XP);(0,o.vA)(!!r,`No buffer view for ${e}`),(0,o.vA)(3===t.size||4===t.size),!r||3!==t.size&&4!==t.size||f(t,t.size,r,u);break}case a.r.COLORFEATUREATTRIBUTE:{const r=l.getField(e,n.Y$);(0,o.vA)(!!r,`No buffer view for ${e}`),(0,o.vA)(1===t.size),r&&1===t.size&&function(e,t,r){const{data:i,indices:n}=e,o=t.typedBuffer,a=t.typedBufferStride,s=n.length,c=i[0];r*=a;for(let e=0;e<s;++e)o[r]=c,r+=a}(t,r,u);break}case a.r.TANGENT:{(0,o.vA)(4===t.size);const a=l.getField(e,n.Eq);(0,o.vA)(!!a,`No buffer view for ${e}`),a&&function(e,t,r,n,o=1){if(!t)return void d(e,r,n,o);const{data:a,indices:s}=e,c=t,l=r.typedBuffer,u=r.typedBufferStride,h=s.length,m=c[0],f=c[1],p=c[2],v=c[4],g=c[5],_=c[6],T=c[8],x=c[9],A=c[10],b=!(0,i.ut)(c),E=1e-6,S=1-E;if(n*=u,1===o)for(let e=0;e<h;++e){const t=4*s[e],r=a[t],i=a[t+1],o=a[t+2],c=a[t+3];let d=m*r+v*i+T*o,h=f*r+g*i+x*o,M=p*r+_*i+A*o;if(b){const e=d*d+h*h+M*M;if(e<S&&e>E){const t=1/Math.sqrt(e);d*=t,h*=t,M*=t}}l[n]=d,l[n+1]=h,l[n+2]=M,l[n+3]=c,n+=u}else for(let e=0;e<h;++e){const t=4*s[e],r=a[t],i=a[t+1],c=a[t+2],d=a[t+3];let h=m*r+v*i+T*c,M=f*r+g*i+x*c,C=p*r+_*i+A*c;if(b){const e=h*h+M*M+C*C;if(e<S&&e>E){const t=1/Math.sqrt(e);h*=t,M*=t,C*=t}}for(let e=0;e<o;++e)l[n]=h,l[n+1]=M,l[n+2]=C,l[n+3]=d,n+=u}}(t,r,a,u);break}case a.r.PROFILERIGHT:case a.r.PROFILEUP:case a.r.PROFILEVERTEXANDNORMAL:case a.r.FEATUREVALUE:{(0,o.vA)(4===t.size);const r=l.getField(e,n.Eq);(0,o.vA)(!!r,`No buffer view for ${e}`),r&&d(t,r,u)}}}},74810:(e,t,r)=>{r.d(t,{Bt:()=>s,Jr:()=>o,SY:()=>c,mb:()=>a});var i=r(38954),n=r(51850);function o({normalTexture:e,metallicRoughnessTexture:t,metallicFactor:r,roughnessFactor:o,emissiveTexture:a,emissiveFactor:s,occlusionTexture:c}){return null==e&&null==t&&null==a&&(null==s||(0,i.p)(s,n.uY))&&null==c&&(null==o||1===o)&&(null==r||1===r)}const a=(0,n.CN)(1,1,.5),s=(0,n.CN)(0,.6,.2),c=(0,n.CN)(0,1,.2)},97225:(e,t,r)=>{r.d(t,{V:()=>E,uD:()=>b,R5:()=>S});var i=r(51850),n=r(91829),o=r(49255),a=r(96336),s=r(72824),c=r(97220),l=r(98958),d=r(89192),u=r(11725),h=r(59643),m=r(33524),f=r(63907);f.MT.LESS,f.MT.ALWAYS;const p={mask:255},v={function:{func:f.MT.ALWAYS,ref:d.dd.OutlineVisualElementMask,mask:d.dd.OutlineVisualElementMask},operation:{fail:f.eA.KEEP,zFail:f.eA.KEEP,zPass:f.eA.ZERO}},g={function:{func:f.MT.ALWAYS,ref:d.dd.OutlineVisualElementMask,mask:d.dd.OutlineVisualElementMask},operation:{fail:f.eA.KEEP,zFail:f.eA.KEEP,zPass:f.eA.REPLACE}};f.MT.EQUAL,d.dd.OutlineVisualElementMask,d.dd.OutlineVisualElementMask,f.eA.KEEP,f.eA.KEEP,f.eA.KEEP,f.MT.NOTEQUAL,d.dd.OutlineVisualElementMask,d.dd.OutlineVisualElementMask,f.eA.KEEP,f.eA.KEEP,f.eA.KEEP;var _=r(74810),T=r(28491),x=r(90644),A=r(49788);class b extends s.Zo{constructor(){super(...arguments),this.isSchematic=!1,this.usePBR=!1,this.mrrFactors=_.mb,this.hasVertexColors=!1,this.hasSymbolColors=!1,this.doubleSided=!1,this.doubleSidedType="normal",this.cullFace=d.s2.Back,this.isInstanced=!1,this.hasInstancedColor=!1,this.emissiveFactor=i.uY,this.instancedDoublePrecision=!1,this.normalType=a.W.Attribute,this.receiveShadows=!0,this.receiveAmbientOcclusion=!0,this.castShadows=!0,this.ambient=(0,i.CN)(.2,.2,.2),this.diffuse=(0,i.CN)(.8,.8,.8),this.externalColor=(0,n.fA)(1,1,1,1),this.colorMixMode="multiply",this.opacity=1,this.layerOpacity=1,this.origin=(0,i.vt)(),this.hasSlicePlane=!1,this.offsetTransparentBackfaces=!1,this.vvSize=null,this.vvColor=null,this.vvOpacity=null,this.vvSymbolAnchor=null,this.vvSymbolRotationMatrix=null,this.modelTransformation=null,this.transparent=!1,this.writeDepth=!0,this.customDepthTest=d.it.Less,this.textureAlphaMode=d.sf.Blend,this.textureAlphaCutoff=A.Q,this.textureAlphaPremultiplied=!1,this.renderOccluded=u.m$.Occlude,this.isDecoration=!1}}class E extends s.gy{constructor(){super(...arguments),this.origin=(0,i.vt)(),this.slicePlaneLocalOrigin=this.origin}}class S extends l.w{constructor(e,t,i=new c.$(T.D,(()=>r.e(5141).then(r.bind(r,5141))))){super(e,t,i),this.type="DefaultMaterialTechnique"}_makePipeline(e,t){const{oitPass:r,output:i,transparent:n,cullFace:a,customDepthTest:s,hasOccludees:c,enableOffset:l}=e,d=r===h.Y.NONE,u=r===h.Y.FrontFace;return(0,x.Ey)({blending:(0,o.RN)(i)&&n?(0,m.Yf)(r):null,culling:C(e)?(0,x.Xt)(a):null,depthTest:{func:(0,m.K_)(r,M(s))},depthWrite:(0,m.z5)(e),drawBuffers:i===o.V.Depth?{buffers:[f.Hr.NONE]}:(0,m.m6)(r,i),colorWrite:x.kn,stencilWrite:c?p:null,stencilTest:c?t?g:v:null,polygonOffset:d||u?null:(0,m.aB)(l)})}initializePipeline(e){return this._occludeePipelineState=this._makePipeline(e,!0),this._makePipeline(e,!1)}getPipeline(e){return e?this._occludeePipelineState:super.getPipeline()}}function M(e){return e===d.it.Lequal?f.MT.LEQUAL:f.MT.LESS}function C(e){return e.cullFace!==d.s2.None||!e.hasSlicePlane&&!e.transparent&&!e.doubleSidedMode}},60517:(e,t,r)=>{r.d(t,{z:()=>d});var i=r(49255),n=r(22911),o=r(2981),a=r(63365),s=r(31821),c=r(59643),l=r(49788);function d(e,t){e.include(o.Q,t),e.include(n.NL,t),e.fragment.include(a.a);const r=t.output===i.V.ObjectAndLayerIdColor,d=(0,i.LG)(t.output),u=(0,i.RN)(t.output)&&t.oitPass===c.Y.ColorAlpha,h=(0,i.RN)(t.output)&&t.oitPass!==c.Y.ColorAlpha,m=t.discardInvisibleFragments;let f=0;(h||d||u)&&e.outputs.add("fragColor","vec4",f++),d&&e.outputs.add("fragEmission","vec4",f++),u&&e.outputs.add("fragAlpha","float",f++),e.fragment.code.add(s.H`
    void outputColorHighlightOID(vec4 finalColor, const in vec3 vWorldPosition) {
      ${(0,s.If)(r,"finalColor.a = 1.0;")}

      ${(0,s.If)(m,`if (finalColor.a < ${s.H.float(l.Q)}) { discard; }`)}

      finalColor = applySlice(finalColor, vWorldPosition);
      ${(0,s.If)(u,s.H`fragColor = premultiplyAlpha(finalColor);
             fragAlpha = finalColor.a;`)}
      ${(0,s.If)(h,"fragColor = finalColor;")}
      ${(0,s.If)(d,"fragEmission = finalColor.a * getEmissions();")}
      calculateOcclusionAndOutputHighlight();
      ${(0,s.If)(r,"outputObjectAndLayerIdColor();")}
    }
  `)}},65786:(e,t,r)=>{r.d(t,{Y:()=>i});const i=class{};new i},14113:(e,t,r)=>{r.d(t,{N5:()=>c});var i=r(49186),n=(r(44208),r(53966)),o=r(69270);const a=()=>n.A.getLogger("esri.views.3d.webgl-engine.core.shaderModules.shaderBuilder");class s{constructor(){this._includedModules=new Map}include(e,t){this._includedModules.has(e)?this._includedModules.get(e):(this._includedModules.set(e,t),e(this.builder,t))}}class c extends s{constructor(){super(...arguments),this.vertex=new h,this.fragment=new h,this.attributes=new m,this.varyings=new f,this.extensions=new p,this.outputs=new v}get fragmentUniforms(){return this.fragment.uniforms.entries}get builder(){return this}generate(e,t=!1){const r=this.extensions.generateSource(e),i=this.attributes.generateSource(e),n=this.varyings.generateSource(e),o="vertex"===e?this.vertex:this.fragment,a=o.uniforms.generateSource(),s=o.code.generateSource(),c=o.main.generateSource(t),l="vertex"===e?T:_,d=o.constants.generateSource(),u=this.outputs.generateSource(e);return`#version 300 es\n${r.join("\n")}\n${l}\n${d.join("\n")}\n${a.join("\n")}\n${i.join("\n")}\n${n.join("\n")}\n${u.join("\n")}\n${s.join("\n")}\n${c.join("\n")}`}generateBind(e){const t=new Map;this.vertex.uniforms.entries.forEach((e=>{const r=e.bind[o.c.Bind];r&&t.set(e.name,r)})),this.fragment.uniforms.entries.forEach((e=>{const r=e.bind[o.c.Bind];r&&t.set(e.name,r)}));const r=Array.from(t.values()),i=r.length;return t=>{for(let n=0;n<i;++n)r[n](e,t)}}generateBindPass(e){const t=new Map;this.vertex.uniforms.entries.forEach((e=>{const r=e.bind[o.c.Pass];r&&t.set(e.name,r)})),this.fragment.uniforms.entries.forEach((e=>{const r=e.bind[o.c.Pass];r&&t.set(e.name,r)}));const r=Array.from(t.values()),i=r.length;return(t,n)=>{for(let o=0;o<i;++o)r[o](e,t,n)}}generateBindDraw(e){const t=new Map;this.vertex.uniforms.entries.forEach((e=>{const r=e.bind[o.c.Draw];r&&t.set(e.name,r)})),this.fragment.uniforms.entries.forEach((e=>{const r=e.bind[o.c.Draw];r&&t.set(e.name,r)}));const r=Array.from(t.values()),i=r.length;return(t,n,o)=>{for(let a=0;a<i;++a)r[a](e,o,t,n)}}}class l{constructor(e){this._stage=e,this._entries=new Map}add(...e){for(const t of e)this._add(t);return this._stage}get(e){return this._entries.get(e)}_add(e){if(null!=e){if(this._entries.has(e.name)&&!this._entries.get(e.name).equals(e))throw new i.A(`Duplicate uniform name ${e.name} for different uniform type`);this._entries.set(e.name,e)}else a().error(`Trying to add null Uniform from ${(new Error).stack}.`)}generateSource(){return Array.from(this._entries.values()).map((e=>null!=e.arraySize?`uniform ${e.type} ${e.name}[${e.arraySize}];`:`uniform ${e.type} ${e.name};`))}get entries(){return Array.from(this._entries.values())}}class d{constructor(e){this._stage=e,this._bodies=new Array}add(e){return this._bodies.push(e),this._stage}generateSource(e){if(this._bodies.length>0)return[`void main() {\n ${this._bodies.join("\n")||""} \n}`];if(e)throw new i.A("Shader does not contain main function body.");return[]}}class u{constructor(e){this._stage=e,this._entries=new Array}add(e){return this._entries.push(e),this._stage}generateSource(){return this._entries}}class h extends s{constructor(){super(...arguments),this.uniforms=new l(this),this.main=new d(this),this.code=new u(this),this.constants=new g(this)}get builder(){return this}}class m{constructor(){this._entries=new Array}add(e,t){this._entries.push([e,t])}generateSource(e){return"fragment"===e?[]:this._entries.map((e=>`in ${e[1]} ${e[0]};`))}}class f{constructor(){this._entries=new Map}add(e,t){this._entries.has(e)?a().warn(`Ignoring duplicate varying ${t} ${e}`):this._entries.set(e,t)}generateSource(e){const t=new Array;return this._entries.forEach(((r,i)=>t.push("vertex"===e?`out ${r} ${i};`:`in ${r} ${i};`))),t}}class p{constructor(){this._entries=new Set}add(e){this._entries.add(e)}generateSource(e){const t="vertex"===e?p.ALLOWLIST_VERTEX:p.ALLOWLIST_FRAGMENT;return Array.from(this._entries).filter((e=>t.includes(e))).map((e=>`#extension ${e} : enable`))}}p.ALLOWLIST_FRAGMENT=["GL_EXT_shader_texture_lod","GL_OES_standard_derivatives"],p.ALLOWLIST_VERTEX=[];class v{constructor(){this._entries=new Map}add(e,t,r=0){const i=this._entries.get(r);i?.name!==e||i?.type!==t?this._entries.set(r,{name:e,type:t}):a().warn(`Fragment shader output location ${r} occupied`)}generateSource(e){if("vertex"===e)return[];0===this._entries.size&&this._entries.set(0,{name:v.DEFAULT_NAME,type:v.DEFAULT_TYPE});const t=new Array;return this._entries.forEach(((e,r)=>t.push(`layout(location = ${r}) out ${e.type} ${e.name};`))),t}}v.DEFAULT_TYPE="vec4",v.DEFAULT_NAME="fragColor";class g{constructor(e){this._stage=e,this._entries=new Set}add(e,t,r){let i="ERROR_CONSTRUCTOR_STRING";switch(t){case"float":i=g._numberToFloatStr(r);break;case"int":i=g._numberToIntStr(r);break;case"bool":i=r.toString();break;case"vec2":i=`vec2(${g._numberToFloatStr(r[0])},                            ${g._numberToFloatStr(r[1])})`;break;case"vec3":i=`vec3(${g._numberToFloatStr(r[0])},                            ${g._numberToFloatStr(r[1])},                            ${g._numberToFloatStr(r[2])})`;break;case"vec4":i=`vec4(${g._numberToFloatStr(r[0])},                            ${g._numberToFloatStr(r[1])},                            ${g._numberToFloatStr(r[2])},                            ${g._numberToFloatStr(r[3])})`;break;case"ivec2":i=`ivec2(${g._numberToIntStr(r[0])},                             ${g._numberToIntStr(r[1])})`;break;case"ivec3":i=`ivec3(${g._numberToIntStr(r[0])},                             ${g._numberToIntStr(r[1])},                             ${g._numberToIntStr(r[2])})`;break;case"ivec4":i=`ivec4(${g._numberToIntStr(r[0])},                             ${g._numberToIntStr(r[1])},                             ${g._numberToIntStr(r[2])},                             ${g._numberToIntStr(r[3])})`;break;case"mat2":case"mat3":case"mat4":i=`${t}(${Array.prototype.map.call(r,(e=>g._numberToFloatStr(e))).join(", ")})`}return this._entries.add(`const ${t} ${e} = ${i};`),this._stage}static _numberToIntStr(e){return e.toFixed(0)}static _numberToFloatStr(e){return Number.isInteger(e)?e.toFixed(1):e.toString()}generateSource(){return Array.from(this._entries)}}const _="#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n  precision highp int;\n  precision highp sampler2D;\n#else\n  precision mediump float;\n  precision mediump int;\n  precision mediump sampler2D;\n#endif",T="precision highp float;\nprecision highp sampler2D;"},30164:(e,t,r)=>{r.d(t,{g:()=>A});var i,n,o=r(49186),a=(r(44208),r(53966)),s=r(97768),c=r(74887),l=r(44794),d=r(94656),u=r(63907);(n=i||(i={}))[n.Texture=0]="Texture",n[n.RenderBuffer=1]="RenderBuffer";var h=r(67171);function m(e){(null!=e.width&&e.width<0||null!=e.height&&e.height<0||null!=e.depth&&e.depth<0)&&a.A.getLogger("esri/views/webgl/textureUtils").error("Negative dimension parameters are not allowed!")}function f(e){return null!=e&&"type"in e&&"compressed"===e.type}function p(e){return null!=e&&!f(e)&&!function(e){return null!=e&&"byteLength"in e}(e)}function v(e){return e===u.Ap.TEXTURE_3D||e===u.Ap.TEXTURE_2D_ARRAY}function g(e,t,r,i=1){let n=Math.max(t,r);return e===u.Ap.TEXTURE_3D&&(n=Math.max(n,i)),Math.floor(Math.log2(n))+1}function _(e){if(null!=e.internalFormat)return e.internalFormat===u.Ab.DEPTH_STENCIL?u.Ab.DEPTH24_STENCIL8:e.internalFormat;switch(e.dataType){case u.ld.FLOAT:switch(e.pixelFormat){case u.Ab.RGBA:return u.H0.RGBA32F;case u.Ab.RGB:return u.H0.RGB32F;default:throw new o.A("Unable to derive format")}case u.ld.UNSIGNED_BYTE:switch(e.pixelFormat){case u.Ab.RGBA:return u.H0.RGBA8;case u.Ab.RGB:return u.H0.RGB8}}return e.internalFormat=e.pixelFormat===u.Ab.DEPTH_STENCIL?u.Ab.DEPTH24_STENCIL8:e.pixelFormat}class T extends h.R{constructor(e,t){switch(super(),this.context=e,Object.assign(this,t),this.internalFormat){case u.H0.R16F:case u.H0.R16I:case u.H0.R16UI:case u.H0.R32F:case u.H0.R32I:case u.H0.R32UI:case u.H0.R8_SNORM:case u.H0.R8:case u.H0.R8I:case u.H0.R8UI:this.pixelFormat=u.Ab.RED}}static validate(e,t){return new T(e,t)}}const x=()=>a.A.getLogger("esri/views/webgl/Texture");let A=class e{constructor(e,t=null,r=null){if(this.type=i.Texture,this._glName=null,this._samplingModeDirty=!1,this._wrapModeDirty=!1,this._wasImmutablyAllocated=!1,this._compressionAbortController=(0,l.v)(null),"context"in e)this._descriptor=e,r=t;else{const r=T.validate(e,t);if(!r)throw new o.A("Texture descriptor invalid");this._descriptor=r}this._descriptor.target===u.Ap.TEXTURE_CUBE_MAP?this._setDataCubeMap(r):this.setData(r)}get glName(){return this._glName}get descriptor(){return this._descriptor}get usedMemory(){return(0,h.e)(this._descriptor)}get cachedMemory(){return this.usedMemory}get isDirty(){return this._samplingModeDirty||this._wrapModeDirty}get isCompressing(){return null!==this._compressionAbortController.value}dispose(){this.abortCompression(),this._glName&&this._descriptor.context.instanceCounter.decrement(u.vt.Texture,this),this._descriptor.context.gl&&this._glName&&(this._descriptor.context.unbindTexture(this),this._descriptor.context.gl.deleteTexture(this._glName),this._glName=null)}release(){this.dispose()}resize(e,t){const r=this._descriptor;if(r.width!==e||r.height!==t){if(this._wasImmutablyAllocated)throw new o.A("Immutable textures can't be resized!");r.width=e,r.height=t,this._descriptor.target===u.Ap.TEXTURE_CUBE_MAP?this._setDataCubeMap(null):this.setData(null)}}enableCompression(e){this._descriptor.shouldCompress=e}setData(e){this.abortCompression(),!f(e)&&this._descriptor.internalFormat&&this._descriptor.internalFormat in u.CQ&&(this._descriptor.internalFormat=void 0),this._setData(e),!f(e)&&this._descriptor.shouldCompress&&this._compressOnWorker(e)}updateData(t,r,i,n,a,s,c=0){s||x().error("An attempt to use uninitialized data!"),this._glName||x().error("An attempt to update uninitialized texture!");const l=this._descriptor;l.internalFormat=_(l);const{context:d,pixelFormat:u,dataType:h,target:m,isImmutable:v}=l;if(v&&!this._wasImmutablyAllocated)throw new o.A("Cannot update immutable texture before allocation!");const g=d.bindTexture(this,e.TEXTURE_UNIT_FOR_UPDATES,!0);(r<0||i<0||r+n>l.width||i+a>l.height)&&x().error("An attempt to update out of bounds of the texture!"),this._configurePixelStorage();const{gl:T}=d;c&&(n&&a||x().warn("Must pass width and height if `UNPACK_SKIP_ROWS` is used"),T.pixelStorei(T.UNPACK_SKIP_ROWS,c)),p(s)?T.texSubImage2D(m,t,r,i,n,a,u,h,s):f(s)?T.compressedTexSubImage2D(m,t,r,i,n,a,l.internalFormat,s.levels[t]):T.texSubImage2D(m,t,r,i,n,a,u,h,s),c&&T.pixelStorei(T.UNPACK_SKIP_ROWS,0),d.bindTexture(g,e.TEXTURE_UNIT_FOR_UPDATES)}updateData3D(t,r,i,n,a,s,c,l){l||x().error("An attempt to use uninitialized data!"),this._glName||x().error("An attempt to update an uninitialized texture!");const d=this._descriptor;d.internalFormat=_(d);const{context:u,pixelFormat:h,dataType:m,isImmutable:p,target:g}=d;if(p&&!this._wasImmutablyAllocated)throw new o.A("Cannot update immutable texture before allocation!");v(g)||x().warn("Attempting to set 3D texture data on a non-3D texture");const T=u.bindTexture(this,e.TEXTURE_UNIT_FOR_UPDATES);u.setActiveTexture(e.TEXTURE_UNIT_FOR_UPDATES),(r<0||i<0||n<0||r+a>d.width||i+s>d.height||n+c>d.depth)&&x().error("An attempt to update out of bounds of the texture!"),this._configurePixelStorage();const{gl:A}=u;if(f(l))l=l.levels[t],A.compressedTexSubImage3D(g,t,r,i,n,a,s,c,d.internalFormat,l);else{const e=l;A.texSubImage3D(g,t,r,i,n,a,s,c,h,m,e)}u.bindTexture(T,e.TEXTURE_UNIT_FOR_UPDATES)}generateMipmap(){const t=this._descriptor;if(0===t.width||0===t.height)return;if(!t.hasMipmap){if(this._wasImmutablyAllocated)throw new o.A("Cannot add mipmaps to immutable texture after allocation");t.hasMipmap=!0,this._samplingModeDirty=!0,m(t)}t.samplingMode===u.Cj.LINEAR?(this._samplingModeDirty=!0,t.samplingMode=u.Cj.LINEAR_MIPMAP_NEAREST):t.samplingMode===u.Cj.NEAREST&&(this._samplingModeDirty=!0,t.samplingMode=u.Cj.NEAREST_MIPMAP_NEAREST);const r=this._descriptor.context.bindTexture(this,e.TEXTURE_UNIT_FOR_UPDATES);this._descriptor.context.setActiveTexture(e.TEXTURE_UNIT_FOR_UPDATES),this._descriptor.context.gl.generateMipmap(t.target),this._descriptor.context.bindTexture(r,e.TEXTURE_UNIT_FOR_UPDATES)}clearMipmap(){const e=this._descriptor;if(e.hasMipmap){if(this._wasImmutablyAllocated)throw new o.A("Cannot delete mipmaps to immutable texture after allocation");e.hasMipmap=!1,this._samplingModeDirty=!0,m(e)}e.samplingMode===u.Cj.LINEAR_MIPMAP_NEAREST?(this._samplingModeDirty=!0,e.samplingMode=u.Cj.LINEAR):e.samplingMode===u.Cj.NEAREST_MIPMAP_NEAREST&&(this._samplingModeDirty=!0,e.samplingMode=u.Cj.NEAREST)}setSamplingMode(e){e!==this._descriptor.samplingMode&&(this._descriptor.samplingMode=e,this._samplingModeDirty=!0)}setWrapMode(e){e!==this._descriptor.wrapMode&&(this._descriptor.wrapMode=e,m(this._descriptor),this._wrapModeDirty=!0)}applyChanges(){this._samplingModeDirty&&(this._applySamplingMode(),this._samplingModeDirty=!1),this._wrapModeDirty&&(this._applyWrapMode(),this._wrapModeDirty=!1)}abortCompression(){this.isCompressing&&(this._compressionAbortController.value=(0,s.DC)(this._compressionAbortController.value))}_setData(t,r){const i=this._descriptor,n=i.context?.gl;if(!n)return;(0,d.Y2)(n),this._glName||(this._glName=n.createTexture(),this._glName&&i.context.instanceCounter.increment(u.vt.Texture,this)),m(i);const a=i.context.bindTexture(this,e.TEXTURE_UNIT_FOR_UPDATES);i.context.setActiveTexture(e.TEXTURE_UNIT_FOR_UPDATES),this._configurePixelStorage(),(0,d.Y2)(n);const s=r??i.target,c=v(s);if(p(t))this._setDataFromTexImageSource(t,s);else{const{width:e,height:r,depth:a}=i;if(null==e||null==r)throw new o.A("Width and height must be specified!");if(c&&null==a)throw new o.A("Depth must be specified!");if(i.internalFormat=_(i),i.isImmutable&&!this._wasImmutablyAllocated&&this._texStorage(s,i.internalFormat,i.hasMipmap,e,r,a),f(t)){if(!(i.internalFormat in u.CQ))throw new o.A("Attempting to use compressed data with an uncompressed format!");this._setDataFromCompressedSource(t,i.internalFormat,s)}else this._texImage(s,0,i.internalFormat,e,r,a,t),(0,d.Y2)(n),i.hasMipmap&&this.generateMipmap()}this._applySamplingMode(),this._applyWrapMode(),this._applyAnisotropicFilteringParameters(),(0,d.Y2)(n),i.context.bindTexture(a,e.TEXTURE_UNIT_FOR_UPDATES)}_setDataCubeMap(e=null){for(let t=u.Ap.TEXTURE_CUBE_MAP_POSITIVE_X;t<=u.Ap.TEXTURE_CUBE_MAP_NEGATIVE_Z;t++)this._setData(e,t)}_configurePixelStorage(){const e=this._descriptor.context.gl,{unpackAlignment:t,flipped:r,preMultiplyAlpha:i}=this._descriptor;e.pixelStorei(e.UNPACK_ALIGNMENT,t),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r?1:0),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i?1:0)}_setDataFromTexImageSource(e,t){const{gl:r}=this._descriptor.context,i=this._descriptor;i.internalFormat=_(i);const n=v(t),{width:o,height:a,depth:s}=function(e){let t="width"in e?e.width:e.codedWidth,r="height"in e?e.height:e.codedHeight;return e instanceof HTMLVideoElement&&(t=e.videoWidth,r=e.videoHeight),{width:t,height:r,depth:1}}(e);i.width&&i.height,i.width||(i.width=o),i.height||(i.height=a),n&&i.depth,n&&(i.depth=s),i.isImmutable&&!this._wasImmutablyAllocated&&this._texStorage(t,i.internalFormat,i.hasMipmap,o,a,s),this._texImage(t,0,i.internalFormat,o,a,s,e),(0,d.Y2)(r),i.hasMipmap&&(this.generateMipmap(),(0,d.Y2)(r))}_setDataFromCompressedSource(e,t,r){const i=this._descriptor,{width:n,height:o,depth:a}=i,s=e.levels,c=g(r,n,o,a),l=Math.min(c,s.length)-1;this._descriptor.context.gl.texParameteri(i.target,i.context.gl.TEXTURE_MAX_LEVEL,l),this._forEachMipmapLevel(((e,i,n,o)=>{const a=s[Math.min(e,s.length-1)];this._compressedTexImage(r,e,t,i,n,o,a)}),l)}_texStorage(e,t,r,i,n,a){const{gl:s}=this._descriptor.context;if(!(t in u.H0))throw new o.A("Immutable textures must have a sized internal format");if(!this._descriptor.isImmutable)return;const c=r?g(e,i,n,a):1;if(v(e)){if(null==a)throw new o.A("Missing depth dimension for 3D texture upload");s.texStorage3D(e,c,t,i,n,a)}else s.texStorage2D(e,c,t,i,n);this._wasImmutablyAllocated=!0}_texImage(e,t,r,i,n,a,s){const c=this._descriptor.context.gl,l=v(e),{isImmutable:d,pixelFormat:u,dataType:h}=this._descriptor;if(d){if(null!=s){const r=s;if(l){if(null==a)throw new o.A("Missing depth dimension for 3D texture upload");c.texSubImage3D(e,t,0,0,0,i,n,a,u,h,r)}else c.texSubImage2D(e,t,0,0,i,n,u,h,r)}}else{const d=s;if(l){if(null==a)throw new o.A("Missing depth dimension for 3D texture upload");c.texImage3D(e,t,r,i,n,a,0,u,h,d)}else c.texImage2D(e,t,r,i,n,0,u,h,d)}}_compressedTexImage(e,t,r,i,n,a,s){const c=this._descriptor.context.gl,l=v(e);if(this._descriptor.isImmutable){if(null!=s)if(l){if(null==a)throw new o.A("Missing depth dimension for 3D texture upload");c.compressedTexSubImage3D(e,t,0,0,0,i,n,a,r,s)}else c.compressedTexSubImage2D(e,t,0,0,i,n,r,s)}else if(l){if(null==a)throw new o.A("Missing depth dimension for 3D texture upload");c.compressedTexImage3D(e,t,r,i,n,a,0,s)}else c.compressedTexImage2D(e,t,r,i,n,0,s)}async _compressOnWorker(t){if(!e.compressionWorkerHandle||!e.compressionWorkerHandle.isCompressible(t))return;const r=this._descriptor.context?.gl.getExtension("WEBGL_compressed_texture_etc"),i=this._descriptor.context?.gl.getExtension("WEBGL_compressed_texture_s3tc");if(r||i){const n=new AbortController;this._compressionAbortController.value=n;const o={data:await createImageBitmap(t),flipped:this.descriptor.flipped,width:t.width,height:t.height,hasMipmap:this._descriptor.hasMipmap,hasETC:!!r,hasS3TC:!!i};e.compressionWorkerHandle.invoke(o,this._compressionAbortController.value.signal).then((e=>{e&&this.isCompressing&&this.glName&&(this._descriptor.internalFormat=e.internalFormat,this._setData(e.compressedTexture)),n===this._compressionAbortController.value&&(this._compressionAbortController.value=null)})).catch((e=>{(0,c.zf)(e)||n!==this._compressionAbortController.value||(this._compressionAbortController.value=null)}))}}_forEachMipmapLevel(e,t=1/0){let{width:r,height:i,depth:n,hasMipmap:a,target:s}=this._descriptor;const c=s===u.Ap.TEXTURE_3D;if(null==r||null==i||c&&null==n)throw new o.A("Missing texture dimensions for mipmap calculation");for(let o=0;e(o,r,i,n),a&&(1!==r||1!==i||c&&1!==n)&&!(o>=t);++o)r=Math.max(1,r>>1),i=Math.max(1,i>>1),c&&(n=Math.max(1,n>>1))}_applySamplingMode(){const e=this._descriptor,t=e.context?.gl;let r=e.samplingMode,i=e.samplingMode;r===u.Cj.LINEAR_MIPMAP_NEAREST||r===u.Cj.LINEAR_MIPMAP_LINEAR?(r=u.Cj.LINEAR,e.hasMipmap||(i=u.Cj.LINEAR)):r!==u.Cj.NEAREST_MIPMAP_NEAREST&&r!==u.Cj.NEAREST_MIPMAP_LINEAR||(r=u.Cj.NEAREST,e.hasMipmap||(i=u.Cj.NEAREST)),t.texParameteri(e.target,t.TEXTURE_MAG_FILTER,r),t.texParameteri(e.target,t.TEXTURE_MIN_FILTER,i)}_applyWrapMode(){const e=this._descriptor,t=e.context?.gl;"number"==typeof e.wrapMode?(t.texParameteri(e.target,t.TEXTURE_WRAP_S,e.wrapMode),t.texParameteri(e.target,t.TEXTURE_WRAP_T,e.wrapMode)):(t.texParameteri(e.target,t.TEXTURE_WRAP_S,e.wrapMode.s),t.texParameteri(e.target,t.TEXTURE_WRAP_T,e.wrapMode.t))}_applyAnisotropicFilteringParameters(){const e=this._descriptor,t=e.context.capabilities.textureFilterAnisotropic;t&&e.context.gl.texParameterf(e.target,t.TEXTURE_MAX_ANISOTROPY,e.maxAnisotropy??1)}};A.TEXTURE_UNIT_FOR_UPDATES=0,A.compressionWorkerHandle=null},67171:(e,t,r)=>{r.d(t,{R:()=>o,e:()=>a});var i=r(63907),n=r(42293);class o{constructor(e=0,t=e){this.width=e,this.height=t,this.target=i.Ap.TEXTURE_2D,this.pixelFormat=i.Ab.RGBA,this.dataType=i.ld.UNSIGNED_BYTE,this.samplingMode=i.Cj.LINEAR,this.wrapMode=i.pF.REPEAT,this.maxAnisotropy=1,this.flipped=!1,this.hasMipmap=!1,this.isOpaque=!1,this.unpackAlignment=4,this.preMultiplyAlpha=!1,this.shouldCompress=!1,this.depth=1,this.isImmutable=!1}}function a(e){return e.width<=0||e.height<=0?0:Math.round(e.width*e.height*e.depth*(e.hasMipmap?4/3:1)*(null==e.internalFormat?4:(0,n.IB)(e.internalFormat))*(e.target===i.Ap.TEXTURE_CUBE_MAP?6:1))}},42293:(e,t,r)=>{r.d(t,{Hi:()=>c,IB:()=>l,yu:()=>s}),r(44208);var i=r(94656),n=r(63907),o=r(62298);function a(e){const t=e.gl;switch(t.getError()){case t.NO_ERROR:return null;case t.INVALID_ENUM:return"An unacceptable value has been specified for an enumerated argument";case t.INVALID_VALUE:return"An unacceptable value has been specified for an argument";case t.INVALID_OPERATION:return"The specified command is not allowed for the current state";case t.INVALID_FRAMEBUFFER_OPERATION:return"The currently bound framebuffer is not framebuffer complete";case t.OUT_OF_MEMORY:return"Not enough memory is left to execute the command";case t.CONTEXT_LOST_WEBGL:return"WebGL context is lost"}return"Unknown error"}function s(e,t,r,n,s=0){const c=e.gl;e.bindBuffer(r);for(const r of n){const n=t.get(r.name);if(null==n){console.warn(`There is no location for vertex attribute '${r.name}' defined.`);continue}const l=s*r.stride;if(r.count<=4)c.vertexAttribPointer(n,r.count,r.type,r.normalized,r.stride,r.offset+l),c.enableVertexAttribArray(n),r.divisor>0&&e.gl.vertexAttribDivisor(n,r.divisor);else if(9===r.count)for(let t=0;t<3;t++)c.vertexAttribPointer(n+t,3,r.type,r.normalized,r.stride,r.offset+12*t+l),c.enableVertexAttribArray(n+t),r.divisor>0&&e.gl.vertexAttribDivisor(n+t,r.divisor);else if(16===r.count)for(let t=0;t<4;t++)c.vertexAttribPointer(n+t,4,r.type,r.normalized,r.stride,r.offset+16*t+l),c.enableVertexAttribArray(n+t),r.divisor>0&&e.gl?.vertexAttribDivisor(n+t,r.divisor);else console.error("Unsupported vertex attribute element count: "+r.count);if((0,i.en)()){const t=a(e),i=(0,o._)(r.type),n=r.offset,s=Math.round(i/n)!==i/n?`. Offset not a multiple of stride. DataType requires ${i} bytes, but descriptor has an offset of ${n}`:"";t&&console.error(`Unable to bind vertex attribute "${r.name}" with baseInstanceOffset ${l}${s}:`,t,r)}}}function c(e,t,r,i){const o=e.gl;e.bindBuffer(r);for(const r of i){const i=t.get(r.name);if(r.count<=4)o.disableVertexAttribArray(i),r.divisor&&r.divisor>0&&e.gl?.vertexAttribDivisor(i,0);else if(9===r.count)for(let t=0;t<3;t++)o.disableVertexAttribArray(i+t),r.divisor&&r.divisor>0&&e.gl?.vertexAttribDivisor(i+t,0);else if(16===r.count)for(let t=0;t<4;t++)o.disableVertexAttribArray(i+t),r.divisor&&r.divisor>0&&e.gl?.vertexAttribDivisor(i+t,0);else console.error("Unsupported vertex attribute element count: "+r.count)}e.unbindBuffer(n.NZ.ARRAY_BUFFER)}function l(e){switch(e){case n.Ab.ALPHA:case n.Ab.LUMINANCE:case n.Ab.RED:case n.Ab.RED_INTEGER:case n.H0.R8:case n.H0.R8I:case n.H0.R8UI:case n.H0.R8_SNORM:case n.yQ.STENCIL_INDEX8:return 1;case n.Ab.LUMINANCE_ALPHA:case n.Ab.RG:case n.Ab.RG_INTEGER:case n.H0.RGBA4:case n.H0.R16F:case n.H0.R16I:case n.H0.R16UI:case n.H0.RG8:case n.H0.RG8I:case n.H0.RG8UI:case n.H0.RG8_SNORM:case n.H0.RGB565:case n.H0.RGB5_A1:case n.yQ.DEPTH_COMPONENT16:return 2;case n.Ab.DEPTH_COMPONENT:case n.Ab.RGB:case n.Ab.RGB_INTEGER:case n.H0.RGB8:case n.H0.RGB8I:case n.H0.RGB8UI:case n.H0.RGB8_SNORM:case n.H0.SRGB8:case n.yQ.DEPTH_COMPONENT24:return 3;case n.Ab.DEPTH_STENCIL:case n.Ab.DEPTH24_STENCIL8:case n.Ab.RGBA:case n.Ab.RGBA_INTEGER:case n.H0.RGBA8:case n.H0.R32F:case n.H0.R11F_G11F_B10F:case n.H0.RG16F:case n.H0.R32I:case n.H0.R32UI:case n.H0.RG16I:case n.H0.RG16UI:case n.H0.RGBA8I:case n.H0.RGBA8UI:case n.H0.RGBA8_SNORM:case n.H0.SRGB8_ALPHA8:case n.H0.RGB9_E5:case n.H0.RGB10_A2UI:case n.H0.RGB10_A2:case n.yQ.DEPTH_STENCIL:case n.yQ.DEPTH_COMPONENT32F:case n.yQ.DEPTH24_STENCIL8:return 4;case n.yQ.DEPTH32F_STENCIL8:return 5;case n.H0.RGB16F:case n.H0.RGB16I:case n.H0.RGB16UI:return 6;case n.H0.RG32F:case n.H0.RG32I:case n.H0.RG32UI:case n.H0.RGBA16F:case n.H0.RGBA16I:case n.H0.RGBA16UI:return 8;case n.H0.RGB32F:case n.H0.RGB32I:case n.H0.RGB32UI:return 12;case n.H0.RGBA32F:case n.H0.RGBA32I:case n.H0.RGBA32UI:return 16;case n.CQ.COMPRESSED_RGB_S3TC_DXT1_EXT:case n.CQ.COMPRESSED_RGBA_S3TC_DXT1_EXT:return.5;case n.CQ.COMPRESSED_RGBA_S3TC_DXT3_EXT:case n.CQ.COMPRESSED_RGBA_S3TC_DXT5_EXT:return 1;case n.CQ.COMPRESSED_R11_EAC:case n.CQ.COMPRESSED_SIGNED_R11_EAC:case n.CQ.COMPRESSED_RGB8_ETC2:case n.CQ.COMPRESSED_SRGB8_ETC2:case n.CQ.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2:case n.CQ.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2:return.5;case n.CQ.COMPRESSED_RG11_EAC:case n.CQ.COMPRESSED_SIGNED_RG11_EAC:case n.CQ.COMPRESSED_RGBA8_ETC2_EAC:case n.CQ.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:return 1}return 0}},94656:(e,t,r)=>{r.d(t,{Y2:()=>c,en:()=>s});var i=r(49186),n=r(44208),o=r(53966);const a=!!(0,n.A)("enable-feature:webgl-debug");function s(){return a}function c(e){if(s()){const t=e.getError();if(t){const r=function(e,t){switch(t){case e.INVALID_ENUM:return"Invalid Enum. An unacceptable value has been specified for an enumerated argument.";case e.INVALID_VALUE:return"Invalid Value. A numeric argument is out of range.";case e.INVALID_OPERATION:return"Invalid Operation. The specified command is not allowed for the current state.";case e.INVALID_FRAMEBUFFER_OPERATION:return"Invalid Framebuffer operation. The currently bound framebuffer is not framebuffer complete when trying to render to or to read from it.";case e.OUT_OF_MEMORY:return"Out of memory. Not enough memory is left to execute the command.";case e.CONTEXT_LOST_WEBGL:return"WebGL context has been lost";default:return"Unknown error"}}(e,t),n=(new Error).stack;o.A.getLogger("esri.views.webgl.checkWebGLError").error(new i.A("webgl-error","WebGL error occurred",{message:r,stack:n}))}}}},28449:(e,t,r)=>{function i(e,t,r){for(let i=0;i<r;++i)t[2*i]=e[i],t[2*i+1]=e[i]-t[2*i]}function n(e,t){const r=e.length;for(let i=0;i<r;++i)a[0]=e[i],t[i]=a[0];return t}function o(e,t){const r=e.length;for(let i=0;i<r;++i)a[0]=e[i],a[1]=e[i]-a[0],t[i]=a[1];return t}r.d(t,{Zo:()=>n,jA:()=>o,jS:()=>i});const a=new Float32Array(2)},62298:(e,t,r)=>{r.d(t,{_:()=>n});var i=r(63907);function n(e){switch(e){case i.pe.BYTE:case i.pe.UNSIGNED_BYTE:return 1;case i.pe.SHORT:case i.pe.UNSIGNED_SHORT:case i.pe.HALF_FLOAT:return 2;case i.pe.FLOAT:case i.pe.INT:case i.pe.UNSIGNED_INT:return 4}}},90644:(e,t,r)=>{r.d(t,{Ey:()=>E,Ky:()=>c,Os:()=>s,Uy:()=>h,Xt:()=>u,kn:()=>m,p3:()=>a});var i=r(89192),n=r(63907);function o(e,t,r=n.Tb.ADD,i=[0,0,0,0]){return{srcRgb:e,srcAlpha:e,dstRgb:t,dstAlpha:t,opRgb:r,opAlpha:r,color:{r:i[0],g:i[1],b:i[2],a:i[3]}}}function a(e,t,r,i,o=n.Tb.ADD,a=n.Tb.ADD,s=[0,0,0,0]){return{srcRgb:e,srcAlpha:t,dstRgb:r,dstAlpha:i,opRgb:o,opAlpha:a,color:{r:s[0],g:s[1],b:s[2],a:s[3]}}}o(n.dn.ZERO,n.dn.ONE_MINUS_SRC_ALPHA),o(n.dn.ONE,n.dn.ZERO),o(n.dn.ONE,n.dn.ONE);const s=o(n.dn.ONE,n.dn.ONE_MINUS_SRC_ALPHA),c=a(n.dn.SRC_ALPHA,n.dn.ONE,n.dn.ONE_MINUS_SRC_ALPHA,n.dn.ONE_MINUS_SRC_ALPHA),l={face:n.Y7.BACK,mode:n.Ac.CCW},d={face:n.Y7.FRONT,mode:n.Ac.CCW},u=e=>e===i.s2.Back?l:e===i.s2.Front?d:null,h={zNear:0,zFar:1},m={r:!0,g:!0,b:!0,a:!0};function f(e){return C.intern(e)}function p(e){return w.intern(e)}function v(e){return O.intern(e)}function g(e){return y.intern(e)}function _(e){return L.intern(e)}function T(e){return H.intern(e)}function x(e){return B.intern(e)}function A(e){return G.intern(e)}function b(e){return V.intern(e)}function E(e){return j.intern(e)}class S{constructor(e,t){this._makeKey=e,this._makeRef=t,this._interns=new Map}intern(e){if(!e)return null;const t=this._makeKey(e),r=this._interns;return r.has(t)||r.set(t,this._makeRef(e)),r.get(t)??null}}function M(e){return"["+e.join(",")+"]"}const C=new S(R,(e=>({__tag:"Blending",...e})));function R(e){return e?M([e.srcRgb,e.srcAlpha,e.dstRgb,e.dstAlpha,e.opRgb,e.opAlpha,e.color.r,e.color.g,e.color.b,e.color.a]):null}const w=new S(I,(e=>({__tag:"Culling",...e})));function I(e){return e?M([e.face,e.mode]):null}const O=new S(N,(e=>({__tag:"PolygonOffset",...e})));function N(e){return e?M([e.factor,e.units]):null}const y=new S(P,(e=>({__tag:"DepthTest",...e})));function P(e){return e?M([e.func]):null}const L=new S(D,(e=>({__tag:"StencilTest",...e})));function D(e){return e?M([e.function.func,e.function.ref,e.function.mask,e.operation.fail,e.operation.zFail,e.operation.zPass]):null}const H=new S(F,(e=>({__tag:"DepthWrite",...e})));function F(e){return e?M([e.zNear,e.zFar]):null}const B=new S(U,(e=>({__tag:"ColorWrite",...e})));function U(e){return e?M([e.r,e.g,e.b,e.a]):null}const G=new S(z,(e=>({__tag:"StencilWrite",...e})));function z(e){return e?M([e.mask]):null}const V=new S(W,(e=>({__tag:"DrawBuffers",...e})));function W(e){return e?M(e.buffers):null}const j=new S((function(e){return e?M([R(e.blending),I(e.culling),N(e.polygonOffset),P(e.depthTest),D(e.stencilTest),F(e.depthWrite),U(e.colorWrite),z(e.stencilWrite),W(e.drawBuffers)]):null}),(e=>({blending:f(e.blending),culling:p(e.culling),polygonOffset:v(e.polygonOffset),depthTest:g(e.depthTest),stencilTest:_(e.stencilTest),depthWrite:T(e.depthWrite),colorWrite:x(e.colorWrite),stencilWrite:A(e.stencilWrite),drawBuffers:b(e.drawBuffers)})))},49788:(e,t,r)=>{r.d(t,{Q:()=>i});const i=1/255.5}}]);