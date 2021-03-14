import TrackingService from "./tracking_service";

export default class PromoTopicPromo {

    constructor(container) {
        this.container = container;
        this.featureOrder = this._getFeatureOrder(container);
        this.item = container.querySelector('.promo_topicpromo--container a');
        this.trackingService = new TrackingService();

        this.trackView();

        this.item.addEventListener("click", this.trackClick(), false);
    }

    trackClick() {
        const self = this;
        return function () {
            self.trackingService.sendClickTrackingEvent(this.getAttribute('data-topic-id'),
                self.featureOrder,
                parseInt(this.getAttribute('data-feature-index')),
                this.getAttribute('data-source'),
                this.getAttribute('data-affinity'));
        }
    }

    trackView() {
        const source = this.item.getAttribute('data-source');
        const affinity = this.item.getAttribute('data-affinity');
        const topicId = this.item.getAttribute('data-topic-id');
        const featureIndex = parseInt(this.item.getAttribute('data-feature-index'));
        this.trackingService.sendViewTrackingEvent(topicId, this.featureOrder, featureIndex, source, affinity);
    }

    _getFeatureOrder() {
        return parseInt(this.container.parentElement.getAttribute('data-feature-order'), 0);
    }

}
