const request = require('supertest');
const {validate} = require('../../../models/user')
let server; 
const user = {
    userName,
    phoneNumber,
    email,
    password,
  };

describe('/api/v1/auth/signup', () => {
    beforeEach(() => {server = require('../../../index'); })
    afterEach(() => {server.close();});

    describe('POST /api/v1/auth/signup', () => {
        it('should return 400 if user model is not provided', async () => {
           const response = await request(server).post('/api/v1/auth/signup');
           expect(response.status).toBe(400);
          })

        it('should return 400 if user request is not valid', async () => {
            const res = await request(server)
            .post('/api/v1/auth/signup')
            .send(user);
            expect(res.status).toBe(400)
            expect(res.body).toContain('object');
          })

        it('should post a new user', async () => {
            const response = await request(server)
                              .post('/api/v1/auth/signup')
                              .send(user);
                              expect(res.status).toBe(200)
                              expect(res.body).toContain('object')
        })
 })
})