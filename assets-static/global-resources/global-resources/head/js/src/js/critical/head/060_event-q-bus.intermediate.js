(function () {
  'use strict';

  function setOGlobal(name, obj) {
      window.o_global = window.o_global || {};
      // Here we have to override typing so we can assign our store instance
      window.o_global[name] =
          window.o_global[name] || obj;
      return window.o_global[name];
  }
  /**
   * Regex expression used to validate topic name
   */
  const validationRegex = /^[a-zA-Z0-9-]{2,}\.[a-zA-Z0-9-]{3,}\.[a-zA-Z0-9-]{3,}$/;
  /**
   * throws an error if topic name is invalid
   * @param topic name of the topic to validate
   */
  function validateTopic(topic) {
      if (!(typeof topic === "string" && validationRegex.test(topic))) {
          throw new Error(`eventQBus: topic name '${topic}' is invalid, please match regex syntax '${validationRegex.toString()}' (e.g. "assets.rum.fired")`);
      }
  }
  /**
   * Returns true if given argument is a valid callback function
   *
   * @param callback callback function to validate
   */
  function isValidCallback(callback) {
      return typeof callback === "function";
  }
  /**
   * Used internally by Event QBus
   * @param format
   * @param param
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function log(format, ...param) {
      var _a;
      if ((_a = window.o_global) === null || _a === void 0 ? void 0 : _a.eventQBusLogger) {
          try {
              window.o_global.eventQBusLogger(`[log] eventQBus: ${format}`, ...param);
          }
          catch (_b) {
              /* do nothing catch all */
          }
      }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /**
   * Qbus topic holds the pipeline for a named topic.
   * It is used internally by Event QBus
   */
  class QBusTopic {
      /**
       * Creates an instance of qbus topic.
       * this is claaed internally by event qbus
       *
       * @param name topic name
       */
      constructor(name) {
          /**
           * List of Listeners of qbus topic
           */
          this.listeners = [];
          /**
           * Data queue of qbus topic, it is used in the Queue mode to cache
           * Events for delayed dispatching during script loading time
           */
          this.dataQueue = [];
          this.topicName = name;
      }
      /**
       * adds new evetn data to the internal queue
       *
       * @template D
       * @param [eventData] data to enqueue, can be empty
       * @returns enqueued data array
       */
      queueData(eventData = []) {
          this.dataQueue.push(eventData);
          return eventData;
      }
      /**
       * Removed all data from the topic queue
       * this is usually done on allScriptsExecuted event
       */
      clearData() {
          this.dataQueue.splice(0);
      }
      /**
       * Adds a listener to the topic, if not already registered.
       *
       * @template D
       * @template R
       * @param callback callback function will be invoked during event dispatching
       * @param [singleRun]  indicates, whether this listener should be invoked only one time
       * @returns listener object created from callback
       */
      addListener(callback, singleRun = false) {
          // Construct listener
          const listener = { singleRun, callback };
          // Prevent duplicates
          if (!this.listeners.some((item) => listener.singleRun === item.singleRun &&
              listener.callback === item.callback)) {
              this.listeners.push(listener);
          }
          return listener;
      }
      /**
       * Searches for listener, which use given callback function and removes them
       * from listener list.
    
       * @template D
       * @template R
       * @param callback callback function to remove from topic
       * @returns true if callback was really removed, false if given callback was not
       * registered with this topic
       */
      removeByCallback(callback) {
          let res = false;
          if (callback) {
              this.listeners
                  .filter((l) => l.callback === callback)
                  .forEach((listener) => {
                  this.removeListener(listener);
                  res = true;
              });
          }
          return res;
      }
      /**
       * Emits all listener registered with the topic, by passing the event data to them
       *
       * @template D
       * @param [eventData] optional event data
       * @returns Promise which resolves after all listener are invoked
       * with results of all invoked listeners
       */
      emitAllListener(eventData = []) {
          return Promise.all([...this.listeners].map((listener) => {
              return this.emitListener(listener, eventData);
          }));
      }
      /**
       * Emits listener with queued data, this is done before allScriptsExecuted
       *
       * @template D
       * @template R
       * @param listener listener to invoke with wueued data
       * @returns Promise which resolves after the listener was invoked
       * contains results of every invocation
       */
      emitListenerWithQueuedData(listener) {
          // If there was no producer (emit), we have no data - so skip.
          // Produced events without data are stored as empty array in this queue.
          if (this.dataQueue.length > 0) {
              // If we have a 'singleRun' listener emit only the first data element and return.
              // (because we do not access them by iterating the listener list here to be faster)
              if (listener.singleRun) {
                  return Promise.all([
                      this.emitListener(listener, this.dataQueue[0]),
                  ]);
              }
              return Promise.all(this.dataQueue.map((eventData) => {
                  return this.emitListener(listener, eventData);
              }));
          }
          return Promise.resolve([]);
      }
      /**
       * Emits given listener with given event data
       * @template D
       * @template R
       * @param listener
       * @param eventData list of arguments to pass to the listener
       * @returns listener
       */
      emitListener(listener, eventData) {
          // Remove listener if registered as emit `once` remove listener first
          if (listener.singleRun) {
              this.removeListener(listener);
          }
          // This interrupt the event queue, so the call is async
          log("dispatch event on: %s", this.topicName);
          return Promise.resolve().then(() => listener.callback.call(this, ...eventData));
      }
      /**
       * Removes listener from topic
       * @template D
       * @template R
       * @param listener
       * @returns true if listener
       */
      removeListener(listener) {
          const { listeners } = this;
          const index = listeners.indexOf(listener);
          if (index > -1) {
              listeners.splice(index, 1);
              return true;
          }
          return false;
      }
  }

  /* eslint-disable @typescript-eslint/camelcase */
  /**
   * This is the QBus Store used by QBus instances to exchange events
   * On the QBus system. This is normally instanciated internally by QBus
   *
   * But you can do it by yourself if you want a privat bus system for your code
   */
  class QBusStore {
      /**
       * Creates an instance of event qbus store.
       * @param [options] pass QBusStoreOptions here if you want configure a custom instance
       */
      constructor(options = {}) {
          /**
           * Contains topics of the Event QBus
           */
          this.map = {};
          this.isBusMode = options.isBusMode || false;
          if (!options.ignoreAllScriptsExecuted) {
              this.initEvent();
          }
      }
      initEvent() {
          var _a, _b;
          // This should be only done once
          if (typeof ((_b = (_a = window.o_global) === null || _a === void 0 ? void 0 : _a.eventLoader) === null || _b === void 0 ? void 0 : _b.onAllScriptsExecuted) === "function") {
              log("Subscribe on onAllScriptsExecuted");
              window.o_global.eventLoader.onAllScriptsExecuted(1000, () => {
                  log("All Scripts were Executed, flush all events");
                  // Mark allScriptsExecutes for further usage
                  this.isBusMode = true;
                  // Remove entire queued data
                  this.clearData();
              });
          }
      }
      /**
       * Returns a Topic by its name or undefined in case it does not exists
       *
       * @param topic name of the topic to get
       * @returns Topic by name or undefined
       */
      get(topic) {
          return this.map[topic];
      }
      /**
       * Clears qbus store by removing all topics from the store.
       * This also disconnects all subscribers
       */
      clear() {
          Object.keys(this.map).forEach((k) => {
              delete this.map[k];
          });
      }
      /**
       * Used internally. Clears all data queues from all Topics
       * This is usually done on onAllScriptsExecuted
       */
      clearData() {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(this.map).forEach(([_, topic]) => {
              topic.clearData();
          });
      }
      /**
       * Returns topic by its name, if no topic is found in store,
       * a new one will be created
       *
       * @param topic name of the topic to retrieve
       * @returns Existing or new Created Topic Instance
       */
      getOrAddTopic(topic) {
          const res = this.get(topic);
          if (!(res instanceof QBusTopic)) {
              this.map[topic] = new QBusTopic(topic);
              return this.map[topic];
          }
          return res;
      }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /**
   * Adds subscription
   * @template D
   * @template R
   * @param {
   *   store,
   *   topicName,
   *   callback,
   *   singleRun,
   * } "function arguments"
   * @returns subscription
   */
  function addSubscription({ store, topicName, callback, singleRun, }) {
      validateTopic(topicName);
      log("add new subscription for: %s with: %o", topicName, { singleRun });
      if (isValidCallback(callback)) {
          const topic = store.getOrAddTopic(topicName);
          // No need to update `_eventMap` after adding a new listener, everything stored as reference..
          const listener = topic.addListener(callback, singleRun);
          // The check here is redundant, but on purpose
          if (!store.isBusMode) {
              log("queue mode is on, dispatch from queue");
              // Push everything we know to this single consumer
              topic.emitListenerWithQueuedData(listener);
          }
          return listener.callback;
      }
      return null;
  }
  function removeSubscription({ store, topicName, callback, }) {
      log("remove subscription for: %s", topicName);
      const event = store.get(topicName);
      return event ? event.removeByCallback(callback) : false;
  }
  function publish({ store, topicName, data, }) {
      validateTopic(topicName);
      log("publish to: %s", topicName);
      const topic = store.getOrAddTopic(topicName);
      if (!store.isBusMode) {
          // Store data for consumers which are not ready yet
          topic.queueData(data);
      }
      // Push all data to all existing listeners
      return topic.emitAllListener(data);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /**
   * This is the Event QBus Control class.
   * It provides methods to operate Event QBus
   *
   *  @example
   *
   * ```ts
   *
   * const bus = eventQBus();
   * bus.on("foo.bar.baz", (foo: string, bar: number) => {
   *    console.log("foo arg: ", foo);
   *    console.log("bar arg: ", bar);
   *
   *    bus.emit("foo.bar.bazCompleted", { some: "data" })
   * })
   *
   *
   * // somewhere else
   * const bus = eventQBus();
   * bus.on("foo.bar.bazCompleted", (res: { some: string }) => {
   *    console.log("foo.bar.baz completed with some: ", res.some);
   * })
   *
   * bus.emit("foo.bar.baz", "fooArg", 2)
   *
   * ```
   */
  class QBus {
      /**
       * Creates an instance of qbus.
       * @param [options] configuration object
       */
      constructor(options = {}) {
          var _a;
          // This can safely be called as many times as wanted
          this.store =
              options.store || ((_a = window.o_global) === null || _a === void 0 ? void 0 : _a.eventQBusStore) ||
                  setOGlobal("eventQBusStore", new QBusStore());
      }
      /**
       * indicates whether Qbus is in bus mode
       */
      get isBusMode() {
          return this.store.isBusMode;
      }
      /**
       * indicates whether Qbus is in queue mode
       */
      get isQueueMode() {
          return !this.store.isBusMode;
      }
      /**
       * Registers a subscriber callback function with given topic
       *
       * @template D type of callback params accepted by the callback
       * @template R type of value returned by callback function
       * @param topic name of the topic to register callback with
       * @param callback callback function will be invoked if an event is dispatched
       * on the given topic
       * @returns given callback function or null in case given function is somehow invalid
       * in this case no listener will be created, but also no error will be thrown
       * You have to ensure, you give a valid callback function by yourself
       *
       * @example
       *
       * ```ts
       * const callback = eventQBus().on(
       *   "ft1.wishlist-core.itemAdded",
       *   function(item, anyOtherData) {
       *     console.log(item);
       *     console.log(anyOtherData);
       *   }
       * );
       * ```
       */
      on(topic, callback) {
          return addSubscription({
              store: this.store,
              topicName: topic,
              callback,
              singleRun: false,
          });
      }
      /**
       * Registers a subscriber callback function with given topic.
       * The registered callback will be only invoked one time.
       * This is usefull for building inti-style callbacks
       *
       * @template D type of callback params accepted by the callback
       * @template R type of value returned by callback function
       * @param topic name of the topic to register callback with
       * @param callback callback function will be invoked if an event is dispatched
       * on the given topic
       * @returns given callback function or null in case given function is somehow invalid
       * in this case no listener will be created, but also no error will be thrown
       * You have to ensure, you give a valid callback function by yourself
       */
      once(topic, callback) {
          return addSubscription({
              store: this.store,
              topicName: topic,
              callback,
              singleRun: true,
          });
      }
      /**
       * Removes callback function from the topic
       *
       * @template D type of callback params accepted by the callback
       * @template R type of value returned by callback function
       * @param topic name of the topic to remove callback from
       * @param callback callback function registred with the given topic
       * @returns true if callback was registered with the topic and successfully removed
       * otherwise false
       */
      off(topic, callback) {
          return removeSubscription({ store: this.store, topicName: topic, callback });
      }
      /**
       * Emits an event to the given topic identfied by its name, this will trigger
       * all registered callbacks `immediately` by passing given data payload to them.
       *
       * the method returns immediately by returning a promise which resolves
       * after all registered callbacks are executed. the promise resolves then with
       * the return values of the callbacks.
       *
       * So you can decide to fire and forget this (this is the default procedure), or
       * to `await` the promise and to check the state of the payload and/or resulted data
       *
       * in case the QBus is in Queue Mode, there may be no callbacks registered with
       * the topic. In this case the Promise will resolve immediately with empty result.
       *
       * if QBus is in queue mode (before allScriptsExecuted) the event will be queued
       * until
       *
       *    1.: A subscriber registers with the topic.
       *    2.: QBus switches to Bus mode.
       *
       * on allScriptsExecuted `all` queued events will be discarded if there are
       * no subscribers registered with the topic.
       *
       * @template D type of the Event Data payload
       * @param topic the name of the topic
       * @param {...any} data data params to be passed to the registered callbacks
       * @returns Promise resolves `after` all callbacks are executed
       */
      emit(topic, ...data) {
          return publish({ store: this.store, topicName: topic, data });
      }
  }

  /* eslint-disable @typescript-eslint/camelcase */
  /**
   * Creates new Instance of Event QBus.
   * This will use the global Bus Store instance, and is used for inter script
   * communication. This function can be called multiple times and even used on the fly
   *
   * if you need a private instance of the Bus (for whatever reason), see QBus constructor
   *
   * @param options Event QBus options object will be passed ot QBus constructor
   * @returns an instance of Event QBus
   *
   * @example
   * Create bus instance and store it in a variable
   *
   * ```ts
   *
   * const bus = eventQBus();
   * bus.emit("foo.baz.bar", { foo: "bar" });
   *
   * bus.on("foo.baz.bar", () => {
   *  // ...do something here...
   * });
   *
   * ```
   *
   * or use Event QBus on the fly
   *
   * ```ts
   *
   * eventQBus().emit("foo.baz.bar", { foo: "bar" });
   * ```
   */
  function eventQBus(options) {
      return new QBus(options);
  }

  // Export Debug functionality to global namespace.
  window.o_global = window.o_global || {};
  window.o_global.eventQBus = window.o_global.eventQBus || eventQBus();

}());
