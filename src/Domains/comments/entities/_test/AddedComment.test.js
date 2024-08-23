const AddedComment = require("../AddedComment");

describe("AddedComment", () => {
    it("should throw when payload not contain needed property", () => {
        const payload = {
            content: "Lorem Ipsum",
            owner: "user-123",
        };

        expect(() => new AddedComment(payload)).toThrow(
            "ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw error when payload not meet data type specification", () => {
        const payload = {
            id: "comment-123",
            content: 2,
            owner: "user-123",
        };

        expect(() => new AddedComment(payload)).toThrow(
            "ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should create addedComment object correctly", () => {
        const payload = {
            id: "comment-123",
            content: "Lorem Ipsum",
            owner: "user-123",
        };

        const addedComment = new AddedComment(payload);

        expect(addedComment.id).toEqual(payload.id);
        expect(addedComment.content).toEqual(payload.content);
        expect(addedComment.owner).toEqual(payload.owner);
    });
});
