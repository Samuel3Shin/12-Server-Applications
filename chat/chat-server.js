// 실시간 채팅 서버 코드


// HTTP 서버 생성
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const portNum = 3000
server.listen(portNum, () => {
    let today = new Date();
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초
    let milliseconds = today.getMilliseconds(); // 밀리초
    console.log(hours + '시 ' + minutes + '분 ' + seconds + '초 ' + milliseconds);
    
    console.log('[서버] 실행 완료:', 'http://localhost:' + portNum)
})

// express.static 으로 /public 디렉터리에 있는 페이지들을 공개한다.
app.use('/public', express.static('./public'))
app.get('/', (req, res) => {
    res.redirect(302, '/public')
})

// 웹 소켓 서버 실행한다. Socket.IO는 만약 웹소켓을 사용할 수 없는 경우에도
// HTTP 통신을 사용해 유사적으로 상호 통신할 수 있도록 해준다.
// 그러므로 Socket.IO 서버 객체를 생성할 때 http server 객체를 전달하는 것이다.
const socketio = require('socket.io')
const io = socketio.listen(server)

// 클라이언트가 접속했을 때의 이벤트 설정
io.on('connection', (socket) => {
    let today = new Date();
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초
    let milliseconds = today.getMilliseconds(); // 밀리초
    console.log(hours + '시 ' + minutes + '분 ' + seconds + '초 ' + milliseconds);

    console.log('[서버] 클라이언트의 소켓이 연결됨')
    console.log('[서버] 사용자 접속:', socket.client.id)

    // 메시지를 받을 경우.
    // 'chat-msg'라는 변수는 개발자가 임의로 정할 수 있다.
    socket.on('chat-msg', (msg) => {
        let today = new Date();
        let hours = today.getHours(); // 시
        let minutes = today.getMinutes();  // 분
        let seconds = today.getSeconds();  // 초
        let milliseconds = today.getMilliseconds(); // 밀리초
        console.log(hours + '시 ' + minutes + '분 ' + seconds + '초 ' + milliseconds);

        console.log('[서버] 메시지를 받음. message:', msg)
        // "io.emit(<메시지 종류>, <데이터>)"로 모든 클라이언트에게 메시지를 전달한다.
        io.emit('chat-msg', msg)
    })
})
