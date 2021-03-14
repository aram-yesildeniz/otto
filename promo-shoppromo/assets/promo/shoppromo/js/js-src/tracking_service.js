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
            }
        }
    }

    sendClickTrackingEvent(promoType, destinationPath, destinationDreson, featureOrder, featureIndex, filledSlots, position, source, personalizationContext = null) {
        const clickTrackingInfo = this._buildClickTrackingPayload(promoType, destinationPath, featureOrder, featureIndex, filledSlots, position, source, "click", destinationDreson, personalizationContext);
        this.tracker.bct.submitMove(clickTrackingInfo);
    }

    sendViewTrackingEvent(promoType, destinationsArray, dresonsArray, featureOrder, featureIndex, filledSlots, sourcesArray, personalizationContext = null) {
        const viewTrackingInfo = {};
        viewTrackingInfo['promo_' + promoType] = this._getViewTrackingInfo(filledSlots, destinationsArray, featureOrder, featureIndex, sourcesArray, personalizationContext);
        if (dresonsArray != null) {
            viewTrackingInfo['promo_' + promoType + "_v2"] = this._getViewTrackingInfoV2(filledSlots, destinationsArray, featureOrder, featureIndex, sourcesArray, dresonsArray, personalizationContext);
        }
        this.tracker.bct.sendMergeToTrackingServer(viewTrackingInfo);
    }

    sendViewTrackingEventHidden(promoType, destinationPath, destinationDreson, featureOrder, featureIndex, filledSlots, source, slideIndex, movementType, personalizationContext = null) {
        const viewTrackingInfo = {};
        viewTrackingInfo["promo_" + promoType] = this._getEventAsString(destinationPath, featureOrder, featureIndex, filledSlots, slideIndex, source, 'view', personalizationContext);
        viewTrackingInfo["promo_" + promoType + "_v2"] = this._getEventAsStringV2(destinationPath, featureOrder, featureIndex, filledSlots, slideIndex, source, 'view', destinationDreson, personalizationContext);
        if (movementType) {
            viewTrackingInfo["promo_FeatureInteraction"] = this._getMovementTrackingInfoAsString(promoType, featureOrder, featureIndex, filledSlots, movementType);
        }
        this.tracker.bct.sendEventToTrackingServer(viewTrackingInfo);
    }

    sendCinemaMovementTrackingEventHidden(promoType, featureOrder, featureIndex, filledSlots, movementType) {
        const movementTrackingInfo = {"promo_FeatureInteraction": this._getMovementTrackingInfoAsString(promoType, featureOrder, featureIndex, filledSlots, movementType)};
        this.tracker.bct.sendEventToTrackingServer(movementTrackingInfo);
    }

    _getViewTrackingInfo(filledSlots, destinationsArray, featureOrder, featureIndex, sourcesArray, personalizationContext) {
        let promos = [];
        const action = "view";
        for (let pos = 0; pos < destinationsArray.length; ++pos) {
            promos.push(this._getEventAsString(destinationsArray[pos], featureOrder, featureIndex, filledSlots, (pos + 1), sourcesArray[pos], action, personalizationContext));
        }
        return promos.join("|");
    }

    /* Introduced for Spring Break extended tracking */
    _getViewTrackingInfoV2(filledSlots, destinationsArray, featureOrder, featureIndex, sourcesArray, dresonsArray, personalizationContext) {
        let promos = [];
        const action = "view";
        for (let pos = 0; pos < dresonsArray.length; ++pos) {
            promos.push(this._getEventAsStringV2(destinationsArray[pos], featureOrder, featureIndex, filledSlots, (pos + 1), sourcesArray[pos], action, dresonsArray[pos], personalizationContext));
        }
        return promos.join("|");
    }

    _buildClickTrackingPayload(promoType, destinationPath, featureOrder, featureIndex, filledSlots, position, source, action, destinationDreson, personalizationContext) {
        const clickTrackingInfo = {};
        clickTrackingInfo["promo_" + promoType] = this._getEventAsString(destinationPath, featureOrder, featureIndex, filledSlots, position, source, action, personalizationContext);
        clickTrackingInfo["promo_" + promoType + "_v2"] = this._getEventAsStringV2(destinationPath, featureOrder, featureIndex, filledSlots, position, source, action, destinationDreson, personalizationContext);
        clickTrackingInfo["wk.promo_Attribution"] = "promo_" + promoType + "∞" + this._getEventAsString(destinationPath, featureOrder, featureIndex, filledSlots, position, source, action, personalizationContext);

        /* Dirty Hack: remove after topic migration TODO */
        const firstTopicContainer = document.querySelector(".combo_topic_content");
        const topicId = firstTopicContainer ? firstTopicContainer.getAttribute("data-topic-id") : null;
        if (topicId) {
            clickTrackingInfo["wk.sd_TopicId"] = topicId;
        }
        /* End Dirty Hack */

        return clickTrackingInfo;
    }

    /* eslint-disable no-unused-vars */
    _getEventAsString(destinationPath, featureOrder, featureIndex, filledSlots, position, source, action, personalizationContext) {
        const featureNumber = featureIndex + 1;
        const deltaChar = "Δ"; // 'Δ'
        return destinationPath + (personalizationContext != null ? deltaChar + personalizationContext : "") + "∞" + featureOrder + "$" + featureNumber + "∞" + filledSlots + "∞" + position + "∞" + source + "∞" + action;
    }
    /* eslint-enable no-unused-vars */

    _getEventAsStringV2(destinationPath, featureOrder, featureIndex, filledSlots, position, source, action, destinationDreson, personalizationContext) {
        const featureNumber = featureIndex + 1;
        return destinationPath + "∞" + featureOrder + "$" + featureNumber + "∞" + filledSlots + "∞" + position + "∞" + source + "∞" + action + "∞" + destinationDreson + "∞" + personalizationContext;
    }

    _getMovementTrackingInfoAsString(promoType, featureOrder, featureIndex, filledSlots, movementType) {
        const featureNumber = featureIndex + 1;
        return promoType + "∞" + featureOrder + "$" + featureNumber + "∞" + filledSlots + "∞" + movementType;
    }

}
