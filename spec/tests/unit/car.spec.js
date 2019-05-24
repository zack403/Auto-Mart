const request = require('supertest');

let server;




describe('/api/v1/car/', () => {
    beforeEach(() => {server = require('../../../index'); })
    afterEach(() => {server.close();});

    describe('POST /api/v1/car', () => {
        //this test case initially returns 404 not found meaning the end point was not found
        //because i use TDD approach
        it('should return 400 if properties is not provided', async () => {
            const response = await request(server).post('/api/v1/car');
            expect(response.status).toBe(400);
        })
    })
})