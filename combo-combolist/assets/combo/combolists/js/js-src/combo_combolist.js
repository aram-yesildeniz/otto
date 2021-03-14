/* eslint class-methods-use-this: 0 */
import {
  sendClickTrackingEvent,
  sendSingleViewTrackingEvent,
  sendViewTrackingEvent,
} from "./tracking_service";

export default class ComboCombolist {
  constructor(container) {
    this.container = container;
    this.isSmallWindow = window.matchMedia("(max-width: 420px)").matches;
    this.featureOrder = this.getFeatureOrder();
  }

  trackClick(clickableItem, position, filledSlots) {
    const comboId = this.getComboId(clickableItem);
    const promoType = this.container.getAttribute("data-promoType");
    const contentSource = this.getComboModel(clickableItem);
    sendClickTrackingEvent(
      promoType,
      comboId,
      this.featureOrder,
      filledSlots,
      position + 1,
      contentSource
    );
  }

  trackInitialView() {
    const combosVisible = this.isSmallWindow ? 1 : 2;
    const comboId = this.getAllComboIds(this.container).slice(0, combosVisible);
    const contentSources = this.getContentSource(this.container).slice(
      0,
      combosVisible
    );
    const filledSlots = this.getAllComboIds(this.container).length;
    const additionalAttributes = JSON.parse(
      this.container.getAttribute("data-tracking-attributes")
    );
    const promoType = this.container.getAttribute("data-promoType");
    const comboListDetailAvailability = this.container.getAttribute(
      "data-comboListDetailAvailability"
    );

    sendViewTrackingEvent(
      comboId,
      this.featureOrder,
      filledSlots,
      contentSources,
      additionalAttributes,
      promoType,
      comboListDetailAvailability
    );

    // TODO: Put into a function
    const combos = this.container.querySelectorAll(
      ".combo-combo-list-item-container > li"
    );
    if (combos.length !== 0) {
      combos[0].setAttribute("data-combo-tracked", "true");
      if (!this.isSmallWindow) {
        combos[1].setAttribute("data-combo-tracked", "true");
      }
    }
  }

  trackActiveComboView() {
    const toTrackCombo = this._nextToActive(this.container);

    if (
      toTrackCombo === undefined ||
      toTrackCombo.getAttribute("data-combo-tracked") === "true"
    ) {
      return;
    }

    const comboId = toTrackCombo.getAttribute("data-combo-id");
    const contentSource = toTrackCombo.getAttribute("data-combo-model");
    const filledSlots = this.getAllComboIds(this.container).length;
    const position = this._getPositionRelativeToOthers(toTrackCombo);

    sendSingleViewTrackingEvent(
      comboId,
      this.featureOrder,
      filledSlots,
      position,
      contentSource
    );

    toTrackCombo.setAttribute("data-combo-tracked", true);
  }

  addClickEventListeners() {
    const links = this.container.querySelectorAll("a");
    Array.from(links).forEach((element) => {
      element.addEventListener("click", (event) =>
        this.trackClick(
          event.currentTarget,
          parseInt(event.currentTarget.getAttribute("data-position"), 10),
          parseInt(event.currentTarget.getAttribute("data-filled-slots"), 10)
        )
      );
    });
  }

  addNextComboViewTrackingEventClickListener() {
    const cinemaRightButton = this.container.querySelector(
      ".combo-combo-list-cinema-button-right"
    );

    if (cinemaRightButton !== null) {
      cinemaRightButton.addEventListener("click", () =>
        setTimeout(this.trackActiveComboView.bind(this), 200)
      );
    }

    const scrollPane = this.container.querySelector(
      ".combo-combo-list-scroll-pane"
    );

    if (scrollPane !== null) {
      scrollPane.addEventListener("touchend", () =>
        setTimeout(this.trackActiveComboView.bind(this), 200)
      );
    }
  }

  getComboId(clickableItem) {
    const listElement = clickableItem.closest(
      ".combo-combo-list-item-container > li"
    );
    return listElement.getAttribute("data-combo-id");
  }

  getComboModel(clickableItem) {
    const listElement = clickableItem.closest(
      ".combo-combo-list-item-container > li"
    );
    return listElement.getAttribute("data-combo-model");
  }

  getFeatureOrder() {
    const combolistWidgets = document.querySelectorAll(
      ".combo-combo-list-container"
    );

    const featureOrder = parseInt(
      this.container.parentElement.getAttribute("data-feature-order"),
      10
    );
    const index = Array.from(combolistWidgets).findIndex(
      (widgetDiv) =>
        parseInt(
          widgetDiv.parentElement.getAttribute("data-feature-order"),
          10
        ) === featureOrder
    );

    return `${featureOrder}$${index + 1}`;
  }

  getContentSource() {
    const comboItems = this._getComboItems();
    return Array.from(comboItems).map((div) =>
      div.getAttribute("data-combo-model")
    );
  }

  getAllComboIds() {
    const comboItems = this._getComboItems();

    return Array.from(comboItems).map((div) =>
      div.getAttribute("data-combo-id")
    );
  }

  _getComboItems() {
    return this.container.querySelectorAll(
      ".combo-combo-list-item-container > li"
    );
  }

  _getPositionRelativeToOthers(activeCombo) {
    const combosIds = Array.from(
      this.container.querySelectorAll(".combo-combo-list-item-container > li")
    ).map((combo) => combo.getAttribute("data-combo-id"));
    const activeComboId = activeCombo.getAttribute("data-combo-id");
    return combosIds.indexOf(activeComboId) + 1;
  }

  _nextToActive() {
    const combos = Array.from(
      this.container.querySelectorAll(".combo-combo-list-item-container > li")
    );
    const position = combos.findIndex(
      (combo) => combo.getAttribute("data-combo-tracked") === null
    );
    if (position === -1) return undefined;
    return combos[position];
  }
}
