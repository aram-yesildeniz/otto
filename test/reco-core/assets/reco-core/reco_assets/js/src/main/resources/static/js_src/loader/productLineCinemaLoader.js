const cinemaInjector = require('./cinemaInjector.js');
const presentationClient = require('./presentationClient.js')();

const qaDataLogger = require('../qa/qa_helper.js');
const performance = require('../performance/performance.js')(window);

module.exports = () => {
    return (data) => {

        performance.cinemaLoadingStarted();
        qaDataLogger.productLineCinemaLoaderCall = data;

        return presentationClient.loadProductlineCinema(data.variationId)
            .then((cinemaHtml) => {
                if (!!cinemaHtml) {
                    return cinemaInjector.injectCinema(data.targetElement, cinemaHtml, data.eventMergeId);
                } else {
                    return Promise.reject('No recommendation cinema for productline found.');
                }
            })
            .then(() => {
                performance.cinemaLoaded('RecoProductline');
            });
    };
};