import BrandPromoContainer from "../brandpromo/brandPromoContainer";
import TrackingData from "./trackingData";
import ParentLabels from "./parentLabels";
import { Logger } from "../logger";

export default class TrackingService {
    eventBus;

    constructor(eventbus) {
        this.eventBus = eventbus || {
            emit: (channel, payload) => {
                Logger.warn(`Sending to ${channel} via debug eventBus`, payload)
            }
        }
    }

    trackBrandPromoContainer(brandPromoContainer) {
        if (!brandPromoContainer.tracked) {
            brandPromoContainer.setTracked();
            brandPromoContainer.setStatus("loaded");

            this._trackView(brandPromoContainer);

            // TODO brandPromoContainer.promos.forEach()
            [].forEach.call(brandPromoContainer.promos, (brandPromo) => {
                // We must submit a bind so when the handler is triggered 'this' is passed as first argument and we
                // can use it in our registered handlers (e.g. to call this.eventBus)
                brandPromo.registerClickHandler(this._clickHandler.bind(this));
                brandPromo.registerSeenHandler(this._seenHandler.bind(this));
            });
        }
    }

    _trackView(brandPromoContainer) {
        let childes = brandPromoContainer.promos.map((brandPromo, index) => {
            return TrackingData.builder()
                .withName(brandPromo.name)
                .withId(brandPromo.id)
                .withStatus(brandPromo.status)
                .withPosition(index)
                .withParentId(brandPromoContainer.id)
                .withLabels(brandPromo.trackingLabels)
                .build()
        });
        let parent = [
            TrackingData.builder()
                .withName(brandPromoContainer.name)
                .withId(brandPromoContainer.id)
                .withStatus(brandPromoContainer.status)
                .withLabels(ParentLabels.builder()
                    .withFeatureSequence(brandPromoContainer.featureSequence)
                    .withCount(brandPromoContainer.promos.length)
                    .build()
                ).build()
        ];

        let payload = parent.concat(childes);

        this.eventBus.emit('tracking.bct.addFeaturesToPageImpression', payload)
            .catch(reason => {
                Logger.error("Could not emit view event", reason)
            })
        Logger.log("viewTracking", payload)
    }

    _seenHandler(brandPromo) {
        let childes = TrackingData.builder()
            .withName(brandPromo.name)
            .withId(brandPromo.id)
            .withStatus("visible")
            .withPosition(brandPromo.position)
            .withParentId(brandPromo.parentId)
            .withLabels(brandPromo.trackingLabels)
            .build();

        let parent = TrackingData.builder()
            .withName(BrandPromoContainer.NAME)
            .withId(brandPromo.parentId)
            .withStatus(brandPromo.status)
            .build();

        // this.eventBus.emit('tracking.bct.addFeaturesToPageImpression', [parent, childes]);
        Logger.log("seenTracking", [parent, childes])
    }

    _clickHandler(brandPromo) {
        Logger.log("clickTracking", brandPromo)
    }

}