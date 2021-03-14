'use strict';

export default class Button {

    constructor(buttonDom, buttonHideClass) {
        this.buttonDom = buttonDom;
        this.buttonHideClass = buttonHideClass;
    }

    registerOnClickHandler(onClick) {
        this.buttonDom.addEventListener('click', onClick);
    }

    hide() {
        if (!this.buttonDom.classList.contains(this.buttonHideClass)) {
            this.buttonDom.classList.add(this.buttonHideClass);
        }
    }

    show() {
        if (this.buttonDom.classList.contains(this.buttonHideClass)) {
            this.buttonDom.classList.remove(this.buttonHideClass);
        }
    }

    forceVisibility() {
        this.buttonDom.style.visibility = 'visible';
    }

}