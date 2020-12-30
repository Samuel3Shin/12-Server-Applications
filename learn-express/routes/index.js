const express = require('express');

// express.Router 를 사용하면 요청 메서드와 주소별로 분기 처리하지 않아도 되므로 코드가 깔끔해진다.
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, Express');
});

module.exports = router;