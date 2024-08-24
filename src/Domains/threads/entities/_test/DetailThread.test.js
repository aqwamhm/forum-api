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
            commentsLikeCounts: [],
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-123",
                    like_count: "1",
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-123",
                    like_count: "1",
                },
            ],
        };

        const detailThread = new DetailThread(payload);

        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.date).toEqual(payload.date);
        expect(detailThread.username).toEqual(payload.username);

        expect(detailThread.comments.length).toEqual(1);
        expect(detailThread.comments[0].id).toEqual("comment-123");
        expect(detailThread.comments[0].username).toEqual("aqwamhm");
        expect(detailThread.comments[0].date).toEqual(
            "2024-08-12T00:00:00.000Z"
        );
        expect(detailThread.comments[0].content).toEqual("This is a comment");
        expect(detailThread.comments[0].is_deleted).toEqual(false);
        expect(detailThread.comments[0].likeCount).toEqual(1);
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-123",
                    like_count: "1",
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-123",
                    like_count: "1",
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
            commentsLikeCounts: [],
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-123",
                    like_count: "1",
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-123",
                    like_count: "1",
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-123",
                    like_count: "1",
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-123",
                    like_count: "1",
                },
            ],
        };

        const detailThread = new DetailThread(payload);

        expect(detailThread.comments[0].content).toEqual("This is a comment");
    });

    it("should throw error if commentsLikeCounts length not same with comments length", () => {
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
            commentsLikeCounts: [],
        };

        expect(() => new DetailThread(payload)).toThrowError(
            "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should throw error if commentsLikeCounts.comment_id does not match comments.id property", () => {
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
            commentsLikeCounts: [
                {
                    comment_id: "comment-456",
                    like_count: "1",
                },
            ],
        };

        expect(() => new DetailThread(payload)).toThrowError(
            "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should throw error if commentsLikeCounts does not contain comment_id and like_count property", () => {
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
            commentsLikeCounts: [
                {
                    commentid: "comment-123",
                    likecount: "1",
                },
            ],
        };

        expect(() => new DetailThread(payload)).toThrowError(
            "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });
});
