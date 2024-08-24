const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const UserCommentLikesTableTestHelper = require("../../../../tests/UserCommentLikesTableTestHelper");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");
const pool = require("../../database/postgres/pool");

describe("LikeRepositoryPostgres", () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({
            id: "user-123",
        });
        await ThreadsTableTestHelper.addThread({
            id: "thread-123",
        });
        await CommentsTableTestHelper.addComment({
            id: "comment-123",
            thread: "thread-123",
            owner: "user-123",
            is_deleted: false,
        });
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UserCommentLikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addLike function", () => {
        it("should persist the comment id and user id in the user_comment_likes table", async () => {
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await likeRepositoryPostgres.addLike({
                user: "user-123",
                comment: "comment-123",
            });

            const like =
                await UserCommentLikesTableTestHelper.findLikeByUserAndComment({
                    user: "user-123",
                    comment: "comment-123",
                });

            expect(like[0].id).toBe("like-123");
            expect(like[0].user).toBe("user-123");
            expect(like[0].comment).toBe("comment-123");
        });
    });

    describe("deleteLike function", () => {
        it("should delete the like from database", async () => {
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await likeRepositoryPostgres.addLike({
                user: "user-123",
                comment: "comment-123",
            });

            await likeRepositoryPostgres.deleteLike({
                user: "user-123",
                comment: "comment-123",
            });

            const like =
                await UserCommentLikesTableTestHelper.findLikeByUserAndComment({
                    user: "user-123",
                    comment: "comment-123",
                });

            expect(like.length).toBe(0);
        });
    });

    describe("getLikeCountsByThreadId function", () => {
        it("should return the correct like count of a comment", async () => {
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await likeRepositoryPostgres.addLike({
                user: "user-123",
                comment: "comment-123",
            });

            const likeCount =
                await likeRepositoryPostgres.getLikeCountsByThreadId(
                    "thread-123"
                );

            expect(likeCount).toEqual([
                { comment_id: "comment-123", like_count: "1" },
            ]);
        });
    });

    describe("isCommentLikedByUser function", () => {
        it("should return true if user already liked the comment", async () => {
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await likeRepositoryPostgres.addLike({
                user: "user-123",
                comment: "comment-123",
            });

            const isLiked = await likeRepositoryPostgres.isCommentLikedByUser({
                user: "user-123",
                comment: "comment-123",
            });

            expect(isLiked).toBe(true);
        });

        it("should return false if user has not liked the comment", async () => {
            const fakeIdGenerator = () => "123";
            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const isLiked = await likeRepositoryPostgres.isCommentLikedByUser({
                user: "user-123",
                comment: "comment-123",
            });

            expect(isLiked).toBe(false);
        });
    });
});
