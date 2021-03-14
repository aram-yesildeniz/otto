import BrandPromo from "./brandPromo";

export default class BrandPromoContainer {
    name;
    id;
    tracked;
    promos;
    featureSequence;
    status;

    _element;

    static PROMO_SELECTOR = ".karma_brand_promo-container";
    static NAME = "karma-promo";

    constructor() {
    }

    setTracked() {
        this.tracked = true
        this._element.setAttribute("data-tracked", "true")
    }

    setStatus(status) {
        this.status = status
        this._element.setAttribute("data-status", status)
    }

    static fromElement(elem) {
        let parent = elem.parentElement;
        let order = parent.getAttribute("data-feature-order") || "0";
        let parentId = `${BrandPromoContainer.NAME}-${order}`;


        let brandPromos = [];
        [].forEach.call(elem.querySelectorAll(BrandPromoContainer.PROMO_SELECTOR), (el, index) => {
            brandPromos.push(BrandPromo.fromElement(el)
                .withPosition(index)
                .withParentId(parentId)
                .withId(`${parentId}-${index}`)
                .build());
        });

        let container = new BrandPromoContainer();
        container._element = elem;

        return BrandPromoContainer.builder(container)
            .withName(BrandPromoContainer.NAME)
            .withId(parentId)
            .withFeatureSequence(parseInt(order))
            .withStatus("loaded")
            .withTracked(elem.getAttribute("data-tracked") === "true")
            .withPromos(brandPromos)
    }

    static builder(copy) {
        let container = copy || new BrandPromoContainer()
        return {
            withName: (val) => {
                container.name = val;
                return this.builder(container)
            },
            withId: (val) => {
                container.id = val;
                return this.builder(container)
            },
            withFeatureSequence: (val) => {
                container.featureSequence = val;
                return this.builder(container)
            },
            withTracked: (val) => {
                container.tracked = val;
                return this.builder(container)
            },
            withPromos: (val) => {
                container.promos = val;
                return this.builder(container)
            },
            withStatus: (val) => {
                container.status = val;
                return this.builder(container)
            },
            build: () => container
        }
    }
}