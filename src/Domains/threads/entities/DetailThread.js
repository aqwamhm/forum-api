class DetailThread {
    constructor(payload) {
        const { id, title, body, date, username, comments } = payload;

        this._verifyDetailThread(payload);

        this.id = id;
        this.title = title;
        this.body = body;
        this.date = date;
        this.username = username;
        this.comments = comments.map((comment) => ({
            ...comment,
            content: comment.is_deleted
                ? "**komentar telah dihapus**"
                : comment.content,
        }));
    }

    _verifyDetailThread(payload) {
        const { id, title, body, date, username, comments } = payload;

        if (
            id === undefined ||
            title === undefined ||
            body === undefined ||
            date === undefined ||
            username === undefined ||
            comments === undefined
        ) {
            throw new Error("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (
            typeof id !== "string" ||
            typeof title !== "string" ||
            typeof body !== "string" ||
            typeof date !== "string" ||
            typeof username !== "string" ||
            !Array.isArray(comments)
        ) {
            throw new Error("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }

        if (comments.length > 0) {
            comments.forEach((comment) => {
                if (
                    comment.id === undefined ||
                    comment.username === undefined ||
                    comment.date === undefined ||
                    comment.content === undefined ||
                    comment.is_deleted === undefined
                ) {
                    throw new Error(
                        "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
                    );
                }

                if (
                    typeof comment.id !== "string" ||
                    typeof comment.username !== "string" ||
                    typeof comment.date !== "string" ||
                    typeof comment.content !== "string" ||
                    typeof comment.is_deleted !== "boolean"
                ) {
                    throw new Error(
                        "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
                    );
                }
            });
        }
    }
}

module.exports = DetailThread;
