class CommentRepository {
    async addComment(addComment) {
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async deleteComment(deleteComment) {
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }
    async getCommentsByThreadId(threadId) {
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async verifyCommentAvailability(id) {
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }

    async verifyCommentOwner(commentId, ownerId) {
        throw new Error("COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    }
}

module.exports = CommentRepository;
