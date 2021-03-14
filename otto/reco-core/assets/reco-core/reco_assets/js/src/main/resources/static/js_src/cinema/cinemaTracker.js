'use strict';

const trackingApi = require('../tracking/trackingApi.js');
const payloadBuilderModule = require('../tracking/payloadBuilder.js');
const trackingIdentifier = require('./trackingIdentifier.js')

const OT_ACCT_PATH_PREFIX = 'PE-';

const mergeObjects = (objects) => {
    let result = {};
    objects.forEach((object) => {
        result = Object.assign(result, object)
    });
    return result;
};

/**
 *
 * @param visibleTiles
 * @param activity
 * @param tileIndexOffset
 * @param totalNumberOfTiles
 * @param payloadBuilder: PayloadBuilder
 * @param featureSequence
 * @param featureIndex
 */
const addTilesPayload = (visibleTiles, activity, tileIndexOffset, totalNumberOfTiles, payloadBuilder, featureSequence, featureIndex) => {
    visibleTiles.forEach((tile, tilePosition) => {
        const trackingData = tile.getTrackingData();
        const additionTileTrackingData = {};
        additionTileTrackingData['promo_Activity'] = activity;
        additionTileTrackingData['promo_Position'] = (tilePosition + tileIndexOffset + 1).toString();
        additionTileTrackingData['promo_FilledSlots'] = totalNumberOfTiles.toString();
        additionTileTrackingData['mas_featureSequence'] = featureSequence + '$' + featureIndex;
        const activityTrackingData = tile.getActivityTrackingData(activity);
        payloadBuilder.addTile(mergeObjects([trackingData, additionTileTrackingData, activityTrackingData]));
    });
};

const cinemaTracker = {};

/**
 *
 * @param visibleTiles : DOMObject[]
 * @param totalNumberOfTiles: Number
 * @param eventMergeId: doubt(?)
 * @param additionalTrackingData: JSON
 * @param featureSequence
 * @param featureIndex
 */
cinemaTracker.trackView = (visibleTiles, totalNumberOfTiles, eventMergeId, cinemaTrackingData, additionalTrackingData, featureSequence, featureIndex) => {
    const payloadBuilder = payloadBuilderModule();
    addTilesPayload(visibleTiles, 'view', 0, totalNumberOfTiles, payloadBuilder, featureSequence, featureIndex);
    payloadBuilder.addMultipleAdditionalInformation(additionalTrackingData);

    if (cinemaTrackingData.hasOwnProperty('promo_RecoOfferCount')) {
        payloadBuilder.addAdditionalInformation('promo_RecoOfferCount', cinemaTrackingData.promo_RecoOfferCount)
    }

    if (!!eventMergeId) {
        trackingApi.sendEventMergeRequest(payloadBuilder.build(), eventMergeId);
    } else {
        trackingApi.sendMergeRequest(payloadBuilder.build());
    }
};

cinemaTracker.trackJsonView = (visibleTiles, totalNumberOfTiles, eventMergeId, additionalTrackingData, featureSequence, featureIndex) => {
    // https://jira.scm.otto.de/browse/FT6BCN-133
    // When Team Tracking has the API available for events (not only page impression), then track them using eventMergeId
    // It is not null when it comes from a user action and not from page impression.
    // Good Luck, we love you.
    if (eventMergeId) {
        return;
    }
    const parentId = trackingIdentifier.generate();
    const cinemaType = visibleTiles[0].getTrackingData()['promo_Type'].replace("promo_", "");
    const root = {
        id: parentId, //Unique id
        name: cinemaType, //CinemaName = "promo_"+ot_AccPath_Suffix
        position: parseInt(featureSequence), //Cinema position in the page = featureSequence
        status: 'loaded', //Status
        labels: {
            promo_FeatureNumber: ['' + featureIndex], //FeatureNumber
            promo_FilledSlots: ['' + totalNumberOfTiles] //FilledSlots = TotalNumberOfTiles
        }
    };
    const tiles = visibleTiles.map((tile, index) => ({
        id: parentId + '_' + (index + 1),
        variationId: tile.getVariationId(), //data-tracking.product_VariationId
        name: cinemaType + '-Product', // Product is fixed
        parentId: parentId,
        position: index + 1, //Position (tile position in the cinema)
        status: 'loaded',
        labels: {
            promo_Source: [tile.getTrackingData()['promo_Source']] //Source
        }
    }));
    const result = [root].concat(tiles);
    trackingApi.sendViewPageEvent(result);
};

//To be enriched with FT6BCN-249
cinemaTracker.trackScroll = (visibleTiles, totalNumberOfTiles, firstVisibleTileIndex, cinemaTrackingData, additionalTrackingData, direction, featureSequence, featureIndex) => {
    const payloadBuilder = payloadBuilderModule();
    addTilesPayload(visibleTiles, direction, firstVisibleTileIndex, totalNumberOfTiles, payloadBuilder, featureSequence, featureIndex);
    payloadBuilder.addAdditionalInformation('product_VariationId', cinemaTrackingData.product_VariationId);
    payloadBuilder.addMultipleAdditionalInformation(additionalTrackingData);
    trackingApi.sendEventRequest(payloadBuilder.build());
};

//To be replaced with FT6BCN-291
cinemaTracker.trackClick = (tile, totalNumberOfTiles, tileIndex, cinemaTrackingData, additionalTrackingData, featureSequence, featureIndex) => {
    const payloadBuilder = payloadBuilderModule();
    const tileTrackingData = Object.assign({}, tile.getTrackingData());
    const clickTrackingData = tile.getActivityTrackingData('click');
    const promoType = tileTrackingData['promo_Type'];
    const promoContent = tileTrackingData['promo_Content'];
    const promoSource = tileTrackingData['promo_Source'];
    const promoPosition = (tileIndex + 1) + '';
    const promoActivity = "click";

    delete tileTrackingData['promo_Type'];
    delete tileTrackingData['promo_Content'];
    delete tileTrackingData['promo_Source'];

    const mainTrackingData = `${promoContent}∞${featureSequence}$${featureIndex}∞${totalNumberOfTiles}∞${promoPosition}∞${promoSource}∞${promoActivity}`;
    payloadBuilder.addAdditionalInformation(promoType, mainTrackingData);
    payloadBuilder.addAdditionalInformation("product_VariationId", tile.getVariationId())
    payloadBuilder.addAdditionalInformation('wk.promo_Attribution', promoType + "∞" + mainTrackingData);
    payloadBuilder.addAdditionalInformation('ot_AccPath', OT_ACCT_PATH_PREFIX + cinemaTrackingData.ot_AccPath_Suffix);
    payloadBuilder.addAdditionalInformation('wk.promo_TeslaAttribution', payloadBuilder.getPromoTeslaAttributionLabel(tileTrackingData));
    payloadBuilder.addMultipleAdditionalInformation(tileTrackingData);
    payloadBuilder.addMultipleAdditionalInformation(clickTrackingData);
    payloadBuilder.addMultipleAdditionalInformation(additionalTrackingData);
    trackingApi.sendMoveRequest(payloadBuilder.build());
};

//To be replaced with FT6BCN-250
cinemaTracker.trackOpenedCinema = (visibleTiles, totalNumberOfTiles, tileIndex, promoActivity, cinemaTrackingData, trackingDataByFt4) => {
    const masFeatureSequence = '99';
    const masFeatureIndex = '99';
    const payloadBuilder = payloadBuilderModule();
    addTilesPayload(visibleTiles, promoActivity, tileIndex, totalNumberOfTiles, payloadBuilder, masFeatureSequence, masFeatureIndex);
    payloadBuilder.addAdditionalInformation('product_VariationId', cinemaTrackingData.product_VariationId);
    payloadBuilder.addMultipleAdditionalInformation(trackingDataByFt4);
    trackingApi.sendEventRequest(payloadBuilder.build());
};

//To be replaced with FT6BCN-250
cinemaTracker.trackClosedCinema = (totalNumberOfTiles, promoType, promoActivity, cinemaTrackingData, trackingDataByFt4) => {
    const payloadBuilder = payloadBuilderModule();
    const promoContent = 'Empfehlungen';
    const masFeatureSequence = '99';
    const masFeatureIndex = '99';
    const promoPosition = 'NA';
    const promoSource = 'NA';
    payloadBuilder.addAdditionalInformation(promoType, `${promoContent}∞${masFeatureSequence}$${masFeatureIndex}∞${totalNumberOfTiles}∞${promoPosition}∞${promoSource}∞${promoActivity}`);
    payloadBuilder.addAdditionalInformation('product_VariationId', cinemaTrackingData.product_VariationId);
    payloadBuilder.addMultipleAdditionalInformation(trackingDataByFt4);
    trackingApi.sendEventRequest(payloadBuilder.build());
};

module.exports = cinemaTracker;
