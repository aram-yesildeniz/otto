'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.adjustLink = (() => {
    function initLinks () {
        const adjustLinkElements = document.querySelectorAll('[data-app-link]');
        Array.prototype.forEach.call(adjustLinkElements, initLink);
    }
    function initLink (adjustLinkElement) {
        if (adjustLinkElement.hasAttribute('data-app-link')) {
            const adjustLinkDataEncoded = adjustLinkElement.getAttribute('data-app-link');
            try {
                const decodedAdjustLinkDataJsonString = window.atob(adjustLinkDataEncoded);
                const decodedAdjustLinkData = JSON.parse(decodedAdjustLinkDataJsonString);
                // only if the data-app-link json object contains actual data
                if (decodedAdjustLinkData.linkTarget) {
                    if (isApp()) {
                        adjustLinkElement.setAttribute('href', buildApplinkUrl(decodedAdjustLinkData));
                    } else {
                        adjustLinkElement.setAttribute('href', buildAdjustLinkUrl(decodedAdjustLinkData));
                    }
                }
            } catch (exception) {
                // eslint-disable-next-line no-console
                console.error(exception);
            } finally {
                adjustLinkElement.removeAttribute('data-app-link');
            }
        }
    }
    function buildAdjustLinkUrl (adjustLinkData) {
        const encodedLinkTarget = encodeURIComponent(adjustLinkData.linkTarget);
        const hostName = resolveHostname();
        return `https://frj4.adj.st/${hostName}/extern/?page=${encodedLinkTarget}&otto_deep_link=https%3A%2F%2F${hostName}%2Fextern%2F%3Fpage%3D${encodeURIComponent(encodedLinkTarget)}&adjust_t=${encodeURIComponent(adjustLinkData.adjustIosToken)}_${encodeURIComponent(adjustLinkData.adjustAndroidToken)}&adjust_deeplink=otto%3A%2F%2F${hostName}%2Fextern%2F%3Fpage%3D${encodeURIComponent(encodedLinkTarget)}&adjust_fallback=https%3A%2F%2F${hostName}${encodeURIComponent(adjustLinkData.adjustFallbackLink)}&adjust_redirect_macos=https%3A%2F%2F${hostName}${encodeURIComponent(adjustLinkData.adjustFallbackLink)}`;
    }
    function buildApplinkUrl (adjustLinkData) {
        return `https://${resolveHostname()}/extern/?page=${encodeURIComponent(adjustLinkData.linkTarget)}`;
    }
    function isApp () {
        return o_global.helper.cookieExist('app');
    }
    function resolveHostname () {
        return location.hostname;
    }
    return {
        initLinks
    };
})();

o_global.eventLoader.onAllScriptsExecuted(100, () => {
    o_shoppages.adjustLink.initLinks();
});
