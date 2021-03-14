import TrackingService from "./tracking_service";
import {Logger} from "./logger";

export default class Assortment {

    constructor() {
        this.trackingService = new TrackingService();
    }

    trackClick(clickableItem, position, filledSlots, promoType) {
        // increment index by one to conform with overflow slides at the beginning and the end
        let real_position = position + 1;
        const container = this.findParentContainer(clickableItem, promoType);
        let slideContainer = container.querySelectorAll('.karma_assortment--item')[real_position];
        // position is incremented below ...
        const trackingData = this.parseHtmlTrackingData(container, slideContainer, filledSlots, position);
        this.trackingService.sendClickTrackingEvent(trackingData);
    }

    getDestinationUrl(item) {
        return item.getAttribute('href');
    }

    trackInitialView(container) {
        const sourceUrls = this.getSourceUrls(container);
        const filledSlots = sourceUrls.length;
        let firstSlideContainer = container.querySelectorAll('.karma_assortment--item')[0];
        if (firstSlideContainer === undefined) {
            Logger.error("No first slide but request to track initial view.");
            return;
        }

        const trackingData = this.parseHtmlTrackingData(container, firstSlideContainer, filledSlots, null);
        firstSlideContainer.setAttribute("data-slidetracked", 'true');
        this.trackingService.sendInitialViewTrackingEvent(trackingData);
    }

    trackSlide(container, slideIndex, movementType) {
        const sourceUrls = this.getSourceUrls(container);
        //decrease filled slots by 2 due to infinite slider buffer
        const filledSlots = sourceUrls.length - 2;
        let slideContainer = container.querySelectorAll('.karma_assortment--item')[slideIndex];
        const trackingData = this.parseHtmlTrackingData(container, slideContainer, filledSlots, null, movementType);
        this.trackingService.sendViewTrackingEventHidden(trackingData);
    }

    parseHtmlTrackingData(container, slideContainer, filledSlots, position, movementType) {
        let feature_index = slideContainer.getAttribute('data-feature-index');
        let thePosition = (position != null) ? position : parseInt(feature_index !== null ? feature_index : "-1", 0);
        return {
            featureSequence: parseInt(container.parentElement.getAttribute('data-feature-order'), 0),
            offerCode: slideContainer.getAttribute("data-offer-code"),
            offerName: slideContainer.getAttribute("data-offer-name"),
            affinity: slideContainer.getAttribute("data-offer-affinity"),
            campaignAffinity: slideContainer.getAttribute("data-campaign-affinity"),
            interactionPoint: slideContainer.getAttribute("data-offer-interaction-point"),
            imageId: slideContainer.getAttribute("data-promo-imageId"),
            score: slideContainer.getAttribute("data-offer-score"),
            pacingFactor: slideContainer.getAttribute("data-offer-pacing-factor"),
            targetPsr: slideContainer.getAttribute("data-offer-target-psr"),
            treatmentCode: slideContainer.getAttribute("data-offer-treatment-code"),
            promoType: container.getAttribute("data-promo-type"),
            filledSlots: filledSlots,
            position: ++thePosition,
            movementType: movementType
        };
    }

    getSourceUrls(container, promoType, startIndex, lastIndex) {
        const assortmentContainer = container.querySelectorAll('.karma_assortment--image-container');

        startIndex = startIndex || 0;
        lastIndex = lastIndex || assortmentContainer.length;

        return [].map
            .call(assortmentContainer, assortmentTile => assortmentTile.getAttribute('data-image-source-type') || 'manual')
            .slice(startIndex, lastIndex);
    }


    getAllDestinationUrls(container, promoType, startIndex, lastIndex) {
        const trackingDivs = container.querySelectorAll('.karma_assortment--image-container a');

        startIndex = startIndex || 0;
        lastIndex = lastIndex || trackingDivs.length;

        return [].map
            .call(trackingDivs, div => div.getAttribute('href'))
            .slice(startIndex, lastIndex);
    }

    findParentContainer(elem, promoType) {
        while (!elem.classList.contains("karma_assortment--container") && (elem = elem.parentElement)) ;
        return elem;
    }

    static loadImages(container) {
        const promoImages = container.querySelectorAll('.karma_assortment--image');
        const sources = container.querySelectorAll('.karma_assortment--picture source');
        const logos = container.querySelectorAll('.karma_assortment--logo');

        //Replace placeholder images and picture sources with real ones
        for (let i = 0; i < promoImages.length; i++) {
            if (promoImages[i].getAttribute('data-src')) {
                promoImages[i].setAttribute('src', promoImages[i].getAttribute('data-src'));
            }
        }
        for (let i = 0; i < sources.length; i++) {
            if (sources[i].getAttribute('data-srcset')) {
                sources[i].setAttribute('srcset', sources[i].getAttribute('data-srcset'));
            }
        }
        for (let i = 0; i < logos.length; i++) {
            if (logos[i].getAttribute('data-src')) {
                logos[i].setAttribute('src', logos[i].getAttribute('data-src'));
            }
        }
    }
}
