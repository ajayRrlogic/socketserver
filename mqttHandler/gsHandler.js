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




gsHandler.prototype.handleMessage = function(msgData,client,callback)
{
    logger.debug('handle message in gs handler '+ msgData + 'length:'+msgData.length);


    var handlerUtilObject  = new handlerUtils();
    var gsObject = handlerUtilObject.getLatLongObject(msgData,client.id);

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


    //call the callback with OK
    process.nextTick(function()
    {
      if(callback !== null)

      callback(null,'msgToSend');
    });

};







module.exports = gsHandler;
