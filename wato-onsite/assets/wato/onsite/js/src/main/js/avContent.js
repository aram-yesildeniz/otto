window.adition = window.adition || {};
window.adition.srq = window.adition.srq || [];
window.o_wo = window.o_wo || {};

class AvContent {
    constructor(clickTracking, viewTracking, trackingApi, watoRequest, productData, shoppingProcess, utils) {
        this.clickTracking = clickTracking;
        this.viewTracking = viewTracking;
        this.trackingApi = trackingApi;
        this.watoRequest = watoRequest;
        this.productData = productData;
        this.shoppingProcess = shoppingProcess;
        this.utils = utils;
    }

    _appendWrapperDiv(outerDiv, id) {
        const avOuterWrapper = document.createElement('div');
        avOuterWrapper.id = id;
        if (outerDiv !== null) {
            outerDiv.appendChild(avOuterWrapper);
        }
        return avOuterWrapper;
    }

    _hasSearchTerm() {
        const sanSearchResultContainer = document.getElementById('san_searchResult');
        return sanSearchResultContainer && sanSearchResultContainer.getAttribute('data-userquery');
    }

    _getSearchTerm() {
        const searchTerm = document.getElementById('san_searchResult').getAttribute('data-userquery');
        return encodeURIComponent(this.productData.cleanupSearchTerm(searchTerm));
    }

    _addCssClass(container, cssClass) {
        if (container.classList) {
            container.classList.add(cssClass);
        } else {
            container.className += ' ' + cssClass;
        }
    }

    _setIframeHeightToBannerHeight(iframe) {
        const images = iframe
            && iframe.contentWindow
            && iframe.contentWindow.document
            && iframe.contentWindow.document.getElementsByTagName("img");

        if (images && images.length > 0) {
            iframe.height = images[0].scrollHeight;
        }
    }

    _makeIframeScalable(iframes) {
        if (iframes.length === 1) {
            iframes[0].style.width = "100%";
            iframes[0].style.maxWidth = "400px";
            this._setIframeHeightToBannerHeight(iframes[0]);
        }
    }

    _setCharacteristicProfiles(api, mostImportantCharacteristicsString) {
        if (mostImportantCharacteristicsString) {
            const mostImportantCharacteristicsObject = JSON.parse(mostImportantCharacteristicsString);
            for (const facet in mostImportantCharacteristicsObject) {
                if (Object.prototype.hasOwnProperty.call(mostImportantCharacteristicsObject, facet)) {
                    const facetValue = mostImportantCharacteristicsObject[facet];
                    api.setProfile(facet, facetValue);
                }
            }
        }
    }

    _shouldNotRender(bannerDescriptionApi) {
        return (bannerDescriptionApi.getBannerCode() === '');
    }

    _prepareRenderingSlot(slotId, data, aditionUserId) {
        let avAnchor;
        if (slotId === 'wo_av_sidebar') {
            avAnchor = document.querySelectorAll('.av_anchor').item(0);
        } else {
            avAnchor = document.getElementById('san_av_bottom') || document.getElementById('wato_av_bottom');
        }
        const outerWrapper = this._appendWrapperDiv(avAnchor, slotId);
        this._addCssClass(avAnchor, 'wo_avContent');

        window.adition.srq.push((api) => {
            const inShoppingProcess = this.shoppingProcess.isInShoppingProcess() ? 'true' : 'false',
                av_id = data.av_id;

            if (!o_util.cookie.exists('cb') || o_util.cookie.get('cb') === '0') {
                //set optout in adition if consent cookie is not set or 0
                //disable cookies in adition if consent cookie is not set or 0
                //adition advised that just setting optout() might not always be sufficient
                api.disableCookies();
                api.identityService.setUserId(aditionUserId).optout();
            } else {
                api.identityService.setUserId(aditionUserId);
            }

            api.registerAdfarm('as.otto.de');

            api.setProfile('ishp', inShoppingProcess);

            if (data.identifier === 'ads') {
                this.productData.setProductDataProfiles(api);
            }

            if (this._hasSearchTerm()) {
                api.setProfile('sw', this._getSearchTerm());
            }

            api.setProfile('app', o_util.cookie.exists('app').toString());

            api.configureRenderSlot(slotId).setContentunitId(av_id).setRenderer('iframe');

            this._setCharacteristicProfiles(api, data.mostImportantCharacteristics);

            if (data.convertedDresonRule) {
                api.setProfile("dresonrule", data.convertedDresonRule)
            }


            api.events.onPreRender((renderSlotElement, bannerDescriptionApi, renderControlApi) => {
                if (this._shouldNotRender(bannerDescriptionApi)) {
                    renderControlApi.disable();
                    return;
                }

                this._addCssClass(outerWrapper, 'wo_marginTop');
                this._addCssClass(outerWrapper, 'wo_marginBottom');
                let innerWrapper, options = bannerDescriptionApi.getOptions();
                const titleElement = this._buildTitle(options);
                outerWrapper.appendChild(titleElement);
                innerWrapper = document.createElement('div');
                innerWrapper.className = 'wo_avInnerWrapper';
                renderControlApi.addInnerWrapper(innerWrapper);
            });

            api.events.onNoBanner(() => {
                this.viewTracking.trackNoView(data);
            });

            api.events.onFinishLoading((renderSlotElement, bannerDescription) => {
                this.viewTracking.trackView(bannerDescription.getOptions(), data);

                if (slotId === "wo_av_bottombar") {
                    const iframes = renderSlotElement.getElementsByTagName("iframe");
                    this._makeIframeScalable(iframes);
                }

                this._registerTrackingClickHandler(bannerDescription.getOptions());
            });

            api.load([slotId]).completeRendering();
        });

        this._loadSingleRequest();
    }

    _retrieveAvContent(data, areaType, aditionUserId) {
        const slotIds = {
            sidebar: 'wo_av_sidebar',
            bottombar: 'wo_av_bottombar'
        };

        this._prepareRenderingSlot(slotIds[areaType], data, aditionUserId);

        window.adition.srq.push((api) => api.renderSlot(slotIds[areaType]));
    }

    _registerTrackingClickHandler(bannerOptions) {
        const ifrm = document.querySelector('.wo_avInnerWrapper iframe');
        if (ifrm) {
            const doc = ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document;

            if (doc.readyState !== 'loading') {
                const link = doc.getElementsByTagName('a')[0];
                this.clickTracking.registerClickHandler(link, () => this.clickTracking.trackClick(bannerOptions));
            } else {
                return doc.addEventListener('DOMContentLoaded', () => {
                    const link = doc.getElementsByTagName('a')[0];
                    this.clickTracking.registerClickHandler(link, () => this.clickTracking.trackClick(bannerOptions));
                });
            }
        }
    }

    _buildTitle(options) {
        const titleElement = document.createElement('p');
        titleElement.className = 'wo_caption';
        if (options && options.internal === 'true') {
            titleElement.innerHTML = 'Aktuell bei OTTO';
        } else {
            titleElement.innerHTML = 'Anzeige';
        }
        return titleElement;
    }

    _loadSingleRequest() {
        if (document.getElementById('wo_singleRequestScript')) {
            return;
        }

        this.trackingApi.sendMergeRequest({'wato_AinfoResponse': 'true'});

        const script = document.createElement('script');
        script.id = 'wo_singleRequestScript';
        script.type = 'text/javascript';
        script.src = 'https://is.otto.de/js/srp.js';
        script.charset = 'utf-8';
        script.async = true;
        const firstScript = document.getElementsByTagName('script')[0];

        script.onload = () => {
            this.trackingApi.sendMergeRequest({'wato_Request': 'true'});
        };

        firstScript.parentNode.insertBefore(script, firstScript);
    }

    _sidebarContentShouldBeLoaded() {
        const containerPresent = document.getElementsByClassName('av_anchor').length > 0;
        return containerPresent && this.utils.isCurrentWindowWideEnough();
    }

    _bottombarContentShouldBeLoaded() {
        const breakpointSOrM = o_global.breakpoint.isSmall() || o_global.breakpoint.isMedium();
        const containerPresent = !!document.getElementById("san_av_bottom") || !!document.getElementById("wato_av_bottom");
        return containerPresent && breakpointSOrM;
    }

    _getAvData(areaType) {
        return this.watoRequest.getAvData(areaType)
            .then(({responseJSON, aditionUserId}) => {
                return this._retrieveAvContent(responseJSON, areaType, aditionUserId);
            }).catch((err) => {
                this.utils.debugLog(err);
            });
    }

    _tryToRenderContent() {
        if ((!window.o_wo.sidebarRendered) && this._sidebarContentShouldBeLoaded()) {
            window.o_wo.sidebarRendered = true;
            return this._getAvData('sidebar');
        } else if ((!window.o_wo.bottombarRendered) && this._bottombarContentShouldBeLoaded()) {
            window.o_wo.sidebarRendered = true;
            return this._getAvData('bottombar');
        } else {
            return Promise.reject("found no place to render.")
        }
    }

    fillAvContent() {
        this._tryToRenderContent()
            .catch(msg => this.utils.debugLog(msg));
    }
}

export {AvContent};