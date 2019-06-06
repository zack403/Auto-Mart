const request = require('supertest');
const jwt = require('jsonwebtoken');
let {User} = require('../../../models/user');
let {Cars} = require('../../../models/car');
const config = require('config');
let {Flags} = require('../../../models/flag')

let server;
let userID;
let reason;
let carID;
let token;
let description;

const exec = () => {
    return request(server)
      .post('/api/v1/flag')
      .set('Authorization', token)
      .send({  });
  };

describe('/api/v1/flag', () => {
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

        Flags.push({
            id: Flags.length + 1,
            car_id : 1,
            reason : "stolen",
            description :  "stolen"
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

    describe('POST /api/v1/flag', () => {

        
        it('should return 401 if user is not logged in', async () => {
            token = '';
        
            const res = await exec();
        
            expect(res.status).toBe(401);
          });

        it('should return 400 if reason is not provided', async () => {
            reason = ''; 
            
            const res = await exec();
        
            expect(res.status).toBe(400);
          });
        
        it('should return 400 if description is not provided', async () => {
            description = ''; 
        
            const res = await exec();
        
            expect(res.status).toBe(400);
          });

          it("should return 200 if we have a valid request", async () => {
            const res = await request(server).post('/api/v1/flag')
               .set('Authorization', token)
               .send({
                car_id : 1,
                reason : "stolen",
                description : "stolen"
                })
            
                expect(res.status).toBe(200);
        })
    })


})