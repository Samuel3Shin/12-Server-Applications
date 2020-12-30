const express = require('express');
const Comment = require('../schemas/comment');

const router = express.Router();

// 댓글을 등록하는 라우터.
router.post('/', async (req, res, next) => {
    try {
        const comment = await Comment.create({
            commenter: req.body.id,
            comment: req.body.comment,
        });
        console.log(comment);
        // path 옵션으로 어떤 필드를 합칠지 설정한다.₩
        const result = await Comment.populate(comment, { path: 'commenter' });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 댓글을 수정하는 라우터
router.route('/:id')
    .patch(async (req, res, next) => {
        try {
            // 첫번째 인수로 수정할 다큐먼트 id, 두번째 인수로는 수정할 필드와 값을 기입한다.
            const result = await Comment.update({
                _id: req.params.id,
            }, {
                comment: req.body.comment,
            });
            res.json(result);
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const result = await Comment.remove({ _id: req.params.id });
            res.json(result);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

module.exports = router;