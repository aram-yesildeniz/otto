/*jslint nomen: true */
/* globals document, o_util */
var o_global = o_global || {};

o_global.helper = o_global.helper || {};

(function() {
    "use strict";

    /**
     * Sets up Events for textExpander100-pattern and message100 pattern
     */
    function initClickListeners() {
        o_util.event.delegate(document, "click", ".js_textExpander100__link", function(event) {
            var target = o_util.event.getTarget(event),
                textExpander = o_util.dom.getParentByClassName(target, "p_textExpander100"),
                customEvent,
                isOpen;

            if (!!textExpander) {
                textExpander.classList.toggle("p_expander--decrease");
                isOpen = !!textExpander.classList.contains("p_expander--decrease");
                customEvent = new CustomEvent("textExpanderChange", {
                    "detail": {
                        "isOpen": isOpen
                    },
                    "bubbles": true
                });

                this.dispatchEvent(customEvent);
            }
        });
    }

    o_global.eventLoader.onReady(10, initClickListeners);
})();
