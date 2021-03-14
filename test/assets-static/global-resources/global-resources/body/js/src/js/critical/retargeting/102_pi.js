/**
 * Exactag Unified Event Handler
 *
 * requires json2.js, cycle.js from Douglas Crockford
 * available at https://github.com/douglascrockford/JSON-js
 *
 * @comments:
 * These prerequisites are recommended for optimal performance:
 *   - Page should not use variables: exactag
 *   - Can be included either in <head> or in <body>
 *   - Execution faster, if loaded early in DOM
 *
 * @copyright Exactag GmbH, Duesseldorf, Germany
 */

/*jslint plusplus: true, white: true, browser: true */

window.exactag = window.exactag || window.pi || {}; // exactag is set in calling document

(function (win) {

    "use strict";

    // test access to window.top

    try {
        if (typeof win.location.toString() !== "string") {
            win = window.self;
        }
    } catch (e) {
        win = window.self;
    }

    // initialize variables

    var pi,
        doc = win.document,
        console = win.console || {},
        JSON = win.JSON || {},
        Pi = function () {
            return undefined;
        },
        Exactag = function () {
            return undefined;
        };

    if (console.log === undefined) {
        console.log = function () {
            return undefined;
        };
    }

    var emailPattern = /[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(@|%40|%2540)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})/gi;

    // define prototypes

    var measureStart = new Date().getTime();
    var measureNamespace = "exactagRegex";
    var lastRegexMatch = "";

    Pi.prototype = {
        version: "3.0.20141107",
        dependencies: [
            {
                object: "JSON",
                property: "stringify",
                type: "function",
                scope: win
            },
            {
                object: "JSON",
                property: "decycle",
                type: "function",
                scope: win
            }
        ],
        cfg: {
            type: "Content",
            conversiontype: "",
            referrer: doc.referrer.replace(emailPattern, function () {
                if (lastRegexMatch !== doc.referrer && !!window.AS && !!window.AS.RUM && !!window.AS.RUM.sendCustomRequest && typeof window.AS.RUM.sendCustomRequest === "function") {
                    window.AS.RUM.sendCustomRequest(measureNamespace, {
                        "duration": new Date().getTime() - measureStart,
                        "type": "referrer"
                    });
                }

                lastRegexMatch = doc.referrer;

                return "";
            }),
            host: win.location.host,
            site: win.location.pathname,
            search: win.location.search.replace(emailPattern, function () {
                if (lastRegexMatch !== win.location.search && !!window.AS && !!window.AS.RUM && !!window.AS.RUM.sendCustomRequest && typeof window.AS.RUM.sendCustomRequest === "function") {
                    window.AS.RUM.sendCustomRequest(measureNamespace, {
                        "duration": new Date().getTime() - measureStart,
                        "type": "search"
                    });
                }

                lastRegexMatch = win.location.search;

                return "";
            }),
            campaign: "",
            screensize: "",
            pitype: "",
            trackingURL: "//pxc.otto.de"
        },
        cName: "exactag",
        contentNode: false,
        stopwatch: {
            start: new Date().getTime()
        },
        rootDoc: null,
        uid: null,
        item: {},
        logStack: [],
        traceFrequency: 1e3,
        traceUntil: new Date(2013, 0, 26),
        traceEnabled: false,
        readyToTrack: false,
        nfif: true,
        enabled: true,
        style: "position:absolute; width:0px; height:0px; overflow: hidden; border: 0;",
        init: function () {
            this.getConfig();
            this.meantime("pi.init");
            this.createContainers();
        },
        createContainers: function () {
            // retry as long as doc.body does not exist
            if (doc.body === null) {
                win.setTimeout(this.createDelegate(this, this.createContainers), 10);
                return;
            }
            this.meantime("pi.createContainers");
            this.createContentNode();
            this.setReadyToTrack();
        },
        createDelegate: function (object, method) {
            return function (args) {
                method.apply(object, arguments, args);
            };
        },
        createContentNode: function () {
            // create root iframe
            var root = doc.createElement("iframe");
            root.setAttribute("id", this.cName + "_" + this.uid);
            root.style.cssText = this.style;
            doc.getElementsByTagName('body')[0].appendChild(root);
            this.rootDoc = this.getDocument(root);
            try {
                this.rootDoc.open('text/html', 'replace');
                // reset doc to document in root iframe, added special handling for IE7 & 8
                // mb_fonts.swf is only accessible via GetVariable() for root.document
                // doc = root.document ? root.document : this.rootDoc; // unfortunately also true for IE 9
                doc = this.ieVersion > 0 && this.ieVersion < 9 ? root.document || this.rootDoc : this.rootDoc;

                this.rootDoc.close();
            } catch (e) {
                this.report("accessing root iframe failed", "error");
                return;
            }
            this.contentNode = this.rootDoc.createElement("div");
            this.contentNode.id = this.cName + "_pi_content";
            this.rootDoc.body.appendChild(this.contentNode);

            this.log("this.rootDoc filled ", this.uid);

        },
        processItem: function (item) {

            if (typeof item !== "object") {
                this.report("no valid tracking object passed", "error");
                return;
            }

            if (!this.readyToTrack) {
                this.log("not ready to track yet ... retrying in 10ms");
                win.setTimeout(this.createDelegate(this, this.processItem), 10, item);
                return;
            }

            this.meantime("pi.processItem");

            var element, src;

            // get tracking config
            this.item = this.getTrackingConfig(item);
            this.log("trackingConfig", this.item);

            // create jsonp call to tracking handler
            this.meantime("exctag.callHandler");

            src = this.item.trackingURL + '/pi.aspx?campaign=' + this.item.campaign +
                '&pitype=' + this.item.type + '&convtype=' + this.item.conversiontype;

            if (this.nfif === true) {

                try {
                    this.post(src + "&retmode=7", {
                        items: this.stringify(this.item)
                    });
                } catch (f) {
                    this.report("post to pi.aspx failed", "error");
                }

            } else {

                try {
                    src += '&items=' + encodeURIComponent(this.stringify(this.item));

                    element = this.rootDoc.createElement("script");
                    element.setAttribute("src", src);
                    element.setAttribute("type", "text/javascript");
                    this.rootDoc.body.appendChild(element);

                } catch (g) {
                    this.report("calling pi.aspx in iframe failed", "error");
                }

            }

            this.log("exactag reinit", exactag);

            // calculate execution time
            this.meantime("pi.handlerCalled");
        },
        getDocument: function (obj) {
            var prefix, rdoc = null;
            try {
                rdoc = obj.contentDocument || obj.contentWindow.document || obj.document;
            } catch (e) {
                // jslint complains about javascript URLs, so we split string here
                prefix = "javascript";
                obj.setAttribute("src", prefix + ':(function(){document.open();document.domain="' + doc.domain + '";})()');
                rdoc = obj.contentDocument || obj.contentWindow.document || obj.document;
            }
            return rdoc;
        },
        appendHiddenField: function (name, value, parent) {
            var field;
            field = this.rootDoc.createElement("input");
            field.setAttribute("type", "hidden");
            field.setAttribute("name", name);
            field.setAttribute("value", value);
            parent.appendChild(field);
        },
        createContainer: function (id) {
            var s, container = this.rootDoc.getElementById(id);
            if (container === null) {
                s = this.rootDoc.createElement("div");
                s.id = id;
                this.rootDoc.body.appendChild(s);
            }
            return s;
        },
        log: function () {
            var log, args = arguments;
            this.logStack.push(args);
            if (this.debug) {
                args[0] = this.uid + " - " + args[0];
                if (this.ieVersion >= 9) {
                    log = Function.prototype.bind.call(console.log, console);
                    log.apply(console, arguments);
                } else if (!Function.prototype.bind && console !== 'undefined' && typeof console.log === 'object') {
                    Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
                } else {
                    try {
                        console.log.apply(console, arguments);
                    } catch (e) {
                        console.log(arguments);
                    }
                }
            }
        },
        report: function (msg, type) {
            var err = {}, cfg;
            err.type = type || "error";
            err.uid = this.uid;
            err.component = "tracking";
            err.msg = msg;
            err.exactag = this.item;
            err.campaign = this.item.campaign || "";
            err.host = win.location.host;
            err.site = win.location.pathname;
            err.search = win.location.search.replace(emailPattern, "");
            err.ua = navigator.userAgent;
            err.log = this.logStack;
            err.version = this.version;

            cfg = this.bear(this.cfg);

            if (err.type === "error") {
                this.post(cfg.trackingURL + "/jstrace.aspx", {
                    data: this.stringify(err)
                });
                this.log("ERROR: " + msg);
            } else {
                this.log(msg, this.stringify(err));
                if (this.traceEnabled || this.debug) {
                    this.post(cfg.trackingURL + "/jstrace.aspx", {
                        data: this.stringify(err)
                    });
                }
            }
        },
        setDebugMode: function () {
            var v = (win.location.hash.indexOf(this.cName + '_debug') > -1) ? 1 : 0;
            this.debug = !!(v === 1);
            return this.debug;
        },
        meantime: function (title) {
            var time, meantime = new Date().getTime();
            time = meantime - this.stopwatch.start;
            this.log(title + ': ' + time / 1000 + 's');
        },
        getUid: function () {
            if (!this.uid) {
                this.uid = this.getRandomId(4);
            }
            return this.uid;
        },
        getRandomId: function (length) {
            var i, rid = "",
                possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (i = 0; i < length; i++) {
                rid += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return rid;
        },
        getConfig: function () {
            // needed for logging
            this.setDebugMode();
            this.getUid();

            // set defaults
            this.logStack = [];
            this.item = {};
            this.stopwatch.start = new Date().getTime();

            try {
                if (exactag.nfif === true) {
                    this.nfif = exactag.nfif;
                    delete exactag.nfif;
                }
                if (this.traceFrequency > 0 && Math.ceil(Math.random() * this.traceFrequency) === this.traceFrequency
                    && this.traceUntil.getTime() > new Date().getTime()) {
                    this.log("trace enabled");
                    this.traceEnabled = true;
                }
            } catch (ignore) {
            }
        },
        extend: function (destination, source) {
            var property;
            for (property in source) {
                if (typeof source[property] !== "function" && source[property] !== undefined) {
                    destination[property] = source[property];
                }
            }
            return destination;
        },
        setReadyToTrack: function () {
            this.readyToTrack = true;
        },
        getItem: function (data) {
            var i, obj = {};
            for (i in data) {
                if (typeof data[i] !== "function") {
                    obj[i] = data[i];
                }
            }
            return obj;
        },
        bear: function (obj) {
            return JSON.parse(JSON.stringify(JSON.decycle(obj)));
        },
        getTrackingConfig: function (item) {
            var i, obj = this.bear(this.cfg);
            for (i in item) {
                if (item[i] !== undefined) { // for jslint
                    obj[i] = item[i];
                }
            }
            return obj;
        },
        stringify: function (mixed) {
            return JSON.stringify(JSON.decycle(mixed));
        },
        post: function (url, data) {
            var uid, element, form, i;

            uid = "exactag_" + this.getRandomId(5);

            try {
                // IE below 8 ignores setting id of an element via setAttribute
                element = this.rootDoc.createElement("<iframe id='" + uid + "' name='" + uid + "'>");
            } catch (e) {
                element = this.rootDoc.createElement("iframe");
                element.setAttribute("id", uid);
                element.setAttribute("name", uid);
            }

            this.rootDoc.body.appendChild(element);

            form = this.rootDoc.createElement("form");
            form.setAttribute("action", url);
            form.setAttribute("target", uid);
            form.setAttribute("method", "POST");

            for (i in data) {
                if (data[i] !== undefined) {
                    this.appendHiddenField(i, encodeURIComponent(data[i]), form);
                }
            }

            this.rootDoc.body.appendChild(form);
            form.submit();
        },
        checkDependencies: function () {
            var i, errors = [], d, hasError;
            for (i in this.dependencies) {
                if (typeof  this.dependencies[i] === "object") {
                    d = this.dependencies[i];
                    hasError = false;
                    try {
                        if (typeof d.scope[d.object][d.property] !== "function") {
                            hasError = true;
                        }
                    } catch (e) {
                        hasError = true;
                    }

                    if (hasError) {
                        errors.push(d.object + "." + d.property + " is not a " + d.type);
                    }
                }
            }

            if (errors.length > 0) {
                this.disable("found one or more missing dependencies\n - " + errors.join("\n - "));
            } else {
                this.log("dependency detection OK", this.dependencies);
            }
        },
        disable: function (msg) {
            this.log("ERROR: " + msg);
            // we'd throw an error here, but disabled due to possible sideeffects with 3rd
            // party libs in compiled code. So we just set a property
            this.enabled = false;
        }
    };

    // define tracking object

    Exactag.prototype = {
        track: function (obj) {

            var pi = new Pi();
            pi.checkDependencies();
            if (pi.enabled === true) {
                pi.init();
                pi.meantime("exactag.track");
                if (obj === undefined) {
                    obj = pi.getItem(this);
                    pi.log("item read from exactag object", obj);
                } else {
                    pi.log("object injected into exactag.track", obj);
                }
                pi.processItem(obj);
                exactag = new Exactag();
            } else {
                console.log("pi.js dependency error: ", pi.logStack.pop());
            }
        }
    };

    // init tracking

    // new delivery method, exactag is set before pi.js is called
    if (typeof exactag.campaign === "string") {

        // instantiate pi
        pi = new Pi();
        pi.checkDependencies();
        if (pi.enabled === true) {
            pi.init();
            // process item found in object exactag
            pi.log("found item in exactag", exactag);
            pi.processItem(pi.getItem(exactag));
        } else {
            console.log("pi.js dependency error: ", pi.logStack.pop());
        }
    }

    // prepare global exactag object for subsequent calls to exactag.track()
    exactag = new Exactag();

}(window.top));
