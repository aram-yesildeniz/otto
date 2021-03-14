export default class ChildLabels {
    dynamo_Affinity;
    dynamo_CPM;
    dynamo_FeatureSequence;
    dynamo_OfferCode;
    dynamo_OfferName;
    dynamo_PacingFactor;
    dynamo_Score;
    dynamo_TargetPSR;
    dynamo_ImageId;
    dynamo_TreatmentCode;
    dynamo_CampaignAffinity;
    dynamo_InteractionPoint;

    constructor() {
    }

    static builder(payload) {
        let child = payload || new ChildLabels();
        return {
            withAffinity: (val) => {
                child.dynamo_Affinity = [val.toString()]
                return this.builder(child)
            },
            withCPM: (val) => {
                child.dynamo_CPM = [val.toString()]
                return this.builder(child)
            },
            withFeatureSequence: (val) => {
                child.dynamo_FeatureSequence = [val.toString()]
                return this.builder(child)
            },
            withOfferCode: (val) => {
                child.dynamo_OfferCode = [val.toString()]
                return this.builder(child)
            },
            withOfferName: (val) => {
                child.dynamo_OfferName = [val.toString()]
                return this.builder(child)
            },
            withPacingFactor: (val) => {
                child.dynamo_PacingFactor = [val.toString()]
                return this.builder(child)
            },
            withScore: (val) => {
                child.dynamo_Score = [val.toString()]
                return this.builder(child)
            },
            withTargetPSR: (val) => {
                child.dynamo_TargetPSR = [val.toString()]
                return this.builder(child)
            },
            withImageId: (val) => {
                child.dynamo_ImageId = [val.toString()]
                return this.builder(child)
            },
            withTreatmentCode: (val) => {
                child.dynamo_TreatmentCode = [val.toString()]
                return this.builder(child)
            },
            withCampaignAffinity: (val) => {
                child.dynamo_CampaignAffinity = [val.toString()]
                return this.builder(child)
            },
            withInteractionPoint: (val) => {
                child.dynamo_InteractionPoint = [val.toString()]
                return this.builder(child)
            },
            build: () => {
                Object.keys(child).forEach(key => child[key] === undefined ? delete child[key] : {});
                return child
            }
        }

    }


}