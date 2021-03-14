'use strict';

const trackingApiImpl = require('../tracking/trackingApi.js');

module.exports = (globalWindow, trackingApi) => {
    if (trackingApi === undefined) {
        trackingApi = trackingApiImpl;
    }

    const module = {};

    const domain = '.otto.de';

    o_util.event.delegate(document, 'click', '.reco_privacy__info', () => {
        trackingApi.sendEventRequest({promo_Privacy: 'info'});
    });

    o_util.event.delegate(document, 'click', '.reco_privacy__opt_out', () => {
        o_util.ajax.get("/reco-core/set-anonymous-cookie")
            .then(() => {
                trackingApi.sendEventRequest({promo_Privacy: 'optOut'});
                globalWindow.location.reload(true);
            });
    });

    o_util.event.delegate(document, 'click', '.reco_privacy__opt_in', () => {
        o_util.cookie.remove('anonymous', {domain: domain});
        trackingApi.sendEventRequest({promo_Privacy: 'optIn'});
        globalWindow.location.reload(true);
    });

    return module;
};
