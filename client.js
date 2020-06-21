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
//UPDATE 21/06/2020... rewriting this section
//starting the server where it will be listening incoming connections to an app (VPN/HTTP Injector-Custom)
const connectionsServer = net.createServer();
connectionsServer.on('error', function(error) {
    //if there's an error while powering up this server, then we display the error and exit!
    connectionsServer.close();
    console.log("[ERROR] - An error occurred at connectionsServer instance, code: " + error.code);
    process.exit();
});
connectionsServer.listen(newConnectionsPort, function(){
    console.log("[INFO] - Waiting for incoming connections!");
});