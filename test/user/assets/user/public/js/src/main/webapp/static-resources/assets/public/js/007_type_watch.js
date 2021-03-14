// For JSLINT
/*global window, document, clearTimeout, setTimeout
 */
/*jslint regexp: true */

var o_user = o_user || {};

o_user.typewatch = o_user.typewatch || {};

o_user.typewatch.presenterBuilder = function (delayedCallbackFunction, delayInMillis) {
    "use strict";

    var recentInputValue,
        delayedFunctionTimeoutReference;

    function isValidKeyCode(keyCode) {
        return !(keyCode === 9 || keyCode === 16 || keyCode === 17 || keyCode === 18);
    }

    /**
     * Eine Funktion wird erst nach , wenn sich der Value des Input Feldes geändert hat und nach einer Tastaturverzögerung von
     * 300ms.
     */
    function passwordInputKeyPressed(event) {
        var element = event.target;

        if (isValidKeyCode(event.keyCode)) {
            if (recentInputValue !== element.value) {
                recentInputValue = element.value;
                clearTimeout(delayedFunctionTimeoutReference);
                delayedFunctionTimeoutReference = setTimeout(function () {
                    delayedCallbackFunction(element);
                }, delayInMillis);
            } else if (recentInputValue === "" && element.value === "") {
                clearTimeout(delayedFunctionTimeoutReference);
                delayedCallbackFunction(element);
            }
        }
    }

    /**
     * Die Zeichen Tab(9), Shift (16), Strg(17) und Alt (18) sollen auf den InputFelder ignoriert werden.
     */
    function saveCurrentInputValue(event) {
        if (isValidKeyCode(event.which)) {
            recentInputValue = event.target.value;
        }
    }

    function registerOnElement(element) {
        element.addEventListener("keyup", passwordInputKeyPressed);
        element.addEventListener("keypress", saveCurrentInputValue);
    }

    return {
        registerOnElement: registerOnElement
    };
};