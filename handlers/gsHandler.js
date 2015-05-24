'use strict';
var log4js = require('log4js');
var handler = require('./handler.js');
var util = require('util');
var handlerUtils = require('./handlerUtils.js');
var locationData = require('../db/locationData.js');

var logger = log4js.getLogger();

function gsHandler()
{






}

util.inherits(gsHandler,handler);




gsHandler.prototype.handleMessage = function(msgData,callback)
{
    logger.debug('handle message in gs handler '+ msgData + 'length:'+msgData.length);
    var msgToSend = 'OK';
    //validate data
    //device id 10 bytes + latitude 9 bytes + longitude 9 bytes + time 6 bytes + date 6 bytes + power 4 bytes
    //total length 44 bytes

    if(msgData.length < 44)
    {
      msgToSend = 'NO length of message is:' + msgData.length + ' not equal to 44';

    }

    var handlerUtilObject  = new handlerUtils();
    var gsObject = handlerUtilObject.getLatLongObject(msgData);

    if(gsObject !== null)
    {
      gsObject.printSelf();
      var locationdata = new locationData();
      locationdata.saveLocation(gsObject,function(err,data)
      {
        if(err)
        {
          console.log('error saving');

        }
      }
    );

    }
    else
    {
      msgToSend = 'NO error in data';
    }

    //call the callback with OK
    process.nextTick(function()
    {

      callback(null,msgToSend);
    });

};

gsHandler.prototype.sendResponse = function(socket,msg)
{

  logger.debug('send response gs handler');
  socket.write(msg);

};





module.exports = gsHandler;
