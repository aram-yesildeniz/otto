import { capitalizeFirstLetterAfterPrefix, isEmptyBeacon, metricPrefix } from "./beacon-util";
import { sendToBeaconService } from "./user-timing";
/**
 * These must be agreed with team tracking. Metrics with other/unknown names will be discarded.
 */
const trackingPageImpressionMetrics = [
    "rum_FirstPaint",
    "rum_FirstContentfulPaint"
];
const trackingEventMetrics = [
    "rum_FirstInputDelay"
];
/**
 * Callback to process metrics tracked by perfume.js. Appends prefix to metric names.
 * Sends metric data to scales beacon service and calls trackings BCT with it.
 * @param metricName
 * @param duration
 * @param browser
 */
export function performanceBeaconTracker(metricName, duration, browser) {
    const metricNamePascal = capitalizeFirstLetterAfterPrefix(metricName);
    const prefixedMetricName = `${metricPrefix}${metricNamePascal}`;
    let metricData = { [prefixedMetricName]: Math.round(duration) };
    if (trackingPageImpressionMetrics.some(metric => metric === prefixedMetricName)) {
        sendToBeaconService(metricData);
        trackingAddToPageImpression(metricData);
    }
    else if (trackingEventMetrics.some(metric => metric === prefixedMetricName)) {
        sendToBeaconService(metricData);
        trackingAddEvent(metricData);
    }
}
/**
 * Add to page impression (18 s. time window)
 * Uses event bus of team Asset if available
 * bct from team Tracking otherwise
 * @param metricData
 */
export function trackingAddToPageImpression(metricData) {
    if (!isEmptyBeacon(metricData)) {
        if (o_global && o_global.eventQBus) {
            o_global.eventQBus.emit('tracking.bct.addToPageImpression', metricData);
        }
        else if (o_tracking && o_tracking.bct && o_tracking.bct.sendMergeToTrackingServer) {
            o_tracking.bct.sendMergeToTrackingServer(metricData);
        }
    }
}
/**
 * Add event (also possible after the 18 s. time window has elapsed)
 * Uses event bus of team Asset if available
 * bct from team Tracking otherwise
 * @param metricData
 */
export function trackingAddEvent(metricData) {
    if (!isEmptyBeacon(metricData)) {
        if (o_global && o_global.eventQBus) {
            o_global.eventQBus.emit('tracking.bct.submitEvent', metricData);
        }
        else if (o_tracking && o_tracking.bct && o_tracking.bct.sendEventToTrackingServer) {
            o_tracking.bct.sendEventToTrackingServer(metricData);
        }
    }
}
