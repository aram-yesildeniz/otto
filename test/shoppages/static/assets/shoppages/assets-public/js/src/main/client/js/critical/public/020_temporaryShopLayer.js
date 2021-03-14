'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.temporaryShopLayer = (() => {
    // cookie config
    const COOKIE_NAME = 'temporaryShopLayer';
    const DEFAULT_VALUE = '1';
    const PATH = '/';
    const DURATION = 300;

    // layer config
    const DEFAULT_LAYER_HEIGHT = 510;

    function showTemporaryLayer (url) {
        const cookie = o_util.cookie.get(COOKIE_NAME);
        if (typeof cookie === 'undefined' || cookie !== '1') {
            o_util.cookie.set(COOKIE_NAME, DEFAULT_VALUE, {minutes: DURATION, path: PATH});
            const temporaryShopLayer = new o_global.pali.layerBuilder({
                modal: true, url, heightLXL: `${DEFAULT_LAYER_HEIGHT}px`
            });
            temporaryShopLayer.open();
        }
    }

    return {
        showTemporaryLayer
    };
})();
