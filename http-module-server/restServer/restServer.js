const http = require('http')
const fs = require('fs').promises;

// 데이터베이스 대용으로 사용자 정보를 저장할 users 객체.
const users = {};

// req는 내부적으로 readStream,
// res는 내부적으로 writeStream으로 되어있다!
http.createServer(async (req, res) => {
    try {
        console.log(req.method, req.url);

        // req.method 로 HTTP 요청 메서드를 구분
        if(req.method === 'GET') {
            if(req.url === '/') {
                const data = await fs.readFile('./restFront.html');
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                return res.end(data);
            } else if(req.url === '/about') {
                const data = await fs.readFile('./about.html');
                res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8'});
                return res.end(data);
            } else if (req.url === '/users') {
                res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
                return res.end(JSON.stringify(users));
            }

            // 주소가 '/', '/about', '/users' 셋 다 아닐 경우
            try {
                const data = await fs.readFile(`.${req.url}`);
                // 여기서 return 을 붙이지 않으면, 함수가 종료되지 않으므로 조심!!!
                return res.end(data);
            } catch (err) {
                // 주소에 해당하는 라우트를 못 찾았다는 404 Not Found error 발생
            }
        } else if(req.method === 'POST') {
            if (req.url === '/user') {
                let body = '';
                // 요청의 body를 stream 형식으로 받음
                req.on('data', (data) => {
                    body += data;
                });
                
                // 요청의 body를 다 받은 후에 실행됨
                return req.on('end', () => {
                    console.log('POST 본문(Body):', body);
                    const { name } = JSON.parse(body);
                    const id = Date.now();
                    users[id] = name;
                    res.writeHead(201);
                    res.end('등록 성공');
                });
            }
        } else if (req.method === 'PUT') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', (data) => {
                    body += data;
                });
                return req.on('end', () => {
                    console.log('PUT 본문(Body):', body);
                    users[key] = JSON.parse(body).name;
                    return res.end(JSON.stringify(users));
                });
            }
        } else if (req.method === 'DELETE') {
            if (req.url.startsWith('/user/')) {
                const key = req.url.split('/')[2];
                delete users[key]
                return res.end(JSON.stringify(users));
            }
        }

        res.writeHead(404);
        return res.end('NOT FOUND');
    } catch (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'});
        res.end(err.message)
    }
    
})
.listen(8082, () => {
    console.log('8082번 포트에서 서버 대기중입니다!');
});