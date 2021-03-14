import TrackingService from "./tracking_service";

export default class PromoStaticPromo {

    trackClick(clickableItem, sourceUrl, position, filledSlots) {
        const container = this.findParentContainer(clickableItem);
        const promoType = this.getPromoType(container);
        const destinationUrl = this.getDestinationUrl(clickableItem);
        const featureOrder = this.getFeatureOrder(container);
        const featureIndex = this.getFeatureIndex(container);
        const isPopupLink = this.isPopupLink(clickableItem);

        let trackingService = new TrackingService();

        if (isPopupLink) {
            trackingService.sendClickTrackingEventForPopup(promoType, destinationUrl, featureOrder, featureIndex, filledSlots, position + 1, sourceUrl);
        } else {
            trackingService.sendClickTrackingEvent(promoType, destinationUrl, featureOrder, featureIndex, filledSlots, position + 1, sourceUrl);
        }
    }

    getDestinationUrl(teaserItem) {
        const teaserTrackingContainer = teaserItem.querySelector('.js_uni50teasertracking');
        return teaserTrackingContainer ? window.atob(teaserTrackingContainer.getAttribute('data-promo-content')) : "emptyTarget";
    }

    isPopupLink(teaserItem) {
        return teaserItem.querySelector('.js_openInPopup') !== null;
    }

    trackView(container) {
        const promoType = this.getPromoType(container);
        const destinationUrls = this.getAllDestinationUrls(container, promoType);
        const featureOrder = this.getFeatureOrder(container);
        const featureIndex = this.getFeatureIndex(container);
        const sourceUrls = this.getSourceUrls(container, promoType);
        const filledSlots = sourceUrls.length;
        new TrackingService().sendViewTrackingEvent(promoType, destinationUrls, featureOrder, featureIndex, filledSlots, sourceUrls);
    }

    getPromoType(container) {
        return container.getAttribute("data-promo-type");
    }

    getAllDestinationUrls(container, promoType) {
        if (promoType === "StaticPromotion") {
            const trackingDivs = container.querySelectorAll('.js_uni50teasertracking');
            return [].map.call(trackingDivs, (div) => window.atob(div.getAttribute('data-promo-content')));
        } else if (promoType === "PanoramaTeaser") {
            return [this.getDestinationUrl(container)];
        } else {
            return ["n/a"];
        }
    }

    getFeatureOrder(container) {
        return parseInt(container.parentElement.getAttribute('data-feature-order'), 0);
    }

    getFeatureIndex(container) {
        return parseInt(container.getAttribute('data-feature-index'), 0);
    }

    getSourceUrls(container, promoType) {
        if (promoType === "StaticPromotion") {
            const urlsAsJson = container.getAttribute("data-urls-as-json");
            return (urlsAsJson !== null) ? eval(urlsAsJson) : ["n/a"];
        } else {
            const url = container.getAttribute("data-url");
            return (url !== null) ? [url] : ["n/a"];
        }
    }

    findParentContainer(elem) {
        const className = "promo_staticpromo-container";
        while (!elem.classList.contains(className) && (elem = elem.parentElement));
        return elem;
    }

}
