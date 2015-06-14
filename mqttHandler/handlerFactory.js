'use strict';
var handlerRef = require('./handler.js');

var gsHandler = require('./gsHandler.js');



function handlerFactory()
{
  var hf = {};

hf.initHandlers = function()
{
  //initialize all the message handlers



};

hf.getHandler = function(msg)
  {
    var retObj;


    if(msg===126) // this is the location message
    {
      retObj = new gsHandler();
    }
    else
    {
      console.log('No handler found for the message:'+msg);
      return null;
    }

    console.log('is it deriver properly '+(retObj instanceof handlerRef ));
    if(!(retObj instanceof handlerRef))
    retObj = null;

    return retObj;

  };

  return hf;
}

  module.exports = handlerFactory;
