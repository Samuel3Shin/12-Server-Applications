const express = require('express')
const app = express()

// post 메서드 요청을 받았을 때, 그 데이터를 활용하기 위해 body-parser 모듈이 필요하다.
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// post 요청을 처리하는 예제

app.listen(3000, () => {
    console.log('서버 실행 완료 - http://localhost:3000')
})

// root 페이지에서는 입력 양식을 응답한다.
app.get('/', (req, res) => {
    res.send('<form method="POST">' +
    '<textarea name="memo">테스트</textarea>' +
    '<br /><input type="submit" value="전송">' +
    '</form>')
})

// post 메서드에 대해 응답한다.
app.post('/', (req, res) => {
    console.log(JSON.stringify(req.body))
    res.send('POST 되었습니다.')
})