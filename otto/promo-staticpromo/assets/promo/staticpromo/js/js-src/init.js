import PromoStaticPromo from "./promo_staticpromo";

window.o_promo_staticpromo = new PromoStaticPromo();

export function initPromoStaticpromo() {
    const containers = document.getElementsByClassName('promo_staticpromo-container');

    [].forEach.call(containers, container => {
        if (container.getAttribute("data-tracked") !== "true") {
            container.setAttribute("data-tracked", "true");
            window.o_promo_staticpromo.trackView(container);
        }
    });
}
