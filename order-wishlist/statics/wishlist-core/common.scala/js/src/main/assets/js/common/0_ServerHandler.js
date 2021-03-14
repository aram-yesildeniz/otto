var o_wishlist = window.o_wishlist || {};

o_wishlist.serverHandler = o_wishlist.serverHandler || {};

o_wishlist.serverHandler.ServerHandler = function () {
};

o_wishlist.serverHandler.ServerHandler.prototype.handleForbidden = function (responseText) {
  try {
    var jsonResponse = JSON.parse(responseText);
    o_wishlist.server.wishlist.redirectTo(jsonResponse.redirect);
  } catch (e) {
    if (o_global.debug.status().activated) {
      console.error(e);
    }
  }
};

o_wishlist.serverHandler.ServerHandler.prototype.handleStatus = function (status, responseText) { // eslint-disable-line no-unused-vars
  //abstract
};

o_wishlist.serverHandler.ServerHandler.prototype.getErrorMsgFromResponseText = function (responseText) {
  var errorText;
  try {
    var errorResponse = JSON.parse(responseText);
    errorText = errorResponse.errorMsg
  } catch (err) {
    //ignore
  }
  return errorText || "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.";
};

o_wishlist.serverHandler.ServerHandler.prototype.handleResponse = function (responsePromise) {
  var _this = this;
  responsePromise.then(function (xhr) {
    _this.handleStatus(xhr.status === 1223 ? 204 : xhr.status, xhr.responseText)
  });
};

o_wishlist.requestHandler = new o_wishlist.serverHandler.ServerHandler();

