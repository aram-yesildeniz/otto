export default class RestoreScrollPosition {
    init() {
        [].forEach.call(document.querySelectorAll('[data-module-type]'), elm => this.addOnClickListener(elm));

        const state = window.history.state;
        if (state && state.featureOrder) {
            window.history.scrollRestoration = 'manual';
            this.scrollToFeatureAfterPageIsLoaded(state.featureOrder);
            this.removeState();
        }
    }

    addOnClickListener(element) {
        element.addEventListener('click', () => {
            this.storeClickPosition(element)
        });
    }

    scrollToFeatureAfterPageIsLoaded(featureOrder) {
        let retries = 0;
        const interval = setInterval(() => {
            if (retries > 20) {
                clearInterval(interval);
                this.scrollToFeature(featureOrder);
            }
            const notAllModulesAboveAreLoaded = [].some.call(document.querySelectorAll(".promo-module-hidden"),
                module => {
                    let currentFeatureOrder = module.parentElement.getAttribute("data-feature-order");
                    return currentFeatureOrder < featureOrder
                });
            if (!notAllModulesAboveAreLoaded) {
                clearInterval(interval);
                this.scrollToFeature(featureOrder);
            }
            retries++;
        }, 100);
    }

    scrollToFeature(featureOrder) {
        const module = document.querySelector("[data-feature-order='" + featureOrder + "']");
        module.scrollIntoView({behavior: "smooth"});
    }

    storeClickPosition(element) {
        window.history.pushState({featureOrder: element.getAttribute('data-feature-order')}, "entrypageScrollPosition")
    }

    removeState() {
        window.history.pushState(null, "entrypageScrollPosition");
    }
}


