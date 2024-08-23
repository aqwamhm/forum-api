const AddThreadUseCase = require("../AddThreadUseCase");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThread = require("../../../Domains/threads/entities/AddThread"); // Changed from AddedThread to AddThread

describe("AddThreadUseCase", () => {
    it("should orchestrate the add thread action correctly", async () => {
        const useCasePayload = {
            title: "Lorem Ipsum",
            body: "Lorem Ipsum..........",
            owner: "user-123",
        };

        const mockAddedThread = new AddedThread({
            id: "thread-123",
            title: "Lorem Ipsum",
            owner: "user-123",
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest
            .fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread));

        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        const addedThread = await getThreadUseCase.execute(useCasePayload);

        expect(addedThread).toStrictEqual(
            new AddedThread({
                id: "thread-123",
                title: useCasePayload.title,
                owner: "user-123",
            })
        );
        expect(mockThreadRepository.addThread).toBeCalledWith(
            new AddThread({
                title: useCasePayload.title,
                body: useCasePayload.body,
                owner: useCasePayload.owner,
            })
        );
    });
});
