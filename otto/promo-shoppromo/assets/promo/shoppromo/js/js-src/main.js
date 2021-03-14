import {
    initCarouselsForLargeShopPromos,
    initCinemasForSmallShopPromos,
    initPromoBrandShopPromo
} from './init';
import {Logger} from "./logger";

(function () {
    const LOAD_PRIO = 95;

    window.o_global.eventLoader.onAllScriptsExecuted(LOAD_PRIO, () => {
        Logger.group("[FT3 promo shoppromo]");
        Logger.count("Shoppromo Invocation");
        initPromoBrandShopPromo();
        initCinemasForSmallShopPromos();
        initCarouselsForLargeShopPromos();
        Logger.groupEnd();
    });
})();