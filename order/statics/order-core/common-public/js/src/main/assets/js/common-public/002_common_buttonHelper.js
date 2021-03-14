var o_order = window.o_order || {};
o_order.common = o_order.common || {};

o_order.common.buttons = o_order.common.buttons || (function () {
    'use strict';

    var module = {};

    function toggle(button, forceShowButton) {
        var spinnerWrapper = o_order.utils.next(button, 'order_js_button_spinner'),
            spinner = document.createElement('div');

        spinner.classList.add("p_loader100");

        function styleSpinner() {
            spinnerWrapper.style.width = button.offsetWidth + "px";
            spinnerWrapper.style.height = button.offsetHeight + "px";
            spinnerWrapper.style.float = button.style.float;
            spinnerWrapper.style.verticalAlign = 'middle';
            spinnerWrapper.style.display = 'table-cell';
            spinnerWrapper.style.margin = 'auto';
            spinner.style.margin = 'auto';
        }

        function isShowSpinner() {
            return button.style.display !== 'none' && !forceShowButton;
        }

        if (isShowSpinner() && !spinnerWrapper) {
            spinnerWrapper = document.createElement('div');
            spinnerWrapper.classList.add("order_js_button_spinner");
            spinnerWrapper.appendChild(spinner);
            styleSpinner();
            button.style.display = 'none';
            button.insertAdjacentHTML('afterend', spinnerWrapper.outerHTML);
        } else if (isShowSpinner()) {
            styleSpinner();
            button.style.display = 'none';
        } else {
            button.style.display = 'block';
            if (spinnerWrapper) {
                spinnerWrapper.style.display = 'none';
            }
        }
    }

    module.toggleLoading = function (buttons, forceShowButton) {
        if (buttons) {
            if (buttons.length) {
                [].forEach.call(buttons, function (button) {
                    toggle(button, forceShowButton);
                });
            } else {
                toggle(buttons, forceShowButton)
            }
        }
    };

    return module;
}());

