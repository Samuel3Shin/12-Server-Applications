const SSE = require('sse');

// 서버센트 이벤트 모듈을 불러와 new SSE(express 서버)로 서버 객체를 생성한다.
module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connection', (client) => {
        setInterval(() => {
            client.send(Date.now().toString());
        }, 1000);
    });
};
