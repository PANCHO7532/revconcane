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
var clientDebugStatus = true; //print debug messages to client
var showHelp = false; //if help flag is detected, then this will go to true
var gcwarn = true; //if we shown the garbage collector warning, then this goes to false
//UPDATE 26/06/2020... copy-paste of some argument parsing shit from other-other-other project
//read arguments
for(c = 0; c < process.argv.length; c++) {
    switch(process.argv[c]) {
        case "--destServer":
        case "-d":
            destServer = process.argv[c + 1];
            break;
        case "--pingPort":
        case "-p":
            pingPort = process.argv[c + 1];
            break;
        case "--newConnPort":
        case "-n":
            newConnectionsPort = process.argv[c + 1];
            break;
        case "--clientPort":
        case "-c":
            clientPort = process.argv[c + 1];
            break;
        case "--clientDebugStatus":
        case "-cdbg":
            clientDebugStatus = true;
            break;
        case "--help":
        case "-h":
            showHelp = true;
            break;
        default:
            if(process.argv[c].substring(0, 1) == "-" || process.argv[c].substring(0, 2) == "--") {
                console.log("[ERROR] - Invalid argument: \"" + process.argv[c] + "\"");
                showHelp = true;
            }
            break;
    }
}
//show help if any
if(showHelp) {
    //so, we store the help message in a very fashioned way for my eyes
    var helpMessage = [
        "this is the help message."
    ];
    for(c=0; c < helpMessage.length; c++) {
        console.log(helpMessage[c]);
    }
    process.exit();
}
//garbage collector things (copypasted from other projects that i have)
function gcollector() {
    if(!global.gc && gcwarn) {
        console.log("[WARNING] - Garbage Collector isn't enabled! Memory leaks may occur.");
        gcwarn = false;
        return;
    } else if(global.gc) {
        global.gc();
        return;
    } else {
        return;
    }
}
setInterval(gcollector, 1000);
//for parse remote addresses
function parseRemoteAddr(raddr) {
    if(raddr.toString().indexOf("ffff") != -1) {
        //is IPV4 address
        return raddr.substring(7, raddr.length);
    } else {
        return raddr;
    }
}
//UPDATE 21/06/2020... rewriting this section
//starting the server where it will be listening incoming connections to an app (VPN/HTTP Injector-Custom)
const connectionsServer = net.createServer();
connectionsServer.on('connection', function(socket) {
    //so we received a new connection aaand we have a socket
    console.log("[INFO] - Connection received from " + socket.remoteAddress + ":" + socket.remotePort);
    //let's ping the server
    socket.write("HTTP/1.1 102 Sending server handshake...\r\n"); //informing that we are pinging it lol
    socket.vcon = net.createConnection({host: destServer, port: pingPort});
    socket.vcon.on('error', function(error){
        socket.write("HTTP/1.1 102 " + error.code + ", server started!");
        socket.vcon.close();
    });
    
});
connectionsServer.on('error', function(error) {
    //if there's an error while powering up this server, then we display the error and exit!
    connectionsServer.close();
    console.log("[ERROR] - An error occurred at connectionsServer instance, code: " + error.code);
    process.exit();
});
connectionsServer.listen(newConnectionsPort, function(){
    console.log("[INFO] - Incoming connections set up to port: " + newConnectionsPort);
    console.log("[INFO] - Ping server set up to " + destServer + ":" + pingPort);
    console.log("[INFO] - External port service set up to: " + clientPort);
});