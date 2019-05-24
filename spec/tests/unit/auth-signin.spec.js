const request = require('supertest');
const user = 
     {
         email: "ada@gmail.com",
         password : '123456'
     }

let server; 



describe('/api/v1/auth/signin', () => {
    beforeEach(() => {server = require('../../../index'); })
    afterEach(() => {server.close();});

    describe('POST /api/v1/auth/signin', () => {
        it('should have an endpoint /api/v1/auth/signin', async () => {
            const response =  await request(server).post('/api/v1/auth/signin');
            expect(response.status).toBe(400);
        })

        it("should return 400 bad request if user try to log in with invalid credentials", async () => {
            const res = await request(server).post('/api/v1/auth/signin')
               .send({email: 'aminuzack@gmail.com', password: 'ability'})

               expect(res.status).toBe(400);
        })

        it("should contain what is in the user database", async () => {
            const res = await request(server).post('/api/v1/auth/signin')
               .send({email: 'ada@gmail.com', password: '123456'})
               .end((err, res) => {
                expect(res.body).toContain(user);

               })
        })
        
        it("should return 200 ok if it is a valid user", async () => {
            const res = await request(server).post('/api/v1/auth/signin')
               .send({email: 'ada@gmail.com', password: '123456'})
               .end((err, res) => {
                expect(res.status).toBe(200);

               })
        })
    })
})