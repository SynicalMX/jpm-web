const http = require('http');
const fs = require('fs');

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

initializeApp({
    credential: applicationDefault()
});
  
const db = getFirestore();
async function quickstartListen(db) {
    // [START firestore_setup_dataset_read]
    const snapshot = await db.collection('packages').get();
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
    // [END firestore_setup_dataset_read]
}

const path = __dirname.substring(0, __dirname.lastIndexOf('\\'));
const PORT = 8338;

function getTimestamp() {
    let date = new Date();

    let h = date.getHours();
    let m = date.getMinutes();

    if (m < 9) {
        m = '0' + m.toString();
    }

    return h.toString() + ':' + m.toString();
}

function checkForPackage(package) {
    let b = fs.existsSync(path + '\\packages\\' + package + '.json');
    return b;
}

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

server.listen(PORT);
console.log('Server is running on port ' + PORT);
quickstartListen(db);
