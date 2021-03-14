// For JSLINT
/*jslint white: true */
/*global encodeURIComponent, Mustache, global, o_global
 */
var o_find = window.o_find || {};

o_find.searchbar = o_find.searchbar || (function () {
    'use strict';

    let isInitialized = false,
        headerElementClass = "js_find_header",
        headerElement,
        searchbarInputElementClass = "find_searchbar__input",
        searchbarInputElement,
        searchbarAbortElementClass = "js_find_searchbar__abort",
        searchbarAbortElement,
        searchIconClass = "js_find_searchIcon",
        searchIconElement,
        searchInputClass = "js_find_searchbar__input",
        searchInputElement,
        searchCurtainElementClass = "js_find_searchCurtain",
        searchCurtainElement,
        searchbarVisibilityClass = "find_header--visibleSearchbar",
        searchbarActiveClass = "find_header--activeSearch",

        hideSearchField = function () {
            headerElement.classList.remove(searchbarVisibilityClass);
        },

        showSearchField = function () {
            headerElement.classList.add(searchbarVisibilityClass);

            o_global.eventQBus.emit("tracking.bct.submitEvent", {
                "san_Header": "search"
            });

            // TODO: focus input field
            searchInputElement.focus();
        },

        toggleSearchbarVisiblity = function () {
            if (headerElement.classList.contains(searchbarVisibilityClass)) {
                hideSearchField();
            } else {
                showSearchField();
            }
        },

        registerSearchInputHandler = function() {
            if (searchbarInputElement && headerElement) {
                headerElement.classList.add(searchbarActiveClass)
            }
        },

        closeSearchBox = function() {
            if (headerElement) {
                headerElement.classList.remove(searchbarActiveClass)
            }
        },

        init = function () {
            if (!isInitialized) {
                searchbarInputElement = document.getElementsByClassName(searchbarInputElementClass)[0];
                searchIconElement = document.getElementsByClassName(searchIconClass)[0];
                headerElement = document.getElementsByClassName(headerElementClass)[0];
                searchInputElement = document.getElementsByClassName(searchInputClass)[0];
                searchbarAbortElement = document.getElementsByClassName(searchbarAbortElementClass)[0];
                searchCurtainElement = document.getElementsByClassName(searchCurtainElementClass)[0];

                if (searchIconElement && headerElement) {
                    searchIconElement.addEventListener("click", toggleSearchbarVisiblity);
                }
                if (searchInputElement) {
                    searchInputElement.removeAttribute("disabled");
                }

                if (searchbarInputElement) {
                    searchbarInputElement.addEventListener("focus", registerSearchInputHandler);
                }

                if (searchbarAbortElement) {
                    searchbarAbortElement.addEventListener("click", closeSearchBox);
                }

                if (searchCurtainElement) {
                    searchCurtainElement.addEventListener("click", closeSearchBox);
                }

                isInitialized = true;
            }
        };

    return {
        init: init,
        hideSearchField: hideSearchField,
    };
}());


o_global.eventLoader.onReady(1, function () {
    'use strict';

    // Deduplication
    if (o_find.searchbarInitialized) {
        return;
    }

    o_find.searchbarInitialized = true;

    o_find.searchbar.init();
});

o_global.eventQBus.on("ftfind.search.hide", function () {
    o_san.searchbar.hideSearchField();
});
