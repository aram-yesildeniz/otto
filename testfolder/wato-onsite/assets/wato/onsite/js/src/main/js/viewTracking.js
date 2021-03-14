class ViewTracking {
    constructor(trackingApi) {
        this.trackingApi = trackingApi;
    }

    trackView(bannerOptions, data) {
        const noContent = "noContent";
        const campaignid = (bannerOptions.campaignid) ? bannerOptions.campaignid : noContent;
        const bannerid = (bannerOptions.bannerid) ? bannerOptions.bannerid : noContent;

        this.trackingApi.sendMergeRequest({
            'wato_AdActivity': 'view',
            'wato_AdContent': campaignid + '$' + bannerid,
            'wato_AdPosition': data.websiteid + '$' + data.av_id
        });
    }

    trackNoView(data) {
        this.trackingApi.sendMergeRequest({
            'wato_AdActivity': 'false',
            'wato_AdPosition': data.websiteid + '$' + data.av_id
        });
    }
}

export {ViewTracking};
