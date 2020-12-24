// require는 모듈을 읽어들이는 명령어다.
// node_modules 폴더에 있는 express 모듈을 불러온다.
const express = require('express')

// express 객체 생성
const app = express()
const portNum = 3000

// URL에 따라 분기 처리한다.
// 루트에 접근할 때 응답하는 코드
// app.get은 get 요청을 처리한다.
app.get('/', (req, res, next) => {
    if (!req.query.q) {

        // URL에 ?key1=value1&key2=value2 같은 URL 매개변수(쿼리 문자열)가 있으면
        // req.query.key1 또는 req.query.key2 등으로 값을 추출할 수 있다.
        res.send(
            '<p><a href="?q=6">6면체 주사위</a><br />' +
            '<a href="?q=12">12면체 주사위</a></p>'
        )
    } else {
        const q = parseInt(req.query.q, 10)
        res.send(
            '주사위의 값은...' + dice(q)
        )
    }

})

// 주사위 페이지에 접근할 때 응답하는 코드
app.get('/dice/:num', (req, res) => {
    res.send('주사위의 값은...' + dice(req.params.num))
})

function dice(n) {
    return Math.floor(Math.random() * n) + 1
}

app.listen(portNum, () => {
    console.log('서버 실행 완료: ', `http://localhost:${portNum}`)
})