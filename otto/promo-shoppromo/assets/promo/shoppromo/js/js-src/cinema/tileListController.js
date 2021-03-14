'use strict';

const TARGET_TILE_INDEX_UNINITIALIZED = -1;

export default class TileListController {

    constructor(tileListView, tiles) {
        this.tileListView = tileListView;
        this.tiles = tiles;
        this.lastTargetTileIndex = TARGET_TILE_INDEX_UNINITIALIZED;
    }

    scrollLeft(startedOrFinishedScrollingCallback) {
        const tilesPerPage = this.tileListView.fullyVisibleTilesPerPage();
        const firstVisibleTileIndex = this.tileListView.firstVisibleTileIndex();
        const targetTileIndex = Math.max(0, firstVisibleTileIndex - tilesPerPage);
        this.scrollTo(targetTileIndex, startedOrFinishedScrollingCallback);
    }

    scrollRight(startedOrFinishedScrollingCallback) {
        const tilesPerPage = this.tileListView.fullyVisibleTilesPerPage();
        const firstVisibleTileIndex = this.tileListView.firstVisibleTileIndex();
        const indexOfFirstTileOfLastPage = this.tiles.length - tilesPerPage;
        const targetTileIndex = Math.min(firstVisibleTileIndex + tilesPerPage, indexOfFirstTileOfLastPage);
        this.scrollTo(targetTileIndex, startedOrFinishedScrollingCallback);
    }

    scrollTo(targetTileIndex, startedOrFinishedScrollingCallback) {
        // Don't scroll again if trying to scroll to same tile as before
        if (targetTileIndex !== this.lastTargetTileIndex) {
            this.lastTargetTileIndex = targetTileIndex;
            this.tileListView.scrollTo(targetTileIndex, startedOrFinishedScrollingCallback);
        }
    }

    isAtLeftBorder() {
        return this.tileListView.isAtLeftBorder();
    }

    isAtRightBorder() {
        return this.tileListView.isAtRightBorder();
    }


}