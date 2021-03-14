import TrackingService from "./tracking_service";

export default class PromoStaticContent {

    trackClick(clickableItem) {
        const container = this.findParentContainer(clickableItem);
        const promoType = this.getPromoType(container);
        const content = this.getContent(container, promoType);
        const featureOrder = this.getFeatureOrder(container);
        const featureIndex = this.getFeatureIndex(container);
        let trackingService = new TrackingService();

        trackingService.sendClickTrackingEvent(promoType, content, featureOrder, featureIndex, 1, 1, 'manual');
    }

    getContent(container, promoType) {
        switch (promoType) {
            case 'Textlink': {
                const link = container.getElementsByTagName('a')[0];
                const absoluteUrl = link.getAttribute('href');
                return absoluteUrl.replace(/^(http|https):\/\/[a-z0-9.-]+\.?otto\.de/,'');
            }
            case 'InteractiveRoom': {
                return container.getAttribute('data-room-id');
            }
            case 'Video': {
                return container.getAttribute('data-video-id');
            }
            default: {
                return 'n/a'
            }
        }
    }


    trackView(container) {
        const promoType = this.getPromoType(container);
        const content = this.getContent(container, promoType);
        const featureOrder = this.getFeatureOrder(container);
        const featureIndex = this.getFeatureIndex(container);

        new TrackingService().sendViewTrackingEvent(promoType, content, featureOrder, featureIndex, 1, 1, 'manual');
    }

    getPromoType(container) {
        return container.getAttribute("data-promo-type");
    }

    getFeatureOrder(container) {
        return parseInt(container.parentElement.getAttribute('data-feature-order'), 0);
    }

    getFeatureIndex(container) {
        return parseInt(container.getAttribute('data-feature-index'), 0);
    }

    findParentContainer(elem) {
        const className = "promo_staticcontent--trackable-widget";
        while (!elem.classList.contains(className) && (elem = elem.parentElement)) ;
        return elem;
    }
}
