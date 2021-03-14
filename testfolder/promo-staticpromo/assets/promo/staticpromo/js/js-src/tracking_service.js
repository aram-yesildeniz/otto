export default class TrackingService {

    constructor(){
        //fix npe if o tracking is not available
        this.tracker = window.o_tracking;
        if (!this.tracker.bct) {
            this.tracker.bct = {
                sendMergeToTrackingServer: () => {},
                sendEventToTrackingServer: () => {},
                submitMove: () => {}
            }
        }
    }

    sendClickTrackingEvent(promoType, destination, featureOrder, featureIndex, filledSlots, position, source) {
        const clickTrackingInfo = this._buildClickTrackingPayload(promoType, destination, featureOrder, featureIndex, filledSlots, position, source, "click");
        this.tracker.bct.submitMove(clickTrackingInfo);
    }

    sendClickTrackingEventForPopup(promoType, destination, featureOrder, featureIndex, filledSlots, position, source) {
        const clickTrackingInfo = this._buildClickTrackingPayload(promoType, destination, featureOrder, featureIndex, filledSlots, position, source, "click");
        this.tracker.bct.sendEventToTrackingServer(clickTrackingInfo);
    }

    sendViewTrackingEvent(promoType, destinationsArray, featureOrder, featureIndex, filledSlots, sourcesArray) {
        let staticPromos = [];
        const action = "view";
        for (let pos = 0; pos < filledSlots; ++pos) {
            staticPromos.push(this._getEventAsString(destinationsArray[pos], featureOrder, featureIndex, filledSlots, (pos + 1), sourcesArray[pos], action));
        }

        const viewTrackingInfo = {};
        viewTrackingInfo["promo_" + promoType] = staticPromos.join("|");

        this.tracker.bct.sendMergeToTrackingServer(viewTrackingInfo);
    }

    _buildClickTrackingPayload(promoType, destination, featureOrder, featureIndex, filledSlots, position, source, action) {
        const clickTrackingInfo = {};
        let trackingPayload = this._getEventAsString(destination, featureOrder, featureIndex, filledSlots, position, source, action);
        clickTrackingInfo["promo_" + promoType] = trackingPayload;
        clickTrackingInfo["wk.promo_Attribution"] = "promo_" + promoType + "∞" + trackingPayload;
        return clickTrackingInfo;
    }

    _getEventAsString(destination, featureOrder, featureIndex, filledSlots, position, source, action) {
        const featureNumber = featureIndex + 1;

        //Verena says that content between ∞ dividers destroys tracking if it's longer than 255 chars. So we trim it to 200 chars to be safe.
        if (destination && destination.length > 200) {
            destination = destination.substring(0, 200);
        }

        return destination + "∞" + featureOrder + "$" + featureNumber + "∞" + filledSlots + "∞" + position + "∞" + source + "∞" + action;
    }
}
