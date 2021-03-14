o_global.eventLoader.onAllScriptsExecuted(4, function () {
    "use strict";
    if (!o_user.loginareaInitialized) {
        o_user.loginareaInitialized = true;
        o_user.loginarea.view = o_user.loginarea.viewBuilder(window, document);
        o_user.loginarea.presenter = o_user.loginarea.presenterBuilder(o_user.loginarea.view, o_util.event);
        o_user.loginarea.presenter.init();
    }
});
