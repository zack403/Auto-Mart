const request = require('supertest');
const {validate} = require('../../../models/user')
let server; 
const user = {
    email: "zackaminu@yahoo.com"
}

describe('/api/v1/auth/signup', () => {
    beforeEach(() => {server = require('../../../index'); })
    afterEach(() => {server.close();});

    describe('POST /api/v1/auth/signup', () => {
        it('should return 400 if user model is not provided', async () => {
           const response = await request(server).post('/api/v1/auth/signup');
           expect(response.status).toBe(400);
          })

          it('should return 400 if one of the required user model is not provided', async () => {
            const response = await request(server).post('/api/v1/auth/signup')
            .send({ first_name: "zackaminu" })
            .end((err, res) => {
                expect(res.status).toBe(400);
            })
           })

           it('should return 400 if email already exist', async () => {
            const response = await request(server).post('/api/v1/auth/signup')
            .send({ email: "zackaminu@yahoo.com" })
            .end((err, res) => {
                expect(res.body).toContain(user);
            })
           })

           it("should return 200 ok if sign up is successful", async () => {
            const res = await request(server).post('/api/v1/auth/signup')
               .send({
                    first_name: 'Zack', 
                    last_name: 'Aminu',
                    email: "sadiatu@gmail.com",
                    password : "1166117"
                })
                expect(res.status).toBe(200);

        })
 })
})