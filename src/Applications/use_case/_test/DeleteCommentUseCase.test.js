const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("DeleteCommentUseCase", () => {
    it("should throw error if id is not string", async () => {
        const mockCommentRepository = new CommentRepository();
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
        });

        await expect(() =>
            deleteCommentUseCase.execute(123)
        ).rejects.toThrowError(
            "DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should orchestrate the delete comment action correctly", async () => {
        const useCasePayload = {
            commentId: "comment-123",
            ownerId: "user-123",
        };
        const mockCommentRepository = new CommentRepository();

        mockCommentRepository.deleteComment = jest.fn().mockImplementation();
        mockCommentRepository.verifyCommentAvailability = jest
            .fn()
            .mockImplementation();
        mockCommentRepository.verifyCommentOwner = jest
            .fn()
            .mockImplementation();

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
        });

        await deleteCommentUseCase.execute(useCasePayload);

        expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
            useCasePayload.commentId
        );
        expect(
            mockCommentRepository.verifyCommentAvailability
        ).toHaveBeenCalledWith(useCasePayload.commentId);
        expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
            useCasePayload.commentId,
            useCasePayload.ownerId
        );
    });
});
