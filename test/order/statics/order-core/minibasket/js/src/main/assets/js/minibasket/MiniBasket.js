var o_order = window.o_order || {};

o_order.MiniBasket = function () {
  this.amountElement = document.querySelector('.order_js_minibasket_amount');
  this.storage = new o_global.Storage(window.localStorage);
  this.storageKey = "or_miniBasketAmount";
  var updateAmountFunction = this.update.bind(this);
  o_order.common.basketChange.onBasketChange(updateAmountFunction);

  window.addEventListener("storage", function (e) {
    if (e.key === this.storageKey) {
      var amount = this.parseStorageData(e.newValue);
      if (amount !== undefined) {
        this.renderAmount(amount);
      }
    }
  }.bind(this));

  o_global.eventQBus.on("ft1.order-core.cleanMiniBasketAmountStorage", function() {
    this.cleanStorage();
  }.bind(this));

  if (this.amountElement) {
    this.linkElement = document.querySelector('.order_js_minibasket_link');
    this.failSafeSendMergeToTrackingServer();
  }

  // alway update the amount on initialisation - even if there is no mini basket element present
  window.setTimeout(function () {
    updateAmountFunction();
  }, 10);
};

o_order.MiniBasket.getVid = function () {
  return o_util.cookie.get("visitorId");
};

o_order.MiniBasket.isLoggedIn = function () {
  try {
    return o_user.loginState.presenter.isLoggedIn();
  } catch (e) {
    return false;
  }
};

o_order.MiniBasket.prototype.failSafeSendMergeToTrackingServer = function () {
  //always track 0 on bbs, because getAmount uses local storage which is not already reset by basket.changed event on bbs page load
  var amount = !!o_order.orderConfirmation ? 0 : this.getAmount();
  o_order.trackingWrapper.failSafeSendMergeToTrackingServer({'order_BasketItems': amount});
};

o_order.MiniBasket.prototype.saveToStorage = function (amount) {
  var data = {
    amount: amount,
    vid: o_order.MiniBasket.getVid(),
    expire: new Date().getTime() + 300000,
    loggedIn: o_order.MiniBasket.isLoggedIn()
  };
  this.storage && this.storage.setItem(this.storageKey, JSON.stringify(data));
  return amount;
};

o_order.MiniBasket.prototype.cleanStorage = function () {
   this.storage && this.storage.removeItem(this.storageKey);
};

o_order.MiniBasket.prototype.parseStorageData = function (dataString) {
  try {
    var data = JSON.parse(dataString);
    if (data &&
      data.expire > new Date().getTime() &&
      data.vid === o_order.MiniBasket.getVid() &&
      data.loggedIn === o_order.MiniBasket.isLoggedIn()) {
      return data.amount;
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

o_order.MiniBasket.prototype.checkStorage = function (maybeEvent) {
  if (!maybeEvent) {
    return this.parseStorageData(this.storage.getItem(this.storageKey));
  }
  return undefined;
};

o_order.MiniBasket.prototype.checkHtml = function () {
  var maybeAmountElements = document.getElementsByClassName("or_js_miniBasketAmount");

  if (maybeAmountElements.length) {
    var amount = Number(maybeAmountElements[0].getAttribute("data-minibasketamount"));
    if (!isNaN(amount)) {
      return this.saveToStorage(amount);
    }
  }
  return undefined;
};

o_order.MiniBasket.initOne = function () {
  if (!o_order.MiniBasket.instance) {
    o_order.MiniBasket.instance = new o_order.MiniBasket();
  }
};

o_order.MiniBasket.prototype.getAmount = function (maybeEvent) {
  return this.checkHtml() || this.checkStorage(maybeEvent);
};

o_order.MiniBasket.prototype.update = function (maybeEvent) {
  var amount = this.getAmount(maybeEvent);
  if (amount !== undefined) {
    this.renderAmount(amount);
  } else {
    if (this.amountElement) {
      this.loadAmount()
        .then(this.saveToStorage.bind(this))
        .then(this.renderAmount.bind(this));
    }
  }
};

o_order.MiniBasket.prototype.loadAmount = function () {
  var url = this.amountElement.getAttribute("data-loadurl");
  return o_util.ajax.getJSON(url).then(function (xhr) {
    switch (xhr.status) {
      case 200:
        return xhr.responseJSON.amount;
      default:
        return 0;
    }
  });
};

o_order.MiniBasket.prototype.renderAmount = function (amount) {
  if (this.amountElement) {
    this.setAmount(amount);
    this.updateTrackingJSON(amount);
  }
};

o_order.MiniBasket.prototype.setAmount = function (amount) {
  var emptyClass = 'or_minis__badge--empty';
  this.amountElement.innerHTML = amount;
  if (amount > 0) {
    this.amountElement.classList.remove(emptyClass);
  } else {
    this.amountElement.classList.add(emptyClass);
  }
};

o_order.MiniBasket.prototype.updateTrackingJSON = function (amount) {
  var trackingString = this.linkElement.getAttribute("data-ts-link");
  var trackingJSON = JSON.parse(trackingString);
  trackingJSON.order_MiniBasket = amount;
  this.linkElement.setAttribute("data-ts-link", JSON.stringify(trackingJSON));
};

o_global.eventLoader.onLoad(50, o_order.MiniBasket.initOne);
