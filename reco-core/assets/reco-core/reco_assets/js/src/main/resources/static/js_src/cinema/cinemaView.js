'use strict';

module.exports = (cinemaDom) => {

    const module = {};

    module.registerResizeHandler = (handler) => {
        window.addEventListener('resize', handler);
    };

    module.getAdditionalTrackingData = () => {
        return JSON.parse(cinemaDom.getAttribute('data-additional-tracking'));
    };

    module.getTrackingData = () => {
        return JSON.parse(cinemaDom.getAttribute('data-tracking'));
    };

    module.getFeatureIndex = () => {
        return cinemaDom.getAttribute('data-feature-index');
    };

    module.isAddToBasketEnabled = () => {
        return "true" === cinemaDom.getAttribute('data-add-to-basket-enabled');
    };

    return module;
};
