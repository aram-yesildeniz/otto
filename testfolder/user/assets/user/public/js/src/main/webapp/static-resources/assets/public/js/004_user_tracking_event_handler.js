// For JSLINT
/*global window, document, o_tracking, o_global, o_util
 */
/*jslint es5: true */

var o_user = o_user || {};

o_user.trackingBuilder = function (document, o_trackingBct, ajaxUtil, eventUtil) {
    "use strict";

    function ajaxGetAndSetTrackingParams(url, successCallback, failCallback) {
        var mergeParameters = "",
            paramSeparator = "";

        try {
            mergeParameters = o_trackingBct().getMergeParameters();
            paramSeparator = (url.indexOf("?") > -1) ? "&" : "?";
        } catch (e) {
            // ignore
        }

        ajaxUtil.get(url + paramSeparator + mergeParameters)
            .then(function (xhr) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    successCallback(xhr.responseText);
                } else {
                    failCallback();
                }
            })
            .catch(function () {
                // ignore
            });
    }

    function sendTrackingInformation(trackingContainer, trackingType) {
        if (trackingType === "merge") {
            try {
                o_trackingBct().sendMergeToTrackingServer(trackingContainer);
            } catch (e) {
                // ignore
            }
        } else {
            try {
                o_trackingBct().sendEventToTrackingServer(trackingContainer);
            } catch (e) {
                // ignore
            }
        }
    }

    function registerTrackingEventHandler() {
        document.addEventListener("user.sendToTrackingServer", function (event) {
            sendTrackingInformation(event.detail);
        });

        document.addEventListener("user.sendToTrackingServer_merge", function (event) {
            sendTrackingInformation(event.detail, "merge");
        });

        document.addEventListener("user.event.sendToTrackingServer", function (event) {
            sendTrackingInformation(event.detail, "event");
        });
    }

    function init() {
        eventUtil.delegate(document, "click", ".user_js_trackOnClick", function () {
            var element = this,
                trackingLabel = element.getAttribute("data-trackinglabel"),
                trackingValue = element.getAttribute("data-trackingvalue"),
                trackingType = element.getAttribute("data-trackingtype"),
                trackingData = {};

            if (!!trackingLabel) {
                if (!!trackingValue) {
                    trackingData[trackingLabel] = trackingValue;
                } else if (element.tagName.toLowerCase() === "input" && element.type === "checkbox") {
                    trackingData[trackingLabel] = element.checked;
                } else {
                    trackingData[trackingLabel] = "ok";
                }
                sendTrackingInformation(trackingData, trackingType);
            }
        });

        eventUtil.delegate(document, "click", ".us_js_trackOnNextPageImpression", function () {
            var element = this,
                trackingLabel = element.getAttribute("data-trackinglabel"),
                trackingValue = element.getAttribute("data-trackingvalue"),
                trackingData = {};

            if (!!trackingLabel && !!trackingValue) {
                trackingData[trackingLabel] = trackingValue;
            }

            try {
                o_trackingBct().trackOnNextPageImpression(trackingData);
            } catch (e) {
                // ignore
            }
        });

        registerTrackingEventHandler();
    }

    return {
        ajaxGetAndSetTrackingParams: ajaxGetAndSetTrackingParams,
        sendTrackingInformation: sendTrackingInformation,
        registerTrackingEventHandler: registerTrackingEventHandler,
        init: init
    };
};
