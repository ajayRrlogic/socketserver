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

    logger.debug('got the gs objct');
    logger.debug(gsObject);

    if(gsObject !== null)
    {
      gsObject.printSelf();
      var locationdata = new locationData();
      logger.debug('trying to save location data');
      locationdata.saveLocation(gsObject,function(err,data)
      {
        if(err)
        {
          logger.debug('error saving');

        }
        else {
          logger.debug('no error in saving');

          logger.debug(data);

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
