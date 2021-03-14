var o_wishlist = window.o_wishlist || {};

o_wishlist.messages = o_wishlist.messages || {};
o_wishlist.messages.status = o_wishlist.messages.status || {};

o_wishlist.messages.status.SUCCESS = 'success';
o_wishlist.messages.status.ERROR = 'error';
o_wishlist.messages.status.INFO = 'info';

o_wishlist.messages.Message = function (status, content, contentContainerSelector, containerClasses, displayCallback) {
    this.status = status;
    this.content = content;
    this.contentContainerSelector = contentContainerSelector;
    this.containerClasses = containerClasses;
    this.displayCallback = displayCallback;
};

o_wishlist.messages.Message.fromJSON = function (jsonMsg) {
    return new o_wishlist.messages.Message(jsonMsg.status, jsonMsg.content, jsonMsg.contentContainerSelector, jsonMsg.containerClasses, jsonMsg.displayCallback);
};

o_wishlist.messages.Message.createWishlistCreatedMessage = function (content, status) {
    return new o_wishlist.messages.Message(
        status,
        content,
        status === o_wishlist.messages.status.SUCCESS
            ? '.wl_js_wishlistCreatedMessage'
            : '.wl_js_addWishlistForm__errorMessage',
        status === o_wishlist.messages.status.SUCCESS
            ? 'p_message p_message--success wl_wishlistCreatedMessage'
            : 'p_font100 wl_addWishlistForm__errorMessage'
    );
};

o_wishlist.messages.Message.createWishlistDeletedMessage = function (content, status) {
    return new o_wishlist.messages.Message(
        status,
        content,
        '.wl_js_wishlistDeletedMessage',
        status === o_wishlist.messages.status.SUCCESS
            ? 'p_message p_message--success wl_wishlistDeletedMessage'
            : 'p_message p_message--error wl_wishlistDeletedMessage'
    );
};

o_wishlist.messages.Message.createWishlistRenamedMessage = function (content, status) {
    return new o_wishlist.messages.Message(
        status,
        content,
        status === o_wishlist.messages.status.SUCCESS
            ? '.wl_js_wishlistRenamedMessage'
            : '.wl_js_renameWishlistForm__errorMessage',
        status === o_wishlist.messages.status.SUCCESS
            ? 'p_message p_message--success wl_wishlistRenamedMessage'
            : 'p_font100 wl_renameWishlistForm__errorMessage'
    );
};

o_wishlist.messages.Message.createWishlistMovedMessage = function (content, status, variationId, displayCallback) {
    return new o_wishlist.messages.Message(
        status,
        content,
        status === o_wishlist.messages.status.SUCCESS
            ? '.wl_js_item[data-variationid="' + variationId + '"] .wl_item__contentContainer'
            : '.wl_js_item[data-variationid="' + variationId + '"] .wl_ItemMovedErrorMessage',
        status === o_wishlist.messages.status.SUCCESS
            ? 'p_message p_message--success wl_itemMovedSuccessMessage'
            : '',
        displayCallback !== undefined
            ? displayCallback
            : function() {}
    );
};

o_wishlist.messages.Message.createWishlistItemDeletedMessage = function (content, status, variationId) {
    return new o_wishlist.messages.Message(
        status,
        content,
        '.wl_js_item[data-variationid="' + variationId + '"] .wl_ItemMovedErrorMessage',
        'p_message p_message--error'
    );
};

o_wishlist.messages.Message.createItemNoteMessage = function (content, variationId) {
    return new o_wishlist.messages.Message(
        o_wishlist.messages.status.ERROR,
        content,
        '.wl_js_item[data-variationid="' + variationId + '"] .wl_js_addNoteForm__errorMessage',
        'wl_addNoteForm__errorMessage'
    );
};

o_wishlist.messages.Message.createItemMessage = function (content, status, variationId) {
    function classForStatus(status) { // eslint-disable-line no-shadow
        switch (status) {
            case o_wishlist.messages.status.SUCCESS:
                return 'p_message p_message--success wl_item__message';
            case o_wishlist.messages.status.ERROR:
            default:
                return 'p_message p_message--error wl_item__message';
        }
    }

    return new o_wishlist.messages.Message(
        status,
        content,
        '.wl_js_item[data-variationid="' + variationId + '"] .wl_js_itemMessage',
        classForStatus(status),
        o_wishlist.wishlist.refresh.bind(o_wishlist.wishlist)
    );
};