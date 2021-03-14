import {Logger} from "./logger";

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

    sendClickTrackingEvent(trackingData) {
        const clickTrackingInfo = {};
        clickTrackingInfo["dynamo_ShopPromotionLarge"] = this._getGeneralTrackingData(
            "click",
            trackingData.offerCode,
            trackingData.offerName,
            trackingData.featureSequence,
            trackingData.filledSlots,
            trackingData.position,
            trackingData.affinity,
            trackingData.interactionPoint);
        clickTrackingInfo["dynamo_AssortmentPromoImageId"] = this._getImageTrackingData(trackingData.imageId);
        clickTrackingInfo["dynamo_ShopPromotionScore"] = this._getScoreTrackingData(trackingData.score, trackingData.pacingFactor);
        clickTrackingInfo["dynamo_ShopPromoTargetPSR"] = this._getTargetPsrTrackingData(trackingData.targetPsr);
        clickTrackingInfo["dynamo_TreatmentCode"] = this._getTreatmentCodeTrackingData("click", trackingData.treatmentCode);
        this.tracker.bct.submitMove(clickTrackingInfo);
        Logger.log('[karma-assortment]: SubmitMove (sendClickTrackingEvent)', clickTrackingInfo);
    }

    sendInitialViewTrackingEvent(trackingData) {
        const viewTrackingInfo = {};
        viewTrackingInfo["dynamo_ShopPromotionLarge"] = this._getGeneralTrackingData(
            "view",
            trackingData.offerCode,
            trackingData.offerName,
            trackingData.featureSequence,
            trackingData.filledSlots,
            trackingData.position,
            trackingData.affinity,
            trackingData.interactionPoint);
        viewTrackingInfo["dynamo_AssortmentPromoImageId"] = this._getImageTrackingData(trackingData.imageId);
        viewTrackingInfo["dynamo_ShopPromotionScore"] = this._getScoreTrackingData(trackingData.score, trackingData.pacingFactor);
        viewTrackingInfo["dynamo_ShopPromoTargetPSR"] = this._getTargetPsrTrackingData(trackingData.targetPsr);
        viewTrackingInfo["dynamo_TreatmentCode"] = this._getTreatmentCodeTrackingData("view", trackingData.treatmentCode);
        viewTrackingInfo["dynamo_AssortmentAffinity"] = trackingData.campaignAffinity;

        this.tracker.bct.sendMergeToTrackingServer(viewTrackingInfo);
        Logger.log('[dynamo]: SendMerge (sendInitialViewTrackingEvent)', viewTrackingInfo);
    }

    sendViewTrackingEventHidden(trackingData) {
        const viewTrackingInfo = {};
        viewTrackingInfo["dynamo_ShopPromotionLarge"] = this._getGeneralTrackingData(
            "view",
            trackingData.offerCode,
            trackingData.offerName,
            trackingData.featureSequence,
            trackingData.filledSlots,
            trackingData.position,
            trackingData.affinity,
            trackingData.interactionPoint);
        viewTrackingInfo["dynamo_AssortmentPromoImageId"] = this._getImageTrackingData(trackingData.imageId);
        viewTrackingInfo["dynamo_ShopPromotionScore"] = this._getScoreTrackingData(trackingData.score, trackingData.pacingFactor);
        viewTrackingInfo["dynamo_ShopPromoTargetPSR"] = this._getTargetPsrTrackingData(trackingData.targetPsr);
        viewTrackingInfo["dynamo_TreatmentCode"] = this._getTreatmentCodeTrackingData("view", trackingData.treatmentCode);
        if (trackingData.movementType) {
            viewTrackingInfo["dynamo_FeatureInteraction"] = this._getFeatureInteractionTrackingData(
                trackingData.promoType,
                trackingData.featureSequence,
                trackingData.position,
                trackingData.filledSlots,
                trackingData.movementType);
        }
        this.tracker.bct.sendEventToTrackingServer(viewTrackingInfo);
        Logger.log('[dynamo]: SendEvent (sendViewTrackingEventHidden)', viewTrackingInfo)
    }

    _getGeneralTrackingData(action, offerCode, offerName, featureSequence, filledSlots, position, affinity, interactionPoint) {
        return offerCode + "∞" + offerName + "∞" + featureSequence + "∞"
            + filledSlots + "∞" + position + "∞" + affinity + "∞" + interactionPoint + "∞" + action;
    }

    _getScoreTrackingData(score, pacingFactor) {
        return score + "∞" + pacingFactor;
    }

    _getImageTrackingData(imageId) {
        return imageId;
    }

    _getTargetPsrTrackingData(targetPsr) {
        return targetPsr;
    }

    _getTreatmentCodeTrackingData(action, treatmentCode) {
        return treatmentCode + "∞" + action;
    }

    _getEventAsString(destination, featureSequence, featureIndex, filledSlots, position, source, action) {
        const featureNumber = featureIndex + 1;
        return destination + "∞" + featureSequence + "$" + featureNumber + "∞" + filledSlots + "∞" + position + "∞" + source + "∞" + action;
    }

    _getFeatureInteractionTrackingData(promoType, featureSequence, featureIndex, filledSlots, movementType) {
        return promoType + "∞" + featureSequence + "∞" + filledSlots + "∞" + movementType;
    }


    _buildClickTrackingPayload(promoType, destination, featureSequence, featureIndex, filledSlots, position, source, action) {
        const clickTrackingInfo = {};
        clickTrackingInfo["karma_" + promoType] = this._getEventAsString(destination, featureSequence, featureIndex, filledSlots, position, source, action);
        clickTrackingInfo["wk.karma_Attribution"] = "karma_" + promoType + "∞" + this._getEventAsString(destination, featureSequence, featureIndex, filledSlots, position, source, action);
        return clickTrackingInfo;
    }

}
