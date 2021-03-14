export function trackView(version) {
    if (!!window.o_tracking && !!window.o_tracking.bct && !!window.o_tracking.bct.sendMergeToTrackingServer) {
        window.o_tracking.bct.sendMergeToTrackingServer(window.o_util.core.extend({
            ot_CookieBanner: "view",
            ot_CookieBannerVersion: version
        }));
    }
}
export function trackAgree(explicit, version) {
    sendTrackingEvent(explicit ? "agree" : "agree_automatic", version);
}
export function trackDisagree(version) {
    sendTrackingEvent("disagree", version);
}
export function trackOttoPartner(version) {
    sendTrackingEvent("otto_partner", version);
}
export function trackMoreInfo(version) {
    sendTrackingEvent("more_info", version);
}
export function trackDataUsage(version) {
    sendTrackingEvent("data_usage", version);
}
export function trackInfoAgreement(version) {
    sendTrackingEvent("info_agreement", version);
}
function sendTrackingEvent(trackingValue, version) {
    if (!!window.o_tracking && !!window.o_tracking.bct && !!window.o_tracking.bct.sendEventToTrackingServer) {
        window.o_tracking.bct.sendEventToTrackingServer(window.o_util.core.extend({
            ot_CookieBanner: trackingValue,
            ot_CookieBannerVersion: version
        }));
    }
}
