const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    // Set-Cookie는 브라우저에게 보내주는 값의 쿠키를 저장하라는 의미.
    res.writeHead(200, {'Set-Cookie':'mycookie=test'});
    res.end('Hello Cookie');
})
.listen(8083, () => {
    console.log('8083번 포트에서 서버 대기 중입니다!');
});