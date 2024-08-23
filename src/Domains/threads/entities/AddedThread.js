class AddThread {
    constructor(payload) {
        const { id, title, owner } = payload;

        this.id = id;
        this.title = title;
        this.owner = owner;

        this._verifyAddedThread(payload);
    }

    _verifyAddedThread(payload) {
        const { id, title, owner } = payload;
        if (!id || !title || !owner) {
            throw new Error("ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (
            typeof id !== "string" ||
            typeof title !== "string" ||
            typeof owner !== "string"
        ) {
            throw new Error("ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }
}

module.exports = AddThread;
