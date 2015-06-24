'use strict';

var mqttDataProtocol = require('./mqttDataProtocol.js');
var config = require('config');
var mongoose = require('mongoose');

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


var mosca = require('mosca');
var settings = {
port: 1883
};

function setup() {
console.log('Mosca server is up and running');
}
//here we start mosca
var server = new mosca.Server(settings);
server.on('ready', setup);
// fired when the mqtt server is ready

// fired whena  client is connected
server.on('clientConnected', function(client) {
console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client)
{
console.log('packe is ',packet);
console.log('Published : ', packet.payload);
console.log('length is :',packet.payload.length);

var mqttDP = new mqttDataProtocol();
mqttDP.handlePublishedMessage(packet.payload,client,null);

});
// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
console.log('subscribed : ', topic);
});
// fired when a client subscribes to a topic
server.on('unsubscribed', function(topic, client) {
console.log('unsubscribed : ', topic);
});
// fired when a client is disconnecting
server.on('clientDisconnecting', function(client) {
console.log('clientDisconnecting : ', client.id);
});
// fired when a client is disconnected
server.on('clientDisconnected', function(client) {
console.log('clientDisconnected : ', client.id);
});
