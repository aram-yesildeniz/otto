!function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function n(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r=function(){function e(){t(this,e),i(this,"dynamo_Affinity",void 0),i(this,"dynamo_CPM",void 0),i(this,"dynamo_FeatureSequence",void 0),i(this,"dynamo_OfferCode",void 0),i(this,"dynamo_OfferName",void 0),i(this,"dynamo_PacingFactor",void 0),i(this,"dynamo_Score",void 0),i(this,"dynamo_TargetPSR",void 0),i(this,"dynamo_ImageId",void 0),i(this,"dynamo_TreatmentCode",void 0),i(this,"dynamo_CampaignAffinity",void 0),i(this,"dynamo_InteractionPoint",void 0)}return n(e,null,[{key:"builder",value:function(t){var n=this,i=t||new e;return{withAffinity:function(t){return i.dynamo_Affinity=[t.toString()],n.builder(i)},withCPM:function(t){return i.dynamo_CPM=[t.toString()],n.builder(i)},withFeatureSequence:function(t){return i.dynamo_FeatureSequence=[t.toString()],n.builder(i)},withOfferCode:function(t){return i.dynamo_OfferCode=[t.toString()],n.builder(i)},withOfferName:function(t){return i.dynamo_OfferName=[t.toString()],n.builder(i)},withPacingFactor:function(t){return i.dynamo_PacingFactor=[t.toString()],n.builder(i)},withScore:function(t){return i.dynamo_Score=[t.toString()],n.builder(i)},withTargetPSR:function(t){return i.dynamo_TargetPSR=[t.toString()],n.builder(i)},withImageId:function(t){return i.dynamo_ImageId=[t.toString()],n.builder(i)},withTreatmentCode:function(t){return i.dynamo_TreatmentCode=[t.toString()],n.builder(i)},withCampaignAffinity:function(t){return i.dynamo_CampaignAffinity=[t.toString()],n.builder(i)},withInteractionPoint:function(t){return i.dynamo_InteractionPoint=[t.toString()],n.builder(i)},build:function(){return Object.keys(i).forEach((function(t){return void 0===i[t]?delete i[t]:{}})),i}}}}]),e}(),o=function(){function e(){t(this,e),i(this,"name",void 0),i(this,"id",void 0),i(this,"status",void 0),i(this,"parentId",void 0),i(this,"position",void 0),i(this,"trackingLabels",void 0),i(this,"_element",void 0)}return n(e,[{key:"registerClickHandler",value:function(t){var e=this;this._element.addEventListener("click",(function(){t(e)}))}},{key:"registerSeenHandler",value:function(t){var e=this;new IntersectionObserver((function(n,i){n[0].isIntersecting&&(i.unobserve(e._element),t(e))}),{threshold:.75}).observe(this._element)}}],[{key:"fromElement",value:function(t){var n=JSON.parse(t.getAttribute("data-tracking"))||{},i=t.getAttribute("data-promo-dreson")||"not_found",o=new e;return o._element=t,e.builder(o).withName("BrandShopPromotionLarge").withStatus("loaded").withTrackingLabels(r.builder().withAffinity(n.affinity).withCPM(n.cpm).withTargetPSR(i).withScore(n.score).withPacingFactor(n.pacingFactor).withOfferName(n.offerName).withOfferCode(n.offerCode).withImageId(n.imageId).withTreatmentCode(n.treatmentCode).withCampaignAffinity(n.campaignAffinities||"").withInteractionPoint(n.interactionPoint).build())}},{key:"builder",value:function(t){var n=this,i=t||new e;return{withName:function(t){return i.name=t,n.builder(i)},withId:function(t){return i.id=t,n.builder(i)},withStatus:function(t){return i.status=t,n.builder(i)},withParentId:function(t){return i.parentId=t,n.builder(i)},withPosition:function(t){return i.position=t,n.builder(i)},withTrackingLabels:function(t){return i.trackingLabels=t,n.builder(i)},build:function(){return i}}}}]),e}(),a=function(){function e(){t(this,e),i(this,"name",void 0),i(this,"id",void 0),i(this,"tracked",void 0),i(this,"promos",void 0),i(this,"featureSequence",void 0),i(this,"status",void 0),i(this,"_element",void 0)}return n(e,[{key:"setTracked",value:function(){this.tracked=!0,this._element.setAttribute("data-tracked","true")}},{key:"setStatus",value:function(t){this.status=t,this._element.setAttribute("data-status",t)}}],[{key:"fromElement",value:function(t){var n=t.parentElement.getAttribute("data-feature-order")||"0",i="".concat(e.NAME,"-").concat(n),r=[];[].forEach.call(t.querySelectorAll(e.PROMO_SELECTOR),(function(t,e){r.push(o.fromElement(t).withPosition(e).withParentId(i).withId("".concat(i,"-").concat(e)).build())}));var a=new e;return a._element=t,e.builder(a).withName(e.NAME).withId(i).withFeatureSequence(parseInt(n)).withStatus("loaded").withTracked("true"===t.getAttribute("data-tracked")).withPromos(r)}},{key:"builder",value:function(t){var n=this,i=t||new e;return{withName:function(t){return i.name=t,n.builder(i)},withId:function(t){return i.id=t,n.builder(i)},withFeatureSequence:function(t){return i.featureSequence=t,n.builder(i)},withTracked:function(t){return i.tracked=t,n.builder(i)},withPromos:function(t){return i.promos=t,n.builder(i)},withStatus:function(t){return i.status=t,n.builder(i)},build:function(){return i}}}}]),e}();i(a,"PROMO_SELECTOR",".karma_brand_promo-container"),i(a,"NAME","karma-promo");var s=function(){function e(){t(this,e),i(this,"id",void 0),i(this,"status",void 0),i(this,"name",void 0),i(this,"parentId",void 0),i(this,"position",void 0),i(this,"labels",void 0)}return n(e,null,[{key:"builder",value:function(t){var n=this,i=t||new e;return{withId:function(t){return i.id=t,n.builder(i)},withStatus:function(t){return i.status=t,n.builder(i)},withName:function(t){return i.name=t,n.builder(i)},withParentId:function(t){return i.parentId=t,n.builder(i)},withPosition:function(t){return i.position=t,n.builder(i)},withLabels:function(t){return i.labels=t,n.builder(i)},build:function(){return Object.keys(i).forEach((function(t){return void 0===i[t]?delete i[t]:{}})),i}}}}]),e}(),c=function(){function e(){t(this,e),i(this,"dynamo_BrandShopPromotionLargeCount",void 0),i(this,"dynamo_FeatureSequence",void 0)}return n(e,null,[{key:"builder",value:function(t){var n=this,i=t||new e;return{withCount:function(t){return i.dynamo_BrandShopPromotionLargeCount=[t.toString()],n.builder(i)},withFeatureSequence:function(t){return i.dynamo_FeatureSequence=[t.toString()],n.builder(i)},build:function(){return Object.keys(i).forEach((function(t){return void 0===i[t]?delete i[t]:{}})),i}}}}]),e}(),u=function(){function e(){t(this,e)}return n(e,null,[{key:"group",value:function(t){window.o_global.debug.status().activated&&console.group&&console.group(t)}},{key:"groupEnd",value:function(){window.o_global.debug.status().activated&&console.groupEnd&&console.groupEnd()}},{key:"log",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};window.o_global.debug.status().activated&&console.log("[karma-promo]: ".concat(t),e)}},{key:"warn",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};console.warn&&window.o_global.debug.status().activated&&console.warn("[karma-promo]: ".concat(t),e)}},{key:"error",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};console.error&&window.o_global.debug.status().activated&&console.error("[karma-promo]: ".concat(t),e)}},{key:"table",value:function(t){window.o_global.debug.status().activated&&console.table&&console.table(t)}},{key:"count",value:function(t){window.o_global.debug.status().activated&&console.count&&console.count(t)}}]),e}(),d=function(){function e(n){t(this,e),i(this,"eventBus",void 0),this.eventBus=n||{emit:function(t,e){u.warn("Sending to ".concat(t," via debug eventBus"),e)}}}return n(e,[{key:"trackBrandPromoContainer",value:function(t){var e=this;t.tracked||(t.setTracked(),t.setStatus("loaded"),this._trackView(t),[].forEach.call(t.promos,(function(t){t.registerClickHandler(e._clickHandler.bind(e)),t.registerSeenHandler(e._seenHandler.bind(e))})))}},{key:"_trackView",value:function(t){var e=t.promos.map((function(e,n){return s.builder().withName(e.name).withId(e.id).withStatus(e.status).withPosition(n).withParentId(t.id).withLabels(e.trackingLabels).build()})),n=[s.builder().withName(t.name).withId(t.id).withStatus(t.status).withLabels(c.builder().withFeatureSequence(t.featureSequence).withCount(t.promos.length).build()).build()].concat(e);this.eventBus.emit("tracking.bct.addFeaturesToPageImpression",n).catch((function(t){u.error("Could not emit view event",t)})),u.log("viewTracking",n)}},{key:"_seenHandler",value:function(t){var e=s.builder().withName(t.name).withId(t.id).withStatus("visible").withPosition(t.position).withParentId(t.parentId).withLabels(t.trackingLabels).build(),n=s.builder().withName(a.NAME).withId(t.parentId).withStatus(t.status).build();u.log("seenTracking",[n,e])}},{key:"_clickHandler",value:function(t){u.log("clickTracking",t)}}]),e}(),h=function(){function e(n){t(this,e),this.leverContainer=n.querySelector(".karma_brand_promo-lever-container"),this.ctaContainer=n.querySelector(".karma_brand_promo-cta-container"),this.leverLoaded=this.leverContainer.getAttribute("data-lever-loaded"),this.promotedDreson=n.getAttribute("data-promo-dreson"),this.featurePositionOfShoppromo=this._getFeatureOrder(n),this.teaserPosition=-1,this.contextDreson=this._getContextDreson(n),u.log("Create new Area",this)}return n(e,[{key:"setLeverLoaded",value:function(){this.leverContainer.setAttribute("data-lever-loaded","true"),this.leverLoaded=!0}},{key:"_getFeatureOrder",value:function(t){for(var e=t;e&&!e.getAttribute("data-feature-order");)e=e.parentElement;return e?parseInt(e.getAttribute("data-feature-order")):-1}},{key:"_getContextDreson",value:function(t){for(var e=t;e&&!e.getAttribute("data-context-dreson");)e=e.parentElement;return e?e.getAttribute("data-context-dreson"):""}},{key:"withTeaserPosition",value:function(t){return this.teaserPosition=t,this}}]),e}(),l=function(){function e(){t(this,e)}return n(e,[{key:"init",value:function(t){var e=this;u.log("Initialized BenefitsLoader");var n=t.querySelectorAll(".karma_brand_promo-container");[].map.call(n,(function(t){return new h(t)})).filter((function(t){return-1===t.promotedDreson.indexOf("(ref.")})).filter((function(t){return"false"===t.leverLoaded})).map((function(t,n){return e.appendAndGetLeverFor(t.withTeaserPosition(n+1))}))}},{key:"appendLeverToArea",value:function(t,e){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];u.log("Append lever to area.",t,e),e.ctaContainer.style.visibility="hidden",e.leverContainer.appendChild(t.cloneNode(!0)),e.leverContainer.style.visibility="visible",e.leverContainer.style.opacity="1",e.setLeverLoaded(),n&&(preload_polyfill_invoke(e.leverContainer),o_util.hardcore.executeInlineScripts(e.leverContainer))}},{key:"appendAndGetLeverFor",value:function(t){var e=this,n=t.promotedDreson,i=t.featurePositionOfShoppromo,r=t.teaserPosition,o=t.contextDreson;return window.o_util.ajax({url:"/benefit-presentation/lever/slideshow?dreson=".concat(n,"&featurePosition=").concat(i,"&teaserPosition=").concat(r,"&pageContextDreson=").concat(o),method:"GET"}).then((function(i){if(200===i.status){var r=window.o_util.dom.stringToDocumentFragment(i.responseText);return"tracking"===i.getResponseHeader("x-aggregation")?Promise.resolve({success:!1,status:"Benefit for ".concat(n," is used for tracking only")}):void 0!==r?(e.appendLeverToArea(r,t),Promise.resolve({lever:r,area:t,success:!0})):(u.warn("DocumentFragment for ".concat(n," is undefined")),Promise.resolve({success:!1,status:"DocumentFragment for ".concat(n," is undefined")}))}return u.warn("Benefit answered with ".concat(i.status," for ").concat(n)),Promise.resolve({success:!1,status:"Benefit answered with ".concat(i.status," for ").concat(n)})}))}}]),e}(),f=function(){function e(){t(this,e),i(this,"_affinity",void 0),i(this,"_cpm",void 0),i(this,"_featureSequence",void 0),i(this,"_interactionPoint",void 0),i(this,"_offerCode",void 0),i(this,"_offerName",void 0),i(this,"_pricingFactor",void 0),i(this,"_offerScore",void 0),i(this,"_unknown",void 0),i(this,"_treatmentCode",void 0),i(this,"_targetPSR",void 0),i(this,"_imageId",void 0),i(this,"_ca",void 0)}return n(e,[{key:"track",value:function(t){return{dynamo_BrandShopPromotionLarge:"".concat(this._affinity,"∞").concat(this._cpm,"∞").concat(this._featureSequence,"∞").concat(this._interactionPoint,"∞").concat(this._offerCode,"∞").concat(this._offerName,"∞").concat(this._pricingFactor,"∞").concat(this._offerScore,"∞").concat(this._unknown,"∞").concat(t),dynamo_TreatmentCode:"".concat(this._treatmentCode,"∞").concat(t),dynamo_BrandPromoTargetPSR:"".concat(this._targetPSR),dynamo_BrandPromoImageId:"".concat(this._imageId),dynamo_CampaignAffinity:"".concat(this._ca)}}}]),e}(),g=function(){function e(){t(this,e)}return n(e,[{key:"init",value:function(){var t=this,e=document.querySelectorAll(".karma_brand_promo-container"),n=this.getTrackingData(e[0]);this.trackView(n,!1),e.length>1&&[].forEach.call(e,(function(e,n){if(n>0){var i=t.getTrackingData(e);t.trackView(i,!0)}})),[].forEach.call(e,(function(e){t.trackBrandPromo(e)}))}},{key:"trackBrandPromo",value:function(t){if(t){var e=t.querySelector(".karma_brand_promo-link-wrapper"),n=this.getTrackingData(t);n&&(this.registerClickTracking(e,n),this.registerSeenTracking(e,n))}}},{key:"getTrackingData",value:function(t){var e=new f,n=JSON.parse(t.getAttribute("data-tracking")),i=t.parentElement.parentElement.getAttribute("data-feature-order"),r=t.getAttribute("data-ca")||"Leer";if(null!==n)return e._featureSequence=i||"99",e._affinity=n.affinity||"Leer",e._cpm=n.cpm||"Leer",e._interactionPoint=n.interactionPoint||"x",e._offerCode=n.offerCode||"x",e._offerName=n.offerName||"x",e._pricingFactor=n.pacingFactor||"x",e._offerScore=n.score||"x",e._unknown="x",e._treatmentCode=n.treatmentCode||"x",e._targetPSR=t.getAttribute("data-promo-dreson")||"x",e._imageId=n.imageId||"x",e._ca=r,e;u.error("Received no tracking data from backend via 'data-tracking' attribute.")}},{key:"registerClickTracking",value:function(t,e){t.addEventListener("click",(function(t){if("IMG"===t.target.tagName&&e){var n=e.track("click");u.log("(Legacy) Track click",n),window.o_tracking.bct.submitMove(n)}}))}},{key:"registerSeenTracking",value:function(t,e){new IntersectionObserver((function(t,n){var i=t[0];if(window.o_tracking&&window.o_tracking.bct&&e&&i.isIntersecting){n.unobserve(i.target);var r=e.track("seen");u.log("(Legacy) Track seen",r),window.o_tracking.bct.sendEventToTrackingServer(r)}}),{threshold:.75}).observe(t)}},{key:"trackView",value:function(t,e){var n=t.track("view");u.log("(Legacy) Track initial view",n),window.o_tracking&&window.o_tracking.bct&&(e?window.o_tracking.bct.sendEventToTrackingServer(n):window.o_tracking.bct.sendMergeToTrackingServer(n))}}]),e}();window.karma=window.karma||{},function(t,e){function n(t){this.time=t.time,this.target=t.target,this.rootBounds=t.rootBounds,this.boundingClientRect=t.boundingClientRect,this.intersectionRect=t.intersectionRect||{top:0,bottom:0,left:0,right:0,width:0,height:0},this.isIntersecting=!!t.intersectionRect;var e=this.boundingClientRect,n=e.width*e.height,i=this.intersectionRect,r=i.width*i.height;this.intersectionRatio=n?r/n:this.isIntersecting?1:0}function i(t,e){var n,i,r,o=e||{};if("function"!=typeof t)throw new Error("callback must be a function");if(o.root&&1!=o.root.nodeType)throw new Error("root must be an Element");this._checkForIntersections=(n=this._checkForIntersections.bind(this),i=this.THROTTLE_TIMEOUT,r=null,function(){r||(r=setTimeout((function(){n(),r=null}),i))}),this._callback=t,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(o.rootMargin),this.thresholds=this._initThresholds(o.threshold),this.root=o.root||null,this.rootMargin=this._rootMarginValues.map((function(t){return t.value+t.unit})).join(" ")}function r(t,e,n,i){"function"==typeof t.addEventListener?t.addEventListener(e,n,i||!1):"function"==typeof t.attachEvent&&t.attachEvent("on"+e,n)}function o(t,e,n,i){"function"==typeof t.removeEventListener?t.removeEventListener(e,n,i||!1):"function"==typeof t.detatchEvent&&t.detatchEvent("on"+e,n)}function a(t){var e;try{e=t.getBoundingClientRect()}catch(t){}return e?(e.width&&e.height||(e={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.right-e.left,height:e.bottom-e.top}),e):{top:0,bottom:0,left:0,right:0,width:0,height:0}}function s(t,e){for(var n=e;n;){if(n==t)return!0;n=c(n)}return!1}function c(t){var e=t.parentNode;return e&&11==e.nodeType&&e.host?e.host:e}"IntersectionObserver"in t&&"IntersectionObserverEntry"in t&&"intersectionRatio"in t.IntersectionObserverEntry.prototype?"isIntersecting"in t.IntersectionObserverEntry.prototype||Object.defineProperty(t.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}}):(i.prototype.THROTTLE_TIMEOUT=100,i.prototype.POLL_INTERVAL=null,i.prototype.USE_MUTATION_OBSERVER=!0,i.prototype.observe=function(t){if(!this._observationTargets.some((function(e){return e.element==t}))){if(!t||1!=t.nodeType)throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:t,entry:null}),this._monitorIntersections(),this._checkForIntersections()}},i.prototype.unobserve=function(t){this._observationTargets=this._observationTargets.filter((function(e){return e.element!=t})),this._observationTargets.length||(this._unmonitorIntersections(),this._unregisterInstance())},i.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorIntersections(),this._unregisterInstance()},i.prototype.takeRecords=function(){var t=this._queuedEntries.slice();return this._queuedEntries=[],t},i.prototype._initThresholds=function(t){var e=t||[0];return Array.isArray(e)||(e=[e]),e.sort().filter((function(t,e,n){if("number"!=typeof t||isNaN(t)||t<0||t>1)throw new Error("threshold must be a number between 0 and 1 inclusively");return t!==n[e-1]}))},i.prototype._parseRootMargin=function(t){var e=(t||"0px").split(/\s+/).map((function(t){var e=/^(-?\d*\.?\d+)(px|%)$/.exec(t);if(!e)throw new Error("rootMargin must be specified in pixels or percent");return{value:parseFloat(e[1]),unit:e[2]}}));return e[1]=e[1]||e[0],e[2]=e[2]||e[0],e[3]=e[3]||e[1],e},i.prototype._monitorIntersections=function(){this._monitoringIntersections||(this._monitoringIntersections=!0,this.POLL_INTERVAL?this._monitoringInterval=setInterval(this._checkForIntersections,this.POLL_INTERVAL):(r(t,"resize",this._checkForIntersections,!0),r(e,"scroll",this._checkForIntersections,!0),this.USE_MUTATION_OBSERVER&&"MutationObserver"in t&&(this._domObserver=new MutationObserver(this._checkForIntersections),this._domObserver.observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0}))))},i.prototype._unmonitorIntersections=function(){this._monitoringIntersections&&(this._monitoringIntersections=!1,clearInterval(this._monitoringInterval),this._monitoringInterval=null,o(t,"resize",this._checkForIntersections,!0),o(e,"scroll",this._checkForIntersections,!0),this._domObserver&&(this._domObserver.disconnect(),this._domObserver=null))},i.prototype._checkForIntersections=function(){var e=this._rootIsInDom(),i=e?this._getRootRect():{top:0,bottom:0,left:0,right:0,width:0,height:0};this._observationTargets.forEach((function(r){var o=r.element,s=a(o),c=this._rootContainsTarget(o),u=r.entry,d=e&&c&&this._computeTargetAndRootIntersection(o,i),h=r.entry=new n({time:t.performance&&performance.now&&performance.now(),target:o,boundingClientRect:s,rootBounds:i,intersectionRect:d});u?e&&c?this._hasCrossedThreshold(u,h)&&this._queuedEntries.push(h):u&&u.isIntersecting&&this._queuedEntries.push(h):this._queuedEntries.push(h)}),this),this._queuedEntries.length&&this._callback(this.takeRecords(),this)},i.prototype._computeTargetAndRootIntersection=function(n,i){if("none"!=t.getComputedStyle(n).display){for(var r,o,s,u,d,h,l,f,g=a(n),v=c(n),m=!1;!m;){var _=null,b=1==v.nodeType?t.getComputedStyle(v):{};if("none"==b.display)return;if(v==this.root||v==e?(m=!0,_=i):v!=e.body&&v!=e.documentElement&&"visible"!=b.overflow&&(_=a(v)),_&&(r=_,o=g,s=void 0,u=void 0,d=void 0,h=void 0,l=void 0,f=void 0,s=Math.max(r.top,o.top),u=Math.min(r.bottom,o.bottom),d=Math.max(r.left,o.left),h=Math.min(r.right,o.right),f=u-s,!(g=(l=h-d)>=0&&f>=0&&{top:s,bottom:u,left:d,right:h,width:l,height:f})))break;v=c(v)}return g}},i.prototype._getRootRect=function(){var t;if(this.root)t=a(this.root);else{var n=e.documentElement,i=e.body;t={top:0,left:0,right:n.clientWidth||i.clientWidth,width:n.clientWidth||i.clientWidth,bottom:n.clientHeight||i.clientHeight,height:n.clientHeight||i.clientHeight}}return this._expandRectByRootMargin(t)},i.prototype._expandRectByRootMargin=function(t){var e=this._rootMarginValues.map((function(e,n){return"px"==e.unit?e.value:e.value*(n%2?t.width:t.height)/100})),n={top:t.top-e[0],right:t.right+e[1],bottom:t.bottom+e[2],left:t.left-e[3]};return n.width=n.right-n.left,n.height=n.bottom-n.top,n},i.prototype._hasCrossedThreshold=function(t,e){var n=t&&t.isIntersecting?t.intersectionRatio||0:-1,i=e.isIntersecting?e.intersectionRatio||0:-1;if(n!==i)for(var r=0;r<this.thresholds.length;r++){var o=this.thresholds[r];if(o==n||o==i||o<n!=o<i)return!0}},i.prototype._rootIsInDom=function(){return!this.root||s(e,this.root)},i.prototype._rootContainsTarget=function(t){return s(this.root||e,t)},i.prototype._registerInstance=function(){},i.prototype._unregisterInstance=function(){},t.IntersectionObserver=i,t.IntersectionObserverEntry=n)}(window,document),o_global.eventLoader.onAllScriptsExecuted(98,(function(){window.karma.tracking_service=window.karma.tracking_service||new d(window.o_global.eventQBus),window.karma.legacy_tracking=window.karma.legacy_tracking||new g,[].forEach.call(document.querySelectorAll(".karma_brand_promo-list"),(function(t){var e=a.fromElement(t).build();window.karma.tracking_service.trackBrandPromoContainer(e)})),(new l).init(document),window.karma.legacy_tracking.init()}))}();
//# sourceMappingURL=/karma-promo/assets/ft9.karma-promo.ft9_kestrel_bundle.94b037a8.js.map