'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var geofenceManager = require('./geofenceManager.js');
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

function getGeoFences(location)
{
  var geoFenceMgrObject = new geofenceManager();
  console.log('in getGeoFences '+location);
  geoFenceMgrObject.getInGeofences(location.latitude,location.longitude,null);

}

locationData.prototype.saveLocation = function(gsObject,callback)
{

  //create a new location object
   var location = new locationModel();
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
      //  getGeoFences(gsObject);

        callback(null,location);
      }
    }

  );
  //save it

};




module.exports = locationData;
