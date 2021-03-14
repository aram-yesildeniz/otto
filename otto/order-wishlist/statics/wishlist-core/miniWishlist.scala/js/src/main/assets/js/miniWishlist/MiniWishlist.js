var o_wishlist = window.o_wishlist || {};

/**
 * Enthält Logik zum Aktualisieren der Mini-Wishlist
 */
o_wishlist.InitiateMiniWishlist = function () {
  'use strict';

  var element = document.getElementById("wl_mini_amount"),
    elementPresent = element !== null,
    emptyBadgeClass = "wl_mini__badge--empty",
    storage = new o_global.Storage(window.localStorage),
    storageKey = "wl_miniWishlistAmount";

  function toggleBadge(showBadge) {
    if (elementPresent) {
      element.classList.toggle(emptyBadgeClass, !showBadge);
    }
  }

  function getVid() {
    return o_util.cookie.get("visitorId");
  }

  function loadAmount() {
    return o_util.ajax.getJSON(element.getAttribute("data-loadurl") + "?" + o_wishlist.trackingWrapper.failSafeGetMergeParameters())
      .then(function (xhr) {
        return xhr.responseJSON.amount;
      });
  }

  function saveToStorage(amount) {
    var data = {
      amount: amount,
      vid: getVid(),
      expire: new Date().getTime() + 300000,
      loggedIn: o_wishlist.utils.isLoggedIn()
    };
    storage.setItem(storageKey, JSON.stringify(data));
    return amount;
  }

  function parseStorageData(dataString) {
    try {
      var data = JSON.parse(dataString);
      if (data &&
        data.expire > new Date().getTime() &&
        data.vid === getVid() &&
        data.loggedIn === o_wishlist.utils.isLoggedIn()) {
        return data.amount;
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }

  function checkStorage(maybeEvent) {
    if (!maybeEvent) {
      return parseStorageData(storage.getItem(storageKey))
    }
    return undefined;
  }

  function checkHtml() {
    var maybeAmountElements = document.getElementsByClassName("wl_js_miniWishlistAmount");

    if (maybeAmountElements.length) {
      var amount = Number(maybeAmountElements[0].getAttribute("data-miniwishlistamount"));
      if (!isNaN(amount)) {
        return saveToStorage(amount);
      }
    }
    return undefined;
  }

  function renderAmount(amount) {
    element.innerHTML = amount;
    toggleBadge(amount > 0);
  }

  function getAmount(maybeEvent) {
    return checkHtml() || checkStorage(maybeEvent);
  }

  function updateAmount(maybeEvent) {
    if (elementPresent) {
      var amount = getAmount(maybeEvent);
      if (amount !== undefined) {
        renderAmount(amount);
      } else {
        loadAmount()
          .then(saveToStorage)
          .then(renderAmount);
      }
    }
  }

  function failSafeSendMergeToTrackingServer() {
    var amount = getAmount();
    o_wishlist.trackingWrapper.failSafeSendMergeToTrackingServer({'order_WishlistItems': amount});
  }

  failSafeSendMergeToTrackingServer();
  if (elementPresent) {
    // Mini-Wishlist bei jedem "wishlist.changed"-Event aktualisieren
    document.addEventListener("wishlist.changed", updateAmount);
    // Mini-Wishlist update bei storage change in other tabs
    window.addEventListener("storage", function (e) {
      if (e.key === storageKey) {
        var amount = parseStorageData(e.newValue);
        if (amount !== undefined) {
          renderAmount(amount);
        }
      }
    });

    // Mini-Wishlist beim Seitenaufruf einmalig aktualisieren
    window.setTimeout(updateAmount, 10);
  }
};

// We need access o_user.loginState functionality, which is initialized with priority 1 (higher meaning executed earlier)
o_global.eventLoader.onAllScriptsExecuted(10, function () {
  if (!o_wishlist.MiniWishlist) {
    o_wishlist.InitiateMiniWishlist();
    o_wishlist.MiniWishlist = function () {};
  }
});

/**
 * Löscht das böse experiment-Cookie, das den wishlist-Microservice zum Knallen bringt..
 */
document.cookie = 'experiment=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.otto.de;path=/';
document.cookie = 'onex=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=www.otto.de;path=/';
document.cookie = 'onex=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.www.otto.de;path=/';
document.cookie = 'onex=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.otto.de;path=/';
document.cookie = 'onex=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';

/**
 * Löscht das böse Cookie von https://www.otto.de/reblog, das den wishlist-Microservice zum Knallen bringt..
 */
document.cookie = 're:BLOG-fangate-shown=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=www.otto.de;path=/';
document.cookie = 're:BLOG-fangate-shown=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';