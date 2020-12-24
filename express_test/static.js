// require는 모듈을 읽어들이는 명령어다.
// node_modules 폴더에 있는 express 모듈을 불러온다.
const express = require('express')

// express 객체 생성
const app = express()

// 로컬호스트 포트 3000에 서버 실행
app.listen(3000, () => {
    console.log('서버 실행 완료 - http://localhost:3000')
})

// express.static 을 이용해서 /html 디렉토리에 있는 html 파일들을 응답한다.
// express.static 을 사용하면 특정 디렉터리 내부의 파일을 모두 서버에 공개할 수 있다.
app.use('/', express.static('./html'))