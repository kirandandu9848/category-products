/****************************
 MONGOOSE SCHEMAS
 ****************************/
let config = require('./configs');
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function () {
    var db = mongoose.connect(config.db, config.mongoDBOptions).then(
        () => {
            console.log('MongoDB connection succesfully done!')
        },
        (error) => {
            console.log('MongoDB connection error::::', error)
        }
    );
    return db;
};