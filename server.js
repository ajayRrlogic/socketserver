'use strict';


var config = require('config');
var mongoose = require('mongoose');

var requestReplyProtocol = require('./requestReplyProtocol.js');

// Load the TCP Library


var net = require('net');

// Keep track of the chat clients
var clients = [];

var dbConfig = config.get('appConfig.dbConfig');

console.log(dbConfig);

//connect to the DB
var connectionString ='mongodb://'+dbConfig.host +'/'+dbConfig.dbName;
console.log(connectionString);
mongoose.connect(connectionString);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('connect to db');
});
// Start a TCP Server
net.createServer(function (socket) {

  var rrp = requestReplyProtocol();

  // Identify this client
  socket.name = socket.remoteAddress + ':' + socket.remotePort ;

  // Put this new client in the list
  clients.push(socket);

  // Send a nice welcome message and announce
  socket.write('Welcome ' + socket.name + '\n');

  // Handle incoming messages from clients.
  socket.on('data', function (data) {

    var strMsg = data.toString();

    rrp.handleMessage(strMsg,socket);

  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);

  });


}).listen(5000);

// Put a friendly message on the terminal of the server.
console.log('device server running at port 5000\n');
