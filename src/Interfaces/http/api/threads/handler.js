const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadDetailUseCase = require("../../../../Applications/use_case/GetThreadDetailUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(
            AddThreadUseCase.name
        );

        const addThread = {
            ...request.payload,
            owner: request.auth.credentials.id,
        };

        const addedThread = await addThreadUseCase.execute(addThread);

        const response = h.response({
            status: "success",
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadByIdHandler(request, h) {
        const { threadId } = request.params;
        const getDetailThreadUseCase = this._container.getInstance(
            GetThreadDetailUseCase.name
        );
        const thread = await getDetailThreadUseCase.execute(threadId);

        return h.response({
            status: "success",
            data: {
                thread,
            },
        });
    }
}

module.exports = ThreadsHandler;
