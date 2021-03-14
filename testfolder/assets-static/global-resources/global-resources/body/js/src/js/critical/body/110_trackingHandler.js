/* global o_utill */
window.AS = window.AS || {};
window.o_global = window.o_global || {};

AS.trackingHandler = AS.trackingHandler || {};

/**
 * Module to handle the trackingrequest for breakpointchange and orientationchange
 * Both changelistener checks if the other parameter has changed to.
 * If yes the trackingrequest will just be send once.
 *
 */
AS.trackingHandler = (function(w) {
    "use strict";

    var breakpoint = o_global.device.breakpoint,
        _currentBreakpoint = breakpoint.getCurrentBreakpoint(),
        orientation = o_global.device.orientation,
        _currentOrientation = orientation.getCurrentOrientation(),
        breakpointTimer,
        orientationTimer;

    orientation.registerChangeListener(function() {
        handleTrackingEvent(true, false);
    });

    //Breakpoint always triggers after orientationChangeListener.
    // => It is possible to compare _currentOrientation with orientation.getCurrentOrientation
    breakpoint.registerChangeListener(function() {
        handleTrackingEvent(false, true);
    });

    /**
     * HandleTrackingEvent()
     * Handles the tracking event and prevents sending the request twice.
     *
     * @param {Boolean} orientationChanged      Whether the orientation was changed.
     * @param {Boolean} breakpointChanged       Whether the breakpoint was changed.
     */
    function handleTrackingEvent(orientationChanged, breakpointChanged) {
        // Orientationchange is known when breakpointchange detected because breakpoint always fires after orientationchange.
        // But possible breakpoint change is unkown when orientationchange is fired,
        // so the script waits 500ms for being called bei breakpointchange.
        if (orientationChanged && !breakpointChanged) {
            // SetTimeout is required because the orientationChange has to wait for the breakpointChange.
            orientationTimer = setTimeout(function() {
                if (_currentBreakpoint === breakpoint.getCurrentBreakpoint()) {
                    sendTracking(true, false);
                    _currentOrientation = orientation.getCurrentOrientation();
                } else {
                    clearTimeout(breakpointTimer);
                    breakpointTimer = undefined;
                    sendTracking(true, true);
                    updateLocalVars();
                }
            }, 500);
        } else {
            // SetTimeout is required because the orientationChange has to wait for the breakpointChange.
            breakpointTimer = setTimeout(function() {
                // This has to be done, because of a bug in IE8 - http://stackoverflow.com/a/7183469.
                if (!breakpointTimer) {
                    return;
                }

                if (_currentOrientation === orientation.getCurrentOrientation()) {
                    //Orientation not Changed, breakpoint changed
                    sendTracking(false, true);
                    _currentBreakpoint = breakpoint.getCurrentBreakpoint();
                } else {
                    clearTimeout(orientationTimer);
                    orientationTimer = undefined;
                    sendTracking(true, true);
                    updateLocalVars();
                }
            }, 500);
        }
    }

    /**
     * Updates/retrieves the currently stored orientation and breakpoint
     */
    function updateLocalVars() {
        _currentOrientation = orientation.getCurrentOrientation();
        _currentBreakpoint = breakpoint.getCurrentBreakpoint();
    }

    /**
     * Sends orientation and breakpoint change events to tracking server
     * by defining if one of them or both has changed.
     *
     * @param {Boolean} orientationChanged Value if orientation has changed
     * @param {Boolean} breakpointChanged Value if breakpoint has changed
     */
    function sendTracking(orientationChanged, breakpointChanged) {
        var sendData = {
            "ot_BreakpointChange": breakpointChanged.toString(),
            "ot_OrientationChange": orientationChanged.toString()
        };

        if (o_util.misc.isPreview(w.location.href)) {
            return;
        }

        if (AS.testing.status().activated) {
            console.info("[AS.trackinghandler]:" + JSON.stringify(sendData) + " BP: '" + breakpoint.getCurrentBreakpoint() + "', Orientation: '" + orientation.getCurrentOrientation() + "'");
        }

        o_tracking.bct.sendEventToTrackingServer(sendData);
    }

    /* test-code */
    /**
     * Returns the current orientation.
     *
     * @return {String} The current orientation
     */
    function getCurrentOrientation() {
        return _currentOrientation;
    }

    /**
     * Assigns the current orientation
     *
     * @param {String} cO The orientation which should be set
     */
    function setCurrentOrientation(cO) {
        _currentOrientation = cO;
    }

    /**
     * Returns the current breakpoint.
     *
     * @return {String} The current breakpoint
     */
    function getCurrentBreakpoint() {
        return _currentBreakpoint;
    }

    /**
     * Assigns the current breakpoint
     *
     * @param {String} cB The breakpoint which should be set
     */
    function setCurrentBreakpoint(cB) {
        _currentBreakpoint = cB;
    }
    /* end-test-code */

    return {
        /* test-code */
        "handleTrackingEvent": handleTrackingEvent,
        "sendTracking": sendTracking,
        "updateLocalVars": updateLocalVars,
        "getCurrentBreakpoint": getCurrentBreakpoint,
        "getCurrentOrientation": getCurrentOrientation,
        "setCurrentBreakpoint": setCurrentBreakpoint,
        "setCurrentOrientation": setCurrentOrientation,
        "breakpoint": breakpoint,
        "orientation": orientation
        /* end-test-code */
    };
}(window));
