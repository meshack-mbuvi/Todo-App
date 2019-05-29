import { createApp } from '../../src/lib/createApp';
import * as request from 'supertest';
import * as chai from 'chai';
// import chaiHttp from 'chai-http';
// import chaiSubset from 'chai-subset';

// chai.use(chaiHttp);
// chai.use(chaiSubset);

const { expect } = chai;

describe('Test passes', () => {
    let server: any;
    beforeEach(async () => {
        const app = await createApp();
        server = app.listen(3001);
    });

    afterEach(async () => {
        await server.close();
    });

    it('should run tests', async () => {
        const res = await request(server).get('/');
        expect(res.status).to.equal(200);
    });
});
