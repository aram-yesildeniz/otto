import {Logger} from "./logger";

export class Slide {

    constructor(container) {
        this.slideContainer = container;
        this.leverContainer = container.querySelector('.promo_shoppromo-large--benefits-container');
        this.ctaContainer = container.querySelector('.promo_shoppromo-large--cta-container');
        this.leverLoaded = this.leverContainer.getAttribute("data-promo-lever-loaded");
        this.promotedDreson = container.getAttribute("data-promo-dreson");
        this.featurePositionOfShoppromo = this._getFeatureOrder();
        this.teaserPosition = -1;
        this.pageContextDreson = this._getPageContextDreson();
    }

    setLeverLoaded() {
        this.leverContainer.setAttribute("data-promo-lever-loaded", "true");
        this.leverLoaded = true;
    }

    _getFeatureOrder() {
        let parentContainer = this.slideContainer;
        while (parentContainer && !parentContainer.getAttribute('data-feature-order')) {
            parentContainer = parentContainer.parentElement;
        }
        return parentContainer ? parseInt(parentContainer.getAttribute('data-feature-order')) : -1;
    }

    _getPageContextDreson() {
        let parentContainer = this.slideContainer;
        while (parentContainer && !parentContainer.getAttribute('data-page-context-dreson')) {
            parentContainer = parentContainer.parentElement;
        }
        return parentContainer ? parentContainer.getAttribute('data-page-context-dreson') : "";
    }

    withTeaserPosition(pos) {
        this.teaserPosition = pos;
        return this;
    }
}

export default class BenefitsLoader {

    init(carouselContainer, isCarousel = true) {
        const items = carouselContainer.querySelectorAll('.promo_shoppromo-large--item');

        const slides = [].map.call(items, item => {
            return new Slide(item);
        });

        const slidesForLever = isCarousel ? slides.slice(1, slides.length - 1) : slides;

        const leverPromises = slidesForLever
            .filter(slide => slide.promotedDreson.indexOf("(ref.") === -1)
            .filter(slide => slide.leverLoaded === 'false')
            .map((slide, index) => {
                return this.appendAndGetLeverFor(slide.withTeaserPosition(index + 1));
            });

        if (isCarousel && leverPromises.length > 0) {
            this.appendLeverToBuffer(slides, leverPromises);
        }
    }

    appendLeverToBuffer(slides, leverPromises) {
        const firstBuffer = slides[0];
        const lastBuffer = slides[slides.length - 1];

        // get first and last slide from container because they are the buffer
        leverPromises[0].then(value => {
            if (value.success && value.slide.promotedDreson === lastBuffer.promotedDreson) {
                this.appendLeverToSlide(value.lever, lastBuffer, true);
            }
        });

        leverPromises[leverPromises.length - 1].then(value => {
            if (value.success && value.slide.promotedDreson === firstBuffer.promotedDreson) {
                this.appendLeverToSlide(value.lever, firstBuffer, true);
            }
        });
    }


    appendLeverToSlide(lever, slide, isBufferSlide = false) {
        slide.ctaContainer.style.visibility = 'hidden';
        const node = lever.cloneNode(true);
        if (isBufferSlide) {
            let querySelector = node.querySelector('.benefit_lever.benefit_lever_slideshow');
            querySelector.setAttribute("data-tracked", true)
        }
        slide.leverContainer.appendChild(node);
        slide.leverContainer.style.visibility = 'visible';
        slide.leverContainer.style.opacity = '1';
        slide.setLeverLoaded();
        if (!isBufferSlide) {
            preload_polyfill_invoke(slide.leverContainer);
            o_util.hardcore.executeInlineScripts(slide.leverContainer);
        }
    }

    appendAndGetLeverFor(slide) {
        const dreson = slide.promotedDreson;
        const featurePosition = slide.featurePositionOfShoppromo;
        const teaserPosition = slide.teaserPosition;
        const pageContextDreson = slide.pageContextDreson;

        return window.o_util.ajax({
            "url": `/benefit-presentation/lever/slideshow?dreson=${dreson}&featurePosition=${featurePosition}&teaserPosition=${teaserPosition}&pageContextDreson=${pageContextDreson}`,
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
                        this.appendLeverToSlide(lever, slide);
                        return Promise.resolve({"lever": lever, "slide": slide, "success": true});
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