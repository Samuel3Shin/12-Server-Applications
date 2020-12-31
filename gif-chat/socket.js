const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });

  // 라우터에서 req.app.get('io')로 접근할 수 있게 app.set()한다.
  app.set('io', io);

  // Socket.IO에 네임스페이스를 부여한다. 같은 네임스페이스끼리만 데이터를 전달한다.
  // 채팅방 생성 및 삭제에 관한 정보를 전달하는 /room 네임스페이스와
  // 채팅 메시지를 전달하는 /chat 네임스페이스
  const room = io.of('/room');
  const chat = io.of('/chat');

  // io.use 메서드에 미들웨어를 장착할 수 있다. 이 부분은 모든 웹 소켓 연결 시마다 실행된다.
  io.use((socket, next) => {
    cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  // room 네임스페이스에 이벤트 리스너를 붙여준다.
  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => { 
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const { headers: { referer } } = req;
    // console.log('리퀘스트는요?');
    // console.log(req);
    
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
    socket.join(roomId);

    // socket.to(방 아이디) 메서드로 특정 방에 데이터를 보낼 수 있다.
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
      number: `참여인원: ${socket.adapter.rooms[roomId].length}`,
      owner: socket.adapter.rooms[roomId].owner,
    });

    socket.on('disconnect', () => { 
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);
      const currentRoom = socket.adapter.rooms[roomId];

      const userCount = currentRoom ? currentRoom.length : 0;

      if (userCount === 0) { // 유저가 0명이면 방 삭제
        console.log(req.signedCookies)
        const signedCookie = cookie.sign(req.signedCookies['connect.sid'] , process.env.COOKIE_SECRET);
        const connectSID = `${signedCookie}`;

        axios.delete(`http://localhost:8005/room/${roomId}`, {
          headers: {
            Cookie: `connect.sid=s%3A${connectSID}`
          }
        })
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
          number: `참여인원: ${userCount}`,
          owner:  socket.adapter.rooms[roomId].owner,
        });
      }
    });
  });
};