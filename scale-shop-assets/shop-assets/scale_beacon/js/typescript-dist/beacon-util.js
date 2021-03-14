/**
 * Metrics without correct prefix will be discarded.
 */
export const metricPrefix = "rum_";
/**
 * Checks if the current beacon is empty (i.e. {}) or null
 * @param {*Object} data
 */
export function isEmptyBeacon(data) {
    return data === null || Object.keys(data).length === 0;
}
/**
 * Appends an attribute requestTime to the rum data containing actual time as unix timestamp including ms.
 * @param data
 */
export function appendRequestTimestamp(data) {
    data.requestTime = Date.now();
}
/**
 * Checks if the toggle for this module is active
 */
export function isToggleActive(toggleName) {
    return (o_util && o_util.toggle && o_util.toggle.get(toggleName, false));
}
/**
 * Send a beacon via the navigator API.
 * If the data is empty or null, no beacon will be send.
 *
 * @param {*Object} dataObject Data to be sent via beacon API.
 * * @param {*Object} endpoint Endpoint, data should be sent to.
 * * @param {*Object} toggleName Name of the toggle that en/disables sending of data (toggle service of team assets).
 */
export function sendBeacon(dataObject, endpoint, toggleName) {
    if (isEmptyBeacon(dataObject) || !isToggleActive(toggleName)) {
        return;
    }
    appendRequestTimestamp(dataObject);
    const canSend = navigator.sendBeacon(endpoint, JSON.stringify(dataObject));
    if (canSend === false) {
        /* eslint-disable no-console */
        console.error(`Failed to send beacon to ${endpoint}!`);
    }
}
/**
 * Utility functions to prefix and PascalCase metric keys.
 */
export function capitalizeFirstLetterAfterPrefix(given) {
    let idx = 0;
    let prefix = "";
    if (given.substr(0, metricPrefix.length) === metricPrefix) {
        idx = metricPrefix.length;
        prefix = metricPrefix;
    }
    return prefix + capitalizeFirstLetter(given.slice(idx));
}
function capitalizeFirstLetter(given) {
    return given.charAt(0).toUpperCase() + given.slice(1);
}
export function prefixMetricKey(metricKey) {
    return metricKey.substr(0, metricPrefix.length) === metricPrefix ? metricKey : `${metricPrefix}${metricKey}`;
}
export function capitalizeAndPrefixKeys(metrics) {
    let result = {};
    Object.keys(metrics).forEach((key) => {
        result[prefixMetricKey(capitalizeFirstLetterAfterPrefix(key))] = metrics[key];
    });
    return result;
}
