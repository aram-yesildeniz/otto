window.o_apps_init = function (deps) {

    /* deps should be
       {
         'document': htmlDocument,
         'httpRequest': httpRequest,
         'eventQBus': window.o_global.eventQBus,
         'appsAndroid': appsAndroid,
         'htmlLocation': htmlLocation,
         'lhotseExactag': windowLhotseExactag,
         'exactag': windowExactag,
         'userAgent': userAgent,
         'features': features
     } */

    const MIN_IOS_VERSION_ON_ORDER_CONFIRMED = '9.21.0';

    var featureToggle = deps.features || {
        shareNative: true
    };

    var ftapps = {
        platform: {
            'ios': 'ios',
            'android': 'android'
        }
    };

    var api = {
        appVersion: function () {
            if (this.cookieWithName('appVersion') === undefined) {
                return undefined;
            }
            return this.cookieWithName('appVersion').split('=')[1];
        },

        appType: function () {
            if (this.cookieWithName('appType') === undefined) {
                return undefined;
            }
            return this.cookieWithName('appType').split('=')[1];
        },

        cookieWithName: function (name) {
            return this.splitCookies().filter(function (c) {
                return c.indexOf(name) === 0;
            })[0];
        },

        osVersionAndroid: function () {
            if ((deps.userAgent.indexOf('Android') !== -1)
                && (deps.userAgent.indexOf('Windows') === -1)) {
                return parseFloat(deps.userAgent.slice(deps.userAgent.indexOf('Android') + 8));
            }
        },

        osVersionIos: function () {
            return parseFloat(
                ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(deps.userAgent) || [0, ''])[1])
                    .replace('_', '.')
            ) || undefined;
        },

        shouldDisplaySmartAppBanner: function () {
            const MIN_ANDROID_VERSION = 5;
            const MIN_IOS_VERSION = 11;

            if (this.runningInApp()) {
                return false;
            }

            var osVersionIos = api.osVersionIos();
            var osVersionAndroid = api.osVersionAndroid();

            if (osVersionAndroid != undefined && osVersionAndroid >= MIN_ANDROID_VERSION) {
                return true;
            } else if (osVersionIos != undefined && osVersionIos >= MIN_IOS_VERSION) {
                return true;
            }
            return false;
        },

        getTrackingId: function () {
            var md5 = window.o_apps_md5;

            var browserId = this.cookieWithName("BrowserId");
            var visitorId = this.cookieWithName("visitorId");

            return md5(md5(browserId) + md5(visitorId));
        },

        shouldDisplaySmartAppBannerWithTracking: function () {
            var shouldDisplaySmartBanner = this.shouldDisplaySmartAppBanner();
            var trackingId = this.getTrackingId();

            return {
                shouldDisplaySmartBanner: shouldDisplaySmartBanner,
                adjustLink: "https://frj4.adj.st/www.otto.de/extern/?page=%2F&otto_deep_link=https%3A%2F%2Fwww.otto.de%2Fextern%2F%3Fpage%3D%252F&adjust_t=33v0zew_uu2qg33&adjust_deeplink=otto%3A%2F%2Fwww.otto.de%2Fextern%2F%3Fpage%3D%252F",
                trackingId: trackingId
            };
        },

        shouldShowWebCookieBanner: function () {
            if (api.runningInApp()) {
                const isIOSAppSupportingNativeCookieBanner = api.appType() === ftapps.platform.ios && api.compareVersionsGreaterEqual(api.appVersion(), '9.17.0');
                const isAndroidAppSupportingNativeCookieBanner = api.appType() === ftapps.platform.android && api.compareVersionsGreaterEqual(api.appVersion(), '9.8.0');
                if (isIOSAppSupportingNativeCookieBanner || isAndroidAppSupportingNativeCookieBanner) {
                    return false;
                }
            }
            return true;
        },

        allowTrackingBasedOnCookieBanner: function () {
            let cbCookie = this.cookieWithName('cb');
            if (cbCookie == null) {
                return false;
            }
            let cbCookieValue = cbCookie.split("=")[1];
            return cbCookieValue === '1' || cbCookieValue === '2';
        },

        compareVersionsGreaterEqual: function (v1, v2) {
            var v1parts = v1.split('.'),
                v2parts = v2.split('.'),
                maxLen = Math.max(v1parts.length, v2parts.length),
                part1, part2,
                cmp = 0;

            for (var i = 0; i < maxLen && !cmp; i++) {
                part1 = parseInt(v1parts[i], 10) || 0;
                part2 = parseInt(v2parts[i], 10) || 0;
                if (part1 < part2)
                    cmp = 1;
                if (part1 > part2)
                    cmp = -1;
            }

            return 0 >= cmp;
        },

        executeXMLHttpPostRequest: function (url, data) {
            var xhr = deps.httpRequest();
            var random = String(new Date().getTime());

            xhr.open('POST', url + '?cachebust=' + random, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        },

        iosCallbacks: {
            wishlistChanged: function (api, messageHandlers) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.wishlistChanged.postMessage({});
                } else {
                    api.executeXMLHttpPostRequest('/apps/web_native_bridge/wishlist_changed', null);
                }
            },
            basketChanged: function (api, messageHandlers) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.basketChanged.postMessage({});
                } else {
                    api.executeXMLHttpPostRequest('/apps/web_native_bridge/basket_changed', null);
                }
            },
            grantPriceAlertPermission: function (api, messageHandlers, frontendToken, grantedCallbackPathAndName, notGrantedCallbackPathAndName) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.grantPriceAlertPermission.postMessage({
                        frontendToken: frontendToken,
                        grantedCallbackPathAndName: grantedCallbackPathAndName,
                        notGrantedCallbackPathAndName: notGrantedCallbackPathAndName
                    })
                } else {
                    var data = 'frontendToken=' + frontendToken + '&grantedCallback=' + encodeURIComponent(grantedCallbackPathAndName) + '&notGrantedCallback=' + encodeURIComponent(notGrantedCallbackPathAndName);
                    api.executeXMLHttpPostRequest('/apps/web_native_bridge/grant_price_alert_permission', data);
                }
            },
            collectArticleDetails: function (api, messageHandlers, data) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.collectArticleDetails.postMessage(data)
                } else {
                    api.executeXMLHttpPostRequest('/apps/web_native_bridge/collected_article_details', JSON.stringify(data));
                }
            },
            paypalRedirect: function (api, messageHandlers, data) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.paypalRedirect.postMessage(data)
                } else {
                    api.executeXMLHttpPostRequest('/apps/web_native_bridge/paypal_redirect', JSON.stringify(data));
                }
            },
            trackIDFASuccess: function (api, messageHandlers, success) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.trackIDFASuccess.postMessage(success)
                } else {
                    if (success) {
                        api.executeXMLHttpPostRequest('/apps/web_native_bridge/idfa_tracking_successful', null)
                    } else {
                        api.executeXMLHttpPostRequest('/apps/web_native_bridge/idfa_tracking_failed', null)
                    }
                }
            },
            trackAdjust: function (api, messageHandlers, data) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.trackAdjust.postMessage(data)
                } else {
                    api.executeXMLHttpPostRequest('/apps/web_native_bridge/track_adjust', JSON.stringify(data));
                }
            },
            trackFirebase: function (api, messageHandlers, data) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.trackFirebase.postMessage(data)
                }
            },
            shareNative: function (api, messageHandlers, data) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.shareNative.postMessage(data);
                } else {
                    api.executeXMLHttpPostRequest('/apps/web_native_bridge/share_native', JSON.stringify(data));
                }
            },
            onOrderConfirmed: function (api, messageHandlers) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), MIN_IOS_VERSION_ON_ORDER_CONFIRMED)) {
                    messageHandlers.onOrderConfirmed.postMessage({});
                }
            },
            onConsentGenerationFinish: function (api, messageHandlers) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
                    messageHandlers.onConsentGenerationFinish.postMessage({});
                }
            },
        },

        registerEventHandlers: function () {
            var self = this;

            if (this.runningInApp()) {
                if (self.appType() === ftapps.platform.ios && self.compareVersionsGreaterEqual(this.appVersion(), '7.5.4')) {
                    deps.document.addEventListener('wishlist.changed', function () {
                        self.iosCallbacks.wishlistChanged(self, deps.webkitMessageHandlers);
                    });
                    deps.document.addEventListener('basket.changed', function () {
                        self.iosCallbacks.basketChanged(self, deps.webkitMessageHandlers);
                    });
                }

                if (self.appType() === ftapps.platform.android && deps.appsAndroid) {
                    if (deps.appsAndroid.basketAmountChanged && deps.appsAndroid.wishlistAmountChanged) {
                        // new app version supports separate events in javascript callbacks
                        deps.document.addEventListener('basket.changed', function () {
                            deps.appsAndroid.basketAmountChanged();
                        });
                        deps.document.addEventListener('wishlist.changed', function () {
                            deps.appsAndroid.wishlistAmountChanged();
                        });
                    }
                }
            }
        },

        registerEventQBus: function () {
            var self = this;
            if (deps.eventQBus !== undefined && this.runningInApp()) {
                deps.eventQBus.on("ft-apps.firebase.eventTracking", function (data) {
                    self.trackFirebase(data);
                });
                deps.eventQBus.on("ft1.order-core.orderSuccessful", function () {
                    self.onOrderConfirmed();
                });
            }
        },

        runningInApp: function () {
            return this.splitCookies().filter(function (cookie) {
                return cookie === 'app=true';
            }).length === 1;
        },

        splitCookies: function () {
            return deps.document.cookie.split('; ');
        },

        autofillLoginCredentials: function (account, password) {
            deps.document.querySelector('input[name="username"]').value = account;
            deps.document.querySelector('input[name="password"]').value = password;
        },

        grantPriceAlertPermission: function (frontendToken, grantedCallbackPathAndName, notGrantedCallbackPathAndName) {
            if (this.appType() === ftapps.platform.android && deps.appsAndroid && deps.appsAndroid.grantPriceAlertPermission) {
                deps.appsAndroid.grantPriceAlertPermission(frontendToken, grantedCallbackPathAndName, notGrantedCallbackPathAndName);
            } else if (this.appType() === ftapps.platform.ios) {
                this.iosCallbacks.grantPriceAlertPermission(this, deps.webkitMessageHandlers, frontendToken, grantedCallbackPathAndName, notGrantedCallbackPathAndName);
            }
        },

        collectArticleDetails: function () {
            var result = {'@context': 'http://schema.org', '@type': 'Product'},
                brand = deps.document.querySelector('[itemprop="brand"]'),
                ratingValue = deps.document.querySelector('[itemprop="ratingValue"]');
            reviewCount = deps.document.querySelector('[itemprop="reviewCount"]');
            meta = deps.document.getElementsByTagName('meta');

            if (brand) {
                result['brand'] = brand.innerText
            }

            if (ratingValue || reviewCount) {
                result['aggregateRating'] = {
                    '@type': 'AggregateRating'
                };

                if (ratingValue) {
                    result['aggregateRating']['ratingValue'] = ratingValue.getAttribute("content");
                }

                if (reviewCount) {
                    result['aggregateRating']['ratingCount'] = reviewCount.getAttribute("content");
                }
            }

            for (var i = 0; i < meta.length; i++) {
                var property = meta[i].getAttribute('property');
                if (property === 'og:description') {
                    result['description'] = meta[i].getAttribute('content');
                } else if (property === 'og:image') {
                    result['image'] = meta[i].getAttribute('content');
                } else if (property === 'og:url') {
                    result['url'] = meta[i].getAttribute('content');
                    result['@id'] = result['url'];
                } else if (property === 'og:title') {
                    result['name'] = meta[i].getAttribute('content');
                }
            }

            if (this.appType() === ftapps.platform.ios && this.compareVersionsGreaterEqual(this.appVersion(), '7.8.1')) {
                this.iosCallbacks.collectArticleDetails(this, deps.webkitMessageHandlers, result);
            } else {
                return JSON.stringify(result)
            }
        },

        paypalRedirect: function (data) {
            var url = data['url'];
            if (api.appType() === ftapps.platform.android && deps.appsAndroid && deps.appsAndroid.paypalRedirect && url) {
                deps.appsAndroid.paypalRedirect(url);

            } else if (api.appType() === ftapps.platform.ios && url) {
                this.iosCallbacks.paypalRedirect(this, deps.webkitMessageHandlers, data);
            }
        },

        closePaypal: function (data) {
            var url = data['url'];
            if (url) {
                if (api.runningInApp()) {
                    deps.htmlLocation.href = url;
                } else {
                    deps.htmlLocation.href = url.replace('https://', 'otto://');
                }
            }
        },

        trackGAID: function (gaid) {
            // no-op because old apps don't honor google policy, see https://qspa.otto.de/jira/browse/PAPP-12167
        },

        trackGAIDHonoringPreference: function (gaid) {
            try {
                deps.lhotseExactag.data.apps = {'gaid': gaid};
                deps.exactag.track(deps.lhotseExactag.data);
            } catch (e) {
                if (api.appType() === ftapps.platform.android && deps.appsAndroid) {
                    deps.appsAndroid.reportTrackGAIDFailure(e);
                }
            }
        },

        trackIDFA: function (idfa) {
            try {
                deps.lhotseExactag.data.apps = {'idfa': idfa};
                deps.exactag.track(deps.lhotseExactag.data);

                if (this.appType() === ftapps.platform.ios && this.compareVersionsGreaterEqual(this.appVersion(), '7.8.1')) {
                    this.iosCallbacks.trackIDFASuccess(this, deps.webkitMessageHandlers, true)
                } else {
                    return true
                }
            } catch (e) {
                if (this.appType() === ftapps.platform.ios && this.compareVersionsGreaterEqual(this.appVersion(), '7.8.1')) {
                    this.iosCallbacks.trackIDFASuccess(this, deps.webkitMessageHandlers, false)
                } else {
                    return false
                }
            }
        },

        trackAdjust: function (adjustPayloadJSON) {
            if (adjustPayloadJSON !== null && (typeof adjustPayloadJSON === 'object') && this.runningInApp() && this.allowTrackingBasedOnCookieBanner()) {
                if (this.appType() === ftapps.platform.android && deps.appsAndroid && deps.appsAndroid.trackAdjust) {
                    var payloadJSON = JSON.stringify(adjustPayloadJSON);
                    deps.appsAndroid.trackAdjust(payloadJSON);
                } else if (this.appType() === ftapps.platform.ios && this.compareVersionsGreaterEqual(this.appVersion(), '7.5.0')) {
                    this.iosCallbacks.trackAdjust(this, deps.webkitMessageHandlers, adjustPayloadJSON)
                }
            }
        },

        trackFirebase: function (firebasePayloadJSON) {
            if (firebasePayloadJSON !== null && (typeof firebasePayloadJSON === 'object') && this.runningInApp() && this.allowTrackingBasedOnCookieBanner()) {
                var eventParams = firebasePayloadJSON["event_params"];
                var error = {};

                if (!(deps.firebaseEventNameKey in firebasePayloadJSON)) {
                    error["event_name"] = 'event name is missing'
                    firebasePayloadJSON['validation_error'] = error
                    callFirebaseBridge(firebasePayloadJSON);
                    return
                }

                if (eventParams !== null && (typeof eventParams) === 'object') {
                    if (deps.firebaseParameterKey.kFIRParameterItemID in eventParams) {
                        var actualType = typeof eventParams[deps.firebaseParameterKey.kFIRParameterItemID]
                        validateParameterType(deps.firebaseParameterKey.kFIRParameterItemID, 'string', actualType, error)
                    }
                    if (deps.firebaseParameterKey.kFIRParameterItemName in eventParams) {
                        var actualType = typeof eventParams[deps.firebaseParameterKey.kFIRParameterItemName]
                        validateParameterType(deps.firebaseParameterKey.kFIRParameterItemName, 'string', actualType, error)
                    }

                    if (deps.firebaseParameterKey.kFIRParameterItemCategory in eventParams) {
                        var actualType = typeof eventParams[deps.firebaseParameterKey.kFIRParameterItemCategory]
                        validateParameterType(deps.firebaseParameterKey.kFIRParameterItemCategory, 'string', actualType, error)

                    }

                    if (deps.firebaseParameterKey.kFIRParameterQuantity in eventParams) {
                        var actualType = typeof eventParams[deps.firebaseParameterKey.kFIRParameterQuantity]
                        validateParameterType(deps.firebaseParameterKey.kFIRParameterQuantity, 'number', actualType, error)
                    }
                }

                if (Object.getOwnPropertyNames(error).length !== 0) {
                    firebasePayloadJSON['validation_error'] = error
                }

                callFirebaseBridge(firebasePayloadJSON);
            }
        },
        onOrderConfirmed: function () {
            if (api.appType() === ftapps.platform.android && deps.appsAndroid && deps.appsAndroid.onOrderConfirmed) {
                deps.appsAndroid.onOrderConfirmed();
            } else if (api.appType() === ftapps.platform.ios && api.compareVersionsGreaterEqual(api.appVersion(), MIN_IOS_VERSION_ON_ORDER_CONFIRMED)) {
                api.iosCallbacks.onOrderConfirmed(api, deps.webkitMessageHandlers);
            }
        },
        _window: this,
        cmp: {
            acceptConsents: function () {
                if (api._window && api._window.cookieBanner && api._window.cookieBanner.accept) {
                    api._window.cookieBanner.accept().then(
                        () => consentGenerationBridge(),
                        () => consentGenerationBridge()
                    )
                    ;
                    return true;
                }
                return false;
            },
            rejectConsents: function () {
                if (api._window && api._window.cookieBanner && api._window.cookieBanner.reject) {
                    api._window.cookieBanner.reject().then(
                        () => consentGenerationBridge(),
                        () => consentGenerationBridge()
                    );
                    return true;
                }
                return false;
            }
        }
    };

    function validateParameterType(parameter, expectedType, actualType, errorObject) {
        if (expectedType !== actualType) {
            errorObject[parameter] = "expected ".concat(expectedType).concat(" but received ").concat(actualType)
        }
    }

    function callFirebaseBridge(firebasePayloadJSON) {
        if (api.appType() === ftapps.platform.android && deps.appsAndroid && deps.appsAndroid.trackFirebase) {
            var payloadJSON = JSON.stringify(firebasePayloadJSON);
            deps.appsAndroid.trackFirebase(payloadJSON);
        } else if (api.appType() === ftapps.platform.ios && api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
            api.iosCallbacks.trackFirebase(api, deps.webkitMessageHandlers, firebasePayloadJSON)
        }
    }

    function consentGenerationBridge() {
        if (api.appType() === ftapps.platform.android && deps.appsAndroid && deps.appsAndroid.onConsentGenerationFinish) {
            deps.appsAndroid.onConsentGenerationFinish();
        } else if (api.appType() === ftapps.platform.ios && api.compareVersionsGreaterEqual(api.appVersion(), '8.0.0')) {
            api.iosCallbacks.onConsentGenerationFinish(api, deps.webkitMessageHandlers)
        }
    }

    if (featureToggle.shareNative && api.runningInApp()) {
        if (api.appType() === ftapps.platform.ios) {
            api.shareNative = function (data) {
                if (api.compareVersionsGreaterEqual(api.appVersion(), '7.4.0')) {
                    if (data["type"] === null) {
                        data["type"] = "";
                    }
                    this.iosCallbacks.shareNative(this, deps.webkitMessageHandlers, data)
                }
            }
        } else if (api.appType() === ftapps.platform.android) {
            api.shareNative = function (data) {
                if (deps.appsAndroid
                    && api.compareVersionsGreaterEqual(api.appVersion(), '6.7.0')) {
                    deps.appsAndroid.shareNative(data.url, data.type);
                }
            }
        }
    }

    api.registerEventHandlers();
    api.registerEventQBus();

    return api;
};
