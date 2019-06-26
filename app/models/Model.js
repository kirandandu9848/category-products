/****************************
 COMMON MODEL
 ****************************/
let _ = require("lodash");

class Model {
    constructor(collection) {
        this.collection = collection;
    }
    // Find all data
    find(filter = {}, project = {}, paginate = {}) {
        return new Promise((resolve, reject) => {
            this.collection.find(filter, project).exec((err, data) => {
                if (err) { return reject({ message: err, status: 0 }); }
                return resolve(data);
            });
        });
    }
    // Find single data
    findOne(filter = {}, project = {}) {
        return new Promise((resolve, reject) => {
            this.collection.find(filter, project).exec((err, data) => {
                if (err) { return reject({ message: err, status: 0 }); }
                return resolve(data);
            });
        });
    }
    // Update Data (single or multiple)
    update(filter, data) {
        return new Promise((resolve, reject) => {
            this.collection.findOneAndUpdate(filter,
                { $set: data },
                { upsert: true, new: true }, (err, data) => {
                    if (err) { return reject({ message: err, status: 0 }); }
                    return resolve(data);
                });
        });
    }
    // Store new Data
    store(data, options = {}) {
        return new Promise((resolve, reject) => {
            const collectionObject = new this.collection(data)
            collectionObject.save((err, createdObject) => {
                if (err) { return reject({ message: err, status: 0 }); }
                return resolve(createdObject);
            });
        });
    }
    // Aggregration
    aggregate(stages, query) {
        return new Promise(async (resolve, reject) => {
            let aggregationStages = _.clone(stages);
            aggregationStages = aggregationStages.concat(this.stages(query));
            try {
                const data = await this.collection.aggregate(aggregationStages);
                let result = { data };
                return resolve(result);
            } catch (err) {
                console.log("Aggregration error =", err);
                return reject({ message: err, status: 0 });
            }
        });
    }
    // Total matched documents
    count(filter = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                this.collection.count((err, count) => {
                    if (err) { return reject(err); }
                    return resolve(count);
                });
            } catch (error) {
                console.log("count error = ", error);
                return reject({ message: error, status: 0 });
            }
        });

    }
}

module.exports = Model;