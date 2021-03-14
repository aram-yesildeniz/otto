// For JSLINT
/*global document, window, o_apps
 */

var o_user = o_user || {};


o_user.lostPasswordValidateEmailChangeBuilder = function (window, documentObject, tracking, eventUtil, buttonView) {
    'use strict';

    function getInitialEmailAddress() {
        var form = documentObject.querySelector('.us_js_lostPasswordReplyFormExp');
        return form.getAttribute('data-initial-email');
    }

    function showHint(selector) {
        var trackingContainer = {};
        trackingContainer.user_LostPasswordRequest = "tip_email_repeat";
        tracking.sendTrackingInformation(trackingContainer, "event");

        var hintNode = documentObject.querySelector(selector);
        hintNode.parentElement.style.display = "block";
    }

    function hideHint(selector) {
        var hintNode = documentObject.querySelector(selector);
        hintNode.parentElement.style.display = "none";
    }

    function init() {
        var buttonHasBeenClickedOnce = false;
        var toolTipElementId = "#us_id_toolTipEmailUnchanged";

        if (documentObject.querySelector(".us_js_lostPasswordReplyFormExp")) {
            eventUtil.delegate(documentObject, "submit", ".us_js_lostPasswordReplyFormExp", function (event) {
                var initialEmailAddress = getInitialEmailAddress();
                var submittedEmailAddress = event.target.querySelector('#us_id_EmailAddress').value;
                var toolTipPosEmailParent = document.querySelector("#us_id_toolTipPosEmail").parentNode;
                var isErrorShown = window.getComputedStyle(toolTipPosEmailParent).getPropertyValue("display") === "block";
                var hasEmailAddressChanged = initialEmailAddress !== "" && (initialEmailAddress === submittedEmailAddress);
                if (!buttonHasBeenClickedOnce && !isErrorShown && hasEmailAddressChanged) {
                    buttonHasBeenClickedOnce = true;
                    event.preventDefault();
                    showHint(toolTipElementId);
                    var button = documentObject.querySelector('button[data-qa="user_lost_password_submit_button"]')
                    buttonView.showButton(button);
                }
            });

            eventUtil.delegate(documentObject, "keydown", "#us_id_EmailAddress", function () {
                hideHint(toolTipElementId);
            });
        }
    }

    return {
        init: init
    };
};
