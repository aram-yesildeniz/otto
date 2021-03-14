// For JSLINT
/*global window, document */
/*jslint es5: true */
var lhotse = lhotse || {},
    o_user = o_user || {};

o_user.common = o_user.common || {};
o_user.common.form = o_user.common.form || {};

o_user.common.eventHandlerBuilder = function (window, document, o_trackingBct, globalEvent, ajaxUtil, coreUtil) {
    "use strict";

    function executeFunctionByName(functionName) {
        var args = [].slice.call(arguments).splice(2);

        return coreUtil.convertStringToFunction(functionName, window).apply(window, args);
    }

    function loadHtmlContent(url, containerElement, functionCallAfterLoadContent) {
        ajaxUtil.get(url).then(function (xhr) {
            containerElement.outerHTML = xhr.responseText;
            if (functionCallAfterLoadContent) {
                executeFunctionByName(functionCallAfterLoadContent);
            }
        }).catch(function (xhr) {
            // some logging?
        });
    }

    function appendTrackingMergeParamsToUrl(theUrl) {
        var mergeParameters = "",
            paramSeparator = "";

        try {
            mergeParameters = o_trackingBct().getMergeParameters();
            paramSeparator = (theUrl.indexOf("?") > -1) ? "&" : "?";
        } catch (e) {
        }

        return theUrl + paramSeparator + mergeParameters;
    }

    function initLoadEsiAjax() {
        [].forEach.call(document.getElementsByClassName("us_js_esiAjax"), function (element) {
            var url = element.getAttribute("data-url"),
                eventType = element.getAttribute("data-eventtype") || "load",
                priority = element.getAttribute("data-priority") || 99,
                trackingType = element.getAttribute("data-trackingtype") || "",
                functionCallAfterLoadContent = element.getAttribute("data-function");

            if (trackingType === "merge") {
                url = appendTrackingMergeParamsToUrl(url);
            }

            if (eventType === "load") {
                globalEvent.onLoad(priority, function () {
                    loadHtmlContent(url, element, functionCallAfterLoadContent);
                });
            } else if (eventType === "immediate") {
                loadHtmlContent(url, element, functionCallAfterLoadContent);
            }
        });
    }

    return {
        initLoadEsiAjax: initLoadEsiAjax
    };
};

o_user.common.toolsBuilder = function (document) {
    "use strict";

    function setAutoFocus() {
        if (document.documentElement.classList.contains("non-touchable")) {
            document.querySelector(".user_system_rwd input[data-autofocus='autofocus']").focus();
        }
    }

    return {
        setAutoFocus: setAutoFocus
    };
};

o_user.common.serializeForm = function (form) {
    "use strict";

    var field,
        s = [],
        len,
        len2,
        i,
        j;

    if (typeof form === "object" && form.nodeName === "FORM") {
        len = form.elements.length;

        /*jslint plusplus: true */
        for (i = 0; i < len; i++) {
            field = form.elements[i];

            if (field.name && !field.disabled && field.type !== "submit" && field.type !== "reset" && field.type !== "button" && field.type !== "file") {
                if (field.type === "select-multiple") {
                    len2 = form.elements[i].options.length;

                    for (j = 0; j < len2; j++) {
                        if (field.options[j].selected) {
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                        }
                    }
                } else if ((field.type !== "radio" && field.type !== "checkbox") || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
    }

    return s.join("&").replace(/%20/g, "+");
};
