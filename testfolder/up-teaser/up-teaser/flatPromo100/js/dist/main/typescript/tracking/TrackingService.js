import { Logger } from "../Logger";
var TrackingService = /** @class */ (function () {
    function TrackingService(o_global) {
        this.debugEventBus = {
            emit: function (channel, payload, mergeId) {
                Logger.warn("Sending to " + channel + " via debug eventBus", payload);
            }
        };
        this.eventBus = (o_global !== null && typeof o_global !== 'undefined' && o_global.eventQBus !== null && typeof o_global.eventQBus !== 'undefined') ? o_global.eventQBus : this.debugEventBus;
    }
    TrackingService.prototype.sendMerge = function (trackingPayload) {
        if (trackingPayload === null || trackingPayload === undefined) {
            return;
        }
        this.eventBus.emit('tracking.bct.addToPageImpression', trackingPayload);
    };
    TrackingService.prototype.sendEventMerge = function (trackingPayload, mergeId) {
        this.eventBus.emit('tracking.bct.addToEvent', trackingPayload, mergeId);
    };
    TrackingService.prototype.sendEvent = function (trackingPayload) {
        if (trackingPayload === null || trackingPayload === undefined) {
            return;
        }
        this.eventBus.emit('tracking.bct.submitEvent', trackingPayload);
    };
    return TrackingService;
}());
export { TrackingService };
//# sourceMappingURL=TrackingService.js.map