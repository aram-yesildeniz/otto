export function sendClickTrackingEvent(
  promoType,
  destination,
  featureOrder,
  filledSlots,
  position,
  source
) {
  const clickTrackingInfo = _buildClickTrackingPayload(
    promoType,
    destination,
    featureOrder,
    filledSlots,
    position,
    source,
    "click"
  );
  window.o_tracking.bct.submitMove(clickTrackingInfo);
}

export function sendViewTrackingEvent(
  destinationsArray,
  featureOrder,
  filledSlots,
  sourcesArray,
  additionalAttributes,
  promoType,
  comboListDetailAvailability
) {
  function _addComboListDetailAvailability(payload) {
    const payloadWithComboListDetailAvailability = payload;
    if (comboListDetailAvailability !== null) {
      payloadWithComboListDetailAvailability.promo_ComboListDetailAvailability = comboListDetailAvailability;
    }
    return payloadWithComboListDetailAvailability;
  }

  const viewTrackingInfo = _getViewTrackingInfo(
    filledSlots,
    destinationsArray,
    featureOrder,
    sourcesArray,
    promoType
  );

  let trackingPayload = _addAdditionalAttributes(
    viewTrackingInfo,
    additionalAttributes
  );

  trackingPayload = _addComboListDetailAvailability(trackingPayload);

  window.o_tracking.bct.sendMergeToTrackingServer(trackingPayload);
}

export function sendSingleViewTrackingEvent(
  destination,
  featureOrder,
  filledSlots,
  position,
  source
) {
  const viewTrackingInfo = _getSingleTrackingInfo(
    filledSlots,
    position,
    destination,
    featureOrder,
    source,
    "ComboListDetail"
  );
  window.o_tracking.bct.sendEventToTrackingServer(viewTrackingInfo);
}

function _addAdditionalAttributes(trackingInfo, additionalAttributes) {
  const trackingPayload = Object.assign({}, trackingInfo);

  Object.keys(additionalAttributes).forEach((key) => {
    trackingPayload[`promo_ComboList${key}`] = additionalAttributes[key];
  });

  return trackingPayload;
}

function _getSingleTrackingInfo(
  filledSlots,
  position,
  destination,
  featureOrder,
  source,
  promoType
) {
  const action = "view";
  const viewTrackingInfo = {};
  viewTrackingInfo[`promo_${promoType}`] = _getEventAsString(
    destination,
    featureOrder,
    filledSlots,
    position,
    source,
    action
  );
  return viewTrackingInfo;
}

function _getViewTrackingInfo(
  filledSlots,
  destinationsArray,
  featureOrder,
  sourcesArray,
  promoType
) {
  const viewTrackingInfo = {};
  if (promoType !== null) {
    const promos = [];
    const action = "view";
    for (let pos = 0; pos < destinationsArray.length; pos += 1) {
      promos.push(
        _getEventAsString(
          destinationsArray[pos],
          featureOrder,
          filledSlots,
          pos + 1,
          sourcesArray[pos],
          action
        )
      );
    }

    viewTrackingInfo[`promo_${promoType}`] = promos.join("|");
  }
  return viewTrackingInfo;
}

function _buildClickTrackingPayload(
  promoType,
  destination,
  featureOrder,
  filledSlots,
  position,
  source,
  action
) {
  const clickTrackingInfo = {};
  clickTrackingInfo[`promo_${promoType}`] = _getEventAsString(
    destination,
    featureOrder,
    filledSlots,
    position,
    source,
    action
  );
  clickTrackingInfo["wk.promo_Attribution"] = _getAttributionString(
    destination,
    featureOrder,
    filledSlots,
    position,
    source,
    action
  );
  return clickTrackingInfo;
}

function _getEventAsString(
  destination,
  featureOrder,
  filledSlots,
  position,
  source,
  action
) {
  return `${destination}∞${featureOrder}∞${filledSlots}∞${position}∞${source}∞${action}`;
}

function _getAttributionString(
  destination,
  featureOrder,
  filledSlots,
  position,
  source,
  action
) {
  return `promo_ComboListDetail∞${_getEventAsString(
    destination,
    featureOrder,
    filledSlots,
    position,
    source,
    action
  )}`;
}
