/*
* Reverse connection card network (RCCN) // Server-side module
* Copyright PANCHO7532 - P7COMunications LLC [PRIVATE SOFTWARE]
*
* Exploit restricted ISP/Network environment with open ports for access internet/services
*/
const net = require('net');
const events = require('events').EventEmitter;
const inspect = require('util').inspect;