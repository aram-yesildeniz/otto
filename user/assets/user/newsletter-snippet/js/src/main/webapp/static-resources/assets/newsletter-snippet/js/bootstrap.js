o_global.eventLoader.onAllScriptsExecuted(100, function () {
    'use strict';
    if (!o_user.newsletter.snippet.initialized) {
        o_user.newsletter.snippet.initialized = true;
        o_user.newsletter.snippet.service = o_user.newsletter.snippet.serviceBuilder(o_util.ajax);
        o_user.newsletter.snippet.view = o_user.newsletter.snippet.viewBuilder(document, o_global.breakpoint);
        o_user.newsletter.snippet.presenter = o_user.newsletter.snippet.presenterBuilder(
            document,
            o_user.newsletter.snippet.service,
            o_user.newsletter.snippet.view,
            o_global.pali.layerBuilder,
            o_user.common.button.view,
            o_user.tracking,
            o_util.event
        );
        o_user.newsletter.snippet.presenter.init();
    }
});
