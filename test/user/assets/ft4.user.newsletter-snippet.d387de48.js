var o_user = o_user || {},
    o_global = o_global || {},
    o_util = o_util || {};
o_user.newsletter = o_user.newsletter || {}, o_user.newsletter.snippet = o_user.newsletter.snippet || {}, o_global.pali = o_global.pali || {}, o_util.ajax = o_util.ajax || {}, o_util.event = o_util.event || {}, o_user.newsletter.snippet.serviceBuilder = function (e) {
    "use strict";
    var t = "/test";
    return {
        subscribe: function subscribe(n, s, r) {
            e({
                method: "POST",
                url: t + "/subscribeToNewsletterSnippet",
                data: n,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8"
            }).then(function (e) {
                e.status >= 200 && e.status < 300 || 304 === e.status ? s(e) : r();
            }).catch(function () {});
        },
        loadNewsletterSnippetContent: function loadNewsletterSnippetContent(n, s) {
            e.get(t + "/user/subscribeToNewsletterSnippetContent").then(function (e) {
                e.status >= 200 && e.status < 300 || 304 === e.status ? n(e) : s();
            }).catch(function () {});
        }
    };
}, o_user.newsletter.snippet.viewBuilder = function (e, t) {
    "use strict";
    return {
        checkForNewsletterSnippetContainer: function checkForNewsletterSnippetContainer() {
            return !!e.getElementById("us_id_newsletterSnippet");
        },
        setNewsletterSnippetContent: function setNewsletterSnippetContent(t) {
            e.getElementById("us_id_newsletterSnippet").innerHTML = t;
        },
        showNewsletterLegalText: function showNewsletterLegalText() {
            var n = e.getElementById("us_id_newsletterSnippetLegalText");
            t.isSmall() || t.isMedium() ? n.classList.add("us_newsletterSnippetLegalTextOpen") : n.classList.add("p_expander--decrease");
        },
        serializeParams: function serializeParams() {
            var t = e.getElementById("us_id_newsletterSnippetForm");
            return o_user.common.serializeForm(t);
        }
    };
}, o_user.newsletter.snippet.presenterBuilder = function (e, t, n, s, r, i, o) {
    "use strict";

    function l() {
        var i;
        t.subscribe(n.serializeParams(), function (t) {
            var r, i, o = t.getResponseHeader("User-Newsletter-Subscribe-Result");
            n.setNewsletterSnippetContent(t.responseText), "ok" === o && (e.getElementById("us_id_newsletterSnippetEmail").value = "", r = "/user/subscribeToNewsletter/info", i = new CustomEvent("user.newsletterDoiStarted"), e.dispatchEvent(i), new s({
                width: "700px",
                url: r
            }).open());
        }, function () {
            (i = e.getElementsByClassName("us_js_newsletterSnippetButton")[0]) && r.showButton(i);
        });
    }

    function u() {
        var s;
        n.checkForNewsletterSnippetContainer() && t.loadNewsletterSnippetContent(function (t) {
            n.setNewsletterSnippetContent(t.responseText), o.delegate(e, "focus", "#us_id_newsletterSnippetEmail", function () {
                i.sendTrackingInformation({
                    user_PermissionNewsletterSnippet_legalText: "shown"
                }, "event"), n.showNewsletterLegalText();
            }, !0), o.delegate(e, "keypress", "#us_id_newsletterSnippetEmail", function (t) {
                var n = e.getElementsByClassName("us_js_newsletterSnippetButton")[0];
                13 === t.keyCode && (l(), r.showSpinner(n), o.stop(t));
            }), o.delegate(e, "click", "#us_id_newsletterSnippetLegalTextExpander", function () {
                i.sendTrackingInformation({
                    user_PermissionNewsletterSnippet_legalText: "shown"
                }, "event");
            }), o.delegate(e, "click", ".us_js_newsletterSnippetButton", function () {
                l();
            }), s = t.getResponseHeader("X-Newsletter-Snippet"), i.sendTrackingInformation({
                user_NewsletterSnippet: s
            }, "merge");
        }, void 0);
    }
    return {
        triggerSubscribe: l,
        triggerLoadNewsletterSnippetContent: u,
        init: function init() {
            u();
        }
    };
}, o_global.eventLoader.onAllScriptsExecuted(100, function () {
    "use strict";
    o_user.newsletter.snippet.initialized || (o_user.newsletter.snippet.initialized = !0, o_user.newsletter.snippet.service = o_user.newsletter.snippet.serviceBuilder(o_util.ajax), o_user.newsletter.snippet.view = o_user.newsletter.snippet.viewBuilder(document, o_global.breakpoint), o_user.newsletter.snippet.presenter = o_user.newsletter.snippet.presenterBuilder(document, o_user.newsletter.snippet.service, o_user.newsletter.snippet.view, o_global.pali.layerBuilder, o_user.common.button.view, o_user.tracking, o_util.event), o_user.newsletter.snippet.presenter.init());
}); //# sourceMappingURL=/user/assets/ft4.user.newsletter-snippet.d387de48.js.map