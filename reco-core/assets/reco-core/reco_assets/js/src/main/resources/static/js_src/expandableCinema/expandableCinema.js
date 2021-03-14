'use strict';

const cinemaModule = require('../cinema/cinemaController.js');
const expandButtonModule = require('./expandButton.js');
const collapseButtonModule = require('./collapseButton.js');
const cinemaTracker = require('../cinema/cinemaTracker.js');

function dispatchChangeEvent() {
    document.dispatchEvent(new CustomEvent('cinemaCollapseStateChanged'));
}

module.exports = () => {
    return (domContext, isExpanded, additionalTrackingDataFromOtherTeam) => {
        let cinema;
        const expandedContainerDom = domContext.getElementsByClassName('reco_expandable_cinema_expanded_container')[0];
        const cinemaDom = domContext.getElementsByClassName('reco_cinema')[0];

        const expandButtonDom = domContext.getElementsByClassName('reco_expandable_cinema_button_expand')[0];
        const collapseButtonDom = domContext.getElementsByClassName('reco_expandable_cinema_button_collapse')[0];

        const expandButton = expandButtonModule(expandButtonDom, expandedContainerDom);
        const collapseButton = collapseButtonModule(collapseButtonDom, expandButtonDom, expandedContainerDom);

        if (!!isExpanded) {
            cinema = cinemaModule(cinemaDom, true, undefined, false);
            cinemaTracker.trackOpenedCinema(cinema.getVisibleTiles(), cinema.getTileCount(), cinema.getFirstTileIndex(), 'view', cinema.getTrackingData(), additionalTrackingDataFromOtherTeam);
        } else {
            cinema = cinemaModule(cinemaDom, true, undefined, false);
            cinemaTracker.trackClosedCinema(cinema.getTileCount(), cinema.getPromoType(), 'view', cinema.getTrackingData(), additionalTrackingDataFromOtherTeam);
        }

        expandButton.registerOnClickHandler(() => {
            cinema.performLayout().then(() => {
                dispatchChangeEvent();
            });
            cinemaTracker.trackOpenedCinema(cinema.getVisibleTiles(), cinema.getTileCount(), cinema.getFirstTileIndex(), 'opened', cinema.getTrackingData());
        });

        collapseButton.registerOnClickHandler(() => {
            cinemaTracker.trackClosedCinema(cinema.getTileCount(), cinema.getPromoType(), 'closed', cinema.getTrackingData());
            dispatchChangeEvent();
        });
    };
};
