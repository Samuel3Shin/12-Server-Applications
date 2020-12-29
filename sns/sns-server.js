// 웹서버, 데이터베이스 관련 기능을 넣은 메인 코드

// 데이터베이스와 데이터를 주고 받는 모듈 import
const db = require('./server/database')

// 웹 서버를 실행
const express = require('express')
const app = express()
const portNum = 3000
app.listen(portNum, () => {
    console.log('서버 실행 완료:', `http://localhost:${portNum}`)
})

// 사용자 추가 API
app.get('/api/adduser', (req, res) => {
    const userid = req.query.userid
    const passwd = req.query.passwd
    if (userid === '' || passwd === '') {
        return res.json({status: false, msg: '필요한 요소를 입력하지 않았습니다.'})
    }

    db.getUser(userid, (user) => {
        if (user) {
            return res.json({status: false, msg: '이미 존재하는 사용자입니다.'})
        }

        db.addUser(userid, passwd, (token) => {
            if (!token) {
                res.json({status: false, msg: 'DB 오류'})
            }
            res.json({status: true, token})
        })
    })
})

// 로그인 API - 로그인하면 토큰 응답
app.get('/api/login', (req, res) => {
    const userid = req.query.userid
    const passwd = req.query.passwd
    db.login(userid, passwd, (err, token) => {
        if (err) {
            res.json({status: false, msg: '인증 오류'})
            return
        }
        res.json({status: true, token})
    })
})

// 친구 추가 API - 인증 토큰을 확인하고, 사용자 정보의 친구 정보를 변경
app.get('/api/add_friend', (req, res) => {
    const userid = req.query.userid
    const friendid = req.query.friendid
    const token = req.query.token
    db.checkToken(userid, token, (err, user) => {
        if (err) {
            res.json({status: false, msg: '인증 오류'})
            return
        }

        user.friends[friendid] = true
        db.updateUser(user, (err) => {
            if (err) {
                res.json({status: false, msg: 'DB 오류'})
                return
            }
            res.json({status: true})
        })
    })
})

// 타임라인에 커멘트 작성 - 인증 토근을 확인하고, 코멘트를 작성
app.get('/api/add_timeline', (req, res) => {
    const userid = req.query.userid
    const token = req.query.token
    const comment = req.query.comment
    const time = (new Date()).getTime()
    db.checkToken(userid, token, (err, user) => {
        if (err) {
            res.json({status: false, msg: '인증 오류'})
            return
        }

        const item = {userid, comment, time}
        db.timelineDB.insert(item, (err, it) => {
            if (err) {
                res.json({status: false, msg: 'DB 오류'})
                return
            }
            res.json({status: true, timelineid: it._id})
        })
    })
})

// DB에 등록돼 있는 모든 사용자 정보를 응답
app.get('/api/get_allusers', (req, res) => {
    db.userDB.find({}, (err, docs) => {
        if (err) return res.json({status: false})
        const users = docs.map(e => e.userid)
        res.json({status: true, users})
    })
})

// 사용자 정보를 응답
app.get('/api/get_user', (req, res) => {
    const userid = req.query.userid
    db.getUser(userid, (user) => {
        if (!user) return res.json({status: false})
        res.json({status: true, friends: user.friends})
    })
})

// 친구 타임라인 응답
app.get('/api/get_friends_timeline', (req, res) => {
    const userid = req.query.userid
    const token = req.query.token
    db.getFriendsTimeline(userid, token, (err, docs) => {
        if (err) {
            res.json({status: false, msg: err.toString()})
            return
        }
        res.json({status: true, timelines: docs})
    })
})

// express.static으로 정적 웹페이지 응답
app.use('/public', express.static('./public'))
app.use('/login', express.static('./public'))
app.use('/users', express.static('./public'))
app.use('/timeline', express.static('./public'))
app.use('/', express.static('./public'))
