'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger();


function handlerUtils(){


}

handlerUtils.prototype.testNumber = function(numbers){
    if( !numbers ) return false;
    return numbers.replace(/\s+/gm,'').search(/^(\d{10},)*\d{10}$/)>-1;
};


function getLatLongFromString(msgData)
{
   //parse the string to take the two digits before the .
   var index = msgData.indexOf('.');
   //from this index go back by 2 digits to get the degree value
   if(index <2)
   {
     logger.debug('lat/long string is invalid --less than 2 digits before .');
     return null;
   }
   var lengthOfSubstr = msgData.length -index;
   var minuteString = msgData.substr((index-2),lengthOfSubstr);
   var minute = parseFloat(minuteString);
   //print the degree
  // logger.debug('the minute float value is '+minute);
   var degreeString = msgData.substr(0,(index -2));
   var degree = parseInt(degreeString);

   //the lat or latiude to return is combination of degree and minutes
   var retVal = degree + (minute /60);

//   logger.debug('returned lat long value is:'+retVal);
    return retVal;
}

handlerUtils.prototype.getLatLongObject = function(msgData)
{
  if(msgData.length < 44)
   return null;
  var latLongObject = {};
  latLongObject.deviceID = msgData.substr(0,10);
  var latString = msgData.substr(10,9);///the string has to be more than 9 for accomodating value like 160 degree
  latLongObject.latitude =getLatLongFromString(latString);
  var lngString = msgData.substr(19,9);
  latLongObject.longitude = getLatLongFromString(lngString);
  latLongObject.datetime = msgData.substr(35,6) + msgData.substr(29,6);

  latLongObject.power = msgData.substr(41,4);
  latLongObject.printSelf = function()
  {
    logger.debug('deviceID:'+this.deviceID);
    logger.debug('latitude:'+this.latitude);
    logger.debug('longitude:'+this.longitude);
    logger.debug('datetime:'+this.datetime);
    logger.debug('power:'+this.power);
  };
  return latLongObject;
};


module.exports = handlerUtils;
