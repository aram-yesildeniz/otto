// For JSLINT
/*global window, document, o_global, o_util */
/*jslint es5: true */

var o_user = o_user || {},
    o_util = o_util || {};

o_user.common = o_user.common || {};
o_user.common.layer = o_user.common.layer || {};
o_user.common.layer.rwd = o_user.common.layer.rwd || {};

o_user.common.layer.rwd.serviceBuilder = function (window, ajaxUtil) {
    "use strict";

    function post(url, data, successHandler, errorHandler) {
        ajaxUtil.post(url, data)
            .then(function (xhr) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    successHandler(xhr);
                } else if (xhr.status === 401) {
                    window.location.href = "/user/implicitLogout?entryPoint=401Logout";
                } else if (xhr.status === 403) {
                    window.location.href = "/user/reauthenticate?entryPoint=403Forbidden";
                } else {
                    errorHandler();
                }
            })
            .catch(function () {
                // some logging?
            });
    }

    return {
        post: post
    };
};

o_user.common.layer.rwd.viewBuilder = function (window, document, paliLayer) {
    'use strict';

    var userDialogCssClass = ".p_layer .p_layer__content .user_system_rwd";

    function closeLayer() {
        var activeLayer = paliLayer.getActiveLayer();

        if (!!activeLayer) {
            activeLayer.close();
        }
    }

    function openLayer(url) {
        var newLayer = new o_global.pali.layerBuilder({
            modal: true
        });

        newLayer.open();
        newLayer.setContentFromURL(url);
    }

    function setContentFromUrl(url) {
        var activeLayer = paliLayer.getActiveLayer();

        activeLayer.setContentFromURL(url, function () {
            activeLayer.resetViewport();
        });
    }

    function setContent(html) {
        document.querySelector(userDialogCssClass).innerHTML = html;
        paliLayer.getActiveLayer().resetViewport();
    }

    function reload() {
        window.location.reload();
    }

    function urlStartsWithUser() {
        return window.location.pathname.substring(0, 5) === "/user";
    }

    function setFocus() {
        if (document.documentElement.classList.contains("not-touchable")) {
            document.querySelector(userDialogCssClass + " input[autofocus='autofocus']").focus();
            document.querySelector(userDialogCssClass + " input[data-autofocus='autofocus']").focus();
        }
        if (document.querySelectorAll("div[data-severity='ERROR']").length > 0) {
            document.getElementsByClassName("p_layer__content")[0].scrollTop(0);
        }
    }

    return {
        closeLayer: closeLayer,
        openLayer: openLayer,
        setContentFromUrl: setContentFromUrl,
        setContent: setContent,
        reload: reload,
        urlStartsWithUser: urlStartsWithUser,
        setFocus: setFocus
    };
};

o_user.common.layer.rwd.presenterBuilder = function (document, view, service, buttonView, eventUtil) {
    'use strict';

    var userDialogCssClass = ".p_layer .user_system_rwd";

    function replacePageContentById(id, data) {
        document.querySelector("#" + id).innerHTML = data;
        preload_polyfill_invoke(document.querySelector("#" + id));
    }

    function postForm(button, externalFormSelector) {
        var form, url, data;

        if (!!externalFormSelector) {
            form = document.querySelector(".user_system_rwd " + externalFormSelector);
        } else {
            form = button.closest("form");
        }

        url = form.getAttribute("action");
        data = o_user.common.serializeForm(form);
        buttonView.showSpinner(button);

        service.post(url, data, function (xhr) {
            if (xhr.getResponseHeader("X-user-replace-content")) {
                replacePageContentById(xhr.getResponseHeader("X-user-replace-content"), xhr.responseText);
            }
            if (xhr.getResponseHeader("X-user-open-splash-screen")) {
                view.setContentFromUrl(xhr.getResponseHeader("X-user-open-splash-screen"));
            }
            if (xhr.getResponseHeader("X-user-dialog-close") && xhr.getResponseHeader("X-user-dialog-close") === "true") {
                view.closeLayer();
            }
            if (!(xhr.getResponseHeader("X-user-replace-content") || xhr.getResponseHeader("X-user-dialog-close") || xhr.getResponseHeader("X-user-open-splash-screen"))) {
                view.setContent(xhr.responseText);
                buttonView.showButton(button);
                view.setFocus();
            }
        }, function () {
            buttonView.showButton(button);
        });
    }

    function registerDefaultButton() {
        // click handler für default button
        eventUtil.delegate(document, "click", userDialogCssClass + " .us_js_default_button", function (e) {
            e.preventDefault();
            postForm(this, this.getAttribute("data-external-form-selector"));
        });
    }

    function init() {
        registerDefaultButton();
    }

    return {
        init: init
    };
};
