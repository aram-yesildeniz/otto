window.o_benefit = window.o_benefit || {};

o_benefit.initialisation = (() => {
    const module = {};
    module.init = benefitContainers => {

        if (benefitContainers.length > 0) {
            var levers = [];
            for (let i = 0; i < benefitContainers.length; i++) {
                let initialized = benefitContainers[i].getAttribute("data-initialized")
                if (initialized && initialized !== null && initialized === "true") {
                    continue;
                }
                let lever_selector = ".benefit-main__lever";
                let lever_selector_onex = ".onex-benefit-main__lever";

                if (o_global.debug.status().activated) {
                    console.log(`[benefit-presentation] Initialization of ${benefitContainers[i]}`)
                    console.log(o_benefit.linkLayer)
                }

                o_benefit.linkLayer.init(benefitContainers[i]);
                o_benefit.codebox.init(benefitContainers[i]);
                o_benefit.appOnlyBox.init(benefitContainers[i]);
                o_benefit.codeboxLegacy.init(benefitContainers[i]);
                o_benefit.countdown.init(benefitContainers[i]);

                var parentContainer = benefitContainers[i].parentElement;
                var featureOrder = parentContainer.getAttribute("data-feature-order");
                var featurePosition = !!featureOrder ? featureOrder : "99";
                [].forEach.call(benefitContainers[i].querySelectorAll(lever_selector), (element) => {
                    levers.push(
                        {"leverElement": element, "featurePosition": featurePosition}
                    );
                });

                [].forEach.call(benefitContainers[i].querySelectorAll(lever_selector_onex), (element) => {
                    levers.push(
                        {"leverElement": element, "featurePosition": featurePosition}
                    );
                });
                benefitContainers[i].setAttribute("data-initialized", "true")
            }

            if (levers.length > 0) {
                let params = {};
                params.levers = levers;
                params.featurePosition = featurePosition;
                o_benefit.trackingHandler.initLeversGeneric(params);
            }
            trackGenericTrackingData(benefitContainers);
        }
    };

    module.initSlideshow = slideshowLeverContainers => {
        Array.prototype.slice.call(slideshowLeverContainers)
            .filter(value => !value.getAttribute("data-tracked") || value.getAttribute("data-tracked") === "false")
            .forEach(leverElement => {
                o_benefit.trackingHandler.initLeverGeneric({
                    leverElement: leverElement,
                    trackView: true
                });
                leverElement.setAttribute("data-tracked", true);
            });
    };

    const trackGenericTrackingData = benefitLeverContainers => {
        const alreadyTrackedData = [];
        for (let i = 0; i < benefitLeverContainers.length; ++i) {
            let trackingDataJSON = benefitLeverContainers[i].getAttribute("data-generic-tracking");
            if (trackingDataJSON === "{}") {
                continue;
            }
            let alreadyTracked = false;
            for (let j = 0; j < alreadyTrackedData.length; ++j) {
                if (alreadyTrackedData[j] === trackingDataJSON) {
                    alreadyTracked = true;
                }
            }

            if (!alreadyTracked && !!trackingDataJSON) {
                alreadyTrackedData.push(trackingDataJSON);
                trackData(trackingDataJSON);
            }
        }
    };

    const trackData = trackingData => {
        let trackingDataJson;
        try {
            trackingDataJson = JSON.parse(trackingData);
            o_benefit.trackingApi.sendMergeRequest(trackingDataJson);
        } catch (e) {
            // tracking data parsing failed. moving on
        }
    };

    return module;
})();
