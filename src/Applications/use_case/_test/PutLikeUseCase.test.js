const PutLikeUseCase = require("../PutLikeUseCase");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("PutLikeUseCase", () => {
    it("should orchestrate the put like action on already liked comment correctly", async () => {
        const useCasePayload = {
            user: "user-123",
            comment: "comment-123",
        };

        const mockLikeRepository = new LikeRepository();
        mockLikeRepository.isCommentLikedByUser = jest
            .fn()
            .mockImplementation(() => Promise.resolve(true));
        mockLikeRepository.deleteLike = jest.fn().mockImplementation();
        mockLikeRepository.addLike = jest.fn().mockImplementation();

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadAvailability = jest
            .fn()
            .mockImplementation();

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyCommentAvailability = jest
            .fn()
            .mockImplementation();

        const putLikeUseCase = new PutLikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        await putLikeUseCase.execute(useCasePayload);

        expect(
            mockThreadRepository.verifyThreadAvailability
        ).toHaveBeenCalledWith(useCasePayload.thread);

        expect(
            mockCommentRepository.verifyCommentAvailability
        ).toHaveBeenCalledWith(useCasePayload.comment);

        expect(mockLikeRepository.isCommentLikedByUser).toHaveBeenCalledWith(
            useCasePayload
        );

        expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(
            useCasePayload
        );

        expect(mockLikeRepository.addLike).not.toBeCalled();
    });

    it("should orchestrate the put like action on unliked comment correctly", async () => {
        const useCasePayload = {
            user: "user-123",
            comment: "comment-123",
        };

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadAvailability = jest
            .fn()
            .mockImplementation();

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyCommentAvailability = jest
            .fn()
            .mockImplementation();

        const mockLikeRepository = new LikeRepository();
        mockLikeRepository.isCommentLikedByUser = jest
            .fn()
            .mockImplementation(() => Promise.resolve(false));
        mockLikeRepository.deleteLike = jest.fn().mockImplementation();
        mockLikeRepository.addLike = jest.fn().mockImplementation();

        const putLikeUseCase = new PutLikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        await putLikeUseCase.execute(useCasePayload);

        expect(
            mockThreadRepository.verifyThreadAvailability
        ).toHaveBeenCalledWith(useCasePayload.thread);

        expect(
            mockCommentRepository.verifyCommentAvailability
        ).toHaveBeenCalledWith(useCasePayload.comment);

        expect(mockLikeRepository.isCommentLikedByUser).toHaveBeenCalledWith(
            useCasePayload
        );

        expect(mockLikeRepository.addLike).toHaveBeenCalledWith(useCasePayload);

        expect(mockLikeRepository.deleteLike).not.toBeCalled();
    });
});
