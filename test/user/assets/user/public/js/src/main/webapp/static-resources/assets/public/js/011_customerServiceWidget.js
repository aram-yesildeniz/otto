// For JSLINT
/*global window, document, o_global, o_util, setTimeout, clearTimeout, showPopupMenu, CustomEvent
 */


var o_user = o_user || {};

o_user.customerServiceWidget = o_user.customerServiceWidget || {};

o_user.customerServiceWidget.persistenceBuilder = function (localStorage, sessionStorage) {
    "use strict";

    var LOCAL_STORAGE_KEY_PREFIX = "us_customerServiceWidget",
        LOCAL_STORAGE_EXPIRATION_IN_DAYS = 7;

    function localStorageKey() {
        return LOCAL_STORAGE_KEY_PREFIX;
    }

    function storeCustomerServiceWidgetHiddenByUser(hide) {
        if (sessionStorage.isAvailable) {
            var key = localStorageKey(),
                customerServiceWidgetStorage = JSON.parse(sessionStorage.getItem(key));
            if (!customerServiceWidgetStorage) {
                customerServiceWidgetStorage = {};
            }
            customerServiceWidgetStorage.customerServiceWidgetHidden = hide;
            sessionStorage.setItem(key, JSON.stringify(customerServiceWidgetStorage));
        }
    }

    function hasCustomerVisitedSite() {
        var result = false;
        if (sessionStorage.isAvailable) {
            var customerServiceWidgetStorage = JSON.parse(sessionStorage.getItem(localStorageKey()));
            result = (customerServiceWidgetStorage && customerServiceWidgetStorage.hasOwnProperty("customerServiceWidgetHidden"));
        }
        return result;
    }

    function isCustomerWidgetHiddenByUser() {
        var result = false;
        if (sessionStorage.isAvailable) {
            var customerServiceWidgetStorage = JSON.parse(sessionStorage.getItem(localStorageKey()));
            if (customerServiceWidgetStorage && customerServiceWidgetStorage.hasOwnProperty("customerServiceWidgetHidden")) {
                result = customerServiceWidgetStorage.customerServiceWidgetHidden;
            }
        }
        return result;

    }

    function hideNotificationByUser() {
        if (localStorage.isAvailable) {
            var key = localStorageKey(),
                customerServiceWidgetStorage = JSON.parse(localStorage.getItem(key));
            if (!customerServiceWidgetStorage) {
                customerServiceWidgetStorage = {};
            }
            customerServiceWidgetStorage.customerServiceWidgetNotificationHidden = {};
            customerServiceWidgetStorage.customerServiceWidgetNotificationHidden.value = true;
            customerServiceWidgetStorage.customerServiceWidgetNotificationHidden.timestamp = new Date().getTime();
            localStorage.setItem(key, JSON.stringify(customerServiceWidgetStorage));
        }
    }

    function isNotificationHiddenByUser(localStorageNotAvailableFallback, today) {
        var result = false;
        if (localStorage.isAvailable) {
            if (!today) {
                today = new Date();
            }
            var customerServiceWidgetStorage = JSON.parse(localStorage.getItem(localStorageKey()));
            if (customerServiceWidgetStorage && customerServiceWidgetStorage.hasOwnProperty("customerServiceWidgetNotificationHidden")) {
                var customerServiceWidgetHidden = customerServiceWidgetStorage.customerServiceWidgetNotificationHidden,
                    savedTimestampPlusOneWeek = new Date(customerServiceWidgetHidden.timestamp);
                savedTimestampPlusOneWeek.setDate(savedTimestampPlusOneWeek.getDate() + LOCAL_STORAGE_EXPIRATION_IN_DAYS);
                if (savedTimestampPlusOneWeek > today) {
                    result = customerServiceWidgetStorage.customerServiceWidgetNotificationHidden.value;
                }
            }
        } else {
            // fallback for non sessionStorage devices and iOS private mode
            if (localStorageNotAvailableFallback === undefined) {
                localStorageNotAvailableFallback = true;
            }
            result = localStorageNotAvailableFallback;
        }
        return result;
    }

    return {
        storeCustomerServiceWidgetHiddenByUser: storeCustomerServiceWidgetHiddenByUser,
        hasCustomerVisitedSite: hasCustomerVisitedSite,
        isCustomerWidgetHiddenByUser: isCustomerWidgetHiddenByUser,
        hideNotificationByUser: hideNotificationByUser,
        isNotificationHiddenByUser: isNotificationHiddenByUser
    };
};

o_user.customerServiceWidget.viewBuilder = function (window, document, ajaxUtil) {
    "use strict";

    var CUSTOMER_SERVICE_WIDGET_SELECTOR = "us_id_customerServiceWidget",
        CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR = "us_id_customerServiceWidgetPopupMenu",
        CUSTOMER_SERVICE_WIDGET_LXL_NOTIFICATION_SELECTOR = "us_id_customerServiceWidgetLXLNotification",
        CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_SELECTOR = "us_id_customerServiceWidgetSMNotification",
        CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_SELECTOR = "us_id_customerServiceWidgetBubble",
        CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_OPEN_CLASS = "us_loginAreaIconServiceBubbleOpen",
        CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_CLOSE_CLASS = "us_loginAreaIconServiceBubbleClose",
        CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_HIDE_CLASS = "us_loginAreaIconServiceBubbleHide",
        CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_OPEN_CLASS = "us_customerServiceWidgetSMNotificationOpen",
        CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_CLOSE_CLASS = "us_customerServiceWidgetSMNotificationClose",
        CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_HIDE_CLASS = "us_customerServiceWidgetSMNotificationHide",
        CUSTOMER_SERVICE_WIDGET_OPENED_CLASS = "us_customerServiceWidgetOpen",
        CUSTOMER_SERVICE_WIDGET_CLOSE_CLASS = "us_customerServiceWidgetClose",
        CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS = "us_customerServiceWidgetPopupMenuOpen",
        CUSTOMER_SERVICE_WIDGET_POPUP_MENU_CLOSE_CLASS = "us_customerServiceWidgetPopupMenuClose",
        CUSTOMER_SERVICE_WIDGET_POPUP_MENU_HIDE_CLASS = "us_customerServiceWidgetPopupMenuHide",
        serviceBubbleDurationTimeoutInMSec = 2000;

    var contentToggle = false;
    var serviceCallToggle = false;

    function disableCurtain() {
        var curtain = document.getElementById("us_id_guidanceCurtain");

        if (!!curtain) {
            curtain.parentNode.removeChild(curtain);
        }
    }

    function closePopupMenu(popupMenu) {
        if (!popupMenu) {
            popupMenu = document.getElementById(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR);
        }

        popupMenu.classList.add(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_CLOSE_CLASS);
        popupMenu.classList.remove(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS);
        disableCurtain();
    }

    function hideLXLNotification() {
        var customerServiceWidgetLXLNotification = document.getElementById(CUSTOMER_SERVICE_WIDGET_LXL_NOTIFICATION_SELECTOR);

        if (!!customerServiceWidgetLXLNotification) {
            customerServiceWidgetLXLNotification.classList.remove(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS);
            customerServiceWidgetLXLNotification.classList.add(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_CLOSE_CLASS);
        }
    }

    function findUserPagesContext() {
        return document.getElementById("user_pageId");
    }

    function findProductData() {
        var data = {};

        if (o_user.microdata && o_user.microdata.Parser) {
            data = new o_user.microdata.Parser().parseProductData(document.querySelector("[itemscope][itemtype=\"http://schema.org/Product\"]"));
        }

        return data;
    }

    function toggleServiceCall() {
        if (!serviceCallToggle) {
            document.getElementById("us_widgetContent_nonServiceCall").classList.add("us_hide");
            document.getElementById("us_widgetContent_nonServiceCall_toggled").classList.add("us_hide");
            document.getElementById("us_widgetContent_serviceCall").classList.remove("us_hide");
            document.getElementById("us_widgetContent_serviceCall_toggled").classList.remove("us_hide");
        } else {
            document.getElementById("us_widgetContent_serviceCall").classList.add("us_hide");
            document.getElementById("us_widgetContent_serviceCall_toggled").classList.add("us_hide");
            document.getElementById("us_widgetContent_nonServiceCall").classList.remove("us_hide");
            document.getElementById("us_widgetContent_nonServiceCall_toggled").classList.remove("us_hide");
        }

        serviceCallToggle = !serviceCallToggle;
    }

    function toggleContent() {
        if (!contentToggle) {
            document.getElementById("us_id_widgetContent_default").classList.add("us_hide");
            document.getElementById("us_widgetContent_toggled").classList.remove("us_hide");
        } else {
            document.getElementById("us_widgetContent_toggled").classList.add("us_hide");
            document.getElementById("us_id_widgetContent_default").classList.remove("us_hide");
        }

        contentToggle = !contentToggle;
    }

    function isLXLNotificationVisible() {
        return window.getComputedStyle(document.getElementById(CUSTOMER_SERVICE_WIDGET_LXL_NOTIFICATION_SELECTOR)).getPropertyValue("display") !== "none";
    }

    function togglePopupMenu() {
        var popupMenu = document.getElementById(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR);

        if (!!popupMenu && popupMenu.classList.contains(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS)) {
            closePopupMenu(popupMenu);
        } else {
            showPopupMenu(popupMenu);
        }
    }

    function createCurtain() {
        var curtain = document.createElement("div");

        curtain.id = "us_id_guidanceCurtain";
        curtain.classList.add("us_layerCurtain");

        document.body.appendChild(curtain);

        curtain.addEventListener("click", function () {
            var popupMenu = document.getElementById(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR);

            if (popupMenu.classList.contains(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS)) {
                closePopupMenu(popupMenu);
            } else {
                showPopupMenu(popupMenu);
            }
        });
    }

    function showPopupMenu(popupMenu) {
        var parameter = "", i = 0;

        if (findUserPagesContext() !== null) {
            parameter = "userPagesContext=" + findUserPagesContext().innerHTML;
        } else {
            var productData = findProductData();
            parameter = Object.keys(productData).map(function (k) {
                var out = "";
                if (productData[k] !== null && productData[k] !== undefined) {
                    out = encodeURIComponent(k) + '=' + encodeURIComponent(productData[k]);
                }
                return out;

            }).join('&');
        }
        if (parameter.length > 0) {
            parameter = "?" + parameter;
        }

        ajaxUtil.get("/user/customerServiceWidget" + parameter, function (xhr) {
            document.getElementById("us_id_customerServiceWidgetContainerForDynamicContent").innerHTML = xhr.responseText;
            //register click handler
            var elementsToAddHandler = document.getElementsByClassName("us_js_customerServiceWidget_toggleServiceCall");
            for (i = 0; i < elementsToAddHandler.length; i += 1) {
                elementsToAddHandler[i].addEventListener('click', toggleServiceCall);
            }
            elementsToAddHandler = document.getElementsByClassName("user_js_toggleWidgetContent");
            for (i = 0; i < elementsToAddHandler.length; i += 1) {
                elementsToAddHandler[i].addEventListener('click', toggleContent);
            }

            if (contentToggle) {
                contentToggle = false;
                toggleContent();
            }
            if (serviceCallToggle) {
                serviceCallToggle = false;
                toggleServiceCall();
            }
        });

        if (!popupMenu) {
            popupMenu = document.getElementById(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR);
        }
        if (!popupMenu.classList.contains(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS)) {
            if (isLXLNotificationVisible()) {
                hideLXLNotification();
            }
            document.dispatchEvent(new CustomEvent("o_user.login.area.menu.close"));
            popupMenu.classList.remove(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_CLOSE_CLASS);
            popupMenu.classList.remove(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_HIDE_CLASS);
            popupMenu.classList.add(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS);
            createCurtain();
        }
    }

    function showCustomerServiceWidgetIcon() {
        var customerServiceWidget = document.getElementById(CUSTOMER_SERVICE_WIDGET_SELECTOR);

        if (!!customerServiceWidget) {
            customerServiceWidget.classList.remove(CUSTOMER_SERVICE_WIDGET_CLOSE_CLASS);
            customerServiceWidget.classList.remove("us_customerServiceWidgetHide");
            customerServiceWidget.classList.add(CUSTOMER_SERVICE_WIDGET_OPENED_CLASS);
        }
    }

    function closeCustomerServiceWidgetIcon() {
        var customerServiceWidget = document.getElementById(CUSTOMER_SERVICE_WIDGET_SELECTOR);

        closePopupMenu();

        if (!!customerServiceWidget) {
            document.getElementById(CUSTOMER_SERVICE_WIDGET_SELECTOR).classList.add(CUSTOMER_SERVICE_WIDGET_CLOSE_CLASS);
            document.getElementById(CUSTOMER_SERVICE_WIDGET_SELECTOR).classList.remove(CUSTOMER_SERVICE_WIDGET_OPENED_CLASS);
        }
    }

    function isPopupMenuVisible() {
        return document.getElementById(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR).classList.contains(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS);
    }

    function isBlackListedUrl() {
        var customerServiceWidget = document.getElementById(CUSTOMER_SERVICE_WIDGET_SELECTOR);

        return (!!customerServiceWidget && customerServiceWidget.classList.contains("us_js_isBlackListedUrl"))
            || (document.getElementsByClassName("us_js_noCustomerServiceWidget").length > 0);
    }

    function showLXLNotification() {
        var customerServiceWidgetLXLNotification = document.getElementById(CUSTOMER_SERVICE_WIDGET_LXL_NOTIFICATION_SELECTOR);

        if (!!customerServiceWidgetLXLNotification) {
            customerServiceWidgetLXLNotification.classList.remove(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_HIDE_CLASS);
            customerServiceWidgetLXLNotification.classList.add(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_OPENED_CLASS);
        }
    }

    function showSMNotification() {
        var customerServiceWidthSMNotification = document.getElementById(CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_SELECTOR);

        if (!!customerServiceWidthSMNotification) {
            customerServiceWidthSMNotification.classList.remove(CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_HIDE_CLASS);
            customerServiceWidthSMNotification.classList.add(CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_OPEN_CLASS);
        }
    }

    function showLoginAreaServiceBubble() {
        var customerServiceWidgetLoginAreaBubble = document.getElementById(CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_SELECTOR);

        if (!!customerServiceWidgetLoginAreaBubble) {
            customerServiceWidgetLoginAreaBubble.classList.remove(CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_HIDE_CLASS);
            customerServiceWidgetLoginAreaBubble.classList.remove(CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_CLOSE_CLASS);
            customerServiceWidgetLoginAreaBubble.classList.add(CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_OPEN_CLASS);
        }
    }

    function hideLoginAreaServiceBubble() {
        var customerServiceWidgetLoginAreaBubble = document.getElementById(CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_SELECTOR);

        if (!!customerServiceWidgetLoginAreaBubble) {
            customerServiceWidgetLoginAreaBubble.classList.remove(CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_OPEN_CLASS);
            customerServiceWidgetLoginAreaBubble.classList.add(CUSTOMER_SERVICE_WIDGET_LOGIN_AREA_BUBBLE_CLOSE_CLASS);
        }
    }

    function triggerShowLoginAreaServiceBubble() {
        showLoginAreaServiceBubble();
        setTimeout(function () {
            hideLoginAreaServiceBubble();
        }, serviceBubbleDurationTimeoutInMSec);
    }

    function hideSMNotification(showServiceBubble) {
        var customerServiceWidgetSMNotification = document.getElementById(CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_SELECTOR);

        if (!!customerServiceWidgetSMNotification) {
            customerServiceWidgetSMNotification.classList.remove(CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_OPEN_CLASS);
            customerServiceWidgetSMNotification.classList.add(CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_CLOSE_CLASS);
        }

        if (!!showServiceBubble) {
            triggerShowLoginAreaServiceBubble();
        }
    }

    function openFeedbackPopup(feedbackUrl, feedbackId) {
        var url = encodeURIComponent(document.location.href),
            popupUrl = feedbackUrl + "?ot_FeedbackId=" + feedbackId + "&url=" + url,
            popupName = "o_feedback",
            popupParameters = "width=730,height=600,toolbar=no,locationbar=no,directories=no,scrollbars=yes,status=no,menubar=no,resizable=yes";

        window.open(popupUrl, popupName, popupParameters);

        return false;
    }

    return {
        togglePopupMenu: togglePopupMenu,
        showCustomerServiceWidgetIcon: showCustomerServiceWidgetIcon,
        closeCustomerServiceWidgetIcon: closeCustomerServiceWidgetIcon,
        isPopupMenuVisible: isPopupMenuVisible,
        isBlackListedUrl: isBlackListedUrl,
        showPopupMenu: showPopupMenu,
        closePopupMenu: closePopupMenu,
        showLXLNotification: showLXLNotification,
        hideLXLNotification: hideLXLNotification,
        showSMNotification: showSMNotification,
        hideSMNotification: hideSMNotification,
        triggerShowLoginAreaServiceBubble: triggerShowLoginAreaServiceBubble,
        hideLoginAreaServiceBubble: hideLoginAreaServiceBubble,
        openFeedbackPopup: openFeedbackPopup
    };
};

o_user.customerServiceWidget.presenterBuilder = function (document, view, persistence, tracking, globalUtils, breakpoint,
                                                          notificationDurationTimeoutInMSec, notificationDelayInMSec) {
    "use strict";

    var CUSTOMER_SERVICE_WIDGET_ICON_SELECTOR = "us_id_customerServiceWidgetIcon",
        CUSTOMER_SERVICE_WIDGET_CLOSE_BUTTON_SELECTOR = "us_id_customerServiceWidgetCloseButton",
        CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR = "#us_id_customerServiceWidgetPopupMenu",
        CUSTOMER_SERVICE_WIDGET_POPUP_MENU_CLOSE_BUTTON_SELECTOR = "us_id_customerServiceWidgetPopupMenuCloseButton",
        CUSTOMER_SERVICE_WIDGET_LXL_NOTIFICATION_CLOSE_BUTTON_SELECTOR = "us_id_customerServiceWidgetLXLNotificationCloseButton",
        CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_CLOSE_BUTTON_SELECTOR = "us_id_customerServiceWidgetSMNotificationCloseButton",
        widgetIconCloseAnimationDurationInMSec = 466,
        lxlNotificationTimer,
        smNotificationTimer;

    function disableServiceWidgetOnSite() {
        return document.getElementsByClassName("us_js_disable_feedback_splice_bar").length > 0;
    }

    function isPopup() {
        return document.getElementsByClassName("p_popup").length > 0;
    }

    function isModernDevice() {
        return document.getElementsByClassName("csstransforms3d").length > 0;
    }

    function isLXLBreakpoint() {
        return breakpoint.isExtraLarge() || breakpoint.isLarge();
    }

    function isSMBreakpoint() {
        return breakpoint.isSmall() || breakpoint.isMedium();
    }

    function isApp() {
        var appCookieValue = globalUtils.cookie.get("app");

        return (!!appCookieValue && appCookieValue === "true");
    }

    function hideLXLNotification() {
        clearTimeout(lxlNotificationTimer);
        view.hideLXLNotification();
        persistence.hideNotificationByUser();
    }

    function hideSMNotification(showServiceBubble) {
        clearTimeout(smNotificationTimer);
        view.hideSMNotification(showServiceBubble);
        persistence.hideNotificationByUser();
    }

    function register() {
        var customerServiceWidgetIcon = document.getElementById(CUSTOMER_SERVICE_WIDGET_ICON_SELECTOR),
            customerServiceWidgetCloseButton = document.getElementById(CUSTOMER_SERVICE_WIDGET_CLOSE_BUTTON_SELECTOR),
            customerServiceWidgetPopupMenuCloseButton = document.getElementById(CUSTOMER_SERVICE_WIDGET_POPUP_MENU_CLOSE_BUTTON_SELECTOR),
            customerServiceWidgetLXLNotificationCloseButton = document.getElementById(CUSTOMER_SERVICE_WIDGET_LXL_NOTIFICATION_CLOSE_BUTTON_SELECTOR),
            customerServiceWidgetSMNotificationCloseButton = document.getElementById(CUSTOMER_SERVICE_WIDGET_SM_NOTIFICATION_CLOSE_BUTTON_SELECTOR);

        if (!!customerServiceWidgetIcon) {
            // register click on customer service widget icon
            customerServiceWidgetIcon.addEventListener("click", function () {
                if (!view.isPopupMenuVisible()) {
                    tracking.sendTrackingInformation({user_Navigation: "widget_button", user_CustomerServiceWidgetLayer: "open"});
                }
                view.togglePopupMenu();
            });
        }

        if (!!customerServiceWidgetCloseButton) {
            // register click on close button of customer service widget icon
            customerServiceWidgetCloseButton.addEventListener("click", function () {
                view.closeCustomerServiceWidgetIcon();
                setTimeout(function () {
                    view.triggerShowLoginAreaServiceBubble();
                }, widgetIconCloseAnimationDurationInMSec);
                persistence.storeCustomerServiceWidgetHiddenByUser(true);
                tracking.sendTrackingInformation({user_CustomerServiceWidgetButton: "close"});
            });
        }

        if (!!customerServiceWidgetPopupMenuCloseButton) {
            // register close-PopupMenu handler on close button
            customerServiceWidgetPopupMenuCloseButton.addEventListener("click", function () {
                view.closePopupMenu();
                tracking.sendTrackingInformation({user_CustomerServiceWidgetButton: "minimize"});
            });
        }

        // register close-PopupMenu handler on js_openInPopup links
        globalUtils.event.delegate(document, "click", CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR + " .js_openInPopup", function () {
            view.closePopupMenu();
        });

        // register close-PopupMenu handler on us_js_openFeedbackInPopup links
        globalUtils.event.delegate(document, "click", CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR + " .us_js_openFeedbackInPopup", function () {
            var feedbackId = this.getAttribute("data-feedbackid");
            view.openFeedbackPopup(this.getAttribute("href"), feedbackId);
            view.closePopupMenu();
            tracking.sendTrackingInformation({ot_FeedbackId: feedbackId});
        });

        // register close-PopupMenu handler on js_openInPaliLayer links
        globalUtils.event.delegate(document, "click", CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR + " .js_openInPaliLayer", function () {
            view.closePopupMenu();
        });

        // register close-PopupMenu handler on "open in new page" links
        globalUtils.event.delegate(document, "click", CUSTOMER_SERVICE_WIDGET_POPUP_MENU_SELECTOR + " .js_closePopupAfterClick", function () {
            view.closePopupMenu();
        });

        if (!!customerServiceWidgetLXLNotificationCloseButton) {
            // register close-Button handler on L/XL notification
            customerServiceWidgetLXLNotificationCloseButton.addEventListener("click", function () {
                hideLXLNotification();
            });
        }

        if (!!customerServiceWidgetSMNotificationCloseButton) {
            // register close-Button handler on S/M notification
            customerServiceWidgetSMNotificationCloseButton.addEventListener("click", function () {
                hideSMNotification(true);
            });
        }

        // register 'Zur Kundenberatung' Pseudo Link im LoginArea Menu
        globalUtils.event.delegate(document, "click", ".us_js_customerServiceWidgetLoginAreaLink", function () {
            view.showCustomerServiceWidgetIcon();
            persistence.storeCustomerServiceWidgetHiddenByUser(false);
            view.showPopupMenu();
            tracking.sendTrackingInformation({user_Navigation: "login_area", user_CustomerServiceWidgetLayer: "open"});
        });

        // register LoginArea-Menu-Opened event
        document.addEventListener("o_user.login.area.menu.opened", function () {
            hideSMNotification();
        });
    }

    function trackNotificationShown() {
        tracking.sendTrackingInformation({user_CustomerServiceWidgetNotification: "shown"}, "merge");
    }

    function showLXLNotification() {
        setTimeout(function () {
            view.showLXLNotification();
            lxlNotificationTimer = setTimeout(function () {
                hideLXLNotification();
            }, notificationDurationTimeoutInMSec);
            trackNotificationShown();
        }, notificationDelayInMSec);
    }

    function showSMNotification() {
        view.showSMNotification();
        smNotificationTimer = setTimeout(function () {
            hideSMNotification(true);
        }, notificationDurationTimeoutInMSec);
        trackNotificationShown();
    }

    function showCustomerServiceWidgetIcon() {
        view.showCustomerServiceWidgetIcon();
        persistence.storeCustomerServiceWidgetHiddenByUser(false);
    }

    function showCustomerServiceWidgetAndNotificationIfNotHiddenByUser() {
        // show the customer widget icon if not hidden by user
        // exceptions: do not show the icon on S/M if the user is a new visitor
        // + do not show the icon on black listed urls
        if (!view.isBlackListedUrl()) {
            if (!persistence.isCustomerWidgetHiddenByUser() && (isLXLBreakpoint() || (isSMBreakpoint() && persistence.hasCustomerVisitedSite()))) {
                showCustomerServiceWidgetIcon();
            }
            // show L/XL notification
            // if the customerwidget is hidden show it first
            if (!persistence.isNotificationHiddenByUser() && isLXLBreakpoint()) {
                if (persistence.isCustomerWidgetHiddenByUser()) {
                    showCustomerServiceWidgetIcon();
                }
                showLXLNotification();
            }
            // show S/M notification if the notification is not hidden by the user and
            // if the customerservicewidget is hidden or if he is new to the site
            if (!persistence.isNotificationHiddenByUser() && isSMBreakpoint() && (persistence.isCustomerWidgetHiddenByUser() || !persistence.hasCustomerVisitedSite())) {
                showSMNotification();
            }
        }
    }

    function init() {
        if (!disableServiceWidgetOnSite() && !isPopup() && !isApp() && isModernDevice()) {
            globalUtils.ajax.get("test/user/customerServiceWidgetContainer", function (xhr) {
                document.body.insertAdjacentHTML("beforeend", xhr.responseText);
                register();
                showCustomerServiceWidgetAndNotificationIfNotHiddenByUser();
            });
        }
    }

    return {
        init: init
    };
};

