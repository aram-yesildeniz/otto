'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.layerPlayer = (() => {
    // layer config
    const DEFAULT_LAYER_HEIGHT = 510;
    const SHOPPAGES_URL_PREFIX = '/shoppages';

    function showPhishingLayer (url) {
        const layerUrl = `${SHOPPAGES_URL_PREFIX}/${url}`;
        const layer = new o_global.pali.layerBuilder({modal: true, url: layerUrl, heightLXL: `${DEFAULT_LAYER_HEIGHT}px`});
        layer.open();
    }

    return {
        showPhishingLayer
    };
})();
