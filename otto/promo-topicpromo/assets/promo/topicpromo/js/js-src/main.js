import {Logger} from "./logger";
import PromoTopicPromo  from "./promo_topicpromo";

(function () {
    const LOAD_PRIO = 96;

    window.o_global.eventLoader.onAllScriptsExecuted(LOAD_PRIO, () => {
        Logger.group("[FT3 promo topicpromo]");
        Logger.count("Topicpromo Invocation");

        const containers = document.querySelectorAll('.promo_topicpromo--container');

        [].forEach.call(containers, container => {
            if (container.getAttribute("data-tracked") !== "true") {
                container.setAttribute("data-tracked", "true");
                new PromoTopicPromo(container);
            }
        });

        Logger.groupEnd();
    });
})();