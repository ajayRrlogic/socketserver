'use strict';
var handlerFactory = require('./mqttHandler/handlerFactory');
var hf = new handlerFactory();
var apn = require('apn');

function mqttDataProtocol()
{



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

        
      }

    });



};





module.exports = mqttDataProtocol;
