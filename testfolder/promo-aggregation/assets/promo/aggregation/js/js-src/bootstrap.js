import {Aggregation} from "./aggregation";
import RestoreScrollPosition from "./restore_scroll_position";
import Togglz from "./togglz";

o_global.eventLoader.onLoad(90, () => {
    new Aggregation().init();
    if (new Togglz().isActive("SCROLL_TO_LAST_POSITION_ON_BROWSER_BACK")) {
        new RestoreScrollPosition().init()
    }
});
