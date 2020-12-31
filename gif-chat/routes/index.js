const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF 채팅방' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/room', (req, res) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
});

// 채팅방을 만드는 라우터.
// app.set('io', io)로 저장했던 io 객체를 req.app.get('io')로 가져온 후
// io.of('/room').emit 메서드로 /room 네임스페이스에 연결한 모든 클라이언트에 데이터를 보낸다.
// 그러므로 GET / 라우터에 접속한 모든 클라이언트가 새로 생성된 채팅방에 대한 데이터를 받을 수 있다.
router.post('/room', async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password,
    });
    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 채팅방을 렌더링하는 라우터.
// io.of('/chat').adpater.rooms에는 방 목록이 들어있다.
// io.of('/chat').adapter.rooms[req.params.id]를 하면 해당 방의 소켓 목록이 나온다. 이를 통해 해당 방의 참가 인원 수를 알 수 있다.
router.get('/room/:id', async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get('io');
    if (!room) {
      return res.redirect('/?error=존재하지 않는 방입니다.');
    }
    if (room.password && room.password !== req.query.password) {
      return res.redirect('/?error=비밀번호가 틀렸습니다.');
    }
    const { rooms } = io.of('/chat').adapter;
    var userCount = 1;
    if(rooms && rooms[req.params.id]) {
      userCount = rooms[req.params.id].length + 1;
    }
    if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
      return res.redirect('/?error=허용 인원이 초과하였습니다.');
    }

    // 방에 접속 시 기존 채팅 내역을 불러온다.
    const chats = await Chat.find({room: room._id}).sort('createdAt');
    return res.render('chat', {
      room,
      title: room.title,
      chats,
      user: req.session.color,
      number: `참여인원: ${userCount}`,
      owner: room.owner,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 채팅방을 삭제하는 라우터.
// 채팅방과 채팅 내역을 삭제한 후 2초 뒤에 웹 소켓으로 /room 네임스페이스에 방이 삭제되었음을 알린다.
router.delete('/room/:id', async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send('ok');
    setTimeout(() => {
      req.app.get('io').of('/room').emit('removeRoom', req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/room/:id/chat', async(req, res, next) => {
  try {
    const chat = await  Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    // 같은 방에 들어있는 소켓들에게 메시지 데이터를 전송한다.
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

try {
  fs.readdirSync('uploads');
} catch (err) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024},
});

router.post('/room/:id/gif', upload.single('gif'), async(req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;