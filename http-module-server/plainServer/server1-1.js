const http = require('http');

const server = http.createServer((req, res) => {
    // Header에 응답에 대한 정보를 입력
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    
    // Body에 클라이언트에 보낼 데이터 입력
    res.write('<h1>Hello Node!</h1>');

    // 나머지 데이터도 보내고 응답을 종료
    res.end('<p>Hello Server!</p>');
})

// 여기서 8080은 포트 번호를 의미한ㄷ.
// 포트는 서버 내에서 프로세스를 구분하는 번호이다.
// 서버는 HTTP 요청을 대기하는 것 외에도 데이터베이스와의 통신, FTP 요청 등을 처리해야 하므로,
// 프로세스에 포트를 다르게 할당하여 들어오는 요청을 구분한다.
server.listen(8080);

// () => {} 부분은 콜백 함수이다!
// 'listening', 'error' 이벤트 리스너를 붙이고, 이에 대한 콜백 함수를 정의!
server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기중입니다!');
});
server.on('error', (error) => {
    console.error(error);
})