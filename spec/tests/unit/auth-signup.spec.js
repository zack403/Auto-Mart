const request = require('supertest');
const {User, validate} = require('../../../models/user')
let server; 

describe('/api/v1/auth/signup', () => {
    beforeEach(() => 
    {
        server = require('../../../index'); 
    })
    afterEach(async () => {
        server.close();
        await User.delete();
    });

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
            .send({ 
                    email: "zackaminu@gmail.com"
                    });
            expect(response.status).toBe(400)
           })          
   
           it("should return 201 ok if sign up is successful", async () => {
            const res = await request(server).post('/api/v1/auth/signup')
               .send({
                    first_name: 'Zack', 
                    last_name: 'Aminu',
                    email: "zackaminu@gmail.com",
                    password : "12345667890",
                    confirm_password: "12345667890",
                    address : "112 road"
                })
                expect(res.status).toBe(201);
        })
 })
})