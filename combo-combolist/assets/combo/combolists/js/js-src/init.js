import Carousel from "./carousel/carousel";
import { ITEM_CONTAINER, MAIN_CONTAINER } from "./class_constants";
import ComboCombolist from "./combo_combolist";

window.o_combo_combolist = window.o_combo_combolist || [];

export function initCarouselForComboCombolist() {
  const containers = document.querySelectorAll(MAIN_CONTAINER);
  Array.from(containers).forEach((cinemaDom) => {
    if (cinemaDom.getAttribute("data-carousel-initialized") !== "true") {
      cinemaDom.setAttribute("data-carousel-initialized", "true");
      if (cinemaDom.querySelector(ITEM_CONTAINER) != null) {
        window.o_combo_combolist_carousel = new Carousel(cinemaDom);
      }
    }
  });
}

export function initTrackingForComboCombolist() {
  const containers = document.querySelectorAll(MAIN_CONTAINER);
  Array.from(containers).forEach((container) => {
    if (container.getAttribute("data-tracked") !== "true") {
      container.setAttribute("data-tracked", "true");
      const combolist = new ComboCombolist(container);
      combolist.trackInitialView();
      combolist.addClickEventListeners();
      combolist.addNextComboViewTrackingEventClickListener();
      window.o_combo_combolist.push(combolist);
    }
  });
}
