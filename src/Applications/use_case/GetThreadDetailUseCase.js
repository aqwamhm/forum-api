const DetailThread = require("../../Domains/threads/entities/DetailThread");

class GetThreadDetailUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyThreadAvailability(useCasePayload);
        const comments = await this._commentRepository.getCommentsByThreadId(
            useCasePayload
        );
        const thread = await this._threadRepository.getThreadById(
            useCasePayload
        );

        return new DetailThread({
            ...thread,
            comments: [...comments],
        });
    }
}

module.exports = GetThreadDetailUseCase;
