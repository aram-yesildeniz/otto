// For JSLINT
/*global window, document, o_global, o_util, CustomEvent */
/*jslint es5: true */

var o_user = o_user || {},
    o_global = o_global || {},
    o_util = o_util || {};

o_user.newsletter = o_user.newsletter || {};
o_user.newsletter.snippet = o_user.newsletter.snippet || {};
o_global.pali = o_global.pali || {};
o_util.ajax = o_util.ajax || {};
o_util.event = o_util.event || {};

o_user.newsletter.snippet.serviceBuilder = function (ajaxUtil) {
    'use strict';
    var servletContext = '/test';

    function loadNewsletterSnippetContent(successHandler, errorHandler) {
        ajaxUtil.get(servletContext + '/user/subscribeToNewsletterSnippetContent')
            .then(function (xhr) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    successHandler(xhr);
                } else {
                    errorHandler();
                }
            })
            .catch(function () {
                // some fancy logging?
            });
    }

    function subscribe(serializedParams, successHandler, errorHandler) {
        ajaxUtil({
            "method": "POST",
            "url": servletContext + '/subscribeToNewsletterSnippet',
            "data": serializedParams,
            "contentType": "application/x-www-form-urlencoded; charset=UTF-8"
        }).then(function (xhr) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                successHandler(xhr);
            } else {
                errorHandler();
            }
        }).catch(function () {
            // some logging?
        });
    }

    return {
        subscribe: subscribe,
        loadNewsletterSnippetContent: loadNewsletterSnippetContent
    };
};

o_user.newsletter.snippet.viewBuilder = function (document, breakpoint) {
    'use strict';

    function checkForNewsletterSnippetContainer() {
        return !!document.getElementById("us_id_newsletterSnippet");
    }

    function setNewsletterSnippetContent(html) {
        document.getElementById("us_id_newsletterSnippet").innerHTML = html;
    }

    function showNewsletterLegalText() {
        var snippetLegalText = document.getElementById("us_id_newsletterSnippetLegalText");

        if (breakpoint.isSmall() || breakpoint.isMedium()) {
            snippetLegalText.classList.add("us_newsletterSnippetLegalTextOpen");
        } else {
            snippetLegalText.classList.add("p_expander--decrease");
        }
    }

    function serializeParams() {
        var form = document.getElementById("us_id_newsletterSnippetForm");

        return o_user.common.serializeForm(form);
    }

    return {
        checkForNewsletterSnippetContainer: checkForNewsletterSnippetContainer,
        setNewsletterSnippetContent: setNewsletterSnippetContent,
        showNewsletterLegalText: showNewsletterLegalText,
        serializeParams: serializeParams
    };
};

o_user.newsletter.snippet.presenterBuilder = function (document, service, view, RwdPaliLayerBuilder, buttonView, tracking, eventUtil) {
    'use strict';

    function handleSubscribeToNewsletterOnSuccess(url) {
        var newsletterDoiStartedEvent = new CustomEvent("user.newsletterDoiStarted");

        document.dispatchEvent(newsletterDoiStartedEvent);

        new RwdPaliLayerBuilder({
            width: "700px",
            url: url
        }).open();
    }

    function triggerSubscribe() {
        var newsletterSnippetButton;

        service.subscribe(view.serializeParams(), function (xhr) {
            var subscribeResult = xhr.getResponseHeader('User-Newsletter-Subscribe-Result');

            view.setNewsletterSnippetContent(xhr.responseText);

            if (subscribeResult === "ok") {
                document.getElementById("us_id_newsletterSnippetEmail").value = '';
                handleSubscribeToNewsletterOnSuccess('/user/subscribeToNewsletter/info');
            }
        }, function () {
            newsletterSnippetButton = document.getElementsByClassName("us_js_newsletterSnippetButton")[0];

            if (!!newsletterSnippetButton) {
                buttonView.showButton(newsletterSnippetButton);
            }
        });
    }

    function registerEventHandler() {
        eventUtil.delegate(document, "focus", "#us_id_newsletterSnippetEmail", function () {
            tracking.sendTrackingInformation({
                "user_PermissionNewsletterSnippet_legalText": "shown"
            }, "event");
            view.showNewsletterLegalText();
        }, true);

        eventUtil.delegate(document, "keypress", "#us_id_newsletterSnippetEmail", function (event) {
            var newsletterSnippetButton = document.getElementsByClassName("us_js_newsletterSnippetButton")[0];

            if (event.keyCode === 13) {
                triggerSubscribe();
                buttonView.showSpinner(newsletterSnippetButton);
                eventUtil.stop(event);
            }
        });

        eventUtil.delegate(document, "click", "#us_id_newsletterSnippetLegalTextExpander", function () {
            tracking.sendTrackingInformation({
                "user_PermissionNewsletterSnippet_legalText": "shown"
            }, "event");
        });

        eventUtil.delegate(document, "click", ".us_js_newsletterSnippetButton", function () {
            triggerSubscribe();
        });
    }

    function triggerLoadNewsletterSnippetContent() {
        var isNewsletterSnippetContainerPresent = view.checkForNewsletterSnippetContainer(),
            trackingValue;

        if (isNewsletterSnippetContainerPresent) {
            service.loadNewsletterSnippetContent(function (xhr) {
                view.setNewsletterSnippetContent(xhr.responseText);
                registerEventHandler();
                trackingValue = xhr.getResponseHeader("X-Newsletter-Snippet");
                tracking.sendTrackingInformation({
                    user_NewsletterSnippet: trackingValue
                }, "merge");
            }, undefined);
        }
    }

    function init() {
        triggerLoadNewsletterSnippetContent();
    }

    return {
        triggerSubscribe: triggerSubscribe,
        triggerLoadNewsletterSnippetContent: triggerLoadNewsletterSnippetContent,
        init: init
    };
};