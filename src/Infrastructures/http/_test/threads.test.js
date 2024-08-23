const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });

    describe("when POST /threads", () => {
        it("should response 201 and return added thread", async () => {
            const requestPayload = {
                title: "Lorem Ipsum",
                body: "Lorem Ipsum...........",
            };

            const server = await createServer(container);

            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                    fullname: "Aqwam Hizbal Muhshiy",
                },
            });

            const auth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                },
            });

            const { accessToken } = JSON.parse(auth.payload).data;

            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it("should response 401 when accessed without access token", async () => {
            const requestPayload = {
                title: "Lorem Ipsum",
            };
            const server = await createServer(container);

            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
            });
            expect(response.statusCode).toEqual(401);
        });

        it("should response 400 when request payload not contain needed property", async () => {
            const requestPayload = {
                title: "Lorem Ipsum",
            };
            const server = await createServer(container);

            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                    fullname: "Aqwam Hizbal Muhshiy",
                },
            });

            const auth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                },
            });

            const { accessToken } = JSON.parse(auth.payload).data;

            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual(
                "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
            );
        });

        it("should response 400 when request payload not meet data type specification", async () => {
            const requestPayload = {
                title: "Lorem Ipsum",
                body: ["Lorem Ipsum.................."],
            };
            const server = await createServer(container);

            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                    fullname: "Aqwam Hizbal Muhshiy",
                },
            });

            const auth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                },
            });

            const { accessToken } = JSON.parse(auth.payload).data;

            const response = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual(
                "tidak dapat membuat thread baru karena tipe data tidak sesuai"
            );
        });
    });

    describe("when GET /threads/{threadId}", () => {
        it("should respond 200 and return thread detail with comments", async () => {
            const server = await createServer(container);

            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                    fullname: "Aqwam Hizbal Muhshiy",
                },
            });

            const auth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: {
                    username: "aqwamhm",
                    password: "password",
                },
            });

            const { accessToken } = JSON.parse(auth.payload).data;

            const addThreadResponse = await server.inject({
                method: "POST",
                url: "/threads",
                payload: {
                    title: "Lorem Ipsum",
                    body: "Lorem Ipsum............",
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const { id: threadId } = JSON.parse(addThreadResponse.payload).data
                .addedThread;

            await server.inject({
                method: "POST",
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: "First comment",
                    thread: threadId,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const secondComment = await server.inject({
                method: "POST",
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: "Second comment",
                    thread: threadId,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { id: secondCommentId } = JSON.parse(secondComment.payload)
                .data.addedComment;

            await server.inject({
                method: "DELETE",
                url: `/threads/${threadId}/comments/${secondCommentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const response = await server.inject({
                method: "GET",
                url: `/threads/${threadId}`,
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread.id).toEqual(threadId);
            expect(responseJson.data.thread.title).toEqual("Lorem Ipsum");
            expect(responseJson.data.thread.body).toEqual(
                "Lorem Ipsum............"
            );
            expect(responseJson.data.thread.comments).toHaveLength(2);
            expect(responseJson.data.thread.comments[0].content).toEqual(
                "First comment"
            );
            expect(responseJson.data.thread.comments[1].content).toEqual(
                "**komentar telah dihapus**"
            );
        });
    });
});
