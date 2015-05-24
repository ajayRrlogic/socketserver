'use strict';
var handler = require('./handler.js');
var util = require('util');
var handlerUtils = require('./handlerUtils.js');

handlerUtils = new handlerUtils();

function pingHandler(){

  handler.call(this);










}

util.inherits(pingHandler,handler);



pingHandler.prototype.handleMessage = function(msgData,callback)
{
    console.log('handle message in ping handler '+ msgData + 'length:'+msgData.length);
    var msgToSend = 'OK';
    //vaidate data
    if(msgData.length !== 10 || !handlerUtils.testNumber(msgData))
    {
      console.log('length is not 10 or invalid digits');
      msgToSend = 'NO  mobile number is not equal to 10 digits';
    }
    //call the callback with OK
    process.nextTick(function()
    {

      callback(null,msgToSend);
    });

};

pingHandler.prototype.sendResponse = function(socket,msg)
{

  console.log('send response ping handler');
  socket.write(msg);

};



module.exports = pingHandler;
