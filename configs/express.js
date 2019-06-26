/****************************
 EXPRESS AND ROUTING HANDLING
 ****************************/
let express = require('express');
const config = require('./configs');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cors = require('cors');//For cross domain error
const fs = require('file-system');
const path = require('path');
const timeout = require('connect-timeout');

module.exports = function () {
    console.log('env - ' + process.env.NODE_ENV)
    var app = express();

    // create a write stream (in append mode)
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

    // setup the logger
    app.use(morgan('combined', { stream: accessLogStream }))

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress({ threshold: 2 }));
    }

    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

    app.use(bodyParser.json());

    app.use(methodOverride());

    app.use(cors());
    // app.use(morgan('combined')); // Just uncomment this line to show logs.

    // =======   Settings for CORS
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(timeout(120000));
    app.use(haltOnTimedout);

    function haltOnTimedout(req, res, next) { if (!req.timedout) next(); }

    app.use((err, req, res, next) => {
        // console.error(err.stack);
        let aYear = 60 * 60 * 24 * 365;
        res.set('Strict-Transport-Security', 'max-age=' + aYear + ';');
        next();
        return res.send({ status: 0, statusCode: 500, message: err.message, error: err });
    })
    app.use(session({
        cookie: { maxAge: 30000 },
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    // ======= All  Routes needs to be mention here.
    require('../app/routes/MainRoutes')(app, express);

    return app;
};