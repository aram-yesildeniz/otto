const cinema = require('../cinema/cinemaController.js');
const debug = require('../qa/debug.js');

module.exports = (() => {
    const module = {};

    module.injectCinema = (targetElement, htmlContent, eventMergeId) => {
        targetElement.innerHTML = htmlContent;

        return cinema(targetElement, false, eventMergeId)
            .isLoaded
            .catch((error) => {
                debug.log(error);
                targetElement.innerHTML = '';
                return Promise.reject(error);
            });
    };

    return module;
})();
