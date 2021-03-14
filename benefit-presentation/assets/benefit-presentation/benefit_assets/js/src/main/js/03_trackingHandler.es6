window.o_benefit = window.o_benefit || {};
window.o_tracking = window.o_tracking || {};

o_benefit.trackingHandler = (() => {
    const module = {};

    module.initLeversGeneric = (data) => {
        // legacy tracking is enabled by default
        const leversAlreadyTracked = [];
        for (let i = 0; !!data && !!data.levers && i < data.levers.length; i++) {
            let dataLeverid = data.levers[i].leverElement.getAttribute("data-lever-id");
            let dataTracking = data.levers[i].leverElement.getAttribute("data-tracking");
            const leverTrackingId = dataLeverid + JSON.parse(dataTracking).position;

            let trackView = true;
            for (let j = 0; j < leversAlreadyTracked.length; j++) {
                if (leversAlreadyTracked[j] === leverTrackingId) {
                    trackView = false;
                }
            }
            let params = {};
            params.leverElement = data.levers[i].leverElement;
            params.featurePosition = data.levers[i].featurePosition;
            params.eventMergeId = data.eventMergeId;
            params.promoPosition = data.levers[i].position;
            params.trackView = trackView;
            module.initLeverGeneric(params);
            leversAlreadyTracked.push(leverTrackingId);
        }

        if (o_util.toggle.get("FT9_MAIN_LEVERS_FEATURE_TRACKING", false)) {
            if (!!data && !!data.levers) {
                const containerPayload = buildTrackingPayloadContainer(data);
                const leversAlreadyTracked = [];
                const leversPayload = [];
                for (let i = 0; i < data.levers.length; i++) {
                    const leverId = data.levers[i].leverElement.getAttribute("data-lever-id");
                    const trackingData = JSON.parse(data.levers[i].leverElement.getAttribute("data-tracking"));
                    const leverTrackingId = leverId + trackingData.position;
                    const appOnlyBox = data.levers[i].leverElement.getElementsByClassName('benefit-main__lever__code-box--app');
                    const hasAppOnlyButton = (appOnlyBox.length === 1);
                    const slot = /[a-zA-Z]*/.exec(trackingData.position)[0];

                    if (!leversAlreadyTracked.includes(leverTrackingId)) {
                        const payload = buildTrackingPayloadLever(leverId, i + 1, "visible", trackingData.content, trackingData.scarcity, slot);
                        if (hasAppOnlyButton) {
                            payload.labels["benefit_AppOnlyButton"] = ["view"];
                        }
                        leversPayload.push(payload);
                    }
                    data.levers[i].leverElement.onclick = () => {
                        const leverPayload = buildTrackingPayloadLever(leverId, i + 1, "clicked", trackingData.content, trackingData.scarcity, slot);
                        const payload = {
                            name: "open", features: [containerPayload, leverPayload]
                        };
                        o_benefit.trackingQueueEventEmitter.sendEvent(payload);
                    };

                    const codebox = data.levers[i].leverElement.querySelectorAll(".benefit-main__lever__code-box--code")
                    if (codebox.length !== 0){
                        codebox[0].onclick = (e) => {
                            e.stopPropagation()
                            const codeboxPayload = buildTrackingPayloadLever(leverId, i + 1, "clicked", trackingData.content, trackingData.scarcity, slot);
                            codeboxPayload.labels["benefit_Copy"] = ["true"];
                            const payload = {
                                name: "click", features: [containerPayload, codeboxPayload]
                            };
                            o_benefit.trackingQueueEventEmitter.sendEvent(payload);
                        };
                    }

                    if (hasAppOnlyButton === true) {
                        appOnlyBox[0].onclick = () => {
                            const leverPayload = buildTrackingPayloadLever(leverId, i + 1, "clicked", trackingData.content, trackingData.scarcity, slot);
                            leverPayload.labels["benefit_AppOnlyButton"] = ["clicked"];
                            const payload = {
                                name: "open", features: [containerPayload, leverPayload]
                            };
                            o_benefit.trackingQueueEventEmitter.submitMove(payload);
                        }
                    }
                    leversAlreadyTracked.push(leverTrackingId);
                }
                if (!data.eventMergeId || typeof data.eventMergeId === 'undefined') {
                    o_benefit.trackingQueueEventEmitter.sendMerge([containerPayload, ...leversPayload]);
                } else {
                    o_benefit.trackingQueueEventEmitter.sendEventMerge([containerPayload, ...leversPayload], data.eventMergeId);
                }
            }
        }
    };

    const buildTrackingPayloadContainer = (data) => {
        const featurePosition = parseInt(data.featurePosition);
        return {
            id: "FT9-benefit-main",
            name: "KundenvorteilsContainer",
            status: "loaded",
            position: isNaN(featurePosition) ? 99 : featurePosition,
            labels: {
                benefit_FilledSlots: [`${data.levers.length}`]
            }
        }
    };

    const buildTrackingPayloadLever = (leverId, position, status, content, scarcity, slot) => {
        return {
            id: `FT9-benefit-main-${position}`,
            name: "Kundenvorteil",
            status: status,
            parentId: "FT9-benefit-main",
            position: position,
            labels: {
                benefit_Content: [content],
                benefit_Code: [`${leverId}`],
                benefit_Scarcity: [scarcity],
                benefit_Slot: [slot]
            }
        }
    };

    module.initLeverGeneric = (params) => {
        const trackingData = JSON.parse(params.leverElement.getAttribute("data-tracking"));
        const appOnlyBox = params.leverElement.getElementsByClassName('benefit-main__lever__code-box--app');
        const hasAppOnlyButton = (appOnlyBox.length === 1);

        if (!!params.featurePosition) {
            trackingData["featurePosition"] = params.featurePosition;
        }

        if (params.trackView === true) {
            processViewEvent(trackingData, hasAppOnlyButton, params.promoPosition, params.eventMergeId);
        }
        params.leverElement.onclick = () => {
            processClickEvent(trackingData, false, params.promoPosition, params.eventMergeId);
        };

        if (hasAppOnlyButton === true) {
            appOnlyBox[0].onclick = () => {
                processClickEvent(trackingData, true, params.promoPosition, params.eventMergeId);
            }
        }
    };

    const commonPayloadValue = (data, promoPosition) => {
        var position = (!!promoPosition) ? promoPosition : data.position;
        return `${data.content}∞${data.featurePosition}∞${data.filledSlots}∞${position}∞${data.source}∞`;
    };

    const commonPayloadJson = (data, promoPosition, activity) => {
        return {
            'benefit_Lever': commonPayloadValue(data, promoPosition) + activity + `∞${data.scarcity}`
        }
    };

    const processViewEvent = (data, hasAppOnlyButton, promoPosition, eventMergeId) => {
        if (!!data) {
            const payload = commonPayloadJson(data, promoPosition, "view");
            if (hasAppOnlyButton) {
                payload["benefit_AppOnlyButton"] = "view"
            }
            if (!eventMergeId || typeof eventMergeId === 'undefined') {
                o_benefit.trackingApi.sendMergeRequest(payload);
            } else {
                o_benefit.trackingApi.sendEventMergeRequest(payload, eventMergeId);
            }
        }
    };

    const processClickEvent = (data, isAppOnly, promoPosition) => {
        if (!!data) {
            const payload = commonPayloadJson(data, promoPosition, "click");
            if (isAppOnly) {
                o_tracking.bct.submitMove({'benefit_AppOnlyButton': "click"});
                return;
            }
            o_benefit.trackingApi.sendEventRequest(payload);
        }
    };

    return module;
})();