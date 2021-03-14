var o_order = window.o_order || {};
o_order.settings = o_order.settings || {};

o_order.settings.serviceBuilder = function () {
    'use strict';

    var module = {},
        settings = [];

    module.isEnabled = function (settingName) {
        return o_order.utils.inArray(settingName, settings) > -1;
    };

    module.init = function () {
        var settingsElement = document.getElementById("order_js_settings");
        var settingsString = (settingsElement ? settingsElement.getAttribute("data-settings") : undefined) || "";
        var dataSettings = settingsString.split(",");
        var cookie = o_util.cookie.get("settings");
        if (cookie !== undefined) {
            var json = decodeURIComponent(cookie.replace(/\+/g, '%20'));
            JSON.parse(json, function (key, value) {
                if (key !== "") {
                    if (value.toLowerCase() === 'true') {
                        dataSettings.push(key);
                    }
                    else {
                        dataSettings = dataSettings.filter(function (e) {
                            return e !== key;
                        });
                    }
                }
            });
        }
        settings = dataSettings;
    };

    return module;
};

o_order.settings.service = o_order.settings.service || o_order.settings.serviceBuilder();
if(!o_order.settings.service.initialized){
    o_order.settings.service.init();
    o_order.settings.service.initialized = true;
}
