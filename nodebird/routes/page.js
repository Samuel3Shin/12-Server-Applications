const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    // console.log(req);

    // 모든 템플릿 엔진에서 공통으로 사용하는 값들이기 때문에, res.locals로 값을 설정한다.
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {title: '내 정보 - NodeBird'});
});

router.get('/edit_profile', isLoggedIn, (req, res) => {
    res.render('edit_profile', {title: '내 정보변경'})
})

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {title: '회원가입 - NodeBird'});
});

router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', "DESC"]],
        });

        // const likedPosts = await PostLike.findAll({
        //     where: {
        //         UserId: 3,
        //     }
        // })

        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 데이터베이스에서 해당 해시태그를 검색한 후, 해시태그가 있다면 시퀄라이즈에서 제공하는 getPosts 메서드로 모든 게시글을 가져온다.
// 게시글을 가져올 때는 작성자 정보를 합친다.
router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if(!query) {
        return res.redirect('/');
    }

    try {
        // 먼저 게시글을 조회한 뒤 결과를 twits에 넣어 렌더링한다.
        const hashtag = await Hashtag.findOne({where: {title:query}});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({include:[{model: User}]});
        }

        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

module.exports = router;