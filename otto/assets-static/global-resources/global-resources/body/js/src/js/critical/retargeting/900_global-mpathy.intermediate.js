(function () {
    'use strict';

    /* eslint-disable @typescript-eslint/camelcase */
    function track(options) {
        const { tracking, visitorId } = options || {
            tracking: null,
            visitorId: null,
        };
        if (typeof visitorId === "string" && typeof tracking === "boolean") {
            const { surveyId } = options;
            const trackingData = {
                ot_MpathyVid: visitorId,
                ot_MpathyTracking: tracking,
            };
            if (surveyId) {
                trackingData.ot_SurveyId = surveyId;
            }
            if (window.o_global.eventQBus) {
                window.o_global.eventQBus.emit("tracking.bct.addToPageImpression", trackingData);
            }
        }
    }

    /* global window */
    const attributeName = "data-mpt";
    var mpathyOptions;
    (function (mpathyOptions) {
        mpathyOptions["ALLOWED"] = "allowed";
        mpathyOptions["POLLS_ONLY"] = "polls";
    })(mpathyOptions || (mpathyOptions = {}));
    function isPrivacyPage(
    /* istanbul ignore next */
    w = window) {
        // Must use 'indexOf' because Firefox before 53 returned wrong parts of the url as the pathname.
        return w.location.pathname.indexOf("/shoppages/service/datenschutz") !== -1;
    }
    function isPreview(
    /* istanbul ignore next */
    w = window) {
        try {
            return w.o_util.misc.isPreview(w.location.href);
        }
        catch (e) {
            return false;
        }
    }
    function isPropertyAvailable(input) {
        return !!input;
    }
    function isIPhoneOrIPad(
    /* istanbul ignore next */
    w = window) {
        return (!!w.navigator.platform && /iPad|iPhone|iPod/.test(w.navigator.platform));
    }
    function isSmallOrMediumBreakpoint(
    /* istanbul ignore next */
    w = window) {
        return w.o_global.breakpoint.isSmall() || w.o_global.breakpoint.isMedium();
    }
    function isFastConnection(
    /* istanbul ignore next */
    w = window) {
        if (isPropertyAvailable(w.navigator.connection)) {
            return w.navigator.connection.effectiveType === "4g";
        }
        return false;
    }
    function setDataAttribute(type, 
    /* istanbul ignore next */
    w = window) {
        w.document.getElementsByTagName("html")[0].setAttribute(attributeName, type);
    }
    function isTopDevice(userAgent) {
        // Map is missing iOS devices because they are targeted with former function 'isIPhoneOrIPad()'.
        const deviceMap = {
            "SM-G950F": "Samsung Galaxy S8",
            "SM-G930F": "Samsung Galaxy S7",
            "SM-G960F": "Samsung Galaxy S9",
            "SM-A520F": "Samsung Galaxy A5 (2017)",
            "SM-G935F": "Samsung Galaxy S7 Edge",
            "SM-G965F": "Samsung Galaxy S9 Plus",
            "SM-G955F": "Samsung Galaxy S8 Plus",
            "SM-J510F": "Samsung Galaxy J5 (2016)",
            "ANE-LX1": "Huawei P20 Lite",
            "SM-G920F": "Samsung Galaxy S6",
            "SM-T580": "Samsung Galaxy Tab A 10.1",
            "SM-A320FL": "Samsung Galaxy A3",
            "CLT-L29": "Huawei P20 Pro",
            "SM-G925F": "Samsung Galaxy S6 Edge",
            "SM-N950F": "Samsung Galaxy Note 8",
            "WAS-LX1A": "Huawei P10 Lite",
            "SM-A750FN": "Samsung Galaxy A7 (2018)",
            "SM-J530F": "Samsung Galaxy J5 (2017)",
            "SM-A600FN": "Samsung Galaxy A6",
            "SM-A510F": "Samsung Galaxy A5",
            "RNE-L21": "Huawei Mate 10 Lite",
            "SM-G900F": "Samsung Galaxy S5"
        };
        const filtered = Object.keys(deviceMap).filter((device) => {
            return new RegExp(device).test(userAgent);
        });
        return filtered.length > 0;
    }

    function isEnabled() {
        return !(isPreview() || isPrivacyPage());
    }

    function detect(userAgent) {
        if (isSmallOrMediumBreakpoint()) {
            if (isFastConnection() ||
                isIPhoneOrIPad() ||
                (!isFastConnection() && isTopDevice(userAgent))) {
                setDataAttribute(mpathyOptions.ALLOWED);
            }
            else {
                setDataAttribute(mpathyOptions.POLLS_ONLY);
            }
        }
        else {
            setDataAttribute(mpathyOptions.ALLOWED);
        }
    }

    // Set data attribute on document root to give
    // M-Pathy a hint what features to run.
    detect(window.navigator.userAgent);
    // Export m-pathy functionality to global namespace.
    window.o_global = window.o_global || {};
    window.o_global.mpathy = window.o_global.mpathy || { track, isEnabled };

}());
