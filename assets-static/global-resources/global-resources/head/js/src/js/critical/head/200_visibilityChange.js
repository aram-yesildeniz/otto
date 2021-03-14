window.o_global = window.o_global || {};

/**
 * Anonymous function to detect whether the page was visually hidden during
 * pageload process and create a public variable to save that information.
 *
 * @param {Object} w    Global window object.
 * @param {Object} d    Global document object.
 */
o_global.visibilityChange = (function(w, d) {
    "use strict";

    var visibilityData = {
            "wasHidden": false,
            "pageVisibility": false,
            "visibilityChanges": 0,
            "hiddenTime": 0,
            "visibleLoadTime": 0,
            "customerWaitTime": 0
        },
    // Helper timer
        hiddenTimer,
        visibleTimer,
        customerWaitTimer;

    /**
     * Get the visiblity data.
     *
     * @return {Object}     The visibility data.
     */
    function getVisibilityData() {
        return visibilityData;
    }

    /**
     * Called onLoad. update all timers, calculate the pageVisibilty and save the object
     */
    function finishVisibilityDataCollection() {
        var visibilityProp,
            eventName;

        // Get browser prefixed name of the visibility property.
        visibilityProp = _getHiddenProp();

        // If visibility property is available add an event listener to the document.
        if (!!visibilityProp) {
            eventName = visibilityProp.replace(/[H|h]idden/, "") + "visibilitychange";
            d.removeEventListener(eventName, visibilityChange, false);
        }

        // Stop timers
        _updateHiddenTime();
        _updateVisibleLoadTime();
        _updateCustomerWaitTime();

        // Check if page is beeing prerendered
        if (!!document.visibilityState && document.visibilityState === "prerender") {
            visibilityData.pageVisibility = "prerender";
        } else {
            if (!visibilityData.wasHidden) {
                visibilityData.pageVisibility = "always_visible";
            } else {
                if (visibilityData.hiddenTime > visibilityData.visibleLoadTime) {
                    visibilityData.pageVisibility = "hidden";
                } else {
                    visibilityData.pageVisibility = "intermittent_visible";
                }
            }
        }
    }

    /**
     * Start visible timer
     *
     * @private
     */
    function _startVisibleTimer() {
        visibleTimer = new Date().getTime();
    }

    /**
     * Update visible timer and stop current
     *
     * @private
     */
    function _updateVisibleLoadTime() {
        if (!!visibleTimer) {
            visibilityData.visibleLoadTime += (new Date().getTime()) - visibleTimer;
            visibleTimer = false;
        }
    }

    /**
     * Start hidden timer
     *
     * @private
     */
    function _startHiddenTimer() {
        hiddenTimer = new Date().getTime();
    }

    /**
     * Update hidden timer and stop current
     *
     * @private
     */
    function _updateHiddenTime() {
        if (!!hiddenTimer) {
            visibilityData.hiddenTime += (new Date().getTime()) - hiddenTimer;
            hiddenTimer = false;
        }
    }

    /**
     * Start customer wait timer
     *
     * @private
     */
    function _startCustomerWaitTimer() {
        customerWaitTimer = new Date().getTime();
    }

    /**
     * Update customer wait timer and stop current
     *
     * @private
     */
    function _updateCustomerWaitTime() {
        if (!!customerWaitTimer) {
            visibilityData.customerWaitTime += (new Date().getTime()) - customerWaitTimer;
            customerWaitTimer = false;
        }
    }

    /**
     * Returns the browser supported (and maybe prefixed) version of the hidden-property. Null if not supported at all.
     *
     * @private
     */
    function _getHiddenProp() {
        var p = [
                "webkit",
                "moz",
                "ms",
                "o"
            ],
            i;

        // If "hidden" is natively supported just return it...
        if ("hidden" in d) {
            return "hidden";
        }

        // ... otherwise loop over all the known prefixes until we find one.
        for (i = 0; i < p.length; i++) {
            if ((p[i] + "Hidden") in d) {
                return p[i] + "Hidden";
            }
        }

        // Otherwise it's not supported!
        return null;
    }

    /**
     * If "hidden"-property is supported return whatever value the property may have otherwise return false.
     *
     * @private
     */
    function _isHidden() {
        var prop = _getHiddenProp();

        return (!!prop) ? d[prop] : false;
    }

    /**
     * Visibility change callback
     */
    function visibilityChange() {
        if (_isHidden()) {
            visibilityData.wasHidden = true;
            _updateVisibleLoadTime();
            _startHiddenTimer();
        } else {
            _updateHiddenTime();
            _startVisibleTimer();
        }

        // Update and stop the customer wait time
        _updateCustomerWaitTime();

        // Increment visibility changes
        visibilityData.visibilityChanges++;

        // The visibilityState could be prerender on visibility change event
        if (!!document.visibilityState && document.visibilityState === "prerender") {
            visibilityData.pageVisibility = "prerender";
        }
    }

    /**
     * Get available visibility property name,
     * add Event Listener on visibilityChange.
     *
     * @private
     */
    function _addVisibilityChangeListener() {
        var visibilityProp,
            eventName;

        // Get browser prefixed name of the visibility property.
        visibilityProp = _getHiddenProp();

        // If visibility property is available add an event listener to the document.
        if (!!visibilityProp) {
            eventName = visibilityProp.replace(/[H|h]idden/, "") + "visibilitychange";
            d.addEventListener(eventName, visibilityChange, false);
        }
    }

    /**
     * Set initial values
     *
     * @private
     */
    function _init() {
        // The visibilityState could be prerender on visibility change event
        if (!!document.visibilityState && document.visibilityState === "prerender") {
            visibilityData.pageVisibility = "prerender";
        } else {
            // Start timers and set initial pageVisibility
            if (_isHidden()) {
                _startHiddenTimer();
                visibilityData.wasHidden = true;
                visibilityData.pageVisibility = "hidden";
            } else {
                _startVisibleTimer();
                visibilityData.pageVisibility = "always_visible";
            }
        }

        // Save initial data
        _startCustomerWaitTimer();
    }

    /**
     * Register global events.
     *
     * @private
     */
    function _registerEvents() {
        // Add listener
        _addVisibilityChangeListener();

        // Collect data onLoad
        o_global.eventLoader.onLoad(0, finishVisibilityDataCollection);
    }

    // Go
    _registerEvents();
    _init();

    return {
        "visibilityChange": visibilityChange,
        "finishVisibilityDataCollection": finishVisibilityDataCollection,
        "getVisibilityData": getVisibilityData
    };
})(window, document);
