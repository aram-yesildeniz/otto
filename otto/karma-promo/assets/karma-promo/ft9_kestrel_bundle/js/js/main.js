import IntersectionObserverPolyfill from './intersectionObserverPolyfill'
import TrackingService from "./tracking/trackingService";
import BrandPromoContainer from "./brandpromo/brandPromoContainer";
import BenefitsLoader from "./benefitsLoader";
import MetaBrandPromoTracking from "./metaBrandPromoTracking";

window.karma = window.karma || {};

IntersectionObserverPolyfill(window, document);

o_global.eventLoader.onAllScriptsExecuted(98, function () {

    window.karma.tracking_service = window.karma.tracking_service || new TrackingService(window.o_global.eventQBus);
    window.karma.legacy_tracking = window.karma.legacy_tracking || new MetaBrandPromoTracking();

    [].forEach.call(document.querySelectorAll(".karma_brand_promo-list"), (container) => {
        let c = BrandPromoContainer.fromElement(container).build();
        window.karma.tracking_service.trackBrandPromoContainer(c);
    });

    new BenefitsLoader().init(document);
    window.karma.legacy_tracking.init();
});
