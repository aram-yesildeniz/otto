window.o_benefit = window.o_benefit || {};

o_benefit.trackingQueueEventEmitter = (() => {
    const module = {};

    module.trackOnNextPageImpression = payload => {
        logInfo(`[benefit-presentation] Track on next PI`, payload);
        return window.o_global.eventQBus.emit('tracking.bct.addFeaturesToPageImpression', payload)
            .catch(reason => {
                logError("[benefit-presentation] Could not emit event 'addFeaturesToPageImpression'", reason)
            });
    };

    module.sendEvent = payload => {
        logInfo(`[benefit-presentation] Send 'event'`, payload);
        return window.o_global.eventQBus.emit('tracking.bct.submitAction', {}, payload)
            .catch(reason => {
                logError("[benefit-presentation] Could not emit event 'submitAction'", reason)
            });
    };

    module.sendEventMerge = (payload, eventMergeId) => {
        logInfo(`[benefit-presentation] Send 'event merge' with eventMergeId: ${eventMergeId}`, payload);
        return window.o_global.eventQBus.emit('tracking.bct.addActionToEvent', payload)
            .catch(reason => {
                logError("[benefit-presentation] Could not emit event 'addActionToEvent'", reason)
            });
    };

    module.sendMerge = payload => {
        logInfo(`[benefit-presentation] Send 'merge'`, payload);
        return window.o_global.eventQBus.emit('tracking.bct.addFeaturesToPageImpression', payload)
            .catch(reason => {
                logError("[benefit-presentation] Could not emit event 'addFeaturesToPageImpression'", reason)
            });
    };

    module.submitMove = payload => {
        logInfo(`[benefit-presentation] Submit 'move'`, payload);
        return window.o_global.eventQBus.emit('tracking.bct.submitMoveAction', {}, payload)
            .catch(reason => {
                logError("[benefit-presentation] Could not emit event 'submitMoveAction'", reason)
            });
    };

    const logInfo = (msg, payload) => {
        if (o_global.debug.status().activated === true) {
            console.log(msg, payload);
        }
    };

    const logError = (msg, reason) => {
        if (o_global.debug.status().activated === true) {
            console.error(msg, reason);
        }
    };

    return module;
})();
