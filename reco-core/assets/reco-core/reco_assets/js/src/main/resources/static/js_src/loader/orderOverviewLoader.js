const presentationClient = require('./presentationClient.js')();
const cinemaInjector = require('./cinemaInjector.js');
const performance = require('../performance/performance.js')(window);

module.exports = () => {

    return (data) => {
        performance.cinemaLoadingStarted();
        const target = data.target;
        const variationId = data.variationId;
        const trackingDataByFt4 = data.trackingData;
        const cinemaId = data.cinemaId;

        if (!!target && !!variationId && !!cinemaId) {
            return presentationClient.loadOrderOverviewCinema(variationId, cinemaId)
                .then((cinemaHtml) => {
                    if (!!cinemaHtml) {
                        return cinemaInjector.injectCinema(target, cinemaHtml);
                    } else {
                        return Promise.reject('No recommendation cinema found for Order Overview.')
                    }
                })
                .then(() => {
                    performance.cinemaLoaded('reco_orderOverview');
                });
        }
    };

};
