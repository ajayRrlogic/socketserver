'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger();

function handlerUtils(){


}

handlerUtils.prototype.testNumber = function(numbers){
    if( !numbers ) return false;
    return numbers.replace(/\s+/gm,'').search(/^(\d{10},)*\d{10}$/)>-1;
};



handlerUtils.prototype.getLatLongObject = function(msgData,clientid)
{
  if(msgData.length < 26)
   return null;

  console.log(msgData);
  var latLongObject = {};
  latLongObject.deviceID = clientid;

  var buf = new Buffer(msgData);
  console.log(buf);
  latLongObject.messageType =buf.readUInt16LE(0);
  latLongObject.latitude =buf.readDoubleLE(2);

  latLongObject.longitude =buf.readDoubleLE(10);
  latLongObject.datetime =buf.readDoubleLE(18);
  latLongObject.power = 0;
  latLongObject.printSelf = function()
  {
    logger.debug('deviceID:'+this.deviceID);
    logger.debug('latitude:'+this.latitude);
    logger.debug('longitude:'+this.longitude);
    logger.debug('datetime:'+this.datetime);
    logger.debug('power:'+this.power);
    logger.debug('messageType:'+this.messageType);
  };
  return latLongObject;
};


module.exports = handlerUtils;
