class PutLikeUseCase {
    constructor({ likeRepository, threadRepository, commentRepository }) {
        this._likeRepository = likeRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { user, comment, thread } = useCasePayload;

        await this._threadRepository.verifyThreadAvailability(thread);
        await this._commentRepository.verifyCommentAvailability(comment);

        const isLiked = await this._likeRepository.isCommentLikedByUser({
            user,
            comment,
        });

        if (isLiked) {
            await this._likeRepository.deleteLike({ user, comment });
        } else {
            await this._likeRepository.addLike({ user, comment });
        }
    }
}

module.exports = PutLikeUseCase;
