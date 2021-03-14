// For JSLINT
/*global document, window, o_global
 */

var o_user = o_user || {};

o_user.microdata = o_user.microdata || {};

o_user.microdata.Parser = function () {
    "use strict";

    function readProperty(container, property, itemType) {
        var elements = container.querySelectorAll("[itemprop='" + property + "']"),
            result;

        Array.prototype.forEach.call(elements, function (element) {
            if (element.closest("[itemscope][itemtype]").getAttribute("itemtype") === itemType) {
                if (element.tagName === "META") {
                    result = element.getAttribute("content");
                } else {
                    result = element.textContent;
                }
            }
        });

        return result;
    }

    function readAdditionalProperty(container, property, itemType) {
        var elements = container.querySelectorAll("[itemscope][itemprop='additionalProperty'][itemtype='http://schema.org/PropertyValue']"),
            result;

        Array.prototype.forEach.call(elements, function (element) {
            var closest = element.parentNode.closest("[itemscope][itemtype]");
            if (closest.getAttribute("itemtype") === itemType) {
                if (readProperty(element, "name", "http://schema.org/PropertyValue") === property) {
                    result = readProperty(element, "value", "http://schema.org/PropertyValue");
                }
            }
        });

        return result;
    }

    function parseProductData(product) {
        if (!!product) {
            return {
                name: readProperty(product, "name", "http://schema.org/Product"),
                sku: readProperty(product, "sku", "http://schema.org/Product"),
                promotion: readAdditionalProperty(product, "promotion", "http://schema.org/Product"),
                variationID: readAdditionalProperty(product, "variationId", "http://schema.org/Product"),
                consultingService: readAdditionalProperty(product, "consultingService", "http://schema.org/Product"),
                serviceDetails: readAdditionalProperty(product, "serviceDetails", "http://schema.org/Product")
            };
        }

        return {};
    }

    return {
        parseProductData: parseProductData
    };
};