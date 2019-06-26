/****************************
 SERVER MAIN FILE
 ****************************/
process.env.NODE_ENV = process.env.NODE_ENV || process.env.NODE_DEV

// Include Modules
const exp = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser');
const https = require('https')
const http = require('http')
const SocketIO = require('socket.io')
// Include files Data
const config = require('./configs/configs')
const express = require('./configs/express')
const mongoose = require('./configs/mongoose')

global.appRoot = path.resolve(__dirname)

if (global.permission) { } else {
    global.permission = []
}

const db = mongoose()
const app = express()

app.get('/', function (req, res, next) { res.send('Hello! Its working fine,please proceed...') })
/* Path for serving public folder */
app.use('/', exp.static(__dirname + '/'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// configure https for listening server.
const serverPort = config.serverPort;
const socketPort = config.socketPort;
const SERVER_CONNECTION = http.Server(app);// https.Server(app);  if https

//server Connection
SERVER_CONNECTION.listen(serverPort, function () {
    console.log('Server listening on *:' + `  http://localhost:${config.serverPort}`);
});

// //Socket Connection
// const io = SocketIO(app.listen(socketPort, () => {
//     console.log(`Server(socket) running at http://localhost:${config.socketPort}`);
// }));

