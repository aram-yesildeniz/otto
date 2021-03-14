'use strict';

const cinemaInjector = require('./cinemaInjector.js');

module.exports = () => {
    const trackingAccPath = '{"ot_AccPath_Suffix":"BounceLayer"}';

    const modifyCinema = (cinemaHtml) => {
        const cinemaHtmlCopy = cinemaHtml.cloneNode(true);
        const cinemaHtmlWithoutHeadline = stripHeadlineFromCinema(cinemaHtmlCopy);
        const cinemaHtmlWithAccPathModified = modifyAccPath(cinemaHtmlWithoutHeadline);
        return cinemaHtmlWithAccPathModified;
    };

    const stripHeadlineFromCinema = (cinemaHtml) => {
        const headlineElement = cinemaHtml.getElementsByClassName('reco_cinema__headline')[0];
        if (!!headlineElement) {
            headlineElement.parentNode.removeChild(headlineElement);
        }
        return cinemaHtml;
    };

    const modifyAccPath = (cinemaHtml) => {
        if (!!cinemaHtml) {
            cinemaHtml.setAttribute('data-tracking', trackingAccPath);
        }
        return cinemaHtml;
    };

    return (targetContainerId, mergeId) => {
        const cinemas = document.getElementsByClassName('reco_alternativeCinema');
        if (cinemas.length > 0) {
            const cinema = cinemas[0];
            cinemaInjector
                .injectCinema(document.getElementById(targetContainerId), modifyCinema(cinema).outerHTML, mergeId);
        }
    };
};
