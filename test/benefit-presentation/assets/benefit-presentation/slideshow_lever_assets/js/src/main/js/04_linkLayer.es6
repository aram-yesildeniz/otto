window.o_benefit = window.o_benefit || {};

o_benefit.linkLayer = (() => {

    const module = {};

    module.init = (leverContainer) => {

        [].forEach.call(leverContainer.querySelectorAll(".benefit-main__linkLayer"), (layer) => {

            if (o_global.debug.status().activated) {
                console.log(`Initialize layer for ${layer}`)
            }
            layer.addEventListener("click", (e) => new o_global.pali.layerBuilder({
                modal: true,
                url: window.atob(layer.getAttribute("data-target-link"))
            }).open(e));
        });

    };

    return module;
})();
