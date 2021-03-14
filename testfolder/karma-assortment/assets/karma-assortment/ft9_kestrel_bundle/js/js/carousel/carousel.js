import {lory} from "../lory.js/src/lory";
import Assortment from "../assortment";
import {Logger} from "../logger";
import CarouselIosBridge from "./carouselIosBridge";

export default class Carousel {

    constructor(cinemaDom) {
        const self = this;

        this.slideCount = cinemaDom.querySelectorAll(".karma_assortment--item").length;
        Logger.log(`Initialize assortment with ${this.slideCount} slides`);

        this.moveEvent = 'automatic';
        this.dots = cinemaDom.querySelectorAll('.karma_assortment--bubble-container-item');

        this.buttons = cinemaDom.querySelectorAll('.karma_assortment--arrow-container > div');
        this.leftButton = cinemaDom.querySelector('.karma_assortment--cinema-button-left');
        this.rightButton = cinemaDom.querySelector('.karma_assortment--cinema-button-right');

        this.dot_count = this.dots.length;
        this.slider = null;
        this.autoSlideIntervalMillis = 5000;
        this.lastAutoSlideTimeMillis = 0;
        this.slideSpeed = 1500;
        this.slideSpeedAfterFirstClick = 380;
        this.automaticSlidingIntervalId = null;
        this.picturecontainers = null;
        this.lastClickTimeMillis = 0;
        this.cinemaDom = cinemaDom;

        this.assortment = window.o_karma_assortment;

        if (this.slideCount > 1) {

            this.carouselIosBridge = new CarouselIosBridge(cinemaDom);

            this.cinemaDom.addEventListener('before.lory.init', (e) => self.handleSliderEvent(e, self));
            this.cinemaDom.addEventListener('on.lory.touchstart', (e) => self.handleSliderEvent(e, self));
            this.cinemaDom.addEventListener('after.lory.init', (e) => self.handleSliderEvent(e, self));
            this.cinemaDom.addEventListener('after.lory.slide', (e) => self.handleSliderEvent(e, self));

            this.cinemaDom.addEventListener('on.lory.resize', (e) => self.handleSliderEvent(e, self));
            [].forEach.call(this.buttons, btn => btn.addEventListener('click', (e) => self.handleClickEvent(e)));

            this.leftButton.addEventListener('click', () => this.moveEvent = 'left');
            this.rightButton.addEventListener('click', () => this.moveEvent = 'right');
            [].forEach.call(this.dots, dot => dot.addEventListener('click', () => this.moveEvent = 'page_control'));

            this.addMouseMovementListenerForHybridDevices();
        } else {
            cinemaDom.querySelector(".karma_assortment--bubble-container").style.visibility = 'hidden';
            this.leftButton.style.visibility = 'hidden';
            this.rightButton.style.visibility = 'hidden';
        }
        this.initLory();

        this.initCarouselWhenCssAndFirstImageAreLoaded();

        o_global.shoppromo_carousel = this;
    }

    handleSliderEvent(e) {
        const self = this;
        if (e.type === 'before.lory.init') {
            this.dots[0].classList.add('active');
        } else if (e.type === 'after.lory.init') {
            for (let i = 0; i < this.dot_count; i++) {
                this.dots[i].addEventListener('click', (e) => self.slideTo(e));
            }
        } else if (e.type === 'after.lory.slide') {
            for (let i = 0; i < this.dot_count; i++) {
                this.dots[i].classList.remove('active');
            }
            this.dots[e.detail.currentSlide - 1].classList.add('active');
            this.trackSlidingEvent(e);
        } else if (e.type === 'on.lory.resize') {
            for (let i = 0; i < this.dot_count; i++) {
                this.dots[i].classList.remove('active');
            }
            this.dots[0].classList.add('active');
            this.slider.reset();
        } else if (e.type === 'on.lory.touchstart') {
            this.stopAutomaticSliding();
            this.moveEvent = 'swipe';
            this.slider.setSlideSpeed(self.slideSpeedAfterFirstClick);
        }
    }

    slideTo(e) {
        this.stopAutomaticSliding();
        this.slider.slideTo(Array.prototype.indexOf.call(this.dots, e.target));
    }

    trackSlidingEvent(e) {
        let slideContainer = this.cinemaDom.querySelector('.karma_assortment--item.active');
        if (slideContainer.getAttribute("data-slidetracked") !== "true" || this.moveEvent !== 'automatic') {
            slideContainer.setAttribute("data-slidetracked", 'true');
            this.assortment.trackSlide(this.cinemaDom, e.detail.currentSlide, this.moveEvent)
        }
    }

    handleClickEvent(e) {
        this.stopAutomaticSliding();
        this.slider.setSlideSpeed(this.slideSpeedAfterFirstClick);
        const now = new Date().getTime();
        if (this.lastClickTimeMillis + this.slideSpeedAfterFirstClick >= now) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }
        this.lastClickTimeMillis = now;
    }

    stopAutomaticSliding() {
        if (this.automaticSlidingIntervalId !== null) {
            window.clearInterval(this.automaticSlidingIntervalId);
            this.automaticSlidingIntervalId = null;
        }
    }

    //Detect mouseover on hybrid devices that have a mouse attached
    addMouseMovementListenerForHybridDevices() {
        const self = this;
        const forceButtonVisibilityFunction = function onFirstHover() {
            self.leftButton.style.visibility = "visible";
            self.rightButton.style.visibility = "visible";
            self.cinemaDom.removeEventListener('mouseover', onFirstHover, false);
        };
        this.cinemaDom.addEventListener('mouseover', forceButtonVisibilityFunction, false);
        //detect touchstart (which is only fired on mobile) and remove mouseover listener, because "click" on touch devices also generates a mouseover event
        this.cinemaDom.addEventListener('touchstart', function onFirstTouchStartFunction() {
            self.cinemaDom.removeEventListener('mouseover', forceButtonVisibilityFunction, false);
            self.cinemaDom.removeEventListener('touchstart', onFirstTouchStartFunction, false);
        }, {passive: true});
    }

    initLory() {
        this.slider = lory(this.cinemaDom, {
            infinite: this.slideCount > 1 ? 1 : false,
            slideSpeed: this.slideSpeed,
            classNameFrame: 'karma_assortment--scroll-pane',
            classNameSlideContainer: 'karma_assortment--item-container',
            classNamePrevCtrl: 'karma_assortment--cinema-button-left',
            classNameNextCtrl: 'karma_assortment--cinema-button-right',
        });

        if (this.slideCount > 1) {
            this.carouselIosBridge.init();
        }
    }

    initCarouselWhenCssAndFirstImageAreLoaded() {
        const self = this;
        const intervalId = window.setInterval(
            function () {
                const computedStyle = getComputedStyle(self.cinemaDom);
                const zIndex = computedStyle ? computedStyle.zIndex : '-42';
                const promoAlreadyVisible = self.cinemaDom.className.indexOf("--visible") > 0;
                const isCssLoadedAndApplied = (zIndex === '-42' || zIndex + "" === "-42" /* IE hack */ || promoAlreadyVisible);
                Logger.log("Carousel: zIndex: " + zIndex + " - promoAlreadyVisible: " + promoAlreadyVisible + " - isCssLoadedAndApplied: " + isCssLoadedAndApplied);
                if (!isCssLoadedAndApplied) {
                    return;
                }
                Logger.log("Carousel: Clearing interval " + intervalId + " and call onCssLoaded");
                window.clearInterval(intervalId);
                self.onCssLoaded();
            },
            50 // check if css has been applied 20 times a second
        );
    }

    onCssLoaded() {
        const self = this;
        const firstImage = this.cinemaDom.querySelectorAll('.karma_assortment--image-first')[0];
        this.picturecontainers = this.cinemaDom.querySelectorAll('.karma_assortment--picturecontainer');

        if (!firstImage) {
            //Make cinema visible in every case
            Logger.log("Carousel: Cinema Shoppromo contains no images - this should not happen.");
            this.cinemaDom.classList.add('karma_assortment--visible');
            return;
        }

        //Replace placeholder images and picture sources with real ones
        Assortment.loadImages(this.cinemaDom);

        //Reset slider once first image and css loaded - fixes firefox issue with different media queries in picture tag
        if (firstImage.complete) {
            Logger.log("Carousel: First image is complete - calling onCssAndFirstImageLoaded...");
            this.resetCarouselWhenWidthIsGreaterZero();

        } else {
            Logger.log("Carousel: First image is not complete - registering event listeners for load and error on firstImage: " + firstImage);

            const browser = o_global.device.browser;
            //IE < 11 does not handle the image load event correctly when image is already cached
            if (browser === 'MSIE10' || browser === 'MSIE9') {
                this.resetCarouselWhenWidthIsGreaterZero();
            } else {
                firstImage.addEventListener('load', () => self.resetCarouselWhenWidthIsGreaterZero());
                firstImage.addEventListener('error', () => self.resetCarouselWhenWidthIsGreaterZero());
            }
        }
    }

    resetCarouselWhenWidthIsGreaterZero() {
        const self = this;
        const container = this.cinemaDom.querySelectorAll('.karma_assortment--item-container')[0];
        const width = container.getBoundingClientRect().width || container.offsetWidth;
        if (width <= 0) {
            const intervalId = window.setInterval(
                function () {
                    const width = container.getBoundingClientRect().width || container.offsetWidth;
                    Logger.log("Carousel: width: " + width);
                    if (width <= 0) {
                        return;
                    }
                    Logger.log("Carousel: width is " + width + " - Clearing interval " + intervalId + " and resetting carousel");
                    window.clearInterval(intervalId);
                    self.resetCarousel();
                },
                50 // check if width is > 0 20 times a second
            );
        } else {
            Logger.log("Carousel: Has right width (" + width + ") from the beginning. Resetting carousel.");
            this.resetCarousel();
        }
    }

    resetCarousel() {
        const self = this;
        self.slider.reset();
        // Make carousel visible
        self.cinemaDom.classList.add('karma_assortment--visible');
        // Init Autoplay
        const disableAutoplay = window.localStorage && window.localStorage.getItem('stopSlidingCinemaForJLineup') === 'true';
        if (!disableAutoplay) {
            self.automaticSlidingIntervalId = window.setInterval(this.performSlide(), self.autoSlideIntervalMillis);
        }
    }

    performSlide() {
        const self = this;
        return () => {
            //This prevents scrolling over multiple slides when unminimizing the browser or switching tabs, because the interval was running in the background
            const now = new Date().getTime();
            const isPaliLayerOpen = document.getElementById('p_layer') != null;
            if (self.lastAutoSlideTimeMillis + self.autoSlideIntervalMillis <= now && !isPaliLayerOpen) {
                self.slider.next();
                self.lastAutoSlideTimeMillis = now;
            }
        };
    }
}