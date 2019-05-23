const request = require('supertest');
let server; 



describe('/api/v1/auth/signin', () => {
    beforeEach(() => {server = require('../../../index'); })
    afterEach(() => {server.close();});

    describe('POST /api/v1/auth/signin', () => {
        it('should have an endpoint /api/v1/auth/signin', async () => {
            const response =  await request(server).post('/api/v1/auth/signin');
            expect(response.status).toBe(400);
        })
    })
})