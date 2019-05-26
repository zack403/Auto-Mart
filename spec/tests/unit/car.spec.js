const request = require('supertest');
let {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
let {Cars} = require('../../../models/car');
const config = require('config');

let server;
let userID;
let carID;
let state;
let status;
let manufacturer;
let model;
let body_type;
let price;
let token;

const exec = () => {
    return request(server)
      .post('/api/v1/car')
      .set('Authorization', token)
      .send({  });
  };
  


describe('/api/v1/car/', () => {
    beforeEach(() => {
        server = require('../../../index');

        userID = User.length + 1;
        carID = Cars.length + 1;
        token = jwt.sign({
            id: userID,
            first_name : User.find(val => val.id === userID),
            email : User.find(el => el.id === userID)
        }, config.get('jwtPrivateKey'));

        state = Cars.find(c => c.state);
        status = Cars.find(s => s.status);
        manufacturer = Cars.find(m => m.manufacturer);
        price = Cars.find(p => p.price);
        body_type = Cars.find(b => b.body_type);
        model = Cars.find(m => m.model);

        User.push({
            id: userID,
            first_name : "afenifo",
            last_name : "okaraga",
            email :  "ok@yahoo.com",
            passowrd : 1234567
        })

        Cars.push({
            id: carID,
            owner : User.forEach(elem => elem.id),
            state: "used",
            status : "sold",
            manufacturer : "honda",
            body_type : "big",
            model : "hd56",
            price : 24
        })


    })
    afterEach(() => {
        server.close();
        User = [];
        Cars = [];
    });

    describe('GET /api/v1/car', () => {
        it('should return all cars', async () => {
        
          const res = await request(server).get('/api/v1/car')
          .set('Authorization', token);
          
          expect(res.status).toBe(200);
          expect(res.body).not.toBeNull;
        });
      });


    describe('POST /api/v1/car', () => {

        
        it('should return 401 if user is not logged in', async () => {
            token = '';
        
            const res = await exec();
        
            expect(res.status).toBe(401);
          });

        it('should return 400 if state is not provided', async () => {
            state = ''; 
            
            const res = await exec();
        
            expect(res.status).toBe(400);
          });
        
        it('should return 400 if status is not provided', async () => {
            status = ''; 
        
            const res = await exec();
        
            expect(res.status).toBe(400);
          });

          it("should return 200 if we have a valid request", async () => {
            const res = await request(server).post('/api/v1/car')
               .set('Authorization', token)
               .send({
                state : "new",
                status : "available",
                price : 35,
                manufacturer : "Toyota",
                model : "TY34",
                body_type: "big"
                })
            
                expect(res.status).toBe(200);

        })

         
        
    })
})