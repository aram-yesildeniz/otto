class ClickTracking {
    constructor(trackingApi) {
        this.trackingApi = trackingApi;
    }

    trackClick(bannerOptions) {
        const noContent = "noContent";
        const campaignid = (bannerOptions.campaignid) ? bannerOptions.campaignid : noContent;
        const bannerid = (bannerOptions.bannerid) ? bannerOptions.bannerid : noContent;

        this.trackingApi.trackOnNextPageImpression({
            'wato_AdClick': 'true',
            'wk.wato_AdContentClick': campaignid + '$' + bannerid,
            'ot_AccPath': 'wato'
        });
    }

    registerClickHandler(element, trackClick) {
        if (!element) {
            return;
        }
        const listener = (event) => {
            event.preventDefault();
            element.removeEventListener('click', listener);
            trackClick();
            element.click();
            element.addEventListener('click', listener);
        };
        element.addEventListener('click', listener);
    }
}

export {ClickTracking};
