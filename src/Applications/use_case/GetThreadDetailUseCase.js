const DetailThread = require("../../Domains/threads/entities/DetailThread");

class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyThreadAvailability(useCasePayload);
        const comments = await this._commentRepository.getCommentsByThreadId(
            useCasePayload
        );

        const thread = await this._threadRepository.getThreadById(
            useCasePayload
        );

        const commentsLikeCounts =
            await this._likeRepository.getLikeCountsByThreadId(useCasePayload);

        return new DetailThread({
            ...thread,
            comments,
            commentsLikeCounts,
        });
    }
}

module.exports = GetThreadDetailUseCase;
