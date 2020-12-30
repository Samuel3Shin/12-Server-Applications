const express = require('express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

const router = express.Router();

// Get /users와 Post /users 주소로 요청이 들어올 때의 라우터
router.route('/')
    .get(async (req, res, next) => {
        // 사용자 조회
        try {
            const users = await User.find({});
            res.json(users);
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        // 사용자 등록
        try {
            const user = await User.create({
                name: req.body.name,
                age: req.body.age,
                married: req.body.married,
            });
            console.log(user);
            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

// 댓글 document를 조회하는 라우터.
router.get('/:id/comments', async (req, res, next) => {
    try {
        // 댓글을 쓴 사용자의 아이디로 댓글을 조회한 뒤 populate 메서드로 관련 있는 컬렉션의 다큐먼트를 불러올 수 있다.
        // Comment 스키마 commentor 필드의 ref가 User로 되어 있으므로 알아서 users 컬렉션에서 사용자 다큐먼트를 찾아 합친다.
        // 그래서 commenter 필드가 사용자 다큐먼트로 치환된다.
        const comments = await Comment.find({ commenter: req.params.id })
            .populate('commenter');
        console.log(comments);
        res.json(comments);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
    
