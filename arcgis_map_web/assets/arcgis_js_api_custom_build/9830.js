(self.webpackChunkarcgis_webpack01=self.webpackChunkarcgis_webpack01||[]).push([[9830],{10510:(e,t,r)=>{"use strict";r.d(t,{D:()=>D,b:()=>F});var i=r(33834),n=r(62213),o=r(51219),a=r(61514),s=r(4071),c=r(8681),l=r(34658),u=r(17811),d=r(88214),f=r(71613),h=r(31777),m=r(87023),p=r(84530),g=r(82094),v=r(44624),b=r(7261),x=r(74681),y=r(6838),_=r(31163),w=r(11823),T=r(34074),S=r(20829),C=r(10832),M=r(72582),A=r(72884),P=r(52369),O=r(62734),I=r(50230);function F(e){const t=new o.kG,r=t.vertex.code,F=t.fragment.code;return t.include(O.a,{name:"Default Material Shader",output:e.output}),t.vertex.uniforms.add("proj","mat4").add("view","mat4").add("camPos","vec3").add("localOrigin","vec3"),t.include(y.f),t.varyings.add("vpos","vec3"),t.include(c.k,e),t.include(p.f,e),t.include(u.L,e),0!==e.output&&7!==e.output||(t.include(x.O,e),t.include(n.w,{linearDepth:!1}),0===e.normalType&&e.offsetBackfaces&&t.include(b.w),t.include(C.Q,e),t.include(T.B,e),e.instancedColor&&t.attributes.add("instanceColor","vec4"),t.varyings.add("localvpos","vec3"),t.include(g.D,e),t.include(h.q,e),t.include(_.R,e),t.include(w.c,e),t.vertex.uniforms.add("externalColor","vec4"),t.varyings.add("vcolorExt","vec4"),e.multipassTerrainEnabled&&t.varyings.add("depth","float"),r.add(i.H`
      void main(void) {
        forwardNormalizedVertexColor();
        vcolorExt = externalColor;
        ${e.instancedColor?"vcolorExt *= instanceColor;":""}
        vcolorExt *= vvColor();
        vcolorExt *= getSymbolColor();
        forwardColorMixMode();

        if (vcolorExt.a < ${i.H.float(l.bf)}) {
          gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
        }
        else {
          vpos = calculateVPos();
          localvpos = vpos - view[3].xyz;
          vpos = subtractOrigin(vpos);
          ${0===e.normalType?i.H`
          vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`:""}
          vpos = addVerticalOffset(vpos, localOrigin);
          ${e.vertexTangets?"vTangent = dpTransformVertexTangent(tangent);":""}
          gl_Position = transformPosition(proj, view, vpos);
          ${0===e.normalType&&e.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, camPos);":""}
        }

        ${e.multipassTerrainEnabled?"depth = (view * vec4(vpos, 1.0)).z;":""}
        forwardLinearDepth();
        forwardTextureCoordinates();
      }
    `)),7===e.output&&(t.include(a.p,e),t.include(l.sj,e),e.multipassTerrainEnabled&&(t.fragment.include(s.S),t.include(d.l,e)),t.fragment.uniforms.add("camPos","vec3").add("localOrigin","vec3").add("opacity","float").add("layerOpacity","float"),e.hasColorTexture&&t.fragment.uniforms.add("tex","sampler2D"),t.fragment.include(I.y),F.add(i.H`
      void main() {
        discardBySlice(vpos);
        ${e.multipassTerrainEnabled?"terrainDepthTest(gl_FragCoord, depth);":""}
        ${e.hasColorTexture?i.H`
        vec4 texColor = texture2D(tex, vuv0);
        ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
        discardOrAdjustAlpha(texColor);`:i.H`vec4 texColor = vec4(1.0);`}
        ${e.attributeColor?i.H`
        float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i.H`
        float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));
        `}
        gl_FragColor = vec4(opacity_);
      }
    `)),0===e.output&&(t.include(a.p,e),t.include(A.X,e),t.include(M.K,e),t.include(l.sj,e),e.receiveShadows&&t.include(f.h,e),e.multipassTerrainEnabled&&(t.fragment.include(s.S),t.include(d.l,e)),t.fragment.uniforms.add("camPos","vec3").add("localOrigin","vec3").add("ambient","vec3").add("diffuse","vec3").add("opacity","float").add("layerOpacity","float"),e.hasColorTexture&&t.fragment.uniforms.add("tex","sampler2D"),t.include(v.j,e),t.include(m.T,e),t.fragment.include(I.y),t.include(P.k,e),F.add(i.H`
      void main() {
        discardBySlice(vpos);
        ${e.multipassTerrainEnabled?"terrainDepthTest(gl_FragCoord, depth);":""}
        ${e.hasColorTexture?i.H`
        vec4 texColor = texture2D(tex, vuv0);
        ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
        discardOrAdjustAlpha(texColor);`:i.H`vec4 texColor = vec4(1.0);`}
        shadingParams.viewDirection = normalize(vpos - camPos);
        ${3===e.normalType?i.H`
        vec3 normal = screenDerivativeNormal(localvpos);`:i.H`
        shadingParams.normalView = vNormalWorld;
        vec3 normal = shadingNormal(shadingParams);`}
        ${1===e.pbrMode?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        float additionalAmbientScale = _oldHeuristicLighting(vpos + localOrigin);
        vec3 additionalLight = ssao * lightingMainIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        ${e.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":1===e.viewingMode?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
        vec3 matColor = max(ambient, diffuse);
        ${e.attributeColor?i.H`
        vec3 albedo_ = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
        float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i.H`
        vec3 albedo_ = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
        float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));
        `}
        ${e.hasNormalTexture?i.H`
              mat3 tangentSpace = ${e.vertexTangets?"computeTangentSpace(normal);":"computeTangentSpace(normal, vpos, vuv0);"}
              vec3 shadedNormal = computeTextureNormal(tangentSpace, vuv0);`:"vec3 shadedNormal = normal;"}
        ${1===e.pbrMode||2===e.pbrMode?1===e.viewingMode?i.H`vec3 normalGround = normalize(vpos + localOrigin);`:i.H`vec3 normalGround = vec3(0.0, 0.0, 1.0);`:i.H``}
        ${1===e.pbrMode||2===e.pbrMode?i.H`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * lightingMainIntensity[2];
            vec3 shadedColor = evaluateSceneLightingPBR(shadedNormal, albedo_, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:"vec3 shadedColor = evaluateSceneLighting(shadedNormal, albedo_, shadow, 1.0 - ssao, additionalLight);"}
        gl_FragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${e.OITEnabled?"gl_FragColor = premultiplyAlpha(gl_FragColor);":""}
      }
    `)),t.include(S.s,e),t}var D=Object.freeze({__proto__:null,build:F})},79733:(e,t,r)=>{"use strict";r.d(t,{R:()=>P,b:()=>A});var i=r(33834),n=r(62213),o=r(51219),a=r(61514),s=r(4071),c=r(8681),l=r(34658),u=r(17811),d=r(88214),f=r(71613),h=r(31777),m=r(87023),p=r(84530),g=r(82094),v=r(44624),b=r(7261),x=r(74681),y=r(6838),_=r(31163),w=r(11823),T=r(20829),S=r(72582),C=r(72884),M=r(50230);function A(e){const t=new o.kG,r=t.vertex.code,A=t.fragment.code;return t.vertex.uniforms.add("proj","mat4").add("view","mat4").add("camPos","vec3").add("localOrigin","vec3"),t.include(y.f),t.varyings.add("vpos","vec3"),t.include(c.k,e),t.include(p.f,e),t.include(u.L,e),0!==e.output&&7!==e.output||(t.include(x.O,e),t.include(n.w,{linearDepth:!1}),e.offsetBackfaces&&t.include(b.w),e.instancedColor&&t.attributes.add("instanceColor","vec4"),t.varyings.add("vNormalWorld","vec3"),t.varyings.add("localvpos","vec3"),e.multipassTerrainEnabled&&t.varyings.add("depth","float"),t.include(g.D,e),t.include(h.q,e),t.include(_.R,e),t.include(w.c,e),t.vertex.uniforms.add("externalColor","vec4"),t.varyings.add("vcolorExt","vec4"),r.add(i.H`
        void main(void) {
          forwardNormalizedVertexColor();
          vcolorExt = externalColor;
          ${e.instancedColor?"vcolorExt *= instanceColor;":""}
          vcolorExt *= vvColor();
          vcolorExt *= getSymbolColor();
          forwardColorMixMode();

          if (vcolorExt.a < ${i.H.float(l.bf)}) {
            gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
          }
          else {
            vpos = calculateVPos();
            localvpos = vpos - view[3].xyz;
            vpos = subtractOrigin(vpos);
            vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
            vpos = addVerticalOffset(vpos, localOrigin);
            gl_Position = transformPosition(proj, view, vpos);
            ${e.offsetBackfaces?"gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, camPos);":""}
          }
          ${e.multipassTerrainEnabled?i.H`depth = (view * vec4(vpos, 1.0)).z;`:""}
          forwardLinearDepth();
          forwardTextureCoordinates();
        }
      `)),7===e.output&&(t.include(a.p,e),t.include(l.sj,e),e.multipassTerrainEnabled&&(t.fragment.include(s.S),t.include(d.l,e)),t.fragment.uniforms.add("camPos","vec3").add("localOrigin","vec3").add("opacity","float").add("layerOpacity","float"),t.fragment.uniforms.add("view","mat4"),e.hasColorTexture&&t.fragment.uniforms.add("tex","sampler2D"),t.fragment.include(M.y),A.add(i.H`
      void main() {
        discardBySlice(vpos);
        ${e.multipassTerrainEnabled?i.H`terrainDepthTest(gl_FragCoord, depth);`:""}
        ${e.hasColorTexture?i.H`
        vec4 texColor = texture2D(tex, vuv0);
        ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
        discardOrAdjustAlpha(texColor);`:i.H`vec4 texColor = vec4(1.0);`}
        ${e.attributeColor?i.H`
        float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i.H`
        float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));
        `}

        gl_FragColor = vec4(opacity_);
      }
    `)),0===e.output&&(t.include(a.p,e),t.include(C.X,e),t.include(S.K,e),t.include(l.sj,e),e.receiveShadows&&t.include(f.h,e),e.multipassTerrainEnabled&&(t.fragment.include(s.S),t.include(d.l,e)),t.fragment.uniforms.add("camPos","vec3").add("localOrigin","vec3").add("ambient","vec3").add("diffuse","vec3").add("opacity","float").add("layerOpacity","float"),t.fragment.uniforms.add("view","mat4"),e.hasColorTexture&&t.fragment.uniforms.add("tex","sampler2D"),t.include(v.j,e),t.include(m.T,e),t.fragment.include(M.y),A.add(i.H`
      void main() {
        discardBySlice(vpos);
        ${e.multipassTerrainEnabled?i.H`terrainDepthTest(gl_FragCoord, depth);`:""}
        ${e.hasColorTexture?i.H`
        vec4 texColor = texture2D(tex, vuv0);
        ${e.textureAlphaPremultiplied?"texColor.rgb /= texColor.a;":""}
        discardOrAdjustAlpha(texColor);`:i.H`vec4 texColor = vec4(1.0);`}
        vec3 viewDirection = normalize(vpos - camPos);
        ${1===e.pbrMode?"applyPBRFactors();":""}
        float ssao = evaluateAmbientOcclusionInverse();
        ssao *= getBakedOcclusion();

        float additionalAmbientScale = _oldHeuristicLighting(vpos + localOrigin);
        vec3 additionalLight = ssao * lightingMainIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        ${e.receiveShadows?"float shadow = readShadowMap(vpos, linearDepth);":1===e.viewingMode?"float shadow = lightingGlobalFactor * (1.0 - additionalAmbientScale);":"float shadow = 0.0;"}
        vec3 matColor = max(ambient, diffuse);
        ${e.attributeColor?i.H`
        vec3 albedo_ = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
        float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, int(colorMixMode));`:i.H`
        vec3 albedo_ = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, int(colorMixMode));
        float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, int(colorMixMode));
        `}
        ${i.H`
        vec3 shadedNormal = normalize(vNormalWorld);
        albedo_ *= 1.2;
        vec3 viewForward = - vec3(view[0][2], view[1][2], view[2][2]);
        float alignmentLightView = clamp(dot(-viewForward, lightingMainDirection), 0.0, 1.0);
        float transmittance = 1.0 - clamp(dot(-viewForward, shadedNormal), 0.0, 1.0);
        float treeRadialFalloff = vColor.r;
        float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
        additionalLight += backLightFactor * lightingMainIntensity;`}
        ${1===e.pbrMode||2===e.pbrMode?1===e.viewingMode?i.H`vec3 normalGround = normalize(vpos + localOrigin);`:i.H`vec3 normalGround = vec3(0.0, 0.0, 1.0);`:i.H``}
        ${1===e.pbrMode||2===e.pbrMode?i.H`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * lightingMainIntensity[2];
            vec3 shadedColor = evaluateSceneLightingPBR(shadedNormal, albedo_, shadow, 1.0 - ssao, additionalLight, viewDirection, normalGround, mrr, emission, additionalAmbientIrradiance);`:"vec3 shadedColor = evaluateSceneLighting(shadedNormal, albedo_, shadow, 1.0 - ssao, additionalLight);"}
        gl_FragColor = highlightSlice(vec4(shadedColor, opacity_), vpos);
        ${e.OITEnabled?"gl_FragColor = premultiplyAlpha(gl_FragColor);":""}
      }
    `)),t.include(T.s,e),t}var P=Object.freeze({__proto__:null,build:A})},30663:(e,t,r)=>{"use strict";function i(){return[1,0,0,0,1,0,0,0,1]}function n(e,t){return new Float64Array(e,t,9)}r.d(t,{a:()=>i,c:()=>n}),Object.freeze({__proto__:null,create:i,clone:function(e){return[e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8]]},fromValues:function(e,t,r,i,n,o,a,s,c){return[e,t,r,i,n,o,a,s,c]},createView:n})},6897:(e,t,r)=>{"use strict";function i(){const e=new Float32Array(16);return e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}r.d(t,{c:()=>i});const n=i();Object.freeze({__proto__:null,create:i,clone:function(e){const t=new Float32Array(16);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},fromValues:function(e,t,r,i,n,o,a,s,c,l,u,d,f,h,m,p){const g=new Float32Array(16);return g[0]=e,g[1]=t,g[2]=r,g[3]=i,g[4]=n,g[5]=o,g[6]=a,g[7]=s,g[8]=c,g[9]=l,g[10]=u,g[11]=d,g[12]=f,g[13]=h,g[14]=m,g[15]=p,g},createView:function(e,t){return new Float32Array(e,t,16)},IDENTITY:n})},12811:(e,t,r)=>{"use strict";function i(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}function n(e){return[e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15]]}function o(e,t){return new Float64Array(e,t,16)}r.d(t,{a:()=>i,b:()=>n,c:()=>o});Object.freeze({__proto__:null,create:i,clone:n,fromValues:function(e,t,r,i,n,o,a,s,c,l,u,d,f,h,m,p){return[e,t,r,i,n,o,a,s,c,l,u,d,f,h,m,p]},createView:o,IDENTITY:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]})},2847:(e,t,r)=>{"use strict";r.d(t,{c:()=>h,g:()=>u});var i=r(77625),n=r(60418),o=r(17387),a=r(30663),s=r(32232),c=r(34353);function l(e,t,r){r*=.5;const i=Math.sin(r);return e[0]=i*t[0],e[1]=i*t[1],e[2]=i*t[2],e[3]=Math.cos(r),e}function u(e,t){const r=2*Math.acos(t[3]),i=Math.sin(r/2);return i>n.E?(e[0]=t[0]/i,e[1]=t[1]/i,e[2]=t[2]/i):(e[0]=1,e[1]=0,e[2]=0),r}function d(e,t,r){const i=t[0],n=t[1],o=t[2],a=t[3],s=r[0],c=r[1],l=r[2],u=r[3];return e[0]=i*u+a*s+n*l-o*c,e[1]=n*u+a*c+o*s-i*l,e[2]=o*u+a*l+i*c-n*s,e[3]=a*u-i*s-n*c-o*l,e}function f(e,t,r,i){const o=t[0],a=t[1],s=t[2],c=t[3];let l,u,d,f,h,m=r[0],p=r[1],g=r[2],v=r[3];return u=o*m+a*p+s*g+c*v,u<0&&(u=-u,m=-m,p=-p,g=-g,v=-v),1-u>n.E?(l=Math.acos(u),d=Math.sin(l),f=Math.sin((1-i)*l)/d,h=Math.sin(i*l)/d):(f=1-i,h=i),e[0]=f*o+h*m,e[1]=f*a+h*p,e[2]=f*s+h*g,e[3]=f*c+h*v,e}function h(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=t[3],e}function m(e,t){const r=t[0]+t[4]+t[8];let i;if(r>0)i=Math.sqrt(r+1),e[3]=.5*i,i=.5/i,e[0]=(t[5]-t[7])*i,e[1]=(t[6]-t[2])*i,e[2]=(t[1]-t[3])*i;else{let r=0;t[4]>t[0]&&(r=1),t[8]>t[3*r+r]&&(r=2);const n=(r+1)%3,o=(r+2)%3;i=Math.sqrt(t[3*r+r]-t[3*n+n]-t[3*o+o]+1),e[r]=.5*i,i=.5/i,e[3]=(t[3*n+o]-t[3*o+n])*i,e[n]=(t[3*n+r]+t[3*r+n])*i,e[o]=(t[3*o+r]+t[3*r+o])*i}return e}const p=c.c,g=c.s,v=c.a,b=d,x=c.b,y=c.d,_=c.l,w=c.e,T=w,S=c.f,C=S,M=c.n,A=c.g,P=c.h,O=(0,i.c)(),I=(0,i.f)(1,0,0),F=(0,i.f)(0,1,0),D=(0,s.a)(),L=(0,s.a)(),R=(0,a.a)();Object.freeze({__proto__:null,identity:function(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e},setAxisAngle:l,getAxisAngle:u,multiply:d,rotateX:function(e,t,r){r*=.5;const i=t[0],n=t[1],o=t[2],a=t[3],s=Math.sin(r),c=Math.cos(r);return e[0]=i*c+a*s,e[1]=n*c+o*s,e[2]=o*c-n*s,e[3]=a*c-i*s,e},rotateY:function(e,t,r){r*=.5;const i=t[0],n=t[1],o=t[2],a=t[3],s=Math.sin(r),c=Math.cos(r);return e[0]=i*c-o*s,e[1]=n*c+a*s,e[2]=o*c+i*s,e[3]=a*c-n*s,e},rotateZ:function(e,t,r){r*=.5;const i=t[0],n=t[1],o=t[2],a=t[3],s=Math.sin(r),c=Math.cos(r);return e[0]=i*c+n*s,e[1]=n*c-i*s,e[2]=o*c+a*s,e[3]=a*c-o*s,e},calculateW:function(e,t){const r=t[0],i=t[1],n=t[2];return e[0]=r,e[1]=i,e[2]=n,e[3]=Math.sqrt(Math.abs(1-r*r-i*i-n*n)),e},slerp:f,random:function(e){const t=(0,n.R)(),r=(0,n.R)(),i=(0,n.R)(),o=Math.sqrt(1-t),a=Math.sqrt(t);return e[0]=o*Math.sin(2*Math.PI*r),e[1]=o*Math.cos(2*Math.PI*r),e[2]=a*Math.sin(2*Math.PI*i),e[3]=a*Math.cos(2*Math.PI*i),e},invert:function(e,t){const r=t[0],i=t[1],n=t[2],o=t[3],a=r*r+i*i+n*n+o*o,s=a?1/a:0;return e[0]=-r*s,e[1]=-i*s,e[2]=-n*s,e[3]=o*s,e},conjugate:h,fromMat3:m,fromEuler:function(e,t,r,i){const n=.5*Math.PI/180;t*=n,r*=n,i*=n;const o=Math.sin(t),a=Math.cos(t),s=Math.sin(r),c=Math.cos(r),l=Math.sin(i),u=Math.cos(i);return e[0]=o*c*u-a*s*l,e[1]=a*s*u+o*c*l,e[2]=a*c*l-o*s*u,e[3]=a*c*u+o*s*l,e},str:function(e){return"quat("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"},copy:p,set:g,add:v,mul:b,scale:x,dot:y,lerp:_,length:w,len:T,squaredLength:S,sqrLen:C,normalize:M,exactEquals:A,equals:P,rotationTo:function(e,t,r){const i=(0,o.d)(t,r);return i<-.999999?((0,o.c)(O,I,t),(0,o.j)(O)<1e-6&&(0,o.c)(O,F,t),(0,o.n)(O,O),l(e,O,Math.PI),e):i>.999999?(e[0]=0,e[1]=0,e[2]=0,e[3]=1,e):((0,o.c)(O,t,r),e[0]=O[0],e[1]=O[1],e[2]=O[2],e[3]=1+i,M(e,e))},sqlerp:function(e,t,r,i,n,o){return f(D,t,n,o),f(L,r,i,o),f(e,D,L,2*o*(1-o)),e},setAxes:function(e,t,r,i){const n=R;return n[0]=r[0],n[3]=r[1],n[6]=r[2],n[1]=i[0],n[4]=i[1],n[7]=i[2],n[2]=-t[0],n[5]=-t[1],n[8]=-t[2],M(e,m(e,n))}})},32232:(e,t,r)=>{"use strict";function i(){return[0,0,0,1]}function n(e,t){return new Float64Array(e,t,4)}r.d(t,{a:()=>i,c:()=>n});Object.freeze({__proto__:null,create:i,clone:function(e){return[e[0],e[1],e[2],e[3]]},fromValues:function(e,t,r,i){return[e,t,r,i]},createView:n,IDENTITY:[0,0,0,1]})},69236:(e,t,r)=>{"use strict";function i(){return new Float32Array(3)}function n(e,t,r){const i=new Float32Array(3);return i[0]=e,i[1]=t,i[2]=r,i}function o(){return i()}function a(){return n(1,1,1)}function s(){return n(1,0,0)}function c(){return n(0,1,0)}function l(){return n(0,0,1)}r.d(t,{c:()=>i,f:()=>n});const u=o(),d=a(),f=s(),h=c(),m=l();Object.freeze({__proto__:null,create:i,clone:function(e){const t=new Float32Array(3);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t},fromValues:n,createView:function(e,t){return new Float32Array(e,t,3)},zeros:o,ones:a,unitX:s,unitY:c,unitZ:l,ZEROS:u,ONES:d,UNIT_X:f,UNIT_Y:h,UNIT_Z:m})},41419:(e,t,r)=>{"use strict";r.d(t,{t:()=>n});var i=r(36654);async function n(e,t){const{data:r}=await(0,i.default)(e,{responseType:"image",...t});return r}},29830:(e,t,r)=>{"use strict";r.r(t),r.d(t,{fetch:()=>Rn,gltfToEngineResources:()=>Bn,parseUrl:()=>zn});var i=r(59472),n=r(77625),o=r(17387),a=r(67128),s=r(37969),c=r(30663),l=r(12811),u=r(98501),d=r(12608),f=r(36544);const h=f.Z.getLogger("esri.views.3d.support.buffer.math");function m(e,t,r){if(e.count!==t.count)return void h.error("source and destination buffers need to have the same number of elements");const i=e.count,n=r[0],o=r[1],a=r[2],s=r[4],c=r[5],l=r[6],u=r[8],d=r[9],f=r[10],m=r[12],p=r[13],g=r[14],v=e.typedBuffer,b=e.typedBufferStride,x=t.typedBuffer,y=t.typedBufferStride;for(let e=0;e<i;e++){const t=e*b,r=e*y,i=x[r],h=x[r+1],_=x[r+2];v[t]=n*i+s*h+u*_+m,v[t+1]=o*i+c*h+d*_+p,v[t+2]=a*i+l*h+f*_+g}}function p(e,t,r){if(e.count!==t.count)return void h.error("source and destination buffers need to have the same number of elements");const i=e.count,n=r[0],o=r[1],a=r[2],s=r[3],c=r[4],l=r[5],u=r[6],d=r[7],f=r[8],m=e.typedBuffer,p=e.typedBufferStride,g=t.typedBuffer,v=t.typedBufferStride;for(let e=0;e<i;e++){const t=e*p,r=e*v,i=g[r],h=g[r+1],b=g[r+2];m[t]=n*i+s*h+u*b,m[t+1]=o*i+c*h+d*b,m[t+2]=a*i+l*h+f*b}}function g(e,t,r){const i=Math.min(e.count,t.count),n=e.typedBuffer,o=e.typedBufferStride,a=t.typedBuffer,s=t.typedBufferStride;for(let e=0;e<i;e++){const t=e*o,i=e*s;n[t]=r*a[i],n[t+1]=r*a[i+1],n[t+2]=r*a[i+2]}}Object.freeze({__proto__:null,transformMat4:m,transformMat3:p,scale:g,shiftRight:function(e,t,r){const i=Math.min(e.count,t.count),n=e.typedBuffer,o=e.typedBufferStride,a=t.typedBuffer,s=t.typedBufferStride;for(let e=0;e<i;e++){const t=e*o,i=e*s;n[t]=a[i]>>r,n[t+1]=a[i+1]>>r,n[t+2]=a[i+2]>>r}}});var v=r(69996),b=r(56469),x=r(62698);class y{constructor(e,t,r,i){this.primitiveIndices=e,this._numIndexPerPrimitive=t,this.indices=r,this.position=i,this.center=(0,n.c)(),(0,b.hu)(e.length>=1),(0,b.hu)(r.length%this._numIndexPerPrimitive==0),(0,b.hu)(r.length>=e.length*this._numIndexPerPrimitive),(0,b.hu)(3===i.size||4===i.size);const{data:a,size:s}=i,c=e.length;let l=s*r[this._numIndexPerPrimitive*e[0]];_.clear(),_.push(l),this.bbMin=(0,n.f)(a[l],a[l+1],a[l+2]),this.bbMax=(0,n.b)(this.bbMin);for(let t=0;t<c;++t){const i=this._numIndexPerPrimitive*e[t];for(let e=0;e<this._numIndexPerPrimitive;++e){l=s*r[i+e],_.push(l);let t=a[l];this.bbMin[0]=Math.min(t,this.bbMin[0]),this.bbMax[0]=Math.max(t,this.bbMax[0]),t=a[l+1],this.bbMin[1]=Math.min(t,this.bbMin[1]),this.bbMax[1]=Math.max(t,this.bbMax[1]),t=a[l+2],this.bbMin[2]=Math.min(t,this.bbMin[2]),this.bbMax[2]=Math.max(t,this.bbMax[2])}}(0,o.e)(this.center,this.bbMin,this.bbMax,.5),this.radius=.5*Math.max(Math.max(this.bbMax[0]-this.bbMin[0],this.bbMax[1]-this.bbMin[1]),this.bbMax[2]-this.bbMin[2]);let u=this.radius*this.radius;for(let e=0;e<_.length;++e){l=_.getItemAt(e);const t=a[l]-this.center[0],r=a[l+1]-this.center[1],i=a[l+2]-this.center[2],n=t*t+r*r+i*i;if(n<=u)continue;const o=Math.sqrt(n),s=.5*(o-this.radius);this.radius=this.radius+s,u=this.radius*this.radius;const c=s/o;this.center[0]+=t*c,this.center[1]+=r*c,this.center[2]+=i*c}_.clear()}getCenter(){return this.center}getBSRadius(){return this.radius}getBBMin(){return this.bbMin}getBBMax(){return this.bbMax}getChildren(){if(this._children)return this._children;if((0,o.h)(this.bbMin,this.bbMax)>1){const e=(0,o.e)((0,n.c)(),this.bbMin,this.bbMax,.5),t=this.primitiveIndices.length,r=new Uint8Array(t),i=new Array(8);for(let e=0;e<8;++e)i[e]=0;const{data:a,size:s}=this.position;for(let n=0;n<t;++n){let t=0;const o=this._numIndexPerPrimitive*this.primitiveIndices[n];let c=s*this.indices[o],l=a[c],u=a[c+1],d=a[c+2];for(let e=1;e<this._numIndexPerPrimitive;++e){c=s*this.indices[o+e];const t=a[c],r=a[c+1],i=a[c+2];t<l&&(l=t),r<u&&(u=r),i<d&&(d=i)}l<e[0]&&(t|=1),u<e[1]&&(t|=2),d<e[2]&&(t|=4),r[n]=t,++i[t]}let c=0;for(let e=0;e<8;++e)i[e]>0&&++c;if(c<2)return;const l=new Array(8);for(let e=0;e<8;++e)l[e]=i[e]>0?new Uint32Array(i[e]):void 0;for(let e=0;e<8;++e)i[e]=0;for(let e=0;e<t;++e){const t=r[e];l[t][i[t]++]=this.primitiveIndices[e]}this._children=new Array(8);for(let e=0;e<8;++e)void 0!==l[e]&&(this._children[e]=new y(l[e],this._numIndexPerPrimitive,this.indices,this.position))}return this._children}static prune(){_.prune()}}const _=new x.Z({deallocator:null});var w=r(32366);class T{constructor(){this.id=(0,w.D)()}unload(){}}var S=r(33469);class C{constructor(e){this.allocator=e,this.items=[],this.itemsPtr=0,this.tickHandle=S.Z.before((()=>this.reset())),this.grow()}destroy(){this.tickHandle&&(this.tickHandle.remove(),this.tickHandle=(0,i.Bd)(this.tickHandle)),this.items=(0,i.Bd)(this.items)}get(){return 0===this.itemsPtr&&(0,S.Z)((()=>{})),this.itemsPtr===this.items.length&&this.grow(),this.items[this.itemsPtr++]}reset(){const e=Math.min(3*Math.max(8,this.itemsPtr),this.itemsPtr+3*M);this.items.length=Math.min(e,this.items.length),this.itemsPtr=0}grow(){for(let e=0;e<Math.max(8,Math.min(this.items.length,M));e++)this.items.push(this.allocator())}}const M=1024;var A=r(14286),P=r(32232),O=r(55735),I=r(38256);class F{constructor(e,t,r){this.itemByteSize=e,this.itemCreate=t,this.buffers=[],this.items=[],this.itemsPerBuffer=0,this.itemsPtr=0,this.itemsPerBuffer=Math.ceil(r/this.itemByteSize),this.tickHandle=S.Z.before((()=>this.reset()))}destroy(){this.tickHandle&&(this.tickHandle.remove(),this.tickHandle=(0,i.Bd)(this.tickHandle)),this.itemsPtr=0,this.items=(0,i.Bd)(this.items),this.buffers=(0,i.Bd)(this.buffers)}get(){0===this.itemsPtr&&(0,S.Z)((()=>{}));const e=Math.floor(this.itemsPtr/this.itemsPerBuffer);for(;this.buffers.length<=e;){const e=new ArrayBuffer(this.itemsPerBuffer*this.itemByteSize);for(let t=0;t<this.itemsPerBuffer;++t)this.items.push(this.itemCreate(e,t*this.itemByteSize));this.buffers.push(e)}return this.items[this.itemsPtr++]}reset(){const e=2*(Math.floor(this.itemsPtr/this.itemsPerBuffer)+1);for(;this.buffers.length>e;)this.buffers.pop(),this.items.length=this.buffers.length*this.itemsPerBuffer;this.itemsPtr=0}static createVec2f64(e=D){return new F(16,O.c,e)}static createVec3f64(e=D){return new F(24,n.a,e)}static createVec4f64(e=D){return new F(32,I.c,e)}static createMat3f64(e=D){return new F(72,c.c,e)}static createMat4f64(e=D){return new F(128,l.c,e)}static createQuatf64(e=D){return new F(32,P.c,e)}get test(){return{size:this.buffers.length*this.itemsPerBuffer*this.itemByteSize}}}const D=4096,L=(F.createVec2f64(),F.createVec3f64()),R=F.createVec4f64(),z=(F.createMat3f64(),F.createMat4f64());F.createQuatf64();var B=r(33655);function H(e){return e?{origin:(0,n.b)(e.origin),vector:(0,n.b)(e.vector)}:{origin:(0,n.c)(),vector:(0,n.c)()}}function E(e,t){const r=W.get();return r.origin=e,r.vector=t,r}function U(e,t,r=H()){return(0,o.g)(r.origin,e),(0,o.g)(r.vector,t),r}function N(e,t){const r=(0,o.f)(L.get(),t,e.origin),i=(0,o.d)(e.vector,r),n=(0,o.d)(e.vector,e.vector),a=(0,B.uZ)(i/n,0,1),s=(0,o.f)(L.get(),(0,o.a)(L.get(),e.vector,a),r);return(0,o.d)(s,s)}function V(e,t,r,i,n){const{vector:a,origin:s}=e,c=(0,o.f)(L.get(),t,s),l=(0,o.d)(a,c)/(0,o.o)(a);return(0,o.a)(n,a,(0,B.uZ)(l,r,i)),(0,o.b)(n,n,e.origin)}function k(e,t,r,i){const n=1e-6,a=e.origin,s=(0,o.b)(L.get(),a,e.vector),c=t.origin,l=(0,o.b)(L.get(),c,t.vector),u=L.get(),d=L.get();if(u[0]=a[0]-c[0],u[1]=a[1]-c[1],u[2]=a[2]-c[2],d[0]=l[0]-c[0],d[1]=l[1]-c[1],d[2]=l[2]-c[2],Math.abs(d[0])<n&&Math.abs(d[1])<n&&Math.abs(d[2])<n)return!1;const f=L.get();if(f[0]=s[0]-a[0],f[1]=s[1]-a[1],f[2]=s[2]-a[2],Math.abs(f[0])<n&&Math.abs(f[1])<n&&Math.abs(f[2])<n)return!1;const h=u[0]*d[0]+u[1]*d[1]+u[2]*d[2],m=d[0]*f[0]+d[1]*f[1]+d[2]*f[2],p=u[0]*f[0]+u[1]*f[1]+u[2]*f[2],g=d[0]*d[0]+d[1]*d[1]+d[2]*d[2],v=(f[0]*f[0]+f[1]*f[1]+f[2]*f[2])*g-m*m;if(Math.abs(v)<n)return!1;let b=(h*m-p*g)/v,x=(h+m*b)/g;r&&(b=(0,B.uZ)(b,0,1),x=(0,B.uZ)(x,0,1));const y=L.get(),_=L.get();return y[0]=a[0]+b*f[0],y[1]=a[1]+b*f[1],y[2]=a[2]+b*f[2],_[0]=c[0]+x*d[0],_[1]=c[1]+x*d[1],_[2]=c[2]+x*d[2],i.tA=b,i.tB=x,i.pA=y,i.pB=_,i.distance2=(0,o.h)(y,_),!0}const G={tA:0,tB:0,pA:(0,n.c)(),pB:(0,n.c)(),distance2:0},W=new C((()=>({origin:null,vector:null})));function q(e){return e?{p0:(0,n.b)(e.p0),p1:(0,n.b)(e.p1),p2:(0,n.b)(e.p2)}:{p0:(0,n.c)(),p1:(0,n.c)(),p2:(0,n.c)()}}function j(e,t,r,i=q()){return(0,o.g)(i.p0,e),(0,o.g)(i.p1,t),(0,o.g)(i.p2,r),i}function $(e,t,r){const i=(0,A.i)(e,t),n=(0,A.i)(t,r),o=(0,A.i)(r,e),a=(i+n+o)/2,s=a*(a-i)*(a-n)*(a-o);return s<=0?0:Math.sqrt(s)}function Z(e,t,r){return(0,o.f)(Y,t,e),(0,o.f)(Q,r,e),(0,o.l)((0,o.c)(Y,Y,Q))/2}Object.freeze({__proto__:null,create:H,wrap:E,copy:function(e,t=H()){return U(e.origin,e.vector,t)},fromValues:U,fromPoints:function(e,t,r=H()){return(0,o.g)(r.origin,e),(0,o.f)(r.vector,t,e),r},distance2:N,distance:function(e,t){return Math.sqrt(N(e,t))},projectPoint:function(e,t,r){return V(e,t,0,1,r)},pointAt:function(e,t,r){return(0,o.b)(r,e.origin,(0,o.a)(r,e.vector,t))},projectPointClamp:V,closestRayDistance2:function(e,t){if(k(e,E(t.origin,t.direction),!1,G)){const{tA:t,pB:r,distance2:i}=G;if(t>=0&&t<=1)return i;if(t<0)return(0,o.h)(e.origin,r);if(t>1)return(0,o.h)((0,o.b)(L.get(),e.origin,e.vector),r)}return null},closestLineSegmentPoint:function(e,t,r){return!!k(e,t,!0,G)&&((0,o.g)(r,G.pA),!0)},closestLineSegmentDistance2:function(e,t){return k(e,t,!0,G)?G.distance2:null}});const X=new C(H),K=new C((()=>({p0:null,p1:null,p2:null}))),Y=(0,n.c)(),Q=(0,n.c)();Object.freeze({__proto__:null,create:q,wrap:function(e,t,r){const i=K.get();return i.p0=e,i.p1=t,i.p2=r,i},copy:function(e,t=q()){return j(e.p0,e.p1,e.p2,t)},fromValues:j,distance2:function(e,t){const r=e.p0,i=e.p1,n=e.p2,a=(0,o.f)(L.get(),i,r),s=(0,o.f)(L.get(),n,i),c=(0,o.f)(L.get(),r,n),l=(0,o.f)(L.get(),t,r),u=(0,o.f)(L.get(),t,i),d=(0,o.f)(L.get(),t,n),f=(0,o.c)(a,a,c),h=(0,o.d)((0,o.c)(L.get(),a,f),l),m=(0,o.d)((0,o.c)(L.get(),s,f),u),p=(0,o.d)((0,o.c)(L.get(),c,f),d);if(h>0&&m>0&&p>0){const e=(0,o.d)(f,l);return e*e/(0,o.d)(f,f)}const g=N(U(r,a,X.get()),t),v=N(U(i,s,X.get()),t),b=N(U(n,c,X.get()),t);return Math.min(g,v,b)},intersectRay:function(e,t,r){const i=1e-5,{direction:n,origin:a}=t,{p0:s,p1:c,p2:l}=e,u=c[0]-s[0],d=c[1]-s[1],f=c[2]-s[2],h=l[0]-s[0],m=l[1]-s[1],p=l[2]-s[2],g=n[1]*p-m*n[2],v=n[2]*h-p*n[0],b=n[0]*m-h*n[1],x=u*g+d*v+f*b;if(x>-i&&x<i)return!1;const y=1/x,_=a[0]-s[0],w=a[1]-s[1],T=a[2]-s[2],S=y*(_*g+w*v+T*b);if(S<0||S>1)return!1;const C=w*f-d*T,M=T*u-f*_,A=_*d-u*w,P=y*(n[0]*C+n[1]*M+n[2]*A);return!(P<0||S+P>1||(r&&((0,o.a)(r,n,y*(h*C+m*M+p*A)),(0,o.b)(r,a,r)),0))},areaPoints2d:$,area2d:function(e){return $(e.p0,e.p1,e.p2)},areaPoints3d:Z});let J=(()=>{const e=new Uint32Array(131072);for(let t=0;t<e.length;++t)e[t]=t;return e})();const ee=new Uint16Array([0]),te=(()=>{const e=new Uint16Array(65536);for(let t=0;t<e.length;++t)e[t]=t;return e})();function re(e){if(1===e)return ee;if(e<te.length)return new Uint16Array(te.buffer,0,e);if(e>J.length){const t=Math.max(2*J.length,e);J=new Uint32Array(t);for(let e=0;e<J.length;e++)J[e]=e}return new Uint32Array(J.buffer,0,e)}const ie=(0,n.c)(),ne=(0,n.c)(),oe=(0,n.c)(),ae=(0,n.c)();class se extends T{constructor(e,t=[],r=0,i=-1){super(),this._primitiveType=r,this.edgeIndicesLength=i,this.type=2,this._vertexAttributes=new Map,this._indices=new Map,this._boundingInfo=null;for(const[t,r]of e)r&&this._vertexAttributes.set(t,{...r});if(null==t||0===t.length){const e=function(e){const t=e.values().next().value;return null==t?0:t.data.length/t.size}(this._vertexAttributes),t=re(e);this.edgeIndicesLength=this.edgeIndicesLength<0?e:this.edgeIndicesLength;for(const e of this._vertexAttributes.keys())this._indices.set(e,t)}else for(const[e,r]of t)r&&(this._indices.set(e,ce(r)),"position"===e&&(this.edgeIndicesLength=this.edgeIndicesLength<0?this._indices.get(e).length:this.edgeIndicesLength))}get vertexAttributes(){return this._vertexAttributes}getMutableAttribute(e){const t=this._vertexAttributes.get(e);return t&&!t.exclusive&&(t.data=Array.from(t.data),t.exclusive=!0),t}get indices(){return this._indices}get indexCount(){const e=this._indices.values().next().value;return e?e.length:0}get primitiveType(){return this._primitiveType}get faceCount(){return this.indexCount/3}get boundingInfo(){return(0,i.Wi)(this._boundingInfo)&&(this._boundingInfo=this._calculateBoundingInfo()),this._boundingInfo}computeAttachmentOrigin(e){return 0===this.primitiveType?this.computeAttachmentOriginTriangles(e):this.computeAttachmentOriginPoints(e)}computeAttachmentOriginTriangles(e){const t=this.indices.get("position");return function(e,t,r){if(!e)return!1;const{size:i,data:n}=e;(0,o.s)(r,0,0,0),(0,o.s)(ae,0,0,0);let a=0,s=0;for(let e=0;e<t.length-2;e+=3){const c=t[e+0]*i,l=t[e+1]*i,u=t[e+2]*i;(0,o.s)(ie,n[c+0],n[c+1],n[c+2]),(0,o.s)(ne,n[l+0],n[l+1],n[l+2]),(0,o.s)(oe,n[u+0],n[u+1],n[u+2]);const d=Z(ie,ne,oe);d?((0,o.b)(ie,ie,ne),(0,o.b)(ie,ie,oe),(0,o.a)(ie,ie,1/3*d),(0,o.b)(r,r,ie),a+=d):((0,o.b)(ae,ae,ie),(0,o.b)(ae,ae,ne),(0,o.b)(ae,ae,oe),s+=3)}return!(0===s&&0===a||(0!==a?((0,o.a)(r,r,1/a),0):0===s||((0,o.a)(r,ae,1/s),0)))}(this.vertexAttributes.get("position"),t,e)}computeAttachmentOriginPoints(e){const t=this.indices.get("position");return function(e,t,r){if(!e||!t)return!1;const{size:i,data:n}=e;(0,o.s)(r,0,0,0);let a=-1,s=0;for(let e=0;e<t.length;e++){const o=t[e]*i;a!==o&&(r[0]+=n[o+0],r[1]+=n[o+1],r[2]+=n[o+2],s++),a=o}return s>1&&(0,o.a)(r,r,1/s),s>0}(this.vertexAttributes.get("position"),t,e)}invalidateBoundingInfo(){this._boundingInfo=null}_calculateBoundingInfo(){const e=this.indices.get("position");if(0===e.length)return null;const t=0===this.primitiveType?3:1;(0,b.hu)(e.length%t==0,"Indexing error: "+e.length+" not divisible by "+t);const r=re(e.length/t),i=this.vertexAttributes.get("position");return new y(r,t,e,i)}}function ce(e){if(e.BYTES_PER_ELEMENT===Uint16Array.BYTES_PER_ELEMENT)return e;for(const t of e)if(t>=65536)return e;return new Uint16Array(e)}var le=r(80905),ue=r(34353),de=r(2847),fe=r(69236),he=(r(95830),r(17154));function me(e,t){return(0,o.d)(e,t)/(0,o.l)(e)}function pe(e,t){const r=(0,o.d)(e,t)/((0,o.l)(e)*(0,o.l)(t));return-(0,B.ZF)(r)}const ge=(0,n.c)(),ve=(0,n.c)();Object.freeze({__proto__:null,projectPoint:function(e,t,r){const i=(0,o.d)(e,t)/(0,o.d)(e,e);return(0,o.a)(r,e,i)},projectPointSignedLength:me,angle:pe,angleAroundAxis:function(e,t,r){(0,o.n)(ge,e),(0,o.n)(ve,t);const i=(0,o.d)(ge,ve),n=(0,B.ZF)(i),a=(0,o.c)(ge,ge,ve);return(0,o.d)(a,r)<0?2*Math.PI-n:n}});var be=r(96071);function xe(e){return e?{origin:(0,n.b)(e.origin),direction:(0,n.b)(e.direction)}:{origin:(0,n.c)(),direction:(0,n.c)()}}function ye(e,t=xe()){return _e(e.origin,e.direction,t)}function _e(e,t,r=xe()){return(0,o.g)(r.origin,e),(0,o.g)(r.direction,t),r}function we(e,t,r=xe()){const n=(0,be.Wv)((0,A.c)(L.get(),t));if(n[2]=0,!e.unprojectFromRenderScreen(n,r.origin))return null;const a=(0,be.Wv)((0,A.c)(L.get(),t));a[2]=1;const s=e.unprojectFromRenderScreen(a,L.get());return(0,i.Wi)(s)?null:((0,o.f)(r.direction,s,r.origin),r)}function Te(e,t,r=xe()){return Se(e,e.screenToRender(t,(0,be.Wv)(L.get())),r)}function Se(e,t,r=xe()){(0,o.g)(r.origin,e.eye);const n=(0,o.s)(L.get(),t[0],t[1],1),a=e.unprojectFromRenderScreen(n,L.get());return(0,i.Wi)(a)?null:((0,o.f)(r.direction,a,r.origin),r)}function Ce(e,t){const r=(0,o.c)(L.get(),(0,o.n)(L.get(),e.direction),(0,o.f)(L.get(),t,e.origin));return(0,o.d)(r,r)}function Me(e,t,r){const i=(0,o.d)(e.direction,(0,o.f)(r,t,e.origin));return(0,o.b)(r,e.origin,(0,o.a)(r,e.direction,i)),r}function Ae(){return{origin:null,direction:null}}const Pe=new C(Ae);Object.freeze({__proto__:null,create:xe,wrap:function(e,t){const r=Pe.get();return r.origin=e,r.direction=t,r},copy:ye,fromPoints:function(e,t,r=xe()){return(0,o.g)(r.origin,e),(0,o.f)(r.direction,t,e),r},fromValues:_e,fromScreen:function(e,t,r=xe()){return we(e,e.screenToRender(t,(0,be.Wv)(L.get())),r)},fromRender:we,fromScreenAtEye:Te,fromRenderAtEye:Se,distance2:Ce,distance:function(e,t){return Math.sqrt(Ce(e,t))},closestPoint:Me,createWrapper:Ae});const Oe=f.Z.getLogger("esri.views.3d.support.geometryUtils.sphere");function Ie(){return(0,I.a)()}function Fe(e,t=Ie()){return(0,ue.c)(t,e)}function De(e){return Array.isArray(e)?e[3]:e}function Le(e){return Array.isArray(e)?e:ke}function Re(e,t,r){if((0,i.Wi)(t))return!1;const n=(0,o.f)(L.get(),t.origin,Le(e)),a=(0,o.d)(t.direction,t.direction),s=2*(0,o.d)(t.direction,n),c=s*s-4*a*((0,o.d)(n,n)-e[3]*e[3]);if(c<0)return!1;const l=Math.sqrt(c);let u=(-s-l)/(2*a);const d=(-s+l)/(2*a);return(u<0||d<u&&d>0)&&(u=d),!(u<0||(r&&(0,o.b)(r,t.origin,(0,o.a)(L.get(),t.direction,u)),0))}function ze(e,t,r){const i=L.get(),n=z.get();(0,o.c)(i,t.origin,t.direction);const s=De(e);(0,o.c)(r,i,t.origin),(0,o.a)(r,r,1/(0,o.l)(r)*s);const c=He(e,t.origin),l=pe(t.origin,r);return(0,a.i)(n),(0,a.r)(n,n,l+c,i),(0,o.i)(r,r,n),r}function Be(e,t,r){const i=(0,o.f)(L.get(),t,Le(e)),n=(0,o.a)(L.get(),i,e[3]/(0,o.l)(i));return(0,o.b)(r,n,Le(e))}function He(e,t){const r=(0,o.f)(L.get(),t,Le(e)),i=(0,o.l)(r),n=De(e),a=n+Math.abs(n-i);return(0,B.ZF)(n/a)}const Ee=(0,n.c)();function Ue(e,t,r,i){const n=(0,o.f)(Ee,t,Le(e));switch(r){case 0:{const e=(0,he.jE)(n,Ee)[2];return(0,o.s)(i,-Math.sin(e),Math.cos(e),0)}case 1:{const e=(0,he.jE)(n,Ee),t=e[1],r=e[2],a=Math.sin(t);return(0,o.s)(i,-a*Math.cos(r),-a*Math.sin(r),Math.cos(t))}case 2:return(0,o.n)(i,n);default:return}}function Ne(e,t){const r=(0,o.f)(Ge,t,Le(e));return(0,o.l)(r)-e[3]}const Ve=xe(),ke=(0,n.c)(),Ge=(0,n.c)();function We(e=vt){return[e[0],e[1],e[2],e[3]]}function qe(e,t,r,i){return $e(e,t,r,i,R.get())}function je(e,t=We()){return $e(e[0],e[1],e[2],e[3],t)}function $e(e,t,r,i,n=We()){return n[0]=e,n[1]=t,n[2]=r,n[3]=i,n}function Ze(e,t,r=We()){(0,o.g)(r,t);const i=(0,o.d)(t,t);return Math.abs(i-1)>1e-5&&i>1e-12&&(0,o.a)(r,r,1/Math.sqrt(i)),it(r,e,r),r}function Xe(e,t,r,i=We()){return nt((0,o.f)(L.get(),e,t),(0,o.f)(L.get(),r,t),e,i)}function Ke(e,t,r,i,n){if(e.count<3)return!1;e.getVec(r,Qe);let a=i,s=!1;for(;a<e.count-1&&!s;)e.getVec(a,Je),a++,s=!(0,o.m)(Qe,Je);if(!s)return!1;for(a=Math.max(a,n),s=!1;a<e.count&&!s;)e.getVec(a,et),a++,(0,o.f)(tt,Qe,Je),(0,o.n)(tt,tt),(0,o.f)(rt,Je,et),(0,o.n)(rt,rt),s=!(0,o.m)(Qe,et)&&!(0,o.m)(Je,et)&&Math.abs((0,o.d)(tt,rt))<Ye;return s?(Xe(Qe,Je,et,t),!0):(0!==r||1!==i||2!==n)&&Ke(e,t,0,1,2)}Object.freeze(ke),Object.freeze({__proto__:null,create:Ie,copy:Fe,fromCenterAndRadius:function(e,t){return(0,I.b)(e[0],e[1],e[2],t)},wrap:function(e){return e},clear:function(e){e[0]=e[1]=e[2]=e[3]=0},fromRadius:function(e){return e},getRadius:De,getCenter:Le,fromValues:function(e,t,r,i){return(0,I.b)(e,t,r,i)},elevate:function(e,t,r){return e!==r&&(0,o.g)(r,e),r[3]=e[3]+t,r},setExtent:function(e,t,r){return Oe.error("sphere.setExtent is not yet supported"),e===r?r:Fe(e,r)},intersectRay:Re,intersectScreen:function(e,t,r,i){return Re(e,Te(t,r,Ve),i)},intersectsRay:function(e,t){return Re(e,t,null)},intersectRayClosestSilhouette:function(e,t,r){if(Re(e,t,r))return r;const i=ze(e,t,L.get());return(0,o.b)(r,t.origin,(0,o.a)(L.get(),t.direction,(0,o.k)(t.origin,i)/(0,o.l)(t.direction))),r},closestPointOnSilhouette:ze,closestPoint:function(e,t,r){return Re(e,t,r)?r:(Me(t,Le(e),r),Be(e,r,r))},projectPoint:Be,distanceToSilhouette:function(e,t){const r=(0,o.f)(L.get(),t,Le(e)),i=(0,o.o)(r),n=e[3]*e[3];return Math.sqrt(Math.abs(i-n))},angleToSilhouette:He,axisAt:Ue,altitudeAt:Ne,setAltitudeAt:function(e,t,r,i){const n=Ne(e,t),a=Ue(e,t,2,Ge),s=(0,o.a)(Ge,a,r-n);return(0,o.b)(i,t,s),i}});const Ye=.99619469809,Qe=(0,n.c)(),Je=(0,n.c)(),et=(0,n.c)(),tt=(0,n.c)(),rt=(0,n.c)();function it(e,t,r){return e!==r&&je(e,r),r[3]=-(0,o.d)(r,t),r}function nt(e,t,r,i=We()){return Ze(r,(0,o.c)(L.get(),t,e),i)}function ot(e,t,r){return!!(0,i.pC)(t)&&gt(e,t.origin,t.direction,!0,!1,r)}function at(e,t,r){return gt(e,t.origin,t.vector,!1,!1,r)}function st(e,t,r){return gt(e,t.origin,t.vector,!1,!0,r)}function ct(e,t){return pt(e,Le(t))-t[3]>=0}function lt(e,t){return pt(e,t)>=0}function ut(e,t){const r=t[0],i=t[1],n=t[2],o=t[3],a=t[4],s=t[5];return e[0]*(e[0]>0?r:o)+e[1]*(e[1]>0?i:a)+e[2]*(e[2]>0?n:s)+e[3]>=0}function dt(e,t){const r=(0,o.d)(e,t.ray.direction),i=-pt(e,t.ray.origin);if(i<0&&r>=0)return!1;if(r>-1e-6&&r<1e-6)return i>0;if((i<0||r<0)&&!(i<0&&r<0))return!0;const n=i/r;return r>0?n<t.c1&&(t.c1=n):n>t.c0&&(t.c0=n),t.c0<=t.c1}function ft(e,t){const r=(0,o.d)(e,t.ray.direction),i=-pt(e,t.ray.origin);if(r>-1e-6&&r<1e-6)return i>0;const n=i/r;return r>0?n<t.c1&&(t.c1=n):n>t.c0&&(t.c0=n),t.c0<=t.c1}function ht(e,t,r){const i=(0,o.a)(L.get(),e,-e[3]),n=mt(e,(0,o.f)(L.get(),t,i),L.get());return(0,o.b)(r,n,i),r}function mt(e,t,r){const i=(0,o.a)(L.get(),e,(0,o.d)(e,t));return(0,o.f)(r,t,i),r}function pt(e,t){return(0,o.d)(e,t)+e[3]}function gt(e,t,r,i,n,a){const s=(0,o.d)(e,r);if(0===s)return!1;let c=-((0,o.d)(e,t)+e[3])/s;return n&&(c=i?Math.max(0,c):(0,B.uZ)(c,0,1)),!(c<0||!i&&c>1||((0,o.b)(a,t,(0,o.a)(a,r,c)),0))}const vt=[0,0,1,0];Object.freeze({__proto__:null,create:We,wrap:qe,copy:je,fromValues:$e,fromNormalAndOffset:function(e,t,r=We()){return(0,o.g)(r,e),r[3]=t,r},fromPositionAndNormal:Ze,fromPoints:Xe,fromManyPoints:function(e,t){return Ke(e,t,0,1,2)},fromManyPointsSampleAt:Ke,setOffsetFromPoint:it,negate:function(e,t){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t},fromVectorsAndPoint:nt,intersectRay:ot,intersectLineSegment:at,intersectLineSegmentClamp:st,isSphereFullyInside:ct,isSphereFullyOutside:function(e,t){return pt(e,Le(t))+t[3]<0},isPointInside:lt,isPointOutside:function(e,t){return pt(e,t)<0},isAABBFullyInside:ut,clip:dt,clipInfinite:ft,projectPoint:ht,projectVector:mt,distance:function(e,t){return Math.abs(pt(e,t))},signedDistance:pt,normal:function(e){return e},UP:vt});const bt=f.Z.getLogger("esri.views.3d.support.geometryUtils.boundedPlane");function xt(e=Ht){return{plane:We(e.plane),origin:(0,n.b)(e.origin),basis1:(0,n.b)(e.basis1),basis2:(0,n.b)(e.basis2)}}function yt(e,t=xt()){return _t(e.origin,e.basis1,e.basis2,t)}function _t(e,t,r,i=xt()){return(0,o.g)(i.origin,e),(0,o.g)(i.basis1,t),(0,o.g)(i.basis2,r),wt(i),function(e,t){Math.abs((0,o.d)(e.basis1,e.basis2)/((0,o.l)(e.basis1)*(0,o.l)(e.basis2)))>1e-6&&bt.warn(t,"Provided basis vectors are not perpendicular"),Math.abs((0,o.d)(e.basis1,Dt(e)))>1e-6&&bt.warn(t,"Basis vectors and plane normal are not perpendicular"),Math.abs(-(0,o.d)(Dt(e),e.origin)-e.plane[3])>1e-6&&bt.warn(t,"Plane offset is not consistent with plane origin")}(i,"fromValues()"),i}function wt(e){nt(e.basis2,e.basis1,e.origin,e.plane)}function Tt(e,t,r){e!==r&&yt(e,r);const i=(0,o.a)(L.get(),Dt(e),t);return(0,o.b)(r.origin,r.origin,i),r.plane[3]-=t,r}function St(e,t=xt()){const r=(e[2]-e[0])/2,i=(e[3]-e[1])/2;return(0,o.s)(t.origin,e[0]+r,e[1]+i,0),(0,o.s)(t.basis1,r,0,0),(0,o.s)(t.basis2,0,i,0),$e(0,0,1,0,t.plane),t}function Ct(e,t,r){return!!ot(e.plane,t,r)&&Lt(e,r)}function Mt(e,t,r){const i=Et.get();Bt(e,t,i,Et.get());let n=Number.POSITIVE_INFINITY;for(const a of kt){const s=zt(e,a,Ut.get()),c=L.get();if(at(i,s,c)){const e=(0,he.tB)(L.get(),t.origin,c),i=Math.abs((0,B.ZF)((0,o.d)(t.direction,e)));i<n&&(n=i,(0,o.g)(r,c))}}return n===Number.POSITIVE_INFINITY?At(e,t,r):r}function At(e,t,r){if(Ct(e,t,r))return r;const i=Et.get(),n=Et.get();Bt(e,t,i,n);let a=Number.POSITIVE_INFINITY;for(const s of kt){const c=zt(e,s,Ut.get()),l=L.get();if(st(i,c,l)){const e=Ce(t,l);if(!lt(n,l))continue;e<a&&(a=e,(0,o.g)(r,l))}}return It(e,t.origin)<a&&Pt(e,t.origin,r),r}function Pt(e,t,r){const i=ht(e.plane,t,L.get()),n=V(Rt(e,e.basis1),i,-1,1,L.get()),a=V(Rt(e,e.basis2),i,-1,1,L.get());return(0,o.f)(r,(0,o.b)(L.get(),n,a),e.origin),r}function Ot(e,t,r){const{origin:i,basis1:n,basis2:a}=e,s=(0,o.f)(L.get(),t,i),c=me(n,s),l=me(a,s),u=me(Dt(e),s);return(0,o.s)(r,c,l,u)}function It(e,t){const r=Ot(e,t,L.get()),{basis1:i,basis2:n}=e,a=(0,o.l)(i),s=(0,o.l)(n),c=Math.max(Math.abs(r[0])-a,0),l=Math.max(Math.abs(r[1])-s,0),u=r[2];return c*c+l*l+u*u}function Ft(e,t){const r=-e.plane[3];return me(Dt(e),t)-r}function Dt(e){return e.plane}function Lt(e,t){const r=(0,o.f)(L.get(),t,e.origin),i=(0,o.o)(e.basis1),n=(0,o.o)(e.basis2),a=(0,o.d)(e.basis1,r),s=(0,o.d)(e.basis2,r);return-a-i<0&&a-i<0&&-s-n<0&&s-n<0}function Rt(e,t){const r=Ut.get();return(0,o.g)(r.origin,e.origin),(0,o.g)(r.vector,t),r}function zt(e,t,r){const{basis1:i,basis2:n,origin:a}=e,s=(0,o.a)(L.get(),i,t.origin[0]),c=(0,o.a)(L.get(),n,t.origin[1]);(0,o.b)(r.origin,s,c),(0,o.b)(r.origin,r.origin,a);const l=(0,o.a)(L.get(),i,t.direction[0]),u=(0,o.a)(L.get(),n,t.direction[1]);return(0,o.a)(r.vector,(0,o.b)(l,l,u),2),r}function Bt(e,t,r,i){const n=Dt(e);nt(n,t.direction,t.origin,r),nt(r,n,t.origin,i)}const Ht={plane:We(),origin:(0,n.f)(0,0,0),basis1:(0,n.f)(1,0,0),basis2:(0,n.f)(0,1,0)},Et=new C(We),Ut=new C(H),Nt=(0,n.c)(),Vt=new C((()=>({origin:null,basis1:null,basis2:null,plane:null}))),kt=[{origin:[-1,-1],direction:[1,0]},{origin:[1,-1],direction:[0,1]},{origin:[1,1],direction:[-1,0]},{origin:[-1,1],direction:[0,-1]}],Gt=(0,l.a)(),Wt=(0,l.a)();function qt(e=$t){return[e[0],e[1],e[2],e[3]]}function jt(e,t,r,i,n=qt()){return n[0]=e,n[1]=t,n[2]=r,n[3]=i,n}Object.freeze({__proto__:null,BoundedPlaneClass:class{constructor(){this.plane=We(),this.origin=(0,n.c)(),this.basis1=(0,n.c)(),this.basis2=(0,n.c)()}},create:xt,wrap:function(e,t,r){const i=Vt.get();return i.origin=e,i.basis1=t,i.basis2=r,i.plane=qe(0,0,0,0),wt(i),i},copy:yt,copyWithoutVerify:function(e,t){(0,o.g)(t.origin,e.origin),(0,o.g)(t.basis1,e.basis1),(0,o.g)(t.basis2,e.basis2),je(e.plane,t.plane)},fromValues:_t,updateUnboundedPlane:wt,elevate:Tt,setExtent:function(e,t,r){return St(t,r),Tt(r,Ft(e,e.origin),r),r},fromAABoundingRect:St,intersectRay:Ct,intersectRayClosestSilhouette:function(e,t,r){if(Ct(e,t,r))return r;const i=Mt(e,t,L.get());return(0,o.b)(r,t.origin,(0,o.a)(L.get(),t.direction,(0,o.k)(t.origin,i)/(0,o.l)(t.direction))),r},closestPointOnSilhouette:Mt,closestPoint:At,projectPoint:Pt,projectPointLocal:Ot,distance2:It,distance:function(e,t){return Math.sqrt(It(e,t))},distanceToSilhouette:function(e,t){let r=Number.NEGATIVE_INFINITY;for(const i of kt){const n=N(zt(e,i,Ut.get()),t);n>r&&(r=n)}return Math.sqrt(r)},extrusionContainsPoint:function(e,t){return lt(e.plane,t)&&Lt(e,t)},axisAt:function(e,t,r,i){return function(e,t,r){switch(t){case 0:(0,o.g)(r,e.basis1),(0,o.n)(r,r);break;case 1:(0,o.g)(r,e.basis2),(0,o.n)(r,r);break;case 2:(0,o.g)(r,Dt(e))}return r}(e,r,i)},altitudeAt:Ft,setAltitudeAt:function(e,t,r,i){const n=Ft(e,t),a=(0,o.a)(Nt,Dt(e),r-n);return(0,o.b)(i,t,a),i},equals:function(e,t){return(0,o.m)(e.basis1,t.basis1)&&(0,o.m)(e.basis2,t.basis2)&&(0,o.m)(e.origin,t.origin)},transform:function(e,t,r){return e!==r&&yt(e,r),(0,a.a)(Gt,t),(0,a.b)(Gt,Gt),(0,o.i)(r.basis1,e.basis1,Gt),(0,o.i)(r.basis2,e.basis2,Gt),(0,o.i)(r.plane,e.plane,Gt),(0,o.i)(r.origin,e.origin,t),it(r.plane,r.origin,r.plane),r},rotate:function(e,t,r,i){return e!==i&&yt(e,i),(0,a.r)(Wt,(0,a.i)(Wt),t,r),(0,o.i)(i.basis1,e.basis1,Wt),(0,o.i)(i.basis2,e.basis2,Wt),wt(i),i},normal:Dt,UP:Ht});const $t=[0,0,1,0];function Zt(e){return e?{ray:xe(e.ray),c0:e.c0,c1:e.c1}:{ray:xe(),c0:0,c1:Number.MAX_VALUE}}function Xt(e,t,r,i=Zt()){return ye(e,i.ray),i.c0=t,i.c1=r,i}function Kt(e,t=Zt()){return ye(e,t.ray),t.c0=0,t.c1=Number.MAX_VALUE,t}function Yt(e,t,r=Zt()){const i=(0,o.l)(e.vector);return _e(e.origin,t,r.ray),r.c0=0,r.c1=i,r}function Qt(e,t,r){return(0,o.b)(r,e.ray.origin,(0,o.a)(r,e.ray.direction,t))}Object.freeze({__proto__:null,create:qt,wrap:function(e,t,r,i){return jt(e,t,r,i,R.get())},wrapAxisAngle:function(e,t){return jt(e[0],e[1],e[2],t,R.get())},copy:function(e,t=qt()){return jt(e[0],e[1],e[2],e[3],t)},fromValues:jt,fromAxisAndAngle:function(e,t,r=qt()){return(0,o.g)(r,e),r[3]=t,r},fromPoints:function(e,t,r=qt()){return(0,o.c)(r,e,t),(0,o.n)(r,r),r[3]=pe(e,t),r},axis:function(e){return e},UP:$t});const Jt=new C((()=>({c0:0,c1:0,ray:null})));function er(e){return e?[We(e[0]),We(e[1]),We(e[2]),We(e[3]),We(e[4]),We(e[5])]:[We(),We(),We(),We(),We(),We()]}function tr(){return[(0,n.c)(),(0,n.c)(),(0,n.c)(),(0,n.c)(),(0,n.c)(),(0,n.c)(),(0,n.c)(),(0,n.c)()]}function rr(e,t){Xe(t[4],t[0],t[3],e[0]),Xe(t[1],t[5],t[6],e[1]),Xe(t[4],t[5],t[1],e[2]),Xe(t[3],t[2],t[6],e[3]),Xe(t[0],t[1],t[2],e[4]),Xe(t[5],t[4],t[7],e[5])}function ir(e,t){for(let r=0;r<6;r++)if(!dt(e[r],t))return!1;return!0}Object.freeze({__proto__:null,create:Zt,wrap:function(e,t,r){const i=Jt.get();return i.ray=e,i.c0=t,i.c1=r,i},copy:function(e,t=Zt()){return Xt(e.ray,e.c0,e.c1,t)},fromValues:Xt,fromRay:Kt,fromLineSegment:function(e,t=Zt()){return Yt(e,(0,o.n)(L.get(),e.vector),t)},fromLineSegmentAndDirection:Yt,getStart:function(e,t){return Qt(e,e.c0,t)},getEnd:function(e,t){return Qt(e,e.c1,t)},getAt:Qt});const nr=[(0,I.b)(-1,-1,-1,1),(0,I.b)(1,-1,-1,1),(0,I.b)(1,1,-1,1),(0,I.b)(-1,1,-1,1),(0,I.b)(-1,-1,1,1),(0,I.b)(1,-1,1,1),(0,I.b)(1,1,1,1),(0,I.b)(-1,1,1,1)],or=new C(Zt),ar=tr();Object.freeze({__proto__:null,create:er,createPoints:tr,copy:function(e,t=er()){for(let r=0;r<6;r++)je(e[r],t[r])},fromMatrix:function(e,t,r,i=ar){const n=(0,a.m)(z.get(),t,e);(0,a.a)(n,n);for(let e=0;e<8;++e){const t=(0,ue.t)(R.get(),nr[e],n);(0,o.s)(i[e],t[0]/t[3],t[1]/t[3],t[2]/t[3])}rr(r,i)},computePlanes:rr,intersectsSphere:function(e,t){for(let r=0;r<6;r++)if(ct(e[r],t))return!1;return!0},intersectsRay:function(e,t){return ir(e,Kt(t,or.get()))},intersectClipRay:function(e,t){for(let r=0;r<6;r++)if(!ft(e[r],t))return!1;return!0},intersectsLineSegment:function(e,t,r){return ir(e,Yt(t,r,or.get()))},intersectsPoint:function(e,t){for(let r=0;r<6;r++)if(pt(e[r],t)>0)return!1;return!0},intersectsAABB:function(e,t){for(let r=0;r<6;r++)if(ut(e[r],t))return!1;return!0},planePointIndices:{bottom:[5,1,0,4],near:[0,1,2,3],far:[5,4,7,6],right:[1,5,6,2],left:[4,0,3,7],top:[7,3,2,6]}});var sr=r(38035);class cr{constructor(){this._disposed=!1}get disposed(){return this._disposed}get shaderTransformation(){return this._shaderTransformation}acquire(e,t,r,i,n,o){this.id=(0,w.D)(),this.geometry=e,this.material=t,this.transformation=r,this.instanceParameters=i,this.origin=n,this._shaderTransformation=o,this._disposed=!1}release(){this._disposed=!1}dispose(){this._disposed=!0}getStaticTransformation(){return this.transformation}getShaderTransformation(){return(0,i.pC)(this._shaderTransformation)?this._shaderTransformation(this.transformation):this.transformation}computeAttachmentOrigin(e){return!!(this.material.computeAttachmentOrigin?this.material.computeAttachmentOrigin(this.geometry,e):this.geometry.computeAttachmentOrigin(e))&&((0,o.i)(e,e,this.getStaticTransformation()),!0)}}cr.pool=new sr.Z(cr),r(49366);const lr=new class{constructor(e=0){this.offset=e,this.sphere=Ie(),this.tmpVertex=(0,n.c)()}applyToVertex(e,t,r){const i=this.objectTransform.transform;let n=i[0]*e+i[4]*t+i[8]*r+i[12],o=i[1]*e+i[5]*t+i[9]*r+i[13],a=i[2]*e+i[6]*t+i[10]*r+i[14];const s=this.offset/Math.sqrt(n*n+o*o+a*a);n+=n*s,o+=o*s,a+=a*s;const c=this.objectTransform.inverse;return this.tmpVertex[0]=c[0]*n+c[4]*o+c[8]*a+c[12],this.tmpVertex[1]=c[1]*n+c[5]*o+c[9]*a+c[13],this.tmpVertex[2]=c[2]*n+c[6]*o+c[10]*a+c[14],this.tmpVertex}applyToMinMax(e,t){const r=this.offset/Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);e[0]+=e[0]*r,e[1]+=e[1]*r,e[2]+=e[2]*r;const i=this.offset/Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);t[0]+=t[0]*i,t[1]+=t[1]*i,t[2]+=t[2]*i}applyToAabb(e){const t=this.offset/Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);e[0]+=e[0]*t,e[1]+=e[1]*t,e[2]+=e[2]*t;const r=this.offset/Math.sqrt(e[3]*e[3]+e[4]*e[4]+e[5]*e[5]);return e[3]+=e[3]*r,e[4]+=e[4]*r,e[5]+=e[5]*r,e}applyToBoundingSphere(e){const t=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]),r=this.offset/t;return this.sphere[0]=e[0]+e[0]*r,this.sphere[1]=e[1]+e[1]*r,this.sphere[2]=e[2]+e[2]*r,this.sphere[3]=e[3]+e[3]*this.offset/t,this.sphere}};new class{constructor(e=0){this.offset=e,this.componentLocalOriginLength=0,this.tmpVertex=(0,n.c)(),this.mbs=(0,I.a)(),this.obb={center:(0,n.c)(),halfSize:(0,fe.c)(),quaternion:null}}set localOrigin(e){this.componentLocalOriginLength=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2])}applyToVertex(e,t,r){const i=e,n=t,o=r+this.componentLocalOriginLength,a=this.offset/Math.sqrt(i*i+n*n+o*o);return this.tmpVertex[0]=e+i*a,this.tmpVertex[1]=t+n*a,this.tmpVertex[2]=r+o*a,this.tmpVertex}applyToAabb(e){const t=e[0],r=e[1],i=e[2]+this.componentLocalOriginLength,n=e[3],o=e[4],a=e[5]+this.componentLocalOriginLength,s=this.offset/Math.sqrt(t*t+r*r+i*i);e[0]+=t*s,e[1]+=r*s,e[2]+=i*s;const c=this.offset/Math.sqrt(n*n+o*o+a*a);return e[3]+=n*c,e[4]+=o*c,e[5]+=a*c,e}applyToMbs(e){const t=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]),r=this.offset/t;return this.mbs[0]=e[0]+e[0]*r,this.mbs[1]=e[1]+e[1]*r,this.mbs[2]=e[2]+e[2]*r,this.mbs[3]=e[3]+e[3]*this.offset/t,this.mbs}applyToObb(e){const t=e.center,r=this.offset/Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);this.obb.center[0]=t[0]+t[0]*r,this.obb.center[1]=t[1]+t[1]*r,this.obb.center[2]=t[2]+t[2]*r,(0,o.q)(this.obb.halfSize,e.halfSize,e.quaternion),(0,o.b)(this.obb.halfSize,this.obb.halfSize,e.center);const i=this.offset/Math.sqrt(this.obb.halfSize[0]*this.obb.halfSize[0]+this.obb.halfSize[1]*this.obb.halfSize[1]+this.obb.halfSize[2]*this.obb.halfSize[2]);return this.obb.halfSize[0]+=this.obb.halfSize[0]*i,this.obb.halfSize[1]+=this.obb.halfSize[1]*i,this.obb.halfSize[2]+=this.obb.halfSize[2]*i,(0,o.f)(this.obb.halfSize,this.obb.halfSize,e.center),(0,de.c)(ur,e.quaternion),(0,o.q)(this.obb.halfSize,this.obb.halfSize,ur),this.obb.halfSize[0]*=this.obb.halfSize[0]<0?-1:1,this.obb.halfSize[1]*=this.obb.halfSize[1]<0?-1:1,this.obb.halfSize[2]*=this.obb.halfSize[2]<0?-1:1,this.obb.quaternion=e.quaternion,this.obb}},new class{constructor(e=0){this.offset=e,this.tmpVertex=(0,n.c)()}applyToVertex(e,t,r){const i=e+this.localOrigin[0],n=t+this.localOrigin[1],o=r+this.localOrigin[2],a=this.offset/Math.sqrt(i*i+n*n+o*o);return this.tmpVertex[0]=e+i*a,this.tmpVertex[1]=t+n*a,this.tmpVertex[2]=r+o*a,this.tmpVertex}applyToAabb(e){const t=e[0]+this.localOrigin[0],r=e[1]+this.localOrigin[1],i=e[2]+this.localOrigin[2],n=e[3]+this.localOrigin[0],o=e[4]+this.localOrigin[1],a=e[5]+this.localOrigin[2],s=this.offset/Math.sqrt(t*t+r*r+i*i);e[0]+=t*s,e[1]+=r*s,e[2]+=i*s;const c=this.offset/Math.sqrt(n*n+o*o+a*a);return e[3]+=n*c,e[4]+=o*c,e[5]+=a*c,e}},(0,n.c)(),(0,n.c)(),(0,I.a)();const ur=(0,P.a)(),dr=e=>class extends e{constructor(){super(...arguments),this._isDisposed=!1}dispose(){for(const t of null!=(e=this._managedDisposables)?e:[]){var e;const r=this[t];this[t]=null,r&&"function"==typeof r.dispose&&r.dispose()}this._isDisposed=!0}get isDisposed(){return this._isDisposed}};class fr extends(dr(class{})){}const hr=class extends fr{constructor(e){super(),this.material=e.material,this.techniqueRep=e.techniqueRep,this.output=e.output}getTechnique(){return this.technique}getPipelineState(e,t){return this.getTechnique().pipeline}ensureResources(e){return 2}ensureParameters(e){}},mr=class extends hr{constructor(e){super(e),this._textureIDs=new Set,this._textureRepository=e.textureRep,this._textureId=e.textureId,this._initTransparent=!!e.initTextureTransparent,this._texture=this._acquireIfNotUndefined(this._textureId),this._textureNormal=this._acquireIfNotUndefined(e.normalTextureId),this._textureEmissive=this._acquireIfNotUndefined(e.emissiveTextureId),this._textureOcclusion=this._acquireIfNotUndefined(e.occlusionTextureId),this._textureMetallicRoughness=this._acquireIfNotUndefined(e.metallicRoughnessTextureId)}dispose(){this._textureIDs.forEach((e=>this._textureRepository.release(e))),this._textureIDs.clear()}updateTexture(e){e!==this._textureId&&(this._releaseIfNotUndefined(this._textureId),this._textureId=e,this._texture=this._acquireIfNotUndefined(this._textureId))}bindTexture(e,t){(0,i.pC)(this._texture)&&(t.setUniform1i("tex",0),e.bindTexture(this._texture.glTexture,0)),(0,i.pC)(this._textureNormal)&&(t.setUniform1i("normalTexture",1),e.bindTexture(this._textureNormal.glTexture,1)),(0,i.pC)(this._textureEmissive)&&(t.setUniform1i("texEmission",2),e.bindTexture(this._textureEmissive.glTexture,2)),(0,i.pC)(this._textureOcclusion)&&(t.setUniform1i("texOcclusion",3),e.bindTexture(this._textureOcclusion.glTexture,3)),(0,i.pC)(this._textureMetallicRoughness)&&(t.setUniform1i("texMetallicRoughness",4),e.bindTexture(this._textureMetallicRoughness.glTexture,4))}bindTextureScale(e,t){const r=(0,i.pC)(this._texture)&&this._texture.glTexture;r&&r.descriptor.textureCoordinateScaleFactor?t.setUniform2fv("textureCoordinateScaleFactor",r.descriptor.textureCoordinateScaleFactor):t.setUniform2f("textureCoordinateScaleFactor",1,1)}_acquireIfNotUndefined(e){if(!(0,i.Wi)(e))return this._textureIDs.add(e),this._textureRepository.acquire(e,this._initTransparent)}_releaseIfNotUndefined(e){(0,i.Wi)(e)||(this._textureIDs.delete(e),this._textureRepository.release(e))}};var pr=r(48775);const gr={position:0,normal:1,uv0:2,color:3,size:4,tangent:4,auxpos1:5,symbolColor:5,auxpos2:6,featureAttribute:6,instanceFeatureAttribute:6,instanceColor:7,model:8,modelNormal:12,modelOriginHi:11,modelOriginLo:15};class vr extends T{constructor(e,t){super(),this.type=3,this.supportsEdges=!1,this._visible=!0,this._renderPriority=0,this._insertOrder=0,this._vertexAttributeLocations=gr,this._params=(0,pr.Uf)(e,t),this.validateParameterValues(this._params)}dispose(){}get params(){return this._params}update(e){return!1}setParameterValues(e){(0,pr.LO)(this._params,e)&&(this.validateParameterValues(this._params),this.parametersChanged())}validateParameterValues(e){}get visible(){return this._visible}set visible(e){e!==this._visible&&(this._visible=e,this.parametersChanged())}isVisibleInPass(e){return!0}get renderOccluded(){return this.params.renderOccluded}get renderPriority(){return this._renderPriority}set renderPriority(e){e!==this._renderPriority&&(this._renderPriority=e,this.parametersChanged())}get insertOrder(){return this._insertOrder}set insertOrder(e){e!==this._insertOrder&&(this._insertOrder=e,this.parametersChanged())}get vertexAttributeLocations(){return this._vertexAttributeLocations}isVisible(){return this._visible}parametersChanged(){(0,i.pC)(this.materialRepository)&&this.materialRepository.materialChanged(this)}}function br(e,t,r,i){const n=r.typedBuffer,o=r.typedBufferStride,a=e.length;i*=o;for(let r=0;r<a;++r){const a=2*e[r];n[i]=t[a],n[i+1]=t[a+1],i+=o}}function xr(e,t,r,i,n){const o=r.typedBuffer,a=r.typedBufferStride,s=e.length;if(i*=a,null==n||1===n)for(let r=0;r<s;++r){const n=3*e[r];o[i]=t[n],o[i+1]=t[n+1],o[i+2]=t[n+2],i+=a}else for(let r=0;r<s;++r){const s=3*e[r];for(let e=0;e<n;++e)o[i]=t[s],o[i+1]=t[s+1],o[i+2]=t[s+2],i+=a}}function yr(e,t,r,i,n=1){const o=r.typedBuffer,a=r.typedBufferStride,s=e.length;if(i*=a,1===n)for(let r=0;r<s;++r){const n=4*e[r];o[i]=t[n],o[i+1]=t[n+1],o[i+2]=t[n+2],o[i+3]=t[n+3],i+=a}else for(let r=0;r<s;++r){const s=4*e[r];for(let e=0;e<n;++e)o[i]=t[s],o[i+1]=t[s+1],o[i+2]=t[s+2],o[i+3]=t[s+3],i+=a}}function _r(e,t,r,i,n,o=1){if(r){const a=i.typedBuffer,s=i.typedBufferStride,c=e.length,l=r[0],u=r[1],d=r[2],f=r[4],h=r[5],m=r[6],p=r[8],g=r[9],v=r[10],b=r[12],x=r[13],y=r[14];if(n*=s,1===o)for(let r=0;r<c;++r){const i=3*e[r],o=t[i],c=t[i+1],_=t[i+2];a[n]=l*o+f*c+p*_+b,a[n+1]=u*o+h*c+g*_+x,a[n+2]=d*o+m*c+v*_+y,n+=s}else for(let r=0;r<c;++r){const i=3*e[r],c=t[i],_=t[i+1],w=t[i+2],T=l*c+f*_+p*w+b,S=u*c+h*_+g*w+x,C=d*c+m*_+v*w+y;for(let e=0;e<o;++e)a[n]=T,a[n+1]=S,a[n+2]=C,n+=s}}else xr(e,t,i,n,o)}function wr(e,t,r,i,n,o){if(r){const a=r,s=i.typedBuffer,c=i.typedBufferStride,l=e.length,u=a[0],d=a[1],f=a[2],h=a[4],m=a[5],p=a[6],g=a[8],v=a[9],b=a[10],x=Math.abs(1-u*u+h*h+g*g)>1e-5||Math.abs(1-d*d+m*m+v*v)>1e-5||Math.abs(1-f*f+p*p+b*b)>1e-5,y=1e-6,_=1-y;if(n*=c,1===o)for(let r=0;r<l;++r){const i=3*e[r],o=t[i],a=t[i+1],l=t[i+2];let w=u*o+h*a+g*l,T=d*o+m*a+v*l,S=f*o+p*a+b*l;if(x){const e=w*w+T*T+S*S;if(e<_&&e>y){const t=Math.sqrt(e);w/=t,T/=t,S/=t}}s[n+0]=w,s[n+1]=T,s[n+2]=S,n+=c}else for(let r=0;r<l;++r){const i=3*e[r],a=t[i],l=t[i+1],w=t[i+2];let T=u*a+h*l+g*w,S=d*a+m*l+v*w,C=f*a+p*l+b*w;if(x){const e=T*T+S*S+C*C;if(e<_&&e>y){const t=Math.sqrt(e);T/=t,S/=t,C/=t}}for(let e=0;e<o;++e)s[n+0]=T,s[n+1]=S,s[n+2]=C,n+=c}}else xr(e,t,i,n,o)}function Tr(e,t,r,i,n,o=1){const a=i.typedBuffer,s=i.typedBufferStride,c=e.length;if(n*=s,1===o){if(4===r)for(let r=0;r<c;++r){const i=4*e[r];a[n]=t[i],a[n+1]=t[i+1],a[n+2]=t[i+2],a[n+3]=t[i+3],n+=s}else if(3===r)for(let r=0;r<c;++r){const i=3*e[r];a[n]=t[i],a[n+1]=t[i+1],a[n+2]=t[i+2],a[n+3]=255,n+=s}}else if(4===r)for(let r=0;r<c;++r){const i=4*e[r];for(let e=0;e<o;++e)a[n]=t[i],a[n+1]=t[i+1],a[n+2]=t[i+2],a[n+3]=t[i+3],n+=s}else if(3===r)for(let r=0;r<c;++r){const i=3*e[r];for(let e=0;e<o;++e)a[n]=t[i],a[n+1]=t[i+1],a[n+2]=t[i+2],a[n+3]=255,n+=s}}var Sr=r(34658),Cr=r(36904);const Mr=(0,Cr.wK)(770,1,771,771),Ar=(0,Cr.if)(1,1),Pr=(0,Cr.if)(0,771);const Or={factor:-1,units:-2};function Ir(e){return e?Or:null}function Fr(e){return 3===e||2===e?513:515}var Dr=r(56140);class Lr{constructor(e,t){this._module=e,this._loadModule=t}get(){return this._module}async reload(){return this._module=await this._loadModule(),this._module}}function Rr(e={}){return(t,r)=>{var i,n;t._parameterNames=null!=(i=t._parameterNames)?i:[],t._parameterNames.push(r);const o=t._parameterNames.length-1,a=e.count||2,s=Math.ceil((0,B.k3)(a)),c=null!=(n=t._parameterBits)?n:[0];let l=0;for(;c[l]+s>16;)l++,l>=c.length&&c.push(0);t._parameterBits=c;const u=c[l],d=(1<<s)-1<<u;c[l]+=s,Object.defineProperty(t,r,{get(){return this[o]},set(e){if(this[o]!==e&&(this[o]=e,this._keyDirty=!0,this._parameterBits[l]=this._parameterBits[l]&~d|+e<<u&d,"number"!=typeof e&&"boolean"!=typeof e))throw"Configuration value for "+r+" must be boolean or number, got "+typeof e}})}}var zr,Br=r(51007),Hr=r(6897);!function(e){function t(e,t,r){(0,a.t)(Er,r,t),e.setUniform3fv("localOrigin",t),e.setUniformMatrix4fv("view",Er)}e.bindCamPosition=function(e,t,r){e.setUniform3f("camPos",r[3]-t[0],r[7]-t[1],r[11]-t[2])},e.bindProjectionMatrix=function(e,t){e.setUniformMatrix4fv("proj",t)},e.bindNearFar=function(e,t){e.setUniform2fv("nearFar",t)},e.bindViewCustomOrigin=t,e.bindView=function(e,r){t(e,r.origin,r.camera.viewMatrix)},e.bindViewport=function(e,t){e.setUniform4fv("viewport",t.camera.fullViewport)}}(zr||(zr={}));const Er=(0,Hr.c)();var Ur=r(61514),Nr=r(72023),Vr=r(8681),kr=r(17811),Gr=r(88214);const Wr={mask:255},qr={function:{func:519,ref:2,mask:2},operation:{fail:7680,zFail:7680,zPass:0}},jr={function:{func:519,ref:2,mask:2},operation:{fail:7680,zFail:7680,zPass:7681}};var $r=r(71613),Zr=r(25117),Xr=r(84530),Kr=r(44624),Yr=r(10510);class Qr extends class{constructor(e,t){t&&(this._config=t.snapshot()),this._program=this.initializeProgram(e),e.commonUniformStore&&(this._commonUniformStore=e.commonUniformStore,this._commonUniformStore.subscribeProgram(this._program)),this._pipeline=this.initializePipeline(e)}dispose(){this._program&&(this._commonUniformStore&&this._commonUniformStore.unsubscribeProgram(this._program),this._program.dispose(),this._program=null)}reload(e){this._program&&(this._commonUniformStore&&this._commonUniformStore.unsubscribeProgram(this._program),this._program.dispose()),this._program=this.initializeProgram(e),this._commonUniformStore&&this._commonUniformStore.subscribeProgram(this._program)}get program(){return this._program}get pipeline(){return this._pipeline}get key(){return this._config.key}get configuration(){return this._config}bindPass(e,t,r){}bindMaterial(e,t,r){}bindDraw(e,t,r){}bindPipelineState(e){e.setPipelineState(this.pipeline)}ensureAttributeLocations(e){this.program.assertCompatibleVertexAttributeLocations(e)}get primitiveType(){return 4}}{initializeProgram(e){const t=Qr.shader.get(),r=this.configuration,i=t.build({OITEnabled:0===r.transparencyPassType,output:r.output,viewingMode:e.viewingMode,receiveShadows:r.receiveShadows,slicePlaneEnabled:r.slicePlaneEnabled,sliceHighlightDisabled:r.sliceHighlightDisabled,sliceEnabledForVertexPrograms:!1,symbolColor:r.symbolColors,vvSize:r.vvSize,vvColor:r.vvColor,vvInstancingEnabled:!0,instanced:r.instanced,instancedColor:r.instancedColor,instancedDoublePrecision:r.instancedDoublePrecision,useOldSceneLightInterface:!1,pbrMode:r.usePBR?r.isSchematic?2:1:0,hasMetalnessAndRoughnessTexture:r.hasMetalnessAndRoughnessTexture,hasEmissionTexture:r.hasEmissionTexture,hasOcclusionTexture:r.hasOcclusionTexture,hasNormalTexture:r.hasNormalTexture,hasColorTexture:r.hasColorTexture,receiveAmbientOcclusion:r.receiveAmbientOcclusion,useCustomDTRExponentForWater:!1,normalType:r.normalsTypeDerivate?3:0,doubleSidedMode:r.doubleSidedMode,vertexTangets:r.vertexTangents,attributeTextureCoordinates:r.hasMetalnessAndRoughnessTexture||r.hasEmissionTexture||r.hasOcclusionTexture||r.hasNormalTexture||r.hasColorTexture?1:0,textureAlphaPremultiplied:r.textureAlphaPremultiplied,attributeColor:r.vertexColors,screenSizePerspectiveEnabled:r.screenSizePerspective,verticalOffsetEnabled:r.verticalOffset,offsetBackfaces:r.offsetBackfaces,doublePrecisionRequiresObfuscation:(0,Zr.I)(e.rctx),alphaDiscardMode:r.alphaDiscardMode,supportsTextureAtlas:!1,multipassTerrainEnabled:r.multipassTerrainEnabled,cullAboveGround:r.cullAboveGround});return new Br.Z(e.rctx,i.generateSource("vertex"),i.generateSource("fragment"),gr)}bindPass(e,t,r){zr.bindProjectionMatrix(this.program,r.camera.projectionMatrix);const i=this.configuration.output;(1===this.configuration.output||r.multipassTerrainEnabled||3===i)&&this.program.setUniform2fv("cameraNearFar",r.camera.nearFar),r.multipassTerrainEnabled&&(this.program.setUniform2fv("inverseViewport",r.inverseViewport),(0,Gr.C)(this.program,e,r)),7===i&&(this.program.setUniform1f("opacity",t.opacity),this.program.setUniform1f("layerOpacity",t.layerOpacity),this.program.setUniform4fv("externalColor",t.externalColor),this.program.setUniform1i("colorMixMode",pr.FZ[t.colorMixMode])),0===i?(r.lighting.setUniforms(this.program,!1),this.program.setUniform3fv("ambient",t.ambient),this.program.setUniform3fv("diffuse",t.diffuse),this.program.setUniform4fv("externalColor",t.externalColor),this.program.setUniform1i("colorMixMode",pr.FZ[t.colorMixMode]),this.program.setUniform1f("opacity",t.opacity),this.program.setUniform1f("layerOpacity",t.layerOpacity),this.configuration.usePBR&&Kr.j.bindUniforms(this.program,t,this.configuration.isSchematic)):4===i&&Nr.bA.bindOutputHighlight(e,this.program,r),Vr.k.bindUniformsForSymbols(this.program,t),kr.L.bindUniforms(this.program,t,r),(0,pr.bj)(t.screenSizePerspective,this.program,"screenSizePerspectiveAlignment"),2!==t.textureAlphaMode&&3!==t.textureAlphaMode||this.program.setUniform1f("textureAlphaCutoff",t.textureAlphaCutoff)}bindDraw(e){const t=this.configuration.instancedDoublePrecision?(0,n.f)(e.camera.viewInverseTransposeMatrix[3],e.camera.viewInverseTransposeMatrix[7],e.camera.viewInverseTransposeMatrix[11]):e.origin;zr.bindViewCustomOrigin(this.program,t,e.camera.viewMatrix),(0===this.configuration.output||7===this.configuration.output||1===this.configuration.output&&this.configuration.screenSizePerspective||2===this.configuration.output&&this.configuration.screenSizePerspective||4===this.configuration.output&&this.configuration.screenSizePerspective)&&zr.bindCamPosition(this.program,t,e.camera.viewInverseTransposeMatrix),2===this.configuration.output&&this.program.setUniformMatrix4fv("viewNormal",e.camera.viewInverseTransposeMatrix),this.configuration.instancedDoublePrecision&&Xr.f.bindCustomOrigin(this.program,t),Ur.p.bindUniforms(this.program,this.configuration,e.slicePlane,t),0===this.configuration.output&&$r.h.bindViewCustomOrigin(this.program,e,t)}setPipeline(e,t){const r=this.configuration,i=3===e,n=2===e;return(0,Cr.sm)({blending:0!==r.output&&7!==r.output||!r.transparent?null:i?Mr:(o=e,2===o?null:1===o?Pr:Ar),culling:Jr(r),depthTest:{func:Fr(e)},depthWrite:i||n?r.writeDepth&&Cr.LZ:null,colorWrite:Cr.BK,stencilWrite:r.sceneHasOcludees?Wr:null,stencilTest:r.sceneHasOcludees?t?jr:qr:null,polygonOffset:i||n?null:Ir(r.enableOffset)});var o}initializePipeline(){return this._occludeePipelineState=this.setPipeline(this.configuration.transparencyPassType,!0),this.setPipeline(this.configuration.transparencyPassType,!1)}getPipelineState(e){return e?this._occludeePipelineState:this.pipeline}}Qr.shader=new Lr(Yr.D,(()=>r.e(2186).then(r.bind(r,72186))));const Jr=e=>function(e){return e.cullFace?0!==e.cullFace:!e.slicePlaneEnabled&&!e.transparent&&!e.doubleSidedMode}(e)&&{face:1===e.cullFace?1028:1029,mode:2305};class ei extends class{constructor(){this._key="",this._keyDirty=!1,this._parameterBits=this._parameterBits.map((()=>0))}get key(){return this._keyDirty&&(this._keyDirty=!1,this._key=String.fromCharCode.apply(String,this._parameterBits)),this._key}snapshot(){const e=this._parameterNames,t={key:this.key};for(const r of e)t[r]=this[r];return t}}{constructor(){super(...arguments),this.output=0,this.alphaDiscardMode=1,this.doubleSidedMode=0,this.isSchematic=!1,this.vertexColors=!1,this.offsetBackfaces=!1,this.symbolColors=!1,this.vvSize=!1,this.vvColor=!1,this.verticalOffset=!1,this.receiveShadows=!1,this.slicePlaneEnabled=!1,this.sliceHighlightDisabled=!1,this.receiveAmbientOcclusion=!1,this.screenSizePerspective=!1,this.textureAlphaPremultiplied=!1,this.hasColorTexture=!1,this.usePBR=!1,this.hasMetalnessAndRoughnessTexture=!1,this.hasEmissionTexture=!1,this.hasOcclusionTexture=!1,this.hasNormalTexture=!1,this.instanced=!1,this.instancedColor=!1,this.instancedDoublePrecision=!1,this.vertexTangents=!1,this.normalsTypeDerivate=!1,this.writeDepth=!0,this.sceneHasOcludees=!1,this.transparent=!1,this.enableOffset=!0,this.cullFace=0,this.transparencyPassType=3,this.multipassTerrainEnabled=!1,this.cullAboveGround=!0}}(0,Dr._)([Rr({count:8})],ei.prototype,"output",void 0),(0,Dr._)([Rr({count:4})],ei.prototype,"alphaDiscardMode",void 0),(0,Dr._)([Rr({count:3})],ei.prototype,"doubleSidedMode",void 0),(0,Dr._)([Rr()],ei.prototype,"isSchematic",void 0),(0,Dr._)([Rr()],ei.prototype,"vertexColors",void 0),(0,Dr._)([Rr()],ei.prototype,"offsetBackfaces",void 0),(0,Dr._)([Rr()],ei.prototype,"symbolColors",void 0),(0,Dr._)([Rr()],ei.prototype,"vvSize",void 0),(0,Dr._)([Rr()],ei.prototype,"vvColor",void 0),(0,Dr._)([Rr()],ei.prototype,"verticalOffset",void 0),(0,Dr._)([Rr()],ei.prototype,"receiveShadows",void 0),(0,Dr._)([Rr()],ei.prototype,"slicePlaneEnabled",void 0),(0,Dr._)([Rr()],ei.prototype,"sliceHighlightDisabled",void 0),(0,Dr._)([Rr()],ei.prototype,"receiveAmbientOcclusion",void 0),(0,Dr._)([Rr()],ei.prototype,"screenSizePerspective",void 0),(0,Dr._)([Rr()],ei.prototype,"textureAlphaPremultiplied",void 0),(0,Dr._)([Rr()],ei.prototype,"hasColorTexture",void 0),(0,Dr._)([Rr()],ei.prototype,"usePBR",void 0),(0,Dr._)([Rr()],ei.prototype,"hasMetalnessAndRoughnessTexture",void 0),(0,Dr._)([Rr()],ei.prototype,"hasEmissionTexture",void 0),(0,Dr._)([Rr()],ei.prototype,"hasOcclusionTexture",void 0),(0,Dr._)([Rr()],ei.prototype,"hasNormalTexture",void 0),(0,Dr._)([Rr()],ei.prototype,"instanced",void 0),(0,Dr._)([Rr()],ei.prototype,"instancedColor",void 0),(0,Dr._)([Rr()],ei.prototype,"instancedDoublePrecision",void 0),(0,Dr._)([Rr()],ei.prototype,"vertexTangents",void 0),(0,Dr._)([Rr()],ei.prototype,"normalsTypeDerivate",void 0),(0,Dr._)([Rr()],ei.prototype,"writeDepth",void 0),(0,Dr._)([Rr()],ei.prototype,"sceneHasOcludees",void 0),(0,Dr._)([Rr()],ei.prototype,"transparent",void 0),(0,Dr._)([Rr()],ei.prototype,"enableOffset",void 0),(0,Dr._)([Rr({count:3})],ei.prototype,"cullFace",void 0),(0,Dr._)([Rr({count:4})],ei.prototype,"transparencyPassType",void 0),(0,Dr._)([Rr()],ei.prototype,"multipassTerrainEnabled",void 0),(0,Dr._)([Rr()],ei.prototype,"cullAboveGround",void 0);var ti=r(79733);class ri extends Qr{initializeProgram(e){const t=ri.shader.get(),r=this.configuration,i=t.build({OITEnabled:0===r.transparencyPassType,output:r.output,viewingMode:e.viewingMode,receiveShadows:r.receiveShadows,slicePlaneEnabled:r.slicePlaneEnabled,sliceHighlightDisabled:r.sliceHighlightDisabled,sliceEnabledForVertexPrograms:!1,symbolColor:r.symbolColors,vvSize:r.vvSize,vvColor:r.vvColor,vvInstancingEnabled:!0,instanced:r.instanced,instancedColor:r.instancedColor,instancedDoublePrecision:r.instancedDoublePrecision,useOldSceneLightInterface:!1,pbrMode:r.usePBR?1:0,hasMetalnessAndRoughnessTexture:!1,hasEmissionTexture:!1,hasOcclusionTexture:!1,hasNormalTexture:!1,hasColorTexture:r.hasColorTexture,receiveAmbientOcclusion:r.receiveAmbientOcclusion,useCustomDTRExponentForWater:!1,normalType:0,doubleSidedMode:2,vertexTangets:!1,attributeTextureCoordinates:r.hasColorTexture?1:0,textureAlphaPremultiplied:r.textureAlphaPremultiplied,attributeColor:r.vertexColors,screenSizePerspectiveEnabled:r.screenSizePerspective,verticalOffsetEnabled:r.verticalOffset,offsetBackfaces:r.offsetBackfaces,doublePrecisionRequiresObfuscation:(0,Zr.I)(e.rctx),alphaDiscardMode:r.alphaDiscardMode,supportsTextureAtlas:!1,multipassTerrainEnabled:r.multipassTerrainEnabled,cullAboveGround:r.cullAboveGround});return new Br.Z(e.rctx,i.generateSource("vertex"),i.generateSource("fragment"),gr)}}ri.shader=new Lr(ti.R,(()=>r.e(1343).then(r.bind(r,41343))));class ii extends vr{constructor(e){super(e,oi),this.supportsEdges=!0,this.techniqueConfig=new ei,this.vertexBufferLayout=ii.getVertexBufferLayout(this.params),this.instanceBufferLayout=e.instanced?ii.getInstanceBufferLayout(this.params):null}isVisibleInPass(e){return 4!==e&&6!==e&&7!==e||this.params.castShadows}isVisible(){const e=this.params;if(!super.isVisible()||0===e.layerOpacity)return!1;const t=e.instanced,r=e.vertexColors,i=e.symbolColors,n=!!t&&t.indexOf("color")>-1,o=e.vvColorEnabled,a="replace"===e.colorMixMode,s=e.opacity>0,c=e.externalColor&&e.externalColor[3]>0;return r&&(n||o||i)?!!a||s:r?a?c:s:n||o||i?!!a||s:a?c:s}getTechniqueConfig(e,t){return this.techniqueConfig.output=e,this.techniqueConfig.hasNormalTexture=!!this.params.normalTextureId,this.techniqueConfig.hasColorTexture=!!this.params.textureId,this.techniqueConfig.vertexTangents=this.params.vertexTangents,this.techniqueConfig.instanced=!!this.params.instanced,this.techniqueConfig.instancedDoublePrecision=this.params.instancedDoublePrecision,this.techniqueConfig.vvSize=this.params.vvSizeEnabled,this.techniqueConfig.verticalOffset=null!==this.params.verticalOffset,this.techniqueConfig.screenSizePerspective=null!==this.params.screenSizePerspective,this.techniqueConfig.slicePlaneEnabled=this.params.slicePlaneEnabled,this.techniqueConfig.sliceHighlightDisabled=this.params.sliceHighlightDisabled,this.techniqueConfig.alphaDiscardMode=this.params.textureAlphaMode,this.techniqueConfig.normalsTypeDerivate="screenDerivative"===this.params.normals,this.techniqueConfig.transparent=this.params.transparent,this.techniqueConfig.writeDepth=this.params.writeDepth,this.techniqueConfig.sceneHasOcludees=this.params.sceneHasOcludees,this.techniqueConfig.cullFace=null!=this.params.cullFace?this.params.cullFace:0,this.techniqueConfig.multipassTerrainEnabled=!!t&&t.multipassTerrainEnabled,this.techniqueConfig.cullAboveGround=!t||t.cullAboveGround,0!==e&&7!==e||(this.techniqueConfig.vertexColors=this.params.vertexColors,this.techniqueConfig.symbolColors=this.params.symbolColors,this.params.treeRendering?this.techniqueConfig.doubleSidedMode=2:this.techniqueConfig.doubleSidedMode=this.params.doubleSided&&"normal"===this.params.doubleSidedType?1:this.params.doubleSided&&"winding-order"===this.params.doubleSidedType?2:0,this.techniqueConfig.instancedColor=!!this.params.instanced&&this.params.instanced.indexOf("color")>-1,this.techniqueConfig.receiveShadows=this.params.receiveShadows&&this.params.shadowMappingEnabled,this.techniqueConfig.receiveAmbientOcclusion=!(!t||!t.ssaoEnabled)&&this.params.receiveSSAO,this.techniqueConfig.vvColor=this.params.vvColorEnabled,this.techniqueConfig.textureAlphaPremultiplied=!!this.params.textureAlphaPremultiplied,this.techniqueConfig.usePBR=this.params.usePBR,this.techniqueConfig.hasMetalnessAndRoughnessTexture=!!this.params.metallicRoughnessTextureId,this.techniqueConfig.hasEmissionTexture=!!this.params.emissiveTextureId,this.techniqueConfig.hasOcclusionTexture=!!this.params.occlusionTextureId,this.techniqueConfig.offsetBackfaces=!(!this.params.transparent||!this.params.offsetTransparentBackfaces),this.techniqueConfig.isSchematic=this.params.usePBR&&this.params.isSchematic,this.techniqueConfig.transparencyPassType=t?t.transparencyPassType:3,this.techniqueConfig.enableOffset=!t||t.camera.relativeElevation<5e5),this.techniqueConfig}intersect(e,t,r,n,a,s,c){if(null!==this.params.verticalOffset){const e=n.camera;(0,o.s)(fi,r[12],r[13],r[14]);let t=null;switch(n.viewingMode){case 1:t=(0,o.n)(ui,fi);break;case 2:t=(0,o.g)(ui,li)}let i=0;if(null!==this.params.verticalOffset){const r=(0,o.f)(hi,fi,e.eye),n=(0,o.l)(r),a=(0,o.a)(r,r,1/n);let s=null;this.params.screenSizePerspective&&(s=(0,o.d)(t,a)),i+=(0,pr.Hx)(e,n,this.params.verticalOffset,s,this.params.screenSizePerspective)}(0,o.a)(t,t,i),(0,o.t)(di,t,n.transform.inverseRotation),a=(0,o.f)(si,a,di),s=(0,o.f)(ci,s,di)}(0,pr.Bw)(e,t,n,a,s,function(e){return(0,i.pC)(e)?(lr.offset=e,lr):null}(n.verticalOffset),c)}getGLMaterial(e){if(0===e.output||7===e.output||1===e.output||2===e.output||3===e.output||4===e.output)return new ni(e)}createBufferWriter(){return new ai(this.vertexBufferLayout,this.instanceBufferLayout)}static getVertexBufferLayout(e){const t=e.textureId||e.normalTextureId||e.metallicRoughnessTextureId||e.emissiveTextureId||e.occlusionTextureId,r=(0,le.U$)().vec3f("position").vec3f("normal");return e.vertexTangents&&r.vec4f("tangent"),t&&r.vec2f("uv0"),e.vertexColors&&r.vec4u8("color"),e.symbolColors&&r.vec4u8("symbolColor"),r}static getInstanceBufferLayout(e){let t=(0,le.U$)();return t=e.instancedDoublePrecision?t.vec3f("modelOriginHi").vec3f("modelOriginLo").mat3f("model").mat3f("modelNormal"):t.mat4f("model").mat4f("modelNormal"),e.instanced&&e.instanced.indexOf("color")>-1&&(t=t.vec4f("instanceColor")),e.instanced&&e.instanced.indexOf("featureAttribute")>-1&&(t=t.vec4f("instanceFeatureAttribute")),t}}class ni extends mr{constructor(e){const t=e.material;super({...e,...t.params}),this.updateParameters()}updateParameters(e){const t=this.material.params;this.updateTexture(t.textureId),this.technique=t.treeRendering?this.techniqueRep.acquireAndReleaseExisting(ri,this.material.getTechniqueConfig(this.output,e),this.technique):this.techniqueRep.acquireAndReleaseExisting(Qr,this.material.getTechniqueConfig(this.output,e),this.technique)}selectPipelines(){}_updateShadowState(e){e.shadowMappingEnabled!==this.material.params.shadowMappingEnabled&&this.material.setParameterValues({shadowMappingEnabled:e.shadowMappingEnabled})}_updateOccludeeState(e){e.hasOccludees!==this.material.params.sceneHasOcludees&&this.material.setParameterValues({sceneHasOcludees:e.hasOccludees})}ensureParameters(e){0!==this.output&&7!==this.output||(this._updateShadowState(e),this._updateOccludeeState(e)),this.updateParameters(e)}bind(e,t){e.bindProgram(this.technique.program),this.technique.bindPass(e,this.material.params,t),this.bindTexture(e,this.technique.program)}beginSlot(e){return e===(this.material.params.transparent?this.material.params.writeDepth?5:8:3)}getPipelineState(e,t){return this.technique.getPipelineState(t)}}const oi={textureId:void 0,initTextureTransparent:!1,isSchematic:!1,usePBR:!1,normalTextureId:void 0,vertexTangents:!1,occlusionTextureId:void 0,emissiveTextureId:void 0,metallicRoughnessTextureId:void 0,emissiveFactor:[0,0,0],mrrFactors:[0,1,.5],ambient:[.2,.2,.2],diffuse:[.8,.8,.8],externalColor:[1,1,1,1],colorMixMode:"multiply",opacity:1,layerOpacity:1,vertexColors:!1,symbolColors:!1,doubleSided:!1,doubleSidedType:"normal",cullFace:void 0,instanced:void 0,instancedDoublePrecision:!1,normals:"default",receiveSSAO:!0,receiveShadows:!0,castShadows:!0,shadowMappingEnabled:!1,verticalOffset:null,screenSizePerspective:null,slicePlaneEnabled:!1,sliceHighlightDisabled:!1,offsetTransparentBackfaces:!1,vvSizeEnabled:!1,vvSizeMinSize:[1,1,1],vvSizeMaxSize:[100,100,100],vvSizeOffset:[0,0,0],vvSizeFactor:[1,1,1],vvSizeValue:[1,1,1],vvColorEnabled:!1,vvColorValues:[0,0,0,0,0,0,0,0],vvColorColors:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],vvSymbolAnchor:[0,0,0],vvSymbolRotationMatrix:(0,c.a)(),transparent:!1,writeDepth:!0,textureAlphaMode:0,textureAlphaCutoff:Sr.F,textureAlphaPremultiplied:!1,sceneHasOcludees:!1,renderOccluded:1};class ai{constructor(e,t){this.vertexBufferLayout=e,this.instanceBufferLayout=t}allocate(e){return this.vertexBufferLayout.createBuffer(e)}elementCount(e){return e.indices.get("position").length}write(e,t,r,i){!function(e,t,r,i,n,o){for(const a of t.fieldNames){const t=e.vertexAttributes.get(a),s=e.indices.get(a);if(t&&s)switch(a){case"position":{(0,b.hu)(3===t.size);const e=n.getField(a,d.ct);e&&_r(s,t.data,r,e,o);break}case"normal":{(0,b.hu)(3===t.size);const e=n.getField(a,d.ct);e&&wr(s,t.data,i,e,o,1);break}case"uv0":{(0,b.hu)(2===t.size);const e=n.getField(a,d.Eu);e&&br(s,t.data,e,o);break}case"color":{(0,b.hu)(3===t.size||4===t.size);const e=n.getField(a,d.mc);e&&Tr(s,t.data,t.size,e,o);break}case"symbolColor":{(0,b.hu)(3===t.size||4===t.size);const e=n.getField(a,d.mc);e&&Tr(s,t.data,t.size,e,o);break}case"tangent":{(0,b.hu)(4===t.size);const e=n.getField(a,d.ek);e&&yr(s,t.data,e,o);break}}}}(t,this.vertexBufferLayout,e.transformation,e.invTranspTransformation,r,i)}}const si=(0,n.c)(),ci=(0,n.c)(),li=(0,n.f)(0,0,1),ui=(0,n.c)(),di=(0,n.c)(),fi=(0,n.c)(),hi=(0,n.c)();var mi=r(94588),pi=r(6962),gi=r(32656),vi=r(10923),bi=r(39105),xi=r(35470),yi=r(4094),_i=r(41419),wi=r(6091),Ti=r(8634),Si=r(57319),Ci=r(69595),Mi=r(74038);const Ai=[{name:"position",count:2,type:5126,offset:0,stride:8,normalized:!1}],Pi=[{name:"position",count:2,type:5126,offset:0,stride:16,normalized:!1},{name:"uv0",count:2,type:5126,offset:8,stride:16,normalized:!1}];var Oi=r(84570),Ii=r(12973);let Fi,Di=null,Li=null;const Ri=f.Z.getLogger("esri.views.3d.webgl-engine.lib.DDSUtil");function zi(e){return e.charCodeAt(0)+(e.charCodeAt(1)<<8)+(e.charCodeAt(2)<<16)+(e.charCodeAt(3)<<24)}const Bi=zi("DXT1"),Hi=zi("DXT3"),Ei=zi("DXT5");class Ui extends T{constructor(e,t){super(),this.data=e,this.type=4,this.glTexture=null,this.powerOfTwoStretchInfo=null,this.loadingPromise=null,this.loadingController=null,this.events=new xi.Z,this.params=t||{},this.params.mipmap=!1!==this.params.mipmap,this.params.noUnpackFlip=this.params.noUnpackFlip||!1,this.params.preMultiplyAlpha=this.params.preMultiplyAlpha||!1,this.params.wrap=this.params.wrap||{s:10497,t:10497},this.params.powerOfTwoResizeMode=this.params.powerOfTwoResizeMode||1,this.estimatedTexMemRequired=Ui.estimateTexMemRequired(this.data,this.params),this.startPreload()}startPreload(){const e=this.data;(0,i.Wi)(e)||(e instanceof HTMLVideoElement?this.startPreloadVideoElement(e):e instanceof HTMLImageElement&&this.startPreloadImageElement(e))}startPreloadVideoElement(e){(0,vi.jc)(e.src)||"auto"===e.preload&&e.crossOrigin||(e.preload="auto",e.crossOrigin="anonymous",e.src=e.src)}startPreloadImageElement(e){(0,vi.HK)(e.src)||(0,vi.jc)(e.src)||e.crossOrigin||(e.crossOrigin="anonymous",e.src=e.src)}static getDataDimensions(e){return e instanceof HTMLVideoElement?{width:e.videoWidth,height:e.videoHeight}:e}static estimateTexMemRequired(e,t){if((0,i.Wi)(e))return 0;if((0,pi.eP)(e)||(0,pi.lq)(e))return t.encoding===Ui.BASIS_ENCODING?function(e){if((0,i.Wi)(Di))return e.byteLength;const t=new Di.BasisFile(new Uint8Array(e));if(t.getNumImages()<1)return 0;const r=t.getNumLevels(0),n=t.getHasAlpha(),o=t.getImageWidth(0,0),a=t.getImageHeight(0,0);t.close(),t.delete();const s=(0,Si.RG)(n?37496:37492),c=(4**r-1)/(3*4**(r-1));return Math.ceil(o*a*s*c)}(e):e.byteLength;const{width:r,height:n}=e instanceof Image||e instanceof ImageData||e instanceof HTMLCanvasElement||e instanceof HTMLVideoElement?Ui.getDataDimensions(e):t;return(t.mipmap?4/3:1)*r*n*(t.components||4)||0}dispose(){this.data=void 0}get width(){return this.params.width}get height(){return this.params.height}createDescriptor(e){const t=this.params.mipmap&&!this.params.disableAnisotropy;return{target:3553,pixelFormat:6408,dataType:5121,wrapMode:this.params.wrap,flipped:!this.params.noUnpackFlip,samplingMode:this.params.mipmap?9987:9729,hasMipmap:this.params.mipmap,preMultiplyAlpha:this.params.preMultiplyAlpha,maxAnisotropy:t?e.parameters.maxMaxAnisotropy:void 0}}load(e,t){if((0,i.pC)(this.glTexture))return this.glTexture;if((0,i.pC)(this.loadingPromise))return this.loadingPromise;const r=this.data;return(0,i.Wi)(r)?(this.glTexture=new Ti.Z(e,this.createDescriptor(e),null),e.bindTexture(this.glTexture,0),this.glTexture):"string"==typeof r?this.loadFromURL(e,t,r):r instanceof Image?this.loadFromImageElement(e,t,r):r instanceof HTMLVideoElement?this.loadFromVideoElement(e,t,r):r instanceof ImageData||r instanceof HTMLCanvasElement?this.loadFromImage(e,r,t):((0,pi.eP)(r)||(0,pi.lq)(r))&&this.params.encoding===Ui.DDS_ENCODING?this.loadFromDDSData(e,r):((0,pi.eP)(r)||(0,pi.lq)(r))&&this.params.encoding===Ui.BASIS_ENCODING?this.loadFromBasis(e,r):(0,pi.lq)(r)?this.loadFromPixelData(e,r):(0,pi.eP)(r)?this.loadFromPixelData(e,new Uint8Array(r)):null}get requiresFrameUpdates(){return this.data instanceof HTMLVideoElement}frameUpdate(e,t,r){if(!(this.data instanceof HTMLVideoElement)||(0,i.Wi)(this.glTexture))return r;if(this.data.readyState<2||r===this.data.currentTime)return r;if((0,i.pC)(this.powerOfTwoStretchInfo)){const{framebuffer:r,vao:i,sourceTexture:n}=this.powerOfTwoStretchInfo;n.setData(this.data),this.drawStretchedTexture(e,t,r,i,n,this.glTexture)}else{const{width:e,height:t}=this.data,{width:r,height:i}=this.glTexture.descriptor;e!==r||t!==i?this.glTexture.updateData(0,0,0,Math.min(e,r),Math.min(t,i),this.data):this.glTexture.setData(this.data)}return this.glTexture.descriptor.hasMipmap&&this.glTexture.generateMipmap(),this.data.currentTime}loadFromDDSData(e,t){return this.glTexture=function(e,t,r,i){const{textureData:n,internalFormat:o,width:a,height:s}=function(e,t){const r=new Int32Array(e,0,31);if(542327876!==r[0])return Ri.error("Invalid magic number in DDS header"),null;if(!(4&r[20]))return Ri.error("Unsupported format, must contain a FourCC code"),null;const i=r[21];let n,o;switch(i){case Bi:n=8,o=33776;break;case Hi:n=16,o=33778;break;case Ei:n=16,o=33779;break;default:return Ri.error("Unsupported FourCC code:",function(e){return String.fromCharCode(255&e,e>>8&255,e>>16&255,e>>24&255)}(i)),null}let a=1,s=r[4],c=r[3];0==(3&s)&&0==(3&c)||(Ri.warn("Rounding up compressed texture size to nearest multiple of 4."),s=s+3&-4,c=c+3&-4);const l=s,u=c;let d,f;131072&r[2]&&!1!==t&&(a=Math.max(1,r[7])),1===a||(0,B.wt)(s)&&(0,B.wt)(c)||(Ri.warn("Ignoring mipmaps of non power of two sized compressed texture."),a=1);let h=r[1]+4;const m=[];for(let t=0;t<a;++t)f=(s+3>>2)*(c+3>>2)*n,d=new Uint8Array(e,h,f),m.push(d),h+=f,s=Math.max(1,s>>1),c=Math.max(1,c>>1);return{textureData:{type:"compressed",levels:m},internalFormat:o,width:l,height:u}}(r,i);t.samplingMode=n.levels.length>1?9987:9729,t.hasMipmap=n.levels.length>1,t.internalFormat=o,t.width=a,t.height=s;const c=new Ti.Z(e,t,n);return e.bindTexture(c,0),c}(e,this.createDescriptor(e),t,this.params.mipmap),e.bindTexture(this.glTexture,0),this.glTexture}loadFromBasis(e,t){return this.loadAsync((()=>async function(e,t,n){(0,i.Wi)(Di)&&(Di=await async function(){return(0,i.Wi)(Li)&&(Li=function(){if((0,i.Wi)(Fi)){const e=e=>(0,Ii.V)(`esri/libs/basisu/${e}`);Fi=r.e(3886).then(r.bind(r,33886)).then((function(e){return e.b})).then((({default:t})=>t({locateFile:e}).then((e=>(e.initializeBasis(),delete e.then,e)))))}return Fi}(),Di=await Li),Li}());const o=new Di.BasisFile(new Uint8Array(n));if(o.getNumImages()<1)return null;const a=o.getNumLevels(0),s=o.getHasAlpha(),c=o.getImageWidth(0,0),l=o.getImageHeight(0,0),{compressedTextureETC:u,compressedTextureS3TC:d}=e.capabilities,[f,h]=u?s?[1,37496]:[0,37492]:d?s?[3,33779]:[2,33776]:[13,6408];o.startTranscoding();const m=[];for(let e=0;e<a;e++)m.push(new Uint8Array(o.getImageTranscodedSizeInBytes(0,e,f))),o.transcodeImage(m[e],0,e,f,0,0);o.close(),o.delete();const p={...t,samplingMode:a>1?9987:9729,hasMipmap:a>1,internalFormat:h,width:c,height:l};return new Ti.Z(e,p,{type:"compressed",levels:m})}(e,this.createDescriptor(e),t).then((e=>(this.glTexture=e,e)))))}loadFromPixelData(e,t){(0,b.hu)(this.params.width>0&&this.params.height>0);const r=this.createDescriptor(e);return r.pixelFormat=1===this.params.components?6409:3===this.params.components?6407:6408,r.width=this.params.width,r.height=this.params.height,this.glTexture=new Ti.Z(e,r,t),e.bindTexture(this.glTexture,0),this.glTexture}async loadAsync(e){const t=(0,bi.yi)();this.loadingController=t;const r=e(t.signal);this.loadingPromise=r;const i=()=>{this.loadingController===t&&(this.loadingController=null),this.loadingPromise===r&&(this.loadingPromise=null)};return r.then(i,i),r}loadFromURL(e,t,r){return this.loadAsync((async i=>{const n=await(0,_i.t)(r,{signal:i});return this.loadFromImage(e,n,t)}))}loadFromImageElement(e,t,r){return r.complete?this.loadFromImage(e,r,t):this.loadAsync((async i=>{const n=await(0,yi.f)(r,r.src,!1,i);return this.loadFromImage(e,n,t)}))}loadFromVideoElement(e,t,r){return r.readyState>=2?this.loadFromImage(e,r,t):this.loadFromVideoElementAsync(e,t,r)}loadFromVideoElementAsync(e,t,r){return this.loadAsync((n=>new Promise(((o,a)=>{const s=()=>{r.removeEventListener("loadeddata",c),r.removeEventListener("error",l),(0,i.pC)(u)&&u.remove()},c=()=>{r.readyState>=2&&(s(),o(this.loadFromImage(e,r,t)))},l=e=>{s(),a(e||new gi.Z("Failed to load video"))};r.addEventListener("loadeddata",c),r.addEventListener("error",l);const u=(0,bi.fu)(n,(()=>l((0,bi.zE)())))}))))}loadFromImage(e,t,r){const i=Ui.getDataDimensions(t);this.params.width=i.width,this.params.height=i.height;const n=this.createDescriptor(e);return n.pixelFormat=3===this.params.components?6407:6408,!this.requiresPowerOfTwo(e,n)||(0,B.wt)(i.width)&&(0,B.wt)(i.height)?(n.width=i.width,n.height=i.height,this.glTexture=new Ti.Z(e,n,t),e.bindTexture(this.glTexture,0),this.glTexture):(this.glTexture=this.makePowerOfTwoTexture(e,t,i,n,r),e.bindTexture(this.glTexture,0),this.glTexture)}requiresPowerOfTwo(e,t){const r=33071,i="number"==typeof t.wrapMode?t.wrapMode===r:t.wrapMode.s===r&&t.wrapMode.t===r;return!(0,wi.Z)(e.gl)&&(t.hasMipmap||!i)}makePowerOfTwoTexture(e,t,r,i,n){const{width:o,height:a}=r,s=(0,B.Sf)(o),c=(0,B.Sf)(a);let l;switch(i.width=s,i.height=c,this.params.powerOfTwoResizeMode){case 2:i.textureCoordinateScaleFactor=[o/s,a/c],l=new Ti.Z(e,i),l.updateData(0,0,0,o,a,t);break;case 1:case null:case void 0:l=this.stretchToPowerOfTwo(e,t,i,n);break;default:(0,mi.Bg)(this.params.powerOfTwoResizeMode)}return i.hasMipmap&&l.generateMipmap(),l}stretchToPowerOfTwo(e,t,r,i){const n=new Ti.Z(e,r),o=new Oi.Z(e,{colorTarget:0,depthStencilTarget:0},n),a=new Ti.Z(e,{target:3553,pixelFormat:r.pixelFormat,dataType:5121,wrapMode:33071,samplingMode:9729,flipped:!!r.flipped,maxAnisotropy:8,preMultiplyAlpha:r.preMultiplyAlpha},t),s=function(e,t=Ai,r=gr,i=-1,n=1){let o=null;switch(t){case Pi:o=new Float32Array([i,i,0,0,n,i,1,0,i,n,0,1,n,n,1,1]);break;case Ai:default:o=new Float32Array([i,i,n,i,i,n,n,n])}return new Mi.Z(e,r,{geometry:t},{geometry:Ci.Z.createVertex(e,35044,o)})}(e);return this.drawStretchedTexture(e,i,o,s,a,n),this.requiresFrameUpdates?this.powerOfTwoStretchInfo={vao:s,sourceTexture:a,framebuffer:o}:(s.dispose(!0),a.dispose(),o.detachColorTexture(),e.bindFramebuffer(null),o.dispose()),n}drawStretchedTexture(e,t,r,i,n,o){e.bindFramebuffer(r);const a=e.getViewport();e.setViewport(0,0,o.descriptor.width,o.descriptor.height);const s=t.program;e.bindProgram(s),s.setUniform4f("color",1,1,1,1),s.setUniform1i("tex",0),e.bindTexture(n,0),e.bindVAO(i),e.setPipelineState(t.pipeline),e.drawArrays(5,0,(0,Si._V)(i,"geometry")),e.bindFramebuffer(null),e.setViewport(a.x,a.y,a.width,a.height)}unload(){if((0,i.pC)(this.powerOfTwoStretchInfo)){const{framebuffer:e,vao:t,sourceTexture:r}=this.powerOfTwoStretchInfo;t.dispose(!0),r.dispose(),e.dispose(),this.glTexture=null,this.powerOfTwoStretchInfo=null}if((0,i.pC)(this.glTexture)&&(this.glTexture.dispose(),this.glTexture=null),(0,i.pC)(this.loadingController)){const e=this.loadingController;this.loadingController=null,this.loadingPromise=null,e.abort()}this.events.emit("unloaded")}}Ui.DDS_ENCODING="image/vnd-ms.dds",Ui.BASIS_ENCODING="image/x.basis";var Ni=r(36654),Vi=r(59351);class ki{constructor(e){this.streamDataRequester=e}async loadJSON(e,t){return this.load("json",e,t)}async loadBinary(e,t){return(0,vi.HK)(e)?((0,bi.k_)(t),(0,vi.AH)(e)):this.load("binary",e,t)}async loadImage(e,t){return this.load("image",e,t)}async load(e,t,r){if((0,i.Wi)(this.streamDataRequester))return(await(0,Ni.default)(t,{responseType:Gi[e]})).data;const n=await(0,Vi.q6)(this.streamDataRequester.request(t,e,r));if(!0===n.ok)return n.value;throw(0,bi.r9)(n.error),new gi.Z("",`Request for resource failed: ${n.error}`)}}const Gi={image:"image",binary:"array-buffer",json:"json"};var Wi=r(45072);function qi(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let e=0;e<s;++e)i[c]=o[l],i[c+1]=o[l+1],c+=n,l+=a}function ji(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;if((0,Wi.U)(t.elementType)){const e=(0,Wi.Op)(t.elementType);if((0,Wi.B3)(t.elementType))for(let t=0;t<s;++t)i[c]=Math.max(o[l]/e,-1),i[c+1]=Math.max(o[l+1]/e,-1),c+=n,l+=a;else for(let t=0;t<s;++t)i[c]=o[l]/e,i[c+1]=o[l+1]/e,c+=n,l+=a}else qi(e,t,r);return e}function $i(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let e=0;e<s;++e)i[c]=o[l],i[c+1]=o[l+1],i[c+2]=o[l+2],c+=n,l+=a}function Zi(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let e=0;e<s;++e)i[c]=o[l],i[c+1]=o[l+1],i[c+2]=o[l+2],i[c+3]=o[l+3],c+=n,l+=a}function Xi(e,t,r,i,n,o){const a=e.typedBuffer,s=e.typedBufferStride,c=o?o.count:e.count;let l=(o&&o.dstIndex?o.dstIndex:0)*s;for(let e=0;e<c;++e)a[l]=t,a[l+1]=r,a[l+2]=i,a[l+3]=n,l+=s}function Ki(e,t){const r=e.count;t||(t=new e.TypedArrayConstructor(r));for(let i=0;i<r;i++)t[i]=e.get(i);return t}function Yi(e,t){return new e(new ArrayBuffer(t*e.ElementCount*(0,Wi.n1)(e.ElementType)))}Object.freeze({__proto__:null,copy:qi,normalizeIntegerBuffer:ji}),Object.freeze({__proto__:null,copy:$i}),Object.freeze({__proto__:null,copy:Zi,fill:Xi}),Object.freeze({__proto__:null,copy:function(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let e=0;e<s;++e){for(let e=0;e<9;++e)i[c+e]=o[l+e];c+=n,l+=a}}}),Object.freeze({__proto__:null,copy:function(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let e=0;e<s;++e){for(let e=0;e<16;++e)i[c+e]=o[l+e];c+=n,l+=a}}}),Object.freeze({__proto__:null,copy:function(e,t,r){const i=e.typedBuffer,n=e.typedBufferStride,o=t.typedBuffer,a=t.typedBufferStride,s=r?r.count:t.count;let c=(r&&r.dstIndex?r.dstIndex:0)*n,l=(r&&r.srcIndex?r.srcIndex:0)*a;for(let e=0;e<s;++e)i[c]=o[l],c+=n,l+=a},makeDense:Ki});const Qi=f.Z.getLogger("esri.views.3d.glTF");var Ji=r(34175);class en{constructor(e){this.data=e,this.offset4=0,this.dataUint32=new Uint32Array(this.data,0,Math.floor(this.data.byteLength/4))}readUint32(){const e=this.offset4;return this.offset4+=1,this.dataUint32[e]}readUint8Array(e){const t=4*this.offset4;return this.offset4+=e/4,new Uint8Array(this.data,t,e)}remainingBytes(){return this.data.byteLength-4*this.offset4}}const tn={baseColorFactor:[1,1,1,1],metallicFactor:1,roughnessFactor:1},rn={pbrMetallicRoughness:tn,emissiveFactor:[0,0,0],alphaMode:"OPAQUE",alphaCutoff:.5,doubleSided:!1},nn={ESRI_externalColorMixMode:"tint"},on=(e={})=>{const t={...tn,...e.pbrMetallicRoughness},r=function(e){switch(e.ESRI_externalColorMixMode){case"multiply":case"tint":case"ignore":case"replace":break;default:(0,mi.Bg)(e.ESRI_externalColorMixMode),e.ESRI_externalColorMixMode="tint"}return e}({...nn,...e.extras});return{...rn,...e,pbrMetallicRoughness:t,extras:r}},an={magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497},sn=1179937895;class cn{constructor(e,t,r,i,n){this.context=e,this.errorContext=t,this.uri=r,this.json=i,this.glbBuffer=n,this.bufferCache=new Map,this.textureCache=new Map,this.materialCache=new Map,this.nodeParentMap=new Map,this.nodeTransformCache=new Map,this.baseUri=function(e){let t,r;return e.replace(/^(.*\/)?([^/]*)$/,((e,i,n)=>(t=i||"",r=n||"",""))),{dirPart:t,filePart:r}}(this.uri).dirPart,this.checkVersionSupported(),this.checkRequiredExtensionsSupported(),t.errorUnsupportedIf(null==i.scenes,"Scenes must be defined."),t.errorUnsupportedIf(null==i.meshes,"Meshes must be defined"),t.errorUnsupportedIf(null==i.nodes,"Nodes must be defined."),this.computeNodeParents()}static async load(e,t,r,i){if((0,vi.HK)(r)){const i=(0,vi.sJ)(r);if("model/gltf-binary"!==i.mediaType)try{const n=JSON.parse(i.isBase64?atob(i.data):i.data);return new cn(e,t,r,n)}catch{}const n=(0,vi.AH)(r);if(cn.isGLBData(n))return this.fromGLBData(e,t,r,n)}if(r.endsWith(".gltf")){const n=await e.loadJSON(r,i);return new cn(e,t,r,n)}const n=await e.loadBinary(r,i);if(cn.isGLBData(n))return this.fromGLBData(e,t,r,n);const o=await e.loadJSON(r,i);return new cn(e,t,r,o)}static isGLBData(e){const t=new en(e);return t.remainingBytes()>=4&&t.readUint32()===sn}static async fromGLBData(e,t,r,i){const n=await cn.parseGLBData(t,i);return new cn(e,t,r,n.json,n.binaryData)}static async parseGLBData(e,t){const r=new en(t);e.assert(r.remainingBytes()>=12,"GLB binary data is insufficiently large.");const i=r.readUint32(),n=r.readUint32(),o=r.readUint32();e.assert(i===sn,"Magic first 4 bytes do not fit to expected GLB value."),e.assert(t.byteLength>=o,"GLB binary data is smaller than header specifies."),e.errorUnsupportedIf(2!==n,"An unsupported GLB container version was detected. Only version 2 is supported.");let a,s,c=0;for(;r.remainingBytes()>=8;){const t=r.readUint32(),i=r.readUint32();0===c?(e.assert(1313821514===i,"First GLB chunk must be JSON."),e.assert(t>=0,"No JSON data found."),a=await mn(r.readUint8Array(t))):1===c?(e.errorUnsupportedIf(5130562!==i,"Second GLB chunk expected to be BIN."),s=r.readUint8Array(t)):e.warnUnsupported("More than 2 GLB chunks detected. Skipping."),c+=1}return a||e.error("No GLB JSON chunk detected."),{json:a,binaryData:s}}async getBuffer(e,t){const r=this.json.buffers[e],i=this.errorContext;if(null==r.uri)return i.assert(null!=this.glbBuffer,"GLB buffer not present"),this.glbBuffer;let n=this.bufferCache.get(e);if(!n){const o=await this.context.loadBinary(this.resolveUri(r.uri),t);n=new Uint8Array(o),this.bufferCache.set(e,n),i.assert(n.byteLength===r.byteLength,"Buffer byte lengths should match.")}return n}async getAccessor(e,t){const r=this.json.accessors[e],i=this.errorContext;i.errorUnsupportedIf(null==r.bufferView,"Some accessor does not specify a bufferView."),i.errorUnsupportedIf(r.type in["MAT2","MAT3","MAT4"],`AttributeType ${r.type} is not supported`);const n=this.json.bufferViews[r.bufferView],o=await this.getBuffer(n.buffer,t),a=fn[r.type],s=hn[r.componentType],c=a*s,l=n.byteStride||c;return{raw:o.buffer,byteStride:l,byteOffset:o.byteOffset+(n.byteOffset||0)+(r.byteOffset||0),entryCount:r.count,isDenselyPacked:l===c,componentCount:a,componentByteSize:s,componentType:r.componentType,min:r.min,max:r.max,normalized:!!r.normalized}}async getIndexData(e,t){if(null==e.indices)return null;const r=await this.getAccessor(e.indices,t);if(r.isDenselyPacked)switch(r.componentType){case 5121:return new Uint8Array(r.raw,r.byteOffset,r.entryCount);case 5123:return new Uint16Array(r.raw,r.byteOffset,r.entryCount);case 5125:return new Uint32Array(r.raw,r.byteOffset,r.entryCount)}else switch(r.componentType){case 5121:return Ki(this.wrapAccessor(d.D_,r));case 5123:return Ki(this.wrapAccessor(d.av,r));case 5125:return Ki(this.wrapAccessor(d.Nu,r))}}async getPositionData(e,t){const r=this.errorContext;r.errorUnsupportedIf(null==e.attributes.POSITION,"No POSITION vertex data found.");const i=await this.getAccessor(e.attributes.POSITION,t);return r.errorUnsupportedIf(5126!==i.componentType,"Expected type FLOAT for POSITION vertex attribute, but found "+pn[i.componentType]),r.errorUnsupportedIf(3!==i.componentCount,"POSITION vertex attribute must have 3 components, but found "+i.componentCount.toFixed()),this.wrapAccessor(d.ct,i)}async getNormalData(e,t){const r=this.errorContext;r.assert(null!=e.attributes.NORMAL,"No NORMAL vertex data found.");const i=await this.getAccessor(e.attributes.NORMAL,t);return r.errorUnsupportedIf(5126!==i.componentType,"Expected type FLOAT for NORMAL vertex attribute, but found "+pn[i.componentType]),r.errorUnsupportedIf(3!==i.componentCount,"NORMAL vertex attribute must have 3 components, but found "+i.componentCount.toFixed()),this.wrapAccessor(d.ct,i)}async getTangentData(e,t){const r=this.errorContext;r.assert(null!=e.attributes.TANGENT,"No TANGENT vertex data found.");const i=await this.getAccessor(e.attributes.TANGENT,t);return r.errorUnsupportedIf(5126!==i.componentType,"Expected type FLOAT for TANGENT vertex attribute, but found "+pn[i.componentType]),r.errorUnsupportedIf(4!==i.componentCount,"TANGENT vertex attribute must have 4 components, but found "+i.componentCount.toFixed()),new d.ek(i.raw,i.byteOffset,i.byteStride,i.byteOffset+i.byteStride*i.entryCount)}async getTextureCoordinates(e,t){const r=this.errorContext;r.assert(null!=e.attributes.TEXCOORD_0,"No TEXCOORD_0 vertex data found.");const i=await this.getAccessor(e.attributes.TEXCOORD_0,t);return r.errorUnsupportedIf(2!==i.componentCount,"TEXCOORD_0 vertex attribute must have 2 components, but found "+i.componentCount.toFixed()),5126===i.componentType?this.wrapAccessor(d.Eu,i):(r.errorUnsupportedIf(!i.normalized,"Integer component types are only supported for a normalized accessor for TEXCOORD_0."),function(e){switch(e.componentType){case 5120:return new d.Vs(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5121:return new d.xA(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5122:return new d.or(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5123:return new d.TS(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5125:return new d.qt(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);case 5126:return new d.Eu(e.raw,e.byteOffset,e.byteStride,e.byteOffset+e.byteStride*e.entryCount);default:return void(0,mi.Bg)(e.componentType)}}(i))}async getVertexColors(e,t){const r=this.errorContext;r.assert(null!=e.attributes.COLOR_0,"No COLOR_0 vertex data found.");const i=await this.getAccessor(e.attributes.COLOR_0,t);if(r.errorUnsupportedIf(4!==i.componentCount&&3!==i.componentCount,"COLOR_0 attribute must have 3 or 4 components, but found "+i.componentCount.toFixed()),4===i.componentCount){if(5126===i.componentType)return this.wrapAccessor(d.ek,i);if(5121===i.componentType)return this.wrapAccessor(d.mc,i);if(5123===i.componentType)return this.wrapAccessor(d.v6,i)}else if(3===i.componentCount){if(5126===i.componentType)return this.wrapAccessor(d.ct,i);if(5121===i.componentType)return this.wrapAccessor(d.ne,i);if(5123===i.componentType)return this.wrapAccessor(d.mw,i)}r.errorUnsupported("Unsupported component type for COLOR_0 attribute: "+pn[i.componentType])}hasPositions(e){return void 0!==e.attributes.POSITION}hasNormals(e){return void 0!==e.attributes.NORMAL}hasVertexColors(e){return void 0!==e.attributes.COLOR_0}hasTextureCoordinates(e){return void 0!==e.attributes.TEXCOORD_0}hasTangents(e){return void 0!==e.attributes.TANGENT}async getMaterial(e,t,r){const i=this.errorContext;let n=this.materialCache.get(e.material);if(!n){const o=null!=e.material?on(this.json.materials[e.material]):on(),a=o.pbrMetallicRoughness,s=this.hasVertexColors(e);let c,l,u,d,f;a.baseColorTexture&&(i.errorUnsupportedIf(0!==(a.baseColorTexture.texCoord||0),"Only TEXCOORD with index 0 is supported."),c=await this.getTexture(a.baseColorTexture.index,t)),o.normalTexture&&(0!==(o.normalTexture.texCoord||0)?i.warnUnsupported("Only TEXCOORD with index 0 is supported for the normal map texture."):l=await this.getTexture(o.normalTexture.index,t)),o.occlusionTexture&&r&&(0!==(o.occlusionTexture.texCoord||0)?i.warnUnsupported("Only TEXCOORD with index 0 is supported for the occlusion texture."):u=await this.getTexture(o.occlusionTexture.index,t)),o.emissiveTexture&&r&&(0!==(o.emissiveTexture.texCoord||0)?i.warnUnsupported("Only TEXCOORD with index 0 is supported for the emissive texture."):d=await this.getTexture(o.emissiveTexture.index,t)),a.metallicRoughnessTexture&&r&&(0!==(a.metallicRoughnessTexture.texCoord||0)?i.warnUnsupported("Only TEXCOORD with index 0 is supported for the metallicRoughness texture."):f=await this.getTexture(a.metallicRoughnessTexture.index,t));const h=null!=e.material?e.material:-1;n={alphaMode:o.alphaMode,alphaCutoff:o.alphaCutoff,color:a.baseColorFactor,doubleSided:!!o.doubleSided,colorTexture:c,normalTexture:l,name:o.name,id:h,occlusionTexture:u,emissiveTexture:d,emissiveFactor:o.emissiveFactor,metallicFactor:a.metallicFactor,roughnessFactor:a.roughnessFactor,metallicRoughnessTexture:f,vertexColors:s,ESRI_externalColorMixMode:o.extras.ESRI_externalColorMixMode}}return n}async getTexture(e,t){const r=this.errorContext,i=this.json.textures[e],n=(e=>({...an,...e}))(null!=i.sampler?this.json.samplers[i.sampler]:{});r.errorUnsupportedIf(null==i.source,"Source is expected to be defined for a texture.");const o=this.json.images[i.source];let a=this.textureCache.get(e);if(!a){let i;if(o.uri)i=await this.context.loadImage(this.resolveUri(o.uri),t);else{r.errorUnsupportedIf(null==o.bufferView,"Image bufferView must be defined."),r.errorUnsupportedIf(null==o.mimeType,"Image mimeType must be defined.");const e=this.json.bufferViews[o.bufferView],n=await this.getBuffer(e.buffer,t);r.errorUnsupportedIf(null!=e.byteStride,"byteStride not supported for image buffer"),i=await async function(e,t){return new Promise(((r,i)=>{const n=new Blob([e],{type:t}),o=URL.createObjectURL(n),a=new Image;a.addEventListener("load",(()=>{URL.revokeObjectURL(o),"decode"in a?a.decode().then((()=>r(a)),(()=>r(a))):r(a)})),a.addEventListener("error",(e=>{URL.revokeObjectURL(o),i(e)})),a.src=o}))}(new Uint8Array(n.buffer,n.byteOffset+(e.byteOffset||0),e.byteLength),o.mimeType)}a={data:i,wrapS:n.wrapS,wrapT:n.wrapT,minFilter:n.minFilter,name:o.name,id:e},this.textureCache.set(e,a)}return a}getNodeTransform(e){if(void 0===e)return un;let t=this.nodeTransformCache.get(e);if(!t){const r=this.getNodeTransform(this.getNodeParent(e)),i=this.json.nodes[e];i.matrix?t=(0,a.m)((0,l.a)(),r,i.matrix):i.translation||i.rotation||i.scale?(t=(0,l.b)(r),i.translation&&(0,a.t)(t,t,i.translation),i.rotation&&(dn[3]=(0,de.g)(dn,i.rotation),(0,a.r)(t,t,dn[3],dn)),i.scale&&(0,a.s)(t,t,i.scale)):t=r,this.nodeTransformCache.set(e,t)}return t}wrapAccessor(e,t){return new e(t.raw,t.byteOffset,t.byteStride,t.byteOffset+t.byteStride*(t.entryCount-1)+t.componentByteSize*t.componentCount)}resolveUri(e){return(0,vi.hF)(e,this.baseUri)}getNodeParent(e){return this.nodeParentMap.get(e)}checkVersionSupported(){const e=Ji.G.parse(this.json.asset.version,"glTF");ln.validate(e)}checkRequiredExtensionsSupported(){const e=this.json,t=this.errorContext;e.extensionsRequired&&0!==e.extensionsRequired.length&&t.errorUnsupported("gltf loader was not able to load unsupported feature. Required extensions: "+e.extensionsRequired.join(", "))}computeNodeParents(){this.json.nodes.forEach(((e,t)=>{e.children&&e.children.forEach((e=>{this.nodeParentMap.set(e,t)}))}))}}const ln=new Ji.G(2,0,"glTF"),un=(0,a.k)((0,l.a)(),Math.PI/2),dn=(0,P.a)(),fn={SCALAR:1,VEC2:2,VEC3:3,VEC4:4},hn={5120:1,5121:1,5122:2,5123:2,5126:4,5125:4};async function mn(e){return new Promise(((t,r)=>{const i=new Blob([e]),n=new FileReader;n.onload=()=>{const e=n.result;t(JSON.parse(e))},n.onerror=e=>{r(e)},n.readAsText(i)}))}const pn={5120:"BYTE",5121:"UNSIGNED_BYTE",5122:"SHORT",5123:"UNSIGNED_SHORT",5125:"UNSIGNED_INT",5126:"FLOAT"};let gn=0;function vn(e){const t=e.json;let r=null;return t.nodes.forEach((e=>{const t=e.extras;(0,i.pC)(t)&&(t.ESRI_proxyEllipsoid||t.ESRI_lod)&&(r=t)})),r}function bn(e){return e.extensions&&e.extensions.MSFT_lod&&Array.isArray(e.extensions.MSFT_lod.ids)}function xn(e,t,r){const i=t=>{const i=`${r}_tex_${t&&t.id}${t&&t.name?"_"+t.name:""}`;if(t&&!e.textures.has(i)){const r=function(e,t={}){return{data:e,parameters:{wrap:{s:10497,t:10497,...t.wrap},noUnpackFlip:!0,mipmap:!1,...t}}}(t.data,{wrap:{s:yn(t.wrapS),t:yn(t.wrapT)},mipmap:wn.some((e=>e===t.minFilter)),noUnpackFlip:!0});e.textures.set(i,r)}return i},n=`${r}_mat_${t.id}_${t.name}`;if(!e.materials.has(n)){const r=function(e={}){return{color:[1,1,1],opacity:1,alphaMode:"OPAQUE",alphaCutoff:.5,doubleSided:!1,castShadows:!0,receiveShadows:!0,receiveAmbientOcclustion:!0,textureColor:null,textureNormal:null,textureOcclusion:null,textureEmissive:null,textureMetallicRoughness:null,emissiveFactor:[0,0,0],metallicFactor:1,roughnessFactor:1,colorMixMode:"multiply",...e}}({color:[t.color[0],t.color[1],t.color[2]],opacity:t.color[3],alphaMode:t.alphaMode,alphaCutoff:t.alphaCutoff,doubleSided:t.doubleSided,colorMixMode:t.ESRI_externalColorMixMode,textureColor:t.colorTexture?i(t.colorTexture):void 0,textureNormal:t.normalTexture?i(t.normalTexture):void 0,textureOcclusion:t.occlusionTexture?i(t.occlusionTexture):void 0,textureEmissive:t.emissiveTexture?i(t.emissiveTexture):void 0,textureMetallicRoughness:t.metallicRoughnessTexture?i(t.metallicRoughnessTexture):void 0,emissiveFactor:[t.emissiveFactor[0],t.emissiveFactor[1],t.emissiveFactor[2]],metallicFactor:t.metallicFactor,roughnessFactor:t.roughnessFactor});e.materials.set(n,r)}return n}function yn(e){if(33071===e||33648===e||10497===e)return e;_n.error(`Unexpected TextureSampler WrapMode: ${e}`)}const _n=new class{error(e){throw new gi.Z("gltf-loader-error",e)}errorUnsupported(e){throw new gi.Z("gltf-loader-unsupported-feature",e)}errorUnsupportedIf(e,t){e&&this.errorUnsupported(t)}assert(e,t){e||this.error(t)}warn(e){Qi.warn(e)}warnUnsupported(e){this.warn("[Unsupported Feature] "+e)}warnUnsupportedIf(e,t){e&&this.warnUnsupported(t)}},wn=[9987,9985],Tn=["POINTS","LINES","LINE_LOOP","LINE_STRIP","TRIANGLES","TRIANGLE_STRIP","TRIANGLE_FAN"],Sn=f.Z.getLogger("esri.views.3d.layers.graphics.objectResourceUtils");function Cn(e){throw new gi.Z("",`Request for object resource failed: ${e}`)}function Mn(e){const t=e.params,r=t.topology;let i=!0;switch(t.vertexAttributes||(Sn.warn("Geometry must specify vertex attributes"),i=!1),t.topology){case"PerAttributeArray":break;case"Indexed":case null:case void 0:{const e=t.faces;if(e){if(t.vertexAttributes)for(const r in t.vertexAttributes){const t=e[r];t&&t.values?(null!=t.valueType&&"UInt32"!==t.valueType&&(Sn.warn(`Unsupported indexed geometry indices type '${t.valueType}', only UInt32 is currently supported`),i=!1),null!=t.valuesPerElement&&1!==t.valuesPerElement&&(Sn.warn(`Unsupported indexed geometry values per element '${t.valuesPerElement}', only 1 is currently supported`),i=!1)):(Sn.warn(`Indexed geometry does not specify face indices for '${r}' attribute`),i=!1)}}else Sn.warn("Indexed geometries must specify faces"),i=!1;break}default:Sn.warn(`Unsupported topology '${r}'`),i=!1}e.params.material||(Sn.warn("Geometry requires material"),i=!1);const n=e.params.vertexAttributes;for(const e in n)n[e].values||(Sn.warn("Geometries with externally defined attributes are not yet supported"),i=!1);return i}function An(e){const t=(0,v.cS)();return e.forEach((e=>{const r=e.boundingInfo;(0,i.pC)(r)&&((0,v.pp)(t,r.getBBMin()),(0,v.pp)(t,r.getBBMax()))})),t}async function Pn(e,t){const r=[];for(const n in e){const o=e[n],a=o.images[0].data;if(!a){Sn.warn("Externally referenced texture data is not yet supported");continue}const s=o.encoding+";base64,"+a,c="/textureDefinitions/"+n,l={noUnpackFlip:!0,wrap:{s:10497,t:10497},preMultiplyAlpha:!0},u=(0,i.pC)(t)&&t.disableTextures?Promise.resolve(null):(0,_i.t)(s,t);r.push(u.then((e=>({refId:c,image:e,params:l,alphaChannelUsage:"rgba"===o.channels?o.alphaChannelUsage||"transparency":"none"}))))}const n=await Promise.all(r),o={};for(const e of n)o[e.refId]=e;return o}function On(e){switch(e){case"mask":return 2;case"maskAndTransparency":return 3;case"none":return 1;case"transparency":default:return 0}}function In(e){const t=e.params;return{id:1,material:t.material,texture:t.texture,region:t.texture}}const Fn=new Ji.G(1,2,"wosr");function Dn(e,t,r){if(e.count!==t.count)return void h.error("source and destination buffers need to have the same number of elements");const i=e.count,n=r[0],o=r[1],a=r[2],s=r[3],c=r[4],l=r[5],u=r[6],d=r[7],f=r[8],m=e.typedBuffer,p=e.typedBufferStride,g=t.typedBuffer,v=t.typedBufferStride;for(let e=0;e<i;e++){const t=e*p,r=e*v,i=g[r],h=g[r+1],b=g[r+2],x=g[r+3];m[t]=n*i+s*h+u*b,m[t+1]=o*i+c*h+d*b,m[t+2]=a*i+l*h+f*b,m[t+3]=x}}function Ln(e,t,r){const i=Math.min(e.count,t.count),n=e.typedBuffer,o=e.typedBufferStride,a=t.typedBuffer,s=t.typedBufferStride;for(let e=0;e<i;e++){const t=e*o,i=e*s;n[t]=r*a[i],n[t+1]=r*a[i+1],n[t+2]=r*a[i+2],n[t+3]=r*a[i+3]}}async function Rn(e,t){const r=zn((0,s.pJ)(e));if("wosr"===r.fileType){const e=await(t.cache?t.cache.loadWOSR(r.url,t):async function(e,t){const r=await async function(e,t){const r=(0,i.pC)(t)&&t.streamDataRequester;if(r)return async function(e,t,r){const i=await(0,Vi.q6)(t.request(e,"json",r));if(!0===i.ok)return i.value;(0,bi.r9)(i.error),Cn(i.error.details.url)}(e,r,t);const n=await(0,Vi.q6)((0,Ni.default)(e,(0,i.Wg)(t)));if(!0===n.ok)return n.value.data;(0,bi.r9)(n.error),Cn(n.error)}(e,t);return{resource:r,textures:await Pn(r.textureDefinitions,t)}}(r.url,t)),o=function(e,t){const r=[],o=[],a=[],s=[],c=e.resource,l=Ji.G.parse(c.version||"1.0","wosr");Fn.validate(l);const u=c.model.name,d=c.model.geometries,f=c.materialDefinitions,h=e.textures;let m=0;const p=new Map;for(let e=0;e<d.length;e++){const c=d[e];if(!Mn(c))continue;const l=In(c),u=c.params.vertexAttributes,g=[];for(const e in u){const t=u[e],r=t.values;g.push([e,{data:r,size:t.valuesPerElement,exclusive:!0}])}const v=[];if("PerAttributeArray"!==c.params.topology){const e=c.params.faces;for(const t in e)v.push([t,new Uint32Array(e[t].values)])}const b=h&&h[l.texture];if(b&&!p.has(l.texture)){const{image:e,params:t}=b,r=new Ui(e,t);s.push(r),p.set(l.texture,r)}const x=p.get(l.texture),y=x?x.id:void 0;let _=a[l.material]?a[l.material][l.texture]:null;if(!_){const e=f[l.material.substring(l.material.lastIndexOf("/")+1)].params;1===e.transparency&&(e.transparency=0);const r=b&&b.alphaChannelUsage,o=e.transparency>0||"transparency"===r||"maskAndTransparency"===r,s={ambient:(0,n.d)(e.diffuse),diffuse:(0,n.d)(e.diffuse),opacity:1-(e.transparency||0),transparent:o,textureAlphaMode:b?On(b.alphaChannelUsage):void 0,textureAlphaCutoff:.33,textureId:y,initTextureTransparent:!0,doubleSided:!0,cullFace:0,colorMixMode:e.externalColorMixMode||"tint",textureAlphaPremultiplied:!0};(0,i.pC)(t)&&t.materialParamsMixin&&Object.assign(s,t.materialParamsMixin),_=new ii(s),a[l.material]||(a[l.material]={}),a[l.material][l.texture]=_}o.push(_);const w=new se(g,v);m+=v.position?v.position.length:0,r.push(w)}return{name:u,stageResources:{textures:s,materials:o,geometries:r},pivotOffset:c.model.pivotOffset,boundingBox:An(r),numberOfVertices:m,lodThreshold:null}}(e,t);return{lods:[o],referenceBoundingBox:o.boundingBox,isEsriSymbolResource:!1,isWosr:!0,remove:e.remove}}const c=await(t.cache?t.cache.loadGLTF(r.url,t,t.usePBR):async function(e,t,r={},n=!0){const o=await cn.load(e,_n,t,r),a="gltf_"+gn++,s={lods:[],materials:new Map,textures:new Map,meta:vn(o)},c=!(!o.json.asset.extras||"symbolResource"!==o.json.asset.extras.ESRI_type);return await async function(e,t){const r=e.json,i=r.scenes[r.scene||0].nodes,n=i.length>1;for(const e of i){const t=r.nodes[e],i=[o(e,0)];if(bn(t)&&!n){const e=t.extensions.MSFT_lod.ids;i.push(...e.map(((e,t)=>o(e,t+1))))}await Promise.all(i)}async function o(i,n){const a=r.nodes[i],s=e.getNodeTransform(i);if(_n.warnUnsupportedIf(null!=a.weights,"Morph targets are not supported."),null!=a.mesh){const e=r.meshes[a.mesh];for(const r of e.primitives)await t(r,s,n,e.name)}for(const e of a.children||[])await o(e,n)}}(o,(async(e,t,c,u)=>{const d=void 0!==e.mode?e.mode:4,f=function(e){switch(e){case 4:case 5:case 6:return e;default:return null}}(d);if((0,i.Wi)(f))return void _n.warnUnsupported("Unsupported primitive mode ("+Tn[d]+"). Skipping primitive.");if(!o.hasPositions(e))return void _n.warn("Skipping primitive without POSITION vertex attribute.");const h=await o.getMaterial(e,r,n),m={transform:(0,l.b)(t),attributes:{position:await o.getPositionData(e,r),normal:null,texCoord0:null,color:null,tangent:null},indices:await o.getIndexData(e,r),primitiveType:f,material:xn(s,h,a)};o.hasNormals(e)&&(m.attributes.normal=await o.getNormalData(e,r)),o.hasTangents(e)&&(m.attributes.tangent=await o.getTangentData(e,r)),o.hasTextureCoordinates(e)&&(m.attributes.texCoord0=await o.getTextureCoordinates(e,r)),o.hasVertexColors(e)&&(m.attributes.color=await o.getVertexColors(e,r));let p=null;(0,i.pC)(s.meta)&&(0,i.pC)(s.meta.ESRI_lod)&&"screenSpaceRadius"===s.meta.ESRI_lod.metric&&(p=s.meta.ESRI_lod.thresholds[c]),s.lods[c]=s.lods[c]||{parts:[],name:u,lodThreshold:p},s.lods[c].parts.push(m)})),{model:s,meta:{isEsriSymbolResource:c,uri:o.uri},customMeta:{}}}(new ki(t.streamDataRequester),r.url,t,t.usePBR)),u=(0,i.U2)(c.model.meta,"ESRI_proxyEllipsoid");c.meta.isEsriSymbolResource&&(0,i.pC)(u)&&-1!==c.meta.uri.indexOf("/RealisticTrees/")&&function(e,t){for(let r=0;r<e.model.lods.length;++r){const s=e.model.lods[r];e.customMeta.esriTreeRendering=!0;for(const c of s.parts){const s=c.attributes.normal;if((0,i.Wi)(s))return;const u=c.attributes.position,f=u.count,h=(0,n.c)(),m=(0,n.c)(),p=(0,n.c)(),g=Yi(d.mc,f),v=Yi(d.ct,f),b=(0,a.a)((0,l.a)(),c.transform);for(let i=0;i<f;i++){u.getVec(i,m),s.getVec(i,h),(0,o.i)(m,m,c.transform),(0,o.f)(p,m,t.center),(0,o.C)(p,p,t.radius);const n=p[2],a=(0,o.l)(p),l=Math.min(.45+.55*a*a,1);(0,o.C)(p,p,t.radius),(0,o.i)(p,p,b),(0,o.n)(p,p),r+1!==e.model.lods.length&&e.model.lods.length>1&&(0,o.e)(p,p,h,n>-1?.2:Math.min(-4*n-3.8,1)),v.setVec(i,p),g.set(i,0,255*l),g.set(i,1,255*l),g.set(i,2,255*l),g.set(i,3,255)}c.attributes.normal=v,c.attributes.color=g}}}(c,u);const f=c.meta.isEsriSymbolResource?{usePBR:t.usePBR,isSchematic:!1,treeRendering:c.customMeta.esriTreeRendering,mrrFactors:[0,1,.2]}:{usePBR:t.usePBR,isSchematic:!1,mrrFactors:[0,1,.5]},h={...t.materialParamsMixin,treeRendering:c.customMeta.esriTreeRendering};if(null!=r.specifiedLodIndex){const e=Bn(c,f,h,r.specifiedLodIndex);let t=e[0].boundingBox;return 0!==r.specifiedLodIndex&&(t=Bn(c,f,h,0)[0].boundingBox),{lods:e,referenceBoundingBox:t,isEsriSymbolResource:c.meta.isEsriSymbolResource,isWosr:!1,remove:c.remove}}const m=Bn(c,f,h);return{lods:m,referenceBoundingBox:m[0].boundingBox,isEsriSymbolResource:c.meta.isEsriSymbolResource,isWosr:!1,remove:c.remove}}function zn(e){const t=e.match(/(.*\.(gltf|glb))(\?lod=([0-9]+))?$/);return t?{fileType:"gltf",url:t[1],specifiedLodIndex:null!=t[4]?Number(t[4]):null}:e.match(/(.*\.(json|json\.gz))$/)?{fileType:"wosr",url:e,specifiedLodIndex:null}:{fileType:"unknown",url:e,specifiedLodIndex:null}}function Bn(e,t,r,n){const o=e.model,a=(0,c.a)(),s=new Array,l=new Map,f=new Map;return o.lods.forEach(((e,c)=>{if(void 0!==n&&c!==n)return;const h={name:e.name,stageResources:{textures:new Array,materials:new Array,geometries:new Array},lodThreshold:(0,i.pC)(e.lodThreshold)?e.lodThreshold:null,pivotOffset:[0,0,0],numberOfVertices:0,boundingBox:(0,v.cS)()};s.push(h),e.parts.forEach((e=>{const n=e.material+(e.attributes.normal?"_normal":"")+(e.attributes.color?"_color":"")+(e.attributes.texCoord0?"_texCoord0":"")+(e.attributes.tangent?"_tangent":""),s=o.materials.get(e.material),c=(0,i.pC)(e.attributes.texCoord0),b=(0,i.pC)(e.attributes.normal);if(!l.has(n)){if(c){if((0,i.pC)(s.textureColor)&&!f.has(s.textureColor)){const e=o.textures.get(s.textureColor),t={...e.parameters,preMultiplyAlpha:!0};f.set(s.textureColor,new Ui(e.data,t))}if((0,i.pC)(s.textureNormal)&&!f.has(s.textureNormal)){const e=o.textures.get(s.textureNormal),t={...e.parameters,preMultiplyAlpha:!0};f.set(s.textureNormal,new Ui(e.data,t))}if((0,i.pC)(s.textureOcclusion)&&!f.has(s.textureOcclusion)){const e=o.textures.get(s.textureOcclusion),t={...e.parameters,preMultiplyAlpha:!0};f.set(s.textureOcclusion,new Ui(e.data,t))}if((0,i.pC)(s.textureEmissive)&&!f.has(s.textureEmissive)){const e=o.textures.get(s.textureEmissive),t={...e.parameters,preMultiplyAlpha:!0};f.set(s.textureEmissive,new Ui(e.data,t))}if((0,i.pC)(s.textureMetallicRoughness)&&!f.has(s.textureMetallicRoughness)){const e=o.textures.get(s.textureMetallicRoughness),t={...e.parameters,preMultiplyAlpha:!0};f.set(s.textureMetallicRoughness,new Ui(e.data,t))}}const a=s.color[0]**.47619047619047616,u=s.color[1]**.47619047619047616,d=s.color[2]**.47619047619047616,h=s.emissiveFactor[0]**.47619047619047616,m=s.emissiveFactor[1]**.47619047619047616,p=s.emissiveFactor[2]**.47619047619047616;l.set(n,new ii({...t,transparent:"BLEND"===s.alphaMode,textureAlphaMode:Hn(s.alphaMode),textureAlphaCutoff:s.alphaCutoff,diffuse:[a,u,d],ambient:[a,u,d],opacity:s.opacity,doubleSided:s.doubleSided,doubleSidedType:"winding-order",cullFace:s.doubleSided?0:2,vertexColors:!!e.attributes.color,vertexTangents:!!e.attributes.tangent,normals:b?"default":"screenDerivative",castShadows:!0,receiveSSAO:!0,textureId:(0,i.pC)(s.textureColor)&&c?f.get(s.textureColor).id:void 0,colorMixMode:s.colorMixMode,normalTextureId:(0,i.pC)(s.textureNormal)&&c?f.get(s.textureNormal).id:void 0,textureAlphaPremultiplied:!0,occlusionTextureId:(0,i.pC)(s.textureOcclusion)&&c?f.get(s.textureOcclusion).id:void 0,emissiveTextureId:(0,i.pC)(s.textureEmissive)&&c?f.get(s.textureEmissive).id:void 0,metallicRoughnessTextureId:(0,i.pC)(s.textureMetallicRoughness)&&c?f.get(s.textureMetallicRoughness).id:void 0,emissiveFactor:[h,m,p],mrrFactors:[s.metallicFactor,s.roughnessFactor,t.mrrFactors[2]],isSchematic:!1,...r}))}const x=function(e,t){switch(t){case 4:return function(e){return"number"==typeof e?re(e):(0,pi.Uc)(e)||(0,pi.lq)(e)?new Uint32Array(e):e}(e);case 5:return function(e){const t="number"==typeof e?e:e.length;if(t<3)return new Uint16Array(0);const r=t-2,i=r<=65536?new Uint16Array(3*r):new Uint32Array(3*r);if("number"==typeof e){let e=0;for(let t=0;t<r;t+=1)t%2==0?(i[e++]=t,i[e++]=t+1,i[e++]=t+2):(i[e++]=t+1,i[e++]=t,i[e++]=t+2)}else{let t=0;for(let n=0;n<r;n+=1)if(n%2==0){const r=e[n],o=e[n+1],a=e[n+2];i[t++]=r,i[t++]=o,i[t++]=a}else{const r=e[n+1],o=e[n],a=e[n+2];i[t++]=r,i[t++]=o,i[t++]=a}}return i}(e);case 6:return function(e){const t="number"==typeof e?e:e.length;if(t<3)return new Uint16Array(0);const r=t-2,i=r<=65536?new Uint16Array(3*r):new Uint32Array(3*r);if("number"==typeof e){let e=0;for(let t=0;t<r;++t)i[e++]=0,i[e++]=t+1,i[e++]=t+2;return i}{const t=e[0];let n=e[1],o=0;for(let a=0;a<r;++a){const r=e[a+2];i[o++]=t,i[o++]=n,i[o++]=r,n=r}return i}}(e)}}(e.indices||e.attributes.position.count,e.primitiveType),y=e.attributes.position.count,_=Yi(d.ct,y);m(_,e.attributes.position,e.transform);const w=[["position",{data:_.typedBuffer,size:_.elementCount,exclusive:!0}]],T=[["position",x]];if((0,i.pC)(e.attributes.normal)){const t=Yi(d.ct,y);(0,u.n)(a,e.transform),p(t,e.attributes.normal,a),w.push(["normal",{data:t.typedBuffer,size:t.elementCount,exclusive:!0}]),T.push(["normal",x])}if((0,i.pC)(e.attributes.tangent)){const t=Yi(d.ek,y);(0,u.n)(a,e.transform),Dn(t,e.attributes.tangent,a),w.push(["tangent",{data:t.typedBuffer,size:t.elementCount,exclusive:!0}]),T.push(["tangent",x])}if((0,i.pC)(e.attributes.texCoord0)){const t=Yi(d.Eu,y);ji(t,e.attributes.texCoord0),w.push(["uv0",{data:t.typedBuffer,size:t.elementCount,exclusive:!0}]),T.push(["uv0",x])}if((0,i.pC)(e.attributes.color)){const t=Yi(d.mc,y);if(4===e.attributes.color.elementCount)e.attributes.color instanceof d.ek?Ln(t,e.attributes.color,255):e.attributes.color instanceof d.mc?Zi(t,e.attributes.color):e.attributes.color instanceof d.v6&&Ln(t,e.attributes.color,1/256);else{Xi(t,255,255,255,255);const r=new d.ne(t.buffer,0,4);e.attributes.color instanceof d.ct?g(r,e.attributes.color,255):e.attributes.color instanceof d.ne?$i(r,e.attributes.color):e.attributes.color instanceof d.mw&&g(r,e.attributes.color,1/256)}w.push(["color",{data:t.typedBuffer,size:t.elementCount,exclusive:!0}]),T.push(["color",x])}const S=new se(w,T);h.stageResources.geometries.push(S),h.stageResources.materials.push(l.get(n)),c&&((0,i.pC)(s.textureColor)&&h.stageResources.textures.push(f.get(s.textureColor)),(0,i.pC)(s.textureNormal)&&h.stageResources.textures.push(f.get(s.textureNormal)),(0,i.pC)(s.textureOcclusion)&&h.stageResources.textures.push(f.get(s.textureOcclusion)),(0,i.pC)(s.textureEmissive)&&h.stageResources.textures.push(f.get(s.textureEmissive)),(0,i.pC)(s.textureMetallicRoughness)&&h.stageResources.textures.push(f.get(s.textureMetallicRoughness))),h.numberOfVertices+=y;const C=S.boundingInfo;(0,i.pC)(C)&&((0,v.pp)(h.boundingBox,C.getBBMin()),(0,v.pp)(h.boundingBox,C.getBBMax()))}))})),s}function Hn(e){switch(e){case"BLEND":return 0;case"MASK":return 2;case"OPAQUE":return 1;default:return 0}}Object.freeze({__proto__:null,transformMat4:function(e,t,r){if(e.count!==t.count)return void h.error("source and destination buffers need to have the same number of elements");const i=e.count,n=r[0],o=r[1],a=r[2],s=r[3],c=r[4],l=r[5],u=r[6],d=r[7],f=r[8],m=r[9],p=r[10],g=r[11],v=r[12],b=r[13],x=r[14],y=r[15],_=e.typedBuffer,w=e.typedBufferStride,T=t.typedBuffer,S=t.typedBufferStride;for(let e=0;e<i;e++){const t=e*w,r=e*S,i=T[r],h=T[r+1],C=T[r+2],M=T[r+3];_[t]=n*i+c*h+f*C+v*M,_[t+1]=o*i+l*h+m*C+b*M,_[t+2]=a*i+u*h+p*C+x*M,_[t+3]=s*i+d*h+g*C+y*M}},transformMat3:Dn,scale:Ln,shiftRight:function(e,t,r){const i=Math.min(e.count,t.count),n=e.typedBuffer,o=e.typedBufferStride,a=t.typedBuffer,s=t.typedBufferStride;for(let e=0;e<i;e++){const t=e*o,i=e*s;n[t]=a[i]>>r,n[t+1]=a[i+1]>>r,n[t+2]=a[i+2]>>r,n[t+3]=a[i+3]>>r}}})},31777:(e,t,r)=>{"use strict";r.d(t,{q:()=>n});var i=r(33834);function n(e,t){0===t.output&&t.receiveShadows?(e.varyings.add("linearDepth","float"),e.vertex.code.add(i.H`
      void forwardLinearDepth() { linearDepth = gl_Position.w; }
    `)):1===t.output||3===t.output?(e.varyings.add("linearDepth","float"),e.vertex.uniforms.add("cameraNearFar","vec2"),e.vertex.code.add(i.H`
      void forwardLinearDepth() {
        linearDepth = (-position_view().z - cameraNearFar[0]) / (cameraNearFar[1] - cameraNearFar[0]);
      }
    `)):e.vertex.code.add(i.H`
      void forwardLinearDepth() {}
    `)}},7261:(e,t,r)=>{"use strict";r.d(t,{w:()=>n});var i=r(33834);function n(e){e.vertex.code.add(i.H`
    vec4 offsetBackfacingClipPosition(vec4 posClip, vec3 posWorld, vec3 normalWorld, vec3 camPosWorld) {
      vec3 camToVert = posWorld - camPosWorld;

      bool isBackface = dot(camToVert, normalWorld) > 0.0;
      if (isBackface) {
        posClip.z += 0.0000003 * posClip.w;
      }
      return posClip;
    }
  `)}},61514:(e,t,r)=>{"use strict";r.d(t,{p:()=>c});var i,n=r(59472),o=r(77625),a=r(17387),s=r(33834);function c(e,t){if(t.slicePlaneEnabled){e.extensions.add("GL_OES_standard_derivatives"),t.sliceEnabledForVertexPrograms&&(e.vertex.uniforms.add("slicePlaneOrigin","vec3"),e.vertex.uniforms.add("slicePlaneBasis1","vec3"),e.vertex.uniforms.add("slicePlaneBasis2","vec3")),e.fragment.uniforms.add("slicePlaneOrigin","vec3"),e.fragment.uniforms.add("slicePlaneBasis1","vec3"),e.fragment.uniforms.add("slicePlaneBasis2","vec3");const r=s.H`
      struct SliceFactors {
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
        // a slicePlaneBasis1 vector of zero length is used to disable slicing in the shader during draped rendering.
        return dot(slicePlaneBasis1, slicePlaneBasis1) != 0.0;
      }

      bool sliceByPlane(vec3 pos) {
        return sliceEnabled() && sliceByFactors(calculateSliceFactors(pos));
      }

      #define rejectBySlice(_pos_) sliceByPlane(_pos_)
      #define discardBySlice(_pos_) { if (sliceByPlane(_pos_)) discard; }
    `,i=s.H`
      vec4 applySliceHighlight(vec4 color, vec3 pos) {
        SliceFactors factors = calculateSliceFactors(pos);

        if (sliceByFactors(factors)) {
          return color;
        }

        const float HIGHLIGHT_WIDTH = 1.0;
        const vec4 HIGHLIGHT_COLOR = vec4(0.0, 0.0, 0.0, 0.3);

        factors.front /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.front);
        factors.side0 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side0);
        factors.side1 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side1);
        factors.side2 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side2);
        factors.side3 /= (2.0 * HIGHLIGHT_WIDTH) * fwidth(factors.side3);

        float highlightFactor = (1.0 - step(0.5, factors.front))
          * (1.0 - step(0.5, factors.side0))
          * (1.0 - step(0.5, factors.side1))
          * (1.0 - step(0.5, factors.side2))
          * (1.0 - step(0.5, factors.side3));

        return mix(color, vec4(HIGHLIGHT_COLOR.rgb, color.a), highlightFactor * HIGHLIGHT_COLOR.a);
      }
    `,n=t.sliceHighlightDisabled?s.H`#define highlightSlice(_color_, _pos_) (_color_)`:s.H`
        ${i}
        #define highlightSlice(_color_, _pos_) (sliceEnabled() ? applySliceHighlight(_color_, _pos_) : (_color_))
      `;t.sliceEnabledForVertexPrograms&&e.vertex.code.add(r),e.fragment.code.add(r),e.fragment.code.add(n)}else{const r=s.H`
      #define rejectBySlice(_pos_) false
      #define discardBySlice(_pos_) {}
      #define highlightSlice(_color_, _pos_) (_color_)
    `;t.sliceEnabledForVertexPrograms&&e.vertex.code.add(r),e.fragment.code.add(r)}}(i=c||(c={})).bindUniformsWithOrigin=function(e,t,r){i.bindUniforms(e,t,r.slicePlane,r.origin)},i.bindUniforms=function(e,t,r,i){t.slicePlaneEnabled&&((0,n.pC)(r)?(i?((0,a.f)(l,r.origin,i),e.setUniform3fv("slicePlaneOrigin",l)):e.setUniform3fv("slicePlaneOrigin",r.origin),e.setUniform3fv("slicePlaneBasis1",r.basis1),e.setUniform3fv("slicePlaneBasis2",r.basis2)):(e.setUniform3fv("slicePlaneBasis1",o.Z),e.setUniform3fv("slicePlaneBasis2",o.Z),e.setUniform3fv("slicePlaneOrigin",o.Z)))};const l=(0,o.c)()},62213:(e,t,r)=>{"use strict";r.d(t,{w:()=>n});var i=r(33834);function n(e,t){t.linearDepth?e.vertex.code.add(i.H`
    vec4 transformPositionWithDepth(mat4 proj, mat4 view, vec3 pos, vec2 nearFar, out float depth) {
      vec4 eye = view * vec4(pos, 1.0);
      depth = (-eye.z - nearFar[0]) / (nearFar[1] - nearFar[0]) ;
      return proj * eye;
    }
    `):e.vertex.code.add(i.H`
    vec4 transformPosition(mat4 proj, mat4 view, vec3 pos) {
      // Make sure the order of operations is the same as in transformPositionWithDepth.
      return proj * (view * vec4(pos, 1.0));
    }
    `)}},84530:(e,t,r)=>{"use strict";r.d(t,{f:()=>c});var i,n=r(77625),o=r(33834),a=r(71061),s=r(25117);function c(e,t){t.instanced&&t.instancedDoublePrecision&&(e.attributes.add("modelOriginHi","vec3"),e.attributes.add("modelOriginLo","vec3"),e.attributes.add("model","mat3"),e.attributes.add("modelNormal","mat3")),t.instancedDoublePrecision&&(e.vertex.include(s.$,t),e.vertex.uniforms.add("viewOriginHi","vec3"),e.vertex.uniforms.add("viewOriginLo","vec3"));const r=[o.H`
    vec3 calculateVPos() {
      ${t.instancedDoublePrecision?"return model * localPosition().xyz;":"return localPosition().xyz;"}
    }
    `,o.H`
    vec3 subtractOrigin(vec3 _pos) {
      ${t.instancedDoublePrecision?o.H`
          vec3 originDelta = dpAdd(viewOriginHi, viewOriginLo, -modelOriginHi, -modelOriginLo);
          return _pos - originDelta;`:"return vpos;"}
    }
    `,o.H`
    vec3 dpNormal(vec4 _normal) {
      ${t.instancedDoublePrecision?"return normalize(modelNormal * _normal.xyz);":"return normalize(_normal.xyz);"}
    }
    `,o.H`
    vec3 dpNormalView(vec4 _normal) {
      ${t.instancedDoublePrecision?"return normalize((viewNormal * vec4(modelNormal * _normal.xyz, 1.0)).xyz);":"return normalize((viewNormal * _normal).xyz);"}
    }
    `,t.vertexTangets?o.H`
    vec4 dpTransformVertexTangent(vec4 _tangent) {
      ${t.instancedDoublePrecision?"return vec4(modelNormal * _tangent.xyz, _tangent.w);":"return _tangent;"}

    }
    `:o.H``];e.vertex.code.add(r[0]),e.vertex.code.add(r[1]),e.vertex.code.add(r[2]),2===t.output&&e.vertex.code.add(r[3]),e.vertex.code.add(r[4])}(i=c||(c={})).Uniforms=class{},i.bindCustomOrigin=function(e,t){(0,a.po)(t,l,u,3),e.setUniform3fv("viewOriginHi",l),e.setUniform3fv("viewOriginLo",u)};const l=(0,n.c)(),u=(0,n.c)()},74681:(e,t,r)=>{"use strict";r.d(t,{O:()=>o});var i=r(33834);function n(e){const t=i.H`
    vec3 decodeNormal(vec2 f) {
      float z = 1.0 - abs(f.x) - abs(f.y);
      return vec3(f + sign(f) * min(z, 0.0), z);
    }
  `;e.fragment.code.add(t),e.vertex.code.add(t)}function o(e,t){0===t.normalType&&(e.attributes.add("normal","vec3"),e.vertex.code.add(i.H`
      vec3 normalModel() {
        return normal;
      }
    `)),1===t.normalType&&(e.include(n),e.attributes.add("normalCompressed","vec2"),e.vertex.code.add(i.H`
      vec3 normalModel() {
        return decodeNormal(normalCompressed);
      }
    `)),3===t.normalType&&(e.extensions.add("GL_OES_standard_derivatives"),e.fragment.code.add(i.H`
      vec3 screenDerivativeNormal(vec3 positionView) {
        return normalize(cross(dFdx(positionView), dFdy(positionView)));
      }
    `))}},6838:(e,t,r)=>{"use strict";r.d(t,{f:()=>n});var i=r(33834);function n(e){e.attributes.add("position","vec3"),e.vertex.code.add(i.H`
    vec3 positionModel() { return position; }
  `)}},31163:(e,t,r)=>{"use strict";r.d(t,{R:()=>o});var i=r(33834);function n(e){e.vertex.code.add(i.H`
    vec4 decodeSymbolColor(vec4 symbolColor, out int colorMixMode) {
      float symbolAlpha = 0.0;

      const float maxTint = 85.0;
      const float maxReplace = 170.0;
      const float scaleAlpha = 3.0;

      if (symbolColor.a > maxReplace) {
        colorMixMode = ${i.H.int(1)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxReplace);
      } else if (symbolColor.a > maxTint) {
        colorMixMode = ${i.H.int(3)};
        symbolAlpha = scaleAlpha * (symbolColor.a - maxTint);
      } else if (symbolColor.a > 0.0) {
        colorMixMode = ${i.H.int(4)};
        symbolAlpha = scaleAlpha * symbolColor.a;
      } else {
        colorMixMode = ${i.H.int(1)};
        symbolAlpha = 0.0;
      }

      return vec4(symbolColor.r, symbolColor.g, symbolColor.b, symbolAlpha);
    }
  `)}function o(e,t){t.symbolColor?(e.include(n),e.attributes.add("symbolColor","vec4"),e.varyings.add("colorMixMode","mediump float")):e.fragment.uniforms.add("colorMixMode","int"),t.symbolColor?e.vertex.code.add(i.H`
    int symbolColorMixMode;

    vec4 getSymbolColor() {
      return decodeSymbolColor(symbolColor, symbolColorMixMode) * 0.003921568627451;
    }

    void forwardColorMixMode() {
      colorMixMode = float(symbolColorMixMode) + 0.5;
    }
  `):e.vertex.code.add(i.H`
    vec4 getSymbolColor() { return vec4(1.0); }
    void forwardColorMixMode() {}
    `)}},82094:(e,t,r)=>{"use strict";r.d(t,{D:()=>n});var i=r(33834);function n(e,t){1===t.attributeTextureCoordinates&&(e.attributes.add("uv0","vec2"),e.varyings.add("vuv0","vec2"),e.vertex.code.add(i.H`
      void forwardTextureCoordinates() {
        vuv0 = uv0;
      }
    `)),2===t.attributeTextureCoordinates&&(e.attributes.add("uv0","vec2"),e.varyings.add("vuv0","vec2"),e.attributes.add("uvRegion","vec4"),e.varyings.add("vuvRegion","vec4"),e.vertex.code.add(i.H`
      void forwardTextureCoordinates() {
        vuv0 = uv0;
        vuvRegion = uvRegion;
      }
    `)),0===t.attributeTextureCoordinates&&e.vertex.code.add(i.H`
      void forwardTextureCoordinates() {}
    `)}},11823:(e,t,r)=>{"use strict";r.d(t,{c:()=>n});var i=r(33834);function n(e,t){t.attributeColor?(e.attributes.add("color","vec4"),e.varyings.add("vColor","vec4"),e.vertex.code.add(i.H`
      void forwardVertexColor() { vColor = color; }
    `),e.vertex.code.add(i.H`
      void forwardNormalizedVertexColor() { vColor = color * 0.003921568627451; }
    `)):e.vertex.code.add(i.H`
      void forwardVertexColor() {}
      void forwardNormalizedVertexColor() {}
    `)}},34074:(e,t,r)=>{"use strict";r.d(t,{B:()=>f});var i,n=r(33834),o=r(74681),a=r(77625),s=r(30663),c=r(12811),l=r(25117),u=r(6838);function d(e,t){e.include(u.f),e.vertex.include(l.$,t),e.varyings.add("vPositionWorldCameraRelative","vec3"),e.varyings.add("vPosition_view","vec3"),e.vertex.uniforms.add("uTransform_WorldFromModel_RS","mat3"),e.vertex.uniforms.add("uTransform_WorldFromModel_TH","vec3"),e.vertex.uniforms.add("uTransform_WorldFromModel_TL","vec3"),e.vertex.uniforms.add("uTransform_WorldFromView_TH","vec3"),e.vertex.uniforms.add("uTransform_WorldFromView_TL","vec3"),e.vertex.uniforms.add("uTransform_ViewFromCameraRelative_RS","mat3"),e.vertex.uniforms.add("uTransform_ProjFromView","mat4"),e.vertex.code.add(n.H`
    // compute position in world space orientation, but relative to the camera position
    vec3 positionWorldCameraRelative() {
      vec3 rotatedModelPosition = uTransform_WorldFromModel_RS * positionModel();

      vec3 transform_CameraRelativeFromModel = dpAdd(
        uTransform_WorldFromModel_TL,
        uTransform_WorldFromModel_TH,
        -uTransform_WorldFromView_TL,
        -uTransform_WorldFromView_TH
      );

      return transform_CameraRelativeFromModel + rotatedModelPosition;
    }

    // position in view space, that is relative to the camera position and orientation
    vec3 position_view() {
      return uTransform_ViewFromCameraRelative_RS * positionWorldCameraRelative();
    }

    // compute gl_Position and forward related varyings to fragment shader
    void forwardPosition() {
      vPositionWorldCameraRelative = positionWorldCameraRelative();
      vPosition_view = position_view();
      gl_Position = uTransform_ProjFromView * vec4(vPosition_view, 1.0);
    }

    vec3 positionWorld() {
      return uTransform_WorldFromView_TL + vPositionWorldCameraRelative;
    }
  `),e.fragment.uniforms.add("uTransform_WorldFromView_TL","vec3"),e.fragment.code.add(n.H`
    vec3 positionWorld() {
      return uTransform_WorldFromView_TL + vPositionWorldCameraRelative;
    }
  `)}function f(e,t){0===t.normalType||1===t.normalType?(e.include(o.O,t),e.varyings.add("vNormalWorld","vec3"),e.varyings.add("vNormalView","vec3"),e.vertex.uniforms.add("uTransformNormal_GlobalFromModel","mat3"),e.vertex.uniforms.add("uTransformNormal_ViewFromGlobal","mat3"),e.vertex.code.add(n.H`
      void forwardNormal() {
        vNormalWorld = uTransformNormal_GlobalFromModel * normalModel();
        vNormalView = uTransformNormal_ViewFromGlobal * vNormalWorld;
      }
    `)):2===t.normalType?(e.include(d,t),e.varyings.add("vNormalWorld","vec3"),e.vertex.code.add(n.H`
    void forwardNormal() {
      vNormalWorld = ${1===t.viewingMode?n.H`normalize(vPositionWorldCameraRelative);`:n.H`vec3(0.0, 0.0, 1.0);`}
    }
    `)):e.vertex.code.add(n.H`
      void forwardNormal() {}
    `)}(i=d||(d={})).ModelTransform=class{constructor(){this.worldFromModel_RS=(0,s.a)(),this.worldFromModel_TH=(0,a.c)(),this.worldFromModel_TL=(0,a.c)()}},i.ViewProjectionTransform=class{constructor(){this.worldFromView_TH=(0,a.c)(),this.worldFromView_TL=(0,a.c)(),this.viewFromCameraRelative_RS=(0,s.a)(),this.projFromView=(0,c.a)()}},i.bindModelTransform=function(e,t){e.setUniformMatrix3fv("uTransform_WorldFromModel_RS",t.worldFromModel_RS),e.setUniform3fv("uTransform_WorldFromModel_TH",t.worldFromModel_TH),e.setUniform3fv("uTransform_WorldFromModel_TL",t.worldFromModel_TL)},i.bindViewProjTransform=function(e,t){e.setUniform3fv("uTransform_WorldFromView_TH",t.worldFromView_TH),e.setUniform3fv("uTransform_WorldFromView_TL",t.worldFromView_TL),e.setUniformMatrix4fv("uTransform_ProjFromView",t.projFromView),e.setUniformMatrix3fv("uTransform_ViewFromCameraRelative_RS",t.viewFromCameraRelative_RS)},(f||(f={})).bindUniforms=function(e,t){e.setUniformMatrix4fv("viewNormal",t)}},51206:(e,t,r)=>{"use strict";r.d(t,{i:()=>a});var i=r(33834),n=r(82094);function o(e){e.extensions.add("GL_EXT_shader_texture_lod"),e.extensions.add("GL_OES_standard_derivatives"),e.fragment.code.add(i.H`
    #ifndef GL_EXT_shader_texture_lod
      float calcMipMapLevel(const vec2 ddx, const vec2 ddy) {
        float deltaMaxSqr = max(dot(ddx, ddx), dot(ddy, ddy));
        return max(0.0, 0.5 * log2(deltaMaxSqr));
      }
    #endif

    vec4 textureAtlasLookup(sampler2D texture, vec2 textureSize, vec2 textureCoordinates, vec4 atlasRegion) {
      //[umin, vmin, umax, vmax]
      vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
      vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;

      // calculate derivative of continuous texture coordinate
      // to avoid mipmapping artifacts caused by manual wrapping in shader
      // clamp the derivatives to avoid discoloring when zooming out.
      float maxdUV = 0.125; // Emprirically tuned compromise between discoloring and aliasing noise.
      vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
      vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;

      #ifdef GL_EXT_shader_texture_lod
        return texture2DGradEXT(texture, uvAtlas, dUVdx, dUVdy);
      #else
        // use bias to compensate for difference in automatic vs desired mipmap level
        vec2 dUVdxAuto = dFdx(uvAtlas);
        vec2 dUVdyAuto = dFdy(uvAtlas);
        float mipMapLevel = calcMipMapLevel(dUVdx * textureSize, dUVdy * textureSize);
        float autoMipMapLevel = calcMipMapLevel(dUVdxAuto * textureSize, dUVdyAuto * textureSize);

        return texture2D(texture, uvAtlas, mipMapLevel - autoMipMapLevel);
      #endif
    }
  `)}function a(e,t){e.include(n.D,t),e.fragment.code.add(i.H`
  struct TextureLookupParameter {
    vec2 uv;
    ${t.supportsTextureAtlas?"vec2 size;":""}
  } vtc;
  `),1===t.attributeTextureCoordinates&&e.fragment.code.add(i.H`
      vec4 textureLookup(sampler2D tex, TextureLookupParameter params) {
        return texture2D(tex, params.uv);
      }
    `),2===t.attributeTextureCoordinates&&(e.include(o),e.fragment.code.add(i.H`
    vec4 textureLookup(sampler2D tex, TextureLookupParameter params) {
        return textureAtlasLookup(tex, params.size, params.uv, vuvRegion);
      }
    `))}},17811:(e,t,r)=>{"use strict";r.d(t,{L:()=>a});var i=r(33834),n=r(48775);function o(e){e.vertex.code.add(i.H`
    float screenSizePerspectiveMinSize(float size, vec4 factor) {
      float nonZeroSize = 1.0 - step(size, 0.0);

      return (
        factor.z * (
          1.0 +
          // Multiply by nzs ensures if size is 0, then we ignore proportionally scaled padding
          nonZeroSize *
          2.0 * factor.w / (
            size + (1.0 - nonZeroSize) // Adding 1 - nzs ensures we divide either by size, or by 1
          )
        )
      );
    }
  `),e.vertex.code.add(i.H`
    float screenSizePerspectiveViewAngleDependentFactor(float absCosAngle) {
      return absCosAngle * absCosAngle * absCosAngle;
    }
  `),e.vertex.code.add(i.H`
    vec4 screenSizePerspectiveScaleFactor(float absCosAngle, float distanceToCamera, vec4 params) {
      return vec4(
        min(params.x / (distanceToCamera - params.y), 1.0),
        screenSizePerspectiveViewAngleDependentFactor(absCosAngle),
        params.z,
        params.w
      );
    }
  `),e.vertex.code.add(i.H`
    float applyScreenSizePerspectiveScaleFactorFloat(float size, vec4 factor) {
      return max(mix(size * factor.x, size, factor.y), screenSizePerspectiveMinSize(size, factor));
    }
  `),e.vertex.code.add(i.H`
    float screenSizePerspectiveScaleFloat(float size, float absCosAngle, float distanceToCamera, vec4 params) {
      return applyScreenSizePerspectiveScaleFactorFloat(
        size,
        screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params)
      );
    }
  `),e.vertex.code.add(i.H`
    vec2 applyScreenSizePerspectiveScaleFactorVec2(vec2 size, vec4 factor) {
      return mix(size * clamp(factor.x, screenSizePerspectiveMinSize(size.y, factor) / size.y, 1.0), size, factor.y);
    }
  `),e.vertex.code.add(i.H`
    vec2 screenSizePerspectiveScaleVec2(vec2 size, float absCosAngle, float distanceToCamera, vec4 params) {
      return applyScreenSizePerspectiveScaleFactorVec2(size, screenSizePerspectiveScaleFactor(absCosAngle, distanceToCamera, params));
    }
  `)}function a(e,t){const r=e.vertex.code;t.verticalOffsetEnabled?(e.vertex.uniforms.add("verticalOffset","vec4"),t.screenSizePerspectiveEnabled&&(e.include(o),e.vertex.uniforms.add("screenSizePerspectiveAlignment","vec4")),r.add(i.H`
    vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
      float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
      ${1===t.viewingMode?i.H`vec3 worldNormal = normalize(worldPos + localOrigin);`:i.H`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
      ${t.screenSizePerspectiveEnabled?i.H`
          float cosAngle = dot(worldNormal, normalize(worldPos - camPos));
          float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:i.H`
          float verticalOffsetScreenHeight = verticalOffset.x;`}
      // Screen sized offset in world space, used for example for line callouts
      float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
      return worldNormal * worldOffset;
    }

    vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
      return worldPos + calculateVerticalOffset(worldPos, localOrigin);
    }
    `)):r.add(i.H`
    vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }
    `)}function s(e,t,r,i=c){return i.screenLength=e.screenLength,i.perDistance=Math.tan(.5*t)/(.5*r),i.minWorldLength=e.minWorldLength,i.maxWorldLength=e.maxWorldLength,i}(o||(o={})).bindUniforms=function(e,t){if(t.screenSizePerspective){(0,n.bj)(t.screenSizePerspective,e,"screenSizePerspective");const r=t.screenSizePerspectiveAlignment||t.screenSizePerspective;(0,n.bj)(r,e,"screenSizePerspectiveAlignment")}},function(e){e.bindUniforms=function(e,t,r){if(!t.verticalOffset)return;const i=s(t.verticalOffset,r.camera.fovY,r.camera.fullViewport[3]),n=r.camera.pixelRatio||1;e.setUniform4f("verticalOffset",i.screenLength*n,i.perDistance,i.minWorldLength,i.maxWorldLength)}}(a||(a={}));const c={screenLength:0,perDistance:0,minWorldLength:0,maxWorldLength:0}},20829:(e,t,r)=>{"use strict";r.d(t,{s:()=>m});var i=r(33834),n=r(62213),o=r(61514),a=r(72023),s=r(8681),c=r(34658),l=r(61017);function u(e,t){e.fragment.include(l.n),3===t.output?(e.extensions.add("GL_OES_standard_derivatives"),e.fragment.code.add(i.H`
      float _calculateFragDepth(const in float depth) {
        // calc polygon offset
        const float SLOPE_SCALE = 2.0;
        const float BIAS = 2.0 * .000015259;    // 1 / (2^16 - 1)
        float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
        float result = depth + SLOPE_SCALE * m + BIAS;
        return clamp(result, .0, .999999);
      }

      void outputDepth(float _linearDepth) {
        gl_FragColor = float2rgba(_calculateFragDepth(_linearDepth));
      }
    `)):1===t.output&&e.fragment.code.add(i.H`
      void outputDepth(float _linearDepth) {
        gl_FragColor = float2rgba(_linearDepth);
      }
    `)}var d=r(82094),f=r(74681),h=r(34074);function m(e,t){const r=e.vertex.code,l=e.fragment.code;1!==t.output&&3!==t.output||(e.include(n.w,{linearDepth:!0}),e.include(d.D,t),e.include(s.k,t),e.include(u,t),e.include(o.p,t),e.vertex.uniforms.add("cameraNearFar","vec2"),e.varyings.add("depth","float"),t.hasColorTexture&&e.fragment.uniforms.add("tex","sampler2D"),r.add(i.H`
      void main(void) {
        vpos = calculateVPos();
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPositionWithDepth(proj, view, vpos, cameraNearFar, depth);
        forwardTextureCoordinates();
      }
    `),e.include(c.sj,t),l.add(i.H`
      void main(void) {
        discardBySlice(vpos);
        ${t.hasColorTexture?i.H`
        vec4 texColor = texture2D(tex, vuv0);
        discardOrAdjustAlpha(texColor);`:""}
        outputDepth(depth);
      }
    `)),2===t.output&&(e.include(n.w,{linearDepth:!1}),e.include(f.O,t),e.include(h.B,t),e.include(d.D,t),e.include(s.k,t),t.hasColorTexture&&e.fragment.uniforms.add("tex","sampler2D"),e.vertex.uniforms.add("viewNormal","mat4"),e.varyings.add("vPositionView","vec3"),r.add(i.H`
      void main(void) {
        vpos = calculateVPos();
        vpos = subtractOrigin(vpos);
        ${0===t.normalType?i.H`
        vNormalWorld = dpNormalView(vvLocalNormal(normalModel()));`:""}
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();
      }
    `),e.include(o.p,t),e.include(c.sj,t),l.add(i.H`
      void main() {
        discardBySlice(vpos);
        ${t.hasColorTexture?i.H`
        vec4 texColor = texture2D(tex, vuv0);
        discardOrAdjustAlpha(texColor);`:""}

        ${3===t.normalType?i.H`
            vec3 normal = screenDerivativeNormal(vPositionView);`:i.H`
            vec3 normal = normalize(vNormalWorld);
            if (gl_FrontFacing == false) normal = -normal;`}
        gl_FragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);
      }
    `)),4===t.output&&(e.include(n.w,{linearDepth:!1}),e.include(d.D,t),e.include(s.k,t),t.hasColorTexture&&e.fragment.uniforms.add("tex","sampler2D"),r.add(i.H`
      void main(void) {
        vpos = calculateVPos();
        vpos = subtractOrigin(vpos);
        vpos = addVerticalOffset(vpos, localOrigin);
        gl_Position = transformPosition(proj, view, vpos);
        forwardTextureCoordinates();
      }
    `),e.include(o.p,t),e.include(c.sj,t),e.include(a.bA),l.add(i.H`
      void main() {
        discardBySlice(vpos);
        ${t.hasColorTexture?i.H`
        vec4 texColor = texture2D(tex, vuv0);
        discardOrAdjustAlpha(texColor);`:""}
        outputHighlight();
      }
    `))}},72023:(e,t,r)=>{"use strict";r.d(t,{bA:()=>s});var i=r(38256),n=r(33834);const o=(0,i.b)(1,1,0,1),a=(0,i.b)(1,0,1,1);function s(e){e.fragment.uniforms.add("depthTex","sampler2D"),e.fragment.uniforms.add("highlightViewportPixelSz","vec4"),e.fragment.constants.add("occludedHighlightFlag","vec4",o).add("unoccludedHighlightFlag","vec4",a),e.fragment.code.add(n.H`
    void outputHighlight() {
      vec4 fragCoord = gl_FragCoord;

      float sceneDepth = texture2D(depthTex, (fragCoord.xy - highlightViewportPixelSz.xy) * highlightViewportPixelSz.zw).r;
      if (fragCoord.z > sceneDepth + 5e-7) {
        gl_FragColor = occludedHighlightFlag;
      }
      else {
        gl_FragColor = unoccludedHighlightFlag;
      }
    }
  `)}(s||(s={})).bindOutputHighlight=function(e,t,r){e.bindTexture(r.highlightDepthTexture,5),t.setUniform1i("depthTex",5),t.setUniform4f("highlightViewportPixelSz",0,0,r.inverseViewport[0],r.inverseViewport[1])}},4071:(e,t,r)=>{"use strict";r.d(t,{S:()=>o});var i=r(33834),n=r(61017);function o(e){e.include(n.n),e.code.add(i.H`
    float linearDepthFromFloat(float depth, vec2 nearFar) {
      return -(depth * (nearFar[1] - nearFar[0]) + nearFar[0]);
    }

    float linearDepthFromTexture(sampler2D depthTex, vec2 uv, vec2 nearFar) {
      return linearDepthFromFloat(rgba2float(texture2D(depthTex, uv)), nearFar);
    }
  `)}},10832:(e,t,r)=>{"use strict";r.d(t,{Q:()=>o});var i=r(33834),n=r(51206);function o(e,t){const r=e.fragment;r.uniforms.add("normalTexture","sampler2D"),r.uniforms.add("normalTextureSize","vec2"),t.vertexTangets?(e.attributes.add("tangent","vec4"),e.varyings.add("vTangent","vec4"),2===t.doubleSidedMode?r.code.add(i.H`
      mat3 computeTangentSpace(vec3 normal) {
        float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
        vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
        vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
        return mat3(tangent, bitangent, normal);
      }
    `):r.code.add(i.H`
      mat3 computeTangentSpace(vec3 normal) {
        float tangentHeadedness = vTangent.w;
        vec3 tangent = normalize(vTangent.xyz);
        vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
        return mat3(tangent, bitangent, normal);
      }
    `)):(e.extensions.add("GL_OES_standard_derivatives"),r.code.add(i.H`
    mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {

      vec3 Q1 = dFdx(pos);
      vec3 Q2 = dFdy(pos);

      vec2 stx = dFdx(st);
      vec2 sty = dFdy(st);

      float det = stx.t * sty.s - sty.t * stx.s;

      vec3 T = stx.t * Q2 - sty.t * Q1; // compute tangent
      T = T - normal * dot(normal, T); // orthogonalize tangent
      T *= inversesqrt(max(dot(T,T), 1.e-10)); // "soft" normalize - goes to 0 when T goes to 0
      vec3 B = sign(det) * cross(normal, T); // assume normal is normalized, B has the same lenght as B
      return mat3(T, B, normal); // T and B go to 0 when the tangent space is not well defined by the uv coordinates
    }
  `)),0!==t.attributeTextureCoordinates&&(e.include(n.i,t),r.code.add(i.H`
    vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
      vtc.uv = uv;
      ${t.supportsTextureAtlas?"vtc.size = normalTextureSize;":""}
      vec3 rawNormal = textureLookup(normalTexture, vtc).rgb * 2.0 - 1.0;
      return tangentSpace * rawNormal;
    }
  `))}},72582:(e,t,r)=>{"use strict";r.d(t,{K:()=>n});var i=r(33834);function n(e,t){const r=e.fragment;t.receiveAmbientOcclusion?(r.uniforms.add("ssaoTex","sampler2D"),r.uniforms.add("viewportPixelSz","vec4"),r.code.add(i.H`
      float evaluateAmbientOcclusion() {
        return 1.0 - texture2D(ssaoTex, (gl_FragCoord.xy - viewportPixelSz.xy) * viewportPixelSz.zw).a;
      }

      float evaluateAmbientOcclusionInverse() {
        float ssao = texture2D(ssaoTex, (gl_FragCoord.xy - viewportPixelSz.xy) * viewportPixelSz.zw).a;
        return viewportPixelSz.z < 0.0 ? 1.0 : ssao;
      }
    `)):r.code.add(i.H`
      float evaluateAmbientOcclusion() { return 0.0; } // no occlusion
      float evaluateAmbientOcclusionInverse() { return 1.0; }
    `)}},72884:(e,t,r)=>{"use strict";r.d(t,{X:()=>u});var i=r(33834),n=r(9295),o=r(71613),a=r(87023),s=r(72582);function c(e,t){const r=e.fragment,n=void 0!==t.lightingSphericalHarmonicsOrder?t.lightingSphericalHarmonicsOrder:2;0===n?(r.uniforms.add("lightingAmbientSH0","vec3"),r.code.add(i.H`
      vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
        vec3 ambientLight = 0.282095 * lightingAmbientSH0;
        return ambientLight * (1.0 - ambientOcclusion);
      }
    `)):1===n?(r.uniforms.add("lightingAmbientSH_R","vec4"),r.uniforms.add("lightingAmbientSH_G","vec4"),r.uniforms.add("lightingAmbientSH_B","vec4"),r.code.add(i.H`
      vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
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
      }
    `)):2===n&&(r.uniforms.add("lightingAmbientSH0","vec3"),r.uniforms.add("lightingAmbientSH_R1","vec4"),r.uniforms.add("lightingAmbientSH_G1","vec4"),r.uniforms.add("lightingAmbientSH_B1","vec4"),r.uniforms.add("lightingAmbientSH_R2","vec4"),r.uniforms.add("lightingAmbientSH_G2","vec4"),r.uniforms.add("lightingAmbientSH_B2","vec4"),r.code.add(i.H`
      vec3 calculateAmbientIrradiance(vec3 normal, float ambientOcclusion) {
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
      }
    `),1!==t.pbrMode&&2!==t.pbrMode||r.code.add(i.H`
        const vec3 skyTransmittance = vec3(0.9, 0.9, 1.0);

        vec3 calculateAmbientRadiance(float ambientOcclusion)
        {
          vec3 ambientLight = 1.2 * (0.282095 * lightingAmbientSH0) - 0.2;
          return ambientLight *= (1.0 - ambientOcclusion) * skyTransmittance;
        }
      `))}function l(e){const t=e.fragment;t.uniforms.add("lightingMainDirection","vec3"),t.uniforms.add("lightingMainIntensity","vec3"),t.uniforms.add("lightingFixedFactor","float"),t.code.add(i.H`
    vec3 evaluateMainLighting(vec3 normal_global, float shadowing) {
      float dotVal = clamp(-dot(normal_global, lightingMainDirection), 0.0, 1.0);

      // move lighting towards (1.0, 1.0, 1.0) if requested
      dotVal = mix(dotVal, 1.0, lightingFixedFactor);

      return lightingMainIntensity * ((1.0 - shadowing) * dotVal);
    }
  `)}function u(e,t){const r=e.fragment;e.include(l),e.include(s.K,t),0!==t.pbrMode&&e.include(a.T,t),e.include(c,t),t.receiveShadows&&e.include(o.h,t),r.uniforms.add("lightingGlobalFactor","float"),r.uniforms.add("ambientBoostFactor","float"),e.include(n.e),r.code.add(i.H`
    const float GAMMA_SRGB = 2.1;
    const float INV_GAMMA_SRGB = 0.4761904;
    ${0===t.pbrMode?"":"const vec3 GROUND_REFLECTANCE = vec3(0.2);"}
  `),t.useOldSceneLightInterface?r.code.add(i.H`
    vec3 evaluateSceneLightingExt(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight) {
      // evaluate the main light
      #if defined(TREE_RENDERING)
        // Special case for tree rendering:
        // We shift the Lambert lobe to the back, allowing it to reach part of the hemisphere
        // facing away from the light. The idea is to get an effect where light is transmitted
        // through the tree.
        float minDot = -0.5;
        float dotRange = 1.0 - minDot;
        float dotNormalization = 0.66; // guessed & hand tweaked value, for an exact value we could precompute an integral over the sphere

        float dotVal = dotNormalization * (clamp(-dot(normal, lightingMainDirection), 1.0 - dotRange, 1.0) - minDot) * (1.0 / dotRange);
      #else
        float dotVal = clamp(-dot(normal, lightingMainDirection), 0.0, 1.0);
      #endif

      // move lighting towards (1.0, 1.0, 1.0) if requested
      dotVal = mix(dotVal, 1.0, lightingFixedFactor);

      vec3 mainLight = (1.0 - shadow) * lightingMainIntensity * dotVal;
      vec3 ambientLight = calculateAmbientIrradiance(normal, ssao);

      // inverse gamma correction on the albedo color
      vec3 albedoGammaC = pow(albedo, vec3(GAMMA_SRGB));

      // physically correct BRDF normalizes by PI
      vec3 totalLight = mainLight + ambientLight + additionalLight;
      totalLight = min(totalLight, vec3(PI));
      vec3 outColor = vec3((albedoGammaC / PI) * (totalLight));

      // apply gamma correction to the computed color
      outColor = pow(outColor, vec3(INV_GAMMA_SRGB));

      return outColor;
    }
  `):(1===t.viewingMode?r.code.add(i.H`
      float _oldHeuristicLighting(vec3 vPosWorld) {
        vec3 shadingNormalWorld = normalize(vPosWorld);
        float vndl = -dot(shadingNormalWorld, lightingMainDirection);

        return smoothstep(0.0, 1.0, clamp(vndl * 2.5, 0.0, 1.0));
      }
    `):r.code.add(i.H`
      float _oldHeuristicLighting(vec3 vPosWorld) {
        float vndl = -dot(vec3(0.0, 0.0, 1.0), lightingMainDirection);
        return smoothstep(0.0, 1.0, clamp(vndl * 2.5, 0.0, 1.0));
      }
    `),r.code.add(i.H`
      vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
        float additionalAmbientScale = _oldHeuristicLighting(vPosWorld);
        return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * lightingMainIntensity;
      }
    `),0===t.pbrMode||4===t.pbrMode?r.code.add(i.H`
      vec3 evaluateSceneLighting(vec3 normalWorld, vec3 baseColor, float mainLightShadow, float ambientOcclusion, vec3 additionalLight)
      {
        vec3 mainLighting = evaluateMainLighting(normalWorld, mainLightShadow);
        vec3 ambientLighting = calculateAmbientIrradiance(normalWorld, ambientOcclusion);
        // inverse gamma correction on the base color
        vec3 baseColorLinear = pow(baseColor, vec3(GAMMA_SRGB));

        // physically correct BRDF normalizes by PI
        vec3 totalLight = mainLighting + ambientLighting + additionalLight;
        totalLight = min(totalLight, vec3(PI));
        vec3 outColor = vec3((baseColorLinear / PI) * totalLight);

        // apply gamma correction to the computed color
        outColor = pow(outColor, vec3(INV_GAMMA_SRGB));

        return outColor;
      }
      `):1!==t.pbrMode&&2!==t.pbrMode||(r.code.add(i.H`
      const float fillLightIntensity = 0.25;
      const float horizonLightDiffusion = 0.4;
      const float additionalAmbientIrradianceFactor = 0.02;

      vec3 evaluateSceneLightingPBR(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight, vec3 viewDir, vec3 normalGround, vec3 mrr, vec3 _emission, float additionalAmbientIrradiance)
      {
        // Calculate half vector between view and light direction
        vec3 viewDirection = -viewDir;
        vec3 mainLightDirection = -lightingMainDirection;
        vec3 h = normalize(viewDirection + mainLightDirection);

        PBRShadingInfo inputs;
        inputs.NdotL = clamp(dot(normal, mainLightDirection), 0.001, 1.0);
        inputs.NdotV = clamp(abs(dot(normal, viewDirection)), 0.001, 1.0);
        inputs.NdotH = clamp(dot(normal, h), 0.0, 1.0);
        inputs.VdotH = clamp(dot(viewDirection, h), 0.0, 1.0);
        inputs.NdotNG = clamp(dot(normal, normalGround), -1.0, 1.0);
        vec3 reflectedView = normalize(reflect(viewDirection, normal));
        inputs.RdotNG = clamp(dot(reflectedView, normalGround), -1.0, 1.0);

        inputs.albedoLinear = pow(albedo, vec3(GAMMA_SRGB));
        inputs.ssao = ssao;

        inputs.metalness = mrr[0];
        inputs.roughness = clamp(mrr[1] * mrr[1], 0.001, 0.99);
      `),r.code.add(i.H`
        inputs.f0 = (0.16 * mrr[2] * mrr[2]) * (1.0 - inputs.metalness) + inputs.albedoLinear * inputs.metalness;
        inputs.f90 = vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0)); // more accurate then using  f90 = 1.0
        inputs.diffuseColor = inputs.albedoLinear * (vec3(1.0) - inputs.f0) * (1.0 - inputs.metalness);
      `),r.code.add(i.H`
        vec3 ambientDir = vec3(5.0 * normalGround[1] - normalGround[0] * normalGround[2], - 5.0 * normalGround[0] - normalGround[2] * normalGround[1], normalGround[1] * normalGround[1] + normalGround[0] * normalGround[0]);
        ambientDir = ambientDir != vec3(0.0)? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));

        inputs.NdotAmbDir = abs(dot(normal, ambientDir));

        // Calculate the irradiance components: sun, fill lights and the sky.
        vec3 mainLightIrradianceComponent  = inputs.NdotL * (1.0 - shadow) * lightingMainIntensity;
        vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * lightingMainIntensity * fillLightIntensity;
        // calculateAmbientIrradiance for localView and additionalLight for gloabalView
        vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(normal, ssao) + additionalLight;

        // Assemble the overall irradiance of the sky that illuminates the surface
        inputs.skyIrradianceToSurface    = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
        // Assemble the overall irradiance of the ground that illuminates the surface. for this we use the simple model that changes only the sky irradiance by the groundReflectance
        inputs.groundIrradianceToSurface = GROUND_REFLECTANCE * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
      `),r.code.add(i.H`
        vec3 horizonRingDir = inputs.RdotNG * normalGround - reflectedView;
        vec3 horizonRingH = normalize(viewDirection + horizonRingDir);
        inputs.NdotH_Horizon = dot(normal, horizonRingH);

        vec3 mainLightRadianceComponent  = normalDistribution(inputs.NdotH, inputs.roughness) * lightingMainIntensity * (1.0 - shadow);
        vec3 horizonLightRadianceComponent = normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * lightingMainIntensity * fillLightIntensity;
        vec3 ambientLightRadianceComponent = calculateAmbientRadiance(ssao) + additionalLight; // calculateAmbientRadiance for localView and additionalLight for gloabalView

        // Assemble the overall radiance of the sky that illuminates the surface
        inputs.skyRadianceToSurface    =  ambientLightRadianceComponent + mainLightRadianceComponent + horizonLightRadianceComponent;
        // Assemble the overall radiance of the ground that illuminates the surface. for this we use the simple model that changes only the sky radince by the groundReflectance
        inputs.groundRadianceToSurface = GROUND_REFLECTANCE * (ambientLightRadianceComponent + horizonLightRadianceComponent) + mainLightRadianceComponent;

        // Calculate average ambient radiance - this is used int the gamut mapping part to deduce the black level that is soft compressed
        inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + GROUND_REFLECTANCE[1]);
        `),r.code.add(i.H`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 emissionComponent = pow(_emission, vec3(GAMMA_SRGB));
        vec3 outColorLinear = reflectedColorComponent + additionalMaterialReflectanceComponent + emissionComponent;
        ${2===t.pbrMode?i.H`vec3 outColor = pow(max(vec3(0.0), outColorLinear - 0.005 * inputs.averageAmbientRadiance), vec3(INV_GAMMA_SRGB));`:i.H`vec3 outColor = pow(blackLevelSoftCompression(outColorLinear, inputs), vec3(INV_GAMMA_SRGB));`}
        return outColor;
      }
    `)))}},88214:(e,t,r)=>{"use strict";r.d(t,{C:()=>o,l:()=>n});var i=r(33834);function n(e,t){e.fragment.uniforms.add("terrainDepthTexture","sampler2D"),e.fragment.uniforms.add("cameraNearFar","vec2"),e.fragment.uniforms.add("inverseViewport","vec2"),e.fragment.code.add(i.H`
    //Compare the linearized depths of the fragment and the terrain. If fragment is on the wrong side of the terrain, discard it.
    void terrainDepthTest(vec4 fragCoord, float fragmentDepth){

      float terrainDepth = linearDepthFromTexture(terrainDepthTexture, fragCoord.xy * inverseViewport, cameraNearFar);
      if(fragmentDepth ${t.cullAboveGround?">":"<="} terrainDepth){
        discard;
      }
    }
  `)}function o(e,t,r){r.multipassTerrainEnabled&&r.terrainLinearDepthTexture&&(e.setUniform1i("terrainDepthTexture",10),t.bindTexture(r.terrainLinearDepthTexture,10))}},52369:(e,t,r)=>{"use strict";r.d(t,{k:()=>n});var i=r(33834);function n(e,t){const r=e.fragment;r.code.add(i.H`
    struct ShadingNormalParameters {
      vec3 normalView;
      vec3 viewDirection;
    } shadingParams;
    `),1===t.doubleSidedMode?r.code.add(i.H`
      vec3 shadingNormal(ShadingNormalParameters params) {
        return dot(params.normalView, params.viewDirection) > 0.0 ? normalize(-params.normalView) : normalize(params.normalView);
      }
    `):2===t.doubleSidedMode?r.code.add(i.H`
      vec3 shadingNormal(ShadingNormalParameters params) {
        return gl_FrontFacing ? normalize(params.normalView) : normalize(-params.normalView);
      }
    `):r.code.add(i.H`
      vec3 shadingNormal(ShadingNormalParameters params) {
        return normalize(params.normalView);
      }
    `)}},87023:(e,t,r)=>{"use strict";r.d(t,{T:()=>a});var i=r(33834),n=r(9295);function o(e){const t=e.fragment.code;t.add(i.H`
    vec3 evaluateDiffuseIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float NdotNG)
    {
      return ((1.0 - NdotNG) * ambientGround + (1.0 + NdotNG) * ambientSky) * 0.5;
    }
    `),t.add(i.H`
    float integratedRadiance(float cosTheta2, float roughness)
    {
      return (cosTheta2 - 1.0) / (cosTheta2 * (1.0 - roughness * roughness) - 1.0);
    }
    `),t.add(i.H`
    vec3 evaluateSpecularIlluminationHemisphere(vec3 ambientGround, vec3 ambientSky, float RdotNG, float roughness)
    {
      float cosTheta2 = 1.0 - RdotNG * RdotNG;
      float intRadTheta = integratedRadiance(cosTheta2, roughness);

      // Calculate the integrated directional radiance of the ground and the sky
      float ground = RdotNG < 0.0 ? 1.0 - intRadTheta : 1.0 + intRadTheta;
      float sky = 2.0 - ground;
      return (ground * ambientGround + sky * ambientSky) * 0.5;
    }
    `)}function a(e,t){const r=e.fragment.code;e.include(n.e),3===t.pbrMode||4===t.pbrMode?(r.add(i.H`
    struct PBRShadingWater
    {
        float NdotL;   // cos angle between normal and light direction
        float NdotV;   // cos angle between normal and view direction
        float NdotH;   // cos angle between normal and half vector
        float VdotH;   // cos angle between view direction and half vector
        float LdotH;   // cos angle between light direction and half vector
        float VdotN;   // cos angle between view direction and normal vector
    };

    float dtrExponent = ${t.useCustomDTRExponentForWater?"2.2":"2.0"};
    `),r.add(i.H`
    vec3 fresnelReflection(float angle, vec3 f0, float f90) {
      return f0 + (f90 - f0) * pow(1.0 - angle, 5.0);
    }
    `),r.add(i.H`
    float normalDistributionWater(float NdotH, float roughness)
    {
      float r2 = roughness * roughness;
      float NdotH2 = NdotH * NdotH;
      float denom = pow((NdotH2 * (r2 - 1.0) + 1.0), dtrExponent) * PI;
      return r2 / denom;
    }
    `),r.add(i.H`
    float geometricOcclusionKelemen(float LoH)
    {
        return 0.25 / (LoH * LoH);
    }
    `),r.add(i.H`
    vec3 brdfSpecularWater(in PBRShadingWater props, float roughness, vec3 F0, float F0Max)
    {
      vec3  F = fresnelReflection(props.VdotH, F0, F0Max);
      float dSun = normalDistributionWater(props.NdotH, roughness);
      float V = geometricOcclusionKelemen(props.LdotH);

      float diffusionSunHaze = mix(roughness + 0.045, roughness + 0.385, 1.0 - props.VdotH);
      float strengthSunHaze  = 1.2;
      float dSunHaze = normalDistributionWater(props.NdotH, diffusionSunHaze)*strengthSunHaze;

      return ((dSun + dSunHaze) * V) * F;
    }

    vec3 tonemapACES(const vec3 x) {
      return (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
    }
    `)):1!==t.pbrMode&&2!==t.pbrMode||(e.include(o),r.add(i.H`
    struct PBRShadingInfo
    {
        float NdotL;                  // cos angle between normal and light direction
        float NdotV;                  // cos angle between normal and view direction
        float NdotH;                  // cos angle between normal and half vector
        float VdotH;                  // cos angle between view direction and half vector
        float LdotH;                  // cos angle between view light direction and half vector
        float NdotNG;                 // cos angle between normal and normal of the ground
        float RdotNG;                 // cos angle between view direction reflected of the normal and normal of the ground
        float NdotAmbDir;             // cos angle between view direction and the fill light in ambient illumination
        float NdotH_Horizon;          // cos angle between normal and half vector defined with horizon illumination
        vec3 skyRadianceToSurface;         // integrated radiance of the sky based on the surface roughness (used for specular reflection)
        vec3 groundRadianceToSurface;      // integrated radiance of the ground based on the surface roughness (used for specular reflection)
        vec3 skyIrradianceToSurface;       // irradiance of the sky (used for diffuse reflection)
        vec3 groundIrradianceToSurface;    // irradiance of the ground (used for diffuse reflection)

        float averageAmbientRadiance;      // average ambient radiance used to deduce black level in gamut mapping
        float ssao;                   // ssao coefficient
        vec3 albedoLinear;            // linear color of the albedo
        vec3 f0;                      // fresnel value at normal incident light
        vec3 f90;                     // fresnel value at 90o of incident light

        vec3 diffuseColor;            // diffuse color of the material used in environment illumination
        float metalness;              // metalness of the material
        float roughness;              // roughness of the material
    };
    `),r.add(i.H`
    float normalDistribution(float NdotH, float roughness)
    {
        float a = NdotH * roughness;
        float b = roughness / (1.0 - NdotH * NdotH + a * a);
        return b * b * INV_PI;
    }
    `),r.add(i.H`
    const vec4 c0 = vec4(-1.0, -0.0275, -0.572,  0.022);
    const vec4 c1 = vec4( 1.0,  0.0425,  1.040, -0.040);
    const vec2 c2 = vec2(-1.04, 1.04);

    vec2 prefilteredDFGAnalytical(float roughness, float NdotV) {
        vec4 r = roughness * c0 + c1;
        float a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
        return c2 * a004 + r.zw;
    }
    `),r.add(i.H`
    vec3 evaluateEnvironmentIllumination(PBRShadingInfo inputs) {
      vec3 indirectDiffuse = evaluateDiffuseIlluminationHemisphere(inputs.groundIrradianceToSurface, inputs.skyIrradianceToSurface, inputs.NdotNG);
      vec3 indirectSpecular = evaluateSpecularIlluminationHemisphere(inputs.groundRadianceToSurface, inputs.skyRadianceToSurface, inputs.RdotNG, inputs.roughness);

      // From diffuse illumination calculate reflected color
      vec3 diffuseComponent = inputs.diffuseColor * indirectDiffuse * INV_PI;

      // From specular illumination calculate reflected color
      vec2 dfg = prefilteredDFGAnalytical(inputs.roughness, inputs.NdotV);
      vec3 specularColor = inputs.f0 * dfg.x + inputs.f90 * dfg.y;
      vec3 specularComponent = specularColor * indirectSpecular;

      return (diffuseComponent + specularComponent);
    }
    `),r.add(i.H`
    float gamutMapChanel(float x, vec2 p){
      return (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
    }`),r.add(i.H`
    vec3 blackLevelSoftCompression(vec3 inColor, PBRShadingInfo inputs){
      vec3 outColor;
      vec2 p = vec2(0.02 * (inputs.averageAmbientRadiance), 0.0075 * (inputs.averageAmbientRadiance));
      outColor.x = gamutMapChanel(inColor.x, p) ;
      outColor.y = gamutMapChanel(inColor.y, p) ;
      outColor.z = gamutMapChanel(inColor.z, p) ;
      return outColor;
    }
    `))}},44624:(e,t,r)=>{"use strict";r.d(t,{j:()=>a});var i=r(33834),n=r(69236),o=r(51206);function a(e,t){const r=e.fragment,n=t.hasMetalnessAndRoughnessTexture||t.hasEmissionTexture||t.hasOcclusionTexture;1===t.pbrMode&&n&&e.include(o.i,t),2!==t.pbrMode?(0===t.pbrMode&&r.code.add(i.H`
      float getBakedOcclusion() { return 1.0; }
  `),1===t.pbrMode&&(r.uniforms.add("emissionFactor","vec3"),r.uniforms.add("mrrFactors","vec3"),r.code.add(i.H`
      vec3 mrr;
      vec3 emission;
      float occlusion;
    `),t.hasMetalnessAndRoughnessTexture&&(r.uniforms.add("texMetallicRoughness","sampler2D"),t.supportsTextureAtlas&&r.uniforms.add("texMetallicRoughnessSize","vec2"),r.code.add(i.H`
      void applyMetallnessAndRoughness(TextureLookupParameter params) {
        vec3 metallicRoughness = textureLookup(texMetallicRoughness, params).rgb;

        mrr[0] *= metallicRoughness.b;
        mrr[1] *= metallicRoughness.g;
      }`)),t.hasEmissionTexture&&(r.uniforms.add("texEmission","sampler2D"),t.supportsTextureAtlas&&r.uniforms.add("texEmissionSize","vec2"),r.code.add(i.H`
      void applyEmission(TextureLookupParameter params) {
        emission *= textureLookup(texEmission, params).rgb;
      }`)),t.hasOcclusionTexture?(r.uniforms.add("texOcclusion","sampler2D"),t.supportsTextureAtlas&&r.uniforms.add("texOcclusionSize","vec2"),r.code.add(i.H`
      void applyOcclusion(TextureLookupParameter params) {
        occlusion *= textureLookup(texOcclusion, params).r;
      }

      float getBakedOcclusion() {
        return occlusion;
      }
      `)):r.code.add(i.H`
      float getBakedOcclusion() { return 1.0; }
      `),r.code.add(i.H`
    void applyPBRFactors() {
      mrr = mrrFactors;
      emission = emissionFactor;
      occlusion = 1.0;
      ${n?"vtc.uv = vuv0;":""}
      ${t.hasMetalnessAndRoughnessTexture?t.supportsTextureAtlas?"vtc.size = texMetallicRoughnessSize; applyMetallnessAndRoughness(vtc);":"applyMetallnessAndRoughness(vtc);":""}
      ${t.hasEmissionTexture?t.supportsTextureAtlas?"vtc.size = texEmissionSize; applyEmission(vtc);":"applyEmission(vtc);":""}
      ${t.hasOcclusionTexture?t.supportsTextureAtlas?"vtc.size = texOcclusionSize; applyOcclusion(vtc);":"applyOcclusion(vtc);":""}
    }
  `))):r.code.add(i.H`
      const vec3 mrr = vec3(0.0, 0.6, 0.2);
      const vec3 emission = vec3(0.0);
      float occlusion = 1.0;

      void applyPBRFactors() {}

      float getBakedOcclusion() { return 1.0; }
    `)}(0,n.f)(0,.6,.2),(a||(a={})).bindUniforms=function(e,t,r=!1){r||(e.setUniform3fv("mrrFactors",t.mrrFactors),e.setUniform3fv("emissionFactor",t.emissiveFactor))}},9295:(e,t,r)=>{"use strict";r.d(t,{e:()=>n});var i=r(33834);function n(e){e.vertex.code.add(i.H`
    const float PI = 3.141592653589793;
  `),e.fragment.code.add(i.H`
    const float PI = 3.141592653589793;
    const float LIGHT_NORMALIZATION = 1.0 / PI;
    const float INV_PI = 0.3183098861837907;
    const float HALF_PI = 1.570796326794897;
    `)}},71613:(e,t,r)=>{"use strict";r.d(t,{h:()=>a});var i,n=r(33834),o=r(61017);function a(e){e.fragment.include(o.n),e.fragment.uniforms.add("uShadowMapTex","sampler2D"),e.fragment.uniforms.add("uShadowMapNum","int"),e.fragment.uniforms.add("uShadowMapDistance","vec4"),e.fragment.uniforms.add("uShadowMapMatrix","mat4",4),e.fragment.uniforms.add("uDepthHalfPixelSz","float"),e.fragment.code.add(n.H`
    int chooseCascade(float _linearDepth, out mat4 mat) {
      vec4 distance = uShadowMapDistance;
      float depth = _linearDepth;

      //choose correct cascade
      int i = depth < distance[1] ? 0 : depth < distance[2] ? 1 : depth < distance[3] ? 2 : 3;

      mat = i == 0 ? uShadowMapMatrix[0] : i == 1 ? uShadowMapMatrix[1] : i == 2 ? uShadowMapMatrix[2] : uShadowMapMatrix[3];

      return i;
    }

    vec3 lightSpacePosition(vec3 _vpos, mat4 mat) {
      vec4 lv = mat * vec4(_vpos, 1.0);
      lv.xy /= lv.w;
      return 0.5 * lv.xyz + vec3(0.5);
    }

    vec2 cascadeCoordinates(int i, vec3 lvpos) {
      return vec2(float(i - 2 * (i / 2)) * 0.5, float(i / 2) * 0.5) + 0.5 * lvpos.xy;
    }

    float readShadowMapDepth(vec2 uv, sampler2D _depthTex) {
      return rgba2float(texture2D(_depthTex, uv));
    }

    float posIsInShadow(vec2 uv, vec3 lvpos, sampler2D _depthTex) {
      return readShadowMapDepth(uv, _depthTex) < lvpos.z ? 1.0 : 0.0;
    }

    float filterShadow(vec2 uv, vec3 lvpos, float halfPixelSize, sampler2D _depthTex) {
      float texSize = 0.5 / halfPixelSize;

      // filter, offset by half pixels
      vec2 st = fract((vec2(halfPixelSize) + uv) * texSize);

      float s00 = posIsInShadow(uv + vec2(-halfPixelSize, -halfPixelSize), lvpos, _depthTex);
      float s10 = posIsInShadow(uv + vec2(halfPixelSize, -halfPixelSize), lvpos, _depthTex);
      float s11 = posIsInShadow(uv + vec2(halfPixelSize, halfPixelSize), lvpos, _depthTex);
      float s01 = posIsInShadow(uv + vec2(-halfPixelSize, halfPixelSize), lvpos, _depthTex);

      return mix(mix(s00, s10, st.x), mix(s01, s11, st.x), st.y);
    }

    float readShadowMap(const in vec3 _vpos, float _linearDepth) {
      mat4 mat;
      int i = chooseCascade(_linearDepth, mat);

      if (i >= uShadowMapNum) { return 0.0; }

      vec3 lvpos = lightSpacePosition(_vpos, mat);

      // vertex completely outside? -> no shadow
      if (lvpos.z >= 1.0) { return 0.0; }
      if (lvpos.x < 0.0 || lvpos.x > 1.0 || lvpos.y < 0.0 || lvpos.y > 1.0) { return 0.0; }

      // calc coord in cascade texture
      vec2 uv = cascadeCoordinates(i, lvpos);

      return filterShadow(uv, lvpos, uDepthHalfPixelSz, uShadowMapTex);
    }
  `)}(i=a||(a={})).bindUniforms=function(e,t,r){t.shadowMappingEnabled&&(t.shadowMap.bind(e,r),t.shadowMap.bindView(e,t.origin))},i.bindViewCustomOrigin=function(e,t,r){t.shadowMappingEnabled&&t.shadowMap.bindView(e,r)},i.bindView=function(e,t){t.shadowMappingEnabled&&t.shadowMap.bindView(e,t.origin)}},8681:(e,t,r)=>{"use strict";r.d(t,{k:()=>n});var i=r(33834);function n(e,t){t.vvInstancingEnabled&&(t.vvSize||t.vvColor)&&e.attributes.add("instanceFeatureAttribute","vec4"),t.vvSize?(e.vertex.uniforms.add("vvSizeMinSize","vec3"),e.vertex.uniforms.add("vvSizeMaxSize","vec3"),e.vertex.uniforms.add("vvSizeOffset","vec3"),e.vertex.uniforms.add("vvSizeFactor","vec3"),e.vertex.uniforms.add("vvSymbolRotationMatrix","mat3"),e.vertex.uniforms.add("vvSymbolAnchor","vec3"),e.vertex.code.add(i.H`
      vec3 vvScale(vec4 _featureAttribute) {
        return clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize);
      }

      vec4 vvTransformPosition(vec3 position, vec4 _featureAttribute) {
        return vec4(vvSymbolRotationMatrix * ( vvScale(_featureAttribute) * (position + vvSymbolAnchor)), 1.0);
      }
    `),e.vertex.code.add(i.H`
      const float eps = 1.192092896e-07;
      vec4 vvTransformNormal(vec3 _normal, vec4 _featureAttribute) {
        vec3 vvScale = clamp(vvSizeOffset + _featureAttribute.x * vvSizeFactor, vvSizeMinSize + eps, vvSizeMaxSize);
        return vec4(vvSymbolRotationMatrix * _normal / vvScale, 1.0);
      }

      ${t.vvInstancingEnabled?i.H`
      vec4 vvLocalNormal(vec3 _normal) {
        return vvTransformNormal(_normal, instanceFeatureAttribute);
      }

      vec4 localPosition() {
        return vvTransformPosition(position, instanceFeatureAttribute);
      }`:""}
    `)):e.vertex.code.add(i.H`
      vec4 localPosition() { return vec4(position, 1.0); }

      vec4 vvLocalNormal(vec3 _normal) { return vec4(_normal, 1.0); }
    `),t.vvColor?(e.vertex.constants.add("vvColorNumber","int",8),e.vertex.code.add(i.H`
      uniform float vvColorValues[vvColorNumber];
      uniform vec4 vvColorColors[vvColorNumber];

      vec4 vvGetColor(vec4 featureAttribute, float values[vvColorNumber], vec4 colors[vvColorNumber]) {
        float value = featureAttribute.y;
        if (value <= values[0]) {
          return colors[0];
        }

        for (int i = 1; i < vvColorNumber; ++i) {
          if (values[i] >= value) {
            float f = (value - values[i-1]) / (values[i] - values[i-1]);
            return mix(colors[i-1], colors[i], f);
          }
        }
        return colors[vvColorNumber - 1];
      }

      ${t.vvInstancingEnabled?i.H`
      vec4 vvColor() {
        return vvGetColor(instanceFeatureAttribute, vvColorValues, vvColorColors);
      }`:""}
    `)):e.vertex.code.add(i.H`
      vec4 vvColor() { return vec4(1.0); }
    `)}!function(e){function t(e,t){t.vvSizeEnabled&&(e.setUniform3fv("vvSizeMinSize",t.vvSizeMinSize),e.setUniform3fv("vvSizeMaxSize",t.vvSizeMaxSize),e.setUniform3fv("vvSizeOffset",t.vvSizeOffset),e.setUniform3fv("vvSizeFactor",t.vvSizeFactor)),t.vvColorEnabled&&(e.setUniform1fv("vvColorValues",t.vvColorValues),e.setUniform4fv("vvColorColors",t.vvColorColors))}e.bindUniforms=t,e.bindUniformsWithOpacity=function(e,r){t(e,r),r.vvOpacityEnabled&&(e.setUniform1fv("vvOpacityValues",r.vvOpacityValues),e.setUniform1fv("vvOpacityOpacities",r.vvOpacityOpacities))},e.bindUniformsForSymbols=function(e,r){t(e,r),r.vvSizeEnabled&&(e.setUniform3fv("vvSymbolAnchor",r.vvSymbolAnchor),e.setUniformMatrix3fv("vvSymbolRotationMatrix",r.vvSymbolRotationMatrix))}}(n||(n={}))},34658:(e,t,r)=>{"use strict";r.d(t,{sj:()=>a,F:()=>n,bf:()=>o});var i=r(33834);const n=.1,o=.001;function a(e,t){const r=e.fragment;switch(t.alphaDiscardMode){case 0:r.code.add(i.H`
        #define discardOrAdjustAlpha(color) { if (color.a < ${i.H.float(o)}) { discard; } }
      `);break;case 1:r.code.add(i.H`
        void discardOrAdjustAlpha(inout vec4 color) {
          color.a = 1.0;
        }
      `);break;case 2:r.uniforms.add("textureAlphaCutoff","float"),r.code.add(i.H`
        #define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } else { color.a = 1.0; } }
      `);break;case 3:e.fragment.uniforms.add("textureAlphaCutoff","float"),e.fragment.code.add(i.H`
        #define discardOrAdjustAlpha(color) { if (color.a < textureAlphaCutoff) { discard; } }
      `)}}},25117:(e,t,r)=>{"use strict";r.d(t,{$:()=>v,I:()=>b});var i=r(95830),n=r(33834),o=r(59472),a=(r(33655),r(77625)),s=r(51007),c=r(56469),l=r(69595),u=r(74038),d=r(71061),f=r(84570),h=r(31563);class m{constructor(e){this.context=e,this.svgAlwaysPremultipliesAlpha=!1,this._doublePrecisionRequiresObfuscation=null,(0,h.M)(e).then((e=>{this.svgAlwaysPremultipliesAlpha=!e}))}get doublePrecisionRequiresObfuscation(){if((0,o.Wi)(this._doublePrecisionRequiresObfuscation)){const e=g(this.context,!1),t=g(this.context,!0);this._doublePrecisionRequiresObfuscation=0!==e&&(0===t||e/t>5)}return this._doublePrecisionRequiresObfuscation}}let p=null;function g(e,t){const r=new f.Z(e,{colorTarget:0,depthStencilTarget:0},{target:3553,wrapMode:33071,pixelFormat:6408,dataType:5121,samplingMode:9728,width:1,height:1}),i=l.Z.createVertex(e,35044,new Uint16Array([0,0,1,0,0,1,1,1])),n=new u.Z(e,{a_pos:0},{geometry:[{name:"a_pos",count:2,type:5123,offset:0,stride:4,normalized:!1}]},{geometry:i}),o=(0,a.f)(5633261.287538229,2626832.878767164,1434988.0495278358),h=(0,a.f)(5633271.46742708,2626873.6381334523,1434963.231608387),m=function(r,i){const n=new s.Z(e,`\n\n  precision highp float;\n\n  attribute vec2 a_pos;\n\n  uniform vec3 u_highA;\n  uniform vec3 u_lowA;\n  uniform vec3 u_highB;\n  uniform vec3 u_lowB;\n\n  varying vec4 v_color;\n\n  ${t?"#define DOUBLE_PRECISION_REQUIRES_OBFUSCATION":""}\n\n  #ifdef DOUBLE_PRECISION_REQUIRES_OBFUSCATION\n\n  vec3 dpPlusFrc(vec3 a, vec3 b) {\n    return mix(a, a + b, vec3(notEqual(b, vec3(0))));\n  }\n\n  vec3 dpMinusFrc(vec3 a, vec3 b) {\n    return mix(vec3(0), a - b, vec3(notEqual(a, b)));\n  }\n\n  vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {\n    vec3 t1 = dpPlusFrc(hiA, hiB);\n    vec3 e = dpMinusFrc(t1, hiA);\n    vec3 t2 = dpMinusFrc(hiB, e) + dpMinusFrc(hiA, dpMinusFrc(t1, e)) + loA + loB;\n    return t1 + t2;\n  }\n\n  #else\n\n  vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {\n    vec3 t1 = hiA + hiB;\n    vec3 e = t1 - hiA;\n    vec3 t2 = ((hiB - e) + (hiA - (t1 - e))) + loA + loB;\n    return t1 + t2;\n  }\n\n  #endif\n\n  const float MAX_RGBA_FLOAT =\n    255.0 / 256.0 +\n    255.0 / 256.0 / 256.0 +\n    255.0 / 256.0 / 256.0 / 256.0 +\n    255.0 / 256.0 / 256.0 / 256.0 / 256.0;\n\n  const vec4 FIXED_POINT_FACTORS = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);\n\n  vec4 float2rgba(const float value) {\n    // Make sure value is in the domain we can represent\n    float valueInValidDomain = clamp(value, 0.0, MAX_RGBA_FLOAT);\n\n    // Decompose value in 32bit fixed point parts represented as\n    // uint8 rgba components. Decomposition uses the fractional part after multiplying\n    // by a power of 256 (this removes the bits that are represented in the previous\n    // component) and then converts the fractional part to 8bits.\n    vec4 fixedPointU8 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);\n\n    // Convert uint8 values (from 0 to 255) to floating point representation for\n    // the shader\n    const float toU8AsFloat = 1.0 / 255.0;\n\n    return fixedPointU8 * toU8AsFloat;\n  }\n\n  void main() {\n    vec3 val = dpAdd(u_highA, u_lowA, -u_highB, -u_lowB);\n\n    v_color = float2rgba(val.z / 25.0);\n\n    gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);\n  }\n  `,"\n  precision highp float;\n\n  varying vec4 v_color;\n\n  void main() {\n    gl_FragColor = v_color;\n  }\n  ",{a_pos:0}),o=new Float32Array(6);(0,d.LF)(r,o,3);const a=new Float32Array(6);return(0,d.LF)(i,a,3),e.bindProgram(n),n.setUniform3f("u_highA",o[0],o[2],o[4]),n.setUniform3f("u_lowA",o[1],o[3],o[5]),n.setUniform3f("u_highB",a[0],a[2],a[4]),n.setUniform3f("u_lowB",a[1],a[3],a[5]),n}(o,h),p=e.getBoundFramebufferObject(),{x:g,y:v,width:b,height:x}=e.getViewport();e.bindFramebuffer(r),e.setViewport(0,0,1,1),e.bindVAO(n),e.drawArrays(5,0,4);const y=new Uint8Array(4);r.readPixels(0,0,1,1,6408,5121,y),m.dispose(),n.dispose(!1),i.dispose(),r.dispose(),e.setViewport(g,v,b,x),e.bindFramebuffer(p);const _=(o[2]-h[2])/25,w=(0,c.vP)(y);return Math.abs(_-w)}function v({code:e},t){t.doublePrecisionRequiresObfuscation?e.add(n.H`
      vec3 dpPlusFrc(vec3 a, vec3 b) {
        return mix(a, a + b, vec3(notEqual(b, vec3(0))));
      }

      vec3 dpMinusFrc(vec3 a, vec3 b) {
        return mix(vec3(0), a - b, vec3(notEqual(a, b)));
      }

      // based on https://www.thasler.com/blog/blog/glsl-part2-emu
      vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
        vec3 t1 = dpPlusFrc(hiA, hiB);
        vec3 e = dpMinusFrc(t1, hiA);
        vec3 t2 = dpMinusFrc(hiB, e) + dpMinusFrc(hiA, dpMinusFrc(t1, e)) + loA + loB;
        return t1 + t2;
      }
    `):e.add(n.H`
      vec3 dpAdd(vec3 hiA, vec3 loA, vec3 hiB, vec3 loB) {
        vec3 t1 = hiA + hiB;
        vec3 e = t1 - hiA;
        vec3 t2 = ((hiB - e) + (hiA - (t1 - e))) + loA + loB;
        return t1 + t2;
      }
    `)}function b(e){return!!(0,i.Z)("force-double-precision-obfuscation")||(t=e,((0,o.Wi)(p)||p.context!==t)&&(p=new m(t)),p).doublePrecisionRequiresObfuscation;var t}},62734:(e,t,r)=>{"use strict";r.d(t,{a:()=>n}),r(95830);var i=r(33834);function n(e,t){i.H`
  /*
  *  ${t.name}
  *  ${0===t.output?"RenderOutput: Color":1===t.output?"RenderOutput: Depth":3===t.output?"RenderOutput: Shadow":2===t.output?"RenderOutput: Normal":4===t.output?"RenderOutput: Highlight":""}
  */
  `}},50230:(e,t,r)=>{"use strict";r.d(t,{y:()=>o});var i=r(33834);function n(e){e.code.add(i.H`
    vec4 premultiplyAlpha(vec4 v) {
      return vec4(v.rgb * v.a, v.a);
    }

    // Note: the min in the last line has been added to fix an instability in chrome.
    // See https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/23911
    // With proper floating point handling, the value could never be >1.
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
    }
  `)}function o(e){e.include(n),e.code.add(i.H`
    vec3 mixExternalColor(vec3 internalColor, vec3 textureColor, vec3 externalColor, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      vec3 internalMixed = internalColor * textureColor;
      vec3 allMixed = internalMixed * externalColor;

      if (mode == ${i.H.int(1)}) {
        return allMixed;
      }
      else if (mode == ${i.H.int(2)}) {
        return internalMixed;
      }
      else if (mode == ${i.H.int(3)}) {
        return externalColor;
      }
      else {
        // tint (or something invalid)
        float vIn = rgb2v(internalMixed);
        vec3 hsvTint = rgb2hsv(externalColor);
        vec3 hsvOut = vec3(hsvTint.x, hsvTint.y, vIn * hsvTint.z);
        return hsv2rgb(hsvOut);
      }
    }

    float mixExternalOpacity(float internalOpacity, float textureOpacity, float externalOpacity, int mode) {
      // workaround for artifacts in OSX using Intel Iris Pro
      // see: https://devtopia.esri.com/WebGIS/arcgis-js-api/issues/10475
      float internalMixed = internalOpacity * textureOpacity;
      float allMixed = internalMixed * externalOpacity;

      if (mode == ${i.H.int(2)}) {
        return internalMixed;
      }
      else if (mode == ${i.H.int(3)}) {
        return externalOpacity;
      }
      else {
        // multiply or tint (or something invalid)
        return allMixed;
      }
    }
  `)}},61017:(e,t,r)=>{"use strict";r.d(t,{n:()=>n});var i=r(33834);function n(e){e.code.add(i.H`
    // This is the maximum float value representable as 32bit fixed point,
    // it is rgba2float(vec4(1)) inlined.
    const float MAX_RGBA_FLOAT =
      255.0 / 256.0 +
      255.0 / 256.0 / 256.0 +
      255.0 / 256.0 / 256.0 / 256.0 +
      255.0 / 256.0 / 256.0 / 256.0 / 256.0;

    // Factors to convert to fixed point, i.e. factors (256^0, 256^1, 256^2, 256^3)
    const vec4 FIXED_POINT_FACTORS = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);

    vec4 float2rgba(const float value) {
      // Make sure value is in the domain we can represent
      float valueInValidDomain = clamp(value, 0.0, MAX_RGBA_FLOAT);

      // Decompose value in 32bit fixed point parts represented as
      // uint8 rgba components. Decomposition uses the fractional part after multiplying
      // by a power of 256 (this removes the bits that are represented in the previous
      // component) and then converts the fractional part to 8bits.
      vec4 fixedPointU8 = floor(fract(valueInValidDomain * FIXED_POINT_FACTORS) * 256.0);

      // Convert uint8 values (from 0 to 255) to floating point representation for
      // the shader
      const float toU8AsFloat = 1.0 / 255.0;

      return fixedPointU8 * toU8AsFloat;
    }

    // Factors to convert rgba back to float
    const vec4 RGBA_2_FLOAT_FACTORS = vec4(
      255.0 / (256.0),
      255.0 / (256.0 * 256.0),
      255.0 / (256.0 * 256.0 * 256.0),
      255.0 / (256.0 * 256.0 * 256.0 * 256.0)
    );

    float rgba2float(vec4 rgba) {
      // Convert components from 0->1 back to 0->255 and then
      // add the components together with their corresponding
      // fixed point factors, i.e. (256^1, 256^2, 256^3, 256^4)
      return dot(rgba, RGBA_2_FLOAT_FACTORS);
    }
  `)}},51219:(e,t,r)=>{"use strict";r.d(t,{kG:()=>o});const i=r(36544).Z.getLogger("esri.views.3d.webgl-engine.core.shaderModules.shaderBuilder");class n{constructor(){this.includedModules=new Map}include(e,t){this.includedModules.has(e)?this.includedModules.get(e)!==t&&i.error("Trying to include shader module multiple times with different sets of options."):(this.includedModules.set(e,t),e(this.builder,t))}}class o extends n{constructor(){super(...arguments),this.vertex=new c,this.fragment=new c,this.attributes=new l,this.varyings=new u,this.extensions=new d,this.constants=new f}get builder(){return this}generateSource(e){const t=this.extensions.generateSource(e),r=this.attributes.generateSource(e),i=this.varyings.generateSource(),n="vertex"===e?this.vertex:this.fragment,o=n.uniforms.generateSource(),a=n.code.generateSource(),s="vertex"===e?m:h,c=this.constants.generateSource().concat(n.constants.generateSource());return`\n${t.join("\n")}\n\n${s}\n\n${c.join("\n")}\n\n${o.join("\n")}\n\n${r.join("\n")}\n\n${i.join("\n")}\n\n${a.join("\n")}`}}class a{constructor(){this._entries=new Array,this._set=new Set}add(e,t,r){const i=`${e}_${t}_${r}`;return this._set.has(i)||(this._entries.push([e,t,r]),this._set.add(i)),this}generateSource(){return this._entries.map((e=>{return`uniform ${e[1]} ${e[0]}${t=e[2],t?`[${t}]`:""};`;var t}))}}class s{constructor(){this._entries=new Array}add(e){this._entries.push(e)}generateSource(){return this._entries}}class c extends n{constructor(){super(...arguments),this.uniforms=new a,this.code=new s,this.constants=new f}get builder(){return this}}class l{constructor(){this._entries=new Array}add(e,t){this._entries.push([e,t])}generateSource(e){return"fragment"===e?[]:this._entries.map((e=>`attribute ${e[1]} ${e[0]};`))}}class u{constructor(){this._entries=new Array}add(e,t){this._entries.push([e,t])}generateSource(){return this._entries.map((e=>`varying ${e[1]} ${e[0]};`))}}class d{constructor(){this._entries=new Set}add(e){this._entries.add(e)}generateSource(e){const t="vertex"===e?d.ALLOWLIST_VERTEX:d.ALLOWLIST_FRAGMENT;return Array.from(this._entries).filter((e=>t.includes(e))).map((e=>`#extension ${e} : enable`))}}d.ALLOWLIST_FRAGMENT=["GL_EXT_shader_texture_lod","GL_OES_standard_derivatives"],d.ALLOWLIST_VERTEX=[];class f{constructor(){this._entries=[]}add(e,t,r){let i="ERROR_CONSTRUCTOR_STRING";switch(t){case"float":i=f.numberToFloatStr(r);break;case"int":i=f.numberToIntStr(r);break;case"bool":i=r.toString();break;case"vec2":i=`vec2(${f.numberToFloatStr(r[0])},                            ${f.numberToFloatStr(r[1])})`;break;case"vec3":i=`vec3(${f.numberToFloatStr(r[0])},                            ${f.numberToFloatStr(r[1])},                            ${f.numberToFloatStr(r[2])})`;break;case"vec4":i=`vec4(${f.numberToFloatStr(r[0])},                            ${f.numberToFloatStr(r[1])},                            ${f.numberToFloatStr(r[2])},                            ${f.numberToFloatStr(r[3])})`;break;case"ivec2":i=`ivec2(${f.numberToIntStr(r[0])},                             ${f.numberToIntStr(r[1])})`;break;case"ivec3":i=`ivec3(${f.numberToIntStr(r[0])},                             ${f.numberToIntStr(r[1])},                             ${f.numberToIntStr(r[2])})`;break;case"ivec4":i=`ivec4(${f.numberToIntStr(r[0])},                             ${f.numberToIntStr(r[1])},                             ${f.numberToIntStr(r[2])},                             ${f.numberToIntStr(r[3])})`;break;case"bvec2":i=`bvec2(${r[0].toString()},                             ${r[1].toString()})`;break;case"bvec3":i=`bvec3(${r[0].toString()},                             ${r[1].toString()},                             ${r[2].toString()})`;break;case"bvec4":i=`bvec4(${r[0].toString()},                             ${r[1].toString()},                             ${r[2].toString()},                             ${r[3].toString()})`;break;case"mat2":case"mat3":case"mat4":i=`${t}(${Array.prototype.map.call(r,(e=>f.numberToFloatStr(e))).join(", ")})`}return this._entries.push(`const ${t} ${e} = ${i};`),this}static numberToIntStr(e){return e.toFixed(0)}static numberToFloatStr(e){return Number.isInteger(e)?e.toFixed(1):e.toString()}generateSource(){return Array.from(this._entries)}}const h="#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n  precision highp sampler2D;\n#else\n  precision mediump float;\n  precision mediump sampler2D;\n#endif",m="precision highp float;\nprecision highp sampler2D;"},33834:(e,t,r)=>{"use strict";function i(e,...t){let r="";for(let i=0;i<t.length;i++)r+=e[i]+t[i];return r+=e[e.length-1],r}r.d(t,{H:()=>i}),function(e){e.int=function(e){return Math.round(e).toString()},e.float=function(e){return e.toPrecision(8)}}(i||(i={}))},71061:(e,t,r)=>{"use strict";function i(e,t,r){for(let i=0;i<r;++i)t[2*i]=e[i],t[2*i+1]=e[i]-t[2*i]}function n(e,t,r,n){for(let s=0;s<n;++s)o[0]=e[s],i(o,a,1),t[s]=a[0],r[s]=a[1]}r.d(t,{LF:()=>i,po:()=>n});const o=new Float64Array(1),a=new Float32Array(2)},48775:(e,t,r)=>{"use strict";r.d(t,{bj:()=>w,FZ:()=>M,Uf:()=>T,Bw:()=>h,LO:()=>S,Hx:()=>_});var i=r(59472),n=r(33655),o=r(77625),a=r(17387),s=r(69996),c=r(56469),l=r(49366);function u(e,t,r,i){return function(e,t){return Math.max((0,n.t7)(e*t.scale,e,t.factor),function(e,t){return 0===e?t.minPixelSize:t.minPixelSize*(1+2*t.paddingPixels/e)}(e,t))}(e,function(e,t,r){const i=r.parameters,n=r.paddingPixelsOverride;return d.scale=Math.min(i.divisor/(t-i.offset),1),d.factor=function(e){return Math.abs(e*e*e)}(e),d.minPixelSize=i.minPixelSize,d.paddingPixels=n,d}(t,r,i))}(0,n.Vl)(10),(0,n.Vl)(12),(0,n.Vl)(70),(0,n.Vl)(40);const d={scale:0,factor:0,minPixelSize:0,paddingPixels:0},f=(0,s.Ue)();function h(e,t,r,i,n,o,a){const s=(0,l.PD)(t),u=r.tolerance;if(!s)if(e.boundingInfo)(0,c.hu)(0===e.primitiveType),p(e.boundingInfo,i,n,u,o,a);else{const t=e.indices.get("position"),r=e.vertexAttributes.get("position");v(i,n,0,t.length/3,t,r,void 0,o,a)}}const m=(0,o.c)();function p(e,t,r,n,o,c){if((0,i.Wi)(e))return;const l=function(e,t,r){return(0,a.s)(r,1/(t[0]-e[0]),1/(t[1]-e[1]),1/(t[2]-e[2]))}(t,r,m);if((0,s.op)(f,e.getBBMin()),(0,s.Tn)(f,e.getBBMax()),(0,i.pC)(o)&&o.applyToAabb(f),function(e,t,r,i){return function(e,t,r,i,n){const o=(e[0]-i-t[0])*r[0],a=(e[3]+i-t[0])*r[0];let s=Math.min(o,a),c=Math.max(o,a);const l=(e[1]-i-t[1])*r[1],u=(e[4]+i-t[1])*r[1];if(c=Math.min(c,Math.max(l,u)),c<0)return!1;if(s=Math.max(s,Math.min(l,u)),s>c)return!1;const d=(e[2]-i-t[2])*r[2],f=(e[5]+i-t[2])*r[2];return c=Math.min(c,Math.max(d,f)),!(c<0)&&(s=Math.max(s,Math.min(d,f)),!(s>c)&&s<1/0)}(e,t,r,i)}(f,t,l,n)){const{primitiveIndices:i,indices:a,position:s}=e,l=i?i.length:a.length/3;if(l>A){const i=e.getChildren();if(void 0!==i){for(let e=0;e<8;++e)void 0!==i[e]&&p(i[e],t,r,n,o,c);return}}v(t,r,0,l,a,s,i,o,c)}}const g=(0,o.c)();function v(e,t,r,n,o,a,s,c,l){if(s)return function(e,t,r,n,o,a,s,c,l){const u=a.data,d=a.stride||a.size,f=e[0],h=e[1],m=e[2],p=t[0]-f,v=t[1]-h,b=t[2]-m;for(let e=r;e<n;++e){const t=s[e];let r=3*t,n=d*o[r++],a=u[n++],x=u[n++],_=u[n];n=d*o[r++];let w=u[n++],T=u[n++],S=u[n];n=d*o[r];let C=u[n++],M=u[n++],A=u[n];(0,i.pC)(c)&&([a,x,_]=c.applyToVertex(a,x,_,e),[w,T,S]=c.applyToVertex(w,T,S,e),[C,M,A]=c.applyToVertex(C,M,A,e));const P=w-a,O=T-x,I=S-_,F=C-a,D=M-x,L=A-_,R=v*L-D*b,z=b*F-L*p,B=p*D-F*v,H=P*R+O*z+I*B;if(Math.abs(H)<=Number.EPSILON)continue;const E=f-a,U=h-x,N=m-_,V=E*R+U*z+N*B;if(H>0){if(V<0||V>H)continue}else if(V>0||V<H)continue;const k=U*I-O*N,G=N*P-I*E,W=E*O-P*U,q=p*k+v*G+b*W;if(H>0){if(q<0||V+q>H)continue}else if(q>0||V+q<H)continue;const j=(F*k+D*G+L*W)/H;j>=0&&l(j,y(P,O,I,F,D,L,g),t)}}(e,t,r,n,o,a,s,c,l);const u=a.data,d=a.stride||a.size,f=e[0],h=e[1],m=e[2],p=t[0]-f,v=t[1]-h,b=t[2]-m;for(let e=r,t=3*r;e<n;++e){let r=d*o[t++],n=u[r++],a=u[r++],s=u[r];r=d*o[t++];let x=u[r++],_=u[r++],w=u[r];r=d*o[t++];let T=u[r++],S=u[r++],C=u[r];(0,i.pC)(c)&&([n,a,s]=c.applyToVertex(n,a,s,e),[x,_,w]=c.applyToVertex(x,_,w,e),[T,S,C]=c.applyToVertex(T,S,C,e));const M=x-n,A=_-a,P=w-s,O=T-n,I=S-a,F=C-s,D=v*F-I*b,L=b*O-F*p,R=p*I-O*v,z=M*D+A*L+P*R;if(Math.abs(z)<=Number.EPSILON)continue;const B=f-n,H=h-a,E=m-s,U=B*D+H*L+E*R;if(z>0){if(U<0||U>z)continue}else if(U>0||U<z)continue;const N=H*P-A*E,V=E*M-P*B,k=B*A-M*H,G=p*N+v*V+b*k;if(z>0){if(G<0||U+G>z)continue}else if(G>0||U+G<z)continue;const W=(O*N+I*V+F*k)/z;W>=0&&l(W,y(M,A,P,O,I,F,g),e)}}const b=(0,o.c)(),x=(0,o.c)();function y(e,t,r,i,n,o,s){return(0,a.s)(b,e,t,r),(0,a.s)(x,i,n,o),(0,a.c)(s,b,x),(0,a.n)(s,s),s}function _(e,t,r,i,o){let a=(r.screenLength||0)*e.pixelRatio;o&&(a=u(a,i,t,o));const s=a*Math.tan(.5*e.fovY)/(.5*e.fullHeight);return(0,n.YU)(s*t,r.minWorldLength||0,null!=r.maxWorldLength?r.maxWorldLength:1/0)}function w(e,t,r){if(!e)return;const i=e.parameters,n=e.paddingPixelsOverride;t.setUniform4f(r,i.divisor,i.offset,i.minPixelSize,n)}function T(e,t){const r=t?T(t):{};for(const t in e){let i=e[t];i&&i.forEach&&(i=C(i)),null==i&&t in r||(r[t]=i)}return r}function S(e,t){let r=!1;for(const i in t){const n=t[i];void 0!==n&&(r=!0,Array.isArray(n)?e[i]=n.slice():e[i]=n)}return r}function C(e){const t=[];return e.forEach((e=>t.push(e))),t}const M={multiply:1,ignore:2,replace:3,tint:4},A=1e3},49366:(e,t,r)=>{"use strict";r.d(t,{PD:()=>o});var i=r(59472),n=(r(67128),r(12811));function o(e){return!!(0,i.pC)(e)&&!e.visible}r(56469),r(71061),new Float64Array(3),new Float32Array(6),(0,n.a)()},51007:(e,t,r)=>{"use strict";r.d(t,{Z:()=>b}),r(95830);var i=r(59472);const n=["layout","centroid","smooth","case","mat2x2","mat2x3","mat2x4","mat3x2","mat3x3","mat3x4","mat4x2","mat4x3","mat4x4","uint","uvec2","uvec3","uvec4","samplerCubeShadow","sampler2DArray","sampler2DArrayShadow","isampler2D","isampler3D","isamplerCube","isampler2DArray","usampler2D","usampler3D","usamplerCube","usampler2DArray","coherent","restrict","readonly","writeonly","resource","atomic_uint","noperspective","patch","sample","subroutine","common","partition","active","filter","image1D","image2D","image3D","imageCube","iimage1D","iimage2D","iimage3D","iimageCube","uimage1D","uimage2D","uimage3D","uimageCube","image1DArray","image2DArray","iimage1DArray","iimage2DArray","uimage1DArray","uimage2DArray","image1DShadow","image2DShadow","image1DArrayShadow","image2DArrayShadow","imageBuffer","iimageBuffer","uimageBuffer","sampler1DArray","sampler1DArrayShadow","isampler1D","isampler1DArray","usampler1D","usampler1DArray","isampler2DRect","usampler2DRect","samplerBuffer","isamplerBuffer","usamplerBuffer","sampler2DMS","isampler2DMS","usampler2DMS","sampler2DMSArray","isampler2DMSArray","usampler2DMSArray","trunc","round","roundEven","isnan","isinf","floatBitsToInt","floatBitsToUint","intBitsToFloat","uintBitsToFloat","packSnorm2x16","unpackSnorm2x16","packUnorm2x16","unpackUnorm2x16","packHalf2x16","unpackHalf2x16","outerProduct","transpose","determinant","inverse","texture","textureSize","textureProj","textureLod","textureOffset","texelFetch","texelFetchOffset","textureProjOffset","textureLodOffset","textureProjLod","textureProjLodOffset","textureGrad","textureGradOffset","textureProjGrad","textureProjGradOffset"];var o=r(5627),a=999,s=["block-comment","line-comment","preprocessor","operator","integer","float","ident","builtin","keyword","whitespace","eof","integer"];function c(e){return function(e){var t=function(){var e,t,r,i=0,n=0,c=a,l=[],u=[],d=1,f=0,h=0,m=!1,p=!1,g="";return function(e){return u=[],null!==e?b(e.replace?e.replace(/\r\n/g,"\n"):e):(l.length&&v(l.join("")),c=10,v("(eof)"),u)};function v(e){e.length&&u.push({type:s[c],data:e,position:h,line:d,column:f})}function b(o){var s;for(i=0,r=(g+=o).length;e=g[i],i<r;){switch(s=i,c){case 0:i="/"===e&&"*"===t?(l.push(e),v(l.join("")),c=a,i+1):(l.push(e),t=e,i+1);break;case 1:case 2:i="\r"!==e&&"\n"!==e||"\\"===t?(l.push(e),t=e,i+1):(v(l.join("")),c=a,i);break;case 3:i=x();break;case 4:i="."===e||/[eE]/.test(e)?(l.push(e),c=5,t=e,i+1):"x"===e&&1===l.length&&"0"===l[0]?(c=11,l.push(e),t=e,i+1):/[^\d]/.test(e)?(v(l.join("")),c=a,i):(l.push(e),t=e,i+1);break;case 11:i=/[^a-fA-F0-9]/.test(e)?(v(l.join("")),c=a,i):(l.push(e),t=e,i+1);break;case 5:"f"===e&&(l.push(e),t=e,i+=1),i=/[eE]/.test(e)||"-"===e&&/[eE]/.test(t)?(l.push(e),t=e,i+1):/[^\d]/.test(e)?(v(l.join("")),c=a,i):(l.push(e),t=e,i+1);break;case 9999:i=_();break;case 9:i=/[^\s]/g.test(e)?(v(l.join("")),c=a,i):(l.push(e),t=e,i+1);break;case a:l=l.length?[]:l,i="/"===t&&"*"===e?(h=n+i-1,c=0,t=e,i+1):"/"===t&&"/"===e?(h=n+i-1,c=1,t=e,i+1):"#"===e?(c=2,h=n+i,i):/\s/.test(e)?(c=9,h=n+i,i):(m=/\d/.test(e),p=/[^\w_]/.test(e),h=n+i,c=m?4:p?3:9999,i)}if(s!==i)switch(g[s]){case"\n":f=0,++d;break;default:++f}}return n+=i,g=g.slice(i),u}function x(){if("."===t&&/\d/.test(e))return c=5,i;if("/"===t&&"*"===e)return c=0,i;if("/"===t&&"/"===e)return c=1,i;if("."===e&&l.length){for(;y(l););return c=5,i}if(";"===e||")"===e||"("===e){if(l.length)for(;y(l););return v(e),c=a,i+1}var r=2===l.length&&"="!==e;if(/[\w_\d\s]/.test(e)||r){for(;y(l););return c=a,i}return l.push(e),t=e,i+1}function y(e){for(var t,r,i=0;;){if(t=o.o.indexOf(e.slice(0,e.length+i).join("")),r=o.o[t],-1===t){if(i--+e.length>0)continue;r=e.slice(0,1).join("")}return v(r),h+=r.length,(l=l.slice(r.length)).length}}function _(){if(/[^\d\w_]/.test(e)){var r=l.join("");return c=o.l.indexOf(r)>-1?8:o.b.indexOf(r)>-1?7:6,v(l.join("")),c=a,i}return l.push(e),t=e,i+1}}(),r=[];return(r=r.concat(t(e))).concat(t(null))}(e)}const l=["GL_OES_standard_derivatives","GL_EXT_frag_depth","GL_EXT_draw_buffers","GL_EXT_shader_texture_lod"];function u(e,t){for(let r=t-1;r>=0;r--){const t=e[r];if("whitespace"!==t.type&&"block-comment"!==t.type){if("keyword"!==t.type)break;if("attribute"===t.data||"in"===t.data)return!0}}return!1}function d(e,t,r,i){i=i||r;for(const n of e)if("ident"===n.type&&n.data===r)return i in t?t[i]++:t[i]=0,d(e,t,i+"_"+t[i],i);return r}function f(e,t,r="afterVersion"){function i(e,t){for(let r=t;r<e.length;r++){const t=e[r];if("operator"===t.type&&";"===t.data)return r}return null}const n={data:"\n",type:"whitespace"},o=t=>t<e.length&&/[^\r\n]$/.test(e[t].data);let a=function(e){let t=-1,n=0,o=-1;for(let a=0;a<e.length;a++){const s=e[a];if("preprocessor"===s.type&&(s.data.match(/\#(if|ifdef|ifndef)\s+.+/)?++n:s.data.match(/\#endif\s*.*/)&&--n),"afterVersion"!==r&&"afterPrecision"!==r||"preprocessor"===s.type&&/^#version/.test(s.data)&&(o=Math.max(o,a)),"afterPrecision"===r&&"keyword"===s.type&&"precision"===s.data){const t=i(e,a);if(null===t)throw new Error("precision statement not followed by any semicolons!");o=Math.max(o,t)}t<o&&0===n&&(t=a)}return t+1}(e);o(a-1)&&e.splice(a++,0,n);for(const r of t)e.splice(a++,0,r);o(a-1)&&o(a)&&e.splice(a,0,n)}function h(e,t,r,i="lowp"){f(e,[{type:"keyword",data:"out"},{type:"whitespace",data:" "},{type:"keyword",data:i},{type:"whitespace",data:" "},{type:"keyword",data:r},{type:"whitespace",data:" "},{type:"ident",data:t},{type:"operator",data:";"}],"afterPrecision")}function m(e,t,r,i,n="lowp"){f(e,[{type:"keyword",data:"layout"},{type:"operator",data:"("},{type:"keyword",data:"location"},{type:"whitespace",data:" "},{type:"operator",data:"="},{type:"whitespace",data:" "},{type:"integer",data:i.toString()},{type:"operator",data:")"},{type:"whitespace",data:" "},{type:"keyword",data:"out"},{type:"whitespace",data:" "},{type:"keyword",data:n},{type:"whitespace",data:" "},{type:"keyword",data:r},{type:"whitespace",data:" "},{type:"ident",data:t},{type:"operator",data:";"}],"afterPrecision")}function p(e,t){let r,i,n=-1;for(let o=t;o<e.length;o++){const t=e[o];if("operator"===t.type&&("["===t.data&&(r=o),"]"===t.data)){i=o;break}"integer"===t.type&&(n=parseInt(t.data,10))}return r&&i&&e.splice(r,i-r+1),n}class g{constructor(e,t,r,i,n={}){if(this._context=null,this._glName=null,this._locations={},this._initialized=!1,this._vShader=null,this._fShader=null,this._defines={},this._nameToUniformLocation={},this._nameToAttribLocation={},this._nameToUniform1={},this._nameToUniform1v={},this._nameToUniform2={},this._nameToUniform3={},this._nameToUniform4={},this._nameToUniformMatrix3={},this._nameToUniformMatrix4={},e||console.error("RenderingContext isn't initialized!"),0===t.length&&console.error("Shaders source should not be empty!"),e.instanceCounter.increment(3,this),this._context=e,this._vertexShaderSource=t,this._fragmentShaderSource=r,Array.isArray(n))for(const e of n)this._defines[e]="1";else this._defines=n;this._locations=i}get glName(){return this._glName}get locations(){return this._locations}getDefine(e){return this._defines[e]}dispose(){if(!this._context)return;const e=this._context.gl;if(this._vShader){const t=this._vShader;e.deleteShader(t),this._vShader=null}if(this._fShader){const t=this._fShader;e.deleteShader(t),this._fShader=null}this._glName&&(e.deleteProgram(this._glName),this._glName=null),this._context.instanceCounter.decrement(3,this),this._context=null}initialize(){if(this._initialized)return;this._vShader=this._loadShader(35633),this._fShader=this._loadShader(35632),this._vShader&&this._fShader||console.error("Error loading shaders!");const e=this._context.gl,t=e.createProgram();e.attachShader(t,this._vShader),e.attachShader(t,this._fShader);for(const r in this._locations){const i=this._locations[r];e.bindAttribLocation(t,i,r)}e.linkProgram(t),this._glName=t,this._initialized=!0}getUniformLocation(e){return this.initialize(),void 0===this._nameToUniformLocation[e]&&(this._nameToUniformLocation[e]=this._context.gl.getUniformLocation(this._glName,e)),this._nameToUniformLocation[e]}hasUniform(e){return null!==this.getUniformLocation(e)}getAttribLocation(e){return this.initialize(),void 0===this._nameToAttribLocation[e]&&(this._nameToAttribLocation[e]=this._context.gl.getAttribLocation(this._glName,e)),this._nameToAttribLocation[e]}setUniform1i(e,t){const r=this._nameToUniform1[e];void 0!==r&&t===r||(this._context.bindProgram(this),this._context.gl.uniform1i(this.getUniformLocation(e),t),this._nameToUniform1[e]=t)}setUniform1iv(e,t){const r=this._nameToUniform1v[e];v(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform1iv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform1v[e]=g._arrayCopy(t):g._arrayAssign(t,r))}setUniform2iv(e,t){const r=this._nameToUniform2[e];v(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform2iv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform2[e]=g._arrayCopy(t):g._arrayAssign(t,r))}setUniform3iv(e,t){const r=this._nameToUniform3[e];v(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform3iv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform3[e]=g._arrayCopy(t):g._arrayAssign(t,r))}setUniform4iv(e,t){const r=this._nameToUniform4[e];v(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform4iv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform4[e]=g._arrayCopy(t):g._arrayAssign(t,r))}setUniform1f(e,t){const r=this._nameToUniform1[e];void 0!==r&&t===r||(this._context.bindProgram(this),this._context.gl.uniform1f(this.getUniformLocation(e),t),this._nameToUniform1[e]=t)}setUniform1fv(e,t){const r=this._nameToUniform1v[e];v(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform1fv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform1v[e]=g._arrayCopy(t):g._arrayAssign(t,r))}setUniform2f(e,t,r){const i=this._nameToUniform2[e];void 0!==i&&t===i[0]&&r===i[1]||(this._context.bindProgram(this),this._context.gl.uniform2f(this.getUniformLocation(e),t,r),void 0===i?this._nameToUniform2[e]=[t,r]:(i[0]=t,i[1]=r))}setUniform2fv(e,t){const r=this._nameToUniform2[e];v(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform2fv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform2[e]=g._arrayCopy(t):g._arrayAssign(t,r))}setUniform3f(e,t,r,i){const n=this._nameToUniform3[e];void 0!==n&&t===n[0]&&r===n[1]&&i===n[2]||(this._context.bindProgram(this),this._context.gl.uniform3f(this.getUniformLocation(e),t,r,i),void 0===n?this._nameToUniform3[e]=[t,r,i]:(n[0]=t,n[1]=r,n[2]=i))}setUniform3fv(e,t){const r=this._nameToUniform3[e];v(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform3fv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform3[e]=g._arrayCopy(t):g._arrayAssign(t,r))}setUniform4f(e,t,r,i,n){const o=this._nameToUniform4[e];void 0!==o&&t===o[0]&&r===o[1]&&i===o[2]&&n===o[3]||(this._context.bindProgram(this),this._context.gl.uniform4f(this.getUniformLocation(e),t,r,i,n),void 0===o?this._nameToUniform4[e]=[t,r,i,n]:(o[0]=t,o[1]=r,o[2]=i,o[3]=n))}setUniform4fv(e,t){const r=this._nameToUniform4[e];v(r,t)&&(this._context.bindProgram(this),this._context.gl.uniform4fv(this.getUniformLocation(e),t),void 0===r?this._nameToUniform4[e]=g._arrayCopy(t):g._arrayAssign(t,r))}setUniformMatrix3fv(e,t,r=!1){const n=this._nameToUniformMatrix3[e];(function(e,t){return!!(0,i.Wi)(e)||(9!==e.length?v(e,t):9!==e.length||e[0]!==t[0]||e[1]!==t[1]||e[2]!==t[2]||e[3]!==t[3]||e[4]!==t[4]||e[5]!==t[5]||e[6]!==t[6]||e[7]!==t[7]||e[8]!==t[8])})(n,t)&&(this._context.bindProgram(this),this._context.gl.uniformMatrix3fv(this.getUniformLocation(e),r,t),void 0===n?this._nameToUniformMatrix3[e]=g._arrayCopy(t):g._arrayAssign(t,n))}setUniformMatrix4fv(e,t,r=!1){const n=this._nameToUniformMatrix4[e];(function(e,t){return!!(0,i.Wi)(e)||(16!==e.length?v(e,t):16!==e.length||e[0]!==t[0]||e[1]!==t[1]||e[2]!==t[2]||e[3]!==t[3]||e[4]!==t[4]||e[5]!==t[5]||e[6]!==t[6]||e[7]!==t[7]||e[8]!==t[8]||e[9]!==t[9]||e[10]!==t[10]||e[11]!==t[11]||e[12]!==t[12]||e[13]!==t[13]||e[14]!==t[14]||e[15]!==t[15])})(n,t)&&(this._context.bindProgram(this),this._context.gl.uniformMatrix4fv(this.getUniformLocation(e),r,t),void 0===n?this._nameToUniformMatrix4[e]=g._arrayCopy(t):g._arrayAssign(t,n))}assertCompatibleVertexAttributeLocations(e){const t=e.locations===this.locations;return t||console.error("VertexAttributeLocations are incompatible"),t}static _padToThree(e){let t=e.toString();return e<1e3&&(t=("  "+e).slice(-3)),t}_addLineNumbers(e){let t=2;return e.replace(/\n/g,(()=>"\n"+g._padToThree(t++)+":"))}_loadShader(e){const t=35633===e;let r=t?this._vertexShaderSource:this._fragmentShaderSource,i="";for(const e in this._defines)i+=`#define ${e} ${this._defines[e]}\n`;r=i+r,"webgl2"===this._context.contextVersion&&(r=function(e,t){const r=c(e);if("300 es"===function(e,t="100",r="300 es"){const i=/^\s*\#version\s+([0-9]+(\s+[a-zA-Z]+)?)\s*/;for(const n of e)if("preprocessor"===n.type){const e=i.exec(n.data);if(e){const i=e[1].replace(/\s\s+/g," ");if(i===r)return i;if(i===t)return n.data="#version "+r,t;throw new Error("unknown glsl version: "+i)}}return e.splice(0,0,{type:"preprocessor",data:"#version "+r},{type:"whitespace",data:"\n"}),null}(r,"100","300 es"))throw new Error("shader is already glsl 300 es");let i=null,o=null;const a={},s={};for(let e=0;e<r.length;++e){const c=r[e];switch(c.type){case"keyword":"vertex"===t&&"attribute"===c.data?c.data="in":"varying"===c.data&&(c.data="vertex"===t?"out":"in");break;case"builtin":if(/^texture(2D|Cube)(Proj)?(Lod|Grad)?(EXT)?$/.test(c.data.trim())&&(c.data=c.data.replace(/(2D|Cube|EXT)/g,"")),"fragment"===t&&"gl_FragColor"===c.data&&(i||(i=d(r,a,"fragColor"),h(r,i,"vec4")),c.data=i),"fragment"===t&&"gl_FragData"===c.data){const t=p(r,e+1),i=d(r,a,"fragData");m(r,i,"vec4",t,"mediump"),c.data=i}else"fragment"===t&&"gl_FragDepthEXT"===c.data&&(o||(o=d(r,a,"gl_FragDepth")),c.data=o);break;case"ident":if(n.indexOf(c.data)>=0){if("vertex"===t&&u(r,e))throw new Error("attribute in vertex shader uses a name that is a reserved word in glsl 300 es");c.data in s||(s[c.data]=d(r,a,c.data)),c.data=s[c.data]}}}for(let e=r.length-1;e>=0;--e){const t=r[e];if("preprocessor"===t.type){const i=t.data.match(/\#extension\s+(.*)\:/);if(i&&i[1]&&l.indexOf(i[1].trim())>=0){const t=r[e+1];r.splice(e,t&&"whitespace"===t.type?2:1)}const n=t.data.match(/\#ifdef\s+(.*)/);n&&n[1]&&l.indexOf(n[1].trim())>=0&&(t.data="#if 1");const o=t.data.match(/\#ifndef\s+(.*)/);o&&o[1]&&l.indexOf(o[1].trim())>=0&&(t.data="#if 0")}}return r.map((e=>"eof"!==e.type?e.data:"")).join("")}(r,t?"vertex":"fragment"));const o=this._context.gl,a=o.createShader(e);return o.shaderSource(a,r),o.compileShader(a),a}static _arrayCopy(e){const t=[];for(let r=0;r<e.length;++r)t.push(e[r]);return t}static _arrayAssign(e,t){for(let r=0;r<e.length;++r)t[r]=e[r]}}function v(e,t){if((0,i.Wi)(e)||e.length!==t.length)return!0;for(let r=0;r<e.length;++r)if(e[r]!==t[r])return!0;return!1}const b=g},36904:(e,t,r)=>{"use strict";function i(e,t,r=32774,i=[0,0,0,0]){return{srcRgb:e,srcAlpha:e,dstRgb:t,dstAlpha:t,opRgb:r,opAlpha:r,color:{r:i[0],g:i[1],b:i[2],a:i[3]}}}function n(e,t,r,i,n=32774,o=32774,a=[0,0,0,0]){return{srcRgb:e,srcAlpha:t,dstRgb:r,dstAlpha:i,opRgb:n,opAlpha:o,color:{r:a[0],g:a[1],b:a[2],a:a[3]}}}r.d(t,{jp:()=>z,BK:()=>a,LZ:()=>o,sm:()=>p,wK:()=>n,if:()=>i});const o={zNear:0,zFar:1},a={r:!0,g:!0,b:!0,a:!0};function s(e){return b.intern(e)}function c(e){return y.intern(e)}function l(e){return w.intern(e)}function u(e){return S.intern(e)}function d(e){return M.intern(e)}function f(e){return P.intern(e)}function h(e){return I.intern(e)}function m(e){return D.intern(e)}function p(e){return R.intern(e)}class g{constructor(e,t){this.makeKey=e,this.makeRef=t,this.interns=new Map}intern(e){if(!e)return null;const t=this.makeKey(e),r=this.interns;return r.has(t)||r.set(t,this.makeRef(e)),r.get(t)}}function v(e){return"["+e.join(",")+"]"}const b=new g(x,(e=>({__tag:"Blending",...e})));function x(e){return e?v([e.srcRgb,e.srcAlpha,e.dstRgb,e.dstAlpha,e.opRgb,e.opAlpha,e.color.r,e.color.g,e.color.b,e.color.a]):null}const y=new g(_,(e=>({__tag:"Culling",...e})));function _(e){return e?v([e.face,e.mode]):null}const w=new g(T,(e=>({__tag:"PolygonOffset",...e})));function T(e){return e?v([e.factor,e.units]):null}const S=new g(C,(e=>({__tag:"DepthTest",...e})));function C(e){return e?v([e.func]):null}const M=new g(A,(e=>({__tag:"StencilTest",...e})));function A(e){return e?v([e.function.func,e.function.ref,e.function.mask,e.operation.fail,e.operation.zFail,e.operation.zPass]):null}const P=new g(O,(e=>({__tag:"DepthWrite",...e})));function O(e){return e?v([e.zNear,e.zFar]):null}const I=new g(F,(e=>({__tag:"ColorWrite",...e})));function F(e){return e?v([e.r,e.g,e.b,e.a]):null}const D=new g(L,(e=>({__tag:"StencilWrite",...e})));function L(e){return e?v([e.mask]):null}const R=new g((function(e){return e?v([x(e.blending),_(e.culling),T(e.polygonOffset),C(e.depthTest),A(e.stencilTest),O(e.depthWrite),F(e.colorWrite),L(e.stencilWrite)]):null}),(e=>({blending:s(e.blending),culling:c(e.culling),polygonOffset:l(e.polygonOffset),depthTest:u(e.depthTest),stencilTest:d(e.stencilTest),depthWrite:f(e.depthWrite),colorWrite:h(e.colorWrite),stencilWrite:m(e.stencilWrite)})));class z{constructor(e){this._pipelineInvalid=!0,this._blendingInvalid=!0,this._cullingInvalid=!0,this._polygonOffsetInvalid=!0,this._depthTestInvalid=!0,this._stencilTestInvalid=!0,this._depthWriteInvalid=!0,this._colorWriteInvalid=!0,this._stencilWriteInvalid=!0,this._stateSetters=e}setPipeline(e){(this._pipelineInvalid||e!==this._pipeline)&&(this.setBlending(e.blending),this.setCulling(e.culling),this.setPolygonOffset(e.polygonOffset),this.setDepthTest(e.depthTest),this.setStencilTest(e.stencilTest),this.setDepthWrite(e.depthWrite),this.setColorWrite(e.colorWrite),this.setStencilWrite(e.stencilWrite),this._pipeline=e),this._pipelineInvalid=!1}invalidateBlending(){this._blendingInvalid=!0,this._pipelineInvalid=!0}invalidateCulling(){this._cullingInvalid=!0,this._pipelineInvalid=!0}invalidatePolygonOffset(){this._polygonOffsetInvalid=!0,this._pipelineInvalid=!0}invalidateDepthTest(){this._depthTestInvalid=!0,this._pipelineInvalid=!0}invalidateStencilTest(){this._stencilTestInvalid=!0,this._pipelineInvalid=!0}invalidateDepthWrite(){this._depthWriteInvalid=!0,this._pipelineInvalid=!0}invalidateColorWrite(){this._colorWriteInvalid=!0,this._pipelineInvalid=!0}invalidateStencilWrite(){this._stencilTestInvalid=!0,this._pipelineInvalid=!0}setBlending(e){this._blending=this.setSubState(e,this._blending,this._blendingInvalid,this._stateSetters.setBlending),this._blendingInvalid=!1}setCulling(e){this._culling=this.setSubState(e,this._culling,this._cullingInvalid,this._stateSetters.setCulling),this._cullingInvalid=!1}setPolygonOffset(e){this._polygonOffset=this.setSubState(e,this._polygonOffset,this._polygonOffsetInvalid,this._stateSetters.setPolygonOffset),this._polygonOffsetInvalid=!1}setDepthTest(e){this._depthTest=this.setSubState(e,this._depthTest,this._depthTestInvalid,this._stateSetters.setDepthTest),this._depthTestInvalid=!1}setStencilTest(e){this._stencilTest=this.setSubState(e,this._stencilTest,this._stencilTestInvalid,this._stateSetters.setStencilTest),this._stencilTestInvalid=!1}setDepthWrite(e){this._depthWrite=this.setSubState(e,this._depthWrite,this._depthWriteInvalid,this._stateSetters.setDepthWrite),this._depthWriteInvalid=!1}setColorWrite(e){this._colorWrite=this.setSubState(e,this._colorWrite,this._colorWriteInvalid,this._stateSetters.setColorWrite),this._colorWriteInvalid=!1}setStencilWrite(e){this._stencilWrite=this.setSubState(e,this._stencilWrite,this._stencilWriteInvalid,this._stateSetters.setStencilWrite),this._stencilTestInvalid=!1}setSubState(e,t,r,i){return(r||e!==t)&&(i(e),this._pipelineInvalid=!0),e}}},31563:(e,t,r)=>{"use strict";r.d(t,{M:()=>c}),r(95830);var i=r(51007),n=r(69595),o=r(8634),a=r(74038),s=r(84570);async function c(e){const t=new Image;if(t.src="data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='5' height='5' version='1.1' viewBox='0 0 5 5' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='5' height='5' fill='%23f00' fill-opacity='.5'/%3E%3C/svg%3E%0A",t.width=5,t.height=5,await t.decode(),!e.gl)return!0;const r=new s.Z(e,{colorTarget:0,depthStencilTarget:0},{target:3553,wrapMode:33071,pixelFormat:6408,dataType:5121,samplingMode:9728,width:1,height:1}),c=n.Z.createVertex(e,35044,new Uint16Array([0,0,1,0,0,1,1,1])),l=new a.Z(e,{a_pos:0},{geometry:[{name:"a_pos",count:2,type:5123,offset:0,stride:4,normalized:!1}]},{geometry:c}),u=new i.Z(e,"\n  precision highp float;\n\n  attribute vec2 a_pos;\n  varying vec2 v_uv;\n\n  void main() {\n    v_uv = a_pos;\n    gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0);\n  }\n  ","\n  precision highp float;\n\n  varying vec2 v_uv;\n  uniform sampler2D u_texture;\n\n  void main() {\n    gl_FragColor = texture2D(u_texture, v_uv);\n  }\n  ",{a_pos:0});e.bindProgram(u);const d=new o.Z(e,{dataType:5121,pixelFormat:6408,preMultiplyAlpha:!1,wrapMode:33071,samplingMode:9729},t);e.bindTexture(d,0),u.setUniform1i("u_texture",0);const f=e.getBoundFramebufferObject(),{x:h,y:m,width:p,height:g}=e.getViewport();e.bindFramebuffer(r),e.setViewport(0,0,1,1),e.bindVAO(l),e.drawArrays(5,0,4);const v=new Uint8Array(4);return r.readPixels(0,0,1,1,6408,5121,v),u.dispose(),l.dispose(!1),c.dispose(),r.dispose(),d.dispose(),e.setViewport(h,m,p,g),e.bindFramebuffer(f),t.src="",255===v[0]}}}]);