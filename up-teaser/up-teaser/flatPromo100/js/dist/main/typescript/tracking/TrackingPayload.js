var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var TrackingPayload = /** @class */ (function () {
    function TrackingPayload(el) {
        if (el == null || el.attributes == null) {
            return;
        }
        this.trackingData = { up_FlatType: el.getAttribute("data-flattype"), up_NotValidAfter: el.getAttribute("data-notvalidafter"), up_Scarcity: el.getAttribute("data-scarcity") };
        if (this.trackingData.up_Scarcity == null || this.trackingData.up_FlatType == null || this.trackingData.up_NotValidAfter == null) {
            this.trackingData = null;
        }
    }
    /* must be equal with enum TrackingLabel in kotlin */
    TrackingPayload.prototype.viewTracking = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatPromotion": "view" });
        }
        return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatRenewal": "view" });
    };
    TrackingPayload.prototype.availableTracking = function () {
        return { "up_DeliveryFlatUserStatus": "available" };
    };
    TrackingPayload.prototype.seenTracking = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatPromotion": "seen" });
        }
        return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatRenewal": "seen" });
    };
    TrackingPayload.prototype.continueShopping = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return { "up_DeliveryFlatPromotion": "continueShopping" };
        }
        return { "up_DeliveryFlatRenewal": "continueShopping" };
    };
    TrackingPayload.prototype.toBasket = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatPromotion": "toBasket" });
        }
        return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatRenewal": "toBasket" });
    };
    TrackingPayload.prototype.openLayer = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatPromotion": "open" });
        }
        return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatRenewal": "open" });
    };
    TrackingPayload.prototype.closeLayer = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatPromotion": "close" });
        }
        return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatRenewal": "close" });
    };
    TrackingPayload.prototype.viewSubscriptionInfoTracking = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatInformation": "view" });
        }
        return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatRenewal": "view" });
    };
    TrackingPayload.prototype.closeSubscriptionInfoLayer = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatInformation": "close" });
        }
        return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatRenewal": "close" });
    };
    TrackingPayload.prototype.openSubscriptionInfoLayer = function () {
        if (this.trackingData == null || this.trackingData.up_Scarcity == "0") {
            return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatInformation": "open" });
        }
        return __assign(__assign({}, this.trackingData), { "up_DeliveryFlatRenewal": "open" });
    };
    TrackingPayload.prototype.renewSubscriptionInfoLayer = function () {
        return { "up_DeliveryFlatInformation": "renew", "up_DeliveryFlatPromotion": "open" };
    };
    return TrackingPayload;
}());
export { TrackingPayload };
var TrackingData = /** @class */ (function () {
    function TrackingData() {
    }
    return TrackingData;
}());
//# sourceMappingURL=TrackingPayload.js.map