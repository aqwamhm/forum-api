class AddComment {
    constructor({ content, owner, thread }) {
        this.content = content;
        this.owner = owner;
        this.thread = thread;

        this._verifyAddComment({ content, owner, thread });
    }

    _verifyAddComment({ content, owner, thread }) {
        if (!content || !owner || !thread) {
            throw new Error("ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (
            typeof content !== "string" ||
            typeof owner !== "string" ||
            typeof thread !== "string"
        ) {
            throw new Error("ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }
}

module.exports = AddComment;
