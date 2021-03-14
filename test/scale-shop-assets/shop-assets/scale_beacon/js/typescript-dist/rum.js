import * as util from "./beacon-util";
import { capitalizeAndPrefixKeys } from "./beacon-util";
import { trackingAddToPageImpression } from "./tracking";
export const beaconServicePathRum = 'test/scale-beacon-service/rum';
const toggleNameRum = 'SCALE_SendRumData';
const allowedBrowsers = {
    CHROME: "Chrome",
    FIREFOX: "Firefox",
    OPERA: "Opera",
    SAFARI: "Safari",
};
const unclassifiedMarker = "unclassified";
const undefinedMarker = "undefined";
export const rumMetrics = [
    "dnsTime",
    "domContentLoaded",
    "domContentLoadedStart",
    "domTime",
    "htmlLength",
    "inlineScripts",
    "networkTime",
    "resourceCount",
    "rum_complete",
    "rum_domComplete",
    "sslHandshakeTime",
    "timeToFirstByte",
    "timeToFirstPaint"
];
/**
 * Filters metrics from raw data
 * @param rawData
 */
export function filterMetrics(rawData) {
    let metrics = {};
    let rumKeys = Object.keys(rawData).filter(key => key.substr(0, 4) === 'rum_');
    rumKeys.forEach((metricName) => metrics[metricName] = rawData[metricName]);
    return metrics;
}
/**
 * Extracts metrics from raw rum data object.
 * @param rumDataRaw Raw rum data object (comes from otto team assets).
 * @return {Array}
 *          Array containing all metrics in the following form:
 *          {metricName: <metric name>, value: <value of metric>}
 */
function getMetrics(rumDataRaw) {
    let metrics = [];
    rumMetrics.forEach(function (metricName) {
        let valueFromRawData = rumDataRaw[metricName];
        if (typeof valueFromRawData !== 'undefined') {
            metrics.push({ metricName: metricName, value: valueFromRawData });
        }
    });
    return metrics;
}
/**
 * Transforms browser from raw rum data into one of our well defined browsers (see {@link allowedBrowsers}).
 * If browser from raw data can not be translated {@link unclassifiedMarker} is returned.
 * If raw data doesn't contain a browser {@link undefinedMarker} is returned.
 * @param rawBrowser
 *        Attribute deviceBrowser from raw rum data.
 * @return {string}
 *        Transformed browser.
 */
function normalizeBrowser(rawBrowser) {
    if (typeof rawBrowser === 'undefined') {
        return undefinedMarker;
    }
    let wellKnownBrowser = allowedBrowsers[rawBrowser.toUpperCase()];
    return typeof wellKnownBrowser !== 'undefined' ? wellKnownBrowser : unclassifiedMarker;
}
/**
 * Transforms raw rum data into a format team scale's beacon service expects.
 * @param rumDataRaw
 *        Raw RUM data as it gets provided by team assets rum script.
 * @return Transformed rum data.
 */
function transformForBeaconService(rumDataRaw) {
    return {
        deviceBrowser: normalizeBrowser(rumDataRaw.deviceBrowser),
        deviceOS: typeof rumDataRaw.deviceOS !== 'undefined' ? rumDataRaw.deviceOS : undefinedMarker,
        pageCluster: typeof rumDataRaw.pagecluster == 'string' ? rumDataRaw.pagecluster : 'undefined',
        rum_deviceOrientation: typeof rumDataRaw.rum_deviceOrientation !== 'undefined' ?
            rumDataRaw.rum_deviceOrientation : undefinedMarker,
        rum_deviceType: typeof rumDataRaw.rum_deviceType !== 'undefined' ? rumDataRaw.rum_deviceType : undefinedMarker,
        rum_domComplete: rumDataRaw.rum_domComplete,
        beaconType: "rum",
        rumMetrics: getMetrics(rumDataRaw)
    };
}
/**
 * Sends given real user monitoring data as a beacon via browsers beacon API to team scale's beacon service.
 * @param rumData
 *        Raw Real user monitoring data.
 */
export function sendData(rumData) {
    if (!util.isEmptyBeacon(rumData)) {
        trackingAddToPageImpression(capitalizeAndPrefixKeys(filterMetrics(rumData)));
        util.sendBeacon(transformForBeaconService(rumData), encodeURI(beaconServicePathRum), toggleNameRum);
    }
}
