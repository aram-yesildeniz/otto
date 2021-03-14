var o_wishlist = window.o_wishlist || {};

o_wishlist.Toggles = (function () {
    var togglesFunction = {};
    var toggles = [];

    togglesFunction.enabled = function enabled(toggle) {
        return toggles.indexOf(toggle) > -1;
    };

    togglesFunction.update = function () {
        var toggleElement = document.querySelector('.wl_toggles');
        if (toggleElement) {
            toggles = (toggleElement.getAttribute("data-toggles") || "").split(",");
        } else {
            toggles = [];
        }
    };

    togglesFunction.update();
    return togglesFunction;
}());