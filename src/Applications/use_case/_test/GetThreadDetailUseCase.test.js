const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");

describe("GetThreadDetailUseCase", () => {
    it("should orchestrate the get thread detail action without comment correctly", async () => {
        const useCasePayload = "thread-123";

        const mockLikeRepository = new LikeRepository();
        mockLikeRepository.getLikeCountsByThreadId = jest
            .fn()
            .mockImplementation(() => Promise.resolve([]));

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: "thread-123",
                title: "Lorem Ipsum",
                body: "Lorem Ipsum.....",
                date: "2024-08-12T11:03:33.543Z",
                username: "aqwamhm",
            })
        );
        mockThreadRepository.verifyThreadAvailability = jest
            .fn()
            .mockImplementation();

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.getCommentsByThreadId = jest
            .fn()
            .mockImplementation(() => Promise.resolve([]));

        const getThreadUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
        });

        const detailThread = await getThreadUseCase.execute(useCasePayload);

        expect(detailThread).toStrictEqual(
            new DetailThread({
                id: useCasePayload,
                title: "Lorem Ipsum",
                body: "Lorem Ipsum.....",
                date: "2024-08-12T11:03:33.543Z",
                username: "aqwamhm",
                comments: [],
                commentsLikeCounts: [],
            })
        );

        expect(mockLikeRepository.getLikeCountsByThreadId).toHaveBeenCalledWith(
            useCasePayload
        );

        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
            useCasePayload
        );

        expect(
            mockThreadRepository.verifyThreadAvailability
        ).toHaveBeenCalledWith(useCasePayload);

        expect(
            mockCommentRepository.getCommentsByThreadId
        ).toHaveBeenCalledWith(useCasePayload);
    });

    it("should orchestrate the get thread detail action with comments correctly", async () => {
        const useCasePayload = "thread-123";

        const mockLikeRepository = new LikeRepository();
        mockLikeRepository.getLikeCountsByThreadId = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve([
                    { comment_id: "comment-123", like_count: "1" },
                    { comment_id: "comment-456", like_count: "1" },
                ])
            );

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: "thread-123",
                title: "Lorem Ipsum",
                body: "Lorem Ipsum.....",
                date: "2024-08-12T11:03:33.543Z",
                username: "aqwamhm",
            })
        );
        mockThreadRepository.verifyThreadAvailability = jest
            .fn()
            .mockImplementation();

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.getCommentsByThreadId = jest
            .fn()
            .mockImplementation(() =>
                Promise.resolve([
                    {
                        id: "comment-123",
                        content: "Lorem Ipsum",
                        date: "2024-08-12T11:03:33.543Z",
                        username: "aqwamhm",
                        is_deleted: false,
                    },
                    {
                        id: "comment-456",
                        content: "Lorem Ipsum",
                        date: "2024-08-12T11:03:33.543Z",
                        username: "aqwamhm",
                        is_deleted: true,
                    },
                ])
            );

        const getThreadUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
        });

        const detailThread = await getThreadUseCase.execute(useCasePayload);

        expect(detailThread).toStrictEqual(
            new DetailThread({
                id: useCasePayload,
                title: "Lorem Ipsum",
                body: "Lorem Ipsum.....",
                date: "2024-08-12T11:03:33.543Z",
                username: "aqwamhm",
                comments: [
                    {
                        content: "Lorem Ipsum",
                        date: "2024-08-12T11:03:33.543Z",
                        id: "comment-123",
                        is_deleted: false,
                        username: "aqwamhm",
                    },
                    {
                        content: "**komentar telah dihapus**",
                        date: "2024-08-12T11:03:33.543Z",
                        id: "comment-456",
                        is_deleted: true,
                        username: "aqwamhm",
                    },
                ],
                commentsLikeCounts: [
                    { comment_id: "comment-123", like_count: "1" },
                    { comment_id: "comment-456", like_count: "1" },
                ],
            })
        );

        expect(mockLikeRepository.getLikeCountsByThreadId).toHaveBeenCalledWith(
            useCasePayload
        );

        expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
            useCasePayload
        );

        expect(
            mockThreadRepository.verifyThreadAvailability
        ).toHaveBeenCalledWith(useCasePayload);

        expect(
            mockCommentRepository.getCommentsByThreadId
        ).toHaveBeenCalledWith(useCasePayload);
    });
});
