const attachClickListener = (addToBasket) => {
    document.querySelectorAll('.reco_cinema__add-to-basket').forEach(button => {
        button.addEventListener('click', () => addToBasket(button.parentNode.parentNode.getAttribute('data-variation-id')))
    });
}

const getSourceVariationId = () =>{
    return document.querySelector(`[data-source-variation-id]`).getAttribute('data-source-variation-id')
}

const getSourceArticleNumber = () =>{
    return document.querySelector(`[data-source-article-number]`).getAttribute('data-source-article-number')
}

const getPromoSource = (variationId) =>{
    const dataTracking = document.querySelector(`[data-variation-id="${variationId}"]`).getAttribute('data-tracking');
    return JSON.parse(dataTracking).promo_Source;
}


const addErrorMessageToCinema = () =>{
    getErrorMessageDiv().style.display = 'block'
}

const updateButtonOnSuccess = (variationId) => {
    updateAddToBasketButtonOnSuccess(variationId);
    updateSuccessMessageButton(variationId);

}

const updateAddToBasketButtonOnSuccess = (variationId) => {
    let button = getAddToBasketButtonForVariationId(variationId);
    button.classList.add('p_animation__fadeOut');
    button.style.display = 'none';
}

const updateSuccessMessageButton = (variationId) => {
    let button = getSuccessButtonForVariationId(variationId);
    button.classList.add('p_animation__fadeIn')
    button.classList.remove('p_animation__initialHidden')
}

const getAddToBasketButtonForVariationId = (variationId) => {
    return document.querySelector(`[data-variation-id="${variationId}"] .reco_cinema__add-to-basket`);
}

const getSuccessButtonForVariationId = (variationId) => {
    return document.querySelector(`[data-variation-id="${variationId}"] .reco_cinema__add-to-basket-success`);
}

const getErrorMessageDiv = () => {
    return document.querySelector('.reco_basket_layer_cinema .reco_cinema__add-to-basket-error');
}




module.exports =  {
    getAddToBasketButtonForVariationId,
    updateAddToBasketButtonOnSuccess,
    updateSuccessMessageButton,
    getSuccessButtonForVariationId,
    addErrorMessageToCinema,
    updateButtonOnSuccess,
    attachClickListener,
    getSourceVariationId,
    getSourceArticleNumber,
    getPromoSource
}
