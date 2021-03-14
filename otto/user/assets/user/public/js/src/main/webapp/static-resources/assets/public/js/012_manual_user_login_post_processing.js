// For JSLINT
/*global document, window, o_apps
 */

var o_user = o_user || {};
var o_apps = o_apps || {};


o_user.manualUserLoginPostProcessingBuilder = function (documentObject, windowObject) {
    'use strict';

    function deleteAdjustCookie() {
        documentObject.cookie = 'user_adjust=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function prepareCurrentPath() {
        var validHomepagePaths = ['', '/'];
        var isHomepage = validHomepagePaths.indexOf(windowObject.location.pathname) >= 0;
        return isHomepage ? "Homepage" : windowObject.location.href;
    }

    function sendAdjustEvent(sitePath) {
        if (o_apps.trackAdjust) {
            o_apps.trackAdjust({
                "eventName": {
                    "android": "lxmy84",
                    "ios": "llgojh"
                },
                "partnerParameters": {
                    "sitePath": sitePath
                }
            });
        }
    }

    function processManualUserLogin() {
        var currentPath = prepareCurrentPath();
        sendAdjustEvent(currentPath);
        deleteAdjustCookie();
    }

    return {
        processManualUserLogin: processManualUserLogin
    };
};
