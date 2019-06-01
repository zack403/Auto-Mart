const request = require('supertest');
const jwt = require('jsonwebtoken');
let {User} = require('../../../models/user');
let {Cars} = require('../../../models/car');
const config = require('config');
let {Orders} = require('../../../models/order')

let server;
let userID;
let status;
let carID;
let token;
let buyer;
let amount;

const exec = () => {
    return request(server)
      .post('/api/v1/order')
      .set('Authorization', token)
      .send({  });
  };

describe('/api/v1/order', () => {
    beforeEach(() => {
        server = require('../../../index');

        userID = User.length + 1;
        carID = Cars.length + 1;
        token = jwt.sign({
            id: userID,
            first_name : User.find(val => val.id === userID),
            email : User.find(el => el.id === userID),
            is_admin : false
        }, config.get('jwtPrivateKey'));
        buyer = 1;
        amount = 36;

        Orders.push({
            id: Orders.length + 1,
            buyer: 1,
            car_id : 1,
            amount : 100,
            status :  "Pending"
        })

        User.push({
            id: userID,
            first_name : "afenifo",
            last_name : "okaraga",
            email :  "ok@yahoo.com",
            password : 1234567,
            is_admin : false
        })

        Cars.push({
            id: 1,
            owner : User.find(elem => elem.id),
            state: "used",
            status : "available",
            manufacturer : "honda",
            body_type : "big",
            model : "hd56",
            price : 24
        })
    

    })
    afterEach(() => {
        server.close();
    });

    describe('POST /api/v1/order', () => {

        
        it('should return 401 if user is not logged in', async () => {
            token = '';
        
            const res = await exec();
        
            expect(res.status).toBe(401);
          });

        it('should return 400 if buyer is not provided', async () => {
            buyer = ''; 
            
            const res = await exec();
        
            expect(res.status).toBe(400);
          });
        
        it('should return 400 if amount is not provided', async () => {
            amount = ''; 
        
            const res = await exec();
        
            expect(res.status).toBe(400);
          });

          it("should return 200 if we have a valid request", async () => {
            const res = await request(server).post('/api/v1/order')
               .set('Authorization', token)
               .send({
                car_id : 1,
                amount : 35,
                status : "Pending"
                })
            
                expect(res.status).toBe(200);
        })
    })

     
  describe('PATCH /api/v1/order/1/price', () => {

    let id;
    const exec = async () => {
      return await request(server)
        .patch('/api/v1/order/1/price')
        .set('Authorization', token);


    }
    
    it('should return 401 if user is not logged in', async () => {
      token = ''; 
      
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if order was not found", async () => {

      const res = await request(server)
        .patch('/api/v1/order/78/price')
        .set('Authorization', token)
        .send({new_price : 200});
        
        expect(res.status).toBe(404);

    })

    it("should return 400 if order is not pending", async () => {
        Orders.find(s => s.status = "Accepted");
        const res = await request(server)
          .patch('/api/v1/order/1/price')
          .set('Authorization', token)
          .send({new_price : 200});
          
          expect(res.status).toBe(400);
  
      })

    it("should return 200 if successful", async () => {
        Orders.find(s => s.status = "Pending");
      const res = await request(server)
        .patch('/api/v1/order/1/price')
        .set('Authorization', token)
        .send({new_price: 200});

         expect(res.status).toBe(200);

    })

  })

})