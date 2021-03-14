var o_order = window.o_order || {};
o_order.common = o_order.common || {};
o_order.common.basketChange = o_order.common.basketChange || {};

/**
 * Triggert das Event für eine Warenkorbaktualisierung.
 */
o_order.common.basketChange.triggerBasketChange = function () {
  document.dispatchEvent(new CustomEvent('basket.changed'));
};

/**
 * Registriert einen Callback für Warenkorbaktualisierungen.
 */
o_order.common.basketChange.onBasketChange = function (callback) {
  document.addEventListener("basket.changed", callback);
};

