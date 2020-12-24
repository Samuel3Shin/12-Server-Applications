// 게시판 애플리케이션의 웹 서버 코드!
 
const NeDB = require('nedb')
const path = require('path')

// 데이터베이스 객체 생성
// 생성되는 파일인 bbs.db는 클릭해보면 알 수 있듯이 JSON과 비슷한 형식이다.
const db = new NeDB({
    filename: path.join(__dirname, 'bbs.db'),
    autoload: true
})

// express로 서버 실행
const express = require('express')
const app = express()
const portNum = 3000
app.listen(portNum, () => {
    console.log('서버 실행 완료:',  `http://localhost:${portNum}`)
})

// express.static 을 이용해서 /public 디렉터리의 내용을 응답한다.
// 예를 들어 /public/xxx로 접근하면 ./public/xxx 에 있는 파일을 응답한다.
app.use('/public', express.static('./public'))

// root 페이지로 접속하면 /public으로 리다이렉트한다.
app.get('/', (req, res) => {
    res.redirect(302, '/public')
})

// 서버 API를 정의하는 부분
// 로그 추출 API
app.get('/api/getItems', (req, res) => {
    // DB에 저장돼있는 모든 로그 데이터를 시간 순서로 정렬해서 응답한다.
    db.find({}).sort({stime: 1}).exec((err, data) => {
        if(err) {
            sendJSON(res, false, {logs: [], msg: err})
            return
        }
        console.log(data)
        sendJSON(res, true, {logs: data})
    })
})

// 로그 작성 API
app.get('/api/write', (req, res) => {
    const q = req.query
    // URL 매개변수로 받은 name과 body값을 DB에 저장한다.
    db.insert({
        name: q.name,
        body: q.body,
        stime: (new Date()).getTime()
    }, (err, doc) => {
        if (err) {
            console.error(err)
            sendJSON(res, false, {msg: err})
            return
        }
        sendJSON(res, true, {id: doc._id})
    })
})


function sendJSON (res, result, obj) {
    obj['result'] = result
    res.json(obj)
}