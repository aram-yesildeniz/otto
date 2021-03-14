(function () {
    'use strict';

    /**
     * Handle global "debug mode" by setting a cookie.
     *
     */
    class Debug {
        static writeCookie() {
            window.o_util.cookie.set(Debug.cookieName, "true");
        }
        static isCookieSet() {
            return window.o_util.cookie.exists(Debug.cookieName);
        }
        /**
         * Check if debug cookie was set.
         * Returns updated statusObject
         *
         * @return Object holding status information of debug mode.
         */
        static status() {
            if (Debug.isCookieSet()) {
                Debug.statusObject.activated = true;
                Debug.statusObject.text = "activated";
            }
            else {
                Debug.statusObject.activated = false;
                Debug.statusObject.text = "deactivated";
            }
            return Debug.statusObject;
        }
        /**
         * Activate "debug mode" by setting the debug cookie.
         *
         * @return {String} Status string.
         */
        static activate() {
            if (!Debug.status().activated) {
                Debug.writeCookie();
            }
            return Debug.status().text;
        }
        /**
         * Deactivate "debug mode" by deleting the debug cookie.
         *
         * @return {String} Status string.
         */
        static deactivate() {
            if (Debug.status().activated) {
                window.o_util.cookie.remove(Debug.cookieName);
            }
            return Debug.status().text;
        }
        static warn(message) {
            if (Debug.status().activated) {
                // eslint-disable-next-line no-console
                console.warn(message);
            }
        }
    }
    Debug.cookieName = "debug";
    Debug.statusObject = {
        activated: undefined,
        text: undefined,
    };

    // Export Debug functionality to global namespace.
    window.o_global = window.o_global || {};
    window.o_global.debug = window.o_global.debug || Debug;

}());
