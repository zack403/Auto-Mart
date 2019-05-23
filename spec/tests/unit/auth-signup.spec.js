const request = require('supertest');
const {validate} = require('../../../models/user')
let server; 


describe('/api/v1/auth/signup', () => {
    beforeEach(() => {server = require('../../../index'); })
    afterEach(() => {server.close();});

    describe('POST /api/v1/auth/signup', () => {
        it('should return 400 if user model is not provided', async () => {
           const response = await request(server).post('/api/v1/auth/signup');
           expect(response.status).toBe(400);
          })

 })
})