import * as util from "./beacon-util";
import { trackingAddToPageImpression } from "./tracking";
const beaconServicePathUserTimings = '/scale-beacon-service/userTiming';
const toggleNameUserTimings = 'SCALE_SendUserTimings';
const defaultClientMetadata = {
    deviceBrowser: 'unknown',
    deviceOS: 'unknown',
    rum_deviceType: 'unknown'
};
const defaultPageCluster = "unknown";
const pageClusterWhitelist = [
    "Artikeldetailseite",
    "Einstiegsseite",
    "Errorseite404",
    "Merkzettel",
    "Produktliste",
    "Storefront",
    "Suchergebnisseite",
    "User"
];
/**
 * Checks if the function to read Pagecluster is available
 */
function getPagecluster() {
    let pageCluster = defaultPageCluster;
    if (o_util && o_util.misc && o_util.misc.getPagecluster &&
        pageClusterWhitelist.indexOf(o_util.misc.getPagecluster()) != -1) {
        pageCluster = o_util.misc.getPagecluster();
    }
    return pageCluster;
}
/**
 * Checks if the RUM module for getting device data is available
 */
function isRumModuleAvailable() {
    return AS && AS.RUM && AS.RUM.getDeviceData;
}
/**
 * Converts object with rum metrics in to a plain list.
 */
function convertToList(data) {
    let metricList = [];
    if (!util.isEmptyBeacon(data)) {
        Object.keys(data).forEach(function (key) {
            metricList.push({ metricName: key, value: data[key] }); // eslint-disable-line security/detect-object-injection
        });
    }
    return metricList;
}
/**
 * Merges RUM metrics as list, device data and PageCluster into a single object to be sent.
 */
function convertRumDataToSend(data) {
    return Object.assign({}, {
        'rumMetrics': convertToList(data)
    }, defaultClientMetadata, isRumModuleAvailable() ? AS.RUM.getDeviceData() : {}, {
        'pageCluster': getPagecluster(),
        'beaconType': 'userTiming'
    });
}
/**
 * Send a beacon via the navigator API to beacon-service and provide it to Tracking.
 * If the data is empty or null, no beacon will be send.
 *
 * @param {*Object} data
 */
export function sendBeacon(data) {
    if (!util.isEmptyBeacon(data)) {
        util.sendBeacon(convertRumDataToSend(data), beaconServicePathUserTimings, toggleNameUserTimings);
        trackingAddToPageImpression(data);
    }
}
/**
 * Send a beacon via the navigator API to beacon-service only. If the data is empty or null,
 * no beacon will be send.
 *
 * @param {*Object} data
 */
export function sendToBeaconService(data) {
    if (!util.isEmptyBeacon(data)) {
        util.sendBeacon(convertRumDataToSend(data), beaconServicePathUserTimings, toggleNameUserTimings);
    }
}
