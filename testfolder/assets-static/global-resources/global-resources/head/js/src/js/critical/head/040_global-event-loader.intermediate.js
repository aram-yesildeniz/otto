(function () {
    'use strict';

    /**
     * Used to create singleton store for EventLoader
     */
    class EventLoaderStore {
        constructor() {
            this.onReadyQueue = [];
            this.onLoadQueue = [];
            this.allScriptsExecutedQueue = [];
        }
        get onReadyFired() {
            return !!this.onReadyEvent;
        }
        get onLoadFired() {
            return !!this.onLoadEvent;
        }
        get allScriptsExecutedFired() {
            return !!this.allScriptsExecutedEvent;
        }
    }

    /* eslint-disable no-param-reassign */
    /**
     * Sort a given array of objects ascending by their priority value.
     * Modifies the original Array due to copy by reference.
     *
     * @param queue Array of objects to sort.
     *
     * @return Sorted array.
     */
    function sortByPriority(queue) {
        return queue.sort((a, b) => {
            return a.priority - b.priority;
        });
    }
    /**
     * Abstract handling of onReadyQueue, due to multiple occurrences.
     */
    function handleOnReady(ev) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
        const store = getStore();
        store.onReadyEvent = ev || {};
        store.onReadyQueue = sortByPriority(store.onReadyQueue);
        store.onReadyQueue.forEach((c) => c.fn(store.onReadyEvent));
    }
    /**
     * Handle functions registered on "document ready".
     */
    function initOnReady() {
        document.addEventListener("DOMContentLoaded", handleOnReady, false);
    }
    let oldOnLoadFunction;
    /**
     * Encapsulate functionality that will be executed on window.onload.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleOnLoad(ev) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
        const store = getStore();
        if (oldOnLoadFunction) {
            oldOnLoadFunction.call(this, ev);
        }
        store.onLoadEvent = ev || {};
        store.onLoadQueue = sortByPriority(store.onLoadQueue);
        store.onLoadQueue.forEach((c) => c.fn(store.onLoadEvent));
    }
    /**
     * Handle functions registered on window.onload.
     * Preserves prior window.onload functions.
     */
    function initOnLoad() {
        oldOnLoadFunction = window.onload;
        window.onload = handleOnLoad;
    }
    function handleOnAllScripts(ev) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
        const store = getStore();
        store.allScriptsExecutedEvent = ev || {};
        store.allScriptsExecutedQueue = sortByPriority(store.allScriptsExecutedQueue);
        store.allScriptsExecutedQueue.forEach((c) => c.fn(store.allScriptsExecutedEvent));
    }
    /**
     * Handle functions registered on AllScriptsExecuted.
     * Preserves prior AllScriptsExecuted functions.
     */
    function initOnAllScriptsExecuted() {
        document.addEventListener("AllScriptsExecuted", handleOnAllScripts, false);
    }
    /**
     * Returns globally registered event loader store
     */
    function getStore() {
        if (!window.o_global) {
            window.o_global = {};
        }
        if (!window.o_global.eventLoaderStore) {
            const store = new EventLoaderStore();
            initOnReady();
            initOnLoad();
            initOnAllScriptsExecuted();
            window.o_global.eventLoaderStore = store;
        }
        return window.o_global.eventLoaderStore;
    }

    /**
     * Class to handle global onReady and onLoad functions in a specific priority order.
     */
    class EventLoader {
        constructor() {
            /**
             * Store of event loader
             */
            this.store = getStore();
        }
        /**
         * Add a function to the queue that will be execute on "document ready".
         * Executes the function directly if the document.readystatechange event was already fired.
         *
         * @param priority Priority number to sort out execution order.
         * @param fn Function that will be trigger on "document ready".
         */
        onReady(priority, fn) {
            if (!this.store.onReadyFired) {
                this.store.onReadyQueue.push({ priority, fn });
            }
            else {
                fn(this.store.onReadyEvent);
            }
        }
        /**
         * Add a function to the queue that will be execute on window.onload.
         * Executes the function directly if the onload event was already fired.
         *
         * @param priority Priority number to sort out execution order.
         * @param fn Function that will be trigger on load.
         */
        onLoad(priority, fn) {
            if (!this.store.onLoadFired) {
                this.store.onLoadQueue.push({ priority, fn });
            }
            else {
                fn(this.store.onLoadEvent);
            }
        }
        /**
         * Add a function to the queue that will be execute on allScriptsExecuted.
         * Executes the function directly if the onAllScriptsExecuted event was already fired.
         *
         * @param priority Priority number to sort out execution order.
         * @param fn Function that will be trigger on allScriptsExecuted.
         */
        onAllScriptsExecuted(priority, fn) {
            if (!this.store.allScriptsExecutedFired) {
                this.store.allScriptsExecutedQueue.push({ priority, fn });
            }
            else {
                fn(this.store.allScriptsExecutedEvent);
            }
        }
    }
    /**
     * Creates new Instance of EventLoader
     * @returns new Instance of EventLoader
     */
    function eventLoader() {
        return new EventLoader();
    }

    window.o_global = window.o_global || {};
    window.o_global.EventLoader = EventLoader;
    window.o_global.eventLoader = eventLoader();
    /**
     * Queue all registered functions to be handled as window.onload event handler.
     * @param {Function} func   Function to be queued to window.onload.
     */
    window.o_global.onloadHandler =
        window.o_global.onloadHandler ||
            ((func) => window.o_global.eventLoader.onLoad(100, func));

}());
