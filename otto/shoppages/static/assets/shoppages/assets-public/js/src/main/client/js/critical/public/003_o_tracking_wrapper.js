'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.o_tracking = (() => {
    const JS_CLICK_TRACKING_CLASS = 'js_contentElementClickTracking';
    const JS_CONTENT_ELEMENT_ROOT_CLASS = 'sp_js_contentElement';
    const JS_VIEW_TRACKING_CLASS = 'js_contentElementViewTracking';
    const DATA_ELEMENT_TYPE_KEY = 'data-content-element-type';
    const DATA_ELEMENT_NAME_KEY = 'data-content-element-name';

    function initClickHandlerForLinks () {
        window.o_util.event.delegate(document, 'click',
            `.${JS_CONTENT_ELEMENT_ROOT_CLASS} a:not(.js_expanderButton), a.${JS_CONTENT_ELEMENT_ROOT_CLASS}`,
            (event) => {
                const contentElementRoot = o_util.dom.getParentByClassName(event.target, JS_CONTENT_ELEMENT_ROOT_CLASS);

                let el = null;
                if (event.target.tagName === 'A') {
                    el = event.target;
                } else {
                    el = o_util.dom.getParentByClassName(event.target, JS_CLICK_TRACKING_CLASS);
                }
                if (el !== null) {
                    const contentElementType = contentElementRoot.getAttribute(DATA_ELEMENT_TYPE_KEY);
                    const contentElementName = contentElementRoot.getAttribute(DATA_ELEMENT_NAME_KEY);
                    o_shoppages.o_tracking.sendEventToTrackingServer(
                        {
                            ot_ContentElementActivity: 'click',
                            ot_ContentElementTyp: contentElementType,
                            ot_ContentElementName: contentElementName
                        });
                }
            });
    }

    function initViewHandlerForContentElements () {
        const elements = document.getElementsByClassName(JS_VIEW_TRACKING_CLASS);
        if (elements !== null) {
            Array.prototype.forEach.call(elements, (element) => {
                if (!element.getAttribute('data-content-element-tracked')) {
                    const contentElementType = element.getAttribute(DATA_ELEMENT_TYPE_KEY);
                    const contentElementName = element.getAttribute(DATA_ELEMENT_NAME_KEY);
                    o_shoppages.o_tracking.sendEventToTrackingServer(
                        {
                            ot_ContentElementActivity: 'view',
                            ot_ContentElementTyp: contentElementType,
                            ot_ContentElementName: contentElementName
                        });
                    element.setAttribute('data-content-element-tracked', true);
                }
            });
        }
    }

    function trackOnNextPageImpression (trackingData) {
        if (window.o_tracking && window.o_tracking.bct) {
            return window.o_tracking.bct.trackOnNextPageImpression(trackingData);
        }
        return true;
    }

    function sendEventToTrackingServer (trackingData) {
        if (window.o_tracking && window.o_tracking.bct) {
            return window.o_tracking.bct.sendEventToTrackingServer(trackingData);
        }
        return new Promise((resolve) => resolve());
    }

    function init () {
        if (!window.shoppagesTrackingWrapperInitialized) {
            window.shoppagesTrackingWrapperInitialized = true;
            initClickHandlerForLinks();
        }
        initViewHandlerForContentElements();
    }

    return {
        trackOnNextPageImpression,
        sendEventToTrackingServer,
        init,
        initViewHandlerForContentElements,
        initClickHandlerForLinks
    };
})();

o_global.eventLoader.onLoad(100, () => {
    o_shoppages.o_tracking.init();
});

