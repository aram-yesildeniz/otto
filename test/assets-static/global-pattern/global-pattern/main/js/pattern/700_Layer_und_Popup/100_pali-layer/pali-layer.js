/* globals document, window, history, o_tracking */
var AS = window.AS || {},
    o_global = o_global || {},
    o_util = o_util || {};

o_global.pali = o_global.pali || {};

/**
 * Layer Object.
 *
 * Based on jsModal
 * Copyright (c) 2013 Henry Tang Kai
 */
o_global.pali.layerBuilder = (function() {
    "use strict";

    var defaultSettings = {
        "width": null,                  // String: CSS-Width.
        "widthL": null,                 // String: CSS-Width for L.
        "widthXL": null,                // String: CSS-Width for XL.
        "openCallback": false,          // Function: to be executed after layer has been opened and its content loaded.
        "closeCallback": false,         // Function: to executed after layer has been closed.
        "createTrackingContext": true,  // Boolean: true: Create tracking context.
        "url": null,                    // String: load content from url.
        "content": "",                  // String: Content to be displayed. Cannot be set in combination with url.
        "trackingKey": null,            // String: Fire tracking event when opened.
        "trackingEvent": null,          // String: Fire tracking event when opened.
        "trackingObject": null,         // String: Fire tracking event when opened.
        "layerClass": "p_layer",        // String: Set different class for container.
        "modal": true,                  // Boolean: Make the overlay modal, which means locking the background with a curtain.
        "menuContent": null,            // String: DOM Menu Element for Layer Interaction.
        "lockCurtain": false,           // Boolean: Ignore click on the curtain.
        "hideBackButton": false,        // Boolean: don't show Back button on content switch.
        "headerDisplayMode": "visible", // String(visible|removedOnSmallScreens|removed): Set visibility mode for header and close button.
        "statusCallbacks": null,        // String(json!!) : execute JS code dependent on the Response Status Code
        "altUrl": null                  // String: If present, open the Layer with this Content, and use "url" for native Browsing
    };

    /**
     * Constructor.
     *
     * @param {Object} initialParameters        Layer configuration parameters.
     */
    function Layer(initialParameters) {
        var settings = {},
            _self = this,
            modalContainer = document.createElement("div"),
            modalWrapper = document.createElement("div"),
            modalCurtain = document.createElement("div"),
            modalContent = document.createElement("div"),
            modalHeader = document.createElement("div"),
            modalClose = document.createElement("a"),
            defaultBackButton = "<button class=\"js_PaliLayerBack p_btn100--3rd p_layer__button\"><i>&lt;&nbsp;</i>Zurück</button>",
            isOpen = false,
            contentStack = [],  // Stack of saved content ids.
            settingsStack = []; // Stack of saved settings.

        // Read Settings.
        settings = o_util.core.extend(defaultSettings, initialParameters, true, true);

        // Set layer classes.
        modalCurtain.className = "p_curtain";
        modalContainer.className = settings.layerClass;
        modalWrapper.className = "p_layer__wrapper";
        modalWrapper.setAttribute("id", "p_layer__wrapper_" + contentStack.length);
        modalContent.className = "p_layer__content";
        modalHeader.className = "p_layer__header";
        modalClose.className = "p_layer__close";
        modalClose.innerHTML = "X";
        modalContainer.id = "p_layer";

        modalContainer.classList.add("p_layer--hidden");

        if (settings.headerDisplayMode === "removed") {
            modalContainer.classList.add("p_layer--headerRemoved");
        } else if (settings.headerDisplayMode === "removedOnSmallScreens") {
            modalContainer.classList.add("p_layer--headerRemovedOnSmallScreens");
        }

        /**
         * Get container div.
         *
         * @return {Object} Container div.
         */
        this.getContainerElement = function() {
            return modalContainer;
        };

        /**
         * Get curtain.
         *
         * @return {Object}     Curtain element.
         */
        this.getCurtainElement = function() {
            return modalCurtain;
        };

        /**
         * Set the width of the layer.
         *
         * @param {String} width    CSS-Width to be set.
         */
        this.setWidth = function(width) {
            var maxWidth,
                minBorder = 32;

            // Don't set a width bigger than the window minus minimal padding and not smaller than M.
            maxWidth = Math.max(parseInt(document.documentElement.clientWidth, 10) - 2 * minBorder, 768);

            modalContainer.style.width = width;
            modalContainer.style.maxWidth = maxWidth + "px";
            modalContainer.classList.add("p_layer--forcedWidth");
        };

        /**
         * Set width that matches current breakpoint.
         *
         * @param {String} widthL    CSS-width for breakpoint X.
         * @param {String} widthXL   CSS-width for breakpoint XL.
         * @param {String} width     CSS-width for all breakpoints that have no other width set.
         */
        this.setBreakpointWidth = function(widthL, widthXL, width) {
            switch (o_global.device.breakpoint.getCurrentBreakpoint()) {
                case "l":
                    _self.setWidth(widthL || width);
                    break;
                case "xl":
                    _self.setWidth(widthXL || width);
                    break;
                default:
                    _self.setWidth(width);
            }
        };

        /**
         * Manually execute preload scripts inside of the layer.
         *
         * @param {Object} element      Inside of this element preload script should be executed.
         */
        this.executePreloadScripts = function(element) {
            if (preload_polyfill_invoke) {
                preload_polyfill_invoke(element);
            }
        }

        /**
         * Set content of element.
         *
         * @private
         *
         * @param {String|Object} content       Content to be inserted.
         * @param {Object} element              Element the content should be inserted into (either p_layer__content or p_layer__wrapper).
         */
        this._setElementContent = function(content, element) {
            if (typeof content === "string") {
                element.innerHTML = content;
            } else {
                if (element.classList.contains("p_layer__content") && !content.classList.contains("p_layer__content")) {
                    content.classList.add("p_layer__content");
                }

                /* jscs:disable */
                //noinspection JSCheckFunctionSignatures
                element.parentNode.replaceChild(content, element);
                /* jscs:enable */

                // After replacement of modalContent Container
                if (element === modalContent) {
                    modalContent = content;
                }
            }

            // Update children of wrapper if they have been replaced.
            if (element === modalWrapper) {
                modalContent = modalWrapper.getElementsByClassName("p_layer__content")[0];
            }

            // Execute script tags.
            o_util.hardcore.executeInlineScripts(element);

            // TODO: This cannot be before executeInlineScripts because then the scripts will be executed twice ....
            _self.executePreloadScripts(element);

            _self._parseLegacyDataAttributes();
        };

        /**
         * Set content of p_layer__content div.
         *
         * @param {String|Object} content       Content to be inserted.
         */
        this.setContent = function(content) {
            _self._setElementContent(content, modalContent);
        };

        /**
         * Set content of p_layer__wrapper div.
         *
         * TODO: Evaluate if this function is really needed ... there is no function call in the layer code. Maybe some teams need this???
         *
         * @param {String|Object} content       Content to be inserted into wrapper.
         */
        this.setWrapperContent = function(content) {
            _self._setElementContent(content, modalWrapper);
        };

        /**
         * Reloads the current site.
         *
         * @private
         */
        this._reloadSite = function() {
            window.location.reload(true);
        };

        /**
         * Handle the ajax result.
         *
         * @param {Object} result       Object with the ajax result.
         * @param {Function} [callback]     Callback to execute after content is loaded.
         */
        this._handleAjaxResult = function(result, callback) {
            var defaultCallbacks = {
                    "200": function(response) {
                        _self.setContent(response.responseText);
                        if (typeof callback === "function") {
                            callback(response.responseText, response.status);
                        }
                    },
                    "401": function() {
                        // Reloads the site, when the requested content responses with 401 (Unauthorized).
                        _self._reloadSite();
                    },
                    "default": function() {
                        var errorTemplate =
                            "<div class=\"p_message p_message--error p_layer--error\">" +
                            "<b>Entschuldigung!</b> Aufgrund von technischen Problemen kann der Inhalt leider nicht " +
                            "geladen werden. Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut." +
                            "</div>";

                        _self.setContent(errorTemplate);
                        if (typeof callback === "function") {
                            callback(errorTemplate, result.status);
                        }
                    }
                },
                // Merging default ajax callbacks with given initialParameters in
                statusCallbacks = o_util.core.extend(defaultCallbacks, settings.statusCallbacks, true, false);

            if (!!statusCallbacks[result.status]) {
                statusCallbacks[result.status](result);
            } else {
                statusCallbacks.default();
            }
        };

        /**
         * Sets Content via AJAX.
         *
         * @param {String} url              Url to load.
         * @param {Function} [callback]     Callback to execute after content is loaded.
         */
        this.setContentFromURL = function(url, callback) {
            _self._addLoaderToContent();

            o_util.ajax.get(url, function(ajaxResult) {
                _self._handleAjaxResult(ajaxResult, callback);
            });
        };

        /**
         * Add the p_loader pattern to the layer until the content is loaded successfully.
         *
         * @private
         */
        this._addLoaderToContent = function() {
            var loader;

            loader = document.createElement("div");
            loader.className = "p_loader200";
            loader.innerHTML = "Wird geladen...";

            modalContent.insertBefore(loader, (modalContent.hasChildNodes()) ? modalContent.childNodes[0] : null);
        };

        /**
         * Create Tracking Context.
         */
        this.createTrackingContext = function() {
            // Jump out of the function, if current page is the shopoffice preview.
            if (!!window.AS.toggles && !!window.AS.toggles.isPreview) {
                return;
            }

            if (typeof o_tracking !== "undefined" && !!o_tracking.bct && !!o_tracking.bct.createContext) {
                /* jscs:disable */
                //noinspection JSUnresolvedFunction
                o_tracking.bct.createContext(modalWrapper.id, document.location.pathname + "layer");
                /* jscs:enable */
            }
        };

        /**
         * Close Tracking Context.
         */
        this.closeTrackingContext = function() {
            // Jump out of the function, if current page is the shopoffice preview.
            if (!!window.AS.toggles && !!window.AS.toggles.isPreview) {
                return;
            }

            if (typeof o_tracking !== "undefined" && !!o_tracking.bct && !!o_tracking.bct.closeContext) {
                /* jscs:disable */
                //noinspection JSUnresolvedFunction
                o_tracking.bct.closeContext();
                /* jscs:enable */
            }
        };

        /**
         * Read old data attributes and build elements from them.
         * TODO: Remove once everyone has migrated to new layer and new functionality.
         *
         * @private
         */
        this._parseLegacyDataAttributes = function() {
            var settingDiv = modalContent.querySelectorAll("[data-title], [data-callback], .shoppagesLayer")[0];

            if (settingDiv === undefined) {
                return true;
            }

            // Construct body.
            if (modalContent.getElementsByClassName("p_layer__body").length <= 0) {
                settingDiv.classList.add("p_layer__body");
            }

            // Construct title.
            var title = settingDiv.getAttribute("data-title");

            if (!!title && modalContent.getElementsByClassName("p_layer__headline").length <= 0) {
                var headline = document.createElement("div");

                headline.className = "p_layer__headline";
                headline.innerHTML = title;
                modalContent.insertBefore(headline, settingDiv);
            }

            // Remove duplicated title.
            var duplicatedTitle = settingDiv.getElementsByClassName("js_layerTitle")[0];

            if (!!duplicatedTitle) {
                duplicatedTitle.parentNode.removeChild(duplicatedTitle);
            }

            // Execute callback.
            var callback = settingDiv.getAttribute("data-callback");

            if (!!callback) {
                o_util.core.convertStringToFunction(callback, window)();
            }
        };

        /**
         * Open layer.
         */
        this.open = function() {
            if (!isOpen) {
                // Update URL.
                o_util.history.setScrollRestoration("manual");

                _self._pushHistory();
                _self._hideLayerOnSmallScreens();

                // Set Width.
                if (settings.width !== null) {
                    _self.setWidth(settings.width);
                }

                // Set breakpoint-specific width.
                if (settings.widthL !== null || settings.widthXL !== null) {
                    _self.setBreakpointWidth(settings.widthL, settings.widthXL, settings.width);

                    // Reset width after breakpoint-changes.
                    o_global.device.breakpoint.registerChangeListener(function() {
                        _self.setBreakpointWidth(settings.widthL, settings.widthXL, settings.width);
                    });
                }

                // Wire up events.
                // Curtain is only clickable if layer is modal and curtain is not locked.
                if (!!settings.modal && !settings.lockCurtain) {
                    modalCurtain.addEventListener("click", _self.close);
                    modalHeader.addEventListener("click", _self.close);
                } else {
                    modalClose.addEventListener("click", _self.close);
                }

                modalWrapper.appendChild(modalContent);

                // Load Content.
                if (!!settings.content) {
                    _self.setContent(settings.content);
                } else if (!!settings.url) {
                    _self.setContentFromURL(settings.url, _self._postOpenCallback);
                } else {
                    _self.setContent("");
                    _self._addLoaderToContent();
                }

                // Add elements to DOM.
                if (!!settings.modal) {
                    modalCurtain.classList.add("p_curtain--hidden");

                    document.body.appendChild(modalCurtain);
                }

                _self._setLayerPosition();

                document.body.appendChild(modalContainer);
                isOpen = true;

                if (settings.headerDisplayMode !== "removed") {
                    modalContainer.appendChild(modalHeader);
                    modalHeader.appendChild(modalClose);
                }

                modalContainer.appendChild(modalWrapper);

                // Load Menu.
                if (!!settings.menuContent) {
                    _self.setMenuContent(settings.menuContent);
                }

                // Register this instance centrally.
                o_global.pali.layer.setActiveLayer(_self);

                // One call to opacity attribute is necessary to make the animation work.
                /* jscs:disable */
                /* jshint ignore:start */
                //noinspection BadExpressionStatementJS
                window.getComputedStyle(modalContainer).opacity;
                /* jshint ignore:end */
                /* jscs:enable */

                _self._slideInLayerOnSmallScreens();
                modalContainer.classList.remove("p_layer--hidden");

                if (!!settings.modal) {
                    modalCurtain.classList.remove("p_curtain--hidden");
                }

                // Synchronous case, otherwise this is executed after AJAX call has finished.
                if (!settings.url) {
                    _self._postOpenCallback();
                }

                try {
                    // TODO: Replace me with event based logic.
                    o_global.pali.scrollTopButton.hideButton();
                } catch (e) {
                }

                window.addEventListener("popstate", _self._onPopState);

                // Removing focus from trigger, to avoid firing "click" events when user presses "Enter" or the spacebar
                if (!!document.activeElement) {
                    document.activeElement.blur();
                }
            }
        };

        /**
         * Set layer top position.
         *
         * @private
         */
        this._setLayerPosition = function() {
            var documentScrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop,
                offsetTop = o_global.device.breakpoint.isBreakpointActive(["s", "m"]) ? 0 : 28;

            modalContainer.style.top = (documentScrollTop + offsetTop) + "px";
        };

        /**
         * Hide layer on small screens with transform translateY.
         *
         * @private
         */
        this._hideLayerOnSmallScreens = function() {
            if (o_global.breakpoint.isBreakpointActive(["s", "m"])) {
                o_util.misc.setVendorStyle(modalContainer, "transform", "translateY(" + document.body.offsetHeight + "px)");
            }
        };

        /**
         * Slide in layer on small screens with transform.
         *
         * @private
         */
        this._slideInLayerOnSmallScreens = function() {
            // Remove transform inline style from the layer, which was added in the _hideLayerOnSmallScreens function.
            // Let the layer slide into the viewport due to the transition on the transform property.
            if (o_global.breakpoint.isBreakpointActive(["s", "m"])) {
                o_util.misc.setVendorStyle(modalContainer, "transform", "");
            }
        };

        /**
         * Called after layer content is ready.
         *
         * @private
         */
        this._postOpenCallback = function() {
            // Create Tracking Event.
            if (!!settings.trackingEvent && !!settings.trackingKey) {
                var event = new CustomEvent(settings.trackingEvent, {
                    "detail": {
                        "trackingKey": settings.trackingKey
                    }
                });

                window.dispatchEvent(event);
            }

            // Create Tracking Context.
            if (!!settings.createTrackingContext) {
                _self.createTrackingContext();
            }

            // Execute Callback, if all other asynchronous functions are finished.
            if (!!settings.openCallback) {
                _self.executeCallback();
            }

            // Send Tracking Event to Server
            if (!!settings.trackingObject) {
                try {
                    o_global.eventQBus.emit('tracking.bct.submitEvent', JSON.parse(settings.trackingObject));
                } catch (e) {

                }
            }
        };

        /**
         * Executes defined callback function.
         */
        this.executeCallback = function() {
            settings.openCallback();
        };

        /**
         * Remove modalCurtain from dom.
         *
         * @private
         */
        this._removeLayerAndCurtain = function() {
            // Delete elements from DOM
            try{
                document.body.removeChild(modalContainer);
                if (!!settings.modal) {
                    document.body.removeChild(modalCurtain);
                }
            }
            catch(e){
            }
        };

        /**
         * Close layer.
         *
         * @param {Boolean} preventHistoryClear     No history will be cleared, if it's true.
         */
        this.close = function(preventHistoryClear) {
            // Wait for transition to finish.
            var transitionEvent = o_util.event.whichTransitionEndEvent();

            /**
             * Callback for transitionEvent.
             *
             * @private
             */
            function _closeHandler() {
                modalContainer.removeEventListener(transitionEvent, _closeHandler);
                _self._removeLayerAndCurtain();
            }

            if (isOpen) {
                if (typeof transitionEvent !== "undefined") {
                    modalContainer.addEventListener(transitionEvent, _closeHandler);
                } else {
                    // IE 9.
                    _self._removeLayerAndCurtain();
                }

                _self._hideLayerOnSmallScreens();
                modalContainer.classList.add("p_layer--hidden");
                modalCurtain.classList.add("p_curtain--hidden");

                isOpen = false;

                // De-register this instance centraly.
                o_global.pali.layer.setActiveLayer();

                // Close current tracking context.
                if (!!settings.createTrackingContext) {
                    _self.closeTrackingContext();
                }

                window.removeEventListener("popstate", _self._onPopState);

                // Only ignore to clear the history, if the variable 'preventClearHistory' was set to 'true' explicit.
                if (typeof preventHistoryClear !== "boolean" || !preventHistoryClear) {
                    _self._clearHistory();
                } else {
                    _self._removeInitialLayerHistory();
                }

                // Run Close Callback.
                if (!!settings.closeCallback) {
                    settings.closeCallback();
                }

                // Restore settings from the first layer.
                if (settingsStack.length > 0) {
                    settings = o_util.core.clone(settingsStack[0]);
                }

                // Cleanup stack, because there is no content-switch active anymore.
                contentStack = [];
                settingsStack = [];

                // RESET again to initial settings. use timeout to reset after popstate event
                setTimeout(function() {
                    o_util.history.resetScrollRestoration();
                }, 0);
            }
        };

        /**
         * Creates and displays menu for layer.
         *
         * @param {String} menu     innerHTML for menu.
         */
        this.setMenuContent = function(menu) {
            // Insert menu if none exists
            if (modalWrapper.getElementsByClassName("p_layer__menu").length === 0) {
                var newModalMenu = document.createElement("div");

                newModalMenu.classList.add("p_layer__menu");
                newModalMenu.innerHTML = menu;
                modalWrapper.insertBefore(newModalMenu, modalContent);
            }
        };

        /**
         * Creates an empty Layer-Wrapper for switching between multiple contents.
         *
         * @private
         */
        this._createEmptyWrapper = function() {
            var newWrapper = document.createElement("div");

            newWrapper.classList.add("p_layer__wrapper");
            newWrapper.setAttribute("id", "p_layer__wrapper_" + contentStack.length);
            modalWrapper = newWrapper;
            modalContainer.appendChild(modalWrapper);

            var newModalContent = document.createElement("div");

            newModalContent.classList.add("p_layer__content");
            modalContent = newModalContent;
            modalWrapper.appendChild(modalContent);
        };

        /**
         * Pushes existing content onto stack and inserts new content.
         *
         * @param {Array} initParameters    Layer settings.
         */
        this.switchLayerContent = function(initParameters) {
            // Close PI for currently nested layer.
            if (!!settings.createTrackingContext) {
                _self.closeTrackingContext();
            }

            // Clone settings from previous layer for later use.
            settingsStack.push(o_util.core.clone(settings));
            // Read Settings.
            settings = o_util.core.extend(defaultSettings, initParameters, true, true);

            modalWrapper.classList.add("p_layer__wrapper-toggled");
            modalWrapper.classList.add("hide");
            contentStack.push("p_layer__wrapper_" + contentStack.length);

            // Create new empty LayerWrapper.
            _self._createEmptyWrapper();

            // Add class so that teams can probe for it.
            modalContainer.classList.add("p_layer--switchedContent");

            if (!!settings.content) {
                _self.setContent(settings.content);
            } else if (!!settings.url) {
                _self.setContentFromURL(settings.url, _self._postOpenCallback);
            }

            if (!settings.hideBackButton && !settings.menuContent) {
                _self.setMenuContent(defaultBackButton);
            } else if (!!settings.menuContent) {
                _self.setMenuContent(settings.menuContent);
            }

            // Execute openCallback explicit, when no url is defined.
            if (!settings.url) {
                _self._postOpenCallback();
            }

            _self._pushHistory();
            _self.resetViewport(); // TODO: remove?? seems to have no effect
        };

        /**
         * Wrapper function for the "real" revertLayerContent, which will be called in the historyBack-Function.
         */
        this.revertLayerContent = function() {
            _self._historyBack();
        };

        /**
         * Pops content from stack and reinserts old content.
         *
         * @private
         */
        this._revertLayerContent = function() {
            if(modalWrapper){
                modalContainer.removeChild(modalWrapper);
            }

            modalWrapper = document.getElementById(contentStack.pop());

            if(!modalWrapper){
                return;
            }

            modalContent = modalWrapper.getElementsByClassName("p_layer__content")[0];

            modalWrapper.classList.toggle("hide");
            modalWrapper.classList.toggle("p_layer__wrapper-toggled");

            // Close PI for nested layer.
            if (!!settings.createTrackingContext) {
                _self.closeTrackingContext();
            }

            // Run Close Callback.
            if (!!settings.closeCallback) {
                settings.closeCallback();
            }

            settings = o_util.core.clone(settingsStack.pop());

            // Create Tracking Context for new content stack
            if (!!settings.createTrackingContext) {
                _self.createTrackingContext();
            }

            _self.resetViewport();
        };

        /**
         * Scroll viewport to the current layer position.
         */
        this.resetViewport = function() {
            var offsetTop = o_global.device.breakpoint.isBreakpointActive(["s", "m"]) ? 0 : 28;

            o_util.animation.scrollTo(modalContainer.offsetTop - offsetTop, 500);
        };

        /**
         * Scroll viewport to the current layer position.
         * // TODO remove
         *
         * @private
         *
         * @deprecated use resetViewport()
         */
        this._resetViewport = function() {
            _self.resetViewport();
        };

        /**
         * Detect whether the browser supports the History API.
         *
         * @private
         *
         * @return {Boolean}    true, if the browser supports the History API
         */
        this._hasHistoryAPI = function() {
            if (!history || !history.pushState) {
                return false;
            }

            /* jshint ignore:start */
            // Detect ie10. API says IE10 does support the history API, but it does not work properly...
            if (Function("/*@cc_on return document.documentMode===10@*/")()) {
                return false;
            }
            /* jshint ignore:end */

            // Detect Chrome on iOS. pushState is broken -> LHAS-2093
            if (navigator.userAgent.indexOf("CriOS") !== -1) {
                return false;
            }

            return true;
        };

        /**
         * Changes location.
         *
         * @private
         */
        this._pushHistory = function() {
            if (_self._hasHistoryAPI()) {
                if (!isOpen) {
                    _self._addLayerIdToHistoryState();
                }

                history.pushState({
                    "layerId": contentStack.length
                }, document.title);
            }
        };

        /**
         * Pops layer stack and changes location to popped entry.
         *
         * @private
         */
        this._historyBack = function() {
            if (_self._hasHistoryAPI()) {
                history.back();
            } else {
                _self._revertLayerContent();
            }
        };

        /**
         * Adds an initial layer entry.
         *
         * @private
         */
        this._addLayerIdToHistoryState = function() {
            history.pushState({
                "layerId": -1
            }, document.title);
        };

        /**
         * Removes the initial history entry, that was created on open.
         *
         * @private
         */
        this._removeInitialLayerHistory = function() {
            if (_self._hasHistoryAPI()) {
                history.go(-1);
            }
        };

        /**
         * "Clears" the browser back history of the layer.
         *
         * @private
         */
        this._clearHistory = function() {
            if (_self._hasHistoryAPI()) {
                history.go(-1 * (contentStack.length + 2));
            }
        };

        /**
         * This function will be registered on the "popstate" event to revert the current layer content or closes it,
         * when this event is fired.
         *
         * @private
         *
         * @param {Object} event    Native popstate event object
         */
        this._onPopState = function(event) {
            if (!!event.state && typeof event.state.layerId !== "undefined") {
                if (event.state.layerId >= 0) {
                    _self._revertLayerContent();
                } else {
                    _self.close(true);
                }
            }
        };
    }

    return Layer;
})();

/**
 * Layer Class.
 * Initializing this class automatically links overlays to divs with a certain class.
 */
o_global.pali.layer = (function() {
    "use strict";

    var settingsMap = {
            "url": "href",
            "width": "data-layer-width",
            "widthL": "data-layer-width-l",
            "widthXL": "data-layer-width-xl",
            "createTrackingContext": "data-layer-createtrackingcontext",
            "trackingKey": "data-trackingkey",
            "trackingEvent": "data-trackingevent",
            "trackingObject": "data-trackingobject",
            "layerClass": "data-layer-class",
            "menuContent": "data-layer-menu-content",
            "modal": "data-layer-modal",
            "content": "data-layer-content",
            "lockCurtain": "data-layer-lockcurtain",
            "hideBackButton": "data-layer-hidebackbutton",
            "headerDisplayMode": "data-layer-headerdisplaymode",
            "openCallback": "data-layer-opencallback",
            "closeCallback": "data-layer-closecallback",
            "statusCallbacks": "data-layer-status-callbacks",
            "altUrl": "data-layer-href"
        },
        activeLayer; // Active Layer instance.

    /**
     * Parse the data attributes of the trigger to customize the layer.
     *
     * @private
     *
     * @param {Object} element      Element with data attributes.
     *
     * @return {Array} Settings for new Layer.
     */
    function _parseDataAttributes(element) {
        var settings = [];

        for (var key in settingsMap) {
            if (settingsMap.hasOwnProperty(key)) {
                var attribute = element.getAttribute(settingsMap[key]);

                if (!!attribute) {
                    var parsedAttribute = null;

                    // Change strings to data-types.
                    switch (attribute) {
                        case "false":
                            parsedAttribute = false;
                            break;
                        case "true":
                            parsedAttribute = true;
                            break;
                        case "null":
                            parsedAttribute = null;
                            break;
                        default:
                            parsedAttribute = attribute;
                    }

                    if (key === "statusCallbacks") {
                        try {
                            parsedAttribute = JSON.parse(attribute);
                        } catch (e) {
                            throw new Error("Could not parse data-layer-status-callbacks. Not valid json");
                        }

                        for (var statusCode in parsedAttribute) {
                            if (parsedAttribute.hasOwnProperty(statusCode)) {
                                parsedAttribute[statusCode] = o_util.core.convertStringToFunction(parsedAttribute[statusCode], window);
                            }
                        }
                    } else if (key.indexOf("Callback") > -1) {
                        parsedAttribute = o_util.core.convertStringToFunction(attribute, window);
                    }

                    settings[key] = parsedAttribute;
                }
            }
        }

        return settings;
    }

    /**
     * Initialize the layer.
     *
     * @private
     *
     * @param {Object} event Event object
     */
    function _initLayer(event) {
        var trigger = event.target,
            isValidTrigger = o_util.misc.isValidMouseButton(event, 1);


        if (!trigger.classList.contains("js_openInPaliLayer")) {
            trigger = o_util.dom.getParentByClassName(trigger, "js_openInPaliLayer");
        }

        if (!!trigger && !!isValidTrigger) {
            var attributes = _parseDataAttributes(trigger);

            if (attributes.altUrl) {
                attributes.url = attributes.altUrl;

                // don't open layer if CMD (OSX) or CTRL (Windows) is pressed
                if (isValidTrigger && (event.metaKey || event.ctrlKey)) {
                    return;
                }

            }

            if (o_util.dom.hasClassInParents(trigger, "p_layer")) {
                // Content switch.
                activeLayer.switchLayerContent(attributes);
            } else {
                // New layer.
                var layer = new o_global.pali.layerBuilder(attributes);

                layer.open();
            }

            o_util.event.stop(event);
        }
    }

    /**
     * Register click events for the layer.
     */
    function init() {
        // Execute initialization a while after document ready.
        // Add just a single event listener and delegate all click events to initDropButton.
        o_global.eventLoader.onReady(40, function() {
            o_util.event.delegate(document, "click", ".js_openInPaliLayer", function(event) {
                _initLayer(event);
            });

            o_util.event.delegate(document, "click", ".js_PaliLayerBack", function(event) {
                activeLayer.revertLayerContent();
                o_util.event.stop(event);
            });

            o_util.event.delegate(document, "click", ".js_PaliLayerClose", function(event) {
                activeLayer.close();
                o_util.event.stop(event);
            });
        });
    }

    /**
     * Registers active layer instance.
     *
     * @param {Object} [layer]    Active layer.
     */
    function setActiveLayer(layer) {
        if (!!layer) {
            if (activeLayer !== undefined) {
                activeLayer.close();
            }

            activeLayer = layer;
        } else {
            activeLayer = undefined;
        }
    }

    /**
     * Returns active layer instance.
     *
     * @return {Object} Active Layer instance.
     */
    function getActiveLayer() {
        return activeLayer;
    }

    return {
        "init": init,
        "setActiveLayer": setActiveLayer,
        "getActiveLayer": getActiveLayer
    };
})();

o_global.pali.layer.init();
