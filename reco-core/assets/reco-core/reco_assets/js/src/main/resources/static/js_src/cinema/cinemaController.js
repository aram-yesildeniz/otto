'use strict';

const buttonModule = require('./button.js');
const tileModule = require('./tile.js');
const tileListControllerModule = require('./tileListController.js');
const tileListViewModule = require('./tileListView.js');
const scrollModule = require('./scroll.js');
const cinemaViewModule = require('./cinemaView.js');
const addToBasketInit = require('./addToBasketInit.js');
const cinemaTracker = require('./cinemaTracker.js');
const debug = require('../qa/debug.js');

const arrayFrom = (arrayLike) => {
    return [].slice.call(arrayLike);
};

module.exports = (cinemaDom, isExpandable, eventMergeId, trackViewOnInit = true) => {
    const module = {};

    const updateButtonVisibility = () => {
        if (tileListController.isAtLeftBorder()) {
            leftButton.hide();
        } else {
            leftButton.show();
        }

        if (tileListController.isAtRightBorder()) {
            rightButton.hide();
        } else {
            rightButton.show();
        }
    };

    const performLayout = () => {
        return tileListController.updateTiles().then((height) => {
            updateButtonVisibility();
            leftButton.initializeButtonPosition(height);
            rightButton.initializeButtonPosition(height);
        });
    };

    const trackView = (featureSequence) => {
        let allVisibleTiles = tileListController.getAllVisibleTiles();
        let totalNumberOfTiles = tileListController.tileCount();
        let additionalTrackingData = cinemaView.getAdditionalTrackingData();
        let cinemaTrackingData = cinemaView.getTrackingData();
        let featureIndex = cinemaView.getFeatureIndex();
        cinemaTracker.trackView(allVisibleTiles,
            totalNumberOfTiles,
            eventMergeId,
            cinemaTrackingData,
            additionalTrackingData,
            featureSequence,
            featureIndex);
        try {
            cinemaTracker.trackJsonView(allVisibleTiles,
                totalNumberOfTiles,
                eventMergeId,
                additionalTrackingData,
                featureSequence,
                featureIndex);
        } catch (e) {
            debug.log('trackJsonView Error', e);
        }
    };

    const MASDiv = cinemaDom.parentNode;
    const featureSequence = MASDiv ? MASDiv.getAttribute("data-feature-order") || "99" : "99";

    const recoCinemaDom = cinemaDom.classList.contains('reco_cinema') ? cinemaDom : cinemaDom.getElementsByClassName('reco_cinema')[0];
    const cinemaView = cinemaViewModule(recoCinemaDom);

    const tileDoms = arrayFrom(cinemaDom.getElementsByClassName('reco_cinema__tile'));
    const tiles = tileDoms.map((tileDom) => tileModule(tileDom, tileDoms, cinemaView, featureSequence));
    const tileListView = tileListViewModule(cinemaDom.getElementsByClassName('reco_cinema__tiles')[0], scrollModule());



    const tileListController = tileListControllerModule(tileListView, tiles, cinemaView, isExpandable, featureSequence);
    tileListController.registerScrollHandler();

    const leftButton = buttonModule(cinemaDom.getElementsByClassName('reco_cinema__button-left')[0]);
    leftButton.registerOnClickHandler(() => tileListController.scrollLeft(updateButtonVisibility));

    const rightButton = buttonModule(cinemaDom.getElementsByClassName('reco_cinema__button-right')[0]);
    rightButton.registerOnClickHandler(() => tileListController.scrollRight(updateButtonVisibility));

    cinemaView.registerResizeHandler(performLayout);

    if (trackViewOnInit) {
        trackView(featureSequence);
    }

    module.isLoaded = performLayout();
    module.performLayout = performLayout;

    if (cinemaView.isAddToBasketEnabled()) {
        addToBasketInit.initAddToBasket();
    }

    module.getVisibleTiles = tileListController.getAllVisibleTiles;
    module.getTileCount = tileListController.tileCount;
    module.getFirstTileIndex = tileListController.getFirstVisibleTileIndex;
    module.getPromoType = tileListController.getPromoType;
    module.getTrackingData = cinemaView.getTrackingData;
    return module;
};
