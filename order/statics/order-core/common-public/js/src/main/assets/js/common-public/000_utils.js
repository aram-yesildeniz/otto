var o_order = window.o_order || {};

o_order.utils = o_order.utils || {};

o_order.utils.inArray = function inArray(elem, array) {
  if (array.indexOf) {
    return array.indexOf(elem);
  }

  for (var i = 0, length = array.length; i < length; i++) {
    if (array[i] === elem) {
      return i;
    }
  }

  return -1;
};

o_order.utils.next = function (element, clazz) {
  var nextElement = element;
  if (nextElement) {
    do {
      nextElement = nextElement.nextElementSibling;
    } while (nextElement && !nextElement.classList.contains(clazz));
  }
  return nextElement ? nextElement : undefined;
};

o_order.utils.isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

o_order.utils.parseJsonOrReturn = function (something) {
  try {
    return JSON.parse(something);
  } catch (e) {
    return something;
  }
};

o_order.utils.parseJson = function (something) {
  try {
    return JSON.parse(something) || {};
  } catch (e) {
    return {};
  }
};

o_order.utils.toggle = function (el, value) {
  var display = (window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle).display;
  if (display === 'none') {
    el.style.display = value;
  } else {
    el.style.display = 'none';
  }
};

o_order.utils.handleAjax = function (success, error) {
  return function (xhr) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
      success(xhr);
    } else if (xhr.status === 401) {
      // Redirect to the login page.
      var redirectTo = xhr.getResponseHeader('X-RedirectTo');
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } else {
      if (error && typeof error === "function") {
        error(xhr);
      }
    }
  }
};

/**
 * Man kann leider nicht immer 'window.location.href' nutzen,
 * und zwar dann nicht, wenn sich URLs nur im Hash unterscheiden.
 * Die Seite wird dann nicht neu geladen.
 *
 * Deshalb ist hier etwas mehr Logik verbaut:
 * Falls sich die aktuelle von der neuen URL nicht unterscheidet (ausser ggf. im Hash),
 * dann wird 'window.location.reload' verwendet.
 */
o_order.utils.goto = function (window, url) {
  function extractUrlWithoutHash(urlWithMaybeHash) {
    var hashSignPosition = urlWithMaybeHash.indexOf("#");
    return hashSignPosition > -1 ? urlWithMaybeHash.substring(0, hashSignPosition) : urlWithMaybeHash;
  }

  var currentUrlWithoutHash,
    newUrlElement = document.createElement('a'),
    newUrlWithoutHash;

  newUrlElement.href = url;
  currentUrlWithoutHash = extractUrlWithoutHash(window.location.toString());
  newUrlWithoutHash = extractUrlWithoutHash(newUrlElement.toString());

  if (currentUrlWithoutHash === newUrlWithoutHash) {
    window.location.hash = newUrlElement.hash;
    window.location.reload();
  } else {
    window.location.href = url;
  }
};

o_order.utils.preload = function(element) {
  preload_polyfill_invoke(element);
};

o_order.trackingWrapper = o_order.trackingWrapper || {};

o_order.trackingWrapper.failSafeSendEventToTrackingServer = function (data) {
  try {
    o_tracking.bct.sendEventToTrackingServer(data);
  } catch (e) {
    console.log("Failed to call o_tracking.bct.sendEventToTrackingServer", e);
  }
};

o_order.trackingWrapper.failSafeTrackOnNextPageImpression = function (data) {
  try {
    o_tracking.bct.trackOnNextPageImpression(data);
  } catch (e) {
    console.log("Failed to call o_tracking.bct.trackOnNextPageImpression", e);
  }
};

o_order.trackingWrapper.failSafeSendMergeToTrackingServer = function (data) {
  try {
    o_tracking.bct.sendMergeToTrackingServer(data);
  } catch (e) {
    console.log("Failed to call o_tracking.bct.sendMergeToTrackingServer", e);
  }
};

o_order.trackingWrapper.failSafeGetMergeParameters = function () {
  try {
    return o_tracking.bct.getMergeParameters();
  } catch (e) {
    console.log("Failed to call o_tracking.bct.getMergeParameters", e);
    return "";
  }
};

o_order.trackingWrapper.failSafeCreateContext = function (layerId, layerUrl) {
  try {
    o_tracking.bct.createContext(layerId, layerUrl);
  } catch (e) {
    console.log("Failed to call o_tracking.bct.createContext", e);
  }
};

o_order.trackingWrapper.failSafeCloseContext = function () {
  try {
    o_tracking.bct.closeContext();
  } catch (e) {
    console.log("Failed to call o_tracking.bct.closeContext", e);
  }
};
