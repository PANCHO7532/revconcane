/*
* Reverse connection card network (RCCN) // Client-side module
* Copyright PANCHO7532 - P7COMunications LLC [PRIVATE SOFTWARE]
*
* Exploit restricted ISP/Network environment with open ports for access internet/services
*/
//UPDATE 26/07/2020... rewriting this shit again before i throw it into flames
const net = require('net');
const event = require('events').EventEmitter;
const inspect = require('util').inspect;
// lets create a new event!
// This event should be invoked on new server request i guess
const connectionHandler = new event();
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