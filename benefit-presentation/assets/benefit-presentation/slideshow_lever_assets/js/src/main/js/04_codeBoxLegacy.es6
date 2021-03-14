window.o_benefit = window.o_benefit || {};

o_benefit.codeboxLegacy = (() => {

    const module = {};

    // shameless copied from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    let copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };


    function copyAndTrack(value, prevent = true) {
        return (e) => {

            if (!!o_global.debug.status().activated) {
                console.log(`Copy and track ${value}`);
                console.log(e);
            }

            if (prevent) {
                e.preventDefault();
                e.stopPropagation();
            }

            copyToClipboard(value);
            //if (!o_util.toggle.get("FT9_MAIN_LEVERS_FEATURE_TRACKING", false)) {
            // legacy tracking is enabled by default
            o_benefit.trackingApi.sendRealEventRequest({"benefit_Copy": true});
            //}
        };
    }

    module.init = (container) => {

        [].forEach.call(container.querySelectorAll(".onex-benefit-main__lever__code-box"), (box) => {
            let value = box.querySelector(".onex-benefit-main__lever__code-box__value").textContent;

            box.addEventListener("click", copyAndTrack(value));
        });

    };

    return module;
})();
