'use strict';


function handler(){





}


handler.prototype.handleMessage = function (msgData,callback)
{
    console.log('handle message in handler base');

};

handler.prototype.sendResponse = function(socket,msg)
{

};


module.exports =  handler;
