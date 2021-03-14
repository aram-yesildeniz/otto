/* eslint-disable no-ternary,prefer-template */
'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.trackingUUID = (() => {
    function trackFeedbackInFooter () {
        const elements = document.querySelectorAll('.sp_js_trackFeedback');
        if (elements !== null && elements.length > 0) {
            Array.prototype.forEach.call(elements, (element) => {
                element.addEventListener('click', () => {
                    const uuid = o_util.misc.guid();
                    o_shoppages.o_tracking.sendEventToTrackingServer({ot_FeedbackId: uuid});
                    o_global.popup.open('/user-feedback/feedback/message.html?ot_FeedbackId=' + uuid, 'Lob und Kritik', 800,
                        650);
                });
            });
        }
    }

    function trackFeedbackInAppFooter () {
        const elements = document.querySelectorAll('.sp_js_trackFeedbackApp');
        if (elements !== null && elements.length > 0) {
            Array.prototype.forEach.call(elements, (element) => {
                const uuid = o_util.misc.guid();
                element.href = element.href + '?source=app&ot_FeedbackId=' + uuid;
                element.addEventListener('click', () => {
                    o_shoppages.o_tracking.sendEventToTrackingServer({ot_FeedbackId: uuid});
                });
            });
        }
    }

    function init () {
        trackFeedbackInFooter();
        trackFeedbackInAppFooter();
    }

    return {
        init
    };
})();

o_global.eventLoader.onLoad(100, () => {
    if (window.shoppagesTrackingUUIDInitialized) {
        return;
    }
    window.shoppagesTrackingUUIDInitialized = true;
    o_shoppages.trackingUUID.init();
});
