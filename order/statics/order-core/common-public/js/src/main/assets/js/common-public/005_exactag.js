var lhotse = window.lhotse || {};
// exactag may not defined in all environments.
lhotse.exactag = lhotse.exactag || {};

var o_order = window.o_order || {};
o_order.performancemarketing = o_order.performancemarketing || {};

o_order.performancemarketing.sendData = o_order.performancemarketing.sendData || (function () {
    'use strict';
    var module = {}, emptyString = "";

    function toString(input) {
        return emptyString + input;
    }

    function logSafe() {
        if ((console || {}).log) {
            console.log(arguments);
        }
    }

    function track() {
        (lhotse.exactag.track || function () {
            logSafe('Failed to track data! Performance marketing tracking not defined!');
        })(arguments);
    }

    module.forBasket = {};
    module.forBasket.sendData = function (contentSelector) {
        var content = document.querySelector(contentSelector);
        var performanceMarketingData = content ? content.querySelector('.order_js_performanceMarketingItemAdded') : undefined;

        if (performanceMarketingData) {
            try {
                lhotse.exactag.data.pt = performanceMarketingData.getAttribute('data-pt');
                lhotse.exactag.data.ab = [
                    {
                        vi: toString(performanceMarketingData.getAttribute('data-vi')),
                        pi: toString(performanceMarketingData.getAttribute('data-pi')),
                        ac: toString(performanceMarketingData.getAttribute('data-ac')),
                        gp: toString(performanceMarketingData.getAttribute('data-gp'))
                    }
                ];
                track();
            } catch (e) {
                logSafe(e);
            }
        }
    };

    return module;
}());

