export default class CarouselIosBridge {
    // As long as touch-action css property is not implemented in iOS Safari, we need this :(

    constructor(cinemaDom) {
        this.cinemaDom = cinemaDom;

        //for touch detection on iOS until touch-action css property is implemented in mobile Safari
        this.xDown = null;
        this.yDown = null;
    }

    init() {
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (iOS) {
            const self = this;
            this.cinemaDom.addEventListener("touchstart", (e) => self.handleTouchStart(e), {passive: true});
            this.cinemaDom.addEventListener("touchmove", (e) => self.handleTouchMove(e), {passive: false});
        }
    }

    //only for iOS Safari
    handleTouchStart(e) {
        const firstTouch = e.touches[0];
        this.xDown = firstTouch.clientX;
        this.yDown = firstTouch.clientY;
    }

    //only for iOS Safari
    handleTouchMove(e) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        const xUp = e.touches[0].clientX;
        const yUp = e.touches[0].clientY;

        const xDiff = this.xDown - xUp;
        const yDiff = this.yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                //swipe left
            } else {
                //swipe right
            }
            e.preventDefault();
        } else {
            if (yDiff > 0) {
                //swipe up
            } else {
                //swipe down
            }
        }
        this.xDown = null;
        this.yDown = null;
    }
}