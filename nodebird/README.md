# 나름 복잡한 SNS

카카오 로그인, 그냥 로그인, 이미지 업로드, 게시글 작성, 해시태그 검색, 팔로잉 기능이 있는 SNS 서비스 <br>
MySQL을 wrapping 하는 sequalize 모듈을 이용한다. <br>


/models: MySQL 코드들 <br>
/routes: express.Router 코드들 <br>
/view: nunjucks로 작성된 프론트엔드 html 코드들 <br>
/passport: passport module을 이용해서 로그인 구현한 부분 <br>

실행 명령어 <br>
$ npm install <br>
$ npm start <br>

![nodebird](./screenshots/login.png) <br>
![nodebird](./screenshots/timeline.png)