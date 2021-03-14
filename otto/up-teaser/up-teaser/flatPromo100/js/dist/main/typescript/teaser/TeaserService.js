import { countdownToMidnight } from "../countdown/countdownToMidnight";
var TeaserService = /** @class */ (function () {
    function TeaserService(trackingService, trackingPayload, element) {
        this.trackingService = trackingService;
        this.trackingPayload = trackingPayload;
        this._element = element;
        var onexStatus = this._element.getAttribute("data-onexStatus");
        this.isOnexStatusAvailable = onexStatus && onexStatus === "available";
        var showSubscriptionInfo = this._element.getAttribute("data-subscriptioninfo");
        this.isSubscriptionInfoTeaser = (showSubscriptionInfo && showSubscriptionInfo === "true") ? true : false;
    }
    TeaserService.prototype.init = function () {
        if (this.isSubscriptionInfoTeaser) {
            this.trackingService.sendMerge(this.trackingPayload.viewSubscriptionInfoTracking());
        }
        else {
            this.trackingService.sendMerge(this.trackingPayload.viewTracking());
        }
        if (this.isOnexStatusAvailable) {
            this.trackingService.sendMerge(this.trackingPayload.availableTracking());
        }
        this.registerSeenHandler();
        if (this._element.getAttribute("data-countdown") !== null && this._element.getAttribute("data-countdown") !== "0") {
            var endTime_1 = parseInt(this._element.getAttribute("data-countdown"));
            if (!isNaN(endTime_1)) {
                var headlineElement_1 = this._element.querySelector(".up_teaser_headline");
                var headlinePrefix_1 = headlineElement_1.textContent;
                var countdownCall_1 = function () { return countdownToMidnight(endTime_1, headlinePrefix_1 + " in ", headlineElement_1, "Deine Liefer-Flat ist abgelaufen"); };
                countdownCall_1();
                headlineElement_1["interval"] = window.setInterval(function () {
                    countdownCall_1();
                }, 1000);
            }
        }
    };
    TeaserService.prototype.seenHandler = function () {
        this.trackingService.sendMerge(this.trackingPayload.seenTracking());
    };
    TeaserService.prototype.registerSeenHandler = function () {
        var _this = this;
        if (window.IntersectionObserver) {
            var observer = new IntersectionObserver(function (e, o) {
                var entry = e[0];
                if (entry.isIntersecting) {
                    o.unobserve(_this._element);
                    if (!_this.isSubscriptionInfoTeaser) {
                        _this.trackingService.sendEvent(_this.trackingPayload.seenTracking());
                    }
                }
            }, { threshold: 0.75 });
            observer.observe(this._element);
        }
    };
    TeaserService.prototype.sendOpenLayerTracking = function () {
        if (this.isSubscriptionInfoTeaser) {
            this.trackingService.sendEvent(this.trackingPayload.openSubscriptionInfoLayer());
        }
        else {
            this.trackingService.sendEvent(this.trackingPayload.openLayer());
        }
    };
    TeaserService.prototype.sendCloseLayerTracking = function () {
        if (this.isSubscriptionInfoTeaser) {
            this.trackingService.sendEvent(this.trackingPayload.closeSubscriptionInfoLayer());
        }
        else {
            this.trackingService.sendEvent(this.trackingPayload.closeLayer());
        }
    };
    return TeaserService;
}());
export { TeaserService };
//# sourceMappingURL=TeaserService.js.map