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
let owner;
let car; 
let user;

const exec = () => {
    return request(server)
      .post('/api/v1/car')
      .set('Authorization', token)
      .send({  });
  };
  
describe('/api/v1/car/', () => {
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

        const {rows} = await Cars.save("zackaminu@yahoo.com", "Zack", "090864656673", "used", 1000, "honda", "hd009", "truck",  "image", owner);
        car = rows[0];
        
        carID = car.id;
        state = car.state;
        status = car.status;
        manufacturer = car.manufacturer;
        price = car.price;
        body_type = car.body_type;
        model = car.model;
        
    })
    afterEach(async () => {
        server.close();
        await User.delete();
        await Cars.delete();
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
        const id = car.id;
      const res = await request(server).get(`/api/v1/car/${id}`)
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

          it("should return 201 if we have a valid request", async () => {
            const res = await request(server).post('/api/v1/car')
               .set('Authorization', token)
               .send({
                seller_name : "Aminu",
                phone_no: "090864656673",
                state : "used",
                price : 4000,
                manufacturer : "Toyota",
                model : "TY34",
                body_type: "big"
                })
                expect(res.status).not.toBeNull;
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
          first_name : user.first_name,
          email : user.email,
          is_admin : true
        }, config.get('jwtPrivateKey'));
       const res = await request(server)
          .delete('/api/v1/car/' + id)
          .set('Authorization', tok)
          .send();
        expect(res.status).toBe(404);
      });
  
      it('should delete the car if input is valid', async () => {
       const id = car.id;
       let tok = jwt.sign({
        id: userID,
        first_name : user.first_name,
        email : user.email,
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
          .get('/api/v1/car?status=Available&min_price=10&max_price=2000')
          .set('Authorization', token);
          expect(res.status).toBe(200);
      })
  })

  describe('GET /car?status=available', () => {
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
        .get('/api/v1/car?status=Available')
        .set('Authorization', token);
        expect(res.status).toBe(200);
    })
  })

  describe('GET /car?body_type=truck', () => {
    let id;
    const exec = async () => {
      return await request(server)
        .get('/api/v1/car?body_type=truck')
        .set('Authorization', token);
    }
    
    it('should return 401 if user is not logged in', async () => {
      token = ''; 
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if query does not match", async () => {
      const res = await request(server)
        .get('/api/v1/car?body_type=tr')
        .set('Authorization', token);
        expect(res.status).toBe(404);
    })

    it("should return 200 if query matches", async () => {
      const res = await request(server)
        .get('/api/v1/car?body_type=truck')
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
  })

  describe('GET /car?status=available&state=used', () => {
    let id;
    const exec = async () => {
      return await request(server)
        .get('/api/v1/car?status=Available&state=used')
        .set('Authorization', token);
    }
    
    it('should return 401 if user is not logged in', async () => {
      token = ''; 
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if query does not match", async () => {
      const res = await request(server)
        .get('/api/v1/car?status=avaie&state=us')
        .set('Authorization', token);
        expect(res.status).toBe(404);
    })

    it("should return 200 if query matches", async () => {
      car.state = "used";
      const res = await request(server)
        .get('/api/v1/car?status=Available&state=used')
        .set('Authorization', token);
        expect(res.status).toBe(200);
    })
  })

  describe('GET /car?status=Available&manufacturer=honda', () => {
    let id;
    const exec = async () => {
      return await request(server)
        .get('/api/v1/car?status=Available&manufacturer=honda')
        .set('Authorization', token);
    }
    
    it('should return 401 if user is not logged in', async () => {
      token = ''; 
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if query does not match", async () => {
      const res = await request(server)
        .get('/api/v1/car?status=avaie&manufacturer=Toya')
        .set('Authorization', token);
        expect(res.status).toBe(404);
    })

    it("should return 200 if query matches", async () => {
      const res = await request(server)
        .get('/api/v1/car?status=Available&manufacturer=honda')
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
     const id = car.id;
      const res = await request(server)
        .patch(`/api/v1/car/${id}/price`)
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
        const id = car.id;
      const res = await request(server)
        .patch(`/api/v1/car/${id}/status`)
        .set('Authorization', token);
        expect(res.status).toBe(200);
    })
  })
})