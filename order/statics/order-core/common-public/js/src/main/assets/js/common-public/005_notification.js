var o_order = window.o_order || {},
    o_wo = window.o_wo || {};

o_order.notification = o_order.notification || {};

o_order.notification.p13nNotifier = (function () {
    'use strict';

    function logSafe() {
        if ((console || {}).log) {
            console.log(arguments);
        }
    }

    function enterCheckoutProcess() {
        if (o_wo &&
                o_wo.api &&
                o_wo.api.enterShoppingProcess) {
            o_wo.api.enterShoppingProcess(arguments);
        } else {
            logSafe(arguments);
        }
    }

    function leaveCheckoutProcess() {
        if (o_wo &&
                o_wo.api &&
                o_wo.api.leaveShoppingProcess) {
            o_wo.api.leaveShoppingProcess(arguments);
        } else {
            logSafe(arguments);
        }
    }

    return {
        enterCheckoutProcess: enterCheckoutProcess,
        leaveCheckoutProcess: leaveCheckoutProcess
    };
}());
