const cinema = require('../cinema/cinemaController.js');
const debug = require('../qa/debug.js');


module.exports = (window) => {

    function removeClass(domElement) {
        return () => {
            domElement.classList.remove('needsInitialization');
        }
    }

    function waitForCssToBeLoaded(cinemaDom) {
        return new Promise((resolve) => {
            const intervalID = window.setInterval(
                function () {
                    if (cinemaDom.scrollWidth > 0) {
                        window.clearInterval(intervalID);
                        resolve();
                    }
                    // else: just wait for another iteration
                },
                50 // iterate every 50 ms
            );
        });
    }

    const cinemas = document.querySelectorAll('.reco.cinema.entryPage.needsInitialization');
    const cinemaPromises = [];

    for (let i = 0; i < cinemas.length; i++) {
        const cinemaDom = cinemas[i];
        removeClass(cinemaDom)();
        const cinemaPromise = waitForCssToBeLoaded(cinemaDom)
            .then(() => {
                return cinema(cinemaDom, false)
                    .isLoaded;
            })
            .catch((e) => {
                debug.log(e);
            });
        cinemaPromises.push(cinemaPromise);
    }
    return Promise.all(cinemaPromises);
};
