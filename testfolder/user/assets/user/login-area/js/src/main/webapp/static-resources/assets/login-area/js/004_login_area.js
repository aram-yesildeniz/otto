// For JSLINT
/*global window, document, setTimeout, o_global, Base64, o_util, CustomEvent
 */

var o_user = o_user || {},
    o_util = o_util || {};

o_user.loginarea = o_user.loginarea || {};
o_util.event = o_util.event || {};

o_user.loginarea.viewBuilder = function (window, document) {
    "use strict";

    function disableCurtain() {
        var curtain = document.querySelector(".us_js_loginMenuCurtain"),
            loginAreaContainerWrapper = document.getElementById("us_js_id_loginAreaContainerWrapper");

        if (!!curtain) {
            loginAreaContainerWrapper.removeChild(curtain);
        }
    }

    function hideLoginAreaMenu() {
        var loginArea = document.getElementById("us_id_loginAreaMenu");

        if (!!loginArea) {
            loginArea.style.display = "none";
        }

        disableCurtain();
    }

    function isLoginAreaMenuVisible() {
        var loginArea = document.getElementById("us_id_loginAreaMenu");

        return window.getComputedStyle(loginArea).display !== "none";
    }

    function hide(event) {
        var target = event.target;

        if (!target.closest("#us_id_loginAreaContainerWithName")) {
            if (isLoginAreaMenuVisible()) {
                hideLoginAreaMenu();

                if (document.documentElement.classList.contains("touchable")) {
                    document.body.style.cursor = "default";
                }
            }
        }
    }

    function showLoginAreaMenu() {
        var loginAreaMenu = document.getElementById("us_id_loginAreaMenu"),
            curtain = document.createElement("div"),
            loginAreaContainerWrapper = document.getElementById("us_js_id_loginAreaContainerWrapper"),
            loginAreaContainer = document.getElementById("us_id_loginAreaContainerWithName");

        curtain.classList.add("us_layerCurtain", "us_js_loginMenuCurtain");
        loginAreaContainerWrapper.insertBefore(curtain, loginAreaContainer);
        curtain.addEventListener("click", hide);

        if (!!loginAreaMenu) {
            loginAreaMenu.style.display = "block";
        }

        // send event: LoginArea Menu is opened
        document.dispatchEvent(new CustomEvent("o_user.login.area.menu.opened"));
    }

    return {
        hideLoginAreaMenu: hideLoginAreaMenu,
        isLoginAreaMenuVisible: isLoginAreaMenuVisible,
        showLoginAreaMenu: showLoginAreaMenu
    };
};

o_user.loginarea.presenterBuilder = function (view, eventUtil) {
    "use strict";

    function replaceLoginAreaContent() {
        var contentToMove = document.getElementById("us_js_id_loginAreaContentToReplaceHeader"),
            contentToRemove,
            contentToReplace;

        if (!!contentToMove) {
            contentToReplace = document.getElementById("us_js_id_loginAreaContainerToReplace");
            contentToRemove = document.getElementById("us_js_id_loginAreaContentToRemove");

            if (!!contentToReplace) {
                contentToReplace.outerHTML = contentToMove.innerHTML;
            }

            if (!!contentToRemove) {
                contentToRemove.parentNode.removeChild(contentToRemove);
            }
        }
    }

    function initLoginAreaTooltipTriggers() {
        eventUtil.delegate(document, "click", ".us_js_loginAreaMenuHandle", function () {
            if (view.isLoginAreaMenuVisible()) {
                view.hideLoginAreaMenu();
            } else {
                view.showLoginAreaMenu();
            }
        });

        eventUtil.delegate(document, "click", "#us_id_closeLoginMenuButton", function () {
            view.hideLoginAreaMenu();
        });

        eventUtil.delegate(document, "click", ".user_js_show_more_login_area_links", function () {
            var hiddenLinks = document.querySelectorAll(".login_area_menu_hide_link");

            [].forEach.call(hiddenLinks, function (hiddenLink) {
                hiddenLink.classList.remove("login_area_menu_hide_link");
            });

            this.parentNode.classList.add("login_area_menu_hide_link");
        });

        eventUtil.delegate(document, "click", ".user_js_more_login_area_links_follow", function () {
            window.open(window.atob(this.getAttribute("data-ub64e")), "_self");
        });

        // receive event
        // anybody sending this trigger can close the login area menu
        document.addEventListener("o_user.login.area.menu.close", function () {
            view.hideLoginAreaMenu();
        });
    }

    function init() {
        if (!!document.getElementById("us_js_id_loginAreaContainerToReplace")) {
            replaceLoginAreaContent();
        }

        initLoginAreaTooltipTriggers();
    }

    return {
        init: init
    };
};
