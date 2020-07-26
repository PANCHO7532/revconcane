/*
* Reverse connection card network (RCCN) // Server-side module
* Copyright PANCHO7532 - P7COMunications LLC [PRIVATE SOFTWARE]
*
* Exploit restricted ISP/Network environment with open ports for access internet/services
*/
const net = require('net');
const events = require('events').EventEmitter;
const inspect = require('util').inspect;
var serverPort = 25568;
var clientPort = 25567;
var dhost = "127.0.0.1";
var dport = 8080;
//alright we need to be more intelligent on this one, so, lets recycle some code btw
//bcome copypasterino
for(c = 0; c < process.argv.length; c++) {
    switch(process.argv[c]) {
        case "-dhost":
            dhost = process.argv[c + 1];
            break;
        case "-dport":
            dport = process.argv[c + 1];
            break;
        case "-mport":
            serverPort = process.argv[c + 1];
            break;
        case "-cport":
            clientPort = process.argv[c + 1];
            break;
    }
}
function gcollector() {
    //garbage collector stuff
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
const server = net.createServer();
server.on('connection', function(socket) {
    console.log("[INFO] - Connection received from " + socket.remoteAddress + ":" + socket.remotePort);
    var conn = net.createConnection({host: dhost, port: dport});
    socket.on('data', function(data) {
        //pipe sucks
        conn.write(data);
    });
    conn.on('data', function(data) {
        //pipe sucks x2
        socket.write(data);
    });
    socket.once('data', function(data) {
        /*
        * Nota para mas tarde, resolver que diferencia hay entre .on y .once
        * lalala puto el que lo lea me dio flojera de buscarxddxdxd
        */
    });
    socket.on('error', function(error) {
        console.log("[SOCKET] - read " + error + " from " + socket.remoteAddress + ":" + socket.remotePort);
        conn.destroy();
        //so, if we were alerted, we go for an connection!
        var revconn = net.createConnection({host: socket.remoteAddress, port: clientPort});
        revconn.on('error', function(errord) {
            console.log("[REVCON] - Connection task failed for " + socket.remoteAddress + ":" + clientPort + ", error: " + errord);
            revconn.destroy();
        });
        revconn.on('connect', function() {
            revconn.write(basePayload);
        })
        revconn.on('data', function(incomingData){
            //we are receiving data! omfglaksjdlkasjd
            //sorry incomingData variable, you're there but for now im not calling you
            var conn2 = net.createConnection({host: dhost, port: dport});
            conn2.on('data', function(incConData) {
                revconn.write(incConData);
            });
            conn2.write(incomingData);
        });
    });
    conn.on('error', function(error) {
        console.log("[REMOTE] - read " + error);
        socket.destroy();
    });
    socket.on('close', function() {
        console.log("[INFO] - Connection terminated for " + socket.remoteAddress + ":" + socket.remotePort);
        conn.destroy();
    });
});
server.listen(serverPort, function(){
    console.log("[INFO] - Server started on port: " + mainPort);
    console.log("[INFO] - Redirecting requests to: " + dhost + " at port " + dport);
});