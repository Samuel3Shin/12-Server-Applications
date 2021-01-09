const Sequelize = require('sequelize');

// 사용자 데이터 베이스
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            money: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // 사용자가 입찰을 여러 번 할 수 있으므로 사용자 모델과 경매 모델은 1:N 관계이다.
    static associate(db) {
        db.User.hasMany(db.Auction);
    }
};