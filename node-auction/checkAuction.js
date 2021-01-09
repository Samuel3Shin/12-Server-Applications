// 서버가 시작될 때 경매 시작 후 24시간이 지났지만 낙찰자가 없는 경매를 찾아서 낙찰을 지정하는 코드

const { Op } = require('Sequelize');

const { Good, Auction, User, sequelize } = require('./models');

module.exports = async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const targets = await Good.findAll({
            where: {
                SoldId: null,
                createdAt: { [Op.lte]: yesterday},
            },
        });
        targets.forEach(async (target) => {
            const success = await Auction.findOne({
                where: { GoodId: target.id },
                order: [['bid', 'DESC']],
            });
            await Good.update({SoldId: success.UserId}, {where: {id:target.id}});
            await User.update({
                money: sequelize.literal(`money - ${success.bid}`),
            }, {
                where: {id: success.UserId},
            });
        });
    } catch (err) {
        console.error(err);
    }
};
