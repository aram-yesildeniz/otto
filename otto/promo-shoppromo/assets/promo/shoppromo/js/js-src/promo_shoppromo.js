import TrackingService from "./tracking_service";

export default class PromoShopPromo {

    constructor() {
        this.trackingService = new TrackingService();
    }

    trackClick(clickableItem, position, filledSlots, promoType) {
        const container = this.findParentContainer(clickableItem, promoType);
        let destinationUrl = this.getDestinationUrl(clickableItem);
        const featureOrder = this.getFeatureOrder(container);
        const featureIndex = this.getFeatureIndex(container);
        const dreson = this.getDestinationDreson(clickableItem);
        const source = this.getSource(clickableItem);
        const personalizationContext = this.getPersonalizationContextOfLink(clickableItem);

        this.trackingService.sendClickTrackingEvent(promoType, destinationUrl, dreson, featureOrder, featureIndex, filledSlots, position + 1, source, personalizationContext);
    }

    getSource(item) {
        return item.parentElement.getAttribute('data-source') || 'manual';
    }

    getDestinationDreson(item) {
        return item.parentElement.getAttribute('data-dreson');
    }

    getDestinationUrl(item) {
        return item.getAttribute('href');
    }

    getPersonalizationContextOfLink(item) {
        return this.getPersonalizationContextOfContainer(item.parentElement.parentElement);
    }

    getPersonalizationContextOfContainer(item) {
        return item.getAttribute("data-context");
    }

    trackInitialViewLargeShopPromo(container) {
        const promoType = this.getPromoType(container);
        const destinationUrls = this.getAllDestinationUrls(container, promoType);
        const featureOrder = this.getFeatureOrder(container);
        const sources = this.getSources(container, promoType);
        const filledSlots = sources.length;
        const featureIndex = this.getFeatureIndex(container);

        //small shop promos are tracked via cinema
        if (container.getAttribute("data-isslidingcinemaenabled") === "false") {
            this.trackingService.sendViewTrackingEvent(promoType, destinationUrls, null, featureOrder, featureIndex, filledSlots, sources);
        } else {
            let firstSlideContainer = container.querySelectorAll('.promo_shoppromo-large--item')[0];
            firstSlideContainer.setAttribute("data-slidetracked", 'true');
            this.trackingService.sendViewTrackingEvent(promoType, [destinationUrls[0]], null, featureOrder, featureIndex, filledSlots, [sources[0]]);
        }
    }

    trackInitialViewSmallShopPromo(container, lastIndex) {
        const promoType = this.getPromoType(container);
        const personalizationContext = this.getPersonalizationContextOfContainer(container);
        const destinationUrls = this.getAllDestinationUrls(container, promoType, 0, lastIndex);
        const destinationDresons = this.getAllDestinationDresons(container, promoType, 0, lastIndex);
        const featureOrder = this.getFeatureOrder(container);
        const sources = this.getSources(container, promoType, 0, lastIndex);
        const filledSlots = this.getSources(container, promoType).length;
        const featureIndex = this.getFeatureIndex(container);

        this.setTileTracked(container, lastIndex);

        this.trackingService.sendViewTrackingEvent(promoType, destinationUrls, destinationDresons, featureOrder, featureIndex, filledSlots, sources, personalizationContext);
    }

    trackSlide(container, slideIndex, movementType) {
        const promoType = this.getPromoType(container);
        const personalizationContext = this.getPersonalizationContextOfContainer(container);
        const destinationUrls = this.getAllDestinationUrls(container, promoType);
        const destinationDresons = this.getAllDestinationDresons(container, promoType);
        const featureOrder = this.getFeatureOrder(container);
        const sources = this.getSources(container);
        const featureIndex = this.getFeatureIndex(container);

        //decrease filled slots by 2 due to infinite slider buffer
        const filledSlots = sources.length - 2;
        this.trackingService.sendViewTrackingEventHidden(promoType, destinationUrls[slideIndex], destinationDresons != null ? destinationDresons[slideIndex] : null, featureOrder, featureIndex, filledSlots, sources[slideIndex], slideIndex, movementType, personalizationContext);
    }

    trackViewOnCinemaMovement(container, startIndex, endIndexExclusive) {
        const promoType = this.getPromoType(container);
        const personalizationContext = this.getPersonalizationContextOfContainer(container);
        const destinationUrls = this.getAllDestinationUrls(container, promoType, startIndex, endIndexExclusive);
        const destinationDresons = this.getAllDestinationDresons(container, promoType, startIndex, endIndexExclusive);
        const featureOrder = this.getFeatureOrder(container);
        const sources = this.getSources(container, promoType, startIndex, endIndexExclusive);
        const filledSlots = this.getSources(container, promoType).length;
        const featureIndex = this.getFeatureIndex(container);
        let allTiles = container.querySelectorAll('.promo_shoppromo-small--tile');
        Array.from(allTiles)
            .slice(startIndex, endIndexExclusive)
            .forEach((tile, index) => {
                if (tile.getAttribute("data-tracked") !== 'true') {
                    tile.setAttribute("data-tracked", 'true');
                    const slideIndex = parseInt(tile.getAttribute("data-index")) + 1;
                    this.trackingService.sendViewTrackingEventHidden(promoType, destinationUrls[index], destinationDresons[index], featureOrder, featureIndex, filledSlots, sources[index], slideIndex, null, personalizationContext);
                }
            });
    }

    trackCinemaMovementType(container, movementType) {
        const promoType = this.getPromoType(container);
        const featureOrder = this.getFeatureOrder(container);
        const filledSlots = this.getSources(container, promoType).length;
        const featureIndex = this.getFeatureIndex(container);
        this.trackingService.sendCinemaMovementTrackingEventHidden(promoType, featureOrder, featureIndex, filledSlots, movementType);
    }

    getPromoType(container) {
        return container.getAttribute("data-promo-type");
    }

    getAllDestinationUrls(container, promoType, startIndex, lastIndex) {
        const linkSelector = promoType === 'ShopPromotionSmall' ? '.promo_shoppromo-small--tile a' : '.promo_shoppromo-large--image-container a';
        const links = container.querySelectorAll(linkSelector);

        startIndex = startIndex || 0;
        lastIndex = lastIndex || links.length;

        return [].map
            .call(links, a => this.getDestinationUrl(a))
            .slice(startIndex, lastIndex);
    }

    getAllDestinationDresons(container, promoType, startIndex, lastIndex) {
        const linkSelector = promoType === 'ShopPromotionSmall' ? '.promo_shoppromo-small--tile a' : '.promo_shoppromo-large--image-container a';
        const links = container.querySelectorAll(linkSelector);

        if (links == null || links.length === 0){
            return null;
        }

        startIndex = startIndex || 0;

        lastIndex = lastIndex || links.length;

        return [].map
            .call(links, a => this.getDestinationDreson(a))
            .slice(startIndex, lastIndex);
    }

    getFeatureOrder(container) {
        return parseInt(container.parentElement.getAttribute('data-feature-order'), 0);
    }

    getFeatureIndex(container) {
        return parseInt(container.getAttribute('data-feature-index'), 0);
    }

    getSources(container, promoType, startIndex, lastIndex) {
        const selector = promoType === 'ShopPromotionSmall' ? '.promo_shoppromo-small--tile' : '.promo_shoppromo-large--image-container';
        const shoppromoContainer = container.querySelectorAll(selector);

        startIndex = startIndex || 0;
        lastIndex = lastIndex || shoppromoContainer.length;

        return [].map
            .call(shoppromoContainer, shoppromoTile => shoppromoTile.getAttribute('data-source') || 'manual')
            .slice(startIndex, lastIndex);
    }

    findParentContainer(elem, promoType) {
        const className = promoType === 'ShopPromotionSmall' ? 'promo_shoppromo-small--container' : 'promo_shoppromo-large--container';
        while (!elem.classList.contains(className) && (elem = elem.parentElement)) ;
        return elem;
    }

    setTileTracked(container, lastIndex) {
        const tiles = container.querySelectorAll('.promo_shoppromo-small--tile');
        Array.from(tiles)
            .slice(0, lastIndex)
            .forEach(tile => tile.setAttribute("data-tracked", 'true'))
    }

    static loadImages(container) {
        const promoImages = container.querySelectorAll('.promo_shoppromo-large--image');
        const sources = container.querySelectorAll('.promo_shoppromo-large--picture source, .promo_shoppromo-large--overlay source');
        const logos = container.querySelectorAll('.promo_shoppromo-large--logo');

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
