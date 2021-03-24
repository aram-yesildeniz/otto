function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function (key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}

function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally {
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally {
            if (_d) throw _e;
        }
    }
    return _arr;
}

function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}

function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
    }
    return _typeof(obj);
}
var preload_polyfill = function () {
        "use strict";
        var e = "success",
            t = "try-with-error",
            n = "error",
            o = "noinvoke",
            i = function i(e) {
                e.setAttribute("rel", "stylesheet"), e.setAttribute("type", "text/css"), e.setAttribute("media", "all"), e.removeAttribute("as");
            },
            r = function r(t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e;
                n === e && t.hasAttribute("noinvoke") ? (t.removeAttribute("noinvoke"), t.setAttribute("data-preloaded", o)) : t.setAttribute("data-preloaded", n), t.removeEventListener("load", window.invokePreload.onLoad), t.onload = null;
            },
            s = function () {
                try {
                    return new Function("(a = 0) => a"), !0;
                } catch (e) {
                    return !1;
                }
            }(),
            a = function a(t, n) {
                r(n, e), n.dispatchEvent(new CustomEvent("load", t));
            },
            l = function l(e, t) {
                r(t, e);
            },
            c = function c(e) {
                var o, i;
                (o = 3e3, i = fetch(e.href, {
                    method: "GET",
                    mode: "cors",
                    cache: "force-cache"
                }), new window.Promise(function (e, t) {
                    setTimeout(function () {
                        return t(new Error("timeout"));
                    }, o), i.then(e, t);
                })).then(function (o) {
                    o.ok ? a(null, e) : 404 === o.status ? l(n, e) : l(t, e);
                }).catch(function () {
                    return l(t, e);
                });
            },
            u = function u(e) {
                if (window.o_global && window.o_global.toggles && !window.o_global.toggles.EMR_PRELOAD_POLYFILL_DISABLE_FETCH) {
                    if (window.fetch) return c(e);
                } else if ((!window.o_global || !window.o_global.toggles) && window.fetch) return c(e);
                var o = new XMLHttpRequest();
                o.addEventListener("load", function (i) {
                    o.status >= 200 && o.status < 400 ? a(i, e) : 404 === o.status ? l(n, e) : l(t, e);
                }), o.addEventListener("error", function () {
                    l(t, e);
                }), o.addEventListener("timeout", function () {
                    l(t, e);
                }), o.open("GET", e.href, !0), o.timeout = 3e3, o.send();
            },
            d = function d(t) {
                var n;
                r(t, e), n = t, -1 === [].map.call(document.styleSheets, function (e) {
                    try {
                        return "all" === e.media.mediaText ? e.href : null;
                    } catch (e) {
                        return null;
                    }
                }).indexOf(n.href) && (window.requestAnimationFrame ? window.requestAnimationFrame(function () {
                    return i(n);
                }) : i(n)), n.removeAttribute("onload");
            },
            f = function f(e) {
                switch (e.getAttribute("as")) {
                    case "script":
                        ! function (e) {
                            "nomodule" === e.getAttribute("rel") && e.setAttribute("rel", "preload"), u(e);
                        }(e);
                        break;
                    case "image":
                        ! function (e) {
                            var t = new Image();
                            t.onload = function (t) {
                                return a(t, e);
                            }, t.onerror = function () {
                                return l(n, e);
                            }, t.src = e.href;
                        }(e);
                        break;
                    case "style":
                        d(e);
                        break;
                    case "font":
                        ! function (e) {
                            document.fonts && e.hasAttribute("name") ? new FontFace(e.getAttribute("name"), "url(".concat(e.href, ")"), {
                                weight: e.getAttribute("weight") || "normal",
                                style: "normal"
                            }).load(e.href).then(function (t) {
                                document.fonts.add(t), a(null, e);
                            }).catch(function () {}) : u(e);
                        }(e);
                        break;
                    default:
                        u(e);
                }
            },
            p = [],
            h = function h(e) {
                -1 === p.indexOf(e.href) && (function (e) {
                    if (("script" === e.getAttribute("as") || "worker" === e.getAttribute("as")) && ("nomodule" === e.getAttribute("rel") || e.hasAttribute("module"))) {
                        var t = "nomodule" === e.getAttribute("rel");
                        if (e.hasAttribute("module") && !s || t && s) return !0;
                    }
                    return !1;
                }(e) || (f(e), p.push(e.href)));
            },
            g = function g(e) {
                if (window.MutationObserver) {
                    var t = new MutationObserver(function (e) {
                        return function (e) {
                            for (var t = 0, n = e.length; t < n; t++) {
                                for (var o = e[t].addedNodes, i = 0, r = o.length; i < r; i++) {
                                    var s = o[i];
                                    "LINK" !== s.nodeName || !s.hasAttribute("rel") || "preload" !== s.getAttribute("rel") && "nomodule" !== s.getAttribute("rel") || h(s);
                                }
                            }
                        }(e);
                    }).observe(document.documentElement, {
                        childList: !0,
                        subtree: !0
                    });
                    document.addEventListener("DOMContentLoaded", function () {
                        t && t.disconnect();
                    });
                } else document.addEventListener("DOMContentLoaded", function () {
                    w(e);
                });
            },
            w = function w(e) {
                for (var t, n = function (e) {
                        for (var t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document).querySelectorAll(e), n = [], o = [], i = 0, r = t.length; i < r; ++i) {
                            var s = t[i]; - 1 === o.indexOf(s.href) && (o.push(s.href), n.push(s));
                        }
                        return n;
                    }(e); void 0 !== (t = n.shift());) {
                    h(t);
                }
            };
        return function () {
            try {
                if (!document.createElement("link").relList.supports("preload")) throw Error;
            } catch (t) {
                w(e = 'link[rel="preload"]'), g(e);
            }
            var e;
        }();
    }(),
    preload_polyfill_invoke = function () {
        "use strict";
        var e = "success",
            t = "try-with-error",
            n = "error",
            o = "noinvoke",
            i = function i(e, t, n) {
                var o = document.createElement("script");
                return o.async = t, o.onload = n, o.onerror = n, o.setAttribute("src", e.href), e.integrity && (o.integrity = e.integrity), e.hasAttribute("crossorigin") && o.setAttribute("crossorigin", e.getAttribute("crossorigin")), e.insertAdjacentElement ? e.insertAdjacentElement("afterend", o) : e.parentNode.appendChild(o), o;
            },
            r = function r(e) {
                e.setAttribute("rel", "stylesheet"), e.setAttribute("type", "text/css"), e.setAttribute("media", "all"), e.removeAttribute("as");
            },
            s = function s(e) {
                return -1 === [].map.call(document.styleSheets, function (e) {
                    try {
                        return "all" === e.media.mediaText ? e.href : null;
                    } catch (e) {
                        return null;
                    }
                }).indexOf(e.href) && (window.requestAnimationFrame ? window.requestAnimationFrame(function () {
                    return r(e);
                }) : r(e)), e.removeAttribute("onload"), e;
            },
            a = function () {
                try {
                    return new Function("(a = 0) => a"), !0;
                } catch (e) {
                    return !1;
                }
            }(),
            l = function l(e) {
                if (("script" === e.getAttribute("as") || "worker" === e.getAttribute("as")) && ("nomodule" === e.getAttribute("rel") || e.hasAttribute("module"))) {
                    var t = "nomodule" === e.getAttribute("rel");
                    if (e.hasAttribute("module") && !a || t && a) return !0;
                }
                return !1;
            },
            c = function c(e) {
                for (var t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document).querySelectorAll(e), n = [], o = [], i = 0, r = t.length; i < r; ++i) {
                    var s = t[i]; - 1 === o.indexOf(s.href) && (o.push(s.href), n.push(s));
                }
                return n;
            },
            u = !0,
            d = function r(s, a, l) {
                var c = s.getAttribute("data-preloaded");
                c === o && l({
                    isError: !1,
                    href: s.href,
                    preloadState: c
                }), c === e ? i(s, a, l) : c === t ? i(s, a, function () {
                    return l({
                        isError: !0,
                        href: s.href,
                        preloadState: c
                    });
                }) : c === n ? l({
                    isError: !0,
                    href: s.href,
                    preloadState: c
                }) : setTimeout(function () {
                    r(s, a, l);
                }, 10);
            };
        document.addEventListener("DOMContentLoaded", function () {
            for (var e, t = c("link[rel='preload'][as='script']"), n = [], o = []; void 0 !== (e = t.shift());) {
                l(e) || (e.hasAttribute("data-critical") || e.hasAttribute("critical") ? n.push(e) : o.push(e));
            }
            u = 0 === n.length,
                function (e) {
                    for (var t = []; e.length;) {
                        t.push(new window.Promise(function (t) {
                            d(e.shift(), !1, t);
                        }));
                    }
                    return window.Promise.all(t);
                }(n).then(function () {
                    return function (e) {
                        for (var t = []; e.length;) {
                            t.push(new window.Promise(function (t) {
                                d(e.shift(), u, t);
                            }));
                        }
                        return window.Promise.all(t);
                    }(o);
                }).then(function (e) {
                    try {
                        var t = e.filter(function (e) {
                            return e && !!e.isError && !!e.href && !!e.preloadState;
                        }).map(function (e) {
                            return "".concat(e.href, ":").concat(e.preloadState);
                        }).join();
                        t.length > 0 && window.AS && window.AS.RUM && "function" == typeof window.AS.RUM.sendCustomRequest && window.AS.RUM.sendCustomRequest("preloadError", {
                            urls: t
                        });
                    } catch (e) {}
                    document.dispatchEvent(new CustomEvent("AllScriptsExecuted"));
                });
        });
        return function (e) {
            for (var t, n = c('link[rel="preload"]', e); void 0 !== (t = n.shift());) {
                "script" === t.getAttribute("as") ? l(t) || i(t, !1) : "style" === t.getAttribute("as") && s(t);
            }
        };
    }();
String.prototype.includes || (String.prototype.includes = function (e, t) {
        "use strict";
        return "number" != typeof t && (t = 0), !(t + e.length > this.length) && -1 !== this.indexOf(e, t);
    }), Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
        value: function value(e, t) {
            if (null == this) throw new TypeError('"this" is null or not defined');
            var n = Object(this),
                o = n.length >>> 0;
            if (0 === o) return !1;
            var i, r, s = 0 | t,
                a = Math.max(s >= 0 ? s : o - Math.abs(s), 0);
            for (; a < o;) {
                if ((i = n[a]) === (r = e) || "number" == typeof i && "number" == typeof r && isNaN(i) && isNaN(r)) return !0;
                a++;
            }
            return !1;
        }
    }),
    function () {
        "use strict"; /*! @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill */
        var e, t, n, o;
        Array.from || (Array.from = (e = Object.prototype.toString, t = function t(_t) {
                return "function" == typeof _t || "[object Function]" === e.call(_t);
            }, n = Math.pow(2, 53) - 1, o = function o(e) {
                var t = function (e) {
                    var t = Number(e);
                    return isNaN(t) ? 0 : 0 !== t && isFinite(t) ? (t > 0 ? 1 : -1) * Math.floor(Math.abs(t)) : t;
                }(e);
                return Math.min(Math.max(t, 0), n);
            }, function (e) {
                var n = Object(e);
                if (null == e) throw new TypeError("Array.from requires an array-like object - not null or undefined");
                var i, r = arguments.length > 1 ? arguments[1] : void 0;
                if (void 0 !== r) {
                    if (!t(r)) throw new TypeError("Array.from: when provided, the second argument must be a function");
                    arguments.length > 2 && (i = arguments[2]);
                }
                for (var s, a = o(n.length), l = t(this) ? Object(new this(a)) : new Array(a), c = 0; c < a;) {
                    s = n[c], l[c] = r ? void 0 === i ? r(s, c) : r.call(i, s, c) : s, c += 1;
                }
                return l.length = a, l;
            })) /*! @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill */ , Array.isArray || (Array.isArray = function (e) {
                return "[object Array]" === Object.prototype.toString.call(e);
            }) /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */ , "document" in self && function () {
                var e = !0;
                try {
                    Object.defineProperty(document.createElement("_"), "classList", {
                        get: function get() {}
                    });
                } catch (t) {
                    e = !1;
                }!e || "classList" in document.createElement("_") && (!document.createElementNS || "classList" in document.createElementNS("http://www.w3.org/2000/svg", "g")) ? function () {
                    var e = document.createElement("_");
                    if ("classList" in e) {
                        if (e.classList.add("c1", "c2"), !e.classList.contains("c2")) {
                            var t = function t(e) {
                                var t = DOMTokenList.prototype[e];
                                DOMTokenList.prototype[e] = function (e) {
                                    var n, o = arguments.length;
                                    for (n = 0; n < o; n++) {
                                        e = arguments[n], t.call(this, e);
                                    }
                                };
                            };
                            t("add"), t("remove");
                        }
                        if (e.classList.toggle("c3", !1), e.classList.contains("c3")) {
                            var n = DOMTokenList.prototype.toggle;
                            DOMTokenList.prototype.toggle = function (e, t) {
                                return 1 in arguments && !this.contains(e) == !t ? t : n.call(this, e);
                            };
                        }
                        e = null;
                    }
                }() : function (e) {
                    if ("Element" in e) {
                        var t = e.Element.prototype,
                            n = Object,
                            o = String.prototype.trim || function () {
                                return this.replace(/^\s+|\s+$/g, "");
                            },
                            i = Array.prototype.indexOf || function (e) {
                                for (var t = 0, n = this.length; t < n; t++) {
                                    if (t in this && this[t] === e) return t;
                                }
                                return -1;
                            },
                            r = function r(e, t) {
                                this.name = e, this.code = DOMException[e], this.message = t;
                            },
                            s = function s(e, t) {
                                if ("" === t) throw new r("SYNTAX_ERR", "An invalid or illegal string was specified");
                                if (/\s/.test(t)) throw new r("INVALID_CHARACTER_ERR", "String contains an invalid character");
                                return i.call(e, t);
                            },
                            a = function a(e) {
                                for (var t = o.call(e.getAttribute("class") || ""), n = t ? t.split(/\s+/) : [], i = 0, r = n.length; i < r; i++) {
                                    this.push(n[i]);
                                }
                                this._updateClassName = function () {
                                    e.setAttribute("class", this.toString());
                                };
                            },
                            l = a.prototype = [],
                            c = function c() {
                                return new a(this);
                            };
                        if (r.prototype = Error.prototype, l.item = function (e) {
                                return this[e] || null;
                            }, l.contains = function (e) {
                                return -1 !== s(this, e += "");
                            }, l.add = function () {
                                var e, t = arguments,
                                    n = 0,
                                    o = t.length,
                                    i = !1;
                                do {
                                    e = t[n] + "", -1 === s(this, e) && (this.push(e), i = !0);
                                } while (++n < o);
                                i && this._updateClassName();
                            }, l.remove = function () {
                                var e, t, n = arguments,
                                    o = 0,
                                    i = n.length,
                                    r = !1;
                                do {
                                    for (e = n[o] + "", t = s(this, e); - 1 !== t;) {
                                        this.splice(t, 1), r = !0, t = s(this, e);
                                    }
                                } while (++o < i);
                                r && this._updateClassName();
                            }, l.toggle = function (e, t) {
                                e += "";
                                var n = this.contains(e),
                                    o = n ? !0 !== t && "remove" : !1 !== t && "add";
                                return o && this[o](e), !0 === t || !1 === t ? t : !n;
                            }, l.toString = function () {
                                return this.join(" ");
                            }, n.defineProperty) {
                            var u = {
                                get: c,
                                enumerable: !0,
                                configurable: !0
                            };
                            try {
                                n.defineProperty(t, "classList", u), delete HTMLElement.prototype.classList;
                            } catch (e) {
                                -2146823252 === e.number && (u.enumerable = !1, n.defineProperty(t, "classList", u));
                            }
                        } else n.prototype.__defineGetter__ && t.__defineGetter__("classList", c);
                    }
                }(self);
            }() /*! @source https://developer.mozilla.org/de/docs/Web/API/Element/closest#Polyfill */ , window.Element && !Element.prototype.closest && (Element.prototype.closest = function (e) {
                var t, n = (this.document || this.ownerDocument).querySelectorAll(e),
                    o = this;
                do {
                    for (t = n.length; --t >= 0 && n.item(t) !== o;) {
                        ;
                    }
                } while (t < 0 && (o = o.parentElement));
                return o;
            }), window.console = window.console || {}, window.console.log = window.console.log || function () {}, window.console.debug = window.console.debug || window.console.log, window.console.info = window.console.info || window.console.log, window.console.warn = window.console.warn || window.console.log, window.console.error = window.console.error || window.console.log, window.console.table = window.console.table || window.console.log,
            function () {
                if ("function" == typeof window.CustomEvent) return !1;

                function e(e, t) {
                    t = t || {
                        bubbles: !1,
                        cancelable: !1,
                        detail: void 0
                    };
                    var n = document.createEvent("CustomEvent");
                    return n.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), n;
                }
                e.prototype = window.Event.prototype, window.CustomEvent = e;
            }(),
            function (e) {
                var t = e.Promise,
                    n = t && "resolve" in t && "reject" in t && "all" in t && "race" in t && function () {
                        var e;
                        return new t(function (t) {
                            e = t;
                        }), "function" == typeof e;
                    }();
                "undefined" != typeof exports && exports ? (exports.Promise = n ? t : _, exports.Polyfill = _) : "function" == typeof define && define.amd ? define(function () {
                    return n ? t : _;
                }) : n || (e.Promise = _);
                var o = "pending",
                    i = "sealed",
                    r = "fulfilled",
                    s = "rejected",
                    a = function a() {};

                function l(e) {
                    return "[object Array]" === Object.prototype.toString.call(e);
                }
                var c, u = "undefined" != typeof setImmediate ? setImmediate : setTimeout,
                    d = [];

                function f() {
                    for (var e = 0; e < d.length; e++) {
                        d[e][0](d[e][1]);
                    }
                    d = [], c = !1;
                }

                function p(e, t) {
                    d.push([e, t]), c || (c = !0, u(f, 0));
                }

                function h(e) {
                    var t = e.owner,
                        n = t.state_,
                        o = t.data_,
                        i = e[n],
                        a = e.then;
                    if ("function" == typeof i) {
                        n = r;
                        try {
                            o = i(o);
                        } catch (e) {
                            v(a, e);
                        }
                    }
                    g(a, o) || (n === r && w(a, o), n === s && v(a, o));
                }

                function g(e, t) {
                    var n;
                    try {
                        if (e === t) throw new TypeError("A promises callback cannot return that same promise.");
                        if (t && ("function" == typeof t || "object" == _typeof(t))) {
                            var o = t.then;
                            if ("function" == typeof o) return o.call(t, function (o) {
                                n || (n = !0, t !== o ? w(e, o) : m(e, o));
                            }, function (t) {
                                n || (n = !0, v(e, t));
                            }), !0;
                        }
                    } catch (t) {
                        return n || v(e, t), !0;
                    }
                    return !1;
                }

                function w(e, t) {
                    e !== t && g(e, t) || m(e, t);
                }

                function m(e, t) {
                    e.state_ === o && (e.state_ = i, e.data_ = t, p(y, e));
                }

                function v(e, t) {
                    e.state_ === o && (e.state_ = i, e.data_ = t, p(E, e));
                }

                function b(e) {
                    var t = e.then_;
                    e.then_ = void 0;
                    for (var n = 0; n < t.length; n++) {
                        h(t[n]);
                    }
                }

                function y(e) {
                    e.state_ = r, b(e);
                }

                function E(e) {
                    e.state_ = s, b(e);
                }

                function _(e) {
                    if ("function" != typeof e) throw new TypeError("Promise constructor takes a function argument");
                    if (this instanceof _ == !1) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                    this.then_ = [],
                        function (e, t) {
                            function n(e) {
                                v(t, e);
                            }
                            try {
                                e(function (e) {
                                    w(t, e);
                                }, n);
                            } catch (e) {
                                n(e);
                            }
                        }(e, this);
                }
                _.prototype = {
                    constructor: _,
                    state_: o,
                    then_: null,
                    data_: void 0,
                    then: function then(e, t) {
                        var n = {
                            owner: this,
                            then: new this.constructor(a),
                            fulfilled: e,
                            rejected: t
                        };
                        return this.state_ === r || this.state_ === s ? p(h, n) : this.then_.push(n), n.then;
                    },
                    catch: function _catch(e) {
                        return this.then(null, e);
                    }
                }, _.all = function (e) {
                    if (!l(e)) throw new TypeError("You must pass an array to Promise.all().");
                    return new this(function (t, n) {
                        var o = [],
                            i = 0;

                        function r(e) {
                            return i++,
                                function (n) {
                                    o[e] = n, --i || t(o);
                                };
                        }
                        for (var s, a = 0; a < e.length; a++) {
                            (s = e[a]) && "function" == typeof s.then ? s.then(r(a), n) : o[a] = s;
                        }
                        i || t(o);
                    });
                }, _.race = function (e) {
                    if (!l(e)) throw new TypeError("You must pass an array to Promise.race().");
                    return new this(function (t, n) {
                        for (var o, i = 0; i < e.length; i++) {
                            (o = e[i]) && "function" == typeof o.then ? o.then(t, n) : t(o);
                        }
                    });
                }, _.resolve = function (e) {
                    return e && "object" == _typeof(e) && e.constructor === this ? e : new this(function (t) {
                        t(e);
                    });
                }, _.reject = function (e) {
                    return new this(function (t, n) {
                        n(e);
                    });
                };
            }("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : void 0), /*! @source https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill */ Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (e) {
                for (var t = (this.document || this.ownerDocument).querySelectorAll(e), n = t.length; --n >= 0 && t.item(n) !== this;) {
                    ;
                }
                return n > -1;
            }) /*! @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill */ , "function" != typeof Object.assign && Object.defineProperty(Object, "assign", {
                value: function value(e, t) {
                    if (null === e || void 0 === e) throw new TypeError("Cannot convert undefined or null to object");
                    for (var n = Object(e), o = 1; o < arguments.length; o++) {
                        var i = arguments[o];
                        if (null !== i && void 0 !== i)
                            for (var r in i) {
                                Object.prototype.hasOwnProperty.call(i, r) && (n[r] = i[r]);
                            }
                    }
                    return n;
                },
                writable: !0,
                configurable: !0
            }) /*! @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill */ , Object.entries || (Object.entries = function (e) {
                for (var t = Object.keys(e), n = t.length, o = new Array(n); n--;) {
                    o[n] = [t[n], e[t[n]]];
                }
                return o;
            });
        for (var i = document.documentElement, r = ["cssanimations", "cssgradients", "csstransforms", "csstransforms3d", "csstransitions"], s = 0; s < r.length; s += 1) {
            i.classList.contains("no-" + r[s]) && (r.splice(s, 1), s -= 1);
        }
        i.classList.add.apply(i.classList, r);
    }(),
    function () {
        "use strict";

        function e(e) {
            return Object.create || (Object.create = function (e) {
                function t() {}
                return t.prototype = e, new t();
            }), Object.create(e);
        }

        function t(e) {
            return isNaN(e) ? "true" === e || "false" !== e && e : Number(e);
        }
        var n = {
            bind: function bind(e, t) {
                return function () {
                    for (var _len = arguments.length, n = new Array(_len), _key = 0; _key < _len; _key++) {
                        n[_key] = arguments[_key];
                    }
                    return t.apply(e, n);
                };
            },
            clone: e,
            cloneFunction: function cloneFunction(e) {
                var t;
                if ("function" != typeof e) return e;

                function n() {
                    return e.apply(null, arguments);
                }
                for (t in e) {
                    e.hasOwnProperty(t) && (n[t] = e[t]);
                }
                return n;
            },
            coerce: t,
            convertStringToFunction: function convertStringToFunction(e, t) {
                var n = e.split("."),
                    o = n.pop();
                var i = t;
                for (var _e = 0, _t2 = n.length; _e < _t2; _e += 1) {
                    i = i[n[_e]];
                }
                return i[o];
            },
            deserialize: function deserialize(e) {
                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !0;
                var o = {};
                return decodeURIComponent(e.replace(/\+/g, "%20")).split("&").forEach(function (e) {
                    var i = e.split("="),
                        r = i[0],
                        s = n ? t(i[1]) : i[1];
                    "" !== r && (o[r] = s);
                }), o;
            },
            extend: function extend(t, n, o, i) {
                var r = "boolean" != typeof o || o,
                    s = "boolean" == typeof i && i ? e(t) : t;
                return Object.keys(n || {}).forEach(function (e) {
                    !r && e in s || (s[e] = n[e]);
                }), s;
            },
            isEmptyObject: function isEmptyObject(e, t) {
                var n = [];
                if (!t) return 0 === Object.keys(e).length;
                for (var _t3 in e) {
                    n.push(_t3);
                }
                return 0 === Object.keys(n).length;
            },
            isPlainObject: function isPlainObject(e) {
                return !!e && "[object Object]" === Object.prototype.toString.call(e) && !e.nodeType && e !== e.window;
            },
            removeFromArray: function removeFromArray(e, t, n) {
                var o = e.slice((n || t) + 1 || e.length);
                return e.length = t < 0 ? e.length + t : t, e.push.apply(e, o), e;
            },
            serialize: function serialize(e) {
                if ("object" == _typeof(e)) return Object.keys(e).map(function (t) {
                    return "".concat(encodeURIComponent(t), "=").concat(encodeURIComponent(e[t]));
                }).join("&").replace(/%20/g, "+");
            },
            serializeForm: function serializeForm(e) {
                var t = function t(e, _t4) {
                        return "".concat(encodeURIComponent(e), "=").concat(encodeURIComponent(_t4));
                    },
                    n = [];
                return "object" == _typeof(e) && "FORM" === e.nodeName && [].forEach.call(e.elements, function (e) {
                    (function (e) {
                        return !!e.name && !e.disabled && "submit" !== e.type && "reset" !== e.type && "button" !== e.type && "file" !== e.type;
                    })(e) && (function (e) {
                        return "select-multiple" === e.type;
                    }(e) ? [].forEach.call(e.options, function (o) {
                        o.selected && (n[n.length] = t(e.name, o.value));
                    }) : function (e) {
                        return "radio" !== e.type && "checkbox" !== e.type || e.checked;
                    }(e) && (n[n.length] = t(e.name, e.value)));
                }), n.join("&").replace(/%20/g, "+");
            },
            toArray: function toArray(e) {
                var t = [];
                for (var _n = e.length - 1; _n >= 0; _n -= 1) {
                    t[_n] = e[_n];
                }
                return t;
            }
        };

        function o(e) {
            var t, n;
            return null === (n = null === (t = window.o_global) || void 0 === t ? void 0 : t.debug) || void 0 === n ? void 0 : n.warn(e);
        }

        function i() {
            return new Date();
        }

        function r() {
            return Math.random();
        }

        function s(e) {
            var t, n;
            var o = document.createElement("script");
            if (e.src)[].forEach.call(e.attributes, function (e) {
                o.setAttribute(e.name, e.value);
            }), null === (t = e.parentNode) || void 0 === t || t.replaceChild(o, e);
            else {
                var _t5 = document.getElementsByTagName("head")[0] || document.documentElement,
                    _i = e.text || e.textContent || e.innerHTML || "";
                o.type = "text/javascript", o.text = _i, _t5.insertBefore(o, _t5.firstChild), _t5.removeChild(o), null === (n = e.parentNode) || void 0 === n || n.removeChild(e);
            }
        }
        var a = {
            evalScript: s,
            executeInlineScripts: function executeInlineScripts(e) {
                var t = [],
                    n = e.getElementsByTagName("script");
                for (var _e2 = 0; n[_e2]; _e2 += 1) {
                    n[_e2].type && "text/javascript" !== n[_e2].type.toLowerCase() && "module" !== n[_e2].type || t.push(n[_e2]);
                }
                t.forEach(function (e) {
                    return s(e);
                });
            }
        };

        function l(e, t, n) {
            var o;
            return 200 !== e.status && 304 !== e.status || !1 === t || ((o = document.createElement("script")).type = "text/javascript", o.text = e.responseText, a.evalScript(o)), "function" == typeof n && n(e), e;
        }

        function c() {
            return Date.now().toString() + Math.floor(999 * r()).toString();
        }

        function u(e, t, n) {
            var o = n,
                i = new XMLHttpRequest();
            i.open(e.method.toUpperCase(), e.url, !0), o.active += 1,
                function (e, t) {
                    if (e.responseType && "string" == typeof t.responseType) try {
                        t.responseType = e.responseType;
                    } catch (e) {}
                }(e, i),
                function (e, t) {
                    e.contentType && t.setRequestHeader("Content-Type", e.contentType);
                }(e, i),
                function (e, t) {
                    e.headers && Object.entries(e.headers).forEach(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2),
                            e = _ref2[0],
                            n = _ref2[1];
                        "string" == typeof n && t.setRequestHeader(e, n);
                    });
                }(e, i),
                function (e, t) {
                    "boolean" == typeof e.withCredentials && (t.withCredentials = e.withCredentials);
                }(e, i);
            var r = function (e, t) {
                if (e.timeout) {
                    if ("number" != typeof t.timeout) return setTimeout(t.abort, e.timeout);
                    t.timeout = e.timeout;
                }
            }(e, i);
            i.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            var s = function s() {
                o.active -= 1;
            };
            var a;
            return i.addEventListener("abort", s), i.addEventListener("error", s), i.onreadystatechange = (a = function a() {
                ! function (e) {
                    e && clearTimeout(e);
                }(r), s(),
                    function (e, t) {
                        e.responseType && "json" === e.responseType && !t.responseType ? t.responseText && (t.responseJSON = JSON.parse(t.responseText)) : t.responseJSON = t.response;
                    }(e, i), t(i);
            }, function (e) {
                this.readyState === XMLHttpRequest.DONE && a(this, e);
            }), i.send(e.data ? e.data : null), i;
        }

        function d(e, t) {
            var o = function (e) {
                return e ? e.method ? e.url ? e.headers && !n.isPlainObject(e.headers) ? new Error("Parameter 'options.headers' must be a key/value object if set") : null : new Error("Parameter 'options.url' is missing.") : new Error("Parameter 'options.method' is missing.") : new Error("Parameter 'options' is missing.");
            }(e);
            if ("function" == typeof t) {
                if (o instanceof Error) throw o;
                return u(e, t, p);
            }
            return new Promise(function (t, n) {
                o instanceof Error ? n(o) : u(e, t, p);
            });
        }

        function f(e, t) {
            return d({
                method: "GET",
                url: e
            }, t);
        }
        var p = n.extend(d, {
            get: f,
            getJSON: function getJSON(e, t) {
                return d({
                    method: "GET",
                    url: e,
                    responseType: "json"
                }, t);
            },
            getScript: function getScript(e, t, n) {
                var o = function (e, t) {
                    var n = {
                        executeImmediately: !0,
                        cacheBusting: !0,
                        url: e
                    };
                    return "boolean" == typeof t ? n.executeImmediately = t : "object" == _typeof(t) && (void 0 !== t.executeImmediately && (n.executeImmediately = t.executeImmediately), void 0 !== t.cacheBusting && (n.cacheBusting = t.cacheBusting)), n.cacheBusting && (n.url = -1 !== e.indexOf("?") ? "".concat(e, "&_=").concat(c()) : "".concat(e, "?_=").concat(c())), n;
                }(e, t);
                return "function" == typeof n ? d({
                    method: "GET",
                    url: o.url
                }, function (e) {
                    return l(e, o.executeImmediately, n);
                }) : d({
                    method: "GET",
                    url: o.url
                }).then(function (e) {
                    return l(e, o.executeImmediately);
                });
            },
            post: function post(e, t, n) {
                return d(_objectSpread({
                    method: "POST",
                    url: e
                }, function (e) {
                    return "object" == _typeof(e) ? {
                        data: JSON.stringify(e),
                        contentType: "application/json; charset=utf-8"
                    } : {
                        data: e,
                        contentType: "application/x-www-form-urlencoded; charset=utf-8"
                    };
                }(t)), n);
            },
            abort: function abort(e) {
                e.abort();
            },
            active: 0,
            _getCustomTimeStamp: c
        }, !1, !1);
        var h = {
            delegate: function delegate(e, t, n, o) {
                var i = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : !1;
                var r = function (e) {
                    return "object" == _typeof(e) && !!e.addEventListener;
                }(e) ? e : "document" === (s = e) ? document : document.querySelector(s);
                var s;
                r && r.addEventListener(t, function (e) {
                    var t = r.querySelectorAll(n),
                        i = e.target;
                    for (var _n2 = 0, _s2 = t.length; _n2 < _s2; _n2 += 1) {
                        var _s3 = i;
                        var _a = t[_n2];
                        for (; _s3 && _s3 !== r;) {
                            if (_s3 === _a) return void o.call(_a, e);
                            _s3 = _s3.parentNode;
                        }
                    }
                }, i);
            },
            stop: function stop(e) {
                e.stopPropagation(), e.preventDefault();
            },
            whichTransitionEndEvent: function whichTransitionEndEvent() {
                var e = document.createElement("fakeelement");
                var t = "";
                for (var _i2 = 0, _Object$entries = Object.entries({
                        WebkitTransition: "webkitTransitionEnd",
                        transition: "transitionend",
                        OTransition: "oTransitionEnd",
                        MozTransition: "transitionend"
                    }); _i2 < _Object$entries.length; _i2++) {
                    var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
                        _n3 = _Object$entries$_i[0],
                        _o = _Object$entries$_i[1];
                    void 0 !== e.style[_n3] && (t = _o);
                }
                return t;
            },
            add: function add(e, t, n) {
                var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !1;
                o("o_util.event.add is deprecated, use native addEventListener instead"), e.addEventListener(t, n, i);
            },
            remove: function remove(e, t, n) {
                o("o_util.event.remove is deprecated, use native removeEventListener instead"), e.removeEventListener(t, n, !1);
            },
            stopPropagation: function stopPropagation(e) {
                o("o_util.event.stopPropagation is deprecated, use native event.stopPropagation instead"), e.stopPropagation();
            },
            getTarget: function getTarget(e) {
                return o("o_util.event.getTarget is deprecated, use native event.target instead"), e.target;
            },
            preventDefault: function preventDefault(e) {
                o("o_util.event.preventDefault is deprecated, use native event.preventDefault instead"), e.preventDefault();
            },
            trigger: function trigger(e, t) {
                o("o_util.event.trigger is deprecated, use native CustomElements instead");
                var n = document.createEvent("HTMLEvents");
                n.initEvent(t, !0, !0), e.dispatchEvent(n);
            }
        };

        function g() {
            var t = window;
            for (var _len2 = arguments.length, e = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                e[_key2] = arguments[_key2];
            }(t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || function (e) {
                window.setTimeout(e, 1e3 / 60);
            }).apply(null, [].slice.call(e));
        }

        function w(e, t, n, o) {
            return e - (e - t) * o(n);
        }

        function m(e, t, n, o, r, s) {
            var a = e,
                l = i().getTime(),
                c = 0 === o ? l - 1 : o,
                u = (l - c) / r;
            u > 1 ? a.scrollTop = n : (a.scrollTop = w(t, n, u, s), g(function () {
                m(e, t, n, c, r, s);
            }));
        }
        var v = Object.freeze({
                linear: function linear(e) {
                    return e;
                },
                easeOutCubic: function easeOutCubic(e) {
                    return --e * e * e + 1;
                }
            }),
            b = Object.freeze({
                fadeOut: "p_animation__fadeOut",
                fadeIn: "p_animation__fadeIn"
            });
        var y = {
            easings: v,
            fadeIn: function fadeIn(e, t) {
                "1" !== window.getComputedStyle(e).opacity ? y.transition(e, b.fadeIn, t) : "function" == typeof t && t();
            },
            fadeOut: function fadeOut(e, t) {
                "0" !== window.getComputedStyle(e).opacity ? y.transition(e, b.fadeOut, t) : "function" == typeof t && t();
            },
            requestAnimFrame: g,
            scrollTo: function scrollTo(e, t) {
                var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "easeOutCubic";
                var o = void 0 === window.scrollY ? window.pageYOffset : window.scrollY;
                var i;
                if ("object" == _typeof(e) && e.getBoundingClientRect) i = e.getBoundingClientRect().top + o - 20;
                else {
                    if ("number" != typeof e) throw new Error("Invalid target for scrollTo() method. Element has to be an object with an offsetTop function or number, which stands for the page position.");
                    i = e;
                }
                var r = v[n];
                if (!r) throw new Error("Unknown easing function for scrollTo() method: ".concat(n));
                var s = document.documentElement;
                var a = s.scrollTop;
                var l;
                0 === a && (l = window.devicePixelRatio ? window.devicePixelRatio : 1, s.scrollTop += Math.max(1, l, 1 / l), (s = s.scrollTop > 0 ? s : document.body).scrollTop = 0);
                var c = s.scrollHeight - s.offsetHeight;
                c < i && (i = c), t < 16 ? s.scrollTop = i : m(s, a, i, 0, t, r);
            },
            transition: function transition(e, t, n) {
                if ("object" != _typeof(e) || "string" != typeof t) throw new Error("No target or class specified"); {
                    var _o2 = h.whichTransitionEndEvent(),
                        _i3 = function _i3(e) {
                            "function" == typeof n && n(), e && e.target && e.target.removeEventListener(_o2, _i3);
                        };
                    _o2 && "function" == typeof n && !e.classList.contains(t) ? (e.addEventListener(_o2, _i3), e.classList.add(t)) : (e.classList.add(t), _i3());
                }
            },
            transitions: b,
            _getNewScrollPosition: w,
            _scrollTo: m
        };
        var E = {
            getScrollbarWidth: function getScrollbarWidth() {
                var e = document.createElement("div");
                var t = 0;
                return document.body.clientWidth < window.innerWidth && (e.className = "p_scrollbarMeasure", document.body.appendChild(e), t = e.offsetWidth - e.clientWidth, document.body.removeChild(e)), t;
            },
            findInUserAgent: function findInUserAgent(e) {
                return -1 !== window.navigator.userAgent.toLowerCase().indexOf(e);
            },
            isIE8: function isIE8() {
                return o("o_util.browser.isIE8 is deprecated - IE8 is doomed."), navigator.userAgent.indexOf("MSIE 8") > -1;
            },
            getStyle: function getStyle(e, t) {
                return o("o_util.browser.getStyle is deprecated, use native getComputedStyle instead"), window.getComputedStyle(e, null).getPropertyValue(t);
            }
        };
        var _ = {
            getConnectionType: function getConnectionType() {
                var _window = window,
                    e = _window.performance;
                return e && e.navigation && "type" in e.navigation ? e.navigation.type : 255;
            },
            isNormalNavigation: function isNormalNavigation() {
                return 0 === _.getConnectionType();
            },
            isReloadNavigation: function isReloadNavigation() {
                return 1 === _.getConnectionType();
            },
            isForwardBackwardNavigation: function isForwardBackwardNavigation() {
                return 2 === _.getConnectionType();
            }
        };

        function S(e) {
            var t = document.cookie.split(/;\s*/),
                n = t.length,
                o = "".concat(e, "=");
            for (var _e3 = 0; _e3 < n; _e3 += 1) {
                if (-1 !== t[_e3].indexOf(o)) return decodeURIComponent(t[_e3].replace(o, ""));
            }
        }
        var A = "toggle_";
        var T = {
                get: function get(e) {
                    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
                    var n, o, i, r;
                    var s = S(A + e);
                    return !0 === (null === (o = null === (n = window.o_global) || void 0 === n ? void 0 : n.toggles) || void 0 === o ? void 0 : o[e]) || "true" === s || !1 !== (null === (r = null === (i = window.o_global) || void 0 === i ? void 0 : i.toggles) || void 0 === r ? void 0 : r[e]) && "false" !== s && "boolean" == typeof t && t;
                }
            },
            L = ["None", "Lax", "Strict"];
        var C = {
            get: S,
            set: function set(e, t, n) {
                var o = 60;
                var r = i(),
                    s = n || {};
                var a;
                var l, c, u, d;
                s.minutes && (o = s.minutes), s.days && (s.minutes || (o = 0), o += 24 * s.days * 60), r.setTime(r.getTime() + 60 * o * 1e3), a = "".concat(encodeURIComponent(e), "=").concat(encodeURIComponent(t)), a += "; expires=".concat(r.toUTCString()), a += "; path=".concat(s.path || "/"), s.domain && (a += "; domain=".concat(s.domain)), s.samesite && L.includes(s.samesite) && (a += "; SameSite=".concat(s.samesite), "None" === s.samesite && (a += "; Secure")), document.cookie = a, T.get("LHAS_2048_TRACK_COOKIES", !1) && (l = "o_util.cookie.set()", c = {
                    cookiePath: n && n.path ? n.path : "/",
                    cookieExpires: r.toUTCString(),
                    cookieDomain: n && n.domain ? n.domain : -1,
                    cookieName: e,
                    cookieValue: t,
                    cookieSameSite: n && n.samesite ? n.samesite : -1
                }, "function" == typeof (null === (d = null === (u = window.AS) || void 0 === u ? void 0 : u.RUM) || void 0 === d ? void 0 : d.sendCustomRequest) && window.AS.RUM.sendCustomRequest(l, c));
            },
            exists: function exists(e) {
                var t = document.cookie.split(";"),
                    n = new RegExp("^( )*".concat(encodeURIComponent(e), "$"), "g");
                for (var _e4 = 0; _e4 < t.length; _e4 += 1) {
                    if (n.test(t[_e4].split("=")[0])) return !0;
                }
                return !1;
            },
            remove: function remove(e, t) {
                var n = t || {};
                var o = "";
                o += " path=".concat(n.path ? n.path : "/", ";"), n.domain && (o += " domain=".concat(n.domain, ";")), document.cookie = "".concat(encodeURIComponent(e), "=;").concat(o, " expires=Thu, 01 Jan 1970 00:00:01 GMT;");
            }
        };

        function O(e, t) {
            o("o_util.dom.hasClass is deprecated, use native element.classList.contains instead");
            var n = "";
            return e && e.getAttribute("class") ? n = e.getAttribute("class") : e && e.className && (n = e.className), !(!n || !n.match) && !!n.match(new RegExp("(\\s|^)".concat(t, "(\\s|$)")));
        }
        var x = {
            getElementsByClassname: function getElementsByClassname(e, t) {
                return o("o_util.dom.getElementsByClassname is deprecated, use native document.getElementsByClassName instead"), e.getElementsByClassName(t);
            },
            hasClass: O,
            hasClassInParents: function hasClassInParents(e, t) {
                var n = e;
                for (; n && n !== document; n = n.parentNode) {
                    if (n.classList.contains(t)) return !0;
                }
                return !1;
            },
            getParentByClassName: function getParentByClassName(e, t) {
                var n = e;
                for (; n && n !== document; n = n.parentNode) {
                    if (n.classList.contains(t)) return n;
                }
                return null;
            },
            addClass: function addClass(e, t) {
                o("o_util.dom.addClass is deprecated, use native element.classList.add instead"), O(e, t) || (e.className += " ".concat(t));
            },
            removeClass: function removeClass(e, t) {
                o("o_util.dom.removeClass is deprecated, use native element.classList.remove instead"), e.classList.remove(t);
            },
            toggleClass: function toggleClass(e, t) {
                o("o_util.dom.toggleClass is deprecated, use native element.classList.toggle instead"), e.classList.toggle(t);
            },
            stringToDocumentFragment: function stringToDocumentFragment(e) {
                var t = document.createElement("div"),
                    n = document.createDocumentFragment();
                if ("string" != typeof e) return o("stringToDocumentFragment should be called with strings containing html only, but was called with ".concat(_typeof(e))), n;
                for (t.innerHTML = e.trim(); t.hasChildNodes();) {
                    n.appendChild(t.firstChild);
                }
                return n;
            }
        };

        function k(e) {
            if (e && "object" == _typeof(e)) return "#".concat(n.serialize(e));
        }

        function j() {
            var t = arguments.length <= 0 ? undefined : arguments[0];
            var o = arguments.length <= 1 ? undefined : arguments[1];
            return o = "boolean" == typeof t && void 0 === o ? t : "boolean" != typeof o || o, "string" == typeof t ? t.indexOf("#") > -1 ? n.deserialize(t.split("#")[1], o) : {} : window.location.hash ? n.deserialize(window.location.hash.substring(1), o) : {};
        }

        function R(e) {
            "string" == typeof e && (window.location.hash = e);
        }

        function N(e, t) {
            if ("string" == typeof e) {
                var _n4 = t && t.indexOf("#") > -1 ? j("#".concat(t.split("#")[1])) : j(window.location.hash);
                return Object.prototype.hasOwnProperty.call(_n4, e) ? _n4[e] : void 0;
            }
            if (!e) return "#" === window.location.hash ? "" : window.location.hash;
        }
        var P = {
                serialize: k,
                deserialize: j,
                set: R,
                get: N,
                remove: function remove(e, t) {
                    if ("string" == typeof e && N(e, t)) {
                        var _n5;
                        if ("string" == typeof t) {
                            if (t.indexOf("#") > 1) {
                                var _o3 = t.split("#");
                                delete(_n5 = j("#".concat(_o3[1])))[e];
                                var _i4 = k(_n5);
                                return _o3[0] + (_i4.length > 1 ? _i4 : "");
                            }
                            return !1;
                        }
                        return delete(_n5 = j(window.location.hash))[e], R(k(_n5)), !0;
                    }
                    return !1;
                },
                push: function push(e, t) {
                    var o = "object" == _typeof(e) ? k(e) : e;
                    if ("string" == typeof o) {
                        var _e5 = n.deserialize(o.replace("#", ""), !1);
                        var _i5, _r, _s4;
                        return "string" == typeof t ? t.indexOf("#") > 1 ? (_s4 = t.split("#"), _i5 = n.deserialize(_s4[1], !1), _r = k(n.extend(_i5, _e5)), _s4[0] + _r) : t + o : (_i5 = n.deserialize(window.location.hash.substring(1), !1), R(_r = k(n.extend(_i5, _e5))), _r);
                    }
                }
            },
            M = ("scrollRestoration" in window.history),
            I = {
                hasNative: M,
                initial: M ? window.history.scrollRestoration : "auto"
            };

        function $(e) {
            I.hasNative && (window.history.scrollRestoration = e);
        }
        var D = {
            setScrollRestoration: $,
            resetScrollRestoration: function resetScrollRestoration() {
                $(I.initial);
            }
        };
        var F = {
                getPagecluster: function getPagecluster() {
                    return document.documentElement.getAttribute("data-pagecluster");
                },
                isResponsive: function isResponsive() {
                    return "true" === C.get("responsive-preview");
                },
                isValidMouseButton: function isValidMouseButton(e, t) {
                    return "number" != typeof (null === e || void 0 === e ? void 0 : e.which) || e.which === t;
                },
                setVendorStyle: function setVendorStyle(e, t, n) {
                    var o = t.charAt(0).toUpperCase() + t.slice(1),
                        i = e.style;
                    i["webkit".concat(o)] = n, i["Moz".concat(o)] = n, i["ms".concat(o)] = n, i["O".concat(o)] = n, i[t] = n;
                },
                guid: function guid() {
                    var e = function e() {
                        return Math.floor(65536 * (1 + r())).toString(16).substring(1);
                    };
                    return "".concat(e() + e(), "-").concat(e(), "-").concat(e(), "-").concat(e(), "-").concat(e()).concat(e()).concat(e());
                },
                urlToLinkObject: function urlToLinkObject(e) {
                    var t = document.createElement("a");
                    return t.href = e, t;
                },
                isPreview: function isPreview(e) {
                    return "string" != typeof e ? (o("o_util.misc.isPreview() parameter is no string"), !1) : -1 !== e.indexOf("/shoppages/preview");
                }
            },
            B = {
                ajaxLegacy: function ajaxLegacy(e, t, n) {
                    return o("o_global.helper.ajax is deprecated, use o_util.ajax or o_util.ajax.get instead."), f(e).then(function (e) {
                        "function" == typeof t && (200 === e.status ? t(e.responseText, e.status) : t('<div class="p_message p_message--error p_layer--error"><b>Entschuldigung!</b> Aufgrund von technischen Problemen kann der Inhalt leider nicht geladen werden. Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.</div>', e.status)), "function" == typeof n && n(e.status);
                    });
                },
                getNewScrollPosition: w
            };
        var q = {
            __proto__: null,
            ajax: p,
            animation: y,
            browser: E,
            connection: _,
            cookie: C,
            core: n,
            dom: x,
            event: h,
            fragment: P,
            hardcore: a,
            history: D,
            legacy: B,
            misc: F,
            toggle: T
        };
        window.o_util = window.o_util || q, window.o_global = window.o_global || {}, window.o_global.helper = window.o_global.helper || {}, window.o_global.helper.bind = n.bind, window.o_global.helper.clone = n.clone, window.o_global.helper.convertStringToFunction = n.convertStringToFunction, window.o_global.helper.extend = n.extend, window.o_global.helper.removeFromArray = n.removeFromArray, window.o_global.helper.isPlainObject = n.isPlainObject, window.o_global.helper.isEmptyObject = n.isEmptyObject, window.o_global.helper.cloneFunction = n.cloneFunction, window.o_global.helper.cookieExist = C.exists, window.o_global.helper.getCookie = C.get, window.o_global.helper.getCookieValue = C.get, window.o_global.helper.removeCookie = C.remove, window.o_global.helper.setCookie = C.set, window.o_global.helper.delegate = h.delegate, window.o_global.helper.stopEvent = h.stop, window.o_global.helper.whichTransitionEvent = h.whichTransitionEndEvent, window.o_global.helper.addEvent = h.add, window.o_global.helper.getEventTarget = h.getTarget, window.o_global.helper.preventDefault = h.preventDefault, window.o_global.helper.removeEvent = h.remove, window.o_global.helper.stopPropagation = h.stopPropagation, window.o_global.helper.hasClassInParents = x.hasClassInParents, window.o_global.helper.getParentByClassName = x.getParentByClassName, window.o_global.helper.stringToDocumentFragment = x.stringToDocumentFragment, window.o_global.helper.hasClass = x.hasClass, window.o_global.helper.removeClass = x.removeClass, window.o_global.helper.toggleClass = x.toggleClass, window.o_global.helper.getElementsByClassname = x.getElementsByClassname, window.o_global.helper.addClass = x.addClass, window.o_global.helper.Easings = y.easings, window.o_global.helper.requestAnimFrame = y.requestAnimFrame, window.o_global.helper._getNewScrollPosition = B.getNewScrollPosition, window.o_global.helper.scrollTo = y.scrollTo, window.o_global.helper.ajax = B.ajaxLegacy, window.o_global.helper.getScrollbarWidth = E.getScrollbarWidth, window.o_global.helper.getStyle = E.getStyle, window.o_global.helper.isIE8 = E.isIE8, window.o_global.helper.setScrollRestoration = D.setScrollRestoration, window.o_global.helper.resetScrollRestoration = D.resetScrollRestoration, window.o_global.helper.isResponsive = F.isResponsive, window.o_global.helper.isValidMouseButton = F.isValidMouseButton, window.o_global.helper.setVendorStyle = F.setVendorStyle, window.o_global.helper.evalScript = a.evalScript, window.o_global.helper.executeInlineScripts = a.executeInlineScripts, window.o_global.referrer = document.referrer, window.o_global.getCookieValue = window.o_global.helper.getCookieValue, window.o_global.convertStringToFunction = window.o_global.helper.convertStringToFunction, window.o_global.isResponsive = window.o_global.helper.isResponsive;
    }(),
    function () {
        "use strict";
        var e = /*#__PURE__*/ function () {
            function e() {
                _classCallCheck(this, e);
            }
            _createClass(e, null, [{
                key: "writeCookie",
                value: function writeCookie() {
                    window.o_util.cookie.set(e.cookieName, "true");
                }
            }, {
                key: "isCookieSet",
                value: function isCookieSet() {
                    return window.o_util.cookie.exists(e.cookieName);
                }
            }, {
                key: "status",
                value: function status() {
                    return e.isCookieSet() ? (e.statusObject.activated = !0, e.statusObject.text = "activated") : (e.statusObject.activated = !1, e.statusObject.text = "deactivated"), e.statusObject;
                }
            }, {
                key: "activate",
                value: function activate() {
                    return e.status().activated || e.writeCookie(), e.status().text;
                }
            }, {
                key: "deactivate",
                value: function deactivate() {
                    return e.status().activated && window.o_util.cookie.remove(e.cookieName), e.status().text;
                }
            }, {
                key: "warn",
                value: function warn(t) {
                    e.status().activated && console.warn(t);
                }
            }]);
            return e;
        }();
        e.cookieName = "debug", e.statusObject = {
            activated: void 0,
            text: void 0
        }, window.o_global = window.o_global || {}, window.o_global.debug = window.o_global.debug || e;
    }(),
    function () {
        "use strict";
        var e = /*#__PURE__*/ function () {
            function e() {
                _classCallCheck(this, e);
                this.onReadyQueue = [], this.onLoadQueue = [], this.allScriptsExecutedQueue = [];
            }
            _createClass(e, [{
                key: "onReadyFired",
                get: function get() {
                    return !!this.onReadyEvent;
                }
            }, {
                key: "onLoadFired",
                get: function get() {
                    return !!this.onLoadEvent;
                }
            }, {
                key: "allScriptsExecutedFired",
                get: function get() {
                    return !!this.allScriptsExecutedEvent;
                }
            }]);
            return e;
        }();

        function t(e) {
            return e.sort(function (e, t) {
                return e.priority - t.priority;
            });
        }

        function n(e) {
            var n = s();
            n.onReadyEvent = e || {}, n.onReadyQueue = t(n.onReadyQueue), n.onReadyQueue.forEach(function (e) {
                return e.fn(n.onReadyEvent);
            });
        }
        var o;

        function i(e) {
            var n = s();
            o && o.call(this, e), n.onLoadEvent = e || {}, n.onLoadQueue = t(n.onLoadQueue), n.onLoadQueue.forEach(function (e) {
                return e.fn(n.onLoadEvent);
            });
        }

        function r(e) {
            var n = s();
            n.allScriptsExecutedEvent = e || {}, n.allScriptsExecutedQueue = t(n.allScriptsExecutedQueue), n.allScriptsExecutedQueue.forEach(function (e) {
                return e.fn(n.allScriptsExecutedEvent);
            });
        }

        function s() {
            if (window.o_global || (window.o_global = {}), !window.o_global.eventLoaderStore) {
                var _t6 = new e();
                document.addEventListener("DOMContentLoaded", n, !1), o = window.onload, window.onload = i, document.addEventListener("AllScriptsExecuted", r, !1), window.o_global.eventLoaderStore = _t6;
            }
            return window.o_global.eventLoaderStore;
        }
        var a = /*#__PURE__*/ function () {
            function a() {
                _classCallCheck(this, a);
                this.store = s();
            }
            _createClass(a, [{
                key: "onReady",
                value: function onReady(e, t) {
                    this.store.onReadyFired ? t(this.store.onReadyEvent) : this.store.onReadyQueue.push({
                        priority: e,
                        fn: t
                    });
                }
            }, {
                key: "onLoad",
                value: function onLoad(e, t) {
                    this.store.onLoadFired ? t(this.store.onLoadEvent) : this.store.onLoadQueue.push({
                        priority: e,
                        fn: t
                    });
                }
            }, {
                key: "onAllScriptsExecuted",
                value: function onAllScriptsExecuted(e, t) {
                    this.store.allScriptsExecutedFired ? t(this.store.allScriptsExecutedEvent) : this.store.allScriptsExecutedQueue.push({
                        priority: e,
                        fn: t
                    });
                }
            }]);
            return a;
        }();
        window.o_global = window.o_global || {}, window.o_global.EventLoader = a, window.o_global.eventLoader = new a(), window.o_global.onloadHandler = window.o_global.onloadHandler || function (e) {
            return window.o_global.eventLoader.onLoad(100, e);
        };
    }(),
    function () {
        "use strict";

        function e(e) {
            if (e) try {
                return e.setItem("storageTest", "test"), e.getItem("storageTest"), e.removeItem("storageTest"), e;
            } catch (e) {}
        }
        window.o_global = window.o_global || {}, window.o_global.Storage = window.o_global.Storage || /*#__PURE__*/ function () {
            function _class(t) {
                _classCallCheck(this, _class);
                var n, o;
                if (null === (o = null === (n = window.o_util) || void 0 === n ? void 0 : n.cookie) || void 0 === o || !o.exists("app") || -1 === navigator.userAgent.indexOf("OS 11_3 like Mac OS X")) {
                    if ("function" == typeof t) try {
                        this.storage = t();
                    } catch (e) {} else this.storage = t;
                    this.storage = e(this.storage);
                }
            }
            _createClass(_class, [{
                key: "isStorageAvailable",
                value: function isStorageAvailable() {
                    return !!e(this.storage);
                }
            }, {
                key: "key",
                value: function key(e) {
                    return this.storage ? this.storage.key(e) : null;
                }
            }, {
                key: "setItem",
                value: function setItem(e, t) {
                    var n, o;
                    if (this.storage && 2 === arguments.length) try {
                        return this.storage.setItem(e, t), !!this.storage.getItem(e);
                    } catch (e) {
                        "function" == typeof (null === (o = null === (n = window.AS) || void 0 === n ? void 0 : n.RUM) || void 0 === o ? void 0 : o.sendCustomRequest) && window.AS.RUM.sendCustomRequest("localStorageError", {
                            message: "".concat(e.toString(), " | ").concat(window.location.href, " | ").concat(navigator.userAgent)
                        });
                    }
                    return !1;
                }
            }, {
                key: "getItem",
                value: function getItem(e) {
                    return this.storage ? this.storage.getItem(e) : null;
                }
            }, {
                key: "removeItem",
                value: function removeItem(e) {
                    return !(!this.storage || !e || (this.storage.removeItem(e), this.storage.getItem(e)));
                }
            }, {
                key: "clear",
                value: function clear() {
                    var _this = this;
                    return !(!this.storage || void 0 === this.length) && (Object.keys(this.storage).forEach(function (e) {
                        return _this.removeItem(e);
                    }), this.length < 1);
                }
            }, {
                key: "setJson",
                value: function setJson(e, t) {
                    try {
                        return this.setItem(e, JSON.stringify(t));
                    } catch (e) {
                        return !1;
                    }
                }
            }, {
                key: "getJson",
                value: function getJson(e) {
                    try {
                        var t = this.getItem(e);
                        return t ? JSON.parse(t) : null;
                    } catch (e) {
                        return null;
                    }
                }
            }, {
                key: "isAvailable",
                get: function get() {
                    return !!this.storage;
                }
            }, {
                key: "length",
                get: function get() {
                    return this.storage ? Object.keys(this.storage).length : void 0;
                }
            }]);
            return _class;
        }();
    }(),
    function () {
        "use strict";
        var e = /^[a-zA-Z0-9-]{2,}\.[a-zA-Z0-9-]{3,}\.[a-zA-Z0-9-]{3,}$/;

        function t(t) {
            if ("string" != typeof t || !e.test(t)) throw new Error("eventQBus: topic name '".concat(t, "' is invalid, please match regex syntax '").concat(e.toString(), "' (e.g. \"assets.rum.fired\")"));
        }

        function n(e) {
            var n;
            if (null === (n = window.o_global) || void 0 === n ? void 0 : n.eventQBusLogger) try {
                var _window$o_global;
                for (var _len3 = arguments.length, t = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                    t[_key3 - 1] = arguments[_key3];
                }(_window$o_global = window.o_global).eventQBusLogger.apply(_window$o_global, ["[log] eventQBus: ".concat(e)].concat(t));
            } catch (e) {}
        }
        var o = /*#__PURE__*/ function () {
            function o(e) {
                _classCallCheck(this, o);
                this.listeners = [], this.dataQueue = [], this.topicName = e;
            }
            _createClass(o, [{
                key: "queueData",
                value: function queueData() {
                    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                    return this.dataQueue.push(e), e;
                }
            }, {
                key: "clearData",
                value: function clearData() {
                    this.dataQueue.splice(0);
                }
            }, {
                key: "addListener",
                value: function addListener(e) {
                    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !1;
                    var n = {
                        singleRun: t,
                        callback: e
                    };
                    return this.listeners.some(function (e) {
                        return n.singleRun === e.singleRun && n.callback === e.callback;
                    }) || this.listeners.push(n), n;
                }
            }, {
                key: "removeByCallback",
                value: function removeByCallback(e) {
                    var _this2 = this;
                    var t = !1;
                    return e && this.listeners.filter(function (t) {
                        return t.callback === e;
                    }).forEach(function (e) {
                        _this2.removeListener(e), t = !0;
                    }), t;
                }
            }, {
                key: "emitAllListener",
                value: function emitAllListener() {
                    var _this3 = this;
                    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                    return Promise.all(_toConsumableArray(this.listeners).map(function (t) {
                        return _this3.emitListener(t, e);
                    }));
                }
            }, {
                key: "emitListenerWithQueuedData",
                value: function emitListenerWithQueuedData(e) {
                    var _this4 = this;
                    return this.dataQueue.length > 0 ? e.singleRun ? Promise.all([this.emitListener(e, this.dataQueue[0])]) : Promise.all(this.dataQueue.map(function (t) {
                        return _this4.emitListener(e, t);
                    })) : Promise.resolve([]);
                }
            }, {
                key: "emitListener",
                value: function emitListener(e, t) {
                    var _this5 = this;
                    return e.singleRun && this.removeListener(e), n("dispatch event on: %s", this.topicName), Promise.resolve().then(function () {
                        var _e$callback;
                        return (_e$callback = e.callback).call.apply(_e$callback, [_this5].concat(_toConsumableArray(t)));
                    });
                }
            }, {
                key: "removeListener",
                value: function removeListener(e) {
                    var t = this.listeners,
                        n = t.indexOf(e);
                    return n > -1 && (t.splice(n, 1), !0);
                }
            }]);
            return o;
        }();
        var i = /*#__PURE__*/ function () {
            function i() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                _classCallCheck(this, i);
                this.map = {}, this.isBusMode = e.isBusMode || !1, e.ignoreAllScriptsExecuted || this.initEvent();
            }
            _createClass(i, [{
                key: "initEvent",
                value: function initEvent() {
                    var _this6 = this;
                    var e, t;
                    "function" == typeof (null === (t = null === (e = window.o_global) || void 0 === e ? void 0 : e.eventLoader) || void 0 === t ? void 0 : t.onAllScriptsExecuted) && (n("Subscribe on onAllScriptsExecuted"), window.o_global.eventLoader.onAllScriptsExecuted(1e3, function () {
                        n("All Scripts were Executed, flush all events"), _this6.isBusMode = !0, _this6.clearData();
                    }));
                }
            }, {
                key: "get",
                value: function get(e) {
                    return this.map[e];
                }
            }, {
                key: "clear",
                value: function clear() {
                    var _this7 = this;
                    Object.keys(this.map).forEach(function (e) {
                        delete _this7.map[e];
                    });
                }
            }, {
                key: "clearData",
                value: function clearData() {
                    Object.entries(this.map).forEach(function (_ref3) {
                        var _ref4 = _slicedToArray(_ref3, 2),
                            e = _ref4[0],
                            t = _ref4[1];
                        t.clearData();
                    });
                }
            }, {
                key: "getOrAddTopic",
                value: function getOrAddTopic(e) {
                    var t = this.get(e);
                    return t instanceof o ? t : (this.map[e] = new o(e), this.map[e]);
                }
            }]);
            return i;
        }();

        function r(_ref5) {
            var e = _ref5.store,
                o = _ref5.topicName,
                i = _ref5.callback,
                r = _ref5.singleRun;
            if (t(o), n("add new subscription for: %s with: %o", o, {
                    singleRun: r
                }), function (e) {
                    return "function" == typeof e;
                }(i)) {
                var _t7 = e.getOrAddTopic(o),
                    _s5 = _t7.addListener(i, r);
                return e.isBusMode || (n("queue mode is on, dispatch from queue"), _t7.emitListenerWithQueuedData(_s5)), _s5.callback;
            }
            return null;
        }
        var s = /*#__PURE__*/ function () {
            function s() {
                var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                _classCallCheck(this, s);
                var t, n, o;
                this.store = e.store || (null === (t = window.o_global) || void 0 === t ? void 0 : t.eventQBusStore) || (n = "eventQBusStore", o = new i(), window.o_global = window.o_global || {}, window.o_global[n] = window.o_global[n] || o, window.o_global[n]);
            }
            _createClass(s, [{
                key: "on",
                value: function on(e, t) {
                    return r({
                        store: this.store,
                        topicName: e,
                        callback: t,
                        singleRun: !1
                    });
                }
            }, {
                key: "once",
                value: function once(e, t) {
                    return r({
                        store: this.store,
                        topicName: e,
                        callback: t,
                        singleRun: !0
                    });
                }
            }, {
                key: "off",
                value: function off(e, t) {
                    return function (_ref6) {
                        var e = _ref6.store,
                            t = _ref6.topicName,
                            o = _ref6.callback;
                        n("remove subscription for: %s", t);
                        var i = e.get(t);
                        return !!i && i.removeByCallback(o);
                    }({
                        store: this.store,
                        topicName: e,
                        callback: t
                    });
                }
            }, {
                key: "emit",
                value: function emit(e) {
                    for (var _len4 = arguments.length, o = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                        o[_key4 - 1] = arguments[_key4];
                    }
                    return function (_ref7) {
                        var e = _ref7.store,
                            o = _ref7.topicName,
                            i = _ref7.data;
                        t(o), n("publish to: %s", o);
                        var r = e.getOrAddTopic(o);
                        return e.isBusMode || r.queueData(i), r.emitAllListener(i);
                    }({
                        store: this.store,
                        topicName: e,
                        data: o
                    });
                }
            }, {
                key: "isBusMode",
                get: function get() {
                    return this.store.isBusMode;
                }
            }, {
                key: "isQueueMode",
                get: function get() {
                    return !this.store.isBusMode;
                }
            }]);
            return s;
        }();
        var a;
        window.o_global = window.o_global || {}, window.o_global.eventQBus = window.o_global.eventQBus || new s(a);
    }(), window.o_global = window.o_global || {}, o_global.visibilityChange = function (e, t) {
        "use strict";
        var n, o, i, r, s, a = {
            wasHidden: !1,
            pageVisibility: !1,
            visibilityChanges: 0,
            hiddenTime: 0,
            visibleLoadTime: 0,
            customerWaitTime: 0
        };

        function l() {
            var e, n;
            (e = h()) && (n = e.replace(/[H|h]idden/, "") + "visibilitychange", t.removeEventListener(n, w, !1)), f(), u(), p(), document.visibilityState && "prerender" === document.visibilityState ? a.pageVisibility = "prerender" : a.wasHidden ? a.hiddenTime > a.visibleLoadTime ? a.pageVisibility = "hidden" : a.pageVisibility = "intermittent_visible" : a.pageVisibility = "always_visible";
        }

        function c() {
            o = new Date().getTime();
        }

        function u() {
            o && (a.visibleLoadTime += new Date().getTime() - o, o = !1);
        }

        function d() {
            n = new Date().getTime();
        }

        function f() {
            n && (a.hiddenTime += new Date().getTime() - n, n = !1);
        }

        function p() {
            i && (a.customerWaitTime += new Date().getTime() - i, i = !1);
        }

        function h() {
            var e, n = ["webkit", "moz", "ms", "o"];
            if ("hidden" in t) return "hidden";
            for (e = 0; e < n.length; e++) {
                if (n[e] + "Hidden" in t) return n[e] + "Hidden";
            }
            return null;
        }

        function g() {
            var e = h();
            return !!e && t[e];
        }

        function w() {
            g() ? (a.wasHidden = !0, u(), d()) : (f(), c()), p(), a.visibilityChanges++, document.visibilityState && "prerender" === document.visibilityState && (a.pageVisibility = "prerender");
        }
        return (r = h()) && (s = r.replace(/[H|h]idden/, "") + "visibilitychange", t.addEventListener(s, w, !1)), o_global.eventLoader.onLoad(0, l), document.visibilityState && "prerender" === document.visibilityState ? a.pageVisibility = "prerender" : g() ? (d(), a.wasHidden = !0, a.pageVisibility = "hidden") : (c(), a.pageVisibility = "always_visible"), i = new Date().getTime(), {
            visibilityChange: w,
            finishVisibilityDataCollection: l,
            getVisibilityData: function getVisibilityData() {
                return a;
            }
        };
    }(window, document); //# sourceMappingURL=/assets-static/global-resources/assets.global-resources.head.737966a8.js.map