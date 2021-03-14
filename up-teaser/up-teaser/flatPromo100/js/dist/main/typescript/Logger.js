var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.error = function (message) {
        var _a;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if ((_a = Logger.debug) === null || _a === void 0 ? void 0 : _a.status().activated) {
            console.error(message, optionalParams);
        }
    };
    Logger.info = function (message) {
        var _a;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if ((_a = Logger.debug) === null || _a === void 0 ? void 0 : _a.status().activated) {
            console.info(message, optionalParams);
        }
    };
    Logger.warn = function (message) {
        var _a;
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if ((_a = Logger.debug) === null || _a === void 0 ? void 0 : _a.status().activated) {
            console.warn(message, optionalParams);
        }
    };
    var _a;
    Logger.debug = (_a = window.o_global) === null || _a === void 0 ? void 0 : _a.debug;
    return Logger;
}());
export { Logger };
//# sourceMappingURL=Logger.js.map