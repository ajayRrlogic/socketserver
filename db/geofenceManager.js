'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	var handlerUtils = require('../mqttHandler/handlerUtils.js');
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

function getIntesects(lat1,lng1,lat2,lng2,callback)
{
  var lngLat1 = [];
  lngLat1[0] = lng1;
  lngLat1[1] =lat1 ;
  var lngLat2 = [];
  lngLat2[0] = lng2;
  lngLat2[1] = lat2;

//  console.log('1:' +lngLat1 + ' 2:'+lngLat2);

  //query the geofeces that has this point
console.log('geofenceManager.prototype.getInGeofences');
//find a geofence which has the first point but not the second
  GeoFenceModel.find(

   {
     '$and':   [{'loc':
                         { '$geoIntersects':
                           { '$geometry':
                             { 'type': 'Point' ,
                               'coordinates': lngLat1
                      } } } },
      {'loc': {'$not':
                          { '$geoIntersects':
                            { '$geometry':
                              { 'type': 'Point' ,
                                'coordinates': lngLat2
                       } } } }

                }


      ]




  },
  {
    '_id': 0,
		'name':1
  }


  ).exec(function (err, geofences) {
    if(err)
    {
      console.log('error' + err);
      callback(err,null);
    }
    else
    {
      console.log('result:'+geofences);
      callback(null,geofences);

    }
  });


}




geofenceManager.prototype.getInOutGeofences = function(lat1,lng1,lat2,lng2,callback)
{
   //get the first list of geofences
   getIntesects(lat1,lng1,lat2,lng2,function(err,geofences1)
   {
     if(err)
     {
       console.log('error getting geofences');
       geofences1 = null;
     }
     else
     {
       console.log(geofences1);
       //call the getintersects for the second lat long
       getIntesects(lat2,lng2,lat1,lng1,function(err,geofences2)
       {
         if(err)
         {
           console.log('error getting second geofences');
           //return the callback
           callback(err,geofences1,geofences2);
         }
         else
         {
           console.log('out fences:'+geofences1 +'in geofences:'+geofences2);
           callback(null,geofences1,geofences2);
         }
       }
     );
     }
   }
   );

};




module.exports = geofenceManager;
