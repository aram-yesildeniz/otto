const presentationClientImpl = require('./presentationClient.js')();
const expandableCinemaImpl = require('../expandableCinema/expandableCinema.js')();
const performanceImpl = require('../performance/performance.js')(window);

module.exports = (presentationClient, expandableCinema, performance) => {
    if (presentationClient === undefined) presentationClient = presentationClientImpl;
    if (expandableCinema === undefined) expandableCinema = expandableCinemaImpl;
    if (performance === undefined) performance = performanceImpl;

    return (data) => {
        performance.cinemaLoadingStarted();
        const target = data.target;
        const variationId = data.variationId;
        if (!!target && !!variationId) {
            return presentationClient.loadWishlistCinema(variationId)
                .then((cinemaHtml) => {
                    target.innerHTML = cinemaHtml;
                })
                .then(() => {
                    expandableCinema(target, false);
                })
                .then(() => {
                    performance.cinemaLoaded('reco_wishlist');
                });
        }
    };
};
