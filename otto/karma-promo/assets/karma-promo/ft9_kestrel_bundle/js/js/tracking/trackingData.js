export default class TrackingData {
    id;
    status;
    name;
    parentId;
    position;
    labels;

    constructor() {
    }

    static builder(copy) {
        let data = copy || new TrackingData();
        return {
            withId: (val) => {
                data.id = val
                return this.builder(data)
            },
            withStatus: (val) => {
                data.status = val
                return this.builder(data)
            },
            withName: (val) => {
                data.name = val
                return this.builder(data)
            },
            withParentId: (val) => {
                data.parentId = val
                return this.builder(data)
            },
            withPosition: (val) => {
                data.position = val
                return this.builder(data)
            },
            withLabels: (val) => {
                data.labels = val
                return this.builder(data)
            },
            build: () => {
                Object.keys(data).forEach(key => data[key] === undefined ? delete data[key] : {});
                return data
            }
        }

    }

}