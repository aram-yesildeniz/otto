var o_order = window.o_order || {};
o_order.MiniBasket = function () {
    this.amountElement = document.querySelector(".order_js_minibasket_amount"), this.storage = new o_global.Storage(window.localStorage), this.storageKey = "or_miniBasketAmount";
    var e = this.update.bind(this);
    o_order.common.basketChange.onBasketChange(e), window.addEventListener("storage", function (e) {
        if (e.key === this.storageKey) {
            var t = this.parseStorageData(e.newValue);
            void 0 !== t && this.renderAmount(t);
        }
    }.bind(this)), o_global.eventQBus.on("ft1.order-core.cleanMiniBasketAmountStorage", function () {
        this.cleanStorage();
    }.bind(this)), this.amountElement && (this.linkElement = document.querySelector(".order_js_minibasket_link"), this.failSafeSendMergeToTrackingServer()), window.setTimeout(function () {
        e();
    }, 10);
}, o_order.MiniBasket.getVid = function () {
    return o_util.cookie.get("visitorId");
}, o_order.MiniBasket.isLoggedIn = function () {
    try {
        return o_user.loginState.presenter.isLoggedIn();
    } catch (e) {
        return !1;
    }
}, o_order.MiniBasket.prototype.failSafeSendMergeToTrackingServer = function () {
    var e = o_order.orderConfirmation ? 0 : this.getAmount();
    o_order.trackingWrapper.failSafeSendMergeToTrackingServer({
        order_BasketItems: e
    });
}, o_order.MiniBasket.prototype.saveToStorage = function (e) {
    var t = {
        amount: e,
        vid: o_order.MiniBasket.getVid(),
        expire: new Date().getTime() + 3e5,
        loggedIn: o_order.MiniBasket.isLoggedIn()
    };
    return this.storage && this.storage.setItem(this.storageKey, JSON.stringify(t)), e;
}, o_order.MiniBasket.prototype.cleanStorage = function () {
    this.storage && this.storage.removeItem(this.storageKey);
}, o_order.MiniBasket.prototype.parseStorageData = function (e) {
    try {
        var t = JSON.parse(e);
        return t && t.expire > new Date().getTime() && t.vid === o_order.MiniBasket.getVid() && t.loggedIn === o_order.MiniBasket.isLoggedIn() ? t.amount : void 0;
    } catch (e) {
        return;
    }
}, o_order.MiniBasket.prototype.checkStorage = function (e) {
    if (!e) return this.parseStorageData(this.storage.getItem(this.storageKey));
}, o_order.MiniBasket.prototype.checkHtml = function () {
    var e = document.getElementsByClassName("or_js_miniBasketAmount");
    if (e.length) {
        var t = Number(e[0].getAttribute("data-minibasketamount"));
        if (!isNaN(t)) return this.saveToStorage(t);
    }
}, o_order.MiniBasket.initOne = function () {
    o_order.MiniBasket.instance || (o_order.MiniBasket.instance = new o_order.MiniBasket());
}, o_order.MiniBasket.prototype.getAmount = function (e) {
    return this.checkHtml() || this.checkStorage(e);
}, o_order.MiniBasket.prototype.update = function (e) {
    var t = this.getAmount(e);
    void 0 !== t ? this.renderAmount(t) : this.amountElement && this.loadAmount().then(this.saveToStorage.bind(this)).then(this.renderAmount.bind(this));
}, o_order.MiniBasket.prototype.loadAmount = function () {
    var e = this.amountElement.getAttribute("data-loadurl");
    return o_util.ajax.getJSON(e).then(function (e) {
        switch (e.status) {
            case 200:
                return e.responseJSON.amount;
            default:
                return 0;
        }
    });
}, o_order.MiniBasket.prototype.renderAmount = function (e) {
    this.amountElement && (this.setAmount(e), this.updateTrackingJSON(e));
}, o_order.MiniBasket.prototype.setAmount = function (e) {
    this.amountElement.innerHTML = e, e > 0 ? this.amountElement.classList.remove("or_minis__badge--empty") : this.amountElement.classList.add("or_minis__badge--empty");
}, o_order.MiniBasket.prototype.updateTrackingJSON = function (e) {
    var t = this.linkElement.getAttribute("data-ts-link"),
        o = JSON.parse(t);
    o.order_MiniBasket = e, this.linkElement.setAttribute("data-ts-link", JSON.stringify(o));
}, o_global.eventLoader.onLoad(50, o_order.MiniBasket.initOne); //# sourceMappingURL=/order/statics/ft1.order-core.minibasket.95d21f5b.js.map