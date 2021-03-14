'use strict';
import {Logger} from "../logger";

const IMPROVE_FABIS_USEREXPERIENCE_WHEN_ZOOMING_75PERCENT = 1;

export default class TileListView {


    constructor(tileContainerDom, scroller, tileWidthLambda) {
        this.tileContainerDom = tileContainerDom;
        this.scroller = scroller;
        this.tileWidthLambda = tileWidthLambda;

        this.domWrapper = {
            getCurrentScrollPositionPx: () => this.tileContainerDom.scrollLeft,
            setCurrentScrollPositionPx: (newPosition) => {
                this.tileContainerDom.scrollLeft = newPosition;
            },
            getScrollWidth: () => this.tileContainerDom.scrollWidth,
            getOffsetWidth: () => this.tileContainerDom.offsetWidth,
        };

    }

    registerOnScrollListener(onScroll) {
        this.tileContainerDom.addEventListener('scroll', onScroll);
    }

    registerOnTouchStartListener(callback) {
        this.tileContainerDom.addEventListener('touchstart', callback, {passive: true});
    }

    registerOnTouchEndListener(callback) {
        this.tileContainerDom.addEventListener('touchend', callback, {passive: true});
    }

    isAtLeftBorder() {
        const leftEdgePosition = 0;
        return Math.floor(this.domWrapper.getCurrentScrollPositionPx()) === leftEdgePosition;
    }

    isAtRightBorder() {
        const rightEdgePosition = this.domWrapper.getScrollWidth() - IMPROVE_FABIS_USEREXPERIENCE_WHEN_ZOOMING_75PERCENT;
        const currentRightScrollPosition = (Math.ceil(this.domWrapper.getCurrentScrollPositionPx()) + this.domWrapper.getOffsetWidth());

        Logger.log("rightEdgePosition: " + rightEdgePosition + " - currentRightScrollPosition: " + currentRightScrollPosition);

        return rightEdgePosition <= currentRightScrollPosition;
    }

    fullyVisibleTilesPerPage() {
        const width = this.domWrapper.getOffsetWidth();
        return Math.floor(width / this.tileWidthLambda());
    }

    firstVisibleTileIndex() {
        const scrolledToPx = this.domWrapper.getCurrentScrollPositionPx();
        return Math.ceil(scrolledToPx / this.tileWidthLambda());
    }

    mostVisibleTileIndex() {
        const scrolledToPx = this.domWrapper.getCurrentScrollPositionPx();
        return Math.round(scrolledToPx / this.tileWidthLambda());
    }

    lastVisibleTileIndex() {
        const lastVisibleScrolledToPx = this.domWrapper.getCurrentScrollPositionPx() + this.domWrapper.getOffsetWidth();
        return Math.round(lastVisibleScrolledToPx / this.tileWidthLambda()) - 1;
    }

    scrollTo(targetIndex, startedOrFinishedScrollingCallback) {
        const newScrollPosition = this.stayWithinBoundaries(targetIndex * this.tileWidthLambda());
        const oldScrollPosition = this.domWrapper.getCurrentScrollPositionPx();
        this.scroller.scrollAnimation(oldScrollPosition, newScrollPosition, this.domWrapper.setCurrentScrollPositionPx, () => {
            startedOrFinishedScrollingCallback(targetIndex)
        });
    }

    stayWithinBoundaries(scrollPosition) {
        const maxRightScrollPosition = this.domWrapper.getScrollWidth() - this.domWrapper.getOffsetWidth();
        const maxLeftScrollPosition = 0;
        scrollPosition = Math.max(maxLeftScrollPosition, scrollPosition);
        scrollPosition = Math.min(maxRightScrollPosition, scrollPosition);
        return scrollPosition;
    }

}