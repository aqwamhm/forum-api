class LikeRepository {
    async addLike(addLike) {
        throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async deleteLike(likeId) {
        throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async getLikeCountsByThreadId(threadId) {
        throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async isCommentLikedByUser({ userId, commentId }) {
        throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }
}

module.exports = LikeRepository;
