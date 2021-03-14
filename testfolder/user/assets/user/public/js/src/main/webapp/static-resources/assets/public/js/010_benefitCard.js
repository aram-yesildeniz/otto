// For JSLINT
/*global document, window, o_global, o_util, setTimeout
 */

var o_user = o_user || {};

o_user.benefitCard = o_user.benefitCard || {};

o_user.benefitCard.viewBuilder = function (window, document, tracking, device) {
    'use strict';

    var INTERACTION_ICON_RAMP_UP_TIME = 1000,
        INTERACTION_ICON_DISPLAY_TIME = 3500,
        CARD_HOLDER_NAME_AREA_HIDE_TIME = 300;

    function swipedetect(el, callback) {

        var touchsurface = el,
            swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = 150, //required min distance traveled to be considered swipe
            restraint = 100, // maximum distance allowed at the same time in perpendicular direction
            allowedTime = 300, // maximum time allowed to travel that distance
            elapsedTime,
            startTime,
            handleSwipe = callback || function (swipedir) {};

        touchsurface.addEventListener('touchstart', function (e) {
            var touchobj = e.changedTouches[0],
                dist = 0;
            swipedir = 'none';
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();// record time when finger first makes contact with surface
            e.preventDefault();
        }, false);

        touchsurface.addEventListener('touchmove', function (e) {
            e.preventDefault(); // prevent scrolling when inside DIV
        }, false);

        touchsurface.addEventListener('touchend', function (e) {
            var touchobj = e.changedTouches[0],
                distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime) { // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                    swipedir = (distX < 0) ? 'left' : 'right';// if dist traveled is negative, it indicates left swipe
                } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                    swipedir = (distY < 0) ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
                }
            }
            handleSwipe(swipedir);
            e.preventDefault();
        }, false);
    }

    function isBrowserIE() {
        switch (device.browser) {
        case 'MSIE8':
        case 'MSIE9':
        case 'MSIE10':
        case 'MSIE11':
        case 'MSIE (not supported Version)':
            return true;
        default:
            return false;
        }
    }

    function flipBenefitCard() {
        var benefitCard = document.getElementById("us_benefitCard"),
            cardHolderNameArea = document.getElementsByClassName("us_cardHolderNameArea")[0];
        if (isBrowserIE()) {
            benefitCard.classList.toggle("us_switchBenefitCardImage");
        } else {
            benefitCard.classList.toggle("us_flippedBenefitCard");
            window.setTimeout(function () {
                cardHolderNameArea.classList.toggle("us_hide");
            }, CARD_HOLDER_NAME_AREA_HIDE_TIME);
        }
        tracking.sendTrackingInformation({"user_CardTurning": "true"}, "event");
    }

    function showInteractionIcon() {
        var interactionIcon = document.querySelector(".us_js_interactionClickIcon");

        if (o_global.device.isTouchable) {
            interactionIcon = document.querySelector(".us_js_interactionSwipeIcon");
        }

        window.setTimeout(function () {
            interactionIcon.classList.add("us_iconFadeIn");
        }, INTERACTION_ICON_RAMP_UP_TIME);
        window.setTimeout(function () {
            interactionIcon.classList.remove("us_iconFadeIn");
            interactionIcon.classList.add("us_iconFadeOut");
        }, INTERACTION_ICON_DISPLAY_TIME);
    }

    function registerEventListener() {
        var benefitCard = document.getElementById("us_benefitCard");
        showInteractionIcon();
        if (o_global.device.isTouchable) {
            swipedetect(benefitCard, function (swipedir) {
                if (swipedir === 'left' || swipedir === 'right') {
                    flipBenefitCard();
                }
            });
        } else {
            setTimeout(function () {
                benefitCard.classList.add("us_js_seleniumFlipIdentifier");
                benefitCard.addEventListener("mouseenter", function () {
                    flipBenefitCard();
                });
                benefitCard.addEventListener("click", function () {
                    flipBenefitCard();
                });
            }, 1000);
        }

    }

    return {
        registerEventListener: registerEventListener
    };

};

o_user.benefitCard.presenterBuilder = function (view) {
    'use strict';

    function init() {
        view.registerEventListener();
    }

    return {
        init: init
    };
};
