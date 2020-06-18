/*
* Reverse connection card network (RCCN) // Client-side module
* Copyright PANCHO7532 - P7COMunications LLC [PRIVATE SOFTWARE]
*
* Exploit restricted ISP/Network environment with open ports for access internet/services
*/
const net = require('net');
const event = require('events').EventEmitter;
const inspect = require('util').inspect;
// lets create a new event!
// This event should be invoked on new server request i guess
const connectionHandler = new event();
//now some variables...
var destServer = "localhost"; //host where all the magic should go
var pingPort = 30554; //port where the script will ping
var newConnectionsPort = 30555; //port where an SSH/VPN/Service app should connect waiting for the incoming data!
var clientPort = 9071; //port where the server should try to connect!
var isConnectedClient = false; //poor check-in to avoid other connections if already i'm connected
//and now some functions!
function checkPort(port) {
    //this bitch here will check if an port is open, return true if true, return false if false
    var testPortServer = net.createServer();
    testPortServer.listen(port);
    testPortServer.on('error', function(){
        testPortServer.close();
        return true;
    });
    return false;
}
const mainClient = net.createServer();
if(checkPort(newConnectionsPort)) {
    //checking if there isn't a port conflict!
    //but in case of yes
    console.log("[ERROR] - Port " + newConnectionsPort + " is already in use, please specify an different one.");
    process.exit();
}