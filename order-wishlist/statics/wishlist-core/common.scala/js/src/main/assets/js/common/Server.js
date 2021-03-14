var o_wishlist = window.o_wishlist || {};

o_wishlist.server = {};

o_wishlist.server.CONTEXT = '/order-wishlist';
o_wishlist.server.CUSTOM_WISHLIST_URL = o_wishlist.server.CONTEXT + '/wishlist/custom/';
o_wishlist.server.SYSTEM_WISHLIST_URL = o_wishlist.server.CONTEXT + '/wishlist/system';
o_wishlist.server.LIKED_WISHLIST_URL = o_wishlist.server.CONTEXT + '/wishlist/liked';
o_wishlist.server.WISHLISTS_URL = o_wishlist.server.CONTEXT + '/wishlists';
o_wishlist.server.URL_PREFIX = function (sanitizedName, type) {
    var urls = {
        'system': o_wishlist.server.SYSTEM_WISHLIST_URL,
        'liked': o_wishlist.server.LIKED_WISHLIST_URL,
        'custom': o_wishlist.server.CUSTOM_WISHLIST_URL + sanitizedName
    };
    return urls[type] || urls.system;
};

o_wishlist.server.cache = function (key, timeout) {
    return function (request) {
        if (o_wishlist.server.cache[key]) {
            return o_wishlist.server.cache[key];
        }
        if (timeout) {
            setTimeout(function () {
                o_wishlist.server.cache[key] = undefined;
            }, timeout)
        }
        o_wishlist.server.cache[key] = request();
        return o_wishlist.server.cache[key];
    }
};

o_wishlist.server.wishlist = {};

o_wishlist.serverHandler = o_wishlist.serverHandler || {};

o_wishlist.server.wishlist.redirectTo = function (uri) {
    window.location.assign(uri);
};

o_wishlist.server.wishlist.switchView = function (newViewType, wishlistType, sanitizedName) {
    return o_util.ajax.post(o_wishlist.server.wishlist.getBaseUrl(wishlistType, sanitizedName) + "/viewType/" + newViewType);
};

o_wishlist.server.wishlist.deleteCustomWishlist = function (sanitizedName) {
    return o_util.ajax.post(o_wishlist.server.CUSTOM_WISHLIST_URL + sanitizedName + "/delete");
};

o_wishlist.server.wishlist.addCustomWishlist = function (customWishlistName, tracking) {
    return o_util.ajax({
        url: o_wishlist.server.CONTEXT + '/wishlist/custom',
        data: "wishlistName=" + encodeURIComponent(customWishlistName),
        headers: o_wishlist.server.wishlist.buildTrackingHeader(tracking),
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8'
    });
};

o_wishlist.server.wishlist.renameCustomWishlist = function (sanitizedName, newName) {
    return o_util.ajax.post(o_wishlist.server.CUSTOM_WISHLIST_URL + sanitizedName + "/rename", "newWishlistName=" + encodeURIComponent(newName));
};

o_wishlist.server.wishlist.loadAvailableWishlists = function (displayStyle, type, wishlistName) {
    var nameParam = wishlistName ? 'wishlist=' + wishlistName : "";
    var typeParam = type ? 'type=' + type : "";
    var questionMark = nameParam || typeParam ? "?" : "";
    var and = nameParam && typeParam ? "&" : "";
    return o_util.ajax.get(o_wishlist.server.WISHLISTS_URL + '/' + displayStyle + questionMark + nameParam + and + typeParam);
};


o_wishlist.server.wishlist.buildTrackingHeader = function(json) {
    var header = {};
    header.wishlistctd = encodeURI(JSON.stringify(json));
    return header;
};

o_wishlist.server.wishlist.getVariationsFromBasket = function() {
    return o_util.ajax.get("/order/basket/variationIds");
};

o_wishlist.server.wishlist.item = {};

o_wishlist.server.wishlist.item.addToWishlist = function (variationId, sanitizedName, addedFrom, source, tracking) {
    var redirectParam = sanitizedName ? "&redirectAfterLoginUrl=" + encodeURIComponent(window.location.href) : "";
    var addedFromParam = "&addedFrom=" + addedFrom;
    var actionTypeParam = "&actionType=" + source;
    return o_util.ajax({
        url: o_wishlist.server.wishlist.getBaseUrl(sanitizedName ? 'custom' : 'system', sanitizedName) + "/items",
        method: 'POST',
        headers: o_wishlist.server.wishlist.buildTrackingHeader(tracking),
        data: "variationId=" + variationId + addedFromParam + redirectParam + actionTypeParam,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8'
    });
};

o_wishlist.server.wishlist.item.deleteFromWishlist = function (variationId, tracking, wishlistType, sanitizedName) {
    return o_util.ajax({
        url: o_wishlist.server.wishlist.item.getBaseUrl(variationId, wishlistType, sanitizedName) + '/delete',
        method: 'POST',
        headers: o_wishlist.server.wishlist.buildTrackingHeader(tracking),
        contentType: 'application/x-www-form-urlencoded; charset=utf-8'
    });
};

o_wishlist.server.wishlist.item.move = function ( sanitizedTargetName, variationId, wishlistType, maybeSanitizedName) {
    var data = "";
    if (sanitizedTargetName !== '' && sanitizedTargetName !== undefined) {
        data = "sanitizedName=" + sanitizedTargetName;
    }
    return o_util.ajax.post(o_wishlist.server.wishlist.item.getBaseUrl(variationId, wishlistType, maybeSanitizedName) + "/move", data);
};

o_wishlist.server.wishlist.item.setNote = function (noteText, variationId, wishlistType, maybeSanitizedName) {
    var data = noteText !== undefined ? "noteText=" + encodeURIComponent(noteText) : undefined;
    return o_util.ajax.post( o_wishlist.server.wishlist.item.getBaseUrl(variationId, wishlistType, maybeSanitizedName) + "/setNote", data);
};

o_wishlist.server.wishlist.getBaseUrl = function getBaseUrl(wishlistType, maybeSanitizedName) {
    return o_wishlist.server.URL_PREFIX(maybeSanitizedName, wishlistType);
};

o_wishlist.server.wishlist.item.getBaseUrl = function getBaseUrl(variationId, wishlistType, maybeSanitizedName) {
    return o_wishlist.server.wishlist.getBaseUrl(wishlistType, maybeSanitizedName) + "/items/" + variationId;
};
