window.o_benefit = window.o_benefit || {};

o_benefit.countdown = (() => {
    const module = {};

    module.init = (lever) => {
        let lever_selector = ".benefit-main__lever";
        let all_main_lever = lever.querySelectorAll(lever_selector);

        [].forEach.call(all_main_lever, (main_lever) => {
            let enabled = (main_lever.getAttribute("data-scarcity-enabled") === "true" && main_lever.getAttribute("data-final-countdown") === "true");
            if (enabled) {
                let subline = main_lever.querySelector(".benefit-main__lever__info__secondary__subline");
                let posixTimestamp = main_lever.getAttribute("data-end-date");
                let end = new Date(posixTimestamp);

                subline["interval"] = window.setInterval(() => {
                    module.remaining_time(new Date(), end, subline)
                }, 500);
            }
        });
    };

    module.remaining_time = (now, end, subline) => {
        let time_range = end.getTime() - now.getTime();
        if (time_range < (24 * 60 * 60 * 1000) && time_range > 1000) {
            let hours = Math.floor((time_range % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((time_range % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((time_range % (1000 * 60)) / 1000);

            let hours_string = hours > 0 ? `${hours}h ` : "";
            let minutes_string = minutes > 0 ? `${minutes}m ` : "";
            let seconds_string = seconds > 0 ? `${seconds}s ` : "";

            let alert = time_range <= (60 * 60 * 1000) ? "benefit-main__lever__info__secondary__subline--red-alert" : "";

            subline.innerHTML = `Nur noch <span class="${alert}">${hours_string}${minutes_string}${seconds_string}</span>`
        } else if (time_range <= 1000) {
            window.clearInterval(subline["interval"]);
            window.setTimeout(() => {
                subline.innerHTML = "Leider abgelaufen";
            }, 1000)
        }
    };

    return module;
})();