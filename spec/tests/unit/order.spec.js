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
let car; 
let user;
let order;

const exec = () => {
    return request(server)
      .post('/api/v1/order')
      .set('Authorization', token)
      .send({  });
  };

describe('/api/v1/order', () => {
    beforeEach(async () => {
        server = require('../../../index');
        const {rows: use}  = await User.save('Zack', 'Aminu', 'zackaminu@yahoo.com', '112 road', 
        'image', '1234567', '1234567');
        user = use[0];
                userID = user.id;
                owner = user.id;
                token = jwt.sign({
                    id: userID,
                    first_name : "Zack",
                    email : "zackaminu@yahoo.com",
                    is_admin : false
                }, config.get('jwtPrivateKey'));
        const {rows} = await Cars.save("Zack", "090864656673", "used", 1000, "honda", "hd009", "truck", owner);
        car = rows[0];
        // instantiate the required fielsd herer..       
        carID = car.id;
        state = car.state;
        status = car.status;
        manufacturer = car.manufacturer;
        price = car.price;
        body_type = car.body_type;
        model = car.model;
        const {rows: orde} = await Orders.save(userID, carID, 500, 'Pending');        
        order = orde[0];
    })
    afterEach(async () => {
        server.close();
        await User.delete();
        await Cars.delete();
        await Orders.delete();
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
                car_id : car.id,
                amount : 600,
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
        const id = order.id;
        Orders.updateOrderStatus(id, "Accepted");
        const res = await request(server)
          .patch(`/api/v1/order/${id}/price`)
          .set('Authorization', token)
          .send({new_price : 300});    
          expect(res.status).toBe(400);
      })
    it("should return 200 if successful", async () => {
        const id = order.id;
        const res = await request(server)
        .patch(`/api/v1/order/${id}/price`)
        .set('Authorization', token)
        .send({new_price: 200});
         expect(res.status).toBe(200);
    })
  })
})