window.o_benefit = window.o_benefit || {};

o_benefit.appOnlyBox = (() => {

    const module = {};

    function callAppLink(url) {
        return (e) => {
            e.preventDefault();
            e.stopPropagation();
            //check for some specific url characteristic
            if (url !== undefined && url !== "" && url.includes("coit7v1_el2kcdb")) {
                window.location = url;
            }
        };
    }

    module.init = (container) => {

        [].forEach.call(container.querySelectorAll(".benefit-main__lever__code-box--app"), (box) => {

            let url = box.querySelector(".benefit-main__lever__code-box__value--app").getAttribute("data-applink");

            if (!!o_global.device.isTouchable) {
                box.addEventListener("touchstart", callAppLink(url));
            } else {
                box.addEventListener("click", callAppLink(url));
            }
        });

    };

    return module;
})();
