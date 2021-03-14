'use strict';

const cinemaTracker = require('./cinemaTracker.js');

module.exports = (tileListView, tiles, cinemaView, isExpandable, featureSequence) => {
    const TARGET_TILE_INDEX_UNINITIALIZED = -1;
    const IMAGE_CONTAINER_PADDING_WIDTH = 4;
    const IMAGE_CONTAINER_PADDING_HEIGHT = 8;
    const module = {};

    let dragging = false;
    let dragStartIndex = tileListView.firstVisibleTileIndex();
    let lastTargetTileIndex = TARGET_TILE_INDEX_UNINITIALIZED;
    let firstLoadedImgHeight;

    const trackEndOfScrolling = () => {
        const dragEndIndex = tileListView.firstVisibleTileIndex();
        if (dragEndIndex > dragStartIndex) {
            module.trackScrollRight();
        } else if (dragEndIndex < dragStartIndex) {
            module.trackScrollLeft();
        }
        dragging = false;
    };

    module.debounce = (callback, millisAfterLastCall) => {
        let timeout;
        const executeCallback = () => {
            timeout = null;
            callback();
        };
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(executeCallback, millisAfterLastCall);
        };
    };

    module.scrollLeft = (startedOrFinishedScrollingCallback) => {
        const tilesPerPage = tileListView.fullyVisibleTilesPerPage();
        const firstVisibleTileIndex = tileListView.firstVisibleTileIndex();
        const targetTileIndex = Math.max(0, firstVisibleTileIndex - tilesPerPage);
        scrollTo(targetTileIndex, startedOrFinishedScrollingCallback);
    };

    module.scrollRight = (startedOrFinishedScrollingCallback) => {
        const tilesPerPage = tileListView.fullyVisibleTilesPerPage();
        const firstVisibleTileIndex = tileListView.firstVisibleTileIndex();
        const indexOfFirstTileOfLastPage = tiles.length - tilesPerPage;
        const targetTileIndex = Math.min(firstVisibleTileIndex + tilesPerPage, indexOfFirstTileOfLastPage);
        scrollTo(targetTileIndex, startedOrFinishedScrollingCallback);
    };

    const scrollTo = (targetTileIndex, startedOrFinishedScrollingCallback) => {
        // Don't scroll again if trying to scroll to same tile as before
        if (targetTileIndex !== lastTargetTileIndex) {
            lastTargetTileIndex = targetTileIndex;
            tileListView.scrollTo(targetTileIndex, startedOrFinishedScrollingCallback);
        }
    };

    module.isAtLeftBorder = () => {
        return tileListView.isAtLeftBorder();
    };

    module.isAtRightBorder = () => {
        return tileListView.isAtRightBorder();
    };

    module.tileCount = () => {
        return tiles.length;
    };

    module.getPromoType = () => {
        return tiles.length > 0 ? tiles[0].getTrackingData().promo_Type || null : null;
    };

    module.getFirstVisibleTileIndex = tileListView.firstVisibleTileIndex;

    module.getAllVisibleTiles = () => {
        const capacity = tileListView.fullyVisibleTilesPerPage();
        const firstVisibleTileIndex = tileListView.firstVisibleTileIndex();

        return tiles.slice(firstVisibleTileIndex, firstVisibleTileIndex + capacity);
    };

    module.getAllVisibleTilesWithHalfVisibleTiles = () => {
        const capacity = tileListView.fullyVisibleTilesPerPage();
        const firstVisibleTileIndex = tileListView.firstVisibleTileIndex();

        return tiles.slice(firstVisibleTileIndex, firstVisibleTileIndex + capacity + 1);
    };

    module.updateTiles = () => {
        const tileWidth = tileListView.tileWidthPx();
        tiles.forEach((tile, tileIndex) => {
            let x = makeUpForMissingPaddingInFirstAndLastChild(tileIndex, tileWidth);
            tile.update(x);
        });
        return module.loadImages();
    };

    module.trackScrollLeft = () => {
        cinemaTracker.trackScroll(module.getAllVisibleTiles(), tiles.length, tileListView.firstVisibleTileIndex(), cinemaView.getTrackingData(), cinemaView.getAdditionalTrackingData(), 'left', featureSequence, cinemaView.getFeatureIndex());
    };

    module.trackScrollRight = () => {
        cinemaTracker.trackScroll(module.getAllVisibleTiles(), tiles.length, tileListView.firstVisibleTileIndex(), cinemaView.getTrackingData(), cinemaView.getAdditionalTrackingData(), 'right', featureSequence, cinemaView.getFeatureIndex());
    };

    module.registerScrollHandler = () => {
        tileListView.registerScrollHandler(scrollHandler);
    };

    module.loadImages = () => {
        const visibleImagePromises = module.getAllVisibleTilesWithHalfVisibleTiles()
            .map((tile) => tile.lazyLoad());
        return Promise.race(visibleImagePromises)
            .then(setImageContainerHeight);
    };

    const makeUpForMissingPaddingInFirstAndLastChild = (tileIndex, tileWidth) => {
        if (!isExpandable && (tileIndex === 0 || tileIndex === (tiles.length - 1))) {
            return tileWidth - IMAGE_CONTAINER_PADDING_WIDTH;
        }
        return tileWidth;
    };

    const setImageContainerHeight = (height) => {
        if (!firstLoadedImgHeight) {
            firstLoadedImgHeight = height;
        }
        tiles.forEach((tile) => {
            tile.setImageContainerHeight(firstLoadedImgHeight + IMAGE_CONTAINER_PADDING_HEIGHT);
        });
        return firstLoadedImgHeight;
    };

    const delayInMilliseconds = 150;
    const debounceFunction = module.debounce(trackEndOfScrolling, delayInMilliseconds);
    const scrollHandler = () => {
        debounceFunction();

        module.loadImages();

        if (!dragging) {
            dragStartIndex = tileListView.firstVisibleTileIndex();
            dragging = true;
        }
    };

    return module;
};
