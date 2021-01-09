const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 24시간 지난 후에 낙찰자를 정하도록 구현하기 위해 node-schedule 모듈을 이용한다.
const schedule = require('node-schedule');

const { Good, Auction, User, sequelize } = require('../models');
const { idLoggedIn, isNotLoggedIn, isLoggedIn } = require('./middlewares');
const { renderString } = require('nunjucks');
const { ExclusionConstraintError } = require('sequelize');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// 메인 화면을 렌더링한다.
// 경매가 진행 중인 상품 목록도 같이 불러온다.
router.get('/', async(req, res, next) => {
    try {
        const goods = await Good.findAll({where: {SoldId: null}});
        res.render('main', {
            title: 'NodeAuction',
            goods,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 회원가입 화면 렌더링
router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeAuction',
    });
});

// 상품 등록 화면 렌더링
router.get('/good', isLoggedIn, (req, res) => {
    res.render('good', {title: '상품 등록 - NodeAuction'});
});

try {
    fs.readdirSync('uploads');
} catch (err) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});


// 업로드한 상품을 처리
router.post('/good', isLoggedIn, upload.single('img'), async(req, res, next) => {
    try {
        const {name, price} = req.body;
        const good = await Good.create({
            OwnerId: req.user.id,
            name,
            img: req.file.filename,
            price,
        });
        const end = new Date();
        end.setDate(end.getDate() + 1); // 하루 뒤
        // schedule 객체의 scheduleJob 메서드로 일정을 예약할 수 있다.
        // 첫 번째 인수로 실행될 시각을 넣고, 두 번째 인수로 해당 시각이 되었을 때 수행할 콜백 함수를 넣는다.
        schedule.scheduleJob(end, async () => {
            const success = await Auction.findOne({
                where: {GoodId: good.id},
                order: [['bid', 'DESC']],
            });
            await Good.update({ SoldId: success.UserId}, {where: {id:good.id}});
            await User.update({
                money: sequelize.literal(`money - ${success.bid}`),
            }, {
                where: {id: success.UserId},
            });
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 해당 상품과 기존 입찰 정보들을 불러온 뒤에 렌더링한다.
router.get('/good/:id', isLoggedIn, async(req, res, next) => {
    try {
        const [good, auction] = await Promise.all([
            Good.findOne({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'Owner',
                },
            }),
            Auction.findAll({
                where: {GoodId: req.params.id},
                include: {model:User},
                order: [['bid', 'ASC']],
            }),
        ]);
        res.render('auction', {
            title: `${good.name} - NodeAuction`,
            good,
            auction,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
})

// 클라이언트로부터 받은 입찰 정보를 저장한다.
router.post('/good/:id/bid', isLoggedIn, async(req, res, next) => {
    try {
        const {bid, msg} = req.body;
        const good = await Good.findOne({
            where: {id: req.params.id},
            include: {model: Auction},
            order: [[{model: Auction}, 'bid', 'DESC']],
        });
        
        if(req.user.id === good.OwnerId) {
            return res.status(403).send('자기가 올린 물건에는 입찰할 수 없습니다.');
        }

        if(good.price >= bid) {
            return res.status(403).send('시작 가격보다 높게 입찰해야 합니다.');
        }
        if(new Date(good.createdAt).valueOf() + (24*60*60*1000) < new Date()) {
            return res.status(403).send('경매가 이미 종료되었습니다.');
        }
        if(good.Auctions[0] && good.Auctions[0].bid >= bid) {
            return res.status(403).send('이전 입찰가보다 높아야 합니다.');
        }

        const result = await Auction.create({
            bid,
            msg,
            UserId: req.user.id,
            GoodId: req.params.id,
        });
        req.app.get('io').to(req.params.id).emit('bid', {
            bid: result.bid,
            msg: result.msg,
            nick: req.user.nick,
        });
        return res.send('ok');
    } catch (err) {
        console.error(err);
        return next(err);
    }
})

// 낙찰 목록을 보여준다.
router.get('/list', isLoggedIn, async(req, res, next) => {
    try {
        const goods = await Good.findAll({
            where: {SoldId: req.user.id},
            include: {model: Auction},
            order: [[{model: Auction}, 'bid', 'DESC']],
        });
        res.render('list', {title: '낙찰 목록 - NodeAuction', goods});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;