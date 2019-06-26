const request = require('supertest');
const jwt = require('jsonwebtoken');
let {User} = require('../../../models/user');
let {Cars} = require('../../../models/car');
const config = require('config');
let {Flags} = require('../../../models/flag')

let server,userID, reason, carID, token, description, user, car, report;

const exec = () => {
    return request(server)
      .post('/api/v1/flag')
      .set('Authorization', token)
      .send({  });
  };

describe('/api/v1/flag', () => {
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
        carID = car.id;
        const {rows: flag} = await Flags.save(userID, carID, "Damaged Car", 'Car not in good shape');        
        report = flag[0];
        // instantiate the required fielsd herer..       
        reason = report.reason;
        description = report.description;
    })
    afterEach(async () => {
        server.close();
        await User.delete();
        await Cars.delete();
        await Flags.delete();
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
                car_id : car.id,
                reason : "Stolen",
                description : "Car does not exist"
                })
                expect(res.status).toBe(200);
        })
    })
})