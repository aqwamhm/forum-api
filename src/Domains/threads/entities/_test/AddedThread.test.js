const AddedThread = require("../AddedThread");

describe("AddedThread", () => {
    it("should throw when payload not contain needed property", () => {
        const payload = {
            title: "Lorem Ipsum",
            owner: "user-123",
        };

        expect(() => new AddedThread(payload)).toThrow(
            "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw error when payload not meet data type specification", () => {
        const payload = {
            id: "thread-123",
            title: 2,
            owner: "user-123",
        };

        expect(() => new AddedThread(payload)).toThrow(
            "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should create addedThread object correctly", () => {
        const payload = {
            id: "thread-123",
            title: "Lorem Ipsum",
            owner: "user-123",
        };

        const addedThread = new AddedThread(payload);

        expect(addedThread.id).toEqual(payload.id);
        expect(addedThread.title).toEqual(payload.title);
        expect(addedThread.owner).toEqual(payload.owner);
    });
});
