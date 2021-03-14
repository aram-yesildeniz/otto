// For JSLINT
/*global window, document, o_global, o_util
 */

var o_user = o_user || {},
    o_util = o_util || {};

o_user.common = o_user.common || {};
o_user.common.button = o_user.common.button || {};
o_util.event = o_util.event || {};

o_user.common.button.viewBuilder = function () {
    'use strict';

    function elementSiblings(element, searchClass) {
        return Array.prototype.filter.call(element.parentNode.children, function (child) {
            return child !== element && child.classList.contains(searchClass);
        });
    }

    function disableButton(event) {
        var form = event.target,
            button = form.querySelector("[data-has-active-spinner=true]");

        if (!!button) {
            button.setAttribute("disabled", "true");
        }
    }

    function showSpinner(button, disableOnSubmit) {
        var spinnerOverlay,
            form;

        // Disable button after submit event is fired, so that it cannot cancel it.
        if (!!disableOnSubmit) {
            form = button.closest("form");

            form.addEventListener("submit", disableButton);
        } else {
            button.setAttribute("disabled", "true");
        }

        button.setAttribute("style", "opacity: 0");
        button.setAttribute("data-has-active-spinner", "true");
        spinnerOverlay = elementSiblings(button, "us_js_spinnerButtonOverlay");

        if (Array.isArray(spinnerOverlay) && spinnerOverlay.length > 0) {
            spinnerOverlay[0].setAttribute("style", "display: block");
        }
    }

    function showButton(button) {
        var spinnerOverlay;

        button.removeAttribute("disabled");
        button.removeAttribute("data-has-active-spinner");
        button.setAttribute("style", "opacity: 1");
        spinnerOverlay = elementSiblings(button, "us_js_spinnerButtonOverlay");

        if (Array.isArray(spinnerOverlay) && spinnerOverlay.length > 0) {
            spinnerOverlay[0].setAttribute("style", "display: none");
        }
    }

    return {
        showSpinner: showSpinner,
        showButton: showButton
    };
};

o_user.common.button.presenterBuilder = function (document, view, eventUtil) {
    'use strict';

    function registerDefaultButton() {
        // click handler für default button
        eventUtil.delegate(document, "click", ".user_system_rwd .us_js_form_button", function (event) {
            var eventValueForRightMouseButtonClick = 3;
            if (event.which !== eventValueForRightMouseButtonClick) {
                view.showSpinner(this, true);
            }
        });
    }

    function init() {
        registerDefaultButton();
    }

    return {
        init: init
    };
};
