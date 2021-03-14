export default class ParentLabels {
    dynamo_BrandShopPromotionLargeCount;
    dynamo_FeatureSequence;

    constructor() {
    }

    static builder(payload) {
        let parent = payload || new ParentLabels();
        return {
            withCount: (val) => {
                parent.dynamo_BrandShopPromotionLargeCount = [val.toString()]
                return this.builder(parent)
            },
            withFeatureSequence: (val) => {
                parent.dynamo_FeatureSequence = [val.toString()]
                return this.builder(parent)
            },
            build: () => {
                Object.keys(parent).forEach(key => parent[key] === undefined ? delete parent[key] : {});
                return parent
            }
        }

    }

}