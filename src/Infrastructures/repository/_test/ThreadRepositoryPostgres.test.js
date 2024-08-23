const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({
            id: "user-123",
            username: "aqwamhm",
        });
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addThread function", () => {
        it("should persist add thread", async () => {
            const addThread = new AddThread({
                title: "Lorem Ipsum",
                body: "Lorem Ipsum.........",
                owner: "user-123",
            });
            const fakeIdGenerator = () => "123";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const addedThread = await threadRepositoryPostgres.addThread(
                addThread
            );

            const thread = await ThreadsTableTestHelper.findThreadsById(
                "thread-123"
            );

            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: "thread-123",
                    title: "Lorem Ipsum",
                    owner: "user-123",
                })
            );

            expect(thread.id).toEqual("thread-123");
            expect(thread.title).toEqual("Lorem Ipsum");
            expect(thread.body).toEqual("Lorem Ipsum.........");
            expect(thread.owner).toEqual("user-123");
            expect(thread.date).toEqual(expect.any(String));
        });

        it("should return added thread correctly", async () => {
            const addThread = new AddThread({
                title: "Lorem Ipsum",
                body: "Lorem Ipsum.........",
                owner: "user-123",
            });
            const fakeIdGenerator = () => "generated-id";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const addedThread = await threadRepositoryPostgres.addThread(
                addThread
            );

            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: "thread-generated-id",
                    title: "Lorem Ipsum",
                    owner: "user-123",
                })
            );
        });
    });

    describe("getThreadById function", () => {
        it("should return the thread with its details", async () => {
            const threadId = "thread-123";
            await ThreadsTableTestHelper.addThread({
                id: threadId,
                title: "Lorem Ipsum",
                body: "Lorem Ipsum.........",
                owner: "user-123",
            });

            const fakeIdGenerator = () => "generated-id";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const result = await threadRepositoryPostgres.getThreadById(
                threadId
            );
            expect(result).toMatchObject({
                id: threadId,
                title: "Lorem Ipsum",
                body: "Lorem Ipsum.........",
                date: expect.any(String),
                username: "aqwamhm",
            });
        });

        it("should throw NotFoundError when thread does not exist", async () => {
            const fakeIdGenerator = () => "generated-id";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await expect(
                threadRepositoryPostgres.getThreadById("non-existing-id")
            ).rejects.toThrow(NotFoundError);
        });
    });

    describe("verifyThreadAvailability function", () => {
        it("should not throw NotFoundError when the thread exists", async () => {
            const threadId = "thread-123";
            await ThreadsTableTestHelper.addThread({
                id: threadId,
            });

            const fakeIdGenerator = () => "generated-id";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await expect(
                threadRepositoryPostgres.verifyThreadAvailability(threadId)
            ).resolves.not.toThrow(NotFoundError);
        });

        it("should throw NotFoundError when the thread does not exist", async () => {
            const fakeIdGenerator = () => "generated-id";
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await expect(
                threadRepositoryPostgres.verifyThreadAvailability(
                    "non-existing-id"
                )
            ).rejects.toThrow(NotFoundError);
        });
    });
});
