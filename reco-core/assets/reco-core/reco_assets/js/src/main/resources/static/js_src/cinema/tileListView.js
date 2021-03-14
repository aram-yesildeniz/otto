'use strict';

const debug = require('../qa/debug.js');

module.exports = (tileContainerDom, scroller) => {
    const module = {};

    module.TILE_COUNT_S_M_PORTRAIT = 2;
    module.TILE_COUNT_S_M_LANDSCAPE = 1;
    module.TILE_COUNT_S_M_SQUARE = 2;
    module.TILE_COUNT_S_M_MIXED = 2;

    module.TILE_COUNT_L_XL_PORTRAIT = 4;
    module.TILE_COUNT_L_XL_LANDSCAPE = 3;
    module.TILE_COUNT_L_XL_SQUARE = 5;
    module.TILE_COUNT_L_XL_MIXED = 4;

    const IMPROVE_FABIS_USEREXPERIENCE_WHEN_ZOOMING_75PERCENT = 1;
    module.domWrapper = {
        getCurrentScrollPositionPx: () => tileContainerDom.scrollLeft,
        setCurrentScrollPositionPx: (newPosition) => {
            tileContainerDom.scrollLeft = newPosition;
        },
        getContentWidthPx: () => tileContainerDom.scrollWidth,
        getSlidingWindowWidthPx: () => tileContainerDom.offsetWidth,
        getCinemaMode: () => tileContainerDom.getAttribute("data-cinema-mode")
    };

    const IMAGE_CONTAINER_PADDING = 4;

    module.isAtLeftBorder = () => {
        const leftEdgePosition = 0;
        return Math.floor(module.domWrapper.getCurrentScrollPositionPx()) === leftEdgePosition;
    };

    module.isAtRightBorder = () => {
        const rightEdgePosition = module.domWrapper.getContentWidthPx() - IMPROVE_FABIS_USEREXPERIENCE_WHEN_ZOOMING_75PERCENT;
        const visibleViewWidth = module.domWrapper.getSlidingWindowWidthPx();
        const currentRightScrollPosition = (Math.ceil(module.domWrapper.getCurrentScrollPositionPx()) + visibleViewWidth);
        return rightEdgePosition <= currentRightScrollPosition;
    };

    module.fullyVisibleTilesPerPage = () => {
        const width = module.domWrapper.getSlidingWindowWidthPx();
        const cinemaMode = module.domWrapper.getCinemaMode();

        if (cinemaMode === "PORTRAIT") {
            return getNumberOfTiles(width, module.TILE_COUNT_S_M_PORTRAIT, module.TILE_COUNT_L_XL_PORTRAIT);
        } else if (cinemaMode === "LANDSCAPE") {
            return getNumberOfTiles(width, module.TILE_COUNT_S_M_LANDSCAPE, module.TILE_COUNT_L_XL_LANDSCAPE);
        } else if (cinemaMode === "SQUARE") {
            return getNumberOfTiles(width, module.TILE_COUNT_S_M_SQUARE, module.TILE_COUNT_L_XL_SQUARE);
        } else if (cinemaMode === "MIXED") {
            return getNumberOfTiles(width, module.TILE_COUNT_S_M_MIXED, module.TILE_COUNT_L_XL_MIXED);
        } else {
            debug.log("data-cinema-mode attribute not found or invalid");
            return module.TILE_COUNT_L_XL_SQUARE
        }
    };

    function getNumberOfTiles(width, numTilesSmall, numTilesLarge) {
        if (width < 700) {
            return numTilesSmall;
        } else {
            return numTilesLarge;
        }
    }

    const tilesPerPage = () => {
        const halfVisibleTile = 0.5;
        return module.fullyVisibleTilesPerPage() + halfVisibleTile;
    };

    module.tileWidthPx = () => {
        return module.domWrapper.getSlidingWindowWidthPx() / tilesPerPage();
    };

    module.firstVisibleTileIndex = () => {
        const scrolledToPx = module.domWrapper.getCurrentScrollPositionPx();

        return Math.ceil(scrolledToPx / module.tileWidthPx());
    };

    module.scrollTo = (targetIndex, startedOrFinishedScrollingCallback) => {
        const quarterTileOffsetCorrection = (module.tileWidthPx() / 4);
        const newScrollPosition = stayWithinBoundaries(targetIndex * module.tileWidthPx() - quarterTileOffsetCorrection - IMAGE_CONTAINER_PADDING);

        const oldScrollPosition = module.domWrapper.getCurrentScrollPositionPx();

        scroller.scrollAnimation(oldScrollPosition, newScrollPosition, module.domWrapper.setCurrentScrollPositionPx, startedOrFinishedScrollingCallback);
    };

    module.registerScrollHandler = (callback) => {
        tileContainerDom.addEventListener('scroll', callback);
    };

    const stayWithinBoundaries = (scrollPosition) => {
        const maxRightScrollPosition = module.domWrapper.getContentWidthPx() - module.domWrapper.getSlidingWindowWidthPx();
        const maxLeftScrollPosition = 0;
        scrollPosition = Math.max(maxLeftScrollPosition, scrollPosition);
        scrollPosition = Math.min(maxRightScrollPosition, scrollPosition);
        return scrollPosition;
    };

    return module;
};