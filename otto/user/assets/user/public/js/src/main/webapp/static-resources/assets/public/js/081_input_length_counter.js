// For JSLINT
/*global window, document, clearTimeout, setTimeout, o_util
 */
/*jslint regexp: true */

var o_user = o_user || {},
    o_util = o_util || {};

o_user.counter = o_user.counter || {};
o_util.event = o_util.event || {};

o_user.counter.inputLengthBuilder = function (document, eventUtil) {
    'use strict';

    function updateLengthCounter(counter) {
        var inputLengthCountIdSelector = counter.getAttribute("data-inputlength-count-id-selector"),
            inputLengthTextIdSelector = counter.getAttribute("data-inputlength-text-id-selector"),
            inputLengthMinOkLength = counter.getAttribute("data-inputlength-min-ok-length"),
            inputLengthMaxOkLength = counter.getAttribute("data-inputlength-max-ok-length"),
            currentLength = counter.value.length;

        document.querySelector(inputLengthCountIdSelector).textContent = currentLength;

        if (currentLength >= inputLengthMinOkLength && currentLength <= inputLengthMaxOkLength) {
            document.querySelector(inputLengthTextIdSelector).style.color = "black";
        } else {
            document.querySelector(inputLengthTextIdSelector).style.color = "#D4021D";
        }
    }

    function init() {
        ["keyup", "change", "blur"].forEach(function (type) {
            eventUtil.delegate(document, type, ".user_js_countInputLength", function () {
                updateLengthCounter(this);
            });
        });
    }

    return {
        init: init
    };
};

