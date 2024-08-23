/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async addComment({
        id = "comment-123",
        content = "Lorem Ipsum",
        owner = "user-123",
        thread = "thread-123",
        is_deleted = false,
    }) {
        const query = {
            text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)",
            values: [
                id,
                content,
                owner,
                thread,
                new Date().toISOString(),
                is_deleted,
            ],
        };

        await pool.query(query);
    },

    async findCommentsById(id) {
        const query = {
            text: "SELECT * FROM comments WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM comments WHERE 1=1");
    },
};

module.exports = CommentsTableTestHelper;
