const express = require('express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find({});
        const comments = await Comment.find({});
        res.render('mongoose', { users, comments });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;