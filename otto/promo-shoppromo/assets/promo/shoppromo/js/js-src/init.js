import PromoShopPromo from "./promo_shoppromo";
import PromoBrandShopPromo from "./promo_brandshoppromo";
import Cinema from "./cinema/cinema";
import Carousel from "./carousel/carousel";
import BenefitsLoader from "./benefitsLoader";

window.o_promo_shoppromo = new PromoShopPromo();

export function initPromoBrandShopPromo() {
    const containers = document.getElementsByClassName('promo_brandshoppromo--container');

    [].forEach.call(containers, container => {
        if (container.getAttribute("data-tracked") !== "true") {
            container.setAttribute("data-tracked", "true");
            new PromoBrandShopPromo(container);
        }
    });
}

export function initCarouselsForLargeShopPromos() {

    const largeContainers = document.getElementsByClassName('promo_shoppromo-large--container');
    const promoShopPromo = window.o_promo_shoppromo;
    const benefitsLoader = new BenefitsLoader();

    //Make non-cinema or single entry cinema variant visible - for carousel with multiple slides this is done in carousel.js
    [].forEach.call(largeContainers, cinemaDom => {
        if (cinemaDom.getAttribute("data-isslidingcinemaenabled") === "false") {
            cinemaDom.classList.add('promo_shoppromo-large--visible');
            PromoShopPromo.loadImages(cinemaDom);
        }

        if (cinemaDom.getAttribute("data-tracked") !== "true") {
            cinemaDom.setAttribute("data-tracked", "true");
            promoShopPromo.trackInitialViewLargeShopPromo(cinemaDom);
        }

        let itemContainer = cinemaDom.querySelector('.promo_shoppromo-large--item-container');
        if (itemContainer != null) {
            if (cinemaDom.getAttribute("data-initialized") !== "true") {
                cinemaDom.setAttribute("data-initialized", "true");

                const isCarousel = itemContainer.classList.contains("promo_shoppromo-large--item-scroll-container");
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

export function initCinemasForSmallShopPromos() {
    const config = {
        containerSelector: '.promo_shoppromo-small--tile-container',
        tileSelector: '.promo_shoppromo-small--tile',
        buttonLeftSelector: '.promo_shoppromo-small--cinema-button-left',
        buttonRightSelector: '.promo_shoppromo-small--cinema-button-right',
        buttonHideClass: 'promo_shoppromo-small--cinema-button-hide',
        tilePaddingRight: 8
    };

    const cinemaDomList = document.querySelectorAll(".promo_shoppromo-small--cinema-container");
    [].forEach.call(cinemaDomList, cinemaDom => {
        if (cinemaDom.getAttribute("data-initialized") !== "true") {
            cinemaDom.setAttribute("data-initialized", "true");
            new Cinema(cinemaDom, config);
        }
    });
}