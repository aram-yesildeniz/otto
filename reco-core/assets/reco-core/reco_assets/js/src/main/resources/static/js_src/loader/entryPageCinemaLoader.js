const cinemaInjector = require('./cinemaInjector.js');
const presentationClient = require('./presentationClient.js')();

const performance = require('../performance/performance.js')(window);

module.exports = () => {
    return (data) => {

        performance.cinemaLoadingStarted();

        return presentationClient.loadEntryPageCinema(data.menuItemPath, data.dresonRule, data.pageType, data.index, data.time)
            .then((cinemaHtml) => {
                if (!!cinemaHtml) {
                    if (cinemaHtml.includes('laptopAdvisorSpringBreak')) {
                        return data.targetElement.innerHTML = cinemaHtml;
                    }
                    return cinemaInjector.injectCinema(data.targetElement, cinemaHtml);
                } else {
                    return Promise.reject('No recommendation cinema for entry page found.');
                }
            })
            .then(() => {
                performance.cinemaLoaded('entryPage');
            });
    };
};