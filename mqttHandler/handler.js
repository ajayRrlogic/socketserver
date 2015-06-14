'use strict';


function handler(){





}


handler.prototype.handleMessage = function (msgData,cient,callback)
{
    console.log('handle message in handler base');

};



module.exports =  handler;
