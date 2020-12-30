const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// 기존에 같은 이메일로 가입한 사용자가 있는지 검색하고, 있다면 다른 페이지로 redirect한다.
// 같은 이메일로 가입한 사용자가 없다면, 사용자 정보를 만들어서 저장한다. 이때 비밀먼호는 hash된 걸 저장한다.
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const {email, nick, password} = req.body;
    try {
        const exUser = await User.findOne({where: {email}});
        if(exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/edit_profile', isLoggedIn, async (req, res, next) => {
    console.log(req);
    const email = req.user.email;
    const new_nick = req.body.nick;
    const new_password = req.body.password;
    try {
        const exUser = await User.findOne({where: {email}});
        const hash = await bcrypt.hash(new_password, 12);
        await exUser.update(
            {nick: new_nick,
            password: hash},
        ).then((data) => {
            console.log('닉네임은 ', data.dataValues.nick);
        });

        console.log("사용자 정보를 성공적으로 변경하였습니다.");
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }

        if(!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;