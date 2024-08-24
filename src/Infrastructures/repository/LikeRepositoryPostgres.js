const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addLike({ user, comment }) {
        const id = `like-${this._idGenerator()}`;
        const query = {
            text: "INSERT INTO user_comment_likes VALUES($1, $2, $3)",
            values: [id, user, comment],
        };

        await this._pool.query(query);
    }

    async deleteLike({ user, comment }) {
        const query = {
            text: "DELETE FROM user_comment_likes WHERE user_comment_likes.user = $1 AND comment = $2",
            values: [user, comment],
        };

        await this._pool.query(query);
    }

    async getLikeCountsByThreadId(threadId) {
        const query = {
            text: `SELECT comments.id AS comment_id, COUNT(user_comment_likes.id) AS like_count
                    FROM comments
                    LEFT JOIN user_comment_likes ON comments.id = user_comment_likes.comment
                    WHERE comments.thread = $1
                    GROUP BY comments.id;`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async isCommentLikedByUser({ user, comment }) {
        const query = {
            text: "SELECT * FROM user_comment_likes WHERE user_comment_likes.user = $1 AND comment = $2",
            values: [user, comment],
        };

        const result = await this._pool.query(query);

        return result.rowCount > 0;
    }
}

module.exports = LikeRepositoryPostgres;
