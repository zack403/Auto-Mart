const request = require('supertest');
const {User} = require('../../../models/user');

let server; 
let user;

describe('/api/v1/auth/signin', () => {
    beforeEach( async () => 
    {
       server = require('../../../index'); 
       const {rows: use} = await User.save("Zack", "Aminu", "zackaminu@yahoo.com", "112 road", "image", "ability", "ability");
       user = use[0];
    })
    afterEach(async () => 
    {
          server.close();
          await User.delete();
    });

    describe('POST /api/v1/auth/signin', () => {

        it("should return 200 ok if it is a valid user", async () => {
            const res = await request(server).post('/api/v1/auth/signin')
               .send({email: "zackaminu@yahoo.com", password: "ability"});
                expect(res.body.status).not.toBe(null);
               
        })

        it('should have an endpoint /api/v1/auth/signin', async () => {
            const response =  await request(server).post('/api/v1/auth/signin');
            expect(response.status).not.toBe(null);
        })

        it("should return 400 bad request if user try to log in with invalid credentials", async () => {
            const res = await request(server).post('/api/v1/auth/signin')
               .send({email: 'aminuzack@gmail.com', password: 'ability'})
               expect(res.status).toBe(400);
        })

        it("should contain what is in the user database", async () => {
            const res = await request(server).post('/api/v1/auth/signin')
               .send({email: 'zackaminu@yahoo.com', password: 'ability'});
               expect(res.body.status).not.toBe(null);            
        })     
    })
})