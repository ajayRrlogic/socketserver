'use strict';
var handlerRef = require('./handler.js');
var pingHandler = require('./pingHandler.js');
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


    if(msg.localeCompare('PG')===0)
    {
      retObj = new pingHandler();
    }
    else if(msg.localeCompare('GS') === 0)
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
