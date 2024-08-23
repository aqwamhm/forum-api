const AddComment = require("../AddComment");

describe("AddComment", () => {
    it("should throw when payload not contain needed property", () => {
        const payload = {
            content: "Lorem Ipsum",
        };

        expect(() => new AddComment(payload)).toThrow(
            "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw error when payload not meet data type specification", () => {
        const payload = {
            content: "Lorem Ipsum.",
            owner: {},
            thread: 2,
        };

        expect(() => new AddComment(payload)).toThrow(
            "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should create AddComment object correctly", () => {
        const payload = {
            content: "Lorem Ipsum",
            owner: "user-123",
            thread: "thread-123",
        };

        const addComment = new AddComment(payload);

        expect(addComment.content).toEqual(payload.content);
        expect(addComment.owner).toEqual(payload.owner);
        expect(addComment.thread).toEqual(payload.thread);
    });
});
