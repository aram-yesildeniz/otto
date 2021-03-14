/*jslint white: true */
/*global $OTTO, console, o_global
 */
var san = window.san || {};
var o_san = window.o_san || {};

o_san.tracking = o_san.tracking || (function () {
    'use strict';

    var SELECTOR = ".js_tracking",
        bct,

        isTrackingLogActive = function () {
            return !!document.querySelector(".san-nonlive");
        },

        saveTrackingAction = function (dataContainer) {
            var storage, jsonInLS, asJson, key;
            if (isTrackingLogActive()) {
                storage = new o_global.Storage(function () {
                    return window.localStorage;
                });
                if (storage.isAvailable) {
                    jsonInLS = storage.getItem("san-tv");
                    if (jsonInLS) {
                        asJson = JSON.parse(jsonInLS);
                        for (key in dataContainer) {
                            if (dataContainer.hasOwnProperty(key)) {
                                asJson[key] = dataContainer[key];
                            }
                        }
                        storage.setItem("san-tv",
                            JSON.stringify(asJson));
                    } else {
                        storage.setItem("san-tv",
                            JSON.stringify(dataContainer));
                    }
                }
            }
        },

        /**
         *
         * @param {JSON} dataContainer encompassing tracking data
         * @param {function} fn applied with dataContainer
         * @param {string} type the type for debug messages
         */
        submitToTracking = function (dataContainer, fn, type) {
            var debug = o_global.debug.status().activated;
            try {
                fn(dataContainer);
                if (debug && isTrackingLogActive()) {
                    console.log(type + " submitting " + JSON.stringify(dataContainer));
                }
                saveTrackingAction(dataContainer);
            } catch (e) {
                if (debug) {
                    console.log(e);
                }
            }
        },

        /**
         *
         * @param {JSON} trackingData
         */
        sendTrackingDataForNextPI = function (trackingData) {
            if (bct && typeof bct.trackOnNextPageImpression === 'function') {
                submitToTracking(trackingData, bct.trackOnNextPageImpression, "Track on next PI");
            }
        },

        /**
         *
         * @param {JSON} trackingData
         */
        submitTrackingMoveEvent = function (trackingData) {
            if (bct && typeof bct.submitMove === 'function') {
                submitToTracking(trackingData, bct.submitMove, "Track as move event");
            }
        },

        /**
         *
         * @param {JSON} trackingData
         */
        mergeTrackingDataOnCurrentPI = function (trackingData) {
            if (bct && typeof bct.sendMergeToTrackingServer === 'function') {
                submitToTracking(trackingData, bct.sendMergeToTrackingServer, "Track merge on current PI");
            }
        },
        /**
         *
         * @param {JSON} dataContainer
         */
        sendEventToTracking = function (dataContainer) {
            if (bct && typeof bct.sendEventToTrackingServer === 'function') {
                submitToTracking(dataContainer, bct.sendEventToTrackingServer, "Track event");
            }
        },

        /**
         *
         * @param {CustomEvent} event
         */
        sendEventToTrackingListener = function (event) {
            var trackingData = event.detail && event.detail.trackingKey && JSON.parse(event.detail.trackingKey);
            if (trackingData) {
                sendEventToTracking(trackingData);
            }
        },

        /**
         *
         * @param {JSON} dataContainer
         * @returns {*}
         */
        createMergeContextAndSendTrackingEvent = function (dataContainer) {
            var eventMergeId;
            if (bct && typeof bct.createEventMergeContext === 'function') {
                eventMergeId = bct.createEventMergeContext();
                eventMergeId.sendEventToTrackingServer(dataContainer);
                return eventMergeId;
            } else {
                return {
                    eventMergeId: undefined
                };
            }
        },

        getTrackingDataFromParent = function (element, dataKey) {
            var dataContainer;
            if (dataKey !== '') {
                dataContainer = o_san.util.dom.findMatch(element, function (e) {
                    return !!e.getAttribute(dataKey);
                }, document.querySelector('.gridAndInfoContainer'));
            }

            return (!!dataContainer ? dataContainer.getAttribute(dataKey) : '');
        },

        readTrackingFromStorage = function () {
            var trackingKey,
                storage = new o_global.Storage(function () {
                    return window.sessionStorage;
                });

            if (storage.isAvailable) {
                trackingKey = storage.getItem("san_searchTracking");
                if (!!trackingKey) {
                    storage.removeItem("san_searchTracking");
                    sendEventToTracking(JSON.parse(trackingKey));
                }
            }
        },

        createTrackingContext = function (id, url) {
            if (bct && typeof bct.createContext === 'function') {
                bct.createContext(id, url);
            }
        },

        closeTrackingContext = function () {
            if (bct && typeof bct.closeContext === 'function') {
                bct.closeContext();
            }
        },

        init = function (otracking) {
            var trackingDiv = document.querySelector(SELECTOR);

            // store API reference
            bct = otracking.bct;

            if (!!trackingDiv) {
                window.addEventListener("san.event.tracking", sendEventToTrackingListener);
            }
            readTrackingFromStorage();

            o_san.tracking.isInitialized = true;
        };


    return {
        init: init,
        sendEventToTracking: sendEventToTracking,
        sendTrackingDataForNextPI: sendTrackingDataForNextPI,
        saveTrackingAction: saveTrackingAction,
        getTrackingDataFromParent: getTrackingDataFromParent,
        mergeTrackingDataOnCurrentPI: mergeTrackingDataOnCurrentPI,
        createTrackingContext: createTrackingContext,
        closeTrackingContext: closeTrackingContext,
        createMergeContextAndSendTrackingEvent: createMergeContextAndSendTrackingEvent,
        submitTrackingMoveEvent: submitTrackingMoveEvent
    };
}());

// Keeping this "alias" as it might be used by other teams.
// Used to be defined in the same line as the module definition.
san.tracking = o_san.tracking;

o_global.eventLoader.onReady(1, function () {
    'use strict';

    // Deduplication
    if (window.sanSanTrackingInitialized) {
        return;
    }
    window.sanSanTrackingInitialized = true;

    if (window.o_tracking) {
        o_san.tracking.init(window.o_tracking);
    } else {
        o_global.eventLoader.onLoad(1, function () {
            o_san.tracking.init(window.o_tracking);
        });
    }
});

