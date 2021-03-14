var o_wishlist = window.o_wishlist || {};

o_wishlist.messages = o_wishlist.messages || {};

o_wishlist.messages.render = function (message) {
  this.renderWithTimeout(message, 3000);
};

o_wishlist.messages.renderWithTimeout = function (message, timeout) {

  var msgContainer = document.querySelector(message.contentContainerSelector);

  function addClasses(msg) {
    msg.classList.add('wl_message');
    if (message.containerClasses) {
      msg.classList.add.apply(msg.classList, message.containerClasses.split(" "));
    }
  }

  function addContent(msg) {
    var content = document.createElement('span');
    content.classList.add('wl_message__content');
    content.innerHTML = message.content;
    msg.appendChild(content);
  }

  function addCloseButton(msg) {
    if (message.status === o_wishlist.messages.status.SUCCESS) {
      var closeButton = document.createElement('button');
      closeButton.classList.add('p_message__button');
      closeButton.innerHTML = 'x';
      closeButton.addEventListener("click", removeMessage);
      msg.appendChild(closeButton);
    }
  }

  function addFadeOut(msg) {
    if (message.status === o_wishlist.messages.status.SUCCESS) {
      setTimeout(function () {
        o_util.animation.fadeOut(msg, removeMessage);
      }, timeout);
    }
  }

  function removeMessage() {
    msgContainer.style.display = 'none';
    if (message.displayCallback !== undefined) {
      message.displayCallback();
    }
  }

  if (msgContainer) {
    var msg = document.createElement('div');
    addClasses(msg);
    addCloseButton(msg);
    addContent(msg);
    addFadeOut(msg);

    msgContainer.innerHTML = '';
    msgContainer.appendChild(msg);
    msgContainer.style.display = "block";

    if (o_wishlist.wishlist && o_wishlist.wishlist.refresh) {
      o_wishlist.wishlist.refresh();
    }
  }

};
