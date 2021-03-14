/*jslint white: true */
/*global o_global */
var o_san = window.o_san || {};

//earlySearch
o_san.searchHandler = o_san.searchHandler || (function () {
    'use strict';
    var SEARCH_FORM_CLASS = 'js_searchForm',
        isAlreadyInitialized = false,
        searchFieldHeader,

        checkAndGetIfArticleNumber = function (articleNumber) {
            var regexp = /^(\.?\d{6}\w{0,2})$/g, // komischer support von führenden Punkten?
                regexpAcht = /^([1-9]\d{7}\w{2,3})$/g,
                match;
            articleNumber = articleNumber.replace(/\s+/g, '');
            match = regexp.exec(articleNumber);
            if (match) {
                return match[1];
            }
            match = regexpAcht.exec(articleNumber);
            return match ? match[1] : false;
        },

        focusHeaderSearchField = function () {
            if (!!searchFieldHeader) {
                searchFieldHeader.focusSearchField();
            }
        },

        init = function (isJasmineTest) {
            var meta,
                headerForm,
                searchContainer = document.getElementById("searchAndIconBg");


            if ((isJasmineTest || !isAlreadyInitialized) && !!searchContainer) {
                headerForm = searchContainer.getElementsByClassName(SEARCH_FORM_CLASS);
                if (headerForm.length > 0) {
                    searchFieldHeader = o_san.searchForm.init(headerForm[0], function () {
                        o_global.eventLoader.onReady(2, function () {
                            var searchResult = document.getElementById("san_searchResult"),
                                searchResultQr = document.getElementById("san_qr-query"),
                                query = '';
                            if (!!searchResult) {
                                query = searchResult.getAttribute('data-userquery') || '';
                            } else if (!!searchResultQr) {
                                query = searchResultQr.getAttribute('data-userquery') || '';
                            }

                            if (query !== '') {
                                if (searchFieldHeader.isEmpty()) {
                                    searchFieldHeader.setValue(query);
                                    searchFieldHeader.toggleDeleteButtonVisibility();
                                }
                            }

                            if (!!o_san.searchSuggest) {
                                o_san.searchSuggest.init();
                            }
                        });
                    });

                    const searchField = searchFieldHeader.getSearchField();

                    if (searchField) {
                        const _setMetaAttributes = (evt) => {
                            meta = document.querySelector('meta[name="viewport"]');
                            meta.setAttribute('content', 'width=device-width, initial-scale=1' + (evt.type === 'blur' ? '' : ',maximum-scale=1'));
                        };

                        searchField.addEventListener('focus', _setMetaAttributes);
                        searchField.addEventListener('blur', _setMetaAttributes);
                    }
                }
            }
            // Activate the second form on error pages
            o_global.eventLoader.onReady(2, function () {
                var errorSearch = document.getElementsByClassName("san_error__no-results");

                if (errorSearch.length > 0) {
                    o_san.searchForm.init(errorSearch[0].getElementsByClassName(SEARCH_FORM_CLASS)[0]);
                }
            });

        };

    return {
        init: init,
        checkAndGetIfArticleNumber: checkAndGetIfArticleNumber,
        focusHeaderSearchField: focusHeaderSearchField
    };
}());
