class TrackingApi {
    constructor(utils) {
        this.utils = utils;
    }

    sendEventRequest(payload) {
        if (this._isTrackingBctAvailable()) {
            o_tracking.bct.sendEventToTrackingServer(payload);
            this.utils.debugLog('adition event tracking', payload);
        }
    }

    sendEventMergeRequest(payload, eventMergeId) {
        if (this._isTrackingBctAvailable()) {
            o_tracking.bct.sendEventMergeToTrackingServer(payload, eventMergeId);
            this.utils.debugLog('adition event merge tracking', payload, eventMergeId);
        }
    }

    sendMergeRequest(payload) {
        if (this._isTrackingBctAvailable()) {
            o_tracking.bct.sendMergeToTrackingServer(payload);
            this.utils.debugLog('adition merge tracking', payload);
        }
    }

    trackOnNextPageImpression(payload) {
        if (this._isTrackingBctAvailable()) {
            o_tracking.bct.trackOnNextPageImpression(payload);
            this.utils.debugLog('adition tracking event on next page impression', payload);
        }
    }

    _isTrackingBctAvailable() {
        return o_tracking && o_tracking.bct;
    }

}

export {TrackingApi};
