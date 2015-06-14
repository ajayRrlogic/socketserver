'use strct';

var binary = require('binary');


var buf = new Buffer([ 0x7e, 0x00 ]);






console.log(buf.readUInt16LE(0));
