const cinemaInjector = require('./cinemaInjector.js');
const presentationClient = require('./presentationClient.js')();

const debug = require('../qa/debug.js');
const performance = require('../performance/performance.js')(window);

module.exports = () => {

    return (data) => {
        performance.cinemaLoadingStarted();
        const variationId = data.variationId;
        const alternativeTarget = data.topTarget;
        const complementaryTarget = data.bottomTarget;
        const productLineTarget = data.prioTarget;
        const mergeId = data.eventMergeId;

        presentationClient.loadDetailViewAlternativeCinema(variationId)
            .then((cinemaHtml) => {
                if (!!cinemaHtml && !!alternativeTarget) {
                    const targetElement = document.querySelector(alternativeTarget);
                    if (!!targetElement) {
                        return cinemaInjector.injectCinema(targetElement, cinemaHtml, mergeId);
                    } else {
                        debug.log("could not find target for alternative cinema css selector " + alternativeTarget);
                    }
                } else {
                    return Promise.reject('No recommendation cinema for alternative found.');
                }
            })
            .then(() => {
                performance.cinemaLoaded('RecoDetailViewAlternative');
            })
            .catch((error) => {
                debug.log(error);
            });

        presentationClient.loadDetailViewComplementaryCinema(variationId)
            .then((cinemaHtml) => {
                if (!!cinemaHtml && !!complementaryTarget) {
                    const targetElement = document.querySelector(complementaryTarget);
                    if (!!targetElement) {
                        return cinemaInjector.injectCinema(targetElement, cinemaHtml, mergeId)
                    } else {
                        debug.log("could not find target for complementary cinema css selector " + complementaryTarget);
                    }
                } else {
                    return Promise.reject('No recommendation cinema for complementary found.');
                }
            })
            .then(() => {
                performance.cinemaLoaded('RecoDetailViewComplementary');
            }).catch((error) => {
                debug.log(error);
            });

        presentationClient.loadDetailViewProductLineCinema(variationId)
        .then((cinemaHtml) => {
            if (!!cinemaHtml && !!productLineTarget) {
                const targetElement = document.querySelector(productLineTarget);
                if (!!targetElement) {
                    return cinemaInjector.injectCinema(targetElement, cinemaHtml, mergeId)
                } else {
                    debug.log("could not find target for product line cinema css selector " + productLineTarget);
                }
            } else {
                return Promise.reject('No recommendation cinema for product line found.');
            }
        })
        .then(() => {
            performance.cinemaLoaded('RecoDetailViewProductline');
        })
        .catch((error) => {
            debug.log(error);
        });
    };

};
