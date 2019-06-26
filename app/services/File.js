/****************************
 FILE HANDLING OPERATIONS
 ****************************/
let fs = require('fs');
let path = require('path');
const _ = require("lodash");
const config = require('../../configs/configs');
// ***** ****************************   
//If Any Error Occurs please use brew install ffmpeg also
// ***** ****************************
var ffmpeg = require('ffmpeg');


class File {
    constructor(file, location) {
        this.file = file;
        this.location = location;
    }
    readFile(filepath) {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(filepath, 'utf-8', (err, html) => {
                    if (err) { return reject({ message: err, status: 0 }); }
                    return resolve(html);
                });
            } catch (error) {
                console.log("readFile Error::::::", error);
                return reject(error);
            }
        });
    }
}

module.exports = File;