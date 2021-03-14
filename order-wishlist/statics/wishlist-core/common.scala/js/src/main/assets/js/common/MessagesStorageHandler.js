var o_wishlist = window.o_wishlist || {};

o_wishlist.messages = o_wishlist.messages || {};

o_wishlist.messages.MessageStorageHandler = function () {
    this.messagesKey = "notificationMessages";

    this.storage = new o_global.Storage(window.sessionStorage);
};

o_wishlist.messages.MessageStorageHandler.prototype.save = function (msg) {
    if (msg instanceof o_wishlist.messages.Message) {
        var allMsgs = this.readAll() || [];
        allMsgs.push(msg);
        this.storage.setItem(this.messagesKey, JSON.stringify(allMsgs));
    }
};

o_wishlist.messages.MessageStorageHandler.prototype.readAll = function () {
    var messagesString = this.storage.getItem(this.messagesKey);
    var messages;
    if (messagesString) {
        try {
            var messagesJson = JSON.parse(messagesString);

            messages = messagesJson.map(function (msgJson) {
                return o_wishlist.messages.Message.fromJSON(msgJson)
            });

        } catch (e) {
          if(o_global.debug.status().activated) {
            console.error(e);
          }
        }
    }
    return messages ? messages : [];
};

o_wishlist.messages.MessageStorageHandler.prototype.renderAllInStorage = function () {
    this.readAll().forEach(function (msg) {
        o_wishlist.messages.render(msg)
    });
    this.storage.removeItem(this.messagesKey);
};

o_wishlist.messages.storageHandler = new o_wishlist.messages.MessageStorageHandler();