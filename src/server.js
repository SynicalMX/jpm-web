// Import libraries
const express = require('express');
const app = express();
const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../firebase/admin.json');

initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();

function checkForPackage(pkg) {
    var database = db.collectionGroup('packages').where('name', '==', pkg);
    database.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log(doc.id, ' => ', doc.data());
        });
    });
    return true;
}

const path = __dirname.substring(0, __dirname.lastIndexOf('\\'));
const PORT = 8338;

/* 
    Untility Functions
*/
function getTimestamp() {
    let date = new Date();

    let h = date.getHours();
    let m = date.getMinutes();

    if (m < 9) {
        m = '0' + m.toString();
    }

    return h.toString() + ':' + m.toString();
}

// Main Server Functions

app.get('/check/*', (req, res) => {
    let pkg = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.length);

    console.log('[' + getTimestamp() + '] Check request recieved.');

    if (checkForPackage(pkg)) {
        console.log('Wrote to ' + req.ip)
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Package found!');
    } else {
        console.log('Wrote an error to ' + req.ip)
        res.writeHead(404, { 'Content-Type': 'text/json' });
        res.end('404 Not Found');
    }
});

app.get('/content/*', (req, res) => {
    let pkg = req.url.substring(req.url.lastIndexOf('/') + 1, req.url.length);

    console.log('[' + getTimestamp() + '] Content request recieved.');

    if (checkForPackage(pkg)) {
        let json = JSON.parse(fs.readFileSync(path + '\\packages\\' + pkg + '.json', 'utf-8'));
        res.writeHead(200, { 'Content-Type': 'text/json' });
        res.end(JSON.stringify(json.content));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/json' });
        res.end('404 Not Found');
    }
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${process.env.PORT || PORT}`);
});
