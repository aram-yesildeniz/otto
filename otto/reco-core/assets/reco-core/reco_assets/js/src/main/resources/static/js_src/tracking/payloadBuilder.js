'use strict';

module.exports = () => {
    const payloadBuilder = {};
    const tiles = [];
    let additionalTrackingInformation = {};

    payloadBuilder.addAdditionalInformation = (key, value) => {
        additionalTrackingInformation[key] = value;
    };

    payloadBuilder.addMultipleAdditionalInformation = (additionalInformation) => {
        additionalTrackingInformation = Object.assign(additionalTrackingInformation, additionalInformation);
    };

    payloadBuilder.addTile = (object) => {
        if (!!object) {
            tiles.push(object);
        }
    };

    payloadBuilder.translateLabelToIndex = {
        "promo_Content": 0,
        "mas_featureSequence": 1,
        "promo_FilledSlots": 2,
        "promo_Position": 3,
        "promo_Source": 4,
        "promo_Activity": 5
    };

    payloadBuilder.masTracking = (tiles, promoType) => {
        let trackingDict = {};
        const table = [];
        for (let i = 0; i < tiles.length; i++) {
            let currentTile = tiles[i];
            const numberOfColumns = 6;
            table[i] = payloadBuilder.initializeRow(numberOfColumns);
            for (let property of Object.entries(currentTile)) {
                const propertyName = property[0];
                const propertyValue = property[1];
                let trackingFeatureIndex = payloadBuilder.translateLabelToIndex[propertyName];
                table[i][trackingFeatureIndex] = propertyValue;
            }
        }
        trackingDict[promoType] = payloadBuilder.mergeToPayloadInfinitySymbol(table);
        return trackingDict;
    };

    payloadBuilder.getPromoTeslaAttributionLabel = (tileTrackingData) => {
        let labelValue = "";
        for (const key in tileTrackingData) {
            if (labelValue.length === 0) {
                labelValue = key + "=" + tileTrackingData[key];
            } else {
                labelValue = labelValue + "$" + key + "=" + tileTrackingData[key];
            }
        }
        return labelValue;
    };

    payloadBuilder.filterTiles = (tiles) => {
        const promoType = tiles[0]['promo_Type'];
        let masTiles = [];
        let genericTiles = [];
        for (let i = 0; i < tiles.length; i++) {
            const currentTile = tiles[i];
            let masTile = {};
            let genericTile = {};
            let propertiesWithoutPromoType = Object.entries(currentTile).filter((property) => {
                return property[0] !== 'promo_Type'
            });
            for (let property of propertiesWithoutPromoType) {
                if (payloadBuilder.filterMasProperties(property)) {
                    masTile[property[0]] = property[1];
                } else {
                    genericTile[property[0]] = property[1];
                }
            }
            masTiles.push(masTile);
            genericTiles.push(genericTile);
        }
        return [masTiles, promoType, genericTiles];
    };

    payloadBuilder.filterMasProperties = (property) => {
        return Object.keys(payloadBuilder.translateLabelToIndex).includes(property[0])
    };

    //new
    payloadBuilder.build = () => {
        let result = {};

        //not all tracking has tiles (e.g. closed, click events)
        if (tiles.length > 0) {
            let [tilesContainingMasInformation, promoType, tilesContainingGenericInformation] = payloadBuilder.filterTiles(tiles);
            Object.assign(result, payloadBuilder.masTracking(tilesContainingMasInformation, promoType));
            Object.assign(result, payloadBuilder.buildGenericTracking(tilesContainingGenericInformation));
        }

        Object.assign(result, additionalTrackingInformation);

        return result;

    };

    payloadBuilder.buildGenericTracking = (tiles) => {
        const table = {};
        const numberOfColumns = tiles.length;
        for (let i = 0; i < tiles.length; i++) {
            let currentTile = tiles[i];
            for (let property of Object.entries(currentTile)) {
                if (!property[1]) {
                    continue;
                }
                if (!table[property[0]]) {
                    table[property[0]] = payloadBuilder.initializeRow(numberOfColumns);
                }
                table[property[0]][i] = property[1];
            }

        }
        let payload = payloadBuilder.mergeToPayload(table);
        return payload;
    };

    payloadBuilder.mergeToPayload = (table) => {
        let payload = {};
        for (let pair of Object.entries(table)) {
            payload[pair[0]] = pair[1].join('|');
        }
        return payload;
    };

    payloadBuilder.mergeToPayloadInfinitySymbol = (table) => {
        if (table instanceof Array) {
            let payload = [];
            for (let pair of Object.entries(table)) {
                payload.push(pair[1].join('∞'));
            }
            let result = payload.join('|')
            return result;
        } else {
            return payloadBuilder.mergeToPayload(table)
        }
    };

    payloadBuilder.initializeRow = (numberOfColumns) => {
        let data = [];

        for (let i = 0; i < numberOfColumns; i++) {
            data.push('');
        }
        return data;
    };

    return payloadBuilder;
};
