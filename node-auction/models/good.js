const Sequelize = require('sequelize');

// 물건 데이터 베이스
module.exports = class Good extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Good',
            tableName: 'goods',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 사용자 모델과 상품 모델 간에는 일대다 관계가 두 번 적용된다. <- 사용자가 여러 상품을 등록할 수 있고, 사용자가 여러 상품을 낙찰받을 수도 있기 때문이다.
    static associate(db) {
        db.Good.belongsTo(db.User, {as: 'Owner'});
        db.Good.belongsTo(db.User, {as: 'Sold'});
        db.Good.hasMany(db.Auction);
    }
};