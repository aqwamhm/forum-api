const AddCommentUseCase = require("../AddCommentUseCase");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");

describe("AddCommentUseCase", () => {
    it("should orchestrate the add comment action correctly", async () => {
        const useCasePayload = {
            content: "Lorem Ipsum",
            owner: "user-123",
            thread: "thread-123",
        };

        const mockAddedComment = new AddedComment({
            id: "comment-123",
            content: "Lorem Ipsum",
            owner: "user-123",
        });

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.addComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        const mockThreadRepository = new ThreadRepository();
        mockThreadRepository.verifyThreadAvailability = jest
            .fn()
            .mockImplementation();

        const getCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        const addedComment = await getCommentUseCase.execute(useCasePayload);

        expect(addedComment).toStrictEqual(
            new AddedComment({
                id: "comment-123",
                owner: useCasePayload.owner,
                content: useCasePayload.content,
            })
        );
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
            useCasePayload.thread
        );
        expect(mockCommentRepository.addComment).toBeCalledWith(
            new AddComment({
                content: useCasePayload.content,
                owner: useCasePayload.owner,
                thread: useCasePayload.thread,
            })
        );
    });
});
