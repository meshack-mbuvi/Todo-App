import { createApp } from '../../src/lib/createApp';
import * as request from 'supertest';
import * as chai from 'chai';

const { expect } = chai;

describe('Test passes', () => {
    let server: any;

    before(async () => {
        const app = await createApp();
        server = app.listen(3001);
    });

    after(async () => {
        await server.close();
    });

    describe('/Users/signup', () => {
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
            const { status } = await request(server).post('/v1/users/signup').send(signUpData);
            expect(status).to.equal(201);
        });

        it('should not create user account more than once', async () => {
            await request(server).post('/v1/users/signup')
            const { status } = await request(server).post('/v1/users/signup').send(signUpData);
            expect(status).to.equal(409);
        });

        it('should not create user account with empty password',
            async () => {
                signUpData.password = '';
                const { body, status } = await request(server).post('/v1/users/signup').send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('password should not be empty.')
            });

        it('should not create user account with empty firstName field',
            async () => {
                signUpData.firstName = '';

                const { body, status } = await request(server).post('/v1/users/signup').send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('firstName should not be empty.')
            });

        it('should not create user account with empty lastName field',
            async () => {
                signUpData.lastName = '';

                const { body, status } = await request(server).post('/v1/users/signup').send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('lastName should not be empty.')
            });

        it('should not create user account with invalid email format',
            async () => {
                signUpData.email = 'test';

                const { body, status } = await request(server).post('/v1/users/signup').send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('email must be a valid email address')
            });

        it('should not create user account with password less than 6 chars',
            async () => {
                signUpData.password = 'test';

                const { body, status } = await request(server).post('/v1/users/signup').send(signUpData);
                const { data: { message } } = body
                expect(status).to.equal(400);
                expect(message).to.equal('password must be at least 6 characters long.')
            });
    })

    describe('/Users/login', () => {
        let loginData: any;

        beforeEach(() => {
            loginData = {
                "password": "test12",
                "email": "test@test.com"
            }
        })

        it('should login user', async () => {
            const { status, body: { token } } = await request(server).post('/v1/users/login').send(loginData);
            expect(status).to.equal(200);
            expect(token).to.exist
        });

        it('should not login non existing user', async () => {
            loginData.email = 'test123@not.com'
            const { status, body: { message } } = await request(server).post('/v1/users/login').send(loginData);
            expect(status).to.equal(401);
            expect(message).to.equal('Wrong password or email!')
        });

        it('should not login user without email', async () => {
            loginData.email = ''
            const { status } = await request(server).post('/v1/users/login').send(loginData);
            expect(status).to.equal(400);
        });

        it('should not login user without password', async () => {
            loginData.password = ''
            const { status } = await request(server).post('/v1/users/login').send(loginData);
            expect(status).to.equal(400);
        });
    })

});
