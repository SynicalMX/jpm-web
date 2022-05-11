// Import libraries
const http = require('http');
const fs = require('fs');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore();

// Import functions
import { checkForPackage } from './database.js';

const path = __dirname.substring(0, __dirname.lastIndexOf('\\'));
const PORT = 8338;

// Gets current time and formats it for a timestamp
function getTimestamp() {
    let date = new Date();

    let h = date.getHours();
    let m = date.getMinutes();

    if (m < 9) {
        m = '0' + m.toString();
    }

    return h.toString() + ':' + m.toString();
}

// Main server
const server = http.createServer(function (req, res) {
    console.log('[' + getTimestamp() + '] ' + req.method + ' request recieved.');

    let method = req.url.substring(req.url.indexOf('/')+1, req.url.lastIndexOf('/'));
    let pkg = req.url.substring(req.url.lastIndexOf('/')+1, req.url.length);

    if (req.method == 'GET') {
        if (checkForPackage(pkg) && method == 'check') {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Package found!');
            return
        } else if (method == 'check') {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Package not found!');
            return
        }
        
        if (checkForPackage(pkg) && method == 'content') {
            let json = JSON.parse(fs.readFileSync(path + '\\packages\\' + pkg + '.json', 'utf-8'));
            res.writeHead(200, {'Content-Type': 'text/json'});
            res.end(JSON.stringify(json.content));
            return
        }

        res.writeHead(404, {'Content-Type': 'text/json'});
        res.end('404 Not Found');
    } else {
        res.writeHead(402, {'Content-Type': 'text/plain'});
        res.write('This method is not supported.');
        res.end();
        console.log('[' + getTimestamp() + '] ' + 'An unsupported method was called.' );
    }
});

// Start server
server.listen(PORT);
console.log('Server is running on port ' + PORT);
quickstartListen(db);
