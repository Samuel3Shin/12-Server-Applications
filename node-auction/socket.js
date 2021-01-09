const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server, {path: '/socket.io'});
    app.set('io', io);
    io.on('connection', (socket) => { // 웹 소켓 연결 시

        // 주소로부터 경매방 아이디를 받아와 socket.join으로 해당 방에 입장한다.
        const req = socket.request;
        const { headers: {referer}} = req;
        const roomId = referer.split('/')[referer.split('/').length -1];
        socket.join(roomId);

        // 연결이 끊겼다면, socket.leave로 해당 방에서 나간다.
        socket.on('disconnect', () => {
            socket.leave(roomId);
        });
    });
};

