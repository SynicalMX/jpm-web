const http = require('http');
// const fs = require('fs');

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

const server = http.createServer(function (req, res) {
    console.log('[' + getTimestamp() + '] ' + req.method + ' request recieved.');
    if (req.method == 'GET') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello, world!');
    } else {
        res.writeHead(402, {'Content-Type': 'text/plain'});
        res.write('This method is not supported.');
        res.end();
        console.log('[' + getTimestamp() + '] ' + 'An unsupported method was called.' )
    }
});

server.listen(PORT);
console.log('Server is running on port ' + PORT);
