const debug = require('../qa/debug.js');

module.exports = () => {
    const module = {};

    const ALTERNATIVE_IDENTIFIER = 'alternative';
    const COMPLEMENTARY_IDENTIFIER = 'complementary';
    const PRODUCTLINE_IDENTIFIER = 'productline';
    const ENTRY_PAGE_IDENTIFIER = 'entryPage';
    const EXPANDABLE_CINEMA_IDENTIFIER = 'reco_expandable_cinema_wrapper';
    const ORDER_OVERVIEW_IDENTIFIER = 'orderoverview';

    const loadCinemasInternal = (url, ...cinemaIdentifiers) => {
        return o_util.ajax
            .get(url)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(response);
                }
                return response.responseText;
            })
            .then((responseHtml) => {
                const tempDom = document.createElement('div');
                tempDom.innerHTML = responseHtml;

                const cinemas = {};
                cinemaIdentifiers.forEach((cinemaIdentifier) => {
                    const aContent = tempDom.getElementsByClassName(cinemaIdentifier);
                    if (aContent.length > 0) {
                        cinemas[cinemaIdentifier] = aContent[0].innerHTML;
                    }
                });
                return cinemas;
            });
    };

    module.loadDetailViewCinemas = (variationId, ...cinemaIdentifiers) => {
        const url = `test/reco-core/cinemas/detailview/variations/${variationId}?${o_tracking.bct.getMergeParameters()}`;
        return loadCinemasInternal(url, ...cinemaIdentifiers);
    };

    module.loadDetailViewAlternativeCinema = (variationId) => {
        const url = `test/reco-core/cinemas/detailview/alternative/variations/${variationId}?${o_tracking.bct.getMergeParameters()}`;
        return loadCinemasInternal(url, ALTERNATIVE_IDENTIFIER)
            .then((cinemaMap) => {
                if (!!cinemaMap && !!cinemaMap[ALTERNATIVE_IDENTIFIER]) {
                    return cinemaMap[ALTERNATIVE_IDENTIFIER];
                } else {
                    return Promise.reject('alternative cinema html missing');
                }
            }).catch((error) => {
                debug.log(error);
            });
    };

    module.loadDetailViewComplementaryCinema = (variationId) => {
        const url = `test/reco-core/cinemas/detailview/complementary/variations/${variationId}?${o_tracking.bct.getMergeParameters()}`;
        return loadCinemasInternal(url, COMPLEMENTARY_IDENTIFIER)
            .then((cinemaMap) => {
                if (!!cinemaMap && !!cinemaMap[COMPLEMENTARY_IDENTIFIER]) {
                    return cinemaMap[COMPLEMENTARY_IDENTIFIER];
                } else {
                    return Promise.reject('complementary cinema html missing');
                }
            }).catch((error) => {
                debug.log(error);
            });
    };

    module.loadDetailViewProductLineCinema = (variationId) => {
        const url = `test/reco-core/cinemas/detailview/productline/variations/${variationId}?${o_tracking.bct.getMergeParameters()}`;
        return loadCinemasInternal(url, PRODUCTLINE_IDENTIFIER)
            .then((cinemaMap) => {
                if (!!cinemaMap && !!cinemaMap[PRODUCTLINE_IDENTIFIER]) {
                    return cinemaMap[PRODUCTLINE_IDENTIFIER];
                } else {
                    return Promise.reject('productline html missing');
                }
            }).catch((error) => {
                debug.log(error);
            });
    };

    module.loadProductlineCinema = (variationId) => {
        return loadCinemasInternal(`test/reco-core/cinemas/productline/variations/${variationId}`, PRODUCTLINE_IDENTIFIER)
            .then((cinemaMap) => {
                if (!!cinemaMap && !!cinemaMap[PRODUCTLINE_IDENTIFIER]) {
                    return cinemaMap[PRODUCTLINE_IDENTIFIER];
                } else {
                    return Promise.reject('productline html missing');
                }
            });
    };

    module.loadEntryPageCinema = (menuItemPath, dresonRule, pageType, index, time) => {
        let url = `test/reco-core/cinemas/entrypage?menuItemPath=${menuItemPath}&${o_tracking.bct.getMergeParameters()}&encodedDresonRule=${dresonRule}`;
        if (pageType) {
            url += `&pageType=${pageType}`;
        }
        if (index) {
            url += `&index=${index}`;
        }

        if (time) {
            url += `&time=${time}`;
        }
        return loadCinemasInternal(url, ENTRY_PAGE_IDENTIFIER)
            .then((cinemaMap) => {
                if (!!cinemaMap && !!cinemaMap[ENTRY_PAGE_IDENTIFIER]) {
                    return cinemaMap[ENTRY_PAGE_IDENTIFIER];
                } else {
                    return Promise.reject('entryPage html missing');
                }
            });
    };

    module.loadRefactorEntryPageCinema = (menuItemPath, dresonRule, pageType, index) => {
        let url = `test/reco-core/refactor/cinemas/entrypage?menuItemPath=${menuItemPath}&${o_tracking.bct.getMergeParameters()}&encodedDresonRule=${dresonRule}`;
        if (pageType) {
            url += `&pageType=${pageType}`;
        }
        if (index) {
            url += `&index=${index}`;
        }
        return loadCinemasInternal(url, ENTRY_PAGE_IDENTIFIER)
        .then((cinemaMap) => {
            if (!!cinemaMap && !!cinemaMap[ENTRY_PAGE_IDENTIFIER]) {
                return cinemaMap[ENTRY_PAGE_IDENTIFIER];
            } else {
                return Promise.reject('entryPage html missing');
            }
        });
    };

    module.loadOrderOverviewCinema = (variationId, cinemaId) => {
        const url = `test/reco-core/cinemas/orderOverview/variations/${variationId}?cinemaId=${cinemaId.toUpperCase()}`;
        return loadCinemasInternal(url, ORDER_OVERVIEW_IDENTIFIER)
            .then((cinemaMap) => {
                if (!!cinemaMap && !!cinemaMap[ORDER_OVERVIEW_IDENTIFIER]) {
                    return cinemaMap[ORDER_OVERVIEW_IDENTIFIER];
                } else {
                    return Promise.reject('orderOverview html missing');
                }
            });
    };

    module.loadWishlistCinema = (variationId) => {
        return loadCinemasInternal(`test/reco-core/cinemas/wishlist/variations/${variationId}`, EXPANDABLE_CINEMA_IDENTIFIER)
            .then((cinemaMap) => {
                if (!!cinemaMap && !!cinemaMap[EXPANDABLE_CINEMA_IDENTIFIER]) {
                    return cinemaMap[EXPANDABLE_CINEMA_IDENTIFIER];
                } else {
                    return Promise.reject('wishlist html missing');
                }
            });
    };

    return module;
};
