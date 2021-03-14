// For JSLINT
/*global document, setTimeout, window, o_global, o_util */
/*jslint es5: true */

var o_user = o_user || {},
    o_util = o_util || {};

o_user.onlinevalidationtooltip = o_user.onlinevalidationtooltip || {};
o_user.onlinevalidationtooltip.rwd = o_user.onlinevalidationtooltip.rwd || {};
o_user.onlinevalidationtooltip.rwd.passwordTooltip = o_user.onlinevalidationtooltip.rwd.passwordTooltip || {};
o_user.onlinevalidationtooltip.rwd.standardTooltip = o_user.onlinevalidationtooltip.rwd.standardTooltip || {};
o_util.ajax = o_util.ajax || {};
o_util.event = o_util.event || {};

o_user.onlinevalidationtooltip.serviceBuilder = function (ajaxUtil) {
    "use strict";

    var userServletContext = "/user";

    function sendValidationRequest(input, json, successhandler, errorhandler) {
        ajaxUtil({
            url: userServletContext + "/commonInputValidation",
            method: "POST",
            contentType: "application/json",
            data: json
        }).then(function (xhr) {
            successhandler(JSON.parse(xhr.responseText), input);
        }).catch(function () {
            errorhandler(input);
        });
    }

    return {
        sendValidationRequest: sendValidationRequest
    };
};

o_user.onlinevalidationtooltip.rwd.passwordTooltip.viewBuilder = function (P_FORM_GROUP_CONSTANTS) {
    "use strict";

    function removeSeverityClassesFromTooltip(tooltip) {
        tooltip.classList.remove(
            P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--error",
            P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--warning",
            P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--hint",
            P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--success"
        );
    }

    function updateTooltipType(tooltip, json) {
        removeSeverityClassesFromTooltip(tooltip);

        switch (json.passwordStrength) {
        case "INVALID":
            tooltip.classList.add(P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--error");
            break;
        case "INSECURE":
            tooltip.classList.add(P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--warning");
            break;
        case "WEAK":
            tooltip.classList.add(P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--hint");
            break;
        case "STRONG":
            tooltip.classList.add(P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--success");
            break;
        }
    }

    function updateTitlebar(tooltip, json) {
        var tooltipTitlebar = tooltip.querySelector(".user_js_passwordTooltipTitlebar"),
            tooltipHeadlines = tooltip.querySelectorAll(".user_js_passwordTooltipTitlebar .user_js_passwordTooltipHeadline");

        [].forEach.call(tooltipHeadlines, function (headline) {
            headline.style.display = "none";
        });

        tooltipTitlebar.style.display = "none";

        if (json.passwordStrength !== "UNVALIDATED") {
            tooltip.querySelector(".user_js_passwordTooltipTitlebar .user_js_passwordTooltipHeadline[data-passwordstrength=" + json.passwordStrength + "]").style.display = "block";
            tooltipTitlebar.style.display = "block";
        }
    }

    function updateSoftRules(tooltip, json) {
        var i;

        for (i = 0; i < json.passedOptionalRules.length; i += 1) {
            tooltip.querySelector(".user_js_passwordOptionalRule_" + json.passedOptionalRules[i].name).classList.add("user_meetsCriterion");
        }

        for (i = 0; i < json.failedOptionalRules.length; i += 1) {
            tooltip.querySelector(".user_js_passwordOptionalRule_" + json.failedOptionalRules[i].name).classList.remove("user_meetsCriterion");
        }
    }

    function updateMandatoryAndImportantRules(tooltip, json) {
        var rules = tooltip.querySelectorAll(".user_js_mandatoryPasswordRules [class^=\"user_js_failedMandatoryAndImportantRule_\"]");

        [].forEach.call(rules, function (rule) {
            rule.style.display = "none";
        });

        if (json.failedMandatoryAndImportantRules.length > 0) {
            tooltip.querySelector(".user_js_failedMandatoryAndImportantRule_" + json.failedMandatoryAndImportantRules[0].name).style.display = "block";
        }
    }


    function updateDataTooltipAttributeOnPasswordInput(input, validatorResultJson) {
        var tooltip = document.querySelector(input.getAttribute("data-tooltip-pos"));

        updateTitlebar(tooltip, validatorResultJson);
        updateTooltipType(tooltip, validatorResultJson);
        updateSoftRules(tooltip, validatorResultJson);
        updateMandatoryAndImportantRules(tooltip, validatorResultJson);
    }

    return {
        updateDataTooltipAttributeOnPasswordInput: updateDataTooltipAttributeOnPasswordInput
    };
};

o_user.onlinevalidationtooltip.rwd.standardTooltip.viewBuilder = function (document, P_FORM_GROUP_CONSTANTS) {
    "use strict";

    function convertJsonMessageSeverityToTooltipType(jsonMessageSeverity) {
        var result;

        switch (jsonMessageSeverity) {
        case "ERROR":
            result = P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--error";
            break;
        case "WARNING":
            result = P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--warning";
            break;
        case "INFO":
            result = P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--hint";
            break;
        case "SUCCESS":
            result = P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--success";
            break;
        }

        return result;
    }

    function removeSeverityClassesFromTooltip(tooltip) {
        tooltip.classList.remove(
            P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--error",
            P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--warning",
            P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--hint",
            P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE + "--success"
        );
    }

    function updateTooltipOnStandardInput(input, validatorResultJson) {
        var tooltip = document.querySelector(input.getAttribute("data-tooltip-pos"));

        if (validatorResultJson && validatorResultJson.message) {
            tooltip.innerHTML = validatorResultJson.message.messageText;
            removeSeverityClassesFromTooltip(tooltip);
            tooltip.classList.add(convertJsonMessageSeverityToTooltipType(validatorResultJson.message.severity));
        } else {
            removeSeverityClassesFromTooltip(tooltip);
            tooltip.innerHTML = "";
            tooltip.parentNode.style.display = "none";
        }
    }

    return {
        updateTooltipOnStandardInput: updateTooltipOnStandardInput
    };
};

o_user.onlinevalidationtooltip.rwd.viewBuilder = function (window, document, onlineValidationClassSelector, P_FORM_GROUP_CONSTANTS, passwordTooltipView, standardTooltipView) {
    "use strict";
    var DATA_SUPPRESS_MESSAGES = "data-suppress-messages",
        DATA_VALIDATION_VALIDATORS = "data-validation-validators",
        DATA_VALIDATION_FIELD = "data-validation-field";

    function validators(input) {
        return input.getAttribute(DATA_VALIDATION_VALIDATORS).split(" ");
    }

    function firstValidator(input) {
        return validators(input)[0];
    }

    function isValidatorOnRowOnly(input) {
        return input.getAttribute("data-validation-on-row") === "true";
    }

    function inputsForValidatorName(input, validatorName) {
        if (isValidatorOnRowOnly(input)) {
            return input.closest("." + P_FORM_GROUP_CONSTANTS.P_FORM_GROUP_ROW).querySelectorAll(onlineValidationClassSelector +
                "[" + DATA_VALIDATION_VALIDATORS + "^='" + validatorName + "']" +
                "[" + DATA_VALIDATION_VALIDATORS + "~='" + validatorName + "']");
        }
        // der Selector ist etwas kompliziert, aber ein einfaches startsWith hat für validatorName = "email" und
        // data-validation-validators="emailRepeat" nicht gereicht. Das war nicht eindeutig genug.
        return input.closest("form").querySelectorAll(onlineValidationClassSelector +
            "[" + DATA_VALIDATION_VALIDATORS + "^='" + validatorName + "']" +
            "[" + DATA_VALIDATION_VALIDATORS + "~='" + validatorName + "']");
    }

    function findInputsForInputsFirstValidator(input) {
        if (isValidatorOnRowOnly(input)) {
            return input.closest("." + P_FORM_GROUP_CONSTANTS.P_FORM_GROUP_ROW).querySelectorAll(onlineValidationClassSelector +
                "[" + DATA_VALIDATION_VALIDATORS + "~='" + firstValidator(input) + "']");
        }
        return input.closest("form").querySelectorAll(onlineValidationClassSelector +
            "[" + DATA_VALIDATION_VALIDATORS + "~='" + firstValidator(input) + "']");
    }

    function findFormGroupRow(el) {
        while (el && !el.classList.contains("p_formGroup__row")) {
            el = el.parentElement;
        }

        return el;
    }

    function handleErrorClass(input, resultValue) {
        var errorClass = "p_form__" + input.tagName.toLowerCase() + "--error";
        var rowElement = findFormGroupRow(input);

        if (!resultValue) {
            input.classList.add(errorClass);
            if (rowElement) {
                rowElement.classList.add("user_passwordError");
            }
        } else {
            input.classList.remove(errorClass);
            if (rowElement) {
                rowElement.classList.remove("user_passwordError");
            }
        }
    }

    function updateHtmlElementOnError(elements, resultValue) {
        if (typeof elements.length === "number") {
            if (elements.length > 0) {
                [].forEach.call(elements, function (element) {
                    handleErrorClass(element, resultValue);
                });
            }
        } else {
            handleErrorClass(elements, resultValue);
        }
    }

    function isInvalidNumericalInput(input) {
        return (input.type === "number" || input.type === "tel") && !input.validity.valid;
    }

    function getInputValue(input) {
        if (input.type === "select-one" && input.options[input.selectedIndex].disabled) {
            return "";
        }

        return input.value;
    }

    function updateJsonRequestObjectOnValidationInput(result, key, input) {
        var validationField = input.getAttribute(DATA_VALIDATION_FIELD),
            value,
            previousValue;

        if (!!validationField) {
            if (result[key] === undefined) {
                result[key] = {};
            }

            if (isInvalidNumericalInput(input)) {
                result[key][validationField] = "invalid";
            } else {
                value = getInputValue(input);
                previousValue = result[key][validationField];
                result[key][validationField] = (!value && !!previousValue) ? previousValue : value;
            }
        } else {
            if (isInvalidNumericalInput(input)) {
                result[key] = "invalid";
            } else {
                value = getInputValue(input);
                previousValue = result[key];
                result[key] = (!value && !!previousValue) ? previousValue : value;
            }
        }
    }

    function hideOtherFormTooltips(input) {
        var tooltips = input.closest("form").querySelectorAll("." + P_FORM_GROUP_CONSTANTS.P_FORM_MESSAGE),
            inputRow = input.closest("." + P_FORM_GROUP_CONSTANTS.P_FORM_GROUP_ROW);

        [].forEach.call(tooltips, function (formMessage) {
            if (formMessage.closest("." + P_FORM_GROUP_CONSTANTS.P_FORM_GROUP_ROW) !== inputRow) {
                formMessage.closest("." + P_FORM_GROUP_CONSTANTS.P_FORM_GROUP_MESSAGE).style.display = "none";
            }
        });
    }

    function isInViewport(input) {
        var rect = input.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

    }

    function assertInputVisible(input) {
        var isElementVisible = isInViewport(input),
            isElementFocused = (document.activeElement === input),
            elementPosition;

        if (!isElementVisible && isElementFocused) {
            elementPosition = window.pageYOffset + input.getBoundingClientRect().top;

            o_util.animation.scrollTo(elementPosition - 30, 200);
        }
    }

    function assertElemIsInViewport(element) {
        var elementPosition;

        if (!isInViewport(element)) {
            elementPosition = window.pageYOffset + element.getBoundingClientRect().top;

            o_util.animation.scrollTo(elementPosition - 30, 200);
        }
    }

    function stopUpdateTooltip(form) {
        form.setAttribute(DATA_SUPPRESS_MESSAGES, "true");
    }

    function showOrHideTooltipInternal(input, show) {
        var tooltip = document.querySelector(input.getAttribute("data-tooltip-pos")),
            tooltipContainer = tooltip.closest("." + P_FORM_GROUP_CONSTANTS.P_FORM_GROUP_MESSAGE),
            siblings;

        if (show && !!tooltip && tooltip.innerHTML !== "") {
            stopUpdateTooltip(input.closest("form"));
            hideOtherFormTooltips(input);

            siblings = tooltipContainer.parentNode.children;
            [].forEach.call(siblings, function (sibling) {
                if (sibling.classList.contains(P_FORM_GROUP_CONSTANTS.P_FORM_GROUP_MESSAGE)) {
                    if (sibling !== tooltipContainer) {
                        sibling.style.display = "none";
                    } else {
                        sibling.style.display = "block";
                    }
                }
            });

            tooltipContainer.style.display = "block";
        } else {
            tooltipContainer.style.display = "none";
        }
    }

    function showOrHideTooltipAfterCommonValidationResult(input, show) {
        if (!input.closest("form").getAttribute(DATA_SUPPRESS_MESSAGES)) {
            showOrHideTooltipInternal(input, show);
            assertInputVisible(input);
        }
    }

    function createJsonRequestObjectFromValidationInputs(originInput) {
        var result = {},
            inputs,
            inputsForValidator;

        if (!!originInput.getAttribute(DATA_VALIDATION_VALIDATORS)) {
            // für jeden Validator in data-validation-validators="...."
            validators(originInput).forEach(function (validatorName) {
                inputsForValidator = inputsForValidatorName(originInput, validatorName);

                [].forEach.call(inputsForValidator, function (inputForValidator) {
                    if (!!inputForValidator && (getInputValue(inputForValidator).length > 0 || inputForValidator === originInput)) {
                        inputs = findInputsForInputsFirstValidator(inputForValidator);
                        [].forEach.call(inputs, function (input) {
                            updateJsonRequestObjectOnValidationInput(result, firstValidator(inputForValidator), input);
                        });
                    }
                });
            });
        }

        return JSON.stringify(result);
    }

    function updateValidationStatusOnError(input) {
        showOrHideTooltipInternal(input, false);
    }

    function labelsForInput(input) {
        var labels,
            PARENT_ROW_SELECTOR = "." + P_FORM_GROUP_CONSTANTS.P_FORM_GROUP_ROW;

        if (input.type !== "radio") {
            labels = input.closest(PARENT_ROW_SELECTOR).querySelectorAll("label[for='" + input.id + "']");
        } else {
            labels = input.closest(PARENT_ROW_SELECTOR).querySelectorAll("label");
        }

        if (!labels.length) {
            labels = input.closest(PARENT_ROW_SELECTOR).querySelectorAll("label");
        }

        return labels;
    }

    function validateInputNotEmpty(input) {
        var labels = labelsForInput(input),
            inputNotEmpty = (getInputValue(input).length > 0);

        updateHtmlElementOnError(labels, inputNotEmpty);
        updateHtmlElementOnError(input, inputNotEmpty);
    }

    function sendValidationRequestOnRepeat(element, elementRepeat) {
        if (!!element && !!elementRepeat) {
            if (getInputValue(elementRepeat).length >= getInputValue(element).length) {
                return true;
            }
        }
    }

    function updateValidationStatus(data, originInput) {
        var inputToDisplayMessage = null,
            passwordInput = false,
            property,
            inputs,
            labels,
            validatorResult;

        for (property in data) {
            if (data.hasOwnProperty(property)) {
                inputs = inputsForValidatorName(originInput, property);
                labels = labelsForInput(inputs[0]);
                validatorResult = data[property];

                if (property !== "password") {
                    updateHtmlElementOnError(labels, validatorResult.ok);
                    updateHtmlElementOnError(inputs, validatorResult.ok);
                    standardTooltipView.updateTooltipOnStandardInput(inputs[0], validatorResult);

                    if ((inputToDisplayMessage === null || passwordInput) && !validatorResult.ok && inputs === originInput) {
                        inputToDisplayMessage = inputs[0];
                    }
                } else {
                    updateHtmlElementOnError(labels, validatorResult.passwordStrength !== "INVALID");
                    updateHtmlElementOnError(inputs, validatorResult.passwordStrength !== "INVALID");
                    passwordTooltipView.updateDataTooltipAttributeOnPasswordInput(inputs[0], validatorResult);

                    if (inputToDisplayMessage === null) {
                        inputToDisplayMessage = inputs[0];
                        passwordInput = true;
                    }
                }
            }
        }

        if (inputToDisplayMessage === null) {
            inputToDisplayMessage = originInput;
        }

        showOrHideTooltipAfterCommonValidationResult(inputToDisplayMessage, true);
    }

    function resetOptionalInputsAndLabels(input) {
        updateHtmlElementOnError(labelsForInput(input), true);
        updateHtmlElementOnError(findInputsForInputsFirstValidator(input), true);
        standardTooltipView.updateTooltipOnStandardInput(input);
        showOrHideTooltipInternal(input, false);
    }

    function inputsOfSameValidationTypeFilled(originInput) {
        var isComplete = true,
            inputs = inputsForValidatorName(originInput, firstValidator(originInput));


        [].forEach.call(inputs, function (input) {
            // Wenn ein InputFeld leer ist wird false zurückgegeben
            // Das InputFeld an dem das Event ausgelöst wurde, darf aber leer sein und sollte trotzdem als gefüllt gelten;
            // diese Logik ist wichtig, damit das eigentliche InputFeld nach dem Löschen aller Zeichen aus dem InputFeld
            // auch aktualisiert wird
            if (isComplete && input !== originInput && !getInputValue(input)) {
                if (!isInvalidNumericalInput(input)) {
                    isComplete = false;
                }
            }
        });

        return isComplete;
    }

    function inputsOfSameValidationTypeOptionalAndEmpty(originInput) {
        var optionalAndEmpty = false,
            inputs = inputsForValidatorName(originInput, firstValidator(originInput));

        [].forEach.call(inputs, function (input) {
            if (!optionalAndEmpty && !getInputValue(input) && input.getAttribute("data-validation-optional") === "true") {
                if (!isInvalidNumericalInput(originInput)) {
                    optionalAndEmpty = true;
                }
            }
        });

        return optionalAndEmpty;
    }

    function showTooltip(input) {
        showOrHideTooltipInternal(input, true);
    }

    function removeSuppressTooltip(tooltip) {
        tooltip.closest("form").removeAttribute(DATA_SUPPRESS_MESSAGES);
    }

    return {
        getInputValue: getInputValue,
        assertElemIsInViewport: assertElemIsInViewport,
        createJsonRequestObjectFromValidationInputs: createJsonRequestObjectFromValidationInputs,
        updateValidationStatusOnError: updateValidationStatusOnError,
        validateInputNotEmpty: validateInputNotEmpty,
        sendValidationRequestOnRepeat: sendValidationRequestOnRepeat,
        updateValidationStatus: updateValidationStatus,
        resetOptionalInputsAndLabels: resetOptionalInputsAndLabels,
        inputsOfSameValidationTypeFilled: inputsOfSameValidationTypeFilled,
        inputsOfSameValidationTypeOptionalAndEmpty: inputsOfSameValidationTypeOptionalAndEmpty,
        showTooltip: showTooltip,
        removeSuppressTooltip: removeSuppressTooltip
    };
};

o_user.onlinevalidationtooltip.rwd.presenterBuilder = function (document, onlineValidationClassSelector, service, view, typeWatchPresenterBuilder, eventUtil) {
    "use strict";

    function sendValidationRequest(input, removeSuppressTooltip) {
        if (removeSuppressTooltip === undefined || !!removeSuppressTooltip) {
            view.removeSuppressTooltip(input);
        }

        if (view.inputsOfSameValidationTypeOptionalAndEmpty(input)) {
            view.resetOptionalInputsAndLabels(input);
        } else if (view.inputsOfSameValidationTypeFilled(input)) {
            service.sendValidationRequest(input, view.createJsonRequestObjectFromValidationInputs(input, onlineValidationClassSelector),
                view.updateValidationStatus, view.updateValidationStatusOnError);
        }
    }

    function init() {
        var DATA_TYPE_WATCH = "data-typewatch",
            DATA_TYPE_WATCH_ACTIVE = "data-typewatch-active",
            DATA_NO_VALIDATE_ON_EMPTY = "data-no-validate-on-empty",
            DATA_VALIDATION_FIELD = "data-validation-field",
            suppressFirstValidationForPwRepeat = true,
            suppressFirstValidationForEmailRepeat = true;

        eventUtil.delegate(document, "blur", "input" + onlineValidationClassSelector + ":not([type=radio])", function () {
            var input = this,
                noValidateOnEmpty = this.getAttribute(DATA_NO_VALIDATE_ON_EMPTY) === "true";

            if (!noValidateOnEmpty || (noValidateOnEmpty && view.getInputValue(input) !== "")) {
                view.removeSuppressTooltip(this);
                this.setAttribute(DATA_TYPE_WATCH, "true");
                setTimeout(function () {
                    sendValidationRequest(input, false);
                }, 100);
            }
        }, true);

        eventUtil.delegate(document, "change", "select" + onlineValidationClassSelector, function () {
            sendValidationRequest(this);
        });

        eventUtil.delegate(document, "click", "input" + onlineValidationClassSelector + "[type=radio]", function () {
            sendValidationRequest(this);
        });

        eventUtil.delegate(document, "focus", "input" + onlineValidationClassSelector + ":not([type=radio])", function () {
            var input = this,
                password,
                passwordRepeat,
                email,
                emailRepeat;

            if (!input.getAttribute(DATA_TYPE_WATCH_ACTIVE) && !!input.getAttribute(DATA_TYPE_WATCH) && input.getAttribute(DATA_TYPE_WATCH) === "true") {
                typeWatchPresenterBuilder(function (element) {
                    if ((input.getAttribute(DATA_VALIDATION_FIELD) === "passwordRepeat")) {
                        password = document.querySelector("input[data-validation-field='password']");
                        passwordRepeat = document.querySelector("input[data-validation-field='passwordRepeat']");
                        if (suppressFirstValidationForPwRepeat === false || view.sendValidationRequestOnRepeat(password, passwordRepeat)) {
                            sendValidationRequest(element);
                            suppressFirstValidationForPwRepeat = false;
                        }
                    } else if ((input.getAttribute(DATA_VALIDATION_FIELD) === "emailRepeat")) {
                        email = document.querySelector("input[data-validation-field='email']");
                        emailRepeat = document.querySelector("input[data-validation-field='emailRepeat']");

                        if (suppressFirstValidationForEmailRepeat === false || view.sendValidationRequestOnRepeat(email, emailRepeat)) {
                            sendValidationRequest(element);
                            suppressFirstValidationForEmailRepeat = false;
                        }
                    } else {
                        sendValidationRequest(element);
                    }
                }, 300).registerOnElement(input);
                input.setAttribute(DATA_TYPE_WATCH_ACTIVE, "true");
            }

            view.showTooltip(input);
            setTimeout(function () {
                view.assertElemIsInViewport(input);
            }, 300);
        }, true);

        eventUtil.delegate(document, "focus", "input.us_js_localTypeWatchValidation", function () {
            var input = this;

            typeWatchPresenterBuilder(function (element) {
                view.validateInputNotEmpty(element);
            }, 1).registerOnElement(input);
        }, true);
    }

    return {
        init: init
    };
};
