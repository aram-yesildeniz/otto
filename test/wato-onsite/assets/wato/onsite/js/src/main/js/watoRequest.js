class WatoRequest {
    constructor(trackingApi, aditionCookie) {
        this.trackingApi = trackingApi;
        this.aditionCookie = aditionCookie;
    }

    _getSelectionRule(avContentDiv) {
        return avContentDiv.getAttribute('data-rule');
    }

    _isAditionEnabled() {
        return o_util.cookie.get("seleniumBypassAdvertising") !== "true";
    }

    _hasClass(e, className) {
        return e && e.classList.contains(className);
    }

    _getAditionIdentifier() {
        const avContentDiv = document.getElementById('avContent');
        if (this._hasClass(avContentDiv, 'js_av_searchResult')) {
            return {identifier: 'suchergebnisseite'};
        } else if (this._hasClass(avContentDiv, 'js_av_productList') || this._hasClass(avContentDiv, 'js_av_teaser')) {
            return {identifier: 'kategorieseite', rule: this._getSelectionRule(avContentDiv)};
        } else if (this._hasClass(avContentDiv, 'user_logout')) {
            return {identifier: 'logoutseite'};
        } else if (this._hasClass(avContentDiv, 'storeFrontAV')) {
            return {identifier: 'storefront'};
        } else if (document.getElementsByTagName("html")[0].getAttribute("data-pagecluster") === "Suchergebnisseite") {
            return {identifier: 'suchergebnisseite'};
        } else if (document.getElementById("avJson")) {
            return {identifier: 'ads'};
        }
        return null;
    }

    _toRuleParameter(rule) {
        if (rule) {
            return `&rule=${rule}`
        } else {
            return ''
        }
    }

    getAvData(areaType) {
        if (!this._isAditionEnabled()) {
            return Promise.reject("Adition is disabled - not calling wato in the first place")
        }
        const aditionIdentifier = this._getAditionIdentifier();
        if (aditionIdentifier === null) {
            return Promise.reject("Could not identify the page type");
        }
        this.trackingApi.sendMergeRequest({'wato_AinfoRequest': 'true'});
        const watoUrl = `/wato-onsite/a_info?identifier=${encodeURIComponent(aditionIdentifier.identifier)}&areatype=${encodeURIComponent(areaType)}${this._toRuleParameter(aditionIdentifier.rule)}`;
        return Promise.resolve(o_util.ajax
            .getJSON(watoUrl)
            .then(response => {
                if (!(response.status === 200 && response.responseJSON && response.responseJSON.av_id)) {
                    return Promise.reject({
                        message: "Got nothing of use from wato - aborting.",
                        response: response
                    });
                }
                return this.aditionCookie.fetchAndSetAndGet(window.location.hostname)
                    .then((aditionUserId) => {
                        return Promise.resolve({
                            responseJSON: response.responseJSON,
                            aditionUserId: aditionUserId
                        });
                    })
            }));
    }
}

export {WatoRequest};
