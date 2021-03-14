import TrackingService from "./tracking_service";

export default class PromoBrandShopPromo {

    constructor(container) {
        this.container = container;
        this.promoType = this._getPromoType(container);
        this.featureOrder = this._getFeatureOrder(container);
        this.featureIndex = this._getFeatureIndex(container);
        this.items = container.querySelectorAll('.promo_brandshoppromo--image-container a');
        this.sourceUrls = this._getSourceUrls();
        this.filledSlots = this.items.length;
        this.trackingService = new TrackingService();

        this.trackView();

        [].map.call(this.items, item => {
            item.addEventListener("click", this.trackClick(), false);
        })
    }

    trackClick() {
        const self = this;
        return function () {
            self.trackingService.sendClickTrackingEvent(self.promoType, this.getAttribute("href"), null, self.featureOrder, self.featureIndex, self.filledSlots, parseInt(this.getAttribute("data-item-index")) + 1, 'manual');
        }
    }

    trackView() {
        const destinationUrls = [].map.call(this.items, item => item.getAttribute('href'));
        this.trackingService.sendViewTrackingEvent(this.promoType, destinationUrls, null, this.featureOrder, this.featureIndex, this.filledSlots, this.sourceUrls);
    }

    _getPromoType() {
        return this.container.getAttribute("data-promo-type");
    }

    _getFeatureOrder() {
        return parseInt(this.container.parentElement.getAttribute('data-feature-order'), 0);
    }

    _getFeatureIndex(container) {
        return parseInt(container.getAttribute('data-feature-index'), 0);
    }

    _getSourceUrls() {
        const shoppromoImageContainer = this.container.querySelectorAll('.promo_brandshoppromo--image-container');
        return [].map.call(shoppromoImageContainer, () => 'manual');
    }
}
