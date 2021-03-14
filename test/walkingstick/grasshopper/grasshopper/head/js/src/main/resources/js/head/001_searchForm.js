/*jslint white: true */
/*global o_global,o_util*/
var o_san = window.o_san || {};

o_san.searchForm = o_san.searchForm || (function () {
    'use strict';

    /**
     * Used to assign SAN search forms including search field and buttons depending on an
     * parental form
     * @param {HTMLElement} form
     * @param {function} delayedAction
     * @constructor
     */
    var SearchForm = function (form, delayedAction) {
            var THAT = this,
                ALERT_CLASS = 'p_form__input--error',
                HINT_CLASS = 'hint',
                formField = form,
                deleteButtonList = formField.getElementsByClassName('sanSearchDelBtn'),
                searchField = formField.getElementsByClassName('js_searchField')[0],
                submitButton = formField.getElementsByClassName('js_submitButton')[0],
                placeholder = searchField.placeholder || searchField.getAttribute("placeholder"),

                errorString = searchField.getAttribute("data-error"),
                originalSearchTerm = '',

                trackUsage = function (extendByParameters) {
                    var storage,
                        jsonForTracking,
                        words,
                        wordLengths;

                    jsonForTracking = {"wk.san_SearchType": "search"};
                    Object.keys(extendByParameters).forEach(function(key){
                        jsonForTracking[key] = extendByParameters[key];
                    });

                    if (formField.classList.contains("san_track_modified")) {
                        jsonForTracking["wk.san_SearchType"] = "modified";
                    }
                    if (formField.classList.contains("san_track_suggest")) {
                        words = formField.getAttribute("data-suggestWordList");
                        wordLengths = formField.getAttribute("data-suggestWordListCount");
                        originalSearchTerm = searchField.getAttribute("data-suggest-search-term");

                        jsonForTracking["wk.san_SearchType"] = "suggest";
                        jsonForTracking["wk.san_SuggestSearchTerm"] = originalSearchTerm;
                        jsonForTracking.san_SuggestSearchTermLength = originalSearchTerm.length.toString();
                        jsonForTracking["wk.san_SuggestPos"] = formField.getAttribute("data-suggestpos");
                        jsonForTracking.san_SuggestList = words;
                        jsonForTracking.san_SuggestListWordCount = wordLengths;
                    }
                    jsonForTracking["wk.san_ActiveSearch"] = "true";
                    jsonForTracking.san_InitialSearch = "true";
                    jsonForTracking["san_Interaction"] = "initial_search";

                    jsonForTracking.san_PageLoadComplete = "true";


                    if (!!o_san.tracking && o_san.tracking.isInitialized) {
                        o_san.tracking.sendTrackingDataForNextPI(jsonForTracking);
                    } else {
                        storage = new o_global.Storage(function () {
                            return window.sessionStorage;
                        });
                        if (storage.isAvailable) {
                            jsonForTracking.san_PageLoadComplete = "false";
                            try {
                                storage.setItem("san_searchTracking", JSON.stringify(jsonForTracking));
                            } catch(e) {
                                // TODO: implement error logging
                            }
                        }
                    }
                };

            /**
             * @returns {HTMLElement}
             */
            this.getSearchField = function () {
                return searchField;
            };

            /**
             * @returns {String}
             */
            this.getValue = function () {
                return searchField.value;
            };

            /**
             * @param {string} val
             */
            this.setValue = function (val) {
                searchField.value = val;
            };

            /**
             * @returns {boolean}
             */
            this.isOnDefault = function () {
                return (this.getValue() === errorString || this.getValue() === placeholder);
            };

            /**
             * @returns {boolean}
             */
            this.isEmpty = function () {
                return (this.getValue().length < 1 || this.isOnDefault());
            };

            this.hideDeleteButton = function () {
                searchField.classList.remove("sanDelShow");
            };

            this.showDeleteButton = function () {
                searchField.classList.add("sanDelShow");
            };

            this.focusSearchField = function () {
                searchField.focus();
            };

            this.resetHandler = function () {
                this.hideDeleteButton();
                this.focusSearchField();
            };

            this.toggleDeleteButtonVisibility = function () {
                if (this.isEmpty()) {
                    this.hideDeleteButton();
                } else {
                    this.showDeleteButton();
                }
            };

            /**
             * @returns {boolean}
             */
            this.checkFormInput = function () {
                var result = true;
                if (this.isEmpty()) {
                    searchField.value = errorString;
                    searchField.classList.remove(HINT_CLASS);
                    searchField.classList.add(ALERT_CLASS);
                    submitButton.focus();
                    result = false;
                }

                return result;
            };

            this.clearFormField = function () {
                searchField.classList.remove(ALERT_CLASS);
                if (this.isOnDefault()) {
                    this.setValue("");
                }
            };

            this.fillDefaultText = function () {
                if (this.getValue() === "") {
                    this.setValue(placeholder);
                    searchField.classList.add(HINT_CLASS);
                } else {
                    searchField.classList.remove(HINT_CLASS);
                }
            };

            this.enableSearch = function () {
                searchField.removeAttribute('disabled');
                submitButton.removeAttribute('disabled');
            };

            this.submitSearch = function () {
                var searchFieldValue = searchField.value.trim(),
                    target = formField.getAttribute("data-target"),
                    action,
                    articleNumberSearchUrl,
                    articleNumber,
                    extendByParameters = {};

                if (this.checkFormInput(searchFieldValue)) {

                    if (target) {
                        action = target;
                    } else {
                        action = formField.getAttribute("action") + "/" + encodeURIComponent(o_san.util.string.escapeSpecials(searchFieldValue)) + "/";
                        articleNumberSearchUrl = formField.getAttribute("data-article-number-search");
                        articleNumber = o_san.searchHandler.checkAndGetIfArticleNumber(searchFieldValue);

                        if (articleNumber) {
                            action = articleNumberSearchUrl + "?articlenumber=" + articleNumber;
                            extendByParameters["wk.san_Fallback"] = "ID";

                            extendByParameters["wk.san_CountHits"] = 1;
                            extendByParameters["wk.san_SearchTerm"] = articleNumber;
                            extendByParameters["wk.san_SearchWordCount"] = 1;
                        }
                    }

                    trackUsage(extendByParameters);

                    o_san.util.global.setLocation(action);
                }
            };

            if (!!deleteButtonList.length > 0) {
                this.toggleDeleteButtonVisibility();
                searchField.addEventListener("keyup", o_util.core.bind(THAT, this.toggleDeleteButtonVisibility));
                formField.addEventListener("reset", o_util.core.bind(THAT, this.resetHandler));
            }

            formField.addEventListener("submit", function (e) {
                e.preventDefault();
                THAT.submitSearch();
            });

            searchField.addEventListener("focus", function () {
                THAT.clearFormField();
                searchField.classList.remove(HINT_CLASS);
                searchField.parentNode.parentNode.classList.add("focus");
            });

            searchField.addEventListener("blur", function () {
                THAT.fillDefaultText();

                searchField.parentNode.parentNode.classList.remove("focus");

                if (!!o_san.searchSuggest) {
                    o_san.searchSuggest.notifyOfSearchFieldBlurEvent();
                }
            });

            if (document.activeElement && document.activeElement === searchField) {
                this.clearFormField();
                searchField.classList.remove(HINT_CLASS);
            }

            // Elements not existing on init so they have to be later
            if (typeof delayedAction === 'function') {
                delayedAction();
            }

            this.enableSearch();
        },

        /**
         * @param {HTMLElement} form
         * @param {function} delayedActions
         * @returns {SearchForm}
         */
        init = function (form, delayedActions) {
            return new SearchForm(form, delayedActions);
        };


    return {
        init: init
    };
}());
