import {initPromoStaticpromo} from "./init";

(function () {
    const LOAD_PRIO = 95;

    window.o_global.eventLoader.onLoad(LOAD_PRIO, () => {
        initPromoStaticpromo();
    });
})();
