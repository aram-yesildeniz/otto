export function countdownToMidnight(endTimestamp, prefix, element, finishedText) {
    var now = new Date();
    var end = new Date(endTimestamp * 1000);
    var time_range = end.getTime() - now.getTime();
    if (time_range < (24 * 60 * 60 * 1000) && time_range > 1000) {
        var hours = Math.floor((time_range % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((time_range % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((time_range % (1000 * 60)) / 1000);
        var hours_string = hours > 0 ? hours + "h " : "";
        var minutes_string = minutes > 0 ? minutes + "m " : "";
        var seconds_string = seconds > 0 ? seconds + "s " : "";
        element.innerHTML = "" + prefix + hours_string + minutes_string + seconds_string;
    }
    else if (time_range <= 1000) {
        window.clearInterval(element["interval"]);
        window.setTimeout(function () {
            element.innerHTML = finishedText;
        }, 1000);
    }
}
;
//# sourceMappingURL=countdownToMidnight.js.map