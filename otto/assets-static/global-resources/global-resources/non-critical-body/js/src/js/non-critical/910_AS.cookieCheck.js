window.o_global = window.o_global || {};
window.AS = window.AS || {};
window.o_util = window.o_util || {};

/**
 * Handles global cookie-check.
 * In case a cookie-value is larger than 1024 characters / digits, it will be deleted and tracked.
 *
 */
AS.cookieCheck = (function() {
    "use strict";

    /**
     * CookieCheck main function.
     * Function will be execute on window.onload, to find out all Cookies with values
     * greater than 1024 characters to delete them in order of failures in the varnish.
     */
    function run() {
        var cookieDomain,
            cookieName,
            cookieArr = document.cookie.split(/;\s*/),
            hostnameArr = window.location.hostname.split("."),
            hostnameCount = hostnameArr.length,
            cookieData;

        // Find out Top-Level and Second-Level-Domain, e.g. ".otto.de".
        // For Tests (e.g. localhost) the domain must be ignored.
        if (hostnameCount > 2) {
            cookieDomain = "." + hostnameArr.slice(hostnameCount - 2, hostnameCount).join(".");
        }

        for (var i = 0; i < cookieArr.length; i += 1) {
            cookieData = cookieArr[i].split(/=\s*/);

            if (cookieData.length > 1 && cookieData[1].length > 1024) {
                cookieName = cookieData[0];

                /* TEST-CODE */
                if (!!cookieDomain && cookieDomain.split(".")[cookieDomain.split(".").length - 1].length < 2) {
                    cookieDomain = "";
                }
                /* END TEST-CODE */

                if (!!cookieDomain) {
                    o_util.cookie.remove(cookieName, {
                        "domain": cookieDomain
                    });
                } else {
                    o_util.cookie.remove(cookieName);
                }

                AS.cookieCheck.track(cookieName, !o_util.cookie.exists(cookieName));
            }
        }
    }

    /**
     * Sends a custom tracking request to RUM
     *
     * @param {String} cookieName       Name of Cookie
     * @param {Boolean} isDeleted       Status, if Cookie is deleted
     */
    function track(cookieName, isDeleted) {
        AS.RUM.sendCustomRequest("asset", {
            "cookieName": cookieName,
            "isDeleted": isDeleted,
            "breakpoint": o_global.device.breakpoint.getCurrentBreakpoint(),
            "parentUrl": window.location.href
        });
    }

    return {
        "track": track,
        "run": run
    };
})();

o_global.eventLoader.onLoad(1000, AS.cookieCheck.run);
