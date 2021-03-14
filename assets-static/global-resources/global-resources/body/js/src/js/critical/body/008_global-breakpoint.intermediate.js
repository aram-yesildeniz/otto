(function () {
    'use strict';

    /* eslint 'no-plusplus': [2, { allowForLoopAfterthoughts: true }], 'compat/compat':off */
    /* we have an ie9 polyfill in global resources for window.matchMedia */
    /**
     * Provides functions to identify, query and listen to the Media Breakpoints
     * by using defaults
     *
     * @example use default instance owith Otto defaults
     *
     * ```ts
     *
     * import { breakpoint } from @otto-ec/breakpoint";
     *
     * console.log(breakpoint.isSmall())
     *
     * ```
     *
     * @example build your own instance of the breakpoint class
     *
     * ```ts
     *
     * const breakpoint = new Breakpoint({
     *   small: window.matchMedia("(min-width: 0em) and (max-width: 27.99em)"),
     *   medium: window.matchMedia("(min-width: 28em) and (max-width: 47.99em)"),
     *   large: window.matchMedia("(min-width: 48em) and (max-width: 61.99em)"),
     *   extraLarge: window.matchMedia("(min-width: 62em)"),
     * });
     * ```
     */
    class Breakpoint {
        /**
         * Creates an instance of breakpoint class.
         * @param breakpoints pass breakpoint definitions here
         */
        constructor(breakpoints) {
            this.breakpoints = breakpoints;
        }
        /**
         * Returns the breakpoint-list the class has been initialized with.
         *
         * @return A breakpoint list object
         */
        getBreakpoints() {
            return this.breakpoints;
        }
        /**
         * Is the current screen small as defined by the breakpoints?
         *
         * @return true if the breakpoint is "small"
         */
        isSmall() {
            return this.breakpoints.small.matches;
        }
        /**
         * Is the current screen medium as defined by the breakpoints?
         *
         * @return true if the breakpoint is "medium"
         */
        isMedium() {
            return this.breakpoints.medium.matches;
        }
        /**
         * Is the current screen large as defined by the breakpoints?
         *
         * @return true if the breakpoint is "large"
         */
        isLarge() {
            return this.breakpoints.large.matches;
        }
        /**
         * Is the current screen extra large as defined by the breakpoints?
         *
         * @return true if the breakpoint is "extra large"
         */
        isExtraLarge() {
            return this.breakpoints.extraLarge.matches;
        }
        /**
         * Returns the name of the active screen size as String: s, m, l or xl.
         *
         * @return Name of the active screen size [s, m, l, xl] or "unknown"
         */
        getCurrentBreakpoint() {
            let result = "unknown";
            if (this.isSmall()) {
                result = "s";
            }
            else if (this.isMedium()) {
                result = "m";
            }
            else if (this.isLarge()) {
                result = "l";
            }
            else if (this.isExtraLarge()) {
                result = "xl";
            }
            return result;
        }
        /**
         * Determines whether one or more of the given breakpoints is currently active
         * @param breakpointList list of vali breakpoint names
         *
         * @returns true if one or more breakpoints are active
         */
        isBreakpointActive(breakpointList) {
            const currentBreakpoint = this.getCurrentBreakpoint();
            // TODO: move to Array.prototype.includes() when polyfilled
            for (let i = 0; i < breakpointList.length; i++) {
                if (breakpointList[i] === currentBreakpoint) {
                    return true;
                }
            }
            return false;
        }
        /**
         * registerChangeListener is called, when a new breakpoint is triggered
         * @param callback function which will be called when breakpoint chenge occurs
         *
         * @example
         *
         * ```ts
         *
         * o_global.breakpoint.registerChangeListener(console.log);
         * ```
         */
        registerChangeListener(callback) {
            const listenerWrapper = {
                trigger(bPoint) {
                    // Function gets called for entering and leaving a breakpoint
                    return function breakpointListener(breakpoints) {
                        if (breakpoints.matches) {
                            callback(bPoint);
                        }
                    };
                },
            };
            this.breakpoints.small.addListener(listenerWrapper.trigger("s"));
            this.breakpoints.medium.addListener(listenerWrapper.trigger("m"));
            this.breakpoints.large.addListener(listenerWrapper.trigger("l"));
            this.breakpoints.extraLarge.addListener(listenerWrapper.trigger("xl"));
        }
    }
    /**
     * Returns Default instance of the Breakpoint Class initialized
     * with Otto defaults
     */
    function breakpoint() {
        return new Breakpoint({
            small: window.matchMedia("(min-width: 0em) and (max-width: 27.99em)"),
            medium: window.matchMedia("(min-width: 28em) and (max-width: 47.99em)"),
            large: window.matchMedia("(min-width: 48em) and (max-width: 61.99em)"),
            extraLarge: window.matchMedia("(min-width: 62em)"),
        });
    }

    // Export breakpoint functionality to global namespace.
    window.o_global = window.o_global || {};
    window.o_global.breakpoint = window.o_global.breakpoint || breakpoint();
    window.o_global.breakpointClass = window.o_global.breakpointClass || Breakpoint;
    window.o_global.device = window.o_global.device || {};
    window.o_global.device.breakpoint =
        window.o_global.device.breakpoint || window.o_global.breakpoint;

}());
