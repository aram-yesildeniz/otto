import "./polyfill";
import {
  initCarouselForComboCombolist,
  initTrackingForComboCombolist,
} from "./init";
import Logger from "./logger";

(function main() {
  const LOAD_PRIO = 95;

  window.o_global.eventLoader.onLoad(LOAD_PRIO, () => {
    Logger.group("[FT3BCN combo combolist]");
    Logger.count("Combolist Invocation");
    initTrackingForComboCombolist();
    initCarouselForComboCombolist();
    Logger.groupEnd();
  });
})();
