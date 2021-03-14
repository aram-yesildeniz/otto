import {Logger} from "./logger";

export class MetaTrackingData {
    _affinity;
    _cpm;
    _featureSequence;
    _interactionPoint;
    _offerCode;
    _offerName;
    _pricingFactor;
    _offerScore;
    _unknown;

    _treatmentCode;
    _targetPSR;
    _imageId;
    _ca;

    track(action) {
        return {
            "dynamo_BrandShopPromotionLarge": `${this._affinity}∞${this._cpm}∞${this._featureSequence}∞${this._interactionPoint}∞${this._offerCode}∞${this._offerName}∞${this._pricingFactor}∞${this._offerScore}∞${this._unknown}∞${action}`,
            "dynamo_TreatmentCode": `${this._treatmentCode}∞${action}`,
            "dynamo_BrandPromoTargetPSR": `${this._targetPSR}`,
            "dynamo_BrandPromoImageId": `${this._imageId}`,
            "dynamo_CampaignAffinity": `${this._ca}`
        }
    }
}

export default class MetaBrandPromoTracking {

    init() {
        let container = document.querySelectorAll('.karma_brand_promo-container');
        let data = this.getTrackingData(container[0]);

        this.trackView(data, false);

        if (container.length > 1) {
            [].forEach.call(container, (brandPromo, index) => {
                if (index > 0) { // first container is already tracked
                    let brandPromoData = this.getTrackingData(brandPromo);
                    this.trackView(brandPromoData, true);
                }
            })
        }

        [].forEach.call(container, (brandPromo) => {
            this.trackBrandPromo(brandPromo);
        })
    }

    trackBrandPromo(brandPromo) {
        if (brandPromo) {
            let target = brandPromo.querySelector('.karma_brand_promo-link-wrapper');
            let data = this.getTrackingData(brandPromo);

            if (data) {
                this.registerClickTracking(target, data);
                this.registerSeenTracking(target, data);
            }
        }
    }

    getTrackingData(brandPromo) {
        let data = new MetaTrackingData();
        let tracking = JSON.parse(brandPromo.getAttribute("data-tracking"));
        let sequence = brandPromo.parentElement.parentElement.getAttribute("data-feature-order");
        let campaignAffinities = brandPromo.getAttribute("data-ca") || "Leer";
        if (tracking === null) {
            Logger.error("Received no tracking data from backend via 'data-tracking' attribute.");
            return;
        } else {
            data._featureSequence = sequence || "99";
            data._affinity = tracking["affinity"] || "Leer";
            data._cpm = tracking["cpm"] || "Leer";
            data._interactionPoint = tracking["interactionPoint"] || "x";
            data._offerCode = tracking["offerCode"] || "x";
            data._offerName = tracking["offerName"] || "x";
            data._pricingFactor = tracking["pacingFactor"] || "x";
            data._offerScore = tracking["score"] || "x";
            data._unknown = "x";
            data._treatmentCode = tracking["treatmentCode"] || "x";
            data._targetPSR = brandPromo.getAttribute("data-promo-dreson") || "x";
            data._imageId = tracking["imageId"] || "x";
            data._ca = campaignAffinities;
        }
        return data;
    }

    registerClickTracking(target, trackingData) {
        target.addEventListener("click", (event) => {

            if (event.target.tagName !== "IMG" || !trackingData) {
                return;
            }
            let data = trackingData.track("click");
            Logger.log("(Legacy) Track click", data)
            window.o_tracking.bct.submitMove(data);
        });
    }

    registerSeenTracking(target, trackingData) {
        const observerOptions = {
            threshold: 0.75
        };

        const intersectionObserverCallback = (entries, interSectionObserver) => {
            const entry = entries[0];
            if (window.o_tracking && window.o_tracking.bct && trackingData && entry.isIntersecting) {
                interSectionObserver.unobserve(entry.target);
                let data = trackingData.track("seen");
                Logger.log("(Legacy) Track seen", data);
                window.o_tracking.bct.sendEventToTrackingServer(data)
            }
        };

        const observer = new IntersectionObserver(intersectionObserverCallback, observerOptions);
        observer.observe(target);
    }

    trackView(trackingData, sendAsEvent) {
        let data = trackingData.track("view");
        Logger.log("(Legacy) Track initial view", data);
        if (!window.o_tracking || !window.o_tracking.bct) {
            return;
        }
        if (sendAsEvent) {
            window.o_tracking.bct.sendEventToTrackingServer(data);
        } else {
            window.o_tracking.bct.sendMergeToTrackingServer(data);
        }
    }
}