/****************************
 Configuration
 ****************************/

module.exports = {
    db: 'mongodb://localhost:27017/kiransamplenode',
    mongoDBOptions: {
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        keepAlive: 1,
        connectTimeoutMS: 30000,
        // useMongoClient: true,//The `useMongoClient` option is no longer necessary in mongoose 5.x, please remove it.
        native_parser: true,
        useNewUrlParser: true,
        poolSize: 5,
        // user: 'sample',
        // pass: 'sample'
    },
    apiUrl: 'http://localhost:4000',//must be ******serverPort
    sessionSecret: 'SAMPLE_SECRET',
    securityToken: 'SAMPLE_SECRET',
    baseApiUrl: '/api',
    serverPort: 4000,
    socketPort: 3000,
    tokenExpiry: 361440, // Note: in seconds! (1 day)
};