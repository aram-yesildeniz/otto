class ProductData {
    stringReplaceAll(inputString, replaceMap) {
        let str = inputString;
        for (let i in replaceMap) {
            str = str.replace(new RegExp(replaceMap[i], 'g'), i);
        }
        return str;
    }

    cleanupSearchTerm(searchTerm) {
        const replaceMap = {
            'Ae': "[Ä]",
            'ae': "[ä]",
            'oe': "[ö]",
            'Oe': "[Ö]",
            'Ue': "[Ü]",
            'ue': "[ü]",
            '-': "[ ]",
            '_': "[\\/]",
            'ss': "[ß]",
            '': "^_|_$|[^a-zA-Z0-9.,_\\-]",
        };
        return this.stringReplaceAll(searchTerm, replaceMap);
    }

    cleanupBrandName(brandName) {
        const replaceMap = {
            '_AND_': "&",
            'PLUS': "[+]",
            '_': "[. -]",
            'A': "[ÀÁÂÃÅĂ]",
            'AE': "[ÄÆ]",
            'C': "[ÇČ]",
            'E': "[ÈÉÊËĒ]",
            'I': "[ÌÍÎÏ]",
            'N': "Ñ",
            'O': "[ÒÓÔÕŌŎ]",
            'OE': "[ÖŒØ]",
            'R': "Ř",
            'S': "[ȘŠ]",
            'SS': "ß",
            'U': "[ÙÚÛŰ]",
            'UE': "Ü",
            'Y': "[ÝŸ]",
            '': "[^\\w\\s_]"
        };

        return this.stringReplaceAll(brandName.toUpperCase(), replaceMap);
    }

    setProductDataProfiles(api) {
        const productJsonElement = document.getElementById("avJson");
        if (productJsonElement) {
            const productJson = JSON.parse(productJsonElement.textContent);
            if (productJson.id) {
                api.setProfile("productId", productJson.id);
            }
            if (productJson.businessCategory && productJson.businessCategory.value) {
                api.setProfile("categoryValue", productJson.businessCategory.value);
            }
            if (productJson.businessCategory && productJson.businessCategory.group) {
                api.setProfile("categoryGroup", productJson.businessCategory.group);
            }
            if (productJson.brand) {
                api.setProfile("brand", this.cleanupBrandName(productJson.brand));
            }
            if (productJson.retailPrice) {
                api.setProfile("price", productJson.retailPrice);
            }
            if (productJson.classificationGroup) {
                api.setProfile("classificationGroup", productJson.classificationGroup);
            }
        }
    }

}

export {ProductData};
