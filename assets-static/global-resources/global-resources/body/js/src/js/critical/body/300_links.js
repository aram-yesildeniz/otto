window.o_global = window.o_global || {};
window.o_util = window.o_util || {};

o_global.links = o_global.links || (function () {
    "use strict";

    var extraParam = (function () {
        var DATA_EXTRA_PARAM = "data-extra-param";

        /**
         * Init function
         *
         * @private
         */
        function _init() {
            o_util.event.delegate(document, "mousedown", ".js_hasExtraParam", function () {
                var url = this.getAttribute("href"),
                    extraParam = this.getAttribute(DATA_EXTRA_PARAM);

                if (extraParam) {
                    this.setAttribute("href", o_util.fragment.push(extraParam, url));
                }
            });
        }

        return {
            "init": _init
        };
    }()),
        /*
         * Link Masking
         *
         * Diese JavaScript Funktion löst maskierte Links für Touch und nicht Touch UI's auf.
         *
         * Der maskierte Link hat folgende Struktur:
         *
         * <span class="ub64e" data-ub64e="AWDOKAFJSEF">Link 1</span>
         *
         * Touch:
         * Bei Touch UI's wird gibt es kein mouseover, Deswegen wird der <span> bei touchstart in einen Link umgewandelt.
         *
         * Nicht Touch:
         * Hier wird der <span> beim mouseover einfach in einen Link umgewandelt.
         *
         * Das Link umwandeln:
         * Es werden alles CSS-Klassen (bis auf ub64e) übernommen.
         * Es wird das Attribut data-extra-param übernommen.
         * Das Attribut data-ub64e wird decodiert und als href an den Link geschrieben
         * Alles HTML innerhalb des spans wird innerhalb des a-Tags eingefügt.
         */
        masking = (function () {
            var CLASS_UB64E = "ub64e",
                fnWrapper = {};

            fnWrapper.realClick = function (link) {
                link.click();
            };

            fnWrapper.replaceLink = function () {
                var _self = this,
                    children = _self.childNodes,
                    attributes = _self.attributes,
                    classes = _self.getAttribute("class").split(" ").filter(function (value) {
                        return value.replace(/\s+/g, "").length !== 0;
                    }),
                    style = _self.getAttribute("style"),
                    target = _self.getAttribute("data-target"),
                    parent = _self.parentNode,
                    ub64d = window.atob(_self.getAttribute("data-" + CLASS_UB64E)),
                    link = document.createElement("a"),
                    i; // Iterator variable.

                // Copy all classes except ub64e
                for (var k = 0, length = classes.length; k < length; k++) {
                    if (classes[k] !== CLASS_UB64E) {
                        link.classList.add(classes[k]);
                    }
                }

                // Copy href
                link.setAttribute("href", ub64d);

                // Copy Inline styles & target if there are any
                style && link.setAttribute("style", style);
                target && link.setAttribute("target", target);
                if(target && target !== '_self'){
                    // https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#tabnabbing
                    link.setAttribute('rel','noopener noreferrer')
                }

                // Copy data attributes, except from data-ub64e
                for (i = 0; i < attributes.length; i++) {
                    if (attributes[i].name.indexOf("data-") !== -1 && attributes[i].name !== "data-ub64e") {
                        link.setAttribute(attributes[i].name, attributes[i].value);
                    }
                }

                // Copy Inner Elements
                // The exact same childNodes of the masked link have to be appended in the new link element,
                // otherwise the registered event handlers from other teams will stop working
                fnWrapper.moveChildren(_self, _self.childNodes, link)

                /*
                    This is necessary for a behaviour change in iOS 13.
                    Since then, touchstart events take place on the original element
                    and end on the replaced link. Except click events,
                    those are not overwritten/inherited so we have to trigger this manually,
                    if there were no touchmove events in between.

                    @see ECITSUP-4428
                 */
                {
                    function removeEventListener(element) {
                        element.removeEventListener("touchmove", onTouchMove);
                        element.removeEventListener("touchend", onTouchEnd);
                    }

                    function onTouchMove() {
                        removeEventListener(this);
                    }

                    function onTouchEnd(e) {
                        o_util.event.stop(e);
                        removeEventListener(this);
                        this.click();
                    }

                    link.addEventListener("touchmove", onTouchMove);
                    link.addEventListener("touchend", onTouchEnd);
                }

                parent.replaceChild(link, _self);

                return link;
            };

            fnWrapper.getReal = function (link) {
                if (link.classList.contains(CLASS_UB64E)) {
                    link = fnWrapper.replaceLink.call(link);
                }

                return link;
            };

            fnWrapper.moveChildren = function (from, children, to) {
                while (children.length > 0) {
                    var child = from.removeChild(children[0]);
                    to.appendChild(child);
                }
            }

            fnWrapper.init = function () {
                for (
                    var i = 0, els = document.querySelectorAll("." + CLASS_UB64E);
                    i < els.length;
                    i += 1
                ) {
                    var e = els[i];

                    // This fixes bug on mobile firefox and safari on links
                    // which do not have nested elements. These are needed on those
                    // Browsers to create bubbling onTouchEnd so touch click can be completed
                    if (e.children.length === 0) {
                        var span = document.createElement("span");
                        span.setAttribute("style", "all: unset;");
                        fnWrapper.moveChildren(e, e.childNodes, span);
                        e.appendChild(span);
                    }
                }

                o_util.event.delegate(document, "touchstart", "." + CLASS_UB64E, function () {
                    fnWrapper.replaceLink.call(this);
                }, true);

                o_util.event.delegate(document, "mouseover", "." + CLASS_UB64E, function () {
                    fnWrapper.replaceLink.call(this);
                });

                o_util.event.delegate(document, "ub64e", "." + CLASS_UB64E + ", a", function () {
                    var _self = this;

                    if (this.classList.contains(CLASS_UB64E)) {
                        _self = fnWrapper.replaceLink.call(this);
                    }

                    o_global.links.masking.realClick(_self);
                });
            };

            return {
                "init": fnWrapper.init,
                "realClick": fnWrapper.realClick,
                "getReal": fnWrapper.getReal
            };
        }());

    o_global.eventLoader.onReady(1, function () {
        masking.init();
        extraParam.init();
    });

    return {
        "extraParam": extraParam,
        "masking": masking
    };
}());
