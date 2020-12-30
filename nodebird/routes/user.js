const express = require('express');
const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Post= require('../models/post');
const router = express.Router();

// ":id" 부분이 req.params.id가 된다. 먼저 팔로우할 사용자를 데이터베이스에서 조회한 후,
// 시퀄라이즈에서 추가한 addFollowing 메서드로 현재 로그인한 사용자와의 관계를 지정한다.
router.post('/:id/follow', isLoggedIn, async(req, res, next) => {
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if(user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/unfollow', isLoggedIn, async(req, res, next) => {
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if(user) {
            await user.removeFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/post-delete', isLoggedIn, async(req, res, next) => {
    try {
        console.log(req.body.value);

        const item = await Post.findOne({
            where: {
                id: req.body.value,
            }
        })
        await item.destroy();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/post-like', isLoggedIn, async(req, res, next) => {
    try {
        console.log(req.body.value);

        const user = await User.findOne({where: {id: req.user.id}});
        const post = await Post.findOne({
            where: {
                id: req.body.value,
            }
        })
        user.addLikedPosts(post);
        post.addLikedUsers(user);
        console.log("like 성공했당!");

        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/post-unlike', isLoggedIn, async(req, res, next) => {
    try {
        console.log(req.body.value);

        const user = await User.findOne({where: {id: req.user.id}});
        const post = await Post.findOne({
            where: {
                id: req.body.value,
            }
        })
        user.removeLikedPosts(post);
        post.removeLikedUsers(user);
        console.log("like 취소 성공했당!");

        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});




module.exports = router;