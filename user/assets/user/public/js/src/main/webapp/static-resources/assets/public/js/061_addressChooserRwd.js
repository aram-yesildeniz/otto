// For JSLINT
/*global document, o_global, o_util
 */

var o_user = o_user || {},
    o_util = o_util || {};

o_user.addressChooser = o_user.addressChooser || {};
o_user.addressChooser.rwd = o_user.addressChooser.rwd || {};
o_util.event = o_util.event || {};

o_user.addressChooser.rwd.viewBuilder = function (document) {
    'use strict';

    function copySelectedAddressToHiddenFields(radioInput) {
        // write address into hidden fields
        document.querySelector(".user_js_street").value = radioInput.getAttribute("data-street");
        document.querySelector(".user_js_houseNumber").value = radioInput.getAttribute("data-housenumber");
        document.querySelector(".user_js_postalCode").value = radioInput.getAttribute("data-postalcode");
        document.querySelector(".user_js_city").value = radioInput.getAttribute("data-city");
    }

    function markAddressOption(elem) {
        var selectedAddressOptionClass = 'us_addressChooser__option--selected',
            radioInput = elem.querySelectorAll(".us_js_addressChooserOptionInput")[0],
            radioInputOuterDiv = elem,
            elements = document.querySelectorAll(".us_js_addressChooserOption");
        Array.prototype.forEach.call(elements, function (element) {
            if (element !== elem) {
                element.classList.remove(selectedAddressOptionClass);
            }
        });
        radioInput.checked = true;
        radioInputOuterDiv.classList.add(selectedAddressOptionClass);
        copySelectedAddressToHiddenFields(radioInput);
    }

    function getSelectedAddressType() {
        var selectedInput = document.querySelector(".us_js_addressChooserOptionInput:checked");
        if (selectedInput) {
            return selectedInput.getAttribute("data-address-type");
        }
    }

    return {
        markAddressOption: markAddressOption,
        getSelectedAddressType: getSelectedAddressType
    };
};

o_user.addressChooser.rwd.presenterBuilder = function (document, view, tracking, eventUtil) {
    'use strict';

    function trackNewDeliveryAddressSuggestedAddressType() {
        var selectedAddressType = view.getSelectedAddressType();
        if (selectedAddressType) {
            tracking.sendTrackingInformation({user_AddressPicker: "NewDeliveryAddress_" + view.getSelectedAddressType()}, "event");
        }
    }

    function init() {
        eventUtil.delegate(document, "click", ".us_js_addressChooserOption", function () {
            view.markAddressOption(this);
        });
        document.addEventListener("user.event.trackNewDeliveryAddressSuggestedAddressType", function () {
            trackNewDeliveryAddressSuggestedAddressType();
        });
    }

    return {
        init: init
    };
};