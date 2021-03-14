'use strict';

const cinemaTracker = require('./cinemaTracker.js');

module.exports = (tileDom, tileDoms, cinemaView, featureSequence) => {
    const module = {};

    module.domWrapper = {
        setMinWidth: (width) => (tileDom.style.minWidth = `${width}px`),
        setMaxWidth: (width) => (tileDom.style.maxWidth = `${width}px`),
        addLoaderClass: () => tileDom.getElementsByClassName('reco_cinema__image__spinner')[0].classList.add('p_loader250'),
        articleImagePlaceholderElement: () => tileDom.getElementsByClassName('reco_cinema__image_placeholder')[0],
        articleImageElement: () => tileDom.getElementsByTagName('img')[0],
        imageContainerElement: () => tileDom.getElementsByClassName('reco_cinema__image')[0],
        loaderBoxElement: () => tileDom.getElementsByClassName('reco_cinema__image__spinner_box')[0],
        articleVariationIds: () => JSON.parse(tileDom.getAttribute('data-article-variation-ids')) || [],
        cinemaType: () => tileDom.getAttribute('data-cinema-type'),
        variationId: () => tileDom.getAttribute('data-variation-id'),
        productTitle: () => tileDom.querySelector('.reco_cinema__adslink').getAttribute('title') || 'Unknown',
        adsLink: () => tileDom.querySelector('.reco_cinema__adslink'),
        tilesLength: () => tileDoms.length,
        tilesIndex: () => tileDoms.indexOf(tileDom),
        trackingData: () => cinemaView.getTrackingData(),
        additionalTrackingData: () => cinemaView.getAdditionalTrackingData(),
        featureIndex: () => cinemaView.getFeatureIndex()
    };

    module.getTrackingData = () => {
        return JSON.parse(tileDom.getAttribute('data-tracking'));
    };

    module.getVariationId = () => {
        return tileDom.getAttribute('data-variation-id');
    };

    module.getActivityTrackingData = (activity) => {
        const trackingActivity = (activity === 'click') ? 'Click' : 'View';
        const trackingData = tileDom.getAttribute('data-activity-tracking');
        if (!trackingData) {
            return {};
        }
        const result = {};
        Object.entries(JSON.parse(trackingData)).forEach(([key, value]) => result[key + trackingActivity] = value);
        return result;
    };

    module.update = (width) => {
        resize(width);
    };

    const removeLoaderBoxElement = () => {
        module.domWrapper.imageContainerElement().removeChild(module.domWrapper.loaderBoxElement());
    };

    module.lazyLoad = () => {
        return new Promise((resolve, reject) => {
            if (!!module.domWrapper.articleImagePlaceholderElement()) {
                module.domWrapper.addLoaderClass();
                window.o_reco.justlazy.lazyLoad(
                    module.domWrapper.articleImagePlaceholderElement(),
                    {
                        onloadCallback: () => {
                            removeLoaderBoxElement();
                            resolve('Successfully loaded image.');
                        },
                        onerrorCallback: () => {
                            removeLoaderBoxElement();
                            reject('Failed to load image.');
                        }
                    }
                );
            } else {
                resolve('Image already loaded');
            }
        }).then(() => module.domWrapper.articleImageElement().clientHeight);
    };

    module.setImageContainerHeight = (height) => {
        const imageContainer = module.domWrapper.imageContainerElement();
        imageContainer.style.minHeight = `${height}px`;
    };

    const resize = (width) => {
        const articleImage = module.domWrapper.articleImageElement();
        if (!!articleImage) {
            articleImage.style.height = '';
        }
        module.domWrapper.setMinWidth(width);
        module.domWrapper.setMaxWidth(width);
    };

    module.domWrapper.adsLink().addEventListener('click', () => cinemaTracker.trackClick(module, module.domWrapper.tilesLength(), module.domWrapper.tilesIndex(), module.domWrapper.trackingData(), module.domWrapper.additionalTrackingData(), featureSequence, module.domWrapper.featureIndex()));

    return module;
};
