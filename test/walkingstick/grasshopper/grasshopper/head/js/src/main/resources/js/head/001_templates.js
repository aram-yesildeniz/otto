/*jslint white: true */
/*global o_util, o_san, Promise
 */

var o_san = window.o_san || {};

o_san.templates = o_san.templates || (function (cache) {
    'use strict';

    var TEMPLATE_URL = "/san/resources/templates/",

        templateResponseHandler = function (xhr) {
            return xhr.status === 200 ?
                xhr.response || xhr.responseText || Promise.reject(new Error("No template found")) :
                Promise.reject(new Error("received status code ", xhr.status));
        },

        retrieveTemplate = function (name) {
            return o_util.ajax.get(TEMPLATE_URL + name)
                .then(templateResponseHandler);
        };

    return new cache.Cache(retrieveTemplate);
}(o_san.cache));
