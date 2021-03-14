window.o_benefit = window.o_benefit || {};

o_benefit.bootstrapSlideshow = () => {
    o_global.eventLoader.onLoad(121, () => {
        const benefitContainers = document.querySelectorAll(".benefit_lever_slideshow");
        if (benefitContainers.length > 0) {
            o_benefit.initialisation.initSlideshow(benefitContainers);
        }

    });
};

o_benefit.bootstrapSlideshow();