'use strict';

export default () => {
    const module = {};

    const easingFnc = o_util.animation.easings.easeOutCubic;
    const animationDuration = 500;
    const animationStartedTime = animationDuration / 4;

    module.registerAnimationStartedCallback = (startedOrStoppedAnimationCallback) => {
        setTimeout(startedOrStoppedAnimationCallback, animationStartedTime);
    };

    module.scrollAnimation = (from, to, scrollPosFn, startedOrStoppedAnimationCallback) => {
        module.registerAnimationStartedCallback(startedOrStoppedAnimationCallback);
        scrollAnimation(from, to, scrollPosFn, startedOrStoppedAnimationCallback);
    };

    const scrollAnimation = (from, to, setScrollPositionFn, startedOrStoppedAnimationCallback, startTime = 0) => {

        const now = new Date().getTime();
        // Calculate the current status (in percent - interval [0,1]) of the animation.
        startTime = startTime === 0 ? now : startTime;

        const currentState = (now - startTime) / animationDuration;

        // Abort if animation is finished.
        if (currentState > 1) {
            setScrollPositionFn(to);
            startedOrStoppedAnimationCallback();
            return;
        }

        // Update scroll position and current process of the whole animation.
        const newScrollPosition = getNewScrollPosition(from, to, currentState, easingFnc);
        setScrollPositionFn(newScrollPosition);

        // Register timeout for next animation step.
        o_util.animation.requestAnimFrame(() => {
            scrollAnimation(from, to, setScrollPositionFn, startedOrStoppedAnimationCallback, startTime);
        });
    };

    const getNewScrollPosition = (from, to, currentState, easingFnc) => {
        return from - ((from - to) * easingFnc(currentState));
    };

    return module;
};