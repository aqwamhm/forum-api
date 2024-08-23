const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments endpoint", () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    describe("when POST /threads/{threadId}/comments", () => {
        it("should response 201 and return added thread", async () => {
            const server = await createServer(container);

            const user = await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                    fullname: "Aqwam Hizbal Muhshiy",
                },
            });
            const { id: userId } = JSON.parse(user.payload).data.addedUser;

            const auth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                },
            });
            const { accessToken } = JSON.parse(auth.payload).data;

            const thread = await server.inject({
                method: "POST",
                url: "/threads",
                payload: {
                    title: "Lorem Ipsum",
                    body: "Lorem Ipsum...........",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { id: threadId } = JSON.parse(thread.payload).data
                .addedThread;

            const requestPayload = {
                content: "Lorem Ipsum",
            };

            const response = await server.inject({
                method: "POST",
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.addedComment.id).toBeDefined();
            expect(responseJson.data.addedComment.content).toEqual(
                "Lorem Ipsum"
            );
            expect(responseJson.data.addedComment.owner).toEqual(userId);
        });
    });

    describe("when DELETE /threads/{threadId}/comments", () => {
        it("should response 200 and return success status", async () => {
            const server = await createServer(container);

            const user = await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                    fullname: "Aqwam Hizbal Muhshiy",
                },
            });
            const { id: userId } = JSON.parse(user.payload).data.addedUser;

            const auth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                },
            });
            const { accessToken } = JSON.parse(auth.payload).data;

            const thread = await server.inject({
                method: "POST",
                url: "/threads",
                payload: {
                    title: "Lorem Ipsum",
                    body: "Lorem Ipsum...........",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { id: threadId } = JSON.parse(thread.payload).data
                .addedThread;

            const comment = await server.inject({
                method: "POST",
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: "Lorem Ipsum",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { id: commentId } = JSON.parse(comment.payload).data
                .addedComment;

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual("success");
        });
    });
});
