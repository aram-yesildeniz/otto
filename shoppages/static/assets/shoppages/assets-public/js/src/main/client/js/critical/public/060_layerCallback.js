'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.layer = (() => {
    function init () {
        o_shoppages.accordion.init();
        o_shoppages.expander.init();
    }

    return {
        init
    };
})();
