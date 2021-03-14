export default class Togglz {

    constructor() {
        let togglzElement = document.querySelector("[data-togglz]");
        let togglzString = togglzElement && togglzElement.getAttribute("data-togglz")|| "{}";
        this._togglz = JSON.parse(togglzString);
    }

    isActive(featureToggle) {
        return this._togglz[featureToggle] || false;
    }

}