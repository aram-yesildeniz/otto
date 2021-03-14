var o_global = o_global || {};

o_global.helper = o_global.helper || {};

(function() {
    "use strict";

    /**
     * Sets up Events for textExpander100-pattern and message100 pattern
     */
    function initClickListeners() {
        document.addEventListener("click", function(event) {
            var target = event.target;

            // Sets up Events for message100-pattern
            if (target.classList.contains("js_message__close")) {
                var message = o_util.dom.getParentByClassName(target, "p_message");

                if (message) {
                    message.style.display = "none";
                }
            }
        });
    }

    o_global.eventLoader.onReady(10, initClickListeners);
})();
