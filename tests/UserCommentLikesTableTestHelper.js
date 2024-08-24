const pool = require("../src/Infrastructures/database/postgres/pool");

const UserCommentLikesTableTestHelper = {
    async findLikeByUserAndComment({ user, comment }) {
        const result = await pool.query({
            text: "SELECT * FROM user_comment_likes WHERE user_comment_likes.user = $1 AND comment = $2",
            values: [user, comment],
        });

        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM user_comment_likes WHERE 1=1");
    },
};

module.exports = UserCommentLikesTableTestHelper;
