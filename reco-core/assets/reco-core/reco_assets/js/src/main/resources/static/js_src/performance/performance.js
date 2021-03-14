'use strict';

const debug = require('../qa/debug.js');

module.exports = (globalWindow) => {
    const module = {};

    const mark = (startName) => {
        try {
            globalWindow.performance.mark(startName);
        } catch (e) {
            debug.log('Performance api is probably not supported in this browser');
        }
    };

    const measure = (cinemaName) => {
        try {
            globalWindow.performance.measure(cinemaName, CINEMA_LOADING_START);
        } catch (e) {
            debug.log('Performance api is probably not supported in this browser');
        }
    };

    const getEntriesByName = (cinemaName) => {
        try {
            return globalWindow.performance.getEntriesByName(cinemaName);
        } catch (e) {
            debug.log('Performance api is probably not supported in this browser');
        }
    };

    const CINEMA_LOADING_START = 'reco_cinemaLoadingStart';

    module.cinemaLoadingStarted = () => {
        mark(CINEMA_LOADING_START);
    };

    module.cinemaLoaded = (cinemaName) => {
        try {
            measure(cinemaName);
            const entriesByName = getEntriesByName(cinemaName);
            if (entriesByName && globalWindow.o_scale) {
                debug.log(cinemaName + ' took ' + entriesByName[0].duration + 'ms to load');
                const beaconObject = {};
                beaconObject['rum_' + cinemaName] = Math.round(entriesByName[0].duration);
                globalWindow.o_scale.userTiming.sendBeacon(beaconObject);
            }
        } catch (err) {
            debug.log('ignoring error while sending performance beacon', err);
        }
    };

    return module;
};
