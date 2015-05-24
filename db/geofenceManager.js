'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Geofence Schema
 */
var GeofenceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Geofence name',
		trim: true
	},
  loc: {
			type: Object,
			index: '2dsphere',
			required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

var GeoFenceModel = mongoose.model('Geofence', GeofenceSchema);


//write a function to get geofences based on the location
//return geofences that have this location

function geofenceManager()
{



}


geofenceManager.prototype.getInGeofences = function (lat,lng,callback)
{
  var lngLat = [];
  lngLat[0] = lng;
  lngLat[1] =lat ;

  console.log(lngLat);

  //query the geofeces that has this point
console.log('geofenceManager.prototype.getInGeofences');

  GeoFenceModel.find(

   {


     "loc":
                         { "$geoIntersects":
                           { "$geometry":
                             { "type": "Point" ,
                               "coordinates": lngLat
                      } } } }


  ).exec(function (err, geofences) {
    if(err)
    {
      console.log('error' + err);
    }
    else
    {
      console.log(geofences);

    }
  });


};

module.exports = geofenceManager;
