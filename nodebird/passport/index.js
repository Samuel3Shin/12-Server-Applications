const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {

    // serializeUser는 로그인 시 실행되며, req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드이다.
    // 매개변수로 user를 받고 나서, done 함수에 두 번째 인수로 user.id를 넘긴다.
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // deserializeUser는 매 요청시 실행된다. 
    // passport.session 미들웨어가 이 메서드를 호출한다.
    // serializeUser의 done의 두번째 인수로 넣었던 user.id가 deserializeUser의 매개변수가 된다.
    // 즉 serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것이고, deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것이다.
    // 세션에 불필요한 데이터를 당마두지 않기 위한 과정이다.
    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            },{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
        })
            .then(user => done(null, user)) // 여기서 user를 req.user에 저장한다.
            .catch(err => done(err));
    });

    local();
    kakao();
};