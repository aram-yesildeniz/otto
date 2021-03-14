var o_util = o_util || {},
    o_global = o_global || {};

(function () {
    "use strict";

    var CLEAR_WRAPPER_CLASS = "p_form__input-clear-wrapper",
        CLEAR_BUTTON_CLASS = "p_form__input-clear-button",
        FORM_GROUP_CONTENT_CLASS = "p_formGroup__content",
        CLEAR_BUTTON_HIDE_CLASS = "p_form__input-clear-button--hide";

    function _onClickClear(e) {
        var clearButton = o_util.dom.getParentByClassName(e.target, CLEAR_BUTTON_CLASS),
            inputElement = clearButton.parentNode.lastChild;

        if (inputElement.value.length > 0) {
            inputElement.value = "";
            clearButton.classList.add(CLEAR_BUTTON_HIDE_CLASS);
            inputElement.focus();
        }

        e.preventDefault();
    }

    function _createWrapper(hasPaliClass) {
        var icon = document.createElement("span"),
            clearButton = document.createElement("button"),
            clearButtonWrapper = document.createElement("div");

        clearButton.classList.add(CLEAR_BUTTON_CLASS, CLEAR_BUTTON_HIDE_CLASS);
        clearButton.setAttribute("type", "button");
        clearButton.title = "Eingabe löschen";
        clearButtonWrapper.classList.add(CLEAR_WRAPPER_CLASS);

        if(hasPaliClass){
            clearButtonWrapper.classList.add(FORM_GROUP_CONTENT_CLASS);
        }


        icon.classList.add("p_iconFont");
        icon.innerHTML = "X";

        clearButton.appendChild(icon);
        clearButtonWrapper.appendChild(clearButton);
        clearButton.addEventListener("click", _onClickClear);

        return clearButtonWrapper;
    }

    function _hideClearButton(inputElement) {
        var clearButton = inputElement.parentNode.firstChild;

        clearButton.classList.add(CLEAR_BUTTON_HIDE_CLASS);
    }

    function _showHideButton(inputElement) {
        var clearButton = inputElement.parentNode.firstChild;

        clearButton.classList.remove(CLEAR_BUTTON_HIDE_CLASS);
    }

    function _onKeyUp(e) {
        var inputElement = e.target,
            code = e.keyCode || e.which;
        // Detect backspace or delete key or cut event
        if (inputElement.value.length === 0 && (code === 8 || code === 46 || e.type === "cut" || e.type === "paste")) {
            _hideClearButton(inputElement);
        } else if (inputElement.value.length > 0) {
            _showHideButton(inputElement);
        }
    }

    function _onFocus(e) {
        var inputElement = e.target,
            clearButtonWrapper,
            paliClassName;

        e.preventDefault();

        clearButtonWrapper = _createWrapper(inputElement.classList.contains(FORM_GROUP_CONTENT_CLASS));

        inputElement.classList.remove(paliClassName);
        inputElement.parentNode.appendChild(clearButtonWrapper);
        clearButtonWrapper.appendChild(inputElement);

        inputElement.setAttribute("data-show-clear-button", "done");

        inputElement.addEventListener("keyup", _onKeyUp);
        inputElement.addEventListener("cut", function (e) {
            window.setTimeout(function () {
                _onKeyUp(e);
            }, 1);
        });

        inputElement.addEventListener("paste", function (e) {
            window.setTimeout(function () {
                _onKeyUp(e);
            }, 1);
        });

        inputElement.focus();
    }

    function init() {

        // Sonderlocke für Input-Elemente mit autofocus (z. B. im Feed das Scraping Form) https://gitlab.lhotse.ov.otto.de/social/feed/commit/c3eb86d6ac4cfc41e7a5415bd3ff936da322e2c0#0bc1cfa00f10065892d0a20001694cdcd1fd5ea4_9_9
        var autoCompleteElements = document.querySelectorAll("input[type=\"text\"][autofocus][data-show-clear-button=\"true\"],input:not([type])[data-show-clear-button=\"true\"][autofocus]");

        [].forEach.call(autoCompleteElements, function(element){
            _onFocus({target: element,
                "preventDefault" : function () {
            }});
        });

        // der normale Weg
        o_util.event.delegate(document, "focus", "input[type=\"text\"][data-show-clear-button=\"true\"],input:not([type])[data-show-clear-button=\"true\"]", _onFocus, true);



    }

    o_global.eventLoader.onReady(10, init);
}());
