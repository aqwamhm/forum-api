const AddedThread = require("../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(addThread) {
        const { title, body, owner } = addThread;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
            values: [id, title, body, new Date().toISOString(), owner],
        };

        const result = await this._pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadById(threadId) {
        const threadQuery = {
            text: `
            SELECT
                threads.id,
                threads.title,
                threads.body,
                threads.date,
                users.username
            FROM
                threads
            JOIN
                users ON threads.owner = users.id
            WHERE
                threads.id = $1`,
            values: [threadId],
        };

        const threadResult = await this._pool.query(threadQuery);

        if (threadResult.rows.length === 0) {
            throw new NotFoundError("Thread tidak ditemukan");
        }

        const threadRow = threadResult.rows[0];

        return threadRow;
    }

    async verifyThreadAvailability(id) {
        const query = {
            text: "SELECT id FROM threads WHERE id = $1",
            values: [id],
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError("Thread not found");
        }
    }
}

module.exports = ThreadRepositoryPostgres;
