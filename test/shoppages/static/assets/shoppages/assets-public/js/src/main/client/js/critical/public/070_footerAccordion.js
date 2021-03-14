'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.footerAccordion = (() => {
    function init () {
        const elements = document.querySelectorAll('.js_footerAccordionHeader');
        if (elements !== null && elements.length > 0) {
            Array.prototype.forEach.call(elements, (element) => {
                element.addEventListener('click', (event) => {
                    o_util.dom.getParentByClassName(event.currentTarget, 'sp_footerAccordion').classList.toggle(
                        'sp_open');
                });
            });
        }
    }

    return {
        init
    };
})();

o_global.eventLoader.onLoad(100, () => {
    if (window.shoppagesFooterAccordionInitialized) {
        return;
    }
    window.shoppagesFooterAccordionInitialized = true;
    o_shoppages.footerAccordion.init();
});
