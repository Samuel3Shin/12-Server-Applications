// sns-server.js 와 연동되어서 데이터베이스를 처리하는 코드

const path = require('path')
const NeDB = require('nedb')

// 사용자 정보 데이터베이스에 접속
const userDB = new NeDB({
    filename: path.join(__dirname, 'user.db'),
    autoload: true
})

// 타임라인 전용 데이터베이스 접속
const timelineDB = new NeDB({
    filename: path.join(__dirname, 'timeline.db'),
    autoload: true
})

// sha512 해시 추출
// 디비에 저장된 비밀번호는 해시값이다.
// salt 를 추가했으므로, 데이터베이스가 유출되어도 비밀번호를 알아내기 어렵다.
function getHash (pw) {
    const salt = '::EVuCM0QwfI48Krpr'
    const crypto = require('crypto')
    const hashsum = crypto.createHash('sha512')
    hashsum.update(pw + salt)
    return hashsum.digest('hex')
}

// 인증 전용 토큰 생성
function getAuthToken (userid) {
    const time = (new Date()).getTime()
    return getHash(`${userid}:${time}`)
}

// 아래부터는 API에서 사용하는 DB 조작 함수
// 사용자 검색
function getUser (userid, callback) {
    userDB.findOne({userid}, (err, user) => {
        if (err || user === null) return callback(null)
        callback(user)
    })
}

// 사용자 추가
function addUser (userid, passwd, callback) {
    const hash = getHash(passwd)
    const token = getAuthToken(userid)
    const regDoc = {userid, hash, token, friends: {}}
    userDB.insert(regDoc, (err, newdoc) => {
        if (err) return callback(null)
        callback(token)
    })
}

// 로그인 처리
function login (userid, passwd, callback) {
    const hash = getHash(passwd)
    const token = getAuthToken(userid)

    getUser(userid, (user) => {
        if (!user || user.hash !== hash) {
            return callback(new Error('인증 오류'), null)
        }
        // 인증 토큰 변경
        user.token = token
        updateUser(user, (err) => {
            if (err) return callback(err, null)
            callback(null, token)
        })
    })
}

// 인증 토큰 확인
function checkToken (userid, token, callback) {
    getUser(userid, (user) => {
        if (!user || user.token !== token) {
            return callback(new Error('인증 실패'), null)
        }
        callback(null, user)
    })
}

// 사용자 정보 변경
function updateUser(user, callback) {
    userDB.update({userid: user.userid}, user, {}, (err, n) => {
        if (err) return callback(err, null)
        callback(null)
    })
}

// 사용자의 친구 목록을 기반으로 타임라인 DB에서 사용자들의 글을 추출
function getFriendsTimeline (userid, token, callback) {
    checkToken(userid, token, (err, user) => {
        if (err) return callback(new Error('인증 실패'), null)
        const friends = []
        for (const f in user.friends) friends.push(f)
        friends.push(userid)

        timelineDB
            .find({userid: {$in: friends}})
            .sort({time: -1})
            .limit(20)
            .exec((err, docs) => {
                if (err) {
                    callback(new Error('DB 오류'), null)
                    return
                }
                callback(null, docs)
            })
    })
}

module.exports = {
    userDB, timelineDB, getUser, addUser, login, checkToken, updateUser, getFriendsTimeline
}