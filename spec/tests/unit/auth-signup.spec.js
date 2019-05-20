const request = require('supertest');
let server; 


describe('/auth/signup', () => {
    beforeEach(() => {server = require('../../../index'); })
    afterEach(() => {server.close();});

    describe('POST /auth/signup', () => {
        it('should return 400 if user model is not provided', async () => {
           const response = await request(server).post('/auth/signup');
           expect(response.status).toBe(400);
        })
    })
})