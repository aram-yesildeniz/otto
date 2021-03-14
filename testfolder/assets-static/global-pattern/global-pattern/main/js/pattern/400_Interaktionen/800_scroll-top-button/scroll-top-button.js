// For JSLINT
/* global window, document, o_tracking */
window.AS = window.AS || {};
window.o_global = window.o_global || {};
window.o_util = window.o_util || {};

o_global.pali = o_global.pali || {};

/**
 * ScrollTopButton
 */
o_global.pali.scrollTopButton = (function(w) {
  "use strict";

  var buttonElement, // Button HTML element
    isVisibleState = false, // Cache the visible state
    isScrolling = false, // Prevent multiple call of scroll functionality
    currentScrollY, // Current scroll offset
    lastScrollY, // Last scroll offset
    windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight, // Window height on start
    scrollTimeout, // Debounce the scroll event
    hideTimeout, // Hide after 4s timer
    relativeToElement; // Button will be relative positioned to this element

  /**
   * Hide the button if needed.
   *
   * @return {Boolean} Value if the button could be hidden or not
   */
  function hideButton() {
    if (!buttonElement || !isVisibleState) {
      return false;
    }

    buttonElement.classList.add("p_scrollTopButton--hidden");

    // Cache visible state
    isVisibleState = false;

    return true;
  }

  /**
   * Check if the button is visible.
   *
   * @return {Boolean} Value if the button is visible or not
   */
  function isVisible() {
    return isVisibleState;
  }

  /**
   * Check if the button should show up.
   *
   * @private
   *
   * @returns {Boolean} Value if the button should show up or not
   */
  function _shouldShowButton() {
    // Don't need to show if already visible
    // Don't show if body scroll locked e.g. in layer
    return !isVisible();
  }

  /**
   * Calculate the position of the button relative to relativeToElement.
   *
   * @private
   */
  function _calculatePosition() {
    var offset, relativeToElementWidth;

    // Just in case
    if (!buttonElement) {
      return;
    }

    relativeToElementWidth = relativeToElement.clientWidth;

    switch (o_global.device.breakpoint.getCurrentBreakpoint()) {
      case "s":
        offset = relativeToElementWidth / 2 - buttonElement.clientWidth / 2;
        break;
      case "m":
        offset = 16;
        break;
      case "l":
      case "xl":
        offset = 24;

        // Check for info container breakpoint
        if (window.matchMedia("(min-width: 77em)").matches) {
          offset = (offset + buttonElement.clientWidth) * -1;
        }

        break;
      default:
        offset = 0;
    }

    // Set button position
    buttonElement.style.left =
      relativeToElement.offsetLeft +
      relativeToElementWidth -
      buttonElement.clientWidth -
      offset +
      "px";
  }

  /**
   * If .gridContainer is present set it to relativeToElement otherwise document.body
   * button will be positioned relative to this element.
   *
   * @private
   */
  function _setRelativeToElement() {
    relativeToElement =
      document.body.getElementsByClassName("gridContainer")[0] ||
      document.body;
  }

  /**
   * Create buttonElement insert into the dom and bind events.
   *
   * @private
   */
  function _buildButton() {
    // If the element type of the scrollTopButton is not 'button' anymore, the css code must be changed to!
    buttonElement = document.createElement("button");
    buttonElement.innerHTML = "Nach oben<i>&nbsp;^</i>";
    buttonElement.classList.add(
      "p_btn50--2nd",
      "p_scrollTopButton",
      "p_scrollTopButton--hidden"
    );
    document.body.appendChild(buttonElement);

    buttonElement.addEventListener("click", function() {
      o_util.animation.scrollTo(0, 500);

      // Jump out of the function, if current page is the shopoffice preview.
      if (o_util.misc.isPreview(w.location.href)) {
        return;
      }

      if (
        typeof o_tracking !== "undefined" &&
        !!o_tracking.bct &&
        !!o_tracking.bct.sendEventToTrackingServer
      ) {
        o_tracking.bct.sendEventToTrackingServer({
          ot_ToTopButton: "clicked"
        });
      }
    });

    _setRelativeToElement();

    window.addEventListener("resize", _calculatePosition);

    _calculatePosition();
  }

  /**
   * Show the button if needed.
   *
   * @return {Boolean} Value if the button could be shown or not
   */
  function showButton() {
    // Hide after 4s if not scrolling
    if (!!hideTimeout) {
      clearTimeout(hideTimeout);
    }

    hideTimeout = setTimeout(hideButton, 4000);

    _calculatePosition();

    if (!_shouldShowButton()) {
      return false;
    }

    // Build the button on first scroll
    if (!buttonElement) {
      _buildButton();

      if (o_util.misc.isPreview(w.location.href)) {
        return false;
      }

      if (
        typeof o_tracking !== "undefined" &&
        !!o_tracking.bct &&
        !!o_tracking.bct.sendEventToTrackingServer
      ) {
        o_tracking.bct.sendEventToTrackingServer({
          ot_ToTopButton: "shown"
        });
      }
    }

    // Make it async for first animation
    setTimeout(function() {
      buttonElement.classList.remove("p_scrollTopButton--hidden");
    }, 0);

    // Cache visible state
    isVisibleState = true;

    return true;
  }

  /**
   * Scroll logic. Calculate if scrolling up or down and save scroll Y values.
   *
   * @private
   */
  function _onScroll() {
    currentScrollY =
      (window.pageYOffset || document.documentElement.scrollTop) -
      (document.documentElement.clientTop || 0);

    // Adjust sensibility on touch devices.
    if (Math.abs(currentScrollY - lastScrollY) > 5) {
      // Only show if scrolled more than 2 * window height.
      if (
        lastScrollY > currentScrollY &&
        windowHeight * 2 < currentScrollY
      ) {
        // Scroll up.
        showButton();
      } else {
        // Scroll down.
        hideButton();
      }
    }

    // Save last scroll Y position.
    lastScrollY = currentScrollY;
    isScrolling = false;
  }

  /**
   * Prepare and debounce the scrolling event.
   *
   * @private
   */
  function _prepareScroll() {
    if (!isScrolling) {
      isScrolling = true;

      if (!!scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(_onScroll, 75);
    }
  }

  /**
   * Start. Init the scroll event.
   *
   * @private
   */
  function _init() {
    window.addEventListener("touchstart", function() {
      setTimeout(_onScroll, 50);
    });
    window.addEventListener("scroll", _prepareScroll);
  }

  // Start in setTimeout to ignore anchor scrolling
  setTimeout(_init, 100);

  // Public api
  return {
    showButton: showButton,
    hideButton: hideButton,
    isVisible: isVisible
  };
})(window);
