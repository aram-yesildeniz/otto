class Utils {
    debugLog(message, ...objects) {
        if (o_global &&
            o_global.debug &&
            o_global.debug.status &&
            o_global.debug.status().activated === true) {
            // this is debugging code - console.log is the point here!
            // eslint-disable-next-line no-console
            console.log(message, objects);
        }
    }

    getCurrentTimeStamp() {
        return new Date().getTime();
    }

    getWindowInnerWidth(windowObj) {
        const window_ = windowObj || window;
        return window_.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    isCurrentWindowWideEnough(windowObj) {
        return this.getWindowInnerWidth(windowObj) >= 1232;
    }
}

export {Utils};