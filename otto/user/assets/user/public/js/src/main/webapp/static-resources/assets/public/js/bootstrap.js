o_global.eventLoader.onAllScriptsExecuted(1, function () {
    'use strict';
    var USER_ONLINE_VALIDATION_SELECTOR = ".us_js_onlineValidation",
        USER_P_FORM_GROUP_CONSTANTS = {
            P_FORM_MESSAGE: "p_form__message",
            P_FORM_GROUP_MESSAGE: "p_formGroup__message",
            P_FORM_GROUP_ROW: "p_formGroup__row"
        };

    if (!o_user.buttonInitialized) {
        o_user.buttonInitialized = true;
        o_user.common.button.view = o_user.common.button.viewBuilder();
        o_user.common.button.presenter = o_user.common.button.presenterBuilder(document, o_user.common.button.view, o_util.event);
        o_user.common.button.presenter.init();
    }

    if (!o_user.layerInitialized) {
        o_user.layerInitialized = true;
        o_user.common.layer.rwd.service = o_user.common.layer.rwd.serviceBuilder(window, o_util.ajax);
        o_user.common.layer.rwd.view = o_user.common.layer.rwd.viewBuilder(window, document, o_global.pali.layer);
        o_user.common.layer.rwd.presenter = o_user.common.layer.rwd.presenterBuilder(
            document,
            o_user.common.layer.rwd.view,
            o_user.common.layer.rwd.service,
            o_user.common.button.view,
            o_util.event
        );
        o_user.common.layer.rwd.presenter.init();
    }

    if (!o_user.trackingEventHandlerInitialized) {
        o_user.trackingEventHandlerInitialized = true;
        o_user.tracking = o_user.trackingBuilder(document, function () {
            return o_tracking.bct;
        }, o_util.ajax, o_util.event);
        o_user.tracking.init();
    }

    if (!o_user.commonInitialized) {
        o_user.commonInitialized = true;
        o_user.common.eventHandler = o_user.common.eventHandlerBuilder(window, document, function () {
            return o_tracking.bct;
        }, o_global.eventLoader, o_util.ajax, o_util.core);
        o_user.common.eventHandler.initLoadEsiAjax();
        o_user.common.tools = o_user.common.toolsBuilder(document);
        o_user.common.tools.setAutoFocus();
    }

    if (!o_user.inputLengthInitialized) {
        o_user.inputLengthInitialized = true;
        o_user.counter.inputLength = o_user.counter.inputLengthBuilder(document, o_util.event);
        o_user.counter.inputLength.init();
    }

    if (!o_user.onlinevalidationInitialized) {
        o_user.onlinevalidationInitialized = true;
        o_user.onlinevalidationtooltip.service = o_user.onlinevalidationtooltip.serviceBuilder(o_util.ajax);
        o_user.onlinevalidationtooltip.rwd.passwordTooltip.view = o_user.onlinevalidationtooltip.rwd.passwordTooltip.viewBuilder(USER_P_FORM_GROUP_CONSTANTS);
        o_user.onlinevalidationtooltip.rwd.standardTooltip.view = o_user.onlinevalidationtooltip.rwd.standardTooltip.viewBuilder(document, USER_P_FORM_GROUP_CONSTANTS);
        o_user.onlinevalidationtooltip.rwd.view = o_user.onlinevalidationtooltip.rwd.viewBuilder(window, document, USER_ONLINE_VALIDATION_SELECTOR, USER_P_FORM_GROUP_CONSTANTS, o_user.onlinevalidationtooltip.rwd.passwordTooltip.view, o_user.onlinevalidationtooltip.rwd.standardTooltip.view);
        o_user.onlinevalidationtooltip.rwd.presenter = o_user.onlinevalidationtooltip.rwd.presenterBuilder(
            document,
            USER_ONLINE_VALIDATION_SELECTOR,
            o_user.onlinevalidationtooltip.service,
            o_user.onlinevalidationtooltip.rwd.view,
            o_user.typewatch.presenterBuilder,
            o_util.event
        );
        o_user.onlinevalidationtooltip.rwd.presenter.init();
    }

    if (!o_user.loginStateInitialized) {
        o_user.loginStateInitialized = true;
        o_user.loginState.presenter = o_user.loginState.presenterBuilder(document);
    }

    if (!o_user.addressChooserInitialized) {
        o_user.addressChooserInitialized = true;
        o_user.addressChooser.rwd.view = o_user.addressChooser.rwd.viewBuilder(document);
        o_user.addressChooser.rwd.presenter = o_user.addressChooser.rwd.presenterBuilder(
            document,
            o_user.addressChooser.rwd.view,
            o_user.tracking,
            o_util.event
        );
        o_user.addressChooser.rwd.presenter.init();
    }

    if (!o_user.performanceMarketingCallbackInitialized) {
        o_user.performanceMarketingCallbackInitialized = true;
        o_user.common.performanceMarketingCallback();
    }

    if (!o_user.customerServiceWidgetInitialized) {
        o_user.customerServiceWidgetInitialized = true;

        o_user.customerServiceWidget.localStorage = new o_global.Storage(window.localStorage);
        o_user.customerServiceWidget.sessionStorage = new o_global.Storage(window.sessionStorage);
        o_user.customerServiceWidget.persistence = o_user.customerServiceWidget.persistenceBuilder(o_user.customerServiceWidget.localStorage, o_user.customerServiceWidget.sessionStorage);
        o_user.customerServiceWidget.view = o_user.customerServiceWidget.viewBuilder(window, document, o_util.ajax);
        o_user.customerServiceWidget.presenter = o_user.customerServiceWidget.presenterBuilder(
            document,
            o_user.customerServiceWidget.view,
            o_user.customerServiceWidget.persistence,
            o_user.tracking,
            o_util,
            o_global.breakpoint,
            5000,
            1000
        );
        o_user.customerServiceWidget.presenter.init();
    }

    if (!o_user.benefitCardInitialized) {
        o_user.benefitCardInitialized = true;
        o_user.benefitCard.view = o_user.benefitCard.viewBuilder(window, document, o_user.tracking, o_global.device);
        o_user.benefitCard.presenter = o_user.benefitCard.presenterBuilder(o_user.benefitCard.view);
    }

    if (!o_user.manualUserLoginPostProcessingInitialized) {
        o_user.manualUserLoginPostProcessingInitialized = true;
        o_user.manualUserLoginPostProcessing = o_user.manualUserLoginPostProcessingBuilder(document, window);
    }

    if (!o_user.lostPasswordValidateEmailChangeBuilderInitialized) {
        o_user.lostPasswordValidateEmailChangeBuilderInitialized = true;
        o_user.lostPasswordValidateEmailChangeBuilder = o_user.lostPasswordValidateEmailChangeBuilder(window, document, o_user.tracking, o_util.event,
            o_user.common.button.view);
        o_user.lostPasswordValidateEmailChangeBuilder.init();
    }
});