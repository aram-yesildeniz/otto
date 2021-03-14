(function () {
    'use strict';

    /**
     * Binding function to its proper context, e.g. to handle events, timeouts etc.
     *
     * @example bind(fnThis, fn);
     *
     * @param fnThis Context object that has to be bound.
     * @param fn Function the context object will be bound to.
     *
     * @return Function with "magically" new "this"-context.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function bind(fnThis, fn) {
        return (...args) => {
            // eslint-disable-next-line prefer-rest-params
            return fn.apply(fnThis, args);
        };
    }
    /**
     * Convert a namespace string to an actually executable function object.
     *
     * @example
     * // Turn a namespace string to an executable function and execute it right away.
     * // Will virtually result in something like window.AS.RUM.cheers().
     * convertStringToFunction("AS.RUM.cheers", window)();
     *
     * @param functionName Namespace of the function to execute.
     * @param context Context for the function, usually window.
     *
     * @return Returns the converted function.
     */
    function convertStringToFunction(functionName, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context) {
        const namespaces = functionName.split(".");
        const func = namespaces.pop();
        let part = context;
        for (let i = 0, len = namespaces.length; i < len; i += 1) {
            part = part[namespaces[i]];
        }
        return part[func];
    }
    /**
     * Clones a given object. Necessary due to "copy by reference" nature of JavaScript.
     *
     * @param object Object that will be cloned.
     * @return Actually the cloned object.
     *
     * @example
     *
     * const newObject = core.clone(obj);
     */
    function clone(object) {
        // @todo remove after we drop support for iOS 5.1
        /* istanbul ignore if */
        if (!Object.create) {
            Object.create = function createPolyfil(o) {
                /**
                 * Dummy function.
                 *
                 * @constructor
                 */
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
                function F() { }
                F.prototype = o;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return new F();
            };
        }
        return Object.create(object);
    }
    /**
     * Merges two simple objects.
     *
     * @param object1 Base object.
     * @param object2 Object that should be merged to obj1.
     * @param [overwrite] Flag that determines if properties in obj1 will be overwritten with obj2. Default: true.
     * @param [cloneObj] Determines if the original object will be cloned or not.
     *
     * @return Merged object consisting of properties of obj1 base object and obj2.
     *
     * @example
     *
     * ```ts
     * // Basic usage:
     * const mergedObj = core.extend(obj1, obj2);
     *
     * // Prevent properties of obj1 being overwritten by obj2.
     * const mergedObj = core.extend(obj1, obj2, false);
     *
     * // Merge objects by creating a true copy of obj1.
     * // obj1 will NOT be modified.
     * const mergedObj = core.extend(obj1, ob2, null, true);
     * ```
     */
    function extend(object1, object2, overwrite, cloneObj) {
        const replace = typeof overwrite === "boolean" ? overwrite : true;
        const doClone = typeof cloneObj === "boolean" ? cloneObj : false;
        const result = doClone ? clone(object1) : object1;
        Object.keys(object2 || {}).forEach((key) => {
            if (replace || !(key in result)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                result[key] = object2[key];
            }
        });
        return result;
    }
    /**
     * Verify if given object is a plain JavaScript object.
     * Especially important to differentiate host objects from "plain objects" in legacy browsers where object prototype
     * of host objects is [object Object] instead of [object Window] for example.
     *
     * @param object Value to prove.
     *
     * @return Is object (the function parameter) a plain JavaScript object?
     */
    function isPlainObject(object) {
        return (!!object &&
            Object.prototype.toString.call(object) === "[object Object]" &&
            !object.nodeType &&
            object !== object.window);
    }
    /**
     * Verify if given object is an empty JavaScript object (contains no enumerable properties).
     * Optionally use inherited properties from prototype chain.
     *
     * The argument should always be a plain JavaScript Object as other types of object (DOM elements, primitive strings/numbers,
     * host objects) may not give consistent results across browsers.
     *
     * @param object Test object.
     * @param [inherited] Use inheritence chain to check for properties. Default: false.
     *
     * @return Is object (the function parameter) an empty JavaScript object?
     */
    function isEmptyObject(object, inherited) {
        const properties = [];
        if (!inherited) {
            return Object.keys(object).length === 0;
        }
        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (const prop in object) {
            properties.push(prop);
        }
        return Object.keys(properties).length === 0;
    }
    /**
     * Convert an array-like object, e.g. HTMLCollection or NodeList,
     * to an actual array.
     *
     * @param object Array-like object to convert to an array.
     *
     * @return An actual iterable Array.
     *
     * @example
     *
     * ```ts
     *
     * // Make the HTMLCollection returned by document.getElementsByClassName iterable.
     * const elements = core.toArray(document.getElementsByClassName("myClass"));
     *
     * elements.forEach(function(elem) {
     *     console.log(elem);
     * });
     * ```
     */
    function toArray(object) {
        const array = [];
        for (let i = object.length - 1; i >= 0; i -= 1) {
            array[i] = object[i];
        }
        return array;
    }
    /**
     * Removes part of an Array.
     *
     * @param originalArray Array from which the elements will be removed.
     * @param from Numeric index to start of part to remove.
     * @param [to] End of part to remove.
     *
     * @return Shrinked array which excludes the range of items that war deleted.
     *
     * @example
     *
     * ```ts
     * const arr = ["a", "b", "c", "d", "e"];
     * core.removeFromArray(arr, 1, 3); // arr -> ["a", "e"]
     * ```
     */
    function removeFromArray(originalArray, from, to) {
        const rest = originalArray.slice((to || from) + 1 || originalArray.length);
        // eslint-disable-next-line no-param-reassign
        originalArray.length = from < 0 ? originalArray.length + from : from;
        // eslint-disable-next-line prefer-spread
        originalArray.push.apply(originalArray, rest);
        return originalArray;
    }
    /**
     * Transforms an object into an URL paramater format as string
     *
     * @param obj The object to be serialized
     * @returns The resulting, serialized object as string
     */
    function serialize(obj) {
        if (typeof obj === "object") {
            return Object.keys(obj)
                .map((key) => {
                return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
            })
                .join("&")
                .replace(/%20/g, "+");
        }
        return undefined;
    }
    /**
     * Transforms form data into an URL parameter format as string
     *
     * @param form The form to be serialized
     * @returns The resulting, serialized formular data as string
     */
    function serializeForm(form) {
        const isSelect = (element) => {
            return element.type === "select-multiple";
        };
        const isValid = (element) => {
            return (!!element.name &&
                !element.disabled &&
                element.type !== "submit" &&
                element.type !== "reset" &&
                element.type !== "button" &&
                element.type !== "file");
        };
        const isDefault = (element) => {
            return ((element.type !== "radio" && element.type !== "checkbox") ||
                element.checked);
        };
        const combine = (k, v) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
        const data = [];
        if (typeof form === "object" && form.nodeName === "FORM") {
            [].forEach.call(form.elements, (element) => {
                if (isValid(element)) {
                    if (isSelect(element)) {
                        [].forEach.call(element.options, (option) => {
                            if (option.selected) {
                                data[data.length] = combine(element.name, option.value);
                            }
                        });
                    }
                    else if (isDefault(element)) {
                        data[data.length] = combine(element.name, element.value);
                    }
                }
            });
        }
        return data.join("&").replace(/%20/g, "+");
    }
    /**
     * Helper function for o_util.deserialize (type casting).
     *
     * @param val The value to be coerced
     * @returns A mixed, casted output
     */
    function coerce(val) {
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(val)) {
            return Number(val);
        }
        if (val === "true") {
            return true;
        }
        if (val === "false") {
            return false;
        }
        return val;
    }
    /**
     * Transforms a string in URL parameter format into an object
     *
     * @param str The string to be deserialized
     * @param [coercion = true]  Indicator if value coercing is enabled (e.g. transforms "true" into boolean true)
     * @returns The resulting, deserialized object
     */
    function deserialize(str, coercion = true) {
        const decoded = decodeURIComponent(str.replace(/\+/g, "%20"));
        const chunks = decoded.split("&");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params = {};
        chunks.forEach((chunk) => {
            const splittedChunk = chunk.split("=");
            const key = splittedChunk[0];
            const val = coercion ? coerce(splittedChunk[1]) : splittedChunk[1];
            if (key !== "") {
                params[key] = val;
            }
        });
        return params;
    }
    /**
     * Clone a function and all it's inherited properties.
     *
     * @deprecated Don't use this method anymore. Will be removed entirely.
     *
     * @example var func = core.cloneFunction(origFunc);
     *
     * @param functionReference Function to be cloned.
     * @return Cloned function.
     */
    /* istanbul ignore next: deprecated */
    function cloneFunction(functionReference) {
        let key;
        if (typeof functionReference !== "function") {
            return functionReference;
        }
        /**
         * Temporary function.
         *
         * @return Return value of the function.
         */
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        function temp() {
            // eslint-disable-next-line prefer-spread, prefer-rest-params
            return functionReference.apply(null, arguments);
        }
        // eslint-disable-next-line no-restricted-syntax
        for (key in functionReference) {
            // eslint-disable-next-line no-prototype-builtins
            if (functionReference.hasOwnProperty(key)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                temp[key] = functionReference[key];
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return temp;
    }
    const c = {
        bind,
        clone,
        cloneFunction,
        coerce,
        convertStringToFunction,
        deserialize,
        extend,
        isEmptyObject,
        isPlainObject,
        removeFromArray,
        serialize,
        serializeForm,
        toArray,
    };
    /**
     * Utility collection of miscellaneous core functions.
     */
    const core = c;

    function warn(message) {
        var _a, _b;
        return (_b = (_a = window.o_global) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 ? void 0 : _b.warn(message);
    }
    function sendCustomRequest(type, data) {
        var _a, _b;
        if (typeof ((_b = (_a = window.AS) === null || _a === void 0 ? void 0 : _a.RUM) === null || _b === void 0 ? void 0 : _b.sendCustomRequest) === "function") {
            window.AS.RUM.sendCustomRequest(type, data);
        }
    }
    function dateNow() {
        return new Date();
    }
    function getTime() {
        return dateNow().getTime();
    }
    function now() {
        return Date.now();
    }
    function random() {
        return Math.random();
    }

    /**
     * Evaluates and executes a script block.
     *
     * @param elem Script element.
     */
    function evalScript(elem) {
        var _a, _b;
        // create new script tag
        const script = document.createElement("script");
        if (elem.src) {
            // Fill script tag with stuff from element, bacause of
            // src attrib, it will be loaded by browser
            // attributes has no iterator, abuse array.forEach
            [].forEach.call(elem.attributes, (attribute) => {
                script.setAttribute(attribute.name, attribute.value);
            });
            // eslint-disable-next-line no-unused-expressions
            (_a = elem.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(script, elem);
        }
        else {
            // Fill Script tag with with content from element
            const head = document.getElementsByTagName("head")[0] ||
                /* istanbul ignore next */ document.documentElement;
            const data = elem.text || elem.textContent || elem.innerHTML || "";
            script.type = "text/javascript";
            script.text = data;
            head.insertBefore(script, head.firstChild); // JS is executed immediately
            head.removeChild(script);
            // eslint-disable-next-line no-unused-expressions
            (_b = elem.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(elem);
        }
    }
    /**
     * Executes script-tags embedded in element that was loaded asynchronously.
     *
     * @example
     * // div .exampleClass
     * //   script
     * //       ... javascript-code
     * //   p
     * //       some text
     * var divWithScriptTags = document.querySelector(".exampleClass");
     * o_util.hardcore.executeInlineScripts(divWithScriptTags);
     * // The javascript code inside the exampleClass was executed.
     *
     * @param element The HTML Element, which contains inline scripts.
     */
    function executeInlineScripts(element) {
        const scripts = [];
        const ret = element.getElementsByTagName("script");
        // Collect all javascript code inside of script tags inside the element block.
        for (let i = 0; ret[i]; i += 1) {
            if (!ret[i].type ||
                ret[i].type.toLowerCase() === "text/javascript" ||
                ret[i].type === "module") {
                scripts.push(ret[i]);
            }
        }
        // Execute the javascript code.
        scripts.forEach((s) => evalScript(s));
    }
    /**
     * Utility collection of really fancy, hence hardcore, functions
     * that should be omitted as often as possible.
     */
    const hardcore = { evalScript, executeInlineScripts };

    function setResponseType(options, request) {
        if (options.responseType) {
            // Set request.responseType if supported by the browser.
            if (typeof request.responseType === "string") {
                // Some browsers throw when setting 'responseType' to an unsupported value.
                try {
                    request.responseType = options.responseType;
                }
                catch (error) {
                    /* do nothing */
                }
            }
        }
    }
    function setRequestTimeout(options, request) {
        if (options.timeout) {
            // Set request.timeout if supported by the browser or start setTimeout.
            if (typeof request.timeout === "number") {
                request.timeout = options.timeout;
            }
            else {
                return setTimeout(request.abort, options.timeout);
            }
        }
        return undefined;
    }
    function handleRequestTimeout(
    // Simulate request.timeout if not supported by the browser.
    abortTimeout) {
        if (abortTimeout) {
            clearTimeout(abortTimeout);
        }
    }
    function setContentType(options, request) {
        if (options.contentType) {
            // Set Content-Type if present in request options.
            request.setRequestHeader("Content-Type", options.contentType);
        }
    }
    function setHeaders(options, request) {
        if (options.headers) {
            Object.entries(options.headers).forEach(([h, v]) => {
                if (typeof v === "string") {
                    // Set Content-Type if present in request options.
                    request.setRequestHeader(h, v);
                }
            });
        }
    }
    function setWithCredentials(options, request) {
        // Set withCredentials property of AJAX call if present in request options.
        if (typeof options.withCredentials === "boolean") {
            request.withCredentials = options.withCredentials;
        }
    }
    function sanitizeResponse(options, request) {
        // Check if request.responseType 'json' is not supported by the browser.
        if (!!options.responseType &&
            options.responseType === "json" &&
            !request.responseType) {
            // Try to convert to JSON.
            // Necessary due to lagging XMLHttpRequest 2 support in several browsers which supports responseType 'json'.
            // @see http://caniuse.com/#feat=xhr2
            if (request.responseText) {
                // Set request.response to JSON object instead of a string.
                request.responseJSON = JSON.parse(request.responseText);
            }
        }
        else {
            request.responseJSON = request.response;
        }
    }
    function handleDone(handler) {
        return function doneHandler(ev) {
            if (this.readyState === XMLHttpRequest.DONE) {
                handler(this, ev);
            }
        };
    }
    /**
     * Validates options for an AJAX request.
     *
     * @param options The options object.
     *
     * @return Returns an error object in case of an error or null if everything was ok.
     */
    function validateOptions(options) {
        if (!options) {
            return new Error("Parameter 'options' is missing.");
        }
        if (!options.method) {
            return new Error("Parameter 'options.method' is missing.");
        }
        if (!options.url) {
            return new Error("Parameter 'options.url' is missing.");
        }
        if (options.headers && !core.isPlainObject(options.headers)) {
            return new Error("Parameter 'options.headers' must be a key/value object if set");
        }
        return null;
    }
    /**
     * Internal call used by getScript method to inject loaded javascript and execute it.
     *
     * @private
     *
     * @param xhr The native xhr object.
     *
     * @return The native xhr object that contains the script source.
     */
    function injectScript(xhr, executeImmediately, callback) {
        let script;
        // Valid script can only be contained within `OK` or `Not Modified` status
        if ((xhr.status === 200 || xhr.status === 304) &&
            executeImmediately !== false) {
            script = document.createElement("script");
            script.type = "text/javascript";
            script.text = xhr.responseText;
            hardcore.evalScript(script);
        }
        if (typeof callback === "function") {
            callback(xhr);
        }
        return xhr;
    }
    /**
     * Get a random string, composed by the current timestamp plus a 3 digit random number
     *
     * Used for cache busting requests.
     *
     * @return The current time plus a 3 character random string
     */
    function getCustomTimeStamp() {
        return now().toString() + Math.floor(random() * 999).toString();
    }
    /**
     * Processes options for getScript function
     * @param url the url will be modified in case of cacheBusting
     * @param options will be sanitized, with defaults
     */
    function sanitizeGetScriptOptions(url, options) {
        const opts = { executeImmediately: true, cacheBusting: true, url };
        if (typeof options === "boolean") {
            opts.executeImmediately = options;
        }
        else if (typeof options === "object") {
            if (typeof options.executeImmediately !== "undefined") {
                opts.executeImmediately = options.executeImmediately;
            }
            if (typeof options.cacheBusting !== "undefined") {
                opts.cacheBusting = options.cacheBusting;
            }
        }
        // Add a custom timestamp to prevent request caching.
        if (opts.cacheBusting) {
            opts.url =
                url.indexOf("?") !== -1
                    ? `${url}&_=${getCustomTimeStamp()}`
                    : `${url}?_=${getCustomTimeStamp()}`;
        }
        return opts;
    }
    function sanitizePostOptions(data) {
        return typeof data === "object"
            ? {
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
            }
            : {
                data,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
            };
    }

    /**
     * Internal wrapper function to perform an asynchronous HTTP request.
     *
     * @param options See parameter list for ajax().
     * @param callback Will be called if request.readyState equals request.DONE (4).
     *
     * @return XMLHttpRequest
     */
    function sendRequest(options, callback, counterObject) {
        const counter = counterObject;
        const request = new XMLHttpRequest();
        request.open(options.method.toUpperCase(), options.url, true);
        counter.active += 1;
        setResponseType(options, request);
        setContentType(options, request);
        setHeaders(options, request);
        setWithCredentials(options, request);
        const abortTimeout = setRequestTimeout(options, request);
        // Enable ajax request detection with X-Requested-With header
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        const decrementCounter = () => {
            counter.active -= 1;
        };
        request.addEventListener("abort", decrementCounter);
        request.addEventListener("error", decrementCounter);
        request.onreadystatechange = handleDone(() => {
            handleRequestTimeout(abortTimeout);
            decrementCounter();
            sanitizeResponse(options, request);
            // Call callback function.
            // Can be Promise.resolve or callback function from arguments.
            callback(request);
        });
        // Send it with data if present.
        request.send(options.data ? options.data : null);
        // Return the request for callback mode.
        return request;
    }

    function ajaxBase(options, callback) {
        const optionsError = validateOptions(options);
        if (typeof callback === "function") {
            // Return XHR if callback is a function or throw errors directly.
            if (optionsError instanceof Error) {
                throw optionsError;
            }
            return sendRequest(options, callback, 
            // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
            ajax);
        }
        // Return Promise if callback is not a function and reject errors.
        return new Promise((resolve, reject) => {
            if (optionsError instanceof Error) {
                reject(optionsError);
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
            sendRequest(options, resolve, ajax);
        });
    }
    function get(url, callback) {
        return ajaxBase({ method: "GET", url }, callback);
    }
    function getJSON(url, callback) {
        return ajaxBase({ method: "GET", url, responseType: "json" }, callback);
    }
    function post(url, data, callback) {
        return ajaxBase({
            method: "POST",
            url,
            ...sanitizePostOptions(data),
        }, callback);
    }
    /** ajax.abort */
    function abort(xhr) {
        xhr.abort();
    }
    function getScript(url, options, callback) {
        const opts = sanitizeGetScriptOptions(url, options);
        return typeof callback === "function"
            ? ajaxBase({ method: "GET", url: opts.url }, (xhr) => injectScript(xhr, opts.executeImmediately, callback))
            : ajaxBase({ method: "GET", url: opts.url }).then((xhr) => injectScript(xhr, opts.executeImmediately));
    }
    /**
     * Generic helper module to perform an various asynchronous HTTP request using XMLHttpRequest.
     * ajax provides a dual-type API that can be used with Promises or callbacks.
     *
     * @example
     *
     * ```ts
     *
     * // Promise usage. XHR object will be first argument.
     * ajax({
     *   "url": "/url",
     *   "method": "GET",
     *   "headers": {
     *      "foo": "bar"
     *   }
     * }).then(function(xhr) {
     *      console.log("Status:", xhr.status);
     *      console.log("Response:", xhr.response);
     * });
     *
     * // Callback usage returns the XMLHttpRequest object.
     * var xhr = ajax({
     *   "url": "/url",
     *   "method": "GET",
     *      "headers": {
     *         "foo": "bar"
     *      }
     * }, function(xhr) {
     *     console.log("Status:", xhr.status);
     *     console.log("Response:", xhr.response);
     * });
     * ```
     */
    const ajax = core.extend(ajaxBase, {
        get,
        getJSON,
        getScript,
        post,
        abort,
        active: 0,
        _getCustomTimeStamp: getCustomTimeStamp,
    }, false, false);
    /**
     * Deprecated AJAX caller. for o_global.helper.ajax
     *
     * @deprecated Use o_util.ajax() or o_util.ajax.get() instead.
     *
     * @param url Url to be fetched.
     * @param contentCallback Function which is passed result.
     * @param finishCallback Function which is executed after AJAX request has finished.
     */
    function ajaxLegacy(url, contentCallback, finishCallback) {
        warn("o_global.helper.ajax is deprecated, use o_util.ajax or o_util.ajax.get instead.");
        return get(url).then((xhr) => {
            if (typeof contentCallback === "function") {
                if (xhr.status === 200) {
                    contentCallback(xhr.responseText, xhr.status);
                }
                else {
                    contentCallback('<div class="p_message p_message--error p_layer--error"><b>Entschuldigung!</b> Aufgrund von technischen Problemen kann der Inhalt leider nicht geladen werden. Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.</div>', xhr.status);
                }
            }
            if (typeof finishCallback === "function") {
                finishCallback(xhr.status);
            }
        });
    }

    function isEventable(element) {
        return (typeof element === "object" && !!element.addEventListener);
    }
    function chooseElement(selector) {
        return selector === "document" ? document : document.querySelector(selector);
    }

    /**
     * Convenient helper to realize event delegation.
     * This function binds an event listener to a 'parent' element (delegationTarget). The given
     * event handler function will only be called if the eventTarget is one
     * of the determined possible targets (eventTargetSelector).
     *
     * @example
     * event.delegate(".myParent", "click", ".myChild", eventHandler);
     * event.delegate(document, "click", ".myChild", eventHandler);
     *
     * @param delegationTarget Parent element in which possible event targets are encapsulated.
     * @param eventName Type of event, e.g. click, hover, mouseover.
     * @param eventTargetSelector Selector for permitted event targets.
     * @param fn Event handler to run when event occurs.
     * @param useCapture If true, events of this type will be dispatched to the registered listener
     * before being dispatched to any EventTarget beneath it in the DOM tree.
     */
    function delegate(delegationTarget, eventName, eventTargetSelector, fn, useCapture = false) {
        const element = isEventable(delegationTarget)
            ? delegationTarget
            : chooseElement(delegationTarget);
        if (element) {
            element.addEventListener(eventName, (event) => {
                const possibleTargets = element.querySelectorAll(eventTargetSelector);
                const { target } = event;
                for (let i = 0, l = possibleTargets.length; i < l; i += 1) {
                    let el = target;
                    const p = possibleTargets[i];
                    while (el && el !== element) {
                        if (el === p) {
                            fn.call(p, event);
                            return;
                        }
                        el = el.parentNode;
                    }
                }
            }, useCapture);
        }
    }
    /**
     * Convenience function to stop event propagation and
     * bubbling in one shot.
     *
     * calls stopPropagation and preventDefault on the given event
     *
     * @param event Event object to stop from propagating and bubbling.
     * @example
     *
     * ```ts
     * stop(myEvent);
     * ```
     */
    function stop(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    /**
     * Return the transitionend event that is actually supported by the used browser.
     *
     * @example var transitionEndEvent = o_util.event.whichTransitionEvent();
     *
     * @return Transition event understood by browser.
     */
    function whichTransitionEndEvent() {
        const el = document.createElement("fakeelement");
        let res = "";
        // eslint-disable-next-line no-restricted-syntax
        for (const [k, v] of Object.entries({
            WebkitTransition: "webkitTransitionEnd",
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MozTransition: "transitionend",
        })) {
            if (el.style[k] !== undefined) {
                res = v;
            }
        }
        return res;
    }
    /**
     * @deprecated Use native element.addEventListener instead.
     *
     * Add an event listener to a given DOM element.
     *
     * Older browsers do not support the event.target property.
     * To get the target use: o_util.event.getTarget(event)
     *
     * @example o_util.event.add(domElement, "click", eventHandler);
     *
     * @param obj The DOM element the eventListener will be added to.
     * @param type The name of the event to bind a listener for.
     * See https://developer.mozilla.org/en-US/docs/Web/Events for possible events.
     * @param fn Event handler to attach to the event.
     * @param useCapture If true, events of this type will be dispatched to the registered listener
     * before being dispatched to any EventTarget beneath it in the DOM tree.
     */
    /* istanbul ignore next: deprecated */
    function add(obj, type, fn, useCapture = false) {
        warn("o_util.event.add is deprecated, use native addEventListener instead");
        obj.addEventListener(type, fn, useCapture);
    }
    /**
     * @deprecated Use native element.removeEventListener instead.
     *
     * Remove a specific event listener from the element it was bound to.
     *
     * @example event.remove(domElement, "click", eventHandler);
     *
     * @param obj The DOM element the eventListener will be added to.
     * @param type The name of the event to bind a listener for.
     * See https://developer.mozilla.org/en-US/docs/Web/Events for possible events.
     * @param fn Event handler to be removed.
     */
    /* istanbul ignore next: deprecated */
    function remove(obj, type, fn) {
        warn("o_util.event.remove is deprecated, use native removeEventListener instead");
        obj.removeEventListener(type, fn, false);
    }
    /**
     * @deprecated Use native event.stopPropagation instead.
     *
     * Helper function to stop event propagation for browsers and IE.
     *
     * @example event.stopPropagation(event);
     *
     * @param event Event object
     */
    /* istanbul ignore next: deprecated */
    function stopPropagation(event) {
        warn("o_util.event.stopPropagation is deprecated, use native event.stopPropagation instead");
        event.stopPropagation();
    }
    /**
     * @deprecated Use native event.target instead.
     *
     * Cross browser determination of the actual event target of a given event.
     *
     * @example event.getTarget(event);
     *
     * @param event Emitted event object.
     * @return Actual event target.
     */
    /* istanbul ignore next: deprecated */
    function getTarget(event) {
        warn("o_util.event.getTarget is deprecated, use native event.target instead");
        return event.target;
    }
    /**
     * @deprecated Use native event.stopPropagation instead.
     *
     * Helper function to handle preventDefault for browsers and IE.
     *
     * @example event.preventDefault(event);
     *
     * @param event Event object
     */
    /* istanbul ignore next: deprecated */
    function preventDefault(event) {
        warn("o_util.event.preventDefault is deprecated, use native event.preventDefault instead");
        event.preventDefault();
    }
    /**
     * @deprecated Use native CustomElements instead.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
     *
     * Trigger an HTMLEvent.
     *
     * @example
     * event.trigger(document.getElementById("el"), "click");
     *
     * @param element The HTMLEvent will be fired on this HTMLElement.
     * @param type HTMLEvent type (click, change...)
     */
    /* istanbul ignore next: deprecated */
    function trigger(element, type) {
        warn("o_util.event.trigger is deprecated, use native CustomElements instead");
        const event = document.createEvent("HTMLEvents");
        event.initEvent(type, true, true);
        element.dispatchEvent(event);
    }
    const e = {
        delegate,
        stop,
        whichTransitionEndEvent,
        add,
        remove,
        stopPropagation,
        getTarget,
        preventDefault,
        trigger,
    };
    /**
     * Utility collection of event handling methods.
     */
    const event = e;

    /**
     * Shim for requestAnimationFrame.
     *
     * You can use this like the normal requestAnimation
     * You can use this like the normal window.requestAnimationFrame.
     * Just type in o_global.helper.requestAnimFrame(func).
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function requestAnimFrame(...args) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window;
        const fn = w.requestAnimationFrame ||
            w.webkitRequestAnimationFrame ||
            w.mozRequestAnimationFrame ||
            ((cb) => {
                window.setTimeout(cb, 1000 / 60);
            });
        // eslint-disable-next-line prefer-spread
        fn.apply(null, [].slice.call(args));
    }
    /**
     * Caculate the new scroll position of the scolling animation.
     *
     * @private
     *
     * @param from The start position of the scrolling.
     * @param to The end position of the scrolling.
     * @param currentState The current state of the animation. Interval [0,1]
     * @param easingFnc The easing function.
     *
     * @return The current scroll position.
     */
    function getNewScrollPosition(from, to, currentState, easingFnc) {
        return from - (from - to) * easingFnc(currentState);
    }
    /**
     * Will be called multiple times until the scroll animation is finished.
     * After update the scroll position to the next animation step, it registers a timeout with this function again for the next animation step.
     *
     * @private
     *
     * @param scrollBase Depending on the used browser, the html container which scrolls the page (e.g. body or html).
     * @param scrollFrom The y-position of the scroll-start in pixel.
     * @param scrollTo The y-position of the scroll-end in pixel.
     * @param startTime The start time of the scrolling animation
     * @param duration The percent value, which will be add to the process after each scroll step. Must be greater 0!
     * @param easingFnc Easing function for the scrolling animation.
     */
    function scrollToInternal(scrollBase, scrollFrom, scrollTo, startTime, duration, easingFnc) {
        const base = scrollBase;
        const current = getTime();
        // Calculate the current status (in percent - interval [0,1]) of the animation.
        const start = startTime === 0 ? current - 1 : startTime;
        const currentState = (current - start) / duration;
        // Abort if animation is finished.
        if (currentState > 1) {
            base.scrollTop = scrollTo;
            return;
        }
        // Update scroll position and current process of the whole animation.
        base.scrollTop = getNewScrollPosition(scrollFrom, scrollTo, currentState, easingFnc);
        // Register timeout for next animation step.
        requestAnimFrame(() => {
            scrollToInternal(scrollBase, scrollFrom, scrollTo, start, duration, easingFnc);
        });
    }

    /**
     * Various easing functions for animations over time.
     * More: https://gist.github.com/gre/1650294
     *
     * @example
     * o_util.animation.easings.linear(0.5) // => 0.5
     * o_util.animation.easings.easeOutCubic(0.5) // => 0.875
     *
     * @param t The current status of the animation in the interval [0,1]. E.g. 0.5 means that half of the animation time is finished.
     * @return The animation status depending on the time status.
     */
    const easings = Object.freeze({
        linear(t) {
            return t;
        },
        easeOutCubic(t) {
            // eslint-disable-next-line no-plusplus, no-param-reassign
            return --t * t * t + 1;
        },
    });
    /**
     * Various transition classes for predefined
     * animations like fadeOut, fadeIn that can be passed
     * to the o_util.animation.transition function.
     *
     * @see https://*.otto.de/assets-asset-pali/animationen.html#animations-eigenschaften
     *
     * @example
     *
     * ```ts
     * animation.transition(el, animation.transitions.fadeOut);
     * animation.transition(el, animation.transitions.fadeIn);
     * ```
     *
     * @return (String) A transition animation class string (without leading dot).
     */
    const transitions = Object.freeze({
        fadeOut: "p_animation__fadeOut",
        fadeIn: "p_animation__fadeIn",
    });
    /**
     * Adds a CSS class with a transition animation to an element and triggers
     * a callback when the specified transition finished/ended.
     *
     * IMPORTANT: Only use this function if you need the callback! Otherwise simply
     * add the class to your element. The callback will only be invoked
     * if your CSS class triggers a transition animation.
     *
     * There will be no animation for browsers not supporting CSS3 animations (e.g. IE9), but the callback still fires.
     *
     * @example
     * // Trigger a fadeOut animation
     * animation.transition(el, animation.transitions.fadeOut, myCallbackHandler);
     * // Add your own transition class
     * animation.transition(el, "p_awesome__transition--animation", myCallbackHandler);
     *
     * @param target The HTML element to perform the transition on.
     * @param transitionClass A transition animation class string (without leading dot)
     * @param callback Invoked callback after transition finished.
     */
    function transition(target, transitionClass, callback) {
        if (typeof target === "object" && typeof transitionClass === "string") {
            const transitionEndEvent = event.whichTransitionEndEvent();
            const callbackHandler = (event) => {
                if (typeof callback === "function") {
                    callback();
                }
                if (event && event.target) {
                    event.target.removeEventListener(transitionEndEvent, callbackHandler);
                }
            };
            if (transitionEndEvent &&
                typeof callback === "function" &&
                !target.classList.contains(transitionClass)) {
                target.addEventListener(transitionEndEvent, callbackHandler);
                target.classList.add(transitionClass);
            }
            else {
                target.classList.add(transitionClass);
                callbackHandler();
            }
        }
        else {
            throw new Error("No target or class specified");
        }
    }
    /**
     * This is a shorthand for o_util.animation.transition when
     * used with the global pattern default class `p_animation__fadeOut`
     * (o_util.animation.transitions.fadeOut).
     * So instead of the long term
     *      o_util.animation.transition(el, o_util.animation.transitions.fadeOut, myCallbackHandler)
     * you can use
     *      o_util.animation.fadeOut(el, myCallbackHandler)
     *
     * The transition is performed on the `opacity` attribute (-> `0`
     * ).
     * If the computed opacity is already `0` the callback gets invoked directly.
     *
     * IMPORTANT: Only use this function if you need the callback! Otherwise simply
     * add the class to your element. Make sure to remove the fading class when you
     * fadeIn and fadeOut again.
     *
     * @param target The HTML element to perform the transition on.
     * @param callback Invoked callback after element faded out.
     */
    function fadeOut(target, callback) {
        if (window.getComputedStyle(target).opacity !== "0") {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
            animation.transition(target, transitions.fadeOut, callback);
        }
        else if (typeof callback === "function") {
            callback();
        }
    }
    /**
     * This is a shorthand for o_util.animation.transition when
     * used with the global pattern default class `p_animation__fadeIn`
     * (o_util.animation.transitions.fadeIn).
     * So instead of the long term
     *      o_util.animation.transition(el, o_util.animation.transitions.fadeIn, myCallbackHandler)
     * you can use
     *      o_util.animation.fadeIn(el, myCallbackHandler)
     *
     * The transition is performed on the `opacity` attribute (-> `1`).
     * If the computed opacity is already `1` the callback gets invoked directly.
     *
     * IMPORTANT: Only use this function if you need the callback! Otherwise simply
     * add the class to your element. Make sure to remove the fading class when you
     * fadeOut and fadeIn again.
     *
     * @param target The HTML element to perform the transition on.
     * @param callback Invoked callback after element faded in.
     */
    function fadeIn(target, callback) {
        if (window.getComputedStyle(target).opacity !== "1") {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
            animation.transition(target, transitions.fadeIn, callback);
        }
        else if (typeof callback === "function") {
            callback();
        }
    }
    /**
     * Scrolls the page to the element or a position within a specific duration.
     *
     * @param target The HTML Element or the y-position of the page, where the page should be scrolled to.
     * @param duration The duration of the animation in milliseconds.
     * @param [easing] Optional argument for defining the easing function for the scrolling animation. Available functions in Easings - Default is: "easeOutCubic"
     *
     * @example
     *
     * ```ts
     * import { animation } from "@otto-ec/global-utils";
     *
     * // Scrolls the page to position 2000 within one second.
     * animation.scrollTo(2000, 1000);
     *
     * // Scrolls to the top of the page within two seconds.
     * animation.scrollTo(0, 2000);
     *
     * // Scrolls to elem within a half second.
     * animation.scrollTo(elem, 500);
     *
     * // Scrolls to elem within three seconds with a linear scrolling animation instead of the default easeOutCubic.
     * animation.scrollTo(elem, 3000, "linear");
     * ```
     */
    function scrollTo(target, duration, easing = "easeOutCubic") {
        const windowTop = 
        // eslint-disable-next-line compat/compat
        typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        let position;
        if (typeof target === "object" && !!target.getBoundingClientRect) {
            position = target.getBoundingClientRect().top + windowTop - 20;
        }
        else if (typeof target === "number") {
            position = target;
        }
        else {
            throw new Error("Invalid target for scrollTo() method. Element has to be an object with an offsetTop function or number, which stands for the page position.");
        }
        // Select the easing function, which should be applied on the scroll animation.
        const easingFnc = easings[easing];
        if (!easingFnc) {
            throw new Error(`Unknown easing function for scrollTo() method: ${easing}`);
        }
        // Validate the correct scroll container. It depends on the browser, if the html or the body scrolls.
        let scrollBase = document.documentElement;
        const currentPos = scrollBase.scrollTop;
        let ratio;
        if (currentPos === 0) {
            // eslint-disable-next-line compat/compat
            ratio = window.devicePixelRatio ? window.devicePixelRatio : 1;
            scrollBase.scrollTop += Math.max(1, ratio, 1 / ratio);
            scrollBase = scrollBase.scrollTop > 0 ? scrollBase : document.body;
            scrollBase.scrollTop = 0;
        }
        // You cannot scroll further than the page height.
        const maxScroll = scrollBase.scrollHeight - scrollBase.offsetHeight;
        if (maxScroll < position) {
            position = maxScroll;
        }
        // No animation for negative, zero and values lower than 16 milliseconds, because within this duration there would be only one animation frame.
        if (duration < 16) {
            scrollBase.scrollTop = position;
            return;
        }
        scrollToInternal(scrollBase, currentPos, position, 0, duration, easingFnc);
    }
    /**
     * Utility collection of animation functions.
     */
    const animation = {
        easings,
        fadeIn,
        fadeOut,
        requestAnimFrame,
        scrollTo,
        transition,
        transitions,
        _getNewScrollPosition: getNewScrollPosition,
        _scrollTo: scrollToInternal,
    };

    /**
     * Returns the width of the scrollbar.
     *
     * @return The actual width of the scrollbar.
     *
     * @example browser.getScrollbarWidth(); // => e.g. 17
     */
    function getScrollbarWidth() {
        const scrollDiv = document.createElement("div");
        let scrollbarWidth = 0;
        if (document.body.clientWidth < window.innerWidth) {
            scrollDiv.className = "p_scrollbarMeasure";
            document.body.appendChild(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
        }
        return scrollbarWidth;
    }
    /**
     * Finds the string "needle" in user agent string.
     *
     * @param needle String to find in haystack.
     * @return Was needle found in ua-string?
     */
    function findInUserAgent(needle) {
        return window.navigator.userAgent.toLowerCase().indexOf(needle) !== -1;
    }
    /**
     * Checks if the current browser is the Internet Explorer 8.
     *
     * @deprecated Due to unsupported-browser checks - we dont have IE8 anymore
     *
     * @example
     * if (o_util.browser.isIE8()) {
     *      // Just do this in IE8
     * } else {
     *      ...
     * }
     *
     * @return true, if the browser is the IE8.
     */
    /* istanbul ignore next: deprecated */
    function isIE8() {
        warn("o_util.browser.isIE8 is deprecated - IE8 is doomed.");
        return navigator.userAgent.indexOf("MSIE 8") > -1;
    }
    /**
     * Returns the current value of the style for an element or an empty string.
     *
     * @deprecated Use native window.getComputedStyle(elem, null).getPropertyValue(styleProp) instead.
     *
     * @example o_util.browser.getStyle(document.body, "padding-top"); // => e.g. "0px"
     *
     * @param elem Element.
     * @param styleProp Style you want the value of.
     *
     * @return Style value.
     */
    /* istanbul ignore next: deprecated */
    function getStyle(elem, styleProp) {
        warn("o_util.browser.getStyle is deprecated, use native getComputedStyle instead");
        return window.getComputedStyle(elem, null).getPropertyValue(styleProp);
    }
    /**
     * Utility collection of browser and user agent related functions.
     */
    const browser = {
        getScrollbarWidth,
        findInUserAgent,
        isIE8,
        getStyle,
    };

    /**
     * Returns the Page Load Type.
     * Use o_util.connection. Prefix for all Functions below, so mocking is working as expected
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigation
     * @return
     */
    function getConnectionType() {
        const { performance: p } = window;
        return p && p.navigation && "type" in p.navigation ? p.navigation.type : 255;
    }
    /**
     * Checks wether it was a normal Page Load
     * @return
     */
    function isNormalNavigation() {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
        return connection.getConnectionType() === 0;
    }
    /**
     * Checks wether it was a Page Reload
     * @return
     */
    function isReloadNavigation() {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
        return connection.getConnectionType() === 1;
    }
    /**
     * Checks wether it was a Page Reload
     * @return
     */
    function isForwardBackwardNavigation() {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-use-before-define
        return connection.getConnectionType() === 2;
    }
    /**
     * Utility collection of connection related functions.
     */
    const connection = {
        getConnectionType,
        isNormalNavigation,
        isReloadNavigation,
        isForwardBackwardNavigation,
    };

    /**
     * Function to retrieve the value of a single cookie.
     *
     * @param name Name of the cookie.
     * @return Value of the cookie or undefined
     *
     * @example
     *
     * const val = cookie.get("myCookie");
     */
    function get$1(name) {
        const parts = document.cookie.split(/;\s*/);
        const len = parts.length;
        const n = `${name}=`;
        for (let i = 0; i < len; i += 1) {
            if (parts[i].indexOf(n) !== -1) {
                return decodeURIComponent(parts[i].replace(n, ""));
            }
        }
        return undefined;
    }

    const COOKIE_PREFIX = "toggle_";
    /**
     * Returns a boolean state for a toggle by checking
     * if globally or locally enabled.
     * The result will be false if both values are not available
     * and no default passed. Otherwise all teams
     * can pass a default boolean value to indicate if the
     * feature is enabled or not when a toggle is unavailable.
     * (For example: the toggle service is not reachable).
     *
     * @example
     *
     * ```ts
     *
     * var toggleValue = get("myAwesomeToggle");
     *
     * if (toggleValue) {
     *      // Toggle/feature is active
     * } else {
     *      // Toggle/feature is inactive or javascript toggle is undefined and no local cookie is set
     * }
     *
     * var toggleValue = get("myAwesomeToggle", true);
     *
     * if (toggleValue) {
     *      // Toggle/feature is active or javascript toggle is undefined and no local cookie is set
     * } else {
     *      // Toggle/feature is inactive
     * }
     * ```
     *
     * @param toggleName Name of toggle (o_global.toggles).
     * @param [defaultValue = false]  Specific return value of the function if toggle is unavailable.
     *
     * @return Status of the toggle (true = ON, false = OFF).
     */
    function get$2(toggleName, defaultValue = false) {
        var _a, _b, _c, _d;
        const localStatus = get$1(COOKIE_PREFIX + toggleName);
        // TODO: talk about localDisable
        if (((_b = (_a = window.o_global) === null || _a === void 0 ? void 0 : _a.toggles) === null || _b === void 0 ? void 0 : _b[toggleName]) === true ||
            localStatus === "true") {
            // GLOBAL: true, COOKIE: true -> ON
            // GLOBAL: true, COOKIE: false -> ON
            // GLOBAL: true, COOKIE: undefined -> ON
            // GLOBAL: false, COOKIE: true -> ON
            // GLOBAL: undefined, COOKIE: true -> ON
            return true;
        }
        if (((_d = (_c = window.o_global) === null || _c === void 0 ? void 0 : _c.toggles) === null || _d === void 0 ? void 0 : _d[toggleName]) === false ||
            localStatus === "false") {
            // GLOBAL: false, COOKIE: undefined -> OFF
            // GLOBAL: false, COOKIE: false -> OFF
            // GLOBAL: undefined, COOKIE: false -> OFF
            return false;
        }
        // GLOBAL: undefined, COOKIE: undefined -> Default handling for teams
        return typeof defaultValue === "boolean" ? defaultValue : false;
    }
    /**
     * Helper functions to obtain toggle state information.
     */
    const toggle = { get: get$2 };

    const SAMESITE_VALUES = ["None", "Lax", "Strict"];
    /**
     * Function to check if a cookie searched by name exists.
     *
     * @param name Name of the cookie to search for.
     * @return If Cookie exist with or without value, it will return true.
     * @example cookie.exists("name");
     */
    function exists(name) {
        const values = document.cookie.split(";");
        const reg = new RegExp(`^( )*${encodeURIComponent(name)}$`, "g");
        for (let i = 0; i < values.length; i += 1) {
            if (reg.test(values[i].split("=")[0])) {
                return true;
            }
        }
        return false;
    }
    /**
     * Function to set a cookie. "name" and "value" are mandatory arguments. If further options are
     * omitted, the cookie will be set at root path and will expire in 60 minutes.
     *
     * @example o_util.cookie.set("someCookie", "cookieValue", { "minutes": 60, path: "/cookiePath"});
     *
     * @param name Name of the cookie.
     * @param value Value of the cookie.
     * @param [options] Contains configuration properties for the cookie.
     */
    function set(name, value, options) {
        let timeInMinutes = 60;
        const date = dateNow();
        const opts = options || {};
        let cookieString;
        if (opts.minutes) {
            timeInMinutes = opts.minutes;
        }
        if (opts.days) {
            if (!opts.minutes) {
                timeInMinutes = 0;
            }
            timeInMinutes += opts.days * 24 * 60;
        }
        date.setTime(date.getTime() + timeInMinutes * 60 * 1000);
        cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        cookieString += `; expires=${date.toUTCString()}`;
        cookieString += `; path=${opts.path || "/"}`;
        if (opts.domain) {
            cookieString += `; domain=${opts.domain}`;
        }
        if (opts.samesite && SAMESITE_VALUES.includes(opts.samesite)) {
            cookieString += `; SameSite=${opts.samesite}`;
            if (opts.samesite === "None") {
                cookieString += `; Secure`;
            }
        }
        document.cookie = cookieString;
        // track every cookie set by o_util.cookie
        if (toggle.get("LHAS_2048_TRACK_COOKIES", false)) {
            sendCustomRequest("o_util.cookie.set()", {
                cookiePath: options && options.path ? options.path : "/",
                cookieExpires: date.toUTCString(),
                cookieDomain: options && options.domain ? options.domain : -1,
                cookieName: name,
                cookieValue: value,
                cookieSameSite: options && options.samesite ? options.samesite : -1,
            });
        }
    }
    /**
     * Remove a cookie by a given name by setting the expiry date to a date far back in time.
     *
     * @param name Name of the cookie that should be removed.
     * @param options Contains configuration properties for the cookie.
     *
     * @example o_util.cookie.remove("myCookie");
     */
    function remove$1(name, options) {
        const opts = options || {};
        let optionsString = "";
        optionsString += ` path=${opts.path ? opts.path : "/"};`;
        if (opts.domain) {
            optionsString += ` domain=${opts.domain};`;
        }
        document.cookie = `${encodeURIComponent(name)}=;${optionsString} expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
    /**
     * Cookie related helper functions in dedicated namespace.
     */
    const cookie = {
        get: get$1,
        set,
        exists,
        remove: remove$1,
    };

    /**
     * Checks if an element or one of its parents have a certain class name.
     *
     * @example if (o_util.dom.hasClassInParents(element, "myClass")) { ... }
     *
     * @param ele Element
     * @param className Classname to check for
     *
     * @return true if class was found, false if not.
     */
    function hasClassInParents(ele, className) {
        let test = ele;
        for (; test && test !== document; test = test.parentNode) {
            if (test.classList.contains(className)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Checks if an element or one of its ancestors has a certain class name and returns this ancestor or null.
     *
     * @example var wrapper = o_util.dom.getParentByClassName(element, "myClass");
     *
     * @param ele Element
     * @param className Classname to check for
     *
     * @return Element if class was found, null if not.
     */
    function getParentByClassName(ele, className) {
        let test = ele;
        for (; test && test !== document; test = test.parentNode) {
            if (test.classList.contains(className)) {
                return test;
            }
        }
        return null;
    }
    /**
     * Converts a String containing HTML into a DocumentFragment containing DomNodes
     *
     * @param htmlString The String containing HTML
     * @return
     */
    function stringToDocumentFragment(htmlString) {
        const wrapperElement = document.createElement("div");
        const documentFragment = document.createDocumentFragment();
        if (typeof htmlString !== "string") {
            warn(`stringToDocumentFragment should be called with strings containing html only, but was called with ${typeof htmlString}`);
            return documentFragment;
        }
        wrapperElement.innerHTML = htmlString.trim();
        while (wrapperElement.hasChildNodes()) {
            documentFragment.appendChild(wrapperElement.firstChild);
        }
        return documentFragment;
    }
    /**
     * Cross-browser getElementsByClassName.
     * Will be removed when IE8 is doomed.
     *
     * @deprecated Use native document.getElementsByClassName instead.
     *
     * @example var result = o_util.dom.getElementsByClassname(document, "myClass");
     *
     * @param parentElement Parent container element where to search for occurences.
     * @param className CSS class selector to search for.
     *
     * @return List of DOM Elements.
     */
    /* istanbul ignore next: deprecated */
    function getElementsByClassname(parentElement, className) {
        warn("o_util.dom.getElementsByClassname is deprecated, use native document.getElementsByClassName instead");
        return parentElement.getElementsByClassName(className);
    }
    /**
     * Does the element have a specific class?
     *
     * @deprecated Use the native element.classList.contains("myClass") function instead!
     *
     * @example
     * if (o_util.dom.hasClass(document, "myClass")) {
     *      // Do whatever the force wants you to do... :)
     * }
     *
     * @param element DOM element to investigate.
     * @param className CSS class selector withour period.
     *
     * @return I can haz class?
     */
    /* istanbul ignore next: deprecated */
    function hasClass(element, className) {
        warn("o_util.dom.hasClass is deprecated, use native element.classList.contains instead");
        let classList = "";
        if (element && element.getAttribute("class")) {
            classList = element.getAttribute("class");
        }
        else if (element && element.className) {
            classList = element.className;
        }
        return !!classList && !!classList.match
            ? !!classList.match(new RegExp(`(\\s|^)${className}(\\s|$)`))
            : false;
    }
    /**
     * Add Class to Element.
     *
     * @deprecated Use the native element.classList.add("myClass") function instead!
     *
     * @param ele element
     * @param cls classname
     */
    /* istanbul ignore next: deprecated */
    function addClass(ele, cls) {
        warn("o_util.dom.addClass is deprecated, use native element.classList.add instead");
        if (!hasClass(ele, cls)) {
            // eslint-disable-next-line no-param-reassign
            ele.className += ` ${cls}`;
        }
    }
    /**
     * Remove Class from Element.
     *
     * @deprecated Use the native element.classList.remove("myClass") function instead!
     *
     * @param ele element
     * @param cls classname
     */
    /* istanbul ignore next: deprecated */
    function removeClass(ele, cls) {
        warn("o_util.dom.removeClass is deprecated, use native element.classList.remove instead");
        ele.classList.remove(cls);
    }
    /**
     * Add Class to Element if none is existent, remove if it is there.
     *
     * @deprecated Use the native element.classList.toggle("myClass") function instead!
     *
     * @param ele element
     * @param cls classname
     */
    /* istanbul ignore next: deprecated */
    function toggleClass(ele, cls) {
        warn("o_util.dom.toggleClass is deprecated, use native element.classList.toggle instead");
        ele.classList.toggle(cls);
    }
    const d = {
        getElementsByClassname,
        hasClass,
        hasClassInParents,
        getParentByClassName,
        addClass,
        removeClass,
        toggleClass,
        stringToDocumentFragment,
    };
    /**
     * Utility collection of DOM related helper functions.
     */
    const dom = d;

    /**
     * Transforms an object into a fragment string.
     * [jQuery] Replaces $.param.fragment([val]);
     *
     * @example
     *
     * const res = serialize({ a: 5, b: 10 }); // returns "#a=5&b=10"
     *
     * @param obj Object to serialize
     * @returns Serialized object as string.
     */
    function serialize$1(obj) {
        if (obj && typeof obj === "object") {
            return `#${core.serialize(obj)}`;
        }
        return undefined;
    }
    function deserialize$1(...args) {
        const fragment = args[0];
        let coerce = args[1];
        // If deserialize was called with only a boolean parameter,
        // expect it to be the coerce value for window.location.hash
        if (typeof fragment === "boolean" && typeof coerce === "undefined") {
            coerce = fragment;
        }
        else {
            // Otherwise set it default to true, if not existent
            coerce = typeof coerce === "boolean" ? coerce : true;
        }
        if (typeof fragment === "string") {
            if (fragment.indexOf("#") > -1) {
                return core.deserialize(fragment.split("#")[1], coerce);
            }
            return {};
        }
        if (!window.location.hash) {
            return {};
        }
        return core.deserialize(window.location.hash.substring(1), coerce);
    }
    /**
     * Overwrites the window.location.hash (fragment) if given value is string.
     *
     * @example
     * o_util.fragment.set("#t=1337");
     *
     * @param fragment The fragment string
     */
    function set$1(fragment) {
        if (typeof fragment === "string") {
            window.location.hash = fragment;
        }
    }
    /**
     * Returns the value of a given key from the fragment of window.location.hash
     * or an optional specified `url`.
     *
     * [jQuery] Replaces $.bbq.getState([val]);
     *
     * @example
     * // If window.location.hash is #a=5&b=true
     * o_util.fragment.get("b") === true
     * o_util.fragment.get("a") === 5
     *
     * @param param The target fragment key
     * @param [url] URL containing a fragment (optional)
     * @returns value Value of Hash-Key or the whole fragment
     */
    function get$3(param, url) {
        if (typeof param === "string") {
            const deserialized = !!url && url.indexOf("#") > -1
                ? deserialize$1(`#${url.split("#")[1]}`)
                : deserialize$1(window.location.hash);
            return Object.prototype.hasOwnProperty.call(deserialized, param)
                ? deserialized[param]
                : undefined;
        }
        if (!param) {
            return window.location.hash === "#"
                ? /* istanbul ignore next: this is always "" if hash = "#" */ ""
                : window.location.hash;
        }
        return undefined;
    }
    /**
     * Removes a given key from the fragment of window.location.hash
     * or optional an `url`.
     *
     * [jQuery] Replaces $.bbq.removeState([val]);
     *
     * @example
     * // If window.location.hash is #a=5&b=true
     * o_util.fragment.remove("a") // Resulting window.location.hash will be #b=true
     *
     * @param param The target fragment key
     * @param [url] URL containing a fragment (optional)
     * @returns Returns true or false as done status or if an `url` is given the remaining result
     */
    function remove$2(param, url) {
        if (typeof param === "string" && !!get$3(param, url)) {
            let deserialized;
            if (typeof url === "string") {
                if (url.indexOf("#") > 1) {
                    const splitted = url.split("#");
                    deserialized = deserialize$1(`#${splitted[1]}`);
                    delete deserialized[param];
                    const serialized = serialize$1(deserialized);
                    // Return Modified Url
                    return splitted[0] + (serialized.length > 1 ? serialized : "");
                }
                return false;
            }
            deserialized = deserialize$1(window.location.hash);
            delete deserialized[param];
            // Set modified hash to window.location
            set$1(serialize$1(deserialized));
            return true;
        }
        return false;
    }
    /**
     * Overwrites or merges the value of a specific key in
     * the fragment of window.location.hash or an optional given `url`.
     *
     * [jQuery] Replaces $.bbq.pushState([val]);
     *
     * @example
     * // Fragment as object with given url string
     * o_util.fragment.push({
     *      "hello": "world",
     *      "value": 5
     * }, "https://otto.de/#test=5&hello=a");
     * // Returns "https://otto.de/#test=5&hello=world&value=5"
     *
     *
     * // Fragment as string with existing window.location.hash === #these=exist&can=replace
     * o_util.fragment.push("#hello=world&can=5");
     * // Resulting window.location.hash will be "#these=exist&can=5&hello=world"
     *
     * @param fragment A serialized OR unserialized fragment
     * @param [url] URL containing a fragment (optional)
     * @returns The new resulting fragment or undefined, if fragment was not a string.
     */
    function push(fragment, url) {
        // Convert fragment object to string for default handling
        const fragm = typeof fragment === "object" ? serialize$1(fragment) : fragment;
        if (typeof fragm === "string") {
            /** The target fragment which should be changed */
            const target = core.deserialize(fragm.replace("#", ""), false);
            /**  The source fragment (`url` or `window.location.hash`) */
            let source;
            /** The final result */
            let merged;
            /** Splitted `url` param (between `#`) */
            let splitted;
            if (typeof url === "string") {
                // Replace fragment in `url` string or append
                if (url.indexOf("#") > 1) {
                    splitted = url.split("#");
                    source = core.deserialize(splitted[1], false);
                    // Merge by extending
                    merged = serialize$1(core.extend(source, target));
                    return splitted[0] + merged;
                }
                return url + fragm;
            }
            source = core.deserialize(window.location.hash.substring(1), false);
            merged = serialize$1(core.extend(source, target));
            set$1(merged);
            return merged;
        }
        return undefined;
    }
    /**
     * Helper functions for hash handling within URLs
     *  (e.g. https =//otto.de/#value=5)
     */
    const fragment = { serialize: serialize$1, deserialize: deserialize$1, set: set$1, get: get$3, remove: remove$2, push };

    const hasNative = "scrollRestoration" in window.history;
    const initial = hasNative ? window.history.scrollRestoration : "auto";
    const data = { hasNative, initial };

    /**
     * Sets history.scrollRestoration
     * @param scrollRestoration "auto" | "manual"
     */
    function setScrollRestoration(scrollRestoration) {
        if (data.hasNative) {
            window.history.scrollRestoration = scrollRestoration;
        }
    }
    /**
     * Resets Scroll
     */
    function resetScrollRestoration() {
        setScrollRestoration(data.initial);
    }
    /**
     * Utility collection of history related functions.
     */
    const history = {
        setScrollRestoration,
        resetScrollRestoration,
    };

    /**
     * Reads the pagecluster information from html-data-attribute.
     */
    function getPagecluster() {
        return document.documentElement.getAttribute("data-pagecluster");
    }
    /**
     * Returns true if responsive-preview cookie exists with value true, false otherwise.
     *
     * @example o_util.misc.isResponsive();
     *
     * @return Is responsive-preview cookie set and true?
     */
    function isResponsive() {
        return cookie.get("responsive-preview") === "true";
    }
    /**
     * Determine if the mouse button you expected to be clicked was actually clicked.
     * Initially implemented due to event handling bug in firefox.
     *
     * @example
     *
     * ```ts
     *
     * // Check if the left mouse button was clicked.
     * if(isValidMouseButton(event, 1)) {
     *    // do stuff
     * }
     * ```
     *
     * @param event Received event object.
     * @param key MouseButton Code. For further details see:
     *                          https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/which
     *                          https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
     *
     * @return Was the mouse button the one you expected?
     */
    function isValidMouseButton(event, key) {
        if (typeof (event === null || event === void 0 ? void 0 : event.which) === "number") {
            return event.which === key;
        }
        return true;
    }
    /**
     * Set vendor prefixed style of an element.
     *
     * @example
     * // This will set the transform property via javascript - additional to the original style - with webkit, Moz, ms and O prefix.
     * o_util.misc.setVendorStyle(modalContainer, "transform", "translateY(0)");
     *
     * @param element The DOM element that will be styled.
     * @param property The CSS property.
     * @param value The property"s value.
     */
    function setVendorStyle(element, property, value) {
        // Automatically uppercase the first letter of the property.
        const prefixProperty = property.charAt(0).toUpperCase() + property.slice(1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { style } = element;
        style[`webkit${prefixProperty}`] = value;
        style[`Moz${prefixProperty}`] = value;
        style[`ms${prefixProperty}`] = value;
        style[`O${prefixProperty}`] = value;
        style[property] = value;
    }
    /**
     * Generates a very unique string (Globally Unique Identifier)
     *
     * @return Very unique string (Globally Unique Identifier)
     */
    function guid() {
        /**
         * Generates a random number.
         */
        const s4 = () => {
            return Math.floor((1 + random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    }
    /**
     * Convert an url string to an actual HTMLAnchorElement.
     * Hint: All versions of Internet Explorer omit the leading slash in pathname property!
     *
     * @param urlString Url string which must contain
     *
     * @return Anchor element which contains information about pathname,
     */
    function urlToLinkObject(urlString) {
        const anchorElement = document.createElement("a");
        anchorElement.href = urlString;
        return anchorElement;
    }
    /**
     * @param urlString Url string.
     *
     * @return true, when on preview,
     */
    function isPreview(urlString) {
        if (typeof urlString !== "string") {
            warn("o_util.misc.isPreview() parameter is no string");
            return false;
        }
        return urlString.indexOf("/shoppages/preview") !== -1;
    }
    /**
     * Utility collection of miscellaneous functions.
     */
    const misc = {
        getPagecluster,
        isResponsive,
        isValidMouseButton,
        setVendorStyle,
        guid,
        urlToLinkObject,
        isPreview,
    };

    const legacy = { ajaxLegacy, getNewScrollPosition };

    var o_util = {
        __proto__: null,
        ajax: ajax,
        animation: animation,
        browser: browser,
        connection: connection,
        cookie: cookie,
        core: core,
        dom: dom,
        event: event,
        fragment: fragment,
        hardcore: hardcore,
        history: history,
        legacy: legacy,
        misc: misc,
        toggle: toggle
    };

    window.o_util = window.o_util || o_util;
    window.o_global = window.o_global || {};
    window.o_global.helper = window.o_global.helper || {};
    // Core Namespace fallbacks.
    window.o_global.helper.bind = core.bind;
    window.o_global.helper.clone = core.clone;
    window.o_global.helper.convertStringToFunction = core.convertStringToFunction;
    window.o_global.helper.extend = core.extend;
    window.o_global.helper.removeFromArray = core.removeFromArray;
    window.o_global.helper.isPlainObject = core.isPlainObject;
    window.o_global.helper.isEmptyObject = core.isEmptyObject;
    window.o_global.helper.cloneFunction = core.cloneFunction;
    // Cookie Namespace fallbacks.
    window.o_global.helper.cookieExist = cookie.exists;
    window.o_global.helper.getCookie = cookie.get;
    window.o_global.helper.getCookieValue = cookie.get;
    window.o_global.helper.removeCookie = cookie.remove;
    window.o_global.helper.setCookie = cookie.set;
    // Event Namespace fallbacks.
    window.o_global.helper.delegate = event.delegate;
    window.o_global.helper.stopEvent = event.stop;
    window.o_global.helper.whichTransitionEvent = event.whichTransitionEndEvent;
    window.o_global.helper.addEvent = event.add;
    window.o_global.helper.getEventTarget = event.getTarget;
    window.o_global.helper.preventDefault = event.preventDefault;
    window.o_global.helper.removeEvent = event.remove;
    window.o_global.helper.stopPropagation = event.stopPropagation;
    // DOM Namespace fallbacks.
    window.o_global.helper.hasClassInParents = dom.hasClassInParents;
    window.o_global.helper.getParentByClassName = dom.getParentByClassName;
    window.o_global.helper.stringToDocumentFragment = dom.stringToDocumentFragment;
    window.o_global.helper.hasClass = dom.hasClass;
    window.o_global.helper.removeClass = dom.removeClass;
    window.o_global.helper.toggleClass = dom.toggleClass;
    window.o_global.helper.getElementsByClassname = dom.getElementsByClassname;
    window.o_global.helper.addClass = dom.addClass;
    // Animation Namespace fallbacks.
    window.o_global.helper.Easings = animation.easings;
    window.o_global.helper.requestAnimFrame = animation.requestAnimFrame;
    window.o_global.helper._getNewScrollPosition = legacy.getNewScrollPosition;
    window.o_global.helper.scrollTo = animation.scrollTo;
    // Ajax Namespace fallbacks.
    window.o_global.helper.ajax = legacy.ajaxLegacy;
    // Browser Namespace fallbacks.
    window.o_global.helper.getScrollbarWidth = browser.getScrollbarWidth;
    window.o_global.helper.getStyle = browser.getStyle;
    window.o_global.helper.isIE8 = browser.isIE8;
    // History Namespace fallbacks.
    window.o_global.helper.setScrollRestoration = history.setScrollRestoration;
    window.o_global.helper.resetScrollRestoration = history.resetScrollRestoration;
    // Misc Namespace fallbacks.
    window.o_global.helper.isResponsive = misc.isResponsive;
    window.o_global.helper.isValidMouseButton = misc.isValidMouseButton;
    window.o_global.helper.setVendorStyle = misc.setVendorStyle;
    // Hardcore Namespace fallbacks.
    window.o_global.helper.evalScript = hardcore.evalScript;
    window.o_global.helper.executeInlineScripts = hardcore.executeInlineScripts;
    // From 099_helper.legacy
    // Sets the document.referrer to a global JS namespace.
    window.o_global.referrer = document.referrer;
    // Further legacy mappings. No clue what they're for...
    window.o_global.getCookieValue = window.o_global.helper.getCookieValue;
    window.o_global.convertStringToFunction = window.o_global.helper.convertStringToFunction;
    window.o_global.isResponsive = window.o_global.helper.isResponsive;

}());
