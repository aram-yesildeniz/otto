/* global o_util */
window.o_global = window.o_global || {};

o_global.goBackTrigger = o_global.goBackTrigger || (function() {
    "use strict";

    o_global.eventLoader.onLoad(100, function() {
        o_util.event.delegate(document, "click", ".js_goBack", function(e) {
            var url = this.getAttribute("href");

            e.preventDefault();
            window.history.back();
            if (url) {
                setTimeout(function() {
                    window.location = url;
                }, 200);
            }
        });
    });
}());
