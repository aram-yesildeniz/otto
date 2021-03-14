const addOnBasketDom =  require('./addOnCinemaDom.js');

const addToBasket = (variationId) => {
     window.o_global.eventQBus.emit('ft1.order-core.addToBasket', {
          'variationId': variationId,
          quantity: 1,
          itemOrigin: "wkbl",
          tracking: {
               promo_OriginalA2BArticle: `${addOnBasketDom.getSourceVariationId()}∞${addOnBasketDom.getSourceArticleNumber()}`,
               promo_TeslaSource: addOnBasketDom.getPromoSource(variationId)
          }
     });
};

const initEventBusListener = () => {
     window.o_global.eventQBus.on('ft1.order-core.addToBasketResult', event => {
          if (event.successful) {
               updateRecoWithSuccessMessage(event);
          } else  {
               updateCinemaWithErrorMessage();
          }
     });
};

const addEventListenerToButtons = () => {
     addOnBasketDom.attachClickListener(addToBasket)
};

const initAddToBasket = () => {
     initEventBusListener();
     addEventListenerToButtons();
}

function updateCinemaWithErrorMessage() {
     addOnBasketDom.addErrorMessageToCinema();
}

function updateRecoWithSuccessMessage(event) {
     addOnBasketDom.updateButtonOnSuccess(event.variationId)
}

module.exports = {initAddToBasket};
