var onsite = function (e) {
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
    var a = function () {
            function e() {
                t(this, e)
            }
            return i(e, [{
                key: "fetchAndSetAndGet",
                value: function (e) {
                    return o_util.cookie.exists("cb") && "0" !== o_util.cookie.get("cb") ? o_util.ajax({
                        url: "https://static.adfarm1.adition.com/cn.sjs",
                        method: "GET",
                        withCredentials: !0
                    }).then((function (e) {
                        return e.responseText || ""
                    })).then((function (e) {
                        return e.trim()
                    })).then((function (t) {
                        var n = e.split(".");
                        return n = n.splice(n.length - 2).join("."), o_util.cookie.set("aditionUserId", t, {
                            domain: n,
                            days: "3650",
                            samesite: "None"
                        }), t
                    })) : Promise.resolve("")
                }
            }]), e
        }(),
        o = function () {
            function e(n) {
                t(this, e), this.shoppingProcess = n
            }
            return i(e, [{
                key: "enterShoppingProcess",
                value: function () {
                    this.shoppingProcess.enterShoppingProcess()
                }
            }, {
                key: "leaveShoppingProcess",
                value: function () {
                    this.shoppingProcess.leaveShoppingProcess()
                }
            }]), e
        }();
    window.adition = window.adition || {}, window.adition.srq = window.adition.srq || [], window.o_wo = window.o_wo || {};
    var s = function () {
            function e(n, i, a, o, s, r, l) {
                t(this, e), this.clickTracking = n, this.viewTracking = i, this.trackingApi = a, this.watoRequest = o, this.productData = s, this.shoppingProcess = r, this.utils = l
            }
            return i(e, [{
                key: "_appendWrapperDiv",
                value: function (e, t) {
                    var n = document.createElement("div");
                    return n.id = t, null !== e && e.appendChild(n), n
                }
            }, {
                key: "_hasSearchTerm",
                value: function () {
                    var e = document.getElementById("san_searchResult");
                    return e && e.getAttribute("data-userquery")
                }
            }, {
                key: "_getSearchTerm",
                value: function () {
                    var e = document.getElementById("san_searchResult").getAttribute("data-userquery");
                    return encodeURIComponent(this.productData.cleanupSearchTerm(e))
                }
            }, {
                key: "_addCssClass",
                value: function (e, t) {
                    e.classList ? e.classList.add(t) : e.className += " " + t
                }
            }, {
                key: "_setIframeHeightToBannerHeight",
                value: function (e) {
                    var t = e && e.contentWindow && e.contentWindow.document && e.contentWindow.document.getElementsByTagName("img");
                    t && t.length > 0 && (e.height = t[0].scrollHeight)
                }
            }, {
                key: "_makeIframeScalable",
                value: function (e) {
                    1 === e.length && (e[0].style.width = "100%", e[0].style.maxWidth = "400px", this._setIframeHeightToBannerHeight(e[0]))
                }
            }, {
                key: "_setCharacteristicProfiles",
                value: function (e, t) {
                    if (t) {
                        var n = JSON.parse(t);
                        for (var i in n)
                            if (Object.prototype.hasOwnProperty.call(n, i)) {
                                var a = n[i];
                                e.setProfile(i, a)
                            }
                    }
                }
            }, {
                key: "_shouldNotRender",
                value: function (e) {
                    return "" === e.getBannerCode()
                }
            }, {
                key: "_prepareRenderingSlot",
                value: function (e, t, n) {
                    var i, a = this;
                    i = "wo_av_sidebar" === e ? document.querySelectorAll(".av_anchor").item(0) : document.getElementById("san_av_bottom") || document.getElementById("wato_av_bottom");
                    var o = this._appendWrapperDiv(i, e);
                    this._addCssClass(i, "wo_avContent"), window.adition.srq.push((function (i) {
                        var s = a.shoppingProcess.isInShoppingProcess() ? "true" : "false",
                            r = t.av_id;
                        o_util.cookie.exists("cb") && "0" !== o_util.cookie.get("cb") ? i.identityService.setUserId(n) : (i.disableCookies(), i.identityService.setUserId(n).optout()), i.registerAdfarm("as.otto.de"), i.setProfile("ishp", s), "ads" === t.identifier && a.productData.setProductDataProfiles(i), a._hasSearchTerm() && i.setProfile("sw", a._getSearchTerm()), i.setProfile("app", o_util.cookie.exists("app").toString()), i.configureRenderSlot(e).setContentunitId(r).setRenderer("iframe"), a._setCharacteristicProfiles(i, t.mostImportantCharacteristics), t.convertedDresonRule && i.setProfile("dresonrule", t.convertedDresonRule), i.events.onPreRender((function (e, t, n) {
                            if (a._shouldNotRender(t)) n.disable();
                            else {
                                a._addCssClass(o, "wo_marginTop"), a._addCssClass(o, "wo_marginBottom");
                                var i, s = t.getOptions(),
                                    r = a._buildTitle(s);
                                o.appendChild(r), (i = document.createElement("div")).className = "wo_avInnerWrapper", n.addInnerWrapper(i)
                            }
                        })), i.events.onNoBanner((function () {
                            a.viewTracking.trackNoView(t)
                        })), i.events.onFinishLoading((function (n, i) {
                            if (a.viewTracking.trackView(i.getOptions(), t), "wo_av_bottombar" === e) {
                                var o = n.getElementsByTagName("iframe");
                                a._makeIframeScalable(o)
                            }
                            a._registerTrackingClickHandler(i.getOptions())
                        })), i.load([e]).completeRendering()
                    })), this._loadSingleRequest()
                }
            }, {
                key: "_retrieveAvContent",
                value: function (e, t, n) {
                    var i = {
                        sidebar: "wo_av_sidebar",
                        bottombar: "wo_av_bottombar"
                    };
                    this._prepareRenderingSlot(i[t], e, n), window.adition.srq.push((function (e) {
                        return e.renderSlot(i[t])
                    }))
                }
            }, {
                key: "_registerTrackingClickHandler",
                value: function (e) {
                    var t = this,
                        n = document.querySelector(".wo_avInnerWrapper iframe");
                    if (n) {
                        var i = n.contentDocument ? n.contentDocument : n.contentWindow.document;
                        if ("loading" === i.readyState) return i.addEventListener("DOMContentLoaded", (function () {
                            var n = i.getElementsByTagName("a")[0];
                            t.clickTracking.registerClickHandler(n, (function () {
                                return t.clickTracking.trackClick(e)
                            }))
                        }));
                        var a = i.getElementsByTagName("a")[0];
                        this.clickTracking.registerClickHandler(a, (function () {
                            return t.clickTracking.trackClick(e)
                        }))
                    }
                }
            }, {
                key: "_buildTitle",
                value: function (e) {
                    var t = document.createElement("p");
                    return t.className = "wo_caption", e && "true" === e.internal ? t.innerHTML = "Aktuell bei OTTO" : t.innerHTML = "Anzeige", t
                }
            }, {
                key: "_loadSingleRequest",
                value: function () {
                    var e = this;
                    if (!document.getElementById("wo_singleRequestScript")) {
                        this.trackingApi.sendMergeRequest({
                            wato_AinfoResponse: "true"
                        });
                        var t = document.createElement("script");
                        t.id = "wo_singleRequestScript", t.type = "text/javascript", t.src = "https://is.otto.de/js/srp.js", t.charset = "utf-8", t.async = !0;
                        var n = document.getElementsByTagName("script")[0];
                        t.onload = function () {
                            e.trackingApi.sendMergeRequest({
                                wato_Request: "true"
                            })
                        }, n.parentNode.insertBefore(t, n)
                    }
                }
            }, {
                key: "_sidebarContentShouldBeLoaded",
                value: function () {
                    return document.getElementsByClassName("av_anchor").length > 0 && this.utils.isCurrentWindowWideEnough()
                }
            }, {
                key: "_bottombarContentShouldBeLoaded",
                value: function () {
                    var e = o_global.breakpoint.isSmall() || o_global.breakpoint.isMedium();
                    return (!!document.getElementById("san_av_bottom") || !!document.getElementById("wato_av_bottom")) && e
                }
            }, {
                key: "_getAvData",
                value: function (e) {
                    var t = this;
                    return this.watoRequest.getAvData(e).then((function (n) {
                        var i = n.responseJSON,
                            a = n.aditionUserId;
                        return t._retrieveAvContent(i, e, a)
                    })).catch((function (e) {
                        t.utils.debugLog(e)
                    }))
                }
            }, {
                key: "_tryToRenderContent",
                value: function () {
                    return !window.o_wo.sidebarRendered && this._sidebarContentShouldBeLoaded() ? (window.o_wo.sidebarRendered = !0, this._getAvData("sidebar")) : !window.o_wo.bottombarRendered && this._bottombarContentShouldBeLoaded() ? (window.o_wo.sidebarRendered = !0, this._getAvData("bottombar")) : Promise.reject("found no place to render.")
                }
            }, {
                key: "fillAvContent",
                value: function () {
                    var e = this;
                    this._tryToRenderContent().catch((function (t) {
                        return e.utils.debugLog(t)
                    }))
                }
            }]), e
        }(),
        r = function () {
            function e(n) {
                t(this, e), this.trackingApi = n
            }
            return i(e, [{
                key: "trackClick",
                value: function (e) {
                    var t = e.campaignid ? e.campaignid : "noContent",
                        n = e.bannerid ? e.bannerid : "noContent";
                    this.trackingApi.trackOnNextPageImpression({
                        wato_AdClick: "true",
                        "wk.wato_AdContentClick": t + "$" + n,
                        ot_AccPath: "wato"
                    })
                }
            }, {
                key: "registerClickHandler",
                value: function (e, t) {
                    if (e) {
                        e.addEventListener("click", (function n(i) {
                            i.preventDefault(), e.removeEventListener("click", n), t(), e.click(), e.addEventListener("click", n)
                        }))
                    }
                }
            }]), e
        }(),
        l = function () {
            function e(n) {
                t(this, e), this.keys = [88, 77, 65, 83], this.index = 0, this.trackingApi = n
            }
            return i(e, [{
                key: "init",
                value: function () {
                    var e = this;
                    document.addEventListener("keydown", (function (t) {
                        return e.handler(t)
                    }))
                }
            }, {
                key: "snow",
                value: function () {
                    var e = document.createElement("style");
                    e.innerHTML = "\n.snowflake {\n  color: #fff;\n  font-size: 1em;\n  font-family: Arial, sans-serif;\n  text-shadow: 0 0 5px #000;\n}\n.snowman {\n  font-size: 2em;\n  color: red;\n}\n@-webkit-keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@-webkit-keyframes snowflakes-shake{0%,100%{-webkit-transform:translateX(0);transform:translateX(0)}50%{-webkit-transform:translateX(80px);transform:translateX(80px)}}@keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@keyframes snowflakes-shake{0%,100%{transform:translateX(0)}50%{transform:translateX(80px)}}.snowflake{position:fixed;top:-10%;z-index:9999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default;-webkit-animation-name:snowflakes-fall,snowflakes-shake;-webkit-animation-duration:10s,3s;-webkit-animation-timing-function:linear,ease-in-out;-webkit-animation-iteration-count:infinite,infinite;-webkit-animation-play-state:running,running;animation-name:snowflakes-fall,snowflakes-shake;animation-duration:10s,3s;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite;animation-play-state:running,running}\n.snowflake:nth-of-type(0){left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s}\n.snowflake:nth-of-type(1){left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s}\n.snowflake:nth-of-type(2){left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s}\n.snowflake:nth-of-type(3){left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s}\n.snowflake:nth-of-type(4){left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s}\n.snowflake:nth-of-type(5){left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s}\n.snowflake:nth-of-type(6){left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s}\n.snowflake:nth-of-type(7){left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s}\n.snowflake:nth-of-type(8){left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s}\n.snowflake:nth-of-type(9){left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s}\n.snowflake:nth-of-type(10){left:25%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s}\n.snowflake:nth-of-type(11){left:65%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s}\n\n.snowflake:nth-of-type(12){left:85%;-webkit-animation-delay:0.1s,0.5s;animation-delay:0.1s,0.5s}\n.snowflake:nth-of-type(13){left:95%;-webkit-animation-delay:1.7s,1s;animation-delay:1.7s,1s}\n.snowflake:nth-of-type(14){left:87%;-webkit-animation-delay:6s,.2s;animation-delay:6s,.2s}\n.snowflake:nth-of-type(15){left:55%;-webkit-animation-delay:3s,2s;animation-delay:3s,2s}\n.snowflake:nth-of-type(16){left:75%;-webkit-animation-delay:2s,1.5s;animation-delay:2s,1.5s}\n.snowflake:nth-of-type(17){left:65%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s}\n.snowflake:nth-of-type(18){left:22%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s}\n.snowflake:nth-of-type(19){left:45%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s}\n.snowflake:nth-of-type(20){left:35%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s}\n.snowflake:nth-of-type(21){left:82%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s}\n.snowflake:nth-of-type(22){left:15%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s}\n.snowflake:nth-of-type(23){left:7%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s}\n", document.head.appendChild(e);
                    var t = document.createElement("div");
                    t.classList.add("snowflakes");
                    for (var n = 0; n < 24; n++) {
                        var i = document.createElement("div");
                        i.textContent = n % 2 == 0 ? "???" : "???", i.classList.add("snowflake"), t.appendChild(i)
                    }
                    document.body.appendChild(t)
                }
            }, {
                key: "handler",
                value: function (e) {
                    var t = this,
                        n = document.activeElement && "INPUT" !== document.activeElement.tagName && "SELECT" !== document.activeElement.tagName,
                        i = e.keyCode === this.keys[this.index];
                    n && i ? (this.index += 1, this.index === this.keys.length && (document.removeEventListener("keydown", (function () {
                        return t.handler()
                    })), this.snow(), this.trackingApi.sendEventRequest({
                        wato_xmas: "trigger"
                    }))) : this.index = 0
                }
            }]), e
        }(),
        u = function () {
            function e() {
                t(this, e)
            }
            return i(e, [{
                key: "stringReplaceAll",
                value: function (e, t) {
                    var n = e;
                    for (var i in t) n = n.replace(new RegExp(t[i], "g"), i);
                    return n
                }
            }, {
                key: "cleanupSearchTerm",
                value: function (e) {
                    return this.stringReplaceAll(e, {
                        Ae: "[??]",
                        ae: "[??]",
                        oe: "[??]",
                        Oe: "[??]",
                        Ue: "[??]",
                        ue: "[??]",
                        "-": "[ ]",
                        _: "[\\/]",
                        ss: "[??]",
                        "": "^_|_$|[^a-zA-Z0-9.,_\\-]"
                    })
                }
            }, {
                key: "cleanupBrandName",
                value: function (e) {
                    return this.stringReplaceAll(e.toUpperCase(), {
                        _AND_: "&",
                        PLUS: "[+]",
                        _: "[. -]",
                        A: "[????????????]",
                        AE: "[????]",
                        C: "[????]",
                        E: "[??????????]",
                        I: "[????????]",
                        N: "??",
                        O: "[????????????]",
                        OE: "[??????]",
                        R: "??",
                        S: "[????]",
                        SS: "??",
                        U: "[????????]",
                        UE: "??",
                        Y: "[????]",
                        "": "[^\\w\\s_]"
                    })
                }
            }, {
                key: "setProductDataProfiles",
                value: function (e) {
                    var t = document.getElementById("avJson");
                    if (t) {
                        var n = JSON.parse(t.textContent);
                        n.id && e.setProfile("productId", n.id), n.businessCategory && n.businessCategory.value && e.setProfile("categoryValue", n.businessCategory.value), n.businessCategory && n.businessCategory.group && e.setProfile("categoryGroup", n.businessCategory.group), n.brand && e.setProfile("brand", this.cleanupBrandName(n.brand)), n.retailPrice && e.setProfile("price", n.retailPrice), n.classificationGroup && e.setProfile("classificationGroup", n.classificationGroup)
                    }
                }
            }]), e
        }(),
        c = "inShoppingProcess",
        d = function () {
            function e(n) {
                t(this, e), this.utils = n
            }
            return i(e, [{
                key: "enterShoppingProcess",
                value: function () {
                    var e = o_util.cookie.get("visitorId");
                    if (e) {
                        var t = JSON.stringify({
                            visitorId: e,
                            timeStamp: this.utils.getCurrentTimeStamp()
                        });
                        try {
                            localStorage.setItem(c, t)
                        } catch (e) {
                            this.utils.warn("enterShoppingProcess:", e)
                        }
                    }
                }
            }, {
                key: "leaveShoppingProcess",
                value: function () {
                    try {
                        localStorage.removeItem(c)
                    } catch (e) {
                        this.utils.warn("leaveShoppingProcess:", e)
                    }
                }
            }, {
                key: "isInShoppingProcess",
                value: function () {
                    try {
                        var e = o_util.cookie.get("visitorId"),
                            t = localStorage.getItem(c);
                        if (e && t) {
                            var n = JSON.parse(t),
                                i = new Date(n.timeStamp);
                            if (i.setMinutes(i.getMinutes() + 30), e === n.visitorId && i.getTime() > this.utils.getCurrentTimeStamp()) return !0
                        }
                    } catch (e) {
                        this.utils.warn("isInShoppingProcess:", e)
                    }
                    return !1
                }
            }]), e
        }(),
        f = function () {
            function e(n) {
                t(this, e), this.utils = n
            }
            return i(e, [{
                key: "sendEventRequest",
                value: function (e) {
                    this._isTrackingBctAvailable() && (o_tracking.bct.sendEventToTrackingServer(e), this.utils.debugLog("adition event tracking", e))
                }
            }, {
                key: "sendEventMergeRequest",
                value: function (e, t) {
                    this._isTrackingBctAvailable() && (o_tracking.bct.sendEventMergeToTrackingServer(e, t), this.utils.debugLog("adition event merge tracking", e, t))
                }
            }, {
                key: "sendMergeRequest",
                value: function (e) {
                    this._isTrackingBctAvailable() && (o_tracking.bct.sendMergeToTrackingServer(e), this.utils.debugLog("adition merge tracking", e))
                }
            }, {
                key: "trackOnNextPageImpression",
                value: function (e) {
                    this._isTrackingBctAvailable() && (o_tracking.bct.trackOnNextPageImpression(e), this.utils.debugLog("adition tracking event on next page impression", e))
                }
            }, {
                key: "_isTrackingBctAvailable",
                value: function () {
                    return o_tracking && o_tracking.bct
                }
            }]), e
        }(),
        m = function () {
            function e() {
                t(this, e)
            }
            return i(e, [{
                key: "debugLog",
                value: function (e) {
                    if (o_global && o_global.debug && o_global.debug.status && !0 === o_global.debug.status().activated) {
                        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
                        console.log(e, n)
                    }
                }
            }, {
                key: "getCurrentTimeStamp",
                value: function () {
                    return (new Date).getTime()
                }
            }, {
                key: "getWindowInnerWidth",
                value: function (e) {
                    return (e || window).innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                }
            }, {
                key: "isCurrentWindowWideEnough",
                value: function (e) {
                    return this.getWindowInnerWidth(e) >= 1232
                }
            }]), e
        }(),
        g = function () {
            function e(n) {
                t(this, e), this.trackingApi = n
            }
            return i(e, [{
                key: "trackView",
                value: function (e, t) {
                    var n = e.campaignid ? e.campaignid : "noContent",
                        i = e.bannerid ? e.bannerid : "noContent";
                    this.trackingApi.sendMergeRequest({
                        wato_AdActivity: "view",
                        wato_AdContent: n + "$" + i,
                        wato_AdPosition: t.websiteid + "$" + t.av_id
                    })
                }
            }, {
                key: "trackNoView",
                value: function (e) {
                    this.trackingApi.sendMergeRequest({
                        wato_AdActivity: "false",
                        wato_AdPosition: e.websiteid + "$" + e.av_id
                    })
                }
            }]), e
        }(),
        h = function () {
            function e(n, i) {
                t(this, e), this.trackingApi = n, this.aditionCookie = i
            }
            return i(e, [{
                key: "_getSelectionRule",
                value: function (e) {
                    return e.getAttribute("data-rule")
                }
            }, {
                key: "_isAditionEnabled",
                value: function () {
                    return "true" !== o_util.cookie.get("seleniumBypassAdvertising")
                }
            }, {
                key: "_hasClass",
                value: function (e, t) {
                    return e && e.classList.contains(t)
                }
            }, {
                key: "_getAditionIdentifier",
                value: function () {
                    var e = document.getElementById("avContent");
                    return this._hasClass(e, "js_av_searchResult") ? {
                        identifier: "suchergebnisseite"
                    } : this._hasClass(e, "js_av_productList") || this._hasClass(e, "js_av_teaser") ? {
                        identifier: "kategorieseite",
                        rule: this._getSelectionRule(e)
                    } : this._hasClass(e, "user_logout") ? {
                        identifier: "logoutseite"
                    } : this._hasClass(e, "storeFrontAV") ? {
                        identifier: "storefront"
                    } : "Suchergebnisseite" === document.getElementsByTagName("html")[0].getAttribute("data-pagecluster") ? {
                        identifier: "suchergebnisseite"
                    } : document.getElementById("avJson") ? {
                        identifier: "ads"
                    } : null
                }
            }, {
                key: "_toRuleParameter",
                value: function (e) {
                    return e ? "&rule=".concat(e) : ""
                }
            }, {
                key: "getAvData",
                value: function (e) {
                    var t = this;
                    if (!this._isAditionEnabled()) return Promise.reject("Adition is disabled - not calling wato in the first place");
                    var n = this._getAditionIdentifier();
                    if (null === n) return Promise.reject("Could not identify the page type");
                    this.trackingApi.sendMergeRequest({
                        wato_AinfoRequest: "true"
                    });
                    var i = "test/wato-onsite/a_info?identifier=".concat(encodeURIComponent(n.identifier), "&areatype=").concat(encodeURIComponent(e)).concat(this._toRuleParameter(n.rule));
                    return Promise.resolve(o_util.ajax.getJSON(i).then((function (e) {
                        return 200 === e.status && e.responseJSON && e.responseJSON.av_id ? t.aditionCookie.fetchAndSetAndGet(window.location.hostname).then((function (t) {
                            return Promise.resolve({
                                responseJSON: e.responseJSON,
                                aditionUserId: t
                            })
                        })) : Promise.reject({
                            message: "Got nothing of use from wato - aborting.",
                            response: e
                        })
                    })))
                }
            }]), e
        }(),
        k = new a,
        p = new u,
        v = new m,
        w = new f(v),
        y = new d(v),
        _ = new g(w),
        b = new r(w),
        C = new h(w, k),
        S = new o(y);

    function A() {
        window.o_global.eventLoader.onLoad(30, (function () {
            o_tracking && o_tracking.optOut && !o_tracking.optOut.isUserOptOut() && new s(b, _, w, C, p, y, v).fillAvContent(), o_util.toggle.get("FT6_EASTEREGGS", !1) && new l(w).init()
        }))
    }
    return window.o_wo = window.o_wo || {}, window.o_wo.api = S, A(), e.bootstrap = A, e
}({});
//# sourceMappingURL=/wato-onsite/assets/ft6.wato.onsite.be75ff78.js.map