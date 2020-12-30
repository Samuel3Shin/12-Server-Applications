const http = require('https');
const fs = require('fs');
const path = require('path');

http.createServer({
    cert: fs.readFileSync(path.join(__dirname, '../../keys/server.crt')).toString(),
    key: fs.readFileSync(path.join(__dirname, '../../keys/server.key')).toString(),
    ca: [
        fs.readFileSync(path.join(__dirname, '../../keys/rootCA.pem')).toString(),
        fs.readFileSync(path.join(__dirname, '../../keys/rootCA.key')).toString(),
    ],
}, (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})
.listen(443, () => {
    console.log('443번 포트에서 서버 대기중입니다!');
});