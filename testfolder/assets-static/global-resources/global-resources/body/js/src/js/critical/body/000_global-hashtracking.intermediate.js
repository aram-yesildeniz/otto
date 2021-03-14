(function () {
    'use strict';

    var _a, _b;
    // see https://github.com/otto-ec/assets_global-utils/
    const fragment = (_a = window.o_util) === null || _a === void 0 ? void 0 : _a.fragment;
    const core = (_b = window.o_util) === null || _b === void 0 ? void 0 : _b.core;

    /* eslint-disable @typescript-eslint/camelcase */
    class Hashtracking {
        /**
         * Sends data to the tracking server.
         *
         * @param {Object} dataContainer    The data to be send to the tracking server.
         * @param {Boolean} nonHidden       Hidden
         */
        // eslint-disable-next-line class-methods-use-this
        sendData(dataContainer, nonHidden) {
            if (nonHidden) {
                // eslint-disable-next-line no-param-reassign
                dataContainer = core.extend(dataContainer, {
                    ns_type: "",
                });
            }
            // we can not use tracking via the event q bus in native apps. ¯\_(ツ)_/¯
            window.o_tracking.bct.sendMergeToTrackingServer(dataContainer);
        }
        /**
         * Tracks the hash.
         */
        hashTrack() {
            if (this.alreadyTracked) {
                return;
            }
            this.alreadyTracked = true;
            const domList = document.querySelectorAll(".js_tracking");
            const track = core.toArray(domList).some((element) => {
                return element.hasAttribute("data-track");
            });
            if (track) {
                const trackingHash = fragment.get("t");
                /* istanbul ignore else */
                if (trackingHash) {
                    try {
                        const t = JSON.parse(trackingHash);
                        /* istanbul ignore else */
                        if (t) {
                            this.sendData(t);
                            fragment.remove("t");
                            /* istanbul ignore else */
                            if ((window.location.hash === "" || window.location.hash === "#") &&
                                // eslint-disable-next-line compat/compat
                                window.history.replaceState) {
                                // eslint-disable-next-line compat/compat
                                window.history.replaceState(window.history.state, document.title, window.location.href.replace(/#$/, ""));
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }

    var _a$1;
    window.o_global = window.o_global || {};
    window.global = window.global || {};
    // @ts-ignore
    window.global.hashtracking = new Hashtracking();
    (_a$1 = window.o_global) === null || _a$1 === void 0 ? void 0 : _a$1.eventLoader.onLoad(100, () => {
        new Hashtracking().hashTrack();
    });

}());
