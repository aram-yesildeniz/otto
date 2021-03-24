var bottom_assets = function (e) {
    "use strict";

    function t(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function n(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }

    function i(e, t, i) {
        return t && n(e.prototype, t), i && n(e, i), e
    }

    function o(e) {
        window.o_tracking && window.o_tracking.bct && window.o_tracking.bct.sendMergeToTrackingServer && window.o_tracking.bct.sendMergeToTrackingServer(window.o_util.core.extend({
            ot_CookieBanner: "view",
            ot_CookieBannerVersion: e
        }))
    }

    function r(e, t) {
        l(e ? "agree" : "agree_automatic", t)
    }

    function s(e) {
        l("disagree", e)
    }

    function a(e) {
        l("otto_partner", e)
    }

    function c(e) {
        l("more_info", e)
    }

    function u(e) {
        l("data_usage", e)
    }

    function h(e) {
        l("info_agreement", e)
    }

    function l(e, t) {
        window.o_tracking && window.o_tracking.bct && window.o_tracking.bct.sendEventToTrackingServer && window.o_tracking.bct.sendEventToTrackingServer(window.o_util.core.extend({
            ot_CookieBanner: e,
            ot_CookieBannerVersion: t
        }))
    }
    var k = function () {
        function e(n, i, o, r, s) {
            t(this, e), this._window = n, this._document = i, this._banner = o, this._cookies = r, this._iab_feature_active = s, this._otto_partner = i.querySelector("#otto_partner"), this._more_info_link = this._document.querySelector("#more_info"), this._data_usage_link = this._document.querySelector("#data_usage"), this._info_agreement_link = this._document.querySelector("#info_agreement")
        }
        return i(e, [{
            key: "registerEventListener",
            value: function () {
                this.registerOnClickForMoreInfoLink(), this.registerOnClickForOttoPartner(), this.registerOnClickForDataUsage(), this.registerOnClickForInfoAgreementLink()
            }
        }, {
            key: "registerOnClickForOttoPartner",
            value: function () {
                this._otto_partner && this._otto_partner.addEventListener("click", (function () {
                    a(e.VERSION)
                }))
            }
        }, {
            key: "registerOnClickForDataUsage",
            value: function () {
                this._data_usage_link && this._data_usage_link.addEventListener("click", (function () {
                    u(e.VERSION)
                }))
            }
        }, {
            key: "registerOnClickForMoreInfoLink",
            value: function () {
                this._more_info_link && this._more_info_link.addEventListener("click", (function () {
                    c(e.VERSION)
                }))
            }
        }, {
            key: "registerOnClickForInfoAgreementLink",
            value: function () {
                this._info_agreement_link && this._info_agreement_link.addEventListener("click", (function () {
                    h(e.VERSION)
                }))
            }
        }, {
            key: "setPermission",
            value: function (e) {
                var t = this;
                try {
                    return this._iab_feature_active ? this._window.cmp.acceptAllConsents().then((function () {
                        return t.setPermissionForCBCookieAndTrackAgree(e)
                    })) : this.setPermissionForCBCookieAndTrackAgree(e)
                } catch (t) {
                    return this.setPermissionForCBCookieAndTrackAgree(e)
                }
            }
        }, {
            key: "setProhibition",
            value: function () {
                var e = this;
                try {
                    return this._iab_feature_active ? this._window.cmp.rejectAllConsents().then((function () {
                        return e.setProhibitionForCBCookieAndTrackDisagree()
                    })) : this.setProhibitionForCBCookieAndTrackDisagree()
                } catch (e) {
                    return this.setProhibitionForCBCookieAndTrackDisagree()
                }
            }
        }, {
            key: "setPermissionForCBCookieAndTrackAgree",
            value: function (t) {
                var n = this;
                return this._cookies.setAcceptedCbCookie().then((function () {
                    r(t, e.VERSION), n._window.o_global.eventQBus.emit("ft4.cookie-banner.consentAccepted"), n._banner.remove()
                }))
            }
        }, {
            key: "setProhibitionForCBCookieAndTrackDisagree",
            value: function () {
                var t = this;
                return this._cookies.setRejectedCbCookie().then((function () {
                    s(e.VERSION), t._window.o_global.eventQBus.emit("ft4.cookie-banner.consentRejected"), t._banner.remove()
                }))
            }
        }, {
            key: "createConsentIdCookieIfMissing",
            value: function () {
                var e = this;
                return new Promise((function (t, n) {
                    try {
                        void 0 === e._cookies.getConsentIdCookie() && e._cookies.setConsentId().then(t, n)
                    } catch (e) {}
                    t()
                }))
            }
        }, {
            key: "showBannerAndRegisterClickEventHandler",
            value: function () {
                var t = this;
                void 0 === this._cookies.getCbCookie() && this._banner.isAllowedToShow() && this._window.o_apps.shouldShowWebCookieBanner() && (this._banner.show((function () {
                    o(e.VERSION)
                })), this._banner.$permissionButton && this._banner.$permissionButton.addEventListener("click", (function () {
                    t.setPermission(!0)
                })), this._banner.$prohibitionButton && this._banner.$prohibitionButton.addEventListener("click", (function () {
                    t.setProhibition()
                })))
            }
        }, {
            key: "reclassifyIABConsentIfNecessary",
            value: function () {
                var e = this;
                return new Promise((function (t, n) {
                    var i = e;
                    setTimeout((function () {
                        var e = i._cookies.getCbCookie();
                        if (void 0 === i._cookies.getIabConsentCookie() && e) try {
                            "0" === e ? i._window.cmp.rejectAllConsents().then(t, n) : "1" === e || "2" === e ? i._window.cmp.acceptAllConsents().then(t, n) : t()
                        } catch (e) {
                            console.log("IAB reclassification failed. An exception occurred: " + e)
                        }
                    }), 5e3)
                }))
            }
        }, {
            key: "accept",
            value: function () {
                var e = this;
                return new Promise((function (t, n) {
                    e.createConsentIdCookieIfMissing().then((function () {
                        e.setPermission(!0).then(t, n)
                    }))
                }))
            }
        }, {
            key: "reject",
            value: function () {
                var e = this;
                return new Promise((function (t, n) {
                    e.createConsentIdCookieIfMissing().then((function () {
                        e.setProhibition().then(t, n)
                    }))
                }))
            }
        }]), e
    }();
    k.VERSION = "bottomCB";
    var d = function () {
        function e(n, i, o, r, s) {
            t(this, e), this._window = n, this._document = i, this._banner = o, this._cookies = r, this._o_global = n.o_global, this._iab_feature_active = s, this._otto_partner = this._document.querySelector("#otto_partner"), this._more_info_link = this._document.querySelector("#more_info"), this._data_usage_link = this._document.querySelector("#data_usage"), this._info_agreement_link = this._document.querySelector("#info_agreement"), this._curtain = this._document.querySelector("#cookie_banner_curtain"), this._cookie_banner = this._document.querySelector("#cookieBanner")
        }
        return i(e, [{
            key: "registerEventListener",
            value: function () {
                this.registerOnClickForMoreInfoLink(), this.registerOnClickForOttoPartner(), this.registerOnClickForDataUsage(), this.registerOnClickForInfoAgreementLink(), this.registerOnClickOnPCurtain(), this.registerTouchstartOnCookieBanner(), this.registerTouchstartOnCurtain()
            }
        }, {
            key: "registerOnClickForOttoPartner",
            value: function () {
                this._otto_partner && this._otto_partner.addEventListener("click", (function () {
                    a(e.VERSION)
                }))
            }
        }, {
            key: "registerOnClickForDataUsage",
            value: function () {
                this._data_usage_link && this._data_usage_link.addEventListener("click", (function () {
                    u(e.VERSION)
                }))
            }
        }, {
            key: "registerOnClickForMoreInfoLink",
            value: function () {
                this._more_info_link && this._more_info_link.addEventListener("click", (function () {
                    c(e.VERSION)
                }))
            }
        }, {
            key: "registerOnClickForInfoAgreementLink",
            value: function () {
                this._info_agreement_link && this._info_agreement_link.addEventListener("click", (function () {
                    h(e.VERSION)
                }))
            }
        }, {
            key: "registerOnClickOnPCurtain",
            value: function () {
                var e = this;
                this._curtain && this._curtain.addEventListener("click", (function () {
                    e.removeBannerVisibility()
                }))
            }
        }, {
            key: "registerTouchstartOnCookieBanner",
            value: function () {
                var e = this;
                this._cookie_banner && this._cookie_banner.addEventListener("touchstart", (function () {
                    e._cookie_banner.style.position = "fixed"
                }))
            }
        }, {
            key: "registerTouchstartOnCurtain",
            value: function () {
                var e = this;
                this._curtain && this._curtain.addEventListener("touchstart", (function () {
                    e._cookie_banner && (e._cookie_banner.style.position = "fixed")
                }))
            }
        }, {
            key: "setPermission",
            value: function (e) {
                var t = this;
                try {
                    return this._iab_feature_active ? this._window.cmp.acceptAllConsents().then((function () {
                        return t.setPermissionForCBCookieAndTrackAgree(e)
                    })) : this.setPermissionForCBCookieAndTrackAgree(e)
                } catch (t) {
                    return this.setPermissionForCBCookieAndTrackAgree(e)
                }
            }
        }, {
            key: "setProhibition",
            value: function () {
                var e = this;
                try {
                    return this._iab_feature_active ? this._window.cmp.rejectAllConsents().then((function () {
                        return e.setProhibitionForCBCookieAndTrackDisagree()
                    })) : this.setProhibitionForCBCookieAndTrackDisagree()
                } catch (e) {
                    return this.setProhibitionForCBCookieAndTrackDisagree()
                }
            }
        }, {
            key: "setPermissionForCBCookieAndTrackAgree",
            value: function (t) {
                var n = this;
                return this._cookies.setAcceptedCbCookie().then((function () {
                    r(t, e.VERSION), n._window.o_global.eventQBus.emit("ft4.cookie-banner.consentAccepted"), n._banner.remove()
                }))
            }
        }, {
            key: "setProhibitionForCBCookieAndTrackDisagree",
            value: function () {
                var t = this;
                return this._cookies.setRejectedCbCookie().then((function () {
                    s(e.VERSION), t._window.o_global.eventQBus.emit("ft4.cookie-banner.consentRejected"), t._banner.remove()
                }))
            }
        }, {
            key: "createConsentIdCookieIfMissing",
            value: function () {
                var e = this;
                return new Promise((function (t, n) {
                    try {
                        void 0 === e._cookies.getConsentIdCookie() && e._cookies.setConsentId().then(t, n)
                    } catch (e) {}
                    t()
                }))
            }
        }, {
            key: "showBannerAndRegisterClickEventHandler",
            value: function () {
                var t = this;
                void 0 === this._cookies.getCbCookie() && this._banner.isAllowedToShow() && this._window.o_apps.shouldShowWebCookieBanner() && (this._banner.show((function () {
                    t._curtain.style.display = "block", o(e.VERSION)
                })), this._banner.$permissionButton && this._banner.$permissionButton.addEventListener("click", (function () {
                    t.setPermission(!0), t.removeBannerVisibility()
                })), this._banner.$prohibitionButton && this._banner.$prohibitionButton.addEventListener("click", (function () {
                    t.setProhibition(), t.removeBannerVisibility()
                })))
            }
        }, {
            key: "reclassifyIABConsentIfNecessary",
            value: function () {
                var e = this;
                return new Promise((function (t, n) {
                    var i = e;
                    setTimeout((function () {
                        var e = i._cookies.getCbCookie();
                        if (void 0 === i._cookies.getIabConsentCookie() && e) try {
                            if ("0" === e) return i._window.cmp.rejectAllConsents().then(t, n);
                            "1" === e || "2" === e ? i._window.cmp.acceptAllConsents().then(t, n) : t()
                        } catch (e) {
                            console.log("IAB reclassification failed. An exception occurred: " + e)
                        }
                    }), 5e3)
                }))
            }
        }, {
            key: "accept",
            value: function () {
                var e = this;
                return new Promise((function (t, n) {
                    e.createConsentIdCookieIfMissing().then((function () {
                        e.setPermission(!0).then(t, n)
                    }))
                }))
            }
        }, {
            key: "reject",
            value: function () {
                var e = this;
                return new Promise((function (t, n) {
                    return e.createConsentIdCookieIfMissing().then((function () {
                        e.setProhibition().then(t, n)
                    }))
                }))
            }
        }, {
            key: "removeBannerVisibility",
            value: function () {
                var e = this._document.getElementById("cookieBanner");
                e && (e.style.visibility = "hidden"), this._curtain && (this._curtain.style.display = "none")
            }
        }]), e
    }();
    d.VERSION = "floatingCB";
    var _ = function () {
            function e(n) {
                t(this, e), this.visibilityClass = "cookieBanner--visibility", this.wrapperClass = ".gridAndInfoContainer .gridContainer", this.bannerWrapperClass = ".cookieBanner .cookieBanner__wrapper", this.pseudoLayerClassFT4 = ".ft4_modal", this.pseudoLayerClassIdentity = ".identity_modal", this.privacyPage = "/datenschutz", this.resizeTimeout = null, this.moreInfoLinkSelector = ".cookieBanner__info a", this.permissionButtonSelector = ".js_cookieBannerPermissionButton", this.prohibitionButtonSelector = ".js_cookieBannerProhibitionButton", this.$banner = document.getElementById("cookieBanner"), this.$bannerWrapper = document.querySelector(this.bannerWrapperClass), this.$body = document.body, this.$pageWrapper = document.querySelector(this.wrapperClass) || document.querySelector(this.pseudoLayerClassFT4) || document.querySelector(this.pseudoLayerClassIdentity), this.$moreInfoLink = this.$banner ? this.$banner.querySelector(this.moreInfoLinkSelector) : null, this.$permissionButton = this.$banner ? this.$banner.querySelector(this.permissionButtonSelector) : null, this.$prohibitionButton = this.$banner ? this.$banner.querySelector(this.prohibitionButtonSelector) : null, this.variant = n
            }
            return i(e, [{
                key: "resizeHandler",
                value: function (t, n, i) {
                    var o = this;
                    this.resizeTimeout && window.cancelAnimationFrame && window.cancelAnimationFrame(this.resizeTimeout), window.requestAnimationFrame ? this.resizeTimeout = window.requestAnimationFrame((function () {
                        e.adjustResizeStyling(t, n, i)
                    })) : this.resizeTimeout = window.setTimeout((function () {
                        o.resizeTimeout = null, e.adjustResizeStyling(t, n, i)
                    }), 66)
                }
            }, {
                key: "resetBodySpacing",
                value: function () {
                    null !== this.$pageWrapper && (this.$pageWrapper.style.paddingBottom = "0px")
                }
            }, {
                key: "isAllowedToShow",
                value: function () {
                    var e = window.location.href.indexOf(this.privacyPage) > -1;
                    return !(!this.$pageWrapper || !this.$banner || e)
                }
            }, {
                key: "show",
                value: function (t) {
                    var n = this;
                    if (null !== this.$banner && null !== this.$bannerWrapper && null !== this.$body && null !== this.$pageWrapper)
                        if (this.isFloatingVariant()) this.$body.insertBefore(this.$banner, this.$body.lastChild), this.$banner.classList.add(this.visibilityClass), this.$banner.style.display = "block";
                        else {
                            var i = window.getComputedStyle(this.$banner).height,
                                o = window.getComputedStyle(this.$bannerWrapper, "::before").height;
                            e.moveBannerFragment(this.$banner, this.$body), this.$banner.style.marginBottom = "".concat(-1 * (parseInt(i || "0") + parseInt(o || "0") / 2 + 10), "px"), this.$banner.classList.add(this.visibilityClass)
                        } null !== this.$banner && null !== this.$bannerWrapper && null !== this.$pageWrapper && (this.isFloatingVariant() || (this.$banner.style.marginBottom = "0px", e.adjustResizeStyling(this.$banner, this.$bannerWrapper, this.$pageWrapper), window.addEventListener("resize", (function () {
                        null !== n.$banner && null !== n.$bannerWrapper && null !== n.$pageWrapper && n.resizeHandler(n.$banner, n.$bannerWrapper, n.$pageWrapper)
                    }))), "function" == typeof t && t())
                }
            }, {
                key: "remove",
                value: function () {
                    this.resetBodySpacing(), null !== this.$banner && this.$banner.parentNode && this.$banner.parentNode.removeChild(this.$banner)
                }
            }, {
                key: "isFloatingVariant",
                value: function () {
                    return this.variant === d.VERSION
                }
            }], [{
                key: "adjustResizeStyling",
                value: function (e, t, n) {
                    var i = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                        o = window.getComputedStyle(e).height,
                        r = window.getComputedStyle(t, "::before").height;
                    i && (e.style.maxHeight = "".concat(i, "px")), n.style.paddingBottom = "".concat(parseInt(o || "0") + parseInt(r || "0") / 2 + 10, "px")
                }
            }, {
                key: "moveBannerFragment",
                value: function (e, t) {
                    t.insertBefore(e, t.firstChild)
                }
            }]), e
        }(),
        f = function () {
            function e(n, i) {
                t(this, e), this._cbCookieName = "cb", this._cbContext = "test/user-cookie-banner-cb", this._acceptCbCookieEndpoint = "test/setExplicitCookie", this._rejectCbCookieEndpoint = "test/setRejectCookie", this._consentIdCookieName = "consentId", this._consentIdContext = "test/user-set-consent-id-cookie", this._iabConsentCookieName = "iabConsent", this._cookieUtil = n, this._ajaxUtil = i
            }
            return i(e, [{
                key: "getConsentIdCookie",
                value: function () {
                    return this._cookieUtil.get(this._consentIdCookieName)
                }
            }, {
                key: "getCbCookie",
                value: function () {
                    return this._cookieUtil.get(this._cbCookieName)
                }
            }, {
                key: "getIabConsentCookie",
                value: function () {
                    return this._cookieUtil.get(this._iabConsentCookieName)
                }
            }, {
                key: "setConsentId",
                value: function () {
                    return this._ajaxUtil.get("".concat(this._consentIdContext))
                }
            }, {
                key: "setAcceptedCbCookie",
                value: function () {
                    return this._ajaxUtil.get("".concat(this._cbContext).concat(this._acceptCbCookieEndpoint))
                }
            }, {
                key: "setRejectedCbCookie",
                value: function () {
                    return this._ajaxUtil.get("".concat(this._cbContext).concat(this._rejectCbCookieEndpoint))
                }
            }]), e
        }(),
        C = function () {
            var e = window.o_util.toggle.get("IAB_FEATURE_ACTIVE", !1),
                t = new _(k.VERSION),
                n = new f(window.o_util.cookie, window.o_util.ajax),
                i = new k(window, document, t, n, e);
            i.registerEventListener(), i.createConsentIdCookieIfMissing(), i.showBannerAndRegisterClickEventHandler(), e && i.reclassifyIABConsentIfNecessary(), window.cookieBanner = i
        };
    return window.o_global.eventLoader.onAllScriptsExecuted(10, (function () {
        return C()
    })), e.bootstrap = C, e
}({});
//# sourceMappingURL=/user-cookie-banner/ft4.cookie-banner.bottom_assets.0c50af50.js.map