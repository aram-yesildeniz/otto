var AS = window.AS || {},
    o_global = o_global || {},
    o_util = o_util || {};

o_global.pali = o_global.pali || {};

o_global.popup = o_global.popup || (function() {
        "use strict";

        /**
         * @param {Number} width    The width of the popup
         * @param {Number} height   The height of the popup
         *
         * @returns {String}        Position coordinates of the popup
         */
        function getCenterPosition(width, height) {
            var x = (screen.width - width) / 2,
                y = (screen.height - height) / 2;

            return ",left=" + x + ",top=" + y + ",screenX=" + x + ",screenY=" + y;
        }

        /**
         * @param {String} url      The url to the popup content.
         * @param {String} name     The title of the popup.
         * @param {Number} width    The width of the popup.
         * @param {Number} height   The height of the popup.
         */
        function openPopup(url, name, width, height) {
            var centerPosition,
                options,
                newWindow;

            if (!name || name === "") {
                name = "popup";
            }

            if (!parseInt(width, 10)) {
                width = 800;
            }

            if (!parseInt(height, 10)) {
                height = 575;
            }

            centerPosition = getCenterPosition(width, height);
            options = "width=" + width + ",height=" + height + ",toolbar=no,location=no,directories=no,scrollbars=yes,status=no,menubar=no,resizable=no" + centerPosition;

            newWindow = open(url, name, options);
            if (!!newWindow) {
                newWindow.focus();
            }

            // Jump out of the function, if current page is the shopoffice preview.
            if (!!window.AS.toggles && !!window.AS.toggles.isPreview) {
                return;
            }

            if (url.indexOf("http") === 0 && url.indexOf(document.location.hostname) === -1 && typeof o_tracking !== "undefined" && o_tracking.bct) {
              o_tracking.bct.sendEventToTrackingServer({
                    "ot_Aussprung": url
                });
            }
        }

        /**
         * @param {Object} e      The click event
         */
        function openHandler(e) {
            var trigger = o_util.event.getTarget(e),

                // When event bubbled up from a child node, get its ancestor
                target = trigger.classList.contains("js_openInPopup") ? trigger : o_util.dom.getParentByClassName(trigger, "js_openInPopup"),
                url = target.getAttribute("href") || target.getAttribute("data-popup-href") || "";

            // ASSETS-131: don't open popups in the app
            if(o_util.cookie.exists("app")){
                return;
            }

            openPopup(url, target.getAttribute("data-popup-name"), target.getAttribute("data-popup-width"), target.getAttribute("data-popup-height"));

            e.preventDefault();
        }

        /**
         * Init function
         */
        function init() {
            o_util.event.delegate(document, "click", ".js_openInPopup", openHandler);
        }

        o_global.eventLoader.onReady(10, init);

        return {
            "open": openPopup
        };
    }());

o_global.pali.initCloseWindow = o_global.pali.initCloseWindow || function() {
        "use strict";

        o_util.event.delegate(document, "click", ".js_closeWindow", function() {
            window.close();
        });
    };

o_global.pali.initCloseWindow();
