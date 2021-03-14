// For JSLINT
/*jslint white: true */
/*global NodeList,o_util*/
var o_san = window.o_san || {};
o_san.util = o_san.util || (function () {
    'use strict';

    /**
     * Used for animation to automate position detection
     *
     * @param {String} style Type of animation like "top, left, ..."
     * @returns {Number}
     */
    var getStartPosition = function (style) {
            return (!!style ? parseInt(style, 10) : 0);
        },

        easings = {
            /**
             * @param {Number} startValue initial state
             * @param {Number} changeValue final state
             * @param {Integer} currentIteration
             * @param {Integer} maxIterations
             * @returns {Number}
             */
            easeIn: function (startValue, changeValue, currentIteration, maxIterations) {
                return changeValue * (Math.pow(currentIteration / maxIterations - 1, 3) + 1) + startValue;
            }
        },

        dom = {
            getWindowWidth: function() {
                return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
            },
            getWindowHeight: function() {
                return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
            },

            /**
             * Used in events.delegate to find the matching element after click
             *
             * @param {Element} element
             * @param {function} matchCond
             * @param {Element} maxParent
             * @returns {Element}
             */
            findMatch: function (element, matchCond, maxParent) {
                if (matchCond(element)) {
                    return element;
                }
                if (element === maxParent) {
                    return false;
                }
                return !!element.parentNode && dom.findMatch(element.parentNode, matchCond, maxParent);
            }
        },

        string = {
            escapeSpecials: function (string) {
                var pattern = '\\\\',
                    regexp = new RegExp("[" + pattern + "]", 'g');
                return string.replace(regexp, '');
            },

            trimLeft: function(string) {
                return string.replace(/^\s+/, '');
            },
        },

        /**
         * jQuery replacement
         *
         * @param {Object} options requires an objects depending on default options
         */
        animate = function (options) {
            var loop,
                stepValue,
                currentStep = 0,
                startPosition,
                defaultAnimateOptions = {element: null, steps: 10, to: 0, onFinish: null, easing: "easeIn", type: null},
                mOptions = o_util.core.extend(defaultAnimateOptions, options),
                isStyle = mOptions.type !== "scrollTop";

            if (mOptions.element !== null && mOptions.type !== null) {
                startPosition = getStartPosition((isStyle ?
                    mOptions.element.style[mOptions.type] :
                    mOptions.element[mOptions.type]));

                loop = function () {
                    stepValue = easings[mOptions.easing](startPosition, mOptions.to, currentStep, mOptions.steps);
                    if (isStyle) {
                        mOptions.element.style[mOptions.type] = stepValue + "px";
                    } else {
                        mOptions.element[mOptions.type] = stepValue;
                    }
                    currentStep += 1;

                    if (currentStep <= mOptions.steps) {
                        o_util.animation.requestAnimFrame(loop);
                    } else {
                        if (typeof mOptions.onFinish === "function") {
                            mOptions.onFinish();
                        }
                    }
                };

                loop();
            }
        },

        url = {
            /**
             * checks whether the current url contains a supplied query param
             *
             * @param {String} name of the query param
             * @param {String} url to search on for query param. If not supplied, location.search + location.hash will ne checked for the supplied query param.
             * @returns {boolean} indicating whether the url contains the query parameter name.
             */
            hasQueryParameter: function (name, url) {
                var regex = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
                return regex.exec(url || location.search + location.hash) !== null;
            }
        },

        global = {

            getCurrentPath: function () {
                return window.location.pathname;
            },

            getReferrer: function () {
                return document.referrer;
            },

            /**
             * Returns the current location relative to the host.
             *
             * @return {string} the relative location.
             */
            getRelativeLocation: function () {
                const {pathname = "/", search = "", hash = ""} = window.location;
                return pathname.slice(0, 1) === "/"  // IE11 does not provide leading "/"
                    ? pathname + search + hash
                    : "/" + pathname + search + hash;
            },

            setLocation: function (target) {
                window.location = target;
            }

        },

        core = (function () {
            /** Parameterless function which returns previous value + 1.
             * @returns {number} next Value
             */
            var nextValue = function () {
                    return ++this.value;
                },

                /**
                 * Creates a self incrementing function.
                 *
                 * @example
                 * var foo = counter();
                 * foo(); // -> 1
                 * foo(); // -> 2
                 *
                 * @param {number} [start=1] initial value
                 * @returns {nextValue} the initialized nextValue() function
                 */
                counter = function (start) {
                    return o_util.core.bind({value: (start || 1) - 1}, nextValue);
                };

            return {
                counter: counter
            };
        }());

    return {
        dom: dom,
        string: string,
        animate: animate,
        url: url,
        global: global,
        core: core
    };
}());
