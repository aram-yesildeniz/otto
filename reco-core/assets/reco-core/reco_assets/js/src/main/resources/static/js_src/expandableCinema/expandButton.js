'use strict';

module.exports = (expandButtonDom, expandedContainerDom) => {
    const module = {};

    const expand = () => {
        expandButtonDom.classList.add('reco_expandable_cinema_hidden');
        expandedContainerDom.classList.remove('reco_expandable_cinema_hidden');
    };

    expandButtonDom.addEventListener('click', () => {
        expand();
    });

    module.registerOnClickHandler = (onClick) => {
        expandButtonDom.addEventListener('click', onClick);
    };

    return module;
};