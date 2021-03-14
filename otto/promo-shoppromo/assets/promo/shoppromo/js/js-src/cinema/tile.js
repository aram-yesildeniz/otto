'use strict';

export default class Tile {

    constructor(tileDom) {
        this.tileDom = tileDom;
    }

    getWidth() {
        return this.tileDom.offsetWidth;
    }

}