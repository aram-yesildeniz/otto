/*jslint white: true */
/*global o_global */
var o_find = window.o_find || {};

//earlySearch
o_find.header = o_find.header || (function () {
    'use strict';
    let isInitialized = false,
        headerSearchbarVisibleClass = "find_header--visibleSearchbar",
        searchbarHideSearchIconClass = "find_header--hideSearchIcon",
        headerSearchActiveClass = "find_header--activeSearch",
        headerReducedClass = "find_header--reduced",
        headerElementClass = "find_header",
        findHeaderElement,

        scrollFunction = function() {
            if (!findHeaderElement.classList.contains(headerSearchActiveClass)) {
                if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                    findHeaderElement.classList.remove(headerSearchbarVisibleClass);
                    findHeaderElement.classList.add(headerReducedClass);
                    findHeaderElement.classList.remove(searchbarHideSearchIconClass);
                } else {
                    findHeaderElement.classList.remove(headerReducedClass);
                }
            }
        },

        init = function () {
            if (!isInitialized) {

                let elements = document.getElementsByClassName(headerElementClass);
                if (elements.length === 1) {
                    findHeaderElement = elements[0];
                    window.addEventListener('scroll', scrollFunction, {
                        passive: true // do not interfere with scrolling as such, we just want to react on it
                    });

                    isInitialized = true;
                }
            }
        };

    return {
        init: init,
    };
}());

o_global.eventLoader.onReady(1, function () {
    'use strict';

    o_find.header.init();
});