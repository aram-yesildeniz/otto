import { lory } from "../lory.js/src/lory";
import Logger from "../logger";
import {
  ARROW_BUTTON_LEFT,
  ARROW_BUTTON_RIGHT,
  ARROW_CONTAINER_DIVS,
  MOOD_IMAGE_CONTAINER,
  MOOD_IMAGE_FIRST,
  WIDGET_VISIBLE,
} from "../class_constants";

export default class Carousel {
  constructor(carouselContainer) {
    const self = this;

    this.buttons = carouselContainer.querySelectorAll(ARROW_CONTAINER_DIVS);
    this.slider = null;
    this.slideSpeed = 380;
    this.lastClickTimeMillis = 0;
    this.carouselContainer = carouselContainer;
    this.pendingToBeResolved = [];

    // for touch detection on iOS until touch-action css property is implemented in mobile Safari
    this.xDown = null;
    this.yDown = null;

    this.carouselContainer.addEventListener(
      "before.lory.init",
      self.handleSliderEvent.bind(self)
    );
    this.carouselContainer.addEventListener(
      "on.lory.touchstart",
      self.handleSliderEvent.bind(self)
    );
    this.carouselContainer.addEventListener(
      "after.lory.init",
      self.handleSliderEvent.bind(self)
    );
    this.carouselContainer.addEventListener(
      "after.lory.slide",
      self.handleSliderEvent.bind(self)
    );

    this.carouselContainer.addEventListener(
      "on.lory.resize",
      self.handleSliderEvent.bind(self)
    );
    Array.from(this.buttons).forEach((btn) =>
      btn.addEventListener("click", self.handleClickEvent.bind(self))
    );

    this.leftButton = carouselContainer.querySelector(ARROW_BUTTON_LEFT);
    this.rightButton = carouselContainer.querySelector(ARROW_BUTTON_RIGHT);

    this.addMouseMovementListenerForHybridDevices();
    this.startFallbackVisibleMaker();

    this.initLory();

    this.initCarouselWhenCssAndFirstImageAreLoaded();
  }

  initCarouselWhenCssAndFirstImageAreLoaded() {
    const self = this;
    let sanityCounter = 0;
    const intervalId = window.setInterval(
      () => {
        const { zIndex } = getComputedStyle(self.carouselContainer);
        const carouselAlreadyVisible =
          self.carouselContainer.className.indexOf("list-visible") > 0;
        const isCssLoadedAndApplied =
          zIndex === "-42" || `${zIndex}` === "-42" || carouselAlreadyVisible; // The second is an IE hack
        Logger.log(
          `zIndex: ${zIndex} - carouselAlreadyVisible: ${carouselAlreadyVisible} - isCssLoadedAndApplied: ${isCssLoadedAndApplied} - sanityCounter: ${sanityCounter}`
        );
        if (!isCssLoadedAndApplied && sanityCounter < 80) {
          sanityCounter += 1;
          return;
        }
        Logger.log(`Clearing interval ${intervalId} and call onCssLoaded`);
        window.clearInterval(intervalId);
        self.onCssLoaded();
      },
      50 // check if css has been applied 20 times a second
    );
  }

  onCssLoaded() {
    const self = this;

    const images = Array.from(
      self.carouselContainer.querySelectorAll(MOOD_IMAGE_FIRST)
    );

    self.picturecontainers = self.carouselContainer.querySelectorAll(
      MOOD_IMAGE_CONTAINER
    );

    if (images.length === 0) {
      // Make cinema visible in every case
      Logger.log(
        "Cinema Shoppromo contains no images - this should not happen."
      );
      self.carouselContainer.classList.add(WIDGET_VISIBLE);
      return;
    }

    // Reset slider once all images and css loaded - fixes firefox issue with different media queries in picture tag
    const { browser } = o_global.device;
    // IE < 11 does not handle the image load event correctly when image is already cached
    if (browser === "MSIE10" || browser === "MSIE9") {
      self.resetCarouselWhenWidthIsGreaterZero();
      return;
    }

    if (images.filter((img) => img.complete).length === images.length) {
      self.resetCarouselWhenWidthIsGreaterZero();
      return;
    }

    images.forEach((img) => {
      if (!img.complete) {
        self.checkIfAllLoaded(img);
      }
    });
  }

  checkIfAllLoaded(img) {
    const self = this;

    self.pendingToBeResolved.push(img);

    const resolver = () => {
      const index = self.pendingToBeResolved.indexOf(img);
      self.pendingToBeResolved.splice(index, 1);
      if (self.pendingToBeResolved.length === 0)
        self.resetCarouselWhenWidthIsGreaterZero();
    };

    img.addEventListener("load", resolver, false);
    img.addEventListener("error", resolver, false);
  }

  onCssAndFirstImageLoaded() {
    const self = this;

    self.carouselContainer.classList.add("combo-combo-list-visible");
    self.slider.reset();
  }

  resetCarouselWhenWidthIsGreaterZero() {
    const self = this;
    const container = this.carouselContainer.querySelectorAll(
      ".combo-combo-list-item-container"
    )[0];
    const containerWidth =
      container.getBoundingClientRect().width || container.offsetWidth;
    if (containerWidth <= 0) {
      const intervalId = window.setInterval(
        () => {
          const width =
            container.getBoundingClientRect().width || container.offsetWidth;
          Logger.log(`Carousel: width: ${width}`);
          if (width <= 0) {
            return;
          }
          Logger.log(
            `Carousel: width is ${width} - Clearing interval ${intervalId} and resetting carousel`
          );
          window.clearInterval(intervalId);
          self.onCssAndFirstImageLoaded();
        },
        50 // check if width is > 0 20 times a second
      );
    } else {
      Logger.log(
        `Carousel: Has right width (${containerWidth}) from the beginning. Resetting carousel.`
      );
      this.onCssAndFirstImageLoaded();
    }
  }

  initLory() {
    this.slider = lory(this.carouselContainer, {
      slideSpeed: this.slideSpeed,
      classNameFrame: "combo-combo-list-scroll-pane",
      classNameSlideContainer: "combo-combo-list-item-container",
      classNamePrevCtrl: "combo-combo-list-cinema-button-left",
      classNameNextCtrl: "combo-combo-list-cinema-button-right",
    });

    // As long as touch-action css property is not implemented in iOS Safari, we need this :(
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS) {
      const self = this;
      this.carouselContainer.addEventListener(
        "touchstart",
        self.handleTouchStart.bind(self),
        { passive: true }
      );
      this.carouselContainer.addEventListener(
        "touchmove",
        self.handleTouchMove.bind(self),
        { passive: false }
      );
    }
  }

  // only for iOS Safari
  handleTouchStart(e) {
    const self = this;
    const firstTouch = e.touches[0];
    self.xDown = firstTouch.clientX;
    self.yDown = firstTouch.clientY;
  }

  // only for iOS Safari
  handleTouchMove(e) {
    const self = this;

    if (!self.xDown || !self.yDown) {
      return;
    }

    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;

    const xDiff = self.xDown - xUp;
    const yDiff = self.yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        // swipe left
      } else {
        // swipe right
      }
      e.preventDefault();
    } else if (yDiff > 0) {
      // swipe up
    } else {
      // swipe down
    }
    self.xDown = null;
    self.yDown = null;
  }

  handleSliderEvent(e) {
    const self = this;
    if (e.type === "on.lory.resize") {
      self.slider.reset();
    } else if (e.type === "on.lory.touchstart") {
      self.moveEvent = "swipe";
    }
  }

  handleClickEvent(e) {
    const self = this;
    const now = new Date().getTime();
    if (self.lastClickTimeMillis + self.slideSpeed >= now) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    this.lastClickTimeMillis = now;
  }

  startFallbackVisibleMaker() {
    const self = this;
    const intervalId = window.setInterval(() => {
      Logger.log(
        `Clearing interval ${intervalId} and checking visibility of large cinema...`
      );
      window.clearInterval(intervalId);
      const carouselAlreadyVisible =
        self.carouselContainer.className.indexOf("list-visible") > 0;
      if (!carouselAlreadyVisible) {
        Logger.log(
          "Cinema was still invisible - fallback visibility change occured!!!"
        );
        self.carouselContainer.classList.add("combo-combo-list-visible");
      } else {
        Logger.log("Cinema was already visible. Fallback not needed.");
      }
    }, 4100);
  }

  // Detect mouseover on hybrid devices that have a mouse attached
  addMouseMovementListenerForHybridDevices() {
    const self = this;
    const forceButtonVisibilityFunction = function onFirstHover() {
      self.leftButton.style.visibility = "visible";
      self.rightButton.style.visibility = "visible";
      self.carouselContainer.removeEventListener(
        "mouseover",
        onFirstHover,
        false
      );
    };
    this.carouselContainer.addEventListener(
      "mouseover",
      forceButtonVisibilityFunction,
      false
    );
    // detect touchstart (which is only fired on mobile) and remove mouseover listener, because "click" on touch devices also generates a mouseover event
    this.carouselContainer.addEventListener(
      "touchstart",
      function onFirstTouchStartFunction() {
        self.carouselContainer.removeEventListener(
          "mouseover",
          forceButtonVisibilityFunction,
          false
        );
        self.carouselContainer.removeEventListener(
          "touchstart",
          onFirstTouchStartFunction,
          false
        );
      }
    );
  }
}
