var o_wishlist = window.o_wishlist || {};
o_wishlist.InitiateMiniWishlist = function () {
    "use strict";
    var e, t = document.getElementById("wl_mini_amount"),
        i = null !== t,
        n = "wl_mini__badge--empty",
        o = new o_global.Storage(window.localStorage),
        a = "wl_miniWishlistAmount";

    function s() {
        return o_util.cookie.get("visitorId");
    }

    function r(e) {
        var t = {
            amount: e,
            vid: s(),
            expire: new Date().getTime() + 3e5,
            loggedIn: o_wishlist.utils.isLoggedIn()
        };
        return o.setItem(a, JSON.stringify(t)), e;
    }

    function u(e) {
        try {
            var t = JSON.parse(e);
            return t && t.expire > new Date().getTime() && t.vid === s() && t.loggedIn === o_wishlist.utils.isLoggedIn() ? t.amount : void 0;
        } catch (e) {
            return;
        }
    }

    function l(e) {
        var o;
        t.innerHTML = e, o = e > 0, i && t.classList.toggle(n, !o);
    }

    function d(e) {
        return function () {
            var e = document.getElementsByClassName("wl_js_miniWishlistAmount");
            if (e.length) {
                var t = Number(e[0].getAttribute("data-miniwishlistamount"));
                if (!isNaN(t)) return r(t);
            }
        }() || function (e) {
            if (!e) return u(o.getItem(a));
        }(e);
    }

    function c(e) {
        if (i) {
            var n = d(e);
            void 0 !== n ? l(n) : o_util.ajax.getJSON(t.getAttribute("data-loadurl") + "?" + o_wishlist.trackingWrapper.failSafeGetMergeParameters()).then(function (e) {
                return e.responseJSON.amount;
            }).then(r).then(l);
        }
    }
    e = d(), o_wishlist.trackingWrapper.failSafeSendMergeToTrackingServer({
        order_WishlistItems: e
    }), i && (document.addEventListener("wishlist.changed", c), window.addEventListener("storage", function (e) {
        if (e.key === a) {
            var t = u(e.newValue);
            void 0 !== t && l(t);
        }
    }), window.setTimeout(c, 10));
}, o_global.eventLoader.onAllScriptsExecuted(10, function () {
    o_wishlist.MiniWishlist || (o_wishlist.InitiateMiniWishlist(), o_wishlist.MiniWishlist = function () {});
}), document.cookie = "experiment=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.otto.de;path=/", document.cookie = "onex=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=www.otto.de;path=/", document.cookie = "onex=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.www.otto.de;path=/", document.cookie = "onex=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.otto.de;path=/", document.cookie = "onex=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/", document.cookie = "re:BLOG-fangate-shown=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=www.otto.de;path=/", document.cookie = "re:BLOG-fangate-shown=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"; //# sourceMappingURL=/order-wishlist/statics/ft1.wishlist-core.miniWishlist.scala.71fc23bd.js.map