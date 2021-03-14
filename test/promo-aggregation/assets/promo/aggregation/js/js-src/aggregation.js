import {Logger} from "./logger";

export class Aggregation {
    loadAllTheModules(container) {
        const allModules = container.querySelectorAll("[data-module-url]");

        if (window.o_global.debug.status().activated) {
            Aggregation.report(container);
        }
        [].forEach.call(allModules, (module) => {
            let url = module.getAttribute("data-module-url");

            o_util.ajax({
                "url": url,
                "method": "GET",
                "headers": window.o_promo_aggregation && window.o_promo_aggregation.headers || {},
                "timeout": 7500
            }, response => {
                if (response.status === 200) {
                    const docFragment = o_util.dom.stringToDocumentFragment(response.responseText);
                    if (docFragment !== undefined && docFragment !== null) {
                        let asyncContainer = module.parentNode;
                        if (asyncContainer) {
                            asyncContainer.replaceChild(docFragment, module);
                            if (asyncContainer.querySelectorAll("script").length > 0) {
                                Logger.warn(`executeInlineScript for module: ${asyncContainer.getAttribute("data-module-type")}`);
                                o_util.hardcore.executeInlineScripts(asyncContainer);
                            }
                            Logger.log(`preload_polyfill_invoke for module: ${asyncContainer.getAttribute("data-module-type")}`);
                            preload_polyfill_invoke(asyncContainer);
                        }
                    }
                } else {
                    module.parentNode.removeChild(module);
                }
            });
        });
    }

    static report(container) {
        let prefetched_modules = container.querySelectorAll(".promo-module-prefetched");
        let async_modules = container.querySelectorAll(".promo-module-async");

        function extractModuleType() {
            return value => {
                return value.getAttribute("data-module-type");
            };
        }

        let async_module_types = [].map.call(async_modules, extractModuleType());
        let prefetched_module_types = [].map.call(prefetched_modules, extractModuleType());
        Logger.group("[FT3 promo aggregation]");
        Logger.info("%cModule Aggregation", "font-weight: bold; color:red");
        Logger.info("%cPrefetched", "font-weight: bold; color:red");
        Logger.table(prefetched_module_types);
        Logger.info("%cAsynchronously loaded", "font-weight: bold; color:red");
        Logger.table(async_module_types);
        Logger.groupEnd();
    }

    setCookie(cookieKey, cookieValue, expireSeconds) {
        const d = new Date();
        d.setTime(d.getTime() + expireSeconds * 1000);
        const expires = "expires=" + d.toUTCString();
        document.cookie = cookieKey + "=" + cookieValue + ";" + expires + ";path=/; secure";
    }

    init() {
        if(window.o_promo_aggregation && window.o_promo_aggregation.cookie) {
            const cookie = window.o_promo_aggregation.cookie;
            this.setCookie(cookie.key, cookie.value, cookie.expireSeconds);
        }
        this.loadAllTheModules(document.getElementsByClassName("promo-module-container")[0]);
    }
}
