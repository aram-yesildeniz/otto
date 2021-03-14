import ChildLabels from "../tracking/childLabels";

export default class BrandPromo {
    name;
    id;
    status;
    parentId;
    position;
    trackingLabels;

    _element

    registerClickHandler(fn) {
        this._element.addEventListener("click", () => {
            fn(this)
        })
    }

    registerSeenHandler(fn) {
        const observer = new IntersectionObserver((e, o) => {
            const entry = e[0];
            if (entry.isIntersecting) {
                o.unobserve(this._element);
                fn(this);
            }
        }, {threshold: 0.75});
        observer.observe(this._element);
    }

    static fromElement(elem) {
        let trackingData = JSON.parse(elem.getAttribute("data-tracking")) || {};
        let promotedRule = elem.getAttribute("data-promo-dreson") || "not_found";

        let brandPromo = new BrandPromo();
        brandPromo._element = elem;

        return BrandPromo.builder(brandPromo)
            .withName("BrandShopPromotionLarge")
            .withStatus("loaded")
            .withTrackingLabels(ChildLabels.builder()
                .withAffinity(trackingData["affinity"])
                .withCPM(trackingData["cpm"])
                .withTargetPSR(promotedRule)
                .withScore(trackingData["score"])
                .withPacingFactor(trackingData["pacingFactor"])
                .withOfferName(trackingData["offerName"])
                .withOfferCode(trackingData["offerCode"])
                .withImageId(trackingData["imageId"])
                .withTreatmentCode(trackingData["treatmentCode"])
                .withCampaignAffinity(trackingData["campaignAffinities"] || "")
                .withInteractionPoint(trackingData["interactionPoint"])
                .build());
    }

    static builder(copy) {
        let brandPromo = copy || new BrandPromo()
        return {
            withName: (val) => {
                brandPromo.name = val;
                return this.builder(brandPromo);
            },
            withId: (val) => {
                brandPromo.id = val;
                return this.builder(brandPromo);
            },
            withStatus: (val) => {
                brandPromo.status = val;
                return this.builder(brandPromo);
            },
            withParentId: (val) => {
                brandPromo.parentId = val;
                return this.builder(brandPromo);
            },
            withPosition: (val) => {
                brandPromo.position = val;
                return this.builder(brandPromo);
            },
            withTrackingLabels: (val) => {
                brandPromo.trackingLabels = val;
                return this.builder(brandPromo);
            },

            build: () => brandPromo
        }
    }
}