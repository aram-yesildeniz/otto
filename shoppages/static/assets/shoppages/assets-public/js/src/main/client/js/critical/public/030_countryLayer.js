'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.countryLayer = (() => {
    function resolveCountryLayer (url) {
        const cookie = o_util.cookie.get('countryLayer');
        if (typeof cookie === 'undefined' || cookie !== '1') {
            o_util.cookie.set('countryLayer', '1', {path: '/'});
            const countryLayer = new o_global.pali.layerBuilder({modal: true, url, heightLXL: '510px'});
            countryLayer.open();
        }
    }

    function displayCountryLayer (url) {
        o_global.eventLoader.onLoad(110, () => {
            resolveCountryLayer(url);
        });
    }

    function getDocumentReferrer () {
        return document.referrer;
    }

    function getDocumentHref () {
        return document.location.href;
    }

    function getParameterSeparator (urlParams) {
        if (typeof urlParams === 'undefined' && urlParams !== null) {
            return '?';
        }
        return '&';
    }

    function assignShopPathToATLink (linkButtonId) {
        const link = document.getElementById(linkButtonId);
        if (link !== null) {
            let referrerParam = '';
            const documentReferrer = o_shoppages.countryLayer.getDocumentReferrer();
            if (documentReferrer !== null && documentReferrer !== '') {
                referrerParam = `&ovdredchannel=${documentReferrer}`;
            }
            //  regex explanation:
            // http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
            const hrefSeparator = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
            const documentHrefParts = o_shoppages.countryLayer.getDocumentHref().split(hrefSeparator);
            const linkHrefParts = link.getAttribute('href').split(hrefSeparator);
            const extendedLinkHref = `${link.getAttribute('href')}${getParameterSeparator(
                linkHrefParts[6])}ovdredurl=${documentHrefParts[5].replace(/\/$/, '')}${referrerParam}`;
            link.setAttribute('href', extendedLinkHref);
        }
    }

    return {
        getDocumentReferrer,
        getDocumentHref,
        resolveCountryLayer,
        displayCountryLayer,
        assignShopPathToATLink
    };
})();
