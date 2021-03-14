window.o_global = o_global || {};

o_global.rwdTools = o_global.rwdTools || {};
o_global.device = o_global.device || {};
o_global.device.screen = o_global.device.screen || {};

/**
 * RWD-Tools for dealing with responsive issues
 */
o_global.rwdTools = (function() {
    "use strict";

    /**
     * Public method to set the devSpecs-Cookie with the Device-Dimensions.
     * 
     * @see: https://github.com/otto-ec/shozu_vcl/blob/master/templates/varnish/features/breakpoint.vcl.j2
     */
    function setDevSpecsCookie() {
        var bp = "";

        if (o_global.device && o_global.device.breakpoint && typeof o_global.device.breakpoint.getCurrentBreakpoint === "function") {
            bp = "bp=" + o_global.device.breakpoint.getCurrentBreakpoint();
        }

        var cookieValue = "w=" + document.documentElement.clientWidth + "&h=" + document.documentElement.clientHeight + "&" + bp,
            expireDate = new Date();

        expireDate.setTime(expireDate.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
        document.cookie = "devSpecs=" + cookieValue + ";path=/;domain=.otto.de;expires=" + expireDate.toGMTString();
    }

    /**
     * Register a listener for breakpoint change.
     */
    function handleBreakpointChange() {
        try {
            o_global.device.breakpoint.registerChangeListener(function() {
                setDevSpecsCookie();
            });
        } catch (e) {
        }
    }

    setDevSpecsCookie();
    handleBreakpointChange();

    return {
        "setDevSpecsCookie": setDevSpecsCookie,
        "handleBreakpointChange": handleBreakpointChange
    };
}());
