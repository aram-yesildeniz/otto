var o_order = window.o_order || {};
o_order.eastereggs = o_order.eastereggs || {};
o_order.eastereggs.l33t = o_order.eastereggs.l33t || function () {
    'use strict';

    function setFont() {
        var styles = document.createElement("link");
        styles.setAttribute('href', '//fonts.googleapis.com/css?family=PT+Mono');
        styles.setAttribute('rel', 'stylesheet');
        document.querySelector('head').innerHTML += styles;

        var elements = document.querySelector('body').getElementsByTagName("*");
        for (var element in elements) {
            if (element.hasOwnProperty("style")) {
                element.style.fontFamily = 'PT Mono';
                element.style.textRendering = 'optimizeLegibility';
                element.style.mozFontFeatureSettings = 'dlig=1';
            }
        }
    }

    function stringTol33t(aString) {
        return aString.replace(/(\S)l/g, '$1L')
            .replace(/(\S)l/g, '$1L') // Twice to catch "LL"
            .replace(/a/gi, '4')
            .replace(/Ä/g, 'Æ')
            .replace(/ä/g, 'æ')
            .replace(/e/gi, '3')
            .replace(/i/gi, '1')
            .replace(/o/gi, '0')
            .replace(/ö/gi, 'Ø')
            .replace(/U/g, 'u')
            .replace(/ü/gi, 'Y')
            .replace(/s\b/gi, 'z')
            .replace(/s/gi, '$')
            .replace(/f+/g, 'ph')
            .replace(/F/g, 'Ph')
            .replace(/r/g, 'R');
    }

    function adjustAllWithin(element) {
        var child;
        for (child = element.firstChild; child !== null; child = child.nextSibling) {
            if (child.nodeType === 3) {
                child.nodeValue = stringTol33t(child.nodeValue);
            } else if (child.nodeType === 1) {
                adjustAllWithin(child);
            }
        }
    }

    setFont();
    adjustAllWithin(document.body);
};

(function () {
    'use strict';
    var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        konami_index = 0,
        handler = function (e) {
            if (e.keyCode === konami_keys[konami_index]) {
                konami_index += 1;
                if (konami_index === konami_keys.length) {
                    o_order.eastereggs.l33t();
                    document.removeEventListener("keydown", handler);
                }
            } else {
                konami_index = 0;
            }
        };
    if (!o_order.eastereggs.l33t.initialized) {
        document.addEventListener("keydown", handler);
        o_order.eastereggs.l33t.initialized = true;
    }
}());
