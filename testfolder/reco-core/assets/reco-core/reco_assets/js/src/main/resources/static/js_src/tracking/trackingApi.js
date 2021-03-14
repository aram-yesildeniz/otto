'use strict';

const debug = require('../qa/debug.js');

const trackingApi = {};
trackingApi.sendEventRequest = (payload) => {
    o_tracking.bct.sendEventToTrackingServer(payload);
    debug.log('cinema event tracking', payload);
};

trackingApi.sendEventMergeRequest = (payload, eventMergeId) => {
    o_tracking.bct.sendEventMergeToTrackingServer(payload, eventMergeId);
    debug.log('cinema event merge tracking', payload, eventMergeId);
};

trackingApi.sendMergeRequest = (payload) => {
    o_tracking.bct.sendMergeToTrackingServer(payload);
    debug.log('cinema merge tracking', payload);
};

trackingApi.trackOnNextPageImpression = (payload) => {
    o_tracking.bct.trackOnNextPageImpression(payload);
    debug.log('cinema tracking event on next page impression', payload);
};

trackingApi.sendMoveRequest = (payload) => {
    o_tracking.bct.submitMove(payload);
    debug.log('cinema move tracking', payload);
};

trackingApi.sendViewPageEvent = (payload) => {
    o_global.eventQBus.emit('tracking.bct.addFeaturesToPageImpression', payload);
    debug.log('cinema view page tracking', payload);
}

module.exports = trackingApi;
