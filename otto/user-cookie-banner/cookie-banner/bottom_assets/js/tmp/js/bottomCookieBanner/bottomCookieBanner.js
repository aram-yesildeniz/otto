import { trackAgree, trackDataUsage, trackDisagree, trackInfoAgreement, trackMoreInfo, trackOttoPartner, trackView } from "../tracking";
class BottomCookieBanner {
    constructor(window, document, banner, cookies, iabFeatureActive) {
        this._window = window;
        this._document = document;
        this._banner = banner;
        this._cookies = cookies;
        this._iab_feature_active = iabFeatureActive;
        this._otto_partner = document.querySelector("#otto_partner");
        this._more_info_link = this._document.querySelector("#more_info");
        this._data_usage_link = this._document.querySelector("#data_usage");
        this._info_agreement_link = this._document.querySelector("#info_agreement");
    }
    registerEventListener() {
        this.registerOnClickForMoreInfoLink();
        this.registerOnClickForOttoPartner();
        this.registerOnClickForDataUsage();
        this.registerOnClickForInfoAgreementLink();
    }
    registerOnClickForOttoPartner() {
        if (this._otto_partner) {
            this._otto_partner.addEventListener("click", () => {
                trackOttoPartner(BottomCookieBanner.VERSION);
            });
        }
    }
    registerOnClickForDataUsage() {
        if (this._data_usage_link) {
            this._data_usage_link.addEventListener("click", () => {
                trackDataUsage(BottomCookieBanner.VERSION);
            });
        }
    }
    registerOnClickForMoreInfoLink() {
        if (this._more_info_link) {
            this._more_info_link.addEventListener("click", () => {
                trackMoreInfo(BottomCookieBanner.VERSION);
            });
        }
    }
    registerOnClickForInfoAgreementLink() {
        if (this._info_agreement_link) {
            this._info_agreement_link.addEventListener("click", () => {
                trackInfoAgreement(BottomCookieBanner.VERSION);
            });
        }
    }
    setPermission(explicit) {
        try {
            if (this._iab_feature_active) {
                return this._window.cmp.acceptAllConsents()
                    .then(() => this.setPermissionForCBCookieAndTrackAgree(explicit));
            }
            return this.setPermissionForCBCookieAndTrackAgree(explicit);
        }
        catch (e) {
            return this.setPermissionForCBCookieAndTrackAgree(explicit);
        }
    }
    setProhibition() {
        try {
            if (this._iab_feature_active) {
                return this._window.cmp.rejectAllConsents()
                    .then(() => this.setProhibitionForCBCookieAndTrackDisagree());
            }
            return this.setProhibitionForCBCookieAndTrackDisagree();
        }
        catch (e) {
            return this.setProhibitionForCBCookieAndTrackDisagree();
        }
    }
    setPermissionForCBCookieAndTrackAgree(explicit) {
        return this._cookies.setAcceptedCbCookie().then(() => {
            trackAgree(explicit, BottomCookieBanner.VERSION);
            this._window.o_global.eventQBus.emit("ft4.cookie-banner.consentAccepted");
            this._banner.remove();
        });
    }
    setProhibitionForCBCookieAndTrackDisagree() {
        return this._cookies.setRejectedCbCookie().then(() => {
            trackDisagree(BottomCookieBanner.VERSION);
            this._window.o_global.eventQBus.emit("ft4.cookie-banner.consentRejected");
            this._banner.remove();
        });
    }
    createConsentIdCookieIfMissing() {
        return new Promise((resolve, reject) => {
            try {
                if (this._cookies.getConsentIdCookie() === undefined) {
                    this._cookies.setConsentId().then(resolve, reject);
                }
            }
            catch (e) {
                // ignore it
            }
            resolve();
        });
    }
    showBannerAndRegisterClickEventHandler() {
        if (this._cookies.getCbCookie() === undefined
            && this._banner.isAllowedToShow()
            && this._window.o_apps.shouldShowWebCookieBanner()) {
            this._banner.show(() => {
                trackView(BottomCookieBanner.VERSION);
            });
            if (this._banner.$permissionButton) {
                this._banner.$permissionButton.addEventListener("click", () => {
                    this.setPermission(true);
                });
            }
            if (this._banner.$prohibitionButton) {
                this._banner.$prohibitionButton.addEventListener("click", () => {
                    this.setProhibition();
                });
            }
        }
    }
    reclassifyIABConsentIfNecessary() {
        return new Promise((resolve, reject) => {
            const cb = this;
            setTimeout(() => {
                const cbCookieValue = cb._cookies.getCbCookie();
                if (cb._cookies.getIabConsentCookie() === undefined && !!cbCookieValue) {
                    try {
                        if (cbCookieValue === "0") {
                            cb._window.cmp.rejectAllConsents()
                                .then(resolve, reject);
                        }
                        else if (cbCookieValue === "1" || cbCookieValue === "2") {
                            cb._window.cmp.acceptAllConsents()
                                .then(resolve, reject);
                        }
                        else {
                            resolve();
                        }
                    }
                    catch (e) {
                        console.log("IAB reclassification failed. An exception occurred: " + e);
                    }
                }
            }, 5000);
        });
    }
    accept() {
        return new Promise((resolve, reject) => {
            this.createConsentIdCookieIfMissing().then(() => {
                let explicit = true;
                this.setPermission(explicit).then(resolve, reject);
            });
        });
    }
    reject() {
        return new Promise((resolve, reject) => {
            this.createConsentIdCookieIfMissing().then(() => {
                this.setProhibition().then(resolve, reject);
            });
        });
    }
}
BottomCookieBanner.VERSION = "bottomCB";
export default BottomCookieBanner;
