const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const PutLikeUseCase = require("../../../../Applications/use_case/PutLikeUseCase");

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
        this.putLikeHandler = this.putLikeHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const addCommentUseCase = this._container.getInstance(
            AddCommentUseCase.name
        );

        const { content } = request.payload;
        const { threadId: thread } = request.params;

        const addComment = {
            content,
            thread,
            owner: request.auth.credentials.id,
        };

        const addedComment = await addCommentUseCase.execute(addComment);

        const response = h.response({
            status: "success",
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const deleteCommentUseCase = this._container.getInstance(
            DeleteCommentUseCase.name
        );

        const { commentId } = request.params;

        await deleteCommentUseCase.execute({
            commentId,
            ownerId: request.auth.credentials.id,
        });

        return h
            .response({
                status: "success",
            })
            .code(200);
    }

    async putLikeHandler(request, h) {
        const putLikeUseCase = this._container.getInstance(PutLikeUseCase.name);

        const { commentId: comment, threadId: thread } = request.params;
        const user = request.auth.credentials.id;

        await putLikeUseCase.execute({
            user,
            comment,
            thread,
        });

        return h
            .response({
                status: "success",
            })
            .code(200);
    }
}

module.exports = CommentsHandler;
