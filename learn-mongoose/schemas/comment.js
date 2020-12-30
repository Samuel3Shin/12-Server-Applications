const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const commentSchema = new Schema({
    // commenter의 자료형이 ObjectId인데, 옵션으로 ref 속성의 값을 User로 넣었다.
    // 나중에 몽구스가 JOIN과 비슷한 기능을 할 때 사용된다.
    commenter: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    
    comment: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', commentSchema);