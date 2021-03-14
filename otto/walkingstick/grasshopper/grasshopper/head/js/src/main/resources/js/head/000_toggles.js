// For JSLINT
/*jslint white: true */
/* global o_util
 */
var o_san = window.o_san || {};

o_san.toggles = o_san.toggles || (function (doc) {
    'use strict';
    var newProductLink = null,
        newSuggest = null,
        quickFilter = null,

        /**
         * LHO2-6301
         *
         * @returns {boolean}
         */
        isNewProductLinkActive = function () {
            var toggle = newProductLink || !!doc.querySelector(".san_productLinkQP");
            newProductLink = toggle;
            return toggle;
        },

        /**
         * LHO2-6301
         *
         * @returns {boolean}
         */
        isNewSuggest = function () {
            var toggle = newSuggest || !!doc.querySelector(".san_newSuggest");
            newSuggest = toggle;
            return toggle;
        },

        /**
         * FTFIND_859_ENABLE_QUICK_FILTER
         *
         * @returns {boolean}
         */
        isQuickFilterEnabled = function () {
            var toggle = quickFilter || !!doc.querySelector(".san_quickFilter");
            quickFilter = toggle;
            return toggle;
        };

    return {
        isNewProductLinkActive: isNewProductLinkActive,
        isNewSuggest: isNewSuggest,
        isQuickFilterEnabled: isQuickFilterEnabled
    };
}(document));

