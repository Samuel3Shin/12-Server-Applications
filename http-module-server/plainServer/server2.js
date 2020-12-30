const http = require('http')
const fs = require('fs').promises;

// fs 모듈로 html 파일을 읽어서 응답을 한다!
http.createServer(async (req, res) => {
    try {
        // 아래 data 변수에는 버퍼가 저장된다. 하지만 이 버퍼를 그냥 바로 응답으로 보내도 된다.
        const data = await fs.readFile('./server2.html')
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(data);
    } catch (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'});
        res.end(err.message)
    }
    
})
.listen(8081, () => {
    console.log('8081번 포트에서 서버 대기중입니다!');
});