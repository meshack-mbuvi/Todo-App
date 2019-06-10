import { createApp } from '../src/lib/createApp';
import * as request from 'supertest';
import * as chai from 'chai';

const { expect } = chai;

describe('All tests', () => {
    let server: any;
    const BASE_URL = '/api/users';

    before(async () => {
        const app = await createApp();
        server = app.listen(3002);
    });

    after(async () => {
        await server.close();
    });

    describe('Post /Users/signup', () => {
        let signUpData: any;

        beforeEach(() => {
            signUpData = {
                "firstName": "test",
                "lastName": "test",
                "password": "test12",
                "email": "test@test.com"
            }
        })

        it('should create user account', async () => {
            const { status } = await request(server)
                .post(`${BASE_URL}/signup`).send(signUpData);
            expect(status).to.equal(201);
        });

        it('should not create user account more than once', async () => {
            await request(server).post(`${BASE_URL}/signup`)
            const { status } = await request(server)
                .post(`${BASE_URL}/signup`).send(signUpData);
            expect(status).to.equal(409);
        });

        it('should not create user account with empty password',
            async () => {
                signUpData.password = '';
                const { body, status } = await request(server)
                    .post(`${BASE_URL}/signup`).send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('password should not be empty.')
            });

        it('should not create user account with empty firstName field',
            async () => {
                signUpData.firstName = '';

                const { body, status } = await request(server)
                    .post(`${BASE_URL}/signup`).send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('firstName should not be empty.')
            });

        it('should not create user account with empty lastName field',
            async () => {
                signUpData.lastName = '';

                const { body, status } = await request(server)
                    .post(`${BASE_URL}/signup`).send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('lastName should not be empty.')
            });

        it('should not create user account with invalid email format',
            async () => {
                signUpData.email = 'test';

                const { body, status } = await request(server)
                    .post(`${BASE_URL}/signup`).send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('email must be a valid email address')
            });

        it('should not create user account with password less than 6 chars',
            async () => {
                signUpData.password = 'test';

                const { body, status } = await request(server)
                    .post(`${BASE_URL}/signup`).send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('password must be at least 6 characters long.')
            });
    })

    describe('Post /Users/login', () => {
        let loginData: any;

        beforeEach(() => {
            loginData = {
                "password": "test12",
                "email": "test@test.com"
            }
        })

        it('should login user', async () => {
            const { status, body: { token } } = await request(server)
                .post(`${BASE_URL}/login`).send(loginData);
            expect(status).to.equal(200);
            expect(token).to.exist
        });

        it('should not login non existing user', async () => {
            loginData.email = 'test123@not.com'
            const { status, body: { message } } = await request(server)
                .post(`${BASE_URL}/login`).send(loginData);
            expect(status).to.equal(401);
            expect(message).to.equal('Wrong password or email!')
        });

        it('should not login user without email', async () => {
            loginData.email = ''
            const { status } = await request(server)
                .post(`${BASE_URL}/login`).send(loginData);
            expect(status).to.equal(400);
        });

        it('should not login user without password', async () => {
            loginData.password = ''
            const { status } = await request(server)
                .post(`${BASE_URL}/login`).send(loginData);
            expect(status).to.equal(400);
        });
    })

    describe('Post /projects', () => {
        let userToken: any;
        before(async () => {
            const { body: { token } } = await request(server)
                .post(`/api/users/login`).send({
                    "password": "test12",
                    "email": "test@test.com"
                })
            userToken = token
        })

        it('should create a new project', async () => {
            const { status } = await request(server)
                .post(`/api/projects`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
            expect(status).to.equal(201);
        });

        it('should not create a project twice', async () => {
            const { status } = await request(server)
                .post(`/api/projects`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
            expect(status).to.equal(409);
        });

        it('should not create a project with empty description', async () => {
            const { status } = await request(server)
                .post(`/api/projects`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a", description: '' });
            expect(status).to.equal(400);
        });

        it('should not create a new project with empty title', async () => {
            const { status } = await request(server)
                .post(`/api/projects`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "" });
            expect(status).to.equal(400);
        });

        it('should not create a new project with token', async () => {
            const { status } = await request(server)
                .post(`/api/projects`);
            expect(status).to.equal(401);
        });

        it('should not create a new project with invalid token', async () => {
            const token = userToken + userToken[0]
            const { status } = await request(server)
                .post(`/api/projects`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: "dkc" });
            expect(status).to.equal(401);
        });
    })

    describe('Get /projects', () => {
        let userToken: any;
        before(async () => {
            const { body: { token } } = await request(server)
                .post(`/api/users/login`).send({
                    "password": "test12",
                    "email": "test@test.com"
                })
            userToken = token
            await request(server)
                .post(`/api/projects`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
        })

        it('should retrieve existing projects', async () => {
            const { status, body } = await request(server)
                .get(`/api/projects`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
            expect(status).to.equal(200);
            expect(body.length).to.equal(1)
        });
    })

    describe('Post /projects/:projectId/todos', () => {
        let userToken: any;
        let projectId: any;
        before(async () => {
            const { body: { token } } = await request(server)
                .post(`/api/users/login`).send({
                    "password": "test12",
                    "email": "test@test.com"
                })
            userToken = token

            const { body: project } = await request(server)
                .post(`/api/projects`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a todo" });
            projectId = project.id
        })

        it('should create a new todo item', async () => {
            const { status, body: { title } } = await request(server)
                .post(`/api/projects/${projectId}/todos`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
            expect(title).to.equal('this a')
            expect(status).to.equal(201);
        });

        it('should not create a todo twice for the same project', async () => {
            const { status } = await request(server)
                .post(`/api/projects/${projectId}/todos`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
            expect(status).to.equal(409);
        });

        it('should not create a todo with empty title', async () => {
            const { status } = await request(server)
                .post(`/api/projects/${projectId}/todos`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "" });
            expect(status).to.equal(400);
        });

        it('should not create a todo for non-existence project', async () => {
            const { status } = await request(server)
                .post(`/api/projects/1000/todos`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
            expect(status).to.equal(404);
        });
    })

    describe('Get /projects/:projectId/todos', () => {
        let userToken: any;
        let todoId: any
        const projectId = 1;

        before(async () => {
            const { body: { token } } = await request(server)
                .post(`/api/users/login`).send({
                    "password": "test12",
                    "email": "test@test.com"
                })
            userToken = token
            const { body: { id } } = await request(server)
                .post(`/api/projects/1/todos`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
            todoId = id
        })

        it('should get all todos for a given project', async () => {
            const { status, body } = await request(server)
                .get(`/api/projects/${projectId}/todos`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(status).to.equal(200);
            expect(body.length).to.equal(1)
        });

        it('should get single todo for a given project', async () => {
            const { status } = await request(server)
                .get(`/api/projects/${projectId}/todos/${todoId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(status).to.equal(200);
        });

        it('should verify todoId is number', async () => {
            const { status } = await request(server)
                .get(`/api/projects/${projectId}/todos/mv`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(status).to.equal(400);
        });

        it('should verify projectId is number', async () => {
            const { status } = await request(server)
                .get(`/api/projects/mvs/todos/mv`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(status).to.equal(400);
        });

        it('should return appropriate message when todo is not found',
            async () => {
                const { status, body: { message } } = await request(server)
                    .get(`/api/projects/${projectId}/todos/1000`)
                    .set('Authorization', `Bearer ${userToken}`).send({ title: "this a" });
                expect(status).to.equal(404);
                expect(message).to.equal('No todo found with given todoId')
            });
    })

    describe('Put /projects/:projectId/todos/:todoId', () => {
        let userToken: any;
        let todoId = 1;
        const projectId = 1;

        before(async () => {
            const { body: { token } } = await request(server)
                .post(`/api/users/login`).send({
                    "password": "test12",
                    "email": "test@test.com"
                })
            userToken = token
            const { body: { id } } = await request(server)
                .post(`/api/projects/1/todos`)
                .set('Authorization', `Bearer ${userToken}`).send({ title: "this a new todo item" });
            todoId = id
        })

        it('should verify todo title is not empty if provided', async () => {
            const { status } = await request(server)
                .put(`/api/projects/${projectId}/todos/${todoId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ title: "" });
            expect(status).to.equal(400);
        });

        it('should mark a todo as started ', async () => {
            const { status, body: { started } } = await request(server)
                .put(`/api/projects/${projectId}/todos/${todoId}`)
                .set('Authorization', `Bearer ${userToken}`).send({ started: true });
            expect(status).to.equal(200);
            expect(started).to.equal(true)
        });

        it('should not update a non-existence todo', async () => {
            const { status, body: { message } } = await request(server)
                .put(`/api/projects/${projectId}/todos/1000`)
                .set('Authorization', `Bearer ${userToken}`).send({ started: true });
            expect(status).to.equal(404);
            expect(message).to.equal('No todo found with given todoId')
        });

        it('should validate the started field to be boolean', async () => {
            const { status } = await request(server)
                .put(`/api/projects/${projectId}/todos/${todoId}`)
                .set('Authorization', `Bearer ${userToken}`).send({ started: "true" });
            expect(status).to.equal(400);
        });

        it('should validate the finished field to be boolean', async () => {
            const { status } = await request(server)
                .put(`/api/projects/${projectId}/todos/${todoId}`)
                .set('Authorization', `Bearer ${userToken}`).send({ finished: "true" });
            expect(status).to.equal(400);
        });

        it('should mark a todo as not started ', async () => {
            const { status, body: { finished } } = await request(server)
                .put(`/api/projects/${projectId}/todos/${todoId}`)
                .set('Authorization', `Bearer ${userToken}`).send({ started: true, finished: true });
            expect(status).to.equal(200);
            expect(finished).to.equal(true)
        });

        it('should not finish a todo before starting it',
            async () => {
                await request(server)
                    .put(`/api/projects/${projectId}/todos/${todoId}`)
                    .set('Authorization', `Bearer ${userToken}`).send({ started: false });
                const { status, body: { message } } = await request(server)
                    .put(`/api/projects/${projectId}/todos/${todoId}`)
                    .set('Authorization', `Bearer ${userToken}`).send({ finished: true });
                expect(status).to.equal(403);
                expect(message).to
                    .equal("Todo item not started can't be finished")
            });
    })
});
