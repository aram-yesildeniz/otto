import FloatingCookieBanner from "./floatingCookieBanner/floatingCookieBanner";
class Banner {
    constructor(variant) {
        this.visibilityClass = "cookieBanner--visibility";
        this.wrapperClass = ".gridAndInfoContainer .gridContainer";
        this.bannerWrapperClass = ".cookieBanner .cookieBanner__wrapper";
        this.pseudoLayerClassFT4 = ".ft4_modal";
        this.pseudoLayerClassIdentity = ".identity_modal";
        this.privacyPage = "/datenschutz";
        this.resizeTimeout = null;
        this.moreInfoLinkSelector = ".cookieBanner__info a";
        this.permissionButtonSelector = ".js_cookieBannerPermissionButton";
        this.prohibitionButtonSelector = ".js_cookieBannerProhibitionButton";
        // get DOM elements once
        this.$banner = document.getElementById("cookieBanner");
        this.$bannerWrapper = document.querySelector(this.bannerWrapperClass);
        this.$body = document.body;
        this.$pageWrapper = document.querySelector(this.wrapperClass)
            || document.querySelector(this.pseudoLayerClassFT4)
            || document.querySelector(this.pseudoLayerClassIdentity);
        this.$moreInfoLink = this.$banner ? this.$banner.querySelector(this.moreInfoLinkSelector) : null;
        this.$permissionButton = this.$banner ? this.$banner.querySelector(this.permissionButtonSelector) : null;
        this.$prohibitionButton = this.$banner ? this.$banner.querySelector(this.prohibitionButtonSelector) : null;
        this.variant = variant;
    }
    // resizethrottle resize events
    resizeHandler($banner, $bannerWrapper, $grid) {
        // cancel animatioframe if it exists
        if (this.resizeTimeout && window.cancelAnimationFrame) {
            window.cancelAnimationFrame(this.resizeTimeout);
        }
        // setup the new requestAnimationFrame()
        if (window.requestAnimationFrame) {
            this.resizeTimeout = window.requestAnimationFrame(() => {
                Banner.adjustResizeStyling($banner, $bannerWrapper, $grid);
            });
        }
        else {
            this.resizeTimeout = window.setTimeout(() => {
                // reset timeout
                this.resizeTimeout = null;
                Banner.adjustResizeStyling($banner, $bannerWrapper, $grid);
            }, 66);
        }
    }
    // set top margin of document body according to banner height
    static adjustResizeStyling(banner, bannerWrapper, grid) {
        const maxHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const bannerHeight = window.getComputedStyle(banner).height;
        const pseudoElemHeight = window.getComputedStyle(bannerWrapper, "::before").height;
        // Set max-height to client height.
        // Necessary due to accessibility issues for zoomed devices (overflow-y is scrollable then).
        if (maxHeight) {
            banner.style.maxHeight = `${maxHeight}px`;
        }
        grid.style.paddingBottom = `${parseInt(bannerHeight || "0") + (parseInt(pseudoElemHeight || "0") / 2) + 10}px`;
    }
    // Move the banner in or out of gridContainer depending on breakpoint
    static moveBannerFragment(banner, body) {
        body.insertBefore(banner, body.firstChild);
    }
    resetBodySpacing() {
        if (this.$pageWrapper !== null) {
            this.$pageWrapper.style.paddingBottom = "0px";
        }
    }
    isAllowedToShow() {
        const isPrivacyPage = window.location.href.indexOf(this.privacyPage) > -1;
        // Currently $pageWrapper is the only way to check if we have a real
        // page frame of a vertical to prevent showing the
        // cookie banner within "clara" or "invoice" popups
        // TODO: this needs to be adjusted when behaviour is defined and arranged
        return !!(this.$pageWrapper && this.$banner && !isPrivacyPage);
    }
    show(callback) {
        if (this.$banner !== null && this.$bannerWrapper !== null && this.$body !== null && this.$pageWrapper !== null) {
            if (!this.isFloatingVariant()) {
                const bannerHeight = window.getComputedStyle(this.$banner).height;
                const pseudoElemHeight = window.getComputedStyle(this.$bannerWrapper, "::before").height;
                Banner.moveBannerFragment(this.$banner, this.$body);
                this.$banner.style.marginBottom = `${(parseInt(bannerHeight || "0") + (parseInt(pseudoElemHeight || "0") / 2) + 10) * -1}px`;
                this.$banner.classList.add(this.visibilityClass);
            }
            else {
                this.$body.insertBefore(this.$banner, this.$body.lastChild);
                this.$banner.classList.add(this.visibilityClass);
                this.$banner.style.display = "block";
            }
        }
        if (this.$banner !== null && this.$bannerWrapper !== null && this.$pageWrapper !== null) {
            if (!this.isFloatingVariant()) {
                this.$banner.style.marginBottom = "0px";
                // add resize handler to move page downwards
                Banner.adjustResizeStyling(this.$banner, this.$bannerWrapper, this.$pageWrapper);
                window.addEventListener("resize", () => {
                    if (this.$banner !== null && this.$bannerWrapper !== null && this.$pageWrapper !== null) {
                        this.resizeHandler(this.$banner, this.$bannerWrapper, this.$pageWrapper);
                    }
                });
            }
            if (typeof callback === "function") {
                callback();
            }
        }
    }
    remove() {
        this.resetBodySpacing();
        if (this.$banner !== null && this.$banner.parentNode) {
            this.$banner.parentNode.removeChild(this.$banner);
        }
    }
    isFloatingVariant() {
        return this.variant === FloatingCookieBanner.VERSION;
    }
}
export default Banner;
