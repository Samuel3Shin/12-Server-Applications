const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const multerGoogleStorage = require('multer-google-storage');

// const AWS = require('aws-sdk');
// const multerS3 = require('multer-s3');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

// const upload = multer({
//     storage: multerGoogleStorage.storageEngine({
//         bucket: 'samnodebird',
//         projectId: 'node-deploy-296700',
//         keyFilename: 'google_cloud_bukcet_key.json'
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 },
// })

// router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
//     console.log(req.file);
//     res.json({ url: req.file.path });
// })

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 하나를 업로드받은 뒤 이미지의 저장 경로를 클라이언트로 응답함.
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}`});
})

// 여기 주석처리된 코드들은, 클라우드에 업로드하려고 했던 코드들. 볼 필요 없음!!
// AWS.config.update({
//     accessKeyId: process.env.S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     region: 'ap-northeast-2',
// });

// const upload = multer({
//     storage: multerS3({
//         s3: new AWS.S3(),
//         bucket: 'nodebird',
//         key(req, file, cb) {
//             cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
//         },
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 },
// });

// router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
//     console.log(req.file);
//     res.json({ url: req.file.location });
// })

const upload2 = multer();

// 게시글 업로드하는 라우터.
// 데이터 형식은 multipart지만, 이미지 데이터가 없으므로, upload2.none()으로 처리함.
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
    try {
        console.log(req.body.content);
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        
        // 해시태그를 정규표현식으로 추출함.
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        if(hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({ // 해시태그를 찾고, 만약에 존재하면 가져오고, 존재하지 않으면 생성한 후에 가져온ㄸㄸ다.
                        // 해시태그에서 #을 떼고 소문자로 바꾼다.
                        where: {title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;