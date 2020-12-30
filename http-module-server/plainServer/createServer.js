const http = require('http')

console.log("Hello http server!");

// 요청이 들어올 때마다 매번 콜백 함수가 실행된다.
// req 객체는 요청에 관한 정보들을, res 객체는 응답에 관한 정보들을 담고 있다.
http.createServer((req, res) => {

});