(function () {
  'use strict';

  var _a, _b;
  // see o.util.browser
  const findInUserAgent = (_b = (_a = window.o_util) === null || _a === void 0 ? void 0 : _a.browser) === null || _b === void 0 ? void 0 : _b.findInUserAgent;

  var OsType;
  (function (OsType) {
      OsType["Window98"] = "Windows 98";
      OsType["WindowsMe"] = "Windows Me";
      OsType["NT"] = "Microsoft Windows NT 4.0";
      OsType["Windows2000"] = "Windows 2000";
      OsType["Windows2000SP1"] = "Windows 2000 SP1";
      OsType["WindowsXP"] = "Windows XP";
      OsType["Windows2003"] = "Windows Server 2003; Windows XP x64 Edition";
      OsType["WindowsVista"] = "Windows Vista";
      OsType["Windows7"] = "Windows7";
      OsType["Windows8"] = "Windows 8";
      OsType["Windows81"] = "Windows 8.1";
      OsType["Windows10"] = "Windows 10";
      OsType["Windows101"] = "Windows 10.1";
      OsType["Blackberry"] = "Blackberry";
      OsType["HpWebOs"] = "HP webOS";
      OsType["AmazonFireOs"] = "Amazon FireOS";
      OsType["Symbian"] = "Symbian";
      OsType["MacOs"] = "Mac OS";
      OsType["Linux"] = "Linux";
      OsType["WindowsPhone10"] = "Windows Phone 10.0";
      OsType["WindowsPhone"] = "Windows Phone";
      OsType["FirefoxOS"] = "Firefox OS";
      OsType["Android"] = "Android";
      OsType["Ios"] = "iOS";
      OsType["other"] = "other";
      OsType["UNKNOWN"] = "unknown";
  })(OsType || (OsType = {}));
  /**
   * detects the user's operations system by parsing the user agent
   *
   *
   *  @return name of the operation system
   */
  function os() {
      // TODO array some: https://caniuse.com/#feat=mdn-javascript_builtins_array_some
      if (!findInUserAgent) {
          return OsType.UNKNOWN;
      }
      const windowsPlatformToken = {
          "Windows 98": OsType.Window98,
          "Windows 98; Win 9x 4.90 ": OsType.WindowsMe,
          "Windows NT 4.0": OsType.NT,
          "Windows NT 5.0": OsType.Windows2000,
          "Windows NT 5.01": OsType.Windows2000SP1,
          "Windows NT 5.1": OsType.WindowsXP,
          "Windows NT 5.2": OsType.Windows2003,
          "Windows NT 6.0": OsType.WindowsVista,
          "Windows NT 6.1": OsType.Windows7,
          "Windows NT 6.2": OsType.Windows8,
          "Windows NT 6.3": OsType.Windows81,
          "Windows NT 10.0": OsType.Windows10,
          "Windows NT 10.1": OsType.Windows101,
      };
      // Windows | http://msdn.microsoft.com/en-us/library/ms537503%28v=vs.85%29.aspx#PltToken
      // IE9 https://stackoverflow.com/a/52412322/408668
      const windows = Object.entries(windowsPlatformToken).filter(([key]) => {
          return findInUserAgent(key.toLowerCase());
      })[0];
      if (windows) {
          const [, value] = windows;
          return value;
      }
      // BlackberryOS
      const blackberryOS = ["blackberry", "bb10", "rim", "playbook"];
      if (blackberryOS.some(findInUserAgent)) {
          return OsType.Blackberry;
      }
      // HP webOS
      const webOs = ["webos", "hpwos"];
      if (webOs.some(findInUserAgent)) {
          return OsType.HpWebOs;
      }
      // Amazon FireOS | http://docs.aws.amazon.com/silk/latest/developerguide/user-agent.html
      const fireOS = ["silk", "kfot", "kftt", "kfjw", "kfsowi", "kfthw", "kfapw"];
      if (fireOS.some(findInUserAgent)) {
          return OsType.AmazonFireOs;
      }
      // Symbian
      if (findInUserAgent("symbianos")) {
          return OsType.Symbian;
      }
      // MacOS
      if (findInUserAgent("macintosh") && findInUserAgent("mac os x")) {
          return OsType.MacOs;
      }
      // Linux
      if (findInUserAgent("linux") &&
          !findInUserAgent("android") &&
          !findInUserAgent("webos")) {
          return OsType.Linux;
      }
      // Windows Phone 10.0
      if (findInUserAgent("windows phone 10.0")) {
          return OsType.WindowsPhone10;
      }
      // Windows Phone
      if (findInUserAgent("windows phone")) {
          return OsType.WindowsPhone;
      }
      // FirefoxOS | https://developer.mozilla.org/de/docs/Gecko_user_agent_string_referenz
      const firefoxOS = ["(mobile;", "(tablet;"];
      if (firefoxOS.some(findInUserAgent)) {
          return OsType.FirefoxOS;
      }
      // Android | https://developer.chrome.com/multidevice/user-agent
      if (findInUserAgent("android")) {
          return OsType.Android;
      }
      // IOS
      const ios = ["iphone", "ipad", "ipod"];
      if (ios.some(findInUserAgent)) {
          return OsType.Ios;
      }
      return OsType.other;
  }

  var Browser;
  (function (Browser) {
      Browser["SILK"] = "Silk";
      Browser["ICEWEASEL"] = "Iceweasel";
      Browser["NOKIA"] = "BrowserNG/NokiaBrowser";
      Browser["OTHER"] = "other";
      Browser["UNKNOWN"] = "unknown";
      Browser["EDGE"] = "Edge";
      Browser["CHROME"] = "Chrome";
      Browser["MOBILE_SAFARI"] = "Mobile Safari";
      Browser["SAFARI"] = "Safari";
      Browser["FIREFOX"] = "Firefox";
      Browser["OPERA"] = "Opera";
      Browser["OPERA_MOBILE"] = "Opera Mobile";
      Browser["OPERA_MINI"] = "Opera Mini";
      Browser["MSIE"] = "MSIE (not supported Version)";
      Browser["MSIE9"] = "MSIE9";
      Browser["MSIE10"] = "MSIE10";
      Browser["MSIE11"] = "MSIE11";
  })(Browser || (Browser = {}));
  /**
   * detects the user's browser by parsing the user agent
   *
   *
   *  @return name of the browser
   */
  function browser() {
      if (!findInUserAgent) {
          return Browser.UNKNOWN;
      }
      // Silk (Amazon Browser)
      if (findInUserAgent("silk")) {
          return Browser.SILK;
      }
      // Iceweasel
      if (findInUserAgent("iceweasel")) {
          return Browser.ICEWEASEL;
      }
      // NokiaBrowser
      if (findInUserAgent("nokiabrowser") || findInUserAgent("browserng")) {
          return Browser.NOKIA;
      }
      // Edge //TODO: ask nico about tests
      if (findInUserAgent("edg")) {
          return Browser.EDGE;
      }
      // Chrome (iOS/Android)
      if ((findInUserAgent("crios") || findInUserAgent("chrome")) &&
          !findInUserAgent("opera") &&
          !findInUserAgent("opr/")) {
          return Browser.CHROME;
      }
      // Mobile Safari TODO: different implementation
      if (findInUserAgent("safari") &&
          findInUserAgent("mobile") &&
          !findInUserAgent("chrome") &&
          !findInUserAgent("crios") &&
          !findInUserAgent("silk")) {
          return Browser.MOBILE_SAFARI;
      }
      // Safari
      if (findInUserAgent("safari") &&
          !findInUserAgent("chrome") &&
          !findInUserAgent("crios") &&
          !findInUserAgent("silk")) {
          return Browser.SAFARI;
      }
      // Firefox
      if (findInUserAgent("firefox") && !findInUserAgent("seamonkey")) {
          return Browser.FIREFOX;
      }
      // Internet Explorer
      if (findInUserAgent("msie 9")) {
          return Browser.MSIE9;
      }
      if (findInUserAgent("msie 10")) {
          return Browser.MSIE10;
      }
      if (findInUserAgent("msie 11") ||
          findInUserAgent("rv:11.0") ||
          findInUserAgent("compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; Tablet PC 2.0") ||
          findInUserAgent("compatible; MSIE 7.0; Windows NT 6.3; Trident/7.0; Touch")) {
          return Browser.MSIE11;
      }
      if (findInUserAgent("msie")) {
          return Browser.MSIE;
      }
      // Opera Mini
      if (findInUserAgent("opera mini")) {
          return Browser.OPERA_MINI;
      }
      // Opera
      if (findInUserAgent("opera") ||
          findInUserAgent("presto") ||
          findInUserAgent("opr/")) {
          // Opera Mobile
          if (findInUserAgent("mobi")) {
              return Browser.OPERA_MOBILE;
          }
          return Browser.OPERA;
      }
      /*
    
      // WebOSBrowser
    
      TODO: ask nico about old browsers
    
      if (
        (findInUserAgent("webos") || findInUserAgent("hpwos")) &&
        (findInUserAgent("wosbrowser") || findInUserAgent("pre/1"))
      ) {
        return "webOSBrowser";
      }
      // SeaMonkey
      if (findInUserAgent("seamonkey")) {
        return "SeaMonkey";
      }
    
    
      */
      return Browser.OTHER;
  }

  /**
   * detects the user's screen resolution
   *
   *
   */
  const screen = {
      getWidth: () => {
          return window.innerWidth;
      },
      getHeight: () => {
          return window.screen.height;
      },
  };

  var OrientationType;
  (function (OrientationType) {
      OrientationType["PORTRAIT"] = "portrait";
      OrientationType["LANDSCAPE"] = "landscape";
      OrientationType["UNKNOWN"] = "unknown";
  })(OrientationType || (OrientationType = {}));
  class Orientation {
      constructor() {
          this.registeredCallbacks = [];
          this.orientation = {
              // eslint-disable-next-line compat/compat
              portrait: window.matchMedia(`(orientation: ${OrientationType.PORTRAIT})`),
              // eslint-disable-next-line compat/compat
              landscape: window.matchMedia(`(orientation: ${OrientationType.LANDSCAPE})`),
          };
          this.initializeOrientationListeners();
      }
      getCurrentOrientation() {
          if (this.isPortrait()) {
              return OrientationType.PORTRAIT;
          }
          if (this.isLandscape()) {
              return OrientationType.LANDSCAPE;
          }
          return OrientationType.UNKNOWN;
      }
      registerChangeListener(callback) {
          this.registeredCallbacks.push(callback);
      }
      trigger(mql) {
          // Because the listener is registered on both orientations,
          // an orientation change will trigger both listeners.
          // But the registered function should only execute once.
          // With mql.matches only the listener for the active orientation will be executed.
          if (mql.matches) {
              // Set the correct value in the variable _currentOrientation.
              this.registeredCallbacks.forEach((cb) => {
                  cb(this.getCurrentOrientation());
              });
          }
      }
      initializeOrientationListeners() {
          // In LHAS-860 we modified the matchMedia Polyfill.
          // Due to that, the orientation cannot be listened with the "orientationchange" event,
          // because the fix from LHAS-860 only work with matchMedia.
          this.orientation.portrait.addListener((e) => this.trigger(e));
          this.orientation.landscape.addListener((e) => this.trigger(e));
      }
      isPortrait() {
          return this.orientation.portrait.matches;
      }
      /**
       * Is the current screen in landscape orientation?
       *
       * @return {Boolean} A flag if the current screen is in landscape orientation
       * @private
       */
      isLandscape() {
          return this.orientation.landscape.matches;
      }
  }
  function orientation() {
      return new Orientation();
  }

  /**
   * Check if browser is a touchable device and set root class "touchable" accordingly.
   * PhantomJS is registered as a touchable device incorrectly.
   *
   * Old msMaxTouchPoints returns wrong results at non-touch-devices.
   *
   * @return {Boolean} Flag if device is touchable or not.
   */
  function isTouchable() {
      const isTouchableFlag = ("ontouchstart" in window ||
          !!(window.DocumentTouch && document instanceof window.DocumentTouch) ||
          window.navigator.maxTouchPoints) &&
          // eslint-disable-next-line no-underscore-dangle
          !window._phantom &&
          !window.phantom;
      if (isTouchableFlag) {
          // Add "touchable" class to root element if device ist definitely touchable.
          document.documentElement.classList.add("touchable");
      }
      else {
          document.documentElement.classList.add("not-touchable");
      }
      // noinspection PointlessBooleanExpressionJS
      return isTouchableFlag === true;
  }

  var DeviceType;
  (function (DeviceType) {
      DeviceType["MOBILE"] = "mobile";
      DeviceType["DESKTOP"] = "desktop";
      DeviceType["TABLET"] = "tablet";
      DeviceType["UNKOWN"] = "unknown";
  })(DeviceType || (DeviceType = {}));
  /**
   * Identify the used device type (mobile, tablet, desktop) based on the user-agent.
   * The user-agent can be easily manipulated! Use the information with caution.
   *
   * @return {String} Used device type.
   */
  function type() {
      if (!findInUserAgent) {
          return DeviceType.UNKOWN;
      }
      // Generic Mobile
      if ((findInUserAgent("mobile") && !findInUserAgent("ipad")) ||
          findInUserAgent("(mobile;") ||
          findInUserAgent("phone") ||
          (findInUserAgent("android") &&
              findInUserAgent("mobile") &&
              !findInUserAgent("ipad")) ||
          findInUserAgent("ipod") ||
          findInUserAgent("iphone") ||
          (findInUserAgent("windows") && findInUserAgent("phone")) ||
          (findInUserAgent("silk") && findInUserAgent("mobile")) ||
          findInUserAgent("symbianos") ||
          findInUserAgent("(mobile;")) {
          return DeviceType.MOBILE;
      }
      // Generic Tablet
      if (findInUserAgent("playbook") ||
          findInUserAgent("tablet") ||
          findInUserAgent("(tablet;") ||
          findInUserAgent("touch") ||
          (findInUserAgent("android") && !findInUserAgent("mobile")) ||
          findInUserAgent("ipad") ||
          (findInUserAgent("windows") &&
              !findInUserAgent("phone") &&
              findInUserAgent("touch")) ||
          (findInUserAgent("silk") && !findInUserAgent("mobile")) ||
          findInUserAgent("(tablet;")) {
          return DeviceType.TABLET;
      }
      // Blackberry
      if (findInUserAgent("blackberry") ||
          findInUserAgent("bb10") ||
          findInUserAgent("rim")) {
          return DeviceType.MOBILE;
      }
      return DeviceType.DESKTOP;
  }

  // see o_global.eventLoader
  var _a$1;
  const GlobalEventLoader = (_a$1 = window.o_global) === null || _a$1 === void 0 ? void 0 : _a$1.eventLoader;

  var _a$2;
  // export declare var GlobalStorage: {
  //     prototype: GlobalStorage;
  //     new (nativeOrFunc: Storage | (() => Storage)): GlobalStorage
  //   }
  const GlobalStorage = (_a$2 = window.o_global) === null || _a$2 === void 0 ? void 0 : _a$2.Storage;

  const mouseMoveEventName = "mousemove";
  const sessionStorageKey = "isHybrid";
  /**
   * Class to detect hybrid devices.
   */
  class Hybrid {
      constructor() {
          this.timeoutIdArr = [];
          this.callbackList = [];
          this.checkMouseMoves = () => {
              this.mouseMoveCounter += 1;
              if (this.mouseMoveCounter > 3) {
                  this.updateStatus();
                  document.documentElement.removeEventListener(mouseMoveEventName, this.checkMouseMoves);
              }
              if (!this.isDetected) {
                  const id = setTimeout(() => {
                      this.mouseMoveCounter = 0;
                      this.checkCounter += 1;
                      if (this.checkCounter > 8) {
                          this.storage.setItem(sessionStorageKey, "false");
                          this.clearTimeouts();
                          document.documentElement.removeEventListener(mouseMoveEventName, this.checkMouseMoves);
                      }
                  }, 300);
                  this.timeoutIdArr.push(id);
              }
          };
          this.storage = new GlobalStorage(() => window.sessionStorage);
          this.mouseMoveCounter = 0;
          this.checkCounter = 0;
          this.isDetected = false;
      }
      detect() {
          var _a, _b;
          this.isTouchable = isTouchable();
          if (this.isTouchable) {
              if (((_a = this.storage) === null || _a === void 0 ? void 0 : _a.getItem(sessionStorageKey)) === "true") {
                  this.isDetected = true;
              }
              else if (!((_b = this.storage) === null || _b === void 0 ? void 0 : _b.getItem(sessionStorageKey))) {
                  // Only check once a session, if hybrid is not detected, value is set to false
                  GlobalEventLoader.onReady(200, () => {
                      document.documentElement.addEventListener("mousemove", this.checkMouseMoves);
                  });
              }
          }
      }
      clearTimeouts() {
          while (this.timeoutIdArr.length > 0) {
              const id = this.timeoutIdArr.pop();
              if (id) {
                  clearTimeout(id);
              }
          }
      }
      updateStatus() {
          this.storage.setItem(sessionStorageKey, "true");
          this.isDetected = true;
          this.callbackList.forEach((cb) => {
              cb();
          });
      }
      executeOrRegisterCallback(callback) {
          if (this.isDetected) {
              callback();
          }
          else {
              this.callbackList.push(callback);
          }
      }
  }
  function hybrid() {
      const hybridInstance = new Hybrid();
      hybridInstance.detect();
      return hybridInstance;
  }

  // Export Device functionality to global namespace.
  window.o_global = window.o_global || {};
  window.o_global.device = {
      Hybrid: Hybrid,
      Orientation: Orientation,
      isTouchable: isTouchable(),
      os: os(),
      screen: screen,
      browser: browser(),
      orientation: orientation(),
      hybrid: hybrid(),
      type: type(),
      breakpoint: window.o_global.breakpoint,
  };

}());
