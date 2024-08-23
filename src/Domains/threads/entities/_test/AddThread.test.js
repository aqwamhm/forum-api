const AddThread = require("../AddThread");

describe("AddThread", () => {
    it("should throw when payload not contain needed property", () => {
        const payload = {
            body: "Lorem Ipsum............",
        };

        expect(() => new AddThread(payload)).toThrow(
            "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw error when payload not meet data type specification", () => {
        const payload = {
            title: 2,
            body: "Lorem Ipsum.............",
            owner: {},
        };

        expect(() => new AddThread(payload)).toThrow(
            "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should create AddThread object correctly", () => {
        // Arrange
        const payload = {
            title: "Lorem Ipsum",
            body: "Lorem Ipsum.............",
            owner: "user-123",
        };

        const addThread = new AddThread(payload);

        expect(addThread.title).toEqual(payload.title);
        expect(addThread.body).toEqual(payload.body);
        expect(addThread.owner).toEqual(payload.owner);
    });
});
