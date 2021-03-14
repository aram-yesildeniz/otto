import { getEventLoader } from "../utils";
import BottomCookieBanner from "./bottomCookieBanner";
import Banner from "../banner";
import Cookies from "../cookies";
export const bootstrap = () => {
    const iabFeatureActive = window.o_util.toggle.get("IAB_FEATURE_ACTIVE", false);
    const banner = new Banner(BottomCookieBanner.VERSION);
    const cookies = new Cookies(window.o_util.cookie, window.o_util.ajax);
    const bottomCookieBanner = new BottomCookieBanner(window, document, banner, cookies, iabFeatureActive);
    bottomCookieBanner.registerEventListener();
    bottomCookieBanner.createConsentIdCookieIfMissing();
    bottomCookieBanner.showBannerAndRegisterClickEventHandler();
    if (iabFeatureActive) {
        bottomCookieBanner.reclassifyIABConsentIfNecessary();
    }
    window.cookieBanner = bottomCookieBanner;
};
getEventLoader().onAllScriptsExecuted(10, () => bootstrap());
