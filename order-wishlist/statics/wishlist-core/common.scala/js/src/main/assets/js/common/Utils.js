var o_wishlist = window.o_wishlist || {};

o_wishlist.utils = o_wishlist.utils || {};

// Wrap an HTMLElement around another HTMLElement or an array of them.
o_wishlist.utils.wrapAll = function(elmsToWrap, wrappingEl) {
    var el = elmsToWrap.length ? elmsToWrap[0] : elmsToWrap;

    // Cache the current parent and sibling of the first element.
    var parent = el.parentNode;
    var sibling = el.nextSibling;

    // Wrap the first element (is automatically removed from its
    // current parent).
    wrappingEl.appendChild(el);

    // Wrap all other elements (if applicable). Each element is
    // automatically removed from its current parent and from the elms
    // array.
    while (elmsToWrap.length) {
        wrappingEl.appendChild(elmsToWrap[0]);
    }

    // If the first element had a sibling, insert the wrapper before the
    // sibling to maintain the HTML structure; otherwise, just append it
    // to the parent.
    if (sibling) {
        parent.insertBefore(wrappingEl, sibling);
    } else {
        parent.appendChild(wrappingEl);
    }
};

o_wishlist.utils.isLoggedIn = function () {
    try {
        return o_user.loginState.presenter.isLoggedIn();
    }catch(e){
        return false;
    }
};

o_wishlist.utils.isKnownUser = function () {
    try {
        return o_user.loginState.presenter.isLoggedIn()
            || o_user.loginState.presenter.loginState() === "KNOWN_VISITOR";
    } catch (e) {
        return false;
    }
};

o_wishlist.trackingWrapper = o_wishlist.trackingWrapper || {};

o_wishlist.trackingWrapper.failSafeSendEventToTrackingServer = function (data) {
  try {
    o_tracking.bct.sendEventToTrackingServer(data);
  } catch (e) {
    console.log("Failed to call o_tracking.bct.sendEventToTrackingServer", e);
  }
};

o_wishlist.trackingWrapper.failSafeTrackOnNextPageImpression = function (data) {
  try {
    o_tracking.bct.trackOnNextPageImpression(data);
  } catch (e) {
    console.log("Failed to call o_tracking.bct.trackOnNextPageImpression", e);
  }
};

o_wishlist.trackingWrapper.failSafeSendMergeToTrackingServer = function (data) {
  try {
    o_tracking.bct.sendMergeToTrackingServer(data);
  } catch (e) {
    console.log("Failed to call o_tracking.bct.sendMergeToTrackingServer", e);
  }
};

o_wishlist.trackingWrapper.failSafeGetMergeParameters = function () {
  try {
    return o_tracking.bct.getMergeParameters();
  } catch (e) {
    console.log("Failed to call o_tracking.bct.getMergeParameters", e);
    return "";
  }
};
