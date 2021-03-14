import PromoStaticContent from "./promo_staticcontent";

window.o_promo_staticcontent = new PromoStaticContent();

export function initPromoStaticcontent() {
    const containers = document.getElementsByClassName('promo_staticcontent--trackable-widget');

    [].forEach.call(containers, container => {
        if (container.getAttribute("data-tracked") !== "true") {
            container.setAttribute("data-tracked", "true");
            window.o_promo_staticcontent.trackView(container);
        }
    });
}
