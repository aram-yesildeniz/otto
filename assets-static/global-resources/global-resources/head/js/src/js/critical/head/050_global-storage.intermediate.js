(function () {
    'use strict';

    /**
     * This schould not be exposed externally
     * @param storage
     */
    function checkStorage(storage) {
        if (storage) {
            try {
                storage.setItem("storageTest", "test");
                storage.getItem("storageTest");
                storage.removeItem("storageTest");
                return storage;
            }
            catch (_a) {
                /* do nothing */
            }
        }
        return undefined;
    }
    /**
     * Wrapper class for securely accessing webstorage.
     * Provides W3C compliant API to access localStorage or sessionStorage.
     * Additionally adds meaningful return values, e.g. for setItem and
     * removeItem to check if operation was successful.
     *
     * see: <https://developer.mozilla.org/de/docs/Web/API/Storage>
     *
     * @example
     *
     * ```ts
     * const storage = new GlobalStorage(window.localStorage);
     * storage.getItem("foo-bar");
     * ```
     */
    class GlobalStorage {
        /**
         * Creates an instance of storage class.
         *
         * @param storageObjectOrFunction
         * Could be either localStorage or sessionStorage object depending on what
         * one wants to use. Or even a function which returns the desired storage
         */
        constructor(storageObjectOrFunction) {
            var _a, _b;
            // Will not work in app and on some safaris
            if (((_b = (_a = window.o_util) === null || _a === void 0 ? void 0 : _a.cookie) === null || _b === void 0 ? void 0 : _b.exists("app")) &&
                navigator.userAgent.indexOf("OS 11_3 like Mac OS X") !== -1) {
                return;
            }
            // Try to evaluate given function expression to prevent
            // raised exceptions in modules using storage wrapper.
            // Use regular param otherwise.
            if (typeof storageObjectOrFunction === "function") {
                try {
                    this.storage = storageObjectOrFunction();
                }
                catch (_c) {
                    /* do nothing */
                }
            }
            else {
                this.storage = storageObjectOrFunction;
            }
            this.storage = checkStorage(this.storage);
        }
        /**
         * Indicates whether storage interface is available
         */
        get isAvailable() {
            return !!this.storage;
        }
        /**
         * Returns count of items stored in the storage.
         * if storage is not available the result is undefined
         */
        get length() {
            // This will fix firefox bug with wrong length
            return this.storage ? Object.keys(this.storage).length : undefined;
        }
        /**
         * Determine reliably if the storage does not only exists, but is also usable.
         * Background: Safari on iOS/OSX [storage].setItem throws Quota-Exception in private mode.
         *
         * @return Determines if the chosen webstorage is available.
         */
        isStorageAvailable() {
            return !!checkStorage(this.storage);
        }
        /**
         * Returns key name of the item at index position in the storage
         * @param index
         * @returns key name or null in case item does not exist
         */
        key(index) {
            return this.storage ? this.storage.key(index) : null;
        }
        /**
         * Saves an item to localStorage.
         *
         * @param key      Storage key.
         * @param value    Value to be stored.
         *
         * @return true, if the item was saved successfully.
         */
        setItem(key, value) {
            var _a, _b;
            if (this.storage && arguments.length === 2) {
                try {
                    this.storage.setItem(key, value);
                    return !!this.storage.getItem(key);
                }
                catch (e) {
                    // Log exception to splunk for further analysis.
                    if (typeof ((_b = (_a = window.AS) === null || _a === void 0 ? void 0 : _a.RUM) === null || _b === void 0 ? void 0 : _b.sendCustomRequest) === "function") {
                        window.AS.RUM.sendCustomRequest("localStorageError", {
                            message: `${e.toString()} | ${window.location.href} | ${navigator.userAgent}`,
                        });
                    }
                }
            }
            return false;
        }
        /**
         * Return the value of an item in storage, null if no item was found.
         *
         * @param key Item key that should be retrieved.
         * @return The value of the item.
         */
        getItem(key) {
            if (this.storage) {
                return this.storage.getItem(key);
            }
            return null;
        }
        /**
         * Delete an item from storage.
         *
         * @param key This storage item should be removed.
         * @return Always return "true" if the given item doesn't exist in storage anymore.
         */
        removeItem(key) {
            if (this.storage && !!key) {
                this.storage.removeItem(key);
                return !this.storage.getItem(key);
            }
            return false;
        }
        /**
         * Caution: will delete ALL items in storage!
         *
         * @return true, if the clear was successfully and all items were deleted.
         */
        clear() {
            if (this.storage && this.length !== undefined) {
                // Iterate over the storage and remove all items.
                Object.keys(this.storage).forEach((k) => this.removeItem(k));
                // Test if all storage item were really removed.
                return this.length < 1;
            }
            return false;
        }
        /**
         * Accepts a data object, which will be stringified and stored in the storage
         * use getData to retrieve it back.
         *
         * This methond is not part of the storage api.
         *
         * @template T type of the data object is inferred from parameter
         * @param key Storage key.
         * @param data value to be stored
         * @returns true if data
         */
        setJson(key, data) {
            try {
                return this.setItem(key, JSON.stringify(data));
            }
            catch (_a) {
                return false;
            }
        }
        /**
         * Gets json data from the storage identitifed by key.
         * The data item will be parsed from JSON into an object and given back
         *
         * This methond is not part of the storage api.
         *
         * @template T
         * @param key
         * @returns data retrieved from storage and parsed with JSON.parse
         *
         * @example
         *
         * ```ts
         * const data = storage.getData<MyDataStructure>("myData");
         *
         * // Data is now of type: MyDataStructure
         * ```
         */
        getJson(key) {
            try {
                const item = this.getItem(key);
                return item ? JSON.parse(item) : null;
            }
            catch (_a) {
                return null;
            }
        }
    }

    // Export Debug functionality to global namespace.
    window.o_global = window.o_global || {};
    window.o_global.Storage = window.o_global.Storage || GlobalStorage;

}());
