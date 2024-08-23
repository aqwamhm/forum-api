const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepositoryPostgres", () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({
            id: "user-123",
        });
        await ThreadsTableTestHelper.addThread({
            id: "thread-123",
        });
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addComment function", () => {
        it("should persist the comment correctly in the database", async () => {
            const addComment = new AddComment({
                content: "Lorem Ipsum",
                owner: "user-123",
                thread: "thread-123",
            });
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const addedComment = await commentRepositoryPostgres.addComment(
                addComment
            );

            const comments = await CommentsTableTestHelper.findCommentsById(
                "comment-123"
            );

            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: "comment-123",
                    content: "Lorem Ipsum",
                    owner: "user-123",
                })
            );

            expect(comments).toHaveLength(1);
            expect(comments[0].id).toBe("comment-123");
            expect(comments[0].content).toBe("Lorem Ipsum");
            expect(comments[0].owner).toBe("user-123");
            expect(comments[0].thread).toBe("thread-123");
            expect(comments[0].date).toEqual(expect.any(String));
            expect(comments[0].is_deleted).toBe(false);
        });
    });

    describe("deleteComment function", () => {
        it("should mark comment as deleted", async () => {
            const addComment = new AddComment({
                content: "Lorem Ipsum",
                owner: "user-123",
                thread: "thread-123",
            });
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await commentRepositoryPostgres.addComment(addComment);

            await commentRepositoryPostgres.deleteComment("comment-123");

            const comments = await CommentsTableTestHelper.findCommentsById(
                "comment-123"
            );

            expect(comments).toHaveLength(1);
            expect(comments[0].is_deleted).toBe(true);
        });
    });

    describe("getCommentsByThreadId function", () => {
        it("should return comments for a given thread ID", async () => {
            await CommentsTableTestHelper.addComment({
                id: "user-123",
                thread: "thread-123",
                content: "Lorem Ipsum",
            });

            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );
            const comments =
                await commentRepositoryPostgres.getCommentsByThreadId(
                    "thread-123"
                );

            expect(comments).toHaveLength(1);
            expect(comments[0].id).toEqual("user-123");
            expect(comments[0].content).toEqual("Lorem Ipsum");
            expect(comments[0].is_deleted).toEqual(false);
            expect(comments[0].username).toEqual("dicoding");
            expect(comments[0].date).toEqual(expect.any(String));
        });
    });

    describe("verifyCommentAvailability function", () => {
        it("should throw NotFoundError if comment does not exist", async () => {
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await expect(() =>
                commentRepositoryPostgres.verifyCommentAvailability(
                    "non-existent-id"
                )
            ).rejects.toThrow(NotFoundError);
        });

        it("should not throw NotFoundError if comment exists", async () => {
            const addComment = new AddComment({
                content: "Lorem Ipsum",
                owner: "user-123",
                thread: "thread-123",
            });

            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await commentRepositoryPostgres.addComment(addComment);

            expect(() =>
                commentRepositoryPostgres.verifyCommentAvailability(
                    "comment-123"
                )
            ).not.toThrow(NotFoundError);
        });
    });

    describe("verifyCommentOwner function", () => {
        it("should throw AuthorizationError if ownerId does not match the comment owner", async () => {
            const addComment = new AddComment({
                content: "Lorem Ipsum",
                owner: "user-123",
                thread: "thread-123",
            });
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await commentRepositoryPostgres.addComment(addComment);

            await expect(() =>
                commentRepositoryPostgres.verifyCommentOwner(
                    "comment-123",
                    "another-user"
                )
            ).rejects.toThrow(AuthorizationError);
        });

        it("should not throw AuthorizationError if ownerId matches the comment owner", async () => {
            const addComment = new AddComment({
                content: "Lorem Ipsum",
                owner: "user-123",
                thread: "thread-123",
            });
            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await commentRepositoryPostgres.addComment(addComment);

            expect(() =>
                commentRepositoryPostgres.verifyCommentOwner(
                    "comment-123",
                    "user-123"
                )
            ).not.toThrow(AuthorizationError);
        });
    });
});
