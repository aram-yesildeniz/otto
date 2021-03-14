// For JSLINT
/*global navigator, console, document
 */
var o_user = o_user || {},
    lhotse = lhotse || {};
o_user.common = o_user.common || {};
o_user.common.login = o_user.common.login || {};
o_user.common.loginArea = o_user.common.loginArea || {};

o_user.common.login.getPerformanceMarketingData = function () {
    'use strict';
    var data = {},
        section;

    section = document.querySelector(".exactag.userLoginPM");
    data.pt = !!section ? section.getAttribute("data-pt") : undefined;

    return data;
};

o_user.common.performanceMarketingCallback = function () {
    'use strict';

    try {
        lhotse.exactag.register("userLoginPM", o_user.common.login.getPerformanceMarketingData);
    } catch (e) {
        console.log(e);
    }
};

