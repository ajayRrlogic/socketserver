'use strict';
var handlerFactory = require('./mqttHandler/handlerFactory');
var hf = new handlerFactory();
var apn = require('apn');

function mqttDataProtocol()
{



}



function sendNotification()
{
  var token = [0x43,0x4e,0xc6,0xe1,0x85,0xd6,0xd7,0xd5,0x57,0xa1,0xbe,0xd5,0x95,0x8f,0x8c,0x1a,0x0a,0xdd,0xcf,0x74,0x51,0x94,0x42,0x2c,0xaa,0x50,0x72,0x39,0xd8,0xa8,0xb3,0xd5];

  //temp code ...send a notification to the device
  var options = {
    cert: 'cert.pem',                 /* Certificate file path */
    certData: null,                   /* String or Buffer containing certificate data, if supplied uses this instead of cert file path */
    key:  'key.pem',                  /* Key file path */
    keyData: null,                    /* String or Buffer containing key data, as certData */
    passphrase: null,                 /* A passphrase for the Key file */
    ca: null,                          /* String or Buffer of CA data to use for the TLS connection */
    gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    port: 2195,                       /* gateway port */
    enhanced: true,                   /* enable enhanced format */
    errorCallback: function(err,notification)
    {
      console.log('in apn error callback');
      if(err)
      {
        console.log(err);
      }
      console.log(notification);
    },         /* Callback when error occurs function(err,notification) */
    cacheLength: 100                  /* Number of notifications to cache for error purposes */
};



  var buf = new Buffer(token);
  var myDevice = new apn.Device(buf);
  var apnConnection = new apn.Connection(options);

  var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

    note.alert = '\uD83D\uDCE7 \u2709 You have a new message';
    note.payload = {'messageFrom': 'Caroline'};



apnConnection.pushNotification(note, myDevice);


apnConnection.on('connected', function() {
    console.log('Connected');
});

apnConnection.on('transmitted', function(notification, device) {
    console.log('Notification transmitted to:' + device.token.toString('hex'));
});

apnConnection.on("transmissionError", function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
    if (errCode === 8) {
        console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
    }
});

apnConnection.on('timeout', function () {
    console.log("Connection Timeout");
});

apnConnection.on("disconnected", function() {
    console.log("Disconnected from APNS");
});

apnConnection.on("socketError", console.error);

}


mqttDataProtocol.prototype.handlePublishedMessage = function (payload,client,callback)
{
    console.log('handle message in mqttDataProtocol base');
    //get the handler from the handler factory and handle the message
    //parse the first two bytes
    var buf = new Buffer(payload);

    var messageType = buf.readUInt16LE(0);

    var handler = hf.getHandler(messageType);

    if(handler === null )
    {
      console.log('handler not defined');
      //just
      return;

    }
    //ask the handler to handle the message
    handler.handleMessage(payload,client,function(err,data)
    {
      if(err)
      {
        console.log('error in handling message');
        //just
      }
      else
      {
        console.log('message handled');

        sendNotification();
      }

    });



};





module.exports = mqttDataProtocol;
