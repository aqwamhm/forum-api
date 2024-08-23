const AddedComment = require("../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(addComment) {
        const { content, owner, thread } = addComment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner",
            values: [id, content, owner, thread, new Date().toISOString()],
        };

        const result = await this._pool.query(query);

        return new AddedComment({ ...result.rows[0] });
    }

    async deleteComment(commentId) {
        const query = {
            text: "UPDATE comments SET is_deleted = true WHERE id = $1",
            values: [commentId],
        };

        await this._pool.query(query);
    }

    async getCommentsByThreadId(threadId) {
        const commentsQuery = {
            text: `
            SELECT
                comments.id,
                comments.date,
                comments.content,
                comments.is_deleted,
                users.username
            FROM
                comments
            JOIN
                users ON owner = users.id
            WHERE
                thread = $1
            ORDER BY comments.date ASC`,
            values: [threadId],
        };

        const commentsResult = await this._pool.query(commentsQuery);

        return commentsResult.rows;
    }

    async verifyCommentAvailability(id) {
        const query = {
            text: "SELECT id FROM comments WHERE id = $1 AND is_deleted = false",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError("komentar tidak ditemukan");
        }
    }

    async verifyCommentOwner(commentId, ownerId) {
        const query = {
            text: "SELECT owner FROM comments WHERE id = $1",
            values: [commentId],
        };

        const result = await this._pool.query(query);

        const { owner } = result.rows[0];

        if (owner !== ownerId) {
            throw new AuthorizationError(
                "You are not authorized to access this comment"
            );
        }
    }
}

module.exports = CommentRepositoryPostgres;
