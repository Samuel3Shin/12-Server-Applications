// 위키 웹 서버


// 데이터 베이스에 접속
const path = require('path')
const NeDB = require('nedb')
const db = new NeDB({
    filename: path.join(__dirname, 'wiki.db'),
    autoload: true
})

// 웹 서버 실행
const express = require('express')

// POST 메서드로 데이터를 활용하므로 body-parser 모듈을 사용
const bodyParser = require('body-parser')
const app = express()
const portNum = 3000

app.use(bodyParser.urlencoded({extended: true}))
app.listen(portNum, () => {
    console.log('서버 실행 완료:', `http://localhost:${portNum}`)
})


// 위키 데이터를 응답하는 API
app.get('/api/get/:wikiname', (req, res) => {
    const wikiname = req.params.wikiname
    db.find({name: wikiname}, (err, docs) => {
        if(err) {
            res.json({status: false, msg: err})
            return
        }
        if(docs.length === 0) {
            docs = [{name: wikiname, body: ''}]
        }

        res.json({status: true, data: docs[0]})
    })
})

// 위키 데이터를 작성하는 API
app.post('/api/put/:wikiname', (req, res) => {
    const wikiname = req.params.wikiname
    console.log('/api/put/' + wikiname, req.body)

    // 기존에 존재하는 엔트리인지 확인
    db.find({'name': wikiname}, (err, docs) => {
        if(err) {
            res.json({status: false, msg: err})
            return
        }

        const body = req.body.body
        if(docs.length === 0) { // 기존 엔트리가 없다면 삽입
            db.insert({name: wikiname, body})
        } else { // 기존 엔트리가 있다면 수정
            db.update({name: wikiname}, {name: wikiname, body})
        }

        res.json({status: true})
    })
})

// express.static 을 이용해서 public 디렉터리 공개
app.use('/wiki/:wikiname', express.static('./public'))
app.use('/edit/:wikiname', express.static('./public'))
app.get('/', (req, res) => {
    res.redirect(302, '/wiki/FrontPage')
})