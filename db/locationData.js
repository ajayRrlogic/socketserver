'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var geofenceManager = require('./geofenceManager.js');
var handlerUtils = require('../mqttHandler/handlerUtils.js');


//use mongoose to insert the device record in a table

//the model for the device will be

///device id, latitude, longiturde, date time as yymmddhhmmss, power, array of mobile numbers
var locationDataSchema = new Schema(
  {

    deviceID: {
      type: String,
      required: true
    },
    latitude: {
      type:  Number,
      required: true
    },
    longitude: {
      type:  Number,
      required: true
    },
    datetime: {
      type: String,
      required: true
    },
    power: {
      type: String,
      required: true
    }
  }

);

var locationModel = mongoose.model('locationModel', locationDataSchema);


//write a function to save the data got from a device for a location

function locationData()
{





}


function geofencesCallback(err,data1,data2)
{
  if(err)
  {
    console.log(err);
  }
  else
  {

    console.log('geofences moved out from'+ data1);
    console.log('geofences moved in to '+ data2);
		var geoFenceInfo = {};
		geoFenceInfo.moveOutFrom = data1;
		geoFenceInfo.movedInTo =data2;
		var handlerUtilObject  = new handlerUtils();
		handlerUtilObject.sendNotification(geoFenceInfo);

  }

}

function getGeoFences(location1,location2,callback)
{
  var geoFenceMgrObject = new geofenceManager();
//  console.log('in getGeoFences '+location1 + location2);
  geoFenceMgrObject.getInOutGeofences(location1.latitude,location1.longitude,
    location2.latitude,location2.longitude,callback);

}

function getLocationsCallBack(err,data)
{
  if(err)
  {
    console.log(err);
  }
  else
  {
    //call the getgeofences with last 2 locations
    if(data.length >=2)
    {
      getGeoFences(data[1],data[0],geofencesCallback);
    }
  //  console.log(data);
  }

}

//get the last location for this device id
function getLastLocationDataForDeviceID(deviceID,callback)
{
  locationModel.find(
    {
      'deviceID': deviceID
    }

  ).
  sort({'_id':-1}).
  limit(2)
  .exec(function (err, locations) {
    if(err)
    {
      console.log('error' + err);
      callback(err,null);
    }
    else
    {
      console.log('getting last location:' +locations);

      callback(null,locations);

    }
  });

}

locationData.prototype.saveLocation = function(gsObject,callback)
{

  //create a new location object
   var location = new locationModel();
	console.log('saving locaton model');
    location.deviceID = gsObject.deviceID;
    location.latitude = gsObject.latitude;
    location.longitude = gsObject.longitude;
    location.datetime = gsObject.datetime;
    location.power = gsObject.power;
    location.save(function(err)
    {
      if(err)
      {
        console.log('error saving location data to database ' + err);
        callback(err,null);
      }
      else
      {
        console.log('save complete');
        getLastLocationDataForDeviceID(gsObject.deviceID,getLocationsCallBack);

        callback(null,location);
      }
    }

  );
  //save it

};




module.exports = locationData;
