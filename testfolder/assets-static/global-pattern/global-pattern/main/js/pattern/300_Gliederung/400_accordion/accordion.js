/* globals o_util */
var o_global = o_global || {};

o_global.pali = o_global.pali || {};
o_global.pali.initAccordion = o_global.pali.initAccordion || (function() {
    "use strict";

    /**
     * Accordion
     */
    function initAccordion() {
        o_util.event.delegate(document, "click", ".p_accordion__header", function() {
            var isOpen,
                event;

            this.classList.toggle("p_accordion__header--open");

            isOpen = !!this.classList.contains("p_accordion__header--open");
            event = new CustomEvent("accordionChange", {
                "detail": {
                    "isOpen": isOpen
                },
                "bubbles": true
            });

            this.dispatchEvent(event);
        });
    }

    o_global.eventLoader.onReady(10, initAccordion);
})();
