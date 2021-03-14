import {AditionCookie} from "./aditionCookie";
import {Api} from "./api";
import {AvContent} from "./avContent";
import {ClickTracking} from "./clickTracking";
import {XmasEasteregg} from "./xmasEasteregg";
import {ProductData} from "./productData";
import {ShoppingProcess} from "./shoppingProcess";
import {TrackingApi} from "./trackingApi";
import {Utils} from "./utils";
import {ViewTracking} from "./viewTracking";
import {WatoRequest} from "./watoRequest";

const aditionCookie = new AditionCookie();
const productData = new ProductData();
const utils = new Utils();
const trackingApi = new TrackingApi(utils);
const shoppingProcess = new ShoppingProcess(utils);
const viewTracking = new ViewTracking(trackingApi);
const clickTracking = new ClickTracking(trackingApi);
const watoRequest = new WatoRequest(trackingApi, aditionCookie);
const api = new Api(shoppingProcess);

// expose API
window.o_wo = window.o_wo || {};
window.o_wo.api = api;

// bootstrap application
function bootstrap() {
    window.o_global.eventLoader.onLoad(30, () => {
        let avContent;
        if (o_tracking && o_tracking.optOut && !o_tracking.optOut.isUserOptOut()) {
            avContent = new AvContent(clickTracking, viewTracking, trackingApi, watoRequest, productData, shoppingProcess, utils);
            avContent.fillAvContent();
        }
        if (o_util.toggle.get("FT6_EASTEREGGS", false)) {
            new XmasEasteregg(trackingApi).init();
        }
    });
}

bootstrap();

export {bootstrap}