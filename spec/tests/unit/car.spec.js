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
            email : User.find(el => el.id === userID),
            is_admin : false
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
        // User = [];
        // Cars = [];
    });

    describe('GET /api/v1/car', () => {

        it('should return 401 if no token is provided', async () => {
        
            const res = await request(server).get('/api/v1/car')
            
            expect(res.status).toBe(401);
          });

        it('should return all cars', async () => {
        
          const res = await request(server).get('/api/v1/car')
          .set('Authorization', token);
          
          expect(res.status).toBe(200);
          expect(res.body).not.toBeNull;
        });
      });

      
  describe('GET /:car_id', () => {
    it('should return 401 if no token is provided', async () => {
        
        const res = await request(server).get('/api/v1/car/1')
        
        expect(res.status).toBe(401);
      });

    it('should return 404 if no car with the given id exists', async () => {
      const res = await request(server).get('/api/v1/car/10')
      .set('Authorization', token);

      expect(res.status).toBe(404);
    });


    it('should return a car if valid id is passed', async () => {
    
      const res = await request(server).get('/api/v1/car/1')
      .set('Authorization', token);

        expect(res.status).toBe(200);
        expect(res.body).not.toBeNull();     
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
                state : "used",
                status : "available",
                price : 35,
                manufacturer : "Toyota",
                model : "TY34",
                body_type: "big"
                })
            
                expect(res.status).toBe(200);
        })
    })

    describe('DELETE Car/:id', () => {
      
      let id;
      const exec = async () => {
        return await request(server)
          .delete('/api/v1/car/' + id)
          .set('Authorization', token)
          .send();
      }
  
      it('should return 401 if user is not logged in', async () => {
        token = ''; 
        
        const res = await exec();
  
        expect(res.status).toBe(401);
      });
  
      it('should return 403 if the user is not an admin', async () => {
        
        const res = await exec();
        expect(res.status).toBe(403);

      });
  
      it('should return 404 if id is invalid', async () => {
        id = 50; 
        let tok = jwt.sign({
          id: userID,
          first_name : User.find(val => val.id === userID),
          email : User.find(el => el.id === userID),
          is_admin : true
        }, config.get('jwtPrivateKey'));

       const res = await request(server)
          .delete('/api/v1/car/' + id)
          .set('Authorization', tok)
          .send();
        
        expect(res.status).toBe(404);
      });
  
      
      it('should delete the car if input is valid', async () => {
       id = 1;
       let tok = jwt.sign({
        id: userID,
        first_name : User.find(val => val.id === userID),
        email : User.find(el => el.id === userID),
        is_admin : true
      }, config.get('jwtPrivateKey'));
       const res = await request(server)
       .delete('/api/v1/car/' + id)
       .set('Authorization', tok)
       .send();
  
  
        expect(res.status).toBe(200);
      });
  
    }); 

    describe('GET /car?status=available&min_price=xxx&max_price=xxx', () => {

      let id;
      const exec = async () => {
        return await request(server)
          .get('/api/v1/car?status=available&min_price=2&max_price=24')
          .set('Authorization', token);


      }
      
      it('should return 401 if user is not logged in', async () => {
        token = ''; 
        
        const res = await exec();
  
        expect(res.status).toBe(401);
      });

      it("should return 404 if query does not match", async () => {

        const res = await request(server)
          .get('/api/v1/car?status=avaie&min_price=28&max_price=1')
          .set('Authorization', token);

          expect(res.status).toBe(404);

      })

      it("should return 200 if query matches", async () => {

        const res = await request(server)
          .get('/api/v1/car?status=available&min_price=10&max_price=50')
          .set('Authorization', token);

          expect(res.status).toBe(200);

      })

  })

  describe('GET /car?status=available&state=new', () => {

    let id;
    const exec = async () => {
      return await request(server)
        .get('/api/v1/car?status=available')
        .set('Authorization', token);


    }
    
    it('should return 401 if user is not logged in', async () => {
      token = ''; 
      
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if query does not match", async () => {

      const res = await request(server)
        .get('/api/v1/car?status=avaie')
        .set('Authorization', token);

        expect(res.status).toBe(404);

    })

    it("should return 200 if query matches", async () => {

      const res = await request(server)
        .get('/api/v1/car?status=available')
        .set('Authorization', token);

        expect(res.status).toBe(200);

    })

  })

  describe('GET /car?status=available&state=new', () => {

    let id;
    const exec = async () => {
      return await request(server)
        .get('/api/v1/car?status=available&state=new')
        .set('Authorization', token);


    }
    
    it('should return 401 if user is not logged in', async () => {
      token = ''; 
      
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if query does not match", async () => {

      const res = await request(server)
        .get('/api/v1/car?status=avaie&state=nw')
        .set('Authorization', token);

        expect(res.status).toBe(404);

    })

    it("should return 200 if query matches", async () => {
      Cars.find(c => c.state = "new");
      const res = await request(server)
        .get('/api/v1/car?status=available&state=new')
        .set('Authorization', token);

        expect(res.status).toBe(200);

    })

  })

  
  describe('PATCH /api/v1/car/1/price', () => {

    let id;
    const exec = async () => {
      return await request(server)
        .patch('/api/v1/car/1/price')
        .set('Authorization', token);


    }
    
    it('should return 401 if user is not logged in', async () => {
      token = ''; 
      
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if car was not found", async () => {

      const res = await request(server)
        .patch('/api/v1/car/78/price')
        .set('Authorization', token)
        .send({price : 200});

        expect(res.status).toBe(404);

    })

    it("should return 200 if successful", async () => {

      const res = await request(server)
        .patch('/api/v1/car/1/price')
        .set('Authorization', token)
        .send({price: 200});

        expect(res.status).toBe(200);

    })

  })

  describe('PATCH /api/v1/car/1/status', () => {

    let id;
    const exec = async () => {
      return await request(server)
        .patch('/api/v1/car/1/status')
        .set('Authorization', token);


    }
    
    it('should return 401 if user is not logged in', async () => {
      token = ''; 
      
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if car was not found", async () => {

      const res = await request(server)
        .patch('/api/v1/car/78/status')
        .set('Authorization', token);

        expect(res.status).toBe(404);

    })

    it("should return 200 if successful", async () => {

      const res = await request(server)
        .patch('/api/v1/car/1/status')
        .set('Authorization', token);
       

        expect(res.status).toBe(200);

    })

  })

})