/*jslint white: true */

var o_san = window.o_san || {};

o_san.cache = o_san.cache || (function () {
    'use strict';

    /**
     * Supplies the value for the given key.
     *
     * @name valueSupplier
     * @param {string} key the key
     * @returns {any} the data for the key
     */
    /**
     * Creates a new Cache.
     *
     * @param {valueSupplier} valueFn the value supplier function
     * @constructor
     */
    var Cache = function (valueFn) {
        this.valueFn = valueFn;
        return this.clear();
    };

    /**
     * Clears any cached data.
     * @return {Cache} the cache for method chaining
     */
    Cache.prototype.clear = function () {
        this.cache = {};
        return this;
    };

    /**
     * Evaluates the Caches's value supplier for the given key and caches the result.
     * @param key the key
     * @return {any} the data for the key
     */
    Cache.prototype.store = function (key) {
        var value = this.valueFn(key);
        this.cache[key] = value;
        return value;
    };

    /**
     * Returns the data for the given key using the value supplier if needed.
     *
     * @param key the key
     * @return {any} the data for the key
     */
    Cache.prototype.get = function (key) {
        return this.cache[key] || this.store(key);
    };

    return {
        Cache: Cache
    };
}());
