var o_global = o_global || {},
    o_util = o_util || {};

o_global.pali = o_global.pali || {};

/**
 * A DropButton instance will be created, when a dropbutton is clicked for the first time.
 *
 * @constructor
 *
 * @param {Object} trigger Trigger button.
 */
o_global.pali.DropButton = function(trigger) {
    "use strict";

    var _self = this;

    // Prevent silent failure by omitting "new" keyword.
    if (!(this instanceof o_global.pali.DropButton)) {
        return new o_global.pali.DropButton(trigger);
    }

    this.id = null;
    this.trigger = trigger;
    this.container = trigger.parentNode;
    this.content = document.createElement("div");
    this.loader = document.createElement("div");
    this.loader.classList.add("p_loader100");
    this.loader.style.margin = "0 auto";
    this.isOpen = false;
    this.orientation = this.trigger.getAttribute("data-trigger-pos");
    this.openCallback = this.trigger.getAttribute("data-open-callback");
    this.closeCallback = this.trigger.getAttribute("data-close-callback");
    this.loadContent = undefined;
    this.hasStaticContent = false;

    // Convert open and close callback strings to actually executable functions.
    if (!!this.openCallback) {
        this.openCallback = o_util.core.convertStringToFunction(this.openCallback, window);
    }

    if (!!this.closeCallback) {
        this.closeCallback = o_util.core.convertStringToFunction(this.closeCallback, window);
    }

    // Change orientation for drop button content.
    if (this.orientation === "left") {
        this.content.classList.add("p_dropBtn__content--left");
    } else {
        this.content.classList.remove("p_dropBtn__content--left");
    }

    /**
     * Calculate the content position.
     * Calculation is dynamically if there is not enough overlap-space to the determined side,
     * default: aligned to the right = no-leftAlignment = content is right-aligned and overlaps to the left
     *
     * @private
     */
    function _calculatePosition() {
        var triggerRect = _self.trigger.getBoundingClientRect(),
            contentRect = _self.content.getBoundingClientRect(),
            leftSpace = triggerRect.left,
            rightSpace = o_global.device.screen.getWidth() - triggerRect.right,
            overlapSpace = contentRect.width - triggerRect.width,
            hasLeftAlignment = _self.content.classList.contains("p_dropBtn__content--left");

        // If neither left nor right has enough space to show content, take the one with more space
        if (leftSpace < overlapSpace && rightSpace < overlapSpace) {
            if (leftSpace > rightSpace) {
                if (!!hasLeftAlignment) {
                    _self.content.classList.remove("p_dropBtn__content--left");
                }
            } else if (leftSpace < rightSpace) {
                if (!hasLeftAlignment) {
                    _self.content.classList.add("p_dropBtn__content--left");
                }
            }
        } else {
            // Default: check if the determined side has enough overlapping space, otherwise change alignment
            if (!hasLeftAlignment && leftSpace < overlapSpace) {
                _self.content.classList.add("p_dropBtn__content--left");
            } else if (hasLeftAlignment && rightSpace < overlapSpace) {
                _self.content.classList.remove("p_dropBtn__content--left");
            }
        }
    }

    /**
     * Finish opening the content.
     * Thereby the internal varible isOpen will be set to true and the openCallback will be fired if available.
     *
     * @private
     */
    function _finishLoadingProcess() {
        _self.isOpen = true;

        if (!!_self.openCallback) {
            _self.openCallback();
        }

        _calculatePosition();
    }

    /**
     * Retrieve static content element and append it to the content container of the specific DropButton instance.
     *
     * @private
     *
     * @param {String} id   The id of the dropbutton.
     */
    function _loadStaticContent(id) {
        var contentElement = document.getElementById(id);

        // If content container is empty get static content element an append it.
        // Otherwise just show the content container.
        if (!_self.content.hasChildNodes()) {
            contentElement.classList.remove("p_dropBtn__content--hidden");

            // Remove inline-style, e.g. display:none.
            contentElement.removeAttribute("style");

            // Append contentElement to content container.
            _self.content.appendChild(contentElement);

            // Remember that the drop button content is static.
            _self.hasStaticContent = true;
        } else {
            _self.content.classList.remove("p_dropBtn__content--hidden");
        }

        _finishLoadingProcess();
    }

    /**
     * Get remote content and inject it to content container.
     *
     * @private
     *
     * @param {String} url  The url from which the content will be loaded.
     */
    function _loadContentFromUrl(url) {
        // Removes all childs from the content.
        // removeChild() is much faster than using innerHTML => http://jsperf.com/innerhtml-vs-removechild
        while (_self.content.firstChild) {
            _self.content.removeChild(_self.content.firstChild);
        }

        _self.content.appendChild(_self.loader);

        o_util.ajax.get(url, function(ajaxResult) {
            if (ajaxResult.status !== 200) {
                _self.container.classList.add("p_dropBtn--error");
            }

            _self.content.innerHTML = ajaxResult.responseText;
            _finishLoadingProcess();
        });
    }

    /**
     * Load drop button content either locally or remote.
     *
     * @private
     */
    function _loadContent() {
        var contentId = _self.trigger.getAttribute("data-content-id"),
            dataUrl = _self.trigger.getAttribute("data-url");

        _self.container.classList.add("p_dropBtn--open");

        // Append the content to the container.
        _self.container.appendChild(_self.content);

        if (!!dataUrl) {
            _loadContentFromUrl(dataUrl);
        } else if (!!contentId) {
            _loadStaticContent(contentId);
        }
    }

    this.loadContent = _loadContent;

    this.content.classList.add("p_dropBtn__content");
};

/**
 * Open a drop button an load the respective content.
 * If an openCallback was provided execute it afterwards.
 */
o_global.pali.DropButton.prototype.open = function() {
    "use strict";

    // Internet Explorer (all versions) cannot handle disabled="" attribute automatically...
    if (!this.trigger.disabled) {
        this.loadContent();
    }
};

/**
 * Close currently opened DropButton.
 */
o_global.pali.DropButton.prototype.close = function() {
    "use strict";

    if (!!this.isOpen) {
        this.container.classList.remove("p_dropBtn--open", "p_dropBtn--error");
        if (!this.hasStaticContent) {
            this.container.removeChild(this.content);
        } else {
            this.content.classList.add("p_dropBtn__content--hidden");
        }

        this.isOpen = false;
        if (!!this.closeCallback) {
            this.closeCallback();
        }
    }
};

/**
 * Toggle open-/close-state.
 */
o_global.pali.DropButton.prototype.toggle = function() {
    "use strict";

    if (!!this.isOpen) {
        this.close();
    } else {
        this.open();
    }
};

/**
 * DropButtonHandler takes care of creating DropButton instances on demand and organizing click events.
 *
 * @constructor
 *
 * @return {o_global.pali.DropButtonHandler}    The instance of DropButtonHandler
 */
o_global.pali.DropButtonHandler = function() {
    "use strict";

    var _self = this;

    // Prevent silent failure by omitting "new" keyword.
    if (!(this instanceof o_global.pali.DropButtonHandler)) {
        return new o_global.pali.DropButtonHandler();
    }

    this.dropButtonList = {};
    this.dropButtonCount = 0;

    /**
     * Run initialization routine for DropButton on first click.
     *
     * @private
     *
     * @param {Object} event    An event object.
     */
    function _initDropButton(event) {
        var trigger = event.target,
            isValidTrigger = o_util.misc.isValidMouseButton(event, 1),
            dropButton,
            dropButtonId;

        // If event trigger is extracted and was clicked with left mouse button...
        if (!!trigger && !!isValidTrigger) {
            // Create new instance of DropButton.
            dropButton = new o_global.pali.DropButton(trigger);

            // Generate new drop button id.
            dropButtonId = "dropBtn-" + (_self.dropButtonCount);

            // Set drop button id to container element.
            dropButton.container.setAttribute("data-dropbtn-id", dropButtonId);

            // Remove css class for initialization.
            trigger.classList.remove("js_openDropBtn");

            // Increment dropButtonCount and save DropButton instance for later usage.
            _self.dropButtonCount += 1;
            _self.dropButtonList[dropButtonId] = dropButton;

            // Start the initialization of the drop button.
            dropButton.open();

            // Stop propagating the initial click event.
            o_util.event.stop(event);

            // Add an event listener on the trigger button.
            trigger.addEventListener("click", function() {
                dropButton.toggle();
            });
        }
    }

    // Execute initialization a while after document ready.
    // Add just a single event listener and delegate all click events to initDropButton.
    o_global.eventLoader.onReady(40, function() {
        o_util.event.delegate("body", "click", ".js_openDropBtn", function(event) {
            _initDropButton(event);
        });
    });
};

/**
 * Retrieve an active DropButton instance from internal dropButtonList to interact with.
 *
 * @param {String} id   DropButtonId which corresponds to the data-dropbtn-id attribute of the container element.
 *
 * @return {Object} DropButton instance object.
 */
o_global.pali.DropButtonHandler.prototype.getInstance = function(id) {
    "use strict";

    return (!!id) ? this.dropButtonList[id] : undefined;
};

/**
 * DEPRECATED!
 * Included just for convenience and backward compatibility.
 *
 * Close an opened instance of a dropbutton.
 *
 * @param {String} id   The id of the dropbutton.
 */
o_global.pali.DropButtonHandler.prototype.close = function(id) {
    "use strict";

    this.getInstance(id).close();
};

/**
 * Create an instance of dropButtonHandler.
 *
 * @type {o_global.pali.DropButtonHandler}
 */
o_global.pali.dropBtnHandler = new o_global.pali.DropButtonHandler();
