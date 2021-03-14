'use strict';

import Button from './button.js';
import Tile from './tile.js';
import TileListController from './tileListController.js';
import TileListView from './tileListView.js';
import scrollModule from './scroll.js';
import {Logger} from "../logger";

export default class Cinema {

    constructor(cinemaDom, config) {

        this.cinemaDom = cinemaDom;
        this.config = config;
        this.promoShopPromo = window.o_promo_shoppromo;

        const tiles = Array.from(cinemaDom.querySelectorAll(config.tileSelector)).map((tileDom) => new Tile(tileDom));
        this.tiles = tiles;

        this.tileListViewDomObject = cinemaDom.querySelector(config.containerSelector);
        this.tileListView = new TileListView(this.tileListViewDomObject, scrollModule(), () => tiles[0].getWidth() + (config.tilePaddingRight || 0));
        const tileListView = this.tileListView;
        this.tileListController = new TileListController(tileListView, tiles);

        window.addEventListener('resize', () => this.updateButtonVisibility());

        this.leftButton = new Button(cinemaDom.querySelector(config.buttonLeftSelector), config.buttonHideClass);
        this.leftButton.registerOnClickHandler(() => {
            this.tileListController.scrollLeft(() => {
                this.updateButtonVisibility();
            });
            this.promoShopPromo.trackCinemaMovementType(this.cinemaDom.parentElement, "left");
        });
        this.rightButton = new Button(cinemaDom.querySelector(config.buttonRightSelector), config.buttonHideClass);
        this.rightButton.registerOnClickHandler(() => {
            this.tileListController.scrollRight(() => {
                this.updateButtonVisibility();
            });
            this.promoShopPromo.trackCinemaMovementType(this.cinemaDom.parentElement, "right");
        });

        tileListView.registerOnScrollListener(() => {
            this.updateButtonVisibility();
            this.promoShopPromo.trackViewOnCinemaMovement(this.cinemaDom.parentElement, tileListView.mostVisibleTileIndex(), tileListView.lastVisibleTileIndex() + 1);
        });

        tileListView.registerOnTouchStartListener(() => {
            this.isScrolling = true;
        });

        tileListView.registerOnTouchEndListener(() => {
            this.isScrolling = false;
            this.promoShopPromo.trackCinemaMovementType(this.cinemaDom.parentElement, "swipe");
        });

        this.addMouseMovementListenerForHybridDevices();
        this.waitForCss();
    }

    waitForCss() {
        const self = this;
        const intervalId = window.setInterval(() => {
            const scrollWidth = self.tileListViewDomObject.scrollWidth;
            const width =  self.tileListViewDomObject.getBoundingClientRect().width ||  self.tileListViewDomObject.offsetWidth;
            const widthOfLastTile = this.tiles[this.tiles.length -1].getWidth();
            // eslint-disable-next-line
            Logger.log("Small Cinema - scrollWidth: " + scrollWidth + " - offsetWidth: " + width + " - document.hidden: " + document.hidden + " - timestamp: " + Date.now() + " - last tile width: " + widthOfLastTile);
            // eslint-disable-next-line
            if (scrollWidth > 0 && !document.hidden && widthOfLastTile < scrollWidth) { //Wait if in background tab (document.hidden is true then) and wait until width of last tile is lower than full scroll width (we found out that width of tile is equal to scrollWidth when css not applied and rendering not finished)
                Logger.log("Updating button visibility and clearing interval.");
                self.updateButtonVisibility();
                self.promoShopPromo.trackInitialViewSmallShopPromo(self.cinemaDom.parentElement, self.tileListView.fullyVisibleTilesPerPage());
                window.clearInterval(intervalId);
            }
        }, 100);
    }

    updateButtonVisibility() {
        if (this.tileListController.isAtLeftBorder()) {
            this.leftButton.hide();
        } else {
            this.leftButton.show();
        }

        if (this.tileListController.isAtRightBorder()) {
            this.rightButton.hide();
        } else {
            this.rightButton.show();
        }
    }

    //Detect mouseover on hybrid devices that have a mouse attached
    addMouseMovementListenerForHybridDevices() {
        const self = this;
        const forceButtonVisibility = function onFirstHover() {
            self.leftButton.forceVisibility();
            self.rightButton.forceVisibility();
            self.cinemaDom.removeEventListener('mouseover', onFirstHover, false);
        };
        this.cinemaDom.addEventListener('mouseover', forceButtonVisibility, false);
        //detect touchstart (which is only fired on mobile) and remove mouseover listener, because "click" on touch devices also generates a mouseover event
        this.cinemaDom.addEventListener('touchstart', function onFirstTouchStart() {
            self.cinemaDom.removeEventListener('mouseover', forceButtonVisibility, false);
            self.cinemaDom.removeEventListener('touchstart', onFirstTouchStart, false);
        }, {passive: true});
    }
}