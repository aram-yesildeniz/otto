var o_order = window.o_order || {};

o_order.firebaseBridge = o_order.firebaseBridge || {};

o_order.firebaseBridge.emitEvent = function (eventName, itemId, itemName, productBaseClass, quantity) {
  o_global.eventQBus.emit("ft-apps.firebase.eventTracking", {
    "event_name": eventName,
    "event_params": {
      "item_id": itemId,
      "item_name": itemName,
      "item_category": productBaseClass,
      "quantity": quantity
    }
  });
};

o_order.firebaseBridge.emitAddToBasketEvent = function (addToBasketData) {
  try {
    o_order.firebaseBridge.emitEvent("add_to_cart", addToBasketData.articleNumber, addToBasketData.itemName, addToBasketData.itemCategory, addToBasketData.addedQuantity);
  } catch (e) {
    if (o_global.debug.status().activated) {
      console.error(e);
    }
  }
};
