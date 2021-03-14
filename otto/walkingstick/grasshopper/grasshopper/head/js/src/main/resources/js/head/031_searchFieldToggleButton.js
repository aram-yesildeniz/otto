// For JSLINT
/*jslint white: true */
/*global encodeURIComponent, Mustache, global, o_global
 */
var o_san = window.o_san || {};

o_san.searchFieldToggleButton = o_san.searchFieldToggleButton || (function () {
    'use strict';

    var SEARCHFIELD_WRAPPER_ID = 'sanHeadWrp',
        BUTTON_ID = 'searchGlassWrp',
        BUTTON_ACTIVE_CLASS = 'searchVisible',
        toggleButton,
        searchFieldWrapper,
        isInitialized = false,
        isActive = false,

        hideSearchField = function () {
            searchFieldWrapper.classList.remove(BUTTON_ACTIVE_CLASS);
        },

        showSearchField = function () {
            searchFieldWrapper.classList.add(BUTTON_ACTIVE_CLASS);
            o_san.tracking.sendEventToTracking({san_Header: 'search'});
            o_san.searchHandler.focusHeaderSearchField();
        },

        toggleSearchField = function () {
            if (searchFieldWrapper.classList.contains(BUTTON_ACTIVE_CLASS)) {
                hideSearchField();
            } else {
                showSearchField();
            }
        },

        checkActivationForBreakpoint = function (breakpoint) {
            if (breakpoint === "s" || breakpoint === "m") {
                if (!isActive) {
                    toggleButton.addEventListener('click', toggleSearchField);
                    isActive = true;
                }
            } else {
                toggleButton.removeEventListener('click', toggleSearchField);
                isActive = false;
            }
        },

        init = function () {
            toggleButton = document.getElementById(BUTTON_ID);

            if (!isInitialized && toggleButton) {
                searchFieldWrapper = document.getElementById(SEARCHFIELD_WRAPPER_ID);

                checkActivationForBreakpoint(o_global.breakpoint.getCurrentBreakpoint());
                o_global.breakpoint.registerChangeListener(checkActivationForBreakpoint);
            }

            isInitialized = true;
        };

    return {
        init: init,
        hideSearchField: hideSearchField,
    };
}());


o_global.eventLoader.onReady(1, function () {
    'use strict';

    // Deduplication
    if (window.sanSearchFieldToggleButtonInitialized) {
        return;
    }

    window.sanSearchFieldToggleButtonInitialized = true;

    o_san.searchFieldToggleButton.init();
});

o_global.eventQBus.on("ftfind.search.hide", function () {
    o_san.searchFieldToggleButton.hideSearchField();
});
