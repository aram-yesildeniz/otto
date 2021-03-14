'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.expander = (() => {
    function init () {
        const expanderButtons = document.querySelectorAll('.js_expanderButton');
        if (expanderButtons !== null && expanderButtons.length > 0) {
            if (o_global.breakpoint.isLarge() || o_global.breakpoint.isExtraLarge()) {
                Array.prototype.forEach.call(expanderButtons, (button) => {
                    const parent_universal = o_util.dom.getParentByClassName(button, 'js_universal');
                    if (parent_universal !== null) {
                        const image_universal = parent_universal.querySelector('.js_universalImage');
                        if (image_universal !== null && image_universal.complete) {
                            showContentDependingOnImageHeight(parent_universal);
                        } else if (image_universal !== null && !image_universal.complete) {
                            image_universal.onload = () => showContentDependingOnImageHeight(parent_universal);
                        }
                    }
                });
            } else {
                Array.prototype.forEach.call(expanderButtons, (button) => {
                    const parent_universal = o_util.dom.getParentByClassName(button, 'js_universal');
                    if (parent_universal !== null) {
                        if (parent_universal.querySelector('.p_expander--decrease') !== null) {
                            button.click();
                        }
                        const toggle = parent_universal.querySelector('.p_textExpander100__toggle');
                        const content = parent_universal.querySelector('.p_textExpander100');
                        if (toggle !== null && content !== null) {
                            showExpander(toggle, false);
                            content.setAttribute('style', 'height: auto');
                        }
                    }
                });
            }
        }
    }

    function showContentDependingOnImageHeight (parent) {
        const contentHeight = getContentHeight(parent);
        const headlineHeight = getHeadLineHeight(parent);
        const imageHeight = getImageHeight(parent);
        const toggle = parent.querySelector('.p_textExpander100__toggle');
        const content = parent.querySelector('.p_textExpander100');
        if (toggle === null || content === null) {
            return;
        }
        if (contentHeight + headlineHeight > imageHeight) {
            showExpander(toggle, true);
            if (parent.querySelector('.p_expander--decrease') === null) {
                setContentHeightToImageHeight(content, imageHeight - headlineHeight - 16);
            } else {
                setContentToFullHeight(content, parent, contentHeight + headlineHeight + 16 + 8);
            }
            const expanderLink = parent.querySelector('.js_textExpander100__link');
            if (expanderLink !== null) {
                expanderLink.addEventListener('textExpanderChange', () => {
                    if (parent.querySelector('.p_expander--decrease') === null) {
                        setContentHeightToImageHeight(content, imageHeight - headlineHeight - 16);
                        parent.setAttribute('style', 'height:none');
                    } else {
                        setContentToFullHeight(content, parent,
                            contentHeight + headlineHeight + 16 + 8 + getToggleHeight(parent));
                    }
                });
            }
        } else {
            content.setAttribute('style', `height:${imageHeight - 16}px`);
            showExpander(toggle, false);
        }
    }

    function getToggleHeight (universal) {
        const element = universal.querySelector('.p_textExpander100__toggle');
        if (element !== null) {
            return element.clientHeight;
        }
        return 0;
    }

    function getHeadLineHeight (universal) {
        const element = universal.querySelector('.sp_universalHeadline');
        if (element !== null) {
            return element.clientHeight;
        }
        return 0;
    }

    function getContentHeight (universal) {
        const element = universal.querySelector('.p_textExpander100');
        if (element !== null) {
            element.setAttribute('style', 'height:auto');
            return element.clientHeight;
        }
        return 0;
    }

    function getImageHeight (universal) {
        const element = universal.querySelector('.js_universalImage');
        if (element !== null) {
            return element.clientHeight;
        }
        return 0;
    }

    function setContentHeightToImageHeight (content, height) {
        content.setAttribute('style', `height:${height}px`);
    }

    function setContentToFullHeight (content, parent, height) {
        content.setAttribute('style', 'height:auto');
        parent.setAttribute('style', `height:${height}px`);
    }

    function showExpander (toggle, flag) {
        if (flag === true) {
            toggle.setAttribute('style', 'display:block');
        } else {
            toggle.setAttribute('style', 'display:none');
        }
    }

    return {
        init
    };
})();

o_global.eventLoader.onAllScriptsExecuted(1000, () => {
    o_shoppages.expander.init();
    window.setTimeout(() => {
        o_shoppages.expander.init();
        o_shoppages.expander.initialised = true;
    }, 250);

    window.addEventListener('resize', () => {
        o_shoppages.expander.init();
    });
});

