o_global = o_global || {};

/**
 * Tooltip Class
 *
 * @constructor
 *
 * @param {Object} trigger      DOM-Element with js-trigger-class.
 */
o_global.pali.Tooltip = function(trigger) {
    "use strict";

    this.trigger = trigger;         // DOM-Element that triggers tooltip
    this.tooltip = undefined;       // DOM-Element of tooltip

    this.tooltipX = 0;              // If position is set with (20;30), then this.tooltipX = 20;
    this.tooltipY = 0;              // If position is set with (20;30), then this.tooltipY = 30;
    this.baseClass = "p_tooltip";   // Style class for tooltip-div-container
    this.mouseOffset = 0;           // MouseOffset only needed in case of position = "mouse" ( --> mousemove)

    this.throttleTime = 16.6;       // ThrottleTime determines speed to move the mouse --> time moveTooltip is called
    this.isActive = true;           // If the tooltip should not be shown anymore --> this.deactivateTooltip()
    this.tooltipIsVisible = false;  // Value = true: Tooltip is shown, value = false: Tooltip is hidden
    this.avoidCloseTooltip = false; // IE Bugfix for hybrid devices when after pointerdown-event mouseleave-event is fired
    this.type = "";                 // Visual Type like "hint,success,warning,error"

    this.orientation = 1;           // Default orientation of tooltip --> this.orientationVariations

    // Different possibilities to style the tooltip and its arrow position. default is horizontal (= 1)
    this.orientationVariations = {
        "1": "p_tooltipHorizontal",
        "2": "p_tooltipHorizontal p_tooltipHorizontalTop",
        "3": "p_tooltipHorizontal p_tooltipHorizontalRight",
        "4": "p_tooltipHorizontal p_tooltipHorizontalTop p_tooltipHorizontalRight"
    };

    /*
     * DataSettings-keys must also be a class-attribute:
     *      these are parsed automatically into the class attribute, that is named like the key
     */
    this.dataSettings = {
        "text": "data-tooltip",                          // Required, if reference: optional: tooltip text
        "reference": "data-tooltip-ref",                 // Required, if text: optional: tooltip reference: #id of DOM to load inside tooltip
        "referenceToClone": "data-tooltip-ref-clone",    // Optional, only combined with tooltip reference; clones node and let reference node in dom
        "additionalStyleClasses": "data-tooltip-class",  // Optional: additional tooltip style-classes
        "additionalContainerClasses": "data-tooltip-container-class",  // Optional: additional tooltip container-classes
        "position": "data-tooltip-pos",                  // Optional: position of tooltip, values: mouse, (x,y)
        "showForTouch": "data-tooltip-touch",            // Optional: default = true; if value = false, for touch is not implemented
        "hasCloseButton": "data-tooltip-close",          // Optional: default = true; if value = false, close-button is not shown
        "triggerClick": "data-tooltip-trigger-click",    // Optional: default = false; if value = true, the popup will only show on click
        "type": "data-tooltip-type",                     // Optional: type of tooltip, one of "hint,success,warning,error"
        "trackingObject": "data-trackingobject",         // Optional: Send tracking object when opened.
    };

    // Class-attributes of dataSettings above, with default values
    this.text = "";
    this.additionalStyleClasses = "";
    this.additionalContainerClasses = "";
    this.reference = undefined;
    this.referenceToClone = false;
    this.position = "";
    this.showForTouch = true;
    this.triggerClick = false;
    this.hasCloseButton = true;
    this.trackingObject = undefined;

    this._init();
};

/**
 * Getter of showForTouch.
 * (In case of false: do not event.preventDefault() in o_global.pali.tooltipHandler._buildTooltip()).
 *
 * @return {Boolean} this.showForTouch
 */
o_global.pali.Tooltip.prototype.getShowForTouch = function() {
    "use strict";

    return this.showForTouch;
};

/**
 * EventHandler to hide Tooltip.
 * to hide a tooltip it must be removed from DOM (document.body).
 * For touch-devices the global EventListener has to be removed to blur
 * the tooltip (in case of touch anywhere in the DOM) has to be removed.
 */
o_global.pali.Tooltip.prototype.hideTooltip = function() {
    "use strict";

    if (this.tooltipIsVisible && !this.avoidCloseTooltip) {
        if (o_global.device.isTouchable || this.triggerClick) {
            if ("onpointerdown" in window && !("ontouchstart" in window)) {
                document.removeEventListener("pointerdown", o_global.pali.tooltipHandler.blurTooltip);
            } else {
                document.body.removeEventListener("touchstart", o_global.pali.tooltipHandler.blurTooltip);
            }
        }

        document.body.removeChild(this.tooltip);
        this.tooltipIsVisible = false;
    }
};

/**
 * EventHandler to move Tooltip, when position="mouse".
 * sets x,y-position for different browsers (considers page scrolling) to calculate correct Tooltip Position.
 *
 * @param {Object} e    Event
 */
o_global.pali.Tooltip.prototype.moveTooltip = function(e) {
    "use strict";

    //See: https://github.com/jshint/jshint/issues/1425
    if (!e.pageX && typeof e.clientX === "unknown") {
        // IE <= 10 fix... e.* is sometimes forbidden if called in setTimeout
        return false;
    }

    var xPos = e.pageX || e.clientX + document.documentElement.scrollLeft,
        yPos = e.pageY || e.clientY + document.documentElement.scrollTop;

    this.calculateTooltipPosition(xPos, yPos, true);
};

/**
 * EventHandler to show Tooltip.
 * Tooltip is shown if it is no touchable device OR if is touchable and touch is not explicit prohibited by setting
 * data-tooltip-touch="false". If Tooltip is called for the first time, it must be instantiated.
 * Each time a tooltip is shown, it must be placed in the DOM (document.body).
 */
o_global.pali.Tooltip.prototype.showTooltip = function() {
    "use strict";

    if (this.isActive) {
        if (!o_global.device.isTouchable ||     // For all non-touch devices
            this.triggerClick ||                // For all non-touch-devices with data-tooltip-trigger-click="true"
            this.showForTouch ||                // For all touch devices without data-tooltip-touch="false"
            o_global.device.hybrid.isDetected) { // For all mouse-events on hybrids, if data-tooltip-touch="false"
            o_global.pali.tooltipHandler.changeActiveTooltip(this);

            if (!this.tooltip) {
                this._createTooltip();
                document.body.appendChild(this.tooltip);
                this.calculateTooltipPosition();
            } else {
                document.body.appendChild(this.tooltip);
                this.calculateTooltipPosition();    // After scrolling, position of tooltip could have changed
            }

            this.tooltipIsVisible = true;

            if (o_global.device.isTouchable || this.triggerClick) {
                // Must be defined globally, because of a bug e.g. in iPhone 4 / iOS 7.1.2
                if ("onpointerdown" in window && !("ontouchstart" in window)) {
                    // For IE on hybrid devices
                    document.addEventListener("pointerdown", o_global.pali.tooltipHandler.blurTooltip);
                } else {
                    if("ontouchstart" in window){
                        document.body.addEventListener("touchstart", o_global.pali.tooltipHandler.blurTooltip);
                    }
                    else {
                        document.body.addEventListener("click", o_global.pali.tooltipHandler.blurTooltip);
                    }
                }

                if(this.trackingObject) {
                    try {
                        o_global.eventQBus.emit('tracking.bct.submitEvent', JSON.parse(this.trackingObject));
                    } catch (e) {}
                }
            }
        }
    }
};

/**
 * EventHandler for touch devices that toggles between show and hide tooltip.
 *
 * @param {Object} e    Event
 */
o_global.pali.Tooltip.prototype.toggleTooltip = function(e) {
    "use strict";

    if (this.isActive) {
        o_util.event.stop(e);

        if (this.tooltipIsVisible) {
            this.avoidCloseTooltip = false;
            this.hideTooltip();
        } else {
            this.avoidCloseTooltip = true;
            this.showTooltip();
        }
    }
};

/**
 * Calculates position of Tooltip dynamically and defines due to this calculation its position and its orientation-style.
 * These values can change, e.g. if the window scrolls and the tooltip has no space to be shown over the trigger (as
 * default), then it is shown under the trigger. This has an impact on the position and the orientation.
 * Also data-attributes affect this behaviour, e.g. this.position = "mouse" or "20;30"
 * Finally the correct x,y position and the correct orientation-style are set.
 *
 * @param {Number} [left]         Optional: triggerPositionLeft, e.g. pageX
 * @param {Number} [top]          Optional: triggerPositionTop, e.g. pageY
 * @param {Boolean} [isMouse]     Optional: true if position = "mouse"
 */
o_global.pali.Tooltip.prototype.calculateTooltipPosition = function(left, top, isMouse) {
    "use strict";

    var arrowBorderDistance = 19,
        triggerTop,
        triggerLeft,
        box = {
            "top": 0,
            "left": 0
        },

        triggerWidth = isMouse ? 0 : this.trigger.offsetWidth,
        triggerHeight = isMouse ? 0 : this.trigger.offsetHeight,

        halfTriggerWidth = Math.floor(triggerWidth / 2),

        tooltipWidth = this.tooltip.offsetWidth,
        tooltipHeight = this.tooltip.offsetHeight,

        scrollLeft = window.scrollX,
        scrollTop = window.scrollY,

        offset = this.mouseOffset || 12,

        calculatedOrientation,
        calculatedTop,
        calculatedLeft;

    // Calculate trigger position relative to document
    if (typeof this.trigger.getBoundingClientRect !== "undefined") {
        box = this.trigger.getBoundingClientRect();
    }

    triggerTop = top || box.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
    triggerLeft = left || box.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0);

    calculatedOrientation = 1;
    calculatedLeft = triggerLeft + halfTriggerWidth - arrowBorderDistance;
    if (window.innerWidth + scrollLeft < calculatedLeft + tooltipWidth && scrollLeft < triggerLeft + halfTriggerWidth - tooltipWidth + arrowBorderDistance) {
        calculatedOrientation = 3;
        calculatedLeft = triggerLeft + halfTriggerWidth - tooltipWidth + arrowBorderDistance;
    }

    calculatedTop = triggerTop - tooltipHeight - offset;
    if (scrollTop > calculatedTop && scrollTop + window.innerHeight > triggerTop + offset + tooltipHeight) {
        if (calculatedOrientation === 3) {
            calculatedOrientation = 4;
        } else {
            calculatedOrientation = 2;

            // In case of horizontal-orientation-switch with determined x,y-position,
            // The vertical-tooltip-layer positioning must not be adjusted to the trigger
            if (this.tooltipY !== 0 || this.tooltipX !== 0) {
                triggerHeight = 0;
                offset = 0;
            }
        }

        calculatedTop = triggerTop + triggerHeight + offset;
    }

    this.tooltip.style.left = this._getPixel(calculatedLeft + this.tooltipX);
    this.tooltip.style.top = this._getPixel(calculatedTop + this.tooltipY);

    if (calculatedOrientation !== this.orientation) {
        this.removeTooltipStyleClass(this.tooltip, this.orientationVariations[this.orientation]);
        this.orientation = calculatedOrientation;
        this.addTooltipStyleClass(this.tooltip, this.orientationVariations[this.orientation]);
    }
};

/**
 * Adds a styleClass to a DOM-Element, e.g. this.tooltip or this.closeBtn.
 *
 * @param {Object} scope        DOM-Element to style.
 * @param {String} styleClass   Name of Style-Class or space separated list.
 */
o_global.pali.Tooltip.prototype.addTooltipStyleClass = function(scope, styleClass) {
    "use strict";

    scope.classList.add.apply(scope.classList, styleClass.split(" "));
};

/**
 * Removes a styleClass of a DOM-Element, e.g. this.tooltip in case of new orientation.
 *
 * @param {Object} scope        DOM-Element to style.
 * @param {String} styleClass   Name of Style-Class or space separated list.
 */
o_global.pali.Tooltip.prototype.removeTooltipStyleClass = function(scope, styleClass) {
    "use strict";

    scope.classList.remove.apply(scope.classList, styleClass.split(" "));
};

/**
 * Activates Tooltip and shows it. Only called from external.
 */
o_global.pali.Tooltip.prototype.activateTooltip = function() {
    "use strict";

    var triggerClass = "js_hasPaliTooltip";

    this.isActive = true;
    this.removeTooltipStyleClass(this.trigger, triggerClass);
    this.addTooltipStyleClass(this.trigger, triggerClass + "--done");

    this.showTooltip();
};

/**
 * Defines, that Tooltip is deactived.
 */
o_global.pali.Tooltip.prototype.deactivateTooltip = function() {
    "use strict";

    this.isActive = false;
    this.hideTooltip();
};

/**
 * Called from constructor. Handle data-parsing and initializes tooltip-events.
 *
 * @private
 */
o_global.pali.Tooltip.prototype._init = function() {
    "use strict";

    this._parseDataAttributes();
    this._initTooltipEvents();
    this.trigger.tooltipInstance = this;
};

/**
 * Parses defined data-attributes in the trigger --> data-attributes are defined dataSettings-map.
 * The key of the dataSettings is the defined class-attribute, e.g. {text: "data-tooltip"} the data-tooltip-value of
 * the trigger will be parsed in the class-attribute this.text.
 *
 * @private
 */
o_global.pali.Tooltip.prototype._parseDataAttributes = function() {
    "use strict";

    var parsedAttribute = null,
        attribute;

    for (var key in this.dataSettings) {
        if (this.dataSettings.hasOwnProperty(key)) {
            attribute = this.trigger.getAttribute(this.dataSettings[key]);

            if (!!attribute) {
                parsedAttribute = null;

                /* Change strings to data-types */
                switch (attribute) {
                    case "false":
                        parsedAttribute = false;
                        break;
                    case "true":
                        parsedAttribute = true;
                        break;
                    default:
                        parsedAttribute = attribute;
                }
                this[key] = parsedAttribute;
            }
        }
    }
};

/**
 * Initialize tooltip Events in consideration of the device (touchable or not).
 *
 * @private
 */
o_global.pali.Tooltip.prototype._initTooltipEvents = function() {
    "use strict";
    if (this.triggerClick) {
        this.trigger.addEventListener("click", o_util.core.bind(this, this.toggleTooltip));
    } else if (o_global.device.isTouchable) {
        if (this.showForTouch) {
            this._initTooltipTouchEvents();
        }

        if (o_global.device.hybrid.isDetected) {
            this._initTooltipMouseEvents();
        }
    } else {
        this._initTooltipMouseEvents();
    }
};

/**
 * Initializes touch events to show and hide tooltip.
 *
 * @private
 */
o_global.pali.Tooltip.prototype._initTooltipTouchEvents = function() {
    var that = this;

    if ("onpointerdown" in window && !("ontouchstart" in window)) {
        if (o_global.device.hybrid.isDetected) {
            this.trigger.addEventListener("pointerdown", o_util.core.bind(this, function() {
                that.avoidCloseTooltip = !that.avoidCloseTooltip;
            }));
        } else {
            this.trigger.addEventListener("pointerdown", o_util.core.bind(this, this.toggleTooltip));
        }
    } else {
        this.trigger.addEventListener("touchstart", o_util.core.bind(this, this.toggleTooltip));
    }
};

/**
 * Initializes mouseevents to show and hide tooltip.
 *
 * @private
 */
o_global.pali.Tooltip.prototype._initTooltipMouseEvents = function() {
    "use strict";

    this.trigger.addEventListener("mouseenter", o_util.core.bind(this, this.showTooltip));
    this.trigger.addEventListener("mouseleave", o_util.core.bind(this, this.hideTooltip));

    if (this.position === "mouse") {
        this.mouseOffset = 20;
        this.trigger.addEventListener("mousemove", o_util.core.bind(this, this._throttle(this.moveTooltip, this.throttleTime)));
    }
};

/**
 * Creates tooltip-element and sets its text and styleClasses. In case of touch and initializes the close-button if
 * this.hasCloseButton = true ( --> default = true, can be set by data-tooltip-close = "false").
 *
 * @private
 */
o_global.pali.Tooltip.prototype._createTooltip = function() {
    "use strict";

    var el;

    this.tooltip = document.createElement("div");
    this.tooltip.content = document.createElement("div");

    // Initializes close-button
    if (o_global.device.isTouchable || this.triggerClick) {
        if (this.hasCloseButton) {
            this._initCloseButton();
        }
    }

    // Set content
    if (!!this.reference) {
        if (!!this.referenceToClone) {
            el = document.getElementById(this.reference).cloneNode(true);
        } else {
            el = document.getElementById(this.reference);
        }

        el.removeAttribute("id");       // Important to remove style "display:none"
        el.removeAttribute("style");    // Check this!
        this.tooltip.content.appendChild(el);
    } else {
        this.tooltip.content.innerHTML = !!this.text ? this.text : ""; // FIXME: set TT isBroken if no content
    }

    this.tooltip.appendChild(this.tooltip.content);

    // Set classes
    this.addTooltipStyleClass(this.tooltip, this.baseClass);
    if (this.type) {
        this.addTooltipStyleClass(this.tooltip, this.baseClass + "--" + this.type);
    }
    this.addTooltipStyleClass(this.tooltip, this.orientationVariations[this.orientation]);

    if (this.additionalContainerClasses) {
        this.addTooltipStyleClass(this.tooltip, this.additionalContainerClasses);
    }

    this.addTooltipStyleClass(this.tooltip.content, "p_tooltip__content");

    if (!!this.additionalStyleClasses) {
        this.addTooltipStyleClass(this.tooltip.content, this.additionalStyleClasses);
    }

    if (this.position.match(/^(-?\d+);(-?\d+)$/)) {
        this.tooltipX = parseInt(RegExp.$1, 10);
        this.tooltipY = parseInt(RegExp.$2, 10);
    }

    if ((o_global.device.isTouchable && this.showForTouch) || this.triggerClick) {
        if ("onpointerdown" in window && !("ontouchstart" in window)) {
            this.tooltip.addEventListener("pointerdown", function(e) {
                e.stopPropagation();
            });
        } else {
            this.tooltip.addEventListener("touchstart", function(e) {
                e.stopPropagation();
            });
        }
    }
};

/**
 * Initializes a close-button (only for touch devices) with an eventListener on touchstart to close tooltip.
 *
 * @private
 */
o_global.pali.Tooltip.prototype._initCloseButton = function() {
    "use strict";

    this.tooltip.close = document.createElement("a");
    this.tooltip.close.innerHTML = "<i>x</i>";

    this.tooltip.close.classList.add("p_symbolBtn50--4th");
    this.tooltip.close.classList.add("p_tooltip__close");

    this.tooltip.close.addEventListener("click", o_util.core.bind(this, this.toggleTooltip));

    this.tooltip.appendChild(this.tooltip.close);
};

/**
 * Helper function to get a Pixel-String (e.g. to set css-style: top- and left-position).
 *
 * @param {Number} val  Value
 *
 * @return {String}     Returns convertet Pixel-String
 */
o_global.pali.Tooltip.prototype._getPixel = function(val) {
    "use strict";

    return parseInt(val, 10) + "px";
};

/**
 * Creates and returns a new, throttled version of the passed function, that, when invoked repeatedly, will only
 * actually call the original function at most once per every wait milliseconds. Useful for rate-limiting events that
 * occur faster than you can keep up with or than you need it.
 *
 * @private
 *
 * @param {Function} fn         Function to call by timer.
 * @param {Number} [threshold]    Time to call fn, default 250ms.
 * @param {Object} [scope]        Scope
 *
 * @return {Function}           Function
 */
o_global.pali.Tooltip.prototype._throttle = function(fn, threshold, scope) {
    "use strict";

    var last,
        deferTimer,
        timer = threshold || 250;

    return function() {
        var context = scope || this,
            now = new Date(),
            args = arguments;

        if (last && now < last + timer) {
            // Hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function() {
                last = now;
                fn.apply(context, args);
            }, timer);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
};

/**
 * Scans document for tooltip-triggers and creates Tooltip-Instances.
 */
o_global.pali.tooltipHandler = (function() {
    "use strict";

    var activeTooltip,
        triggerClass = "js_hasPaliTooltip",
        supportsOrientationChange = "onorientationchange" in window,
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

    o_global.eventLoader.onReady(80, function() {
        if (o_global.device.isTouchable) {
            if ("onpointerdown" in window && !("ontouchstart" in window)) {
                document.body.addEventListener("pointerdown", _buildTooltip);
            } else {
              document.body.addEventListener("touchstart", _buildTooltip);
            }

            window.addEventListener(orientationEvent, blurTooltip);

            // Registers a callback or excecutes it immediately, if hybrid is detected
            o_global.device.hybrid.executeOrRegisterCallback(updateHybrid);
        } else {
            document.body.addEventListener("click", _buildTooltip);
            document.body.addEventListener("mouseover", _buildTooltip);
        }
    });

    /**
     * Initializes Tooltip, if trigger has touchstart or mouseover registered.
     *
     * @private
     *
     * @param {Object} e    Event
     */
    function _buildTooltip(e) {
        var eventTarget = e.target || event.srcElement,
            tooltip = null,
            triggerElement;

        triggerElement = o_util.dom.getParentByClassName(eventTarget, triggerClass);

        if (!triggerElement) {
            return;
        }

        if (!!triggerElement.tooltipInstance) {
            if ((triggerElement.tooltipInstance.triggerClick && (e.type === "click")) ||
                (!triggerElement.tooltipInstance.triggerClick && e.type !== "click")) {
                triggerElement.tooltipInstance.activateTooltip(e);  // The tooltipInstance is typeof Tooltip
            }
        } else {
            tooltip = new o_global.pali.Tooltip(triggerElement);  // New Instance of Tooltip Class (not equal to Tooltip.tooltip!)

            if (tooltip.triggerClick && (e.type === "click") || (!tooltip.triggerClick && e.type !== "click")) {
                tooltip.activateTooltip(e);  // The tooltipInstance is typeof Tooltip
            }
        }

        if (!!triggerElement.tooltipInstance.getShowForTouch() && e.type === "click") {
            o_util.event.stop(e);
        }
    }

    /**
     * Only used for touch devices, because no all devices can handle a blur-event.
     *
     * @param {Object} e    Event
     */
    function blurTooltip(e) {
        if (!!activeTooltip && activeTooltip.tooltipIsVisible) {
            if (!("onpointerdown" in window) ||
                ("onpointerdown" in window && e.target !== activeTooltip.trigger)) {
                activeTooltip.avoidCloseTooltip = false;
                activeTooltip.hideTooltip();
            }
        }
    }

    /**
     * Sets a new activeTooltip and closes the old tooltip (if still open).
     *
     * @param {Object} tooltip      {o_global.pali.Tooltip}
     */
    function changeActiveTooltip(tooltip) {
        if (!!activeTooltip && activeTooltip !== tooltip) {
            activeTooltip.avoidCloseTooltip = false;
            activeTooltip.hideTooltip();
        }

        activeTooltip = tooltip;
    }

    /**
     * Removes initialized tooltips from triggers.
     *
     * @param {Array} domArr    Array of DOM Elements
     */
    function removeTooltip(domArr) {
        for (var i = domArr.length - 1; i >= 0; i--) {
            if (!!domArr[i].tooltipInstance) {
                domArr[i].tooltipInstance.deactivateTooltip();
            } else if (!!domArr[i]) {
                domArr[i].classList.remove("js_hasPaliTooltip");
            }
        }
    }

    /**
     * Changes all classes from "js_hasPaliTooltip--done" to "js_hasPaliTooltip"
     */
    function resetTooltipClasses() {
        var initializedElements = document.getElementsByClassName("js_hasPaliTooltip--done");

        for (var i = initializedElements.length - 1; i >= 0; i--) {
            initializedElements[i].classList.add("js_hasPaliTooltip");
            initializedElements[i].classList.remove("js_hasPaliTooltip--done");
        }
    }

    /**
     * Initializes Mouseevents, if it is a hybrid device
     * If Hybrid-Device is detected after initialization, function is called by the o_global.helper.hybrid, if Callback-Function is registered
     *
     */
    function updateHybrid() {
        document.body.addEventListener("mouseover", _buildTooltip);
    }

    return {
        "blurTooltip": blurTooltip,
        "changeActiveTooltip": changeActiveTooltip,
        "removeTooltip": removeTooltip,
        "resetTooltipClasses": resetTooltipClasses,
        "updateHybrid": updateHybrid
    };
})();
