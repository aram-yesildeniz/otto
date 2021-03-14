/*jslint white: true */
/*global document, o_global
 */
var san = window.san || {};
var o_san = window.o_san || {};

o_san.trackingLink = o_san.trackingLink || (function () {
    'use strict';

    const TRACKING_DATA_ATTRIBUTE = "data-tracking";

    const _onLinkClicked = function(event) {
        let oldPathPlusQuery = window.location.pathname + window.location.search,
            newLocation = this.getAttribute('href');

        if (newLocation.slice(0, newLocation.indexOf("#")) === oldPathPlusQuery) {
            // prevent default for self links
            window.location.hash = '';
            event.preventDefault();
            return false;
        }
    };

    const removeHashIfUrlIsUnchanged = function (link) {
            link.removeEventListener('click', _onLinkClicked);
            link.addEventListener('click', _onLinkClicked);
        },

        init = function init() {
            o_util.event.delegate(document, "mousedown", "a", function() {
                const href = this.getAttribute("href");
                const trackingData = this.getAttribute(TRACKING_DATA_ATTRIBUTE);

                if (trackingData) {
                    removeHashIfUrlIsUnchanged(this);
                    this.setAttribute("href", o_util.fragment.push({
                        t: trackingData
                    }, href));
                    this.removeAttribute(TRACKING_DATA_ATTRIBUTE);
                }
            });
        };

    o_global.eventLoader.onReady(10, function () {
        // Deduplication
        if (window.sanTrackingLinkInitialized) {
            return;
        }
        window.sanTrackingLinkInitialized = true;

        init();
    });
}());
