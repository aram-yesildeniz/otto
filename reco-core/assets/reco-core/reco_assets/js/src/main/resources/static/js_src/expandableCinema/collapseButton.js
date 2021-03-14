'use strict';

module.exports = (collapseButtonDom, expandButtonDom, expandedContainerDom) => {
    const module = {};

    const collapse = () => {
        expandButtonDom.classList.remove('reco_expandable_cinema_hidden');
        expandedContainerDom.classList.add('reco_expandable_cinema_hidden');
    };

    collapseButtonDom.addEventListener('click', () => {
        collapse();
    });

    module.registerOnClickHandler = (onClick) => {
        collapseButtonDom.addEventListener('click', onClick);
    };

    return module;
};