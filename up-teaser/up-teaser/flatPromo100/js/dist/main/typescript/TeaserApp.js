import { TrackingService } from "./tracking/TrackingService";
import { TrackingPayload } from "./tracking/TrackingPayload";
import { TeaserService } from "./teaser/TeaserService";
window.o_global = window.o_global || {};
window.o_up = window.o_up || {};
var trackingService = new TrackingService(window.o_global);
[].forEach.call(document.querySelectorAll('.up-teaser-init'), function (el, index) {
    var trackingPayload = new TrackingPayload(el);
    var teaserService = new TeaserService(trackingService, trackingPayload, el);
    teaserService.init();
    var open = function () {
        teaserService.sendOpenLayerTracking();
    };
    var close = function () {
        teaserService.sendCloseLayerTracking();
    };
    window.o_up.openLayerHandler = open;
    window.o_up.closeLayerHandler = close;
});
//# sourceMappingURL=TeaserApp.js.map