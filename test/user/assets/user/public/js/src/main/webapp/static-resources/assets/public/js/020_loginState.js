// For JSLINT
/*global window, document, o_global */
/*jslint es5: true */

var o_user = o_user || {};

o_user.loginState = o_user.loginState || {};

o_user.loginState.presenterBuilder = function (document) {
    'use strict';

    function loginState() {
        var container = document.querySelector(".us_js_loginAreaIconSubtitle"),
            state;
        if (!!container) {
            state = container.getAttribute("data-login-state");
        } else {
            state = "UNKNOWN";
        }
        return state;
    }

    function isLoggedIn() {
        var state = loginState();
        return state === "LOGGED_IN" || state === "LOGGED_IN_GUEST";
    }

    return {
        loginState: loginState,
        isLoggedIn: isLoggedIn
    };
};