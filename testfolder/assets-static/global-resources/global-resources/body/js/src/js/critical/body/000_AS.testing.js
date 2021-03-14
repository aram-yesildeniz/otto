window.AS = window.AS || {};

/**
 * Handle global "testing mode" by setting a cookie.
 *
 * @return {Object} Public API of AS.testing
 */
AS.testing = (function() {
    "use strict";

    var statusObject = {};

    /**
     * Check if debug cookie was set.
     * Returns updated statusObject
     *
     * @return {Object} Object holding status information of debug mode.
     */
    function status() {
        if (document.cookie.match(/AS_testing=true/i)) {
            statusObject = {
                "activated": true,
                "text": "activated"
            };
        } else {
            statusObject = {
                "activated": false,
                "text": "deactivated"
            };
        }

        return statusObject;
    }

    /**
     * Activate "debug mode" by setting a cookie.
     *
     * @return {String} Status string.
     */
    function activate() {
        if (!status().activated) {
            document.cookie = "AS_testing=true";
        }

        return status().text;
    }

    /**
     * Deactivate "debug mode" by deleting the debug cookie.
     *
     * @return {String} Status string.
     */
    function deactivate() {
        if (status().activated) {
            document.cookie = "AS_testing=; expires=" + new Date().toGMTString();
        }

        return status().text;
    }

    /**
     * Public methods.
     */
    return {
        "activate": activate,
        "deactivate": deactivate,
        "status": status
    };
}());
