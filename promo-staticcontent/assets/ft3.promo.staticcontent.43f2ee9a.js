!function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function n(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}var r=function(){function e(){t(this,e)}return n(e,[{key:"loadAllContent",value:function(){var t=document.getElementsByClassName("promo_staticcontent-widget--diu-room-url");[].forEach.call(t,(function(t){if("true"!==t.getAttribute("data-tracked")){t.setAttribute("data-tracked","true");var e=t.parentElement,n=t.getAttribute("data-url");o_util.ajax({url:n,method:"GET",headers:{accept:"text/html"}}).then((function(n){if(200===n.status){var r=o_util.dom.stringToDocumentFragment(n.responseText);void 0!==r&&(t.appendChild(r),window.o_util.hardcore.executeInlineScripts(t),window.o_promo_staticcontent.trackView(e))}}))}}))}}]),e}(),a=function(){function e(){t(this,e),this.tracker=window.o_tracking,this.tracker.bct||(this.tracker.bct={sendMergeToTrackingServer:function(){},sendEventToTrackingServer:function(){},submitMove:function(){}})}return n(e,[{key:"sendClickTrackingEvent",value:function(t,e,n,r,a,i,o){var c=this._buildClickTrackingPayload(t,e,n,r,a,i,o,"click");this.tracker.bct.submitMove(c)}},{key:"sendViewTrackingEvent",value:function(t,e,n,r,a,i,o){var c={};c["promo_".concat(t)]=this._getEventAsString(e,n,r,a,i,o,"view"),this.tracker.bct.sendMergeToTrackingServer(c)}},{key:"_buildClickTrackingPayload",value:function(t,e,n,r,a,i,o,c){var u={},s=this._getEventAsString(e,n,r,a,i,o,c);return u["promo_"+t]=s,u["wk.promo_Attribution"]="promo_"+t+"∞"+s,u}},{key:"_getEventAsString",value:function(t,e,n,r,a,i,o){var c=n+1;return t&&t.length>200&&(t=t.substring(0,200)),t+"∞"+e+"$"+c+"∞"+r+"∞"+a+"∞"+i+"∞"+o}}]),e}(),i=function(){function e(){t(this,e)}return n(e,[{key:"trackClick",value:function(t){var e=this.findParentContainer(t),n=this.getPromoType(e),r=this.getContent(e,n),i=this.getFeatureOrder(e),o=this.getFeatureIndex(e);(new a).sendClickTrackingEvent(n,r,i,o,1,1,"manual")}},{key:"getContent",value:function(t,e){switch(e){case"Textlink":return t.getElementsByTagName("a")[0].getAttribute("href").replace(/^(http|https):\/\/[a-z0-9.-]+\.?otto\.de/,"");case"InteractiveRoom":return t.getAttribute("data-room-id");case"Video":return t.getAttribute("data-video-id");default:return"n/a"}}},{key:"trackView",value:function(t){var e=this.getPromoType(t),n=this.getContent(t,e),r=this.getFeatureOrder(t),i=this.getFeatureIndex(t);(new a).sendViewTrackingEvent(e,n,r,i,1,1,"manual")}},{key:"getPromoType",value:function(t){return t.getAttribute("data-promo-type")}},{key:"getFeatureOrder",value:function(t){return parseInt(t.parentElement.getAttribute("data-feature-order"),0)}},{key:"getFeatureIndex",value:function(t){return parseInt(t.getAttribute("data-feature-index"),0)}},{key:"findParentContainer",value:function(t){for(;!t.classList.contains("promo_staticcontent--trackable-widget")&&(t=t.parentElement););return t}}]),e}();window.o_promo_staticcontent=new i,window.o_global.eventLoader.onAllScriptsExecuted(95,(function(){var t;t=document.getElementsByClassName("promo_staticcontent--trackable-widget"),[].forEach.call(t,(function(t){"true"!==t.getAttribute("data-tracked")&&(t.setAttribute("data-tracked","true"),window.o_promo_staticcontent.trackView(t))})),(new r).loadAllContent()}))}();
//# sourceMappingURL=/promo-staticcontent/assets/ft3.promo.staticcontent.43f2ee9a.js.map