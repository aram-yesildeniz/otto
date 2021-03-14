// For JSLINT
/*jslint white: true */
/*global encodeURIComponent, Mustache, o_global, o_util, Promise
 */
var o_san = window.o_san || {};

o_san.searchSuggest = o_san.searchSuggest || (function () {
    'use strict';

    var OLD_TEMPLATE_NAME = "suggestLayer",
        TEMPLATE_NAME = "suggestionLayer",

        LAYER_CLASS_SELECTOR = ".san_suggestLayer",
        ARROW_CLASS_SELECTOR = ".san_suggestLayer__arrow",

        SEARCH_FORM_CLASS_SELECTOR = ".js_searchForm",
        SEARCH_FIELD_CLASS_SELECTOR = ".js_searchField",
        SUGGEST_TERM_SELECTOR = ".js_suggest",

        TRACK_MODIFIED_CLASS = "san_track_modified",
        TRACK_SUGGEST_CLASS = "san_track_suggest",
        SEARCH_TERM_CLASS = "js_searchTerm",

        DATA_POS = "data-suggestpos",
        DATA_TERM = "data-term",
        DATA_TARGET = "data-target",
        DATA_SUGGEST_URL = "data-suggestserveruri",
        DATA_SUGGEST_SCOPE = "data-suggestscope",

        ENTER_KEY = 13,
        ARROW_KEY_UP = 38,
        ARROW_KEY_DOWN = 40,

        searchForm,
        searchField,
        suggestLayer,
        oldSearchTerm,
        renderCache,
        suggestCache = {},
        hideLayerOnSearchFieldBlurEventTimeoutId,

        /**
         * Used to prevent suggest from hiding at wrong action
         */
        clearTimeoutForHideLayerOnSearchFieldBlurEvent = function () {
            clearTimeout(hideLayerOnSearchFieldBlurEventTimeoutId);
        },

        /**
         * Used to check if suggest spell check shall be tracked.
         *
         * @param searchValue
         * @param suggestValue
         *
         * @returns {boolean}
         */
        suggestContainsSearchTerm = function (searchValue, suggestValue) {
            return suggestValue.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
        },

        /**
         * Hide and Reset
         */
        hideLayer = function () {
            document.body.removeEventListener("click", hideLayer);
            suggestLayer.style.display = "none";
            suggestLayer.innerHTML = "";
            suggestCache = {};
            renderCache.clear();
            oldSearchTerm = undefined;
        },

        /**
         * Used by jasmine tests
         */
        reset = function () {
            searchField.value = "";
            hideLayer();

            searchForm = null;
            searchField = null;
            suggestLayer = null;
            oldSearchTerm = "";
            suggestCache = {};
            renderCache.clear();

            clearTimeoutForHideLayerOnSearchFieldBlurEvent();
            hideLayerOnSearchFieldBlurEventTimeoutId = null;
        },

        notifyOfSearchFieldBlurEvent = function () {
            // wait for click on search term or arrow
            hideLayerOnSearchFieldBlurEventTimeoutId = setTimeout(hideLayer, 500);
        },

        showLayer = function () {
            document.body.addEventListener("click", hideLayer);
            suggestLayer.style.display = "block";
        },

        writeTrackingSuggestions = function () {
            var suggestions = [].slice.call(
                document.getElementsByClassName("js_suggest")
            ).map(function (st) {
                return st.innerText.trim();
            }),
                words,
                wordLengths;

            words = suggestions.join("|");

            wordLengths = suggestions.map(function (w) {
                return w.split(" ").length;
            }).join("|");

            searchForm.setAttribute("data-suggestWordList", words);
            searchForm.setAttribute("data-suggestWordListCount", wordLengths);

        },

        updateSuggestionLayer = function (suggestions) {
            this.innerHTML = suggestions;
            return this;
        },

        /**
         * Removes the entry matching the current search term and enriches the suggests data with further content
         *
         * @param {JSON} suggestions
         * @param {String} searchValue value compared with excludeTerm
         * @param {String} excludeTerm in general the current search term to exclude it from list
         * @param {Number} nrContentSuggestions the number of content suggestions
         * @returns {Array}
         */
        computeSuggestions = function (suggestions, searchValue, excludeTerm, nrContentSuggestions) {
            var i, n,
                item,
                highlight = new RegExp(searchValue, 'i'),
                highlightedTerm = '<span class="match">$&</span>',
                amount = 0,
                result = [];

            for (i = 0, n = suggestions.length - nrContentSuggestions; i < n; i++) {
                item = suggestions[i];
                if (item.searchterm !== excludeTerm) {
                    item.formattedSearchTerm = item.searchterm.replace(highlight, highlightedTerm);
                    item.suggestPos = ++amount;

                    result.push(item);
                }
            }

            return result;
        },

        computeContentSuggestions = function (contentSuggestions, searchValue, nrContentSuggestions) {
            var i, n,
                item,
                highlight = new RegExp(searchValue, 'i'),
                highlightedTerm = '<span class="match">$&</span>',
                result = [];

            for (i = 0, n = nrContentSuggestions; i < n; i++) {
                item = contentSuggestions[i];
                item.searchterm = searchValue;
                item.formattedDisplay = item.redirectTerm.replace(highlight, highlightedTerm);
                item.suggestPos = i + 1;
                result.push(item);
            }

            return result;
        },

        /**
         * Sends tracking data
         *
         * @param {JSON} json encapsulating the data to track
         */
        sendTrackingData = function (json) {
            if (o_san.tracking) {
                o_san.tracking.sendTrackingDataForNextPI(json);
            }
        },

        /**
         * Needed for submit tracking within searchfield,js if term was taken by using the arrow
         */
        markFormForTracking = function (marker) {
            searchForm.classList.add(marker);
        },

        /**
         * Precautionary used by every action excepting a click on an arrow
         */
        unmarkFormForTracking = function (marker) {
            searchForm.classList.remove(marker);
        },

        /**
         * Used when clicking on a suggest to avoid sending get parameters
         */
        submitForm = function () {
            var searchFieldValue = o_san.util.string.escapeSpecials(searchField.value),
                action = searchForm.getAttribute("action") + "/" + encodeURIComponent(searchFieldValue) + "/";

            o_san.util.global.setLocation(action);
        },

        /**
         * Update suggest position as global information
         *
         * @param {DomElement} searchField
         * @param {Integer} suggestPos
         */
        setSuggest = function (suggestPos, redirectTarget) {
            searchForm.setAttribute(DATA_POS, suggestPos);
            if (redirectTarget) {
                searchForm.setAttribute(DATA_TARGET, redirectTarget);
            } else {
                searchForm.removeAttribute(DATA_TARGET);
            }
        },

        /**
         * Update text within search field and send spell check tracking
         *
         * @param {String} searchTerm
         */
        replaceSearchTerm = function (searchTerm) {
            if (searchTerm !== "") {
                searchField.value = searchTerm;
            }
        },

        /**
         * Used for updating on text entries
         * @param {event} evt
         */
        clickSearchTermAction = function (evt) {
            var originalSearchTerm,
                target = (!!this.querySelector ? this : evt.srcElement.offsetParent),
                term = target.querySelector("." + SEARCH_TERM_CLASS),
                words,
                wordLengths;

            // cancel hide layer because blur event caused by click on search term
            clearTimeoutForHideLayerOnSearchFieldBlurEvent();

            o_util.event.stop(evt);

            setSuggest(term.getAttribute(DATA_POS));
            originalSearchTerm = searchField.getAttribute("data-suggest-search-term");
            replaceSearchTerm(term.getAttribute(DATA_TERM));
            words = searchForm.getAttribute("data-suggestWordList");
            wordLengths = searchForm.getAttribute("data-suggestWordListCount");


            //Add tracking label here!
            sendTrackingData({
                "wk.san_SearchType": "suggest",
                "wk.san_ActiveSearch": "true",
                "wk.san_SuggestPos": term.getAttribute(DATA_POS),
                "wk.san_SuggestSearchTerm": originalSearchTerm,
                "san_InitialSearch": "true",
                "san_Interaction": "initial_search",
                "san_SuggestSearchTermLength": originalSearchTerm.length.toString(),
                "san_SuggestListWordCount": wordLengths,
                "san_SuggestList": words
            });

            unmarkFormForTracking(TRACK_MODIFIED_CLASS);

            submitForm();
        },

        /**
         * Used for updating the search field on arrows
         * @param {event} evt
         */
        clickArrowAction = function (evt) {
            var target = (!!this.parentNode ? this.parentNode : evt.srcElement.offsetParent),   // different structure in IE8
                term = target.querySelector("." + SEARCH_TERM_CLASS),
                searchTerm = term.getAttribute(DATA_TERM),
                position = term.getAttribute(DATA_POS);

            // cancel hide layer because blur event caused by click on arrow
            clearTimeoutForHideLayerOnSearchFieldBlurEvent();

            o_util.event.stop(evt);

            setSuggest(position);
            replaceSearchTerm(term.getAttribute(DATA_TERM) + " ");

            o_san.tracking.sendEventToTracking({
                "san_SuggestAdoptTerm": searchTerm,
                "san_SuggestAdoptPosition": position
            });

            unmarkFormForTracking(TRACK_SUGGEST_CLASS);
            markFormForTracking(TRACK_MODIFIED_CLASS);

            searchField.focus();
        },

        extractSuggestionsOld = function (data) {
            var suggestions = data.suggestions || [],
                contentSuggestions = data.contentSuggestions || [],
                searchTerm = data.searchTerm,
                nrContentSuggestions = Math.min(2, contentSuggestions.length);

            return {
                template: data.template,
                suggestions: computeSuggestions(suggestions, searchTerm, oldSearchTerm, nrContentSuggestions),
                contentSuggestions: computeContentSuggestions(contentSuggestions, searchTerm, nrContentSuggestions)
            };
        },

        renderSuggestionsOld = function (data) {
            if (data.suggestions.length || data.contentSuggestions.length) {
                // could also provide data.renderFn = Mustache.render.bind(Mustache, template)
                // and do data.renderFn(data)
                // however Function.prototype.bind not supported by IE8
                // and asset's "polyfill" does not support partial evaluation
                suggestLayer.innerHTML = Mustache.render(data.template, data);
            } else {
                return Promise.reject(new Error("No suggestions to show"));
            }
        },

        /**
         * Extracts the suggestions for the given indexName.
         *
         * @param {Object} suggestData fredhopper suggest response data
         * @param {String} indexName the index name
         * @returns {Array} the suggestions
         */
        getSuggestions = function (suggestData, indexName) {
            var i, n;
            for (i = 0, n = suggestData.length; i < n; ++i) {
                if (suggestData[i].indexName === indexName) {
                    return suggestData[i].suggestions;
                }
            }
            return [];
        },

        param = function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(this[key]);
        },

        encode = function (url, json) {
            return url + '?' + Object.keys(json).map(o_util.core.bind(json, param)).join('&');
        },

        createSuggestPromise = function (searchTerm) {
            return o_util.ajax.getJSON(encode(suggestLayer.getAttribute(DATA_SUGGEST_URL), {
                scope: suggestLayer.getAttribute(DATA_SUGGEST_SCOPE),
                search: searchTerm
            })).then(function (xhr) {
                return xhr.status === 200 ?
                    xhr.responseJSON :
                    Promise.reject(new Error("received status code ", xhr.status));
            });
        },

        retrieveSuggest = function (searchTerm) {
            var suggestPromise = suggestCache[searchTerm] ?
                    Promise.resolve(suggestCache[searchTerm]) :
                    createSuggestPromise(searchTerm).then(function (suggestData) {
                        suggestCache[searchTerm] = suggestData;
                        return suggestData;
                    }),
                templatePromise = o_san.templates.get(OLD_TEMPLATE_NAME);

            return Promise.all([suggestPromise, templatePromise]).then(function (results) {
                var suggestData = results[0].suggestionGroups;
                return {
                    suggestions: getSuggestions(suggestData, "1keywords"),
                    contentSuggestions: getSuggestions(suggestData, "2redirects"),
                    template: results[1],
                    searchTerm: searchTerm
                };
            });
        },

        extractSuggestions = function (json) {
            var keywords = json.keywords;
            return keywords.length && {
                    keywords: keywords,
                    suggestPos: o_san.util.core.counter()
                };
        },

        setOldSearchTerm = function (string) {
            oldSearchTerm = string;
        },

        suggestionResponseHandler = function (xhr) {
            return xhr.status === 200 ?
                extractSuggestions(xhr.responseJSON) || Promise.reject(new Error("No suggestions to show")) :
                Promise.reject(new Error("received status code ", xhr.status));
        },

        fetchSuggestions = function (searchTerm) {
            return o_util.ajax.getJSON(encode(suggestLayer.getAttribute(DATA_SUGGEST_URL), {
                q: searchTerm
            }));
        },

        /**
         * Renders the suggestions with the given template.
         *
         * @param {Array} results the input data
         * @return {Promise}
         */
        renderSuggestions = function (results) {
            return Mustache.render(results[1], results[0]);
        },

        /**
         * Promises rendered suggestion layer for the given search term.
         *
         * @param {String} searchTerm the search term
         * @return {Promise} rendered suggestion layer
         */
        retrieveSuggestions = function (searchTerm) {
            return Promise.all([
                fetchSuggestions(searchTerm)
                    .then(suggestionResponseHandler),
                o_san.templates.get(TEMPLATE_NAME)
            ]).then(renderSuggestions);
        },

        /**
         * Find and show suggestions for given searchTerm. Checks cache before performing an ajax request.
         *
         * @param {String} searchTerm
         */
        suggest = function (searchTerm) {
            var suggestions = o_san.toggles.isNewSuggest()
                ? renderCache.get(searchTerm)
                    .then(o_util.core.bind(suggestLayer, updateSuggestionLayer))
                : retrieveSuggest(searchTerm)
                    .then(extractSuggestionsOld)
                    .then(renderSuggestionsOld);

            setSuggest(-1);
            suggestions
                .then(showLayer)
                .then(writeTrackingSuggestions)
                .then(undefined, hideLayer); // equivalent to catch(hidelayer) - looking at you jslint
        },

        updateSearchField = function (activeElement) {
            var termElement = activeElement.querySelector("." + SEARCH_TERM_CLASS),
                redirectTarget = termElement.getAttribute(DATA_TARGET),
                term = termElement ? termElement.getAttribute(DATA_TERM) : activeElement.getAttribute(DATA_TERM),
                isContentSuggest = !!redirectTarget;
            if (!!termElement) {
                setSuggest(termElement.getAttribute(DATA_POS), isContentSuggest ? redirectTarget : null);
            }
            replaceSearchTerm(term);
            markFormForTracking(TRACK_SUGGEST_CLASS);
        },

        updateActiveElement = function (previous, next) {
            if (previous) {
                previous.classList.remove("san_suggestLayer__entry--selected");
            }
            if (next) {
                next.classList.add("san_suggestLayer__entry--selected");
                updateSearchField(next);
            }
        },

        getNextActiveElement = function (key, current) {
            switch (key) {
                case ARROW_KEY_DOWN:
                    return current.nextElementSibling;
                case ARROW_KEY_UP:
                    return current.previousElementSibling;
                default:
                    return null;
            }
        },

        getInitiallyActiveElement = function (key) {
            var entries = suggestLayer.querySelectorAll("li.san_suggestLayer__entry");
            switch (key) {
                case ARROW_KEY_DOWN: //Down
                    return entries[0];
                case ARROW_KEY_UP: //Up
                    return entries[entries.length - 1];
                default:
                    return null;
            }
        },

        /**
         * Retrieve key depending on browser type and call the associated action.
         *
         * Hint: In the past key 229 (unused code) was skipped, but due to errors the skip was
         * removed and replaced by searchField.value !== "". Now the suggest will be opened correctly.
         *
         * @param {Event} evt
         */
        handleKeyAction = function (evt) {
            var searchTerm,
                activeElement,
                key = (!!evt.which ? evt.which : evt.keyCode);

            if (key === ARROW_KEY_UP || key === ARROW_KEY_DOWN) {
                evt.preventDefault();
                activeElement = suggestLayer.querySelector(".san_suggestLayer__entry--selected");
                updateActiveElement(activeElement,
                    activeElement ? getNextActiveElement(key, activeElement) : getInitiallyActiveElement(key));
            } else {
                searchTerm = o_san.util.string.trimLeft(searchField.value);
                searchField.setAttribute("data-suggest-search-term", searchTerm);

                // Do not re-suggest on empty terms or form submits (enter)
                if (searchTerm !== "" && key !== ENTER_KEY) {
                    if (oldSearchTerm !== searchTerm) {
                        suggest(searchTerm);
                    }
                    oldSearchTerm = searchTerm;
                    unmarkFormForTracking(TRACK_SUGGEST_CLASS);
                } else {
                    hideLayer();
                }
            }
        },


        /**
         * Updates the suggest layer if the search field obtains focus. Needed after click on arrow.
         *
         * @param {Event} evt
         */
        focusSearchFieldAction = function (evt) {
            var searchTerm = o_san.util.string.trimLeft(o_util.event.getTarget(evt).value);
            if (searchTerm !== "" && suggestLayer.innerHTML !== "") {
                suggest(searchTerm);
            }
            clearTimeoutForHideLayerOnSearchFieldBlurEvent();
        },

        init = function () {
            var parentWrapper = document.querySelector("#searchAndIconWrp");

            renderCache = new o_san.cache.Cache(retrieveSuggestions);
            if (!searchForm) {
                searchForm = parentWrapper.querySelector(SEARCH_FORM_CLASS_SELECTOR);
                searchField = parentWrapper.querySelector(SEARCH_FIELD_CLASS_SELECTOR);
                suggestLayer = parentWrapper.querySelector(LAYER_CLASS_SELECTOR);

                o_util.event.delegate(LAYER_CLASS_SELECTOR, "click", SUGGEST_TERM_SELECTOR, clickSearchTermAction);
                o_util.event.delegate(LAYER_CLASS_SELECTOR, "click", ARROW_CLASS_SELECTOR, clickArrowAction);

                searchField.addEventListener("keyup", handleKeyAction);
                searchField.addEventListener("focus", focusSearchFieldAction);
            }
        };

    return {
        init: init,
        reset: reset,
        notifyOfSearchFieldBlurEvent: notifyOfSearchFieldBlurEvent,
        // jasmineTest only
        setOldSearchTerm: setOldSearchTerm
    };
}());
