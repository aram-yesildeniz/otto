window.o_benefit = window.o_benefit || {};

o_benefit.trackingApi = (() => {
    const module = {};

    const isTrackingAvailable = () => !!window.o_tracking &&
        !!window.o_tracking.bct &&
        !!window.o_tracking.bct.sendMergeToTrackingServer &&
        !!window.o_tracking.bct.sendEventMergeToTrackingServer &&
        !!window.o_tracking.bct.submitMove;

    module.sendEventRequest = payload => {
        // send data to tracking server
        if (isTrackingAvailable()) {
            o_tracking.bct.trackOnNextPageImpression(payload);

            // if debug cookie is on, print the data to the console
            if (o_global.debug.status().activated === true) {
                console.log("lever event tracking", payload);
            }
        }
    };

    module.sendRealEventRequest = payload => {
        if (o_global.debug.status().activated === true) {
            console.log("[benefit-presentation] Send 'event' to tracking server: ", payload);
        }
        o_tracking.bct.sendEventToTrackingServer(payload).then(() => {
            if (o_global.debug.status().activated === true) {
                console.log(`[benefit-presentation] ${payload} succesfully sent to tracking server`);
            }
        }).catch(reason => {
            if (o_global.debug.status().activated === true) {
                console.warn(`[benefit-presentation] Error while sending ${payload} to tracking server`, reason);
            }
        })
    };

    module.sendEventMergeRequest = (payload, eventMergeId) => {
        // send data to tracking server
        if (isTrackingAvailable()) {
            o_tracking.bct.sendEventMergeToTrackingServer(payload, eventMergeId);

            // if debug cookie is on, print the data to the console
            if (o_global.debug.status().activated === true) {
                console.log("lever event merge tracking", payload);
            }
        }
    };

    module.sendMergeRequest = payload => {
        // send data to tracking server
        if (isTrackingAvailable()) {
            o_tracking.bct.sendMergeToTrackingServer(payload);

            // if debug cookie is on, print the data to the console
            if (o_global.debug.status().activated === true) {
                console.log("lever merge tracking", payload);
            }
        }
    };

    return module;
})();
