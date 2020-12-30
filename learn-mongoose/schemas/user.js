const mongoose = require('mongoose');

// 몽구스 스키마를 생성한다.
const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    married: {
        type: Boolean,
        required: true,
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);