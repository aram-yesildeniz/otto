class Cookies {
    constructor(cookieUtil, ajaxUtil) {
        this._cbCookieName = "cb";
        this._cbContext = "/user-cookie-banner-cb";
        this._acceptCbCookieEndpoint = "/setExplicitCookie";
        this._rejectCbCookieEndpoint = "/setRejectCookie";
        this._consentIdCookieName = "consentId";
        this._consentIdContext = "/user-set-consent-id-cookie";
        this._iabConsentCookieName = "iabConsent";
        this._cookieUtil = cookieUtil;
        this._ajaxUtil = ajaxUtil;
    }
    getConsentIdCookie() {
        return this._cookieUtil.get(this._consentIdCookieName);
    }
    getCbCookie() {
        return this._cookieUtil.get(this._cbCookieName);
    }
    getIabConsentCookie() {
        return this._cookieUtil.get(this._iabConsentCookieName);
    }
    setConsentId() {
        return this._ajaxUtil.get(`${this._consentIdContext}`);
    }
    setAcceptedCbCookie() {
        return this._ajaxUtil.get(`${this._cbContext}${(this._acceptCbCookieEndpoint)}`);
    }
    setRejectedCbCookie() {
        return this._ajaxUtil.get(`${this._cbContext}${(this._rejectCbCookieEndpoint)}`);
    }
}
export default Cookies;
