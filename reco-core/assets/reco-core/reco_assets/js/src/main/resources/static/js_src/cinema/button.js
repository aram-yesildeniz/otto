'use strict';

module.exports = (buttonDom) => {
    const module = {};

    module.registerOnClickHandler = (onClick) => {
        buttonDom.addEventListener('click', onClick);
    };

    module.hide = () => {
        if (!buttonDom.classList.contains('reco_cinema__button--hide')) {
            buttonDom.classList.add('reco_cinema__button--hide');
        }
    };

    module.show = () => {
        if (buttonDom.classList.contains('reco_cinema__button--hide')) {
            buttonDom.classList.remove('reco_cinema__button--hide');
        }
    };

    const getButtonOffsetTop = (imgHeight) => {
        const halfButtonHeight = 20;
        const paddingTop = 8;
        return ((imgHeight + paddingTop) / 2) - halfButtonHeight;
    };

    module.initializeButtonPosition = (imgHeight) => {
        const newPos = getButtonOffsetTop(imgHeight);

        buttonDom.style.marginTop = `${newPos}px`;
    };

    return module;
};