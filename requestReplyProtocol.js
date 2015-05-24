'use strict';
var handlerFactory = require('./handlers/handlerFactory.js');
var hf  = handlerFactory();
//this module has the impplementations of the protocol


function requestReplyProtocol()
{
  var rrp = {};



  rrp.handleMessage = function(message,socket)
  {
     //check the first two bytes of the message
     var firstTwoBytes = message.substr(0,2);

     var lengthOfSubstr = message.length - 2;
     //take the rest of the data as the message
     var msgdata = message.substr(2,lengthOfSubstr);
     //based on the first two bytes decide the handler and pass the message to it

     var handler = hf.getHandler(firstTwoBytes);

     if(handler === null )
     {
       console.log('handler not defined');
       rrp.sendErrorMessage('invalid message '+message ,socket);
       return;

     }
     //ask the handler to handle the message
     handler.handleMessage(msgdata,function(err,data)
     {
       if(err)
       {
         rrp.sendErrorMessage(err.message,socket);
       }
       else
       {
         handler.sendResponse(socket,data);
       }

     });


  };

  rrp.sendErrorMessage = function(message,socket)
  {
    //send error message to client
    socket.write(message);

  };


  return rrp;


}

module.exports = requestReplyProtocol;
