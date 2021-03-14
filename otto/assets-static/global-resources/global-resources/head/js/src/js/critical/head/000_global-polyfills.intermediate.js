(function () {
  'use strict';

  /*! @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill */

  // Production steps of ECMA-262, Edition 6, 22.1.2.1
  if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
  }

  /*! @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill */

  if (!Array.isArray) {
      Array.isArray = function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
      };
  }

  /*
   * classList.js: Cross-browser full element.classList implementation.
   * 1.1.20150404
   *
   * By Eli Grey, http://eligrey.com
   * License: Dedicated to the public domain.
   *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
   */

  /*global self, DOMException */

  /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

  if ("document" in self) {
    (function () {
      var setPropOnDOM = true;

      // Detect if we can define properties on DOM Objects
      try {
        Object.defineProperty(document.createElement("_"), "classList", {
          get: function () {},
        });
      } catch (e) {
        //Old Safari versions will break at this point
        setPropOnDOM = false;
      }

      // Full polyfill for browsers with no classList support
      // Including IE < Edge missing SVGElement.classList
      if (
        setPropOnDOM &&
        (!("classList" in document.createElement("_")) ||
          (document.createElementNS &&
            !(
              "classList" in
              document.createElementNS("http://www.w3.org/2000/svg", "g")
            )))
      ) {
        (function (view) {
          if (!("Element" in view)) return;

          var classListProp = "classList",
            protoProp = "prototype",
            elemCtrProto = view.Element[protoProp],
            objCtr = Object,
            strTrim =
              String[protoProp].trim ||
              function () {
                return this.replace(/^\s+|\s+$/g, "");
              },
            arrIndexOf =
              Array[protoProp].indexOf ||
              function (item) {
                var i = 0,
                  len = this.length;
                for (; i < len; i++) {
                  if (i in this && this[i] === item) {
                    return i;
                  }
                }
                return -1;
              },
            // Vendors: please allow content code to instantiate DOMExceptions
            DOMEx = function (type, message) {
              this.name = type;
              this.code = DOMException[type];
              this.message = message;
            },
            checkTokenAndGetIndex = function (classList, token) {
              if (token === "") {
                throw new DOMEx(
                  "SYNTAX_ERR",
                  "An invalid or illegal string was specified"
                );
              }
              if (/\s/.test(token)) {
                throw new DOMEx(
                  "INVALID_CHARACTER_ERR",
                  "String contains an invalid character"
                );
              }
              return arrIndexOf.call(classList, token);
            },
            ClassList = function (elem) {
              var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
                classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
                i = 0,
                len = classes.length;
              for (; i < len; i++) {
                this.push(classes[i]);
              }
              this._updateClassName = function () {
                elem.setAttribute("class", this.toString());
              };
            },
            classListProto = (ClassList[protoProp] = []),
            classListGetter = function () {
              return new ClassList(this);
            };
          // Most DOMException implementations don't allow calling DOMException's toString()
          // on non-DOMExceptions. Error's toString() is sufficient here.
          DOMEx[protoProp] = Error[protoProp];
          classListProto.item = function (i) {
            return this[i] || null;
          };
          classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
          };
          classListProto.add = function () {
            var tokens = arguments,
              i = 0,
              l = tokens.length,
              token,
              updated = false;
            do {
              token = tokens[i] + "";
              if (checkTokenAndGetIndex(this, token) === -1) {
                this.push(token);
                updated = true;
              }
            } while (++i < l);

            if (updated) {
              this._updateClassName();
            }
          };
          classListProto.remove = function () {
            var tokens = arguments,
              i = 0,
              l = tokens.length,
              token,
              updated = false,
              index;
            do {
              token = tokens[i] + "";
              index = checkTokenAndGetIndex(this, token);
              while (index !== -1) {
                this.splice(index, 1);
                updated = true;
                index = checkTokenAndGetIndex(this, token);
              }
            } while (++i < l);

            if (updated) {
              this._updateClassName();
            }
          };
          classListProto.toggle = function (token, force) {
            token += "";

            var result = this.contains(token),
              method = result
                ? force !== true && "remove"
                : force !== false && "add";
            if (method) {
              this[method](token);
            }

            if (force === true || force === false) {
              return force;
            } else {
              return !result;
            }
          };
          classListProto.toString = function () {
            return this.join(" ");
          };

          if (objCtr.defineProperty) {
            var classListPropDesc = {
              get: classListGetter,
              enumerable: true,
              configurable: true,
            };
            try {
              objCtr.defineProperty(
                elemCtrProto,
                classListProp,
                classListPropDesc
              );
              delete HTMLElement.prototype.classList;
            } catch (ex) {
              // IE 8 doesn't support enumerable:true
              if (ex.number === -0x7ff5ec54) {
                classListPropDesc.enumerable = false;
                objCtr.defineProperty(
                  elemCtrProto,
                  classListProp,
                  classListPropDesc
                );
              }
            }
          } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
          }
        })(self);
      } else {
        // There is full or partial native classList support, so just check if we need
        // to normalize the add/remove and toggle APIs.

        (function () {
          var testElement = document.createElement("_");

          if (!!("classList" in testElement)) {
            testElement.classList.add("c1", "c2");

            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
              var createMethod = function (method) {
                var original = DOMTokenList.prototype[method];

                DOMTokenList.prototype[method] = function (token) {
                  var i,
                    len = arguments.length;

                  for (i = 0; i < len; i++) {
                    token = arguments[i];
                    original.call(this, token);
                  }
                };
              };
              createMethod("add");
              createMethod("remove");
            }

            testElement.classList.toggle("c3", false);

            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
              var _toggle = DOMTokenList.prototype.toggle;

              DOMTokenList.prototype.toggle = function (token, force) {
                if (1 in arguments && !this.contains(token) === !force) {
                  return force;
                } else {
                  return _toggle.call(this, token);
                }
              };
            }

            testElement = null;
          }
        })();
      }
    })();
  }

  /*
   * element-closest.js: For browsers that do not support Element.closest(), but carry support for document.querySelectorAll()
   */

  /*global  */

  /*! @source https://developer.mozilla.org/de/docs/Web/API/Element/closest#Polyfill */

  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
        do {
          i = matches.length;
          while (--i >= 0 && matches.item(i) !== el) { }
        } while ((i < 0) && (el = el.parentElement));
        return el;
      };
  }

  (function () {
    window.console = window.console || {};
    window.console.log = window.console.log || function () {
    };
    window.console.debug = window.console.debug || window.console.log;
    window.console.info = window.console.info || window.console.log;
    window.console.warn = window.console.warn || window.console.log;
    window.console.error = window.console.error || window.console.log;
    window.console.table = window.console.table || window.console.log;
  })();

  /*
   * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
   */
  (function () {
      if ( typeof window.CustomEvent === "function" ) return false;

      function CustomEvent ( event, params ) {
          params = params || { bubbles: false, cancelable: false, detail: undefined };
          var evt = document.createEvent( 'CustomEvent' );
          evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
          return evt;
      }

      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
  })();

  /* https://github.com/lahmatiy/es6-promise-polyfill */
  (function(global){

  //
  // Check for native Promise and it has correct interface
  //

      var NativePromise = global['Promise'];
      var nativePromiseSupported =
          NativePromise &&
              // Some of these methods are missing from
              // Firefox/Chrome experimental implementations
          'resolve' in NativePromise &&
          'reject' in NativePromise &&
          'all' in NativePromise &&
          'race' in NativePromise &&
              // Older version of the spec had a resolver object
              // as the arg rather than a function
          (function(){
              var resolve;
              new NativePromise(function(r){ resolve = r; });
              return typeof resolve === 'function';
          })();


  //
  // export if necessary
  //

      if (typeof exports !== 'undefined' && exports)
      {
          // node.js
          exports.Promise = nativePromiseSupported ? NativePromise : Promise;
          exports.Polyfill = Promise;
      }
      else
      {
          // AMD
          if (typeof define == 'function' && define.amd)
          {
              define(function(){
                  return nativePromiseSupported ? NativePromise : Promise;
              });
          }
          else
          {
              // in browser add to global
              if (!nativePromiseSupported)
                  global['Promise'] = Promise;
          }
      }


  //
  // Polyfill
  //

      var PENDING = 'pending';
      var SEALED = 'sealed';
      var FULFILLED = 'fulfilled';
      var REJECTED = 'rejected';
      var NOOP = function(){};

      function isArray(value) {
          return Object.prototype.toString.call(value) === '[object Array]';
      }

  // async calls
      var asyncSetTimer = typeof setImmediate !== 'undefined' ? setImmediate : setTimeout;
      var asyncQueue = [];
      var asyncTimer;

      function asyncFlush(){
          // run promise callbacks
          for (var i = 0; i < asyncQueue.length; i++)
              asyncQueue[i][0](asyncQueue[i][1]);

          // reset async asyncQueue
          asyncQueue = [];
          asyncTimer = false;
      }

      function asyncCall(callback, arg){
          asyncQueue.push([callback, arg]);

          if (!asyncTimer)
          {
              asyncTimer = true;
              asyncSetTimer(asyncFlush, 0);
          }
      }


      function invokeResolver(resolver, promise) {
          function resolvePromise(value) {
              resolve(promise, value);
          }

          function rejectPromise(reason) {
              reject(promise, reason);
          }

          try {
              resolver(resolvePromise, rejectPromise);
          } catch(e) {
              rejectPromise(e);
          }
      }

      function invokeCallback(subscriber){
          var owner = subscriber.owner;
          var settled = owner.state_;
          var value = owner.data_;
          var callback = subscriber[settled];
          var promise = subscriber.then;

          if (typeof callback === 'function')
          {
              settled = FULFILLED;
              try {
                  value = callback(value);
              } catch(e) {
                  reject(promise, e);
              }
          }

          if (!handleThenable(promise, value))
          {
              if (settled === FULFILLED)
                  resolve(promise, value);

              if (settled === REJECTED)
                  reject(promise, value);
          }
      }

      function handleThenable(promise, value) {
          var resolved;

          try {
              if (promise === value)
                  throw new TypeError('A promises callback cannot return that same promise.');

              if (value && (typeof value === 'function' || typeof value === 'object'))
              {
                  var then = value.then;  // then should be retrived only once

                  if (typeof then === 'function')
                  {
                      then.call(value, function(val){
                          if (!resolved)
                          {
                              resolved = true;

                              if (value !== val)
                                  resolve(promise, val);
                              else
                                  fulfill(promise, val);
                          }
                      }, function(reason){
                          if (!resolved)
                          {
                              resolved = true;

                              reject(promise, reason);
                          }
                      });

                      return true;
                  }
              }
          } catch (e) {
              if (!resolved)
                  reject(promise, e);

              return true;
          }

          return false;
      }

      function resolve(promise, value){
          if (promise === value || !handleThenable(promise, value))
              fulfill(promise, value);
      }

      function fulfill(promise, value){
          if (promise.state_ === PENDING)
          {
              promise.state_ = SEALED;
              promise.data_ = value;

              asyncCall(publishFulfillment, promise);
          }
      }

      function reject(promise, reason){
          if (promise.state_ === PENDING)
          {
              promise.state_ = SEALED;
              promise.data_ = reason;

              asyncCall(publishRejection, promise);
          }
      }

      function publish(promise) {
          var callbacks = promise.then_;
          promise.then_ = undefined;

          for (var i = 0; i < callbacks.length; i++) {
              invokeCallback(callbacks[i]);
          }
      }

      function publishFulfillment(promise){
          promise.state_ = FULFILLED;
          publish(promise);
      }

      function publishRejection(promise){
          promise.state_ = REJECTED;
          publish(promise);
      }

      /**
       * @class
       */
      function Promise(resolver){
          if (typeof resolver !== 'function')
              throw new TypeError('Promise constructor takes a function argument');

          if (this instanceof Promise === false)
              throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');

          this.then_ = [];

          invokeResolver(resolver, this);
      }

      Promise.prototype = {
          constructor: Promise,

          state_: PENDING,
          then_: null,
          data_: undefined,

          then: function(onFulfillment, onRejection){
              var subscriber = {
                  owner: this,
                  then: new this.constructor(NOOP),
                  fulfilled: onFulfillment,
                  rejected: onRejection
              };

              if (this.state_ === FULFILLED || this.state_ === REJECTED)
              {
                  // already resolved, call callback async
                  asyncCall(invokeCallback, subscriber);
              }
              else
              {
                  // subscribe
                  this.then_.push(subscriber);
              }

              return subscriber.then;
          },

          'catch': function(onRejection) {
              return this.then(null, onRejection);
          }
      };

      Promise.all = function(promises){
          var Class = this;

          if (!isArray(promises))
              throw new TypeError('You must pass an array to Promise.all().');

          return new Class(function(resolve, reject){
              var results = [];
              var remaining = 0;

              function resolver(index){
                  remaining++;
                  return function(value){
                      results[index] = value;
                      if (!--remaining)
                          resolve(results);
                  };
              }

              for (var i = 0, promise; i < promises.length; i++)
              {
                  promise = promises[i];

                  if (promise && typeof promise.then === 'function')
                      promise.then(resolver(i), reject);
                  else
                      results[i] = promise;
              }

              if (!remaining)
                  resolve(results);
          });
      };

      Promise.race = function(promises){
          var Class = this;

          if (!isArray(promises))
              throw new TypeError('You must pass an array to Promise.race().');

          return new Class(function(resolve, reject) {
              for (var i = 0, promise; i < promises.length; i++)
              {
                  promise = promises[i];

                  if (promise && typeof promise.then === 'function')
                      promise.then(resolve, reject);
                  else
                      resolve(promise);
              }
          });
      };

      Promise.resolve = function(value){
          var Class = this;

          if (value && typeof value === 'object' && value.constructor === Class)
              return value;

          return new Class(function(resolve){
              resolve(value);
          });
      };

      Promise.reject = function(reason){
          var Class = this;

          return new Class(function(resolve, reject){
              reject(reason);
          });
      };

  })(typeof window != 'undefined' ? window : typeof global != 'undefined' ? global : typeof self != 'undefined' ? self : undefined);

  /*! @source https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill */

  if (!Element.prototype.matches) {
      Element.prototype.matches =
          Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector ||
          function(s) {
              var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                  i = matches.length;
              while (--i >= 0 && matches.item(i) !== this) {}
              return i > -1;
          };
  }

  /*! @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill */

  if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        
        if (target === null || target === undefined) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  /*! @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill */

  if (!Object.entries) {
    Object.entries = function( obj ){
      var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
      while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];

      return resArray;
    };
  }

  /**
   * LHAS-1897
   * This function add several css classes to the html element,
   * to show whether the browser supports css3 features,
   * like animations or transitions.
   * 
   * This replaces modernizr so teams can use these classes in stylesheets
   * to react to presence or abcence of browser features.
   */
  var doc = document.documentElement;
  var classes = [
    "cssanimations",
    "cssgradients",
    "csstransforms",
    "csstransforms3d",
    "csstransitions",
  ];

  // Removes all classes from the array, whose opposite part
  // (e.g. "no-cssanimations" and "cssanimations") is already on the html element.
  for (var i = 0; i < classes.length; i += 1) {
    if (doc.classList.contains("no-" + classes[i])) {
      classes.splice(i, 1);
      i -= 1;
    }
  }

  doc.classList.add.apply(doc.classList, classes);

}());
