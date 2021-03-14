import Assortment from "./assortment";
import Carousel from "./carousel/carousel";
import BenefitsLoader from "./benefitsLoader";
import {Logger} from "./logger";

window.o_karma_assortment = new Assortment();

export function initCarouselsForAssortment() {

    const largeContainers = document.getElementsByClassName('karma_assortment--container');
    const assortment = window.o_karma_assortment;
    const benefitsLoader = new BenefitsLoader();

    //Make non-cinema or single entry cinema variant visible - for carousel with multiple slides this is done in carousel.js
    [].forEach.call(largeContainers, cinemaDom => {
        if (cinemaDom.getAttribute("data-tracked") !== "true") {
            cinemaDom.setAttribute("data-tracked", "true");
            assortment.trackInitialView(cinemaDom);
        }

        let itemContainer = cinemaDom.querySelector('.karma_assortment--item-container');

        if (itemContainer != null) {

            if (itemContainer.querySelectorAll(".karma_assortment--item").length < 1) {
                Logger.error("Try to initialize assortment teaser with less than 1 element.");
                return;
            }

            if (cinemaDom.getAttribute("data-initialized") !== "true") {
                cinemaDom.setAttribute("data-initialized", "true");

                const isCarousel = itemContainer.classList.contains("karma_assortment--item-scroll-container");
                if (isCarousel) {
                    if (!window.o_promo_carousels) {
                        window.o_promo_carousels = [];
                    }
                    window.o_promo_carousels.push(new Carousel(cinemaDom));
                }
                benefitsLoader.init(cinemaDom, isCarousel);
            }
        }
    });
}
