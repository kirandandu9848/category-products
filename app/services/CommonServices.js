const Controller = require('../controllers/Controller');
const jwt = require('jsonwebtoken');
const config = require('../../configs/configs');

class CommonFunctionController extends Controller {
    constructor() {
        super();
    }


    /*************************************************************************************
       Set Error Message
       **************************************************************************************/
    static getErrorMessage(status, message, code, error) {
        return new Promise(async (resolve, reject) => {
            try {
                let res = {
                    "settings": { "status": (status) ? status : 0, "message": message, "statusCode": code ? code : 500 },
                    "error": error
                }
                return resolve(res);
            } catch (err) {
                console.log("Error:::", err)
                return reject(err);
            }
        });

    }
    /*************************************************************************************
    Set Success Message
    **************************************************************************************/
    static getSuccessMessage(status, message, code, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let res = {
                    "settings": {
                        "status": status ? status : 1, "message": message, "statusCode": code ? code : 200
                    },
                    "data": data
                }
                return resolve(res);
            } catch (err) {
                return reject({ message: err, status: 0 });
            }
        });

    }
    /*************************************************************************************
     Check All Required Fields
      **************************************************************************************/
    static checkAllRequiredFields(body, fieldsArray) {
        return new Promise(async (resolve, reject) => {
            try {
                let isEmpty = false;
                let message = ''
                let count = 0;
                let field = ''
                let fields = [];
                let savedObject = {}
                fieldsArray.forEach(async element => {
                    if (!(element in body) || body[element] === "" || typeof body[element] === "undefined") {
                        isEmpty = true;
                        // let n = element.includes("_");
                        // console.log("checking ==", n)
                        // let elementMessage = await element.replace(/([A-Z])/g, ' $1')
                        // 	.replace(/^./, (str) => { return str.toUpperCase(); })
                        fields.push(element)
                        // console.log("elementMessage===", elementMessage)
                        // savedObject[body[element]] = element
                        // message = "Please provide the missing field(s) " + fields + ".";
                        // console.log("message===", message)
                        // field = _.lowerCase(element)
                        // return resolve({ isEmpty, message, field });
                    }
                    count = count + 1;
                    // console.log("body[element]===", body[element])
                    if (element != "_id") savedObject[element] = body[element]
                });
                if (count == fieldsArray.length) {
                    message = "Please provide the missing field(s): " + fields + ".";
                    return resolve({ isEmpty, message, field, savedObject });
                }
                // return reject({ isEmpty, message });
                // console.log("checking ==")

            } catch (error) {
                return reject(error);
            }
        });
    }

    /*************************************************************************************
     Validate Email
    **************************************************************************************/
    static validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    /*************************************************************************************
     Validate Password
     **************************************************************************************/
    static customValidatePassword(value) {
        return new Promise((resolve, reject) => {
            try {
                let password = value.toString().trim()
                // console.log("password=======", password.length)
                if (password.length < 8) return resolve({ isValid: false, message: "Password must contain minimum 8 letters." });
                let TestPassord = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)
                if (!TestPassord && password.length >= 8) {
                    let lowerCase = /[a-z]/.test(password)
                    if (!lowerCase) return resolve({ isValid: false, message: "At least one lower case letter required." });
                    let upperCase = /[A-Z]/.test(password)
                    if (!upperCase) return resolve({ isValid: false, message: "At least one upper case letter required." });
                    let number = /[0-9]/.test(password)
                    if (!number) return resolve({ isValid: false, message: "At least one number required." });
                    let character = /[^a-zA-Z0-9\-\/]/.test(password)
                    if (!character) return resolve({ isValid: false, message: "At least one character required." });
                }
                if (TestPassord && password.length >= 8) return resolve({ isValid: true, message: "Good password" });
            } catch (err) {
                console.log("customValidatePassword Error::::::", err);
                return reject({ message: err, status: 0 });
            }
        });
    }
    /*************************************************************************************
       Generate Token
       **************************************************************************************/
    static generateToken(id) {
        let _this = this;
        return new Promise(async (resolve, reject) => {
            try {
                // Generate Token
                let token = jwt.sign({
                    id: id,
                    algorithm: "HS256",
                    exp: Math.floor(new Date().getTime() / 1000) + config.tokenExpiry
                }, config.securityToken);
                return resolve(token);
            } catch (error) {
                console.log("generateToken Error::::::", error);
                return reject(error);
            }
        });
    }

    /*************************************************************************************
   Get next page for pagiation
   **************************************************************************************/
    static getNextPage(page, limit, totalLoads) {
        let _this = this;
        return new Promise(async (resolve, reject) => {
            try {
                console.log("page limit total", page, limit, totalLoads);
                page = Number(page);
                limit = Number(limit);
                let counts = Number(totalLoads);
                let divide = counts / limit;
                let lastPage = Math.ceil(divide);
                if (page < lastPage) return resolve(page + 1);
                return resolve(0);
            } catch (error) {
                console.log("getNextPage Error::::::", error);
                return reject(error);
            }
        });
    }
}
module.exports = CommonFunctionController;