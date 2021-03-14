'use strict';

window.o_shoppages = window.o_shoppages || {};

/*
Method displays Iphone's smart app banner in case a visible flag is provided.
Moreover, in case a cookie exist do not show the banner.
 */
o_shoppages.smartAppBanner = (() => {
    const COOKIE_NAME = 'sp_smartAppBanner';
    const COOKIE_DEFAULT_VALUE = '1';
    const COOKIE_PATH = '/';
    const COOKIE_DURATION = 14;

    function initSmartAppBanner ({shouldDisplaySmartBanner, adjustLink, trackingId}) {
        if (shouldDisplaySmartBanner === true) {
            const cookie = o_util.cookie.get(COOKIE_NAME);
            if (typeof cookie === 'undefined' || cookie !== COOKIE_DEFAULT_VALUE) {
                const smartBanner = document.getElementById('sp_smartAppBanner');
                const closeButton = document.getElementById('sp_smartAppBannerClose');
                const gotoButton = document.getElementById('sp_smartAppBannerGotoAppButton');
                if (smartBanner !== null && closeButton !== null && gotoButton !== null) {
                    closeButton.onclick = () => {
                        o_shoppages.o_tracking.sendEventToTrackingServer({ot_AppBanner: 'closed'});
                        o_util.cookie.set(COOKIE_NAME, COOKIE_DEFAULT_VALUE, {days: COOKIE_DURATION, path: COOKIE_PATH});
                        smartBanner.style.display = 'none';
                    };
                    gotoButton.href = adjustLink;
                    gotoButton.onclick = () => {
                        o_shoppages.o_tracking.sendEventToTrackingServer({ot_AppBanner: 'clicked', app_AdjustClickLabel: trackingId}).then();
                    };

                    o_shoppages.o_tracking.sendEventToTrackingServer({ot_AppBanner: 'shown'});
                    smartBanner.style.display = 'block';
                }
            }
        }
    }

    return {
        initSmartAppBanner
    };
})();
