export default class TrackingService {

    constructor() {
        //fix npe if o tracking is not available
        this.tracker = window.o_tracking || {};
        if (!this.tracker.bct) {
            this.tracker.bct = {
                sendMergeToTrackingServer: () => {
                },
                sendEventToTrackingServer: () => {
                },
                submitMove: () => {
                },
                trackOnNextPageImpression: () => {

                }
            }
        }
    }

    sendClickTrackingEvent(topicId, featureOrder, featureIndex, source, affinity) {
        const clickTrackingInfo = this._buildClickTrackingPayload(topicId, featureOrder, featureIndex, source, affinity);
        this.tracker.bct.submitMove(clickTrackingInfo);
        this.tracker.bct.trackOnNextPageImpression({"promo_Click": "topicPromotionLarge"})
    }

    sendViewTrackingEvent(topicId, featureOrder, featureIndex, source, affinity) {
        const viewTrackingInfo = this._getViewTrackingInfo(topicId, featureOrder, featureIndex, source, affinity);
        this.tracker.bct.sendMergeToTrackingServer(viewTrackingInfo);
    }

    _getViewTrackingInfo(topicId, featureOrder, featureIndex, source, affinity) {
        return {
            "promo_TopicPromotionLarge": this._getEventAsString(topicId, featureOrder, featureIndex, 1, 1, source, "view"),
            "promo_TopicPromoScore": affinity
        };
    }

    _buildClickTrackingPayload(topicId, featureOrder, featureIndex, source, affinity) {
        const clickTrackingInfo = {};
        let trackingData = this._getEventAsString(topicId, featureOrder, featureIndex, 1, 1, source, "click");
        clickTrackingInfo["promo_TopicPromotionLarge"] = trackingData;
        clickTrackingInfo["promo_TopicPromoScore"] = affinity;
        clickTrackingInfo["wk.promo_Attribution"] = "promo_TopicPromotionLarge" + "∞" + trackingData;
        return clickTrackingInfo;
    }

    _getEventAsString(topicId, featureOrder, featureIndex, filledSlots, position, source, action) {
        const featureNumber = featureIndex + 1;
        return topicId + "∞" + featureOrder + "$" + featureNumber + "∞" + filledSlots + "∞" + position + "∞" + source + "∞" + action;
    }

}
