import {ExternalContentLoader} from './external_content_loader';
import {initPromoStaticcontent} from "./init";

(function () {
    const LOAD_PRIO = 95;

    window.o_global.eventLoader.onAllScriptsExecuted(LOAD_PRIO, () => {
        initPromoStaticcontent();
        new ExternalContentLoader().loadAllContent();
    });
})();
