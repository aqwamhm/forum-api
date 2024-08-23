class DeleteCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        this._validateUseCasePayload(useCasePayload);
        const { commentId, ownerId } = useCasePayload;
        await this._commentRepository.verifyCommentAvailability(commentId);
        await this._commentRepository.verifyCommentOwner(commentId, ownerId);

        return await this._commentRepository.deleteComment(commentId);
    }

    _validateUseCasePayload(useCasePayload) {
        const { commentId, ownerId } = useCasePayload;
        if (typeof commentId !== "string" || typeof ownerId !== "string") {
            throw new Error(
                "DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
            );
        }
    }
}

module.exports = DeleteCommentUseCase;
