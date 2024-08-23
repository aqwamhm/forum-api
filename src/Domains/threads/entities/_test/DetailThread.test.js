const DetailThread = require("../DetailThread");

describe("DetailThread", () => {
    it("should throw an error when payload does not contain all needed properties", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
        };

        expect(() => new DetailThread(payload)).toThrow(
            "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw an error when payload does not meet data type specifications", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: 20240812,
            username: "aqwamhm",
            comments: [],
        };

        expect(() => new DetailThread(payload)).toThrow(
            "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should throw an error when comments array contains an invalid comment", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [
                {
                    id: "comment-123",
                    username: "aqwamhm",
                    date: "2024-08-12T00:00:00.000Z",
                    content: 1234,
                    is_deleted: false,
                },
            ],
        };

        expect(() => new DetailThread(payload)).toThrow(
            "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should create a DetailThread object correctly when provided with valid payload", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [
                {
                    id: "comment-123",
                    username: "aqwamhm",
                    date: "2024-08-12T00:00:00.000Z",
                    content: "This is a comment",
                    is_deleted: false,
                },
            ],
        };

        const detailThread = new DetailThread(payload);

        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.date).toEqual(payload.date);
        expect(detailThread.username).toEqual(payload.username);
        expect(detailThread.comments).toEqual(payload.comments);
    });

    it("should throw an error if comments array contains an object with missing properties", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [
                {
                    id: "comment-12323",
                    username: "aqwamhm",
                },
            ],
        };

        expect(() => new DetailThread(payload)).toThrow(
            "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw an error if comments array contains an object with incorrect property types", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [
                {
                    id: "comment-123",
                    username: "aqwamhm",
                    date: "2024-08-12T00:00:00.000Z",
                    content: true,
                    is_deleted: "false",
                },
            ],
        };

        expect(() => new DetailThread(payload)).toThrow(
            "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should handle an empty comments array correctly", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [],
        };

        const detailThread = new DetailThread(payload);

        expect(detailThread.comments).toEqual([]);
    });

    it("should throw an error if comments array contains a comment with missing is_deleted property", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [
                {
                    id: "comment-123",
                    username: "aqwamhm",
                    date: "2024-08-12T00:00:00.000Z",
                    content: "This is a comment",
                },
            ],
        };

        expect(() => new DetailThread(payload)).toThrow(
            "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw an error if comments array contains a comment with incorrect is_deleted property type", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [
                {
                    id: "comment-123",
                    username: "aqwamhm",
                    date: "2024-08-12T00:00:00.000Z",
                    content: "This is a comment",
                    is_deleted: "false",
                },
            ],
        };

        expect(() => new DetailThread(payload)).toThrow(
            "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should replace content with '**komentar telah dihapus**' when is_deleted is true", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [
                {
                    id: "comment-123",
                    username: "aqwamhm",
                    date: "2024-08-12T00:00:00.000Z",
                    content: "This is a comment",
                    is_deleted: true,
                },
            ],
        };

        const detailThread = new DetailThread(payload);

        expect(detailThread.comments[0].content).toEqual(
            "**komentar telah dihapus**"
        );
    });

    it("should not replace content when is_deleted is false", () => {
        const payload = {
            id: "thread-123",
            title: "Sample Title",
            body: "Sample Body",
            date: "2024-08-12T00:00:00.000Z",
            username: "aqwamhm",
            comments: [
                {
                    id: "comment-123",
                    username: "aqwamhm",
                    date: "2024-08-12T00:00:00.000Z",
                    content: "This is a comment",
                    is_deleted: false,
                },
            ],
        };

        const detailThread = new DetailThread(payload);

        expect(detailThread.comments[0].content).toEqual("This is a comment");
    });
});
