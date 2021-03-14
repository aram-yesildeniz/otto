window.o_benefit=window.o_benefit||{},o_benefit.trackingApi=function(){var e={},t=function t(){return!!(window.o_tracking&&window.o_tracking.bct&&window.o_tracking.bct.sendMergeToTrackingServer&&window.o_tracking.bct.sendEventMergeToTrackingServer&&window.o_tracking.bct.submitMove);};return e.sendEventRequest=function(e){t()&&(o_tracking.bct.trackOnNextPageImpression(e),!0===o_global.debug.status().activated&&console.log("lever event tracking",e));},e.sendRealEventRequest=function(e){!0===o_global.debug.status().activated&&console.log("[benefit-presentation] Send 'event' to tracking server: ",e),o_tracking.bct.sendEventToTrackingServer(e).then(function(){!0===o_global.debug.status().activated&&console.log("[benefit-presentation] ".concat(e," succesfully sent to tracking server"));}).catch(function(t){!0===o_global.debug.status().activated&&console.warn("[benefit-presentation] Error while sending ".concat(e," to tracking server"),t);});},e.sendEventMergeRequest=function(e,n){t()&&(o_tracking.bct.sendEventMergeToTrackingServer(e,n),!0===o_global.debug.status().activated&&console.log("lever event merge tracking",e));},e.sendMergeRequest=function(e){t()&&(o_tracking.bct.sendMergeToTrackingServer(e),!0===o_global.debug.status().activated&&console.log("lever merge tracking",e));},e;}(),window.o_benefit=window.o_benefit||{},o_benefit.trackingQueueEventEmitter=function(){var e={trackOnNextPageImpression:function trackOnNextPageImpression(e){return t("[benefit-presentation] Track on next PI",e),window.o_global.eventQBus.emit("tracking.bct.addFeaturesToPageImpression",e).catch(function(e){n("[benefit-presentation] Could not emit event 'addFeaturesToPageImpression'",e);});},sendEvent:function sendEvent(e){return t("[benefit-presentation] Send 'event'",e),window.o_global.eventQBus.emit("tracking.bct.submitAction",{},e).catch(function(e){n("[benefit-presentation] Could not emit event 'submitAction'",e);});},sendEventMerge:function sendEventMerge(e,i){return t("[benefit-presentation] Send 'event merge' with eventMergeId: ".concat(i),e),window.o_global.eventQBus.emit("tracking.bct.addActionToEvent",e).catch(function(e){n("[benefit-presentation] Could not emit event 'addActionToEvent'",e);});},sendMerge:function sendMerge(e){return t("[benefit-presentation] Send 'merge'",e),window.o_global.eventQBus.emit("tracking.bct.addFeaturesToPageImpression",e).catch(function(e){n("[benefit-presentation] Could not emit event 'addFeaturesToPageImpression'",e);});},submitMove:function submitMove(e){return t("[benefit-presentation] Submit 'move'",e),window.o_global.eventQBus.emit("tracking.bct.submitMoveAction",{},e).catch(function(e){n("[benefit-presentation] Could not emit event 'submitMoveAction'",e);});}},t=function t(e,_t){!0===o_global.debug.status().activated&&console.log(e,_t);},n=function n(e,t){!0===o_global.debug.status().activated&&console.error(e,t);};return e;}(),window.o_benefit=window.o_benefit||{},window.o_tracking=window.o_tracking||{},o_benefit.trackingHandler=function(){var e={initLeversGeneric:function initLeversGeneric(i){var o=[];for(var _t2=0;i&&i.levers&&_t2<i.levers.length;_t2++){var _n=i.levers[_t2].leverElement.getAttribute("data-lever-id"),_r=i.levers[_t2].leverElement.getAttribute("data-tracking");var a=_n+JSON.parse(_r).position;var l=!0;for(var _e=0;_e<o.length;_e++){o[_e]===a&&(l=!1);}var c={};c.leverElement=i.levers[_t2].leverElement,c.featurePosition=i.levers[_t2].featurePosition,c.eventMergeId=i.eventMergeId,c.promoPosition=i.levers[_t2].position,c.trackView=l,e.initLeverGeneric(c),o.push(a);}if(o_util.toggle.get("FT9_MAIN_LEVERS_FEATURE_TRACKING",!1)&&i&&i.levers){(function(){var e=t(i),o=[],r=[];var _loop=function _loop(_t3){var a=i.levers[_t3].leverElement.getAttribute("data-lever-id"),l=JSON.parse(i.levers[_t3].leverElement.getAttribute("data-tracking")),c=a+l.position,s=i.levers[_t3].leverElement.getElementsByClassName("benefit-main__lever__code-box--app"),d=1===s.length,b=/[a-zA-Z]*/.exec(l.position)[0];if(!o.includes(c)){var _e2=n(a,_t3+1,"visible",l.content,l.scarcity,b);d&&(_e2.labels.benefit_AppOnlyButton=["view"]),r.push(_e2);}i.levers[_t3].leverElement.onclick=function(){var i=n(a,_t3+1,"clicked",l.content,l.scarcity,b),o={name:"open",features:[e,i]};o_benefit.trackingQueueEventEmitter.sendEvent(o);};var u=i.levers[_t3].leverElement.querySelectorAll(".benefit-main__lever__code-box--code");0!==u.length&&(u[0].onclick=function(i){i.stopPropagation();var o=n(a,_t3+1,"clicked",l.content,l.scarcity,b);o.labels.benefit_Copy=["true"];var r={name:"click",features:[e,o]};o_benefit.trackingQueueEventEmitter.sendEvent(r);}),!0===d&&(s[0].onclick=function(){var i=n(a,_t3+1,"clicked",l.content,l.scarcity,b);i.labels.benefit_AppOnlyButton=["clicked"];var o={name:"open",features:[e,i]};o_benefit.trackingQueueEventEmitter.submitMove(o);}),o.push(c);};for(var _t3=0;_t3<i.levers.length;_t3++){_loop(_t3);}i.eventMergeId&&void 0!==i.eventMergeId?o_benefit.trackingQueueEventEmitter.sendEventMerge([e].concat(r),i.eventMergeId):o_benefit.trackingQueueEventEmitter.sendMerge([e].concat(r));})();}}},t=function t(e){var t=parseInt(e.featurePosition);return{id:"FT9-benefit-main",name:"KundenvorteilsContainer",status:"loaded",position:isNaN(t)?99:t,labels:{benefit_FilledSlots:["".concat(e.levers.length)]}};},n=function n(e,t,_n2,i,o,r){return{id:"FT9-benefit-main-".concat(t),name:"Kundenvorteil",status:_n2,parentId:"FT9-benefit-main",position:t,labels:{benefit_Content:[i],benefit_Code:["".concat(e)],benefit_Scarcity:[o],benefit_Slot:[r]}};};e.initLeverGeneric=function(e){var t=JSON.parse(e.leverElement.getAttribute("data-tracking")),n=e.leverElement.getElementsByClassName("benefit-main__lever__code-box--app"),i=1===n.length;e.featurePosition&&(t.featurePosition=e.featurePosition),!0===e.trackView&&o(t,i,e.promoPosition,e.eventMergeId),e.leverElement.onclick=function(){r(t,!1,e.promoPosition,e.eventMergeId);},!0===i&&(n[0].onclick=function(){r(t,!0,e.promoPosition,e.eventMergeId);});};var i=function i(e,t,n){return{benefit_Lever:function(e,t){var n=t||e.position;return"".concat(e.content,"\u221E").concat(e.featurePosition,"\u221E").concat(e.filledSlots,"\u221E").concat(n,"\u221E").concat(e.source,"\u221E");}(e,t)+n+"\u221E".concat(e.scarcity)};},o=function o(e,t,n,_o){if(e){var _r2=i(e,n,"view");t&&(_r2.benefit_AppOnlyButton="view"),_o&&void 0!==_o?o_benefit.trackingApi.sendEventMergeRequest(_r2,_o):o_benefit.trackingApi.sendMergeRequest(_r2);}},r=function r(e,t,n){if(e){var _o2=i(e,n,"click");if(t)return void o_tracking.bct.submitMove({benefit_AppOnlyButton:"click"});o_benefit.trackingApi.sendEventRequest(_o2);}};return e;}(),window.o_benefit=window.o_benefit||{},o_benefit.codebox=function(){var e={};var t=function t(e){var t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="absolute",t.style.left="-9999px",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t);};return e.init=function(e){[].forEach.call(e.querySelectorAll(".benefit-main__lever__code-box--code"),function(e){var n=e.querySelector(".benefit-main__lever__code-box__value--code").textContent.replace("Code ","");e.addEventListener("click",function(e){var n=arguments.length>1&&arguments[1]!==undefined?arguments[1]:!0;return function(i){o_global.debug.status().activated&&(console.log("Copy and track ".concat(e)),console.log(i)),n&&(i.preventDefault(),i.stopPropagation()),t(e),o_benefit.trackingApi.sendRealEventRequest({benefit_Copy:!0});};}(n));});},e;}(),window.o_benefit=window.o_benefit||{},o_benefit.appOnlyBox=function(){var e={};function t(e){return function(t){t.preventDefault(),t.stopPropagation(),void 0!==e&&""!==e&&e.includes("coit7v1_el2kcdb")&&(window.location=e);};}return e.init=function(e){[].forEach.call(e.querySelectorAll(".benefit-main__lever__code-box--app"),function(e){var n=e.querySelector(".benefit-main__lever__code-box__value--app").getAttribute("data-applink");o_global.device.isTouchable?e.addEventListener("touchstart",t(n)):e.addEventListener("click",t(n));});},e;}(),window.o_benefit=window.o_benefit||{},o_benefit.linkLayer=function(){var e={init:function init(e){[].forEach.call(e.querySelectorAll(".benefit-main__linkLayer"),function(e){o_global.debug.status().activated&&console.log("Initialize layer for ".concat(e)),e.addEventListener("click",function(t){return new o_global.pali.layerBuilder({modal:!0,url:window.atob(e.getAttribute("data-target-link"))}).open(t);});});}};return e;}(),window.o_benefit=window.o_benefit||{},o_benefit.countdown=function(){var e={init:function init(t){var n=t.querySelectorAll(".benefit-main__lever");[].forEach.call(n,function(t){if("true"===t.getAttribute("data-scarcity-enabled")&&"true"===t.getAttribute("data-final-countdown")){var _n3=t.querySelector(".benefit-main__lever__info__secondary__subline"),i=t.getAttribute("data-end-date"),o=new Date(i);_n3.interval=window.setInterval(function(){e.remaining_time(new Date(),o,_n3);},500);}});},remaining_time:function remaining_time(e,t,n){var i=t.getTime()-e.getTime();if(i<864e5&&i>1e3){var _e3=Math.floor(i%864e5/36e5),_t4=Math.floor(i%36e5/6e4),o=Math.floor(i%6e4/1e3),r=_e3>0?"".concat(_e3,"h "):"",a=_t4>0?"".concat(_t4,"m "):"",l=o>0?"".concat(o,"s "):"",c=i<=36e5?"benefit-main__lever__info__secondary__subline--red-alert":"";n.innerHTML="Nur noch <span class=\"".concat(c,"\">").concat(r).concat(a).concat(l,"</span>");}else i<=1e3&&(window.clearInterval(n.interval),window.setTimeout(function(){n.innerHTML="Leider abgelaufen";},1e3));}};return e;}(),window.o_benefit=window.o_benefit||{},o_benefit.codeboxLegacy=function(){var e={};var t=function t(e){var t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="absolute",t.style.left="-9999px",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t);};return e.init=function(e){[].forEach.call(e.querySelectorAll(".onex-benefit-main__lever__code-box"),function(e){var n=e.querySelector(".onex-benefit-main__lever__code-box__value").textContent;e.addEventListener("click",function(e){var n=arguments.length>1&&arguments[1]!==undefined?arguments[1]:!0;return function(i){o_global.debug.status().activated&&(console.log("Copy and track ".concat(e)),console.log(i)),n&&(i.preventDefault(),i.stopPropagation()),t(e),o_benefit.trackingApi.sendRealEventRequest({benefit_Copy:!0});};}(n));});},e;}(),window.o_benefit=window.o_benefit||{},o_benefit.initialisation=function(){var e={init:function init(e){if(e.length>0){var n=[];for(var _t5=0;_t5<e.length;_t5++){var r=e[_t5].getAttribute("data-initialized");if(r&&null!==r&&"true"===r)continue;var a=".benefit-main__lever",l=".onex-benefit-main__lever";o_global.debug.status().activated&&(console.log("[benefit-presentation] Initialization of ".concat(e[_t5])),console.log(o_benefit.linkLayer)),o_benefit.linkLayer.init(e[_t5]),o_benefit.codebox.init(e[_t5]),o_benefit.appOnlyBox.init(e[_t5]),o_benefit.codeboxLegacy.init(e[_t5]),o_benefit.countdown.init(e[_t5]);var i=e[_t5].parentElement.getAttribute("data-feature-order"),o=i||"99";[].forEach.call(e[_t5].querySelectorAll(a),function(e){n.push({leverElement:e,featurePosition:o});}),[].forEach.call(e[_t5].querySelectorAll(l),function(e){n.push({leverElement:e,featurePosition:o});}),e[_t5].setAttribute("data-initialized","true");}if(n.length>0){var _e4={};_e4.levers=n,_e4.featurePosition=o,o_benefit.trackingHandler.initLeversGeneric(_e4);}t(e);}},initSlideshow:function initSlideshow(e){Array.prototype.slice.call(e).filter(function(e){return!e.getAttribute("data-tracked")||"false"===e.getAttribute("data-tracked");}).forEach(function(e){o_benefit.trackingHandler.initLeverGeneric({leverElement:e,trackView:!0}),e.setAttribute("data-tracked",!0);});}},t=function t(e){var t=[];for(var i=0;i<e.length;++i){var o=e[i].getAttribute("data-generic-tracking");if("{}"===o)continue;var r=!1;for(var _e5=0;_e5<t.length;++_e5){t[_e5]===o&&(r=!0);}!r&&o&&(t.push(o),n(o));}},n=function n(e){var t;try{t=JSON.parse(e),o_benefit.trackingApi.sendMergeRequest(t);}catch(e){}};return e;}(),window.o_benefit=window.o_benefit||{},o_benefit.bootstrap=function(){o_global.eventLoader.onLoad(20,function(){var e=document.querySelectorAll(".benefit_init");o_global.debug.status().activated&&console.log("[benefit-presentation] Bootstrap benefits ".concat(e)),e.length>0&&o_benefit.initialisation.init(e);});},o_benefit.bootstrap();//# sourceMappingURL=/benefit-presentation/assets/ft9.benefit-presentation.benefit_assets.555ffbec.js.map