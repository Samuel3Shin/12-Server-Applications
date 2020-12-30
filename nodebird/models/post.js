const Sequelize = require('sequelize');

// 게시글 모델은 게시글 내용과 이미지 경로를 저장한다.
module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        // User 모델과 Post 모델은 1:N 관계이므로 belongsTo 로 연결된다.
        db.Post.belongsTo(db.User);

        // Post 모델과 Hashtag 모델은 N:M 관계다.
        // 그러므로 PostHashtag 라는 중간 모델이 생기고, 각각 postId와 hashtagId라는 foreignKey도 추가된다.
        // as는 따로 지정하지 않았으므로, post.getHashtags, post.addHashtags, hashtags.getPosts 같은 기본 이름의 관계 메서드들이 생성된다.
        db.Post.belongsToMany(db.User, {
            as: 'likedUsers',
            through: 'PostLike'
        });
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    }
};