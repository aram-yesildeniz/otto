/* eslint-disable no-underscore-dangle */
'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.retargetingOptOutLayer = (() => {
    const COOKIE_NAME = 'DS';
    const SHOPPAGES_ENDPOINT = '/shoppages/cookie/retargeting';

    const CANCEL_BUTTON_ID = 'retargetingOptOutLayerBtnCancel';
    const TOGGLE_BUTTON_ID = 'retargetingOptOutLayerBtnToggle';

    const DEACTIVATE_RETARGETING_TEXT = 'Retargeting deaktivieren';
    const ACTIVATE_RETARGETING_TEXT = 'Retargeting aktivieren';

    function init () {
        const toggleButton = document.getElementById(TOGGLE_BUTTON_ID);

        if (!toggleButton) {
            return;
        }

        const cookie = o_util.cookie.get(COOKIE_NAME);

        if (cookie) {
            toggleButton.innerHTML = ACTIVATE_RETARGETING_TEXT.concat(` ${toggleButton.innerHTML}`);
        } else {
            toggleButton.innerHTML = DEACTIVATE_RETARGETING_TEXT.concat(` ${toggleButton.innerHTML}`);
        }

        _addClickHandlers(cookie);
    }

    function _activate () {
        let href = 'unknown';
        if (window.location && window.location.href) {
            href = window.location.href;
        } else if (document.location && document.location.href) {
            href = document.location.href;
        }
        const url = SHOPPAGES_ENDPOINT.concat('?page=').concat(encodeURIComponent(href));
        o_util.ajax({
            url,
            method: 'GET'
        }).then(() => {
            o_shoppages.o_tracking.sendEventToTrackingServer({ot_RetargetingOptOut: 'reset'});
            _closeLayer();
        });
    }

    function _deactivate () {
        let href = 'unknown';
        if (window.location && window.location.href) {
            href = window.location.href;
        } else if (document.location && document.location.href) {
            href = document.location.href;
        }
        const url = SHOPPAGES_ENDPOINT.concat('?page=').concat(encodeURIComponent(href));
        o_util.ajax({
            url,
            method: 'GET'
        }).then(() => {
            /* eslint-disable-next-line no-undef */
            o_util.core.extend(lhotse.exactag.data, {
                pt: 'retargetingoptout'
            });
            /* eslint-disable-next-line no-undef */
            lhotse.exactag.track();
            o_shoppages.o_tracking.sendEventToTrackingServer({ot_RetargetingOptOut: 'set'});
            _closeLayer();
        });
    }

    function _addClickHandlers (cookie) {
        if (window.shoppagesRetargetingLayerInitialized) {
            return;
        }

        o_util.event.delegate(document, 'click', `#${CANCEL_BUTTON_ID}`, () => {
            _closeLayer();
        });

        o_util.event.delegate(document, 'click', `#${TOGGLE_BUTTON_ID}`, () => {
            if (cookie) {
                _activate();
            } else {
                _deactivate();
            }
            _closeLayer();
        });
    }

    function _closeLayer () {
        if (o_global.pali.layer.getActiveLayer()) {
            o_global.pali.layer.getActiveLayer().close();
        }
    }

    return {
        init
    };
})();

o_global.eventLoader.onAllScriptsExecuted(100, () => {
    if (o_global.pali &&
        o_global.pali.layer &&
        o_global.pali.layer.getActiveLayer &&
        o_global.pali.layer.getActiveLayer()) {
        o_shoppages.retargetingOptOutLayer.init();
        window.shoppagesRetargetingLayerInitialized = true;
    }
});
