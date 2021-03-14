/*jslint nomen: true */
/* globals document, navigator */
var o_global = o_global || {};

o_global.pali = o_global.pali || {};
o_global.pali.androidSelectBoxFix = o_global.pali.androidSelectBoxFix || (function() {
        "use strict";

        /**
         * Workaround for old Android Stock browser that cannot handle non-white background
         * or round borders and ignores pretty much everything else
         */
        function androidSelectBoxFix() {
            var nua = navigator.userAgent,
                isAndroid = (nua.indexOf("Mozilla/5.0") > -1 && nua.indexOf("Android ") > -1 && nua.indexOf("AppleWebKit") > -1 && nua.indexOf("Chrome") === -1);

            if (isAndroid) {
                var selectFields = document.getElementsByClassName("p_form__select");

                for (var i = selectFields.length - 1; i >= 0; --i) {
                    var reg = new RegExp("p_form__select", "g");

                    selectFields[i].className = selectFields[i].className.replace(reg, "p_form__select--androidworkaround");
                }
            }
        }

        /**
         * Workaround for iOS forcing the browser to show :active css-states for elements
         */
        function iosActiveStateFix() {
            document.addEventListener("touchstart", function() {
            });
        }

        o_global.eventLoader.onReady(100, function() {
            iosActiveStateFix();
            androidSelectBoxFix();
        });

        return {
            "androidSelectBoxFix": androidSelectBoxFix
        };
    })();
