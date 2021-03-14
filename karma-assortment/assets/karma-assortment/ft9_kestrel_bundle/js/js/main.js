import {initCarouselsForAssortment} from './init';

(function () {
    const LOAD_PRIO = 96;

    window.o_global.eventLoader.onAllScriptsExecuted(LOAD_PRIO, () => {
        initCarouselsForAssortment();
    });
})();