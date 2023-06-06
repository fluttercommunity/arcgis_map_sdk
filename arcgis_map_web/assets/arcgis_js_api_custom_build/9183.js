"use strict";(self.webpackChunkarcgis_webpack01=self.webpackChunkarcgis_webpack01||[]).push([[9183],{21586:(e,t,r)=>{function i(e){const t=e.layer;return"floorInfo"in t&&t.floorInfo?.floorField&&"floors"in e.view?o(e.view.floors,t.floorInfo.floorField):null}function n(e,t){return"floorInfo"in t&&t.floorInfo?.floorField?o(e,t.floorInfo.floorField):null}function o(e,t){if(!e?.length)return null;const r=e.filter((e=>""!==e)).map((e=>`'${e}'`));return r.push("''"),`${t} IN (${r.join(",")}) OR ${t} IS NULL`}r.d(t,{c:()=>i,f:()=>n})},93698:(e,t,r)=>{r.d(t,{FN:()=>s,QV:()=>o,ac:()=>l});var i=r(61681),n=r(65943);function o(e,t,r){const i=t.flatten((({sublayers:e})=>e)).length;return i!==e.length||(!!e.some((e=>e.originIdOf("minScale")>r||e.originIdOf("maxScale")>r||e.originIdOf("renderer")>r||e.originIdOf("labelingInfo")>r||e.originIdOf("opacity")>r||e.originIdOf("labelsVisible")>r||e.originIdOf("source")>r))||!a(e,t))}function s(e,t,r){return!!e.some((e=>{const t=e.source;return!(!t||"map-layer"===t.type&&t.mapLayerId===e.id&&((0,i.Wi)(t.gdbVersion)||t.gdbVersion===r))||e.originIdOf("renderer")>n.s3.SERVICE||e.originIdOf("labelingInfo")>n.s3.SERVICE||e.originIdOf("opacity")>n.s3.SERVICE||e.originIdOf("labelsVisible")>n.s3.SERVICE}))||!a(e,t)}function a(e,t){if(!e||!e.length||(0,i.Wi)(t))return!0;const r=t.slice().reverse().flatten((({sublayers:e})=>e&&e.toArray().reverse())).map((e=>e.id)).toArray();if(e.length>r.length)return!1;let n=0;const o=r.length;for(const{id:t}of e){for(;n<o&&r[n]!==t;)n++;if(n>=o)return!1}return!0}function l(e){return!!e&&e.some((e=>null!=e.minScale||e.layerDefinition&&null!=e.layerDefinition.minScale))}},59468:(e,t,r)=>{function i(e,t){return t?"xoffset"in t&&t.xoffset?Math.max(e,Math.abs(t.xoffset)):"yoffset"in t&&t.yoffset?Math.max(e,Math.abs(t.yoffset||0)):e:e}function n(e,t){return"number"==typeof e?e:e&&e.stops&&e.stops.length?function(e){let t=0,r=0;for(let i=0;i<e.length;i++){const n=e[i].size;"number"==typeof n&&(t+=n,r++)}return t/r}(e.stops):t}function o(e,t){if(!t)return e;const r=t.filter((e=>"size"===e.type)).map((t=>{const{maxSize:r,minSize:i}=t;return(n(r,e)+n(i,e))/2}));let i=0;const o=r.length;if(0===o)return e;for(let e=0;e<o;e++)i+=r[e];const s=Math.floor(i/o);return Math.max(s,e)}function s(e){const t=e&&e.renderer,r="touch"===(e&&e.event&&e.event.pointerType)?9:6;if(!t)return r;const n="visualVariables"in t?o(r,t.visualVariables):r;if("simple"===t.type)return i(n,t.symbol);if("unique-value"===t.type){let e=n;return t.uniqueValueInfos?.forEach((t=>{e=i(e,t.symbol)})),e}if("class-breaks"===t.type){let e=n;return t.classBreakInfos.forEach((t=>{e=i(e,t.symbol)})),e}return"dot-density"===t.type||t.type,n}r.d(t,{k:()=>s})},7608:(e,t,r)=>{r.d(t,{VF:()=>B,Uf:()=>D});var i=r(36663),n=r(80085),o=r(53443),s=r(41831),a=r(70375),l=r(39994),u=r(86114),p=r(61681),y=r(78668),c=r(76868),f=r(17321),h=r(81977),d=r(7283),m=(r(7753),r(40266)),g=r(91772),b=r(68577),w=r(21586),v=r(59468),x=r(66341),_=r(29927),I=r(84238),S=r(84684),C=r(53736),O=r(93698);const F=e=>e.spatialReference.wkid||JSON.stringify(e.spatialReference);function E(e,t){const{dpi:r,gdbVersion:i,geometry:n,geometryPrecision:o,height:s,layerOption:a,mapExtent:l,maxAllowableOffset:u,returnFieldName:y,returnGeometry:c,returnUnformattedValues:f,returnZ:h,spatialReference:d,timeExtent:m,tolerance:g,width:b}=e.toJSON(),{dynamicLayers:w,layerDefs:v,layerIds:x}=R(e),_=t&&(0,p.pC)(t.geometry)?t.geometry:null,I={geometryPrecision:o,maxAllowableOffset:u,returnFieldName:y,returnGeometry:c,returnUnformattedValues:f,returnZ:h,tolerance:g},S=_&&_.toJSON()||n;if(I.imageDisplay=`${b},${s},${r}`,i&&(I.gdbVersion=i),S&&(delete S.spatialReference,I.geometry=JSON.stringify(S),I.geometryType=(0,C.Ji)(S)),d?I.sr=d.wkid||JSON.stringify(d):S&&S.spatialReference?I.sr=F(S):l&&l.spatialReference&&(I.sr=F(l)),I.time=m?[m.start,m.end].join(","):null,l){const{xmin:e,ymin:t,xmax:r,ymax:i}=l;I.mapExtent=`${e},${t},${r},${i}`}return v&&(I.layerDefs=v),w&&!v&&(I.dynamicLayers=w),I.layers="popup"===a?"visible":a,x&&!w&&(I.layers+=`:${x.join(",")}`),I}function R(e){const{mapExtent:t,floors:r,width:i,sublayers:n,layerIds:o,layerOption:s,gdbVersion:a}=e,l=n?.find((e=>null!=e.layer))?.layer?.serviceSublayers,u="popup"===s,y={},c=(0,b.yZ)({extent:t,width:i,spatialReference:t?.spatialReference}),f=[],h=e=>{const t=0===c,r=0===e.minScale||c<=e.minScale,i=0===e.maxScale||c>=e.maxScale;if(e.visible&&(t||r&&i))if(e.sublayers)e.sublayers.forEach(h);else{if(!1===o?.includes(e.id)||u&&(!e.popupTemplate||!e.popupEnabled))return;f.unshift(e)}};if(n?.forEach(h),n&&!f.length)y.layerIds=[];else{const e=(0,O.FN)(f,l,a),t=f.map((e=>{const t=(0,w.f)(r,e);return e.toExportImageJSON(t)}));if(e)y.dynamicLayers=JSON.stringify(t);else{if(n){let e=f.map((({id:e})=>e));o&&(e=e.filter((e=>o.includes(e)))),y.layerIds=e}else o?.length&&(y.layerIds=o);const e=function(e,t){const r=!!e?.length,i=t.filter((e=>null!=e.definitionExpression||r&&null!=e.floorInfo));return i.length?i.map((t=>{const r=(0,w.f)(e,t),i=(0,S._)(r,t.definitionExpression);return{id:t.id,definitionExpression:(0,p.Pt)(i,void 0)}})):null}(r,f);if((0,p.pC)(e)&&e.length){const t={};for(const r of e)r.definitionExpression&&(t[r.id]=r.definitionExpression);Object.keys(t).length&&(y.layerDefs=JSON.stringify(t))}}}return y}var V,N=r(91957),j=r(37956),P=r(82064),G=r(14685);let M=V=class extends P.wq{static from(e){return(0,d.TJ)(V,e)}constructor(e){super(e),this.dpi=96,this.floors=null,this.gdbVersion=null,this.geometry=null,this.geometryPrecision=null,this.height=400,this.layerIds=null,this.layerOption="top",this.mapExtent=null,this.maxAllowableOffset=null,this.returnFieldName=!0,this.returnGeometry=!1,this.returnM=!1,this.returnUnformattedValues=!0,this.returnZ=!1,this.spatialReference=null,this.sublayers=null,this.timeExtent=null,this.tolerance=null,this.width=400}};(0,i._)([(0,h.Cb)({type:Number,json:{write:!0}})],M.prototype,"dpi",void 0),(0,i._)([(0,h.Cb)()],M.prototype,"floors",void 0),(0,i._)([(0,h.Cb)({type:String,json:{write:!0}})],M.prototype,"gdbVersion",void 0),(0,i._)([(0,h.Cb)({types:N.qM,json:{read:C.im,write:!0}})],M.prototype,"geometry",void 0),(0,i._)([(0,h.Cb)({type:Number,json:{write:!0}})],M.prototype,"geometryPrecision",void 0),(0,i._)([(0,h.Cb)({type:Number,json:{write:!0}})],M.prototype,"height",void 0),(0,i._)([(0,h.Cb)({type:[Number],json:{write:!0}})],M.prototype,"layerIds",void 0),(0,i._)([(0,h.Cb)({type:["top","visible","all","popup"],json:{write:!0}})],M.prototype,"layerOption",void 0),(0,i._)([(0,h.Cb)({type:g.Z,json:{write:!0}})],M.prototype,"mapExtent",void 0),(0,i._)([(0,h.Cb)({type:Number,json:{write:!0}})],M.prototype,"maxAllowableOffset",void 0),(0,i._)([(0,h.Cb)({type:Boolean,json:{write:!0}})],M.prototype,"returnFieldName",void 0),(0,i._)([(0,h.Cb)({type:Boolean,json:{write:!0}})],M.prototype,"returnGeometry",void 0),(0,i._)([(0,h.Cb)({type:Boolean,json:{write:!0}})],M.prototype,"returnM",void 0),(0,i._)([(0,h.Cb)({type:Boolean,json:{write:!0}})],M.prototype,"returnUnformattedValues",void 0),(0,i._)([(0,h.Cb)({type:Boolean,json:{write:!0}})],M.prototype,"returnZ",void 0),(0,i._)([(0,h.Cb)({type:G.Z,json:{write:!0}})],M.prototype,"spatialReference",void 0),(0,i._)([(0,h.Cb)()],M.prototype,"sublayers",void 0),(0,i._)([(0,h.Cb)({type:j.Z,json:{write:!0}})],M.prototype,"timeExtent",void 0),(0,i._)([(0,h.Cb)({type:Number,json:{write:!0}})],M.prototype,"tolerance",void 0),(0,i._)([(0,h.Cb)({type:Number,json:{write:!0}})],M.prototype,"width",void 0),M=V=(0,i._)([(0,m.j)("esri.rest.support.IdentifyParameters")],M);const A=M;var Z=r(34248),L=r(39835),k=r(59659);let T=class extends P.wq{constructor(e){super(e),this.displayFieldName=null,this.feature=null,this.layerId=null,this.layerName=null}readFeature(e,t){return n.Z.fromJSON({attributes:{...t.attributes},geometry:{...t.geometry}})}writeFeature(e,t){if(!e)return;const{attributes:r,geometry:i}=e;r&&(t.attributes={...r}),(0,p.pC)(i)&&(t.geometry=i.toJSON(),t.geometryType=k.P.toJSON(i.type))}};(0,i._)([(0,h.Cb)({type:String,json:{write:!0}})],T.prototype,"displayFieldName",void 0),(0,i._)([(0,h.Cb)({type:n.Z})],T.prototype,"feature",void 0),(0,i._)([(0,Z.r)("feature",["attributes","geometry"])],T.prototype,"readFeature",null),(0,i._)([(0,L.c)("feature")],T.prototype,"writeFeature",null),(0,i._)([(0,h.Cb)({type:Number,json:{write:!0}})],T.prototype,"layerId",void 0),(0,i._)([(0,h.Cb)({type:String,json:{write:!0}})],T.prototype,"layerName",void 0),T=(0,i._)([(0,m.j)("esri.rest.support.IdentifyResult")],T);const U=T;async function J(e,t,r){const i=(o=t,t=A.from(o)).geometry?[t.geometry]:[],n=(0,I.en)(e);var o;return n.path+="/identify",(0,_.aX)(i).then((e=>{const i=E(t,{geometry:e&&e[0]}),o=(0,I.cv)({...n.query,f:"json",...i}),s=(0,I.lA)(o,r);return(0,x.default)(n.path,s).then($).then((e=>function(e,t){if(!t?.length)return e;const r=new Map;function i(e){r.set(e.id,e),e.sublayers&&e.sublayers.forEach(i)}t.forEach(i);for(const t of e.results)t.feature.sourceLayer=r.get(t.layerId);return e}(e,t.sublayers)))}))}function $(e){const t=e.data;return t.results=t.results||[],t.exceededTransferLimit=Boolean(t.exceededTransferLimit),t.results=t.results.map((e=>U.fromJSON(e))),t}var Q=r(30879),q=r(1759),z=r(59439);let H=null;function D(e,t){return"tile"===t.type||"map-image"===t.type}let B=class extends o.Z{constructor(e){super(e),this._featuresResolutions=new WeakMap,this.highlightGraphics=null,this.highlightGraphicUpdated=null,this.updateHighlightedFeatures=(0,y.Ds)((async e=>{this.destroyed||this.updatingHandles.addPromise(this._updateHighlightedFeaturesGeometries(e).catch((()=>{})))}))}initialize(){const e=e=>{this.updatingHandles.addPromise(this._updateHighlightedFeaturesSymbols(e).catch((()=>{}))),this.updateHighlightedFeatures(this._highlightGeometriesResolution)};this.addHandles([(0,c.on)((()=>this.highlightGraphics),"change",(t=>e(t.added)),{onListenerAdd:t=>e(t)})])}async fetchPopupFeatures(e,t){const{layerView:{layer:r,view:{scale:i}}}=this;if(!e)throw new a.Z("fetchPopupFeatures:invalid-area","Nothing to fetch without area",{layer:r});const n=function(e,t,r){const i=[],n=e=>{const o=0===e.minScale||t<=e.minScale,s=0===e.maxScale||t>=e.maxScale;if(e.visible&&o&&s)if(e.sublayers)e.sublayers.forEach(n);else if(e.popupEnabled){const t=(0,z.V)(e,{...r,defaultPopupTemplateEnabled:!1});(0,p.pC)(t)&&i.unshift({sublayer:e,popupTemplate:t})}};return(e?.toArray()??[]).reverse().map(n),i}(r.sublayers,i,t);if(!n.length)return[];const o=await async function(e,t){if(e.capabilities?.operations?.supportsQuery)return!0;try{return await Promise.any(t.map((({sublayer:e})=>e.load().then((()=>e.capabilities.operations.supportsQuery)))))}catch{return!1}}(r,n);if(!((r.capabilities?.operations?.supportsIdentify??1)&&r.version>=10.5||o))throw new a.Z("fetchPopupFeatures:not-supported","query operation is disabled for this service",{layer:r});return o?this._fetchPopupFeaturesUsingQueries(e,n,t):this._fetchPopupFeaturesUsingIdentify(e,n,t)}clearHighlights(){this.highlightGraphics?.removeAll()}highlight(e){const t=this.highlightGraphics;if(!t)return{remove(){}};let r=null;if(e instanceof n.Z?r=[e]:s.Z.isCollection(e)&&e.length>0?r=e.toArray():Array.isArray(e)&&e.length>0&&(r=e),r=r?.filter(p.pC),!r||!r.length)return{remove:()=>{}};for(const e of r){const t=e.sourceLayer;null!=t&&"geometryType"in t&&"point"===t.geometryType&&(e.visible=!1)}return t.addMany(r),{remove:()=>{t.removeMany(r??[])}}}async _updateHighlightedFeaturesSymbols(e){const{layerView:{view:t},highlightGraphics:i,highlightGraphicUpdated:n}=this;if(i&&n)for(const o of e){const e=o.sourceLayer&&"renderer"in o.sourceLayer&&o.sourceLayer.renderer;o.sourceLayer&&"geometryType"in o.sourceLayer&&"point"===o.sourceLayer.geometryType&&e&&"getSymbolAsync"in e&&e.getSymbolAsync(o).then((async s=>{s||(s=new q.Z);let a=null;const l="visualVariables"in e?e.visualVariables?.find((e=>"size"===e.type)):void 0;l&&(H||(H=(await Promise.resolve().then(r.bind(r,36496))).getSize),a=H(l,o,{view:t.type,scale:t.scale,shape:"simple-marker"===s.type?s.style:null})),a||(a="width"in s&&"height"in s&&null!=s.width&&null!=s.height?Math.max(s.width,s.height):"size"in s?s.size:16),i.includes(o)&&(o.symbol=new q.Z({style:"square",size:a,xoffset:"xoffset"in s?s.xoffset:0,yoffset:"yoffset"in s?s.yoffset:0}),n(o,"symbol"),o.visible=!0)}))}}async _updateHighlightedFeaturesGeometries(e){const{layerView:{layer:t,view:r},highlightGraphics:i,highlightGraphicUpdated:n}=this;if(this._highlightGeometriesResolution=e,!n||!i?.length||!t.capabilities.operations.supportsQuery)return;const o=this._getTargetResolution(e),s=new Map;for(const e of i)if(!this._featuresResolutions.has(e)||this._featuresResolutions.get(e)>o){const t=e.sourceLayer;(0,u.s1)(s,t,(()=>new Map)).set(e.getObjectId(),e)}const a=Array.from(s,(([e,t])=>{const i=e.createQuery();return i.objectIds=[...t.keys()],i.outFields=[e.objectIdField],i.returnGeometry=!0,i.maxAllowableOffset=o,i.outSpatialReference=r.spatialReference,e.queryFeatures(i)})),l=await Promise.all(a);if(!this.destroyed)for(const{features:e}of l)for(const t of e){const e=t.sourceLayer,r=s.get(e).get(t.getObjectId());r&&i.includes(r)&&(r.geometry=t.geometry,n(r,"geometry"),this._featuresResolutions.set(r,o))}}_getTargetResolution(e){const t=e*(0,f.c9)(this.layerView.view.spatialReference),r=t/16;return r<=10?0:e/t*r}async _fetchPopupFeaturesUsingIdentify(e,t,r){const i=await this._createIdentifyParameters(e,t,r);if((0,p.Wi)(i))return[];const{results:n}=await J(this.layerView.layer.parsedUrl,i);return n.map((e=>e.feature))}async _createIdentifyParameters(e,t,r){const{floors:i,layer:n,timeExtent:o,view:{spatialReference:s,scale:a}}=this.layerView,u=(0,p.pC)(r)?r.event:null;if(!t.length)return null;await Promise.all(t.map((({sublayer:e})=>e.load().catch((()=>{})))));const y=Math.min((0,l.Z)("mapservice-popup-identify-max-tolerance"),n.allSublayers.reduce(((e,t)=>t.renderer?(0,v.k)({renderer:t.renderer,event:u}):e),2)),c=this.createFetchPopupFeaturesQueryGeometry(e,y),f=(0,b.dp)(a,s),h=Math.round(c.width/f),d=new g.Z({xmin:c.center.x-f*h,ymin:c.center.y-f*h,xmax:c.center.x+f*h,ymax:c.center.y+f*h,spatialReference:c.spatialReference});return new A({floors:i,gdbVersion:"gdbVersion"in n?n.gdbVersion:void 0,geometry:e,height:h,layerOption:"popup",mapExtent:d,returnGeometry:!0,spatialReference:s,sublayers:n.sublayers,timeExtent:o,tolerance:y,width:h})}async _fetchPopupFeaturesUsingQueries(e,t,r){const{layerView:{floors:i,timeExtent:n}}=this,o=(0,p.pC)(r)?r.event:null,s=t.map((async({sublayer:t,popupTemplate:r})=>{if(await t.load().catch((()=>{})),t.capabilities&&!t.capabilities.operations.supportsQuery)return[];const s=t.createQuery(),a=(0,v.k)({renderer:t.renderer,event:o}),l=this.createFetchPopupFeaturesQueryGeometry(e,a);if(s.geometry=l,s.outFields=await(0,z.e)(t,r),s.timeExtent=n,i){const e=i.clone(),r=(0,w.f)(e,t);(0,p.pC)(r)&&(s.where=s.where?`(${s.where}) AND (${r})`:r)}const u=this._getTargetResolution(l.width/a),y=await function(e){return e.expressionInfos?.length||Array.isArray(e.content)&&e.content.some((e=>"expression"===e.type))?(0,Q.LC)():Promise.resolve()}(r),c="point"===t.geometryType||y&&y.arcadeUtils.hasGeometryOperations(r);c||(s.maxAllowableOffset=u);let{features:f}=await t.queryFeatures(s);const h=c?0:u;f=await async function(e,t){const r=e.renderer;return r&&"defaultSymbol"in r&&!r.defaultSymbol&&(t=r.valueExpression?await Promise.all(t.map((e=>r.getSymbolAsync(e).then((t=>t?e:null))))).then((e=>e.filter((e=>null!=e)))):t.filter((e=>null!=r.getSymbol(e)))),t}(t,f);for(const e of f)this._featuresResolutions.set(e,h);return f}));return(await(0,y.as)(s)).reverse().reduce(((e,t)=>t.value?[...e,...t.value]:e),[]).filter((e=>null!=e))}};(0,i._)([(0,h.Cb)({constructOnly:!0})],B.prototype,"createFetchPopupFeaturesQueryGeometry",void 0),(0,i._)([(0,h.Cb)({constructOnly:!0})],B.prototype,"layerView",void 0),(0,i._)([(0,h.Cb)({constructOnly:!0})],B.prototype,"highlightGraphics",void 0),(0,i._)([(0,h.Cb)({constructOnly:!0})],B.prototype,"highlightGraphicUpdated",void 0),(0,i._)([(0,h.Cb)({constructOnly:!0})],B.prototype,"updatingHandles",void 0),B=(0,i._)([(0,m.j)("esri.views.layers.support.MapService")],B)},99621:(e,t,r)=>{r.d(t,{D:()=>l,K:()=>a});r(91957);var i=r(61681),n=r(17321),o=r(59468),s=r(91772);function a(e,t,r,o=new s.Z){let a=0;if("2d"===r.type)a=t*(r.resolution??0);else if("3d"===r.type){const o=r.overlayPixelSizeInMapUnits(e),s=r.basemapSpatialReference;a=(0,i.pC)(s)&&!s.equals(r.spatialReference)?(0,n.c9)(s)/(0,n.c9)(r.spatialReference):t*o}const l=e.x-a,u=e.y-a,p=e.x+a,y=e.y+a,{spatialReference:c}=r;return o.xmin=Math.min(l,p),o.ymin=Math.min(u,y),o.xmax=Math.max(l,p),o.ymax=Math.max(u,y),o.spatialReference=c,o}function l(e,t,r){const n=r.toMap(e);return!(0,i.Wi)(n)&&a(n,(0,o.k)(),r,u).intersects(t)}const u=new s.Z}}]);