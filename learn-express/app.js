const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// dotenv 패키지는 .env 파일을 읽어서 process.env로 만든다.
// process.env를 별도의 파일로 관리하는 이유는 보안과 설정의 편의성때문이다! <- 소스코드가 유출되어도 .env 파일만 잘 관리하면 비밀 키를 지킬 수 있다.
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// ./routes/index로 안 해도, 어차피 default 값은 index.js 이므로 생략 가능!
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

// Express 모듈을 실행해 app 변수에 할당한다. express 내부에 http 모듈이 내장돼있다.
const app = express();

// app.set(키, 값)으로 데이터를 저장하면, app.get(키)로 데이터를 불러올 수 있다.
app.set('port', process.env.PORT || 3000);


// 미들웨어는 위에서부터 아래로 순서대로 실행되면서 요청과 응답 사이에 특별한 기능을 추가해준다.
app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

// next는 다음 미들웨어로 넘어가는 함수이다. next를 실행하지 않으면 다음 미들웨어가 실행되지 않는다.
// 위에 app.use 인데 아무런 변수가 없는 부분은, 미들웨어 내부에 이미 다 들어가있는 것이다. next도 내부적으로 호출되기에 다음 미들웨어로 넘어갈 수 있다.
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// 미들웨어는 req, res, next를 매개변수로 가지는 함수인데, 예외적으로 예외처리할 때만 err 매개변수가 추가된다. 
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});