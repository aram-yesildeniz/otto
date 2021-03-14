window.o_benefit = window.o_benefit || {};

o_benefit.bootstrap = () => {
    o_global.eventLoader.onLoad(20, () => {
        // 121 - priority order suggested for benefit and associated tracking
        const benefitContainers = document.querySelectorAll(".benefit_init");
        if (o_global.debug.status().activated) {
            console.log(`[benefit-presentation] Bootstrap benefits ${benefitContainers}`)
        }
        if (benefitContainers.length > 0) {
            o_benefit.initialisation.init(benefitContainers);
        }
    });
};

o_benefit.bootstrap();