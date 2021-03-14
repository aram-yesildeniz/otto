'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.accordion = (() => {
    function openByHash () {
        const hash = window.location.hash;
        if (hash === null || !hash.match(/^#(\w+)/)) {
            return false;
        }
        const element = document.getElementById(RegExp.$1);
        if (element === null) {
            return false;
        }
        if (element.classList.contains('js_shoppages_accordion') &&
            element.classList.contains('p_accordion__header') && element.parentElement !== null &&
            element.parentElement.classList.contains('p_accordion--1st')) {
            element.classList.add('p_accordion__header--open');
            return true;
        }
        return false;
    }

    function handlePageLoad () {
        if (!openByHash()) {
            const accordion_header = document.querySelector('dl.p_accordion100 .js_shoppages_accordion.p_accordion__header');
            if (accordion_header !== null) {
                accordion_header.classList.add('p_accordion__header--open');
            }
        }
    }

    function initEventHandler () {
        if (!window.shoppagesAccordionInitialized) {
            window.shoppagesAccordionInitialized = true;
            window.addEventListener('hashchange', openByHash);
        }
    }

    function init () {
        handlePageLoad();
        initEventHandler();
    }

    return {
        init,
        handlePageLoad
    };
})();

o_global.eventLoader.onLoad(100, () => {
    o_shoppages.accordion.init();
});
