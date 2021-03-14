import {Logger} from "./logger";

export class Area {
    constructor(container) {
        this.leverContainer = container.querySelector('.karma_brand_promo-lever-container');
        this.ctaContainer = container.querySelector('.karma_brand_promo-cta-container');
        this.leverLoaded = this.leverContainer.getAttribute("data-lever-loaded");
        this.promotedDreson = container.getAttribute("data-promo-dreson");
        this.featurePositionOfShoppromo = this._getFeatureOrder(container);
        this.teaserPosition = -1;
        this.contextDreson = this._getContextDreson(container);
        Logger.log("Create new Area", this);
    }

    setLeverLoaded() {
        this.leverContainer.setAttribute("data-lever-loaded", "true");
        this.leverLoaded = true;
    }

    _getFeatureOrder(container) {
        let parentContainer = container;
        while (parentContainer && !parentContainer.getAttribute('data-feature-order')) {
            parentContainer = parentContainer.parentElement;
        }
        return parentContainer ? parseInt(parentContainer.getAttribute('data-feature-order')) : -1;
    }

    _getContextDreson(container) {
        let parentContainer = container;
        while (parentContainer && !parentContainer.getAttribute('data-context-dreson')) {
            parentContainer = parentContainer.parentElement;
        }
        return parentContainer ? parentContainer.getAttribute('data-context-dreson') : "";
    }

    withTeaserPosition(pos) {
        this.teaserPosition = pos;
        return this;
    }
}

export default class BenefitsLoader {

    init(container) {
        Logger.log("Initialized BenefitsLoader");
        const promos = container.querySelectorAll('.karma_brand_promo-container');

        const areas = [].map.call(promos, item => {
            return new Area(item);
        });

        const leverPromises = areas
            .filter(area => area.promotedDreson.indexOf("(ref.") === -1)
            .filter(area => area.leverLoaded === 'false')
            .map((area, index) => {
                return this.appendAndGetLeverFor(area.withTeaserPosition(index + 1));
            });
    }

    appendLeverToArea(lever, area, invoke = true) {
        Logger.log("Append lever to area.", lever, area);
        area.ctaContainer.style.visibility = 'hidden';
        area.leverContainer.appendChild(lever.cloneNode(true));
        area.leverContainer.style.visibility = 'visible';
        area.leverContainer.style.opacity = '1';
        area.setLeverLoaded();
        if (invoke) {
            preload_polyfill_invoke(area.leverContainer);
            o_util.hardcore.executeInlineScripts(area.leverContainer); // TODO Remove
        }
    }

    appendAndGetLeverFor(area) {
        const dreson = area.promotedDreson;
        const featurePosition = area.featurePositionOfShoppromo;
        const teaserPosition = area.teaserPosition;
        const contextDreson = area.contextDreson;

        return window.o_util.ajax({
            "url": `/benefit-presentation/lever/slideshow?dreson=${dreson}&featurePosition=${featurePosition}&teaserPosition=${teaserPosition}&pageContextDreson=${contextDreson}`,
            "method": "GET"
        }).then(response => {
                if (response.status === 200) {
                    const lever = window.o_util.dom.stringToDocumentFragment(response.responseText);
                    if (response.getResponseHeader('x-aggregation') === 'tracking') {
                        return Promise.resolve({
                            "success": false,
                            "status": `Benefit for ${dreson} is used for tracking only`
                        })
                    } else if (lever !== undefined) {
                        this.appendLeverToArea(lever, area);
                        return Promise.resolve({"lever": lever, "area": area, "success": true});
                    } else {
                        Logger.warn(`DocumentFragment for ${dreson} is undefined`);
                        return Promise.resolve({
                            "success": false,
                            "status": `DocumentFragment for ${dreson} is undefined`
                        });
                    }
                } else {
                    Logger.warn(`Benefit answered with ${response.status} for ${dreson}`);
                    return Promise.resolve({
                        "success": false,
                        "status": `Benefit answered with ${response.status} for ${dreson}`
                    });
                }
            }
        );
    }
}